import { NextApiRequest, NextApiResponse } from 'next';
import { initSocketServer } from '@/lib/socket/socket-server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize the Socket.IO server
  initSocketServer(req, res as any);
  
  // Return a 200 response to acknowledge the request
  res.status(200).json({ success: true });
}

// Set body parser configs
export const config = {
  api: {
    bodyParser: false,
  },
}; 