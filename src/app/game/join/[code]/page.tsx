'use client';

import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

export default function JoinGamePage() {
  const params = useParams();
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameExists, setGameExists] = useState(false);
  const [gameName, setGameName] = useState('');
  const supabase = createClient();
  
  const joinCode = typeof params.code === 'string' ? params.code : '';

  useEffect(() => {
    // Validate the join code
    const checkGameExists = async () => {
      try {
        setIsLoading(true);
        
        if (!joinCode) {
          return;
        }
        
        const { data, error } = await supabase
          .from('games')
          .select('id, name, status')
          .eq('join_code', joinCode)
          .single();
        
        if (error) {
          console.error('Error checking game:', error);
          return;
        }
        
        if (data && data.status !== 'completed') {
          setGameExists(true);
          setGameName(data.name);
        }
      } catch (error) {
        console.error('Error checking game:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkGameExists();
  }, [joinCode]);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    try {
      setIsJoining(true);
      
      // Call your API to join the game
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          joinCode,
          playerName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join game');
      }
      
      toast.success('Successfully joined game!');
      
      // Redirect to the game room
      router.push(`/game/${data.gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-center">Join Game</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
        </div>
      ) : !gameExists ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Game not found or has already ended. Please check the join code.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Joining: {gameName}
            </h2>
            <div className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-md">
              Code: {joinCode}
            </div>
          </div>
          
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isJoining}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 