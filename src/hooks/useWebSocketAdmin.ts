import { useCallback, useEffect, useRef, useState } from 'react';
import { getPusherClient } from '@/configs/pusher';

export const useWebSocketAdmin = (productId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const connectionAttempts = useRef(0);

  // Function to trigger price updates
  const updatePrice = useCallback(async (newPrice: number) => {
    try {
      const response = await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          newPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      return true;
    } catch (error) {
      console.error('Error updating price:', error);
      return false;
    }
  }, [productId]);

  // Initialize connection
  useEffect(() => {
    const client = getPusherClient();

    const setupPusherConnection = () => {
      if (!productId) {
        if (connectionAttempts.current < 3) {
          connectionAttempts.current++;
          const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts.current), 5000);
          console.log(`Admin: Retrying connection in ${retryDelay}ms (attempt ${connectionAttempts.current})`);
          setTimeout(setupPusherConnection, retryDelay);
        }
        return;
      }

      try {
        // Cleanup existing connection
        if (channelRef.current) {
          channelRef.current.unbind_all();
          client.unsubscribe('price-updates');
        }

        // Create new connection
        channelRef.current = client.subscribe('price-updates');

        // Connection status handlers
        client.connection.bind('connected', () => {
          console.log('Admin Pusher connected');
          setIsConnected(true);
        });

        client.connection.bind('disconnected', () => {
          console.log('Admin Pusher disconnected');
          setIsConnected(false);
        });

        // Subscribe success handler
        channelRef.current.bind('pusher:subscription_succeeded', () => {
          setIsConnected(true);
        });

        // Connect if not already connected
        if (client.connection.state !== 'connected') {
          client.connect();
        }
      } catch (error) {
        console.error('Admin Pusher connection error:', error);
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

      // Clean up all Pusher connection bindings
      client.connection.unbind('connected');
      client.connection.unbind('disconnected');
      client.connection.unbind_all();

      setIsConnected(false);
    };
  }, [productId]);

  return {
    isConnected,
    updatePrice,
  };
};
