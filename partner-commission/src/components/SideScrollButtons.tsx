import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

export const SideScrollButtons: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        setIsAtTop(true);
        setIsAtBottom(true);
        return;
      }

      const progress = Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)));
      setScrollProgress(progress);
      setIsAtTop(scrollY < 40);
      setIsAtBottom(scrollY + windowHeight >= documentHeight - 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollUp = (e: React.MouseEvent) => {
    // If shift is held or double clicked or already near top, jump straight to top
    if (e.shiftKey || isAtBottom || window.scrollY < window.innerHeight) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -Math.round(window.innerHeight * 0.8), behavior: 'smooth' });
    }
  };

  const handleScrollToTopDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    // If shift is held or near bottom, jump straight to bottom
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (e.shiftKey || maxScroll - window.scrollY < window.innerHeight) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: 'smooth' });
    }
  };

  const handleScrollToBottomDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div
      aria-label="Page scroll controls"
      className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none animate-in fade-in duration-300"
    >
      {/* Floating Pill Dock */}
      <div className="bg-white/90 dark:bg-[#142D4E]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-xl shadow-slate-900/10 dark:shadow-black/30 rounded-2xl p-1.5 flex flex-col items-center gap-1.5 transition-all hover:shadow-2xl">
        
        {/* Scroll Up Button */}
        <div className="relative group">
          <button
            onClick={handleScrollUp}
            onDoubleClick={handleScrollToTopDirect}
            onMouseEnter={() => setHoveredButton('up')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Scroll page up"
            title="Scroll up (Double click for Top)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isAtTop
                ? 'text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/30 cursor-default'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-[#1261B5] hover:text-white dark:bg-slate-800 dark:hover:bg-[#1261B5] dark:hover:text-white shadow-xs active:scale-95'
            }`}
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Floating Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#142D4E] dark:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg border border-slate-700/50 whitespace-nowrap flex items-center gap-1.5">
              <span>Scroll Up</span>
              <span className="text-[10px] text-[#B9E51C] font-mono">(Top)</span>
            </div>
            {/* Tooltip arrow */}
            <div className="w-1.5 h-1.5 bg-[#142D4E] dark:bg-slate-900 rotate-45 -ml-1 border-l border-b border-slate-700/50"></div>
          </div>
        </div>

        {/* Scroll Progress Indicator Pill */}
        <div 
          onClick={isAtTop ? handleScrollDown : handleScrollToTopDirect}
          title="Click to jump"
          className="cursor-pointer py-1 px-1.5 flex flex-col items-center justify-center group"
        >
          {/* Circular / Vertical Progress Bar */}
          <div className="w-1.5 h-8 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="w-full bg-[#1261B5] dark:bg-[#B9E51C] rounded-full transition-all duration-150"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>
          <span className="text-[9px] font-bold font-mono text-slate-500 dark:text-slate-400 mt-1">
            {scrollProgress}%
          </span>
        </div>

        {/* Scroll Down Button */}
        <div className="relative group">
          <button
            onClick={handleScrollDown}
            onDoubleClick={handleScrollToBottomDirect}
            onMouseEnter={() => setHoveredButton('down')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Scroll page down"
            title="Scroll down (Double click for Bottom)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isAtBottom
                ? 'text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/30 cursor-default'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-[#1261B5] hover:text-white dark:bg-slate-800 dark:hover:bg-[#1261B5] dark:hover:text-white shadow-xs active:scale-95'
            }`}
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Floating Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#142D4E] dark:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg border border-slate-700/50 whitespace-nowrap flex items-center gap-1.5">
              <span>Scroll Down</span>
              <span className="text-[10px] text-[#B9E51C] font-mono">(Bottom)</span>
            </div>
            {/* Tooltip arrow */}
            <div className="w-1.5 h-1.5 bg-[#142D4E] dark:bg-slate-900 rotate-45 -ml-1 border-l border-b border-slate-700/50"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
