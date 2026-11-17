export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'KES'
  | 'ZAR'
  | 'GHS'
  | 'MAD'
  | 'XAF'
  | 'AED'
  | 'UGX'
  | 'TZS'
  | 'RWF'
  | 'ZMW'
  | 'EGP'
  | 'ZIP';

export type LanguageCode = 'en' | 'fr' | 'sw' | 'ar';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  regionDesc: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  region: string;
  rate: number; // Multiplier from NGN: amountInNGN * rate = target amount
  rateToNGN: number; // 1 unit in NGN (for human readable conversion display e.g. 1 USD = ₦1,490)
  decimals: number;
  format: (amount: number, options?: { compact?: boolean }) => string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  business: string;
  industry: string;
  city: string;
  country: string;
  countryCode: string;
  image: string;
  quote: string;
  stats: string;
  badge: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  tagline: string;
  modules: string[];
  description: string;
  image: string;
  stats: string;
  features: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  monthlyPriceNGN: number;
  annualPriceNGN: number;
  isPopular?: boolean;
  highlightColor?: string;
  features: string[];
  ctaText: string;
}

export interface IntegrationItem {
  name: string;
  category: 'Banking' | 'Payments' | 'E-commerce' | 'POS' | 'Tax' | 'Shipping';
  description: string;
  iconBg: string;
  logoText: string;
  badge?: string;
}

export interface ResourceArticle {
  title: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  date: string;
}
