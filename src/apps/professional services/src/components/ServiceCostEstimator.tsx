import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Coins,
  Building,
  Users,
  FileCheck
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';

interface ServiceCostEstimatorProps {
  onBookEstimatedService?: (service: ServiceItem, estimatedNotes?: string) => void;
}

export const ServiceCostEstimator: React.FC<ServiceCostEstimatorProps> = ({ onBookEstimatedService }) => {
  const { currentCurrency, formatAmount } = useCurrency();

  // Selected Service Type
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-bookkeeping-monthly');

  // Business Parameters
  const [transactionTier, setTransactionTier] = useState<number>(1); // 0: <200, 1: 200-1000, 2: 1000-5000, 3: 5000+
  const [staffCount, setStaffCount] = useState<number>(10);
  const [durationMonths, setDurationMonths] = useState<number>(3); // 1, 3, 6, 12
  const [needOnsite, setNeedOnsite] = useState<boolean>(false);
  const [needPriorityTaxReview, setNeedPriorityTaxReview] = useState<boolean>(true);

  const selectedService = useMemo(() => {
    return SERVICES_CATALOGUE.find(s => s.id === selectedServiceId) || SERVICES_CATALOGUE[0];
  }, [selectedServiceId]);

  // Base NGN calculations
  const estimation = useMemo(() => {
    let baseMonthlyNGN = 65000;

    switch (selectedServiceId) {
      case 'srv-bookkeeping-monthly':
        baseMonthlyNGN = 75000;
        break;
      case 'srv-tax-advisory':
        baseMonthlyNGN = 95000;
        break;
      case 'srv-pos-retail-setup':
        baseMonthlyNGN = 110000;
        break;
      case 'srv-payroll-pension':
        baseMonthlyNGN = 60000;
        break;
      case 'srv-audit-readiness':
        baseMonthlyNGN = 140000;
        break;
      default:
        baseMonthlyNGN = 70000;
    }

    // Transaction volume multiplier
    const volMultipliers = [1.0, 1.35, 1.8, 2.5];
    baseMonthlyNGN *= volMultipliers[transactionTier] || 1.0;

    // Staff headcount addition
    if (staffCount > 20) {
      baseMonthlyNGN += 25000;
    } else if (staffCount > 5) {
      baseMonthlyNGN += 12000;
    }

    // Addons
    if (needOnsite) baseMonthlyNGN += 35000;
    if (needPriorityTaxReview) baseMonthlyNGN += 25000;

    // Duration discount: 3 mo -> 5%, 6 mo -> 10%, 12 mo -> 18%
    let discountPct = 0;
    if (durationMonths === 3) discountPct = 0.05;
    else if (durationMonths === 6) discountPct = 0.10;
    else if (durationMonths === 12) discountPct = 0.18;

    const monthlyAfterDiscount = Math.round(baseMonthlyNGN * (1 - discountPct));
    const totalContractNGN = monthlyAfterDiscount * durationMonths;
    const savingsNGN = Math.round(baseMonthlyNGN * durationMonths - totalContractNGN);

    // Range: Low to High (~15% variance)
    const lowMonthlyNGN = Math.round(monthlyAfterDiscount * 0.9);
    const highMonthlyNGN = Math.round(monthlyAfterDiscount * 1.15);

    return {
      monthlyEstimatedNGN: monthlyAfterDiscount,
      lowMonthlyNGN,
      highMonthlyNGN,
      totalContractNGN,
      savingsNGN,
      discountPct: Math.round(discountPct * 100),
    };
  }, [selectedServiceId, transactionTier, staffCount, durationMonths, needOnsite, needPriorityTaxReview]);

  const handleBook = () => {
    if (onBookEstimatedService) {
      const notes = `Cost Estimator Projection: ~${formatAmount(estimation.monthlyEstimatedNGN)}/mo for ${durationMonths} month(s). Transactions: ${['<200/mo', '200-1,000/mo', '1,000-5,000/mo', '5,000+/mo'][transactionTier]}. Staff: ${staffCount}. Onsite: ${needOnsite ? 'Yes' : 'No'}.`;
      onBookEstimatedService(selectedService, notes);
    }
  };

  return (
    <div id="service-cost-estimator" className="my-10 bg-white dark:bg-[#0A1727] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Estimator Header Banner */}
      <div className="bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7E532] text-[#102B4E] text-xs font-black uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Interactive SME Budget Planner
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Service Cost & Retainer Estimator
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-xl">
            Simulate your monthly advisory, bookkeeping, or POS implementation cost in real-time based on your transaction scale and team size.
          </p>
        </div>

        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
            Active Display Currency
          </span>
          <div className="text-xl font-black text-[#B7E532] flex items-center justify-end gap-1.5 mt-0.5">
            <span>{currentCurrency.flag}</span>
            <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
          </div>
        </div>
      </div>

      {/* Estimator Form & Results Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50/50 dark:bg-[#08121E]">
        
        {/* Left 7 Cols: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Service Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              1. Select Professional Service Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'srv-bookkeeping-monthly', name: 'Monthly Bookkeeping & Financials', icon: '📊' },
                { id: 'srv-tax-advisory', name: 'Tax Advisory & CIT/VAT Filings', icon: '🏛️' },
                { id: 'srv-pos-retail-setup', name: 'Cloud POS & Hardware Setup', icon: '💳' },
                { id: 'srv-payroll-pension', name: 'Payroll & Statutory Remittances', icon: '👥' },
                { id: 'srv-audit-readiness', name: 'Annual Audit & Balance Sheet Prep', icon: '📑' },
              ].map(s => {
                const isSelected = selectedServiceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="leading-tight">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Monthly Transaction Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Average Monthly Sales / Bank Transactions
              </label>
              <span className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532]">
                {['Under 200 txns / month (Micro SME)', '200 – 1,000 txns / month (Growing Store)', '1,000 – 5,000 txns / month (Multi-branch)', '5,000+ txns / month (High-volume Enterprise)'][transactionTier]}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['< 200', '200-1K', '1K-5K', '5,000+'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTransactionTier(idx)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all cursor-pointer ${
                    transactionTier === idx
                      ? 'bg-[#102B4E] dark:bg-[#B7E532] text-[#B7E532] dark:text-[#102B4E] shadow-sm'
                      : 'bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Team Size & Engagement Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Staff Headcount ({staffCount} Employees)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={staffCount}
                onChange={(e) => setStaffCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#1464C8] dark:accent-[#B7E532] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>1 Solo / Micro</span>
                <span>25 Mid-sized</span>
                <span>50+ Firm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Engagement Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { m: 1, label: '1 mo' },
                  { m: 3, label: '3 mo (-5%)' },
                  { m: 6, label: '6 mo (-10%)' },
                  { m: 12, label: '1 yr (-18%)' }
                ].map(d => (
                  <button
                    key={d.m}
                    type="button"
                    onClick={() => setDurationMonths(d.m)}
                    className={`py-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      durationMonths === d.m
                        ? 'bg-[#1464C8] text-white'
                        : 'bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Options / Addons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={needOnsite}
                onChange={(e) => setNeedOnsite(e.target.checked)}
                className="w-4 h-4 rounded text-[#1464C8] accent-[#1464C8]"
              />
              <span>Includes On-site Office Visits (+{formatAmount(35000)}/mo)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={needPriorityTaxReview}
                onChange={(e) => setNeedPriorityTaxReview(e.target.checked)}
                className="w-4 h-4 rounded text-[#1464C8] accent-[#1464C8]"
              />
              <span>Priority Statutory Tax Auditing (+{formatAmount(25000)}/mo)</span>
            </label>
          </div>

        </div>

        {/* Right 5 Cols: Projection Summary Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Projected Estimate Summary
              </span>
              {estimation.discountPct > 0 && (
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {estimation.discountPct}% Duration Discount
                </span>
              )}
            </div>

            {/* Big Projected Monthly Figure */}
            <div className="my-5">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Estimated Monthly Retainer:
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#1464C8] dark:text-[#B7E532] tracking-tight mt-1">
                {formatAmount(estimation.monthlyEstimatedNGN)}
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400"> / month</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                Expected Range: {formatAmount(estimation.lowMonthlyNGN)} – {formatAmount(estimation.highMonthlyNGN)}
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Selected Service:</span>
                <span className="font-bold text-[#102B4E] dark:text-white truncate max-w-[180px]">{selectedService.title}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Contract Duration:</span>
                <span className="font-bold text-[#102B4E] dark:text-white">{durationMonths} Month(s)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Contract Value:</span>
                <span className="font-black text-[#102B4E] dark:text-white">{formatAmount(estimation.totalContractNGN)}</span>
              </div>
              {estimation.savingsNGN > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Total Duration Savings:</span>
                  <span>{formatAmount(estimation.savingsNGN)}</span>
                </div>
              )}
            </div>

            {/* Guarantee Pill */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#B7E532] shrink-0 mt-0.5" />
              <span>
                All consultations and retainer packages include MsmeBooks software data backup, cloud access, and verified chartered professional oversight.
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleBook}
              className="w-full py-3.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Appointment with This Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
