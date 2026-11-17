import { PaymentGatewayInfo, PaymentGatewayId, PaymentRegionId } from '../types/cart';

export interface PaymentRegionConfig {
  id: PaymentRegionId;
  name: string;
  flag: string;
  description: string;
  featuredCurrencies: string[];
}

export const PAYMENT_REGIONS: PaymentRegionConfig[] = [
  {
    id: 'west_africa',
    name: 'Nigeria & West Africa',
    flag: '🇳🇬',
    description: 'Paystack, Flutterwave, TransactPay, Monnify, OPay, PalmPay, Interswitch, Hubtel, Wave (NGN, GHS, XOF)',
    featuredCurrencies: ['NGN', 'GHS', 'XOF'],
  },
  {
    id: 'east_africa',
    name: 'East Africa',
    flag: '🇰🇪',
    description: 'M-Pesa STK Push, Peach Payments, DPO Pay, Paystack EA, Chapa Ethiopia (KES, UGX, TZS, RWF, ETB)',
    featuredCurrencies: ['KES', 'UGX', 'TZS', 'RWF', 'ETB'],
  },
  {
    id: 'south_africa',
    name: 'South Africa & SADC',
    flag: '🇿🇦',
    description: 'Ozow Instant EFT, Yoco, Pesapal, TransactPay SA, Paystack SA, Chipper Cash (ZAR, ZMW, BWP, NAD)',
    featuredCurrencies: ['ZAR', 'ZMW', 'BWP'],
  },
  {
    id: 'other_africa',
    name: 'Other Africa Countries',
    flag: '🌍',
    description: 'FedaPay, CinetPay, LigdiCash, Payfort, Paynow, Fawry, Payzone (Francophone, North & Central Africa)',
    featuredCurrencies: ['XAF', 'MAD', 'EGP', 'ZWL', 'DZD'],
  },
  {
    id: 'global',
    name: 'Global & International',
    flag: '🌐',
    description: 'Stripe, Razorpay, PayPal, Mollie, 2Checkout, Adyen, Square, Klarna, Revolut (USD, EUR, GBP, CAD, AUD)',
    featuredCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'INR'],
  },
];

export const ALL_PAYMENT_GATEWAYS: PaymentGatewayInfo[] = [
  // ----------------------------------------------------
  // 1. Nigeria and West Africa
  // ----------------------------------------------------
  {
    id: 'paystack',
    name: 'Paystack',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'Côte d\'Ivoire', 'West Africa'],
    flag: '🇳🇬',
    badge: 'MOST POPULAR IN NIGERIA',
    popular: true,
    tagline: 'Cards (Mastercard, Visa, Verve), Bank Transfer, USSD & Apple Pay',
    supportedMethods: ['Mastercard / Visa / Verve', 'Scan to Pay (NQR / Paystack QR)', 'Direct Bank Transfer', 'USSD (*737#, *919#)', 'OPay & Kuda'],
    supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES', 'USD'],
    settlementTime: 'Instant T+0 / Next-Day T+1',
    integrationProtocol: 'Paystack Standard API & NIBSS NQR v2',
    fields: {
      type: 'card',
      label: 'Card / Account Details',
      placeholder: '5399 •••• •••• ••••',
      helperText: 'Secured via Paystack 256-bit encryption with CBN PCI-DSS certification.',
    },
    qrSupport: {
      supported: true,
      standardName: 'NIBSS NQR (Nigeria Quick Response)',
      compatibleApps: ['Kuda Bank', 'OPay', 'PalmPay', 'GTBank', 'Zenith Bank', 'Access More', 'Moniepoint', 'Stanbic IBTC', 'FirstBank'],
      brandColor: '#0BA4DB',
      instructions: 'Open your mobile banking or fintech app, tap "Scan QR / NQR", and scan this code to authorize instant payment.',
    },
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Pay',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'Sierra Leone', 'Gambia', 'West Africa'],
    flag: '🇳🇬',
    badge: 'PAN-AFRICAN PROCESSING',
    popular: true,
    tagline: 'Cards, Barter, Mobile Money, Bank Account & 1-Click Checkout',
    supportedMethods: ['Cards', 'Scan to Pay (Flutterwave QR / Barter)', 'Barter', 'Mobile Money', 'Bank Accounts', 'Pay with Transfer'],
    supportedCurrencies: ['NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'RWF', 'XOF', 'USD', 'EUR', 'GBP'],
    settlementTime: 'Instant T+0 / T+1',
    integrationProtocol: 'Flutterwave v3 API & EMVCo QR Gateway',
    fields: {
      type: 'card',
      label: 'Flutterwave Checkout Card/Account',
      placeholder: 'Card number or account identifier',
      helperText: 'Instant verification across all commercial African banks.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Flutterwave QR / Barter Pay',
      compatibleApps: ['Barter by Flutterwave', 'Access More', 'Ecobank Mobile', 'MTN MoMo', 'Airtel Money', 'Any EMVCo QR App'],
      brandColor: '#F5A623',
      instructions: 'Scan with Barter by Flutterwave, your mobile banking app, or any EMVCo QR reader for instant debit authorization.',
    },
  },
  {
    id: 'transactpay',
    name: 'TransactPay',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'West Africa'],
    flag: '🇳🇬',
    badge: 'DIRECT MERCHANT ACCOUNTS',
    tagline: 'Direct Bank Debit, Merchant Virtual Account & POS Terminal API',
    supportedMethods: ['Scan to Pay (TransactPay NIP QR)', 'Dedicated Virtual Account', 'NIBSS Instant Payment (NIP)', 'Direct Debit'],
    supportedCurrencies: ['NGN', 'USD'],
    settlementTime: 'Instant T+0 Real-Time',
    integrationProtocol: 'TransactPay NIP & Dynamic Corporate Virtual Pool',
    fields: {
      type: 'virtual_account',
      label: 'Virtual Account Transfer',
      placeholder: 'Generate TransactPay Dynamic Account',
      helperText: 'A dedicated dynamic account number will be allocated for instant settlement.',
    },
    qrSupport: {
      supported: true,
      standardName: 'TransactPay NIP Dynamic QR',
      compatibleApps: ['Wema ALAT', 'Moniepoint', 'Sterling Bank', 'Fidelity Bank', 'Providus Bank', 'NIBSS NQR Apps'],
      brandColor: '#4F46E5',
      instructions: 'Scan to execute immediate NIBSS NIP direct credit to dedicated MsmeBooks corporate settlement.',
    },
  },
  {
    id: 'monnify',
    name: 'Monnify',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'West Africa'],
    flag: '🇳🇬',
    badge: 'INSTANT TRANSFER & CARDS',
    popular: true,
    tagline: 'Moniepoint / Wema Bank Virtual Accounts, POS Cards & Low-Fee Transfer',
    supportedMethods: ['Scan to Pay (Monnify NQR)', 'Instant Account Transfer (Wema/Moniepoint)', 'Cards', 'Direct Debit'],
    supportedCurrencies: ['NGN'],
    settlementTime: 'Instant T+0 (3 seconds)',
    integrationProtocol: 'Monnify Interswitch Clearing & Central Switch API',
    fields: {
      type: 'virtual_account',
      label: 'Monnify Dynamic Transfer Account',
      placeholder: 'Monnify Auto-Reconciled Account',
      helperText: 'Pay via bank mobile app or USSD; auto-confirmed within 3 seconds.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Monnify Interswitch NQR Standard',
      compatibleApps: ['Moniepoint Business', 'Wema ALAT', 'Kuda', 'OPay', 'FairMoney', 'All Nigerian Commercial Banks'],
      brandColor: '#0066F5',
      instructions: 'Instant account clearance via Monnify centralized clearing switch.',
    },
  },
  {
    id: 'opay',
    name: 'OPay Digital Services',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'West Africa'],
    flag: '🇳🇬',
    badge: '#1 FINTECH WALLET IN NIGERIA',
    popular: true,
    tagline: 'Instant OPay Wallet, OPay Smart QR, Zero-Fail Bank Transfer & USSD (*955#)',
    supportedMethods: ['OPay Wallet Direct', 'Scan to Pay (OPay NQR)', 'Debit Cards', 'USSD (*955#)', 'Instant Bank Transfer'],
    supportedCurrencies: ['NGN'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'OPay Merchant Gateway API 2.4 & Real-Time Webhook',
    fields: {
      type: 'wallet',
      label: 'OPay Wallet Phone / Account Number',
      placeholder: '+234 80X XXX XXXX or 10-digit OPay account',
      helperText: 'Debit happens instantly with zero fee and 100% network uptime guarantee.',
    },
    qrSupport: {
      supported: true,
      standardName: 'OPay Smart NQR & Direct Scan',
      compatibleApps: ['OPay App', 'OPay Business', 'PalmPay', 'Kuda Bank', 'Moniepoint', 'All NQR Bank Apps'],
      brandColor: '#00B86B',
      instructions: 'Open your OPay App, tap "Scan", and scan this code for 1-second biometric clearance.',
    },
  },
  {
    id: 'palmpay',
    name: 'PalmPay',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Ghana', 'West Africa'],
    flag: '🇳🇬',
    badge: 'HIGH-SPEED MOBILE CHECKOUT',
    popular: true,
    tagline: 'PalmPay App Checkout, Smart QR, Cashback & Direct Debit',
    supportedMethods: ['PalmPay Wallet', 'Scan to Pay (PalmPay QR)', 'Debit Cards', 'Instant Direct Debit'],
    supportedCurrencies: ['NGN', 'GHS'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'PalmPay Merchant SDK & Central Clearing Switch',
    fields: {
      type: 'wallet',
      label: 'PalmPay Registered Mobile Number',
      placeholder: '+234 81X XXX XXXX',
      helperText: 'Enter your PalmPay registered number to receive instant debit authorization prompt.',
    },
    qrSupport: {
      supported: true,
      standardName: 'PalmPay Merchant QR Standard',
      compatibleApps: ['PalmPay App', 'OPay', 'Kuda Bank', 'GTBank', 'Zenith Bank'],
      brandColor: '#6B11FF',
      instructions: 'Scan with your PalmPay app or any compliant bank camera scanner.',
    },
  },
  {
    id: 'interswitch',
    name: 'Interswitch WebPAY',
    region: 'west_africa',
    regionName: 'Nigeria & West Africa',
    countries: ['Nigeria', 'Gambia', 'Uganda', 'Pan-Africa'],
    flag: '🇳🇬',
    badge: 'NIGERIA CENTRAL SWITCH',
    popular: true,
    tagline: 'Verve Cards, Quickteller, Mastercard/Visa & Interswitch NIP Switch',
    supportedMethods: ['Verve Card Tokenization', 'Quickteller WebPAY', 'Mastercard / Visa', 'Scan to Pay (Quickteller QR)'],
    supportedCurrencies: ['NGN', 'USD'],
    settlementTime: 'Same-Day T+0',
    integrationProtocol: 'Interswitch WebPAY 3.0 & Inline Checkout SDK',
    fields: {
      type: 'card',
      label: 'Verve / Mastercard / Visa Card',
      placeholder: '5061 •••• •••• •••• (Verve supported)',
      helperText: 'Direct settlement via Interswitch National Central Switch infrastructure.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Quickteller Interswitch QR Standard',
      compatibleApps: ['Quickteller', 'Verve Life App', 'Stanbic IBTC', 'Zenith Bank', 'Access More'],
      brandColor: '#E01E26',
      instructions: 'Scan using Quickteller, Verve Life, or your mobile bank app for direct cardless authorization.',
    },
  },
  {
    id: 'hubtel',
    name: 'Hubtel Ghana',
    region: 'west_africa',
    regionName: 'Ghana & West Africa',
    countries: ['Ghana', 'West Africa'],
    flag: '🇬🇭',
    badge: '#1 IN GHANA',
    popular: true,
    tagline: 'MTN Mobile Money, Telecel Cash, AT Money & GhIPSS Instant Pay (GHS)',
    supportedMethods: ['MTN MoMo Ghana', 'Telecel Cash (Vodafone)', 'AT Money', 'GhIPSS Instant Pay (GIP)', 'Scan to Pay (GhQR)'],
    supportedCurrencies: ['GHS', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Hubtel Merchant Direct API v2 & GhQR Switch',
    fields: {
      type: 'phone_stk',
      label: 'Ghana Mobile Money Number (MTN / Telecel / AT)',
      placeholder: '+233 24 XXX XXXX or 024XXXXXXX',
      helperText: 'Receive real-time mobile money prompt on your Ghanaian SIM.',
    },
    qrSupport: {
      supported: true,
      standardName: 'GhQR Universal Standard (Hubtel)',
      compatibleApps: ['Hubtel App', 'MTN MoMo App', 'Telecel Cash App', 'Ecobank Mobile Ghana', 'GCB Mobile'],
      brandColor: '#1750EC',
      instructions: 'Scan using any Ghana banking app or MoMo app that supports Bank of Ghana GhQR standard.',
    },
  },
  {
    id: 'wave',
    name: 'Wave Mobile Money',
    region: 'west_africa',
    regionName: 'Francophone West Africa',
    countries: ['Senegal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso'],
    flag: '🇸🇳',
    badge: '1% FLAT ZERO-FEE MONEY',
    popular: true,
    tagline: 'Wave QR Code, Free Account Deposits & Instant Mobile Checkout (XOF)',
    supportedMethods: ['Wave Direct QR Scan', 'Wave Mobile App Checkout', 'Instant Wallet Debit'],
    supportedCurrencies: ['XOF'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Wave Direct Checkout API & Dynamic Deep-Linking',
    fields: {
      type: 'phone_stk',
      label: 'Wave Registered Phone Number',
      placeholder: '+221 77 XXX XX XX or +225 07 XX XX XX',
      helperText: 'Fast authorization with zero extra fees on the Wave network.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Wave Direct QR Scan',
      compatibleApps: ['Wave Mobile Money App (Senegal & Côte d\'Ivoire)'],
      brandColor: '#1DC4FF',
      instructions: 'Open your Wave app, tap the camera icon to scan, and validate with your Wave PIN.',
    },
  },

  // ----------------------------------------------------
  // 2. East Africa
  // ----------------------------------------------------
  {
    id: 'mpesa',
    name: 'M-Pesa (Safaricom / Vodacom)',
    region: 'east_africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
    flag: '🇰🇪',
    badge: '#1 IN EAST AFRICA',
    popular: true,
    tagline: 'Instant STK Push to your phone, Paybill 247247 & Buy Goods',
    supportedMethods: ['M-Pesa Express (STK Push)', 'Scan to Pay (Lipa Na M-Pesa QR)', 'Paybill', 'Till Number (Buy Goods)', 'M-Pesa Global'],
    supportedCurrencies: ['KES', 'TZS', 'UGX', 'RWF'],
    settlementTime: 'Instant T+0 Real-Time',
    integrationProtocol: 'Safaricom Daraja 3.0 API & B2B Settlement',
    fields: {
      type: 'phone_stk',
      label: 'M-Pesa Mobile Number',
      placeholder: '+254 7XX XXX XXX or 07XX XXX XXX',
      helperText: 'You will receive an automated STK PIN prompt on your phone immediately.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Lipa Na M-Pesa Dynamic QR',
      compatibleApps: ['M-Pesa App (Safaricom)', 'mySafaricom', 'M-Pesa for Business', 'Vodacom M-Pesa App'],
      brandColor: '#00A859',
      instructions: 'Open your M-Pesa app, tap "Scan QR", scan to review bill amount, and enter your M-Pesa secret PIN.',
    },
  },
  {
    id: 'peachpayments',
    name: 'Peach Payments',
    region: 'east_africa',
    regionName: 'East Africa & Mauritius',
    countries: ['Kenya', 'Tanzania', 'Mauritius', 'South Africa'],
    flag: '🇰🇪',
    badge: 'SEAMLESS ENTERPRISE GATEWAY',
    tagline: 'East African Cards, EFT, M-Pesa & Multi-Currency Processing',
    supportedMethods: ['Visa / Mastercard', 'Scan to Pay (Masterpass / M-Pesa QR)', 'M-Pesa', 'EFT Secure', 'Airtel Money'],
    supportedCurrencies: ['KES', 'ZAR', 'MUR', 'USD', 'EUR'],
    settlementTime: 'Next-Day T+1',
    integrationProtocol: 'Peach Payments Enterprise REST API & 3D Secure 2.0',
    fields: {
      type: 'card',
      label: 'Peach Payments Card / Wallet',
      placeholder: 'Enter 16-digit debit or credit card',
      helperText: 'Authorized in Kenya, Tanzania, and across East African jurisdictions.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Peach Masterpass QR',
      compatibleApps: ['Masterpass', 'M-Pesa', 'Equity Bank EazzyBanking', 'KCB App'],
      brandColor: '#FF6A00',
      instructions: 'Scan with any Masterpass or mobile money compatible scanner.',
    },
  },
  {
    id: 'dpopay',
    name: 'DPO Pay (Direct Pay Online)',
    region: 'east_africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'],
    flag: '🇺🇬',
    badge: 'REGIONAL EAST AFRICA LEADER',
    popular: true,
    tagline: 'Accept cards, M-Pesa, MTN Mobile Money & Airtel across 15+ countries',
    supportedMethods: ['MTN Mobile Money', 'Scan to Pay (DPO QR)', 'Airtel Money', 'M-Pesa', 'Visa / Mastercard / Amex'],
    supportedCurrencies: ['KES', 'UGX', 'TZS', 'RWF', 'ETB', 'USD'],
    settlementTime: 'T+1 Settlement',
    integrationProtocol: 'DPO Group Universal API & Multi-Telco Gateway',
    fields: {
      type: 'phone_stk',
      label: 'Mobile Money Phone Number / Card',
      placeholder: '+256 / +254 / +255 Mobile number',
      helperText: 'Integrated cross-border East African gateway.',
    },
    qrSupport: {
      supported: true,
      standardName: 'DPO Regional QR Code',
      compatibleApps: ['MTN MoMo App', 'Airtel Money App', 'M-Pesa App', 'Standard Banking Apps'],
      brandColor: '#00529B',
      instructions: 'Scan with MTN MoMo, Airtel Money, or standard mobile wallet to authorize.',
    },
  },
  {
    id: 'paystack_ea',
    name: 'Paystack East Africa',
    region: 'east_africa',
    regionName: 'East Africa',
    countries: ['Kenya', 'East Africa'],
    flag: '🇰🇪',
    badge: 'M-PESA & CARDS',
    tagline: 'M-Pesa STK Push, Kenyan Cards (KES) & Direct Bank Transfers',
    supportedMethods: ['M-Pesa Direct', 'Scan to Pay (Paystack KES QR)', 'Kenyan Bank Cards', 'PesaLink Transfer'],
    supportedCurrencies: ['KES', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Paystack Kenya API & PesaLink Switch',
    fields: {
      type: 'phone_stk',
      label: 'Safaricom M-Pesa / Card',
      placeholder: '+254 7XX XXX XXX',
      helperText: 'Automated KES reconciliation directly within MsmeBooks.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Paystack East Africa QR Standard',
      compatibleApps: ['M-Pesa App', 'Equity Bank', 'KCB Mobile', 'NCBA Loop', 'Co-op Bank'],
      brandColor: '#0BA4DB',
      instructions: 'Scan with your Kenyan mobile banking app to authorize instant PesaLink or M-Pesa debit.',
    },
  },
  {
    id: 'chapa',
    name: 'Chapa Ethiopia',
    region: 'east_africa',
    regionName: 'Ethiopia & Horn of Africa',
    countries: ['Ethiopia', 'Horn of Africa'],
    flag: '🇪🇹',
    badge: '#1 IN ETHIOPIA',
    popular: true,
    tagline: 'Telebirr, CBE Birr, Awash Bank, Amole & Ethiopian Cards (ETB)',
    supportedMethods: ['Telebirr STK', 'CBE Birr', 'Awash Birr', 'Scan to Pay (Chapa QR)', 'Local Bank Cards'],
    supportedCurrencies: ['ETB', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Chapa Direct API v1 & EthSwitch Central Gateway',
    fields: {
      type: 'phone_stk',
      label: 'Telebirr / CBE Birr Phone Number',
      placeholder: '+251 9XX XXX XXX or 09XXXXXXXX',
      helperText: 'Direct settlement in Ethiopian Birr (ETB) with EthSwitch integration.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Chapa Telebirr Dynamic QR',
      compatibleApps: ['Telebirr App', 'CBE Mobile', 'Awash Bank App', 'EthSwitch Apps'],
      brandColor: '#6366F1',
      instructions: 'Open your Telebirr or CBE Birr mobile app and scan this QR code to confirm payment.',
    },
  },

  // ----------------------------------------------------
  // 3. South Africa & SADC
  // ----------------------------------------------------
  {
    id: 'ozow',
    name: 'Ozow Instant EFT',
    region: 'south_africa',
    regionName: 'South Africa',
    countries: ['South Africa', 'Namibia'],
    flag: '🇿🇦',
    badge: '#1 INSTANT EFT IN SA',
    popular: true,
    tagline: 'Direct Instant Bank Transfer: Absa, Capitec, FNB, Nedbank, Standard Bank',
    supportedMethods: ['Capitec Pay', 'Scan to Pay (Ozow QR)', 'FNB', 'Standard Bank', 'Nedbank', 'Absa', 'TymeBank', 'Investec'],
    supportedCurrencies: ['ZAR', 'NAD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Ozow Instant EFT Open Banking API & Capitec Pay API',
    fields: {
      type: 'instant_eft',
      label: 'South African Bank Selection',
      placeholder: 'Select your South African bank',
      helperText: 'Instant zero-fee clearing without needing manual proof of payment.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Ozow QR Instant EFT',
      compatibleApps: ['Capitec Banking App', 'FNB Banking App', 'Standard Bank App', 'Absa Mobile', 'Nedbank Money'],
      brandColor: '#00C853',
      instructions: 'Scan using your mobile phone camera or banking app to launch instant Capitec Pay / EFT.',
    },
  },
  {
    id: 'yoco',
    name: 'Yoco',
    region: 'south_africa',
    regionName: 'South Africa',
    countries: ['South Africa'],
    flag: '🇿🇦',
    badge: 'SA SME FAVORITE',
    popular: true,
    tagline: 'Instant Card Processing (Mastercard & Visa) with 3D Secure 2.0',
    supportedMethods: ['South African Debit Cards', 'Credit Cards', 'Scan to Pay (SnapScan / Masterpass)', 'Apple Pay SA'],
    supportedCurrencies: ['ZAR'],
    settlementTime: 'Same-Day T+0 / T+1',
    integrationProtocol: 'Yoco SDK & 3D Secure 2.0 Gateway',
    fields: {
      type: 'card',
      label: 'Yoco Secure Card Entry',
      placeholder: '4000 •••• •••• ••••',
      helperText: 'Optimized for South African Rand (ZAR) merchant billing.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Yoco SnapScan & Masterpass QR',
      compatibleApps: ['SnapScan', 'Masterpass SA', 'Zapper', 'Standard Bank', 'FNB Pay'],
      brandColor: '#002B49',
      instructions: 'Scan with SnapScan, Zapper, or your South African banking app for contactless clearance.',
    },
  },
  {
    id: 'pesapal',
    name: 'Pesapal',
    region: 'south_africa',
    regionName: 'South Africa & SADC',
    countries: ['South Africa', 'Zimbabwe', 'Zambia', 'Botswana', 'Malawi'],
    flag: '🇿🇦',
    badge: 'SOUTHERN AFRICA INTEGRATED',
    tagline: 'EFT, Visa/Mastercard & Southern African Mobile Money Processing',
    supportedMethods: ['Visa / Mastercard', 'Scan to Pay (Pesapal QR)', 'Southern Africa EFT', 'ZimSwitch / Mobile Money'],
    supportedCurrencies: ['ZAR', 'KES', 'UGX', 'TZS', 'ZMW', 'MWK'],
    settlementTime: 'T+1 Settlement',
    integrationProtocol: 'Pesapal 3.0 SADC Gateway API',
    fields: {
      type: 'card',
      label: 'Pesapal Card / Mobile Wallet',
      placeholder: 'Enter card or account number',
      helperText: 'Compliant with SADC financial regulations and cross-border settlement.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Pesapal SADC Dynamic QR',
      compatibleApps: ['Pesapal Mobile', 'Airtel Money', 'TNM Mpamba', 'Standard Bank'],
      brandColor: '#0084FF',
      instructions: 'Scan with Pesapal or your regional wallet app to approve payment.',
    },
  },
  {
    id: 'transactpay_sa',
    name: 'TransactPay South Africa',
    region: 'south_africa',
    regionName: 'South Africa',
    countries: ['South Africa'],
    flag: '🇿🇦',
    badge: 'CAPITEC & BANK DEBIT',
    tagline: 'Capitec Pay, SARB Real-Time Clearing & Corporate DebiCheck',
    supportedMethods: ['Scan to Pay (Capitec Pay QR)', 'Capitec Pay Direct', 'Real-Time Clearing (RTC)', 'DebiCheck Mandate'],
    supportedCurrencies: ['ZAR'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'TransactPay SARB Real-Time Clearer (RTC)',
    fields: {
      type: 'instant_eft',
      label: 'Capitec Mobile or SA Bank ID',
      placeholder: 'Enter Capitec registered mobile / ID',
      helperText: 'Approve instantly on your Capitec Banking App.',
    },
    qrSupport: {
      supported: true,
      standardName: 'TransactPay Capitec QR',
      compatibleApps: ['Capitec Banking App', 'SARB Real-Time Clearer'],
      brandColor: '#004B87',
      instructions: 'Scan with Capitec Bank App to approve instant payment.',
    },
  },
  {
    id: 'paystack_sa',
    name: 'Paystack South Africa',
    region: 'south_africa',
    regionName: 'South Africa',
    countries: ['South Africa'],
    flag: '🇿🇦',
    badge: 'ZAR SECURE CHECKOUT',
    tagline: 'South African Debit/Credit Cards, Instant EFT & Masterpass',
    supportedMethods: ['Cards (Visa/Mastercard)', 'Scan to Pay (Masterpass / SnapScan QR)', 'Instant EFT', 'Masterpass QR'],
    supportedCurrencies: ['ZAR'],
    settlementTime: 'Next-Day T+1',
    integrationProtocol: 'Paystack SA Gateway API',
    fields: {
      type: 'card',
      label: 'Card / Instant EFT',
      placeholder: '5200 •••• •••• ••••',
      helperText: 'Processed in South African Rand (ZAR) with local clearing.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Paystack Masterpass QR (ZAR)',
      compatibleApps: ['Masterpass', 'SnapScan', 'Zapper', 'FNB', 'Nedbank'],
      brandColor: '#0BA4DB',
      instructions: 'Scan to pay with any South African QR code reader.',
    },
  },
  {
    id: 'chippercash',
    name: 'Chipper Cash',
    region: 'south_africa',
    regionName: 'Pan-African & SADC',
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Uganda', 'Ghana', 'Rwanda'],
    flag: '🌍',
    badge: 'CROSS-BORDER PAN-AFRICAN',
    popular: true,
    tagline: 'Fast Cross-Border Wallets, Virtual Cards & QR Pay across Africa',
    supportedMethods: ['Chipper Wallet', 'Scan to Pay (Chipper QR)', 'Chipper Virtual Visa', 'Instant P2B Transfer'],
    supportedCurrencies: ['ZAR', 'NGN', 'KES', 'UGX', 'GHS', 'RWF', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Chipper Network Merchant API & Deep Link',
    fields: {
      type: 'wallet',
      label: 'Chipper @tag or Registered Phone',
      placeholder: '@yourbusiness or +27 / +234 / +254 phone',
      helperText: 'Send direct payments from your Chipper wallet balance with real-time conversion.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Chipper Pay Dynamic QR',
      compatibleApps: ['Chipper Cash Mobile App'],
      brandColor: '#9333EA',
      instructions: 'Open your Chipper Cash app, tap "Scan", and confirm with biometric validation.',
    },
  },

  // ----------------------------------------------------
  // 4. Other Africa Countries
  // ----------------------------------------------------
  {
    id: 'fedapay',
    name: 'FedaPay',
    region: 'other_africa',
    regionName: 'Francophone & Central Africa',
    countries: ['Benin', 'Togo', 'Côte d\'Ivoire', 'Niger', 'Senegal'],
    flag: '🇧🇯',
    badge: 'FRANCOPHONE AFRICA LEADER',
    popular: true,
    tagline: 'MTN Mobile Money, Moov Money & Visa/Mastercard (XOF / CFA)',
    supportedMethods: ['MTN Mobile Money', 'Moov Money', 'Celtiis Cash', 'Visa/Mastercard'],
    supportedCurrencies: ['XOF', 'EUR'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'FedaPay Direct Gateway API',
    fields: {
      type: 'phone_stk',
      label: 'Mobile Money Phone (MTN / Moov)',
      placeholder: '+229 / +228 / +225 XX XX XX XX',
      helperText: 'STK push notification will be sent to your mobile money phone.',
    },
  },
  {
    id: 'cinetpay',
    name: 'CinetPay',
    region: 'other_africa',
    regionName: 'West & Central Africa (UEMOA / CEMAC)',
    countries: ['Senegal', 'Cameroon', 'Mali', 'Burkina Faso', 'Guinea', 'DR Congo', 'Gabon'],
    flag: '🇸🇳',
    badge: '10+ FRANCOPHONE COUNTRIES',
    popular: true,
    tagline: 'Orange Money, MTN, Wave, Moov, Free Money & Bank Cards',
    supportedMethods: ['Orange Money', 'Wave Mobile Money', 'MTN MoMo', 'Free Money', 'Cards'],
    supportedCurrencies: ['XOF', 'XAF', 'EUR'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'CinetPay Multi-Carrier Switch API',
    fields: {
      type: 'phone_stk',
      label: 'Orange / Wave / MTN Mobile Phone',
      placeholder: '+221 / +237 / +223 XX XX XX XX',
      helperText: 'Instant debit from your Orange Money or Wave wallet.',
    },
  },
  {
    id: 'ligdicash',
    name: 'LigdiCash',
    region: 'other_africa',
    regionName: 'Burkina Faso & UEMOA',
    countries: ['Burkina Faso', 'Benin', 'Côte d\'Ivoire', 'UEMOA'],
    flag: '🇧🇫',
    badge: 'UEMOA DIGITAL WALLETS',
    tagline: 'Orange Money Burkina, Moov Africa & Ligdi Direct Wallet',
    supportedMethods: ['Orange Money', 'Moov Africa', 'Ligdi Wallet', 'Bank Transfer'],
    supportedCurrencies: ['XOF'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'LigdiCash Central API',
    fields: {
      type: 'phone_stk',
      label: 'LigdiCash / Orange Phone Number',
      placeholder: '+226 XX XX XX XX',
      helperText: 'Direct validation via UEMOA mobile carrier networks.',
    },
  },
  {
    id: 'payfort',
    name: 'Payfort (Amazon Payment Services)',
    region: 'other_africa',
    regionName: 'North Africa & Middle East',
    countries: ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'UAE', 'Saudi Arabia'],
    flag: '🇪🇬',
    badge: 'NORTH AFRICA & ARAB LEAGUE',
    popular: true,
    tagline: 'Mada, Meeza (Egypt), Fawry, KNET & International Cards (EGP, MAD, AED)',
    supportedMethods: ['Meeza (Egypt)', 'Fawry Code', 'Mada', 'Visa / Mastercard', 'Installments'],
    supportedCurrencies: ['EGP', 'AED', 'SAR', 'MAD', 'USD'],
    settlementTime: 'Next-Day T+1',
    integrationProtocol: 'Amazon Payment Services (APS) v2',
    fields: {
      type: 'card',
      label: 'Card / Meeza Number',
      placeholder: 'Enter Meeza or debit card number',
      helperText: 'Fully compliant with Central Bank of Egypt & North African payment directives.',
    },
  },
  {
    id: 'fawry',
    name: 'Fawry Egypt',
    region: 'other_africa',
    regionName: 'Egypt & North Africa',
    countries: ['Egypt'],
    flag: '🇪🇬',
    badge: '#1 IN EGYPT (300K+ OUTLETS)',
    popular: true,
    tagline: 'Fawry Pay Reference Code, Meeza Cards, Mobile Wallets & POS Kiosks',
    supportedMethods: ['Fawry Reference Code', 'Meeza Cards', 'Vodafone Cash', 'InstaPay Egypt', 'Scan to Pay (Fawry QR)'],
    supportedCurrencies: ['EGP', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Fawry Pay Enterprise API v3',
    fields: {
      type: 'wallet',
      label: 'Fawry Pay Reference / Meeza Number',
      placeholder: 'Enter 9-digit Fawry reference or mobile number',
      helperText: 'Pay via any Fawry retail kiosk, myFawry mobile app, or InstaPay network.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Fawry Yellow QR Standard',
      compatibleApps: ['myFawry App', 'Meeza Digital', 'Vodafone Cash Egypt', 'InstaPay Egypt'],
      brandColor: '#F59E0B',
      instructions: 'Scan with your myFawry app or Egyptian banking app to pay immediately.',
    },
  },
  {
    id: 'payzone',
    name: 'Payzone / CMI Morocco',
    region: 'other_africa',
    regionName: 'Morocco & North Africa',
    countries: ['Morocco', 'North Africa'],
    flag: '🇲🇦',
    badge: 'MOROCCO CMI CERTIFIED',
    tagline: 'Centre Monétique Interbancaire (CMI), Moroccan Bank Cards & Dirhams (MAD)',
    supportedMethods: ['Moroccan Bank Cards (CMI)', 'Visa / Mastercard', 'Dirham Instant Settlement'],
    supportedCurrencies: ['MAD', 'EUR'],
    settlementTime: 'Next-Day T+1',
    integrationProtocol: 'CMI Morocco Hosted Gateway & 3D-Secure 2.0',
    fields: {
      type: 'card',
      label: 'Moroccan Bank Card (CMI / Visa / Mastercard)',
      placeholder: '4000 •••• •••• ••••',
      helperText: 'Direct settlement in Moroccan Dirham (MAD) via CMI national interbank switch.',
    },
  },
  {
    id: 'paynow',
    name: 'Paynow',
    region: 'other_africa',
    regionName: 'Zimbabwe & Southern Africa',
    countries: ['Zimbabwe'],
    flag: '🇿🇼',
    badge: 'ZIMBABWE PREFERRED',
    tagline: 'EcoCash, OneMoney, InnBucks, ZimSwitch & Visa/Mastercard',
    supportedMethods: ['EcoCash', 'OneMoney', 'InnBucks', 'ZimSwitch vPOS', 'Visa / Mastercard'],
    supportedCurrencies: ['ZWL', 'USD'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Paynow Zimbabwe Unified API',
    fields: {
      type: 'phone_stk',
      label: 'EcoCash / OneMoney Mobile Number',
      placeholder: '+263 77X XXX XXX',
      helperText: 'Receive real-time EcoCash merchant checkout prompt.',
    },
  },

  // ----------------------------------------------------
  // 5. Global & International
  // ----------------------------------------------------
  {
    id: 'stripe',
    name: 'Stripe',
    region: 'global',
    regionName: 'Global & International',
    countries: ['United States', 'United Kingdom', 'European Union', 'Global Diaspora'],
    flag: '🌐',
    badge: 'GLOBAL STANDARD',
    popular: true,
    tagline: 'Credit/Debit Cards, Apple Pay, Google Pay & Link across 135+ currencies',
    supportedMethods: ['Visa / Mastercard / Amex', 'Scan to Pay (Cash App QR / Link)', 'Apple Pay', 'Google Pay', 'Stripe Link'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY', 'CHF', 'AED', 'SAR', 'BRL', 'CNY', 'INR'],
    settlementTime: 'T+2 / Instant to Debit Card',
    integrationProtocol: 'Stripe Elements & PaymentIntents API',
    fields: {
      type: 'card',
      label: 'Card Number',
      placeholder: '4242 •••• •••• 4242',
      helperText: 'Protected by Stripe Radar with 3D Secure 2.0 fraud prevention.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Stripe Global QR / Link Pay',
      compatibleApps: ['Cash App', 'WeChat Pay', 'Alipay', 'Stripe Link (Camera Scan)'],
      brandColor: '#635BFF',
      instructions: 'Scan with Cash App or your mobile device camera for instant 1-click Link authorization.',
    },
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    region: 'global',
    regionName: 'Global & South Asia',
    countries: ['India', 'UAE', 'Southeast Asia', 'Global'],
    flag: '🌐',
    badge: 'GLOBAL UPI & MULTI-CURRENCY',
    tagline: 'Cards, UPI, Netbanking, International Wallets & Currency Conversions',
    supportedMethods: ['International Cards', 'Scan to Pay (UPI Dynamic QR)', 'UPI (GPay, PhonePe)', 'Netbanking', 'Wallets'],
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'],
    settlementTime: 'Instant T+0 UPI / T+1 Cards',
    integrationProtocol: 'Razorpay Standard Checkout & UPI NPCI Standard',
    fields: {
      type: 'upi',
      label: 'Card or UPI VPA',
      placeholder: 'user@okhdfcbank or 16-digit card',
      helperText: 'Seamless international card and cross-border settlement.',
    },
    qrSupport: {
      supported: true,
      standardName: 'UPI Dynamic QR (NPCI Standard)',
      compatibleApps: ['Google Pay (GPay)', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Any UPI Banking App'],
      brandColor: '#0C2340',
      instructions: 'Scan with any UPI app to pay immediately with zero surcharge.',
    },
  },
  {
    id: 'paypal',
    name: 'PayPal',
    region: 'global',
    regionName: 'Global & International',
    countries: ['Worldwide (200+ Countries)'],
    flag: '🌐',
    badge: 'TRUSTED WORLDWIDE',
    popular: true,
    tagline: 'PayPal Balance, Pay in 4, Linked Bank Accounts & Global Debit/Credit Cards',
    supportedMethods: ['PayPal Account Checkout', 'Scan to Pay (PayPal QR)', 'Pay in 4 Installments', 'Credit/Debit Card'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'CHF'],
    settlementTime: 'Instant to Balance',
    integrationProtocol: 'PayPal JavaScript SDK & v2 Orders API',
    fields: {
      type: 'wallet',
      label: 'PayPal Account Login / Card',
      placeholder: 'customer@business.com',
      helperText: 'Protected by PayPal Buyer & Merchant Protection guarantee.',
    },
    qrSupport: {
      supported: true,
      standardName: 'PayPal App Scan to Pay',
      compatibleApps: ['PayPal Mobile App', 'Venmo'],
      brandColor: '#003087',
      instructions: 'Scan with the PayPal mobile app for instant, buyer-protected clearance.',
    },
  },
  {
    id: 'adyen',
    name: 'Adyen Unified Commerce',
    region: 'global',
    regionName: 'Global Enterprise',
    countries: ['Global (Europe, Americas, Asia-Pacific, South Africa)'],
    flag: '🌐',
    badge: 'GLOBAL ENTERPRISE PLATFORM',
    popular: true,
    tagline: 'Omnichannel Enterprise Cards, Local Payment Methods & Direct Bank Settlement',
    supportedMethods: ['Visa / Mastercard / Amex', 'Apple Pay', 'Google Pay', 'Local Payment Methods', 'Scan to Pay (Adyen QR)'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'SGD', 'BRL', 'JPY'],
    settlementTime: 'Instant T+0 / Next-Day T+1',
    integrationProtocol: 'Adyen Drop-in SDK & Checkout API v70',
    fields: {
      type: 'card',
      label: 'Adyen Universal Checkout',
      placeholder: '4111 •••• •••• ••••',
      helperText: 'Direct processing via Adyen banking license with optimized interchange fees.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Adyen Unified Mobile QR',
      compatibleApps: ['Apple Pay', 'Google Pay', 'WeChat Pay', 'Alipay', 'Local Banking Apps'],
      brandColor: '#0ABF53',
      instructions: 'Scan with your mobile wallet for instant contactless authorization.',
    },
  },
  {
    id: 'square',
    name: 'Square / Block',
    region: 'global',
    regionName: 'North America & Global',
    countries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Japan', 'France', 'Spain'],
    flag: '🌐',
    badge: 'MODERN RETAIL & WEB PAY',
    tagline: 'Credit Cards, Cash App Pay, Square Register POS & Instant Transfer',
    supportedMethods: ['Credit/Debit Cards', 'Cash App Pay', 'Apple Pay', 'Google Pay', 'Scan to Pay (Square QR)'],
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD', 'EUR', 'JPY'],
    settlementTime: 'Next-Day T+1 / Instant to Square Card',
    integrationProtocol: 'Square Web Payments SDK & Cash App Pay API',
    fields: {
      type: 'card',
      label: 'Square Card / Cash App Pay',
      placeholder: 'Enter Card or $Cashtag',
      helperText: 'Instant verification backed by Square risk management.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Square & Cash App Dynamic QR',
      compatibleApps: ['Cash App', 'Square App', 'Mobile Phone Camera'],
      brandColor: '#006AFF',
      instructions: 'Scan with Cash App or camera to approve instant payment.',
    },
  },
  {
    id: 'klarna',
    name: 'Klarna (Buy Now Pay Later)',
    region: 'global',
    regionName: 'Global BNPL',
    countries: ['United States', 'United Kingdom', 'European Union', 'Australia', 'Canada'],
    flag: '🌐',
    badge: 'BUY NOW, PAY LATER',
    popular: true,
    tagline: 'Pay in 4 Interest-Free Installments, Pay in 30 Days or 1-Click Checkout',
    supportedMethods: ['Pay in 4 (Bi-weekly)', 'Pay in 30 Days', 'Monthly Financing', 'Klarna 1-Click'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    settlementTime: 'Immediate Full Merchant Advance',
    integrationProtocol: 'Klarna Payments Core API & Webhook',
    fields: {
      type: 'bnpl',
      label: 'Klarna Email / Phone for Instant Credit',
      placeholder: 'billing@company.com',
      helperText: 'You get full software activation immediately; pay over 4 interest-free installments.',
    },
  },
  {
    id: 'revolut',
    name: 'Revolut Pay',
    region: 'global',
    regionName: 'UK, Europe & International',
    countries: ['United Kingdom', 'European Union', 'United States', 'Australia', 'Singapore'],
    flag: '🇬🇧',
    badge: 'FAST 1-CLICK PAY',
    popular: true,
    tagline: '1-Click Revolut App Checkout, Multi-Currency Balance & Direct SEPA/Faster Payments',
    supportedMethods: ['Revolut App 1-Click', 'Scan to Pay (Revolut QR)', 'Visa / Mastercard', 'Direct Bank Debit'],
    supportedCurrencies: ['GBP', 'EUR', 'USD', 'CAD', 'AUD', 'CHF', 'PLN', 'RON'],
    settlementTime: 'Instant T+0',
    integrationProtocol: 'Revolut Merchant Checkout v2 & Instant Push API',
    fields: {
      type: 'wallet',
      label: 'Revolut Phone or Revtag',
      placeholder: '+44 7XXX XXXXXX or @revtag',
      helperText: 'One tap in your Revolut app to approve payment with zero FX markup.',
    },
    qrSupport: {
      supported: true,
      standardName: 'Revolut Pay Fast QR',
      compatibleApps: ['Revolut App'],
      brandColor: '#192024',
      instructions: 'Scan with your Revolut app for 1-tap payment from any currency balance.',
    },
  },
  {
    id: 'mollie',
    name: 'Mollie',
    region: 'global',
    regionName: 'European Union & Global',
    countries: ['Netherlands', 'Germany', 'France', 'Belgium', 'Europe & Global'],
    flag: '🇪🇺',
    badge: 'EUROPEAN SPECIALIST',
    tagline: 'iDEAL, SEPA Direct Debit, Bancontact, Sofort & Euro Cards',
    supportedMethods: ['iDEAL', 'SEPA Bank Transfer', 'Bancontact', 'Visa / Mastercard'],
    supportedCurrencies: ['EUR', 'GBP', 'USD', 'CHF'],
    settlementTime: 'Next-Day T+1',
    integrationProtocol: 'Mollie Payments API & PSD2 SCA Compliance',
    fields: {
      type: 'card',
      label: 'iDEAL / SEPA / Card',
      placeholder: 'IBAN or Card Number',
      helperText: 'European PSD2 SCA compliant direct payment gateway.',
    },
  },
  {
    id: 'twocheckout',
    name: '2Checkout (Verifone)',
    region: 'global',
    regionName: 'Global Cross-Border',
    countries: ['200+ Countries Worldwide'],
    flag: '🌐',
    badge: 'GLOBAL MERCHANT PROCESSING',
    tagline: 'Global merchant billing, multi-currency processing & localized payment methods',
    supportedMethods: ['International Credit/Debit Cards', 'PayPal', 'Wire Transfer', 'Local Cards'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED'],
    settlementTime: 'Weekly / Bi-Weekly',
    integrationProtocol: '2Checkout 2Pay.js & Global Tax Engine',
    fields: {
      type: 'card',
      label: 'Credit or Debit Card',
      placeholder: '4111 •••• •••• 1111',
      helperText: 'Global tax and compliance management powered by Verifone.',
    },
  },
];

/**
 * Find default region based on currency
 */
export function getDefaultRegionForCurrency(currency: string): PaymentRegionId {
  switch (currency) {
    // West Africa
    case 'NGN':
    case 'GHS':
    case 'XOF':
    case 'GMD':
    case 'SLL':
    case 'LRD':
    case 'GNF':
    case 'CVE':
    case 'MRU':
      return 'west_africa';

    // East Africa
    case 'KES':
    case 'UGX':
    case 'TZS':
    case 'RWF':
    case 'ETB':
    case 'BIF':
    case 'SOS':
    case 'DJF':
    case 'SSP':
    case 'ERN':
    case 'KMF':
      return 'east_africa';

    // Southern Africa
    case 'ZAR':
    case 'ZMW':
    case 'BWP':
    case 'NAD':
    case 'MWK':
    case 'MZN':
    case 'SZL':
    case 'LSL':
    case 'MUR':
    case 'SCR':
    case 'MGA':
      return 'south_africa';

    // Central & North Africa
    case 'XAF':
    case 'MAD':
    case 'EGP':
    case 'DZD':
    case 'TND':
    case 'LYD':
    case 'SDG':
    case 'AOA':
    case 'CDF':
    case 'STN':
    case 'ZIP':
    case 'ZWL':
      return 'other_africa';

    // Global / International
    case 'USD':
    case 'GBP':
    case 'EUR':
    case 'CAD':
    case 'AUD':
    case 'AED':
    case 'SAR':
    case 'INR':
    case 'CNY':
    case 'JPY':
    case 'CHF':
    case 'SGD':
    case 'BRL':
    default:
      return 'global';
  }
}

/**
 * Dynamically surfaces the single premier gateway for a given currency
 */
export function getDefaultGatewayForCurrency(currency: string): PaymentGatewayId {
  switch (currency) {
    case 'NGN':
      return 'paystack';
    case 'KES':
      return 'mpesa';
    case 'GHS':
      return 'hubtel';
    case 'ZAR':
      return 'ozow';
    case 'ETB':
      return 'chapa';
    case 'EGP':
      return 'fawry';
    case 'XOF':
      return 'wave';
    case 'MAD':
      return 'payzone';
    case 'INR':
      return 'razorpay';
    case 'GBP':
      return 'revolut';
    case 'EUR':
      return 'mollie';
    case 'USD':
    default:
      return 'stripe';
  }
}

/**
 * Returns all payment gateways that natively process or are specifically optimized for a given currency
 */
export function getGatewaysForCurrency(currency: string): PaymentGatewayInfo[] {
  // First, gateways that explicitly list this currency in supportedCurrencies
  const directMatches = ALL_PAYMENT_GATEWAYS.filter(
    (gw) => gw.supportedCurrencies && gw.supportedCurrencies.includes(currency)
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  // Fallback to gateways in the currency's regional zone
  const targetRegion = getDefaultRegionForCurrency(currency);
  return ALL_PAYMENT_GATEWAYS.filter((gw) => gw.region === targetRegion);
}

/**
 * Determines whether a gateway has native (direct) support for the currency without FX markup
 */
export function isCurrencyNativelySupported(gateway: PaymentGatewayInfo, currency: string): boolean {
  return Boolean(gateway.supportedCurrencies && gateway.supportedCurrencies.includes(currency));
}
