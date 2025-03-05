'use client';

import { joinGameSchema } from '@/lib/validation/join-game-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowRight, FaKey, FaUser } from 'react-icons/fa';

interface JoinGameFormProps {
  onJoinGame: (joinCode: string, playerName: string) => Promise<void>;
}

type FormValues = {
  joinCode: string;
  playerName: string;
};

export default function JoinGameForm({ onJoinGame }: JoinGameFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(joinGameSchema),
    defaultValues: {
      joinCode: '',
      playerName: '',
    },
  });

  // Check if there's a join code in the URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get('code');
      if (codeFromUrl) {
        setValue('joinCode', codeFromUrl);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await onJoinGame(data.joinCode, data.playerName);
      toast.success('Joined the game!');
    } catch (error) {
      console.error('Failed to join game:', error);
      toast.error('Failed to join game');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Join a Game</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="joinCode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Join Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaKey className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="joinCode"
              type="text"
              className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              placeholder="Enter join code"
              {...register('joinCode')}
            />
          </div>
          {errors.joinCode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.joinCode.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="playerName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="playerName"
              type="text"
              className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              placeholder="What should we call you?"
              {...register('playerName')}
            />
          </div>
          {errors.playerName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.playerName.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
