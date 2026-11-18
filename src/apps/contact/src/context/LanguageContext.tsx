import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageMeta,
  TranslationDictionary,
  translations,
} from '../data/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  currentLanguage: LanguageMeta;
  supportedLanguages: LanguageMeta[];
  setLanguage: (lang: SupportedLanguage) => void;
  tDict: TranslationDictionary;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('msmebooks-language') as SupportedLanguage | null;
      if (stored && ['en', 'fr', 'pt', 'es'].includes(stored)) {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language?.slice(0, 2).toLowerCase();
      if (browserLang === 'fr') return 'fr';
      if (browserLang === 'pt') return 'pt';
      if (browserLang === 'es') return 'es';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('msmebooks-language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((lang) => lang.code === language) || SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const tDict = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = tDict;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fallbackCurrent: any = translations.en;
        for (const fKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : fallback || path;
      }
    }
    return typeof current === 'string' ? current : fallback || path;
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
        tDict,
        t,
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
