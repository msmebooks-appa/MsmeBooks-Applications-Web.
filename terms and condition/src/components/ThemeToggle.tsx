import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
  variant?: 'button' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
  variant = 'button'
}) => {
  const isDark = theme === 'dark';

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-100 dark:bg-[#0D2238] border border-slate-200 dark:border-slate-700/80 rounded-lg ${className}`}>
        <button
          type="button"
          onClick={() => isDark && onToggle()}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            !isDark
              ? 'bg-white text-[#0B3558] shadow-xs'
              : 'text-slate-500 hover:text-slate-200'
          }`}
          aria-label="Light mode"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => !isDark && onToggle()}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            isDark
              ? 'bg-[#0B3558] text-[#84CC16] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Dark mode"
        >
          <Moon className="w-3.5 h-3.5 text-[#84CC16]" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative p-2 rounded-lg border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] ${
        isDark
          ? 'bg-[#0D2238] border-slate-700/80 text-[#84CC16] hover:bg-[#102A44] hover:border-[#84CC16]/60'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0B3558]'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon for Light Mode (Visible when Dark) */}
        <Sun
          className={`w-4 h-4 text-amber-400 absolute inset-0 transition-transform duration-300 ${
            isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
          }`}
        />
        {/* Moon Icon for Dark Mode (Visible when Light) */}
        <Moon
          className={`w-4 h-4 text-[#0B3558] absolute inset-0 transition-transform duration-300 ${
            isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
          }`}
        />
      </div>
    </button>
  );
};
