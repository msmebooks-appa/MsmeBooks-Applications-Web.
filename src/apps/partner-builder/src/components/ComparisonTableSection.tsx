import React from 'react';
import { COMPARISON_CRITERIA, PARTNER_TIERS } from '../data/partnersData';
import { Check, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { PartnerTierId } from '../types';

interface ComparisonTableSectionProps {
  onSelectTierToApply: (tier: PartnerTierId) => void;
}

export const ComparisonTableSection: React.FC<ComparisonTableSectionProps> = ({
  onSelectTierToApply
}) => {
  return (
    <section id="compare" className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Transparent Tier Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Compare Partner Membership Benefits
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            Transparent commission structures, accredited digital credentials, and tailored enablement resources designed to scale alongside your client portfolio.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto bg-white dark:bg-[#0A2552] rounded-2xl shadow-sm border border-slate-200 dark:border-blue-800/60 mb-10">
          <table className="w-full text-left border-collapse min-w-[760px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-blue-800/60 bg-slate-50/80 dark:bg-[#061F4A]">
                <th className="p-5 text-sm font-bold text-slate-500 dark:text-blue-200 uppercase tracking-wider w-1/3">
                  Tier Criteria & Entitlements
                </th>

                {/* Bronze */}
                <th className="p-5 text-center w-1/6 border-l border-slate-200 dark:border-blue-800/60">
                  <div className="text-base font-black text-amber-800 dark:text-amber-400">Bronze</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">15%</div>
                  <div className="text-[11px] text-slate-500 dark:text-blue-200 font-medium">Recurring Rev Share</div>
                  <button
                    onClick={() => onSelectTierToApply('bronze')}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-white dark:bg-[#08224D] hover:bg-blue-50 dark:hover:bg-blue-900/60 border border-slate-200 dark:border-blue-800 rounded-lg shadow-sm w-full transition-colors"
                  >
                    Select Bronze
                  </button>
                </th>

                {/* Silver */}
                <th className="p-5 text-center w-1/6 border-l border-slate-200 dark:border-blue-800/60">
                  <div className="text-base font-black text-slate-700 dark:text-slate-200">Silver</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">20%</div>
                  <div className="text-[11px] text-slate-500 dark:text-blue-200 font-medium">Recurring Rev Share</div>
                  <button
                    onClick={() => onSelectTierToApply('silver')}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-white dark:bg-[#08224D] hover:bg-blue-50 dark:hover:bg-blue-900/60 border border-slate-200 dark:border-blue-800 rounded-lg shadow-sm w-full transition-colors"
                  >
                    Select Silver
                  </button>
                </th>

                {/* Gold (Highlighted Milestone) */}
                <th className="p-5 text-center w-1/6 border-l border-r border-[#F59E0B]/50 dark:border-[#F59E0B]/40 bg-amber-50/40 dark:bg-amber-950/30 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Growth Milestone
                  </div>
                  <div className="text-base font-black text-[#D97706] dark:text-amber-400">Gold</div>
                  <div className="text-2xl font-black text-[#0A3981] dark:text-[#8CE600] font-mono mt-1">30%</div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-200 font-semibold">Recurring Rev Share</div>
                  <button
                    onClick={() => onSelectTierToApply('gold')}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm w-full transition-colors"
                  >
                    Select Gold
                  </button>
                </th>

                {/* Platinum */}
                <th className="p-5 text-center w-1/6 border-l border-slate-200 dark:border-blue-800/60">
                  <div className="text-base font-black text-[#0284C7] dark:text-sky-400">Platinum</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">40%</div>
                  <div className="text-[11px] text-slate-500 dark:text-blue-200 font-medium">Recurring Rev Share</div>
                  <button
                    onClick={() => onSelectTierToApply('platinum')}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-white dark:bg-[#08224D] hover:bg-blue-50 dark:hover:bg-blue-900/60 border border-slate-200 dark:border-blue-800 rounded-lg shadow-sm w-full transition-colors"
                  >
                    Select Platinum
                  </button>
                </th>
              </tr>
            </thead>

            {/* Table Body Groups */}
            <tbody>
              {COMPARISON_CRITERIA.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  <tr className="bg-slate-100/70 dark:bg-[#071C40] border-t border-b border-slate-200 dark:border-blue-900/60">
                    <td colSpan={5} className="py-2.5 px-5 text-xs font-black uppercase tracking-wider text-[#0A3981] dark:text-[#8CE600]">
                      {group.category}
                    </td>
                  </tr>

                  {group.criteria.map((item, itemIdx) => (
                    <tr
                      key={itemIdx}
                      className="border-b border-slate-100 dark:border-blue-900/30 hover:bg-slate-50/60 dark:hover:bg-[#0C2E63]/40 transition-colors"
                    >
                      <td className="p-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {item.label}
                      </td>

                      <td className="p-4 text-center text-xs font-medium text-slate-600 dark:text-blue-100/70 border-l border-slate-200 dark:border-blue-800/60">
                        {item.bronze}
                      </td>

                      <td className="p-4 text-center text-xs font-medium text-slate-700 dark:text-slate-200 border-l border-slate-200 dark:border-blue-800/60">
                        {item.silver}
                      </td>

                      {/* Gold Column Accent */}
                      <td className="p-4 text-center text-xs font-bold text-[#0A3981] dark:text-amber-300 border-l border-r border-[#F59E0B]/30 dark:border-[#F59E0B]/40 bg-amber-50/20 dark:bg-amber-950/20">
                        {item.gold}
                      </td>

                      <td className="p-4 text-center text-xs font-medium text-slate-800 dark:text-slate-100 border-l border-slate-200 dark:border-blue-800/60">
                        {item.platinum}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Programme Terms Disclaimer & Config Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 dark:bg-[#072457] border border-blue-200 dark:border-blue-800 text-xs text-slate-600 dark:text-blue-100/80 mb-10 max-w-4xl mx-auto">
          <Info className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#0A3981] dark:text-[#8CE600]">Programme Governance Note:</strong> Tier commission percentages, benefits, and lead routing are subject to the MsmeBooks Partner Agreement and qualifying paid subscription accounts. Enterprise custom arrangements and territorial distribution rights may be configured with the Partnership Directorate.
          </p>
        </div>

        {/* CTA below table */}
        <div className="text-center">
          <button
            onClick={() => onSelectTierToApply('gold')}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-900/10 transition-all transform hover:-translate-y-0.5"
          >
            Join the MsmeBooks Partner Ecosystem
            <ArrowRight className="w-4 h-4 text-[#8CE600]" />
          </button>
        </div>
      </div>
    </section>
  );
};
