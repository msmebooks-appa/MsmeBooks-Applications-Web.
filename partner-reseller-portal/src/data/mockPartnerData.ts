import { CustomerReferral, CommissionPayout, PartnerResourceItem, SignedAgreementRecord } from '../types/partner';

export const INITIAL_SIGNED_PARTNER: SignedAgreementRecord = {
  applicationId: 'MSME-PRT-2026-8942',
  partnerName: 'Olufemi Babatunde, FCA',
  businessName: 'Apex Advisory & Cloud Accounting Services',
  email: 'femi@apexadvisory.co',
  phone: '+234 803 555 0192',
  country: 'Nigeria',
  city: 'Lagos (Victoria Island)',
  website: 'https://apexadvisory.co',
  primaryCategory: 'Professional Accountants',
  secondaryCategory: 'Tax Consultants',
  assignedTier: 'Gold',
  agreementVersion: 'v2026.4',
  signedAt: '2026-08-14 11:24:00 UTC',
  ipAddress: '102.89.42.115 (Lagos, NG)',
  registrationNumber: 'RC-1849204',
  taxId: 'TIN-99281744-0001',
  status: 'Verified Active'
};

export const INITIAL_REFERRALS: CustomerReferral[] = [
  {
    id: 'ref-101',
    clientName: 'Savannah Superstores Ltd',
    businessType: 'Multi-Store Retail & Supermarket',
    country: 'Kenya',
    plan: 'Multi-Branch Suite',
    mrr: 180,
    commissionRate: 30,
    monthlyCommission: 54,
    dateAdded: '2026-02-12',
    status: 'Active'
  },
  {
    id: 'ref-102',
    clientName: 'Zenith Logistics & Haulage',
    businessType: 'Supply Chain & Freight Services',
    country: 'Nigeria',
    plan: 'Enterprise POS & Inventory',
    mrr: 120,
    commissionRate: 30,
    monthlyCommission: 36,
    dateAdded: '2026-03-05',
    status: 'Active'
  },
  {
    id: 'ref-103',
    clientName: 'Cape Craft Breweries & Taproom',
    businessType: 'Hospitality & Beverage Manufacturing',
    country: 'South Africa',
    plan: 'Growth',
    mrr: 75,
    commissionRate: 30,
    monthlyCommission: 22.5,
    dateAdded: '2026-04-18',
    status: 'Active'
  },
  {
    id: 'ref-104',
    clientName: 'Accra MedPlus Pharmacy Chain',
    businessType: 'Pharmaceutical Retail (4 Outlets)',
    country: 'Ghana',
    plan: 'Multi-Branch Suite',
    mrr: 210,
    commissionRate: 30,
    monthlyCommission: 63,
    dateAdded: '2026-05-22',
    status: 'Active'
  },
  {
    id: 'ref-105',
    clientName: 'Nile Agro Inputs Distribution',
    businessType: 'Wholesale Agriculture & Fertilizer',
    country: 'Uganda',
    plan: 'Growth',
    mrr: 85,
    commissionRate: 30,
    monthlyCommission: 25.5,
    dateAdded: '2026-06-10',
    status: 'Active'
  },
  {
    id: 'ref-106',
    clientName: 'Kigali Artisan Roasters',
    businessType: 'Specialty Coffee & Bakery',
    country: 'Rwanda',
    plan: 'Starter',
    mrr: 45,
    commissionRate: 30,
    monthlyCommission: 13.5,
    dateAdded: '2026-07-02',
    status: 'Active'
  },
  {
    id: 'ref-107',
    clientName: 'AfriTech Gadgets & Repair Hub',
    businessType: 'Electronics & Device Service',
    country: 'Nigeria',
    plan: 'Growth',
    mrr: 75,
    commissionRate: 30,
    monthlyCommission: 22.5,
    dateAdded: '2026-08-19',
    status: 'Active'
  },
  {
    id: 'ref-108',
    clientName: 'Baobab Organic Beauty Lab',
    businessType: 'Cosmetics & E-Commerce Retail',
    country: 'Senegal',
    plan: 'Starter',
    mrr: 45,
    commissionRate: 30,
    monthlyCommission: 13.5,
    dateAdded: '2026-09-08',
    status: 'Trial'
  }
];

export const INITIAL_PAYOUTS: CommissionPayout[] = [
  {
    id: 'PAY-2026-09',
    period: 'September 2026',
    grossCommission: 237.00,
    deductions: 0.00,
    netPayout: 237.00,
    status: 'Paid',
    payoutDate: '2026-10-24',
    paymentMethod: 'Direct Bank Wire (Access Bank PLC)',
    reference: 'MSME-W-98214'
  },
  {
    id: 'PAY-2026-08',
    period: 'August 2026',
    grossCommission: 214.50,
    deductions: 0.00,
    netPayout: 214.50,
    status: 'Paid',
    payoutDate: '2026-09-23',
    paymentMethod: 'Direct Bank Wire (Access Bank PLC)',
    reference: 'MSME-W-87103'
  },
  {
    id: 'PAY-2026-07',
    period: 'July 2026',
    grossCommission: 189.00,
    deductions: 0.00,
    netPayout: 189.00,
    status: 'Paid',
    payoutDate: '2026-08-24',
    paymentMethod: 'Direct Bank Wire (Access Bank PLC)',
    reference: 'MSME-W-76492'
  },
  {
    id: 'PAY-2026-10',
    period: 'October 2026 (Current MTD)',
    grossCommission: 250.50,
    deductions: 0.00,
    netPayout: 250.50,
    status: 'Pending Approval',
    payoutDate: '2026-11-25 (Scheduled)',
    paymentMethod: 'Direct Bank Wire (Access Bank PLC)',
    reference: 'PENDING-RECONCILIATION'
  }
];

export const INITIAL_RESOURCES: PartnerResourceItem[] = [
  {
    id: 'res-1',
    title: 'MsmeBooks Enterprise Solution Deck 2026',
    category: 'Sales & Presentation',
    format: 'PPTX',
    size: '18.4 MB',
    description: 'Comprehensive 32-slide presentation detailing accounting, POS, multi-branch inventory, and VAT compliance for SME pitches.',
    downloadUrl: '#'
  },
  {
    id: 'res-2',
    title: 'Retail POS & Accounting Capability One-Pager',
    category: 'Sales & Presentation',
    format: 'PDF',
    size: '2.1 MB',
    description: 'Executive summary comparison chart showing features, hardware compatibility, and pricing vs legacy desktop software.',
    downloadUrl: '#'
  },
  {
    id: 'res-3',
    title: 'Authorised Partner Co-Branding & Media Kit',
    category: 'Marketing Creatives',
    format: 'ZIP',
    size: '42.8 MB',
    description: 'Vector SVG & PNG logos (Corporate Blue, Lemon Green, White), partner badges, fonts, and brand usage cheat sheet.',
    downloadUrl: '#'
  },
  {
    id: 'res-4',
    title: 'Social Media & LinkedIn Campaign Creatives Pack',
    category: 'Marketing Creatives',
    format: 'ZIP',
    size: '34.5 MB',
    description: 'High-converting social graphics tailored for accountants, retail consultants, and business advisors.',
    downloadUrl: '#'
  },
  {
    id: 'res-5',
    title: 'SME Migration & Chart of Accounts Setup Guide',
    category: 'Product Guides',
    format: 'PDF',
    size: '4.8 MB',
    description: 'Step-by-step workbook for migrating client historical balances, opening inventory, customer ledgers, and bank feeds.',
    downloadUrl: '#'
  },
  {
    id: 'res-6',
    title: 'Hardware Compatibility Matrix (POS & Printers)',
    category: 'Product Guides',
    format: 'PDF',
    size: '1.9 MB',
    description: 'Tested and certified Bluetooth, USB, and Ethernet thermal printers, barcode scanners, and Android POS handheld devices.',
    downloadUrl: '#'
  }
];

export const INITIAL_PENDING_APPLICATIONS: SignedAgreementRecord[] = [
  {
    applicationId: 'MSME-PRT-2026-9102',
    partnerName: 'Kiplagat Chebet',
    businessName: 'Great Rift Digital POS & Retail Systems',
    email: 'k.chebet@greatriftdigital.co.ke',
    phone: '+254 712 345 678',
    country: 'Kenya',
    city: 'Nairobi',
    website: 'https://greatriftdigital.co.ke',
    primaryCategory: 'POS Hardware Dealers',
    secondaryCategory: 'Systems Integrators',
    assignedTier: 'Bronze',
    agreementVersion: 'v2026.4',
    signedAt: '2026-10-22 14:15:30 UTC',
    ipAddress: '197.232.88.42 (Nairobi, KE)',
    registrationNumber: 'BN-847291',
    taxId: 'P051839201Z',
    status: 'Pending Review'
  },
  {
    applicationId: 'MSME-PRT-2026-9103',
    partnerName: 'Chiamaka Eze & Partners',
    businessName: 'Eze & Associates Chartered Accountants',
    email: 'chiamaka@ezeaccounting.ng',
    phone: '+234 802 888 1290',
    country: 'Nigeria',
    city: 'Port Harcourt',
    website: 'https://ezeaccounting.ng',
    primaryCategory: 'Professional Accountants',
    secondaryCategory: 'Tax Consultants',
    assignedTier: 'Silver',
    agreementVersion: 'v2026.4',
    signedAt: '2026-10-21 09:30:12 UTC',
    ipAddress: '102.89.65.19 (Port Harcourt, NG)',
    registrationNumber: 'RC-381920',
    taxId: 'TIN-48201948-0001',
    status: 'Pending Review'
  },
  {
    applicationId: 'MSME-PRT-2026-9098',
    partnerName: 'Thabo Mokoena',
    businessName: 'Gauteng Enterprise Software Distribution',
    email: 'thabo@gautengsoftware.co.za',
    phone: '+27 82 456 7890',
    country: 'South Africa',
    city: 'Johannesburg',
    website: 'https://gautengsoftware.co.za',
    primaryCategory: 'Software Distributors',
    secondaryCategory: 'IT Implementation Companies',
    assignedTier: 'Gold',
    agreementVersion: 'v2026.4',
    signedAt: '2026-10-19 16:44:00 UTC',
    ipAddress: '41.13.201.78 (Johannesburg, ZA)',
    registrationNumber: '2022/491028/07',
    taxId: '9840291847',
    status: 'Verified Active'
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    timestamp: '2026-10-23 09:12:44 UTC',
    action: 'Agreement Acceptance Verified',
    actor: 'System / Cryptographic Validator',
    target: 'MSME-PRT-2026-9102 (Great Rift Digital)',
    details: 'Digital signature SHA-256 hash verified with IP 197.232.88.42'
  },
  {
    timestamp: '2026-10-22 17:05:10 UTC',
    action: 'Tier Upgraded to Gold',
    actor: 'Partnership Manager (Sarah O.)',
    target: 'MSME-PRT-2026-8942 (Apex Advisory)',
    details: 'Validated 30+ active paying accounts; commission updated to 30%'
  },
  {
    timestamp: '2026-10-20 11:45:00 UTC',
    action: 'Monthly Payout Reconciled',
    actor: 'Finance Director (Kwame Mensah)',
    target: 'September 2026 Settlement Batch',
    details: 'Disbursed $4,820.00 USD across 24 qualified African partner firms'
  },
  {
    timestamp: '2026-10-18 14:22:15 UTC',
    action: 'Agreement Schedule Version Published',
    actor: 'Compliance Legal Officer',
    target: 'Schedule B & D (v2026.4)',
    details: 'Updated Schedule B payment window and logo clear-space rules'
  }
];
