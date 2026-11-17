import { Language, LanguageInfo, TranslationDictionary } from './types';
import { en } from './en';
import { fr } from './fr';
import { pt } from './pt';
import { es } from './es';

export * from './types';

export const supportedLanguages: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global & Africa',
    flag: '🇬🇧',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'Afrique & International',
    flag: '🇫🇷',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'PALOP & Brasil',
    flag: '🇵🇹',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Internacional',
    flag: '🇪🇸',
  },
];

export const translations: Record<Language, TranslationDictionary> = {
  en,
  fr,
  pt,
  es,
};

/**
 * Maps English category names to localized translations across all supported languages
 */
export const categoryTranslations: Record<Language, Record<string, string>> = {
  en: {
    All: 'All',
    Accounting: 'Accounting',
    POS: 'POS',
    Inventory: 'Inventory',
    'SME Growth': 'SME Growth',
    'Business Management': 'Business Management',
    Finance: 'Finance',
    Retail: 'Retail',
    'AI & Automation': 'AI & Automation',
    'Case Studies': 'Case Studies',
  },
  fr: {
    All: 'Tous',
    Accounting: 'Comptabilité',
    POS: 'Caisse (POS)',
    Inventory: 'Gestion des Stocks',
    'SME Growth': 'Croissance PME',
    'Business Management': 'Gestion d\'Entreprise',
    Finance: 'Finances & Trésorerie',
    Retail: 'Commerce & Détail',
    'AI & Automation': 'IA & Automatisation',
    'Case Studies': 'Études de Cas',
  },
  pt: {
    All: 'Todos',
    Accounting: 'Contabilidade',
    POS: 'Ponto de Venda (POS)',
    Inventory: 'Gestão de Inventário',
    'SME Growth': 'Crescimento de PME',
    'Business Management': 'Gestão Empresarial',
    Finance: 'Finanças & Tesouraria',
    Retail: 'Comércio & Retalho',
    'AI & Automation': 'IA & Automação',
    'Case Studies': 'Estudos de Caso',
  },
  es: {
    All: 'Todos',
    Accounting: 'Contabilidad',
    POS: 'Punto de Venta (TPV)',
    Inventory: 'Control de Inventarios',
    'SME Growth': 'Crecimiento de PYMES',
    'Business Management': 'Gestión Empresarial',
    Finance: 'Finanzas y Tesorería',
    Retail: 'Comercio y Retail',
    'AI & Automation': 'IA y Automatización',
    'Case Studies': 'Casos de Estudio',
  },
};
