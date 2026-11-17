import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LeftScrollControls: React.FC = () => {
  const { t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearTop, setIsNearTop] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'up' | 'down' | 'progress' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;
      setScrollProgress(progress);
      setIsNearTop(scrollTop < 80);
      setIsNearBottom(docHeight - scrollTop < 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollStepDown = () => {
    // Scroll down by 85% of viewport height or to bottom if close
    const currentY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.min(maxScroll, currentY + window.innerHeight * 0.85);
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const scrollStepUp = () => {
    const currentY = window.scrollY;
    const targetY = Math.max(0, currentY - window.innerHeight * 0.85);
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Page scroll navigation"
      className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 select-none print:hidden animate-in fade-in slide-in-from-left duration-300"
    >
      <div className="flex flex-col items-center bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#1464C8]/50 dark:hover:border-[#1464C8] transition-all group">
        
        {/* Scroll Up Button */}
        <div className="relative">
          <button
            type="button"
            onClick={scrollToTop}
            onMouseEnter={() => setHoveredButton('up')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={isNearTop}
            aria-label={t('scroll.up')}
            title={t('scroll.up')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isNearTop
                ? 'text-slate-300 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed opacity-50'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-[#1464C8] hover:text-white dark:hover:bg-[#1464C8] dark:hover:text-white hover:scale-105 active:scale-95 shadow-xs'
            }`}
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Tooltip to the Right */}
          {hoveredButton === 'up' && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-white bg-[#102B4E] dark:bg-slate-800 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-150 flex items-center gap-1.5 border border-white/10">
              <span>{t('scroll.up')}</span>
              <span className="text-[10px] text-[#B7E532]">Top</span>
            </div>
          )}
        </div>

        {/* Scroll Progress Ring Indicator */}
        <div 
          className="relative my-1 cursor-default"
          onMouseEnter={() => setHoveredButton('progress')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex flex-col items-center justify-center relative">
            {/* SVG Circular Progress Ring */}
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#1464C8] dark:text-[#B7E532] transition-all duration-150"
                strokeDasharray={`${scrollProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-slate-700 dark:text-slate-200">
              {scrollProgress}%
            </span>
          </div>

          {/* Progress Tooltip */}
          {hoveredButton === 'progress' && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-white bg-[#102B4E] dark:bg-slate-800 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-150 flex items-center gap-1.5 border border-white/10">
              <span>{t('scroll.progress')}: {scrollProgress}%</span>
            </div>
          )}
        </div>

        {/* Scroll Down Button */}
        <div className="relative">
          <button
            type="button"
            onClick={scrollToBottom}
            onMouseEnter={() => setHoveredButton('down')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={isNearBottom}
            aria-label={t('scroll.down')}
            title={t('scroll.down')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isNearBottom
                ? 'text-slate-300 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed opacity-50'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-[#1464C8] hover:text-white dark:hover:bg-[#1464C8] dark:hover:text-white hover:scale-105 active:scale-95 shadow-xs'
            }`}
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Tooltip to the Right */}
          {hoveredButton === 'down' && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-white bg-[#102B4E] dark:bg-slate-800 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-150 flex items-center gap-1.5 border border-white/10">
              <span>{t('scroll.down')}</span>
              <span className="text-[10px] text-[#B7E532]">Bottom</span>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
