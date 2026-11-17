import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';

interface SectionTarget {
  id: string;
  name: string;
}

const SECTION_TARGETS: SectionTarget[] = [
  { id: 'hero-section', name: 'Top / Search' },
  { id: 'faq-categories', name: 'Categories' },
  { id: 'featured-faqs', name: 'Popular FAQs' },
  { id: 'faq-explorer', name: 'FAQ Explorer' },
  { id: 'industries', name: 'Industries' },
  { id: 'shared-faqs', name: 'Shared Hubs' },
  { id: 'pricing', name: 'Pricing & Calculator' },
  { id: 'contact', name: 'Support Channels' },
  { id: 'footer', name: 'Footer' },
];

export const PageNavigationControls: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [activeSectionName, setActiveSectionName] = useState('Top / Search');
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll position, section in view, and scroll percentage
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = Math.max(1, scrollHeight - innerHeight);

    const progress = Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)));
    setScrollProgress(progress);

    setIsAtTop(scrollY <= 20);
    setIsAtBottom(scrollY + innerHeight >= scrollHeight - 30);

    // Identify current active section
    let currentName = SECTION_TARGETS[0].name;
    for (const section of SECTION_TARGETS) {
      const el = document.getElementById(section.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // If section header or body is near top third of viewport
        if (rect.top <= innerHeight * 0.45 && rect.bottom >= 80) {
          currentName = section.name;
        }
      }
    }
    setActiveSectionName(currentName);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Find target sections and their positions
  const getSectionOffsets = useCallback(() => {
    const offsets: { id: string; name: string; top: number }[] = [];

    // Always include top of page
    offsets.push({ id: 'top', name: 'Top / Search', top: 0 });

    SECTION_TARGETS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = window.scrollY + el.getBoundingClientRect().top - 70; // 70px offset for sticky header
        offsets.push({ id: sec.id, name: sec.name, top: Math.max(0, top) });
      }
    });

    // Always include bottom of page
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    offsets.push({ id: 'bottom', name: 'Footer', top: maxScroll });

    // Deduplicate and sort by top ascending
    const unique = Array.from(new Map(offsets.map((item) => [Math.round(item.top), item])).values());
    unique.sort((a, b) => a.top - b.top);
    return unique;
  }, []);

  // Scroll UP to previous section or top
  const handleScrollUp = (e?: React.MouseEvent) => {
    if (e?.shiftKey) {
      // Shift+Click: Fast jump to absolute top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentScrollY = window.scrollY;
    const sections = getSectionOffsets();

    // Find the closest section above current scroll position (with a small buffer)
    const prevSections = sections.filter((s) => s.top < currentScrollY - 60);

    if (prevSections.length > 0) {
      const target = prevSections[prevSections.length - 1];
      window.scrollTo({ top: target.top, behavior: 'smooth' });
    } else {
      // If none above, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll DOWN to next section or bottom
  const handleScrollDown = (e?: React.MouseEvent) => {
    if (e?.shiftKey) {
      // Shift+Click: Fast jump to absolute bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
      return;
    }

    const currentScrollY = window.scrollY;
    const sections = getSectionOffsets();

    // Find the closest section below current scroll position (with a small buffer)
    const nextSections = sections.filter((s) => s.top > currentScrollY + 60);

    if (nextSections.length > 0) {
      const target = nextSections[0];
      window.scrollTo({ top: target.top, behavior: 'smooth' });
    } else {
      // Fallback: scroll by 80% viewport height or to bottom
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetY = Math.min(maxScroll, currentScrollY + window.innerHeight * 0.85);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Double click handling for instantaneous fast-top and fast-bottom
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Page scroll navigation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 select-none flex flex-col items-center group/nav"
    >
      <div className="relative flex flex-col items-center bg-white/95 dark:bg-[#131E36]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl shadow-lg p-1.5 gap-1.5 transition-all duration-300 hover:shadow-xl hover:border-[#1254B5]/40 dark:hover:border-[#B7E522]/40">
        {/* UP BUTTON */}
        <button
          type="button"
          onClick={handleScrollUp}
          onDoubleClick={handleScrollToTop}
          disabled={isAtTop}
          aria-label="Scroll up to previous section or top"
          title={isAtTop ? 'At the top of page' : 'Scroll Up (or double-click for top)'}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group/up ${
            isAtTop
              ? 'opacity-30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'text-slate-700 dark:text-slate-200 hover:bg-[#1254B5]/10 dark:hover:bg-[#B7E522]/15 hover:text-[#1254B5] dark:hover:text-[#B7E522] active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254B5] dark:focus:ring-[#B7E522]'
          }`}
        >
          <ChevronUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover/up:-translate-y-0.5" />
          {/* Keyboard / Tooltip prompt on hover */}
          <span className="sr-only">Scroll up</span>
        </button>

        {/* PROGRESS INDICATOR & SECTION STATUS TRACKER */}
        <div
          onClick={scrollProgress > 50 ? handleScrollToTop : handleScrollToBottom}
          title={`Currently at ${scrollProgress}% — ${activeSectionName}. Click to toggle top/bottom.`}
          className="relative py-1 flex flex-col items-center justify-center cursor-pointer group/meter"
        >
          {/* Vertical scroll track */}
          <div className="w-1.5 h-10 sm:h-12 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-[#1254B5] to-[#B7E522] rounded-full transition-all duration-150"
              style={{ height: `${Math.max(8, scrollProgress)}%` }}
            />
          </div>

          {/* Numerical % Badge on hover */}
          <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 font-mono mt-1 group-hover/meter:text-[#1254B5] dark:group-hover/meter:text-[#B7E522] transition-colors">
            {scrollProgress}%
          </span>
        </div>

        {/* DOWN BUTTON */}
        <button
          type="button"
          onClick={handleScrollDown}
          onDoubleClick={handleScrollToBottom}
          disabled={isAtBottom}
          aria-label="Scroll down to next section or bottom"
          title={isAtBottom ? 'At the bottom of page' : 'Scroll Down (or double-click for bottom)'}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group/down ${
            isAtBottom
              ? 'opacity-30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'text-slate-700 dark:text-slate-200 hover:bg-[#1254B5]/10 dark:hover:bg-[#B7E522]/15 hover:text-[#1254B5] dark:hover:text-[#B7E522] active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1254B5] dark:focus:ring-[#B7E522]'
          }`}
        >
          <ChevronDown className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover/down:translate-y-0.5" />
          <span className="sr-only">Scroll down</span>
        </button>
      </div>

      {/* FLYOUT CONTEXT CARD ON HOVER */}
      <div
        className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      >
        <div className="bg-[#17233D] text-white text-xs px-3 py-2 rounded-xl shadow-xl whitespace-nowrap border border-slate-700 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <span className="w-2 h-2 rounded-full bg-[#B7E522] animate-pulse"></span>
            <span>{activeSectionName}</span>
          </div>
          <div className="text-[10px] text-slate-300 flex items-center gap-2">
            <span>Scroll {scrollProgress}%</span>
            <span>•</span>
            <span className="text-[#B7E522]">Up / Down buttons</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
