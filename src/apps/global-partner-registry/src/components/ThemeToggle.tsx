import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400/40 shadow-inner'
          : 'bg-slate-100 hover:bg-slate-200/80 text-blue-900 border-slate-300 hover:border-blue-400 shadow-sm'
      } ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transform transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-blue-900 transform transition-transform duration-300 -rotate-12 scale-100" />
        )}
      </div>

      {showLabel ? (
        <span className="text-xs font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      ) : (
        <span className="hidden xl:inline text-[11px] font-medium opacity-90">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
