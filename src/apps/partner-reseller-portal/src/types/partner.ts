export type PartnerLevelType = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface PartnerLevelInfo {
  name: PartnerLevelType;
  commissionRate: number; // e.g. 15, 20, 30, 40
  targetAudience: string;
  minActiveClients: number;
  highlightBenefit: string;
  benefits: string[];
  qualifications: string;
}

export type CategoryGroupId = 
  | 'accounting'
  | 'technology'
  | 'business_dev'
  | 'education'
  | 'digital_strategic';

export interface PartnerSubcategory {
  id: string;
  name: string;
  description: string;
  idealProfile: string;
  permittedActivities: string[];
  potentialBenefits: string[];
  isActive?: boolean;
}

export interface PartnerCategoryGroup {
  id: CategoryGroupId;
  title: string;
  iconName: string;
  badge: string;
  summary: string;
  subcategories: PartnerSubcategory[];
}

export interface AgreementArticle {
  number: number;
  title: string;
  category: 'Parties & Scope' | 'Commercial & Commission' | 'Rights & Compliance' | 'Legal & Governance';
  summary: string;
  content: string;
}

export interface AgreementSchedule {
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  title: string;
  subtitle: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

export interface CustomerReferral {
  id: string;
  clientName: string;
  businessType: string;
  country: string;
  plan: 'Starter' | 'Growth' | 'Enterprise POS & Inventory' | 'Multi-Branch Suite';
  mrr: number; // in USD
  commissionRate: number; // %
  monthlyCommission: number;
  dateAdded: string;
  status: 'Active' | 'Trial' | 'Churned';
}

export interface CommissionPayout {
  id: string;
  period: string;
  grossCommission: number;
  deductions: number;
  netPayout: number;
  status: 'Paid' | 'Processing' | 'Pending Approval';
  payoutDate: string;
  paymentMethod: string;
  reference: string;
}

export interface SignedAgreementRecord {
  applicationId: string;
  partnerName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  website?: string;
  primaryCategory: string;
  secondaryCategory?: string;
  assignedTier: PartnerLevelType;
  agreementVersion: string;
  signedAt: string;
  ipAddress: string;
  signatureDataUrl?: string;
  registrationNumber?: string;
  taxId?: string;
  status: 'Pending Review' | 'Approved' | 'Verified Active' | 'Declined';
}

export interface PartnerResourceItem {
  id: string;
  title: string;
  category: 'Sales & Presentation' | 'Marketing Creatives' | 'Product Guides' | 'Certification';
  format: 'PDF' | 'PPTX' | 'ZIP' | 'MP4';
  size: string;
  description: string;
  downloadUrl: string;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Commissions' | 'Legal & Compliance' | 'Implementation';
  question: string;
  answer: string;
}
