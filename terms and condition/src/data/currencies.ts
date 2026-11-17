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

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  ratePerUsd: number; // units per 1 USD
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    ratePerUsd: 1600,
    locale: 'en-NG',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    ratePerUsd: 1.0,
    locale: 'en-US',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    ratePerUsd: 0.79,
    locale: 'en-GB',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    ratePerUsd: 0.92,
    locale: 'de-DE',
    decimals: 2,
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    ratePerUsd: 129.5,
    locale: 'sw-KE',
    decimals: 0,
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    ratePerUsd: 18.25,
    locale: 'en-ZA',
    decimals: 2,
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    flag: '🇬🇭',
    ratePerUsd: 15.85,
    locale: 'en-GH',
    decimals: 2,
  },
  MAD: {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD',
    flag: '🇲🇦',
    ratePerUsd: 9.85,
    locale: 'ar-MA',
    decimals: 2,
  },
  XAF: {
    code: 'XAF',
    name: 'Central African CFA',
    symbol: 'FCFA',
    flag: '🇨🇲',
    ratePerUsd: 605,
    locale: 'fr-CM',
    decimals: 0,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    ratePerUsd: 3.6725,
    locale: 'ar-AE',
    decimals: 2,
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    flag: '🇺🇬',
    ratePerUsd: 3680,
    locale: 'en-UG',
    decimals: 0,
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    flag: '🇹🇿',
    ratePerUsd: 2650,
    locale: 'sw-TZ',
    decimals: 0,
  },
  RWF: {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'RF',
    flag: '🇷🇼',
    ratePerUsd: 1385,
    locale: 'rw-RW',
    decimals: 0,
  },
  ZMW: {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'K',
    flag: '🇿🇲',
    ratePerUsd: 26.5,
    locale: 'en-ZM',
    decimals: 2,
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    flag: '🇪🇬',
    ratePerUsd: 48.6,
    locale: 'ar-EG',
    decimals: 2,
  },
  ZIP: {
    code: 'ZIP',
    name: 'Zimbabwe Gold / ZiG',
    symbol: 'ZiG',
    flag: '🇿🇼',
    ratePerUsd: 27.5,
    locale: 'en-ZW',
    decimals: 2,
  },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

/**
 * Converts an amount from base currency (NGN) to any target currency
 */
export function convertFromNgn(amountNgn: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'NGN') return amountNgn;
  const usdAmount = amountNgn / CURRENCIES.NGN.ratePerUsd;
  const targetRate = CURRENCIES[targetCurrency].ratePerUsd;
  return usdAmount * targetRate;
}

/**
 * Formats a converted amount with symbol and appropriate thousand separators
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: CurrencyCode,
  options?: { compact?: boolean; forceDecimals?: boolean }
): string {
  const info = CURRENCIES[currencyCode];
  const decimals = options?.forceDecimals !== undefined
    ? (options.forceDecimals ? 2 : 0)
    : info.decimals;

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${info.symbol} ${formattedNum}`;
}

/**
 * Directly formats a base NGN amount into target currency string
 */
export function formatNgnToCurrency(
  baseNgn: number,
  targetCurrency: CurrencyCode,
  options?: { compact?: boolean; forceDecimals?: boolean }
): string {
  const converted = convertFromNgn(baseNgn, targetCurrency);
  return formatCurrencyAmount(converted, targetCurrency, options);
}
