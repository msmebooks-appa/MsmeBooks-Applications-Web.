import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUp, 
  ArrowUp,
  ChevronsDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const ScrollNavigationButton: React.FC = () => {
  const { language } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showQuickJumps, setShowQuickJumps] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollProgress(progress);
      }

      setIsAtTop(scrollTop < 80);
      setIsAtBottom(scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollUp = () => {
    if (window.scrollY <= window.innerHeight) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - window.innerHeight) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToBottom = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const isFrench = language === 'fr';
  const isPastHalfway = scrollProgress > 50;

  return (
    <aside
      aria-label={isFrench ? "Navigation de défilement haut et bas" : "Page scroll navigation up and down"}
      className="fixed left-3 sm:left-6 bottom-6 sm:bottom-8 z-30 select-none"
      onMouseEnter={() => setShowQuickJumps(true)}
      onMouseLeave={() => setShowQuickJumps(false)}
    >
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 dark:border-slate-800 hover:border-lime-400/70 transition-colors shadow-2xl rounded-2xl p-1.5 flex flex-col items-center gap-1.5 text-slate-200">
        
        {/* DEDICATED "BACK TO TOP" BUTTON WHEN SCROLLED > 50% */}
        <AnimatePresence>
          {isPastHalfway && (
            <motion.button
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleScrollToTop}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold flex flex-col items-center justify-center shadow-lg shadow-lime-400/30 cursor-pointer transition transform hover:scale-105 active:scale-95 group relative mb-0.5"
              title={isFrench ? "Retour en haut (>50% parcouru)" : "Back to top (>50% scrolled)"}
              aria-label={isFrench ? "Retour en haut" : "Back to top"}
            >
              <ArrowUp className="w-4 h-4 stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                {isFrench ? "TOP" : "TOP"}
              </span>

              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 text-lime-400 text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                {isFrench ? "Retourner en haut de page" : "Back to top"}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick jump to Top when hovering and under 50% */}
        <AnimatePresence>
          {showQuickJumps && !isAtTop && !isPastHalfway && (
            <motion.button
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleScrollToTop}
              className="w-9 h-7 flex items-center justify-center text-slate-400 hover:text-lime-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group relative"
              title={isFrench ? "Aller tout en haut" : "Jump to top"}
              aria-label={isFrench ? "Aller tout en haut" : "Jump to top"}
            >
              <ChevronsUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="sr-only">{isFrench ? "Haut" : "Top"}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Move Up Step Button */}
        <button
          type="button"
          onClick={handleScrollUp}
          disabled={isAtTop}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
            isAtTop
              ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
              : 'text-slate-100 bg-slate-800 hover:bg-blue-600 hover:text-white shadow-md active:scale-95'
          }`}
          title={isFrench ? "Monter (Défiler vers le haut)" : "Move Up (Scroll up)"}
          aria-label={isFrench ? "Monter vers le haut" : "Move up"}
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none mt-0.5">
            {isFrench ? "Haut" : "Up"}
          </span>

          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            {isFrench ? "Monter d'un écran" : "Move Up"}
          </span>
        </button>

        {/* Scroll percentage indicator & mini progress bar */}
        <div 
          className="w-full py-1 flex flex-col items-center justify-center cursor-pointer group relative"
          onClick={isPastHalfway ? handleScrollToTop : handleScrollUp}
          title={isFrench ? `Progression : ${scrollProgress}% (Cliquer pour ${isPastHalfway ? 'retourner en haut' : 'monter'})` : `Scroll: ${scrollProgress}% (Click for ${isPastHalfway ? 'back to top' : 'up'})`}
        >
          <div className="w-7 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 my-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-150 ${
                isPastHalfway ? 'bg-gradient-to-r from-lime-400 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-lime-400'
              }`}
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className={`text-[9px] font-extrabold font-grotesk tracking-tight ${
            isPastHalfway ? 'text-lime-400' : 'text-slate-300'
          }`}>
            {scrollProgress}%
          </span>

          {/* Floating Tooltip */}
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            {isFrench 
              ? `${scrollProgress}% défilé${isPastHalfway ? ' • Plus de 50%' : ''}` 
              : `${scrollProgress}% scrolled${isPastHalfway ? ' • Over 50% (Back to Top ready)' : ''}`}
          </span>
        </div>

        {/* Move Down Step Button */}
        <button
          type="button"
          onClick={handleScrollDown}
          disabled={isAtBottom}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
            isAtBottom
              ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
              : 'text-slate-100 bg-slate-800 hover:bg-lime-400 hover:text-slate-950 shadow-md active:scale-95'
          }`}
          title={isFrench ? "Descendre (Défiler vers le bas)" : "Move Down (Scroll down)"}
          aria-label={isFrench ? "Descendre vers le bas" : "Move down"}
        >
          <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none mb-0.5">
            {isFrench ? "Bas" : "Down"}
          </span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />

          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            {isFrench ? "Descendre d'un écran" : "Move Down"}
          </span>
        </button>

        {/* Quick jump to Bottom when hovering */}
        <AnimatePresence>
          {showQuickJumps && !isAtBottom && (
            <motion.button
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleScrollToBottom}
              className="w-9 h-7 flex items-center justify-center text-slate-400 hover:text-lime-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group relative"
              title={isFrench ? "Aller tout en bas" : "Jump to bottom"}
              aria-label={isFrench ? "Aller tout en bas" : "Jump to bottom"}
            >
              <ChevronsDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="sr-only">{isFrench ? "Bas" : "Bottom"}</span>
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </aside>
  );
};
