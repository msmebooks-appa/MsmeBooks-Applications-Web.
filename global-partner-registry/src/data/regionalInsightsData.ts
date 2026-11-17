/**
 * Anonymized regional directory search trends and insight metrics.
 * Provides top 3 requested services, search growth %, top search query, and SME industry focus per country.
 */

export interface RegionalServiceInsight {
  service: string;
  sharePercentage: number;
  monthlySearches: number;
  growthRate: string;
  category: string;
}

export interface CountryRegionalInsight {
  country: string;
  countryCode: string;
  countryFlag: string;
  primaryHub: string;
  totalMonthlySearches: number;
  quarterlyGrowth: string;
  primaryIndustryNeed: string;
  topRequestedServices: [RegionalServiceInsight, RegionalServiceInsight, RegionalServiceInsight];
  keyMarketDriver: string;
}

export const REGIONAL_INSIGHTS_DATA: Record<string, CountryRegionalInsight> = {
  'Nigeria': {
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    primaryHub: 'Lagos & Abuja',
    totalMonthlySearches: 48200,
    quarterlyGrowth: '+34%',
    primaryIndustryNeed: 'Supermarkets, Retail & FMCG',
    keyMarketDriver: 'FIRS e-invoicing compliance & retail multi-till POS demand',
    topRequestedServices: [
      {
        service: 'Multi-Branch POS Setup',
        sharePercentage: 42,
        monthlySearches: 20240,
        growthRate: '+38%',
        category: 'POS & Hardware',
      },
      {
        service: 'Inventory & Barcode Sync',
        sharePercentage: 31,
        monthlySearches: 14940,
        growthRate: '+29%',
        category: 'Stock Management',
      },
      {
        service: 'FIRS / State Tax Compliance',
        sharePercentage: 27,
        monthlySearches: 13020,
        growthRate: '+45%',
        category: 'Tax & Compliance',
      },
    ],
  },
  'Kenya': {
    country: 'Kenya',
    countryCode: 'KE',
    countryFlag: '🇰🇪',
    primaryHub: 'Nairobi & Mombasa',
    totalMonthlySearches: 32600,
    quarterlyGrowth: '+28%',
    primaryIndustryNeed: 'Hospitality, Restaurants & Agribusiness',
    keyMarketDriver: 'KRA eTIMS integration and instant M-Pesa automated bookkeeping',
    topRequestedServices: [
      {
        service: 'M-Pesa & Mobile Money Till Sync',
        sharePercentage: 44,
        monthlySearches: 14340,
        growthRate: '+41%',
        category: 'Fintech Integration',
      },
      {
        service: 'KRA eTIMS Tax Support',
        sharePercentage: 33,
        monthlySearches: 10750,
        growthRate: '+52%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Hospitality & Café POS',
        sharePercentage: 23,
        monthlySearches: 7510,
        growthRate: '+22%',
        category: 'POS & Hardware',
      },
    ],
  },
  'Ghana': {
    country: 'Ghana',
    countryCode: 'GH',
    countryFlag: '🇬🇭',
    primaryHub: 'Accra & Kumasi',
    totalMonthlySearches: 19400,
    quarterlyGrowth: '+24%',
    primaryIndustryNeed: 'Wholesale, Hardware & Distribution',
    keyMarketDriver: 'GRA E-VAT withholding tax sync & legacy ledger data migration',
    topRequestedServices: [
      {
        service: 'Data Migration from Legacy Systems',
        sharePercentage: 39,
        monthlySearches: 7560,
        growthRate: '+31%',
        category: 'Data Migration',
      },
      {
        service: 'GRA VAT & Tax Withholding Setup',
        sharePercentage: 35,
        monthlySearches: 6790,
        growthRate: '+27%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Wholesale Route Order Tracking',
        sharePercentage: 26,
        monthlySearches: 5050,
        growthRate: '+19%',
        category: 'Supply Chain',
      },
    ],
  },
  'South Africa': {
    country: 'South Africa',
    countryCode: 'ZA',
    countryFlag: '🇿🇦',
    primaryHub: 'Johannesburg & Cape Town',
    totalMonthlySearches: 27500,
    quarterlyGrowth: '+21%',
    primaryIndustryNeed: 'Logistics, Warehousing & Professional Services',
    keyMarketDriver: 'Cross-border multi-currency ledgers & SARS corporate payroll filings',
    topRequestedServices: [
      {
        service: 'Multi-Currency Financial Consulting',
        sharePercentage: 41,
        monthlySearches: 11275,
        growthRate: '+26%',
        category: 'Accounting Advisory',
      },
      {
        service: 'Cross-Border Supply Chain Sync',
        sharePercentage: 32,
        monthlySearches: 8800,
        growthRate: '+18%',
        category: 'ERP Consulting',
      },
      {
        service: 'Automated Debtor & Invoicing Workflows',
        sharePercentage: 27,
        monthlySearches: 7425,
        growthRate: '+23%',
        category: 'Automation',
      },
    ],
  },
  'Uganda': {
    country: 'Uganda',
    countryCode: 'UG',
    countryFlag: '🇺🇬',
    primaryHub: 'Kampala & Jinja',
    totalMonthlySearches: 11200,
    quarterlyGrowth: '+30%',
    primaryIndustryNeed: 'Pharmacies, Hardware & Retail',
    keyMarketDriver: 'URA EFRIS e-invoicing compliance & mobile airtel/MTN integrations',
    topRequestedServices: [
      {
        service: 'URA EFRIS Compliance Setup',
        sharePercentage: 45,
        monthlySearches: 5040,
        growthRate: '+48%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Pharmacy Batch & Expiry Tracking',
        sharePercentage: 31,
        monthlySearches: 3472,
        growthRate: '+25%',
        category: 'Inventory',
      },
      {
        service: 'Retail POS Hardware Installation',
        sharePercentage: 24,
        monthlySearches: 2688,
        growthRate: '+19%',
        category: 'POS & Hardware',
      },
    ],
  },
  'Tanzania': {
    country: 'Tanzania',
    countryCode: 'TZ',
    countryFlag: '🇹🇿',
    primaryHub: 'Dar es Salaam & Arusha',
    totalMonthlySearches: 10400,
    quarterlyGrowth: '+26%',
    primaryIndustryNeed: 'Tourism, Safari Operators & Transit Logistics',
    keyMarketDriver: 'TRA VFD electronic fiscal device linking & foreign currency tour billing',
    topRequestedServices: [
      {
        service: 'TRA VFD Fiscal Sync',
        sharePercentage: 43,
        monthlySearches: 4472,
        growthRate: '+37%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Multi-Currency Booking Ledgers',
        sharePercentage: 33,
        monthlySearches: 3432,
        growthRate: '+28%',
        category: 'Accounting Setup',
      },
      {
        service: 'Multi-Branch Inventory Transfers',
        sharePercentage: 24,
        monthlySearches: 2496,
        growthRate: '+15%',
        category: 'Stock Management',
      },
    ],
  },
  'Rwanda': {
    country: 'Rwanda',
    countryCode: 'RW',
    countryFlag: '🇷🇼',
    primaryHub: 'Kigali Tech Corridor',
    totalMonthlySearches: 8900,
    quarterlyGrowth: '+36%',
    primaryIndustryNeed: 'Tech Startups, Cafés & Boutique Retail',
    keyMarketDriver: 'RRA EBM v2 cloud fiscalization & cashless POS payments',
    topRequestedServices: [
      {
        service: 'Cloud Accounting & API Integration',
        sharePercentage: 46,
        monthlySearches: 4094,
        growthRate: '+42%',
        category: 'Cloud Architecture',
      },
      {
        service: 'RRA EBM v2 Fiscalization',
        sharePercentage: 32,
        monthlySearches: 2848,
        growthRate: '+39%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Cashless Card & MoMo POS Setup',
        sharePercentage: 22,
        monthlySearches: 1958,
        growthRate: '+24%',
        category: 'POS & Hardware',
      },
    ],
  },
  'Cameroon': {
    country: 'Cameroon',
    countryCode: 'CM',
    countryFlag: '🇨🇲',
    primaryHub: 'Douala & Yaoundé',
    totalMonthlySearches: 7600,
    quarterlyGrowth: '+22%',
    primaryIndustryNeed: 'Import/Export, Distribution & FMCG',
    keyMarketDriver: 'CEMAC customs landed cost calculations & OHADA standard reporting',
    topRequestedServices: [
      {
        service: 'OHADA Standard Accounting Setup',
        sharePercentage: 42,
        monthlySearches: 3192,
        growthRate: '+29%',
        category: 'Compliance',
      },
      {
        service: 'Landed Cost & Import Batch Tracking',
        sharePercentage: 34,
        monthlySearches: 2584,
        growthRate: '+20%',
        category: 'Inventory',
      },
      {
        service: 'Bilingual (FR/EN) Cashier Training',
        sharePercentage: 24,
        monthlySearches: 1824,
        growthRate: '+18%',
        category: 'Training',
      },
    ],
  },
  'Côte d\'Ivoire': {
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    countryFlag: '🇨🇮',
    primaryHub: 'Abidjan Commercial Gateway',
    totalMonthlySearches: 9300,
    quarterlyGrowth: '+31%',
    primaryIndustryNeed: 'Agro-commodities, Bakeries & Retail Chains',
    keyMarketDriver: 'DGI e-filing modernization & automated Wave/Orange Money reconciliations',
    topRequestedServices: [
      {
        service: 'Wave & Orange Money Reconciliations',
        sharePercentage: 44,
        monthlySearches: 4092,
        growthRate: '+47%',
        category: 'Fintech Integration',
      },
      {
        service: 'SYSCOHADA Financial Statements',
        sharePercentage: 32,
        monthlySearches: 2976,
        growthRate: '+26%',
        category: 'Accounting Setup',
      },
      {
        service: 'Multi-Outlet Bakery & Retail POS',
        sharePercentage: 24,
        monthlySearches: 2232,
        growthRate: '+21%',
        category: 'POS & Hardware',
      },
    ],
  },
  'Senegal': {
    country: 'Senegal',
    countryCode: 'SN',
    countryFlag: '🇸🇳',
    primaryHub: 'Dakar Maritime Hub',
    totalMonthlySearches: 7900,
    quarterlyGrowth: '+27%',
    primaryIndustryNeed: 'Fisheries, Pharmacies & Hardware Stores',
    keyMarketDriver: 'DGID standardized invoice tracking & Wave merchant checkout syncing',
    topRequestedServices: [
      {
        service: 'Pharmacy & Drug Expiry Ledgers',
        sharePercentage: 40,
        monthlySearches: 3160,
        growthRate: '+33%',
        category: 'Inventory Setup',
      },
      {
        service: 'DGID Fiscal E-Invoicing Setup',
        sharePercentage: 34,
        monthlySearches: 2686,
        growthRate: '+30%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Wave Merchant Automated Sync',
        sharePercentage: 26,
        monthlySearches: 2054,
        growthRate: '+25%',
        category: 'Fintech Integration',
      },
    ],
  },
  'Egypt': {
    country: 'Egypt',
    countryCode: 'EG',
    countryFlag: '🇪🇬',
    primaryHub: 'Cairo Metropolitan',
    totalMonthlySearches: 14200,
    quarterlyGrowth: '+35%',
    primaryIndustryNeed: 'Manufacturing, Wholesale & Tech',
    keyMarketDriver: 'ETA mandatory e-receipt and e-invoice system integration',
    topRequestedServices: [
      {
        service: 'ETA E-Invoicing SDK Integration',
        sharePercentage: 48,
        monthlySearches: 6816,
        growthRate: '+54%',
        category: 'Tax & Compliance',
      },
      {
        service: 'BOM & Factory Floor Costing',
        sharePercentage: 29,
        monthlySearches: 4118,
        growthRate: '+26%',
        category: 'Manufacturing',
      },
      {
        service: 'Wholesale Trade Credit Tracking',
        sharePercentage: 23,
        monthlySearches: 3266,
        growthRate: '+19%',
        category: 'Accounting Setup',
      },
    ],
  },
  'Morocco': {
    country: 'Morocco',
    countryCode: 'MA',
    countryFlag: '🇲🇦',
    primaryHub: 'Casablanca & Rabat',
    totalMonthlySearches: 12100,
    quarterlyGrowth: '+25%',
    primaryIndustryNeed: 'Automotive Spares, Textiles & Hospitality',
    keyMarketDriver: 'DGI corporate tax digital reforms & bilingual French/Arabic interface setups',
    topRequestedServices: [
      {
        service: 'Bilingual (FR/AR) POS & Invoicing',
        sharePercentage: 41,
        monthlySearches: 4961,
        growthRate: '+30%',
        category: 'Configuration',
      },
      {
        service: 'Automotive Spares Barcode Setup',
        sharePercentage: 33,
        monthlySearches: 3993,
        growthRate: '+23%',
        category: 'Inventory Setup',
      },
      {
        service: 'DGI Tax Return Standardization',
        sharePercentage: 26,
        monthlySearches: 3146,
        growthRate: '+21%',
        category: 'Tax & Compliance',
      },
    ],
  },
  'United Kingdom': {
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    primaryHub: 'London & Manchester',
    totalMonthlySearches: 11500,
    quarterlyGrowth: '+19%',
    primaryIndustryNeed: 'Diaspora Remittance, Cross-Border Trade & Food',
    keyMarketDriver: 'HMRC Making Tax Digital (MTD) & UK-Africa remittance reconciliations',
    topRequestedServices: [
      {
        service: 'HMRC Making Tax Digital (MTD) Link',
        sharePercentage: 43,
        monthlySearches: 4945,
        growthRate: '+22%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Cross-Border African Currency Books',
        sharePercentage: 34,
        monthlySearches: 3910,
        growthRate: '+27%',
        category: 'Multi-Currency',
      },
      {
        service: 'Diaspora Retail & Food Store POS',
        sharePercentage: 23,
        monthlySearches: 2645,
        growthRate: '+16%',
        category: 'POS & Hardware',
      },
    ],
  },
  'United States': {
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    primaryHub: 'Atlanta & Houston',
    totalMonthlySearches: 15300,
    quarterlyGrowth: '+23%',
    primaryIndustryNeed: 'Import/Export, Afro-Caribbean Groceries & Consulting',
    keyMarketDriver: 'Diaspora retail checkout, Stripe feeds, and multi-entity consolidation',
    topRequestedServices: [
      {
        service: 'Specialty African Grocery POS',
        sharePercentage: 42,
        monthlySearches: 6426,
        growthRate: '+29%',
        category: 'POS & Hardware',
      },
      {
        service: 'Dual-Entity Subsidiary Reporting',
        sharePercentage: 33,
        monthlySearches: 5049,
        growthRate: '+24%',
        category: 'Consulting',
      },
      {
        service: 'Multi-Store Inventory Distribution',
        sharePercentage: 25,
        monthlySearches: 3825,
        growthRate: '+18%',
        category: 'Inventory Setup',
      },
    ],
  },
  'UAE': {
    country: 'UAE',
    countryCode: 'AE',
    countryFlag: '🇦🇪',
    primaryHub: 'Dubai Commercial Gateway',
    totalMonthlySearches: 13800,
    quarterlyGrowth: '+33%',
    primaryIndustryNeed: 'Free-Zone Re-export, Gold/Jewelry & General Trading',
    keyMarketDriver: 'FTA Corporate Tax e-filing & GCC-Africa commodity trading reconciliations',
    topRequestedServices: [
      {
        service: 'FTA Corporate Tax & VAT Ledgers',
        sharePercentage: 46,
        monthlySearches: 6348,
        growthRate: '+46%',
        category: 'Tax & Compliance',
      },
      {
        service: 'Re-Export & Trade Letter of Credit Tracking',
        sharePercentage: 31,
        monthlySearches: 4278,
        growthRate: '+28%',
        category: 'ERP Consulting',
      },
      {
        service: 'Gold & Fractional Item Unit Accounting',
        sharePercentage: 23,
        monthlySearches: 3174,
        growthRate: '+21%',
        category: 'Inventory',
      },
    ],
  },
};

/**
 * Returns the regional insight for a given country name, or a fallback default.
 */
export function getRegionalInsight(country: string): CountryRegionalInsight {
  if (REGIONAL_INSIGHTS_DATA[country]) {
    return REGIONAL_INSIGHTS_DATA[country];
  }

  // Generative fallback based on general MSME directory metrics
  return {
    country,
    countryCode: 'GL',
    countryFlag: '🌍',
    primaryHub: `${country} Regional Hub`,
    totalMonthlySearches: 6500,
    quarterlyGrowth: '+20%',
    primaryIndustryNeed: 'Retail, Supermarket & Services',
    keyMarketDriver: 'Local digital accounting modernization & retail inventory optimization',
    topRequestedServices: [
      {
        service: 'Cloud POS & Barcode Checkout',
        sharePercentage: 44,
        monthlySearches: 2860,
        growthRate: '+25%',
        category: 'POS & Hardware',
      },
      {
        service: 'Inventory Valuation & Reorder Alerts',
        sharePercentage: 32,
        monthlySearches: 2080,
        growthRate: '+21%',
        category: 'Inventory',
      },
      {
        service: 'Financial Statement & Tax Migration',
        sharePercentage: 24,
        monthlySearches: 1560,
        growthRate: '+18%',
        category: 'Tax & Compliance',
      },
    ],
  };
}
