import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  ArrowRight,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';
import { RoiCalculator } from './RoiCalculator';
import { AfricanPerformanceMap } from './AfricanPerformanceMap';
import { BiExportModal } from './BiExportModal';

interface BusinessIntelligenceProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo?: () => void;
}

export const BusinessIntelligence: React.FC<BusinessIntelligenceProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const [metricView, setMetricView] = useState<'revenue' | 'profit' | 'cashflow' | 'branch'>('revenue');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const monthlyData = [
    { month: 'Jan', rev: 1420000, exp: 680000, profit: 740000 },
    { month: 'Feb', rev: 1850000, exp: 710000, profit: 1140000 },
    { month: 'Mar', rev: 2100000, exp: 890000, profit: 1210000 },
    { month: 'Apr', rev: 2350000, exp: 840000, profit: 1510000 },
    { month: 'May', rev: 2600000, exp: 920000, profit: 1680000 },
    { month: 'Jun', rev: 2845500, exp: 685300, profit: 2160200 },
  ];

  const branchPerformance = [
    { name: 'Ikeja Superstore', share: '42%', value: 1195000, status: 'Top Performer' },
    { name: 'Lekki Flagship', share: '31%', value: 882000, status: 'High Margin' },
    { name: 'Abuja Hub', share: '18%', value: 512000, status: 'Fast Growth' },
    { name: 'E-commerce Store', share: '9%', value: 256500, status: '+84% MoM' },
  ];

  return (
    <section id="bi" className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Analytics &amp; Forecasting</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Turn Business Data Into Better Decisions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Stop waiting for end-of-year accounting reports. Gain instant visibility into product margins, branch performance, expense leaks, and seasonal demand.
          </p>
        </div>

        {/* Interactive BI Dashboard */}
        <div className="bg-[#F8FAFD] dark:bg-[#090E1A] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            {/* View Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'revenue', label: 'Revenue Growth' },
                { id: 'profit', label: 'Net Profit & Margins' },
                { id: 'cashflow', label: 'Cash Flow Velocity' },
                { id: 'branch', label: 'Branch Performance' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setMetricView(v.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    metricView === v.id
                      ? 'bg-[#0866FF] text-white shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-[#0E172A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">H1 2026 Executive Review</span>
              </div>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#0866FF] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (PDF / CSV)</span>
              </button>
            </div>
          </div>

          {/* Main Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0E172A] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    6-Month Historical Trajectory
                  </span>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-display">
                    {currency.format(monthlyData.reduce((acc, m) => acc + m.rev, 0))} Total Recorded
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#0866FF] dark:text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF]" /> Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B7F000]" /> Net Profit
                  </span>
                </div>
              </div>

              {/* Bar / Trend Visualization */}
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-4 px-2">
                {monthlyData.map((d, idx) => {
                  const revHeight = (d.rev / 3000000) * 100;
                  const profHeight = (d.profit / 3000000) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44">
                        <div
                          style={{ height: `${revHeight}%` }}
                          className="w-4 sm:w-6 rounded-t-md bg-[#0866FF] group-hover:bg-blue-700 transition-all relative"
                          title={`Revenue: ${currency.format(d.rev)}`}
                        />
                        <div
                          style={{ height: `${profHeight}%` }}
                          className="w-4 sm:w-6 rounded-t-md bg-[#B7F000] group-hover:brightness-95 transition-all"
                          title={`Profit: ${currency.format(d.profit)}`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-display">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Branch Contribution Breakdown */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0E172A] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Branch Revenue Share
                </span>
                <span className="text-xs font-bold text-[#0866FF] dark:text-[#B7F000]">All Active</span>
              </div>

              <div className="space-y-3">
                {branchPerformance.map((b, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{b.name}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currency.format(b.value)}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: b.share }}
                        className={`h-full rounded-full ${
                          idx === 0 ? 'bg-[#0866FF]' : idx === 1 ? 'bg-[#B7F000]' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{b.share} of total</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Export Complete BI Report (PDF / CSV)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic African Regional Business Performance Heatmap */}
        <AfricanPerformanceMap
          currentCurrency={currentCurrency}
          onOpenStartFree={onOpenStartFree}
          onOpenBookDemo={onOpenBookDemo}
        />

        {/* Embedded Interactive ROI Savings Calculator */}
        <RoiCalculator
          currentCurrency={currentCurrency}
          onOpenStartFree={onOpenStartFree}
          onOpenBookDemo={onOpenBookDemo}
        />

        {/* Export BI Report Modal (PDF & CSV) */}
        <BiExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          currentCurrency={currentCurrency}
          monthlyData={monthlyData}
          branchPerformance={branchPerformance}
        />
      </div>
    </section>
  );
};
