import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';
import { FaUndo, FaForward } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

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
      console.log('Setting cards and resetting index');
      setCards(initialCards);
      setCurrentIndex(0);
    } else {
      console.warn('No cards provided to CardDeck or empty array');
    }
  }, [initialCards]);

  const handleSwipe = (direction: 'left' | 'right') => {
    setDirection(direction);
    
    // Move to the next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
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

    if (currentIndex < cards.length) {
      const currentCard = cards[currentIndex];
      
      try {
        await onFavoriteCard(currentCard.id);
        
        // Update the local state
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === currentIndex ? { ...card, isFavorite: !card.isFavorite } : card
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
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setDirection('right');
    }
  };

  const undoCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      setDirection('left');
    }
  };

  // Debug message for rendering
  console.log('Rendering CardDeck', { 
    cardsLength: cards.length, 
    currentIndex, 
    hasCurrentCard: currentIndex < cards.length,
    currentCard: currentIndex < cards.length ? cards[currentIndex] : null
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
            {currentIndex < cards.length && (
              <GameCard
                key={cards[currentIndex].id}
                id={cards[currentIndex].id}
                type={cards[currentIndex].type}
                content={cards[currentIndex].content}
                isFavorite={cards[currentIndex].isFavorite}
                onSwipe={handleSwipe}
                onFavorite={handleFavorite}
              />
            )}
          </AnimatePresence>
          
          {/* Empty state when no cards are left */}
          {currentIndex >= cards.length && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold text-white mb-4">All cards completed!</h3>
                <button
                  onClick={() => setCurrentIndex(0)}
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
          disabled={currentIndex === 0}
          className={`p-4 rounded-full bg-white/10 backdrop-blur-sm ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
          }`}
        >
          <FaUndo className="text-white text-xl" />
        </button>
        
        <button
          onClick={skipCard}
          disabled={currentIndex >= cards.length - 1}
          className={`p-4 rounded-full bg-white/10 backdrop-blur-sm ${
            currentIndex >= cards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
          }`}
        >
          <FaForward className="text-white text-xl" />
        </button>
      </div>
      
      {/* Card counter */}
      <div className="mt-4 text-center text-white/60">
        {currentIndex < cards.length ? (
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
        ) : (
          <span>No cards left</span>
        )}
      </div>
    </div>
  );
} 