import React, { useState, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Compass,
} from 'lucide-react';

export const LeftScrollNavigator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearTop, setIsNearTop] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;

      setScrollProgress(progress);
      setIsNearTop(scrollY < 120);
      setIsNearBottom(docHeight - scrollY < 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollUp = () => {
    // If within top 15%, scroll all the way to top; otherwise scroll up by ~80% of window height
    if (window.scrollY < window.innerHeight * 0.9) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    // Scroll down by ~80% of window height
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight - window.scrollY < window.innerHeight * 0.9) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const handleJumpTo = (id: string) => {
    setShowQuickMenu(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Left side page scroll controls"
      className="fixed left-3 sm:left-5 bottom-8 z-40 flex flex-col items-center select-none"
    >
      <div className="bg-white/90 dark:bg-[#131D35]/90 backdrop-blur-md rounded-2xl p-1.5 shadow-xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col items-center gap-1 transition-all duration-200">
        {/* Scroll To Absolute Top (Visible when scrolled down) */}
        {!isNearTop && (
          <button
            type="button"
            onClick={handleScrollToTop}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A284A] dark:hover:bg-[#20335C] text-slate-700 dark:text-slate-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
            title="Scroll directly to top of page"
            aria-label="Scroll to top"
          >
            <ChevronsUp className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
          </button>
        )}

        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={handleScrollUp}
          disabled={isNearTop}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isNearTop
              ? 'opacity-35 text-slate-400 dark:text-slate-600 cursor-not-allowed bg-slate-50 dark:bg-[#0D1527]'
              : 'bg-[#0066CC] hover:bg-[#0052A3] dark:bg-[#0066CC] dark:hover:bg-blue-600 text-white shadow-sm hover:scale-105 active:scale-95'
          }`}
          title="Scroll up on left side"
          aria-label="Scroll up page"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Scroll Progress & Section Jump Indicator */}
        <div className="relative py-0.5">
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="px-1.5 py-1 rounded-lg text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] flex flex-col items-center transition-colors cursor-pointer"
            title="Click for quick section navigation"
          >
            <span className="leading-tight">{scrollProgress}%</span>
            <div className="w-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#0066CC] to-[#B5E61D]"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </button>

          {/* Quick Section Jump Dropdown */}
          {showQuickMenu && (
            <div className="absolute left-full ml-2 bottom-0 w-48 bg-white dark:bg-[#131D35] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-1.5 text-xs animate-in fade-in slide-in-from-left-2 duration-150 z-50">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Jump to Section</span>
              </div>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Top / Hero Banner
              </button>
              <button
                type="button"
                onClick={() => handleJumpTo('job-board')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Job Board & Filters
              </button>
              <button
                type="button"
                onClick={() => handleJumpTo('why-msmebooks')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Why Work Here
              </button>
              <button
                type="button"
                onClick={() => handleJumpTo('life-at-msmebooks')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Culture & Photos
              </button>
              <button
                type="button"
                onClick={() => handleJumpTo('partner-ecosystem')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Recruitment Module
              </button>
              <button
                type="button"
                onClick={() => handleJumpTo('pricing')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                Pricing Plans
              </button>
              <button
                type="button"
                onClick={handleScrollToBottom}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-lg text-slate-800 dark:text-slate-200 font-medium border-t border-slate-100 dark:border-slate-800 mt-1 pt-1"
              >
                Footer / Bottom
              </button>
            </div>
          )}
        </div>

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={handleScrollDown}
          disabled={isNearBottom}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isNearBottom
              ? 'opacity-35 text-slate-400 dark:text-slate-600 cursor-not-allowed bg-slate-50 dark:bg-[#0D1527]'
              : 'bg-[#0066CC] hover:bg-[#0052A3] dark:bg-[#0066CC] dark:hover:bg-blue-600 text-white shadow-sm hover:scale-105 active:scale-95'
          }`}
          title="Scroll down on left side"
          aria-label="Scroll down page"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Scroll To Absolute Bottom (Visible when not near bottom) */}
        {!isNearBottom && (
          <button
            type="button"
            onClick={handleScrollToBottom}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A284A] dark:hover:bg-[#20335C] text-slate-700 dark:text-slate-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
            title="Scroll directly to bottom of page"
            aria-label="Scroll to bottom"
          >
            <ChevronsDown className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
          </button>
        )}
      </div>
    </aside>
  );
};
