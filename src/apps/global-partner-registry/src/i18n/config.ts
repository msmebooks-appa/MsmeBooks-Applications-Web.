import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  regionHint: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    regionHint: 'Global & Anglophone Africa',
    dir: 'ltr',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    regionHint: 'Francophone West & Central Africa, Europe',
    dir: 'ltr',
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    regionHint: 'East Africa (Kenya, Tanzania, Uganda, Rwanda)',
    dir: 'ltr',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    regionHint: 'Angola, Mozambique, Portugal, Brazil',
    dir: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    regionHint: 'North Africa & Middle East',
    dir: 'rtl',
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    flag: '🇳🇬',
    regionHint: 'Nigeria, Benin & West Africa',
    dir: 'ltr',
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    flag: '🇳🇬',
    regionHint: 'Northern Nigeria, Niger, Sahel Region',
    dir: 'ltr',
  },
];

export const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('msmebooks_lang_pref');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    // Check browser language
    const navLang = navigator.language?.split('-')[0]?.toLowerCase();
    if (navLang && SUPPORTED_LANGUAGES.some(l => l.code === navLang)) {
      return navLang;
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

// Initialize document language and direction
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  const initialConfig = SUPPORTED_LANGUAGES.find(l => l.code === initialLang);
  document.documentElement.dir = initialConfig?.dir || 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      fr: { translation: translations.fr },
      sw: { translation: translations.sw },
      pt: { translation: translations.pt },
      ar: { translation: translations.ar },
      yo: { translation: translations.yo },
      ha: { translation: translations.ha },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeAppLanguage = (langCode: string) => {
  const selected = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
  i18n.changeLanguage(selected.code);
  if (typeof window !== 'undefined') {
    localStorage.setItem('msmebooks_lang_pref', selected.code);
    document.documentElement.lang = selected.code;
    document.documentElement.dir = selected.dir || 'ltr';
  }
};

export default i18n;
