'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
  const { signIn, isLoading, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;

    try {
      setIsSigningIn(true);
      await signIn('google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
      setIsSigningIn(false);
    }
  };

  if (user) {
    return (
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6 text-gray-800 dark:text-white text-center">
        <p className="mb-2">Signed in as:</p>
        <p className="font-bold">{user.email}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Sign in with
      </h2>

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningIn ? (
            'Connecting to Google...'
          ) : (
            <>
              <FaGoogle className="mr-3 text-red-500" />
              Continue with Google
            </>
          )}
        </button>

        {/* Note: To add more providers, you'll need to update the auth-context.tsx file 
            to support additional OAuth providers like GitHub and Facebook */}

        {isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            <p>Checking authentication status...</p>
          </div>
        )}
      </div>
    </div>
  );
}
