import React, { useState } from 'react';
import { 
  COMMISSION_TIERS 
} from '../data/partnerData';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { CommissionTierItem } from '../types';

interface CommissionTiersProps {
  onOpenApplyModal: (tierId: string) => void;
}

export const CommissionTiers: React.FC<CommissionTiersProps> = ({ onOpenApplyModal }) => {
  // Interactive Calculator State
  const [clientCount, setClientCount] = useState<number>(35);
  const [subscriptionPlanFee, setSubscriptionPlanFee] = useState<number>(35000); // in NGN equivalent
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'KES' | 'GHS' | 'USD'>('NGN');

  // Currency multipliers and labels
  const currencyConfig = {
    NGN: { symbol: '₦', rate: 1, baseAvgFee: 35000, feeStep: 5000 },
    KES: { symbol: 'KSh ', rate: 0.1, baseAvgFee: 4000, feeStep: 500 },
    GHS: { symbol: 'GH₵ ', rate: 0.012, baseAvgFee: 550, feeStep: 50 },
    USD: { symbol: '$', rate: 0.00067, baseAvgFee: 45, feeStep: 5 },
  };

  const curr = currencyConfig[selectedCurrency];

  // Determine current tier from client count
  const getCurrentTier = (count: number) => {
    if (count >= 100) return COMMISSION_TIERS.find(t => t.id === 'platinum')!;
    if (count >= 40) return COMMISSION_TIERS.find(t => t.id === 'partner')!;
    if (count >= 15) return COMMISSION_TIERS.find(t => t.id === 'silver')!;
    return COMMISSION_TIERS.find(t => t.id === 'bronze')!;
  };

  const activeTier = getCurrentTier(clientCount);
  const totalVolume = clientCount * curr.baseAvgFee;
  const monthlyCommission = Math.round(totalVolume * (activeTier.percentage / 100));
  const annualCommission = monthlyCommission * 12;

  const getTierIcon = (id: string) => {
    switch (id) {
      case 'platinum':
        return <Crown className="w-5 h-5 text-emerald-600" />;
      case 'partner':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'silver':
        return <ShieldCheck className="w-5 h-5 text-slate-600" />;
      default:
        return <Award className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <section id="commission-tiers" className="py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84CC16]/20 text-[#3F6212] text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#65A30D]" />
            Recurring Revenue Engine
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Earn More as You Grow With MsmeBooks
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Our partner program rewards professionals and organizations for bringing more businesses into the MsmeBooks ecosystem. Build a long-term recurring revenue stream while helping African businesses become more organized, profitable and digitally enabled.
          </p>
        </div>

        {/* 4 Commission Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {COMMISSION_TIERS.map((tier) => {
            const isPlatinum = tier.isDominant;

            return (
              <div
                key={tier.id}
                id={`tier-card-${tier.id}`}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isPlatinum
                    ? 'bg-gradient-to-b from-[#0F4C81] via-[#0A2540] to-[#0A192F] text-white shadow-2xl ring-2 ring-[#84CC16] scale-[1.02] lg:-translate-y-2'
                    : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Platinum Dominance Badge */}
                {isPlatinum && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#84CC16] to-[#A3E635] text-[#0A192F] text-xs font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="w-3.5 h-3.5 fill-[#0A192F]" />
                    <span>Top Strategic Tier</span>
                  </div>
                )}

                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                        isPlatinum
                          ? 'bg-white/10 text-emerald-300 border border-white/10'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isPlatinum ? 'bg-emerald-500/20 text-[#84CC16]' : 'bg-slate-100'
                      }`}
                    >
                      {getTierIcon(tier.id)}
                    </div>
                  </div>

                  {/* Percentage Headline */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-display ${
                          isPlatinum ? 'text-[#84CC16]' : 'text-[#0F4C81]'
                        }`}
                      >
                        {tier.percentage}%
                      </span>
                      <span className={`text-xs font-semibold ${isPlatinum ? 'text-slate-300' : 'text-slate-500'}`}>
                        / recurring mo.
                      </span>
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isPlatinum ? 'text-white' : 'text-slate-800'}`}>
                      {tier.percentageLabel}
                    </p>
                  </div>

                  {/* Target partner audience */}
                  <div
                    className={`text-xs p-2.5 rounded-xl mb-6 font-medium ${
                      isPlatinum
                        ? 'bg-white/5 border border-white/10 text-slate-300'
                        : 'bg-slate-50 border border-slate-100 text-slate-600'
                    }`}
                  >
                    {tier.forWhom}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isPlatinum ? 'text-slate-400' : 'text-slate-400'}`}>
                      What's Included:
                    </p>
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                        <span
                          className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                            isPlatinum ? 'bg-[#84CC16] text-[#0A192F]' : 'bg-[#0F4C81]/10 text-[#0F4C81]'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                        <span className={isPlatinum ? 'text-slate-200' : 'text-slate-700'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA button */}
                <div>
                  <button
                    onClick={() => onOpenApplyModal(tier.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isPlatinum
                        ? 'bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] shadow-lg shadow-[#84CC16]/20'
                        : 'bg-[#0F4C81] hover:bg-[#0A3861] text-white shadow-xs'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mandatory Note from User Prompt */}
        <div className="text-center mb-14">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto italic">
            * Partner benefits and commission eligibility may be subject to MsmeBooks partner-program terms and qualification requirements.
          </p>
        </div>

        {/* INTERACTIVE COMMISSION CALCULATOR (Value-add feature for conversion) */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10 max-w-5xl mx-auto relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#65A30D]">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A192F] font-display">
                  Interactive Partner Revenue Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Estimate your predictable recurring monthly earnings based on active client subscriptions.
                </p>
              </div>
            </div>

            {/* Currency selector tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['NGN', 'KES', 'GHS', 'USD'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedCurrency(code)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    selectedCurrency === code
                      ? 'bg-white text-[#0F4C81] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
            
            {/* Left controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider: Number of clients */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">
                    Active SME Clients Onboarded:
                  </label>
                  <span className="text-base font-extrabold text-[#0F4C81] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {clientCount} Businesses
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="200"
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                  <span>2 (Bronze)</span>
                  <span>20 (Silver)</span>
                  <span>50 (Partner)</span>
                  <span>100+ (Platinum)</span>
                </div>
              </div>

              {/* Dynamic Qualified Tier Pill */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Estimated Tier</span>
                  <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    {activeTier.badge}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Commission Rate</span>
                  <p className="text-base font-extrabold text-[#65A30D]">
                    {activeTier.percentage}% Recurring
                  </p>
                </div>
              </div>

              {/* Typical Client Use Case note */}
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculated using an average baseline SME subscription of {curr.symbol}{curr.baseAvgFee.toLocaleString()}/month per business (e.g. Invoicing + Inventory + Automated Bank Sync).
              </p>

            </div>

            {/* Right Result Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0F4C81] to-[#0A2540] rounded-2xl p-6 sm:p-7 text-white text-center flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider">
                  Estimated Monthly Earnings
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#84CC16] font-display mt-2 mb-1">
                  {curr.symbol}{monthlyCommission.toLocaleString()}
                </div>
                <span className="text-xs text-slate-300">
                  paid every month into your bank account
                </span>

                <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-300">Annual Projected Commission:</span>
                  <span className="text-base font-bold text-white">
                    {curr.symbol}{annualCommission.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenApplyModal(activeTier.id)}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lock In {activeTier.percentage}% Rate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
