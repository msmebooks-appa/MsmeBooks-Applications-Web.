import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  isMobileCompact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobileCompact = false }) => {
  const { language, setLanguage, langConfig, isRTL, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (isMobileCompact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          title={t.nav.selectLanguage}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-sm leading-none">{langConfig.flag}</span>
          <span className="text-[11px] font-bold">{langConfig.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full mt-1.5 w-60 bg-white dark:bg-[#0E172A] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
              <span>{t.nav.selectLanguage}</span>
              <Globe className="w-3 h-3 text-[#0866FF] dark:text-[#B7F000]" />
            </div>

            {Object.values(LANGUAGES).map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-slate-800/90 text-[#0866FF] dark:text-[#B7F000] font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {item.nativeName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        title={t.nav.selectLanguage}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none">{langConfig.flag}</span>
        <span className="font-semibold">{langConfig.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0866FF] dark:text-[#B7F000]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-72 bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {t.nav.selectLanguage}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                African Business Lingua Franca
              </span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[#0866FF] dark:text-[#B7F000]">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Languages list */}
          <div className="space-y-1">
            {Object.values(LANGUAGES).map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-150 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-50 to-blue-50/40 dark:from-blue-950/40 dark:to-slate-800/60 border border-blue-200/80 dark:border-blue-800/80 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                      {item.flag}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.nativeName}
                        </span>
                        {item.dir === 'rtl' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            RTL
                          </span>
                        )}
                        {item.code === 'en' && (
                          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                            (English)
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.regionDesc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0866FF] dark:bg-[#B7F000] text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="mt-2 pt-2 px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>French • Swahili • Arabic • English</span>
            <span className="font-semibold text-[#0866FF] dark:text-[#B7F000]">Pan-Africa</span>
          </div>
        </div>
      )}
    </div>
  );
};
