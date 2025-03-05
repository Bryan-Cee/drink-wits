'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {mode === 'login' 
              ? 'Sign in to access your favorites and game history' 
              : 'Join Drink Wits to save favorites and track your games'}
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center space-y-4">
          <button
            onClick={switchMode}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}