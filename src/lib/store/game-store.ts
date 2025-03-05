import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Card {
  id: string;
  type: 'dare' | 'question';
  content: string;
  isFavorite: boolean;
}

interface GameState {
  // Game data
  gameId: string | null;
  currentCardIndex: number;
  players: string[];
  cards: Card[];
  
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;
  
  // Actions
  initializeSocket: (gameId: string, userName: string) => void;
  disconnectSocket: () => void;
  syncCardIndex: (newIndex: number) => void;
  setCards: (cards: Card[]) => void;
  updateCardIndex: (index: number) => void;
  addPlayer: (playerName: string) => void;
  removePlayer: (playerName: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  gameId: null,
  currentCardIndex: 0,
  players: [],
  cards: [],
  socket: null,
  isConnected: false,
  
  // Initialize socket connection
  initializeSocket: (gameId, userName) => {
    // Close existing connection if any
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
    }
    
    // Create new socket connection
    const socketUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}` 
      : (process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    
    const socket = io(socketUrl, {
      path: '/api/socket',
      autoConnect: true,
      query: {
        gameId,
        userName,
      },
    });
    
    // Setup event listeners
    socket.on('connect', () => {
      console.log('Connected to game server');
      set({ isConnected: true });
      
      // Join the game room
      socket.emit('join-game', { gameId, userName });
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
      set({ isConnected: false });
    });
    
    socket.on('card-changed', (data: { index: number }) => {
      console.log('Card index changed:', data.index);
      set({ currentCardIndex: data.index });
    });
    
    socket.on('player-joined', (data: { playerName: string }) => {
      console.log('Player joined:', data.playerName);
      set(state => ({
        players: [...state.players, data.playerName],
      }));
    });
    
    socket.on('player-left', (data: { playerName: string }) => {
      console.log('Player left:', data.playerName);
      set(state => ({
        players: state.players.filter(name => name !== data.playerName),
      }));
    });
    
    // Update state
    set({
      socket,
      gameId,
      isConnected: socket.connected,
    });
  },
  
  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
  
  // Sync card index changes to server
  syncCardIndex: (newIndex) => {
    const { socket, gameId } = get();
    if (socket && gameId) {
      socket.emit('change-card', { gameId, index: newIndex });
      set({ currentCardIndex: newIndex });
    }
  },
  
  // Set cards
  setCards: (cards) => {
    set({ cards });
  },
  
  // Update card index locally
  updateCardIndex: (index) => {
    set({ currentCardIndex: index });
  },
  
  // Add player
  addPlayer: (playerName) => {
    set(state => ({
      players: [...state.players, playerName],
    }));
  },
  
  // Remove player
  removePlayer: (playerName) => {
    set(state => ({
      players: state.players.filter(name => name !== playerName),
    }));
  },
})); 