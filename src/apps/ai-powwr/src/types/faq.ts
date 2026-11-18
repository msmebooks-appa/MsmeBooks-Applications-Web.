export type FeatureAvailability = 'Available' | 'Beta' | 'Planned' | 'Add-on' | 'Contact Sales';

export type PublicationStatus = 'Draft' | 'Technical Review' | 'Approved' | 'Published' | 'Archived';

export type UserRole = 'Admin' | 'Editor' | 'Reviewer' | 'Support Agent' | 'Visitor';

export type SupportedLocale = 'en' | 'fr' | 'pt' | 'es' | 'ar';

export interface LocalizedFaqContent {
  question?: string;
  shortAnswer?: string;
  detailedAnswer?: string;
  steps?: string[];
}

export interface FaqItemData {
  id: string;
  slug: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  steps?: string[];
  translations?: Partial<Record<SupportedLocale, LocalizedFaqContent>>;
  categoryId: string;
  subcategoryId?: string;
  industryIds?: string[];
  productModuleIds?: string[];
  keywords: string[];
  synonyms?: string[];
  relatedFaqIds: string[];
  relatedLandingPages?: { title: string; url: string }[];
  relatedTutorialUrls?: { title: string; url: string }[];
  marketApplicability?: string[]; // e.g. ['Global', 'Nigeria', 'Kenya', 'Ghana', 'South Africa']
  featureStatus: FeatureAvailability;
  subscriptionPlan: 'Free' | 'Enterprise' | 'Custom' | 'All Plans';
  displayOrder: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  publicationStatus: PublicationStatus;
  lastVerifiedDate: string;
  author: string;
  reviewer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  badge?: string;
  group: 'Core Platform' | 'Operations & Industry' | 'Billing & Growth' | 'Company & Support';
}

export interface IndustryDefinition {
  id: string;
  title: string;
  shortTitle: string;
  iconName: string;
  description: string;
  highlightBenefit: string;
}

export interface ProductModule {
  id: string;
  title: string;
  description: string;
}

export interface FaqFilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedIndustry: string | null;
  selectedModule: string | null;
  sortOrder: 'all' | 'popular' | 'recent';
  selectedRegion: string;
}

export interface SearchAnalyticEntry {
  query: string;
  count: number;
  foundResults: boolean;
  timestamp: string;
}
