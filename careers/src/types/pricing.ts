export type BillingCycle = 'monthly' | 'quarterly' | 'biyearly' | 'yearly';

export type PostingScope = 'all' | 'single' | 'bulk' | 'free';

export type PricingTargetAudience = 'all' | 'employer' | 'agency' | 'headhunter' | 'candidate';

export type PlanCategory = 'employer' | 'candidate';

export type Currency = string;

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  planCategory: 'employer' | 'candidate';
  targetAudience: 'employer' | 'agency' | 'headhunter' | 'candidate';
  postingScope?: 'single' | 'bulk' | 'free';
  jobPostCredits?: number | 'unlimited';
  applicationsLimitMonthly?: number | 'unlimited';
  activeDurationDays: number;
  popularBadge?: string;
  
  // Base monthly rate
  priceMonthlyUSD: number;
  // Quarterly (10% discount)
  priceQuarterlyUSD: number;
  // Bi-Yearly (18% discount)
  priceBiYearlyUSD: number;
  // Yearly (25% discount)
  priceYearlyUSD: number;

  features: string[];
  highlights: string[];
  ctaText: string;
  isPopular?: boolean;
}

export interface CheckoutOrder {
  planId: string;
  planName: string;
  planCategory: 'employer' | 'candidate';
  targetAudience: string;
  postingScope?: 'single' | 'bulk' | 'free';
  billingCycle: BillingCycle;
  quantity: number; // 1 for monthly, 12 for yearly (subscription term duration)
  currency: Currency;
  amount: number;
  savings: number;
  jobCredits?: number | 'unlimited';
  applicationsLimitMonthly?: number | 'unlimited';
}

