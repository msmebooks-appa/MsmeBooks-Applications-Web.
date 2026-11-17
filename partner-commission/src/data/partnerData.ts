import {
  PartnerTier,
  PartnerCategory,
  CurrencyCode,
  CurrencyConfig,
  ReferralRecord,
  CommissionTransaction,
  PayoutRecord,
  FAQItem,
  ResourceItem,
  CaseStudyItem
} from '../types/partner';

export const PARTNER_TIERS: PartnerTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    rate: 0.15,
    rateDisplay: '15%',
    positioning: 'Start earning',
    tagline: 'Ideal for independent bookkeepers and solo consultants starting their MsmeBooks journey.',
    targetAudience: 'Independent bookkeepers, solo accountants, freelance business consultants, and entry-level referral associates.',
    benefits: [
      '15% recurring commission on eligible customer subscriptions',
      'Unique referral link and individual partner identification code',
      'Basic partner dashboard with real-time referral tracking',
      'Standard marketing kit and referral sales one-pagers',
      'Access to partner onboarding guide and self-paced video lessons',
      'Automated commission calculation and monthly earnings ledger'
    ],
    proposedFeatures: [
      'Digital partner badge for website and LinkedIn',
      'Community partner forum access'
    ],
    ctaLabel: 'Join as Bronze Partner'
  },
  {
    id: 'silver',
    name: 'Silver Partner',
    rate: 0.20,
    rateDisplay: '20%',
    positioning: 'Grow your network',
    tagline: 'For active advisory firms and expanding consultants scaling their SME client book.',
    targetAudience: 'Growing accounting firms, tax consultants, SME advisory practices, and active business service providers.',
    benefits: [
      '20% recurring commission on eligible customer subscriptions',
      'All Bronze Partner benefits included',
      'Expanded partner training resources and live product masterclasses',
      'Customizable co-brandable sales enablement presentations',
      'Advanced partner analytics with customer lifetime value insights',
      'Dedicated partner growth email support channel'
    ],
    proposedFeatures: [
      'Quarterly partner performance review',
      'Early access to new feature betas'
    ],
    ctaLabel: 'Become a Silver Partner'
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    rate: 0.30,
    rateDisplay: '30%',
    positioning: 'Scale your partnership',
    isPopular: true,
    badge: 'Most Popular',
    tagline: 'Designed for established software resellers, accounting practices, and tech providers.',
    targetAudience: 'Established audit & accounting firms, IT solution providers, software distributors, and implementation agencies.',
    benefits: [
      '30% recurring commission on eligible customer subscriptions',
      'All Silver Partner benefits included',
      'Advanced implementation & multi-branch configuration training',
      'Co-marketing opportunities (joint webinars, case studies, collateral)',
      'Enhanced partner analytics with multi-representative tracking',
      'Priority partner desk support with <4h response SLA',
      'Tailored customer acquisition and lead collaboration resources'
    ],
    proposedFeatures: [
      'Quarterly MDF (Market Development Funds) eligibility',
      'Featured listing in MsmeBooks Certified Partner Directory'
    ],
    ctaLabel: 'Apply for Gold Partnership'
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    rate: 0.40,
    rateDisplay: '40%',
    positioning: 'Maximize your earnings',
    badge: 'Enterprise Tier',
    tagline: 'Premier tier for regional distributors, enterprise advisory firms, and strategic networks.',
    targetAudience: 'High-volume distributors, regional ERP consultancies, major fintech alliances, and national business federations.',
    benefits: [
      '40% recurring commission on eligible customer subscriptions',
      'All Gold Partner benefits included',
      'Strategic partnership executive sponsor and dedicated account manager',
      'Joint business development and bespoke co-selling engagements',
      'Enterprise customer engagement and custom workflow advisory support',
      'Direct API partner access for custom ERP & POS integrations',
      'Priority consideration for regional distribution rights & campaigns'
    ],
    proposedFeatures: [
      'Executive council seat on product roadmap advisory',
      'Custom SLA agreement for enterprise client rollouts'
    ],
    ctaLabel: 'Apply for Platinum Partnership'
  }
];

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    id: 'bookkeepers',
    name: 'Bookkeepers & Bookkeeping Professionals',
    sector: 'accounting',
    sectorLabel: 'Accounting & Finance',
    roleDescription: 'Manage daily sales records, expense tracking, invoicing, and bank reconciliation for growing SMEs.',
    customerOpportunities: 'Retail shops, service providers, eateries, and micro-enterprises needing tidy day-to-day books.',
    solutionsToPromote: ['MsmeBooks Core Accounting', 'Invoicing & Receipts', 'Bank Feeds', 'Expense Tracker'],
    suggestedTier: 'bronze',
    suggestedTierLabel: 'Bronze (15%) or Silver (20%)'
  },
  {
    id: 'accountants',
    name: 'Accountants & Accounting Firms',
    sector: 'accounting',
    sectorLabel: 'Accounting & Finance',
    roleDescription: 'Provide statutory financial statements, management accounts, cashflow audits, and business planning.',
    customerOpportunities: 'Mid-sized businesses, multi-branch retailers, manufacturing firms, and medical practices.',
    solutionsToPromote: ['Full Financial Reporting', 'Multi-Currency Ledger', 'Fixed Asset Register', 'Consolidated Statements'],
    suggestedTier: 'gold',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'tax_consultants',
    name: 'Tax Consultants & Tax Advisory Firms',
    sector: 'accounting',
    sectorLabel: 'Accounting & Finance',
    roleDescription: 'Assist enterprises with VAT/WHT compliance, corporate tax filings, PAYE remittances, and tax health checks.',
    customerOpportunities: 'Enterprises facing annual audits, growing startups, and cross-border commercial operators.',
    solutionsToPromote: ['Automated VAT & WHT Returns', 'PAYE Compliance', 'Tax Withholding Reports', 'Audit Trail Export'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'audit_firms',
    name: 'Audit Firms & Financial Auditors',
    sector: 'accounting',
    sectorLabel: 'Accounting & Finance',
    roleDescription: 'Perform independent statutory audits, internal control reviews, and forensic financial investigations.',
    customerOpportunities: 'Corporate entities, NGOs, educational institutions, and venture-backed companies.',
    solutionsToPromote: ['Immutable Audit Trails', 'Role-Based Permissions', 'Automated Journal Logs', 'Year-End Close Wizard'],
    suggestedTier: 'gold',
    suggestedTierLabel: 'Gold (30%)'
  },
  {
    id: 'pos_agents',
    name: 'POS Agents & Merchant Service Providers',
    sector: 'retail',
    sectorLabel: 'Retail & Commerce',
    roleDescription: 'Deploy point-of-sale hardware, card terminals, and checkout systems to retail stores and hospitality venues.',
    customerOpportunities: 'Supermarkets, pharmacies, boutique stores, bars, restaurants, and wholesale distributors.',
    solutionsToPromote: ['MsmeBooks POS Touch', 'Barcode Scanning', 'Real-Time Inventory Sync', 'Offline POS Mode'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'tech_it_companies',
    name: 'Technology & IT Companies',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Deliver managed IT infrastructure, network setup, hardware procurement, and cloud workplace solutions.',
    customerOpportunities: 'Corporate offices, logistics companies, educational institutions, and medical centers.',
    solutionsToPromote: ['Cloud Cloud Sync', 'Multi-User RBAC', 'Automated Daily Backups', 'POS Terminal Setup'],
    suggestedTier: 'gold',
    suggestedTierLabel: 'Gold (30%)'
  },
  {
    id: 'software_distributors',
    name: 'Software Distributors & Value-Added Resellers',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Market, package, and resell enterprise software suites and SaaS licenses across commercial networks.',
    customerOpportunities: 'Enterprise clients, fast-growing franchise groups, and commercial supply chains.',
    solutionsToPromote: ['MsmeBooks Enterprise Suite', 'Multi-Branch Inventory', 'Payroll Engine', 'Custom Integrations'],
    suggestedTier: 'platinum',
    suggestedTierLabel: 'Platinum (40%)'
  },
  {
    id: 'computer_shops',
    name: 'Computer Shops & Technology Retailers',
    sector: 'retail',
    sectorLabel: 'Retail & Commerce',
    roleDescription: 'Sell desktop PCs, laptops, thermal receipt printers, barcode scanners, and cashier equipment.',
    customerOpportunities: 'New retail store owners, traders, and small business operators buying their first computer.',
    solutionsToPromote: ['Bundled MsmeBooks POS', 'Receipt Printer Setup', 'Offline/Online Billing', 'Starter Accounting'],
    suggestedTier: 'bronze',
    suggestedTierLabel: 'Bronze (15%) or Silver (20%)'
  },
  {
    id: 'sme_advisers',
    name: 'SME Advisers & Business Consultants',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Guide business founders on scaling strategy, operational efficiency, profitability, and financing readiness.',
    customerOpportunities: 'Growth-stage SMEs seeking loans, investment, or restructuring for higher profitability.',
    solutionsToPromote: ['Executive KPI Dashboard', 'Cashflow Projections', 'Profit Margin Analysis', 'Cost Center Tracking'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'outsourcing_bpo',
    name: 'Outsourcing & Business Process Service Providers (BPO)',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Provide managed back-office services including remote bookkeeping, payroll processing, and billing.',
    customerOpportunities: 'Foreign companies operating local branches, startups, and remote distributed teams.',
    solutionsToPromote: ['Multi-Client Partner Portal', 'Automated Payroll & Pay slips', 'Bulk Invoicing', 'Client Access Portal'],
    suggestedTier: 'gold',
    suggestedTierLabel: 'Gold (30%)'
  },
  {
    id: 'business_associates',
    name: 'Business Associates & Independent Referral Agents',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Connected professionals who introduce business owners to digital tools through their professional network.',
    customerOpportunities: 'Trade association contacts, chamber of commerce peers, and entrepreneurial acquaintances.',
    solutionsToPromote: ['All-in-One MsmeBooks Suite', 'Simple Invoicing', 'Mobile POS', 'Expense Tracking'],
    suggestedTier: 'bronze',
    suggestedTierLabel: 'Bronze (15%)'
  },
  {
    id: 'fintech_payment',
    name: 'Fintech Companies & Payment Service Providers',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Provide payment gateways, mobile money collections, merchant acquiring, and banking integration.',
    customerOpportunities: 'E-commerce merchants, omni-channel retailers, and digital subscription providers.',
    solutionsToPromote: ['Payment Link Integration', 'Automated Bank Reconciliations', 'Multi-Currency Billing'],
    suggestedTier: 'platinum',
    suggestedTierLabel: 'Gold (30%) or Platinum (40%)'
  },
  {
    id: 'training_centers',
    name: 'Business Training Centers & Educational Providers',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Train aspiring entrepreneurs, accounting students, and SME managers on modern digital business skills.',
    customerOpportunities: 'Graduating students, business incubation cohorts, and vocational training participants.',
    solutionsToPromote: ['MsmeBooks Academy Student Access', 'Hands-on Accounting Labs', 'Certification Courses'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'erp_consultants',
    name: 'ERP & Business Software Implementation Consultants',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Migrate legacy desktop databases, customize charts of accounts, and implement workflows for mid-market firms.',
    customerOpportunities: 'Companies outgrowing spreadsheets, transitioning off expensive foreign software, or opening branches.',
    solutionsToPromote: ['Multi-Branch Warehousing', 'Custom Chart of Accounts', 'API Data Migrations', 'User Roles & Auditing'],
    suggestedTier: 'platinum',
    suggestedTierLabel: 'Gold (30%) or Platinum (40%)'
  },
  {
    id: 'digital_agencies',
    name: 'Digital Agencies & Technology Consultants',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Build modern websites, e-commerce storefronts, and marketing funnels for consumer-facing brands.',
    customerOpportunities: 'DTC retail brands, hospitality spots, and digital brands requiring automated inventory & invoice sync.',
    solutionsToPromote: ['Storefront API Sync', 'Online Order Billing', 'Customer Balance Accounts', 'Automated Email Invoices'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%)'
  },
  {
    id: 'industry_associations',
    name: 'Industry Associations & Business Networks',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Trade unions, chambers of commerce, manufacturers associations, and cooperative societies.',
    customerOpportunities: 'Entire member directory of small merchants, artisanal businesses, and registered traders.',
    solutionsToPromote: ['Member Group Onboarding', 'Bulk Subscription Licensing', 'Standardized Financial Recordkeeping'],
    suggestedTier: 'platinum',
    suggestedTierLabel: 'Gold (30%) or Platinum (40%)'
  },
  {
    id: 'corporate_services',
    name: 'Corporate Service Providers & Legal / Secretarial Firms',
    sector: 'advisory',
    sectorLabel: 'Advisory & Growth',
    roleDescription: 'Register new businesses, provide company secretarial services, and ensure regulatory corporate governance.',
    customerOpportunities: 'Newly incorporated companies setting up their initial bookkeeping and corporate tax filing.',
    solutionsToPromote: ['Instant Startup Setup', 'Statutory Record Keeping', 'PAYE & Tax Registration Ready'],
    suggestedTier: 'silver',
    suggestedTierLabel: 'Silver (20%) or Gold (30%)'
  },
  {
    id: 'strategic_distributors',
    name: 'Strategic Enterprise & Regional Distribution Partners',
    sector: 'technology',
    sectorLabel: 'Technology & IT',
    roleDescription: 'Multi-territory tech conglomerates, telecoms, and national commercial hardware distributors.',
    customerOpportunities: 'Country-wide SME digitalization programs, telco bundled packages, and national bank merchant networks.',
    solutionsToPromote: ['White-Label / Co-Branded Portal', 'Enterprise SSO', 'Custom Multi-Tenant APIs', 'Volume Tiering'],
    suggestedTier: 'platinum',
    suggestedTierLabel: 'Platinum (40%)'
  }
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira (NGN)',
    shortLabel: 'NGN',
    flag: '🇳🇬',
    exchangeRateToNGN: 1,
    defaultSubscription: 20000,
    minSubscription: 5000,
    maxSubscription: 150000,
    step: 2500,
    decimals: 0,
    region: 'Africa'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    shortLabel: 'USD',
    flag: '🇺🇸',
    exchangeRateToNGN: 1480,
    defaultSubscription: 20,
    minSubscription: 5,
    maxSubscription: 150,
    step: 5,
    decimals: 2,
    region: 'Global'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    shortLabel: 'EUR',
    flag: '🇪🇺',
    exchangeRateToNGN: 1610,
    defaultSubscription: 18,
    minSubscription: 5,
    maxSubscription: 140,
    step: 5,
    decimals: 2,
    region: 'Global'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    shortLabel: 'GBP',
    flag: '🇬🇧',
    exchangeRateToNGN: 1920,
    defaultSubscription: 16,
    minSubscription: 5,
    maxSubscription: 120,
    step: 5,
    decimals: 2,
    region: 'Global'
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling (KES)',
    shortLabel: 'KES',
    flag: '🇰🇪',
    exchangeRateToNGN: 11.45,
    defaultSubscription: 2500,
    minSubscription: 500,
    maxSubscription: 20000,
    step: 250,
    decimals: 0,
    region: 'Africa'
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand (ZAR)',
    shortLabel: 'ZAR',
    flag: '🇿🇦',
    exchangeRateToNGN: 83.2,
    defaultSubscription: 350,
    minSubscription: 80,
    maxSubscription: 3000,
    step: 25,
    decimals: 2,
    region: 'Africa'
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi (GHS)',
    shortLabel: 'GHS',
    flag: '🇬🇭',
    exchangeRateToNGN: 95,
    defaultSubscription: 300,
    minSubscription: 75,
    maxSubscription: 2500,
    step: 25,
    decimals: 2,
    region: 'Africa'
  },
  MAD: {
    code: 'MAD',
    symbol: 'MAD',
    name: 'Moroccan Dirham (MAD)',
    shortLabel: 'MAD',
    flag: '🇲🇦',
    exchangeRateToNGN: 150,
    defaultSubscription: 200,
    minSubscription: 50,
    maxSubscription: 1500,
    step: 25,
    decimals: 2,
    region: 'Africa'
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA (XAF)',
    shortLabel: 'XAF',
    flag: '🇨🇲',
    exchangeRateToNGN: 2.45,
    defaultSubscription: 12000,
    minSubscription: 3000,
    maxSubscription: 100000,
    step: 1000,
    decimals: 0,
    region: 'Africa'
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham (AED)',
    shortLabel: 'AED',
    flag: '🇦🇪',
    exchangeRateToNGN: 403,
    defaultSubscription: 75,
    minSubscription: 20,
    maxSubscription: 600,
    step: 10,
    decimals: 2,
    region: 'Middle East'
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling (UGX)',
    shortLabel: 'UGX',
    flag: '🇺🇬',
    exchangeRateToNGN: 0.4,
    defaultSubscription: 75000,
    minSubscription: 20000,
    maxSubscription: 600000,
    step: 5000,
    decimals: 0,
    region: 'Africa'
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling (TZS)',
    shortLabel: 'TZS',
    flag: '🇹🇿',
    exchangeRateToNGN: 0.56,
    defaultSubscription: 50000,
    minSubscription: 15000,
    maxSubscription: 400000,
    step: 5000,
    decimals: 0,
    region: 'Africa'
  },
  RWF: {
    code: 'RWF',
    symbol: 'RWF',
    name: 'Rwandan Franc (RWF)',
    shortLabel: 'RWF',
    flag: '🇷🇼',
    exchangeRateToNGN: 1.09,
    defaultSubscription: 25000,
    minSubscription: 6000,
    maxSubscription: 200000,
    step: 2500,
    decimals: 0,
    region: 'Africa'
  },
  ZMW: {
    code: 'ZMW',
    symbol: 'ZK',
    name: 'Zambian Kwacha (ZMW)',
    shortLabel: 'ZMW',
    flag: '🇿🇲',
    exchangeRateToNGN: 55.2,
    defaultSubscription: 500,
    minSubscription: 100,
    maxSubscription: 4000,
    step: 50,
    decimals: 2,
    region: 'Africa'
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound (EGP)',
    shortLabel: 'EGP',
    flag: '🇪🇬',
    exchangeRateToNGN: 30.45,
    defaultSubscription: 950,
    minSubscription: 250,
    maxSubscription: 7500,
    step: 50,
    decimals: 2,
    region: 'Africa'
  },
  ZIP: {
    code: 'ZIP',
    symbol: 'ZiG',
    name: 'Zimbabwean ZiG (ZIP)',
    shortLabel: 'ZIP',
    flag: '🇿🇼',
    exchangeRateToNGN: 109,
    defaultSubscription: 270,
    minSubscription: 60,
    maxSubscription: 2000,
    step: 20,
    decimals: 2,
    region: 'Africa'
  }
};

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'REF-8012',
    businessName: 'Apex Logistics & Freight Hub',
    contactPerson: 'Emeka Nwosu',
    planName: 'Enterprise Multi-Branch',
    monthlyValue: 35000,
    status: 'active',
    attributionDate: '2026-08-14',
    attributionSource: 'Direct Partner Code #MSME-PART-781',
    commissionEarnedToDate: 126000
  },
  {
    id: 'REF-8013',
    businessName: 'Lekki Artisan Bakery & Cafe',
    contactPerson: 'Folashade Adeleke',
    planName: 'POS + Inventory Retail',
    monthlyValue: 18000,
    status: 'active',
    attributionDate: '2026-09-02',
    attributionSource: 'Referral Link /partner/ace-consulting',
    commissionEarnedToDate: 43200
  },
  {
    id: 'REF-8014',
    businessName: 'Sahara Agrotech Supplies Ltd',
    contactPerson: 'Babatunde Alabi',
    planName: 'Accounting Pro + Payroll',
    monthlyValue: 24000,
    status: 'active',
    attributionDate: '2026-09-18',
    attributionSource: 'Direct Partner Code #MSME-PART-781',
    commissionEarnedToDate: 28800
  },
  {
    id: 'REF-8015',
    businessName: 'Kigali Fresh Mart Express',
    contactPerson: 'Claire Uwera',
    planName: 'POS Multi-Register',
    monthlyValue: 15000,
    status: 'trial',
    attributionDate: '2026-10-12',
    attributionSource: 'Referral Link /partner/ace-consulting',
    commissionEarnedToDate: 0
  },
  {
    id: 'REF-8016',
    businessName: 'Horizon Media & Digital Lab',
    contactPerson: 'David Osei',
    planName: 'Standard Accounting',
    monthlyValue: 12000,
    status: 'active',
    attributionDate: '2026-07-29',
    attributionSource: 'Partner API Referral',
    commissionEarnedToDate: 43200
  }
];

export const INITIAL_TRANSACTIONS: CommissionTransaction[] = [
  {
    id: 'TX-901',
    referralId: 'REF-8012',
    customerName: 'Apex Logistics & Freight Hub',
    billingPeriod: 'October 2026 (Monthly)',
    grossAmount: 35000,
    rate: 0.30,
    commissionAmount: 10500,
    currency: 'NGN',
    status: 'approved',
    date: '2026-10-15',
    referenceNumber: 'COM-202610-0911'
  },
  {
    id: 'TX-902',
    referralId: 'REF-8013',
    customerName: 'Lekki Artisan Bakery & Cafe',
    billingPeriod: 'October 2026 (Monthly)',
    grossAmount: 18000,
    rate: 0.30,
    commissionAmount: 5400,
    currency: 'NGN',
    status: 'approved',
    date: '2026-10-15',
    referenceNumber: 'COM-202610-0912'
  },
  {
    id: 'TX-903',
    referralId: 'REF-8014',
    customerName: 'Sahara Agrotech Supplies Ltd',
    billingPeriod: 'October 2026 (Monthly)',
    grossAmount: 24000,
    rate: 0.30,
    commissionAmount: 7200,
    currency: 'NGN',
    status: 'approved',
    date: '2026-10-15',
    referenceNumber: 'COM-202610-0913'
  },
  {
    id: 'TX-904',
    referralId: 'REF-8016',
    customerName: 'Horizon Media & Digital Lab',
    billingPeriod: 'October 2026 (Monthly)',
    grossAmount: 12000,
    rate: 0.30,
    commissionAmount: 3600,
    currency: 'NGN',
    status: 'pending',
    date: '2026-10-21',
    referenceNumber: 'COM-202610-0914'
  },
  {
    id: 'TX-892',
    referralId: 'REF-8012',
    customerName: 'Apex Logistics & Freight Hub',
    billingPeriod: 'September 2026 (Monthly)',
    grossAmount: 35000,
    rate: 0.30,
    commissionAmount: 10500,
    currency: 'NGN',
    status: 'paid',
    date: '2026-09-30',
    referenceNumber: 'COM-202609-0822'
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PAY-401',
    date: '2026-09-30',
    amount: 148500,
    currency: 'NGN',
    method: 'Direct Bank Transfer (NIP)',
    accountDetails: 'Access Bank PLC ······4921',
    status: 'completed',
    referenceNumber: 'MSME-PAY-20260930-819'
  },
  {
    id: 'PAY-402',
    date: '2026-08-31',
    amount: 112000,
    currency: 'NGN',
    method: 'Direct Bank Transfer (NIP)',
    accountDetails: 'Access Bank PLC ······4921',
    status: 'completed',
    referenceNumber: 'MSME-PAY-20260831-704'
  },
  {
    id: 'PAY-403',
    date: '2026-07-31',
    amount: 86400,
    currency: 'NGN',
    method: 'Direct Bank Transfer (NIP)',
    accountDetails: 'Access Bank PLC ······4921',
    status: 'completed',
    referenceNumber: 'MSME-PAY-20260731-529'
  }
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'case-1',
    partnerName: 'Olumide & Adebisi Advisory',
    organization: 'Chartered Accountants & Tax Advisers',
    country: 'Nigeria',
    city: 'Lagos',
    category: 'Accounting & Tax Advisory',
    tier: 'Gold Partner (30%)',
    avatarImg: '/src/assets/images/partner_avatar_woman_1792762385055.jpg',
    challenge: 'Prior to MsmeBooks, our audit team spent 35+ hours every month chasing paper receipts, disorganized bank statements, and legacy desktop spreadsheet crashes across 60+ retail and medical clients.',
    solution: 'We standardized our entire advisory portfolio on MsmeBooks Cloud Accounting and POS. Clients input daily operations while our firm receives clean, consolidated ledgers in real time.',
    outcome: 'We now manage 84 active SME clients on MsmeBooks. The 30% recurring commission yields an additional ₦1,260,000 in monthly firm revenue alongside our advisory retainers.',
    metric: '₦15.1M',
    metricLabel: 'Annual Recurring Partner Commission'
  },
  {
    id: 'case-2',
    partnerName: 'Nairobi Enterprise IT Hub',
    organization: 'Hardware Resellers & Software Integrators',
    country: 'Kenya',
    city: 'Nairobi',
    category: 'IT Reseller & POS Systems',
    tier: 'Gold Partner (30%)',
    avatarImg: '/src/assets/images/partner_avatar_man_1792762385541.jpg',
    challenge: 'We supplied touch terminals, barcode scanners, and thermal printers to retail shops, but we missed out on recurring revenue once the one-time hardware sale was finalized.',
    solution: 'By bundling MsmeBooks POS Touch and Inventory directly onto every hardware terminal delivered, we transformed single one-off transactions into long-term SaaS partnerships.',
    outcome: 'Over 130 merchant locations are active on MsmeBooks POS through our partner ID. We maintain steady monthly recurring commissions with zero software maintenance overhead.',
    metric: '130+',
    metricLabel: 'Active Retail Merchants Powered'
  },
  {
    id: 'case-3',
    partnerName: 'GoldCoast Business Solutions',
    organization: 'SME Management & Corporate Services',
    country: 'Ghana',
    city: 'Accra',
    category: 'SME Advisory & Outsourced BPO',
    tier: 'Silver Partner (20%)',
    avatarImg: '/src/assets/images/partner_consulting_meeting_1792762385211.jpg',
    challenge: 'Newly registered businesses in Ghana needed compliant accounting and VAT filing immediately, but enterprise ERP software was prohibitively priced for small businesses.',
    solution: 'We incorporated MsmeBooks onboarding as part of our business setup package for every newly registered company we incorporate.',
    outcome: 'Client retention reached 96% in year one. Our firm earned both incorporation fees and reliable 20% recurring monthly commissions as our clients expanded.',
    metric: '96%',
    metricLabel: 'First-Year Client Retention Rate'
  }
];

export const SALES_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'MsmeBooks Partner Pitch Deck 2026',
    type: 'deck',
    category: 'Sales Presentation',
    description: 'Comprehensive 18-slide customizable presentation deck explaining MsmeBooks Accounting, POS, Inventory, and Payroll to SME owners.',
    fileSize: '4.8 MB · PDF & PPTX',
    badge: 'Essential'
  },
  {
    id: 'res-2',
    title: 'Official MsmeBooks Brand Asset & Co-Marketing Kit',
    type: 'kit',
    category: 'Branding & Design',
    description: 'Approved high-res logos (SVG & PNG), official color palettes (#1261B5, #B9E51C), partner badge vector files, and co-branding guidelines.',
    fileSize: '12.4 MB · ZIP Archive',
    badge: 'Approved Assets'
  },
  {
    id: 'res-3',
    title: 'Pan-African SME Tax & VAT Compliance Handbook',
    type: 'guide',
    category: 'Advisory Guide',
    description: 'Reference guide detailing how MsmeBooks handles VAT, WHT, and statutory filings across Nigeria (FIRS), Kenya (KRA), Ghana (GRA), and South Africa (SARS).',
    fileSize: '3.2 MB · PDF',
    badge: 'Technical Guide'
  },
  {
    id: 'res-4',
    title: 'POS Hardware Compatibility & Setup Checklist',
    type: 'template',
    category: 'Hardware Implementation',
    description: 'Specification matrix for certified thermal receipt printers, Bluetooth ESC/POS printers, barcode scanners, and cash drawers.',
    fileSize: '1.9 MB · PDF'
  },
  {
    id: 'res-5',
    title: 'Client Objection Handling & Discovery Call Script',
    type: 'guide',
    category: 'Sales Enablement',
    description: 'Proven script answering common SME objections regarding cloud security, data backups, migration from Excel, and offline capability.',
    fileSize: '1.1 MB · PDF'
  },
  {
    id: 'res-6',
    title: 'Multi-Branch Inventory & Warehousing Implementation Guide',
    type: 'guide',
    category: 'ERP & Implementation',
    description: 'Step-by-step rollout manual for managing warehouse transfers, batch numbers, expiry dates, and centralized reorder levels.',
    fileSize: '2.7 MB · PDF'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is the MsmeBooks Partner Commission Program?',
    answer: 'The MsmeBooks Partner Commission Program is an official partnership initiative designed for accountants, bookkeepers, IT service providers, POS agents, software resellers, and business advisors across Africa and globally. Partners earn recurring commissions of 15% to 40% on eligible paid subscriptions by referring, implementing, or supporting MsmeBooks software with their business clients.'
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'Who can become an MsmeBooks partner?',
    answer: 'Eligibility spans 18 recognized partner categories, including certified accountants, accounting and audit firms, bookkeepers, tax advisory practices, POS merchant providers, IT firms, computer hardware retailers, ERP consultants, digital agencies, and independent business associates. Both individuals and registered organizations are eligible to apply.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Is partner registration free?',
    answer: 'Yes. Registering as an MsmeBooks partner is 100% free. There are no registration fees, mandatory licensing fees, or hidden starter costs to join the Bronze or Silver partner tiers. All partners receive access to onboarding resources, sales materials, and their dedicated partner portal.'
  },
  {
    id: 'faq-4',
    category: 'general',
    question: 'What are the four partnership levels?',
    answer: 'The program features four structured tiers: Bronze Partner (15% recurring commission), Silver Partner (20% recurring commission), Gold Partner (30% recurring commission), and Platinum Partner (40% recurring commission). Higher tiers unlock enhanced benefits such as co-marketing support, advanced implementation training, and dedicated account management.'
  },
  {
    id: 'faq-5',
    category: 'earnings',
    question: 'How much commission can Bronze, Silver, Gold, and Platinum Partners earn?',
    answer: 'Bronze Partners earn 15% recurring commission; Silver Partners earn 20%; Gold Partners earn 30%; and Platinum Partners earn 40%. For example, with 50 active paying customers subscribing at ₦10,000/month: Bronze earns ₦75,000/mo (₦900,000/yr); Silver earns ₦100,000/mo (₦1,200,000/yr); Gold earns ₦150,000/mo (₦1,800,000/yr); and Platinum earns ₦200,000/mo (₦2,400,000/yr).'
  },
  {
    id: 'faq-6',
    category: 'earnings',
    question: 'Are commissions recurring?',
    answer: 'Yes. Commissions are genuinely recurring. You continue receiving your commission percentage every billing cycle that your referred customer maintains an active, qualifying paid subscription with MsmeBooks, subject to applicable program terms and continued account eligibility.'
  },
  {
    id: 'faq-7',
    category: 'earnings',
    question: 'How long can partners earn recurring commissions?',
    answer: 'Partners earn recurring commissions for the active lifetime of the referred customer’s qualifying subscription, provided the partner maintains good standing under the MsmeBooks Partner Agreement and meets any periodic activity standards defined in the partner portal.'
  },
  {
    id: 'faq-8',
    category: 'earnings',
    question: 'Which MsmeBooks products qualify for commissions?',
    answer: 'Commissions apply to eligible core SaaS subscriptions, including MsmeBooks Accounting Pro, Point of Sale (POS) Retail, Multi-Location Inventory & Warehousing, and Payroll modules. Third-party add-ons, SMS credits, and subsidized merchant terminal hardware are excluded from commission calculations unless expressly indicated in a promotional campaign.'
  },
  {
    id: 'faq-9',
    category: 'earnings',
    question: 'How are commissions calculated?',
    answer: 'Commissions are calculated as: Monthly Commission = Eligible Monthly Subscription Revenue × Partner Commission Rate. For net subscription revenue, calculations deduct applicable governmental sales taxes (VAT), processing transaction gateway fees, or customer discounts.'
  },
  {
    id: 'faq-10',
    category: 'earnings',
    question: 'Are commissions based on gross or net subscription revenue?',
    answer: 'Commissions are calculated on net eligible subscription revenue—meaning the actual subscription fee received by MsmeBooks after deducting statutory sales taxes (such as VAT or consumption tax) and payment gateway processing fees.'
  },
  {
    id: 'faq-11',
    category: 'earnings',
    question: 'How are annual subscriptions handled?',
    answer: 'When a referred customer pays upfront for an annual subscription, commission is credited according to the approved annual billing and payout policy (either credited upon clearance or disbursed in structured installments throughout the annual term, protecting against customer refund adjustments).'
  },
  {
    id: 'faq-12',
    category: 'payouts',
    question: 'When do commissions become payable?',
    answer: 'Commissions are reconciled on a 30-day clearance cycle following successful payment confirmation to account for standard customer trial clearance and refund windows. Once approved, balances are available for payout on scheduled bi-weekly or monthly disbursement cycles (typically the 15th and end of each month).'
  },
  {
    id: 'faq-13',
    category: 'payouts',
    question: 'What is the minimum payout amount?',
    answer: 'The default minimum withdrawal threshold is ₦20,000 for Nigeria (or $50 USD / equivalent in local African currencies such as KES 6,500, GHS 600, or ZAR 900). Balances below the threshold securely roll over to the next payout cycle until the minimum is reached.'
  },
  {
    id: 'faq-14',
    category: 'payouts',
    question: 'Which countries can participate and receive international payments?',
    answer: 'Partners from all African countries (including Nigeria, Kenya, Ghana, South Africa, Rwanda, Uganda, Tanzania, Côte d’Ivoire) and international jurisdictions are eligible. Payouts are made via local automated bank clearing (NIP/ACH), direct international wire, or approved regional payment platforms (such as Flutterwave and Paystack).'
  },
  {
    id: 'faq-15',
    category: 'operations',
    question: 'How do I track my referrals?',
    answer: 'Every approved partner receives a unique referral tracking link and an alphanumeric partner identification code in their dashboard. When customers register via your link or enter your partner code during checkout or onboarding, our attribution engine permanently binds the customer to your partner profile.'
  },
  {
    id: 'faq-16',
    category: 'operations',
    question: 'What happens when a customer cancels a subscription, or if a refund occurs?',
    answer: 'If a customer terminates their subscription, recurring commissions cease for subsequent billing cycles. In the event of a customer refund or payment chargeback on a previously credited transaction, the corresponding commission amount is adjusted in the partner’s commission ledger.'
  },
  {
    id: 'faq-17',
    category: 'operations',
    question: 'Can a partner upgrade to another tier?',
    answer: 'Yes! Partners can progress from Bronze (15%) to Silver (20%), Gold (30%), and Platinum (40%) as their active customer volume and eligible revenue grow. An interactive Upgrade Eligibility Checker is provided in both this landing page and inside the partner portal. All tier advancements are reviewed and approved by the partner administration team.'
  },
  {
    id: 'faq-18',
    category: 'operations',
    question: 'Can accounting firms and IT resellers sell and implement MsmeBooks for customers?',
    answer: 'Absolutely. Partners can offer end-to-end implementation, chart of accounts customization, inventory barcode setup, and staff training to their clients. You can charge your clients directly for your professional implementation services while retaining your recurring SaaS commissions from MsmeBooks.'
  },
  {
    id: 'faq-19',
    category: 'operations',
    question: 'Can a company register multiple partner representatives?',
    answer: 'Yes. Mid-sized and enterprise partner accounts (Gold and Platinum) support multi-user role-based access, allowing firm directors to add junior consultants, sales reps, or accounting staff with dedicated sub-tracking codes under the parent organization.'
  },
  {
    id: 'faq-20',
    category: 'operations',
    question: 'Where can I read the full Partner Agreement?',
    answer: 'The complete MsmeBooks Partner Agreement, including detailed terms of attribution, prohibited practices, anti-spam guidelines, intellectual property usage, and commission disbursement policies, can be accessed directly via the "Partner Agreement" link in the navigation and footer of this page.'
  }
];
