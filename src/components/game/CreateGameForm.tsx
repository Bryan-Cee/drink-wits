import { useState } from 'react';
import { FaPlus, FaTimes, FaUsers, FaDice, FaShare } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface CreateGameFormProps {
  onCreateGame: (gameName: string, players: string[]) => Promise<{ joinCode: string }>;
}

export default function CreateGameForm({ onCreateGame }: CreateGameFormProps) {
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index: number) => {
    if (players.length === 1) {
      toast.error('At least one player is required');
      return;
    }
    
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!gameName.trim()) {
      toast.error('Game name is required');
      return;
    }
    
    // Filter out empty player names
    const validPlayers = players.filter(player => player.trim() !== '');
    
    if (validPlayers.length === 0) {
      toast.error('At least one player is required');
      return;
    }
    
    try {
      setIsCreating(true);
      const result = await onCreateGame(gameName, validPlayers);
      setJoinCode(result.joinCode);
      toast.success('Game created successfully!');
    } catch (error) {
      console.error('Failed to create game:', error);
      toast.error('Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  const copyJoinLink = () => {
    if (!joinCode) return;
    
    const joinUrl = `${window.location.origin}/game/join?code=${joinCode}`;
    navigator.clipboard.writeText(joinUrl);
    toast.success('Join link copied to clipboard!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!joinCode ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Game</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gameName" className="block text-sm font-medium text-gray-700 mb-1">
                Game Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDice className="text-gray-400" />
                </div>
                <input
                  id="gameName"
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Fun Friday Night"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Players
              </label>
              
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUsers className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                        className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Player ${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlayer(index)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-50"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addPlayer}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <FaPlus /> Add Player
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <FaShare className="text-green-600 text-xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Created!</h2>
          <p className="text-gray-600 mb-6">Share this join code with your friends:</p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-2xl font-mono tracking-wider">{joinCode}</p>
          </div>
          
          <button
            onClick={copyJoinLink}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Copy Join Link
          </button>
          
          <div className="mt-4">
            <a
              href={`/game/play?code=${joinCode}`}
              className="block w-full text-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Playing
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 