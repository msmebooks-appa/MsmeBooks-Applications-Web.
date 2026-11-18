export type CurrencyCode = 
  | 'NGN' 
  | 'USD' 
  | 'GBP' 
  | 'EUR' 
  | 'KES' 
  | 'ZAR' 
  | 'GHS' 
  | 'MAD' 
  | 'XAF' 
  | 'AED' 
  | 'UGX' 
  | 'TZS' 
  | 'RWF' 
  | 'ZMW' 
  | 'EGP' 
  | 'ZIP';

export type PaymentMethod = 
  | 'Paystack'
  | 'Flutterwave'
  | 'Stripe'
  | 'PayPal'
  | 'Bank Transfer'
  | 'Mobile Money (M-Pesa/MTN/Airtel)'
  | 'Partner/Reseller Invoice';

export type RefundStage = 
  | 'submitted'
  | 'under_review'
  | 'additional_info'
  | 'approved'
  | 'declined'
  | 'processed';

export interface RefundAuditEntry {
  timestamp: string;
  actor: string;
  action: string;
  note: string;
}

export interface RefundRequest {
  id: string;
  referenceNumber: string;
  customerName: string;
  businessName: string;
  accountEmail: string;
  serviceType: string;
  invoiceReference: string;
  paymentDate: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  reason: string;
  detailedExplanation: string;
  attachmentName?: string;
  consentAccepted: boolean;
  stage: RefundStage;
  submittedAt: string;
  lastUpdatedAt: string;
  reviewerNotes?: string;
  gatewayTransactionId?: string;
  isOfflineQueued?: boolean;
  auditTrail: RefundAuditEntry[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Subscriptions' | 'Add-ons & Services' | 'Payment & Disputes' | 'Partners & Data';
}

export interface PolicySectionItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  badge?: string;
}
