'use client';

import CreateGameForm from '@/components/game/CreateGameForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateGamePage() {
  const _router = useRouter();

  // In a real app, we would check authentication status here
  const isLoggedIn = false;

  const handleCreateGame = async (gameName: string, players: string[]) => {
    if (!isLoggedIn) {
      // For demo purposes, we'll just mock this
      const randomId = Math.random().toString(36).substring(2, 8);
      const demoJoinCode = randomId.toUpperCase();

      // In a real app, we would make an API call to create the game
      // For now, we'll just return a fake join code

      // Wait a bit to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { joinCode: demoJoinCode };
    }

    // If logged in, we would make a real API call
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'demo-user-id', // This would come from authentication
        },
        body: JSON.stringify({ name: gameName, players }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      <CreateGameForm onCreateGame={handleCreateGame} />
    </div>
  );
}
