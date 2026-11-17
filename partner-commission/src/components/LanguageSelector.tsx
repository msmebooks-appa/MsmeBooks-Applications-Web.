import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  align?: 'left' | 'right';
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  align = 'right',
  compact = false,
  className = ''
}) => {
  const { language, languageInfo, languages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
      >
        <span className="text-sm leading-none" role="img" aria-label={languageInfo.name}>
          {languageInfo.flag}
        </span>
        <span className="font-mono font-bold uppercase">{languageInfo.code}</span>
        {!compact && (
          <span className="hidden md:inline font-normal text-slate-500 dark:text-slate-400">
            {languageInfo.nativeName}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-64 bg-white dark:bg-[#142D4E] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-700/70 bg-slate-50 dark:bg-[#0f2139] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#1261B5] dark:text-[#B9E51C]" />
              <span>Select Language</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Pan-African & Global</span>
          </div>

          {/* Options List */}
          <div className="p-1.5 space-y-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#1261B5] text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        <span
                          className={`text-[10px] font-mono uppercase ${
                            isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          ({lang.code})
                        </span>
                      </div>
                      <div
                        className={`text-[10px] ${
                          isSelected ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {lang.region}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#B9E51C] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-900/40 text-[10px] text-slate-400 text-center">
            Full translations for FR, PT, ES & EN
          </div>
        </div>
      )}
    </div>
  );
};
