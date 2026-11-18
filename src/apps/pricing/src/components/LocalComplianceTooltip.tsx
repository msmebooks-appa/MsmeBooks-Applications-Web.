import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Building2,
  FileCheck2,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { getComplianceForCountry, CountryComplianceInfo } from '../data/countryCompliance';

interface LocalComplianceTooltipProps {
  country: string;
  variant?: 'inline-card' | 'badge-popover' | 'compact-trigger';
  placement?: 'top' | 'bottom';
  align?: 'left' | 'right';
  className?: string;
}

export const LocalComplianceTooltip: React.FC<LocalComplianceTooltipProps> = ({
  country,
  variant = 'badge-popover',
  placement = 'bottom',
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const info: CountryComplianceInfo = getComplianceForCountry(country);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Variant 1: Full Inline Compliance Notice Card (always visible in checkout)
  if (variant === 'inline-card') {
    return (
      <div
        className={`bg-gradient-to-br from-blue-50/80 via-white to-lime-50/40 dark:from-[#091C36] dark:via-[#071324] dark:to-[#081F26] p-3.5 sm:p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs space-y-3 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{info.flag}</span>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <span>{info.name} Tax & Accounting Compliance</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 font-bold px-1.5 py-0.2 rounded">
                  {info.taxAuthority.split('/')[0].trim()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Statutory filing deadlines & regional accounting standards
              </span>
            </div>
          </div>

          <span className="text-[10px] bg-lime-400/20 text-lime-700 dark:text-lime-300 font-extrabold px-2 py-0.5 rounded-full border border-lime-400/40 shrink-0">
            Auto-Compliant
          </span>
        </div>

        {/* 2-column compliance grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
              <span>VAT Filing Deadline:</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white">
              {info.vatFilingDeadline}
            </div>
            <div className="text-[10px] text-slate-500">
              Rate: <span className="font-semibold text-[#0A4FD5]">{info.vatRate}</span>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3 h-3 text-lime-500" />
              <span>Accounting Standard:</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white truncate">
              {info.accountingStandard}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              E-Invoicing: {info.electronicInvoicingReq}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="pt-2 border-t border-blue-200/50 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            How MsmeBooks Automates {info.name} Compliance:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-700 dark:text-slate-300">
            {info.complianceHighlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#84CC16] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isPlacementTop = placement === 'top';
  const isAlignRight = align === 'right';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      {variant === 'compact-trigger' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100/70 hover:bg-blue-200/70 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 border border-blue-200/80 dark:border-blue-800 text-[10px] font-bold text-[#0A4FD5] dark:text-blue-300 transition-colors cursor-pointer group"
          aria-label="View tax compliance info"
          title={`View compliance rules for ${info.name}`}
        >
          <Info className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Compliance Rules</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold text-[#0A4FD5] dark:text-blue-300 transition-all cursor-pointer shadow-2xs group"
          aria-label="View local tax compliance info"
          title={`View statutory tax and accounting requirements for ${info.name}`}
        >
          <span>{info.flag}</span>
          <span className="font-bold">{info.name}:</span>
          <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
            {info.vatFilingDeadline.split('(')[0].trim()}
          </span>
          <Info className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Floating Tooltip Card */}
      {isOpen && (
        <div
          className={`absolute z-50 w-[300px] sm:w-[360px] bg-white dark:bg-[#0B192C] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 text-xs animate-in fade-in zoom-in-95 duration-150 ${
            isPlacementTop ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${isAlignRight ? 'right-0' : 'left-0 sm:left-auto'}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{info.flag}</span>
              <div>
                <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{info.name} Compliance Profile</span>
                  <span className="text-[9px] bg-lime-400/20 text-lime-700 dark:text-lime-300 font-bold px-1.5 rounded">
                    Active
                  </span>
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {info.taxAuthority}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid of Statutory Deadlines */}
          <div className="py-3 space-y-2 text-[11px]">
            <div className="flex items-start justify-between bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400 shrink-0" />
                <span className="font-bold">VAT Filing Date:</span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-right">
                {info.vatFilingDeadline}
              </span>
            </div>

            <div className="flex items-start justify-between bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Scale className="w-3.5 h-3.5 text-lime-500 shrink-0" />
                <span className="font-bold">Standard VAT / TVA:</span>
              </div>
              <span className="font-extrabold text-[#0A4FD5] dark:text-blue-400 text-right">
                {info.vatRate}
              </span>
            </div>

            <div className="flex items-start justify-between bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-bold">Accounting Standard:</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right text-[10px]">
                {info.accountingStandard.split('/')[0].trim()}
              </span>
            </div>
          </div>

          {/* Key Compliance Features */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              MsmeBooks Automated Tools for {info.name}:
            </span>
            <ul className="space-y-1 text-[10px] text-slate-600 dark:text-slate-300">
              {info.complianceHighlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#84CC16] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Local Gateways Footer */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>Gateways for {info.name}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {info.recommendedGateways.slice(0, 2).join(', ')}
            </span>
          </div>

          {/* Arrow Pointer */}
          {isPlacementTop ? (
            <div className="absolute left-6 -bottom-1.5 w-3 h-3 bg-white dark:bg-[#0B192C] border-r border-b border-slate-200 dark:border-slate-700 transform rotate-45" />
          ) : (
            <div className="absolute left-6 -top-1.5 w-3 h-3 bg-white dark:bg-[#0B192C] border-l border-t border-slate-200 dark:border-slate-700 transform rotate-45" />
          )}
        </div>
      )}
    </div>
  );
};
