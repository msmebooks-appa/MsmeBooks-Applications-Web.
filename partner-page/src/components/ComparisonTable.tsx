import React, { useState } from 'react';
import { 
  COMPARISON_DATA 
} from '../data/partnerData';
import { 
  Check, 
  X, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Crown
} from 'lucide-react';

interface ComparisonTableProps {
  onOpenApplyModal: (tierId?: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onOpenApplyModal }) => {
  const [selectedMobileTier, setSelectedMobileTier] = useState<'bronze' | 'silver' | 'partner' | 'platinum'>('platinum');

  const renderCell = (value: string | boolean, isPlatinumColumn: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="flex justify-center">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isPlatinumColumn ? 'bg-[#84CC16] text-[#0A192F]' : 'bg-blue-100 text-[#0F4C81]'
          }`}>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>
      ) : (
        <div className="flex justify-center">
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
            <X className="w-3 h-3" />
          </span>
        </div>
      );
    }

    return (
      <span className={`text-xs font-semibold ${
        isPlatinumColumn ? 'text-emerald-700 font-bold' : 'text-slate-700'
      }`}>
        {value}
      </span>
    );
  };

  return (
    <section id="comparison" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" />
            Side-by-Side Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Detailed Partner Benefit Comparison
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Transparent, performance-driven progression. Compare what each partner tier unlocks across enablement, dedicated support, and recurring commission share.
          </p>
        </div>

        {/* Desktop & Tablet Table (Hidden on small mobile) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-[#0F4C81] via-[#1E40AF] to-[#0A2540] text-white">
                <th className="py-5 px-6 text-sm font-bold tracking-wider uppercase w-2/6">
                  Benefit / Capability
                </th>
                <th className="py-5 px-4 text-center text-sm font-bold w-1/6">
                  <div className="text-slate-200 text-xs">🥉 15% Share</div>
                  <div className="text-base font-extrabold">Bronze</div>
                </th>
                <th className="py-5 px-4 text-center text-sm font-bold w-1/6">
                  <div className="text-slate-200 text-xs">🥈 20% Share</div>
                  <div className="text-base font-extrabold">Silver</div>
                </th>
                <th className="py-5 px-4 text-center text-sm font-bold w-1/6">
                  <div className="text-blue-200 text-xs">🥇 30% Share</div>
                  <div className="text-base font-extrabold">Partner</div>
                </th>
                <th className="py-5 px-4 text-center text-sm font-bold w-1/6 bg-[#0A192F] border-l border-white/10 relative">
                  <div className="inline-flex items-center gap-1 text-[#84CC16] text-[11px] font-extrabold uppercase">
                    <Crown className="w-3 h-3" />
                    Strategic VIP
                  </div>
                  <div className="text-base font-extrabold text-[#84CC16]">
                    Platinum (40%)
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-sm">
              {COMPARISON_DATA.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isKeyHighlight ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Benefit Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {row.benefit}
                      </span>
                      {row.isKeyHighlight && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#84CC16]/20 text-[#3F6212] shrink-0">
                          Priority
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Bronze */}
                  <td className="py-4 px-4 text-center">
                    {renderCell(row.bronze)}
                  </td>

                  {/* Silver */}
                  <td className="py-4 px-4 text-center">
                    {renderCell(row.silver)}
                  </td>

                  {/* Partner */}
                  <td className="py-4 px-4 text-center">
                    {renderCell(row.partner)}
                  </td>

                  {/* Platinum (Highlighted in lemon green and bold) */}
                  <td className="py-4 px-4 text-center bg-lime-50/30 border-l border-slate-100">
                    {renderCell(row.platinum, true)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Footer with CTAs */}
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="py-5 px-6 text-xs text-slate-500 font-medium">
                  Select a tier to begin your onboarding:
                </td>
                <td className="py-4 px-3 text-center">
                  <button
                    onClick={() => onOpenApplyModal('bronze')}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs"
                  >
                    Start Bronze
                  </button>
                </td>
                <td className="py-4 px-3 text-center">
                  <button
                    onClick={() => onOpenApplyModal('silver')}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs"
                  >
                    Become Silver
                  </button>
                </td>
                <td className="py-4 px-3 text-center">
                  <button
                    onClick={() => onOpenApplyModal('partner')}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0A3861] rounded-lg shadow-xs"
                  >
                    Join Partner
                  </button>
                </td>
                <td className="py-4 px-3 text-center bg-lime-50/40 border-l border-slate-200">
                  <button
                    onClick={() => onOpenApplyModal('platinum')}
                    className="w-full py-2 px-3 text-xs font-bold text-[#0A192F] bg-[#84CC16] hover:bg-[#9BE22D] rounded-lg shadow-md font-display"
                  >
                    Apply Platinum
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile View: Interactive Tab Switcher for Tiers */}
        <div className="block md:hidden">
          {/* Mobile Tier Selector */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            {(['bronze', 'silver', 'partner', 'platinum'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedMobileTier(tier)}
                className={`py-2 text-xs font-bold capitalize rounded-lg transition-colors ${
                  selectedMobileTier === tier
                    ? 'bg-[#0F4C81] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Active Mobile Tier Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-400">
                Viewing Benefits For:
              </span>
              <span className="text-sm font-extrabold text-[#0F4C81] uppercase tracking-wider">
                {selectedMobileTier} Tier
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {COMPARISON_DATA.map((item, idx) => {
                const val = item[selectedMobileTier];
                return (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium max-w-[65%]">
                      {item.benefit}
                    </span>
                    <div className="text-right">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <span className="inline-flex items-center text-emerald-600 font-bold gap-1">
                            <Check className="w-4 h-4" /> Included
                          </span>
                        ) : (
                          <span className="text-slate-400">Not Included</span>
                        )
                      ) : (
                        <span className="font-bold text-[#0F4C81]">{val}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onOpenApplyModal(selectedMobileTier)}
              className="w-full py-3 rounded-xl bg-[#0F4C81] text-white font-bold text-xs flex items-center justify-center gap-2 mt-4"
            >
              <span>Apply for {selectedMobileTier.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
