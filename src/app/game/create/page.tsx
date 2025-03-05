'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateGamePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [gameName, setGameName] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setErrorDetails(null);
    
    if (!user) {
      toast.error('You must be logged in to create a game');
      router.push('/auth/login?returnUrl=/game/create');
      return;
    }
    
    if (!gameName.trim()) {
      toast.error('Please enter a game name');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Call your API to create a new game
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: gameName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to create game';
        console.error('Error response:', { status: response.status, data });
        setErrorDetails(errorMessage);
        throw new Error(errorMessage);
      }
      
      toast.success('Game created successfully!');
      
      // Redirect to the game room
      router.push(`/game/${data.gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create game');
    } finally {
      setIsCreating(false);
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
      
      <h1 className="text-2xl font-bold mb-6 text-center">Create a New Game</h1>
      
      <form onSubmit={handleCreateGame} className="space-y-4">
        <div>
          <label htmlFor="gameName" className="block text-sm font-medium mb-1">
            Game Name
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter a name for your game"
            required
          />
        </div>
        
        {errorDetails && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
            <p className="font-bold">Error details:</p>
            <p>{errorDetails}</p>
            <p className="mt-2 text-xs">
              Please ensure your database is set up correctly with the required tables.
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Game'}
        </button>
      </form>
    </div>
  );
}
