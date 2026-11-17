export type PartnerTierId = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PartnerTier {
  id: PartnerTierId;
  name: string;
  rate: number; // e.g. 0.15 for 15%
  rateDisplay: string;
  positioning: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  targetAudience: string;
  benefits: string[];
  proposedFeatures: string[];
  ctaLabel: string;
}

export interface PartnerCategory {
  id: string;
  name: string;
  sector: 'accounting' | 'technology' | 'advisory' | 'retail';
  sectorLabel: string;
  roleDescription: string;
  customerOpportunities: string;
  solutionsToPromote: string[];
  suggestedTier: PartnerTierId;
  suggestedTierLabel: string;
}

export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'KES'
  | 'ZAR'
  | 'GHS'
  | 'MAD'
  | 'XAF'
  | 'AED'
  | 'UGX'
  | 'TZS'
  | 'RWF'
  | 'ZMW'
  | 'EGP'
  | 'ZIP'
  | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  shortLabel: string;
  flag: string;
  exchangeRateToNGN: number; // 1 unit in NGN (e.g. 1 USD = 1480 NGN)
  defaultSubscription: number;
  minSubscription: number;
  maxSubscription: number;
  step: number;
  decimals: number;
  region: 'Africa' | 'Global' | 'Middle East';
}

export interface ReferralRecord {
  id: string;
  businessName: string;
  contactPerson: string;
  planName: string;
  monthlyValue: number;
  status: 'active' | 'trial' | 'pending' | 'churned';
  attributionDate: string;
  attributionSource: string;
  commissionEarnedToDate: number;
}

export interface CommissionTransaction {
  id: string;
  referralId: string;
  customerName: string;
  billingPeriod: string;
  grossAmount: number;
  rate: number;
  commissionAmount: number;
  currency: CurrencyCode;
  status: 'approved' | 'pending' | 'paid' | 'reversed';
  date: string;
  referenceNumber: string;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  currency: CurrencyCode;
  method: string;
  accountDetails: string;
  status: 'completed' | 'processing' | 'pending';
  referenceNumber: string;
}

export interface PartnerApplication {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  categoryId: string;
  preferredTier: PartnerTierId;
  website: string;
  networkSize: string;
  experience: string;
  proposal: string;
  agreementAccepted: boolean;
  privacyAccepted: boolean;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  // Leaderboard & performance metrics
  monthlyConversions?: number;
  monthlyRevenueNGN?: number;
  monthlyCommissionNGN?: number;
  growthMoM?: string;
  badgeTitle?: string;
  flagEmoji?: string;
  keyAchievement?: string;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'earnings' | 'payouts' | 'operations';
  question: string;
  answer: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'deck' | 'guide' | 'kit' | 'template';
  category: string;
  description: string;
  fileSize: string;
  badge?: string;
}

export interface CaseStudyItem {
  id: string;
  partnerName: string;
  organization: string;
  country: string;
  city: string;
  category: string;
  tier: string;
  avatarImg: string;
  challenge: string;
  solution: string;
  outcome: string;
  metric: string;
  metricLabel: string;
}
