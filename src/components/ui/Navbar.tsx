"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGlassCheers, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/auth/auth-context';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthPage = pathname.startsWith('/auth/');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Common navbar styles
  const navbarClass = "bg-white/10 dark:bg-gray-900/20 backdrop-blur-md fixed w-full z-50 transition-colors duration-300";

  // Show simplified navbar on auth pages with just the logo
  if (isAuthPage) {
    return (
      <nav className={navbarClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <Link href="/" className="flex items-center">
              <FaGlassCheers className="h-8 w-8 text-pink-500 dark:text-pink-400" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Drink Wits</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaGlassCheers className="h-8 w-8 text-pink-500 dark:text-pink-400" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Drink Wits</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/game/create" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create Game
              </Link>
              
              <Link 
                href="/game/join" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Join Game
              </Link>
              
              {user && (
                <Link 
                  href="/favorites" 
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Favorites
                </Link>
              )}
              
              <div className="border-l border-gray-300 dark:border-gray-700 h-6 mx-2" />
              
              <ThemeToggle />
              
              {user ? (
                <Link 
                  href="/profile" 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  title="My Profile"
                >
                  <FaUser className="text-sm" />
                </Link>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex md:hidden">
            <ThemeToggle />
            
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/game/create" 
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Game
            </Link>
            
            <Link 
              href="/game/join" 
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Game
            </Link>
            
            {user && (
              <Link 
                href="/favorites" 
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites
              </Link>
            )}
            
            {user ? (
              <Link 
                href="/profile" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="mr-2" />
                My Profile
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 