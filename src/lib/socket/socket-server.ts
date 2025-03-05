import type { Server as HTTPServer } from 'node:http';
import type { Socket as NetSocket } from 'node:net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const initSocketServer = (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Store the socket server instance
    res.socket.server.io = io;

    // Game rooms mapping: gameId -> players
    const gameRooms = new Map<string, Set<string>>();

    // Game card index tracking
    const gameCardIndices = new Map<string, number>();

    io.on('connection', (socket) => {
      const { gameId, userName } = socket.handshake.query;

      if (!gameId || !userName || typeof gameId !== 'string' || typeof userName !== 'string') {
        console.error('Missing gameId or userName in connection');
        socket.disconnect();
        return;
      }

      console.log(`Player ${userName} connected to game ${gameId}`);

      // Join the game room
      socket.on('join-game', ({ gameId, userName }) => {
        if (typeof gameId !== 'string' || typeof userName !== 'string') return;

        socket.join(gameId);

        // Add player to game room
        if (!gameRooms.has(gameId)) {
          gameRooms.set(gameId, new Set<string>());
          gameCardIndices.set(gameId, 0);
        }

        const players = gameRooms.get(gameId);
        if (players) {
          players.add(userName);

          // Notify all users in the room about the new player
          io.to(gameId).emit('player-joined', { playerName: userName });

          // Send current card index to the new player
          const currentIndex = gameCardIndices.get(gameId) || 0;
          socket.emit('card-changed', { index: currentIndex });

          // Send list of players to the new player
          socket.emit('player-list', { players: Array.from(players) });
        }
      });

      // Handle card changes
      socket.on('change-card', ({ gameId, index }) => {
        if (typeof gameId !== 'string' || typeof index !== 'number') return;

        console.log(`Card changed to index ${index} in game ${gameId}`);

        // Update card index for the game
        gameCardIndices.set(gameId, index);

        // Broadcast to all other players
        socket.to(gameId).emit('card-changed', { index });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Player ${userName} disconnected from game ${gameId}`);

        // Remove player from game room
        const players = gameRooms.get(gameId);
        if (players) {
          players.delete(userName);

          // Notify others
          io.to(gameId).emit('player-left', { playerName: userName });

          // Clean up empty game rooms
          if (players.size === 0) {
            gameRooms.delete(gameId);
            gameCardIndices.delete(gameId);
          }
        }
      });
    });
  }

  return res.socket.server.io;
};
