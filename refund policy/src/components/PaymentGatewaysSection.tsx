import React from 'react';
import { CreditCard, Clock, ShieldCheck, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';
import { PAYMENT_GATEWAY_DETAILS } from '../data/policyData';

export const PaymentGatewaysSection: React.FC = () => {
  return (
    <section id="refund-processing" className="scroll-mt-24 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>08. Gateway Settlements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
          Refund Processing & Payment Gateway Timelines
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          Approved refunds are returned strictly to the original payment source in compliance with international anti-money laundering (AML) banking standards.
        </p>
      </div>

      {/* Two-Stage Timeline Clarification Hero Box */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 dark:from-blue-950 dark:to-slate-950 rounded-2xl p-6 text-white shadow-sm space-y-4 border border-transparent dark:border-slate-800">
        <div className="flex items-center gap-2 text-lime-300 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Two-Phase Settlement Distinction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="bg-white/10 dark:bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-lime-400 font-bold block">
              PHASE 1: MSMEBOOKS REVIEW
            </span>
            <h4 className="text-lg font-bold text-white">1 to 3 Business Days</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our billing compliance officers audit the claim, review account activity logs, verify against the upstream processor API, and authorize the payout or credit.
            </p>
          </div>

          <div className="bg-white/10 dark:bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-lime-400 font-bold block">
              PHASE 2: BANK & GATEWAY SETTLEMENT
            </span>
            <h4 className="text-lg font-bold text-white">3 to 10 Business Days</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once released by MsmeBooks, the funds are credited by the acquiring bank, card network (Visa/Mastercard), or mobile money operator to the cardholder's statement.
            </p>
          </div>

        </div>
      </div>

      {/* Gateways Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6">Gateway / Processor</th>
                <th className="py-3.5 px-4 sm:px-6">Supported Currencies</th>
                <th className="py-3.5 px-4 sm:px-6">MsmeBooks Approval</th>
                <th className="py-3.5 px-4 sm:px-6">Financial Institution Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PAYMENT_GATEWAY_DETAILS.map((gw, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-950 dark:text-white align-top">
                    <div>{gw.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      {gw.channel}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-700 dark:text-slate-300 align-top">
                    {gw.currencies}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-800 dark:text-slate-200 align-top font-medium">
                    {gw.approvalTime}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-800 dark:text-slate-200 align-top font-medium">
                    {gw.bankSettlementTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AML & Fraud Prevention Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-slate-900 dark:text-white">Original Source Mandate</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In compliance with Central Bank regulations and Anti-Money Laundering (AML) directives, refunds are strictly remitted to the original instrument used at purchase.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-slate-900 dark:text-white">Exchange Rate Fluctuation</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            For cross-border payments processed in foreign currencies (e.g. USD conversions from NGN or KES), MsmeBooks refunds the exact originating transaction currency amount.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-slate-900 dark:text-white">Merchant Fees Deductions</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Where voluntary refunds are approved for non-defective services, payment gateway interchange fees (non-recoverable by MsmeBooks) may be deducted from the payout.
          </p>
        </div>
      </div>
    </section>
  );
};
