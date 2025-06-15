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

    // Your original price-update handler
    socket.on('price-update', (data: { productId: string; newPrice: number }) => {

      //send price update to all connected clients except the sender
      socket.broadcast.emit('product-price-updated', data);
      console.log(`📢 Broadcasted to ${io.engine.clientsCount} clients`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`💥 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  res.end();
};

export default SocketHandler;
