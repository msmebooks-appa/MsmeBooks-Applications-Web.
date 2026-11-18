import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  FileText,
  BadgeCheck,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { RegionalTaxCalculation } from '../utils/regionalTaxCalculator';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';

interface RegionalTaxCalculatorProps {
  taxCalculation: RegionalTaxCalculation;
  currency: Currency;
  isRecalculating?: boolean;
  userTaxId?: string;
  onTaxIdChange?: (taxId: string) => void;
  isB2BExempt: boolean;
  onToggleB2BExempt: (exempt: boolean) => void;
}

export const RegionalTaxCalculator: React.FC<RegionalTaxCalculatorProps> = ({
  taxCalculation,
  currency,
  isRecalculating = false,
  userTaxId = '',
  onTaxIdChange,
  isB2BExempt,
  onToggleB2BExempt,
}) => {
  const [showItemizedLevies, setShowItemizedLevies] = useState(false);
  const [taxIdInput, setTaxIdInput] = useState(userTaxId);

  useEffect(() => {
    setTaxIdInput(userTaxId);
  }, [userTaxId]);

  const handleTaxIdBlur = () => {
    if (onTaxIdChange) {
      onTaxIdChange(taxIdInput);
    }
  };

  const isTinValid = Boolean(taxIdInput && taxIdInput.trim().length >= 5);

  return (
    <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-slate-50 dark:from-[#081B34] dark:via-[#071528] dark:to-[#050E1B] p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-900/80 shadow-xs transition-all space-y-3">
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl" role="img" aria-label={taxCalculation.country}>
              {taxCalculation.flag}
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{taxCalculation.country} Statutory Tax Regime</span>
              {isRecalculating && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0A4FD5] dark:text-blue-300 bg-blue-100 dark:bg-blue-900/80 px-1.5 py-0.2 rounded animate-pulse">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>Updating Rules...</span>
                </span>
              )}
            </span>
          </div>

          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
            Administered by <strong className="text-[#0A4FD5] dark:text-blue-300">{taxCalculation.taxAuthority}</strong>
          </p>
        </div>

        {/* Applied Tax Badge */}
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border shadow-2xs ${
              taxCalculation.isExempted
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-blue-100 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300 border-blue-300 dark:border-blue-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {taxCalculation.isExempted
                ? '0.0% B2B Reverse Charge'
                : `${taxCalculation.effectiveTaxRatePercent}% ${taxCalculation.taxSchemeName.split('/')[0].trim()}`}
            </span>
          </span>
        </div>
      </div>

      {/* Tax Amount Summary Row */}
      <div className="pt-2 border-t border-blue-200/60 dark:border-slate-800 flex items-baseline justify-between text-xs">
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <span>Calculated Statutory Tax:</span>
            {taxCalculation.breakdown.length > 1 && (
              <button
                type="button"
                onClick={() => setShowItemizedLevies(!showItemizedLevies)}
                className="text-[10px] font-extrabold text-[#0A4FD5] dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 ml-1 cursor-pointer"
              >
                <span>{showItemizedLevies ? 'Hide Levies' : `View ${taxCalculation.breakdown.length} Levies`}</span>
                {showItemizedLevies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </span>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Filing Deadline: {taxCalculation.filingDeadline}
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-black text-[#0A4FD5] dark:text-blue-400 tabular-nums">
            +{formatCurrency(taxCalculation.taxAmountNgn, currency)}
          </span>
          <div className="text-[10px] text-slate-500">
            {taxCalculation.isExempted ? 'Exempted via TIN' : `Rate: ${taxCalculation.effectiveTaxRatePercent}%`}
          </div>
        </div>
      </div>

      {/* Itemized Levies Accordion (e.g. Ghana VAT + NHIL + GETFund + COVID) */}
      {(showItemizedLevies || taxCalculation.breakdown.length > 1) && (
        <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-blue-200/70 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800">
            <span>Statutory Component Breakdown</span>
            <span>Rate &amp; Amount</span>
          </div>

          {taxCalculation.breakdown.map((levy, idx) => (
            <div key={idx} className="flex justify-between items-start py-0.5 text-[11px]">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {levy.name}
                </span>
                {levy.description && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {levy.description}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {levy.ratePercent > 0 ? `+${formatCurrency(levy.amountNgn, currency)}` : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ({levy.ratePercent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* B2B Reverse-Charge / Tax Exemption Option */}
      {taxCalculation.isB2BExemptEligible && (
        <div className="pt-2 border-t border-blue-200/60 dark:border-slate-800">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={isB2BExempt}
              onChange={(e) => onToggleB2BExempt(e.target.checked)}
              className="mt-0.5 rounded text-[#0A4FD5] focus:ring-0 cursor-pointer"
            />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Claim B2B Reverse Charge / Corporate Tax Exemption</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  0% Export VAT
                </span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                For registered companies outside Nigeria claiming cross-border input tax self-assessment with a valid local tax registration number.
              </p>
            </div>
          </label>

          {/* Conditional TIN Input Field */}
          {isB2BExempt && (
            <div className="mt-2.5 pl-6 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {taxCalculation.tinLabel} *
                </label>
                {isTinValid ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    <span>Valid format</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Tax ID required for 0% rating</span>
                  </span>
                )}
              </div>

              <input
                type="text"
                value={taxIdInput}
                onChange={(e) => {
                  setTaxIdInput(e.target.value);
                  if (onTaxIdChange) onTaxIdChange(e.target.value);
                }}
                onBlur={handleTaxIdBlur}
                placeholder={taxCalculation.tinPlaceholder}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5]"
              />

              {taxCalculation.isExempted ? (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                  ✓ 0% Reverse-charge applied. Invoiced under corporate Tax ID: <strong>{taxIdInput}</strong>.
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Please provide a valid corporate tax identifier to apply the 0% reverse charge rating.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Compliance Note */}
      <div className="pt-2 border-t border-blue-200/40 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
          <span>E-Invoicing Standard: <strong>{taxCalculation.eInvoicingSystem}</strong></span>
        </span>
        <span className="text-slate-400">Automated Tax Stamping</span>
      </div>
    </div>
  );
};
