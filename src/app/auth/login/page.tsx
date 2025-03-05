'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import LoginForm from '@/components/auth/LoginForm';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col">
      <header className="mb-8">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}