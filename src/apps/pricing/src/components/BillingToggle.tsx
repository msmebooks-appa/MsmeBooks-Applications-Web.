import React from 'react';
import { Sparkles, ShieldCheck, Check, Calendar } from 'lucide-react';
import { BillingPeriod, Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
  currency: Currency;
}

interface PeriodOption {
  id: BillingPeriod;
  labelKey: 'monthly' | 'quarterly' | 'biYearly' | 'yearly';
  durationLabel: string;
  discountBadge?: string;
  highlight?: boolean;
  priceLockBadge?: string;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({
  billingPeriod,
  onChange,
}) => {
  const { t, language } = useLanguage();

  const periodOptions: PeriodOption[] = [
    {
      id: 'monthly',
      labelKey: 'monthly',
      durationLabel: '1 Month',
    },
    {
      id: 'quarterly',
      labelKey: 'quarterly',
      durationLabel: '3 Months',
      discountBadge: t.billing.quarterlyDiscountBadge || '5% OFF',
    },
    {
      id: 'bi-yearly',
      labelKey: 'biYearly',
      durationLabel: '6 Months',
      discountBadge: t.billing.biYearlyDiscountBadge || '10% OFF',
      priceLockBadge: '12-Mo Lock',
    },
    {
      id: 'yearly',
      labelKey: 'yearly',
      durationLabel: '12 Months',
      discountBadge: t.billing.saveDiscountBadge || '20% OFF',
      highlight: true,
      priceLockBadge: '24-Mo Lock',
    },
  ];

  const getSubtext = () => {
    switch (billingPeriod) {
      case 'monthly':
        return t.billing.toggleSubtitle || 'Month-to-month billing with zero commitment. Cancel anytime.';
      case 'quarterly':
        return t.billing.quarterlyNote || 'Quarterly plans billed every 3 months with 5% discount.';
      case 'bi-yearly':
        return t.billing.biYearlyNote || 'Bi-yearly plans billed every 6 months with 10% discount & 12-month price freeze.';
      case 'yearly':
        return t.billing.annualNote || 'Annual subscriptions billed once per year with 20% discount & 24-month price freeze.';
      default:
        return t.billing.annualNote;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* 4-Option Segmented Tab Switcher */}
      <div
        role="tablist"
        aria-label="Billing cycle selector"
        className="relative inline-flex flex-wrap sm:flex-nowrap items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-sm transition-all max-w-full gap-1 sm:gap-0"
      >
        {periodOptions.map((opt) => {
          const isSelected = billingPeriod === opt.id;
          const label = t.billing[opt.labelKey] || opt.labelKey;

          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? opt.highlight
                    ? 'bg-[#0A4FD5] text-white shadow-md shadow-blue-500/25 font-extrabold scale-[1.02]'
                    : 'bg-white dark:bg-[#0D1C30] text-[#0B192C] dark:text-white shadow-md shadow-slate-200/80 dark:shadow-none font-extrabold scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{label.replace(' Billing', '').replace(' Facturation', '').replace(' Faturação', '').replace(' Facturación', '')}</span>

              {/* Discount Badge */}
              {opt.discountBadge && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md transition-all ${
                    isSelected
                      ? opt.highlight
                        ? 'bg-[#84CC16] text-[#0B192C]'
                        : 'bg-blue-600 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {opt.highlight && <Sparkles className="w-2.5 h-2.5" />}
                  {opt.discountBadge}
                </span>
              )}

              {/* Price Lock indicator */}
              {opt.priceLockBadge && (
                <span
                  className={`hidden md:inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {opt.priceLockBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Subtext for current billing cycle */}
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 text-center max-w-lg">
        <span className="inline-block w-2 h-2 rounded-full bg-[#84CC16] shrink-0 animate-pulse" />
        <span>{getSubtext()}</span>
      </div>
    </div>
  );
};
