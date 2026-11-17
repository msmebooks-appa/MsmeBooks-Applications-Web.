export type PartnerTierType = 'bronze' | 'silver' | 'partner' | 'platinum';

export interface CategoryItem {
  id: string;
  emoji: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  categoryGroup: 'Finance & Tax' | 'Technology & IT' | 'Advisory & Strategy' | 'Channels & Education';
  clientBenefits: string[];
  partnerRevenueModel: string;
  recommendedFor: string;
}

export interface CommissionTierItem {
  id: PartnerTierType;
  badge: string;
  name: string;
  percentage: number;
  percentageLabel: string;
  badgeIcon: string;
  forWhom: string;
  description: string;
  features: string[];
  ctaText: string;
  isDominant?: boolean;
  accentGradient: string;
  textColor: string;
}

export interface ComparisonRow {
  benefit: string;
  category: string;
  bronze: string | boolean;
  silver: string | boolean;
  partner: string | boolean;
  platinum: string | boolean;
  isKeyHighlight?: boolean;
}

export interface TimelineStep {
  step: string;
  title: string;
  summary: string;
  details: string;
  iconName: string;
  duration: string;
}

export interface DashboardClientRecord {
  id: string;
  name: string;
  industry: string;
  country: string;
  plan: string;
  monthlyFee: string;
  partnerCut: string;
  status: 'Active' | 'Onboarding' | 'Renewal Due';
  joinedDate: string;
}

export interface BenefitCard {
  id: string;
  title: string;
  description: string;
  highlight: string;
  iconName: string;
  metricLabel: string;
}

export interface EventItem {
  id: string;
  title: string;
  city: string;
  country: string;
  date: string;
  venue: string;
  attendees: string;
  type: 'Partner Summit' | 'Accounting Masterclass' | 'Fintech Expo' | 'SME Clinic';
  status: 'Upcoming' | 'Registration Open' | 'Featured';
  image: string;
}

export interface VideoItem {
  id: string;
  title: string;
  tag: 'Partner Stories' | 'Product Demo' | 'Accountant Experience' | 'SME Success Stories' | 'Partner Events';
  duration: string;
  presenter: string;
  thumbnail: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  quote: string;
  tier: string;
  metric: string;
  image: string;
}

export interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  firmName: string;
  location: string;
  before: string;
  solution: string;
  outcome: string;
  keyMetric: string;
  growthStats: { label: string; value: string }[];
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Commissions' | 'Support & Tools' | 'Requirements';
}
