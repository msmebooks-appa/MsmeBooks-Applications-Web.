export type CurrencyCode = 'USD' | 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'UGX' | 'TZS' | 'RWF' | 'EUR' | 'GBP' | 'XOF' | 'EGP' | 'ZWL';

export type RegionKey = 'west_africa' | 'east_africa' | 'southern_africa' | 'other_africa' | 'global';

export interface CountryInfo {
  code: string;
  name: string;
  region: RegionKey;
  currency: CurrencyCode;
  currencySymbol: string;
  flag: string;
  defaultGateways: string[];
}

export type BillingCycle = 'monthly' | 'quarterly' | 'bi-yearly' | 'annual';

export interface ServiceCategoryItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  category: 'bookkeeping' | 'accounting' | 'payroll' | 'hr' | 'tax' | 'bpo';
  deliverables: string[];
  indicativeScope: string;
  typicalClient: string;
  sla: string;
  baseStartingPriceUSD: number;
}

export interface IndustryItem {
  id: string;
  name: string;
  iconName: string;
  challenges: string[];
  recommendedServices: string[];
  expectedDeliverables: string[];
  softwareIntegrations: string[];
  suggestedPackage: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  targetAudience: string;
  badge?: string;
  isPopular?: boolean;
  basePriceUSD: {
    monthly: number;
    quarterly: number;
    'bi-yearly': number;
    annual: number;
  };
  features: string[];
  excludedFeatures: string[];
  limits: {
    maxEmployees: number;
    monthlyTransactions: number;
    branches: number;
    reportsFrequency: string;
  };
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  category: 'Accounting' | 'Bookkeeping' | 'Payroll' | 'HR' | 'Tax & Compliance' | 'Virtual CFO';
  country: string;
  location: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  credentials: string[];
  languages: string[];
  hourlyRateUSD: number;
  fixedRateUSD: number;
  fixedPackageScope?: string;
  availability: 'Available Now' | 'Taking New Clients' | 'Limited Availability';
  verified: boolean;
  bio: string;
  servicesOffered: string[];
  avatarUrl: string;
}

export interface PaymentGatewayOption {
  id: string;
  name: string;
  logo: string;
  regions: RegionKey[];
  supportedCurrencies: CurrencyCode[];
  paymentMethods: string[];
  badge?: string;
}

export interface DeliverableTask {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Under Review' | 'Scheduled';
  assignedTo: string;
  documentCount: number;
}

export interface FinancialReportDoc {
  id: string;
  title: string;
  period: string;
  dateGenerated: string;
  type: 'P&L Statement' | 'Balance Sheet' | 'Cashflow' | 'Management Accounts' | 'Payroll Register' | 'Tax Filing';
  status: 'Approved' | 'Ready for Review' | 'Archived';
  fileSize: string;
}

export interface ComplianceDeadline {
  id: string;
  title: string;
  authority: string;
  country: string;
  dueDate: string;
  status: 'Compliant' | 'Pending Filing' | 'Upcoming';
  type: 'VAT' | 'PAYE' | 'Pension' | 'WHT' | 'Annual Returns';
}

export interface SlaDeliverableItem {
  id: string;
  label: string;
  completed: boolean;
}

export type SlaRiskLevel = 'critical' | 'warning' | 'on_track' | 'completed';

export interface SlaMilestone {
  id: string;
  phase: string;
  title: string;
  desc: string;
  owner: string;
  dueDate: string;
  daysRemaining: number;
  slaTargetHours: number;
  status: 'Completed' | 'In Progress' | 'Under Review' | 'Scheduled';
  percent: number;
  dependsOn: string[];
  deliverables: SlaDeliverableItem[];
  completedAt?: string;
}

export interface SlaNotificationEvent {
  id: string;
  milestoneId: string;
  milestoneTitle: string;
  phase: string;
  owner: string;
  unblockedTitles: string[];
  timestamp: string;
}

