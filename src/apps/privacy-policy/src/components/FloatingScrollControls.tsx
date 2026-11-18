import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const FloatingScrollControls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const checkScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      setCanScrollUp(winScroll > 100);
      setCanScrollDown(winScroll < height - 100);

      const percent = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, percent)));
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScrollUp = () => {
    window.scrollBy({
      top: -Math.round(window.innerHeight * 0.75),
      behavior: 'smooth'
    });
  };

  const handleScrollDown = () => {
    window.scrollBy({
      top: Math.round(window.innerHeight * 0.75),
      behavior: 'smooth'
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <aside
      aria-label="Page scroll navigation"
      className="fixed left-4 sm:left-6 bottom-8 z-40 flex flex-col items-center select-none no-print transition-all duration-200"
    >
      <div className="bg-white/95 dark:bg-[#111C30]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 flex flex-col items-center gap-1 text-slate-700 dark:text-slate-200">
        {/* Scroll To Very Top Button */}
        <button
          onClick={handleScrollToTop}
          disabled={!canScrollUp}
          title="Jump to Top"
          aria-label="Jump to top of page"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#1455C0] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors group relative"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="sr-only">Top</span>
        </button>

        {/* Scroll Up Step Button */}
        <button
          onClick={handleScrollUp}
          disabled={!canScrollUp}
          title="Scroll Up"
          aria-label="Scroll up"
          className="p-2 rounded-xl bg-slate-50 dark:bg-[#16233B] hover:bg-[#1455C0] hover:text-white dark:hover:bg-[#155de0] text-[#172B4D] dark:text-white disabled:opacity-30 disabled:hover:bg-slate-50 dark:disabled:hover:bg-[#16233B] transition-colors shadow-2xs"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="sr-only">Scroll Up</span>
        </button>

        {/* Progress percent meter */}
        <div
          title={`Document Progress: ${Math.round(scrollPercent)}%`}
          className="py-1 px-1.5 flex flex-col items-center gap-0.5"
        >
          <span className="text-[10px] font-mono font-bold text-[#1455C0] dark:text-[#5B95FF] leading-none">
            {Math.round(scrollPercent)}%
          </span>
          <div className="w-4 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1455C0] to-[#B8E62E]"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
        </div>

        {/* Scroll Down Step Button */}
        <button
          onClick={handleScrollDown}
          disabled={!canScrollDown}
          title="Scroll Down"
          aria-label="Scroll down"
          className="p-2 rounded-xl bg-slate-50 dark:bg-[#16233B] hover:bg-[#1455C0] hover:text-white dark:hover:bg-[#155de0] text-[#172B4D] dark:text-white disabled:opacity-30 disabled:hover:bg-slate-50 dark:disabled:hover:bg-[#16233B] transition-colors shadow-2xs"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="sr-only">Scroll Down</span>
        </button>

        {/* Scroll To Bottom Button */}
        <button
          onClick={handleScrollToBottom}
          disabled={!canScrollDown}
          title="Jump to Bottom"
          aria-label="Jump to bottom of page"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#1455C0] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
          <span className="sr-only">Bottom</span>
        </button>

        {/* Floating Theme Toggle */}
        <div className="w-full pt-1 mt-0.5 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <button
            onClick={toggleTheme}
            title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-[#1455C0] dark:hover:text-[#B8E62E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#B8E62E]" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
