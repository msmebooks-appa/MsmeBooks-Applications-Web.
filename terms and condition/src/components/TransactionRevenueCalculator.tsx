import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  ArrowRight, 
  HelpCircle,
  Percent,
  Check
} from 'lucide-react';

export const TransactionRevenueCalculator: React.FC = () => {
  const { currency, currencyInfo, formatNgn, convertFromNgn } = useCurrency();

  // Monthly GMV / Transaction Volume Presets in base NGN
  const [monthlyVolumeNgn, setMonthlyVolumeNgn] = useState<number>(5000000); // ₦5,000,000 default

  const volumePresets = [
    { label: 'Starter SME', ngn: 1500000 },
    { label: 'Growing Retailer', ngn: 5000000 },
    { label: 'High-Volume Chain', ngn: 25000000 },
    { label: 'Supermarket / Hotel', ngn: 75000000 },
  ];

  // Base pricing
  const growthFeeNgn = 35000;
  const enterpriseFeeNgn = 95000;

  // Selected plan for calculator comparison
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'enterprise'>('growth');
  const activeSaaSFeeNgn = selectedPlan === 'growth' ? growthFeeNgn : enterpriseFeeNgn;

  // Pass-through processing fee estimate (1.5% capped at standard card fee)
  const estProcessingFeeNgn = Math.min(monthlyVolumeNgn * 0.015, 20000);
  const merchantRetainedRevenueNgn = monthlyVolumeNgn - estProcessingFeeNgn;

  return (
    <div className="my-6 rounded-2xl bg-gradient-to-br from-[#0B3558]/5 via-white to-slate-50 dark:from-[#0A1A2C] dark:via-[#081829] dark:to-[#07131F] border border-blue-200/80 dark:border-blue-900/60 p-5 sm:p-6 shadow-sm transition-colors">
      {/* Header with active currency badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3558] dark:text-[#84CC16]">
              Section 6.5 Verified Revenue Model
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B3558] dark:text-white tracking-tight">
            SaaS Subscription Tiers & Transaction Revenue Flow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-currency pricing and merchant volume settlement calculator
          </p>
        </div>

        {/* Currency status badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0D2238] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs self-start sm:self-auto">
          <span className="text-base leading-none" aria-hidden="true">{currencyInfo.flag}</span>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold leading-none">
              Active Currency
            </div>
            <div className="text-xs font-mono font-bold text-[#0B3558] dark:text-[#84CC16] leading-tight">
              {currency} ({currencyInfo.symbol})
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plan Tiers in Active Currency */}
      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#84CC16]" />
          <span>Official Subscription Plans (Billed in {currency})</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Free Tier */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Free Micro</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Starter
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#0B3558] dark:text-white font-mono">
                {currencyInfo.symbol} 0
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                For solo merchants & micro-kiosks. Up to 100 monthly receipts & single till.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Single User / 1 Device</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Basic Ledger & Sales</span>
              </div>
            </div>
          </div>

          {/* Growth Plan */}
          <div 
            onClick={() => setSelectedPlan('growth')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'growth'
                ? 'bg-[#F0F7FD] dark:bg-[#0D2A4A] border-[#84CC16] shadow-sm ring-1 ring-[#84CC16]'
                : 'bg-white dark:bg-[#0A1A2C] border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-[#84CC16] text-[#072238] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#0B3558] dark:text-[#38BDF8]">Growth Tier</span>
                <span className="text-[10px] font-semibold text-[#84CC16]">SME Standard</span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#0B3558] dark:text-white font-mono">
                {formatNgn(growthFeeNgn)}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Multi-branch POS, multi-warehouse inventory, accounting & employee payroll.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Up to 5 Users / 2 Branches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Full POS & Inventory</span>
              </div>
            </div>
          </div>

          {/* Enterprise Multi-Branch */}
          <div 
            onClick={() => setSelectedPlan('enterprise')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'enterprise'
                ? 'bg-[#F0F7FD] dark:bg-[#0D2A4A] border-[#84CC16] shadow-sm ring-1 ring-[#84CC16]'
                : 'bg-white dark:bg-[#0A1A2C] border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#0B3558] dark:text-[#38BDF8]">Enterprise Multi-Branch</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Full Suite
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#0B3558] dark:text-white font-mono">
                {formatNgn(enterpriseFeeNgn)}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Unlimited branches, custom user roles, developer REST APIs & hospitality tables.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Unlimited Tills & Branches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Priority 24/7 SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction & Revenue Flow Simulator (Section 6.5 Governance) */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Merchant Transaction Settlement Simulation</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate monthly POS turnover in <span className="font-semibold text-[#0B3558] dark:text-[#84CC16]">{currency}</span> to review exact platform fee isolation.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {volumePresets.map((preset) => (
              <button
                key={preset.ngn}
                onClick={() => setMonthlyVolumeNgn(preset.ngn)}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${
                  monthlyVolumeNgn === preset.ngn
                    ? 'bg-[#0B3558] dark:bg-[#84CC16] text-white dark:text-[#072238] shadow-2xs'
                    : 'bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume slider */}
        <div className="p-4 bg-white dark:bg-[#0A1A2C] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Simulated Monthly POS Turnover:
            </span>
            <span className="text-sm font-bold font-mono text-[#0B3558] dark:text-[#84CC16]">
              {formatNgn(monthlyVolumeNgn)}
            </span>
          </div>
          <input
            type="range"
            min={500000}
            max={100000000}
            step={500000}
            value={monthlyVolumeNgn}
            onChange={(e) => setMonthlyVolumeNgn(Number(e.target.value))}
            className="w-full accent-[#84CC16] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />

          {/* Three Settlement Breakdown Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                1. 100% Direct Merchant Revenue
              </span>
              <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 font-mono mt-1">
                {formatNgn(monthlyVolumeNgn)}
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300/80 mt-1">
                Settles into your merchant bank account directly via PCI-DSS gateways.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3558] dark:text-blue-300 block">
                2. Flat MsmeBooks SaaS Fee
              </span>
              <div className="text-base font-extrabold text-[#0B3558] dark:text-blue-200 font-mono mt-1">
                {formatNgn(activeSaaSFeeNgn)}
              </div>
              <p className="text-[10px] text-blue-700 dark:text-blue-300/80 mt-1">
                Predictable flat monthly license; zero commission or transaction cuts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                3. Estimated Gateway Processing
              </span>
              <div className="text-base font-extrabold text-slate-700 dark:text-slate-200 font-mono mt-1">
                ~{formatNgn(estProcessingFeeNgn)}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Standard third-party gateway interchange (Paystack, Flutterwave, Stripe).
              </p>
            </div>
          </div>
        </div>

        {/* Section 6.5 Notice Guarantee */}
        <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#84CC16] shrink-0 mt-0.5" />
          <span>
            <strong>Legal Contract Assurance (Section 6.5):</strong> MsmeBooks strictly bills software subscription fees. Customer funds collected across POS or invoicing belong 100% to Customer and are never commingled with MsmeBooks accounts.
          </span>
        </div>
      </div>
    </div>
  );
};
