import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, ShieldCheck, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface StickyBottomCtaBarProps {
  onOpenApply: () => void;
  onOpenVerify?: () => void;
  heroThresholdPx?: number;
}

export const StickyBottomCtaBar: React.FC<StickyBottomCtaBarProps> = ({
  onOpenApply,
  onOpenVerify,
  heroThresholdPx = 520
}) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Show once past hero threshold
          if (currentScrollY > heroThresholdPx) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroThresholdPx]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 50, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 32
          }}
          aria-label="Quick partner application bar"
          className="fixed bottom-3 sm:bottom-5 left-3 right-16 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-30 max-w-2xl sm:w-auto"
        >
          <div className="bg-white/95 dark:bg-[#061F4A]/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-blue-800/80 shadow-2xl dark:shadow-[0_12px_30px_rgba(3,17,41,0.6)] px-3.5 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6 transition-colors">
            {/* Left brand indicator & tagline */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#0A3981] dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-blue-400/20">
                <span className="font-black text-xs">M</span>
                <span className="font-black text-xs text-[#8CE600] -ml-0.5">b</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white leading-tight">
                  <span className="truncate">Become a Certified Partner</span>
                  <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-2.5 h-2.5" /> 15%–40% Rev-Share
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-300 truncate hidden sm:block">
                  {t('hero.cta_become', 'Join the SaaS ecosystem. Build scalable recurring income.')}
                </div>
              </div>
            </div>

            {/* Right CTAs and Dismiss button */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenVerify && (
                <button
                  type="button"
                  onClick={onOpenVerify}
                  className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-slate-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors cursor-pointer"
                  title="Verify existing partner badge"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                  <span>Verify</span>
                </button>
              )}

              {/* Primary Get Started Button */}
              <button
                type="button"
                onClick={onOpenApply}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 text-xs font-extrabold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-[#8CE600] dark:text-[#061F4A] dark:hover:bg-[#9be81c] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8CE600] dark:text-[#061F4A]" />
              </button>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Dismiss quick bar for this session"
                aria-label="Dismiss bottom bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
