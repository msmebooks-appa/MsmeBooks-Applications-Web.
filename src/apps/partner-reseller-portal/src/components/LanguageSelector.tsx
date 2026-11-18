import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../locales/translations';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage, currentLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer whitespace-nowrap shadow-2xs select-none focus:outline-hidden focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400"
        aria-label="Select interface language"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span className="font-semibold tracking-wide uppercase text-[11px]">
          {currentLanguage.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Globe className="w-3.5 h-3.5 text-[#0046B8] dark:text-lime-400" />
              <span>Language / Langue</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Pan-Africa & Global
            </span>
          </div>

          {/* Language List */}
          <div className="p-1 space-y-0.5">
            {languages.map(lang => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 font-bold text-[#0046B8] dark:text-lime-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-500">
                          ({lang.code})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {lang.region}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#0046B8] dark:text-lime-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer banner */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Market Localisation</span>
            <span className="font-semibold text-[#0046B8] dark:text-lime-400">
              {currentLanguage.nativeName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
