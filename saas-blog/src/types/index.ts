export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  articlesCount: number;
  twitter?: string;
  linkedin?: string;
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  email: string;
  comment: string;
  createdAt: string;
  status: 'approved' | 'pending';
}

export interface ArticleShares {
  linkedin: number;
  x: number;
  whatsapp: number;
  facebook: number;
  copied?: number;
  total: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  industry: string;
  contentType: 'Articles' | 'Guides' | 'Tutorials' | 'Case Studies' | 'News' | 'Product Updates';
  author: Author;
  publishedAt: string;
  readTime: string;
  featuredImage: string;
  featuredImageCaption?: string;
  isFeatured?: boolean;
  views: number;
  likes: number;
  shares?: ArticleShares;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  tableOfContents: ArticleHeading[];
  content: string; // HTML or Markdown formatted content
  keyTakeaways?: string[];
  statsCard?: {
    value: string;
    label: string;
    description: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

export interface BusinessGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  modulesCount: number;
  image: string;
  keyTopics: string[];
}

export interface IndustryResource {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  keyCapabilities: string[];
  caseStudyHighlight: string;
  articleCount: number;
}

export interface CaseStudy {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  image: string;
  story: string;
  result: string;
  growthMetric: string;
  financialImpactNGN?: number;
  financialImpactLabel?: string;
  platformFeaturesUsed: string[];
}

export interface BlogAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  newsletterSubscribers: number;
  ctaClicks: number;
  topArticles: { title: string; views: number; category: string }[];
  searchQueries: { query: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  trafficSources: { source: string; percentage: number }[];
}
