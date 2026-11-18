import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const LeftScrollNavigation: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  // List of major sections on the landing page for smooth stepwise or fast navigation
  const sectionIds = [
    'hero',
    'plans',
    'savings-calculator',
    'plan-matcher',
    'comparison',
    'ai-assistant',
    'african-focus',
    'testimonials',
    'faq',
    'final-cta',
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setScrollProgress(progress);
      setCanScrollUp(scrollTop > 150);
      setCanScrollDown(scrollTop < scrollHeight - 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = (direction: 'up' | 'down') => {
    const currentScroll = window.scrollY + 80;

    // Find section offsets
    const offsets: { id: string; top: number }[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        offsets.push({ id, top });
      }
    });

    if (direction === 'down') {
      const next = offsets.find((item) => item.top > currentScroll + 50);
      if (next) {
        window.scrollTo({ top: next.top, behavior: 'smooth' });
      } else {
        // Fallback: scroll one viewport down or to bottom
        window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
      }
    } else {
      const prevList = offsets.filter((item) => item.top < currentScroll - 50);
      if (prevList.length > 0) {
        const prev = prevList[prevList.length - 1];
        window.scrollTo({ top: Math.max(0, prev.top), behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 select-none"
      role="navigation"
      aria-label="Vertical Page Navigation"
    >
      <div className="flex flex-col items-center bg-white/95 dark:bg-[#0B192C]/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 transition-all duration-300">
        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={() => scrollToNextSection('up')}
          disabled={!canScrollUp}
          className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
            canScrollUp
              ? 'text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#0A4FD5] active:scale-95'
              : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
          }`}
          title="Scroll up to previous section"
          aria-label="Scroll Up"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Minimal Scroll Progress Track Indicator */}
        <div className="my-1.5 w-1 h-10 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="w-full bg-gradient-to-b from-[#0A4FD5] to-[#84CC16] rounded-full transition-all duration-150"
            style={{ height: `${Math.min(100, Math.max(8, scrollProgress))}%` }}
          />
        </div>

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={() => scrollToNextSection('down')}
          disabled={!canScrollDown}
          className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
            canScrollDown
              ? 'text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#0A4FD5] active:scale-95'
              : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
          }`}
          title="Scroll down to next section"
          aria-label="Scroll Down"
        >
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Label tooltip indicator */}
      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:block">
        Navigate
      </span>
    </div>
  );
};
