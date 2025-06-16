import { useState } from 'react';
import { pusherClient } from '@/configs/pusher';

export const useWebSocketAdmin = (productId: string) => {
  const [isConnected, setIsConnected] = useState(false);

  // Function to trigger price updates
  const updatePrice = async (newPrice: number) => {
    try {
      await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          newPrice,
        }),
      });
      return true;
    } catch (error) {
      console.error('Error updating price:', error);
      return false;
    }
  };

  // Connect to Pusher when the hook is initialized
  if (!isConnected) {
    const channel = pusherClient.subscribe('price-updates');
    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });
  }

  return {
    isConnected,
    updatePrice,
  };
};
