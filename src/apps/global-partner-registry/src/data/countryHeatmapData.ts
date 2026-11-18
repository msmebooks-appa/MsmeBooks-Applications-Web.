export type HeatmapMetric = 'projects' | 'density' | 'opportunity';

export interface CountryHeatmapItem {
  id: string;
  country: string;
  code: string;
  flag: string;
  region: 'West Africa' | 'East Africa' | 'Southern Africa' | 'North Africa' | 'Central Africa' | 'Global Corridor';
  partnerCount: number;
  activeProjects: number;
  monthlyInquiries: number;
  growthRateYoY: string;
  partnerDensityRatio: string; // e.g. "1 : 13 projects"
  opportunityScore: number; // 0 - 100
  demandLevel: 'Extreme Demand' | 'High Demand' | 'Moderate Demand' | 'Emerging Growth';
  avgProjectBudget: string;
  topDemandedSolutions: string[];
  keyCommercialCities: string[];
  recommendedSectors: string[];
  // SVG positioning on 800x500 viewBox
  center: { x: number; y: number }; // percentage coords (0-100)
  svgPath: string; // SVG path 'd' attribute
}

export const COUNTRY_HEATMAP_DATA: CountryHeatmapItem[] = [
  {
    id: 'NG',
    country: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    region: 'West Africa',
    partnerCount: 142,
    activeProjects: 1840,
    monthlyInquiries: 380,
    growthRateYoY: '+54% YoY',
    partnerDensityRatio: '1 partner per 13 active projects',
    opportunityScore: 98,
    demandLevel: 'Extreme Demand',
    avgProjectBudget: '$1,500 - $6,000',
    topDemandedSolutions: ['Multi-Branch POS', 'FIRS Fiscal Invoicing', 'Batch Inventory Tracking', 'ERP Migration'],
    keyCommercialCities: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'],
    recommendedSectors: ['Supermarkets & Retail', 'Pharmaceutical Distribution', 'Manufacturing', 'Fast-Food Chains'],
    center: { x: 45.0, y: 53.0 },
    // Stylized territory covering Nigeria & immediate corridor
    svgPath: 'M 345 250 L 375 250 L 382 268 L 376 285 L 358 288 L 344 278 L 342 262 Z',
  },
  {
    id: 'KE',
    country: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    region: 'East Africa',
    partnerCount: 89,
    activeProjects: 1210,
    monthlyInquiries: 240,
    growthRateYoY: '+46% YoY',
    partnerDensityRatio: '1 partner per 14 active projects',
    opportunityScore: 95,
    demandLevel: 'Extreme Demand',
    avgProjectBudget: '$1,200 - $4,800',
    topDemandedSolutions: ['M-Pesa B2B POS Integration', 'KRA eTIMS Tax Compliance', 'Hotel & Bar Billing', 'Agri-Processing'],
    keyCommercialCities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    recommendedSectors: ['Hospitality & Tourism', 'Retail Chains', 'Logistics & Cargo', 'Wholesale Hubs'],
    center: { x: 57.0, y: 57.0 },
    svgPath: 'M 440 272 L 468 268 L 474 286 L 460 302 L 442 296 L 436 282 Z',
  },
  {
    id: 'ZA',
    country: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    region: 'Southern Africa',
    partnerCount: 94,
    activeProjects: 1350,
    monthlyInquiries: 270,
    growthRateYoY: '+38% YoY',
    partnerDensityRatio: '1 partner per 14 active projects',
    opportunityScore: 92,
    demandLevel: 'Extreme Demand',
    avgProjectBudget: '$1,800 - $7,500',
    topDemandedSolutions: ['Multi-Entity Consolidation', 'SARS VAT Compliance', 'Field Service POS', 'Omnichannel eCommerce'],
    keyCommercialCities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    recommendedSectors: ['Mining Supply Chains', 'Retail Franchises', 'Wine & Agro-Export', 'Tech Services'],
    center: { x: 51.0, y: 78.0 },
    svgPath: 'M 390 380 L 432 375 L 444 395 L 426 422 L 396 426 L 382 405 Z',
  },
  {
    id: 'GH',
    country: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    region: 'West Africa',
    partnerCount: 68,
    activeProjects: 820,
    monthlyInquiries: 170,
    growthRateYoY: '+42% YoY',
    partnerDensityRatio: '1 partner per 12 active projects',
    opportunityScore: 90,
    demandLevel: 'High Demand',
    avgProjectBudget: '$1,100 - $4,200',
    topDemandedSolutions: ['GRA Fiscalized Electronic Invoicing', 'Mobile Money POS', 'Pharmacy Lot Tracking', 'Wholesale Distribution'],
    keyCommercialCities: ['Accra', 'Kumasi', 'Tema', 'Takoradi'],
    recommendedSectors: ['Retail Marts', 'Pharma Wholesalers', 'Import/Export', 'Manufacturing'],
    center: { x: 40.0, y: 55.0 },
    svgPath: 'M 314 262 L 332 262 L 334 284 L 320 286 L 312 276 Z',
  },
  {
    id: 'EG',
    country: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    region: 'North Africa',
    partnerCount: 35,
    activeProjects: 590,
    monthlyInquiries: 130,
    growthRateYoY: '+48% YoY',
    partnerDensityRatio: '1 partner per 17 active projects',
    opportunityScore: 94,
    demandLevel: 'High Demand',
    avgProjectBudget: '$1,400 - $5,500',
    topDemandedSolutions: ['ETA e-Invoicing Compliance', 'Arabic/English Dual POS', 'B2B Wholesale Ordering', 'Customs Invoicing'],
    keyCommercialCities: ['Cairo', 'Alexandria', 'Giza', 'Mansoura'],
    recommendedSectors: ['Textile & Apparel', 'Food Processing', 'Import Trading', 'Distribution'],
    center: { x: 54.0, y: 38.0 },
    svgPath: 'M 418 180 L 452 180 L 454 212 L 420 212 Z',
  },
  {
    id: 'UG',
    country: 'Uganda',
    code: 'UG',
    flag: '🇺🇬',
    region: 'East Africa',
    partnerCount: 41,
    activeProjects: 510,
    monthlyInquiries: 110,
    growthRateYoY: '+40% YoY',
    partnerDensityRatio: '1 partner per 12 active projects',
    opportunityScore: 88,
    demandLevel: 'High Demand',
    avgProjectBudget: '$900 - $3,500',
    topDemandedSolutions: ['URA EFRIS Integration', 'Airtel/MTN Money POS', 'Cross-Border Invoicing', 'Hospitality Bookkeeping'],
    keyCommercialCities: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara'],
    recommendedSectors: ['Coffee & Agro-Export', 'Retail Supermarkets', 'Hotels & Lodges', 'Hardware Stores'],
    center: { x: 54.0, y: 55.0 },
    svgPath: 'M 426 268 L 442 268 L 444 285 L 428 285 Z',
  },
  {
    id: 'TZ',
    country: 'Tanzania',
    code: 'TZ',
    flag: '🇹🇿',
    region: 'East Africa',
    partnerCount: 38,
    activeProjects: 440,
    monthlyInquiries: 95,
    growthRateYoY: '+36% YoY',
    partnerDensityRatio: '1 partner per 12 active projects',
    opportunityScore: 86,
    demandLevel: 'High Demand',
    avgProjectBudget: '$1,000 - $3,800',
    topDemandedSolutions: ['TRA EFDMS Tax Integration', 'Tigo/Vodacom POS Sync', 'Tourism Billing', 'Multi-Store Inventory'],
    keyCommercialCities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar'],
    recommendedSectors: ['Safari & Tourism', 'Mining Services', 'Wholesale Distribution', 'Retail'],
    center: { x: 56.0, y: 61.0 },
    svgPath: 'M 438 292 L 464 294 L 460 322 L 434 316 Z',
  },
  {
    id: 'RW',
    country: 'Rwanda',
    code: 'RW',
    flag: '🇷🇼',
    region: 'East Africa',
    partnerCount: 29,
    activeProjects: 390,
    monthlyInquiries: 90,
    growthRateYoY: '+56% YoY',
    partnerDensityRatio: '1 partner per 13 active projects',
    opportunityScore: 92,
    demandLevel: 'High Demand',
    avgProjectBudget: '$1,300 - $4,500',
    topDemandedSolutions: ['RRA Electronic Billing Machine (EBM)', 'Cashless POS', 'Startup FinTech Accounting', 'Automated Payroll'],
    keyCommercialCities: ['Kigali', 'Musanze', 'Rubavu', 'Huye'],
    recommendedSectors: ['Tech Startups', 'Modern Retail & Cafes', 'Pharma Dispensaries', 'Eco-Tourism'],
    center: { x: 52.0, y: 57.0 },
    svgPath: 'M 420 282 L 432 282 L 432 292 L 420 292 Z',
  },
  {
    id: 'CI',
    country: 'Côte d\'Ivoire',
    code: 'CI',
    flag: '🇨🇮',
    region: 'West Africa',
    partnerCount: 32,
    activeProjects: 420,
    monthlyInquiries: 95,
    growthRateYoY: '+45% YoY',
    partnerDensityRatio: '1 partner per 13 active projects',
    opportunityScore: 91,
    demandLevel: 'High Demand',
    avgProjectBudget: '$1,100 - $4,000',
    topDemandedSolutions: ['SYSCOHADA Accounting Standards', 'Orange Money POS', 'Cocoa & Coffee SCM', 'French/English Invoicing'],
    keyCommercialCities: ['Abidjan', 'San Pedro', 'Bouaké', 'Yamoussoukro'],
    recommendedSectors: ['Agro-Industry', 'B2B Distribution', 'Retail Hypermarkets', 'Construction Supply'],
    center: { x: 38.0, y: 54.0 },
    svgPath: 'M 296 260 L 314 260 L 314 282 L 298 280 Z',
  },
  {
    id: 'SN',
    country: 'Senegal',
    code: 'SN',
    flag: '🇸🇳',
    region: 'West Africa',
    partnerCount: 27,
    activeProjects: 310,
    monthlyInquiries: 75,
    growthRateYoY: '+39% YoY',
    partnerDensityRatio: '1 partner per 11 active projects',
    opportunityScore: 84,
    demandLevel: 'Moderate Demand',
    avgProjectBudget: '$1,000 - $3,600',
    topDemandedSolutions: ['Wave/Orange Money Checkout', 'DGID Fiscal Compliance', 'Retail Inventory POS', 'Logistics Billing'],
    keyCommercialCities: ['Dakar', 'Thiès', 'Saint-Louis', 'Touba'],
    recommendedSectors: ['Maritime & Logistics', 'Supermarkets & Boutiques', 'Hospitality', 'Pharmacies'],
    center: { x: 34.0, y: 50.0 },
    svgPath: 'M 265 242 L 285 242 L 285 260 L 265 258 Z',
  },
  {
    id: 'CM',
    country: 'Cameroon',
    code: 'CM',
    flag: '🇨🇲',
    region: 'Central Africa',
    partnerCount: 24,
    activeProjects: 290,
    monthlyInquiries: 70,
    growthRateYoY: '+35% YoY',
    partnerDensityRatio: '1 partner per 12 active projects',
    opportunityScore: 85,
    demandLevel: 'Moderate Demand',
    avgProjectBudget: '$950 - $3,400',
    topDemandedSolutions: ['OHADA Accounting', 'Bilingual POS (FR/EN)', 'Timber & Agro Supply', 'Multi-Store Retailing'],
    keyCommercialCities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'],
    recommendedSectors: ['Freight Forwarding', 'General Merchandise', 'Manufacturing', 'Pharmacies'],
    center: { x: 48.0, y: 56.0 },
    svgPath: 'M 378 268 L 396 268 L 398 296 L 380 292 Z',
  },
  {
    id: 'MA',
    country: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    region: 'North Africa',
    partnerCount: 30,
    activeProjects: 380,
    monthlyInquiries: 85,
    growthRateYoY: '+34% YoY',
    partnerDensityRatio: '1 partner per 13 active projects',
    opportunityScore: 87,
    demandLevel: 'Moderate Demand',
    avgProjectBudget: '$1,200 - $4,600',
    topDemandedSolutions: ['DGI Electronic Invoice Sync', 'French/Arabic Accounting', 'Tourism & Riad POS', 'Automotive Supply'],
    keyCommercialCities: ['Casablanca', 'Rabat', 'Marrakech', 'Tangier'],
    recommendedSectors: ['Tourism & Restaurants', 'Automotive Supply', 'eCommerce', 'Wholesale Trade'],
    center: { x: 39.0, y: 36.0 },
    svgPath: 'M 310 168 L 340 166 L 336 192 L 308 190 Z',
  },
  {
    id: 'ET',
    country: 'Ethiopia',
    code: 'ET',
    flag: '🇪🇹',
    region: 'East Africa',
    partnerCount: 22,
    activeProjects: 260,
    monthlyInquiries: 65,
    growthRateYoY: '+48% YoY',
    partnerDensityRatio: '1 partner per 12 active projects',
    opportunityScore: 89,
    demandLevel: 'Moderate Demand',
    avgProjectBudget: '$900 - $3,200',
    topDemandedSolutions: ['Telebirr POS Sync', 'ERCA Fiscal Cash Registers', 'Amharic Language Invoicing', 'Manufacturing Stock'],
    keyCommercialCities: ['Addis Ababa', 'Hawassa', 'Dire Dawa', 'Bahir Dar'],
    recommendedSectors: ['Textiles & Industrial Parks', 'Coffee Exporters', 'Hotels', 'Trading Enterprises'],
    center: { x: 56.5, y: 48.0 },
    svgPath: 'M 444 230 L 478 230 L 486 256 L 452 258 Z',
  },
  {
    id: 'ZM',
    country: 'Zambia',
    code: 'ZM',
    flag: '🇿🇲',
    region: 'Southern Africa',
    partnerCount: 19,
    activeProjects: 210,
    monthlyInquiries: 50,
    growthRateYoY: '+33% YoY',
    partnerDensityRatio: '1 partner per 11 active projects',
    opportunityScore: 82,
    demandLevel: 'Emerging Growth',
    avgProjectBudget: '$850 - $3,000',
    topDemandedSolutions: ['ZRA Smart Invoice Compliance', 'Copperbelt Wholesale POS', 'Agri-Dealer Stock Control', 'Cross-Border VAT'],
    keyCommercialCities: ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone'],
    recommendedSectors: ['Mining Equipment Retail', 'Commercial Farming', 'Hardware Chains', 'Pharmacies'],
    center: { x: 51.0, y: 68.0 },
    svgPath: 'M 404 330 L 434 328 L 436 352 L 406 350 Z',
  },
  {
    id: 'ZW',
    country: 'Zimbabwe',
    code: 'ZW',
    flag: '🇿🇼',
    region: 'Southern Africa',
    partnerCount: 18,
    activeProjects: 190,
    monthlyInquiries: 45,
    growthRateYoY: '+30% YoY',
    partnerDensityRatio: '1 partner per 11 active projects',
    opportunityScore: 81,
    demandLevel: 'Emerging Growth',
    avgProjectBudget: '$800 - $2,800',
    topDemandedSolutions: ['ZIMRA Fiscal Data Transmitters', 'Multi-Currency POS (USD & ZiG)', 'Fuel Station Invoicing', 'Fast Retail'],
    keyCommercialCities: ['Harare', 'Bulawayo', 'Mutare', 'Gweru'],
    recommendedSectors: ['Multi-Currency Retail', 'Mining Consumables', 'Agro-Supplies', 'Wholesalers'],
    center: { x: 52.0, y: 72.0 },
    svgPath: 'M 416 352 L 438 350 L 440 368 L 418 368 Z',
  },
  {
    id: 'BW',
    country: 'Botswana',
    code: 'BW',
    flag: '🇧🇼',
    region: 'Southern Africa',
    partnerCount: 14,
    activeProjects: 150,
    monthlyInquiries: 38,
    growthRateYoY: '+32% YoY',
    partnerDensityRatio: '1 partner per 11 active projects',
    opportunityScore: 78,
    demandLevel: 'Emerging Growth',
    avgProjectBudget: '$1,200 - $4,200',
    topDemandedSolutions: ['BURS Tax Integration', 'Diamond & Mineral Supply POS', 'Safari Lodge Invoicing', 'Fleet Fuel Tracking'],
    keyCommercialCities: ['Gaborone', 'Francistown', 'Maun'],
    recommendedSectors: ['Luxury Hospitality', 'Diamond Value Addition', 'B2B Wholesale', 'Government Contractors'],
    center: { x: 50.0, y: 74.0 },
    svgPath: 'M 396 364 L 416 364 L 416 384 L 396 384 Z',
  },
  // Global Corridor Hubs
  {
    id: 'GB',
    country: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: 'Global Corridor',
    partnerCount: 28,
    activeProjects: 360,
    monthlyInquiries: 85,
    growthRateYoY: '+35% YoY',
    partnerDensityRatio: '1 partner per 13 active projects',
    opportunityScore: 86,
    demandLevel: 'High Demand',
    avgProjectBudget: '$2,000 - $8,500',
    topDemandedSolutions: ['HMRC Making Tax Digital', 'Afro-Caribbean Retail POS', 'Remittance Business Sync', 'UK-Africa SCM'],
    keyCommercialCities: ['London', 'Manchester', 'Birmingham'],
    recommendedSectors: ['Diaspora Supermarkets', 'Import-Export Corridors', 'Cross-Border Advisory', 'Logistics'],
    center: { x: 41.0, y: 25.0 },
    svgPath: 'M 324 116 L 338 116 L 338 138 L 324 136 Z',
  },
  {
    id: 'US',
    country: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: 'Global Corridor',
    partnerCount: 34,
    activeProjects: 470,
    monthlyInquiries: 110,
    growthRateYoY: '+41% YoY',
    partnerDensityRatio: '1 partner per 14 active projects',
    opportunityScore: 91,
    demandLevel: 'High Demand',
    avgProjectBudget: '$2,500 - $9,500',
    topDemandedSolutions: ['Multi-State Sales Tax', 'African Diaspora Distribution POS', 'Trade Compliance', 'Square/Stripe Sync'],
    keyCommercialCities: ['Atlanta', 'Houston', 'New York', 'Dallas'],
    recommendedSectors: ['Diaspora Trade', 'Agro-Commodities Importers', 'Specialty Grocers', 'eCommerce'],
    center: { x: 20.0, y: 36.0 },
    svgPath: 'M 145 165 L 185 160 L 195 195 L 150 198 Z',
  },
  {
    id: 'AE',
    country: 'UAE',
    code: 'AE',
    flag: '🇦🇪',
    region: 'Global Corridor',
    partnerCount: 21,
    activeProjects: 320,
    monthlyInquiries: 80,
    growthRateYoY: '+46% YoY',
    partnerDensityRatio: '1 partner per 15 active projects',
    opportunityScore: 93,
    demandLevel: 'High Demand',
    avgProjectBudget: '$2,200 - $8,000',
    topDemandedSolutions: ['FTA Corporate Tax & VAT', 'Dubai-Africa Re-Export POS', 'Free Zone Multi-Currency', 'Gold & Commodity SCM'],
    keyCommercialCities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    recommendedSectors: ['Gold & Electronics Trade', 'Re-Export Distribution', 'Maritime Cargo', 'Luxury Retail'],
    center: { x: 62.0, y: 42.0 },
    svgPath: 'M 490 204 L 512 204 L 512 220 L 490 220 Z',
  },
  {
    id: 'CA',
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: 'Global Corridor',
    partnerCount: 16,
    activeProjects: 180,
    monthlyInquiries: 45,
    growthRateYoY: '+31% YoY',
    partnerDensityRatio: '1 partner per 11 active projects',
    opportunityScore: 80,
    demandLevel: 'Emerging Growth',
    avgProjectBudget: '$1,800 - $7,000',
    topDemandedSolutions: ['CRA GST/HST Compliance', 'Diaspora Food & Grocery POS', 'Dual Currency (CAD/USD)', 'Immigrant Business Accounting'],
    keyCommercialCities: ['Toronto', 'Vancouver', 'Calgary', 'Montreal'],
    recommendedSectors: ['Diaspora Food Marts', 'Cross-Border Services', 'Boutique Accounting', 'Logistics'],
    center: { x: 18.0, y: 31.0 },
    svgPath: 'M 130 135 L 175 130 L 178 155 L 132 158 Z',
  },
];

export const HEATMAP_METRIC_CONFIG: Record<
  HeatmapMetric,
  {
    label: string;
    badge: string;
    description: string;
    unit: string;
    min: number;
    max: number;
    formatValue: (item: CountryHeatmapItem) => string;
    getValue: (item: CountryHeatmapItem) => number;
  }
> = {
  projects: {
    label: 'Active Projects (Demand Volume)',
    badge: 'SME Deployments',
    description: 'Real-time volume of active business implementations, cloud accounting rollouts, and POS deployments.',
    unit: 'Projects',
    min: 150,
    max: 1840,
    formatValue: (item) => `${item.activeProjects.toLocaleString()} projects`,
    getValue: (item) => item.activeProjects,
  },
  density: {
    label: 'Partner Density',
    badge: 'Capacity Distribution',
    description: 'Concentration of certified local partners and implementation agencies across markets.',
    unit: 'Partners',
    min: 14,
    max: 142,
    formatValue: (item) => `${item.partnerCount} partners (${item.partnerDensityRatio})`,
    getValue: (item) => item.partnerCount,
  },
  opportunity: {
    label: 'Demand Gap / Opportunity Index',
    badge: 'Recommended for New Partners',
    description: 'Identifies high-growth markets where SME client requests heavily outpace local certified partner supply.',
    unit: 'Score / 100',
    min: 75,
    max: 100,
    formatValue: (item) => `${item.opportunityScore}/100 score (${item.monthlyInquiries} monthly client inquiries)`,
    getValue: (item) => item.opportunityScore,
  },
};

export type CoverageDensityTier = 'comprehensive' | 'adequate' | 'moderate' | 'underserved';

export interface CoverageTierInfo {
  tier: CoverageDensityTier;
  label: string;
  shortLabel: string;
  badge: string;
  partnerRange: string;
  isUnderserved: boolean;
  statusColor: string;
  gradientId: string;
  fillColor: string;
  strokeColor: string;
  glowColor: string;
  description: string;
  opportunitySummary: string;
}

export const COVERAGE_TIER_CONFIG: Record<CoverageDensityTier, CoverageTierInfo> = {
  comprehensive: {
    tier: 'comprehensive',
    label: 'Comprehensive Coverage',
    shortLabel: 'High Density',
    badge: 'Established Partner Ecosystem',
    partnerRange: '70+ Partners',
    isUnderserved: false,
    statusColor: '#10b981',
    gradientId: 'coverage-grad-comprehensive',
    fillColor: '#059669',
    strokeColor: '#34d399',
    glowColor: '#10b981',
    description: 'Thriving network with extensive certified technical advisors, on-site POS engineers, and multi-branch ERP specialists.',
    opportunitySummary: 'Deep market penetration with mature partner ecosystem; specialized solutions recommended.'
  },
  adequate: {
    tier: 'adequate',
    label: 'Adequate Coverage',
    shortLabel: 'Adequate',
    badge: 'Balanced Partner Supply',
    partnerRange: '35 - 69 Partners',
    isUnderserved: false,
    statusColor: '#06b6d4',
    gradientId: 'coverage-grad-adequate',
    fillColor: '#0284c7',
    strokeColor: '#38bdf8',
    glowColor: '#0ea5e9',
    description: 'Balanced partner density actively fulfilling general retail, supermarket, and accounting migration requests.',
    opportunitySummary: 'Steady inbound client inquiries; high growth potential in Tier-2 commercial cities.'
  },
  moderate: {
    tier: 'moderate',
    label: 'Developing Coverage',
    shortLabel: 'Developing',
    badge: 'Growing Partner Presence',
    partnerRange: '25 - 34 Partners',
    isUnderserved: false,
    statusColor: '#818cf8',
    gradientId: 'coverage-grad-moderate',
    fillColor: '#6366f1',
    strokeColor: '#a5b4fc',
    glowColor: '#818cf8',
    description: 'Emerging partner coverage with growing SME demand in primary metro areas, expanding outwards.',
    opportunitySummary: 'Prime entry point for tech consultancies seeking initial market leadership.'
  },
  underserved: {
    tier: 'underserved',
    label: 'Underserved Region',
    shortLabel: 'Underserved',
    badge: 'Partner Shortage • High Unmet Demand',
    partnerRange: '< 25 Partners',
    isUnderserved: true,
    statusColor: '#f97316',
    gradientId: 'coverage-grad-underserved',
    fillColor: '#ea580c',
    strokeColor: '#fb923c',
    glowColor: '#f97316',
    description: 'Shortage of local certified implementation partners. Client requests significantly outpace available capacity.',
    opportunitySummary: 'Priority territory for new partner recruitment and remote ERP/POS advisory deployments.'
  }
};

/**
 * Categorizes a country by certified partner density to identify coverage and underserved regions
 */
export function getCountryCoverageTier(item: CountryHeatmapItem): CoverageTierInfo {
  if (item.partnerCount >= 70) {
    return COVERAGE_TIER_CONFIG.comprehensive;
  }
  if (item.partnerCount >= 35) {
    return COVERAGE_TIER_CONFIG.adequate;
  }
  if (item.partnerCount >= 25) {
    return COVERAGE_TIER_CONFIG.moderate;
  }
  return COVERAGE_TIER_CONFIG.underserved;
}

/**
 * Calculates subtle SVG styling for the Regional Coverage Heatmap overlay
 */
export function getCoverageHeatmapStyle(
  item: CountryHeatmapItem,
  isSelected: boolean,
  isHovered: boolean,
  spotlightUnderserved: boolean
): {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  glowColor: string;
  isUnderserved: boolean;
  tierInfo: CoverageTierInfo;
} {
  const tierInfo = getCountryCoverageTier(item);
  const isUnderserved = tierInfo.isUnderserved;

  // Base opacity: subtle translucent gradient fill (0.35 to 0.55)
  let opacity = isUnderserved ? 0.48 : 0.38;
  let strokeWidth = isUnderserved ? 1.4 : 1.1;
  let strokeColor = tierInfo.strokeColor;

  if (spotlightUnderserved) {
    if (isUnderserved) {
      opacity = isSelected ? 0.95 : isHovered ? 0.85 : 0.65;
      strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 1.6;
      strokeColor = '#fb923c';
    } else {
      opacity = 0.12;
      strokeWidth = 0.6;
      strokeColor = '#334155';
    }
  } else {
    if (isSelected) {
      opacity = 0.88;
      strokeWidth = 2.4;
      strokeColor = '#ffffff';
    } else if (isHovered) {
      opacity = 0.78;
      strokeWidth = 1.9;
      strokeColor = isUnderserved ? '#fbbf24' : '#facc15';
    }
  }

  return {
    fill: `url(#${tierInfo.gradientId})`,
    fillOpacity: opacity,
    stroke: strokeColor,
    strokeWidth,
    glowColor: tierInfo.glowColor,
    isUnderserved,
    tierInfo,
  };
}

/**
 * Calculates dynamic heatmap shading color & opacity for a country based on metric value
 */
export function getCountryHeatmapStyle(
  item: CountryHeatmapItem,
  metric: HeatmapMetric,
  isSelected: boolean,
  isHovered: boolean
): {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  glowColor: string;
} {
  const config = HEATMAP_METRIC_CONFIG[metric];
  const val = config.getValue(item);
  const normalized = Math.max(0, Math.min(1, (val - config.min) / (config.max - config.min)));

  // Subtle harmonious gradient from Cyan/Blue (emerging) -> Lime/Green (moderate) -> Amber/Orange (high) -> Coral/Rose (peak)
  let baseColor = '#0284c7';
  let glowColor = '#38bdf8';

  if (normalized >= 0.75) {
    baseColor = '#f43f5e';
    glowColor = '#fb7185';
  } else if (normalized >= 0.5) {
    baseColor = '#f97316';
    glowColor = '#fb923c';
  } else if (normalized >= 0.25) {
    baseColor = '#84cc16';
    glowColor = '#a3e635';
  } else {
    baseColor = '#0ea5e9';
    glowColor = '#38bdf8';
  }

  let opacity = 0.38 + normalized * 0.38;
  let strokeWidth = 1.2;
  let strokeColor = glowColor;

  if (isSelected) {
    opacity = 0.92;
    strokeWidth = 2.5;
    strokeColor = '#ffffff';
  } else if (isHovered) {
    opacity = 0.82;
    strokeWidth = 2;
    strokeColor = '#facc15';
  }

  return {
    fill: baseColor,
    fillOpacity: opacity,
    stroke: strokeColor,
    strokeWidth,
    glowColor,
  };
}
