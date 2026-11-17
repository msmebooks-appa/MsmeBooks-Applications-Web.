import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'compact' | 'segmented';
  showLabel?: boolean;
  className?: string;
  dropdownAlign?: 'left' | 'right';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  showLabel = false,
  className = '',
  dropdownAlign = 'right',
}) => {
  const { language, setLanguage, currentLanguageInfo, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  // Segmented Variant (e.g. for settings / modal cards)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 gap-1 ${className}`}
        role="group"
        aria-label="Language selection"
      >
        {languages.map((lang) => {
          const isActive = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`
                px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap
                ${
                  isActive
                    ? 'bg-[#0F4C81] text-white shadow-xs dark:bg-[#84CC16] dark:text-[#072644] font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }
              `}
              title={`${lang.name} (${lang.englishName})`}
            >
              <span className="text-sm leading-none">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Variant (Icon & small badge)
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Change language, current is ${currentLanguageInfo.name}`}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 dark:hover:bg-slate-800 text-white dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-white/10"
        >
          <span className="text-sm leading-none">{currentLanguageInfo.flag}</span>
          <span className="uppercase text-[11px] font-mono">{currentLanguageInfo.badge}</span>
        </button>

        {isOpen && (
          <div
            className={`
              absolute ${dropdownAlign === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48
              bg-white dark:bg-[#0A1F36] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800
              py-1 z-50 text-left animate-fade-in
            `}
          >
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer
                    ${
                      isSelected
                        ? 'font-bold text-[#0F4C81] dark:text-[#9AE61C] bg-[#0F4C81]/5 dark:bg-[#0F4C81]/20'
                        : 'text-slate-700 dark:text-slate-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#84CC16]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard Dropdown Variant (for Main Top Navigation)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language switcher: ${currentLanguageInfo.name}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 dark:hover:bg-slate-800/80 text-white text-xs font-semibold transition-all cursor-pointer border border-white/10 shadow-2xs"
        title="Select UI Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#84CC16]" />
        <span className="text-sm leading-none mr-0.5">{currentLanguageInfo.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLanguageInfo.name}</span>
        <span className="sm:hidden font-mono uppercase text-[11px] font-bold">
          {currentLanguageInfo.badge}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className={`
            absolute ${dropdownAlign === 'right' ? 'right-0' : 'left-0'} mt-2 w-56
            bg-white dark:bg-[#0A1F36] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800
            py-1.5 z-50 text-left animate-fade-in
          `}
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Select Language</span>
            <span className="text-[9px] text-[#0F4C81] dark:text-[#9AE61C] font-mono">
              4 Available
            </span>
          </div>

          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer
                    ${
                      isSelected
                        ? 'font-bold text-[#0F4C81] dark:text-[#9AE61C] bg-[#0F4C81]/8 dark:bg-[#0F4C81]/25'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                        {lang.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {lang.englishName} • {lang.region}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#84CC16]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#9AE61C] stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-[#071626]/50">
            Real-time interface localization for West &amp; East Africa.
          </div>
        </div>
      )}
    </div>
  );
};
