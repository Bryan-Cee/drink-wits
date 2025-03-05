'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function AgeVerification() {
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already verified their age
    const hasVerified = localStorage.getItem('age-verified') === 'true';
    if (!hasVerified) {
      setShowVerification(true);
    }
    setIsLoading(false);
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setShowVerification(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (isLoading) {
    return null; // Don't render anything while checking localStorage
  }

  return (
    <AnimatePresence>
      {showVerification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 dark:text-red-300 text-2xl" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Age Verification</h2>
            
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              This application contains content related to drinking games and is intended for adults only.
            </p>
            
            <p className="font-bold mb-6 text-gray-800 dark:text-gray-200">
              Are you at least 18 years of age?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleVerify}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Yes, I am 18 or older
              </button>
              
              <button
                onClick={handleReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                No, I am under 18
              </button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              By clicking "Yes", you confirm that you are at least 18 years old and accept our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 