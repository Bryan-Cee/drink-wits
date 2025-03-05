'use client';

import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaPlus, FaSignInAlt, FaUser } from 'react-icons/fa';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }
    
    try {
      setIsJoining(true);
      
      // Validate the join code (you might want to validate this on the server)
      if (joinCode.length !== 6) {
        toast.error('Invalid join code format');
        return;
      }
      
      // Navigate to the game page
      router.push(`/game/join/${joinCode}`);
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-12 pb-24">
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Drink Wits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The ultimate social card game - Create or join a game to get started!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Create Game Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                <FaPlus className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Game</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Start a new game session and invite your friends
              </p>
            </div>
            <Link
              href="/game/create"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create New Game
            </Link>
          </div>

          {/* Join Game Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <FaSignInAlt className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Join Game</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Join an existing game with a 6-digit code
              </p>
            </div>
            <form onSubmit={handleJoinGame} className="space-y-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </form>
          </div>
        </div>

        {/* User Status */}
        <div className="mt-12 text-center">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : user ? (
            <div className="flex items-center justify-center space-x-2">
              <FaUser className="text-indigo-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Signed in as: <strong>{user.email}</strong>
              </span>
              <Link
                href="/favorites"
                className="ml-4 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Favorites
              </Link>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign in to save favorites
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
