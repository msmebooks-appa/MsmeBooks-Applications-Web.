import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronUp, ChevronDown, Compass, ChevronsUp, ChevronsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LeftScrollControls: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100))) : 0;
      setScrollProgress(progress);

      setIsAtTop(scrollTop <= 40);
      setIsAtBottom(scrollTop + windowHeight >= documentHeight - 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollStepUp = () => {
    window.scrollBy({
      top: -window.innerHeight * 0.75,
      behavior: 'smooth'
    });
  };

  const scrollStepDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.75,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Desktop Multi-Function Dock (Hidden on mobile to prevent text clipping) */}
      <div 
        className="fixed left-3 sm:left-6 bottom-8 z-40 hidden md:flex flex-col items-center select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Scroll Controls Pill Container */}
        <div className="bg-white/95 dark:bg-[#072457]/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-blue-800/80 shadow-xl shadow-slate-900/10 dark:shadow-black/30 p-1.5 flex flex-col items-center gap-1 transition-all duration-200 hover:shadow-2xl hover:border-[#0A3981]/40 dark:hover:border-[#8CE600]/40">
          
          {/* Scroll To Top Button */}
          <button
            onClick={scrollToTop}
            disabled={isAtTop}
            title="Scroll to Top of Page"
            aria-label="Scroll to top"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isAtTop
                ? 'text-slate-300 dark:text-blue-900/60 cursor-not-allowed opacity-40'
                : 'text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-[#061F4A] hover:bg-[#0A3981] dark:hover:bg-[#8CE600] active:scale-95 shadow-xs'
            }`}
          >
            <ChevronsUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Step Up Button */}
          <button
            onClick={scrollStepUp}
            disabled={isAtTop}
            title="Scroll Up One Screen"
            aria-label="Scroll up"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isAtTop
                ? 'text-slate-300 dark:text-blue-900/60 cursor-not-allowed opacity-30'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-slate-100 dark:hover:bg-blue-900/40 active:scale-95'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Circular Scroll Progress Ring & Percentage */}
          <div 
            className="my-0.5 relative flex items-center justify-center w-8 h-8 cursor-pointer group"
            onClick={scrollProgress > 50 ? scrollToTop : scrollToBottom}
            title={`Page Scroll: ${scrollProgress}% (Click to ${scrollProgress > 50 ? 'jump to top' : 'jump to bottom'})`}
          >
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="12"
                className="text-slate-100 dark:text-blue-950/80 stroke-current"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                className="text-[#0A3981] dark:text-[#8CE600] stroke-current transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={75.4}
                strokeDashoffset={75.4 - (75.4 * scrollProgress) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[9px] font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform">
              {scrollProgress}%
            </span>
          </div>

          {/* Step Down Button */}
          <button
            onClick={scrollStepDown}
            disabled={isAtBottom}
            title="Scroll Down One Screen"
            aria-label="Scroll down"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isAtBottom
                ? 'text-slate-300 dark:text-blue-900/60 cursor-not-allowed opacity-30'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-slate-100 dark:hover:bg-blue-900/40 active:scale-95'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Scroll To Bottom Button */}
          <button
            onClick={scrollToBottom}
            disabled={isAtBottom}
            title="Scroll to Bottom of Page"
            aria-label="Scroll to bottom"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isAtBottom
                ? 'text-slate-300 dark:text-blue-900/60 cursor-not-allowed opacity-40'
                : 'text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-[#061F4A] hover:bg-[#0A3981] dark:hover:bg-[#8CE600] active:scale-95 shadow-xs'
            }`}
          >
            <ChevronsDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Floating Left Tag on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="hidden sm:block absolute left-full ml-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/90 dark:bg-black/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg pointer-events-none"
            >
              Scroll Controls (Top · Down · Progress)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-Only Subtle Floating Scroll-To-Top Button (Only appears when scrolled > 15%) */}
      <AnimatePresence>
        {!isAtTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            title="Back to Top"
            aria-label="Back to Top"
            className="md:hidden fixed left-3.5 bottom-6 z-40 w-10 h-10 rounded-full bg-[#0A3981]/90 dark:bg-[#072457]/95 text-white dark:text-[#8CE600] border border-white/20 dark:border-blue-700 shadow-xl backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronsUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
