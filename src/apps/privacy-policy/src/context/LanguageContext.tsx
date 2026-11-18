import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageMeta,
  TRANSLATIONS,
  SECTION_TITLES_TRANSLATED
} from '../data/translations';
import { SECTION_TRANSLATIONS, TranslatedSection } from '../data/sectionTranslations';
import { FAQ_TRANSLATIONS, TranslatedFaq } from '../data/faqTranslations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  getSectionTitle: (sectionNumber: number) => { title: string; short: string };
  getSectionData: (sectionNumber: number) => TranslatedSection | undefined;
  getFaqs: () => TranslatedFaq[];
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_lang') as SupportedLanguage | null;
      if (saved && ['en', 'fr', 'pt', 'es'].includes(saved)) {
        return saved;
      }
      // Detect browser language
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      if (navLang === 'fr') return 'fr';
      if (navLang === 'pt') return 'pt';
      if (navLang === 'es') return 'es';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    localStorage.setItem('msmebooks_lang', language);
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const getSectionTitle = (sectionNumber: number): { title: string; short: string } => {
    const langDict = SECTION_TITLES_TRANSLATED[language] || SECTION_TITLES_TRANSLATED.en;
    if (langDict && langDict[sectionNumber]) {
      return langDict[sectionNumber];
    }
    return SECTION_TITLES_TRANSLATED.en[sectionNumber] || { title: `Section ${sectionNumber}`, short: `Sec. ${sectionNumber}` };
  };

  const getSectionData = (sectionNumber: number): TranslatedSection | undefined => {
    if (language === 'en') return undefined; // Will default to base English section data in privacyPolicyData.ts
    const langSections = SECTION_TRANSLATIONS[language];
    if (langSections && langSections[sectionNumber]) {
      return langSections[sectionNumber];
    }
    return undefined;
  };

  const getFaqs = (): TranslatedFaq[] => {
    return FAQ_TRANSLATIONS[language] || FAQ_TRANSLATIONS.en;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getSectionTitle,
        getSectionData,
        getFaqs,
        supportedLanguages: SUPPORTED_LANGUAGES,
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
