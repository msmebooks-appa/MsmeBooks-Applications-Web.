export type SupportedCurrency = 'NGN' | 'USD' | 'GHS' | 'KES' | 'ZAR' | 'XOF' | 'XAF' | 'EUR' | 'GBP' | 'EGP' | 'ZWL';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  exchangeRateToNgn: number; // 1 NGN = exchangeRateToNgn in this currency
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    exchangeRateToNgn: 1.0,
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    exchangeRateToNgn: 0.00067, // ~1,500 NGN per USD
    symbolPosition: 'prefix',
    decimalPlaces: 2
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    exchangeRateToNgn: 0.010, // ~100 NGN per GHS
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    exchangeRateToNgn: 0.087, // ~11.5 NGN per KES
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    exchangeRateToNgn: 0.012, // ~83 NGN per ZAR
    symbolPosition: 'prefix',
    decimalPlaces: 0
  },
  XOF: {
    code: 'XOF',
    symbol: 'CFA',
    name: 'West African CFA (BCEAO)',
    flag: '🇨🇮',
    exchangeRateToNgn: 0.408, // ~2.45 NGN per XOF
    symbolPosition: 'suffix',
    decimalPlaces: 0
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA (BEAC)',
    flag: '🇨🇲',
    exchangeRateToNgn: 0.408, // ~2.45 NGN per XAF
    symbolPosition: 'suffix',
    decimalPlaces: 0
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EU)',
    flag: '🇪🇺',
    exchangeRateToNgn: 0.00062, // ~1,600 NGN per EUR
    symbolPosition: 'prefix',
    decimalPlaces: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    exchangeRateToNgn: 0.00053, // ~1,900 NGN per GBP
    symbolPosition: 'prefix',
    decimalPlaces: 2
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    exchangeRateToNgn: 0.033, // ~30 NGN per EGP
    symbolPosition: 'prefix',
    decimalPlaces: 1
  },
  ZWL: {
    code: 'ZWL',
    symbol: 'ZiG',
    name: 'Zimbabwe Gold / USD',
    flag: '🇿🇼',
    exchangeRateToNgn: 0.018, // ~55 NGN per ZiG
    symbolPosition: 'prefix',
    decimalPlaces: 1
  }
};

export const convertNgnToCurrency = (amountNgn: number, currency: SupportedCurrency): number => {
  if (amountNgn === 0) return 0;
  const config = CURRENCIES[currency] || CURRENCIES.NGN;
  const converted = amountNgn * config.exchangeRateToNgn;
  if (config.decimalPlaces === 0) {
    return Math.round(converted);
  }
  return parseFloat(converted.toFixed(config.decimalPlaces));
};

export const formatCurrency = (amountNgn: number, currency: SupportedCurrency = 'NGN'): string => {
  if (amountNgn === 0) return 'FREE';
  const config = CURRENCIES[currency] || CURRENCIES.NGN;
  const converted = convertNgnToCurrency(amountNgn, currency);

  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  });

  if (config.symbolPosition === 'suffix') {
    return `${formattedNumber} ${config.symbol}`;
  }
  return `${config.symbol}${formattedNumber}`;
};
