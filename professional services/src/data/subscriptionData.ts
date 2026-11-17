import { SubscriptionPlan, ExtraModule } from '../types/payment';

export const VAT_RATE_PERCENT = 7.5; // Statutory 7.5% Exclusive Value Added Tax

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'partner-solo',
    name: 'Verified Professional & Solo Practice',
    tagline: 'Ideal for independent CPAs, Chartered Accountants, Tax Practitioners, and Financial Advisors.',
    priceMonthlyNGN: 35000,
    priceAnnualMonthlyNGN: 28000, // 20% discount on yearly
    tier: 'Solo Professional',
    targetAudience: 'Independent CPAs, ICAN / ACCA / SAICA Members & Solo Tax Advisers',
    userSeats: '1 Certified Practitioner Profile',
    countryCoverage: '1 Primary Country Directory (e.g. Nigeria, Ghana, Kenya, or South Africa)',
    directoryBadges: ['Verified Professional', 'Direct Booking Desk', 'National Directory'],
    features: [
      'Verified Practice Profile in 1 African Country Directory of choice',
      'Official Credential Verification Seal (ICAN, ACCA, SAICA, CITN, CPA)',
      'Direct Client Booking Desk with instant calendar appointment synchronization',
      'Showcase up to 5 Core Practice Services with custom rate cards & fixed packages',
      'Direct WhatsApp & Instant Client Enquiry Dispatching',
      'Client Review Engine with Verified 5-Star Rating Collection',
      'Standard Listing in Regional Firm & Expert Marketplace',
      'Bank-grade SSL security with automated client payment disbursement',
    ],
    recommendedModules: [],
  },
  {
    id: 'partner-firm',
    name: 'Chartered Firm & Multi-Partner Practice Showcase',
    tagline: 'Best for boutique accounting firms, audit practices, and tax consultancies seeking regional client acquisition.',
    priceMonthlyNGN: 75000,
    priceAnnualMonthlyNGN: 60000, // 20% discount on yearly
    popular: true,
    tier: 'Chartered Firm',
    targetAudience: 'Boutique & Mid-Sized Accounting, Audit & Advisory Firms',
    userSeats: 'Up to 8 Managing Partners & Senior Associates',
    countryCoverage: 'Up to 5 African / Regional Countries (West, East, or Southern Africa)',
    directoryBadges: ['Top Rated Partner', 'Fastest Response', 'Multi-Partner Roster', 'Regional Reach'],
    features: [
      'Featured Multi-Country Directory Showcase across up to 5 African Nations',
      'Visual "Top Rated" & "Fastest Response" badges on firm directory cards',
      'Top 3 Search Placement priority in city, regional & national directories',
      'Multi-Partner Roster: List up to 8 Managing Partners with personal credentials & bios',
      'Publish Unlimited Service Packages, Retainers & Custom Fixed-Price Quotes',
      'Instant Payment Acceptance via Regional Gateways (Paystack, M-Pesa, Ozow, CinetPay)',
      'Priority Lead Allocation from MsmeBooks Smart AI Service Recommendation Engine',
      'Firm Performance Dashboard: Track Client Inquiries, Views & Revenue Conversion',
      'Custom Firm Branding, Logo, Physical Office Address & Google Map location pins',
    ],
    recommendedModules: [],
  },
  {
    id: 'partner-global',
    name: 'Pan-African & Global Enterprise Advisory Network',
    tagline: 'The ultimate showcase tier for international audit networks, legal-accounting consortia, and cross-border advisory groups.',
    priceMonthlyNGN: 185000,
    priceAnnualMonthlyNGN: 148000, // 20% discount on yearly
    tier: 'Pan-African & Global',
    targetAudience: 'International Advisory Networks, Big-10 Member Firms & Cross-Border Consortia',
    userSeats: 'Unlimited Partners, Practice Offices & Cross-Border Teams',
    countryCoverage: 'All 54 African Countries + UK, USA, Europe & UAE Global Directories',
    directoryBadges: ['Pan-African Network', 'Global Advisory Council', 'VIP Lead Allocation', 'Homepage Spotlight'],
    features: [
      'Full Pan-African & Global Visibility across all 54 African Nations + Global Centers (UK, USA, Europe, UAE)',
      'Homepage Featured Partner Spotlight & Universal Directory Top Header Banner',
      'Unlimited Multi-Country Branch Listings & Cross-Border Service Portfolios',
      'VIP Enterprise Tender & Inbound Cross-Border Client Routing',
      'Dedicated Institutional Partner Relationship Director & Account Manager',
      'Multi-Currency International Fee Billing & Client Escrow Clearing (USD, EUR, GBP, NGN, KES, ZAR)',
      'Quarterly Co-Branded Industry Whitepapers, Case Studies & Thought Leadership Webinars',
      'Custom API Webhooks for Firm CRM & Practice Management Systems',
      '24/7 Priority Concierge Support & Verified Global Network Seal',
    ],
    recommendedModules: [],
  },
];

export const EXTRA_EXTEND_MODULES: ExtraModule[] = [
  {
    id: 'mod-multi-branch',
    name: 'Multi-Branch & Central Warehouse Network Hub',
    tagline: 'Centralize inventory reorder levels, stock allocations, and warehouse dispatching.',
    description: 'Enables real-time stock transfers between outlets, unified supplier purchase orders, and inter-branch inventory tracking with zero manual spreadsheets.',
    priceMonthlyNGN: 25000,
    badge: 'Popular for Retail',
    category: 'Operations',
    icon: 'Building2',
    includedFeatures: [
      'Instant inter-branch stock requisition & approval',
      'Barcode tracking across unlimited warehouse bins',
      'Centralized goods received notes (GRN)',
      'Warehouse damage & shrinkage reconciliation reports',
    ],
  },
  {
    id: 'mod-payroll-pension',
    name: 'Automated Payroll & Pension Statutory Remittance',
    tagline: 'Compliant monthly payroll processing with automatic PAYE, PenCom, and NHF deduction schedules.',
    description: 'Generates compliant payslips, bank batch transfer payment files, and tax schedules ready for direct upload to state revenue portals (LIRS, KRA, GRA, SARS).',
    priceMonthlyNGN: 20000,
    badge: 'Statutory Essential',
    category: 'Compliance',
    icon: 'Users',
    includedFeatures: [
      'Automated PAYE, Pension (10% + 8%), and NHF formulas',
      'One-click WhatsApp & email payslip dispatcher',
      'Direct NIP / EFT batch payment instruction file',
      'Statutory annual returns and Form H1 filing summary',
    ],
  },
  {
    id: 'mod-einvoicing',
    name: 'Fiscal E-Invoicing & Revenue Authority Sync',
    tagline: 'Full integration with NRS, KRA eTIMS, GRA E-VAT, and ZRA Smart Invoice standards.',
    description: 'Generates tamper-proof QR code fiscal signatures and synchronizes sales transactions directly with government tax compliance servers in real time.',
    priceMonthlyNGN: 22000,
    badge: 'Govt Compliant',
    category: 'Compliance',
    icon: 'ShieldCheck',
    includedFeatures: [
      'Automated QR Code fiscal cryptographic validation',
      'Statutory e-TIMS / E-VAT real-time JSON webhooks',
      'Offline fiscal queuing with auto-retransmit',
      'Audit-proof electronic invoice register',
    ],
  },
  {
    id: 'mod-offline-pos',
    name: 'Offline Barcode POS Terminal Engine',
    tagline: 'Never lose a sale during internet blackouts or network downtime.',
    description: 'Cashiers can scan barcodes, collect cash/card payments, and print customer receipts even when offline; all data syncs automatically once reconnected.',
    priceMonthlyNGN: 18000,
    badge: 'Zero Downtime',
    category: 'Retail',
    icon: 'Zap',
    includedFeatures: [
      '100% offline cashier scanning & receipt printing',
      'Conflict-free cloud reconciliation upon reconnection',
      'Fast keyboard shortcuts & barcode scale integration',
      'Drawer kickout and dual-screen customer display sync',
    ],
  },
  {
    id: 'mod-hotel-kot',
    name: 'Hospitality PMS & Kitchen Order Ticket (KOT) Engine',
    tagline: 'Room reservations, table management, split checks, and kitchen display routing.',
    description: 'Built specifically for hotels, guest houses, lounges, and busy restaurants needing room billing, housekeeping status, table layouts, and kitchen order tickets.',
    priceMonthlyNGN: 30000,
    badge: 'Hospitality',
    category: 'Operations',
    icon: 'Coins',
    includedFeatures: [
      'Room reservation grid with key card sync',
      'Multi-kitchen thermal printer routing (Bar, Grill, Main Kitchen)',
      'Guest folio billing (consolidate dining into hotel room bill)',
      'Food recipe ingredient yield & portion costing',
    ],
  },
  {
    id: 'mod-whatsapp-dispatch',
    name: 'WhatsApp Automated Invoicing & Statement Dispatcher',
    tagline: 'Send official invoices, receipts, and overdue alerts directly to customer WhatsApp.',
    description: 'Customers receive their branded PDF invoices with instant payment links directly in WhatsApp, speeding up cash collection cycles by up to 65%.',
    priceMonthlyNGN: 15000,
    badge: 'High Conversion',
    category: 'Communication',
    icon: 'MessageCircle',
    includedFeatures: [
      'Verified WhatsApp business messaging gateway',
      'One-click "Pay Now" deep link embedded in WhatsApp',
      'Automated payment acknowledgement & PDF tax receipt',
      'Scheduled weekly/monthly customer account statements',
    ],
  },
  {
    id: 'mod-forensic-radar',
    name: 'Forensic Audit & Anti-Fraud Anomaly Radar',
    tagline: 'AI-assisted internal control monitoring to stop cashier leakage and unauthorized voids.',
    description: 'Continuously scans journal adjustments, after-hours sales, deleted line items, and suspicious discount patterns, alerting managers instantly via SMS and email.',
    priceMonthlyNGN: 28000,
    badge: 'Loss Prevention',
    category: 'Finance',
    icon: 'FileCheck',
    includedFeatures: [
      'Real-time alert on cashier voids exceeding threshold',
      'Audit tracking for backdated or edited invoices',
      'Margin leakage & price override deviation alerts',
      'Executive fraud prevention dashboard',
    ],
  },
];

export interface PromoCodeDefinition {
  code: string;
  discountPercent: number;
  description: string;
  minAmountNGN?: number;
}

export const PROMO_CODES: PromoCodeDefinition[] = [
  {
    code: 'MSMEGROWTH20',
    discountPercent: 20,
    description: '20% Special SME Launch Discount',
  },
  {
    code: 'WESTAFRICA15',
    discountPercent: 15,
    description: '15% Regional Business Expansion Discount',
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    description: '10% New Subscriber Welcome Discount',
  },
  {
    code: 'VATFREE',
    discountPercent: 7.5,
    description: '7.5% Tax Offset Credit Discount',
  },
];

export function calculateSubscriptionTotals(
  plan: SubscriptionPlan,
  billingCycle: 'Monthly' | 'Annual',
  selectedModuleIds: string[] = [],
  appliedPromo?: PromoCodeDefinition | null
) {
  // Plan price: if annual, 12 months @ priceAnnualMonthlyNGN
  const monthsMultiplier = billingCycle === 'Annual' ? 12 : 1;
  const baseMonthly = billingCycle === 'Annual' ? plan.priceAnnualMonthlyNGN : plan.priceMonthlyNGN;
  const planTotalNGN = baseMonthly * monthsMultiplier;

  // Selected extra modules
  const selectedModules = EXTRA_EXTEND_MODULES.filter(m => selectedModuleIds.includes(m.id));
  const modulesMonthlyTotalNGN = selectedModules.reduce((acc, m) => acc + m.priceMonthlyNGN, 0);
  // Extra modules also get 20% off if on annual cycle
  const modulesEffectiveMonthly = billingCycle === 'Annual' ? Math.round(modulesMonthlyTotalNGN * 0.8) : modulesMonthlyTotalNGN;
  const modulesTotalNGN = modulesEffectiveMonthly * monthsMultiplier;

  const subtotalBeforeDiscountNGN = planTotalNGN + modulesTotalNGN;

  // Promo code discount
  let discountAmountNGN = 0;
  if (appliedPromo) {
    discountAmountNGN = Math.round((subtotalBeforeDiscountNGN * appliedPromo.discountPercent) / 100);
  }

  const subtotalAfterDiscountNGN = Math.max(0, subtotalBeforeDiscountNGN - discountAmountNGN);

  // 7.5% Exclusive VAT
  const vatAmountNGN = Math.round(subtotalAfterDiscountNGN * (VAT_RATE_PERCENT / 100));

  // Grand total
  const totalAmountPaidNGN = subtotalAfterDiscountNGN + vatAmountNGN;

  return {
    planTotalNGN,
    modulesTotalNGN,
    selectedModules,
    subtotalBeforeDiscountNGN,
    discountAmountNGN,
    discountPercent: appliedPromo ? appliedPromo.discountPercent : 0,
    subtotalAfterDiscountNGN,
    vatRatePercent: VAT_RATE_PERCENT,
    vatAmountNGN,
    totalAmountPaidNGN,
  };
}
