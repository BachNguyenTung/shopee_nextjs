import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  // If socket server is already running, skip initialization
  if (res.socket.server.io) {
    console.log('Socket.IO server already running');
    res.end();
    return;
  }

  // Initialize Socket.IO server
  const io = new IOServer(res.socket.server, {
    path: '/api/socketio', // This creates a WebSocket endpoint at /api/socketio
    addTrailingSlash: false,
  });

  // Store io instance on server
  res.socket.server.io = io;

  // Handle WebSocket events
  io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
    console.log(`   Total clients: ${io.engine.clientsCount}`);

    // Diagnostic handler (temporary)
    socket.onAny((event, ...args) => {
      console.log(`📨 Received event: ${event}`, args);
    });

    // Your original price-update handler
    socket.on('price-update', (data: { productId: string; newPrice: number }) => {

      // Additional diagnostic log
      console.log(data);

      // socket.broadcast.emit('product-price-updated', data);
      io.emit('product-price-updated', data);  // Broadcast to ALL connected clients
    });

    socket.on('disconnect', (reason) => {
      console.log(`💥 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('Socket.IO server initialized at /api/socketio');
  res.end();
};

export default SocketHandler;
