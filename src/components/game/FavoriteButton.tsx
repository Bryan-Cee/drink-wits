'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  cardId: string;
  gameId?: string;
  initialIsFavorite?: boolean;
  className?: string;
}

export default function FavoriteButton({
  cardId,
  gameId,
  initialIsFavorite = false,
  className = '',
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          gameId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to favorite card');
      }
      
      const data = await response.json();
      
      // Only update the UI if the user is logged in
      // If not, the middleware will handle redirecting to login
      if (user) {
        setIsFavorite(true);
        toast.success('Card added to favorites!');
      }
      
    } catch (error) {
      console.error('Error favoriting card:', error);
      if (user) {
        toast.error('Failed to favorite card');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`transition-colors duration-200 focus:outline-none ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart className="w-5 h-5 text-red-500" />
      ) : (
        <FaRegHeart className="w-5 h-5 text-gray-500 hover:text-red-500" />
      )}
    </button>
  );
} 