import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  className?: string;
  variant?: 'navbar' | 'compact' | 'pill';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  onToggleDarkMode,
  className = '',
  variant = 'navbar'
}) => {
  const { t } = useLanguage();

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onToggleDarkMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
          darkMode
            ? 'bg-[#0A2552] border-blue-800 text-[#8CE600] hover:bg-[#0c2e64]'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        } ${className}`}
        title={darkMode ? t('theme.toggle_light', 'Switch to Light Mode') : t('theme.toggle_dark', 'Switch to Dark Mode (Deep Navy)')}
        aria-label="Toggle theme mode"
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.span
              key="dark-pill"
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5"
            >
              <Moon className="w-3.5 h-3.5 text-[#8CE600] fill-current" />
              <span>Light Theme</span>
            </motion.span>
          ) : (
            <motion.span
              key="light-pill"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Dark Theme (#061F4A)</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // Smooth sliding capsule switch with Framer Motion icon-swapping animation
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={darkMode}
      onClick={onToggleDarkMode}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.04 }}
      className={`relative inline-flex items-center w-14 h-7.5 rounded-full p-0.5 border cursor-pointer select-none transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:ring-offset-1 ${
        darkMode
          ? 'bg-[#051838] border-blue-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_12px_rgba(140,230,0,0.15)]'
          : 'bg-slate-200/90 border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
      } ${className}`}
      title={darkMode ? t('theme.toggle_light', 'Switch to Light Mode') : t('theme.toggle_dark', 'Switch to Dark Mode (Deep Navy #061F4A)')}
      aria-label="Toggle theme switch"
    >
      {/* Background Track Icons */}
      <span className="absolute left-1.5 flex items-center justify-center pointer-events-none text-amber-500/80 transition-opacity duration-200">
        <Sun className="w-3 h-3" />
      </span>
      <span className="absolute right-1.5 flex items-center justify-center pointer-events-none text-[#8CE600]/80 transition-opacity duration-200">
        <Moon className="w-3 h-3" />
      </span>

      {/* Animated Sliding Thumb */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 34
        }}
        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md overflow-hidden ${
          darkMode
            ? 'translate-x-[26px] bg-[#0A3981] text-[#8CE600] ring-1 ring-[#8CE600]/40 shadow-[0_0_10px_rgba(140,230,0,0.3)]'
            : 'translate-x-0 bg-white text-[#0A3981] ring-1 ring-slate-200 shadow-sm'
        }`}
      >
        {/* Animated Sun to Moon Icon Swap with Rotation & Scale */}
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="moon-icon"
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex items-center justify-center"
            >
              <Moon className="w-3.5 h-3.5 fill-current text-[#8CE600]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun-icon"
              initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex items-center justify-center"
            >
              <Sun className="w-3.5 h-3.5 fill-current text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};
