import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { pusherClient } from '@/configs/pusher';

export const useWebSocket = (productId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to the price-updates channel
    const channel = pusherClient.subscribe('price-updates');
    setIsConnected(true);

    // Listen for price update events
    const handlePriceUpdate = (data: { productId: string; newPrice: number }) => {
      if (data.productId === productId) {
        queryClient.setQueryData(['product', productId], (oldData: any) => ({
          ...oldData,
          price: data.newPrice,
        }));
      }
    };

    channel.bind('product-price-updated', handlePriceUpdate);

    return () => {
      channel.unbind('product-price-updated', handlePriceUpdate);
      pusherClient.unsubscribe('price-updates');
      setIsConnected(false);
    };
  }, [productId, queryClient]);

  return {
    isConnected,
  };
};
