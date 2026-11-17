import { PaymentGateway, PaymentGatewayId, PaymentRegionKey } from '../types/payment';

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  // ==========================================
  // 1. NIGERIA & WEST AFRICA
  // ==========================================
  {
    id: 'paystack',
    name: 'Paystack',
    tagline: 'Leading African payments: Cards, NIP Bank Transfer, USSD (*737#), Apple Pay & Visa QR',
    region: 'Nigeria & West Africa',
    supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'USD', 'KES'],
    supportedMethods: ['Credit/Debit Cards (Mastercard, Visa, Verve)', 'NIP Direct Transfer (Virtual Account)', 'USSD (*737#, *966#, *919#)', 'Apple Pay', 'Visa QR'],
    popularCountries: ['Nigeria', 'Ghana', 'Kenya', 'South Africa'],
    accentColor: '#00C3F7',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300',
    badgeText: 'Nigeria & West Africa Top Choice',
    iconType: 'card',
    features: ['Instant Dynamic NIP Transfer Account', 'Zero Card Decline Rate', 'Automated Instant Receipt Webhooks'],
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Pay',
    tagline: 'Pan-African borderless checkout: 30+ currencies, cards, Mobile Money & Barter',
    region: 'Nigeria & West Africa',
    supportedCurrencies: ['NGN', 'USD', 'GHS', 'KES', 'ZAR', 'RWF', 'UGX', 'EUR', 'GBP'],
    supportedMethods: ['Mastercard / Visa / Verve', 'Mobile Money (MTN MoMo, Airtel, M-Pesa)', 'Direct Bank Debit', 'Barter', 'PayPal'],
    popularCountries: ['Nigeria', 'Ghana', 'Kenya', 'Rwanda', 'Cameroon', 'Pan-African'],
    accentColor: '#FB9129',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    badgeText: 'Pan-African 30+ Currencies',
    iconType: 'global',
    features: ['Supports 30+ African Currencies', 'Multi-Wallet Checkout', 'Automated FX Settlement'],
  },
  {
    id: 'transactpay',
    name: 'Transact Pay',
    tagline: 'Dedicated corporate B2B payment gateway with instant virtual accounts and NIP settlement',
    region: 'Nigeria & West Africa',
    supportedCurrencies: ['NGN', 'USD', 'GHS'],
    supportedMethods: ['Instant Corporate Dedicated Virtual Account', 'NIP Interbank Direct Clearing', 'Corporate Purchasing Cards', 'Commercial QR Pay'],
    popularCountries: ['Nigeria', 'Ghana'],
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    badgeText: 'B2B Virtual Accounts',
    iconType: 'bank',
    features: ['Dynamic 30-min Virtual Account', 'Real-time Interbank Reconciliation', 'Instant Invoicing Webhooks'],
  },
  {
    id: 'monnify',
    name: 'Monnify (TeamApt / Moniepoint)',
    tagline: 'Fastest automated bank transfer & virtual account infrastructure for Nigerian businesses',
    region: 'Nigeria & West Africa',
    supportedCurrencies: ['NGN'],
    supportedMethods: ['Moniepoint / Wema / Sterling Dedicated Virtual Account', 'Direct Bank Transfer', 'Debit Cards (Visa/Mastercard/Verve)', 'Monnify USSD'],
    popularCountries: ['Nigeria'],
    accentColor: '#0052FF',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    badgeText: 'Instant Transfer Verification',
    iconType: 'bank',
    features: ['Instant NIP settlement notification in < 3 seconds', 'Lowest merchant fees', 'Automated corporate reconciliation'],
  },

  // ==========================================
  // 2. EAST AFRICA
  // ==========================================
  {
    id: 'mpesa',
    name: 'M-Pesa (Safaricom / Vodacom)',
    tagline: 'East Africa’s premier mobile money network with automated STK Push to phone',
    region: 'East Africa',
    supportedCurrencies: ['KES', 'TZS', 'USD'],
    supportedMethods: ['M-Pesa Express STK Push', 'Paybill Number (522522)', 'Buy Goods Till Number', 'Pochi la Biashara'],
    popularCountries: ['Kenya', 'Tanzania', 'Uganda', 'DRC'],
    accentColor: '#00A859',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    badgeText: 'Kenya #1 Mobile Money',
    iconType: 'mobile_money',
    features: ['Instant Phone PIN Prompt (STK Push)', 'Paybill & Till Direct Verification', 'No Bank Card Needed'],
  },
  {
    id: 'peachpayments',
    name: 'Peach Payments',
    tagline: 'East & Southern Africa enterprise gateway: M-Pesa, Capitec Pay, Instant EFT & Cards',
    region: 'East Africa',
    supportedCurrencies: ['KES', 'ZAR', 'MUR', 'USD'],
    supportedMethods: ['M-Pesa Direct STK', 'Credit/Debit Cards (Visa, Mastercard, Amex)', 'Instant EFT', 'Apple Pay'],
    popularCountries: ['Kenya', 'South Africa', 'Mauritius', 'Tanzania'],
    accentColor: '#E91E63',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-300',
    badgeText: 'East & Southern Africa',
    iconType: 'bank',
    features: ['Multi-country seamless checkout', 'Advanced fraud protection with 3D Secure', 'Enterprise subscription billing'],
  },
  {
    id: 'dpopay',
    name: 'DPO Pay (Direct Pay Online)',
    tagline: 'Leading payment gateway across East Africa with cross-border card and mobile money processing',
    region: 'East Africa',
    supportedCurrencies: ['USD', 'KES', 'TZS', 'UGX', 'RWF', 'ZMW'],
    supportedMethods: ['Visa & Mastercard', 'American Express', 'M-Pesa & Airtel Money', 'DPO Virtual Token', 'Cross-Border EFT'],
    popularCountries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Zambia'],
    accentColor: '#E65100',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300',
    badgeText: 'East Africa Pan-Regional',
    iconType: 'global',
    features: ['Tourism & Corporate Gateway', 'Multi-Currency Settlement', 'PCI-DSS Level 1 Certified'],
  },

  // ==========================================
  // 3. SOUTH AFRICA
  // ==========================================
  {
    id: 'ozow',
    name: 'Ozow Instant EFT',
    tagline: 'South Africa’s premier instant bank payment: Capitec, FNB, Standard Bank, ABSA & Nedbank',
    region: 'South Africa',
    supportedCurrencies: ['ZAR'],
    supportedMethods: ['Instant EFT (Capitec, FNB, ABSA, Nedbank, Standard Bank, TymeBank, Investec)', 'Ozow PIN', 'QR Scan to Pay'],
    popularCountries: ['South Africa', 'Namibia'],
    accentColor: '#00BFA5',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200',
    badgeText: 'South Africa #1 Instant EFT',
    iconType: 'bank',
    features: ['Zero credit card required', 'Direct bank-to-bank authorization', 'Instant clearing with zero chargebacks'],
  },
  {
    id: 'yoco',
    name: 'Yoco',
    tagline: 'South Africa’s favorite SME payment rail for cards, online checkout and instant payouts',
    region: 'South Africa',
    supportedCurrencies: ['ZAR'],
    supportedMethods: ['Visa / Mastercard / Amex', 'Apple Pay', 'Google Pay', 'Yoco Link'],
    popularCountries: ['South Africa'],
    accentColor: '#00D1FF',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200',
    badgeText: 'South Africa Top SME Gateway',
    iconType: 'card',
    features: ['Ultra-fast checkout experience', 'Built for South African small businesses', 'Full PCI-DSS compliance'],
  },
  {
    id: 'pesapal',
    name: 'Pesapal',
    tagline: 'Trusted across East and Southern Africa for cards, mobile money and bank transfers',
    region: 'South Africa',
    supportedCurrencies: ['ZAR', 'KES', 'UGX', 'TZS', 'USD'],
    supportedMethods: ['Visa & Mastercard', 'Mobile Money', 'Bank Transfers', 'Pesapal Sabi POS'],
    popularCountries: ['South Africa', 'Kenya', 'Uganda', 'Tanzania'],
    accentColor: '#0083CA',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200',
    badgeText: 'South & East Africa',
    iconType: 'global',
    features: ['Wide payment interoperability', 'Mobile money and bank card unification', 'Automated payment alerts'],
  },

  // ==========================================
  // 4. OTHER AFRICA COUNTRIES
  // ==========================================
  {
    id: 'fedapay',
    name: 'FedaPay',
    tagline: 'Modern mobile money and card collection for Francophone West Africa (Benin, Togo, Niger)',
    region: 'Other Africa Countries',
    supportedCurrencies: ['XOF', 'EUR', 'USD'],
    supportedMethods: ['MTN Mobile Money (Benin & Togo)', 'Moov Money (Flooz)', 'Celtiis Cash', 'Visa & Mastercard'],
    popularCountries: ['Benin', 'Togo', 'Niger'],
    accentColor: '#0066FF',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300',
    badgeText: 'Benin & Togo Mobile Money',
    iconType: 'mobile_money',
    features: ['Fast MoMo Checkout in CFA Francs', 'Simple Push USSD Confirmation', 'Auto-generated Payment Invoices'],
  },
  {
    id: 'cinetpay',
    name: 'CinetPay',
    tagline: 'The unified payment gateway for Francophone West & Central Africa (XOF / XAF)',
    region: 'Other Africa Countries',
    supportedCurrencies: ['XOF', 'XAF', 'GNF', 'CDF', 'USD'],
    supportedMethods: ['Orange Money', 'MTN MoMo', 'Moov Africa', 'Wave Mobile Money', 'Visa / Mastercard'],
    popularCountries: ["Côte d'Ivoire", 'Senegal', 'Cameroon', 'Mali', 'Burkina Faso', 'Guinea', 'DRC'],
    accentColor: '#FF6600',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    badgeText: 'Francophone Africa (XOF / XAF)',
    iconType: 'mobile_money',
    features: ['Orange Money & Wave Direct Integration', 'Bilingual Checkout (FR / EN)', 'Instant SMS & USSD Validation'],
  },
  {
    id: 'ligdicash',
    name: 'LigdiCash',
    tagline: 'Francophone mobile money gateway for Burkina Faso, Mali, and UEMOA merchants',
    region: 'Other Africa Countries',
    supportedCurrencies: ['XOF'],
    supportedMethods: ['Orange Money Burkina', 'Moov Africa Burkina', 'Sank Money', 'Coris Money', 'Visa / Mastercard'],
    popularCountries: ['Burkina Faso', 'Mali', 'Niger'],
    accentColor: '#28A745',
    badgeBg: 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200',
    badgeText: 'Burkina Faso & UEMOA',
    iconType: 'mobile_money',
    features: ['Direct Orange/Moov cashout in Ouagadougou', 'Zero FX loss for local CFA Francs', 'Instant merchant webhook'],
  },
  {
    id: 'payfort',
    name: 'Payfort (Amazon Payment Services)',
    tagline: 'Leading North Africa & Middle East gateway: Cards, Meeza, KNET & installments',
    region: 'Other Africa Countries',
    supportedCurrencies: ['EGP', 'AED', 'SAR', 'USD'],
    supportedMethods: ['Meeza (Egypt National Scheme)', 'Visa / Mastercard', 'ValU Buy-Now-Pay-Later', 'Fawry Cash Collection'],
    popularCountries: ['Egypt', 'Morocco', 'Tunisia', 'UAE', 'Saudi Arabia'],
    accentColor: '#FF9900',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300',
    badgeText: 'Egypt & North Africa',
    iconType: 'card',
    features: ['Amazon-grade payment reliability', 'Meeza direct processing in Egypt', 'Installment & BNPL plans'],
  },
  {
    id: 'paynow',
    name: 'Paynow',
    tagline: 'Zimbabwe’s national payment switch: EcoCash, OneMoney, Zimswitch & Cards',
    region: 'Other Africa Countries',
    supportedCurrencies: ['USD', 'ZWL', 'ZiG'],
    supportedMethods: ['EcoCash Mobile Wallet', 'OneMoney', 'Zimswitch Instant Clearing', 'Visa & Mastercard International'],
    popularCountries: ['Zimbabwe'],
    accentColor: '#00549A',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    badgeText: 'Zimbabwe Multi-Currency',
    iconType: 'mobile_money',
    features: ['EcoCash Express dial prompt', 'Zimswitch immediate interbank settlement', 'Automated ZiG / USD conversion'],
  },

  // ==========================================
  // 5. GLOBAL & INTERNATIONAL
  // ==========================================
  {
    id: 'stripe',
    name: 'Stripe',
    tagline: 'Global enterprise card infrastructure with Apple Pay, Google Pay & 135+ currencies',
    region: 'Global & International',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN', 'ZAR'],
    supportedMethods: ['International Cards (Visa, MC, Amex)', 'Apple Pay', 'Google Pay', 'SEPA Direct Debit', 'Link by Stripe'],
    popularCountries: ['United Kingdom', 'United States', 'European Union', 'Global Diaspora'],
    accentColor: '#635BFF',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300',
    badgeText: 'Global & Diaspora Cards',
    iconType: 'card',
    features: ['3D Secure 2.0 Compliance', 'Apple Pay 1-Click Checkout', 'Corporate Purchasing Cards'],
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    tagline: 'Global payments with instant cards, UPI, net banking and multi-currency billing',
    region: 'Global & International',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD'],
    supportedMethods: ['International Visa/Mastercard/Amex', 'UPI QR & ID', 'Net Banking across 50+ Banks', 'Corporate Cards'],
    popularCountries: ['India', 'Southeast Asia', 'Middle East', 'Global Expatriates'],
    accentColor: '#0C2340',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200',
    badgeText: 'Global UPI & Cards',
    iconType: 'global',
    features: ['Seamless international cards processing', 'UPI instant scanning', 'Automated recurring billing'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    tagline: 'The world’s most recognized digital wallet with comprehensive buyer and merchant protection',
    region: 'Global & International',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY'],
    supportedMethods: ['PayPal Account Balance', 'Linked Bank Accounts', 'PayPal Credit', 'International Cards'],
    popularCountries: ['Global', 'United States', 'United Kingdom', 'Europe', 'Canada'],
    accentColor: '#003087',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    badgeText: 'Trusted Global Wallet',
    iconType: 'wallet',
    features: ['200M+ active global wallets', 'One-touch PayPal checkout', 'Full Buyer & Merchant Protection'],
  },
  {
    id: 'mollie',
    name: 'Mollie',
    tagline: 'Europe’s premier payments: iDEAL, SEPA Bank Transfer, Bancontact & Cards',
    region: 'Global & International',
    supportedCurrencies: ['EUR', 'GBP', 'USD', 'CHF'],
    supportedMethods: ['iDEAL (Netherlands)', 'Bancontact (Belgium)', 'SEPA Direct Debit', 'Sofort / Klarna', 'Credit/Debit Cards'],
    popularCountries: ['Netherlands', 'Belgium', 'Germany', 'France', 'European Union'],
    accentColor: '#FF6B00',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200',
    badgeText: 'European Payment Rails',
    iconType: 'bank',
    features: ['Native iDEAL & Bancontact support', 'SEPA cross-border Euro settlement', 'Zero hidden fees'],
  },
  {
    id: 'twocheckout',
    name: '2Checkout (Verifone)',
    tagline: 'Global merchant of record accepting 45+ payment methods in 200+ countries and territories',
    region: 'Global & International',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'ZAR', 'NGN'],
    supportedMethods: ['International Cards (Visa, MC, Amex, Discover, JCB)', 'PayPal', 'Wire Transfer', 'Local European & Asian Payment Methods'],
    popularCountries: ['Global 200+ Countries', 'Australia', 'Japan', 'Middle East', 'Latin America'],
    accentColor: '#1A73E8',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    badgeText: '200+ Countries Global MoR',
    iconType: 'global',
    features: ['Merchant of Record (MoR) tax compliance', 'Multi-language checkout in 30+ languages', 'Global subscription billing engine'],
  },
];

export function getGatewayById(id: PaymentGatewayId): PaymentGateway {
  return PAYMENT_GATEWAYS.find(g => g.id === id) || PAYMENT_GATEWAYS[0];
}

export function getGatewaysByRegion(region: PaymentRegionKey): PaymentGateway[] {
  return PAYMENT_GATEWAYS.filter(g => g.region === region);
}

export function getRecommendedGatewaysForCountry(countryName: string): PaymentGateway[] {
  const c = (countryName || '').toLowerCase();
  
  if (c.includes('nigeria') || c.includes('ghana')) {
    return PAYMENT_GATEWAYS.filter(g => g.region === 'Nigeria & West Africa');
  }
  if (c.includes('kenya') || c.includes('tanzania') || c.includes('uganda') || c.includes('rwanda')) {
    return PAYMENT_GATEWAYS.filter(g => g.region === 'East Africa');
  }
  if (c.includes('south africa') || c.includes('namibia') || c.includes('botswana')) {
    return PAYMENT_GATEWAYS.filter(g => g.region === 'South Africa');
  }
  if (
    c.includes('benin') || c.includes('togo') || c.includes('senegal') || 
    c.includes("côte d'ivoire") || c.includes('ivory coast') || c.includes('cameroon') || 
    c.includes('mali') || c.includes('burkina') || c.includes('egypt') || 
    c.includes('morocco') || c.includes('zimbabwe')
  ) {
    return PAYMENT_GATEWAYS.filter(g => g.region === 'Other Africa Countries');
  }

  // Global / international default
  return PAYMENT_GATEWAYS.filter(g => g.region === 'Global & International');
}
