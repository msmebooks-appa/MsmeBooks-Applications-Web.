export type PaymentRegionId =
  | 'west-africa'
  | 'east-africa'
  | 'south-africa'
  | 'other-africa'
  | 'global';

export interface PaymentGateway {
  id: string;
  name: string;
  regionId: PaymentRegionId;
  regionName: string;
  countries: string[];
  currencies: string[];
  methods: string[];
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  accentColor: string;
  flowType: 'card' | 'mobile_money' | 'instant_eft' | 'paypal' | 'corporate_b2b' | 'wallet';
  instructions: string;
}

export interface PaymentRegion {
  id: PaymentRegionId;
  name: string;
  shortLabel: string;
  flag: string;
  countriesSummary: string;
  defaultCurrency: string;
  gatewaysCount: number;
}

export const PAYMENT_REGIONS: PaymentRegion[] = [
  {
    id: 'west-africa',
    name: 'Nigeria & West Africa',
    shortLabel: 'West Africa',
    flag: '🇳🇬',
    countriesSummary: 'Nigeria, Ghana, Ivory Coast, Senegal',
    defaultCurrency: 'NGN',
    gatewaysCount: 3,
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    shortLabel: 'East Africa',
    flag: '🇰🇪',
    countriesSummary: 'Kenya, Tanzania, Uganda, Rwanda',
    defaultCurrency: 'KES',
    gatewaysCount: 4,
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    shortLabel: 'South Africa',
    flag: '🇿🇦',
    countriesSummary: 'South Africa, Namibia, Botswana, SADC',
    defaultCurrency: 'ZAR',
    gatewaysCount: 5,
  },
  {
    id: 'other-africa',
    name: 'Other African Countries',
    shortLabel: 'Other Africa',
    flag: '🌍',
    countriesSummary: 'Benin, Togo, Burkina Faso, Cameroon, Zimbabwe, Egypt',
    defaultCurrency: 'XAF',
    gatewaysCount: 5,
  },
  {
    id: 'global',
    name: 'Global & International',
    shortLabel: 'Global',
    flag: '🌐',
    countriesSummary: 'USA, UK, Europe, India, Asia & Worldwide',
    defaultCurrency: 'USD',
    gatewaysCount: 5,
  },
];

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  // =========================================================================
  // 1. NIGERIA & WEST AFRICA
  // =========================================================================
  {
    id: 'paystack',
    name: 'Paystack',
    regionId: 'west-africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'Côte d’Ivoire', 'Pan-West Africa'],
    currencies: ['NGN', 'GHS', 'USD'],
    methods: ['Debit & Credit Cards', 'Direct Bank Transfer', 'USSD (*737#)', 'Virtual Accounts'],
    tagline: 'Modern online payments for Africa with instant automated settlement.',
    badge: 'Most Popular in Nigeria',
    isPopular: true,
    accentColor: '#00C3F7',
    flowType: 'card',
    instructions: 'Pay instantly using debit/credit cards (Verve, Mastercard, Visa) or instant bank transfer.',
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Pay',
    regionId: 'west-africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'Cameroon', 'Senegal', 'West Africa'],
    currencies: ['NGN', 'USD', 'GHS', 'XAF', 'EUR', 'GBP'],
    methods: ['Card Payments', 'Mobile Money', 'Bank Accounts', 'Barter', 'POS Transfer'],
    tagline: 'Endless payment possibilities connecting West Africa to global financial rails.',
    badge: 'Pan-African Multi-Currency',
    isPopular: true,
    accentColor: '#F5A623',
    flowType: 'card',
    instructions: 'Checkout with local cards, West African bank transfers, or regional mobile money.',
  },
  {
    id: 'transactpay',
    name: 'Transact Pay',
    regionId: 'west-africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'ECOWAS Region'],
    currencies: ['NGN', 'USD'],
    methods: ['Corporate Virtual Account', 'B2B Commercial Card', 'Direct Debit', 'Enterprise Rails'],
    tagline: 'Institutional commercial payments and recurring B2B billing engine.',
    badge: 'Tailored for B2B & HR',
    accentColor: '#0066CC',
    flowType: 'corporate_b2b',
    instructions: 'Seamless B2B billing with corporate credit card, NIP direct bank transfer or virtual mandate.',
  },

  // =========================================================================
  // 2. EAST AFRICA
  // =========================================================================
  {
    id: 'mpesa',
    name: 'M-Pesa (Safaricom / Vodacom)',
    regionId: 'east-africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
    currencies: ['KES', 'TZS', 'USD'],
    methods: ['STK Push (Enter PIN on Phone)', 'Paybill / Buy Goods', 'M-Pesa Global'],
    tagline: 'Direct mobile money checkout via Safaricom & Vodacom SIM prompt.',
    badge: '#1 in East Africa',
    isPopular: true,
    accentColor: '#00A859',
    flowType: 'mobile_money',
    instructions: 'Enter your Safaricom or Vodacom mobile number to receive an instant STK push prompt on your handset.',
  },
  {
    id: 'peach_payments',
    name: 'Peach Payments',
    regionId: 'east-africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Mauritius', 'South Africa', 'East Africa'],
    currencies: ['KES', 'USD', 'ZAR', 'MUR'],
    methods: ['Enterprise Visa/Mastercard', 'M-Pesa', 'EFT Secure', 'Apple Pay'],
    tagline: 'High-conversion enterprise gateway for fast-growing African digital businesses.',
    badge: 'Enterprise Grade',
    accentColor: '#FF6B6B',
    flowType: 'card',
    instructions: 'Pay securely using international debit/credit cards or integrated East African mobile wallets.',
  },
  {
    id: 'dpo_pay',
    name: 'DPO Pay (Network International)',
    regionId: 'east-africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Tanzania', 'Rwanda', 'Uganda', 'Zambia'],
    currencies: ['USD', 'KES', 'TZS', 'RWF', 'UGX'],
    methods: ['Cards (Visa, MC, Amex)', 'M-Pesa, Airtel Money, MTN MoMo', 'Cross-border Rails'],
    tagline: 'Trusted pan-African payment service provider for multi-country platforms.',
    badge: 'Multi-Country East Africa',
    accentColor: '#1B365D',
    flowType: 'card',
    instructions: 'Supports multi-currency credit cards and all East African telco mobile money operators.',
  },
  {
    id: 'paystack_east',
    name: 'Paystack East Africa',
    regionId: 'east-africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Rwanda'],
    currencies: ['KES', 'RWF', 'USD'],
    methods: ['KES Local Cards', 'M-Pesa', 'Direct Bank Debit', 'RWF Mobile Money'],
    tagline: 'Seamless developer-first payments tailored for Kenyan & Rwandan businesses.',
    badge: 'Local KES & RWF',
    accentColor: '#00C3F7',
    flowType: 'card',
    instructions: 'Fast checkout in Kenyan Shillings or Rwandan Francs via cards and local payment rails.',
  },

  // =========================================================================
  // 3. SOUTH AFRICA
  // =========================================================================
  {
    id: 'paystack_sa',
    name: 'Paystack South Africa',
    regionId: 'south-africa',
    regionName: 'South Africa',
    countries: ['South Africa', 'SADC'],
    currencies: ['ZAR', 'USD'],
    methods: ['South African Visa & Mastercard', 'Instant EFT', 'SnapScan', 'Masterpass'],
    tagline: 'Fast, secure online payments optimized for South African Rand transactions.',
    badge: 'ZAR Optimized',
    isPopular: true,
    accentColor: '#00C3F7',
    flowType: 'card',
    instructions: 'Pay in South African Rand (ZAR) with local cards, automated bank EFT or SnapScan.',
  },
  {
    id: 'yoco',
    name: 'Yoco',
    regionId: 'south-africa',
    regionName: 'South Africa',
    countries: ['South Africa'],
    currencies: ['ZAR'],
    methods: ['South African Debit/Credit Cards', 'Apple Pay', 'Google Pay', '3D Secure 2.0'],
    tagline: 'South Africa’s premier small business card payment provider.',
    badge: 'Top SA Provider',
    isPopular: true,
    accentColor: '#0047FF',
    flowType: 'card',
    instructions: 'Simple, fast, and secure card payment powered by Yoco’s trusted South African gateway.',
  },
  {
    id: 'pesapal',
    name: 'Pesapal',
    regionId: 'south-africa',
    regionName: 'South Africa',
    countries: ['South Africa', 'East & Southern Africa'],
    currencies: ['ZAR', 'USD', 'KES'],
    methods: ['Credit/Debit Cards', 'Mobile Wallets', 'Bank Transfer'],
    tagline: 'Pioneering payment solutions across Southern and East African markets.',
    badge: 'Regional SADC Support',
    accentColor: '#0083CA',
    flowType: 'card',
    instructions: 'Check out seamlessly with international/local cards or Southern African payment networks.',
  },
  {
    id: 'transactpay_sa',
    name: 'Transact Pay (South Africa)',
    regionId: 'south-africa',
    regionName: 'South Africa',
    countries: ['South Africa', 'Namibia', 'Botswana'],
    currencies: ['ZAR', 'USD'],
    methods: ['Rand Corporate Clearing', 'Direct Debit Order', 'Commercial Cards'],
    tagline: 'B2B subscription collection and institutional recruitment vendor billing.',
    badge: 'Corporate Invoicing',
    accentColor: '#0A2540',
    flowType: 'corporate_b2b',
    instructions: 'Automated recurring subscription billing with corporate cards or Rand commercial wire.',
  },
  {
    id: 'ozow',
    name: 'Ozow (Instant EFT)',
    regionId: 'south-africa',
    regionName: 'South Africa',
    countries: ['South Africa'],
    currencies: ['ZAR'],
    methods: ['Instant EFT from Capitec, FNB, Standard Bank, ABSA, Nedbank, Investec, TymeBank'],
    tagline: 'The easiest and fastest automated Instant EFT payment in South Africa.',
    badge: 'Instant Bank EFT',
    isPopular: true,
    accentColor: '#FE5E00',
    flowType: 'instant_eft',
    instructions: 'Select your South African bank to approve an instant EFT payment without entering card digits.',
  },

  // =========================================================================
  // 4. OTHER AFRICAN COUNTRIES
  // =========================================================================
  {
    id: 'fedapay',
    name: 'FedaPay',
    regionId: 'other-africa',
    regionName: 'Other African Countries',
    countries: ['Benin', 'Togo', 'Côte d’Ivoire', 'Senegal', 'Niger'],
    currencies: ['XOF', 'XAF', 'USD', 'EUR'],
    methods: ['MTN Mobile Money', 'Moov Money', 'Orange Money', 'Credit Cards'],
    tagline: 'All-in-one payment gateway for Francophone West and Central Africa.',
    badge: 'Francophone Africa',
    isPopular: true,
    accentColor: '#008B8B',
    flowType: 'mobile_money',
    instructions: 'Pay instantly in FCFA via MTN MoMo, Moov Money, Orange Money, or local Visa/Mastercard.',
  },
  {
    id: 'cinetpay',
    name: 'CinetPay',
    regionId: 'other-africa',
    regionName: 'Other African Countries',
    countries: ['Côte d’Ivoire', 'Senegal', 'Cameroon', 'Mali', 'Guinea', 'Burkina Faso', 'DRC'],
    currencies: ['XOF', 'XAF', 'GNF', 'CDF', 'USD'],
    methods: ['Orange Money', 'Wave', 'MTN MoMo', 'Moov Money', 'Free Money', 'Cards'],
    tagline: 'Collect payments across 9+ French-speaking African nations with unified checkout.',
    badge: '9+ African Nations',
    isPopular: true,
    accentColor: '#0070BA',
    flowType: 'mobile_money',
    instructions: 'Supports Wave, Orange Money, MTN MoMo, Free Money, and bank cards in Francophone Africa.',
  },
  {
    id: 'ligdicash',
    name: 'LigdiCash',
    regionId: 'other-africa',
    regionName: 'Other African Countries',
    countries: ['Burkina Faso', 'Mali', 'Niger', 'Sahel Region'],
    currencies: ['XOF', 'USD'],
    methods: ['Orange Money Burkina', 'Moov Africa', 'LigdiWallet', 'Regional Cards'],
    tagline: 'Digital wallet and merchant checkout gateway for the Sahel region.',
    badge: 'Burkina Faso & Sahel',
    accentColor: '#E65100',
    flowType: 'wallet',
    instructions: 'Enter your phone number to authenticate via Orange Money, Moov Africa, or LigdiCash wallet.',
  },
  {
    id: 'payfort',
    name: 'Payfort (Amazon Payment Services)',
    regionId: 'other-africa',
    regionName: 'Other African Countries',
    countries: ['Egypt', 'Morocco', 'Tunisia', 'MENA / North Africa'],
    currencies: ['EGP', 'MAD', 'USD', 'AED', 'EUR'],
    methods: ['Fawry', 'Meeza (Egypt)', 'Local Credit/Debit Cards', 'Installments'],
    tagline: 'Secure, trusted payment gateway for North African and Middle Eastern enterprises.',
    badge: 'North Africa & Egypt',
    accentColor: '#232F3E',
    flowType: 'card',
    instructions: 'Pay in Egyptian Pounds (EGP), Moroccan Dirhams, or USD via Meeza, Fawry, or international cards.',
  },
  {
    id: 'paynow',
    name: 'Paynow',
    regionId: 'other-africa',
    regionName: 'Other African Countries',
    countries: ['Zimbabwe', 'Southern Africa'],
    currencies: ['USD', 'ZWL', 'ZAR'],
    methods: ['EcoCash', 'OneMoney', 'Telecash', 'Zimswitch vPayments', 'Visa / Mastercard'],
    tagline: 'Leading payment gateway for Zimbabwe and Southern African multi-currency transactions.',
    badge: 'Zimbabwe & EcoCash',
    accentColor: '#0072C6',
    flowType: 'mobile_money',
    instructions: 'Supports EcoCash mobile wallet prompt, OneMoney, Zimswitch local banking, or USD cards.',
  },

  // =========================================================================
  // 5. GLOBAL & INTERNATIONAL
  // =========================================================================
  {
    id: 'stripe',
    name: 'Stripe',
    regionId: 'global',
    regionName: 'Global & International',
    countries: ['United States', 'United Kingdom', 'European Union', 'Canada', 'Australia', 'Global'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ALL'],
    methods: ['Credit / Debit Cards', 'Apple Pay', 'Google Pay', 'SEPA Direct Debit', 'ACH'],
    tagline: 'Financial infrastructure for the internet. 135+ currencies and worldwide coverage.',
    badge: 'Global Gold Standard',
    isPopular: true,
    accentColor: '#635BFF',
    flowType: 'card',
    instructions: 'World-class card processing with 3D Secure, Apple Pay, Google Pay, and instant fraud screening.',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    regionId: 'global',
    regionName: 'Global & International',
    countries: ['India', 'Southeast Asia', 'Global'],
    currencies: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
    methods: ['UPI / QR Code', 'NetBanking (50+ Banks)', 'International Cards', 'Razorpay Wallet'],
    tagline: 'Full-stack payments suite for emerging global tech companies and multinational teams.',
    badge: 'UPI & Global Cards',
    accentColor: '#0C2340',
    flowType: 'card',
    instructions: 'Checkout with global credit cards or Indian UPI/NetBanking for international recruitment firms.',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    regionId: 'global',
    regionName: 'Global & International',
    countries: ['200+ Countries Worldwide'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    methods: ['PayPal Account Balance', 'Linked Bank Accounts', 'Pay in 4 Installments', 'PayPal Credit'],
    tagline: 'The world’s most recognized digital wallet with comprehensive Buyer & Seller Protection.',
    badge: '200+ Countries',
    isPopular: true,
    accentColor: '#003087',
    flowType: 'paypal',
    instructions: 'Log in with your PayPal credentials to authorize one-click subscription payment without card details.',
  },
  {
    id: 'mollie',
    name: 'Mollie',
    regionId: 'global',
    regionName: 'Global & International',
    countries: ['Netherlands', 'Germany', 'France', 'Belgium', 'Europe & Global'],
    currencies: ['EUR', 'GBP', 'USD', 'CHF'],
    methods: ['iDEAL', 'Bancontact', 'Klarna', 'SEPA Bank Transfer', 'Visa & Mastercard'],
    tagline: 'Effortless European and international payments with localized payment methods.',
    badge: 'Europe & iDEAL',
    accentColor: '#FF6D00',
    flowType: 'card',
    instructions: 'Ideal for European recruiters and global organizations using iDEAL, Bancontact, SEPA, or cards.',
  },
  {
    id: 'two_checkout',
    name: '2Checkout (Verifone)',
    regionId: 'global',
    regionName: 'Global & International',
    countries: ['Global (Over 180 Countries)'],
    currencies: ['USD', 'EUR', 'GBP', 'ZAR', 'NGN', 'KES', '100+ Currencies'],
    methods: ['International Cards', 'Local Bank Transfers', 'Digital Wallets', 'Tax & Invoicing MoR'],
    tagline: 'Global merchant of record handling compliance, multi-currency VAT, and subscriptions in 180+ countries.',
    badge: '180+ Countries & Tax MoR',
    accentColor: '#00A389',
    flowType: 'card',
    instructions: 'Global enterprise checkout with automatic sales tax compliance and corporate invoicing in 100+ currencies.',
  },
];
