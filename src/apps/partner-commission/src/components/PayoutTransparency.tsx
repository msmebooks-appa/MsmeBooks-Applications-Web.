import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const PayoutTransparency: React.FC = () => {
  const { formatFromNGN, currencyConfig } = useCurrency();
  const lifecycleSteps = [
    { step: 1, title: 'Referral Registered', desc: 'Customer registers via partner link or enters partner code.' },
    { step: 2, title: 'Customer Subscribes', desc: 'SME selects and pays for qualifying MsmeBooks plan.' },
    { step: 3, title: 'Payment Confirmed', desc: 'Transaction clears through approved payment gateway.' },
    { step: 4, title: 'Commission Calculated', desc: 'Tier percentage (15%–40%) automatically logged in ledger.' },
    { step: 5, title: 'Commission Approved', desc: 'Standard 30-day clearance period clears refund window.' },
    { step: 6, title: 'Payout Processed', desc: 'Disbursed to partner bank account on scheduled payout cycle.' }
  ];

  return (
    <section id="payouts" className="py-20 lg:py-28 bg-white dark:bg-[#0E1A30] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>Payment Transparency</span>
            <span aria-hidden="true">·</span>
            <span>Audited & Predictable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            Transparent Earnings. Clear Commission Tracking.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            We operate an immutable, transparent financial ledger. Every subscription payment from your clients is attributed, calculated, and paid out on reliable commercial schedules.
          </p>
        </div>

        {/* 6-Step Visual Lifecycle Timeline */}
        <div className="mb-16">
          <h3 className="text-sm font-bold text-[#142D4E] dark:text-white uppercase tracking-wider text-center mb-8">
            The Commission Settlement Lifecycle
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {lifecycleSteps.map((item, idx) => (
              <div
                key={item.step}
                className="bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-[#1261B5]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#1261B5] text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      {item.step}
                    </span>
                    {idx < 5 && (
                      <span className="text-slate-300 dark:text-slate-600 hidden md:inline text-xs">&rarr;</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#142D4E] dark:text-white mb-1.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Core Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Calculation Basis */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/60 dark:bg-blue-950/60 flex items-center justify-center text-[#1261B5] dark:text-[#B9E51C]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Commission Calculation Basis</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Commissions are calculated on <strong className="text-[#142D4E] dark:text-white">net eligible subscription revenue</strong> received by MsmeBooks. Statutory sales taxes (such as VAT or consumption tax) and payment processing gateway fees are deducted prior to rate application.
            </p>
          </div>

          {/* Card 2: Eligible Products */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-[#B9E51C]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Eligible Products & Plans</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Eligible subscriptions include <strong className="text-[#142D4E] dark:text-white">MsmeBooks Accounting Pro, Point of Sale (POS) Retail, Multi-Location Inventory, and Payroll</strong> plans. Third-party add-ons and subsidized physical hardware are excluded unless specified.
            </p>
          </div>

          {/* Card 3: Clearance & Approval */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/60 dark:bg-blue-950/60 flex items-center justify-center text-[#1261B5] dark:text-[#B9E51C]">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Approval Conditions & Cycles</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Earned commissions clear into available balances following a <strong className="text-[#142D4E] dark:text-white">30-day clearance window</strong>. This standard reconciliation protocol ensures the customer transaction is settled and protects against early subscription cancellations.
            </p>
          </div>

          {/* Card 4: Payout Schedule & Thresholds */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100/60 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Payout Cycles & Minimums</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Disbursements occur twice monthly (on the <strong className="text-[#142D4E] dark:text-white">15th and end of each month</strong>). The default minimum withdrawal threshold is <strong className="text-[#142D4E] dark:text-white">{formatFromNGN(20000)}</strong> ({currencyConfig.code}). Unclaimed balances roll forward automatically.
            </p>
          </div>

          {/* Card 5: Supported Payment Rails */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-[#B9E51C]">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Supported Banking & Payout Rails</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Direct automated clearing into Nigerian commercial banks (via NIP/ACH), international wire transfer, mobile money (M-Pesa, MTN MoMo, Airtel Money), and verified regional payout partners (Flutterwave & Paystack).
            </p>
          </div>

          {/* Card 6: Refunds & Dispute Integrity */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 bg-[#F7FAFC] dark:bg-[#14233c] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/60 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Refunds, Reversals & Compliance</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If an attributed customer requests a verified refund or issues a payment chargeback, the associated commission is debited from future balances. Withholding Tax (WHT) certificates are provided for corporate partners where required.
            </p>
          </div>
        </div>

        {/* Policy Notice Footer */}
        <div className="mt-10 p-4 bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Official Program Policy: Payout schedules, minimum balances, and payment methods are governed by approved MsmeBooks Financial Terms. No unapproved payout guarantees are made.</span>
        </div>
      </div>
    </section>
  );
};
