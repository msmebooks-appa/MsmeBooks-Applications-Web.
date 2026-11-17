import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageConfig } from '../types';
import { LANGUAGES } from '../data/languages';
import { TRANSLATIONS, TranslationDictionary } from '../data/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRTL: boolean;
  t: TranslationDictionary;
  langConfig: LanguageConfig;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('msmebooks-lang') as LanguageCode;
      if (savedLang && LANGUAGES[savedLang]) {
        return savedLang;
      }
      // Check browser preferred language
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('fr')) return 'fr';
      if (browserLang.startsWith('sw')) return 'sw';
      if (browserLang.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  const langConfig = LANGUAGES[language] || LANGUAGES.en;
  const isRTL = langConfig.dir === 'rtl';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('lang', language);
      root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      if (isRTL) {
        root.classList.add('rtl');
      } else {
        root.classList.remove('rtl');
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('msmebooks-lang', language);
    }
  }, [language, isRTL]);

  const setLanguage = (newLang: LanguageCode) => {
    if (LANGUAGES[newLang]) {
      setLanguageState(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t, langConfig }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
