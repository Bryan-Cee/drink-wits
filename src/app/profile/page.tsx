'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFavorites(SAMPLE_FAVORITES);
      };
      
      fetchFavorites();
    }
  }, [isLoggedIn]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      {isLoggedIn ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <FaUser className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-gray-600">john.doe@example.com</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                // In a real app, we would log the user out
                toast.success('Logged out successfully');
                setIsLoggedIn(false);
              }}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaHeart className="text-pink-500 mr-2" />
              Favorite Cards
            </h3>
            
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map(favorite => (
                  <div
                    key={favorite.id}
                    className={`p-4 rounded-lg ${
                      favorite.type === 'dare'
                        ? 'bg-rose-100 border-l-4 border-rose-500'
                        : 'bg-blue-100 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{favorite.content}</p>
                      <span className="text-xs uppercase tracking-wider bg-white px-2 py-1 rounded-full">
                        {favorite.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Favorited on {new Date(favorite.favoriteDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No favorite cards yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-indigo-600 text-3xl" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to view your profile and favorite cards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/login"
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="flex-1 py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md text-center hover:bg-indigo-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 