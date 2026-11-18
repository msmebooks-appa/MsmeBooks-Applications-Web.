export type LanguageCode = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  localName: string;
  region: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    localName: 'English',
    region: 'Pan-African & Global',
    flag: '🇬🇧',
  },
  {
    code: 'fr',
    name: 'French',
    localName: 'Français',
    region: 'Afrique Francophone & International',
    flag: '🇫🇷',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    localName: 'Português',
    region: 'África Lusófona & Internacional',
    flag: '🇵🇹',
  },
  {
    code: 'es',
    name: 'Spanish',
    localName: 'Español',
    region: 'Guinea Ecuatorial & Internacional',
    flag: '🇪🇸',
  },
];
