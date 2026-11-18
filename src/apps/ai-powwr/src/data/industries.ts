import { IndustryDefinition } from '../types/faq';

export const INDUSTRIES: IndustryDefinition[] = [
  {
    id: 'supermarkets',
    title: 'Supermarkets, Grocery Stores & Mini-Marts',
    shortTitle: 'Supermarkets & Retail',
    iconName: 'ShoppingCart',
    description: 'High-speed checkout, barcode scanning, batch expiry tracking, and thousands of SKUs.',
    highlightBenefit: 'Manage multi-lane checkout terminals, automated supplier restocking, and bulk pricing.'
  },
  {
    id: 'restaurants',
    title: 'Restaurants, Cafés, Bars & Food Services',
    shortTitle: 'Restaurants & Hospitality',
    iconName: 'UtensilsCrossed',
    description: 'Table orders, kitchen display/tickets, recipe costing, bar tabs, and split bills.',
    highlightBenefit: 'Seamless kitchen-to-cashier synchronization and real-time food margin tracking.'
  },
  {
    id: 'hotels-pms',
    title: 'Hotels, Resorts, Apartments, Guest Houses & Hostels',
    shortTitle: 'Hotels & Lodging (PMS)',
    iconName: 'Hotel',
    description: 'Property Management System (PMS) add-on, room reservations, folios, and night audits.',
    highlightBenefit: 'Integrated room reservation engine, housekeeping dispatch, and unified guest accounting.'
  },
  {
    id: 'fashion',
    title: 'Fashion, Clothing, Shoes & Accessories',
    shortTitle: 'Fashion & Apparel',
    iconName: 'Shirt',
    description: 'Matrix size/color variant management, seasonal discounts, and multi-outlet inventory.',
    highlightBenefit: 'Track variant stock across branches and synchronize physical boutique with online sales.'
  },
  {
    id: 'electronics',
    title: 'Electronics, Mobile Phones & Computer Stores',
    shortTitle: 'Electronics & Tech',
    iconName: 'Laptop',
    description: 'Serial number and IMEI tracking, manufacturer warranty logging, and technician jobs.',
    highlightBenefit: 'Granular device-level serial tracking to prevent warranty fraud and inventory leakage.'
  },
  {
    id: 'wholesale',
    title: 'Wholesale, Distribution & Supply Chain',
    shortTitle: 'Wholesale & Distribution',
    iconName: 'Truck',
    description: 'Customer credit tiers, bulk pack pricing, warehouse dispatch, and sales rep tracking.',
    highlightBenefit: 'Tiered wholesale price lists, bulk invoice generation, and multi-depot stock control.'
  },
  {
    id: 'construction',
    title: 'Construction & Project-Based Businesses',
    shortTitle: 'Construction & Projects',
    iconName: 'HardHat',
    description: 'Project cost job-accounting, material tracking, contractor milestone billing, and site margins.',
    highlightBenefit: 'Allocate labor, materials, and equipment directly to specific contracts in real time.'
  },
  {
    id: 'repairs-maintenance',
    title: 'Repairs, Maintenance & Technical Services',
    shortTitle: 'Repairs & Field Service',
    iconName: 'Wrench',
    description: 'Job ticketing, spare parts stock deductions, repair status tracking, and technician pay.',
    highlightBenefit: 'Track work orders from diagnostic intake to parts usage and final customer payment.'
  },
  {
    id: 'beauty-salons',
    title: 'Beauty Salons, Spas, Cosmetics & Accessories',
    shortTitle: 'Salons & Spas',
    iconName: 'Sparkles',
    description: 'Staff commission calculations, service billing, retail cosmetics sales, and customer history.',
    highlightBenefit: 'Automatic commission calculation for stylists and integrated product sales at checkout.'
  },
  {
    id: 'bookshops-stationery',
    title: 'Bookshops, Stationery & Office Supplies',
    shortTitle: 'Bookshops & Stationery',
    iconName: 'BookOpen',
    description: 'ISBN and barcode search, school list bulk orders, publisher invoices, and category tags.',
    highlightBenefit: 'Fast barcode lookups and seamless handling of institutional bulk purchase orders.'
  },
  {
    id: 'toys-baby',
    title: 'Toys, Baby Products & Children\'s Stores',
    shortTitle: 'Toys & Baby Stores',
    iconName: 'Gift',
    description: 'Age-category filtering, seasonal gift inventory, multi-store stock, and bundle pricing.',
    highlightBenefit: 'Group products into gift bundles and monitor seasonal inventory velocity.'
  },
  {
    id: 'accounting-firms',
    title: 'Accounting, Bookkeeping & Professional Accounting Firms',
    shortTitle: 'Accounting & Audit Firms',
    iconName: 'Briefcase',
    description: 'Multi-client ledger access, automated audit trails, trial balances, and partner portal.',
    highlightBenefit: 'Switch seamlessly between client accounts with full accountant control and audit log export.'
  },
  {
    id: 'real-estate',
    title: 'Real Estate & Property Management',
    shortTitle: 'Real Estate & Properties',
    iconName: 'Home',
    description: 'Tenant lease billing, automated rental invoices, maintenance expense tracking, and owner statements.',
    highlightBenefit: 'Generate recurring rent invoices and separate property-level profit & loss statements.'
  },
  {
    id: 'law-firms',
    title: 'Law Firms & Legal Practices',
    shortTitle: 'Legal & Law Practices',
    iconName: 'Scale',
    description: 'Matter-based expense tracking, client billing, professional disbursements, and trust accounting.',
    highlightBenefit: 'Assign disbursements and billable expenses to specific client case files effortlessly.'
  },
  {
    id: 'pharmacies',
    title: 'Pharmacies, Clinics & Medical Stores',
    shortTitle: 'Pharmacies & Clinics',
    iconName: 'Pill',
    description: 'Batch and expiry-date controls, reorder levels, generic name search, and supplier POs.',
    highlightBenefit: 'Strict FIFO/FEFO expiry tracking to prevent dispensing or selling expired medications.'
  },
  {
    id: 'hospitals-healthcare',
    title: 'Hospitals, Medical Centres & Healthcare Facilities',
    shortTitle: 'Hospitals & Healthcare',
    iconName: 'Activity',
    description: 'Departmental cost tracking, pharmacy dispensary integration, payroll, and billing audit.',
    highlightBenefit: 'Separate financial statements for pharmacy, lab, radiology, and inpatient departments.'
  },
  {
    id: 'schools-education',
    title: 'Schools, Colleges & Educational Institutions',
    shortTitle: 'Schools & Education',
    iconName: 'GraduationCap',
    description: 'Term tuition billing, student receipts, payroll for teaching staff, and departmental budgets.',
    highlightBenefit: 'Bulk termly fee invoice distribution and immediate automated payment receipts.'
  },
  {
    id: 'haulage-logistics',
    title: 'Haulage, Transportation & Logistics',
    shortTitle: 'Haulage & Logistics',
    iconName: 'Compass',
    description: 'Fleet fuel expense tracking, trip revenue, driver allowances, and vehicle maintenance costs.',
    highlightBenefit: 'Track profit-per-trip and fleet operational maintenance expenses with ease.'
  },
  {
    id: 'equipment-rental',
    title: 'Vehicle, Equipment & Asset Rental',
    shortTitle: 'Equipment & Asset Rental',
    iconName: 'Key',
    description: 'Rental contracts, deposit holding, asset depreciation, scheduled returns, and damage fees.',
    highlightBenefit: 'Manage hire durations, security deposits, and maintenance downtime tracking.'
  },
  {
    id: 'ecommerce-digital',
    title: 'E-commerce, Online Stores & Digital Merchants',
    shortTitle: 'E-commerce & Online',
    iconName: 'ShoppingBag',
    description: 'Online payment gateway sync, abandoned order monitoring, real-time inventory deduction.',
    highlightBenefit: 'Synchronize physical shop inventory with your digital storefront in real time.'
  }
];
