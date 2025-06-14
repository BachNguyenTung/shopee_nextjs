import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

// Global socket instance
let globalSocket: Socket | null = null;
let refCount = 0; // Track active component instances

export const useWebSocket = (productId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(`Initializing WebSocket for product: ${productId}`);

    const initSocket = async () => {
      if (!globalSocket) {
        console.log('Creating new socket connection');
        await fetch('/api/socket');

        globalSocket = io({
          path: '/api/socketio',
          addTrailingSlash: false,
        });

        globalSocket.on('connect', () => {
          console.log('WebSocket connected ID:', globalSocket?.id);
        });

        globalSocket.on('disconnect', () => {
          console.log('WebSocket disconnected');
        });
      }
    };

    initSocket();
    refCount++;

    // Event handler
    const handlePriceUpdate = (data: { productId: string; newPrice: number }) => {
      console.log('Received price update:', data);
      if (data.productId === productId) {
        queryClient.setQueryData(['product', productId], (oldData: any) => ({
          ...oldData,
          price: data.newPrice,
        }));
      }
    };

    // Attach listener
    globalSocket?.on('product-price-updated', handlePriceUpdate);
    console.log(`Listener attached for product ${productId}`);

    return () => {
      console.log(`Cleaning up WebSocket for product: ${productId}`);
      globalSocket?.off('product-price-updated', handlePriceUpdate);
      refCount--;

      // Disconnect only when last component unmounts
      if (refCount === 0 && globalSocket) {
        console.log('Disconnecting global socket');
        globalSocket.disconnect();
        globalSocket = null;
      }
    };
  }, [productId, queryClient]);

  return {
    socket: globalSocket,
    isConnected: globalSocket?.connected ?? false
  };
};
