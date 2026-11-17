export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  country: string;
  category: 'Accounting Transformation' | 'POS Implementation' | 'Hospitality Deployment' | 'Tax Compliance' | 'Bookkeeping Outsourcing';
  quote: string;
  verifiedService: string;
  firmAssigned: string;
  statsMetric: string;
  statsLabel: string;
  avatarUrl: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Amina Bello-Dikko',
    role: 'Managing Director & Founder',
    company: 'PrimeCare Mega Pharmacies (3 Branches)',
    city: 'Abuja & Kaduna',
    country: 'Nigeria',
    category: 'POS Implementation',
    quote: 'Before MsmeBooks and Apex Cloud Systems, tracking drug expiry dates and cashier cash collections across 3 branches was an everyday nightmare. Their implementation engineers set up our barcode scanners, batch expiry alerts, and trained all 14 dispensary staff in under 4 days. Zero expired drugs on shelves since then!',
    verifiedService: 'Pharmacy POS & Batch Expiry Turnkey Setup',
    firmAssigned: 'Apex Cloud Systems',
    statsMetric: '100%',
    statsLabel: 'Expiry Tracking Accuracy',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'test-2',
    name: 'Oluwaseun Adeyemi, FCA',
    role: 'Lead Financial Officer',
    company: 'Atlantic Harvest Agro-Wholesale',
    city: 'Lagos & Ibadan',
    country: 'Nigeria',
    category: 'Accounting Transformation',
    quote: 'We had 2 years of backlog paper receipts and disjointed Excel sheets. Cedar Professional Services came in through the MsmeBooks marketplace, reconstructed our books into audit-grade financial statements, and filed our CIT. We secured a ₦85M working capital loan with the Bank of Industry right after.',
    verifiedService: 'Accounting Records Cleanup & Reconstruction',
    firmAssigned: 'Cedar Professional Services Ltd',
    statsMetric: '₦85M',
    statsLabel: 'BOI Working Capital Secured',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'test-3',
    name: 'Kwame Osei Mensah',
    role: 'General Manager',
    company: 'Royal Palm Suites & Beach Club',
    city: 'Takoradi & Accra',
    country: 'Ghana',
    category: 'Hospitality Deployment',
    quote: 'MsmeBooks Hotel PMS was deployed seamlessly by the core team. Front-desk check-in connects instantly with the beachfront restaurant POS and night audits are generated automatically at 2:00 AM every single day. The WhatsApp booking feature made consulting with their technical team instantaneous.',
    verifiedService: 'Hotel PMS & Hospitality System Setup',
    firmAssigned: 'MsmeBooks In-House Team',
    statsMetric: '45 Mins',
    statsLabel: 'Saved Daily on Night Audit',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'test-4',
    name: 'Faith Mwangi',
    role: 'Chief Executive Officer',
    company: 'Savannah Fresh Retail Marts',
    city: 'Nairobi',
    country: 'Kenya',
    category: 'Bookkeeping Outsourcing',
    quote: 'Hiring a full-time senior accountant was beyond our startup budget. Subscribing to the monthly bookkeeping retainer through MsmeBooks paired us with a dedicated professional who reconciles our M-Pesa accounts, produces monthly management reports, and keeps our KRA filings in order.',
    verifiedService: 'Monthly Bookkeeping Outsourcing',
    firmAssigned: 'Bodman Finance Associates',
    statsMetric: '65%',
    statsLabel: 'Savings vs Full-time In-house Hire',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
  },
];
