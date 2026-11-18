import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

interface PageScrollNavProps {
  sections: string[];
}

export const PageScrollNav: React.FC<PageScrollNavProps> = ({ sections }) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      setCanScrollUp(scrollY > 100);
      setCanScrollDown(scrollY < maxScroll - 100);

      // Determine current section index
      const scrollPosition = scrollY + 250;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSectionIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToPrevious = () => {
    if (currentSectionIndex > 0) {
      const prevSectionId = sections[currentSectionIndex - 1];
      const el = document.getElementById(prevSectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextSectionId = sections[currentSectionIndex + 1];
      const el = document.getElementById(nextSectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Page scroll navigation"
      className="fixed left-3 sm:left-6 bottom-8 z-40 flex flex-col items-center gap-1.5 p-1.5 bg-blue-950/90 hover:bg-blue-950 dark:bg-slate-900/90 dark:hover:bg-slate-900 text-white rounded-2xl shadow-xl border border-blue-800/80 dark:border-slate-700/80 backdrop-blur-md transition-all duration-200"
    >
      {/* Up Button */}
      <button
        onClick={scrollToPrevious}
        disabled={!canScrollUp && currentSectionIndex === 0}
        aria-label="Scroll up to previous section"
        title="Scroll up"
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          !canScrollUp && currentSectionIndex === 0
            ? 'opacity-40 cursor-not-allowed text-slate-400'
            : 'text-lime-400 hover:text-white hover:bg-white/15 active:scale-95'
        }`}
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Subtle Divider / Indicator */}
      <div className="w-4 h-[1px] bg-white/20" />

      {/* Down Button */}
      <button
        onClick={scrollToNext}
        disabled={!canScrollDown && currentSectionIndex === sections.length - 1}
        aria-label="Scroll down to next section"
        title="Scroll down"
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          !canScrollDown && currentSectionIndex === sections.length - 1
            ? 'opacity-40 cursor-not-allowed text-slate-400'
            : 'text-lime-400 hover:text-white hover:bg-white/15 active:scale-95'
        }`}
      >
        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
      </button>
    </aside>
  );
};
