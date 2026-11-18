import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-xl text-slate-600 hover:text-blue-900 dark:text-slate-300 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200 border border-slate-200/80 dark:border-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 ${className}`}
    >
      <div className="relative w-4.5 h-4.5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4.5 h-4.5 text-lime-400 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-blue-900 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
};
