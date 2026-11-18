import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find position of the pricing plans section (#plans)
      const plansSection = document.getElementById('plans');
      if (plansSection) {
        const rect = plansSection.getBoundingClientRect();
        // Show after user scrolls past the top of the pricing plans section
        setIsVisible(rect.bottom < window.innerHeight * 0.5 || window.scrollY > 800);
      } else {
        // Fallback: show after 700px scroll
        setIsVisible(window.scrollY > 700);
      }
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-24 sm:right-28 z-40 animate-in fade-in zoom-in-95 duration-200">
      <button
        type="button"
        onClick={scrollToTop}
        className="group flex items-center gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-3 bg-white dark:bg-[#0B192C] hover:bg-[#0A4FD5] text-slate-700 dark:text-slate-200 hover:text-white rounded-full shadow-xl border border-slate-200 dark:border-slate-700 hover:border-[#0A4FD5] transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-95"
        title="Scroll back to top of page"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
        <span className="text-xs font-bold tracking-tight hidden md:inline">
          Back to Top
        </span>
      </button>
    </div>
  );
};
