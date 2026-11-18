import { IndustryResource } from '../types';

export const mockIndustries: IndustryResource[] = [
  {
    id: 'ind-01',
    name: 'Supermarkets & Grocery',
    slug: 'supermarkets-grocery',
    description: 'High-speed multi-lane checkout, multi-pack splitting, batch expiry tracking, and thousands of fast-moving consumer SKUs.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Barcode scanning & scales', 'Expiry markdown automation', 'Multi-till shift reconciliation'],
    caseStudyHighlight: 'Saved 14 hours weekly per branch on stock verification.',
    articleCount: 14
  },
  {
    id: 'ind-02',
    name: 'Restaurants & Bars',
    slug: 'restaurants',
    description: 'Digital Kitchen Order Tickets (KOT), recipe-level ingredient depletion, table bill splitting, and bar inventory control.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Recipe bill of materials', 'Floor & table management', 'Raw protein & spirit tracking'],
    caseStudyHighlight: 'Reduced kitchen food waste by 27% in first 90 days.',
    articleCount: 11
  },
  {
    id: 'ind-03',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Size-color-variant matrix, custom garment tagging, seasonal inventory cycles, and omnichannel store-to-online sync.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Matrix variant management', 'Customer VIP loyalty points', 'Garment barcode labeling'],
    caseStudyHighlight: 'Zero overselling across 3 boutique locations and Instagram shop.',
    articleCount: 8
  },
  {
    id: 'ind-04',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Serial number and IMEI tracking for phones and laptops, warranty management, and technician repair billing.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['IMEI/Serial number logging', 'Warranty period tracking', 'Repair work order invoices'],
    caseStudyHighlight: 'Cut counterfeit warranty returns by 100% via IMEI lookup.',
    articleCount: 7
  },
  {
    id: 'ind-05',
    name: 'Pharmacy & Healthcare',
    slug: 'pharmacy',
    description: 'Regulatory NAFDAC/Pharmacy council batch tracking, prescription filing, automated expiry warnings, and dosage labeling.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Strict batch & expiry audits', 'Prescription dispensation log', 'Fast pill counter support'],
    caseStudyHighlight: 'Eliminated expired medication losses across 4 retail branches.',
    articleCount: 9
  },
  {
    id: 'ind-06',
    name: 'Wholesale & Distribution',
    slug: 'wholesale-distribution',
    description: 'Carton/pallet tiered pricing, field sales rep mobile invoicing, delivery route manifests, and debtor credit limits.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Tiered wholesale volume pricing', 'Field sales rep app', 'Credit limit hard blocks'],
    caseStudyHighlight: 'Accelerated debtor collections from 38 days down to 11 days.',
    articleCount: 15
  },
  {
    id: 'ind-07',
    name: 'Hardware & Building Materials',
    slug: 'hardware-building',
    description: 'Fractional unit billing (meters, bags, tons), contractor quote-to-invoice workflows, and heavy transit stock control.',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Fractional measurement units', 'Contractor project job costing', 'Waybill & dispatch tracking'],
    caseStudyHighlight: 'Improved gross margins by 4.8% through accurate transport job costing.',
    articleCount: 6
  },
  {
    id: 'ind-08',
    name: 'Beauty & Salon',
    slug: 'beauty-salon',
    description: 'Stylist commission splits, appointment booking deposits, retail product sales, and salon consumable usage tracking.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Stylist commission calculator', 'Service + retail bundled ticket', 'Consumable back-bar usage'],
    caseStudyHighlight: 'Reduced staff payroll calculation disputes to zero.',
    articleCount: 5
  },
  {
    id: 'ind-09',
    name: 'Bookshops & Stationery',
    slug: 'bookshops-stationery',
    description: 'ISBN database integration, school booklist bundle packages, bulk school supply procurement, and publisher royalties.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['ISBN scanning & lookup', 'Seasonal back-to-school bundles', 'Publisher consignment tracking'],
    caseStudyHighlight: 'Processed 1,200 student back-to-school book bundles in 48 hours.',
    articleCount: 4
  },
  {
    id: 'ind-10',
    name: 'Hotels & Hospitality',
    slug: 'hotels-hospitality',
    description: 'Room night billing, guest folios, minibar charges, integrated front-desk POS, and housekeeping maintenance audits.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Room folio consolidation', 'Restaurant-to-room charge posting', 'Night audit automated reports'],
    caseStudyHighlight: 'Eliminated unbilled room restaurant tabs with integrated folios.',
    articleCount: 6
  },
  {
    id: 'ind-11',
    name: 'Services & Consulting',
    slug: 'services',
    description: 'Retainer management, milestone billings, time-tracking, expense reimbursement, and Withholding Tax schedules.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Recurring retainer subscriptions', 'WHT deduction schedules', 'Client portal digital approvals'],
    caseStudyHighlight: 'Boosted billable collection rates to 96% within 14 days of invoice.',
    articleCount: 12
  },
  {
    id: 'ind-12',
    name: 'E-commerce & Social Commerce',
    slug: 'ecommerce',
    description: 'Synchronized inventory between physical stores, Paystack/Flutterwave payments, and courier dispatch logs.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    keyCapabilities: ['Live webshop inventory sync', 'Instant automated payment receipts', 'Courier COD reconciliation'],
    caseStudyHighlight: 'Scaled from 20 to 350 daily shipments without extra warehouse staff.',
    articleCount: 8
  }
];
