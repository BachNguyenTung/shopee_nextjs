import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { pusherClient } from '@/configs/pusher';

export const useWebSocket = (productId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const queryClient = useQueryClient();

  // Initialize connection immediately
  useEffect(() => {
    if (!productId) return;

    const setupPusherConnection = () => {
      try {
        // Ensure previous connection is cleaned up
        if (channelRef.current) {
          channelRef.current.unbind_all();
          pusherClient.unsubscribe('price-updates');
        }

        // Create new connection
        channelRef.current = pusherClient.subscribe('price-updates');

        // Connection status handlers
        pusherClient.connection.bind('connected', () => {
          console.log('Pusher connected');
          setIsConnected(true);
        });

        pusherClient.connection.bind('disconnected', () => {
          console.log('Pusher disconnected');
          setIsConnected(false);
        });

        // Price update handler
        const handlePriceUpdate = (data: { productId: string; newPrice: number }) => {
          if (data.productId === productId) {
            queryClient.setQueryData(['product', productId], (oldData: any) => ({
              ...oldData,
              price: data.newPrice,
            }));
          }
        };

        channelRef.current.bind('product-price-updated', handlePriceUpdate);

        // Connect if not already connected
        if (pusherClient.connection.state !== 'connected') {
          pusherClient.connect();
        }
      } catch (error) {
        console.error('Pusher connection error:', error);
        setIsConnected(false);
      }
    };

    setupPusherConnection();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherClient.unsubscribe('price-updates');
      }
      pusherClient.connection.unbind_all();
      setIsConnected(false);
    };
  }, [productId, queryClient]);

  return {
    isConnected
  };
};
