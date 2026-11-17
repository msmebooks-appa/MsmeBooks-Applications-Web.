import React, { useState, useId } from 'react';
import {
  Calculator,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  DollarSign,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';

interface RoiCalculatorProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo?: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const monthlyRevenueId = useId();
  const staffCountId = useId();
  const hoursWeeklyId = useId();
  const transactionsId = useId();

  // Sliders state (stored in base NGN units, converted on display)
  const [monthlyRevenueNGN, setMonthlyRevenueNGN] = useState(5000000); // 5M NGN
  const [staffCount, setStaffCount] = useState(6);
  const [hoursWeekly, setHoursWeekly] = useState(14);
  const [monthlyInvoices, setMonthlyInvoices] = useState(250);

  // Calculations
  // 1. Time Saved: MsmeBooks automates ~75% of manual bookkeeping, reconciliation and inventory logging
  const hoursSavedPerWeek = Math.round(hoursWeekly * 0.72);
  const hoursSavedPerMonth = hoursSavedPerWeek * 4;
  const hoursSavedPerYear = hoursSavedPerMonth * 12;

  // 2. Hourly value of business owner / manager time
  const hourlyRateNGN = Math.max(1500, (monthlyRevenueNGN / 160) * 0.12);
  const timeLaborSavingsPerMonthNGN = hoursSavedPerMonth * hourlyRateNGN;

  // 3. Leakage & Discrepancy Prevention:
  // Typical African MSME experiences 3-5% stock shrinkage / unrecorded petty expenses
  const leakageSavingsPerMonthNGN = monthlyRevenueNGN * 0.022;

  // 4. Faster Receivables & Reduced Bad Debt
  const fasterCollectionsGainNGN = monthlyInvoices * 450;

  // Total monthly & annual savings in NGN
  const totalMonthlySavingsNGN = timeLaborSavingsPerMonthNGN + leakageSavingsPerMonthNGN + fasterCollectionsGainNGN;
  const totalAnnualSavingsNGN = totalMonthlySavingsNGN * 12;

  // MsmeBooks estimated monthly subscription cost in NGN
  const estimatedAppCostNGN = staffCount <= 5 ? 15000 : staffCount <= 15 ? 35000 : 65000;
  const roiMultiple = Math.max(3.5, totalMonthlySavingsNGN / estimatedAppCostNGN).toFixed(1);
  const breakEvenDays = Math.max(1, Math.min(28, Math.round(estimatedAppCostNGN / (totalMonthlySavingsNGN / 30))));

  return (
    <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7F000]/25 dark:bg-[#B7F000]/20 text-slate-900 dark:text-[#B7F000] text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
          <span>Interactive Value Simulator</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 dark:text-white font-display tracking-tight">
          Calculate Your Real ROI with MsmeBooks
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Adjust the sliders below to see how much time, cash leakage, and administrative overhead your business will save every single month.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Area (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Turnover */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={monthlyRevenueId} className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Monthly Business Turnover ({currency.code})
              </label>
              <span className="font-mono font-black text-sm sm:text-base text-[#0866FF] dark:text-blue-400">
                {currency.format(monthlyRevenueNGN)}
              </span>
            </div>
            <input
              id={monthlyRevenueId}
              type="range"
              min={500000}
              max={50000000}
              step={250000}
              value={monthlyRevenueNGN}
              onChange={(e) => setMonthlyRevenueNGN(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0866FF]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{currency.format(500000)}</span>
              <span>{currency.format(25000000)}</span>
              <span>{currency.format(50000000)}+</span>
            </div>
          </div>

          {/* Slider 2: Hours spent on manual bookkeeping */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={hoursWeeklyId} className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Weekly Hours on Manual Reconciliations &amp; Ledgers
              </label>
              <span className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white">
                {hoursWeekly} hrs/week
              </span>
            </div>
            <input
              id={hoursWeeklyId}
              type="range"
              min={3}
              max={35}
              step={1}
              value={hoursWeekly}
              onChange={(e) => setHoursWeekly(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0866FF]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>3 hrs (Light)</span>
              <span>15 hrs (Moderate)</span>
              <span>35 hrs (Heavy Manual)</span>
            </div>
          </div>

          {/* Slider 3: Staff & Cashiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={staffCountId} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Staff &amp; Cashiers
                </label>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {staffCount} staff
                </span>
              </div>
              <input
                id={staffCountId}
                type="range"
                min={1}
                max={40}
                step={1}
                value={staffCount}
                onChange={(e) => setStaffCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0866FF]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={transactionsId} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Monthly Invoices / Orders
                </label>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {monthlyInvoices} orders
                </span>
              </div>
              <input
                id={transactionsId}
                type="range"
                min={30}
                max={2000}
                step={20}
                value={monthlyInvoices}
                onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0866FF]"
              />
            </div>
          </div>

          {/* Quick Value Pillars */}
          <div className="pt-2 grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Hours Saved</div>
              <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                +{hoursSavedPerMonth}h / mo
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Leakage Prevented</div>
              <div className="text-sm sm:text-base font-black text-[#0866FF] dark:text-blue-400 font-mono mt-0.5">
                {currency.format(leakageSavingsPerMonthNGN)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">ROI Return</div>
              <div className="text-sm sm:text-base font-black text-[#B7F000] font-mono mt-0.5 bg-slate-900 dark:bg-slate-800 px-1 py-0.5 rounded">
                {roiMultiple}x ROI
              </div>
            </div>
          </div>
        </div>

        {/* Results Card (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B7F000]">
                Simulated Net Benefit
              </span>
              <div className="text-sm font-bold text-white">Projected Annual Savings</div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Conservative Est.
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#B7F000] font-mono tracking-tight">
              {currency.format(totalAnnualSavingsNGN)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Equates to <strong>{currency.format(totalMonthlySavingsNGN)}</strong> every month</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-medium text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Executive &amp; Accountant Time Freed:</span>
              </span>
              <span className="font-bold text-white font-mono">{hoursSavedPerYear} hrs/yr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash &amp; Stock Leakage Prevention:</span>
              </span>
              <span className="font-bold text-white font-mono">{currency.format(leakageSavingsPerMonthNGN * 12)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-[#B7F000]" />
                <span>Investment Payback Window:</span>
              </span>
              <span className="font-bold text-[#B7F000] font-mono">&lt; {breakEvenDays} Days</span>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={onOpenStartFree}
              className="w-full py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Unlock These Savings Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenBookDemo && (
              <button
                onClick={onOpenBookDemo}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Request Custom Financial Audit Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
