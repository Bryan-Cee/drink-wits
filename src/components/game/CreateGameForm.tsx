'use client';

import { type CreateGameFormValues, createGameSchema } from '@/lib/validation/create-game-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type FieldArrayPath, useFieldArray, useForm } from 'react-hook-form';
import { FaCheck, FaCopy, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

interface CreateGameFormProps {
  onCreateGame: (gameName: string, players: string[]) => Promise<{ joinCode: string }>;
}

export default function CreateGameForm({ onCreateGame }: CreateGameFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGameFormValues>({
    resolver: yupResolver(createGameSchema),
    defaultValues: {
      gameName: '',
      players: [''],
    },
  });

  // Use the correct typing for useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'players' as FieldArrayPath<CreateGameFormValues>,
  });

  const onSubmit = async (data: CreateGameFormValues) => {
    try {
      setIsCreating(true);
      // Filter out empty player names
      const filteredPlayers = data.players.filter((player) => player.trim() !== '');

      if (filteredPlayers.length === 0) {
        toast.error('At least one player is required');
        setIsCreating(false);
        return;
      }

      const result = await onCreateGame(data.gameName, filteredPlayers);
      setJoinCode(result.joinCode);

      // Store the first player name in session storage for game navigation
      if (filteredPlayers.length > 0) {
        sessionStorage.setItem('playerName', filteredPlayers[0]);
      }

      toast.success('Game created successfully!');
    } catch (error) {
      toast.error('Failed to create game');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyJoinLink = () => {
    if (!joinCode) return;

    const url = `${window.location.origin}/game/join?code=${joinCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Join link copied to clipboard!');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {joinCode ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Game Created!</h2>
          <p className="mb-2">Share this code with your friends:</p>
          <div className="flex items-center mb-4">
            <span className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded flex-1 text-center text-lg">
              {joinCode}
            </span>
            <button
              onClick={copyJoinLink}
              className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              aria-label="Copy join link"
              type="button"
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                const playerName = sessionStorage.getItem('playerName') || 'Anonymous';
                router.push(`/game/play?code=${joinCode}&player=${encodeURIComponent(playerName)}`);
              }}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
              type="button"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="gameName" className="block text-sm font-medium mb-1">
              Game Name
            </label>
            <input
              id="gameName"
              {...register('gameName')}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter game name"
            />
            {errors.gameName && (
              <p className="text-red-500 text-sm mt-1">{errors.gameName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Players</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex mb-2">
                <input
                  {...register(`players.${index}`)}
                  placeholder={`Player ${index + 1}`}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  aria-label={`Remove player ${index + 1}`}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append('')}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <FaPlus /> Add Player
            </button>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Create Game'}
          </button>
        </form>
      )}
    </div>
  );
} 