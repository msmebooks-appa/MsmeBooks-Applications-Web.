import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';
import { PartnerTierId } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';

export const TierProgression: React.FC = () => {
  const { currencyConfig, formatAmount } = useCurrency();
  const [currentTier, setCurrentTier] = useState<PartnerTierId>('bronze');
  const [activeClientsCount, setActiveClientsCount] = useState<number>(35);

  const getUpgradeStatus = () => {
    let rate = 0.15;
    if (activeClientsCount >= 100) {
      rate = 0.40;
      return {
        qualifiedTier: 'Platinum Partner (40%)',
        rate,
        status: 'Eligible for Platinum Enterprise Review',
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        border: 'border-purple-200 dark:border-purple-800',
        action: 'Request Platinum Upgrade Review'
      };
    } else if (activeClientsCount >= 50) {
      rate = 0.30;
      return {
        qualifiedTier: 'Gold Partner (30%)',
        rate,
        status: 'Eligible for Gold Partner Upgrade',
        color: 'text-[#1261B5] dark:text-[#B9E51C]',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        border: 'border-blue-200 dark:border-blue-800',
        action: 'Request Gold Upgrade Review'
      };
    } else if (activeClientsCount >= 20) {
      rate = 0.20;
      return {
        qualifiedTier: 'Silver Partner (20%)',
        rate,
        status: 'Eligible for Silver Partner Upgrade',
        color: 'text-emerald-700 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        action: 'Request Silver Upgrade Review'
      };
    } else {
      rate = 0.15;
      return {
        qualifiedTier: 'Bronze Partner (15%)',
        rate,
        status: 'Active Bronze Tier · 20 clients needed for Silver',
        color: 'text-slate-700 dark:text-slate-300',
        bg: 'bg-slate-50 dark:bg-slate-800/60',
        border: 'border-slate-200 dark:border-slate-700',
        action: 'Keep Referring Clients'
      };
    }
  };

  const status = getUpgradeStatus();

  return (
    <section className="py-20 lg:py-28 bg-[#F7FAFC] dark:bg-[#0B1528] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>Career & Practice Growth</span>
            <span aria-hidden="true">·</span>
            <span>Structured Progression</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            Grow Your Performance. Unlock Greater Earning Potential.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            As your active client base scales from 10 to 100+ businesses, our partner progression ladder unlocks higher commission rates and specialized co-marketing support.
          </p>
        </div>

        {/* 4-Stage Visual Ladder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Stage 1: Bronze */}
          <div className="bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                Entry Stage
              </span>
              <span className="text-2xl font-black font-mono text-[#142D4E] dark:text-white">15%</span>
            </div>
            <h3 className="text-lg font-bold text-[#142D4E] dark:text-white mb-1">Bronze Partner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Starting point for solo practitioners and independent referral agents.
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>0 – 19 active clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>Basic partner dashboard</span>
              </div>
            </div>
          </div>

          {/* Stage 2: Silver */}
          <div className="bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#0e1b30] px-2.5 py-1 rounded-md">
                Growth Stage
              </span>
              <span className="text-2xl font-black font-mono text-[#142D4E] dark:text-white">20%</span>
            </div>
            <h3 className="text-lg font-bold text-[#142D4E] dark:text-white mb-1">Silver Partner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              For expanding advisory practices and active bookkeeping firms.
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>20 – 49 active clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>Sales enablement resources</span>
              </div>
            </div>
          </div>

          {/* Stage 3: Gold */}
          <div className="bg-white dark:bg-[#101e35] border-2 border-[#1261B5] dark:border-[#B9E51C] rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white bg-[#1261B5] px-2.5 py-1 rounded-md">
                Scale Stage
              </span>
              <span className="text-2xl font-black font-mono text-[#1261B5] dark:text-[#B9E51C]">30%</span>
            </div>
            <h3 className="text-lg font-bold text-[#142D4E] dark:text-white mb-1">Gold Partner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              For established software resellers, accounting firms, and IT integrators.
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>50 – 99 active clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                <span>Co-marketing & Priority SLA</span>
              </div>
            </div>
          </div>

          {/* Stage 4: Platinum */}
          <div className="bg-[#142D4E] dark:bg-[#0c182c] text-white rounded-2xl p-6 relative overflow-hidden shadow-md border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#142D4E] bg-[#B9E51C] px-2.5 py-1 rounded-md">
                Enterprise Stage
              </span>
              <span className="text-2xl font-black font-mono text-[#B9E51C]">40%</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Platinum Partner</h3>
            <p className="text-xs text-slate-300 mb-4">
              Premier tier for regional distributors, enterprise advisory & strategic alliances.
            </p>
            <div className="text-[11px] text-slate-300 space-y-1.5 pt-3 border-t border-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B9E51C]" />
                <span>100+ active enterprise clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B9E51C]" />
                <span>Dedicated Strategic Account Mgr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Upgrade Eligibility Checker Tool */}
        <div className="bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
                <span>Interactive Tool</span>
              </div>
              <h3 className="text-xl font-bold text-[#142D4E] dark:text-white">
                Partner Upgrade Eligibility Checker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Simulate your active client count and test your organization's qualification status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">Current Tier:</span>
              <select
                value={currentTier}
                onChange={(e) => setCurrentTier(e.target.value as PartnerTierId)}
                aria-label="Select Current Tier"
                className="text-xs font-bold text-[#142D4E] dark:text-white bg-slate-100 dark:bg-[#0e1b30] border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
              >
                <option value="bronze">Bronze Partner (15%)</option>
                <option value="silver">Silver Partner (20%)</option>
                <option value="gold">Gold Partner (30%)</option>
                <option value="platinum">Platinum Partner (40%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Slider Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Your Active Paying Customers Portfolio:
                </label>
                <span className="text-sm font-mono font-extrabold text-[#1261B5] dark:text-[#B9E51C]">
                  {activeClientsCount} Clients
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={150}
                value={activeClientsCount}
                onChange={(e) => setActiveClientsCount(parseInt(e.target.value))}
                aria-label="Active Paying Customers Portfolio"
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1261B5] dark:accent-[#B9E51C]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1 client</span>
                <span>20 (Silver)</span>
                <span>50 (Gold)</span>
                <span>100+ (Platinum)</span>
              </div>

              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Upgrade Criteria Evaluated:</strong> Active client volume, recurring subscription gross MRR, account retention rate (&gt;90%), and training certification.
              </div>
            </div>

            {/* Result Box */}
            <div className="lg:col-span-5">
              <div className={`p-5 rounded-xl border ${status.border} ${status.bg} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Evaluation Result
                  </span>
                  <Award className={`w-5 h-5 ${status.color}`} />
                </div>
                <div>
                  <h4 className={`text-base font-extrabold ${status.color}`}>
                    {status.qualifiedTier}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{status.status}</p>
                  <div className="mt-2 text-xs bg-white/60 dark:bg-black/20 p-2 rounded-lg flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Est. Monthly Commission:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatAmount(activeClientsCount * currencyConfig.defaultSubscription * status.rate)} / mo
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Documented Admin Review</span>
                  <span className="text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] flex items-center gap-1">
                    {status.action} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance note */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            *Partner tier upgrades are controlled by the MsmeBooks Partner Operations and Finance committee with a documented approval workflow. No unapproved automated upgrades take effect without compliance verification.
          </p>
        </div>
      </div>
    </section>
  );
};
