'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface CardProps {
  id: string;
  content: string;
  onSwipe: (direction: 'left' | 'right') => void;
  isFavorited?: boolean;
}

export default function GameCard({ id, content, onSwipe, isFavorited = false }: CardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const [dragDistance, setDragDistance] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Initialize favorite state from props, but then track it locally
  const [favorited, setFavorited] = useState(isFavorited);

  const SWIPE_THRESHOLD = 150;
  const MAX_ROTATION = 15;

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setInitialRender(false);

    // Get starting X position
    if ('touches' in e) {
      setDragStartX(e.touches[0].clientX);
    } else {
      setDragStartX(e.clientX);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    // Calculate distance moved
    let currentX: number;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }

    const distance = currentX - dragStartX;
    setDragDistance(distance);

    // Set drag direction based on distance
    if (distance > 20) {
      setDragDirection('right');
    } else if (distance < -20) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = () => {
    if (isDragging) {
      const absDragDistance = Math.abs(dragDistance);

      // If dragged far enough, trigger swipe
      if (absDragDistance > SWIPE_THRESHOLD) {
        if (dragDistance > 0) {
          onSwipe('right');
        } else {
          onSwipe('left');
        }
      }

      // Reset drag state
      setIsDragging(false);
      setDragDistance(0);
      setDragDirection(null);
    }
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (user) {
      const success = await toggleFavorite(id);
      if (success) {
        setFavorited(!favorited);
      }
    }
  };

  // Calculate rotation based on drag distance
  const rotation = isDragging ? (dragDistance / SWIPE_THRESHOLD) * MAX_ROTATION : 0;

  // Determine card position
  const x = isDragging ? dragDistance : 0;

  // Determine scale based on dragging state
  const scale = isDragging ? 1.05 : 1;

  // Determine heart icon based on favorited state
  const HeartIcon = favorited || isFavorite(id) ? FaHeart : FaRegHeart;

  return (
    <motion.div
      className="relative max-w-md w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      initial={initialRender ? { scale: 0.8, opacity: 0 } : false}
      animate={{
        x,
        rotate: rotation,
        scale,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 50,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Card content */}
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1 mb-4 text-xl text-gray-700 dark:text-gray-200 font-medium flex items-center justify-center text-center">
          {content}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-4 right-4 p-2 rounded-full"
          disabled={!user}
        >
          <HeartIcon
            className={`text-xl ${
              favorited || isFavorite(id)
                ? 'text-red-500'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Swipe indicators */}
      {isDragging && dragDirection && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none
            ${dragDirection === 'left' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
        >
          <div
            className={`text-4xl font-bold
              ${dragDirection === 'left' ? 'text-red-500' : 'text-green-500'}`}
          >
            {dragDirection === 'left' ? 'SKIP' : 'LIKE'}
          </div>
        </div>
      )}
    </motion.div>
  );
}
