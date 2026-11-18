import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  changeAppLanguage,
  getInitialLanguage,
} from '../i18n/config';

interface LanguageContextType {
  currentLanguage: string;
  currentLanguageInfo: SupportedLanguage;
  setLanguage: (code: string) => void;
  languages: SupportedLanguage[];
  t: (key: string, options?: Record<string, unknown>) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => getInitialLanguage());

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const setLanguage = useCallback((code: string) => {
    const selected = SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
    setCurrentLanguageState(selected.code);
    changeAppLanguage(selected.code);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguageInfo.code;
      document.documentElement.dir = currentLanguageInfo.dir || 'ltr';
    }
  }, [currentLanguageInfo.code, currentLanguageInfo.dir]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguageState(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLanguageInfo,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        t: t as (key: string, options?: Record<string, unknown>) => string,
        direction: currentLanguageInfo.dir || 'ltr',
      }}
    >
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
