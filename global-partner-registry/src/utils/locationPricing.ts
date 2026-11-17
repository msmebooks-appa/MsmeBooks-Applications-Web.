import { CurrencyCode } from './userLocation';
import { Partner } from '../types';

export interface GeographicPricingProfile {
  country: string;
  countryCode: string;
  currencyCode: CurrencyCode;
  regionName: string;
  parityMultiplier: number; // Purchasing power parity multiplier relative to standard international USD
  economicTier: 'Emerging Market SME' | 'Frontier Growth SME' | 'Established Commercial Hub' | 'Global Diaspora & Enterprise';
  description: string;
}

/**
 * Geographic Pricing Profiles for detected user countries
 * Calibrated for realistic local market SME economic viability
 */
export const GEOGRAPHIC_PRICING_PROFILES: Record<string, GeographicPricingProfile> = {
  Nigeria: {
    country: 'Nigeria',
    countryCode: 'NG',
    currencyCode: 'NGN',
    regionName: 'West Africa SME Hub',
    parityMultiplier: 0.70, // 30% local domestic purchasing power adjustment
    economicTier: 'Emerging Market SME',
    description: 'Domestic SME index applied. Tailored for Nigerian retail, wholesale & service businesses.',
  },
  Ghana: {
    country: 'Ghana',
    countryCode: 'GH',
    currencyCode: 'GHS',
    regionName: 'West Africa Commercial Belt',
    parityMultiplier: 0.75,
    economicTier: 'Emerging Market SME',
    description: 'Domestic commercial index applied for Greater Accra and regional Ghanaian enterprises.',
  },
  Kenya: {
    country: 'Kenya',
    countryCode: 'KE',
    currencyCode: 'KES',
    regionName: 'East Africa Tech Corridor',
    parityMultiplier: 0.75,
    economicTier: 'Frontier Growth SME',
    description: 'Silicon Savannah regional pricing index applied for Kenyan MSMEs and growing merchants.',
  },
  'South Africa': {
    country: 'South Africa',
    countryCode: 'ZA',
    currencyCode: 'ZAR',
    regionName: 'Southern Africa Industrial Hub',
    parityMultiplier: 0.85,
    economicTier: 'Established Commercial Hub',
    description: 'Southern African business index applied for Gauteng, Western Cape and national enterprises.',
  },
  Rwanda: {
    country: 'Rwanda',
    countryCode: 'RW',
    currencyCode: 'RWF',
    regionName: 'East Africa Innovation Hub',
    parityMultiplier: 0.72,
    economicTier: 'Emerging Market SME',
    description: 'Kigali commercial innovation index applied for streamlined business digital setup.',
  },
  Uganda: {
    country: 'Uganda',
    countryCode: 'UG',
    currencyCode: 'UGX',
    regionName: 'Central East Africa',
    parityMultiplier: 0.70,
    economicTier: 'Emerging Market SME',
    description: 'Ugandan domestic merchant index applied for local agribusiness and retail.',
  },
  Tanzania: {
    country: 'Tanzania',
    countryCode: 'TZ',
    currencyCode: 'TZS',
    regionName: 'Swahili Coast Trade Hub',
    parityMultiplier: 0.70,
    economicTier: 'Emerging Market SME',
    description: 'Dar es Salaam and coastal enterprise index applied for commercial traders.',
  },
  Cameroon: {
    country: 'Cameroon',
    countryCode: 'CM',
    currencyCode: 'XAF',
    regionName: 'Central Africa (CEMAC)',
    parityMultiplier: 0.72,
    economicTier: 'Emerging Market SME',
    description: 'CEMAC Franc zone regional parity index applied for Douala and Central African commerce.',
  },
  "Côte d'Ivoire": {
    country: "Côte d'Ivoire",
    countryCode: 'CI',
    currencyCode: 'XAF',
    regionName: 'West Africa Francophone Hub',
    parityMultiplier: 0.74,
    economicTier: 'Emerging Market SME',
    description: 'WAEMU regional parity index applied for Abidjan and coastal commerce.',
  },
  Senegal: {
    country: 'Senegal',
    countryCode: 'SN',
    currencyCode: 'XAF',
    regionName: 'Francophone West Africa',
    parityMultiplier: 0.72,
    economicTier: 'Emerging Market SME',
    description: 'Dakar trade gateway index applied for local service and supply firms.',
  },
  Egypt: {
    country: 'Egypt',
    countryCode: 'EG',
    currencyCode: 'EGP',
    regionName: 'North Africa & Nile Basin',
    parityMultiplier: 0.78,
    economicTier: 'Emerging Market SME',
    description: 'Egyptian pound domestic enterprise index applied for Cairo & Alexandria businesses.',
  },
  Morocco: {
    country: 'Morocco',
    countryCode: 'MA',
    currencyCode: 'EUR',
    regionName: 'Maghreb Commercial Gateway',
    parityMultiplier: 0.80,
    economicTier: 'Established Commercial Hub',
    description: 'Maghreb trade corridor index applied for Casablanca and national enterprises.',
  },
  'United Kingdom': {
    country: 'United Kingdom',
    countryCode: 'GB',
    currencyCode: 'GBP',
    regionName: 'UK & European Diaspora Gateway',
    parityMultiplier: 1.05,
    economicTier: 'Global Diaspora & Enterprise',
    description: 'Cross-border UK trade and diaspora compliance advisory rate index.',
  },
  'United States': {
    country: 'United States',
    countryCode: 'US',
    currencyCode: 'USD',
    regionName: 'North American Enterprise Tier',
    parityMultiplier: 1.10,
    economicTier: 'Global Diaspora & Enterprise',
    description: 'Standard North American transatlantic enterprise advisory index.',
  },
  Canada: {
    country: 'Canada',
    countryCode: 'CA',
    currencyCode: 'CAD',
    regionName: 'North American Commercial Gateway',
    parityMultiplier: 1.05,
    economicTier: 'Global Diaspora & Enterprise',
    description: 'Canadian transatlantic trade and diaspora advisory rate index.',
  },
  UAE: {
    country: 'UAE',
    countryCode: 'AE',
    currencyCode: 'AED',
    regionName: 'Middle East & Gulf Gateway',
    parityMultiplier: 1.05,
    economicTier: 'Global Diaspora & Enterprise',
    description: 'Gulf-Africa trade and holding company advisory rate index.',
  },
  India: {
    country: 'India',
    countryCode: 'IN',
    currencyCode: 'INR',
    regionName: 'South Asia Trade Corridor',
    parityMultiplier: 0.68,
    economicTier: 'Emerging Market SME',
    description: 'Indo-African cross-border supply chain advisory rate index.',
  },
  Australia: {
    country: 'Australia',
    countryCode: 'AU',
    currencyCode: 'AUD',
    regionName: 'Oceania Commercial Tier',
    parityMultiplier: 1.05,
    economicTier: 'Global Diaspora & Enterprise',
    description: 'Australasia cross-border mining, agriculture & trade advisory index.',
  },
};

/**
 * Resolve geographic profile for a country name
 */
export function getGeographicPricingProfile(countryName?: string): GeographicPricingProfile {
  if (!countryName) {
    return (
      GEOGRAPHIC_PRICING_PROFILES['Nigeria'] || {
        country: 'Global',
        countryCode: 'US',
        currencyCode: 'USD',
        regionName: 'Standard International',
        parityMultiplier: 1.0,
        economicTier: 'Global Diaspora & Enterprise',
        description: 'Standard international baseline pricing.',
      }
    );
  }

  const clean = countryName.trim().toLowerCase();
  for (const [key, profile] of Object.entries(GEOGRAPHIC_PRICING_PROFILES)) {
    if (key.toLowerCase() === clean) return profile;
  }

  // Substring matching
  if (clean.includes('nigeria')) return GEOGRAPHIC_PRICING_PROFILES['Nigeria'];
  if (clean.includes('kenya')) return GEOGRAPHIC_PRICING_PROFILES['Kenya'];
  if (clean.includes('ghana')) return GEOGRAPHIC_PRICING_PROFILES['Ghana'];
  if (clean.includes('south africa')) return GEOGRAPHIC_PRICING_PROFILES['South Africa'];
  if (clean.includes('rwanda')) return GEOGRAPHIC_PRICING_PROFILES['Rwanda'];
  if (clean.includes('uganda')) return GEOGRAPHIC_PRICING_PROFILES['Uganda'];
  if (clean.includes('tanzania')) return GEOGRAPHIC_PRICING_PROFILES['Tanzania'];
  if (clean.includes('cameroon') || clean.includes('côte') || clean.includes('senegal')) {
    return GEOGRAPHIC_PRICING_PROFILES['Cameroon'];
  }
  if (clean.includes('egypt')) return GEOGRAPHIC_PRICING_PROFILES['Egypt'];
  if (clean.includes('morocco')) return GEOGRAPHIC_PRICING_PROFILES['Morocco'];
  if (clean.includes('kingdom') || clean.includes('britain') || clean.includes('uk')) {
    return GEOGRAPHIC_PRICING_PROFILES['United Kingdom'];
  }
  if (clean.includes('united states') || clean.includes('usa') || clean.includes('america')) {
    return GEOGRAPHIC_PRICING_PROFILES['United States'];
  }
  if (clean.includes('canada')) return GEOGRAPHIC_PRICING_PROFILES['Canada'];
  if (clean.includes('emirates') || clean.includes('uae') || clean.includes('dubai')) {
    return GEOGRAPHIC_PRICING_PROFILES['UAE'];
  }
  if (clean.includes('india')) return GEOGRAPHIC_PRICING_PROFILES['India'];
  if (clean.includes('australia')) return GEOGRAPHIC_PRICING_PROFILES['Australia'];

  return {
    country: countryName,
    countryCode: 'GL',
    currencyCode: 'USD',
    regionName: 'Global International Hub',
    parityMultiplier: 1.0,
    economicTier: 'Global Diaspora & Enterprise',
    description: `Standard international rates converted for ${countryName}.`,
  };
}

/**
 * Master service catalog with baseline USD pricing, deliverable scopes, and category
 */
export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: 'Setup & Migration' | 'Hardware & Infrastructure' | 'Compliance & Tax' | 'Advisory & Growth';
  baseUSD: number;
  unit: string;
  deliverables: string;
  popular?: boolean;
}

export const MASTER_SERVICES_CATALOG: Record<string, ServiceCatalogItem> = {
  Implementation: {
    id: 'implementation',
    name: 'Implementation',
    category: 'Setup & Migration',
    baseUSD: 600,
    unit: 'Turnkey Project',
    deliverables: 'Full MsmeBooks system setup, custom chart of accounts, user role access, and verification sign-off.',
    popular: true,
  },
  Training: {
    id: 'training',
    name: 'Training',
    category: 'Advisory & Growth',
    baseUSD: 240,
    unit: 'Per Cohort (up to 10 staff)',
    deliverables: 'Interactive on-site or remote staff training, handbook documentation, and certification assessments.',
    popular: true,
  },
  'Accounting Setup': {
    id: 'accounting-setup',
    name: 'Accounting Setup',
    category: 'Setup & Migration',
    baseUSD: 380,
    unit: 'One-time Setup',
    deliverables: 'General ledger configuration, accounts payable/receivable opening balances, and fiscal reporting.',
    popular: true,
  },
  'POS Setup': {
    id: 'pos-setup',
    name: 'POS Setup',
    category: 'Hardware & Infrastructure',
    baseUSD: 320,
    unit: 'Per Retail Location',
    deliverables: 'Offline-first POS synchronization, receipt layout branding, cashier permissions, and sales registers.',
    popular: true,
  },
  'Inventory Setup': {
    id: 'inventory-setup',
    name: 'Inventory Setup',
    category: 'Setup & Migration',
    baseUSD: 290,
    unit: 'Up to 2,500 SKUs',
    deliverables: 'Bulk item import, barcode categorization, minimum stock alerts, and automated FIFO valuation.',
    popular: false,
  },
  'Business Consulting': {
    id: 'business-consulting',
    name: 'Business Consulting',
    category: 'Advisory & Growth',
    baseUSD: 480,
    unit: 'Per Engagement / Audit',
    deliverables: 'Operational cashflow diagnosis, gross margin optimization, and financial management playbook.',
    popular: true,
  },
  'Data Migration': {
    id: 'data-migration',
    name: 'Data Migration',
    category: 'Setup & Migration',
    baseUSD: 420,
    unit: 'Historical Data Transfer',
    deliverables: 'Extraction and clean import from Excel, legacy desktop software, or prior ERP with reconciliation.',
    popular: false,
  },
  'Hardware Supply & Maintenance': {
    id: 'hardware-supply',
    name: 'Hardware Supply & Maintenance',
    category: 'Hardware & Infrastructure',
    baseUSD: 520,
    unit: 'Per Device Bundle',
    deliverables: 'Thermal receipt printers, Bluetooth barcode scanners, cash drawers, and 12-month hardware warranty.',
    popular: false,
  },
  Configuration: {
    id: 'configuration',
    name: 'Configuration',
    category: 'Setup & Migration',
    baseUSD: 260,
    unit: 'Custom Configuration',
    deliverables: 'Invoice design, payment gateway callbacks, automated SMS debtor reminders, and localized tax rules.',
    popular: false,
  },
  Integration: {
    id: 'integration',
    name: 'Integration',
    category: 'Setup & Migration',
    baseUSD: 490,
    unit: 'API / Bank Feed Integration',
    deliverables: 'Commercial bank statement auto-reconciliation, Paystack/Flutterwave/M-Pesa sync, and Shopify connect.',
    popular: true,
  },
  'Tax Support': {
    id: 'tax-support',
    name: 'Tax Support',
    category: 'Compliance & Tax',
    baseUSD: 360,
    unit: 'Statutory Filing Setup',
    deliverables: 'Local tax board VAT, withholding tax (WHT) returns setup, automated audit trail, and e-invoicing filing.',
    popular: true,
  },
  'Payroll Setup': {
    id: 'payroll-setup',
    name: 'Payroll Setup',
    category: 'Compliance & Tax',
    baseUSD: 310,
    unit: 'Monthly Payroll System',
    deliverables: 'Automated PAYE calculations, pension deductions, direct bank upload schedules, and digital payslips.',
    popular: false,
  },
  'Multi-Branch Setup': {
    id: 'multi-branch-setup',
    name: 'Multi-Branch Setup',
    category: 'Hardware & Infrastructure',
    baseUSD: 680,
    unit: 'Centralized Multi-Location',
    deliverables: 'Inter-branch stock transfers, consolidated head-office P&L, warehouse management, and centralized audits.',
    popular: true,
  },
};

export interface PartnerLocalizedServicePrice {
  serviceName: string;
  category: string;
  deliverables: string;
  unit: string;
  popular: boolean;
  baseUSD: number;
  adjustedUSD: number;
  localAmount: number;
  formattedPrice: string;
  formattedUSDRef: string;
  isDomesticPartner: boolean;
  parityAdjustmentPercent: number; // e.g. -30%
}

/**
 * Calculates a localized, location-adjusted price for any partner service
 */
export function calculateLocalizedServicePrice(
  serviceName: string,
  partner: Partner,
  detectedCountry: string,
  rateAgainstUSD: number,
  currencySymbol: string,
  currencyCode: CurrencyCode,
  currencyLocale = 'en-US',
  useParity = true
): PartnerLocalizedServicePrice {
  const catalog = MASTER_SERVICES_CATALOG[serviceName] || {
    id: serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: serviceName,
    category: 'Setup & Migration' as const,
    baseUSD: 350,
    unit: 'Service Package',
    deliverables: `Tailored ${serviceName} delivery by verified MsmeBooks consultants.`,
    popular: false,
  };

  const profile = getGeographicPricingProfile(detectedCountry);
  const isDomestic = partner.country.toLowerCase() === profile.country.toLowerCase();

  // Tier multiplier based on partner tier
  const tierFactor =
    partner.level === 'Platinum' ? 1.2 : partner.level === 'Gold' ? 1.05 : partner.level === 'Silver' ? 0.95 : 0.85;

  const parityMultiplier = useParity ? profile.parityMultiplier : 1.0;
  // 5% domestic efficiency bonus if partner is physically in the user's jurisdiction
  const domesticBonus = isDomestic ? 0.95 : 1.0;

  const adjustedUSD = Math.round(catalog.baseUSD * tierFactor * parityMultiplier * domesticBonus);
  const localAmount = Math.round(adjustedUSD * rateAgainstUSD);

  const formattedNumber = new Intl.NumberFormat(currencyLocale, {
    maximumFractionDigits: 0,
  }).format(localAmount);

  const parityAdjustmentPercent = Math.round((parityMultiplier * domesticBonus - 1) * 100);

  return {
    serviceName: catalog.name,
    category: catalog.category,
    deliverables: catalog.deliverables,
    unit: catalog.unit,
    popular: !!catalog.popular,
    baseUSD: catalog.baseUSD,
    adjustedUSD,
    localAmount,
    formattedPrice: `${currencySymbol}${formattedNumber}`,
    formattedUSDRef: `≈ $${adjustedUSD} USD`,
    isDomesticPartner: isDomestic,
    parityAdjustmentPercent,
  };
}

/**
 * Calculates localized consultation hourly rate
 */
export function calculateLocalizedConsultationRate(
  partner: Partner,
  detectedCountry: string,
  rateAgainstUSD: number,
  currencySymbol: string,
  currencyLocale = 'en-US',
  useParity = true
): {
  baseUSD: number;
  adjustedUSD: number;
  localHourlyAmount: number;
  formattedRate: string;
  formattedUSDRef: string;
  isDomestic: boolean;
  geographicRegion: string;
} {
  const profile = getGeographicPricingProfile(detectedCountry);
  const isDomestic = partner.country.toLowerCase() === profile.country.toLowerCase();

  // Baseline hourly rate in USD
  let baseUSD = 40;
  if (typeof partner.consultationRateUSD === 'number' && partner.consultationRateUSD > 0) {
    baseUSD = partner.consultationRateUSD;
  } else if (typeof partner.hourlyRateUSD === 'number' && partner.hourlyRateUSD > 0) {
    baseUSD = partner.hourlyRateUSD;
  } else {
    switch (partner.level) {
      case 'Platinum':
        baseUSD = 120;
        break;
      case 'Gold':
        baseUSD = 85;
        break;
      case 'Silver':
        baseUSD = 60;
        break;
      case 'Bronze':
      default:
        baseUSD = 40;
        break;
    }
  }

  const parityMultiplier = useParity ? profile.parityMultiplier : 1.0;
  const domesticBonus = isDomestic ? 0.95 : 1.0;

  const adjustedUSD = Math.max(25, Math.round(baseUSD * parityMultiplier * domesticBonus));
  const localHourlyAmount = Math.round(adjustedUSD * rateAgainstUSD);

  const formattedNumber = new Intl.NumberFormat(currencyLocale, {
    maximumFractionDigits: 0,
  }).format(localHourlyAmount);

  return {
    baseUSD,
    adjustedUSD,
    localHourlyAmount,
    formattedRate: `${currencySymbol}${formattedNumber}/hr`,
    formattedUSDRef: `≈ $${adjustedUSD}/hr USD`,
    isDomestic,
    geographicRegion: profile.regionName,
  };
}
