import Link from 'next/link';
import { FaGlassCheers, FaUser, FaUsers } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-white">Drink Wits</h1>
        <p className="text-xl text-white/90 max-w-2xl">
          The social drinking game that combines fun challenges with questions. 
          Swipe, drink, and laugh with friends!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/game/create" className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <FaGlassCheers className="text-5xl text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Host a Game</h2>
          <p className="text-gray-600 text-center">
            Create a new game session and invite your friends to join.
          </p>
        </Link>

        <Link href="/game/join" className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <FaUsers className="text-5xl text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Join a Game</h2>
          <p className="text-gray-600 text-center">
            Enter a game code to join friends who are already playing.
          </p>
        </Link>
      </div>

      <div className="mt-12">
        <Link 
          href="/profile" 
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/20 transition-all duration-200"
        >
          <FaUser />
          <span>My Profile</span>
        </Link>
      </div>

      <footer className="mt-24 text-white/60 text-sm">
        &copy; {new Date().getFullYear()} Drink Wits - Play Responsibly
      </footer>
    </div>
  );
}
