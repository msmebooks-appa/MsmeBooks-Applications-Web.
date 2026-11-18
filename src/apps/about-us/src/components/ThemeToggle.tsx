import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'desktop' | 'mobile';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'desktop' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 ${
        isDark
          ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-amber-300 hover:text-amber-200 shadow-inner'
          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-[#0B4EA2] shadow-xs'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-all duration-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 hover:text-[#0B4EA2] -rotate-12 scale-100 transition-all duration-300" />
        )}
      </div>

      {variant === 'mobile' && (
        <span className="sr-only">Toggle theme</span>
      )}
    </button>
  );
};
