import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Check,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import {
  VOLUME_PRESETS,
  USER_STEPS,
  BUSINESS_MODULES,
  getRecommendedPlanForUsage,
  calculatePlanVolumePricing,
  TIER_LIMITS,
} from '../utils/volumePricing';
import { CurrencyTrendTooltip } from './CurrencyTrendTooltip';

interface VolumePricingSliderProps {
  users: number;
  transactions?: number;
  onUsersChange: (users: number) => void;
  onTransactionsChange?: (transactions: number) => void;
  currency: Currency;
  onReset: () => void;
}

export const VolumePricingSlider: React.FC<VolumePricingSliderProps> = ({
  users,
  onUsersChange,
  currency,
  onReset,
}) => {
  const { language } = useLanguage();
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'pos_invoicing',
    'core_accounting',
  ]);

  const recommendedPlanId = getRecommendedPlanForUsage(users, selectedModules);
  const recommendedCalc = calculatePlanVolumePricing(
    recommendedPlanId,
    users,
    0,
    'monthly'
  );

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((m) => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleReset = () => {
    setSelectedModules(['pos_invoicing', 'core_accounting']);
    onReset();
  };

  // Slider progress fill percentage
  const userMin = USER_STEPS[0];
  const userMax = USER_STEPS[USER_STEPS.length - 1];
  const userProgressPercent = Math.min(
    100,
    Math.max(0, ((users - userMin) / (userMax - userMin)) * 100)
  );

  const planTitles: Record<string, string> = {
    starter: 'Starter (Single User)',
    growth: 'Growth (2 Users)',
    business: 'Business (3 Users)',
    premium: 'Premium (10 Users)',
    professional: 'Professional (10 Users)',
    enterprise: 'Enterprise (15 Users)',
    superior: 'Superior (20 Users)',
    ultimate: 'Ultimate (30 Users)',
    ultimate_prime: 'Ultimate Prime (40 Users)',
    custom: 'Custom Enterprise (50+ Users)',
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0C1E3A] to-[#0A1628] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-blue-900/60 relative overflow-hidden mb-12">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#84CC16]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase mb-2.5">
            <Sliders className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>Flat Subscription & Module Usage Selector</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Predictable Flat Pricing • Zero Transaction Fees</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Subscriptions are based strictly on <strong>team user seats</strong> and <strong>feature module usage</strong>. Process unlimited invoices and sales without any per-transaction fee or volume surcharges.
          </p>
        </div>

        {/* Reset button & Live recommendation summary */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="Reset to Starter single user"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600/40 to-lime-500/20 border border-lime-400/40 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-lime-300">
                Recommended Flat Tier
              </div>
              <div className="text-sm font-black text-white capitalize">
                {planTitles[recommendedPlanId] || recommendedPlanId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset scale buttons */}
      <div className="relative z-10 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-lime-400" />
            <span>Quick Scale Presets:</span>
          </span>
          <span className="text-[11px] text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded-full border border-lime-400/20">
            Unlimited Transactions on All Plans
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {VOLUME_PRESETS.map((preset) => {
            const isSelected = users === preset.users;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onUsersChange(preset.users);
                  setSelectedModules(preset.includedModules);
                }}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/40 border-lime-400 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{preset.icon}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Dimension 1 (User Seats) & Dimension 2 (Feature Modules) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column (5 cols): Team User Seats Slider */}
        <div className="lg:col-span-5 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <label
                  htmlFor="users-slider"
                  className="text-xs sm:text-sm font-black text-white"
                >
                  Active Staff & Cashier Seats
                </label>
                <p className="text-[11px] text-slate-400">
                  Cashiers, inventory staff, accountants & store managers
                </p>
              </div>
            </div>

            {/* Current value display chip */}
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-lime-400 font-mono">
                {users}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">
                {users === 1 ? 'seat' : 'seats'}
              </span>
            </div>
          </div>

          {/* Interactive Range Input */}
          <div className="relative my-4">
            <input
              id="users-slider"
              type="range"
              min={1}
              max={50}
              step={1}
              value={users}
              onChange={(e) => onUsersChange(Number(e.target.value))}
              aria-label="Active team members or cashier seats"
              className="w-full h-3 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-[#84CC16] focus:outline-none focus:ring-2 focus:ring-lime-400"
              style={{
                background: `linear-gradient(to right, #84CC16 0%, #0A4FD5 ${userProgressPercent}%, #334155 ${userProgressPercent}%, #334155 100%)`,
              }}
            />
          </div>

          {/* Quick markers */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
            <span>1 (Starter)</span>
            <span>2 (Growth)</span>
            <span>3 (Business)</span>
            <span>10 (Premium)</span>
            <span>15 (Enterprise)</span>
            <span>30+</span>
          </div>

          {/* Step Pill Buttons for quick tapping */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
            {[1, 2, 3, 5, 10, 15, 20, 30].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => onUsersChange(step)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  users === step
                    ? 'bg-lime-400 text-slate-900 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {step} {step === 1 ? 'user (₦4,500)' : step === 2 ? 'users (₦9,000)' : step === 3 ? 'users (₦15,000)' : `${step} users`}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Zero Transaction Cost Guarantee</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              No extra charges per invoice, transaction, or sale. Whether you ring up 50 sales a day or 50,000 sales a month, your monthly subscription fee stays completely flat.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Business Module & Feature Usage Checkbox Grid */}
        <div className="lg:col-span-7 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-lime-500/20 text-lime-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Select Required Business Modules & Features
                </h4>
                <p className="text-[11px] text-slate-400">
                  Select the capabilities your business uses; plans scale based on module depth
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedModules.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {BUSINESS_MODULES.map((module) => {
              const isChecked = selectedModules.includes(module.id);
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isChecked
                      ? 'bg-blue-950/70 border-[#0A4FD5] text-white shadow-xs ring-1 ring-[#0A4FD5]/50'
                      : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/70 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-[#0A4FD5] border-[#0A4FD5] text-white'
                        : 'border-slate-600 bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs truncate text-white">
                        {module.icon} {module.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {module.description}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-300 bg-blue-900/40 px-1.5 py-0.2 rounded border border-blue-800/40">
                      From {module.minPlanName} Tier
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Summary Bar with Flat Pricing Confirmation */}
      <div className="relative z-10 mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800 to-blue-950/60 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>
              <span className="text-slate-400">Recommended Flat Plan: </span>
              <strong className="text-white capitalize font-black">
                {planTitles[recommendedPlanId] || recommendedPlanId}
              </strong>
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Flat Monthly Subscription: </span>
              <CurrencyTrendTooltip currency={currency} showInlineBadge={true} align="center">
                <strong className="text-lime-300 font-mono font-black text-sm hover:underline cursor-pointer">
                  {formatCurrency(recommendedCalc.monthlyTotalNgn, currency)}/mo
                </strong>
              </CurrencyTrendTooltip>
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 text-[11px]">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>₦0 Transaction Fees • Unlimited Usage</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            No usage overages. Plan prices in the table below remain 100% flat.
          </span>
        </div>
      </div>
    </div>
  );
};
