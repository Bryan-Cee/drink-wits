'use client';

import JoinGameForm from '@/components/game/JoinGameForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

export default function JoinGamePage() {
  const router = useRouter();

  const handleJoinGame = async (joinCode: string, playerName: string) => {
    try {
      // In a real app, we would make an API call to join the game
      // For now, we'll just simulate it

      // Wait a bit to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the game page
      router.push(`/game/play?code=${joinCode}&player=${encodeURIComponent(playerName)}`);
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game');
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

      <JoinGameForm onJoinGame={handleJoinGame} />
    </div>
  );
}
