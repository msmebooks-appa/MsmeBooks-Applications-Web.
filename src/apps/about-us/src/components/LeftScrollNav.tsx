import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronUp, ChevronDown, Compass, ChevronsUp, ChevronsDown } from 'lucide-react';

interface SectionMeta {
  id: string;
  name: string;
  shortName: string;
}

export const LeftScrollNav: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);

  const SECTIONS: SectionMeta[] = [
    { id: 'hero', name: t.nav_mobile_overview, shortName: 'Hero' },
    { id: 'impact-metrics', name: t.counters_eyebrow, shortName: 'Metrics' },
    { id: 'our-story', name: t.story_eyebrow, shortName: t.story_eyebrow },
    { id: 'mission-vision', name: t.mv_eyebrow, shortName: t.mv_mission_title },
    { id: 'problem', name: t.prob_eyebrow, shortName: t.prob_eyebrow },
    { id: 'what-we-do', name: t.nav_solutions, shortName: t.nav_solutions },
    { id: 'pan-african', name: t.africa_eyebrow, shortName: 'Pan-Africa' },
    { id: 'who-we-serve', name: t.nav_industries, shortName: t.nav_industries },
    { id: 'values', name: t.values_eyebrow, shortName: t.values_eyebrow },
    { id: 'people-and-thinking', name: t.people_eyebrow, shortName: t.people_eyebrow },
    { id: 'partners', name: t.nav_partners, shortName: t.nav_partners },
    { id: 'commitments', name: t.commit_eyebrow, shortName: t.commit_eyebrow },
    { id: 'trust-security', name: t.trust_eyebrow, shortName: t.trust_eyebrow },
    { id: 'success-stories', name: t.stories_eyebrow, shortName: t.stories_eyebrow },
    { id: 'faqs', name: t.nav_faq, shortName: t.nav_faq },
    { id: 'cta', name: t.nav_get_started, shortName: t.nav_start_free },
  ];

  // Update active section and progress percentage on scroll
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate 0 to 100 percentage
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
    setScrollProgress(progress);

    // Identify current section
    const navbarHeight = 85;
    const currentScrollPos = scrollY + navbarHeight + 30;

    let currentIndex = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      const el = document.getElementById(SECTIONS[i].id);
      if (el) {
        const top = el.offsetTop;
        if (currentScrollPos >= top) {
          currentIndex = i;
        }
      }
    }
    setActiveIndex(currentIndex);
  }, [SECTIONS.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll to a specific section by index
  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    const target = SECTIONS[index];
    const el = document.getElementById(target.id);
    if (el) {
      const navbarOffset = 75;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navbarOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [SECTIONS]);

  // Up button handler: scroll to previous section, or top if at 0
  const handleScrollUp = useCallback(() => {
    if (activeIndex > 0) {
      scrollToSection(activeIndex - 1);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeIndex, scrollToSection]);

  // Down button handler: scroll to next section, or bottom if at last
  const handleScrollDown = useCallback(() => {
    if (activeIndex < SECTIONS.length - 1) {
      scrollToSection(activeIndex + 1);
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeIndex, SECTIONS.length, scrollToSection]);

  const canScrollUp = activeIndex > 0 || scrollProgress > 1;
  const canScrollDown = activeIndex < SECTIONS.length - 1 || scrollProgress < 98;

  const currentSection = SECTIONS[activeIndex] || SECTIONS[0];
  const prevSection = activeIndex > 0 ? SECTIONS[activeIndex - 1] : null;
  const nextSection = activeIndex < SECTIONS.length - 1 ? SECTIONS[activeIndex + 1] : null;

  return (
    <aside
      aria-label="Page navigation controls"
      className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 select-none print:hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowFullMenu(false);
      }}
    >
      <div className="relative flex items-center">
        {/* Main Floating Capsule Navigation */}
        <div className="flex flex-col items-center bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/70 border border-slate-200/90 dark:border-zinc-800 transition-all duration-200 hover:border-[#0B4EA2]/30 dark:hover:border-[#38BDF8]/40">
          
          {/* UP BUTTON */}
          <div className="relative group/up">
            <button
              type="button"
              onClick={handleScrollUp}
              disabled={!canScrollUp}
              aria-label={prevSection ? `Scroll up to ${prevSection.name}` : 'Scroll to top'}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4EA2] ${
                canScrollUp
                  ? 'text-slate-700 dark:text-slate-200 hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-zinc-900 active:scale-95 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronUp className="w-5 h-5 sm:w-5 sm:h-5 transition-transform group-hover/up:-translate-y-0.5" />
            </button>

            {/* Up Tooltip (Left-to-right floating tag) */}
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/up:opacity-100 group-hover/up:translate-x-0 transition-all duration-150 z-50 whitespace-nowrap">
              <div className="bg-slate-900 dark:bg-zinc-950 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 dark:border-zinc-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <span>{prevSection ? `${prevSection.shortName}` : t.scroll_nav_top}</span>
                <span className="text-[10px] text-slate-400 font-mono">▲</span>
              </div>
            </div>
          </div>

          {/* PROGRESS INDICATOR & QUICK MENU TOGGLE */}
          <div className="py-2 flex flex-col items-center gap-1.5 relative group/indicator">
            {/* Interactive Section Number Badge */}
            <button
              type="button"
              onClick={() => setShowFullMenu(!showFullMenu)}
              aria-label={t.scroll_nav_title}
              title={t.scroll_nav_hint}
              className="px-1.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-tight text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col items-center cursor-pointer"
            >
              <span className="text-[#0B4EA2] dark:text-[#38BDF8]">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">
                /{String(SECTIONS.length).padStart(2, '0')}
              </span>
            </button>

            {/* Vertical Progress Bar */}
            <div 
              onClick={() => setShowFullMenu(!showFullMenu)}
              className="w-1.5 h-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative cursor-pointer my-0.5"
              title="Scroll progress"
            >
              <div
                className="w-full bg-gradient-to-b from-[#0B4EA2] via-[#38BDF8] to-[#84CC16] rounded-full transition-all duration-150 ease-out"
                style={{ height: `${Math.max(8, scrollProgress)}%` }}
              />
            </div>

            {/* Hover Tooltip for current section */}
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/indicator:opacity-100 group-hover/indicator:translate-x-0 transition-all duration-150 z-50 whitespace-nowrap">
              <div className="bg-slate-900 dark:bg-zinc-950 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 dark:border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {t.scroll_nav_current} ({activeIndex + 1}/{SECTIONS.length})
                </span>
                <span className="font-semibold text-lime-400">{currentSection.name}</span>
                <span className="text-[10px] text-slate-400">{t.scroll_nav_hint}</span>
              </div>
            </div>
          </div>

          {/* DOWN BUTTON */}
          <div className="relative group/down">
            <button
              type="button"
              onClick={handleScrollDown}
              disabled={!canScrollDown}
              aria-label={nextSection ? `Scroll down to ${nextSection.name}` : 'Scroll to bottom'}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4EA2] ${
                canScrollDown
                  ? 'text-slate-700 dark:text-slate-200 hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-zinc-900 active:scale-95 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronDown className="w-5 h-5 sm:w-5 sm:h-5 transition-transform group-hover/down:translate-y-0.5" />
            </button>

            {/* Down Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/down:opacity-100 group-hover/down:translate-x-0 transition-all duration-150 z-50 whitespace-nowrap">
              <div className="bg-slate-900 dark:bg-zinc-950 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 dark:border-zinc-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <span>{nextSection ? `${nextSection.shortName}` : t.scroll_nav_bottom}</span>
                <span className="text-[10px] text-slate-400 font-mono">▼</span>
              </div>
            </div>
          </div>

        </div>

        {/* EXPANDABLE SECTION MENU (FLYOUT DRAWER) */}
        {showFullMenu && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-64 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-200/90 dark:border-zinc-800 z-50 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800 px-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                {t.scroll_nav_title}
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-400">
                {Math.round(scrollProgress)}% {t.scroll_nav_read}
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1 text-xs">
              {SECTIONS.map((sec, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      scrollToSection(idx);
                      setShowFullMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#0B4EA2]/10 dark:bg-[#38BDF8]/15 text-[#0B4EA2] dark:text-[#38BDF8] font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#84CC16]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <span className="truncate">{sec.shortName}</span>
                    </span>
                    <span className="font-mono text-[10px] opacity-60">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Extreme Navigation (Top / Bottom) */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowFullMenu(false);
                }}
                className="py-1 px-2 rounded-md bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-medium flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronsUp className="w-3.5 h-3.5" />
                {t.scroll_nav_top}
              </button>
              <button
                onClick={() => {
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                  setShowFullMenu(false);
                }}
                className="py-1 px-2 rounded-md bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-medium flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronsDown className="w-3.5 h-3.5" />
                {t.scroll_nav_bottom}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
