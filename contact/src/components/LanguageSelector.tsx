import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../data/translations';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  compact = false,
}) => {
  const { language, currentLanguage, supportedLanguages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0B3B82] dark:hover:text-white bg-slate-100 dark:bg-[#131E35] hover:bg-[#f0f6ff] dark:hover:bg-[#1A2846] border border-slate-200 dark:border-slate-700 transition-all select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select interface language"
        title={`Current Language: ${currentLanguage.nativeName}`}
      >
        <Globe className="w-3.5 h-3.5 text-[#0B3B82] dark:text-[#93C5FD]" />
        <span className="text-sm leading-none" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span className="font-mono font-bold text-[#0B3B82] dark:text-[#93C5FD] uppercase">
          {currentLanguage.code}
        </span>
        {!compact && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
            {currentLanguage.nativeName}
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#0F172A] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-2 animate-in fade-in slide-in-from-top-2">
          <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Language / Langue
            </span>
            <span className="text-[10px] font-semibold text-[#70C038]">
              Pan-Africa & Global
            </span>
          </div>

          <div className="space-y-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#f0f6ff] dark:bg-blue-950/60 text-[#0B3B82] dark:text-[#93C5FD] font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          ({lang.code})
                        </span>
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] block truncate">
                        {lang.region}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5 text-[#70C038]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2 text-[10px] text-slate-400 dark:text-slate-500">
            English · Français · Português · Español
          </div>
        </div>
      )}
    </div>
  );
};
