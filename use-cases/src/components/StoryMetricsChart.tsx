import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartMetric } from '../types';
import {
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface StoryMetricsChartProps {
  metrics?: ChartMetric[];
  isIllustrative: boolean;
  industry: string;
}

export const StoryMetricsChart: React.FC<StoryMetricsChartProps> = ({
  metrics,
  isIllustrative,
  industry,
}) => {
  const { currencyInfo, convertFromUSD, formatUSD } = useCurrency();
  const [viewMode, setViewMode] = useState<'time' | 'efficiency' | 'financial'>('time');

  // If no specific chart metrics are provided, supply fallback tailored data
  const chartData: ChartMetric[] = metrics && metrics.length > 0 ? metrics : [
    {
      name: 'Shift Balancing',
      category: 'Daily Operations',
      before: 75,
      after: 15,
      unit: 'mins',
      efficiencyGain: 80,
      timeSavedDescription: '60 mins saved per register shift'
    },
    {
      name: 'Stock Reconciliation',
      category: 'Inventory',
      before: 48,
      after: 1,
      unit: 'hours',
      efficiencyGain: 98,
      timeSavedDescription: '47 hours saved per inventory cycle'
    },
    {
      name: 'Financial Closing',
      category: 'Accounting',
      before: 18,
      after: 2,
      unit: 'days',
      efficiencyGain: 88,
      timeSavedDescription: '16 days accelerated to audited close'
    },
    {
      name: 'Order-to-Dispatch',
      category: 'Fulfillment',
      before: 120,
      after: 20,
      unit: 'mins',
      efficiencyGain: 83,
      timeSavedDescription: '100 mins turnaround reduction'
    }
  ];

  // Calculate high-level summary KPIs
  const avgEfficiencyGain = Math.round(
    chartData.reduce((acc, curr) => acc + curr.efficiencyGain, 0) / chartData.length
  );

  const highestGainMetric = [...chartData].sort((a, b) => b.efficiencyGain - a.efficiencyGain)[0];

  // Format data for Time View
  const timeChartData = chartData.map((item) => ({
    name: item.name,
    'Before MsmeBooks': item.before,
    'With MsmeBooks': item.after,
    unit: item.unit,
    timeSaved: item.timeSavedDescription || `${item.before - item.after} ${item.unit} saved`,
    efficiencyGain: item.efficiencyGain,
  }));

  // Format data for Efficiency % View
  const efficiencyChartData = chartData.map((item) => ({
    name: item.name,
    'Efficiency Growth %': item.efficiencyGain,
    category: item.category,
    unit: '%',
  }));

  // Format data for Financial Value View (Live active currency conversion)
  const financialChartData = chartData.map((item, idx) => {
    const baseSavingsUSD = [3200, 7800, 6400, 4500][idx % 4] || 4000;
    const converted = convertFromUSD(baseSavingsUSD);
    return {
      name: item.name,
      'Financial Savings Value': converted,
      displayFormatted: formatUSD(baseSavingsUSD, { compact: true }),
      category: item.category,
      unit: currencyInfo.symbol,
      usdBase: baseSavingsUSD
    };
  });

  const totalFinancialSavingsUSD = 21900;

  // Custom Recharts Tooltip for Financial View
  const CustomFinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans min-w-[210px]">
          <p className="font-bold text-slate-100 text-sm border-b border-slate-700/80 pb-1.5">
            {label}
          </p>
          <p className="text-[11px] text-slate-400">{data.category}</p>
          <div className="flex justify-between items-center text-slate-300">
            <span>Estimated Annual Value:</span>
            <span className="font-mono font-bold text-[#90CF24] text-sm">
              {formatUSD(data.usdBase)}
            </span>
          </div>
          <div className="pt-1.5 border-t border-slate-700/80 text-[10px] text-slate-400 font-mono">
            Converted in real time to {currencyInfo.code} ({currencyInfo.symbol})
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Recharts Tooltip for Time Saved
  const CustomTimeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans min-w-[200px]">
          <p className="font-bold text-slate-100 text-sm border-b border-slate-700/80 pb-1.5">
            {label}
          </p>
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-400" />
              Before MsmeBooks:
            </span>
            <span className="font-mono font-bold text-slate-200">
              {data['Before MsmeBooks']} {data.unit}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#7CB518]" />
              With MsmeBooks:
            </span>
            <span className="font-mono font-bold text-[#90CF24]">
              {data['With MsmeBooks']} {data.unit}
            </span>
          </div>
          <div className="pt-1.5 border-t border-slate-700/80 flex justify-between items-center text-[11px] text-emerald-400 font-semibold">
            <span>Operational Gain:</span>
            <span>+{data.efficiencyGain}% Efficiency</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Recharts Tooltip for Efficiency View
  const CustomEfficiencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 font-sans">
          <p className="font-bold text-slate-100 text-sm">{label}</p>
          <p className="text-[11px] text-slate-400">{data.category}</p>
          <div className="pt-1 flex items-center justify-between gap-4 font-mono">
            <span className="text-slate-300">Growth / Time Saved:</span>
            <span className="text-[#90CF24] font-bold text-sm">+{data['Efficiency Growth %']}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-6 transition-colors duration-200">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#162D42] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0A3D62] dark:text-sky-300" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Key Metrics &amp; Operational Growth
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparative performance benchmarks before vs. after implementing MsmeBooks in {industry}.
          </p>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#071727] rounded-lg shrink-0 self-start sm:self-auto border border-slate-200/80 dark:border-[#162D42]">
          <button
            onClick={() => setViewMode('time')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'time'
                ? 'bg-white dark:bg-[#0E283F] text-[#0A3D62] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time Saved</span>
          </button>
          <button
            onClick={() => setViewMode('efficiency')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'efficiency'
                ? 'bg-white dark:bg-[#0E283F] text-[#0A3D62] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Efficiency %</span>
          </button>
          <button
            onClick={() => setViewMode('financial')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'financial'
                ? 'bg-white dark:bg-[#0E283F] text-[#0A3D62] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#7CB518]" />
            <span>Financial ROI ({currencyInfo.code})</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F4F9EC] dark:bg-[#112718] p-4 rounded-xl border border-[#7CB518]/30 dark:border-[#7CB518]/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              {viewMode === 'financial' ? 'Annual Operational Savings' : 'Average Efficiency Gain'}
            </span>
            <span className="text-2xl font-extrabold text-[#6A9E13] dark:text-[#90CF24] font-mono tabular-nums">
              {viewMode === 'financial' ? `${formatUSD(totalFinancialSavingsUSD, { compact: true })}/yr` : `+${avgEfficiencyGain}%`}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {viewMode === 'financial' ? `Active currency: ${currencyInfo.code}` : 'Across core workflows'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-[#6A9E13] dark:text-[#90CF24] flex items-center justify-center shrink-0">
            {viewMode === 'financial' ? <DollarSign className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#081726] p-4 rounded-xl border border-slate-200 dark:border-[#17334D] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              {viewMode === 'financial' ? 'Largest Savings Driver' : 'Peak Improvement Area'}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block max-w-[150px]">
              {highestGainMetric?.name}
            </span>
            <span className="text-xs font-mono font-bold text-[#0A3D62] dark:text-sky-300">
              {viewMode === 'financial' ? `${formatUSD(7800, { compact: true })} benefit` : `+${highestGainMetric?.efficiencyGain}% faster`}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-100/70 dark:bg-sky-950/60 text-[#0A3D62] dark:text-sky-300 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#081726] p-4 rounded-xl border border-slate-200 dark:border-[#17334D] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Verification Standard
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
              {isIllustrative ? 'Illustrative Model' : 'Audited Impact'}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">MsmeBooks Transparency Charter</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#7CB518] dark:text-[#90CF24]" />
          </div>
        </div>
      </div>

      {/* Main Chart Visualization */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {viewMode === 'time'
              ? 'Workflow Execution Duration (Lower is Better)'
              : viewMode === 'efficiency'
              ? 'Productivity & Efficiency Improvement (Higher is Better)'
              : `Annual Financial Labor & Shrinkage Savings (${currencyInfo.code})`}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {viewMode === 'financial'
              ? `Real-time converted to ${currencyInfo.name} (${currencyInfo.symbol})`
              : 'Values scaled by workflow unit'}
          </span>
        </div>

        <div className="w-full h-72 sm:h-80 bg-slate-50/70 dark:bg-[#081726]/80 rounded-xl p-3 sm:p-4 border border-slate-200/80 dark:border-[#17334D]">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'time' ? (
              <BarChart
                data={timeChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" strokeOpacity={0.25} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip content={<CustomTimeTooltip />} cursor={{ fill: 'rgba(10, 61, 98, 0.12)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="Before MsmeBooks"
                  fill="#94A3B8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="With MsmeBooks"
                  fill="#0A3D62"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            ) : viewMode === 'efficiency' ? (
              <BarChart
                data={efficiencyChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" strokeOpacity={0.25} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  unit="%"
                />
                <Tooltip content={<CustomEfficiencyTooltip />} cursor={{ fill: 'rgba(124, 181, 24, 0.12)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="Efficiency Growth %"
                  fill="#7CB518"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {efficiencyChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7CB518' : '#0E5A8A'} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart
                data={financialChartData}
                margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" strokeOpacity={0.25} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                    return String(val);
                  }}
                />
                <Tooltip content={<CustomFinancialTooltip />} cursor={{ fill: 'rgba(124, 181, 24, 0.12)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar
                  dataKey="Financial Savings Value"
                  name={`Savings Value (${currencyInfo.symbol})`}
                  fill="#7CB518"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {financialChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7CB518' : '#0A3D62'} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanatory Context Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#162D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24] shrink-0" />
          <span>
            {isIllustrative
              ? 'Metrics reflect standard comparative benchmark baselines for this industry profile.'
              : 'Metrics validated against historical operational baselines provided by the customer.'}
          </span>
        </div>
        <span className="font-mono text-slate-400 dark:text-slate-500">
          Source: MsmeBooks Operations Analytics Engine
        </span>
      </div>
    </section>
  );
};
