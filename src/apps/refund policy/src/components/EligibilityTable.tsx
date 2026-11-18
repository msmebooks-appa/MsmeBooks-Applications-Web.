import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { ELIGIBILITY_RULES } from '../data/policyData';

export const EligibilityTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRules = ELIGIBILITY_RULES.filter((rule) => {
    const matchesSearch =
      rule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.guidance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.remedy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && rule.badgeType === filterType;
  });

  return (
    <section id="eligibility-matrix" className="scroll-mt-24 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>05. Eligibility Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
          Refund Eligibility & Exclusions Comparison Table
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          A definitive assessment guide for transactions, subscription cycles, technical incidents, and billing adjustments.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter transaction types or remedies..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'eligible', label: '100% Eligible' },
            { id: 'conditional', label: 'Conditional' },
            { id: 'non-refundable', label: 'Non-Refundable' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6 w-1/4">Transaction Type</th>
                <th className="py-3.5 px-4 sm:px-6 w-1/3">Policy Guidance</th>
                <th className="py-3.5 px-4 sm:px-6">Reporting Window</th>
                <th className="py-3.5 px-4 sm:px-6">Commercial Remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-blue-950 dark:text-white align-top">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {rule.badgeType === 'eligible' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Eligible" />
                        )}
                        {rule.badgeType === 'conditional' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" title="Conditional Review" />
                        )}
                        {rule.badgeType === 'non-refundable' && (
                          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" title="Non-refundable" />
                        )}
                        {rule.badgeType === 'partner' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" title="Partner Governed" />
                        )}
                      </div>
                      <div>
                        <span>{rule.type}</span>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                          {rule.badgeType.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                    {rule.guidance}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-400 font-mono text-[11px] align-top whitespace-nowrap">
                    {rule.timeframe}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-800 dark:text-slate-200 align-top leading-relaxed">
                    <span className="font-medium text-slate-900 dark:text-white">{rule.remedy}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Protection Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 space-y-1 transition-colors duration-200">
        <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-lime-400">
          <ShieldAlert className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
          <span>Statutory Consumer Protection Non-Waivability Clause</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Refund exclusions and commercial conditions stated above do not, and cannot, override non-waivable statutory rights granted to consumers and enterprises under applicable national legislation, including the Nigerian Federal Competition and Consumer Protection Act (FCCPA 2018), the Kenyan Consumer Protection Act, and international commercial trade regulations.
        </p>
      </div>

    </section>
  );
};
