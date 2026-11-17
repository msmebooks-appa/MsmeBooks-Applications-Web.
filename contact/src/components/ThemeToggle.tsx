import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  compact = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border select-none ${
        isDark
          ? 'bg-[#131E35] text-slate-200 border-slate-700 hover:border-[#70C038] hover:text-white'
          : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-[#0B3B82] hover:text-[#0B3B82]'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#70C038] transition-transform rotate-0 scale-100" />
          {!compact && <span className="font-semibold text-[11px] text-[#a1e670]">Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#0B3B82] transition-transform rotate-0 scale-100" />
          {!compact && <span className="font-semibold text-[11px] text-slate-600">Dark</span>}
        </>
      )}
    </button>
  );
};
