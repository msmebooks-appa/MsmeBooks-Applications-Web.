import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SCROLL_THRESHOLD = 360;
const RING_RADIUS = 20;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const ScrollToTopButton: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

    setIsVisible(scrollY > SCROLL_THRESHOLD);
    setProgress(ratio);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollToHero = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 print:hidden transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative group">
        {/* Hover Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap hidden sm:block"
        >
          <div className="bg-slate-900 dark:bg-zinc-950 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 dark:border-zinc-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
            <span>{t.back_to_top}</span>
          </div>
        </div>

        {/* Floating Button with Scroll Progress Ring */}
        <button
          type="button"
          onClick={scrollToHero}
          aria-label={t.back_to_top}
          title={t.back_to_top}
          className="relative w-12 h-12 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-900/10 dark:shadow-black/80 flex items-center justify-center text-[#0B4EA2] dark:text-[#38BDF8] hover:border-[#0B4EA2] dark:hover:border-[#38BDF8] hover:bg-blue-50/70 dark:hover:bg-zinc-900 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16]"
        >
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2.25"
              className="stroke-slate-200/70 dark:stroke-zinc-800"
            />
            <circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className="stroke-[#84CC16] transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>

          <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
