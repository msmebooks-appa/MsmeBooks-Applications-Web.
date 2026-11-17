import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const ScrollNavigation: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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

  return (
    <div 
      aria-label="Quick Page Navigation"
      className="fixed left-4 bottom-8 z-40 flex flex-col items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-lg shadow-slate-900/10 transition-all duration-300"
    >
      <button
        onClick={scrollToTop}
        title="Scroll to Top"
        aria-label="Scroll to top of page"
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          showScrollTop 
            ? 'text-slate-700 dark:text-slate-200 hover:bg-[#0B4F9C] hover:text-white dark:hover:bg-[#0B4F9C]' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>

      <div className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800 my-0.5" />

      <button
        onClick={scrollToBottom}
        title="Scroll to Bottom"
        aria-label="Scroll to bottom of page"
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#0B4F9C] hover:text-white dark:hover:bg-[#0B4F9C] transition-all cursor-pointer"
      >
        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
