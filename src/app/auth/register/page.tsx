'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  
  const handleSubmit = async (data: any) => {
    try {
      // In a real app, we would make an API call to register
      // For now, we'll just simulate it
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(mode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(mode === 'login' ? 'Failed to log in' : 'Failed to create account');
      throw error;
    }
  };
  
  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/70">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <AuthForm 
        mode={mode} 
        onSubmit={handleSubmit} 
        switchMode={switchMode} 
      />
    </div>
  );
} 