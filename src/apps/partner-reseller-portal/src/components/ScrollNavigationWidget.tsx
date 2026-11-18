import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Compass,
  X,
  Layers,
  Sparkles,
  Calculator,
  FileCheck2,
  FolderGit2,
  HelpCircle,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SectionTarget {
  id: string;
  labelKey: string;
  defaultLabel: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LANDING_SECTIONS: SectionTarget[] = [
  {
    id: 'hero',
    labelKey: 'hero.badge.ecosystem',
    defaultLabel: 'Overview',
    number: '00',
    icon: Sparkles
  },
  {
    id: 'categories',
    labelKey: 'nav.categories',
    defaultLabel: 'Categories',
    number: '01',
    icon: Layers
  },
  {
    id: 'commission-tiers',
    labelKey: 'nav.commissionTiers',
    defaultLabel: 'Commission Tiers',
    number: '02',
    icon: Award
  },
  {
    id: 'calculator',
    labelKey: 'nav.calculator',
    defaultLabel: 'Earnings Calculator',
    number: '03',
    icon: Calculator
  },
  {
    id: 'agreement',
    labelKey: 'nav.agreement',
    defaultLabel: 'Master Agreement',
    number: '04',
    icon: FileCheck2
  },
  {
    id: 'resources',
    labelKey: 'resources.title',
    defaultLabel: 'Resources',
    number: '05',
    icon: FolderGit2
  },
  {
    id: 'faq',
    labelKey: 'nav.faq',
    defaultLabel: 'FAQ',
    number: '06',
    icon: HelpCircle
  },
  {
    id: 'cta',
    labelKey: 'nav.becomePartner',
    defaultLabel: 'Apply Now',
    number: '07',
    icon: Sparkles
  }
];

export const ScrollNavigationWidget: React.FC = () => {
  const { t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll position with high performance requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100)));
            setScrollProgress(progress);
            setIsAtTop(scrollY <= 30);
            setIsAtBottom(scrollY >= totalHeight - 30);
          } else {
            setScrollProgress(0);
            setIsAtTop(true);
            setIsAtBottom(true);
          }

          // Detect active section based on vertical scroll offset
          const threshold = window.innerHeight * 0.35;
          for (let i = LANDING_SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(LANDING_SECTIONS[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= threshold) {
                setActiveSectionId(LANDING_SECTIONS[i].id);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll up by viewport step (~70% of screen height)
  const handleScrollUp = useCallback(() => {
    const step = Math.max(window.innerHeight * 0.7, 450);
    window.scrollBy({
      top: -step,
      behavior: 'smooth'
    });
  }, []);

  // Smooth scroll down by viewport step (~70% of screen height)
  const handleScrollDown = useCallback(() => {
    const step = Math.max(window.innerHeight * 0.7, 450);
    window.scrollBy({
      top: step,
      behavior: 'smooth'
    });
  }, []);

  // Jump to absolute top
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  }, []);

  // Jump to absolute bottom
  const handleScrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  }, []);

  // Jump to a specific section by ID
  const handleJumpToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  // Active section data
  const activeSection = useMemo(() => {
    return LANDING_SECTIONS.find(s => s.id === activeSectionId) || LANDING_SECTIONS[0];
  }, [activeSectionId]);

  return (
    <>
      {/* Floating Left-Side Scroll Controller Dock */}
      <aside
        aria-label="Page scroll and section navigation"
        className="fixed left-3 sm:left-6 bottom-6 sm:bottom-8 z-30 select-none print:hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-end gap-3">
          {/* Main Vertical Control Capsule */}
          <div className="flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl dark:shadow-black/40 rounded-2xl p-1.5 gap-1.5 transition-all duration-200">
            
            {/* Quick Jump to Top (appears on hover or when scrolled down) */}
            <button
              type="button"
              onClick={handleScrollToTop}
              disabled={isAtTop}
              aria-label={t('scroll.top', 'Back to Top')}
              title={t('scroll.top', 'Back to Top')}
              className={`p-2 rounded-xl transition-all duration-150 flex items-center justify-center text-slate-500 dark:text-slate-400 ${
                isAtTop
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#0046B8] dark:hover:text-blue-400 active:scale-95'
              }`}
            >
              <ChevronsUp className="w-4 h-4" />
            </button>

            {/* Scroll Step Up Button */}
            <button
              type="button"
              onClick={handleScrollUp}
              disabled={isAtTop}
              aria-label={t('scroll.up', 'Scroll Up')}
              title={`${t('scroll.up', 'Scroll Up')} (Page Up)`}
              className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 ${
                isAtTop
                  ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-[#0046B8] hover:text-white dark:hover:bg-blue-600 shadow-sm active:scale-95'
              }`}
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Central Progress Indicator & Section Explorer Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-expanded={isMenuOpen}
              aria-label={`${t('scroll.sections', 'Page Sections')} (${scrollProgress}%)`}
              title={`${t('scroll.sectionNav', 'Section Navigator')} · ${activeSection.number} ${t(activeSection.labelKey, activeSection.defaultLabel)} (${scrollProgress}%)`}
              className={`relative group w-10 py-2.5 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                isMenuOpen
                  ? 'bg-[#0046B8] text-white shadow-md'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {/* Miniature Circular Progress Ring */}
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                  {/* Track ring */}
                  <path
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress ring */}
                  <path
                    className={isMenuOpen ? 'text-lime-300' : 'text-[#0046B8] dark:text-blue-400'}
                    strokeDasharray={`${scrollProgress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Center Icon or Percentage Number */}
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold tracking-tighter">
                  {scrollProgress}%
                </span>
              </div>

              {/* Section code */}
              <span className={`text-[9px] font-mono font-bold mt-1 tracking-tight ${
                isMenuOpen ? 'text-lime-200' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {activeSection.number}
              </span>
            </button>

            {/* Scroll Step Down Button */}
            <button
              type="button"
              onClick={handleScrollDown}
              disabled={isAtBottom}
              aria-label={t('scroll.down', 'Scroll Down')}
              title={`${t('scroll.down', 'Scroll Down')} (Page Down)`}
              className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 ${
                isAtBottom
                  ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-[#0046B8] hover:text-white dark:hover:bg-blue-600 shadow-sm active:scale-95'
              }`}
            >
              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Quick Jump to Bottom */}
            <button
              type="button"
              onClick={handleScrollToBottom}
              disabled={isAtBottom}
              aria-label={t('scroll.bottom', 'Jump to Bottom')}
              title={t('scroll.bottom', 'Jump to Bottom')}
              className={`p-2 rounded-xl transition-all duration-150 flex items-center justify-center text-slate-500 dark:text-slate-400 ${
                isAtBottom
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#0046B8] dark:hover:text-blue-400 active:scale-95'
              }`}
            >
              <ChevronsDown className="w-4 h-4" />
            </button>

          </div>

          {/* Expanded Flyout Section Navigation Menu (Opens to the right of the widget) */}
          {isMenuOpen && (
            <div
              className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 space-y-2 animate-in fade-in slide-in-from-left-4 duration-200"
              role="dialog"
              aria-label="Landing Page Navigation Menu"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Compass className="w-3.5 h-3.5 text-[#0046B8] dark:text-blue-400" />
                  <span>{t('scroll.sectionNav', 'Section Navigator')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300">
                    {scrollProgress}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List of sections with icons & active indicator */}
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1 text-xs">
                {LANDING_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleJumpToSection(sec.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#0046B8] text-white font-semibold shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-lime-300' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="truncate">{t(sec.labelKey, sec.defaultLabel)}</span>
                      </div>
                      <span className={`text-[10px] font-mono ml-2 flex-shrink-0 ${
                        isActive ? 'text-lime-200' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {sec.number}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump Shortcuts in the drawer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleScrollToTop}
                  className="px-2 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1"
                >
                  <ChevronsUp className="w-3 h-3" />
                  <span>{t('scroll.top', 'Top')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleScrollToBottom}
                  className="px-2 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1"
                >
                  <ChevronsDown className="w-3 h-3" />
                  <span>{t('scroll.bottom', 'Bottom')}</span>
                </button>
              </div>

            </div>
          )}

          {/* Quick Active Section Tooltip badge when hovering over widget without menu open */}
          {!isMenuOpen && isHovered && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-medium shadow-lg animate-in fade-in duration-150">
              <span className="text-lime-400 dark:text-[#0046B8] font-mono font-bold">{activeSection.number}</span>
              <span className="truncate max-w-[150px]">{t(activeSection.labelKey, activeSection.defaultLabel)}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
