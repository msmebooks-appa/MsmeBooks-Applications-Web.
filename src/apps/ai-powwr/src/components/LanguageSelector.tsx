import React, { useState, useRef, useEffect } from 'react';
import { useI18n, SupportedLocale } from '../context/I18nContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'topbar' | 'compact' | 'drawer';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'topbar',
  className = ''
}) => {
  const { locale, languageInfo, languages, setLocale } = useI18n();
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

  const handleSelectLanguage = (code: SupportedLocale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Buttons by variant */}
      {variant === 'drawer' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522]" />
            <span className="text-base">{languageInfo.flag}</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {languageInfo.nativeName} ({languageInfo.name})
            </span>
            {languageInfo.dir === 'rtl' && (
              <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold">
                RTL
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131E36] hover:bg-slate-50 dark:hover:bg-[#1A2642] text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition cursor-pointer"
          title="Change Interface Language"
          aria-expanded={isOpen}
        >
          <Globe className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
          <span>{languageInfo.flag}</span>
          <span className="font-medium">{languageInfo.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        /* Topbar Variant */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-700 dark:bg-blue-900/60 dark:hover:bg-blue-800 text-white font-medium text-xs transition cursor-pointer border border-blue-500/30"
          title="Change Language"
          aria-expanded={isOpen}
        >
          <Globe className="w-3 h-3 text-[#B7E522]" />
          <span>{languageInfo.flag}</span>
          <span className="uppercase font-bold text-[11px] tracking-wide">{languageInfo.code}</span>
          <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-68 sm:w-76 bg-white dark:bg-[#131E36] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
              Select Language
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#1254B5] dark:text-blue-300 font-bold">
              {languages.length} Locales
            </span>
          </div>

          {/* Languages List */}
          <div className="p-1.5 space-y-1">
            {languages.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full text-left rtl:text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1254B5] dark:text-[#B7E522] font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1A2642] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {lang.nativeName}
                        </span>
                        <span className="text-[11px] text-slate-400">({lang.name})</span>
                      </div>
                      {lang.regionHint && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {lang.regionHint}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-50 dark:bg-[#0E1726] border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 text-center">
            Pan-African & Global Multi-Language Support
          </div>
        </div>
      )}
    </div>
  );
};
