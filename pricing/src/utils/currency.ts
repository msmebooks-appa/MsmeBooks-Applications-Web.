import { Currency, CurrencyInfo, PricingPlan, BillingPeriod } from '../types';

export const CURRENCY_REGIONS = [
  'All',
  'Default (Nigeria)',
  'West Africa',
  'East Africa',
  'Southern Africa',
  'Central & North Africa',
  'Europe & Americas',
  'Asia & Pacific',
  'Middle East',
] as const;

export const SUPPORTED_CURRENCIES: Record<Currency, CurrencyInfo> = {
  // Nigeria - Default Currency of the Platform
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira (Default)',
    symbol: '₦',
    flag: '🇳🇬',
    rateFromNgn: 1,
    locale: 'en-NG',
    region: 'Default (Nigeria)',
    country: 'Nigeria',
    isDefault: true,
    prefix: true,
  },

  // West Africa
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵ ',
    flag: '🇬🇭',
    rateFromNgn: 1 / 98,
    locale: 'en-GH',
    region: 'West Africa',
    country: 'Ghana',
    prefix: true,
  },
  XOF: {
    code: 'XOF',
    name: 'West African CFA Franc',
    symbol: 'CFA ',
    flag: '🇸🇳',
    rateFromNgn: 1 / 2.48,
    locale: 'fr-SN',
    region: 'West Africa',
    country: 'Senegal & Côte d\'Ivoire',
    prefix: true,
  },
  GMD: {
    code: 'GMD',
    name: 'Gambian Dalasi',
    symbol: 'D ',
    flag: '🇬🇲',
    rateFromNgn: 1 / 21.5,
    locale: 'en-GM',
    region: 'West Africa',
    country: 'Gambia',
    prefix: true,
  },
  SLL: {
    code: 'SLL',
    name: 'Sierra Leonean Leone',
    symbol: 'Le ',
    flag: '🇸🇱',
    rateFromNgn: 1 / 0.066,
    locale: 'en-SL',
    region: 'West Africa',
    country: 'Sierra Leone',
    prefix: true,
  },
  LRD: {
    code: 'LRD',
    name: 'Liberian Dollar',
    symbol: 'L$ ',
    flag: '🇱🇷',
    rateFromNgn: 1 / 7.6,
    locale: 'en-LR',
    region: 'West Africa',
    country: 'Liberia',
    prefix: true,
  },
  GNF: {
    code: 'GNF',
    name: 'Guinean Franc',
    symbol: 'FG ',
    flag: '🇬🇳',
    rateFromNgn: 1 / 0.174,
    locale: 'fr-GN',
    region: 'West Africa',
    country: 'Guinea',
    prefix: true,
  },
  CVE: {
    code: 'CVE',
    name: 'Cape Verdean Escudo',
    symbol: 'Esc ',
    flag: '🇨🇻',
    rateFromNgn: 1 / 14.8,
    locale: 'pt-CV',
    region: 'West Africa',
    country: 'Cape Verde',
    prefix: true,
  },

  // East Africa
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh ',
    flag: '🇰🇪',
    rateFromNgn: 1 / 11.5,
    locale: 'en-KE',
    region: 'East Africa',
    country: 'Kenya',
    prefix: true,
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh ',
    flag: '🇺🇬',
    rateFromNgn: 1 / 0.41,
    locale: 'en-UG',
    region: 'East Africa',
    country: 'Uganda',
    prefix: true,
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh ',
    flag: '🇹🇿',
    rateFromNgn: 1 / 0.57,
    locale: 'en-TZ',
    region: 'East Africa',
    country: 'Tanzania',
    prefix: true,
  },
  RWF: {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'RWF ',
    flag: '🇷🇼',
    rateFromNgn: 1 / 1.11,
    locale: 'rw-RW',
    region: 'East Africa',
    country: 'Rwanda',
    prefix: true,
  },
  ETB: {
    code: 'ETB',
    name: 'Ethiopian Birr',
    symbol: 'Br ',
    flag: '🇪🇹',
    rateFromNgn: 1 / 12.2,
    locale: 'am-ET',
    region: 'East Africa',
    country: 'Ethiopia',
    prefix: true,
  },
  BIF: {
    code: 'BIF',
    name: 'Burundian Franc',
    symbol: 'FBu ',
    flag: '🇧🇮',
    rateFromNgn: 1 / 0.51,
    locale: 'fr-BI',
    region: 'East Africa',
    country: 'Burundi',
    prefix: true,
  },
  SOS: {
    code: 'SOS',
    name: 'Somali Shilling',
    symbol: 'So.Sh. ',
    flag: '🇸🇴',
    rateFromNgn: 1 / 2.63,
    locale: 'so-SO',
    region: 'East Africa',
    country: 'Somalia',
    prefix: true,
  },
  DJF: {
    code: 'DJF',
    name: 'Djiboutian Franc',
    symbol: 'Fdj ',
    flag: '🇩🇯',
    rateFromNgn: 1 / 8.43,
    locale: 'fr-DJ',
    region: 'East Africa',
    country: 'Djibouti',
    prefix: true,
  },
  SSP: {
    code: 'SSP',
    name: 'South Sudanese Pound',
    symbol: 'SS£ ',
    flag: '🇸🇸',
    rateFromNgn: 1 / 0.95,
    locale: 'en-SS',
    region: 'East Africa',
    country: 'South Sudan',
    prefix: true,
  },

  // Southern Africa
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R ',
    flag: '🇿🇦',
    rateFromNgn: 1 / 82,
    locale: 'en-ZA',
    region: 'Southern Africa',
    country: 'South Africa',
    prefix: true,
  },
  BWP: {
    code: 'BWP',
    name: 'Botswana Pula',
    symbol: 'P ',
    flag: '🇧🇼',
    rateFromNgn: 1 / 110,
    locale: 'en-BW',
    region: 'Southern Africa',
    country: 'Botswana',
    prefix: true,
  },
  NAD: {
    code: 'NAD',
    name: 'Namibian Dollar',
    symbol: 'N$ ',
    flag: '🇳🇦',
    rateFromNgn: 1 / 82,
    locale: 'en-NA',
    region: 'Southern Africa',
    country: 'Namibia',
    prefix: true,
  },
  ZMW: {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'ZK ',
    flag: '🇿🇲',
    rateFromNgn: 1 / 55,
    locale: 'en-ZM',
    region: 'Southern Africa',
    country: 'Zambia',
    prefix: true,
  },
  ZIP: {
    code: 'ZIP',
    name: 'Zimbabwe Gold (ZiG)',
    symbol: 'ZiG ',
    flag: '🇿🇼',
    rateFromNgn: 1 / 58,
    locale: 'en-ZW',
    region: 'Southern Africa',
    country: 'Zimbabwe',
    prefix: true,
  },
  MWK: {
    code: 'MWK',
    name: 'Malawian Kwacha',
    symbol: 'MK ',
    flag: '🇲🇼',
    rateFromNgn: 1 / 0.86,
    locale: 'en-MW',
    region: 'Southern Africa',
    country: 'Malawi',
    prefix: true,
  },
  MZN: {
    code: 'MZN',
    name: 'Mozambican Metical',
    symbol: 'MT ',
    flag: '🇲🇿',
    rateFromNgn: 1 / 23.5,
    locale: 'pt-MZ',
    region: 'Southern Africa',
    country: 'Mozambique',
    prefix: true,
  },
  SZL: {
    code: 'SZL',
    name: 'Eswatini Lilangeni',
    symbol: 'L ',
    flag: '🇸🇿',
    rateFromNgn: 1 / 82,
    locale: 'en-SZ',
    region: 'Southern Africa',
    country: 'Eswatini',
    prefix: true,
  },
  LSL: {
    code: 'LSL',
    name: 'Lesotho Loti',
    symbol: 'M ',
    flag: '🇱🇸',
    rateFromNgn: 1 / 82,
    locale: 'en-LS',
    region: 'Southern Africa',
    country: 'Lesotho',
    prefix: true,
  },
  MUR: {
    code: 'MUR',
    name: 'Mauritian Rupee',
    symbol: 'Rs ',
    flag: '🇲🇺',
    rateFromNgn: 1 / 32.5,
    locale: 'en-MU',
    region: 'Southern Africa',
    country: 'Mauritius',
    prefix: true,
  },
  SCR: {
    code: 'SCR',
    name: 'Seychellois Rupee',
    symbol: 'SR ',
    flag: '🇸🇨',
    rateFromNgn: 1 / 105,
    locale: 'en-SC',
    region: 'Southern Africa',
    country: 'Seychelles',
    prefix: true,
  },
  MGA: {
    code: 'MGA',
    name: 'Malagasy Ariary',
    symbol: 'Ar ',
    flag: '🇲🇬',
    rateFromNgn: 1 / 0.32,
    locale: 'mg-MG',
    region: 'Southern Africa',
    country: 'Madagascar',
    prefix: true,
  },

  // Central & North Africa
  XAF: {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA ',
    flag: '🇨🇲',
    rateFromNgn: 1 / 2.48,
    locale: 'fr-CM',
    region: 'Central & North Africa',
    country: 'Cameroon & Central Africa',
    prefix: true,
  },
  AOA: {
    code: 'AOA',
    name: 'Angolan Kwanza',
    symbol: 'Kz ',
    flag: '🇦🇴',
    rateFromNgn: 1 / 1.62,
    locale: 'pt-AO',
    region: 'Central & North Africa',
    country: 'Angola',
    prefix: true,
  },
  CDF: {
    code: 'CDF',
    name: 'Congolese Franc',
    symbol: 'FC ',
    flag: '🇨🇩',
    rateFromNgn: 1 / 0.52,
    locale: 'fr-CD',
    region: 'Central & North Africa',
    country: 'DR Congo',
    prefix: true,
  },
  STN: {
    code: 'STN',
    name: 'São Tomé Dobra',
    symbol: 'Db ',
    flag: '🇸🇹',
    rateFromNgn: 1 / 65.5,
    locale: 'pt-ST',
    region: 'Central & North Africa',
    country: 'São Tomé and Príncipe',
    prefix: true,
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£ ',
    flag: '🇪🇬',
    rateFromNgn: 1 / 30.5,
    locale: 'ar-EG',
    region: 'Central & North Africa',
    country: 'Egypt',
    prefix: true,
  },
  MAD: {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD ',
    flag: '🇲🇦',
    rateFromNgn: 1 / 152,
    locale: 'fr-MA',
    region: 'Central & North Africa',
    country: 'Morocco',
    prefix: true,
  },
  DZD: {
    code: 'DZD',
    name: 'Algerian Dinar',
    symbol: 'DA ',
    flag: '🇩🇿',
    rateFromNgn: 1 / 11.2,
    locale: 'ar-DZ',
    region: 'Central & North Africa',
    country: 'Algeria',
    prefix: true,
  },
  TND: {
    code: 'TND',
    name: 'Tunisian Dinar',
    symbol: 'DT ',
    flag: '🇹🇳',
    rateFromNgn: 1 / 480,
    locale: 'ar-TN',
    region: 'Central & North Africa',
    country: 'Tunisia',
    prefix: true,
  },
  LYD: {
    code: 'LYD',
    name: 'Libyan Dinar',
    symbol: 'LD ',
    flag: '🇱🇾',
    rateFromNgn: 1 / 305,
    locale: 'ar-LY',
    region: 'Central & North Africa',
    country: 'Libya',
    prefix: true,
  },
  SDG: {
    code: 'SDG',
    name: 'Sudanese Pound',
    symbol: 'SD£ ',
    flag: '🇸🇩',
    rateFromNgn: 1 / 2.5,
    locale: 'ar-SD',
    region: 'Central & North Africa',
    country: 'Sudan',
    prefix: true,
  },
  MRU: {
    code: 'MRU',
    name: 'Mauritanian Ouguiya',
    symbol: 'UM ',
    flag: '🇲🇷',
    rateFromNgn: 1 / 37.8,
    locale: 'ar-MR',
    region: 'West Africa',
    country: 'Mauritania',
    prefix: true,
  },
  ERN: {
    code: 'ERN',
    name: 'Eritrean Nakfa',
    symbol: 'Nfk ',
    flag: '🇪🇷',
    rateFromNgn: 1 / 100,
    locale: 'ti-ER',
    region: 'East Africa',
    country: 'Eritrea',
    prefix: true,
  },
  KMF: {
    code: 'KMF',
    name: 'Comorian Franc',
    symbol: 'CF ',
    flag: '🇰🇲',
    rateFromNgn: 1 / 3.3,
    locale: 'ar-KM',
    region: 'East Africa',
    country: 'Comoros',
    prefix: true,
  },
  ZWL: {
    code: 'ZWL',
    name: 'Zimbabwean Dollar (RTGS)',
    symbol: 'Z$ ',
    flag: '🇿🇼',
    rateFromNgn: 1 / 0.05,
    locale: 'en-ZW',
    region: 'Southern Africa',
    country: 'Zimbabwe',
    prefix: true,
  },

  // Europe & Americas
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rateFromNgn: 1 / 1500,
    locale: 'en-US',
    region: 'Europe & Americas',
    country: 'United States',
    prefix: true,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateFromNgn: 1 / 1630,
    locale: 'de-DE',
    region: 'Europe & Americas',
    country: 'European Union',
    prefix: true,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rateFromNgn: 1 / 1920,
    locale: 'en-GB',
    region: 'Europe & Americas',
    country: 'United Kingdom',
    prefix: true,
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    rateFromNgn: 1 / 1060,
    locale: 'en-CA',
    region: 'Europe & Americas',
    country: 'Canada',
    prefix: true,
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    flag: '🇨🇭',
    rateFromNgn: 1 / 1690,
    locale: 'de-CH',
    region: 'Europe & Americas',
    country: 'Switzerland',
    prefix: true,
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    flag: '🇧🇷',
    rateFromNgn: 1 / 260,
    locale: 'pt-BR',
    region: 'Europe & Americas',
    country: 'Brazil',
    prefix: true,
  },
  MXN: {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: 'MX$',
    flag: '🇲🇽',
    rateFromNgn: 1 / 74,
    locale: 'es-MX',
    region: 'Europe & Americas',
    country: 'Mexico',
    prefix: true,
  },
  ARS: {
    code: 'ARS',
    name: 'Argentine Peso',
    symbol: 'AR$',
    flag: '🇦🇷',
    rateFromNgn: 1 / 1.45,
    locale: 'es-AR',
    region: 'Europe & Americas',
    country: 'Argentina',
    prefix: true,
  },
  COP: {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: 'COL$',
    flag: '🇨🇴',
    rateFromNgn: 1 / 0.36,
    locale: 'es-CO',
    region: 'Europe & Americas',
    country: 'Colombia',
    prefix: true,
  },
  CLP: {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: 'CLP$',
    flag: '🇨🇱',
    rateFromNgn: 1 / 1.55,
    locale: 'es-CL',
    region: 'Europe & Americas',
    country: 'Chile',
    prefix: true,
  },
  SEK: {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr ',
    flag: '🇸🇪',
    rateFromNgn: 1 / 142,
    locale: 'sv-SE',
    region: 'Europe & Americas',
    country: 'Sweden',
    prefix: true,
  },
  NOK: {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr ',
    flag: '🇳🇴',
    rateFromNgn: 1 / 138,
    locale: 'nb-NO',
    region: 'Europe & Americas',
    country: 'Norway',
    prefix: true,
  },
  DKK: {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr. ',
    flag: '🇩🇰',
    rateFromNgn: 1 / 218,
    locale: 'da-DK',
    region: 'Europe & Americas',
    country: 'Denmark',
    prefix: true,
  },
  PLN: {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł ',
    flag: '🇵🇱',
    rateFromNgn: 1 / 380,
    locale: 'pl-PL',
    region: 'Europe & Americas',
    country: 'Poland',
    prefix: true,
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    flag: '🇹🇷',
    rateFromNgn: 1 / 43,
    locale: 'tr-TR',
    region: 'Europe & Americas',
    country: 'Turkey',
    prefix: true,
  },

  // Asia & Pacific
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    rateFromNgn: 1 / 9.8,
    locale: 'ja-JP',
    region: 'Asia & Pacific',
    country: 'Japan',
    prefix: true,
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    rateFromNgn: 1 / 208,
    locale: 'zh-CN',
    region: 'Asia & Pacific',
    country: 'China',
    prefix: true,
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rateFromNgn: 1 / 17.6,
    locale: 'en-IN',
    region: 'Asia & Pacific',
    country: 'India',
    prefix: true,
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    rateFromNgn: 1 / 975,
    locale: 'en-AU',
    region: 'Asia & Pacific',
    country: 'Australia',
    prefix: true,
  },
  NZD: {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    flag: '🇳🇿',
    rateFromNgn: 1 / 885,
    locale: 'en-NZ',
    region: 'Asia & Pacific',
    country: 'New Zealand',
    prefix: true,
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    rateFromNgn: 1 / 1120,
    locale: 'en-SG',
    region: 'Asia & Pacific',
    country: 'Singapore',
    prefix: true,
  },
  HKD: {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    flag: '🇭🇰',
    rateFromNgn: 1 / 192,
    locale: 'en-HK',
    region: 'Asia & Pacific',
    country: 'Hong Kong',
    prefix: true,
  },
  KRW: {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷',
    rateFromNgn: 1 / 1.08,
    locale: 'ko-KR',
    region: 'Asia & Pacific',
    country: 'South Korea',
    prefix: true,
  },
  MYR: {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM ',
    flag: '🇲🇾',
    rateFromNgn: 1 / 340,
    locale: 'ms-MY',
    region: 'Asia & Pacific',
    country: 'Malaysia',
    prefix: true,
  },
  IDR: {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp ',
    flag: '🇮🇩',
    rateFromNgn: 1 / 0.093,
    locale: 'id-ID',
    region: 'Asia & Pacific',
    country: 'Indonesia',
    prefix: true,
  },
  THB: {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    flag: '🇹🇭',
    rateFromNgn: 1 / 44,
    locale: 'th-TH',
    region: 'Asia & Pacific',
    country: 'Thailand',
    prefix: true,
  },
  PHP: {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    flag: '🇵🇭',
    rateFromNgn: 1 / 26.5,
    locale: 'fil-PH',
    region: 'Asia & Pacific',
    country: 'Philippines',
    prefix: true,
  },
  VND: {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    flag: '🇻🇳',
    rateFromNgn: 1 / 0.059,
    locale: 'vi-VN',
    region: 'Asia & Pacific',
    country: 'Vietnam',
    prefix: true,
  },
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: 'PKR ',
    flag: '🇵🇰',
    rateFromNgn: 1 / 5.38,
    locale: 'ur-PK',
    region: 'Asia & Pacific',
    country: 'Pakistan',
    prefix: true,
  },
  BDT: {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    flag: '🇧🇩',
    rateFromNgn: 1 / 12.4,
    locale: 'bn-BD',
    region: 'Asia & Pacific',
    country: 'Bangladesh',
    prefix: true,
  },

  // Middle East
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    flag: '🇦🇪',
    rateFromNgn: 1 / 408,
    locale: 'en-AE',
    region: 'Middle East',
    country: 'United Arab Emirates',
    prefix: true,
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SAR ',
    flag: '🇸🇦',
    rateFromNgn: 1 / 400,
    locale: 'ar-SA',
    region: 'Middle East',
    country: 'Saudi Arabia',
    prefix: true,
  },
  QAR: {
    code: 'QAR',
    name: 'Qatari Riyal',
    symbol: 'QR ',
    flag: '🇶🇦',
    rateFromNgn: 1 / 412,
    locale: 'ar-QA',
    region: 'Middle East',
    country: 'Qatar',
    prefix: true,
  },
  KWD: {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    symbol: 'KD ',
    flag: '🇰🇼',
    rateFromNgn: 1 / 4900,
    locale: 'ar-KW',
    region: 'Middle East',
    country: 'Kuwait',
    prefix: true,
  },
  BHD: {
    code: 'BHD',
    name: 'Bahraini Dinar',
    symbol: 'BD ',
    flag: '🇧🇭',
    rateFromNgn: 1 / 3980,
    locale: 'ar-BH',
    region: 'Middle East',
    country: 'Bahrain',
    prefix: true,
  },
  OMR: {
    code: 'OMR',
    name: 'Omani Rial',
    symbol: 'OMR ',
    flag: '🇴🇲',
    rateFromNgn: 1 / 3890,
    locale: 'ar-OM',
    region: 'Middle East',
    country: 'Oman',
    prefix: true,
  },
  JOD: {
    code: 'JOD',
    name: 'Jordanian Dinar',
    symbol: 'JD ',
    flag: '🇯🇴',
    rateFromNgn: 1 / 2115,
    locale: 'ar-JO',
    region: 'Middle East',
    country: 'Jordan',
    prefix: true,
  },
  ILS: {
    code: 'ILS',
    name: 'Israeli New Shekel',
    symbol: '₪',
    flag: '🇮🇱',
    rateFromNgn: 1 / 410,
    locale: 'he-IL',
    region: 'Middle East',
    country: 'Israel',
    prefix: true,
  },
};

export const CURRENCY_LIST = Object.values(SUPPORTED_CURRENCIES);

export const POPULAR_CURRENCIES: Currency[] = [
  'NGN',
  'USD',
  'GBP',
  'EUR',
  'KES',
  'ZAR',
  'GHS',
  'CAD',
  'AUD',
  'INR',
  'AED',
];

/**
 * Converts a base NGN amount to the target currency
 */
export function convertFromNgn(amountInNgn: number, targetCurrency: Currency | string = 'NGN'): number {
  const info = SUPPORTED_CURRENCIES[targetCurrency as Currency] || SUPPORTED_CURRENCIES.NGN;
  return amountInNgn * info.rateFromNgn;
}

/**
 * Formats a monetary value (base currency: NGN) into a formatted string with correct
 * symbol, localized thousands grouping, and optional compact notation ('k', 'M', 'B').
 */
export function formatCurrency(
  amountInNaira: number,
  currency: Currency | string = 'NGN',
  options?: {
    hideDecimals?: boolean;
    compact?: boolean;
    includeCode?: boolean;
  }
): string {
  const currKey = (currency in SUPPORTED_CURRENCIES ? currency : 'NGN') as Currency;
  const info = SUPPORTED_CURRENCIES[currKey] || SUPPORTED_CURRENCIES.NGN;
  const converted = amountInNaira * info.rateFromNgn;

  // Compact representation (e.g., $1.4k, ₦18.4M)
  if (options?.compact) {
    if (Math.abs(converted) >= 1_000_000_000) {
      const billions = converted / 1_000_000_000;
      return `${info.symbol}${billions.toLocaleString(info.locale, { maximumFractionDigits: 1 })}B`;
    }
    if (Math.abs(converted) >= 1_000_000) {
      const millions = converted / 1_000_000;
      return `${info.symbol}${millions.toLocaleString(info.locale, { maximumFractionDigits: 1 })}M`;
    }
    if (Math.abs(converted) >= 1_000) {
      const thousands = converted / 1_000;
      return `${info.symbol}${thousands.toLocaleString(info.locale, { maximumFractionDigits: 1 })}k`;
    }
  }

  // Standard representation
  let formattedNumber: string;
  if (Math.abs(converted) >= 100) {
    formattedNumber = Math.round(converted).toLocaleString(info.locale, {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  } else if (Math.abs(converted) >= 1) {
    formattedNumber = converted.toLocaleString(info.locale, {
      maximumFractionDigits: options?.hideDecimals ? 0 : 1,
      useGrouping: true,
    });
  } else {
    formattedNumber = converted.toLocaleString(info.locale, {
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }

  const result = `${info.symbol}${formattedNumber}`;
  if (options?.includeCode) {
    return `${result} ${info.code}`;
  }
  return result;
}

/**
 * Computes the annual savings for a plan based on monthly price * 12 vs yearlyPrice
 */
export function getPlanSavingsText(plan: PricingPlan, currency: Currency | string = 'NGN'): string | null {
  if (plan.customPricing || !plan.monthlyPrice || !plan.yearlyPrice) {
    return null;
  }

  const annualStandard = plan.monthlyPrice * 12;
  const savings = annualStandard - plan.yearlyPrice;
  if (savings <= 0) return null;

  const percentage = Math.round((savings / annualStandard) * 100);
  const formattedSavings = formatCurrency(savings, currency);

  return `Save ${formattedSavings}/year (${percentage}% OFF)`;
}

/**
 * Gets the price to display for a plan given billing period and currency
 */
export function getPlanDisplayPrice(
  plan: PricingPlan,
  billingPeriod: BillingPeriod,
  currency: Currency | string = 'NGN'
): string {
  if (plan.customPricing) {
    return 'Custom';
  }
  const amount = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPricePerMonth;
  return formatCurrency(amount, currency);
}

/**
 * Gets the annual billed total string
 */
export function getAnnualTotalText(
  plan: PricingPlan,
  currency: Currency | string = 'NGN'
): string | null {
  if (plan.customPricing || !plan.yearlyPrice) return null;
  return `Billed as ${formatCurrency(plan.yearlyPrice, currency)} / year`;
}

/**
 * Detects user's local currency based on browser language, region, and time zone.
 * Defaults reliably to 'NGN' (Nigerian Naira) as the platform baseline.
 */
export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return 'NGN';

  try {
    // 1. Timezone heuristic
    let timeZone = '';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      // Ignore
    }

    if (timeZone) {
      if (timeZone.includes('Lagos')) return 'NGN';
      if (timeZone.includes('Nairobi')) return 'KES';
      if (timeZone.includes('Accra')) return 'GHS';
      if (timeZone.includes('Johannesburg')) return 'ZAR';
      if (timeZone.includes('Kampala')) return 'UGX';
      if (timeZone.includes('Dar_es_Salaam')) return 'TZS';
      if (timeZone.includes('Kigali')) return 'RWF';
      if (timeZone.includes('Cairo')) return 'EGP';
      if (timeZone.includes('Casablanca')) return 'MAD';
      if (timeZone.includes('Dakar') || timeZone.includes('Abidjan')) return 'XOF';
      if (timeZone.includes('Douala')) return 'XAF';
      if (timeZone.includes('Lusaka')) return 'ZMW';
      if (timeZone.includes('Gaborone')) return 'BWP';
      if (timeZone.includes('London')) return 'GBP';
      if (timeZone.includes('Paris') || timeZone.includes('Berlin') || timeZone.includes('Madrid') || timeZone.includes('Rome')) return 'EUR';
    }

    // 2. Browser languages
    const languages: string[] = [];
    if (navigator.languages && navigator.languages.length > 0) {
      languages.push(...navigator.languages);
    }
    if (navigator.language) {
      languages.push(navigator.language);
    }

    for (const lang of languages) {
      const parts = lang.split('-');
      const region = (parts[1] || parts[0]).toUpperCase();

      switch (region) {
        case 'NG':
          return 'NGN';
        case 'KE':
          return 'KES';
        case 'GH':
          return 'GHS';
        case 'ZA':
          return 'ZAR';
        case 'UG':
          return 'UGX';
        case 'TZ':
          return 'TZS';
        case 'RW':
          return 'RWF';
        case 'EG':
          return 'EGP';
        case 'MA':
          return 'MAD';
        case 'SN':
        case 'CI':
        case 'ML':
        case 'BF':
        case 'BJ':
        case 'TG':
        case 'NE':
          return 'XOF';
        case 'CM':
        case 'GA':
        case 'CG':
        case 'TD':
        case 'CF':
          return 'XAF';
        case 'ZM':
          return 'ZMW';
        case 'BW':
          return 'BWP';
        case 'GB':
          return 'GBP';
        case 'FR':
        case 'DE':
        case 'ES':
        case 'IT':
        case 'PT':
        case 'NL':
        case 'BE':
        case 'IE':
          return 'EUR';
        case 'US':
          return 'USD';
      }
    }
  } catch {
    // Safe fallback
  }

  // Baseline default for MsmeBooks
  return 'NGN';
}

/**
 * Updates in-memory exchange rates with live rates from public API
 */
export function updateLiveExchangeRates(rates: Record<string, number>): number {
  let updatedCount = 0;
  for (const [code, rate] of Object.entries(rates)) {
    const upperCode = code.toUpperCase();
    if (upperCode in SUPPORTED_CURRENCIES && typeof rate === 'number' && rate > 0) {
      SUPPORTED_CURRENCIES[upperCode as Currency].rateFromNgn = rate;
      updatedCount++;
    }
  }
  return updatedCount;
}

/**
 * Register any missing currency from the live API with sensible defaults
 */
export function registerCurrencyIfMissing(code: string, rateFromNgn: number): void {
  const upperCode = code.toUpperCase();
  if (!(upperCode in SUPPORTED_CURRENCIES) && typeof rateFromNgn === 'number' && rateFromNgn > 0) {
    SUPPORTED_CURRENCIES[upperCode as Currency] = {
      code: upperCode,
      name: `${upperCode} Currency`,
      symbol: `${upperCode} `,
      flag: '🌐',
      rateFromNgn,
      locale: 'en-US',
      region: 'Global',
      country: upperCode,
      prefix: true,
    };
  }
}

/**
 * Get active rate from NGN for a given currency code
 */
export function getLiveExchangeRate(code: string): number {
  const upper = code.toUpperCase();
  if (upper in SUPPORTED_CURRENCIES) {
    return SUPPORTED_CURRENCIES[upper as Currency].rateFromNgn;
  }
  return 1;
}


