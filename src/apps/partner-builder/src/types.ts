export type PartnerTierId = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PartnerTierInfo {
  id: PartnerTierId;
  name: string;
  commissionRate: number; // e.g. 15, 20, 30, 40
  color: string;
  metallicTheme: string;
  badgeGradient: string;
  accentBorder: string;
  tagline: string;
  minReferrals: string;
  recommendedFor: string;
}

export type CategoryGroupId = 'finance' | 'technology' | 'advisory' | 'retail';

export interface PartnerCategory {
  id: string;
  title: string;
  group: CategoryGroupId;
  shortDesc: string;
  opportunities: string[];
  icon: string;
}

export interface CertifiedPartner {
  id: string;
  partnerCode: string; // e.g. MSME-PT-8421
  companyName: string;
  country: string;
  countryCode: string;
  state?: string;
  city: string;
  tier: PartnerTierId;
  category: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  yearsActive: number;
  services: string[];
  industrySpecialisation: string[];
  summary: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  certifiedSince: string;
  certifications: {
    title: string;
    certId: string;
    issueDate: string;
    expiryDate: string;
  }[];
}

export interface PartnerApplicationForm {
  partnerType: string;
  companyName: string;
  regNumber: string;
  country: string;
  city: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  yearsInBusiness: string;
  currentClientsCount: string;
  softwareExperience: string;
  partnershipInterests: string[];
  acceptedPartnerAgreement: boolean;
  acceptedCommissionPolicy: boolean;
  acceptedPrivacyPolicy: boolean;
}

export interface CommissionCalculation {
  tier: PartnerTierId;
  commissionPercentage: number;
  clientsCount: number;
  avgMonthlySubscription: number;
  retentionMonths: number;
  monthlyCommission: number;
  annualCommission: number;
  lifetimeCommission: number;
}

export type LeadStage = 'submitted' | 'demo' | 'trial' | 'implementation' | 'converted' | 'at_risk';
export type LeadConversionStatus = 'new' | 'contacted' | 'won' | 'lost';

export interface ReferredLead {
  id: string;
  clientName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  plan: string;
  monthlySpendEst: number;
  stage: LeadStage;
  conversionStatus?: LeadConversionStatus;
  daysInStage: number;
  lastTouchpoint: string;
  nextAction: string;
  submittedDate: string;
  partnerRate: number; // e.g. 30
}

export interface LeadTimeDataPoint {
  period: string;
  date: string;
  new: number;
  contacted: number;
  won: number;
  lost: number;
  total: number;
  conversionRate: number; // percentage e.g. 72.5
  wonRevenueUsd: number;
}

export type NotificationType = 'payout' | 'lead' | 'conversion' | 'credential' | 'milestone';

export interface PartnerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  amount?: string;
}

export interface SuccessStory {
  name: string;
  founder: string;
  type: string;
  location: string;
  country: string;
  countryFlag: string;
  tier: string;
  results: string[];
  quote: string;
  imageType: string;
  imageUrl?: string;
}
