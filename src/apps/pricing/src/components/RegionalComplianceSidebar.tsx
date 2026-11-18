import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  Download,
  Building,
  HelpCircle,
  TrendingUp,
  Percent,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Currency } from '../types';
import { COUNTRY_COMPLIANCE_DATA, CountryComplianceInfo } from '../data/countryCompliance';
import { SUPPORTED_CURRENCIES } from '../utils/currency';
import { getHolidayInfoForCurrency } from '../data/bankHolidays';

interface RegionalComplianceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onSelectPlan?: (planId: string) => void;
}

export const RegionalComplianceSidebar: React.FC<RegionalComplianceSidebarProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectPlan,
}) => {
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>(() => {
    // Map currency to compliance country
    if (currency === 'GHS') return 'Ghana';
    if (currency === 'KES') return 'Kenya';
    if (currency === 'UGX') return 'Uganda';
    if (currency === 'ZAR') return 'South Africa';
    if (currency === 'RWF') return 'Rwanda';
    if (currency === 'GBP') return 'United Kingdom';
    if (currency === 'USD') return 'United States';
    return 'Nigeria';
  });

  const [reminderSaved, setReminderSaved] = useState(false);

  // Sync selected country when currency changes
  React.useEffect(() => {
    if (currency === 'GHS') setSelectedCountryKey('Ghana');
    else if (currency === 'KES') setSelectedCountryKey('Kenya');
    else if (currency === 'UGX') setSelectedCountryKey('Uganda');
    else if (currency === 'ZAR') setSelectedCountryKey('South Africa');
    else if (currency === 'RWF') setSelectedCountryKey('Rwanda');
    else if (currency === 'GBP') setSelectedCountryKey('United Kingdom');
    else if (currency === 'USD') setSelectedCountryKey('United States');
    else setSelectedCountryKey('Nigeria');
  }, [currency]);

  if (!isOpen) return null;

  const compliance = COUNTRY_COMPLIANCE_DATA[selectedCountryKey] || COUNTRY_COMPLIANCE_DATA.Nigeria;
  const currInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
  const holidayInfo = getHolidayInfoForCurrency(compliance.localCurrencyCode || currency);

  // Calculate simulated days until next monthly statutory filing
  const today = new Date();
  const currentDay = today.getDate();
  const filingDay = compliance.code === 'NG' ? 21 : compliance.code === 'KE' ? 20 : 25;
  const daysRemaining = filingDay >= currentDay ? filingDay - currentDay : 30 - (currentDay - filingDay);

  const handleSetReminder = () => {
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#091524] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-900 via-[#0A4FD5] to-blue-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{compliance.flag}</span>
                  <h2 className="text-base font-black tracking-tight text-white">
                    Regional Compliance
                  </h2>
                </div>
                <p className="text-[11px] text-blue-100 font-medium">
                  {compliance.name} Statutory Tax & Regulatory Hub
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close compliance sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Country Quick Selector Tabs */}
          <div className="p-3 bg-slate-50 dark:bg-[#070F1B] border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            {Object.keys(COUNTRY_COMPLIANCE_DATA).slice(0, 7).map((cKey) => {
              const c = COUNTRY_COMPLIANCE_DATA[cKey];
              const isSelected = selectedCountryKey === cKey;
              return (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => setSelectedCountryKey(cKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0A4FD5] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300">
            
            {/* Countdown to Next Statutory Tax Filing Deadline */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-900/60 border border-blue-200/80 dark:border-blue-900/60 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 mb-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Statutory Deadline Countdown</span>
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Next {compliance.code === 'NG' ? 'FIRS' : compliance.code === 'KE' ? 'KRA' : 'Local'} VAT Filing
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Due by: <strong className="text-slate-900 dark:text-white">{compliance.vatFilingDeadline}</strong>
                  </p>
                </div>

                <div className="text-center bg-white dark:bg-[#0B192C] px-3 py-2 rounded-xl border border-blue-200/60 dark:border-blue-900 shadow-xs shrink-0">
                  <div className="text-2xl font-black text-[#0A4FD5] dark:text-blue-400">
                    {daysRemaining}
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Days Left
                  </div>
                </div>
              </div>

              {/* Reminder trigger button */}
              <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Automated schedules generated on all plans
                </span>
                <button
                  type="button"
                  onClick={handleSetReminder}
                  className="px-2.5 py-1 rounded-lg bg-[#0A4FD5] hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  {reminderSaved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                      <span>Filing Alert Saved!</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Set Calendar Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bank Holiday Warning Indicator */}
            {holidayInfo?.activeHolidayWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-950 dark:text-amber-100">
                      Upcoming Public Holiday Notice ({holidayInfo.countryName})
                    </h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      Next: <strong>{holidayInfo.nextHoliday.name}</strong> ({holidayInfo.nextHoliday.dateStr})
                    </p>
                    <p className="text-[10px] text-amber-700/90 dark:text-amber-400 mt-1">
                      {holidayInfo.activeHolidayWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Statutory Rates Grid */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#0A4FD5]" />
                <span>Statutory Rates & Authority</span>
              </h4>

              <div className="space-y-2 bg-slate-50 dark:bg-[#070F1B] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Tax Authority:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {compliance.taxAuthority}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Value-Added Tax (VAT):</span>
                  <span className="font-extrabold text-[#0A4FD5] dark:text-blue-400">
                    {compliance.vatRate}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Withholding Tax (WHT):</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {compliance.withholdingTax}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Corporate Income Tax:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {compliance.corporateTaxRate}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Accounting Standard:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                    {compliance.accountingStandard}
                  </span>
                </div>
              </div>
            </div>

            {/* Electronic Invoicing Mandates */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>E-Invoicing & Digital Fiscalization</span>
              </h4>

              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                    {compliance.electronicInvoicingReq}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  All MsmeBooks invoices generate statutory verification QR codes, digital stamps, and FIRS / KRA / GRA audit-compliant serial tracking automatically.
                </p>
              </div>
            </div>

            {/* Automated Compliance Highlights */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>MsmeBooks Built-In Safeguards</span>
              </h4>

              <div className="space-y-2">
                {compliance.complianceHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B192C] border border-slate-200/80 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16] shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Local Gateways */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                Integrated Settlement Gateways ({compliance.name})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {compliance.recommendedGateways.map((gw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {gw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-100 dark:bg-[#070F1B] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSelectPlan) onSelectPlan('premium');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0A4FD5] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Audit-Ready with MsmeBooks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2">
              Compliant with IFRS for SMEs, FRCN, and local statutory Finance Acts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
