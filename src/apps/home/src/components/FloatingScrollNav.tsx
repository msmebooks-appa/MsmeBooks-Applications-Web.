import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SectionItem {
  id: string;
  name: string;
  shortLabel: string;
}

const LANDING_SECTIONS: SectionItem[] = [
  { id: 'hero', name: 'Overview', shortLabel: 'Hero' },
  { id: 'ecosystem', name: 'Ecosystem & FX', shortLabel: 'Ecosystem' },
  { id: 'features', name: 'Financial Modules', shortLabel: 'Features' },
  { id: 'industries', name: 'Industry Blueprints', shortLabel: 'Industries' },
  { id: 'multibranch', name: 'Multi-Branch', shortLabel: 'Branches' },
  { id: 'ecommerce', name: 'Storefront & POS', shortLabel: 'Storefront' },
  { id: 'ai-assistant', name: 'AI Assistant', shortLabel: 'AI Assistant' },
  { id: 'bi', name: 'Business Intelligence & Map', shortLabel: 'BI & Map' },
  { id: 'testimonials', name: 'Client Reviews', shortLabel: 'Reviews' },
];

export const FloatingScrollNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      setIsAtTop(scrollY < 60);
      setIsAtBottom(docHeight > 0 && scrollY >= docHeight - 80);

      const viewportMid = scrollY + window.innerHeight * 0.35;
      let current = LANDING_SECTIONS[0].id;

      for (const section of LANDING_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (top <= viewportMid) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleMoveUp = () => {
    const currentIndex = LANDING_SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      scrollToSection(LANDING_SECTIONS[currentIndex - 1].id);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMoveDown = () => {
    const currentIndex = LANDING_SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex < LANDING_SECTIONS.length - 1 && currentIndex !== -1) {
      scrollToSection(LANDING_SECTIONS[currentIndex + 1].id);
    } else {
      window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Scroll Navigation"
      className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center select-none"
    >
      <div className="bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md p-1 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-900/10 dark:shadow-black/50 flex flex-col items-center gap-1 transition-all">
        {/* Compact Up Button */}
        <button
          onClick={handleMoveUp}
          disabled={isAtTop}
          title="Scroll Up"
          aria-label="Scroll Up"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            isAtTop
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              : 'text-slate-700 dark:text-slate-200 hover:bg-[#0866FF] hover:text-white dark:hover:bg-[#0866FF] dark:hover:text-white active:scale-95'
          }`}
        >
          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="w-3 h-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Compact Down Button */}
        <button
          onClick={handleMoveDown}
          disabled={isAtBottom}
          title="Scroll Down"
          aria-label="Scroll Down"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            isAtBottom
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              : 'text-slate-700 dark:text-slate-200 hover:bg-[#0866FF] hover:text-white dark:hover:bg-[#0866FF] dark:hover:text-white active:scale-95'
          }`}
        >
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};
