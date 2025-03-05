"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("card_id")
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      const cardIds = data.map((favorite) => favorite.card_id);
      setFavorites(cardIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (cardId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return false;
    }

    try {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        card_id: cardId,
      });

      if (error) {
        throw error;
      }

      setFavorites((prev) => [...prev, cardId]);
      toast.success("Card added to favorites");
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast.error("Failed to add to favorites");
      return false;
    }
  };

  const removeFavorite = async (cardId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("card_id", cardId);

      if (error) {
        throw error;
      }

      setFavorites((prev) => prev.filter((id) => id !== cardId));
      toast.success("Card removed from favorites");
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
      return false;
    }
  };

  const toggleFavorite = async (cardId: string) => {
    if (favorites.includes(cardId)) {
      return removeFavorite(cardId);
    } else {
      return addFavorite(cardId);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite: (cardId: string) => favorites.includes(cardId),
  };
} 