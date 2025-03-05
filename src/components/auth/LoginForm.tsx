'use client';

import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/lib/auth/auth-context';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const { signIn, isLoading, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
      setIsSigningIn(false); // Reset state on error only
    }
  };

  if (user) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white text-center">
        <p className="mb-2">Signed in as:</p>
        <p className="font-bold">{user.email}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || isSigningIn}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningIn ? (
            'Connecting...'
          ) : (
            <>
              <FaGoogle className="mr-2 text-red-500" />
              Continue with Google
            </>
          )}
        </button>
        
        {isLoading && (
          <div className="text-center text-gray-500">
            <p>Checking authentication status...</p>
          </div>
        )}
      </div>
    </div>
  );
} 