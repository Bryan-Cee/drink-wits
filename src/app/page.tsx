import Link from 'next/link';
import { FaGlassCheers, FaUsers } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Drink Wits</h1>
        <p className="text-xl text-gray-700 dark:text-white/90 max-w-2xl">
          The social drinking game that combines fun challenges with questions. 
          Swipe, drink, and laugh with friends!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/game/create" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <FaGlassCheers className="text-5xl text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Host a Game</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Create a new game session and invite your friends to join.
          </p>
        </Link>

        <Link href="/game/join" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <FaUsers className="text-5xl text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Join a Game</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Enter a game code to join friends who are already playing.
          </p>
        </Link>
      </div>
    </div>
  );
}
