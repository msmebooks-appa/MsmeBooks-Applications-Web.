import { SupportedCurrency } from './currencies';

export type PaymentRegionId = 
  | 'west_africa' 
  | 'east_africa' 
  | 'south_africa' 
  | 'other_africa' 
  | 'global';

export interface PaymentRegion {
  id: PaymentRegionId;
  name: string;
  shortName: string;
  flag: string;
  headline: string;
  popularCountries: string[];
  defaultCurrency: SupportedCurrency;
}

export interface PaymentGateway {
  id: string;
  name: string;
  regionId: PaymentRegionId;
  tagline: string;
  badge?: string;
  channels: string[];
  supportedCurrencies: SupportedCurrency[];
  primaryCurrency: SupportedCurrency;
  processingTime: string;
  feeNotice: string;
  trustedBy: string;
  logoColor: string;
  features: string[];
}

export const PAYMENT_REGIONS: PaymentRegion[] = [
  {
    id: 'west_africa',
    name: 'Nigeria & West Africa',
    shortName: 'West Africa',
    flag: '🇳🇬',
    headline: 'Instant Naira & West African payments via Paystack, Flutterwave, TransactPay & Monnify',
    popularCountries: ['Nigeria', 'Ghana', 'Benin', 'Sierra Leone', 'Gambia', 'Liberia'],
    defaultCurrency: 'NGN'
  },
  {
    id: 'east_africa',
    name: 'East Africa',
    shortName: 'East Africa',
    flag: '🇰🇪',
    headline: 'Direct M-Pesa STK push, Peach Payments, DPO Pay & Paystack East Africa',
    popularCountries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia'],
    defaultCurrency: 'KES'
  },
  {
    id: 'south_africa',
    name: 'South Africa',
    shortName: 'South Africa',
    flag: '🇿🇦',
    headline: 'Instant automated EFT & card checkouts via Ozow, Yoco, Paystack SA & Pesapal',
    popularCountries: ['South Africa', 'Namibia', 'Botswana', 'Lesotho', 'Eswatini'],
    defaultCurrency: 'ZAR'
  },
  {
    id: 'other_africa',
    name: 'Other African Countries',
    shortName: 'Pan-Africa',
    flag: '🌍',
    headline: 'Francophone & regional gateways: FedaPay, CinetPay, LigdiCash, Payfort & Paynow',
    popularCountries: ['Ivory Coast', 'Senegal', 'Cameroon', 'Burkina Faso', 'Egypt', 'Zimbabwe'],
    defaultCurrency: 'XOF'
  },
  {
    id: 'global',
    name: 'Global & International',
    shortName: 'Global',
    flag: '🌐',
    headline: 'Worldwide international payments via Stripe, Razorpay, PayPal, Mollie & 2Checkout',
    popularCountries: ['United Kingdom', 'United States', 'European Union', 'Canada', 'India', 'UAE'],
    defaultCurrency: 'USD'
  }
];

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  // 1. Nigeria & West Africa
  {
    id: 'paystack',
    name: 'Paystack',
    regionId: 'west_africa',
    tagline: 'Modern checkout for African commerce',
    badge: 'Most Popular in Nigeria & Ghana',
    channels: ['Debit/Credit Card', 'Bank Transfer', 'USSD (*737#, *894#)', 'NQR Code', 'Apple Pay'],
    supportedCurrencies: ['NGN', 'GHS', 'USD'],
    primaryCurrency: 'NGN',
    processingTime: 'Instant Real-time Activation',
    feeNotice: 'Standard local processing',
    trustedBy: 'Over 200,000 businesses across Africa',
    logoColor: '#00C3F7',
    features: ['3D Secure 2.0 Auth', 'Direct Bank USSD', 'Instant Tokenized Receipt', 'Tokenized Recurring Billing']
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Pay',
    regionId: 'west_africa',
    tagline: 'Endless possibilities for Pan-African enterprise',
    badge: 'Pan-African Multi-Currency',
    channels: ['Cards (Visa/Mastercard/Verve)', 'Mobile Money', 'Bank Accounts', 'Barter', 'Google Pay'],
    supportedCurrencies: ['NGN', 'GHS', 'KES', 'XOF', 'USD', 'EUR', 'GBP'],
    primaryCurrency: 'NGN',
    processingTime: 'Instant Activation',
    feeNotice: 'Direct local settlement',
    trustedBy: 'Global brands and 1M+ African businesses',
    logoColor: '#FB9129',
    features: ['30+ African Currencies', 'Bank Transfer Verification', 'Split Settlement', 'Instant Webhooks']
  },
  {
    id: 'transactpay',
    name: 'Transact Pay',
    regionId: 'west_africa',
    tagline: 'High-speed corporate payments & direct debit',
    badge: 'Enterprise Direct Debit',
    channels: ['Direct Account Debit', 'Virtual Account Transfer', 'Commercial Cards', 'Corporate Wallets'],
    supportedCurrencies: ['NGN', 'GHS', 'USD'],
    primaryCurrency: 'NGN',
    processingTime: 'Instant Virtual Settlement',
    feeNotice: 'Zero reconciliation friction',
    trustedBy: 'West African FinTechs and ERP Platforms',
    logoColor: '#2563EB',
    features: ['Automated Dedicated Account', 'Sub-3s Settlement', 'Reconciliation Ledger Sync', 'Enterprise Grade']
  },
  {
    id: 'monnify',
    name: 'Monnify',
    regionId: 'west_africa',
    tagline: 'Preferred bank account and instant transfer engine',
    badge: 'Fastest Dynamic Bank Transfer',
    channels: ['Dynamic Virtual Account Transfer', 'Debit Cards', 'Bank Branch Pay', 'USSD'],
    supportedCurrencies: ['NGN'],
    primaryCurrency: 'NGN',
    processingTime: 'Sub-second confirmation',
    feeNotice: 'Flat capped transfer rate',
    trustedBy: 'Top tier commercial banks and utilities in Nigeria',
    logoColor: '#003366',
    features: ['Instant Dynamic Account', 'Zero Card Decline Risk', 'Automatic Credit Callback', '99.98% Uptime']
  },

  // 2. East Africa
  {
    id: 'mpesa',
    name: 'M-Pesa (Safaricom)',
    regionId: 'east_africa',
    tagline: 'The undisputed mobile money leader in East Africa',
    badge: 'Direct STK Push Prompt',
    channels: ['M-Pesa STK Push (Direct PIN on phone)', 'Paybill & Till Number', 'Pochi La Biashara'],
    supportedCurrencies: ['KES', 'USD'],
    primaryCurrency: 'KES',
    processingTime: 'Immediate phone prompt (< 5 seconds)',
    feeNotice: 'Official Safaricom merchant tariff',
    trustedBy: 'Over 50 million East African mobile money users',
    logoColor: '#00B140',
    features: ['One-tap STK Push', 'No card details required', 'Real-time SMS & Email Receipt', 'Highest completion rate']
  },
  {
    id: 'peachpayments',
    name: 'Peach Payments',
    regionId: 'east_africa',
    tagline: 'Enterprise payments built for emerging markets',
    badge: 'Seamless East African Orchestration',
    channels: ['Visa / Mastercard', 'M-Pesa', 'Airtel Money', 'Scan to Pay'],
    supportedCurrencies: ['KES', 'ZAR', 'USD'],
    primaryCurrency: 'KES',
    processingTime: 'Instant',
    feeNotice: 'Transparent interchange pricing',
    trustedBy: 'Leading airlines, booking portals, and SaaS in Kenya',
    logoColor: '#FA7268',
    features: ['Smart Payment Routing', 'Recurring Subscription Tokens', 'Fraud Screening', 'Mobile Optimized']
  },
  {
    id: 'dpopay',
    name: 'DPO Pay',
    regionId: 'east_africa',
    tagline: 'Connecting Africa to global commerce',
    badge: 'Cross-Border East Africa',
    channels: ['Credit / Debit Cards', 'M-Pesa', 'Airtel Money Kenya/Uganda/Tanzania', 'MTN Mobile Money'],
    supportedCurrencies: ['KES', 'USD', 'EUR', 'GBP'],
    primaryCurrency: 'KES',
    processingTime: 'Instant',
    feeNotice: 'Multi-territory pass-through',
    trustedBy: 'Over 100,000 African merchants across 21 countries',
    logoColor: '#0E76BC',
    features: ['East African Cross-Border', 'Multi-currency settlement', 'Hotel & Tourism standard', 'PCI DSS Level 1']
  },
  {
    id: 'paystack_ea',
    name: 'Paystack East Africa',
    regionId: 'east_africa',
    tagline: 'Modern payment infrastructure for Kenya & regional hubs',
    badge: 'Automated KES Settlement',
    channels: ['M-Pesa', 'Local Visa / Mastercard', 'Bank Transfer'],
    supportedCurrencies: ['KES', 'USD'],
    primaryCurrency: 'KES',
    processingTime: 'Instant confirmation',
    feeNotice: 'Standard East African tariff',
    trustedBy: 'Tech startups and digital academies across Nairobi',
    logoColor: '#00C3F7',
    features: ['Instant M-Pesa STK', 'Automated recurring billing', 'Comprehensive tax invoices', 'Developer-first']
  },

  // 3. South Africa
  {
    id: 'ozow',
    name: 'Ozow Instant EFT',
    regionId: 'south_africa',
    tagline: 'Instant, seamless automated bank EFT payments',
    badge: 'No Card Needed · Top Choice in SA',
    channels: ['Instant Automated EFT (Capitec, FNB, Nedbank, Standard Bank, Absa, TymeBank, Investec, Discovery)'],
    supportedCurrencies: ['ZAR'],
    primaryCurrency: 'ZAR',
    processingTime: 'Instant verification without chargebacks',
    feeNotice: 'Lowest EFT merchant rate in SA',
    trustedBy: 'Leading retailers and eCommerce across South Africa',
    logoColor: '#F58220',
    features: ['Zero credit card required', 'Direct bank-to-bank instant clearing', 'Zero chargeback risk', 'Biometric banking login']
  },
  {
    id: 'yoco',
    name: 'Yoco',
    regionId: 'south_africa',
    tagline: 'South Africa’s premier SME payments platform',
    badge: 'SA Small Business Champion',
    channels: ['South African Debit & Credit Cards', 'Apple Pay', 'Google Pay', 'Instant Card Link'],
    supportedCurrencies: ['ZAR'],
    primaryCurrency: 'ZAR',
    processingTime: 'Instant confirmation',
    feeNotice: 'Transparent fee structure',
    trustedBy: 'Over 300,000 South African small and medium businesses',
    logoColor: '#00B4D8',
    features: ['Apple Pay 1-tap', '3D Secure SA banking', 'Fast checkout modal', 'Real-time Rand reconciliation']
  },
  {
    id: 'pesapal',
    name: 'Pesapal',
    regionId: 'south_africa',
    tagline: 'Comprehensive African digital payments & mobile commerce',
    badge: 'Regional SADC & East Africa',
    channels: ['Visa / Mastercard / Amex', 'Mobile Money', 'Bank Transfers', 'Pesapal Wallet'],
    supportedCurrencies: ['ZAR', 'KES', 'USD'],
    primaryCurrency: 'ZAR',
    processingTime: 'Instant confirmation',
    feeNotice: 'Standard regional rate',
    trustedBy: 'Schools, hotels, and professional enterprises',
    logoColor: '#00A859',
    features: ['Multi-country settlement', 'Direct invoice link', 'Automated tax receipts', 'Fraud monitoring']
  },
  {
    id: 'transactpay_sa',
    name: 'Transact Pay South Africa',
    regionId: 'south_africa',
    tagline: 'High-volume corporate EFT & card processing',
    badge: 'Corporate ZAR Processing',
    channels: ['South African Interbank EFT', 'Corporate Credit Cards', 'Merchant Wallet Direct'],
    supportedCurrencies: ['ZAR', 'USD'],
    primaryCurrency: 'ZAR',
    processingTime: 'Sub-second confirmation',
    feeNotice: 'Wholesale corporate rates',
    trustedBy: 'Pan-African corporate suites and logistics firms',
    logoColor: '#1D4ED8',
    features: ['Direct PASA integration', 'High-volume transaction capacity', 'Tax compliant invoicing', 'Multi-tenant ledger']
  },
  {
    id: 'paystack_sa',
    name: 'Paystack South Africa',
    regionId: 'south_africa',
    tagline: 'Accept payments in Rand via card and EFT',
    badge: 'ZAR Instant Clearing',
    channels: ['Debit / Credit Cards', 'Instant EFT', 'Apple Pay'],
    supportedCurrencies: ['ZAR', 'USD'],
    primaryCurrency: 'ZAR',
    processingTime: 'Instant confirmation',
    feeNotice: '2.9% + R1.00 local cards',
    trustedBy: 'Digital SaaS, e-learning platforms, and marketplaces',
    logoColor: '#00C3F7',
    features: ['Seamless inline checkout', 'Instant tokenization', 'Zero redirection options', 'Automated recurring billing']
  },

  // 4. Other African Countries
  {
    id: 'fedapay',
    name: 'FedaPay',
    regionId: 'other_africa',
    tagline: 'The leading gateway for Benin, Togo, and Francophone West Africa',
    badge: 'Francophone Mobile Money Hub',
    channels: ['MTN Mobile Money', 'Moov Money', 'Visa / Mastercard', 'T-Money'],
    supportedCurrencies: ['XOF', 'USD'],
    primaryCurrency: 'XOF',
    processingTime: 'Instant mobile validation',
    feeNotice: 'Local telco clearing',
    trustedBy: 'Francophone West African SaaS, universities, and SMEs',
    logoColor: '#10B981',
    features: ['Bilingual French/English UI', 'Direct USSD prompt in Benin/Togo', 'Automatic CFA Franc ledger', 'High conversion']
  },
  {
    id: 'cinetpay',
    name: 'CinetPay',
    regionId: 'other_africa',
    tagline: 'Unified payment solution across 10+ Francophone African nations',
    badge: '10+ UEMOA & CEMAC Nations',
    channels: ['Orange Money (CI, SN, ML, BF)', 'Wave', 'MTN Mobile Money', 'Moov', 'Visa / Mastercard'],
    supportedCurrencies: ['XOF', 'XAF', 'USD', 'EUR'],
    primaryCurrency: 'XOF',
    processingTime: 'Instant via Mobile Money OTP',
    feeNotice: 'Standard UEMOA mobile tariff',
    trustedBy: 'FinTechs and enterprises across Ivory Coast, Senegal, Cameroon, Mali',
    logoColor: '#FF6600',
    features: ['Orange Money direct push', 'Wave QR / app deep link', 'Dual XOF/XAF zone support', 'French invoice formatting']
  },
  {
    id: 'ligdicash',
    name: 'LigdiCash',
    regionId: 'other_africa',
    tagline: 'Fast and reliable mobile money aggregator in the Sahel',
    badge: 'Sahel & Burkina Faso Leader',
    channels: ['Orange Money BF', 'Moov Africa Burkina', 'Coris Bank', 'Credit Cards'],
    supportedCurrencies: ['XOF', 'USD'],
    primaryCurrency: 'XOF',
    processingTime: 'Instant Mobile Confirmation',
    feeNotice: 'Sahelian regional fee',
    trustedBy: 'Burkina Faso, Mali, and Niger retail and education ecosystems',
    logoColor: '#8B5CF6',
    features: ['Sahelian wallet integration', 'Low-bandwidth payment mode', 'Instant SMS notification', 'Local merchant support']
  },
  {
    id: 'payfort',
    name: 'Payfort (Amazon Payment Services)',
    regionId: 'other_africa',
    tagline: 'The gold standard for Egypt, North Africa, and the Arab region',
    badge: 'North Africa & Egypt Leader',
    channels: ['Meeza (Egypt National Scheme)', 'Fawry Cash Codes', 'ValU Buy-Now-Pay-Later', 'Visa / Mastercard'],
    supportedCurrencies: ['EGP', 'USD', 'EUR'],
    primaryCurrency: 'EGP',
    processingTime: 'Instant 3D Secure 2',
    feeNotice: 'Egyptian banking tariff',
    trustedBy: 'EgyptAir, Souq, leading universities, and MENA enterprises',
    logoColor: '#232F3E',
    features: ['Meeza card support', 'Fawry reference numbers', 'Arabic and English invoicing', 'Bank installment plans']
  },
  {
    id: 'paynow',
    name: 'Paynow',
    regionId: 'other_africa',
    tagline: 'Zimbabwe’s trusted online payments and multi-currency gateway',
    badge: 'Zimbabwe Multi-Currency & EcoCash',
    channels: ['EcoCash Mobile Money', 'OneMoney', 'ZimSwitch', 'Visa / Mastercard / USD ZiG'],
    supportedCurrencies: ['ZWL', 'USD'],
    primaryCurrency: 'USD',
    processingTime: 'Instant EcoCash prompt',
    feeNotice: 'Local Reserve Bank compliant',
    trustedBy: 'Government portals, utilities, and top retail in Zimbabwe',
    logoColor: '#2563EB',
    features: ['Dual-currency USD / ZiG ledger', 'EcoCash USSD push', 'Instant receipt email', 'ZimSwitch interbank clearing']
  },

  // 5. Global & International
  {
    id: 'stripe',
    name: 'Stripe',
    regionId: 'global',
    tagline: 'Financial infrastructure for the global internet',
    badge: 'Worldwide Credit Cards & 1-Tap Pay',
    channels: ['Credit / Debit Cards (Visa, Mastercard, Amex, Discover)', 'Apple Pay', 'Google Pay', 'Link by Stripe'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES'],
    primaryCurrency: 'USD',
    processingTime: 'Instant 1-Click Checkout',
    feeNotice: '2.9% + 30¢ international',
    trustedBy: 'Millions of companies worldwide from Amazon to Zoom',
    logoColor: '#635BFF',
    features: ['Apple Pay & Google Pay ready', 'Radar machine learning fraud detection', 'Global tax compliance', 'Instant receipt generation']
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    regionId: 'global',
    tagline: 'Powering international and emerging digital transactions',
    badge: 'India & South Asia Multi-Channel',
    channels: ['International Credit & Debit Cards', 'UPI (Google Pay, PhonePe)', 'Net Banking', 'PayPal Integration'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    primaryCurrency: 'USD',
    processingTime: 'Instant payment verification',
    feeNotice: 'Standard international merchant tariff',
    trustedBy: 'Over 8 million businesses worldwide',
    logoColor: '#0C2340',
    features: ['Unified UPI & Card gateway', 'Multi-currency checkout', 'Instant OTP verification', 'Enterprise SLA']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    regionId: 'global',
    tagline: 'The global standard for trusted consumer protection',
    badge: '400M+ Global Wallet Users',
    channels: ['PayPal Balance', 'Linked Bank Accounts', 'PayPal Credit', 'International Cards'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    primaryCurrency: 'USD',
    processingTime: 'Instant 1-Click Login & Pay',
    feeNotice: 'Standard international processing',
    trustedBy: '400+ million consumers across 200+ markets',
    logoColor: '#003087',
    features: ['Buyer Protection guarantee', 'No card numbers entered on site', 'Seamless cross-border currency conversion', 'Instant invoice email']
  },
  {
    id: 'mollie',
    name: 'Mollie',
    regionId: 'global',
    tagline: 'Effortless payments for European and international businesses',
    badge: 'Europe & SEPA Preferred',
    channels: ['iDEAL', 'Bancontact', 'SEPA Direct Debit', 'Sofort', 'Credit Cards', 'Apple Pay'],
    supportedCurrencies: ['EUR', 'GBP', 'USD'],
    primaryCurrency: 'EUR',
    processingTime: 'Instant European Clearing',
    feeNotice: 'Transparent per-transaction pricing',
    trustedBy: 'Over 130,000 European companies',
    logoColor: '#1A1A1A',
    features: ['SEPA Instant Bank Transfers', 'iDEAL & Bancontact native', 'GDPR strict compliance', 'Multi-lingual checkout']
  },
  {
    id: '2checkout',
    name: '2Checkout (Verifone)',
    regionId: 'global',
    tagline: 'Global digital commerce and subscription management',
    badge: '130+ Currencies & Merchant of Record',
    channels: ['Credit Cards in 130+ Currencies', 'PayPal', 'Wire Transfer', 'Local Payment Methods'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    primaryCurrency: 'USD',
    processingTime: 'Instant multi-currency conversion',
    feeNotice: 'Global MOR compliance included',
    trustedBy: 'Global software companies and digital service providers',
    logoColor: '#00A859',
    features: ['Merchant of Record compliance', '130+ global currencies handled', 'Automated tax withholding & VAT', 'Chargeback protection']
  }
];

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
  badge: string;
  minAmountNgn?: number;
  flatDiscountNgn?: number;
}

export const PROMO_CODES: Record<string, PromoCode> = {
  'MSME2026': {
    code: 'MSME2026',
    discountPercentage: 15,
    description: '15% Pan-African SME Growth Special',
    badge: '15% OFF'
  },
  'AFRICA30': {
    code: 'AFRICA30',
    discountPercentage: 30,
    description: '30% 30+ African Markets Expansion Celebration',
    badge: '30% OFF'
  },
  'PANAFRICAN': {
    code: 'PANAFRICAN',
    discountPercentage: 25,
    description: '25% AfCFTA Continental Professional Scholarship',
    badge: '25% OFF'
  },
  'LEARNSMARTER': {
    code: 'LEARNSMARTER',
    discountPercentage: 20,
    description: '20% Executive Track Accelerator Grant',
    badge: '20% OFF'
  },
  'FREEMONTH': {
    code: 'FREEMONTH',
    discountPercentage: 50,
    description: '50% First-Month Cloud ERP & Academy Voucher',
    badge: '50% OFF'
  }
};

export const VAT_RATE = 0.075; // 7.5% Exclusive Statutory VAT

export interface CustomerBillingInfo {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  country: string;
  regionId: PaymentRegionId;
  tin?: string; // Tax Identification Number
  address?: string;
  city?: string;
}

export interface CartItem {
  id: string;
  type: 'course' | 'bundle' | 'subscription';
  title: string;
  category?: string;
  thumbnail?: string;
  priceNgn: number;
  originalPriceNgn?: number;
  courseId?: string;
  bundleId?: string;
  subscriptionPlan?: 'monthly' | 'annual';
  duration?: string;
  level?: string;
  instructorName?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-AFR-89241
  date: string;
  time: string;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
  customer: CustomerBillingInfo;
  items: CartItem[];
  subtotalNgn: number;
  discountCode?: string;
  discountPercentage?: number;
  discountAmountNgn: number;
  netTaxableNgn: number;
  vatRate: number; // 0.075
  vatAmountNgn: number;
  totalAmountNgn: number;
  currency: SupportedCurrency;
  paymentGatewayId: string;
  paymentGatewayName: string;
  transactionReference: string;
  receiptPdfUrl?: string;
  paidAt: string;
}
