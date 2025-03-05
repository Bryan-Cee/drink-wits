'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CardDeck from '@/components/cards/CardDeck';
import { FaArrowLeft, FaUsers, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useGameStore } from '@/lib/store/game-store';

// Sample cards for demo - will be replaced with API data
const SAMPLE_CARDS = [
  {
    id: '1',
    type: 'dare' as const,
    content: 'Take a shot or do 10 push-ups',
    isFavorite: false,
  },
  {
    id: '2',
    type: 'question' as const,
    content: "What's the most embarrassing thing you've done while drunk?",
    isFavorite: false,
  },
  {
    id: '3',
    type: 'dare' as const,
    content: 'Let the group choose your profile picture for a day',
    isFavorite: false,
  },
  {
    id: '4',
    type: 'question' as const,
    content: "What's your go-to drunk food?",
    isFavorite: false,
  },
  {
    id: '5',
    type: 'dare' as const,
    content: 'Call the 5th contact in your phone and sing them happy birthday',
    isFavorite: false,
  },
  {
    id: '6',
    type: 'question' as const,
    content: 'If you could only drink one type of alcohol for the rest of your life, what would it be?',
    isFavorite: false,
  },
];

function GamePlayContent() {
  const searchParams = useSearchParams();
  const joinCode = searchParams?.get('code');
  const playerName = searchParams?.get('player');
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('URL Parameters:', { 
      code: joinCode, 
      player: playerName 
    });
    
    if (!joinCode) {
      console.error('Missing game code parameter');
    }
    
    if (!playerName) {
      console.error('Missing player name parameter');
    }
  }, [joinCode, playerName]);
    const [showPlayers, setShowPlayers] = useState(false);
  const { isConnected, players } = useGameStore();
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch cards from the API
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch cards from the API
        const response = await fetch('/api/cards');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cards: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched cards:', data);
        
        // Transform the API data to match our Card interface
        const formattedCards = data.map((card: any) => ({
          id: card.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          type: card.type === 'question' ? 'question' : 'dare',
          content: card.content,
          isFavorite: false,
        }));
        
        console.log('Formatted cards for display:', formattedCards);
        
        if (formattedCards && formattedCards.length > 0) {
          setCards(formattedCards);
        } else {
          // If no cards are returned, use the sample cards as fallback
          console.warn('No cards returned from API, using sample data');
          setCards(SAMPLE_CARDS);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        setError('Failed to fetch cards. Using sample data instead.');
        // Use sample cards as fallback
        setCards(SAMPLE_CARDS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, []);
    const togglePlayersPanel = () => {
      setShowPlayers(!showPlayers);
    };

  const handleFavoriteCard = async (cardId: string) => {
    if (!isUserLoggedIn) {
      setShowLoginPrompt(true);
      return Promise.reject('Not logged in');
    }
    
    // In a real app, we would make an API call to toggle favorite
    // For now, we'll just update the local state
    
    // Wait a bit to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Loading cards...</h2>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  // Ensure there is a warning when a player want to exit the game
  return (
    <div className="container mx-auto px-4 py-6 min-h-full flex flex-col">
      <header className="flex justify-center items-center mb-8">
        <div className="text-white text-center">
          <h1 className="text-xl font-bold">Game Code: {joinCode}</h1>
          <div className="flex-col justify-center items-center gap-2">
            {playerName && (
              <p className="text-sm opacity-80">Playing as {playerName}</p>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-4 bg-red-500/20 text-white p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <CardDeck
            cards={cards}
            onFavoriteCard={handleFavoriteCard}
            isUserLoggedIn={isUserLoggedIn}
          />
        </div>
      </div>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create an Account</h2>
            <p className="mb-6">
              You need to create an account or log in to favorite cards.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <Link
                href="/auth/register"
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6 text-white">Loading game...</div>}>
      <GamePlayContent />
    </Suspense>
  );
}