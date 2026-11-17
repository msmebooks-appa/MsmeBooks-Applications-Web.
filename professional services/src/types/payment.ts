export type PaymentGatewayId = 
  // Nigeria & West Africa
  | 'paystack'
  | 'flutterwave'
  | 'transactpay'
  | 'monnify'
  // East Africa
  | 'mpesa'
  | 'peachpayments'
  | 'dpopay'
  // South Africa
  | 'yoco'
  | 'pesapal'
  | 'ozow'
  // Other Africa countries
  | 'fedapay'
  | 'cinetpay'
  | 'ligdicash'
  | 'payfort'
  | 'paynow'
  // Global & International
  | 'stripe'
  | 'razorpay'
  | 'paypal'
  | 'mollie'
  | 'twocheckout';

export type PaymentRegionKey = 
  | 'Nigeria & West Africa'
  | 'East Africa'
  | 'South Africa'
  | 'Other Africa Countries'
  | 'Global & International';

export interface PaymentGateway {
  id: PaymentGatewayId;
  name: string;
  tagline: string;
  region: PaymentRegionKey;
  supportedCurrencies: string[];
  supportedMethods: string[];
  popularCountries: string[];
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconType: 'card' | 'mobile_money' | 'bank' | 'global' | 'wallet';
  features: string[];
}

export interface PaymentCheckoutResult {
  gatewayId: PaymentGatewayId;
  gatewayName: string;
  transactionRef: string;
  amountFormatted: string;
  status: 'succeeded' | 'pending' | 'failed';
  channel: string;
  paidAt: string;
  customerEmail?: string;
  customerName?: string;
}

export interface ExtraModule {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceMonthlyNGN: number;
  badge?: string;
  category: 'Operations' | 'Compliance' | 'Retail' | 'Finance' | 'Communication';
  icon: string;
  includedFeatures: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyNGN: number;
  priceAnnualMonthlyNGN: number; // 20% discount when billed yearly
  popular?: boolean;
  tier: string;
  targetAudience: string;
  userSeats: string;
  countryCoverage: string;
  directoryBadges: string[];
  features: string[];
  recommendedModules?: string[];
}

export interface SubscriptionInvoiceReceipt {
  invoiceNumber: string;
  receiptNumber: string;
  issuedAt: string;
  dueDate: string;
  paidAt: string;
  status: 'Paid' | 'Issued' | 'Pending';
  customer: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    taxIdOrTIN?: string;
    practiceLicenseNumber?: string;
  };
  partnerDetails?: {
    tierName: string;
    countryCoverage: string;
    directoryBadges: string[];
    partnerRosterSize: string;
  };
  plan: {
    id: string;
    name: string;
    billingCycle: 'Monthly' | 'Annual';
    basePriceNGN: number;
  };
  extraModules?: {
    id: string;
    name: string;
    priceNGN: number;
  }[];
  pricing: {
    subtotalBeforeDiscountNGN: number;
    promoCodeApplied?: string;
    discountPercent?: number;
    discountAmountNGN: number;
    subtotalAfterDiscountNGN: number;
    vatRatePercent: number; // 7.5%
    vatAmountNGN: number; // 7.5% exclusive VAT
    totalAmountPaidNGN: number;
    currency: string;
  };
  payment: {
    gatewayId: PaymentGatewayId;
    gatewayName: string;
    transactionReference: string;
    channelUsed: string;
    status: 'Verified & Cleared';
  };
}
