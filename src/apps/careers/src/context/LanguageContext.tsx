import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageConfig, SUPPORTED_LANGUAGES } from '../types/language';
import { translations, Translations } from '../translations';

interface LanguageContextType {
  language: LanguageCode;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: LanguageConfig[];
  currentConfig: LanguageConfig;
  t: (path: string, fallback?: string) => string;
  translations: Translations;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_lang') || localStorage.getItem('language');
      if (saved && (saved === 'en' || saved === 'fr' || saved === 'pt' || saved === 'es')) {
        return saved as LanguageCode;
      }
      // Infer from browser language if available
      const browserLang = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2).toLowerCase() : 'en';
      if (browserLang === 'fr' || browserLang === 'pt' || browserLang === 'es') {
        return browserLang as LanguageCode;
      }
    } catch {
      // LocalStorage access fallback
    }
    return 'en';
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('msmebooks_lang', newLang);
      localStorage.setItem('language', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore storage error
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore DOM error
    }
  }, [language]);

  const currentConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const currentTranslations = translations[language] || translations.en;

  // Dot-notation translation helper: e.g. t('nav.careers') or t('filters.title')
  const t = (path: string, fallback?: string): string => {
    const parts = path.split('.');
    let current: any = currentTranslations;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English dictionary if key missing
        let enCurrent: any = translations.en;
        for (const enPart of parts) {
          if (enCurrent && typeof enCurrent === 'object' && enPart in enCurrent) {
            enCurrent = enCurrent[enPart];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : (fallback || path);
      }
    }

    return typeof current === 'string' ? current : (fallback || path);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage: language,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        currentConfig,
        t,
        translations: currentTranslations,
        tr: currentTranslations,
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
