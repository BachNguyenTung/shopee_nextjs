import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useWebSocketAmin = (productId: string) => {

  // Initialize socket connection
  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket');

      socket = io({
        path: '/api/socketio',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    };

    if (!socket) {
      initSocket();
    }


    return () => {
      // Only disconnect if this is the last component using the socket
      if (socket && document.querySelectorAll('[data-product-admin-id]').length === 1) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [productId]);

  return {
    socket,
    isConnected: socket?.connected ?? false
  };
};
