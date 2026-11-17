import { BillingPeriod, Currency } from '../types';

export type PaymentRegionId =
  | 'west_africa'
  | 'east_africa'
  | 'south_africa'
  | 'other_africa'
  | 'global';

export type PaymentGatewayId =
  // Nigeria and West Africa
  | 'paystack'
  | 'flutterwave'
  | 'transactpay'
  | 'monnify'
  | 'opay'
  | 'palmpay'
  | 'interswitch'
  | 'hubtel'
  | 'wave'
  // East Africa
  | 'mpesa'
  | 'peachpayments'
  | 'dpopay'
  | 'paystack_ea'
  | 'chapa'
  // South Africa & SADC
  | 'paystack_sa'
  | 'yoco'
  | 'pesapal'
  | 'transactpay_sa'
  | 'ozow'
  | 'chippercash'
  // Other Africa countries
  | 'fedapay'
  | 'cinetpay'
  | 'ligdicash'
  | 'payfort'
  | 'paynow'
  | 'fawry'
  | 'payzone'
  // Global
  | 'stripe'
  | 'razorpay'
  | 'paypal'
  | 'mollie'
  | 'twocheckout'
  | 'adyen'
  | 'square'
  | 'klarna'
  | 'revolut';

export interface PaymentGatewayInfo {
  id: PaymentGatewayId;
  name: string;
  region: PaymentRegionId;
  regionName: string;
  countries: string[];
  flag: string;
  badge: string;
  tagline: string;
  popular?: boolean;
  supportedMethods: string[];
  supportedCurrencies?: string[];
  settlementTime?: string;
  integrationProtocol?: string;
  developerDocsUrl?: string;
  fields: {
    type: 'card' | 'phone_stk' | 'virtual_account' | 'instant_eft' | 'wallet' | 'upi' | 'bnpl';
    label: string;
    placeholder?: string;
    helperText?: string;
  };
  qrSupport?: {
    supported: boolean;
    standardName: string;
    compatibleApps: string[];
    brandColor: string;
    instructions: string;
  };
}

export interface CartItem {
  id: string; // unique item id
  planId: string; // starter, professional, business, enterprise
  planName: string;
  billingPeriod: BillingPeriod;
  basePriceNgn: number;
  quantity: number;
  addOns?: {
    extraBranches?: number; // ₦5,000/mo each
    extraWarehouses?: number; // ₦8,000/mo each
    priorityPhoneSla?: boolean; // ₦12,000/mo
  };
  volumeDetails?: {
    users: number;
    transactions: number;
  };
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 25 for 25%) or fixed NGN amount
  description: string;
  minSubtotalNgn?: number;
}

export interface CustomerBillingDetails {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  billingAddress: string;
  taxIdentificationNumber?: string; // Optional VAT/TIN
}

export interface OrderInvoiceReceipt {
  invoiceNumber: string;
  receiptNumber: string;
  transactionReference: string;
  date: string;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
  customer: CustomerBillingDetails;
  items: CartItem[];
  currency: Currency;
  subtotalNgn: number;
  planSavingsNgn: number;
  promoCode?: string;
  promoDiscountNgn: number;
  netTaxableAmountNgn: number;
  vatRatePercent: number; // Applied statutory tax rate (e.g. 7.5, 16.0, 21.0, 0.0)
  vatAmountNgn: number; // Statutory tax amount in NGN baseline
  totalPaidNgn: number;
  paymentGateway: PaymentGatewayInfo;
  paymentMethodUsed: string;
  taxAuthority?: string;
  taxSchemeName?: string;
  taxBreakdown?: Array<{ name: string; ratePercent: number; amountNgn: number }>;
  isTaxExempt?: boolean;
}
