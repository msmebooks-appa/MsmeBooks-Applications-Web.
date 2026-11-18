import { PromoCode } from '../types/cart';

export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  PANAFRICA25: {
    code: 'PANAFRICA25',
    discountType: 'percentage',
    discountValue: 25,
    description: '25% Pan-African Expansion Discount on all plans',
  },
  LAUNCH2026: {
    code: 'LAUNCH2026',
    discountType: 'fixed',
    discountValue: 15000, // ₦15,000 NGN flat discount (converted proportionally for other currencies)
    description: 'Flat ₦15,000 ($10) special launch voucher',
  },
  GROWTH50: {
    code: 'GROWTH50',
    discountType: 'percentage',
    discountValue: 50,
    description: '50% High-Growth SME Booster Discount',
    minSubtotalNgn: 30000,
  },
  SMEACCELERATE: {
    code: 'SMEACCELERATE',
    discountType: 'percentage',
    discountValue: 15,
    description: '15% Digitalization Incentive Discount',
  },
  OFFLINE10: {
    code: 'OFFLINE10',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% Offline POS Champion Discount',
  },
};

export const FEATURED_PROMO_OFFERS = [
  {
    code: 'PANAFRICA25',
    tag: '25% OFF',
    label: 'Pan-African Special',
    desc: 'Save 25% on any plan today',
  },
  {
    code: 'LAUNCH2026',
    tag: '₦15,000 OFF',
    label: 'Launch Voucher',
    desc: 'Instant ₦15,000 discount',
  },
  {
    code: 'SMEACCELERATE',
    tag: '15% OFF',
    label: 'SME Growth',
    desc: 'Instant discount on checkout',
  },
];

export function validatePromoCode(
  inputCode: string,
  subtotalNgn: number
): { valid: boolean; promo?: PromoCode; message: string; discountNgn: number } {
  const normalized = inputCode.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: 'Please enter a promotion code', discountNgn: 0 };
  }

  const promo = VALID_PROMO_CODES[normalized];
  if (!promo) {
    return { valid: false, message: 'Invalid or expired promotion code', discountNgn: 0 };
  }

  if (promo.minSubtotalNgn && subtotalNgn < promo.minSubtotalNgn) {
    return {
      valid: false,
      message: `Code requires a minimum subtotal of ₦${promo.minSubtotalNgn.toLocaleString()}`,
      discountNgn: 0,
    };
  }

  let discountNgn = 0;
  if (promo.discountType === 'percentage') {
    discountNgn = (subtotalNgn * promo.discountValue) / 100;
  } else {
    discountNgn = Math.min(subtotalNgn, promo.discountValue);
  }

  return {
    valid: true,
    promo,
    message: `Promo code applied! ${promo.description}`,
    discountNgn: Math.round(discountNgn),
  };
}
