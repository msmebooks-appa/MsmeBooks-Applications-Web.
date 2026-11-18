export type CurrencyCode =
  | 'USD'
  | 'NGN'
  | 'GBP'
  | 'EUR'
  | 'KES'
  | 'ZAR'
  | 'GHS'
  | 'MAD'
  | 'XAF'
  | 'XOF'
  | 'AED'
  | 'UGX'
  | 'TZS'
  | 'RWF'
  | 'ZMW'
  | 'EGP'
  | 'ZIP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'CNY'
  | 'INR'
  | 'BRL'
  | 'CHF'
  | string;

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  region?: 'Africa' | 'Americas' | 'Europe' | 'Asia' | 'Middle East' | 'Oceania' | 'Global';
  ratePerUSD: number; // How many units of this currency = 1 USD
  flag: string;
  fractionDigits: number;
  isPopular?: boolean;
}
