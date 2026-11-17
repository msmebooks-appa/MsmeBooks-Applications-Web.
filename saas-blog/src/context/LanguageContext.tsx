import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Language,
  LanguageInfo,
  TranslationDictionary,
  supportedLanguages,
  translations,
  categoryTranslations,
} from '../translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentLanguageInfo: LanguageInfo;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  translateCategory: (category: string) => string;
  dict: TranslationDictionary;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_language_preference';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && (saved === 'en' || saved === 'fr' || saved === 'pt' || saved === 'es')) {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('fr')) return 'fr';
      if (browserLang.startsWith('pt')) return 'pt';
      if (browserLang.startsWith('es')) return 'es';
    } catch {
      // localStorage may fail in some environments
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
    // Update HTML lang attribute for accessibility and SEO
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dict = translations[language] || translations.en;

  const currentLanguageInfo =
    supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const parts = keyPath.split('.');
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English dictionary
        let fallback: any = translations.en;
        for (const fbPart of parts) {
          if (fallback && typeof fallback === 'object' && fbPart in fallback) {
            fallback = fallback[fbPart];
          } else {
            fallback = undefined;
            break;
          }
        }
        current = fallback !== undefined ? fallback : keyPath;
        break;
      }
    }

    if (typeof current !== 'string') {
      return keyPath;
    }

    let text = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  const translateCategory = (category: string): string => {
    const langMap = categoryTranslations[language] || categoryTranslations.en;
    return langMap[category] || category;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageInfo,
        t,
        translateCategory,
        dict,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageSelectorProps {
  variant?: 'navbar' | 'compact' | 'drawer' | 'footer';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, currentLanguageInfo, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'drawer') {
    return (
      <div className={`space-y-2 pt-2 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
          <span>{t('languages.selectLanguage')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {supportedLanguages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-lime-950/30 border-blue-300 dark:border-lime-500 text-blue-900 dark:text-lime-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0E2443] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132F55]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{item.flag}</span>
                  <div className="text-left">
                    <div className="leading-tight">{item.nativeName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.code.toUpperCase()}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors"
          aria-expanded={isOpen}
          aria-label={t('languages.selectLanguage')}
        >
          <Globe className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span className="text-base leading-none">{currentLanguageInfo.flag}</span>
          <span className="font-medium">{currentLanguageInfo.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1.5 border-b border-slate-800 mb-1">
              {t('languages.selectLanguage')}
            </div>
            {supportedLanguages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-800 text-lime-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.flag}</span>
                    <div>
                      <div className="font-medium">{item.nativeName}</div>
                      <div className="text-[10px] text-slate-400">{item.region}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Navbar & Compact variants
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#102A4C] dark:hover:bg-[#15345E] text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-750 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-lime-400"
        aria-expanded={isOpen}
        aria-label={`${t('languages.selectLanguage')} (${currentLanguageInfo.name})`}
        title={`${t('languages.selectLanguage')}: ${currentLanguageInfo.name}`}
      >
        <span className="text-sm leading-none">{currentLanguageInfo.flag}</span>
        <span className="font-bold tracking-wide uppercase text-[11px]">{currentLanguageInfo.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-700 dark:text-lime-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#0B1E36] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              {t('languages.selectLanguage')}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-lime-400 font-bold">
              4 Languages
            </span>
          </div>

          <div className="space-y-1">
            {supportedLanguages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 font-bold border border-blue-200/60 dark:border-lime-400/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#132F55] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{item.flag}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors">
                        {item.nativeName}
                        <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                          ({item.name})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {item.region}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-lime-400 text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2 py-1 text-[10px] text-slate-400 dark:text-slate-400 text-center">
            Pan-African & Global Localization
          </div>
        </div>
      )}
    </div>
  );
};
