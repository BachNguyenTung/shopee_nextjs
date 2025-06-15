import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export const useWebSocket = (productId: string) => {
  const queryClient = useQueryClient();

  // Initialize socket connection
  useEffect(() => {
    const initSocket = async () => {
      // call api to create socketIO server if not already running
      await fetch('/api/socket');

      // Socket.IO client create connects to /api/socketio
      socket = io({
        path: '/api/socketio',
        addTrailingSlash: false,
      });

      //Listening to event
      socket.on('product-price-updated', handlePriceUpdate);
    };

    if (!socket) {
      initSocket();
    }

    // Listen for price updates for this specific product
    function handlePriceUpdate(data: { productId: string; newPrice: number }) {
      if (data.productId === productId) {
        // Update React Query cache with new price
        queryClient.setQueryData(['product', productId], (oldData: any) => ({
          ...oldData,
          price: data.newPrice,
        }));
      }
    };


    return () => {
      socket?.off('product-price-updated', handlePriceUpdate);
      // Only disconnect if this is the last component using the socket
      if (socket && document.querySelectorAll('[data-product-id]').length === 1) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [productId, queryClient]);

  return {
    isConnected: socket?.connected ?? false,
  };
};
