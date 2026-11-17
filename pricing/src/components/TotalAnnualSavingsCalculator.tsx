import React, { useState } from 'react';
import {
  Calculator,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Coins,
  Layers,
  Check,
  Building2,
  DollarSign
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { PRICING_PLANS } from '../data/pricingData';
import { useLanguage } from '../context/LanguageContext';

interface TotalAnnualSavingsCalculatorProps {
  currency: Currency;
  onSelectPlan: (planId: string) => void;
}

interface FragmentedTool {
  id: string;
  name: string;
  category: string;
  typicalProvider: string;
  defaultMonthlyNgn: number;
  icon: string;
  includedInMsmeBooks: string;
}

const FRAGMENTED_TOOLS: FragmentedTool[] = [
  {
    id: 'accounting',
    name: 'Accounting & Bookkeeping Software',
    category: 'Finance',
    typicalProvider: 'QuickBooks / Sage / Wave',
    defaultMonthlyNgn: 25000,
    icon: '📊',
    includedInMsmeBooks: 'Double-entry ledger, P&L, VAT, WHT & bank reconciliation',
  },
  {
    id: 'pos',
    name: 'Point of Sale (POS) & Cashier App',
    category: 'Sales',
    typicalProvider: 'Square / Loyverse / Lightspeed',
    defaultMonthlyNgn: 20000,
    icon: '💳',
    includedInMsmeBooks: 'Touch POS, offline sales sync, thermal receipts & barcode scanners',
  },
  {
    id: 'payroll_hr',
    name: 'Payroll & HR Management Software',
    category: 'Human Resources',
    typicalProvider: 'Gusto / BambooHR / SeamlessHR',
    defaultMonthlyNgn: 25000,
    icon: '👥',
    includedInMsmeBooks: 'Payslips, PAYE statutory deductions, leave portal & recruitment',
  },
  {
    id: 'crm_marketing',
    name: 'CRM & Customer Marketing Tool',
    category: 'Growth',
    typicalProvider: 'HubSpot / Mailchimp / Zoho',
    defaultMonthlyNgn: 20000,
    icon: '📣',
    includedInMsmeBooks: 'Customer directory, VIP segmentation, WhatsApp promotions & credit limits',
  },
  {
    id: 'inventory_barcode',
    name: 'Inventory & Barcode Label Software',
    category: 'Logistics',
    typicalProvider: 'Cin7 / TradeGecko / Dymo Software',
    defaultMonthlyNgn: 18000,
    icon: '📦',
    includedInMsmeBooks: 'Stock tracking, multi-warehouse waybills, QR & barcode printing',
  },
  {
    id: 'ecommerce_connector',
    name: 'E-Commerce Multichannel Connector',
    category: 'E-Commerce',
    typicalProvider: 'Zapier Connector / CartSync plugins',
    defaultMonthlyNgn: 15000,
    icon: '🛍️',
    includedInMsmeBooks: 'Direct Shopify, Jumia, Selar & WooCommerce integrations',
  },
];

export const TotalAnnualSavingsCalculator: React.FC<TotalAnnualSavingsCalculatorProps> = ({
  currency,
  onSelectPlan,
}) => {
  const { language } = useLanguage();

  // Active tools state and customized costs in NGN
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>({
    accounting: true,
    pos: true,
    payroll_hr: true,
    crm_marketing: true,
    inventory_barcode: true,
    ecommerce_connector: true,
  });

  const [toolCosts, setToolCosts] = useState<Record<string, number>>({
    accounting: 25000,
    pos: 20000,
    payroll_hr: 25000,
    crm_marketing: 20000,
    inventory_barcode: 18000,
    ecommerce_connector: 15000,
  });

  // Selected plan to compare against (default: Business or Growth)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('growth');
  const [useAnnualBilling, setUseAnnualBilling] = useState<boolean>(true);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };

  const updateToolCost = (toolId: string, val: number) => {
    setToolCosts((prev) => ({
      ...prev,
      [toolId]: Math.max(0, val),
    }));
  };

  // Calculations
  const totalFragmentedMonthlyNgn = FRAGMENTED_TOOLS.reduce((sum, tool) => {
    return activeTools[tool.id] ? sum + (toolCosts[tool.id] || 0) : sum;
  }, 0);

  const totalFragmentedAnnualNgn = totalFragmentedMonthlyNgn * 12;

  const targetPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

  const planMonthlyCostNgn = useAnnualBilling
    ? targetPlan.yearlyPricePerMonth
    : targetPlan.monthlyPrice;

  const planAnnualCostNgn = useAnnualBilling
    ? targetPlan.yearlyPrice
    : targetPlan.monthlyPrice * 12;

  const monthlySavingsNgn = Math.max(0, totalFragmentedMonthlyNgn - planMonthlyCostNgn);
  const annualSavingsNgn = Math.max(0, totalFragmentedAnnualNgn - planAnnualCostNgn);

  const savingsPercentage = totalFragmentedAnnualNgn > 0
    ? Math.round((annualSavingsNgn / totalFragmentedAnnualNgn) * 100)
    : 0;

  const roiMultiplier = planAnnualCostNgn > 0
    ? (annualSavingsNgn / planAnnualCostNgn).toFixed(1)
    : '∞';

  return (
    <section id="savings-calculator" className="py-16 lg:py-24 bg-slate-50 dark:bg-[#081324] border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
            <Coins className="w-3.5 h-3.5 text-emerald-500" />
            <span>Interactive SaaS Cost Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Calculate Your Total Annual Savings
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Stop paying for 5+ fragmented apps and subscription fees. See how much money your business saves every month by consolidating onto MsmeBooks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Fragmented SaaS Tool Sliders */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0D1C30] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#0A4FD5] dark:text-blue-400" />
                  <span>Your Current Fragmented Tool Stack</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select the standalone apps your business currently uses or plans to purchase:
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTools({
                    accounting: true,
                    pos: true,
                    payroll_hr: true,
                    crm_marketing: true,
                    inventory_barcode: true,
                    ecommerce_connector: true,
                  });
                }}
                className="text-xs font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4">
              {FRAGMENTED_TOOLS.map((tool) => {
                const isActive = !!activeTools[tool.id];
                const currentCost = toolCosts[tool.id] || tool.defaultMonthlyNgn;

                return (
                  <div
                    key={tool.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-slate-50/80 dark:bg-[#0A1627] border-slate-200 dark:border-slate-700/80 shadow-xs'
                        : 'bg-white/40 dark:bg-[#0A1627]/40 border-slate-100 dark:border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTool(tool.id)}
                          className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-[#0A4FD5] text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent'
                          }`}
                          aria-label={`Toggle ${tool.name}`}
                        >
                          {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{tool.icon}</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {tool.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            Typical tools: {tool.typicalProvider}
                          </span>
                        </div>
                      </div>

                      {/* Cost Display & Input */}
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-black ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                          {formatCurrency(currentCost, currency)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/month</span>
                      </div>
                    </div>

                    {/* Cost Slider when active */}
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Adjust estimated monthly spend:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatCurrency(currentCost, currency)}/mo
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80000"
                          step="2500"
                          value={currentCost}
                          onChange={(e) => updateToolCost(tool.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A4FD5]"
                        />
                        <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>Included in MsmeBooks: {tool.includedInMsmeBooks}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Comparison Card & ROI Metrics */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Savings Result Card */}
            <div className="bg-gradient-to-b from-[#0E2447] via-[#0B1C38] to-[#08152B] text-white p-7 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-900/60 shadow-xl shadow-blue-950/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#84CC16]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16]/20 text-[#84CC16] text-xs font-black uppercase tracking-wider border border-[#84CC16]/30">
                    <Sparkles className="w-3.5 h-3.5 fill-[#84CC16]" />
                    <span>Your Estimated Savings</span>
                  </span>
                  <span className="text-xs font-bold text-blue-300 bg-blue-900/60 px-2.5 py-1 rounded-lg">
                    {savingsPercentage}% Cost Reduction
                  </span>
                </div>

                {/* Big Annual Savings Number */}
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Total Annual Savings
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-lime-200 to-lime-400">
                    {formatCurrency(annualSavingsNgn, currency)}
                  </div>
                  <div className="text-xs text-lime-300/90 font-semibold mt-1 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Save {formatCurrency(monthlySavingsNgn, currency)} every single month</span>
                  </div>
                </div>

                {/* Comparative Bar Visualization */}
                <div className="mt-8 space-y-4 pt-6 border-t border-blue-900/70">
                  {/* Current Fragmented Stack Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">Current Fragmented SaaS Stack:</span>
                      <span className="font-black text-rose-300">
                        {formatCurrency(totalFragmentedAnnualNgn, currency)}/yr
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
                      <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500 w-full" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Based on {Object.values(activeTools).filter(Boolean).length} standalone tools @ {formatCurrency(totalFragmentedMonthlyNgn, currency)}/mo
                    </span>
                  </div>

                  {/* MsmeBooks All-In-One Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">MsmeBooks ({targetPlan.name} Plan):</span>
                      <span className="font-black text-lime-400">
                        {formatCurrency(planAnnualCostNgn, currency)}/yr
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-[#84CC16] h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            8,
                            Math.min(
                              100,
                              totalFragmentedAnnualNgn > 0
                                ? (planAnnualCostNgn / totalFragmentedAnnualNgn) * 100
                                : 20
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-lime-300/80 mt-1 block">
                      All modules unified into 1 ledger @ {formatCurrency(planMonthlyCostNgn, currency)}/mo
                    </span>
                  </div>
                </div>

                {/* Plan Selector & Billing Toggle */}
                <div className="mt-8 pt-6 border-t border-blue-900/70">
                  <div className="text-xs font-bold text-slate-200 mb-2">
                    Compare Against Plan:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {PRICING_PLANS.slice(0, 6).map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedPlanId === plan.id
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-lime-400'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {plan.name}
                      </button>
                    ))}
                  </div>

                  {/* Annual Billing Toggle inside calculator */}
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-300 font-medium">Apply 20% Annual Discount:</span>
                    <button
                      type="button"
                      onClick={() => setUseAnnualBilling(!useAnnualBilling)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                        useAnnualBilling ? 'bg-[#84CC16]' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                          useAnnualBilling ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Metrics Pill Row */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-blue-900/70 text-center">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ROI Multiplier</span>
                    <span className="text-xl font-black text-lime-400">{roiMultiplier}x</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">SaaS Tools Replaced</span>
                    <span className="text-xl font-black text-white">6 In 1</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(selectedPlanId)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-slate-950 font-black text-sm py-3 px-5 rounded-xl shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 transition-all cursor-pointer"
                  >
                    <span>Switch to {targetPlan.name} & Save {formatCurrency(annualSavingsNgn, currency)}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    🔒 Zero risk. Start free usage model, import data with Excel in 2 mins.
                  </p>
                </div>

              </div>
            </div>

            {/* Additional Value Proposition Badge */}
            <div className="p-4 bg-white dark:bg-[#0D1C30] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                <Building2 className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                <span>Zero Hidden Fees or Foreign Exchange Fluctuations</span>
              </div>
              <p className="leading-relaxed">
                Most international SaaS tools charge in US Dollars ($), exposing your business to currency devaluation and unpredictable card charge rates. MsmeBooks prices are 100% transparent in local Naira (and local African currencies) with guaranteed 24-month price locks.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
