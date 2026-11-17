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
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] select-none cursor-pointer group ${
        isDark
          ? 'bg-[#15223E] hover:bg-[#1A2C50] text-[#B5E61D] border border-slate-700/80 shadow-xs'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-4 h-4 flex items-center justify-center transition-transform duration-300 transform group-hover:scale-110">
          {isDark ? (
            <Sun className="w-4 h-4 text-[#B5E61D] transition-transform duration-300 rotate-0 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 -rotate-12 group-hover:rotate-0" />
          )}
        </div>
        {showLabel && (
          <span className="whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-100">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </div>
    </button>
  );
};
