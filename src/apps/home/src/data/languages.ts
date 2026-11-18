import { LanguageCode, LanguageConfig } from '../types';

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    regionDesc: 'Pan-African & Anglophone markets (Nigeria, Ghana, Kenya, South Africa)',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    regionDesc: 'Afrique francophone (Sénégal, Côte d’Ivoire, Cameroun, RDC)',
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    dir: 'ltr',
    regionDesc: 'Jumuiya ya Afrika Mashariki (Kenya, Tanzania, Uganda, Rwanda, Burundi)',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    dir: 'rtl',
    regionDesc: 'شمال وشرق إفريقيا (مصر، المغرب، الجزائر، تونس، السودان)',
  },
};
