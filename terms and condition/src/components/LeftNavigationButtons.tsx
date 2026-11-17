import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SectionItem } from '../types/terms';
import { TranslationDictionary } from '../data/translations';

interface LeftNavigationButtonsProps {
  sections: SectionItem[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  t: TranslationDictionary;
}

export const LeftNavigationButtons: React.FC<LeftNavigationButtonsProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  t
}) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  // Find index of current section
  const currentIndex = sections.findIndex(s => s.id === activeSectionId);
  const currentSectionNumber = currentIndex >= 0 ? sections[currentIndex].number : 1;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight - 50;

      setCanScrollUp(scrollY > 120);
      setCanScrollDown(scrollY < maxScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to previous section or top
  const handleScrollUp = () => {
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      onSelectSection(prevSection.id);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigate to next section or bottom
  const handleScrollDown = () => {
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      onSelectSection(nextSection.id);
    } else {
      const relatedDoc = document.getElementById('related-documents');
      if (relatedDoc) {
        relatedDoc.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  // Direct Jump to Top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Jump to Bottom
  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 no-print flex flex-col items-center"
      aria-label="Page navigation controls"
    >
      <div className="bg-white/95 dark:bg-[#0A1A2C]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-1.5 flex flex-col items-center gap-1.5">
        {/* Scroll Up Button */}
        <button
          onClick={handleScrollUp}
          disabled={!canScrollUp && currentIndex <= 0}
          className={`group relative p-2.5 rounded-xl transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#84CC16] ${
            !canScrollUp && currentIndex <= 0
              ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'text-[#0B3558] dark:text-[#38BDF8] hover:bg-[#F0F7FD] dark:hover:bg-[#0D2238] hover:scale-105 active:scale-95'
          }`}
          aria-label="Scroll Up to previous section"
          title={t.leftNav.upTooltip}
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5] text-[#0B3558] dark:text-[#38BDF8] group-hover:text-[#84CC16] dark:group-hover:text-[#84CC16] transition-colors" />

          {/* Floating Tooltip to the right */}
          <span className="pointer-events-none absolute left-full ml-2.5 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0B3558] dark:bg-[#06182B] border dark:border-slate-700/80 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {currentIndex > 0 ? `${t.leftNav.upTooltip}: ${currentSectionNumber - 1}` : t.leftNav.topTooltip}
          </span>
        </button>

        {/* Section Counter Badge */}
        <div 
          onClick={currentIndex > 0 ? handleScrollToTop : handleScrollToBottom}
          className="cursor-pointer py-1 px-1.5 flex flex-col items-center justify-center border-y border-slate-100 dark:border-slate-800 group relative w-full"
          title="Current Section / Click to toggle top/bottom"
        >
          <span className="text-[10px] font-bold text-[#84CC16] font-mono leading-none">
            {String(currentSectionNumber).padStart(2, '0')}
          </span>
          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
            /{sections.length}
          </span>

          {/* Tooltip on badge */}
          <span className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-700 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {sections[currentIndex]?.title ? `${sections[currentIndex].title.slice(0, 24)}...` : 'Jump Top/Bottom'}
          </span>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={handleScrollDown}
          disabled={!canScrollDown && currentIndex >= sections.length - 1}
          className={`group relative p-2.5 rounded-xl transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#84CC16] ${
            !canScrollDown && currentIndex >= sections.length - 1
              ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'text-[#0B3558] dark:text-[#38BDF8] hover:bg-[#F0F7FD] dark:hover:bg-[#0D2238] hover:scale-105 active:scale-95'
          }`}
          aria-label="Scroll Down to next section"
          title={t.leftNav.downTooltip}
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5] text-[#0B3558] dark:text-[#38BDF8] group-hover:text-[#84CC16] dark:group-hover:text-[#84CC16] transition-colors" />

          {/* Floating Tooltip to the right */}
          <span className="pointer-events-none absolute left-full ml-2.5 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0B3558] dark:bg-[#06182B] border dark:border-slate-700/80 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {currentIndex < sections.length - 1 ? `${t.leftNav.downTooltip}: ${currentSectionNumber + 1}` : t.leftNav.bottomTooltip}
          </span>
        </button>
      </div>
    </div>
  );
};
