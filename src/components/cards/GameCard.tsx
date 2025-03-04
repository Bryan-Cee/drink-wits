import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface GameCardProps {
  id: string;
  type: 'dare' | 'question';
  content: string;
  isFavorite: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onFavorite: () => void;
}

export default function GameCard({
  id,
  type,
  content,
  isFavorite,
  onSwipe,
  onFavorite,
}: GameCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Add debug logging
  useEffect(() => {
    console.log('GameCard mounted:', { id, type, content });
    return () => {
      console.log('GameCard unmounted:', id);
    };
  }, [id, type, content]);
  
  // Define card styles based on type
  const cardStyles = {
    dare: 'bg-gradient-to-br from-rose-500 to-red-800 text-white',
    question: 'bg-gradient-to-br from-sky-500 to-blue-800 text-white',
    default: 'bg-gradient-to-br from-purple-500 to-indigo-800 text-white', // Fallback style
  };
  
  // Get the appropriate style based on type, with fallback
  const cardStyle = cardStyles[type] || cardStyles.default;
  
  // Handle card drag
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log('Card drag end:', { offsetX: info.offset.x });
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full h-full"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-full h-full rounded-xl shadow-xl overflow-hidden ${cardStyle}`}>
        <div className="relative w-full h-full flex flex-col p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="p-2 rounded-full hover:bg-white/10"
            >
              {isFavorite ? (
                <FaHeart className="text-2xl text-pink-400" />
              ) : (
                <FaRegHeart className="text-2xl text-white" />
              )}
            </button>
          </div>
          
          <div className="mt-8 flex-1 flex items-center justify-center overflow-y-auto">
            <p className="text-2xl font-bold text-center px-4">
              {content}
            </p>
          </div>
          
          <div className="mt-4 pt-2 border-t border-white/20">
            <span className="uppercase tracking-wider text-sm font-bold opacity-80">
              {type}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 