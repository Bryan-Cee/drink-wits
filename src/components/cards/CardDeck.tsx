import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';
import { FaUndo, FaForward, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useGameStore } from '@/lib/store/game-store';
import { useSearchParams } from 'next/navigation';

interface Card {
  id: string;
  type: 'dare' | 'question';
  content: string;
  isFavorite: boolean;
}

interface CardDeckProps {
  cards: Card[];
  onFavoriteCard: (cardId: string) => Promise<void>;
  isUserLoggedIn: boolean;
}

export default function CardDeck({ cards: initialCards, onFavoriteCard, isUserLoggedIn }: CardDeckProps) {
  // Get URL parameters for game and player
  const searchParams = useSearchParams();
  const joinCode = searchParams?.get('code');
  const playerName = searchParams?.get('player');
  
  // Local state for cards
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [showPlayers, setShowPlayers] = useState(false);
  
  // Global state from the game store
  const { 
    currentCardIndex, 
    initializeSocket, 
    disconnectSocket, 
    syncCardIndex,
    players,
    isConnected
  } = useGameStore();
  
  // Set direction for animations
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Connect to the socket when the component mounts
  useEffect(() => {
    if (joinCode && playerName) {
      console.log(`Initializing socket for game ${joinCode} as ${playerName}`);
      initializeSocket(joinCode, playerName);
      
      // Cleanup function to disconnect when component unmounts
      return () => {
        disconnectSocket();
      };
    } else {
      console.error('Missing joinCode or playerName parameters');
      toast.error('Missing game code or player name. Please check your URL parameters.');
    }
  }, [joinCode, playerName, initializeSocket, disconnectSocket]);

  // Log when cards change
  useEffect(() => {
    console.log('Cards in CardDeck:', initialCards);
    console.log('Cards length:', initialCards?.length);
    
    if (!initialCards || initialCards.length === 0) {
      console.warn('No cards provided to CardDeck or empty array');
    } else {
      const cardSample = initialCards[0];
      console.log('Sample card structure:', {
        id: cardSample.id,
        type: cardSample.type,
        content: cardSample.content,
        isFavorite: cardSample.isFavorite
      });
    }
  }, [initialCards]);

  // Reset the deck when initialCards change
  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      console.log('Setting cards');
      setCards(initialCards);
    } else {
      console.warn('No cards provided to CardDeck or empty array');
    }
  }, [initialCards]);

  const handleSwipe = (direction: 'left' | 'right') => {
    setDirection(direction);
    
    // Move to the next card
    if (currentCardIndex < cards.length - 1) {
      // Sync card index with other players
      syncCardIndex(currentCardIndex + 1);
    } else {
      // We've reached the end of the deck
      toast.success('You\'ve completed the deck!');
    }
  };

  const handleFavorite = async () => {
    if (!isUserLoggedIn) {
      toast.error('You need to log in to favorite cards!');
      return;
    }

    if (currentCardIndex < cards.length) {
      const currentCard = cards[currentCardIndex];
      
      try {
        await onFavoriteCard(currentCard.id);
        
        // Update the local state
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === currentCardIndex ? { ...card, isFavorite: !card.isFavorite } : card
          )
        );
        
        toast.success(
          currentCard.isFavorite 
            ? 'Removed from favorites!' 
            : 'Added to favorites!'
        );
      } catch (error) {
        toast.error('Failed to update favorites');
      }
    }
  };

  const skipCard = () => {
    if (currentCardIndex < cards.length - 1) {
      syncCardIndex(currentCardIndex + 1);
      setDirection('right');
    }
  };

  const undoCard = () => {
    if (currentCardIndex > 0) {
      syncCardIndex(currentCardIndex - 1);
      setDirection('left');
    }
  };

  const togglePlayersPanel = () => {
    setShowPlayers(!showPlayers);
  };

  // Debug message for rendering
  console.log('Rendering CardDeck', { 
    cardsLength: cards.length, 
    currentCardIndex, 
    hasCurrentCard: currentCardIndex < cards.length,
    currentCard: currentCardIndex < cards.length ? cards[currentCardIndex] : null,
    isConnected,
    playersCount: players.length
  });

  if (!cards || cards.length === 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">No cards available</h3>
          <p>Please try again later or create a new game.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 w-full max-w-md mx-auto">
        {/* Card stack */}
        <div className="relative w-full h-[400px] min-h-[400px]">
          <AnimatePresence>
            {currentCardIndex < cards.length && (
              <GameCard
                key={cards[currentCardIndex].id}
                id={cards[currentCardIndex].id}
                type={cards[currentCardIndex].type}
                content={cards[currentCardIndex].content}
                isFavorite={cards[currentCardIndex].isFavorite}
                onSwipe={handleSwipe}
                onFavorite={handleFavorite}
              />
            )}
          </AnimatePresence>
          
          {/* Empty state when no cards are left */}
          {currentCardIndex >= cards.length && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold text-white mb-4">All cards completed!</h3>
                <button
                  onClick={() => syncCardIndex(0)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Restart Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="mt-8 flex justify-center gap-8">
        <button
          onClick={undoCard}
          disabled={currentCardIndex === 0}
          className={`p-4 rounded-full bg-white/10 backdrop-blur-sm ${
            currentCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
          }`}
        >
          <FaUndo className="text-white text-xl" />
        </button>
        
        <button
          onClick={skipCard}
          disabled={currentCardIndex >= cards.length - 1}
          className={`p-4 rounded-full bg-white/10 backdrop-blur-sm ${
            currentCardIndex >= cards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
          }`}
        >
          <FaForward className="text-white text-xl" />
        </button>
      </div>
      
      {/* Card counter */}
      <div className="mt-4 text-center text-white/60">
        {currentCardIndex < cards.length ? (
          <span>
            Card {currentCardIndex + 1} of {cards.length}
          </span>
        ) : (
          <span>No cards left</span>
        )}
      </div>
    </div>
  );
} 