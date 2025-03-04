import { useState } from 'react';
import { FaKey, FaUser, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface JoinGameFormProps {
  onJoinGame: (joinCode: string, playerName: string) => Promise<void>;
}

export default function JoinGameForm({ onJoinGame }: JoinGameFormProps) {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Check if there's a join code in the URL
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get('code');
      if (codeFromUrl) {
        setJoinCode(codeFromUrl);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!joinCode.trim()) {
      toast.error('Join code is required');
      return;
    }
    
    if (!playerName.trim()) {
      toast.error('Player name is required');
      return;
    }
    
    try {
      setIsJoining(true);
      await onJoinGame(joinCode, playerName);
      toast.success('Joined the game!');
    } catch (error) {
      console.error('Failed to join game:', error);
      toast.error('Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Join a Game</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-1">
            Join Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaKey className="text-gray-400" />
            </div>
            <input
              id="joinCode"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter join code"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What should we call you?"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isJoining}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              'Joining...'
            ) : (
              <>
                <FaArrowRight className="mr-2" />
                Join Game
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 