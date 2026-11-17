export interface WalletTransaction {
  id: string;
  reference: string;
  type: 'credit' | 'debit';
  category: 'top_up' | 'booking_payment' | 'refund' | 'cashback';
  amountNGN: number;
  description: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentMethod?: string;
  bookingId?: string;
  bookingReference?: string;
  serviceTitle?: string;
  balanceAfterNGN: number;
}

export interface LinkedPaymentMethod {
  id: string;
  label: string;
  provider: string;
  last4: string;
  brand: string;
}

export interface SmartTopUpConfig {
  enabled: boolean;
  thresholdNGN: number;
  reloadAmountNGN: number;
  linkedMethodId: string;
  lastAutoReloadAt?: string;
  lastAutoReloadAmountNGN?: number;
}

export interface WalletState {
  balanceNGN: number;
  currency: string;
  lastUpdated: string;
  transactions: WalletTransaction[];
  smartTopUp?: SmartTopUpConfig;
  linkedMethods?: LinkedPaymentMethod[];
}
