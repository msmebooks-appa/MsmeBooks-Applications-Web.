import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  MessageCircle, 
  ArrowRight,
  PieChart,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ServiceItem } from '../data/servicesData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';

interface ComplianceSavingsWidgetProps {
  selectedCountry: string;
  onBookServiceBundle?: (serviceIds: string[], totalSavingsStr: string) => void;
}

interface ServiceToggleOption {
  id: string;
  name: string;
  category: string;
  basePenaltyRisk: number; // in NGN
  annualOverheadSavings: number; // in NGN
  adminHoursSaved: number;
}

const SERVICE_OPTIONS: ServiceToggleOption[] = [
  {
    id: 'srv-tax-advisory',
    name: 'Corporate Tax & CIT Filing',
    category: 'Taxation & Regulatory',
    basePenaltyRisk: 450000, // Late filing penalty + interest + CIT reassessments
    annualOverheadSavings: 380000,
    adminHoursSaved: 65,
  },
  {
    id: 'srv-vat-wht-compliance',
    name: 'Monthly VAT & WHT Returns',
    category: 'Taxation & Regulatory',
    basePenaltyRisk: 300000, // FIRS monthly ₦50k/₦25k non-filing penalties
    annualOverheadSavings: 240000,
    adminHoursSaved: 50,
  },
  {
    id: 'srv-bookkeeping-monthly',
    name: 'Monthly Bookkeeping Outsourcing',
    category: 'Accounting & Bookkeeping',
    basePenaltyRisk: 250000, // Miscalculated P&L, lost deductions
    annualOverheadSavings: 1800000, // Hiring full-time accountant vs outsourced retainer
    adminHoursSaved: 160,
  },
  {
    id: 'srv-payroll-outsourcing',
    name: 'PAYE & Pension Compliance',
    category: 'Payroll & HR',
    basePenaltyRisk: 350000, // State Internal Revenue PAYE audit fines & pension penalties
    annualOverheadSavings: 420000,
    adminHoursSaved: 75,
  },
  {
    id: 'srv-pos-retail-setup',
    name: 'POS & Automated Inventory Setup',
    category: 'Software Implementation',
    basePenaltyRisk: 180000, // Inaccurate sales reporting & unrecorded cash
    annualOverheadSavings: 650000, // Shrinkage & pilferage reduction
    adminHoursSaved: 90,
  },
  {
    id: 'srv-internal-controls-audit',
    name: 'Internal Stock & Risk Audit',
    category: 'Audit & Internal Control',
    basePenaltyRisk: 220000, // Fraud exposure & stock mismatch
    annualOverheadSavings: 720000, // Shrinkage recovery
    adminHoursSaved: 40,
  },
];

export const ComplianceSavingsWidget: React.FC<ComplianceSavingsWidgetProps> = ({
  selectedCountry,
  onBookServiceBundle,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [businessScale, setBusinessScale] = useState<'Micro' | 'Small' | 'Medium' | 'Growing'>('Small');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'srv-tax-advisory',
    'srv-vat-wht-compliance',
    'srv-bookkeeping-monthly',
    'srv-payroll-outsourcing',
  ]);

  const { currentCurrency } = useCurrency();
  const currencySymbol = currentCurrency.symbol;
  const rateMultiplier = currentCurrency.rateFromNGN;

  // Scale multiplier
  const scaleMultiplier = useMemo(() => {
    switch (businessScale) {
      case 'Micro': return 0.65;
      case 'Small': return 1.0;
      case 'Medium': return 1.85;
      case 'Growing': return 2.7;
    }
  }, [businessScale]);

  // Toggle selection
  const handleToggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length === 1) return; // Keep at least one
      setSelectedServiceIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedServiceIds(prev => [...prev, id]);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const activeOptions = SERVICE_OPTIONS.filter(o => selectedServiceIds.includes(o.id));

    const rawPenaltyAvoidance = activeOptions.reduce((sum, o) => sum + o.basePenaltyRisk, 0) * scaleMultiplier;
    const rawOverheadSavings = activeOptions.reduce((sum, o) => sum + o.annualOverheadSavings, 0) * scaleMultiplier;
    const totalHoursSaved = Math.round(activeOptions.reduce((sum, o) => sum + o.adminHoursSaved, 0) * scaleMultiplier);

    // Founder time value estimated at ₦3,500/hr
    const founderTimeValuation = totalHoursSaved * 3500;
    const totalAnnualSavingsNGN = rawPenaltyAvoidance + rawOverheadSavings + founderTimeValuation;

    // Traditional approach annual cost estimation (In-house staff + penalties risk)
    const traditionalCostNGN = totalAnnualSavingsNGN * 1.62;
    // MsmeBooks managed cost (software + verified retainer)
    const msmeBooksCostNGN = traditionalCostNGN - totalAnnualSavingsNGN;

    const savingsPercentage = Math.round((totalAnnualSavingsNGN / traditionalCostNGN) * 100);

    return {
      totalAnnualSavings: Math.round(totalAnnualSavingsNGN * rateMultiplier),
      penaltyAvoidance: Math.round(rawPenaltyAvoidance * rateMultiplier),
      overheadSavings: Math.round(rawOverheadSavings * rateMultiplier),
      timeValueSavings: Math.round(founderTimeValuation * rateMultiplier),
      traditionalCost: Math.round(traditionalCostNGN * rateMultiplier),
      msmeBooksCost: Math.round(msmeBooksCostNGN * rateMultiplier),
      totalHoursSaved,
      savingsPercentage,
    };
  }, [selectedServiceIds, scaleMultiplier, rateMultiplier]);

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // WhatsApp link with calculated savings context
  const whatsAppDeepLink = buildWhatsAppBookingUrl({
    serviceName: `Compliance & Bookkeeping Bundle (${selectedServiceIds.length} services)`,
    packageName: `Estimated Annual Savings: ${formatCurrency(calculations.totalAnnualSavings)}`,
    requirements: `Client used the Compliance Savings Calculator for a ${businessScale} business scale in ${selectedCountry}. Projected savings: ${formatCurrency(calculations.totalAnnualSavings)} / yr.`,
  });

  return (
    <div className="mb-10 bg-white dark:bg-[#0A1727] rounded-3xl border border-blue-200/90 dark:border-slate-800 shadow-md overflow-hidden transition-all duration-300 text-slate-800 dark:text-slate-100">
      
      {/* Widget Header Banner */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-[#102B4E] via-[#1464C8] to-[#102B4E] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#B7E532] border border-white/20 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-full">
                Interactive ROI Calculator
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                {selectedCountry} Compliance Benchmark
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
              Estimated Annual Compliance & Operations Savings
            </h3>
          </div>
        </div>

        {/* Quick metric pill & Expand Toggle */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">
              Projected Annual Savings
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#B7E532] tracking-tight">
              {formatCurrency(calculations.totalAnnualSavings)}
              <span className="text-xs text-white font-medium"> / yr</span>
            </span>
          </div>

          <button 
            type="button" 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title={isExpanded ? 'Collapse calculator' : 'Expand calculator'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Body */}
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          
          {/* Top Controls: Business Scale Selector & Selected Services */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100 dark:border-slate-800">
            
            {/* Scale Selector */}
            <div className="lg:col-span-5 space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Select Business Scale:</span>
                <span className="text-[#1464C8] dark:text-[#B7E532] font-black">({businessScale})</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Micro', 'Small', 'Medium', 'Growing'] as const).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setBusinessScale(scale)}
                    className={`py-2 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      businessScale === scale
                        ? 'bg-[#102B4E] dark:bg-slate-800 text-[#B7E532] border-[#102B4E] dark:border-slate-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                Adjusts transaction volume, payroll staff count, and exposure risk.
              </p>
            </div>

            {/* Quick Service Checklist Pills */}
            <div className="lg:col-span-7 space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Toggle Services in Your Compliance Bundle:
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((opt) => {
                  const isChecked = selectedServiceIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleService(opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isChecked
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-[#B7E532] border-[#1464C8] dark:border-[#B7E532] ring-1 ring-[#1464C8]/30'
                          : 'bg-white dark:bg-[#0D1D31] text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-[#1464C8] dark:bg-[#B7E532]' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DATA VISUALIZATION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual 1: Comparative Stacked Bar Chart & Cost Comparison */}
            <div className="lg:col-span-6 bg-slate-50/80 dark:bg-[#08121E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-slate-100 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#1464C8] dark:text-blue-400" />
                  Annual Cost & Exposure Comparison
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#B7E532] text-[11px] font-bold rounded-md">
                  {calculations.savingsPercentage}% Net Cost Reduction
                </span>
              </div>

              {/* Comparative Progress Bars */}
              <div className="space-y-4 pt-2">
                {/* Bar 1: Without MsmeBooks (Traditional In-House + Penalties) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Traditional Approach & Penalty Exposure
                    </span>
                    <span className="text-red-700 dark:text-red-400 font-black">{formatCurrency(calculations.traditionalCost)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-6 rounded-xl overflow-hidden p-0.5 flex">
                    <div 
                      className="bg-red-500 h-full rounded-lg transition-all duration-500" 
                      style={{ width: '100%' }}
                      title="Includes in-house accountant salary, late tax fines, and manual bookkeeping inefficiencies"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Full-time accountant salaries + tax penalty risks</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Bar 2: With MsmeBooks Managed Ecosystem */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-[#1464C8] dark:text-[#B7E532]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                      With MsmeBooks + Verified Retainer
                    </span>
                    <span className="text-[#1464C8] dark:text-[#B7E532] font-black">{formatCurrency(calculations.msmeBooksCost)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-6 rounded-xl overflow-hidden p-0.5 flex">
                    <div 
                      className="bg-gradient-to-r from-[#1464C8] to-[#B7E532] h-full rounded-lg transition-all duration-500" 
                      style={{ width: `${Math.max(10, 100 - calculations.savingsPercentage)}%` }}
                      title="Outsourced professional retainer + MsmeBooks cloud platform"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Software license + certified partner retainers</span>
                    <span className="font-extrabold text-emerald-600 dark:text-[#B7E532]">Saved: {formatCurrency(calculations.totalAnnualSavings)}</span>
                  </div>
                </div>
              </div>

              {/* Time saved metric */}
              <div className="p-3.5 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-[#102B4E] dark:text-slate-100 block">
                    {calculations.totalHoursSaved} Executive Hours Reclaimed
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Founder & managerial hours redirected toward revenue growth
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-[#B7E532]/30 text-[#102B4E] dark:text-[#B7E532] font-black rounded-lg text-xs shrink-0">
                  ~{Math.round(calculations.totalHoursSaved / 8)} Working Days
                </span>
              </div>

            </div>

            {/* Visual 2: Savings Breakdown Grid */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                Estimated Annual Savings Breakdown:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Breakdown Item 1 */}
                <div className="p-4 bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase block">
                    Penalty Avoidance
                  </span>
                  <div className="text-lg font-black text-red-600 dark:text-red-400">
                    {formatCurrency(calculations.penaltyAvoidance)}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    FIRS / KRA late filing penalties & WHT/VAT audit interest avoided.
                  </p>
                </div>

                {/* Breakdown Item 2 */}
                <div className="p-4 bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase block">
                    Overhead Savings
                  </span>
                  <div className="text-lg font-black text-[#1464C8] dark:text-blue-300">
                    {formatCurrency(calculations.overheadSavings)}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Outsourced retainer vs hiring in-house chartered accounting staff.
                  </p>
                </div>

                {/* Breakdown Item 3 */}
                <div className="p-4 bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase block">
                    Founder Time Value
                  </span>
                  <div className="text-lg font-black text-emerald-700 dark:text-[#B7E532]">
                    {formatCurrency(calculations.timeValueSavings)}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Valuation of eliminated manual bookkeeping & paperwork hours.
                  </p>
                </div>
              </div>

              {/* Total Summary Highlight Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-[#0D1D31] dark:to-[#09221C] rounded-2xl border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider block">
                    Total Estimated Annual Gain
                  </span>
                  <div className="text-2xl font-black text-[#102B4E] dark:text-white tracking-tight">
                    {formatCurrency(calculations.totalAnnualSavings)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold"> / annum</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={whatsAppDeepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#B7E532] hover:bg-[#a5d225] text-[#102B4E] font-black text-xs rounded-xl shadow-xs transition-transform hover:scale-105 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                    <span>WhatsApp Proposal</span>
                  </a>

                  <button
                    onClick={() => {
                      if (onBookServiceBundle) {
                        onBookServiceBundle(selectedServiceIds, formatCurrency(calculations.totalAnnualSavings));
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Bundle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
            <span>
              * Calculations modeled on average statutory penalty schedules (FIRS, GRA, KRA, SARS) and prevailing chartered accounting staffing rates in {selectedCountry}.
            </span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {selectedServiceIds.length} Services Selected
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
