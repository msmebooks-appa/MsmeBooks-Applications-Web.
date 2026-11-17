import React, { useState, useRef, useEffect, useId } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown, Check, Sparkles, Search, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage } from '../data/translations';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'mobile' | 'portal';
  className?: string;
  align?: 'left' | 'right';
}

type RegionCategory = 'all' | 'pan-african' | 'francophone' | 'lusophone' | 'east-africa' | 'north-africa' | 'west-africa';

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'navbar',
  className = '',
  align = 'right'
}) => {
  const { language, setLanguage, currentLanguageInfo, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RegionCategory>('all');
  const [translationFeedback, setTranslationFeedback] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownId = useId();

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    const chosen = supportedLanguages.find((l) => l.code === langCode);
    if (chosen) {
      setTranslationFeedback(`${chosen.flag} ${chosen.nativeName} (${chosen.name})`);
      setTimeout(() => {
        setTranslationFeedback(null);
        setIsOpen(false);
      }, 900);
    } else {
      setIsOpen(false);
    }
  };

  // Category mapping helper
  const matchesCategory = (langCode: SupportedLanguage, cat: RegionCategory): boolean => {
    if (cat === 'all') return true;
    switch (cat) {
      case 'pan-african': return langCode === 'en';
      case 'francophone': return langCode === 'fr';
      case 'lusophone': return langCode === 'pt';
      case 'east-africa': return langCode === 'sw';
      case 'north-africa': return langCode === 'ar';
      case 'west-africa': return langCode === 'ha' || langCode === 'yo';
      default: return true;
    }
  };

  // Filter languages based on search query and category
  const filteredLanguages = supportedLanguages.filter((l) => {
    if (!matchesCategory(l.code, selectedCategory)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  // Category Tabs List
  const categoryFilters: { id: RegionCategory; label: string; flag: string }[] = [
    { id: 'all', label: 'All', flag: '🌍' },
    { id: 'pan-african', label: 'Global / EN', flag: '🇬🇧' },
    { id: 'francophone', label: 'Afrique Francophone', flag: '🇫🇷' },
    { id: 'lusophone', label: 'Lusofonia', flag: '🇦🇴' },
    { id: 'east-africa', label: 'East Africa', flag: '🇰🇪' },
    { id: 'north-africa', label: 'North Africa (RTL)', flag: '🇪🇬' },
    { id: 'west-africa', label: 'West Africa', flag: '🇳🇬' }
  ];

  // Mobile drawer variant
  if (variant === 'mobile') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            {t('lang.switcher_label', 'Select Portal Language')}
          </span>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>{currentLanguageInfo.flag}</span>
            <span>{currentLanguageInfo.nativeName}</span>
          </span>
        </div>

        {/* 1-Tap Quick Switcher Segment for Mobile */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#051838] border border-slate-200 dark:border-blue-900/80">
          {(['en', 'fr', 'pt', 'sw', 'ar', 'es'] as const).map((langCode) => {
            const isActive = language === langCode;
            const item = supportedLanguages.find((l) => l.code === langCode);
            if (!item) return null;
            return (
              <button
                key={langCode}
                type="button"
                onClick={() => setLanguage(langCode)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5 ${
                  isActive
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-blue-900/40'
                }`}
              >
                <span className="text-xs">{item.flag}</span>
                <span className="font-mono uppercase text-[10px]">{langCode}</span>
              </button>
            );
          })}
        </div>

        {/* Full Grid of All 8 Languages */}
        <div className="grid grid-cols-2 gap-2">
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                type="button"
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/70 border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-[#8CE600] shadow-sm ring-1 ring-[#0A3981]/20 dark:ring-[#8CE600]/30'
                    : 'bg-white dark:bg-[#072048] border-slate-200 dark:border-blue-900/80 text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-blue-900/40'
                }`}
              >
                <span className="text-lg select-none shrink-0">{lang.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold leading-tight">{lang.nativeName}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate flex items-center gap-1">
                    <span>{lang.name}</span>
                    {lang.dir === 'rtl' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold">
                        RTL
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Portal modal header compact button
  if (variant === 'portal') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] bg-slate-100 dark:bg-[#061F4A] hover:bg-slate-200 dark:hover:bg-[#092b61] border border-slate-200 dark:border-blue-800 transition-colors cursor-pointer"
          title="Toggle Portal Language"
        >
          <span className="text-sm select-none">{currentLanguageInfo.flag}</span>
          <span className="uppercase font-mono font-bold">{currentLanguageInfo.code}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 dark:text-blue-300 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180 text-[#0A3981] dark:text-[#8CE600]' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-76 max-w-[calc(100vw-24px)] bg-white dark:bg-[#072048] border border-slate-200 dark:border-blue-800 rounded-2xl shadow-2xl p-2.5 z-50 divide-y divide-slate-100 dark:divide-blue-900/60"
            >
              <div className="px-3 py-2 text-left">
                <span className="text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                  Global Partner Language
                </span>
              </div>
              <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                {supportedLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      type="button"
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/70 text-[#0A3981] dark:text-[#8CE600] font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg select-none">{lang.flag}</span>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                            {lang.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {lang.dir === 'rtl' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold">
                            RTL
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: Desktop Floating Navbar Trigger & Inclusive Popover
  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={dropdownRef}>
      {/* 1-Click Quick Toggle Bar for High-Frequency Working Languages (EN, FR, PT, SW, AR) on Wide Screens */}
      <div 
        role="group"
        aria-label="Quick language toggle for global partners"
        className="hidden xl:inline-flex items-center p-0.5 rounded-xl bg-slate-100/90 dark:bg-blue-950/80 border border-slate-200 dark:border-blue-800/80 text-[11px] font-bold shadow-xs"
      >
        {(['en', 'fr', 'pt', 'sw', 'ar'] as const).map((langCode) => {
          const isActive = language === langCode;
          const lang = supportedLanguages.find((l) => l.code === langCode);
          if (!lang) return null;
          return (
            <button
              key={langCode}
              type="button"
              onClick={() => handleSelectLanguage(langCode)}
              className={`px-2 py-1 rounded-lg font-mono text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                  : 'text-slate-600 dark:text-blue-200/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-blue-900/40'
              }`}
              title={`Switch site to ${lang.nativeName} (${lang.name} - ${lang.region})`}
              aria-pressed={isActive}
            >
              <span className="text-xs leading-none select-none">{lang.flag}</span>
              <span>{langCode.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Trigger Button with Glow & Flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer border ${
          isOpen
            ? 'bg-blue-50/90 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] border-[#0A3981] dark:border-[#8CE600] ring-2 ring-[#0A3981]/20 dark:ring-[#8CE600]/30 shadow-md'
            : 'text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] bg-slate-100/90 dark:bg-blue-950/70 hover:bg-slate-200/80 dark:hover:bg-blue-900/60 border-slate-200 dark:border-blue-800/70 shadow-xs'
        }`}
        aria-label={`Language selector. Current language is ${currentLanguageInfo.name}`}
      >
        <Globe className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600] shrink-0" />
        <span className="text-sm select-none leading-none">{currentLanguageInfo.flag}</span>
        <span className="uppercase tracking-wider font-extrabold">{currentLanguageInfo.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-blue-300 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180 text-[#0A3981] dark:text-[#8CE600]' : ''
          }`}
        />
      </button>

      {/* Floating Animated Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={dropdownId}
            role="listbox"
            aria-label="Global Partner Languages"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-2 w-84 sm:w-92 max-w-[calc(100vw-24px)] bg-white/98 dark:bg-[#072048]/98 backdrop-blur-md border border-slate-200 dark:border-blue-800/90 rounded-2xl shadow-2xl p-3 z-50 divide-y divide-slate-100 dark:divide-blue-900/60`}
          >
            {/* Header: Global Inclusivity Title & Total Supported Languages */}
            <div className="px-1 pt-1 pb-2.5 text-left">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                    <span>Global Partner Languages</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-blue-200/80">
                    Pan-African & International Ecosystem
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {supportedLanguages.length} Languages
                </span>
              </div>

              {/* Dynamic Feedback Banner */}
              {translationFeedback && (
                <div className="mb-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-[#8CE600] animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8CE600] shrink-0" />
                  <span>Site dynamically translated to {translationFeedback}!</span>
                </div>
              )}

              {/* Quick Filter Search Input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language, native script, or region..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-[#041535] text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-blue-900/80 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Region Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                {categoryFilters.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A]'
                          : 'bg-slate-100 dark:bg-blue-950 text-slate-600 dark:text-blue-200/70 hover:bg-slate-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      <span className="text-[10px]">{cat.flag}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Options List */}
            <div className="py-1.5 space-y-1 max-h-80 overflow-y-auto pr-1">
              {filteredLanguages.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  No language found matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/70 text-[#0A3981] dark:text-[#8CE600] ring-1 ring-[#0A3981]/20 dark:ring-[#8CE600]/40 shadow-xs'
                          : 'hover:bg-slate-100/90 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl select-none group-hover:scale-110 transition-transform">
                          {lang.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-snug flex items-center gap-1.5">
                            <span className="truncate">{lang.nativeName}</span>
                            {lang.nativeName !== lang.name && (
                              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-400">
                                ({lang.name})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-blue-200/70 truncate">
                            {lang.region}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lang.dir === 'rtl' && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                            RTL
                          </span>
                        )}
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#041535] text-slate-500 dark:text-slate-300 font-bold">
                          {lang.code}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Note */}
            <div className="px-2 pt-2.5 pb-1 text-left bg-slate-50/50 dark:bg-[#051838]/50 rounded-b-xl">
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-blue-300/80">
                <span>Active: <strong>{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</strong></span>
                <span className="text-[#0A3981] dark:text-[#8CE600] font-semibold">Live Site Translation</span>
              </div>
              <p className="text-[9.5px] text-slate-400 dark:text-slate-400/90 mt-0.5 leading-tight">
                Instantly adapts navigation, partner benefits, calculator, and portal into your working language.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
