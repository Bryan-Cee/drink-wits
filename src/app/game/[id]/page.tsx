'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCopy, FaUsers, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  name: string;
  join_code: string;
  created_by: string;
  status: string;
  created_at: string;
}

interface Player {
  id: string;
  name: string;
  is_anonymous: boolean;
  user_id: string | null;
  status: string;
  score: number;
}

export default function GamePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  
  const gameId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!gameId) {
      setError('Invalid game ID');
      setIsLoading(false);
      return;
    }
    
    async function fetchGameData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch game data
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
        
        if (gameError) {
          throw new Error(gameError.message);
        }
        
        if (!gameData) {
          throw new Error('Game not found');
        }
        
        setGame(gameData as Game);
        
        // Check if current user is the game owner
        if (user && user.id === gameData.created_by) {
          setIsOwner(true);
        }
        
        // Fetch players
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameId)
          .order('joined_at', { ascending: true });
        
        if (playersError) {
          console.error('Error fetching players:', playersError);
        } else {
          setPlayers(playersData as Player[]);
        }
        
      } catch (err) {
        console.error('Error loading game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGameData();
    
    // Set up real-time subscription for players
    const playersSubscription = supabase
      .channel(`game:${gameId}:players`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPlayers(current => [...current, payload.new as Player]);
        } else if (payload.eventType === 'UPDATE') {
          setPlayers(current => 
            current.map(player => 
              player.id === payload.new.id ? payload.new as Player : player
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setPlayers(current => 
            current.filter(player => player.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    return () => {
      // Clean up subscription
      supabase.removeChannel(playersSubscription);
    };
  }, [gameId, user, supabase]);

  const copyJoinCode = () => {
    if (!game) return;
    
    navigator.clipboard.writeText(game.join_code)
      .then(() => toast.success('Join code copied!'))
      .catch(() => toast.error('Failed to copy join code'));
  };

  const startGame = async () => {
    if (!game || !isOwner) return;
    
    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'active' })
        .eq('id', game.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Game started!');
      setGame({ ...game, status: 'active' });
      
    } catch (err) {
      console.error('Error starting game:', err);
      toast.error('Failed to start game');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-indigo-600 text-3xl mr-3" />
        <span>Loading game...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Link href="/" className="text-indigo-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg mb-6">
          <p>Game not found or has been deleted.</p>
        </div>
        <Link href="/" className="text-indigo-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{game.name}</h1>
        
        <div className="flex items-center mt-4 mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-md flex items-center">
            <span className="font-mono mr-2">Join Code: {game.join_code}</span>
            <button 
              onClick={copyJoinCode}
              className="text-indigo-600 hover:text-indigo-800"
              title="Copy join code"
            >
              <FaCopy />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FaUsers className="mr-2 text-indigo-500" />
            <h2 className="text-lg font-semibold">Players ({players.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {players.map(player => (
              <div 
                key={player.id} 
                className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 flex items-center"
              >
                <div className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: player.status === 'active' ? '#10B981' : '#6B7280' }} 
                />
                <span>{player.name}</span>
                {player.user_id === game.created_by && (
                  <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {isOwner && game.status === 'waiting' && players.length > 0 && (
          <div className="mt-4">
            <button
              onClick={startGame}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Start Game
            </button>
          </div>
        )}
        
        {game.status === 'active' && (
          <div className="mt-6">
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Game in Progress</h3>
              <p>The game is currently active and cards are being displayed.</p>
              
              {/* Placeholder for game content - this would be implemented separately */}
              <div className="mt-4 p-4 border border-green-200 dark:border-green-800 rounded-md bg-white dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Game view content will appear here
                </p>
              </div>
            </div>
          </div>
        )}
        
        {game.status === 'completed' && (
          <div className="mt-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Game Completed</h3>
              <p>This game has ended. Thanks for playing!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 