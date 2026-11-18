export interface StoryMetric {
  label: string;
  metric: string;
  context: string;
  verified: boolean;
  baseline?: string;
  measurementPeriod?: string;
}

export interface StoryModuleSolution {
  module: string;
  role: string;
  details: string;
  valueDelivered: string;
}

export interface ImplementationPhase {
  phase: number;
  title: string;
  duration: string;
  description: string;
}

export interface CustomerTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  isApproved: boolean;
  avatarInitials?: string;
}

export interface ChartMetric {
  name: string;
  category: string;
  before: number;
  after: number;
  unit: string;
  efficiencyGain: number; // e.g. 75 represents +75%
  timeSavedDescription?: string;
}

export interface SuccessStory {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  industry: string;
  categoryKey: string;
  businessProfile: string;
  isIllustrative: boolean;
  verificationStatus: 'illustrative' | 'verified_customer';
  region: string;
  businessSize: string;
  branchCount: string;
  challenge: string;
  challengeFull: string[];
  solution: string;
  solutionFull: StoryModuleSolution[];
  outcome: string;
  outcomeMetrics: StoryMetric[];
  chartMetrics?: ChartMetric[];
  modules: string[];
  timelinePhases: ImplementationPhase[];
  whyNeeded: string[];
  customerOverview: {
    type: string;
    model: string;
    size: string;
    locations: string;
    background: string;
  };
  testimonial?: CustomerTestimonial;
  lessonsLearned: string[];
  featured: boolean;
  publishedAt: string;
  status: 'published' | 'draft' | 'review' | 'archived';
  readingTime: string;
  visualTheme: 'supermarket' | 'restaurant' | 'hotel' | 'warehouse' | 'accounting' | 'fashion' | 'electronics' | 'pharmacy' | 'ecommerce' | 'logistics' | 'beauty' | 'enterprise';
}

export interface IndustryUseCase {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  iconName: string;
  heroSummary: string;
  commonChallenges: string[];
  msmeModules: {
    name: string;
    description: string;
    highlight: string;
  }[];
  dailyWorkflows: {
    time: string;
    step: string;
    description: string;
  }[];
  practicalScenarios: {
    scenarioTitle: string;
    situation: string;
    msmeAction: string;
    impact: string;
  }[];
  expectedBenefits: string[];
  relevantStorySlug?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  role: string;
  companyName: string;
  industry: string;
  region: string;
  businessSize: string;
  modulesUsed: string[];
  rating: number; // 5
  quote: string;
  detailedFeedback: string;
  isVerified: boolean;
  date: string;
  linkedStorySlug?: string;
}
