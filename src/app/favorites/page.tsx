'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FavoriteCard {
  id: string;
  card_id: string;
  user_id: string;
  created_at: string;
  card: {
    id: string;
    question: string;
    category: string;
  };
}

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!isLoading && user) {
      fetchFavorites();
    }
  }, [user, isLoading]);

  const fetchFavorites = async () => {
    try {
      setIsFetching(true);
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          card_id,
          user_id,
          created_at,
          card:cards(id, question, category)
        `)
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFavorites(data as FavoriteCard[]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
      
      // Update local state
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="mb-4">You need to be logged in to view your favorites.</p>
        <Link
          href="/auth/login?returnUrl=/favorites"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold ml-6">Your Favorite Cards</h1>
        </div>
      </div>

      {isFetching ? (
        <div className="text-center py-8">
          <p>Loading your favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You haven't favorited any cards yet.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md"
          >
            Play a Game to Find Cards
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(favorite.created_at)}
              </div>
              <div className="mb-2 inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-md text-xs">
                {favorite.card.category}
              </div>
              <p className="text-gray-800 dark:text-white font-medium">
                {favorite.card.question}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 