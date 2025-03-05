"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTrash, FaPlus, FaCopy, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createGameSchema,
  CreateGameFormValues,
} from "@/lib/validation/create-game-schema";

interface CreateGameFormProps {
  onCreateGame: (
    gameName: string,
    players: { name: string }[]
  ) => Promise<{ joinCode: string }>;
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
      gameName: "",
      players: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  const onSubmit = async (data: CreateGameFormValues) => {
    try {
      setIsCreating(true);
      // Filter out empty player names
      const filteredPlayers = data.players.filter(
        (player) => player.name.trim() !== ""
      );

      if (filteredPlayers.length === 0) {
        toast.error("At least one player is required");
        setIsCreating(false);
        return;
      }

      const result = await onCreateGame(data.gameName, filteredPlayers.map((player) => player.name));
      setJoinCode(result.joinCode);

      // Store the first player name in session storage for game navigation
      if (filteredPlayers.length > 0) {
        sessionStorage.setItem("playerName", filteredPlayers[0].name);
      }

      toast.success("Game created successfully!");
    } catch (error) {
      toast.error("Failed to create game");
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
    toast.success("Join link copied to clipboard!"); // This toast is not working

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
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                const playerName =
                  sessionStorage.getItem("playerName") || "Anonymous";
                router.push(
                  `/game/play?code=${joinCode}&player=${encodeURIComponent(
                    playerName
                  )}`
                );
              }}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
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
            <label
              htmlFor="gameName"
              className="block text-sm font-medium mb-1"
            >
              Game Name
            </label>
            <input
              id="gameName"
              {...register("gameName")}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter game name"
            />
            {errors.gameName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gameName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Players</label>
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex mb-2">
                  <input
                    {...register(`players.${index}.name`)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    className={`ml-2 p-2 rounded ${
                      fields.length <= 1
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    } transition-colors`}
                    aria-label="Remove player"
                  >
                    <FaTrash />
                  </button>
                </div>
                {errors?.players?.[index]?.name?.message && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.players[index]?.name?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ name: "" })}
              disabled={fields.length >= 10}
              className={`flex items-center text-sm ${
                fields.length >= 10
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "text-blue-500 hover:text-blue-700"
              }`}
            >
              <FaPlus className="mr-1" />
              Add Player
            </button>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Creating..." : "Create Game"}
          </button>
        </form>
      )}
    </div>
  );
}
