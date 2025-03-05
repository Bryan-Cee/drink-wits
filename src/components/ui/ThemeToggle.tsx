"use client";

import { useTheme } from "@/lib/theme/theme-context";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 ease-in-out"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="text-gray-800 hover:text-gray-600 text-xl" />
      ) : (
        <FaSun className="text-yellow-300 hover:text-yellow-200 text-xl" />
      )}
    </button>
  );
} 