export type BillingPeriod = 'monthly' | 'quarterly' | 'bi-yearly' | 'yearly';
export type Currency = string;

export type Language = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
  rateFromNgn: number;
  locale: string;
  region: string;
  country?: string;
  isDefault?: boolean;
  prefix?: boolean;
}

export interface PlanFeature {
  text: string;
  isIncluded: boolean;
  isHighlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  usersLimit?: string;
  userCount?: number;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyPricePerMonth: number;
  customPricing?: boolean;
  customPricingText?: string;
  billingExplanation: string;
  savingsText?: string;
  features: string[];
  featureTooltips?: Record<string, string>;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'popular';
  secondaryCtaText?: string;
  bestFor: string;
}

export interface ComparisonFeature {
  name: string;
  tooltip?: string;
  starter?: boolean | string;
  growth?: boolean | string;
  business?: boolean | string;
  premium?: boolean | string;
  enterprise?: boolean | string;
  superior?: boolean | string;
  ultimate?: boolean | string;
  ultimate_prime?: boolean | string;
  mega_org?: boolean | string;
  custom?: boolean | string;
  [key: string]: any;
}

export interface ComparisonCategory {
  category: string;
  description: string;
  tooltip?: string;
  parentCategory?: string;
  iconName?: string;
  features: ComparisonFeature[];
}

export interface Testimonial {
  name: string;
  role: string;
  business: string;
  city: string;
  country: string;
  industry: string;
  image: string;
  quote: string;
  rating: number;
  growthStat: string;
  videoDurationSec?: number;
  videoAspect?: '16:9' | '9:16';
  videoPoster?: string;
  videoUrl?: string;
  videoHeadline?: string;
  videoHighlights?: string[];
  planUsed?: string;
  verifiedTransactionVol?: string;
  flagEmoji?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Billing & Plans' | 'Features' | 'Security & Multi-branch' | 'Onboarding';
}

export interface RecommendationAnswer {
  size: string;
  need: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  context: string;
}

export interface BusinessCaseStudy {
  id: string;
  indexLabel: string;
  businessName: string;
  founderName: string;
  founderRole: string;
  city: string;
  country: string;
  sector: string;
  image: string;
  imageAlt: string;
  planId: string;
  planLabel: string;
  timeframe: string;
  headline: string;
  scaleJourney: {
    before: string;
    after: string;
  };
  challenge: string;
  solution: string;
  outcome: string;
  metrics: CaseStudyMetric[];
  modulesDeployed: string[];
  quote: string;
}

