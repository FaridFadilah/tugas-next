"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function SafeThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    // Always toggle between light and dark (ignore system)
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Get actual resolved theme for display - only after mounted
  const getResolvedTheme = () => {
    if (!mounted) return 'light'; // Default to light during SSR
    
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const resolvedTheme = getResolvedTheme();

  if (resolvedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (resolvedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg">
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
      aria-label="Toggle theme"
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
