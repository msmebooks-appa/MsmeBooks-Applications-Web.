export interface BookingRecord {
  id: string;
  reference: string;
  serviceId: string;
  serviceTitle: string;
  packageId?: string;
  packageName: string;
  packagePrice: string;
  providerId: string;
  providerName: string;
  providerType: string;
  consultationMode: 'Online Consultation' | 'Telephone' | 'Physical Office Visit' | 'On-site Business Visit';
  appointmentDate: string;
  timeSlot: string;
  customerName: string;
  businessName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  city: string;
  industry: string;
  businessSize: string;
  requirements: string;
  status: 'Confirmed' | 'Pending Review' | 'In Progress' | 'Completed';
  lifecycleStage?: 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed';
  createdAt: string;
  paymentStatus: 'Paid' | 'Quote Requested' | 'Pending Payment';
  paymentGateway?: string;
  paymentTransactionRef?: string;
  billingType?: 'hourly' | 'fixed';
  billingFrequency?: 'hourly' | 'days' | 'monthly' | 'quarterly' | 'bi-yearly' | 'yearly';
  billingUnits?: number;
  billingUnitType?: 'hours' | 'days' | 'months' | 'quarters' | 'terms' | 'years';
  billingRateDisplay?: string;
  billingBreakdown?: {
    frequency: 'hourly' | 'days' | 'monthly' | 'quarterly' | 'bi-yearly' | 'yearly';
    units: number;
    unitLabel: string;
    unitRateNGN: number;
    subtotalNGN: number;
    discountPercent: number;
    discountNGN: number;
    pointsDiscountNGN?: number;
    promoCodeApplied?: string;
    vatNGN: number;
    totalNGN: number;
  };
  pointsEarned?: number;
  batchItemsCount?: number;
  batchServices?: {
    serviceId: string;
    serviceTitle: string;
    packageName: string;
    price: string;
  }[];
  userRating?: number;
  userReviewText?: string;
  feedback?: string;
  reviewedAt?: string;
  userReviewTags?: string[];
  calendarSynced?: boolean;
  googleCalendarEventId?: string;
  googleCalendarHtmlLink?: string;
  milestones?: {
    id: string;
    name: string;
    completed: boolean;
    targetDate?: string;
  }[];
  milestoneProgressPercent?: number;
  deliverableChecklist?: DeliverableTask[];
}

export interface DeliverableTask {
  id: string;
  title: string;
  owner: 'Firm Deliverable' | 'Client Action';
  completed: boolean;
  dueLabel?: string;
  completedAt?: string;
  isCustom?: boolean;
}

export interface CartItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  packageId: string;
  packageName: string;
  packagePrice: string;
  billingType: 'hourly' | 'fixed';
  billingUnits: number;
  unitRateNGN: number;
  totalNGN: number;
  deliveryMode: string;
  imageUrl?: string;
  category?: string;
}

export interface LoyaltyVoucher {
  code: string;
  title: string;
  pointsCost: number;
  discountNGN: number;
  discountDisplay: string;
  minSpendNGN: number;
  used: boolean;
  expiresAt: string;
}

export interface AppliedBookingDiscount {
  code: string;
  title: string;
  discountNGN: number;
  discountDisplay: string;
  pointsSpent: number;
  serviceId?: string;
  serviceTitle?: string;
  appliedAt: string;
  minSpendNGN?: number;
}

export interface MsmePointsState {
  balance: number;
  lifetimeEarned: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  history: {
    id: string;
    description: string;
    points: number;
    type: 'earned' | 'redeemed';
    date: string;
    reference?: string;
  }[];
  activeVouchers: LoyaltyVoucher[];
}

export interface OnboardingProfile {
  businessName: string;
  structure: 'Sole Proprietorship' | 'Private Limited (LLC / Ltd)' | 'Partnership' | 'Non-Profit / NGO';
  revenueRange: string;
  country: string;
  city: string;
  industry: string;
  challenges: string[];
  teamSize: string;
  softwareUsed: string[];
}

export const INITIAL_DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: 'bkg-demo-1',
    reference: 'MSME-BK-9182',
    serviceId: 'srv-pos-retail-setup',
    serviceTitle: 'POS Hardware & Software Setup (Supermarkets & Retail)',
    packageName: 'Business Essentials',
    packagePrice: '₦95,000 / $80',
    providerId: 'firm-apex',
    providerName: 'Apex Cloud Systems & Implementations',
    providerType: 'Certified Implementation Partner',
    consultationMode: 'On-site Business Visit',
    appointmentDate: '2026-10-24',
    timeSlot: '10:00 AM - 12:00 PM',
    customerName: 'Adebayo Ogunlesi',
    businessName: 'GreenMart Stores Lekki',
    customerEmail: 'adebayo@greenmartng.com',
    customerPhone: '+234 803 456 7890',
    country: 'Nigeria',
    city: 'Lagos',
    industry: 'Retail & Supermarkets',
    businessSize: '11-50 Employees',
    requirements: 'Setting up 2 POS checkout points with thermal receipt printers and barcode scanners for newly renovated Lekki grocery store.',
    status: 'Completed',
    createdAt: '2026-10-18T14:20:00Z',
    paymentStatus: 'Paid',
    userRating: 5,
    userReviewText: 'Exceptional POS setup and staff coaching. Both lanes running smoothly with zero inventory sync errors!',
    feedback: 'Exceptional POS setup and staff coaching. Both lanes running smoothly with zero inventory sync errors!',
    reviewedAt: '2026-10-25T16:00:00Z',
    milestoneProgressPercent: 100,
    milestones: [
      { id: 'm1', name: 'Phase 1: Hardware & Network Diagnostics', completed: true, targetDate: '2026-10-24' },
      { id: 'm2', name: 'Phase 2: Product Catalogue & Barcode Import', completed: true, targetDate: '2026-10-24' },
      { id: 'm3', name: 'Phase 3: Cashier Tender & Printer Training', completed: true, targetDate: '2026-10-25' },
      { id: 'm4', name: 'Phase 4: Go-Live & Post-Launch Sign-off', completed: true, targetDate: '2026-10-25' },
    ],
  },
  {
    id: 'bkg-demo-2',
    reference: 'MSME-BK-4029',
    serviceId: 'srv-tax-advisory',
    serviceTitle: 'Corporate Tax Advisory & Annual Return Filing',
    packageName: 'Business Essentials',
    packagePrice: '₦150,000 / $125',
    providerId: 'firm-cedar',
    providerName: 'Cedar Professional Services Limited',
    providerType: 'Chartered Accounting Firm',
    consultationMode: 'Online Consultation',
    appointmentDate: '2026-10-26',
    timeSlot: '02:00 PM - 03:30 PM',
    customerName: 'Chioma Nwosu',
    businessName: 'Zenith Logistics Global',
    customerEmail: 'finance@zenithlogistics.com',
    customerPhone: '+234 812 345 6789',
    country: 'Nigeria',
    city: 'Port Harcourt',
    industry: 'Logistics & Transportation',
    businessSize: '5-10 Employees',
    requirements: 'Need capital allowance review and Company Income Tax filing for financial year ended December 2025.',
    status: 'In Progress',
    createdAt: '2026-10-17T09:15:00Z',
    paymentStatus: 'Paid',
    milestoneProgressPercent: 50,
    milestones: [
      { id: 'm1', name: 'Phase 1: Trial Balance & Source Docs Intake', completed: true, targetDate: '2026-10-26' },
      { id: 'm2', name: 'Phase 2: Capital Allowances & Tax Adjustments', completed: true, targetDate: '2026-10-29' },
      { id: 'm3', name: 'Phase 3: Draft CIT Computation & Review Meeting', completed: false, targetDate: '2026-11-04' },
      { id: 'm4', name: 'Phase 4: FIRS TaxPro-Max Electronic Submission', completed: false, targetDate: '2026-11-08' },
    ],
  },
  {
    id: 'bkg-demo-3',
    reference: 'MSME-BK-7531',
    serviceId: 'srv-tax-compliance-healthcheck',
    serviceTitle: 'Tax Compliance Health Check & Withholding Tax Audit',
    packageName: 'Business Growth',
    packagePrice: '₦185,000 / $155',
    providerId: 'firm-deloitte-partner',
    providerName: 'Kreston Pedabo Advisory Partners',
    providerType: 'Accredited Tax Consultants',
    consultationMode: 'Online Consultation',
    appointmentDate: '2026-11-06',
    timeSlot: '11:00 AM - 01:00 PM',
    customerName: 'Adebayo Ogunlesi',
    businessName: 'GreenMart Stores Lekki',
    customerEmail: 'adebayo@greenmartng.com',
    customerPhone: '+234 803 456 7890',
    country: 'Nigeria',
    city: 'Lagos',
    industry: 'Retail & Supermarkets',
    businessSize: '11-50 Employees',
    requirements: 'Comprehensive withholding tax reconciliation and tax exposure review ahead of quarterly filing.',
    status: 'Pending Review',
    createdAt: '2026-10-23T11:45:00Z',
    paymentStatus: 'Pending Payment',
  },
];
