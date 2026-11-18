import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { LanguageCode, LanguageConfig, Translations } from './translations/types';
import { EN_TRANSLATIONS } from './translations/en';
import { FR_TRANSLATIONS } from './translations/fr';
import { SW_TRANSLATIONS } from './translations/sw';

export type { LanguageCode, LanguageConfig, Translations };

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global / Anglophone Africa' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Afrique Francophone' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Afrika Mashariki / East Africa' },
];

const DICTIONARY: Record<LanguageCode, Translations> = {
  en: EN_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  sw: SW_TRANSLATIONS,
};

interface LanguageContextType {
  currentLanguage: LanguageConfig;
  setLanguageCode: (code: LanguageCode) => void;
  languages: LanguageConfig[];
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'fr' || saved === 'sw') {
        return saved;
      }
    } catch {
      // Ignore storage access restrictions
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
      document.documentElement.lang = langCode;
    } catch {
      // Ignore storage access restrictions
    }
  }, [langCode]);

  const currentLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];
  }, [langCode]);

  const t = useMemo(() => {
    return DICTIONARY[langCode] || DICTIONARY.en;
  }, [langCode]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguageCode: setLangCode,
        languages: SUPPORTED_LANGUAGES,
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
