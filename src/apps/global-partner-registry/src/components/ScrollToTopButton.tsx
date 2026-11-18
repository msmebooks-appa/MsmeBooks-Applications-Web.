import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScrollToTopButtonProps {
  /** Target element id to scroll past before displaying the button. Defaults to 'hero'. */
  heroElementId?: string;
  /** Navigation target to scroll up to. Defaults to window top/navbar. */
  targetElementId?: string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  heroElementId = 'hero',
  targetElementId = 'navbar',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElement = document.getElementById(heroElementId);

      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        setIsVisible(scrollY > 150);
      } else {
        setIsVisible(scrollY > 200);
      }

      // Compute circular scroll progress percentage
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100)));
        setScrollProgress(progress);
        setIsNearBottom(docHeight - scrollY < 120);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroElementId]);

  const scrollToTop = () => {
    const navEl = document.getElementById(targetElementId);
    if (navEl) {
      navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  // SVG circular progress calculation (radius = 18, circumference = 2 * PI * 18 ~ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      id="scroll-navigator-container"
      data-testid="scroll-to-top-container"
      className="fixed bottom-36 right-5 sm:bottom-40 sm:right-7 z-40 flex flex-col items-center gap-1.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
      aria-label="Page scroll navigator"
    >
      {/* Scroll Up Button */}
      <button
        type="button"
        id="btn-scroll-to-top"
        data-testid="btn-scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll up to top of page"
        title={`Scroll to top (${scrollProgress}% scrolled)`}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#0a1e38] text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700/80 shadow-xl hover:shadow-2xl hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md focus:outline-hidden focus:ring-2 focus:ring-lime-400"
      >
        {/* Subtle Radial Progress Ring SVG */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 44 44"
          aria-hidden="true"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-slate-100 dark:text-slate-800/80 stroke-current"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-lime-500 dark:text-lime-400 stroke-current transition-all duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Up Arrow Icon */}
        <ChevronUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 transform group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />

        {/* Hover Tooltip */}
        <span className="pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          Scroll to Top
        </span>
      </button>

      {/* Scroll Down Button */}
      <button
        type="button"
        id="btn-scroll-to-bottom"
        data-testid="btn-scroll-to-bottom"
        onClick={scrollToBottom}
        disabled={isNearBottom}
        aria-label="Scroll down to page footer"
        title={isNearBottom ? 'Reached end of page' : 'Scroll to bottom'}
        className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-md transition-all duration-200 backdrop-blur-md focus:outline-hidden focus:ring-2 focus:ring-lime-400 ${
          isNearBottom
            ? 'bg-slate-100/70 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-50'
            : 'bg-white dark:bg-[#0a1e38] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 hover:scale-105 active:scale-95'
        }`}
      >
        <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 transform group-hover:translate-y-0.5 transition-transform duration-200 shrink-0" />

        {/* Hover Tooltip */}
        <span className="pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          Scroll to Bottom
        </span>
      </button>
    </div>
  );
};
