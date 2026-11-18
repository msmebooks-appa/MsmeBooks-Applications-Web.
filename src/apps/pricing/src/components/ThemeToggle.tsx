import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
  showLabel = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark deep navy theme'}
      className={`relative inline-flex items-center justify-between p-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5] cursor-pointer ${
        isDark
          ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
          : 'bg-slate-100 border border-slate-200 hover:border-slate-300'
      } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Pill container for the two icons */}
      <div className="flex items-center gap-1.5 px-1">
        {/* Sun Icon */}
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
            !isDark
              ? 'bg-white text-amber-500 shadow-sm shadow-slate-300/50 scale-100'
              : 'text-slate-500 hover:text-slate-300 scale-90'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </span>

        {/* Moon Icon */}
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-[#0A4FD5] text-white shadow-sm shadow-blue-500/50 scale-100'
              : 'text-slate-400 hover:text-slate-600 scale-90'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </span>
      </div>

      {showLabel && (
        <span
          className={`ml-2 mr-2 text-xs font-semibold select-none ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {isDark ? 'Dark Theme' : 'Light Theme'}
        </span>
      )}
    </button>
  );
};
