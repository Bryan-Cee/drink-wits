import { initSocketServer } from '@/lib/socket/socket-server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'node:http';
import type { Socket as NetSocket } from 'node:net';
import type { Server } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize the Socket.IO server
  initSocketServer(req, res as NextApiResponseWithSocket);

  // Return a 200 response to acknowledge the request
  res.status(200).json({ success: true });
}

// Set body parser configs
export const config = {
  api: {
    bodyParser: false,
  },
};
