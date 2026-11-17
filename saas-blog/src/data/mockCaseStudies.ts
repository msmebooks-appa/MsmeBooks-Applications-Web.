import { CaseStudy } from '../types';

export const mockCaseStudies: CaseStudy[] = [
  {
    id: 'cs-01',
    businessName: 'Zahara Premium Supermarkets',
    industry: 'Retail & Supermarkets',
    location: 'Lagos & Abuja, Nigeria',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    story: 'Operating 4 supermarket branches with over 14,000 active SKUs, Zahara struggled with daily cash discrepancies, undetected stock pilferage, and long customer checkout queues during evening rush hours.',
    result: 'Unified 12 checkout POS lanes across branches with automated barcode scanning and centralized warehouse replenishment, cutting checkout queue wait times by 52%.',
    growthMetric: '99.4% Inventory Accuracy across 14,000+ SKUs',
    financialImpactNGN: 42000000,
    financialImpactLabel: 'Annual Stock Shrinkage Prevented',
    platformFeaturesUsed: ['Multi-Lane POS', 'Central Cloud Inventory', 'Cashier Shift Audits', 'Batch Expiry Control']
  },
  {
    id: 'cs-02',
    businessName: 'Savannah Fresh Harvest Distribution',
    industry: 'Wholesale & Logistics',
    location: 'Nairobi & Nakuru, Kenya',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    story: 'Supplying fresh produce and dry goods to over 180 hospitality establishments across Kenya, manual invoice writing and untracked credit terms led to chronic cash flow shortages and delayed grower payments.',
    result: 'Equipped field sales agents with MsmeBooks mobile invoicing. Digital invoices with instant mobile money payment links slashed unpaid debtor cycles from 42 days to 9 days.',
    growthMetric: '+44% Working Capital Velocity in 6 Months',
    financialImpactNGN: 118500000,
    financialImpactLabel: 'Debtor Backlog Accelerated into Cash',
    platformFeaturesUsed: ['Field Rep Mobile Invoicing', 'Automated Debtor Reminders', 'Multi-Warehouse Transfers']
  },
  {
    id: 'cs-03',
    businessName: 'Buka Royale Gourmet Kitchen',
    industry: 'Hospitality & Restaurants',
    location: 'Accra, Ghana',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    story: 'Experiencing rapid customer growth, Buka Royale suffered from erratic portion controls, food waste in kitchen prep, and manual end-of-month accounting that masked shrinking margins.',
    result: 'Implemented digital Kitchen Order Tickets (KOT) linked to recipe bills of materials. Every dish ordered automatically deducts exact grams of ingredients from pantry inventory.',
    growthMetric: '28% Reduction in Food Waste & Leakage',
    financialImpactNGN: 26800000,
    financialImpactLabel: 'Monthly Kitchen Recipe Waste Saved',
    platformFeaturesUsed: ['Kitchen Order Tickets', 'Recipe Bill of Materials', 'Daily F&B Profitability Dashboard']
  }
];
