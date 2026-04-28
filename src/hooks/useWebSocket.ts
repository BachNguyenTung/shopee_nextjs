import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPusherClient } from '@/configs/pusher';

export const useWebSocket = (productId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const connectionAttempts = useRef(0);
  const queryClient = useQueryClient();

  // Initialize connection immediately
  useEffect(() => {
    const client = getPusherClient();
    if (!client) return;

    const handleConnected = () => {
      console.log('Pusher connected');
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      console.log('Pusher disconnected');
      setIsConnected(false);
    };

    const setupPusherConnection = () => {
      if (!productId) {
        if (connectionAttempts.current < 3) {
          connectionAttempts.current++;
          const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts.current), 5000);
          console.log(`Retrying connection in ${retryDelay}ms (attempt ${connectionAttempts.current})`);
          setTimeout(setupPusherConnection, retryDelay);
        }
        return;
      }

      try {
        // Ensure previous connection is cleaned up
        if (channelRef.current) {
          channelRef.current.unbind_all();
          client.unsubscribe('price-updates');
        }

        // Create new connection
        channelRef.current = client.subscribe('price-updates');

        // Connection status handlers
        client.connection.bind('connected', handleConnected);
        client.connection.bind('disconnected', handleDisconnected);

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
        channelRef.current.bind('pusher:subscription_succeeded', () => {
          setIsConnected(true);
        });

        // Connect if not already connected
        if (client.connection.state !== 'connected') {
          client.connect();
        } else {
          setIsConnected(true);
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
        client.unsubscribe('price-updates');
      }

      // Unbind only this hook's handlers
      client.connection.unbind('connected', handleConnected);
      client.connection.unbind('disconnected', handleDisconnected);

      setIsConnected(false);
    };
  }, [productId, queryClient]);

  return {
    isConnected
  };
};
