import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Layers,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Currency, PricingPlan } from '../types';
import { PRICING_PLANS } from '../data/pricingData';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface PlanUpgradeSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  currentPlanId?: string;
  onUpgradeSuccess?: (targetPlanId: string) => void;
}

export const PlanUpgradeSuggestionModal: React.FC<PlanUpgradeSuggestionModalProps> = ({
  isOpen,
  onClose,
  currency,
  currentPlanId = 'starter',
  onUpgradeSuccess,
}) => {
  const { addItem, openCheckout } = useCart();
  const [selectedTargetPlanId, setSelectedTargetPlanId] = useState<string>('growth');

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find((p) => p.id === currentPlanId) || PRICING_PLANS[0];
  const targetPlan = PRICING_PLANS.find((p) => p.id === selectedTargetPlanId) || PRICING_PLANS[1];

  // Calculate pricing difference
  const monthlyCostDifference = Math.max(0, targetPlan.monthlyPrice - currentPlan.monthlyPrice);
  const yearlyCostDifference = Math.max(0, targetPlan.yearlyPrice - currentPlan.yearlyPrice);
  const percentIncrease = currentPlan.monthlyPrice > 0 
    ? Math.round((monthlyCostDifference / currentPlan.monthlyPrice) * 100)
    : 100;

  // Handle 1-click upgrade
  const handleOneClickUpgrade = () => {
    // Add target plan to cart and launch checkout modal
    addItem(targetPlan.id, 'yearly');
    onClose();
    if (onUpgradeSuccess) {
      onUpgradeSuccess(targetPlan.id);
    }
    openCheckout(targetPlan.id, 'yearly');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-[#0B192C] rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-[#0A4FD5] to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Zap className="w-6 h-6 text-lime-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Smart Upgrade Engine</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Recommended Plan Upgrade
              </h3>
              <p className="text-xs text-blue-100">
                Calculated based on your team user seats & required business module features.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close upgrade advisor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Usage Pattern Analysis Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-950 dark:text-amber-200">
                  Team Seat & Module Expansion Alert
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  You are currently on the <strong className="font-extrabold">{currentPlan.name}</strong> flat plan ({currentPlan.usersLimit} at {formatCurrency(currentPlan.monthlyPrice, currency)}/mo).
                  Your team needs more cashier/manager seats and advanced modules (CRM, Payroll, Multi-Branch).
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Team Logins:</span>{' '}
                <strong className="text-red-600 dark:text-red-400">1 / 1 Seat (At Capacity)</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Transactions:</span>{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">Unlimited (₦0 fees)</strong>
              </div>
            </div>
          </div>

          {/* Select Target Tier */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
              Select Suggested Upgrade Tier:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['growth', 'premium'].map((pId) => {
                const plan = PRICING_PLANS.find((p) => p.id === pId);
                if (!plan) return null;
                const isSelected = selectedTargetPlanId === pId;

                return (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => setSelectedTargetPlanId(pId)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/50 border-[#0A4FD5] dark:border-blue-500 ring-2 ring-[#0A4FD5]/30 shadow-xs'
                        : 'bg-white dark:bg-[#0D1C30] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {pId === 'premium' && (
                      <span className="absolute -top-2 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-400 text-slate-950">
                        Best Value
                      </span>
                    )}
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {plan.name}
                    </div>
                    <div className="text-[11px] text-[#0A4FD5] dark:text-blue-400 font-extrabold mt-0.5">
                      {plan.usersLimit}
                    </div>
                    <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-1">
                      {formatCurrency(plan.monthlyPrice, currency)}/mo
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cost Difference Breakdown Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#091524] dark:to-[#0D1C30] border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
              Net Cost Difference
            </h4>

            <div className="flex items-baseline justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Current Plan ({currentPlan.name}):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(currentPlan.monthlyPrice, currency)}/mo
              </span>
            </div>

            <div className="flex items-baseline justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Target Plan ({targetPlan.name}):</span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(targetPlan.monthlyPrice, currency)}/mo
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Net Monthly Difference:
              </span>
              <div className="text-right">
                <span className="text-base font-black text-[#0A4FD5] dark:text-blue-400">
                  +{formatCurrency(monthlyCostDifference, currency)}/mo
                </span>
                <div className="text-[10px] text-slate-400">
                  (Only {formatCurrency(Math.round(monthlyCostDifference / 30), currency)}/day)
                </div>
              </div>
            </div>
          </div>

          {/* What You Unlock Instantly */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
              What You Unlock Instantly on {targetPlan.name}:
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Upgrade to {targetPlan.usersLimit} with separate staff login credentials</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Expanded capacity: up to 5,000+ invoices annually</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Comprehensive HR, statutory payroll & employee self-service portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#070F1B] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Stay on {currentPlan.name}
          </button>

          <button
            type="button"
            onClick={handleOneClickUpgrade}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#0A4FD5] hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Upgrade to {targetPlan.name} with One Click</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
