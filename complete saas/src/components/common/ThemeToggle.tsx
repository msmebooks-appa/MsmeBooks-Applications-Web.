import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented' | 'dropdown';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  showLabels = false,
}) => {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
      { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
      { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
      { value: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
    ];

    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 ${className}`}
        role="group"
        aria-label="Select color theme"
      >
        {options.map((opt) => {
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap
                ${
                  isActive
                    ? 'bg-white dark:bg-[#0F4C81] text-[#072644] dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
                }
              `}
              title={`Switch to ${opt.label} mode`}
            >
              {opt.icon}
              {showLabels && <span>{opt.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Icon toggle button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center p-2 rounded-xl transition-colors cursor-pointer
        bg-slate-100 hover:bg-slate-200 text-slate-700
        dark:bg-white/10 dark:hover:bg-white/15 dark:text-amber-300
        border border-slate-200/80 dark:border-white/10
        ${className}
      `}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-[#072644] transition-transform -rotate-12" />
      )}
      {showLabels && (
        <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-200">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
