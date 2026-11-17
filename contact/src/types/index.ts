export type EnquiryType =
  | 'General Enquiry'
  | 'Sales & Pricing'
  | 'Request Product Demo'
  | 'Technical Support'
  | 'Accounting & Bookkeeping'
  | 'POS & Inventory'
  | 'Hotel & Hospitality Solutions'
  | 'Integrations & API'
  | 'Reseller / Distributor Partnership'
  | 'Accountant / Bookkeeper Partnership'
  | 'Enterprise Solutions'
  | 'Billing & Subscription'
  | 'Other Enquiries';

export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  isAfrican?: boolean;
  example?: string;
  region?: 'Africa' | 'Europe' | 'Americas' | 'Asia' | 'Oceania' | 'Other';
}

export interface ContactFormData {
  fullName: string;
  companyName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  industry: string;
  enquiryType: EnquiryType;
  subject: string;
  message: string;
  consent: boolean;
  attachmentName?: string;
  attachmentSize?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'all' | 'sales' | 'support' | 'partnerships';
  actionLabel?: string;
  actionEnquiryType?: EnquiryType;
}

export interface PanAfricanMarket {
  country: string;
  capital: string;
  hub: string;
  currency: string;
  currencySymbol: string;
  specialization: string;
  taxCompliance: string;
  description: string;
}
