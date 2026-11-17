export type PartnerLevel = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface VerificationInfo {
  verifiedDate: string;
  partnerId: string;
  trainingCompleted: boolean;
  trainingDate: string;
  businessIdentityVerified: boolean;
  partnerStatusVerified: boolean;
  servicesVerified: boolean;
  locationVerified: boolean;
}

export type SuccessStoryScale = 'Large-Scale Enterprise' | 'Mid-Market' | 'Small Business';

export interface ClientSuccessStory {
  businessName: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  result: string;
  metric?: string;
  image?: string;
  implementationScale?: SuccessStoryScale;
}

export type AvailabilityStatus = 'Accepting New Clients' | 'Currently Booked';

export type SchedulingLiveStatus = 
  | 'Available Now' 
  | 'Accepting Requests' 
  | 'Limited Slots Today' 
  | 'Currently Booked' 
  | 'In Consultation';

export interface LiveAvailability {
  partnerId: string;
  isAcceptingRequests: boolean;
  status: SchedulingLiveStatus;
  statusHeadline: string;
  availableSlotsToday: number;
  nextAvailableSlot: string;
  calendarProvider: 'Google Calendar' | 'Microsoft 365' | 'Cal.com' | 'MsmeBooks Direct';
  activeConsultantsOnline: number;
  lastSyncedTimestamp: number;
  responseTimeEst: string;
  instantBookingSupported: boolean;
  consultationFeeUSD?: number;
  isSyncing?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  level: PartnerLevel;
  commissionRate: number; // 40, 30, 20, 15
  verified: boolean;
  verification: VerificationInfo;
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  responseTime: string; // e.g., '< 1 hour', '< 2 hours', 'Within 24 hours'
  remoteSupport: boolean;
  availabilityStatus: AvailabilityStatus;
  businessSizeCoverage: ('Micro' | 'Small' | 'Medium' | 'Enterprise')[];
  partnerType: string;
  specialties: string[];
  services: string[];
  industries: string[];
  languages: string[];
  yearsExperience: number;
  businessesSupported: number;
  projectsCompleted: number;
  about: string;
  clientSuccessStories: ClientSuccessStory[];
  featured?: boolean;
  certifications?: string[];
  startingBudget?: string;
  minBudgetUSD?: number;
  budgetTier?: 'Budget (< $500)' | 'Mid-range ($500 - $1.5k)' | 'Growth ($1.5k - $3k)' | 'Enterprise ($3k+)';
  primaryServiceArea?: string;
  consultationRateUSD?: number;
  hourlyRateUSD?: number;
  typicalImplementationTime?: string; // e.g., '2–4 weeks'
  certificationAuthorities?: CertificationAuthority[];
  quickCallUrl?: string;
  meetingPlatform?: 'Google Meet' | 'Microsoft Teams' | 'Zoom';
}

export interface CertificationAuthority {
  id: string;
  name: string;
  acronym: string;
  issuerType: 'Accreditation Board' | 'Statutory Institute' | 'Professional Body' | 'Technology Alliance';
  credentialName: string;
  credentialId: string;
  verificationUrl: string;
  portalName: string;
  issuedYear: number;
  status: 'Active' | 'Verified' | 'Accredited';
  jurisdiction?: string;
  description?: string;
}

export interface FilterState {
  search: string;
  country: string;
  city: string;
  partnerType: string;
  industry: string;
  service: string;
  level: string;
  language: string;
  businessSize: string;
  remoteOnly: boolean;
  verifiedOnly: boolean;
  availability: string;
  sortBy: 'recommended' | 'rating' | 'businesses' | 'experience';
  quickFilters?: string[];
  successStoryScale?: string;
  skill?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  company: string;
  role: string;
  industry: string;
  country: string;
  countryFlag: string;
  serviceReceived: string;
  rating: number;
  date: string;
  testimonial: string;
  avatar: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon: string;
  description: string;
  image: string;
}

export interface CountryItem {
  name: string;
  code: string;
  flag: string;
  partnerCount: number;
  region: 'Africa' | 'Global';
  subRegion?: string;
  cities: string[];
}

export interface SmartMatchFormData {
  businessType: string;
  location: string;
  branches: string;
  servicesNeeded: string[];
  businessSize: string;
}

export interface ChatFilterCriteria {
  businessNeed?: string;
  budget?: string;
  location?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  criteria?: ChatFilterCriteria;
  recommendedPartners?: Partner[];
  suggestedPrompts?: string[];
  isThinking?: boolean;
}

export interface ChatAssistantResponse {
  assistantReply: string;
  recommendedPartnerIds: string[];
  extractedCriteria: ChatFilterCriteria;
  suggestedQuestions?: string[];
}

export type ReferralTargetType = 'business' | 'consultant';

export type ReferralStatus = 
  | 'Pending Verification' 
  | 'Demo & Discovery' 
  | 'Pilot Onboarding' 
  | 'Converted & Active' 
  | 'Consultant Certified';

export interface ReferralSubmission {
  id: string;
  partnerId: string;
  partnerName: string;
  type: ReferralTargetType;
  entityName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  industryOrSpecialty: string;
  sizeOrExperience: string;
  softwareNeeds?: string[];
  notes?: string;
  submittedAt: string;
  status: ReferralStatus;
  pointsAwarded: number;
  provisionalPoints: number;
  dealValueUSD?: number;
  lastUpdateDate: string;
}

export interface RewardOption {
  id: string;
  title: string;
  category: 'cash' | 'software' | 'event' | 'marketing' | 'leads';
  pointsRequired: number;
  cashEquivalentUSD: number;
  description: string;
  badge?: string;
  popular?: boolean;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  redeemedAt: string;
  status: 'Processing' | 'Completed' | 'Delivered';
  referenceCode: string;
}

export interface ReferralMilestone {
  id: string;
  targetCount: number;
  badgeTitle: string;
  headline: string;
  description: string;
  bonusPoints: number;
  perkSummary: string;
  badgeCode: string;
  tierColor: 'emerald' | 'amber' | 'blue' | 'purple';
}

export interface RewardTierBenefit {
  milestoneId: string;
  tierName: string;
  badgeCode: string;
  targetCount: number;
  tierColor: 'blue' | 'emerald' | 'amber' | 'purple';
  featuredListing: {
    title: string;
    description: string;
    placementLevel: string;
  };
  badgeUpgrade: {
    badgeName: string;
    level: string;
    designation: string;
    visualStyle: string;
  };
  subscriptionDiscount: {
    rate: string;
    appliesTo: string;
    annualSavingsEst: string;
  };
  pointMultiplier: {
    bonus: string;
    multiplier: string;
    impact: string;
  };
  executivePerks: string[];
}



