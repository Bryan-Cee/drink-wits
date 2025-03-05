'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaSignOutAlt, FaUser } from 'react-icons/fa';

// Sample favorites for demo
const SAMPLE_FAVORITES = [
  {
    id: '1',
    type: 'dare',
    content: 'Take a shot or do 10 push-ups',
    favoriteDate: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'question',
    content: "What's your go-to drunk food?",
    favoriteDate: new Date().toISOString(),
  },
];

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState(SAMPLE_FAVORITES);

  // In a real app, we would check authentication status
  useEffect(() => {
    // Simulate checking auth status
    const checkAuth = async () => {
      // In a real app, we would check if the user is logged in
      // For now, we'll just assume they're not
      setIsLoggedIn(false);
    };

    checkAuth();
  }, []);

  // In a real app, we would fetch favorites from the API
  useEffect(() => {
    if (isLoggedIn) {
      // Simulate API call
      const fetchFavorites = async () => {
        // In a real app, we would fetch favorites from the API
        // For now, we'll just use the sample favorites

        // Wait a bit to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFavorites(SAMPLE_FAVORITES);
      };

      fetchFavorites();
    }
  }, [isLoggedIn]);

  return (
    <div className="container mx-auto px-4 py-12">
      {isLoggedIn ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                <FaUser className="text-indigo-600 dark:text-indigo-300 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">John Doe</h2>
                <p className="text-gray-600 dark:text-gray-400">john.doe@example.com</p>
              </div>
            </div>

            <button
              onClick={() => {
                // In a real app, we would log the user out
                toast.success('Logged out successfully');
                setIsLoggedIn(false);
              }}
              className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <FaHeart className="text-pink-500 dark:text-pink-400 mr-2" />
              Favorite Cards
            </h3>

            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                            favorite.type === 'dare'
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {favorite.type === 'dare' ? 'Dare' : 'Question'}
                        </span>
                        <p className="text-gray-800 dark:text-gray-200">{favorite.content}</p>
                      </div>
                      <button
                        onClick={() => {
                          // In a real app, we would remove the favorite
                          setFavorites(favorites.filter((f) => f.id !== favorite.id));
                          toast.success('Removed from favorites');
                        }}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <FaHeart />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Favorited on {new Date(favorite.favoriteDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>You haven&apos;t favorited any cards yet.</p>
                <Link
                  href="/cards"
                  className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Browse cards
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-gray-400 dark:text-gray-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Not Logged In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to view your profile and favorites.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-indigo-600 dark:bg-indigo-700 text-white py-2 px-6 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}
