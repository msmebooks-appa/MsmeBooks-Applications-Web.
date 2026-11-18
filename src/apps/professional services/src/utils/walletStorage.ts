import {
  LinkedPaymentMethod,
  SmartTopUpConfig,
  WalletState,
  WalletTransaction,
} from '../types/wallet';
import { addAppNotification } from './notificationService';

const WALLET_STORAGE_KEY = 'msmebooks_wallet_state';

export const DEFAULT_LINKED_PAYMENT_METHODS: LinkedPaymentMethod[] = [
  {
    id: 'pm-paystack-card',
    label: 'Paystack Corporate Visa •••• 4022',
    provider: 'Paystack Auto-Debit',
    last4: '4022',
    brand: 'Visa',
  },
  {
    id: 'pm-access-nibss',
    label: 'Access Bank NIBSS Mandate •••• 8104',
    provider: 'NIBSS Direct Debit',
    last4: '8104',
    brand: 'Bank Mandate',
  },
  {
    id: 'pm-flutterwave-card',
    label: 'Flutterwave Mastercard •••• 9157',
    provider: 'Flutterwave Auto-Debit',
    last4: '9157',
    brand: 'Mastercard',
  },
];

export const DEFAULT_SMART_TOP_UP: SmartTopUpConfig = {
  enabled: false,
  thresholdNGN: 100000,
  reloadAmountNGN: 200000,
  linkedMethodId: 'pm-paystack-card',
};

export const INITIAL_WALLET_STATE: WalletState = {
  balanceNGN: 450000,
  currency: 'NGN',
  lastUpdated: new Date().toISOString(),
  linkedMethods: DEFAULT_LINKED_PAYMENT_METHODS,
  smartTopUp: DEFAULT_SMART_TOP_UP,
  transactions: [
    {
      id: 'tx-wal-101',
      reference: 'TXN-WAL-98214',
      type: 'credit',
      category: 'top_up',
      amountNGN: 300000,
      description: 'Pre-load Retainer Credits via Access Bank NIBSS Transfer',
      timestamp: '2026-10-15T10:30:00Z',
      status: 'Completed',
      paymentMethod: 'Direct Bank Transfer',
      balanceAfterNGN: 300000,
    },
    {
      id: 'tx-wal-102',
      reference: 'TXN-WAL-98215',
      type: 'credit',
      category: 'top_up',
      amountNGN: 250000,
      description: 'Pre-load Working Capital Credits via Paystack Visa Card',
      timestamp: '2026-10-18T14:15:00Z',
      status: 'Completed',
      paymentMethod: 'Paystack Card (•••• 4022)',
      balanceAfterNGN: 550000,
    },
    {
      id: 'tx-wal-103',
      reference: 'TXN-WAL-98216',
      type: 'debit',
      category: 'booking_payment',
      amountNGN: 100000,
      description: '1-Click Wallet Payment: Retail Supermarket POS Deployment (MSME-BK-8102)',
      timestamp: '2026-10-18T14:25:00Z',
      status: 'Completed',
      paymentMethod: 'MsmeBooks Wallet Credits',
      bookingId: 'bkg-demo-1',
      bookingReference: 'MSME-BK-8102',
      serviceTitle: 'Retail Supermarket POS Deployments',
      balanceAfterNGN: 450000,
    },
  ],
};

function normalizeWalletState(parsed: Partial<WalletState>): WalletState {
  return {
    balanceNGN: typeof parsed.balanceNGN === 'number' ? parsed.balanceNGN : INITIAL_WALLET_STATE.balanceNGN,
    currency: parsed.currency || 'NGN',
    lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_WALLET_STATE.transactions,
    linkedMethods:
      Array.isArray(parsed.linkedMethods) && parsed.linkedMethods.length > 0
        ? parsed.linkedMethods
        : DEFAULT_LINKED_PAYMENT_METHODS,
    smartTopUp: {
      ...DEFAULT_SMART_TOP_UP,
      ...(parsed.smartTopUp || {}),
    },
  };
}

export const getWalletState = (): WalletState => {
  if (typeof window === 'undefined') return INITIAL_WALLET_STATE;
  try {
    const raw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(INITIAL_WALLET_STATE));
      return INITIAL_WALLET_STATE;
    }
    return normalizeWalletState(JSON.parse(raw));
  } catch (err) {
    console.error('Failed to parse wallet state:', err);
    return INITIAL_WALLET_STATE;
  }
};

export const saveWalletState = (state: WalletState): void => {
  if (typeof window === 'undefined') return;
  try {
    const normalized = normalizeWalletState(state);
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('msmebooks_wallet_changed', { detail: normalized }));
  } catch (err) {
    console.error('Failed to save wallet state:', err);
  }
};

export const evaluateAndRunSmartTopUp = (
  baseState?: WalletState
): {
  triggered: boolean;
  state: WalletState;
  transaction?: WalletTransaction;
  methodLabel?: string;
} => {
  const current = normalizeWalletState(baseState || getWalletState());
  const config = current.smartTopUp;

  if (!config || !config.enabled) {
    return { triggered: false, state: current };
  }

  if (config.thresholdNGN <= 0 || config.reloadAmountNGN <= 0) {
    return { triggered: false, state: current };
  }

  if (current.balanceNGN >= config.thresholdNGN) {
    return { triggered: false, state: current };
  }

  const methods = current.linkedMethods || DEFAULT_LINKED_PAYMENT_METHODS;
  const linkedMethod =
    methods.find(m => m.id === config.linkedMethodId) || methods[0];
  const methodLabel = linkedMethod ? linkedMethod.label : 'Linked Payment Card';

  const reloadAmount = config.reloadAmountNGN;
  const newBalance = current.balanceNGN + reloadAmount;
  const nowIso = new Date().toISOString();
  const refCode = `TXN-AUTO-${Math.floor(10000 + Math.random() * 90000)}`;

  const autoTx: WalletTransaction = {
    id: `tx-wal-auto-${Date.now()}`,
    reference: refCode,
    type: 'credit',
    category: 'top_up',
    amountNGN: reloadAmount,
    description: `Smart Top-Up Auto-Reload via ${methodLabel} (below ₦${config.thresholdNGN.toLocaleString()} threshold)`,
    timestamp: nowIso,
    status: 'Completed',
    paymentMethod: `Smart Top-Up • ${methodLabel}`,
    balanceAfterNGN: newBalance,
  };

  const nextState: WalletState = {
    ...current,
    balanceNGN: newBalance,
    lastUpdated: nowIso,
    transactions: [autoTx, ...current.transactions],
    smartTopUp: {
      ...config,
      lastAutoReloadAt: nowIso,
      lastAutoReloadAmountNGN: reloadAmount,
    },
  };

  saveWalletState(nextState);

  addAppNotification({
    type: 'booking',
    title: 'Smart Top-Up Auto-Reload Completed',
    message: `Your MsmeBooks Wallet dropped below ₦${config.thresholdNGN.toLocaleString()} and was automatically reloaded with +₦${reloadAmount.toLocaleString()} via ${methodLabel}.`,
    actionLabel: 'View Wallet',
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('msmebooks_smart_topup_triggered', {
        detail: {
          amountNGN: reloadAmount,
          thresholdNGN: config.thresholdNGN,
          methodLabel,
          reference: refCode,
          newBalanceNGN: newBalance,
        },
      })
    );
  }

  return {
    triggered: true,
    state: nextState,
    transaction: autoTx,
    methodLabel,
  };
};

export const updateSmartTopUpConfig = (
  updates: Partial<SmartTopUpConfig>
): {
  state: WalletState;
  autoReloadResult: ReturnType<typeof evaluateAndRunSmartTopUp>;
} => {
  const current = getWalletState();
  const nextConfig: SmartTopUpConfig = {
    ...(current.smartTopUp || DEFAULT_SMART_TOP_UP),
    ...updates,
  };

  const nextState: WalletState = {
    ...current,
    lastUpdated: new Date().toISOString(),
    smartTopUp: nextConfig,
  };

  saveWalletState(nextState);
  const autoReloadResult = evaluateAndRunSmartTopUp(nextState);

  return {
    state: autoReloadResult.state,
    autoReloadResult,
  };
};

export const topUpWallet = (
  amountNGN: number,
  paymentMethod: string = 'Instant Card Checkout'
): { success: boolean; state: WalletState; transaction: WalletTransaction } => {
  const current = getWalletState();
  const newBalance = current.balanceNGN + amountNGN;
  const refCode = `TXN-WAL-${Math.floor(10000 + Math.random() * 90000)}`;

  const newTx: WalletTransaction = {
    id: `tx-wal-${Date.now()}`,
    reference: refCode,
    type: 'credit',
    category: 'top_up',
    amountNGN,
    description: `Pre-load Credits via ${paymentMethod}`,
    timestamp: new Date().toISOString(),
    status: 'Completed',
    paymentMethod,
    balanceAfterNGN: newBalance,
  };

  const updatedState: WalletState = {
    ...current,
    balanceNGN: newBalance,
    lastUpdated: new Date().toISOString(),
    transactions: [newTx, ...current.transactions],
  };

  saveWalletState(updatedState);
  return { success: true, state: updatedState, transaction: newTx };
};

export const payWithWallet = (
  bookingId: string,
  amountNGN: number,
  serviceTitle: string,
  bookingReference: string
): {
  success: boolean;
  error?: string;
  state?: WalletState;
  transaction?: WalletTransaction;
  smartTopUpTriggered?: boolean;
  autoReloadTransaction?: WalletTransaction;
} => {
  const current = getWalletState();

  if (current.balanceNGN < amountNGN) {
    return {
      success: false,
      error: `Insufficient wallet credits. Your balance is ₦${current.balanceNGN.toLocaleString()}, but this service requires ₦${amountNGN.toLocaleString()}. Please pre-load additional credits.`,
    };
  }

  const newBalance = current.balanceNGN - amountNGN;
  const refCode = `TXN-WAL-${Math.floor(10000 + Math.random() * 90000)}`;

  const newTx: WalletTransaction = {
    id: `tx-wal-${Date.now()}`,
    reference: refCode,
    type: 'debit',
    category: 'booking_payment',
    amountNGN,
    description: `1-Click Wallet Payment: ${serviceTitle} (${bookingReference})`,
    timestamp: new Date().toISOString(),
    status: 'Completed',
    paymentMethod: 'MsmeBooks Wallet Credits',
    bookingId,
    bookingReference,
    serviceTitle,
    balanceAfterNGN: newBalance,
  };

  const updatedState: WalletState = {
    ...current,
    balanceNGN: newBalance,
    lastUpdated: new Date().toISOString(),
    transactions: [newTx, ...current.transactions],
  };

  saveWalletState(updatedState);

  // Check if Smart Top-Up should auto-reload credits after balance dropped
  const autoResult = evaluateAndRunSmartTopUp(updatedState);

  return {
    success: true,
    state: autoResult.state,
    transaction: newTx,
    smartTopUpTriggered: autoResult.triggered,
    autoReloadTransaction: autoResult.transaction,
  };
};
