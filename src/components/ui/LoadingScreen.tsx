'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  // Optional minimum display time in ms
  minDisplayTime?: number;
}

export default function LoadingScreen({ minDisplayTime = 1000 }: LoadingScreenProps) {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, minDisplayTime);
    
    return () => clearTimeout(timer);
  }, [minDisplayTime]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-violet-400 to-indigo-600 dark:from-violet-800 dark:to-indigo-950 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <motion.div
                className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-white border-b-transparent border-l-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.h2 
              className="text-xl font-bold text-white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Drink Wits
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 