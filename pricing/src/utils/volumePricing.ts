import { BillingPeriod, PricingPlan } from '../types';

export interface VolumeScaleConfig {
  users: number; // Active staff / seats
  transactions?: number; // Kept optional for backward compatibility; transactions are 100% unlimited on all plans
}

export interface PlanVolumeCalculation {
  planId: string;
  name: string;
  isRecommended: boolean;
  baseMonthlyNgn: number;
  extraUserSeats: number;
  userSeatCostNgn: number;
  extraTransactions: number; // Always 0: zero transaction fees
  transactionCostNgn: number; // Always 0: flat subscription pricing
  volumeDiscountPercent: number;
  volumeDiscountAmountNgn: number;
  monthlyTotalNgn: number;
  billingPeriod: BillingPeriod;
  cycleDurationMonths: number;
  cycleDiscountPercent: number;
  cycleMonthlyRateNgn: number; // Effective monthly rate after cycle discount
  cycleTotalNgn: number; // Total billed for the cycle
  cycleSavingsNgn: number; // Total savings compared to standard monthly
  yearlyMonthlyRateNgn: number; // 20% off monthly equivalent
  yearlyTotalNgn: number;
  yearlySavingsNgn: number;
  effectiveCostPerTransactionNgn: number; // 0
  effectiveCostPerUserNgn: number;
  capacityStatus: 'ideal' | 'included' | 'scaled' | 'exceeded';
  capacityMessage: string;
}

export interface ModuleFeatureSpec {
  id: string;
  name: string;
  description: string;
  minPlanId: string;
  minPlanName: string;
  icon: string;
}

export const BUSINESS_MODULES: ModuleFeatureSpec[] = [
  {
    id: 'pos_invoicing',
    name: 'Cloud POS, Invoicing & Digital Receipts',
    description: 'Fast barcode scanning, offline sales caching, thermal printing & digital invoices',
    minPlanId: 'starter',
    minPlanName: 'Starter',
    icon: '🛒',
  },
  {
    id: 'core_accounting',
    name: 'Core Double-Entry Bookkeeping & General Ledger',
    description: 'Automated P&L, balance sheets, cashflow reports, and journal vouchers',
    minPlanId: 'starter',
    minPlanName: 'Starter',
    icon: '📊',
  },
  {
    id: 'crm_marketing',
    name: 'Customer CRM, WhatsApp Sales & Marketing',
    description: 'VIP client segmentation, automated birthday promos, WhatsApp campaign broadcasts',
    minPlanId: 'growth',
    minPlanName: 'Growth',
    icon: '💬',
  },
  {
    id: 'payroll_hr',
    name: 'Payroll, Employee Payslips & PAYE Deductions',
    description: 'Monthly payroll runs, salary advance tracking, PAYE/NHF automated schedules',
    minPlanId: 'growth',
    minPlanName: 'Growth',
    icon: '👥',
  },
  {
    id: 'multi_branch',
    name: 'Multi-Branch & Store Chain Management',
    description: 'Centralized stock control across multiple retail outlets with branch-level P&L',
    minPlanId: 'business',
    minPlanName: 'Business',
    icon: '🏢',
  },
  {
    id: 'webhooks_api',
    name: 'Webhooks & REST API Integrations',
    description: 'Custom e-commerce pipelines, ERP connectors, and third-party event triggers',
    minPlanId: 'business',
    minPlanName: 'Business',
    icon: '🔗',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing, Bill of Materials (BOM) & Assembly',
    description: 'Raw material costing, production batch assembly, wastage tracking',
    minPlanId: 'premium',
    minPlanName: 'Premium',
    icon: '🏭',
  },
  {
    id: 'tax_firs',
    name: 'FIRS e-Invoicing & Statutory Tax Filing',
    description: 'Automated VAT filing notes, withholding tax (WHT) credits, and fiscal compliance',
    minPlanId: 'premium',
    minPlanName: 'Premium',
    icon: '🏛️',
  },
  {
    id: 'multi_company',
    name: 'Consolidated Multi-Company Holding Ledger',
    description: 'Group-level financial consolidation, inter-company billing, and dedicated database node',
    minPlanId: 'enterprise',
    minPlanName: 'Enterprise',
    icon: '🌐',
  },
];

export interface VolumePreset {
  id: string;
  label: string;
  description: string;
  users: number;
  transactions: number; // Kept at 0 to reflect zero transaction limits
  icon: string;
  recommendedPlanId: string;
  includedModules: string[];
}

export const VOLUME_PRESETS: VolumePreset[] = [
  {
    id: 'solo',
    label: 'Solo Merchant / Kiosk',
    description: 'Single user • Core POS & Invoicing • Flat ₦4,500/mo',
    users: 1,
    transactions: 0,
    icon: '🏪',
    recommendedPlanId: 'starter',
    includedModules: ['pos_invoicing', 'core_accounting'],
  },
  {
    id: 'boutique',
    label: 'Growing Store & Team',
    description: '2 users • CRM, Payroll & Fixed Assets • Flat ₦9,000/mo',
    users: 2,
    transactions: 0,
    icon: '🛒',
    recommendedPlanId: 'growth',
    includedModules: ['pos_invoicing', 'core_accounting', 'crm_marketing', 'payroll_hr'],
  },
  {
    id: 'multi_branch',
    label: 'Multi-Branch Chain',
    description: '3 users • Multi-branches & REST API • Flat ₦15,000/mo',
    users: 3,
    transactions: 0,
    icon: '🏢',
    recommendedPlanId: 'business',
    includedModules: ['pos_invoicing', 'core_accounting', 'crm_marketing', 'payroll_hr', 'multi_branch', 'webhooks_api'],
  },
  {
    id: 'premium_sme',
    label: 'Mid-Market & Manufacturing',
    description: '10 users • Manufacturing, BOM & Tax Filing • Flat ₦50,000/mo',
    users: 10,
    transactions: 0,
    icon: '🏬',
    recommendedPlanId: 'premium',
    includedModules: ['pos_invoicing', 'core_accounting', 'crm_marketing', 'payroll_hr', 'multi_branch', 'webhooks_api', 'manufacturing', 'tax_firs'],
  },
  {
    id: 'enterprise_scale',
    label: 'Enterprise FMCG & Holding',
    description: '15+ users • Multi-company consolidation • Flat ₦150,000/mo',
    users: 15,
    transactions: 0,
    icon: '🏭',
    recommendedPlanId: 'enterprise',
    includedModules: ['pos_invoicing', 'core_accounting', 'crm_marketing', 'payroll_hr', 'multi_branch', 'webhooks_api', 'manufacturing', 'tax_firs', 'multi_company'],
  },
];

export const USER_STEPS = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100];
export const TRANSACTION_STEPS = [0]; // Transactions are unlimited on all plans

// Baseline tier specs with flat monthly subscriptions and ZERO transaction fees
export const TIER_LIMITS: Record<string, {
  includedUsers: number;
  includedTransactions: number;
  baseMonthlyNgn: number;
  extraUserPerMonthNgn: number;
  extraThousandTxPerMonthNgn: number;
  maxRecommendedUsers: number;
  maxRecommendedTx: number;
}> = {
  starter: {
    includedUsers: 1,
    includedTransactions: Infinity,
    baseMonthlyNgn: 4500, // Flat ₦4,500/mo for single user
    extraUserPerMonthNgn: 2000,
    extraThousandTxPerMonthNgn: 0, // Zero transaction fees
    maxRecommendedUsers: 1,
    maxRecommendedTx: Infinity,
  },
  growth: {
    includedUsers: 2,
    includedTransactions: Infinity,
    baseMonthlyNgn: 9000, // Flat ₦9,000/mo for 2 users
    extraUserPerMonthNgn: 1800,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 2,
    maxRecommendedTx: Infinity,
  },
  business: {
    includedUsers: 3,
    includedTransactions: Infinity,
    baseMonthlyNgn: 15000, // Flat ₦15,000/mo for 3 users
    extraUserPerMonthNgn: 1800,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 4,
    maxRecommendedTx: Infinity,
  },
  premium: {
    includedUsers: 10,
    includedTransactions: Infinity,
    baseMonthlyNgn: 50000, // Flat ₦50,000/mo for 10 users
    extraUserPerMonthNgn: 1500,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 12,
    maxRecommendedTx: Infinity,
  },
  professional: {
    // Backward compatibility alias for premium
    includedUsers: 10,
    includedTransactions: Infinity,
    baseMonthlyNgn: 50000,
    extraUserPerMonthNgn: 1500,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 12,
    maxRecommendedTx: Infinity,
  },
  enterprise: {
    includedUsers: 15,
    includedTransactions: Infinity,
    baseMonthlyNgn: 150000, // Flat ₦150,000/mo for 15 users
    extraUserPerMonthNgn: 1200,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 18,
    maxRecommendedTx: Infinity,
  },
  superior: {
    includedUsers: 20,
    includedTransactions: Infinity,
    baseMonthlyNgn: 300000, // Flat ₦300,000/mo for 20 users
    extraUserPerMonthNgn: 1000,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 25,
    maxRecommendedTx: Infinity,
  },
  ultimate: {
    includedUsers: 30,
    includedTransactions: Infinity,
    baseMonthlyNgn: 500000, // Flat ₦50,000/mo for 30 users
    extraUserPerMonthNgn: 900,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 35,
    maxRecommendedTx: Infinity,
  },
  ultimate_prime: {
    includedUsers: 40,
    includedTransactions: Infinity,
    baseMonthlyNgn: 800000, // Flat ₦800,000/mo for 40 users
    extraUserPerMonthNgn: 800,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 50,
    maxRecommendedTx: Infinity,
  },
  mega_org: {
    includedUsers: 40,
    includedTransactions: Infinity,
    baseMonthlyNgn: 800000,
    extraUserPerMonthNgn: 800,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 50,
    maxRecommendedTx: Infinity,
  },
  custom: {
    includedUsers: 50,
    includedTransactions: Infinity,
    baseMonthlyNgn: 1200000,
    extraUserPerMonthNgn: 600,
    extraThousandTxPerMonthNgn: 0,
    maxRecommendedUsers: 500,
    maxRecommendedTx: Infinity,
  },
};

/**
 * Determine the optimal recommended plan for the given user count and required module features.
 * Subscriptions are based entirely on user seats and module usage/features with zero transaction fees.
 */
export function getRecommendedPlanForUsage(users: number, selectedModuleIds: string[] = []): string {
  // Check required module tier gates
  const requiresEnterprise = selectedModuleIds.includes('multi_company');
  const requiresPremium = selectedModuleIds.some((m) => ['manufacturing', 'tax_firs'].includes(m));
  const requiresBusiness = selectedModuleIds.some((m) => ['multi_branch', 'webhooks_api'].includes(m));
  const requiresGrowth = selectedModuleIds.some((m) => ['crm_marketing', 'payroll_hr'].includes(m));

  if (users > 40) {
    return 'custom';
  }
  if (users > 30) {
    return 'ultimate_prime';
  }
  if (users > 20) {
    return 'ultimate';
  }
  if (users > 15) {
    return 'superior';
  }
  if (users > 10 || requiresEnterprise) {
    return 'enterprise';
  }
  if (users > 3 || requiresPremium) {
    return 'premium';
  }
  if (users > 2 || requiresBusiness) {
    return 'business';
  }
  if (users > 1 || requiresGrowth) {
    return 'growth';
  }
  return 'starter';
}

/**
 * Backward compatibility wrapper for getRecommendedPlanForUsage
 */
export function getRecommendedPlanForVolume(
  users: number,
  _transactions: number = 0,
  selectedModuleIds: string[] = []
): string {
  return getRecommendedPlanForUsage(users, selectedModuleIds);
}

/**
 * Calculates flat subscription pricing for any plan based on user seats and billing period.
 * Completely removes transaction multiples and transaction fees.
 */
export function calculatePlanVolumePricing(
  planId: string,
  users: number = 1,
  _transactions: number = 0,
  billingPeriod: BillingPeriod = 'monthly'
): PlanVolumeCalculation {
  const recommendedId = getRecommendedPlanForUsage(users);
  const isRecommended = planId === recommendedId;

  let limits = TIER_LIMITS[planId];
  if (!limits) {
    limits = TIER_LIMITS.premium || TIER_LIMITS.starter;
  }

  // Flat base monthly rate for the plan
  const baseMonthlyNgn = limits.baseMonthlyNgn;

  // Extra user seat cost ONLY if exceeding the plan's bundled user seats
  const extraUserSeats = Math.max(0, users - limits.includedUsers);
  const userSeatCostNgn = extraUserSeats * limits.extraUserPerMonthNgn;

  // ZERO transaction cost across all plans: unlimited transactions included
  const extraTransactions = 0;
  const transactionCostNgn = 0;

  const rawMonthlyTotal = baseMonthlyNgn + userSeatCostNgn;

  // Volume scale discounts for high seat counts
  let volumeDiscountPercent = 0;
  if (planId === 'business' && users > 30) {
    volumeDiscountPercent = 8;
  } else if (planId === 'enterprise' && users > 50) {
    volumeDiscountPercent = 12;
  } else if (planId === 'professional' && users > 10) {
    volumeDiscountPercent = 5;
  }

  const volumeDiscountAmountNgn = Math.round(
    (rawMonthlyTotal * volumeDiscountPercent) / 100
  );
  const monthlyTotalNgn = rawMonthlyTotal - volumeDiscountAmountNgn;

  // Billing Cycle discount & duration
  let cycleDiscountPercent = 0;
  let cycleDurationMonths = 1;

  if (billingPeriod === 'quarterly') {
    cycleDiscountPercent = 5;
    cycleDurationMonths = 3;
  } else if (billingPeriod === 'bi-yearly') {
    cycleDiscountPercent = 10;
    cycleDurationMonths = 6;
  } else if (billingPeriod === 'yearly') {
    cycleDiscountPercent = 20;
    cycleDurationMonths = 12;
  }

  const cycleMonthlyRateNgn = Math.round(
    monthlyTotalNgn * (1 - cycleDiscountPercent / 100)
  );
  const cycleTotalNgn = cycleMonthlyRateNgn * cycleDurationMonths;
  const cycleSavingsNgn = (monthlyTotalNgn * cycleDurationMonths) - cycleTotalNgn;

  // Yearly baseline metrics for backward compatibility
  const yearlyMonthlyRateNgn = Math.round(monthlyTotalNgn * 0.8);
  const yearlyTotalNgn = yearlyMonthlyRateNgn * 12;
  const yearlySavingsNgn = (monthlyTotalNgn * 12) - yearlyTotalNgn;

  // Unit metrics
  const activeMonthly = cycleMonthlyRateNgn;
  const effectiveCostPerTransactionNgn = 0; // 0 transaction fees
  const effectiveCostPerUserNgn =
    users > 0 ? Math.round(activeMonthly / users) : 0;

  // Capacity status & messaging
  let capacityStatus: PlanVolumeCalculation['capacityStatus'] = 'included';
  let capacityMessage = `Flat subscription: ${limits.includedUsers} user seat(s) & unlimited transactions included with ₦0 transaction fees.`;

  if (extraUserSeats > 0) {
    capacityStatus = 'scaled';
    capacityMessage = `Includes ${extraUserSeats} extra seat(s) at ₦${limits.extraUserPerMonthNgn.toLocaleString()}/mo. Unlimited transactions included.`;
  } else if (isRecommended) {
    capacityStatus = 'ideal';
    capacityMessage = 'Optimal flat subscription for your team scale & module requirements.';
  }

  const planNames: Record<string, string> = {
    starter: 'Starter',
    growth: 'Growth',
    business: 'Business',
    premium: 'Premium',
    professional: 'Professional',
    enterprise: 'Enterprise',
    superior: 'Superior',
    ultimate: 'Ultimate',
    ultimate_prime: 'Ultimate Prime',
    custom: 'Custom Enterprise',
  };

  return {
    planId,
    name: planNames[planId] || planId,
    isRecommended,
    baseMonthlyNgn,
    extraUserSeats,
    userSeatCostNgn,
    extraTransactions,
    transactionCostNgn,
    volumeDiscountPercent,
    volumeDiscountAmountNgn,
    monthlyTotalNgn,
    billingPeriod,
    cycleDurationMonths,
    cycleDiscountPercent,
    cycleMonthlyRateNgn,
    cycleTotalNgn,
    cycleSavingsNgn,
    yearlyMonthlyRateNgn,
    yearlyTotalNgn,
    yearlySavingsNgn,
    effectiveCostPerTransactionNgn,
    effectiveCostPerUserNgn,
    capacityStatus,
    capacityMessage,
  };
}
