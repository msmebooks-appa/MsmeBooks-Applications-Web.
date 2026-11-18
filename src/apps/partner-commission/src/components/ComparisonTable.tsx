import React from 'react';
import { Check, Minus, Sparkles } from 'lucide-react';
import { PartnerTierId } from '../types/partner';

interface ComparisonTableProps {
  onSelectTier: (tierId: PartnerTierId) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onSelectTier }) => {
  const comparisonRows = [
    {
      feature: 'Recurring Commission Rate',
      bronze: '15%',
      silver: '20%',
      gold: '30%',
      platinum: '40%',
      highlight: true
    },
    {
      feature: 'Unique Referral Link & Partner ID Code',
      bronze: true,
      silver: true,
      gold: true,
      platinum: true
    },
    {
      feature: 'Dedicated Partner Portal & Attribution Engine',
      bronze: true,
      silver: true,
      gold: true,
      platinum: true
    },
    {
      feature: 'Sales & Marketing One-Pagers',
      bronze: 'Standard Kit',
      silver: 'Expanded Kit',
      gold: 'Co-Branded Decks',
      platinum: 'Bespoke Collateral'
    },
    {
      feature: 'Product & Implementation Training',
      bronze: 'Self-Paced Guide',
      silver: 'Masterclasses',
      gold: 'Advanced Multi-Branch',
      platinum: 'Executive Advisory'
    },
    {
      feature: 'Partner Performance Analytics',
      bronze: 'Basic Conversion',
      silver: 'Customer Lifetime',
      gold: 'Multi-Rep Hierarchy',
      platinum: 'Custom BI Exports'
    },
    {
      feature: 'Priority Support Desk SLA',
      bronze: 'Standard Email',
      silver: 'Priority Email',
      gold: '< 4h Priority Desk',
      platinum: 'Direct Hotline'
    },
    {
      feature: 'Co-Marketing & Webinar Eligibility',
      bronze: false,
      silver: false,
      gold: 'Subject to review',
      platinum: 'Included'
    },
    {
      feature: 'Dedicated Strategic Account Manager',
      bronze: false,
      silver: false,
      gold: false,
      platinum: 'Assigned'
    },
    {
      feature: 'Direct API Partner Integration Access',
      bronze: false,
      silver: false,
      gold: 'On Request',
      platinum: 'Full Access'
    },
    {
      feature: 'Featured Listing in MsmeBooks Directory',
      bronze: false,
      silver: false,
      gold: 'Subject to review',
      platinum: 'Featured'
    },
    {
      feature: 'Quarterly MDF (Market Development Fund)',
      bronze: false,
      silver: false,
      gold: 'Conditional',
      platinum: 'Priority Allocation'
    }
  ];

  return (
    <section id="comparison" className="py-20 lg:py-28 bg-white dark:bg-[#0E1A30] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>Detailed Tier Matrix</span>
            <span aria-hidden="true">·</span>
            <span>Feature-By-Feature Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            Comprehensive Partner Commission Comparison
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Review detailed entitlements across Bronze, Silver, Gold, and Platinum. All commission percentages are established, with higher operational features calibrated to client scale.
          </p>
        </div>

        {/* Responsive Table Container */}
        <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0c182c] border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 sm:p-5 font-bold text-[#142D4E] dark:text-white w-1/3">Feature / Entitlement</th>
                <th className="p-4 sm:p-5 text-center font-bold text-[#142D4E] dark:text-white">
                  <span>Bronze</span>
                  <span className="block text-[11px] font-mono text-[#1261B5] dark:text-[#B9E51C] font-extrabold mt-0.5">15%</span>
                </th>
                <th className="p-4 sm:p-5 text-center font-bold text-[#142D4E] dark:text-white">
                  <span>Silver</span>
                  <span className="block text-[11px] font-mono text-[#1261B5] dark:text-[#B9E51C] font-extrabold mt-0.5">20%</span>
                </th>
                <th className="p-4 sm:p-5 text-center font-bold text-[#1261B5] dark:text-[#B9E51C] bg-blue-50/60 dark:bg-blue-950/60 border-x border-blue-200 dark:border-blue-800">
                  <div className="inline-flex items-center gap-1">
                    <span>Gold</span>
                    <Sparkles className="w-3 h-3 text-[#1261B5] dark:text-[#B9E51C]" />
                  </div>
                  <span className="block text-[11px] font-mono text-[#1261B5] dark:text-[#B9E51C] font-extrabold mt-0.5">30%</span>
                </th>
                <th className="p-4 sm:p-5 text-center font-bold text-[#142D4E] dark:text-white">
                  <span>Platinum</span>
                  <span className="block text-[11px] font-mono text-[#1261B5] dark:text-[#B9E51C] font-extrabold mt-0.5">40%</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/60 dark:hover:bg-[#14233c]/60 transition-colors ${
                    row.highlight ? 'bg-blue-50/30 dark:bg-blue-950/30 font-bold' : ''
                  }`}
                >
                  <td className="p-4 sm:p-5 font-semibold text-[#142D4E] dark:text-white">{row.feature}</td>

                  {/* Bronze Cell */}
                  <td className="p-4 sm:p-5 text-center text-slate-700 dark:text-slate-300">
                    {typeof row.bronze === 'boolean' ? (
                      row.bronze ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium">{row.bronze}</span>
                    )}
                  </td>

                  {/* Silver Cell */}
                  <td className="p-4 sm:p-5 text-center text-slate-700 dark:text-slate-300">
                    {typeof row.silver === 'boolean' ? (
                      row.silver ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium">{row.silver}</span>
                    )}
                  </td>

                  {/* Gold Cell (Highlighted) */}
                  <td className="p-4 sm:p-5 text-center text-[#142D4E] dark:text-white bg-blue-50/30 dark:bg-blue-950/30 border-x border-blue-100 dark:border-blue-900/60 font-semibold">
                    {typeof row.gold === 'boolean' ? (
                      row.gold ? (
                        <Check className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C] mx-auto font-bold" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span>{row.gold}</span>
                    )}
                  </td>

                  {/* Platinum Cell */}
                  <td className="p-4 sm:p-5 text-center text-slate-700 dark:text-slate-300">
                    {typeof row.platinum === 'boolean' ? (
                      row.platinum ? (
                        <Check className="w-4 h-4 text-purple-700 dark:text-[#B9E51C] mx-auto font-bold" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium">{row.platinum}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-[#0c182c] border-t border-slate-200 dark:border-slate-700">
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400">Apply for Tier:</td>
                <td className="p-4 sm:p-5 text-center">
                  <button
                    onClick={() => onSelectTier('bronze')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Select Bronze
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <button
                    onClick={() => onSelectTier('silver')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Select Silver
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center bg-blue-50/60 dark:bg-blue-950/60 border-x border-blue-200 dark:border-blue-800">
                  <button
                    onClick={() => onSelectTier('gold')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] shadow-xs"
                  >
                    Select Gold
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <button
                    onClick={() => onSelectTier('platinum')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#142D4E] dark:bg-[#B9E51C] dark:text-[#142D4E] hover:bg-black dark:hover:bg-[#aadc14]"
                  >
                    Select Platinum
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Table policy caption */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            *Features indicated as "Subject to review" or "Conditional" require approval from MsmeBooks Partner Administration and are governed by the MsmeBooks Partner Agreement.
          </p>
        </div>
      </div>
    </section>
  );
};
