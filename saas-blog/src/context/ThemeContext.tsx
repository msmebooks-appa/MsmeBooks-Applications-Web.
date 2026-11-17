import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'msmebooks_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Sync browser theme color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#071527' : '#FFFFFF');

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage may fail in restricted iframe environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeToggleProps {
  variant?: 'header' | 'compact' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'header', className = '' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
          isDark
            ? 'bg-[#0B1E36] border-slate-700 text-slate-200 hover:border-lime-400 hover:text-white'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-300 hover:text-slate-900'
        } ${className}`}
        title={isDark ? 'Switch to Light Theme' : "Switch to 'Deep Navy' Dark Mode"}
        aria-label={isDark ? 'Switch to Light Theme' : "Switch to 'Deep Navy' Dark Mode"}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-lime-400" />
            <span>Deep Navy</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-blue-600" />
            <span>Light</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-xs font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
        isDark
          ? 'bg-[#0E2443] border-slate-700/80 text-slate-200 hover:bg-[#132F55] hover:text-white shadow-sm'
          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : "Switch to 'Deep Navy' Dark Mode"}
      aria-label={isDark ? 'Switch to Light Theme' : "Switch to 'Deep Navy' Dark Mode"}
    >
      <div className="flex items-center gap-1.5 px-0.5">
        {isDark ? (
          <>
            <Moon className="w-4 h-4 text-lime-400 animate-in spin-in-180 duration-200" />
            <span className="hidden xl:inline text-xs font-bold text-slate-200">
              Deep Navy
            </span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4 text-blue-700 animate-in spin-in-180 duration-200" />
            <span className="hidden xl:inline text-xs font-bold text-slate-700">
              Light
            </span>
          </>
        )}
      </div>
      {/* Lemon-green active glow indicator in dark mode */}
      {isDark && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
      )}
    </button>
  );
};
