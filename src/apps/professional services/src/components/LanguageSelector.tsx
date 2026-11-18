import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
  variant?: 'header' | 'banner' | 'mobile';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  className = '',
  variant = 'header',
}) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'banner') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded hover:bg-slate-800"
          title="Select Language"
        >
          <span className="text-sm leading-none">{currentLanguage.flag}</span>
          <span className="font-semibold uppercase tracking-wider">{currentLanguage.code}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#0A1727] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              Select Language
            </div>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  currentLanguage.code === l.code
                    ? 'bg-blue-50/80 dark:bg-blue-950/50 font-bold text-[#1464C8] dark:text-[#B7E532]'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{l.flag}</span>
                  <div>
                    <div className="font-bold">{l.nativeName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{l.region}</div>
                  </div>
                </div>
                {currentLanguage.code === l.code && <Check className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs group"
        title="Select Language"
        aria-label="Select Language"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-100">
          {currentLanguage.code}
        </span>
        <span className="hidden xl:inline text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0A1727] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#102B4E] dark:text-slate-100">
              <Globe2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Languages</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532]">
              EN • FR • PT • ES
            </span>
          </div>

          <div className="py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
            {languages.map((l) => {
              const isSelected = currentLanguage.code === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 font-bold text-[#1464C8] dark:text-[#B7E532]'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl leading-none shrink-0">{l.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black">{l.nativeName}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">({l.code})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {l.region}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3.5 py-2 bg-slate-50 dark:bg-[#071322] border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Pan-African & Global Locales</span>
            <span className="font-bold text-[#1464C8] dark:text-[#B7E532] uppercase">{currentLanguage.code} Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
