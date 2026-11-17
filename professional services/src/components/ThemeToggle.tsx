import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const {
    theme,
    resolvedTheme,
    systemTheme,
    isDark,
    isSystemPreference,
    setTheme,
    toggleSystemPreference,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Mobile drawer segmented switcher when showLabel is true
  if (showLabel) {
    const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
      {
        id: 'light',
        label: 'Light',
        icon: (
          <Sun
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              !isDark ? 'rotate-0 scale-110 text-amber-500' : '-rotate-45 scale-95'
            }`}
          />
        ),
      },
      {
        id: 'dark',
        label: 'Dark',
        icon: (
          <Moon
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isDark ? 'rotate-0 scale-110 text-[#B7E532]' : 'rotate-45 scale-95'
            }`}
          />
        ),
      },
      { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
    ];

    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1 ${className}`}
        role="group"
        aria-label="Theme mode selector"
      >
        {options.map((opt) => {
          const active = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                active
                  ? isDark
                    ? 'bg-[#102B4E] text-[#B7E532] shadow-xs ring-1 ring-[#B7E532]/30'
                    : 'bg-white text-[#1464C8] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#102B4E] dark:hover:text-white'
              }`}
              title={
                opt.id === 'system'
                  ? `Follow OS System Preference (currently ${systemTheme})`
                  : `Switch to ${opt.label} Mode`
              }
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-[#B7E532] border border-slate-700 hover:border-[#B7E532]/40 shadow-xs'
            : 'bg-slate-100 text-[#102B4E] border border-slate-200 hover:bg-slate-200 hover:border-slate-300 shadow-xs'
        }`}
        title={
          isSystemPreference
            ? `Theme: System Preference (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`
            : `Theme: ${resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode`
        }
        aria-label="Open theme switcher"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {isDark ? (
              <motion.span
                key="moon-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.45 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.45 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="w-4 h-4 text-[#B7E532] group-hover:-rotate-12 transition-transform duration-200" />
              </motion.span>
            ) : (
              <motion.span
                key="sun-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.45 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.45 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
              </motion.span>
            )}
          </AnimatePresence>

          {isSystemPreference && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-800 z-10"
              title="Following OS System Preference"
              aria-hidden="true"
            />
          )}
        </div>
        <ChevronDown
          className={`w-3 h-3 opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#0A1727] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-label="Theme options"
        >
          <div className="px-3.5 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Theme Appearance
            </span>
            <span className="text-[10px] font-bold text-[#1464C8] dark:text-[#B7E532]">
              {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Active
            </span>
          </div>

          {/* Explicit Light & Dark Options */}
          <div className="px-1.5 space-y-0.5">
            <button
              type="button"
              role="menuitemradio"
              aria-checked={theme === 'light'}
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#1464C8] dark:text-[#B7E532] font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Light Mode</span>
              </span>
              {theme === 'light' && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>

            <button
              type="button"
              role="menuitemradio"
              aria-checked={theme === 'dark'}
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#1464C8] dark:text-[#B7E532] font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-indigo-500 dark:text-[#B7E532] shrink-0" />
                <span>Dark Mode</span>
              </span>
              {theme === 'dark' && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>

          {/* System Preference Toggle Section */}
          <div className="mt-1.5 pt-2 px-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Monitor className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#102B4E] dark:text-white block leading-tight">
                    System Preference
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    OS detected: <strong className="capitalize">{systemTheme}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isSystemPreference}
                aria-label="Toggle automatic System Preference theme detection"
                onClick={toggleSystemPreference}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1464C8] ${
                  isSystemPreference
                    ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-[#0A1727] shadow-xs transition-transform ${
                    isSystemPreference ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
