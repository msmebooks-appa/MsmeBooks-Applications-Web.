import React from 'react';
import { Check, Info, ArrowRight, ShieldCheck, Zap, Building2, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode } from '../types/policy';

export const SubscriptionCards: React.FC = () => {
  const { currentCurrency, setCurrency, formatCurrency, convertAmount, currencyDetail } = useCurrency();
  const { t } = useLanguage();

  // Benchmark amounts in base USD
  const monthlyRate = convertAmount(19, 'USD');
  const annualTotal = convertAmount(180, 'USD');
  const annualMonthlyEquivalent = convertAmount(15, 'USD');
  const enterpriseStarting = convertAmount(500, 'USD');
  const oneMonthDeduction = convertAmount(19, 'USD');

  const popularCurrencies: CurrencyCode[] = ['NGN', 'USD', 'GBP', 'EUR', 'KES', 'ZAR', 'GHS'];

  return (
    <section id="subscriptions" className="scroll-mt-24 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>{t('subscriptions.tag', '02. Commercial Subscriptions')}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
              {t('subscriptions.title', 'Subscription & Refund Policy Categories')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {t('subscriptions.subtitle', 'Transparent terms governing recurring licenses, upgrade schedules, cancellations, and billing adjustments.')}
            </p>
          </div>

          {/* Regional Currency Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg shrink-0 self-start sm:self-auto border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 shrink-0">
              {t('subscriptions.currencyToggle', 'Currency:')}
            </span>
            {popularCurrencies.map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all shrink-0 ${
                  currentCurrency === curr
                    ? 'bg-blue-900 dark:bg-lime-400 text-white dark:text-blue-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
            {!popularCurrencies.includes(currentCurrency) && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-900 dark:bg-lime-400 text-white dark:text-blue-950 shrink-0">
                {currentCurrency} ({currencyDetail.symbol})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Commercial Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tier A: Free Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Entry Tier
              </span>
              <span className="text-xs font-semibold text-lime-800 dark:text-lime-300 bg-lime-100 dark:bg-lime-950/60 px-2.5 py-0.5 rounded-full border border-transparent dark:border-lime-800/40">
                {t('subscriptions.freeBadge', 'Zero Financial Risk')}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-blue-950 dark:text-white">
                  {formatCurrency(0)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ forever free</span>
              </div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mt-1">
                {t('subscriptions.freeTitle', 'Free Plan')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                {t('subscriptions.freeDesc', 'Basic digital accounting, essential invoicing, and single-register point of sale for micro-businesses starting their digital journey.')}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">No Subscription Fees:</strong> Completely free to operate with zero recurring billing.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Add-ons & Upgrades:</strong> Optional paid add-ons (WhatsApp messaging credits, multi-currency) are governed by standard module terms.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Zero Termination Penalty:</strong> Accounts can be closed or exported without any financial charges.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-semibold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-transparent dark:border-blue-800/40 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('subscriptions.freeCta', 'Explore Free Plan')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-900 dark:text-blue-300" />
            </a>
          </div>
        </div>

        {/* Tier B: Monthly Subscriptions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monthly Recurring
              </span>
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-transparent dark:border-blue-800/40">
                {t('subscriptions.standardBadge', 'Flexible Monthly Billing')}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-blue-950 dark:text-white">
                  {formatCurrency(monthlyRate)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month ({currentCurrency})</span>
              </div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mt-1">
                {t('subscriptions.standardTitle', 'Monthly Subscriptions')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                {t('subscriptions.standardDesc', 'Standard monthly subscription billed in advance every 30 days for continuous cloud access, multi-user permissions, and automated tax reporting.')}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Cancel Before Renewal:</strong> You can cancel future renewals at any time via your settings dashboard.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Non-Refundable Active Month:</strong> Completed payments are non-refundable for partial month usage; service continues through cycle end.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Accidental Double Debits:</strong> 100% refunded or credited immediately upon gateway validation.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href="#cancellation-procedure"
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Monthly Cancellation Terms</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            </a>
          </div>
        </div>

        {/* Tier C: Annual Subscriptions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-900/20 dark:border-lime-500/30 p-6 flex flex-col justify-between hover:border-blue-900/40 dark:hover:border-lime-500/50 transition-all duration-200 shadow-sm relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-lime-400 uppercase tracking-wider">
                Annual Prepaid Plan
              </span>
              <span className="text-xs font-bold text-lime-900 dark:text-lime-950 bg-lime-300 dark:bg-lime-400 px-2.5 py-0.5 rounded-full">
                14-Day Onboarding Review
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-blue-950 dark:text-white">
                  {formatCurrency(annualTotal)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ year</span>
              </div>
              <p className="text-[11px] text-lime-700 dark:text-lime-400 font-medium">
                Equivalent to {formatCurrency(annualMonthlyEquivalent)} / month (Save ~20% compared to monthly)
              </p>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mt-1">Annual Subscription Plans</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                Prepaid 12-month commercial commitment offering discounted annual pricing for established businesses.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">14-Day Grace Window:</strong> New annual subscribers may request a cancellation within 14 calendar days of initial purchase if the platform does not meet operational needs.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Proration Formula:</strong> Approved 14-day refunds return the annual fee less 1 month standard retail rate (~{formatCurrency(oneMonthDeduction)}) plus payment gateway transaction interchange costs.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Renewal Notice:</strong> Automatic renewal email notifications sent 30 days and 7 days prior to annual charge.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href="#eligibility-matrix"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Review Annual Refund Conditions</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
            </a>
          </div>
        </div>

        {/* Tier D: Enterprise & Custom Plans */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Bespoke & Multi-Branch
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-transparent dark:border-slate-700">
                Contractual SLA
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">From</span>
                <span className="text-3xl font-extrabold font-mono text-blue-950 dark:text-white">
                  {formatCurrency(enterpriseStarting)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
              </div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mt-1">Enterprise & Custom Plans</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                Individually negotiated corporate packages with dedicated database instances, custom ERP integrations, multi-subsidiary consolidation, and dedicated SLA.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Executed Agreement Governs:</strong> Refund, termination, and service credits are governed strictly by the signed Enterprise Service Agreement (ESA).</span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Milestone-Based Billing:</strong> Custom development and integration phases are released against signed acceptance certificates.</span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Account Executive Review:</strong> Direct handling via assigned corporate account manager and legal counsel.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href="mailto:enterprise@msmebooks.org"
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Contact Enterprise Legal Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            </a>
          </div>
        </div>

      </div>

      {/* Critical Commercial Recommendation Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 transition-colors duration-200">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Important Commercial Governance Note for MsmeBooks Leadership:
          </p>
          <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Prior to legal publication, MsmeBooks executive management must formally ratify the commercial rules regarding whether the 14-day annual refund grace window incurs standard payment gateway interchange fee deductions (typically 1.5%–3.5%), and the exact approval threshold required for customer success agents to issue account credits versus cash bank reversals.
          </p>
        </div>
      </div>
    </section>
  );
};
