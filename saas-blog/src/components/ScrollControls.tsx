import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ScrollControls: React.FC = () => {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      setAtTop(scrollY <= 40);
      setAtBottom(scrollY + winHeight >= docHeight - 40);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className="fixed left-3 sm:left-5 bottom-5 sm:bottom-6 z-40 flex flex-col bg-white/95 dark:bg-[#0B1E36]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl shadow-lg overflow-hidden"
      role="group"
      aria-label="Page scroll controls"
    >
      <button
        type="button"
        onClick={scrollToTop}
        disabled={atTop}
        aria-label="Scroll up to top"
        title="Scroll to top"
        className={`p-2.5 sm:p-3 transition-colors flex items-center justify-center ${
          atTop
            ? 'text-slate-300 dark:text-slate-600 cursor-default'
            : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#102A4C] hover:text-blue-700 dark:hover:text-lime-400 active:scale-95 cursor-pointer'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <div className="h-px bg-slate-200/80 dark:bg-slate-700/80" />

      <button
        type="button"
        onClick={scrollToBottom}
        disabled={atBottom}
        aria-label="Scroll down to bottom"
        title="Scroll to bottom"
        className={`p-2.5 sm:p-3 transition-colors flex items-center justify-center ${
          atBottom
            ? 'text-slate-300 dark:text-slate-600 cursor-default'
            : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#102A4C] hover:text-blue-700 dark:hover:text-lime-400 active:scale-95 cursor-pointer'
        }`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};
