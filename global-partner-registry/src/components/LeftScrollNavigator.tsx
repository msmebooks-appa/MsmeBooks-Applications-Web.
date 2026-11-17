import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const LeftScrollNavigator: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = Math.max(0, documentHeight - windowHeight);

    setIsAtTop(scrollY <= 20);
    setIsAtBottom(maxScroll <= 0 || scrollY >= maxScroll - 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const scrollUp = () => {
    if (isAtTop) return;
    const step = Math.round(window.innerHeight * 0.75);
    if (window.scrollY <= step) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -step, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (isAtBottom) return;
    const step = Math.round(window.innerHeight * 0.75);
    window.scrollBy({ top: step, behavior: 'smooth' });
  };

  return (
    <aside
      id="left-scroll-navigator"
      data-testid="left-scroll-navigator"
      aria-label="Scroll Up and Down"
      className="fixed left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-40 select-none print:hidden"
    >
      <div
        role="group"
        aria-label="Simple vertical scroll controls"
        className="flex flex-col items-center p-1 gap-1 rounded-2xl bg-white/90 dark:bg-[#0a1e38]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-lg"
      >
        <button
          type="button"
          id="btn-left-scroll-up"
          data-testid="btn-left-scroll-up"
          onClick={scrollUp}
          disabled={isAtTop}
          aria-disabled={isAtTop}
          aria-label="Scroll up"
          title="Scroll up"
          className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-lime-400 ${
            isAtTop
              ? 'opacity-30 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-200 hover:bg-lime-500 hover:text-slate-950 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronUp className="w-5 h-5 stroke-[2.25]" />
        </button>

        <div className="w-5 h-px bg-slate-200 dark:bg-slate-700/80" aria-hidden="true" />

        <button
          type="button"
          id="btn-left-scroll-down"
          data-testid="btn-left-scroll-down"
          onClick={scrollDown}
          disabled={isAtBottom}
          aria-disabled={isAtBottom}
          aria-label="Scroll down"
          title="Scroll down"
          className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-lime-400 ${
            isAtBottom
              ? 'opacity-30 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-200 hover:bg-lime-500 hover:text-slate-950 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronDown className="w-5 h-5 stroke-[2.25]" />
        </button>
      </div>
    </aside>
  );
};
