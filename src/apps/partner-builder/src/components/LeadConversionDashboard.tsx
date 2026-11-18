import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Award, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity, 
  CheckCircle2, 
  UserCheck, 
  PhoneCall, 
  UserPlus, 
  XCircle, 
  Sparkles, 
  Info,
  DollarSign
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { LeadTimeDataPoint, ReferredLead } from '../types';

interface LeadConversionDashboardProps {
  partnerCode?: string;
  commissionRate?: number;
  className?: string;
  onNavigateToLeads?: () => void;
}

// 12-Month historical tracking data for lead conversion lifecycle (New, Contacted, Won, Lost)
const MONTHLY_HISTORICAL_DATA: LeadTimeDataPoint[] = [
  { period: 'Dec 2025', date: '2025-12', new: 6, contacted: 4, won: 3, lost: 1, total: 14, conversionRate: 75.0, wonRevenueUsd: 285 },
  { period: 'Jan 2026', date: '2026-01', new: 8, contacted: 6, won: 5, lost: 1, total: 20, conversionRate: 83.3, wonRevenueUsd: 490 },
  { period: 'Feb 2026', date: '2026-02', new: 10, contacted: 7, won: 6, lost: 2, total: 25, conversionRate: 75.0, wonRevenueUsd: 620 },
  { period: 'Mar 2026', date: '2026-03', new: 12, contacted: 9, won: 8, lost: 2, total: 31, conversionRate: 80.0, wonRevenueUsd: 840 },
  { period: 'Apr 2026', date: '2026-04', new: 11, contacted: 8, won: 7, lost: 3, total: 29, conversionRate: 70.0, wonRevenueUsd: 790 },
  { period: 'May 2026', date: '2026-05', new: 15, contacted: 11, won: 9, lost: 2, total: 37, conversionRate: 81.8, wonRevenueUsd: 1020 },
  { period: 'Jun 2026', date: '2026-06', new: 14, contacted: 10, won: 9, lost: 3, total: 36, conversionRate: 75.0, wonRevenueUsd: 1080 },
  { period: 'Jul 2026', date: '2026-07', new: 18, contacted: 13, won: 11, lost: 2, total: 44, conversionRate: 84.6, wonRevenueUsd: 1320 },
  { period: 'Aug 2026', date: '2026-08', new: 17, contacted: 12, won: 10, lost: 4, total: 43, conversionRate: 71.4, wonRevenueUsd: 1210 },
  { period: 'Sep 2026', date: '2026-09', new: 21, contacted: 15, won: 13, lost: 3, total: 52, conversionRate: 81.3, wonRevenueUsd: 1540 },
  { period: 'Oct 2026', date: '2026-10', new: 24, contacted: 18, won: 15, lost: 3, total: 60, conversionRate: 83.3, wonRevenueUsd: 1820 },
  { period: 'Nov 2026 (MTD)', date: '2026-11', new: 9, contacted: 7, won: 5, lost: 1, total: 22, conversionRate: 83.3, wonRevenueUsd: 640 }
];

// Last 4 weeks high-resolution weekly tracking
const WEEKLY_DATA: LeadTimeDataPoint[] = [
  { period: 'Week 41 (Oct)', date: 'W41', new: 5, contacted: 4, won: 3, lost: 1, total: 13, conversionRate: 75.0, wonRevenueUsd: 380 },
  { period: 'Week 42 (Oct)', date: 'W42', new: 6, contacted: 5, won: 4, lost: 0, total: 15, conversionRate: 100.0, wonRevenueUsd: 490 },
  { period: 'Week 43 (Oct)', date: 'W43', new: 7, contacted: 4, won: 4, lost: 1, total: 16, conversionRate: 80.0, wonRevenueUsd: 460 },
  { period: 'Week 44 (Nov)', date: 'W44', new: 6, contacted: 5, won: 4, lost: 1, total: 16, conversionRate: 80.0, wonRevenueUsd: 510 },
  { period: 'Week 45 (Current)', date: 'W45', new: 4, contacted: 3, won: 2, lost: 0, total: 9, conversionRate: 100.0, wonRevenueUsd: 260 }
];

export const LeadConversionDashboard: React.FC<LeadConversionDashboardProps> = ({
  partnerCode = 'MSME-PT-8421',
  commissionRate = 30,
  className = '',
  onNavigateToLeads
}) => {
  const { formatMoney, currentCurrency } = useCurrency();
  const [timeRange, setTimeRange] = useState<'30d' | '6m' | '12m'>('6m');
  const [chartType, setChartType] = useState<'stacked-area' | 'grouped-bar' | 'conversion-rate'>('stacked-area');
  
  // Status filter toggles
  const [visibleStatuses, setVisibleStatuses] = useState({
    new: true,
    contacted: true,
    won: true,
    lost: true
  });

  const toggleStatus = (status: keyof typeof visibleStatuses) => {
    setVisibleStatuses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Selected dataset based on time range
  const chartData = useMemo(() => {
    if (timeRange === '30d') {
      return WEEKLY_DATA;
    }
    if (timeRange === '6m') {
      return MONTHLY_HISTORICAL_DATA.slice(-6);
    }
    return MONTHLY_HISTORICAL_DATA;
  }, [timeRange]);

  // Aggregate KPI metrics
  const totals = useMemo(() => {
    const totalNew = chartData.reduce((acc, d) => acc + d.new, 0);
    const totalContacted = chartData.reduce((acc, d) => acc + d.contacted, 0);
    const totalWon = chartData.reduce((acc, d) => acc + d.won, 0);
    const totalLost = chartData.reduce((acc, d) => acc + d.lost, 0);
    const totalLeads = totalNew + totalContacted + totalWon + totalLost;
    const totalRevenue = chartData.reduce((acc, d) => acc + d.wonRevenueUsd, 0);
    const winRate = (totalWon + totalLost) > 0 
      ? Number(((totalWon / (totalWon + totalLost)) * 100).toFixed(1))
      : 0;

    return {
      totalNew,
      totalContacted,
      totalWon,
      totalLost,
      totalLeads,
      totalRevenue,
      winRate
    };
  }, [chartData]);

  // Pie chart distribution data
  const pieData = useMemo(() => [
    { name: 'Won (Converted)', value: totals.totalWon, color: '#10B981', textColor: 'text-emerald-500' },
    { name: 'Contacted (Funnel)', value: totals.totalContacted, color: '#3B82F6', textColor: 'text-blue-500' },
    { name: 'New (In Queue)', value: totals.totalNew, color: '#8B5CF6', textColor: 'text-purple-500' },
    { name: 'Lost (Unqualified)', value: totals.totalLost, color: '#F43F5E', textColor: 'text-rose-500' }
  ], [totals]);

  // Color palette for dark / light theme
  const colors = {
    new: '#8B5CF6',       // Purple / Indigo
    contacted: '#3B82F6', // Corporate Sky Blue
    won: '#10B981',       // Emerald Green (or #8CE600)
    lost: '#F43F5E',      // Rose / Coral Red
    rate: '#F59E0B'       // Amber
  };

  // Custom tooltips
  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as LeadTimeDataPoint;
      return (
        <div className="bg-slate-900/95 dark:bg-black/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 dark:border-blue-800 text-xs backdrop-blur-md min-w-[200px]">
          <div className="font-bold text-sm text-slate-100 border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between">
            <span>{dataPoint.period}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              {dataPoint.conversionRate}% Win Rate
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-purple-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                New Leads:
              </span>
              <span className="font-mono font-bold text-white">{dataPoint.new}</span>
            </div>

            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Contacted / Trial:
              </span>
              <span className="font-mono font-bold text-white">{dataPoint.contacted}</span>
            </div>

            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                Won (Converted):
              </span>
              <span className="font-mono font-bold text-emerald-400">+{dataPoint.won}</span>
            </div>

            <div className="flex items-center justify-between text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                Lost (Unconverted):
              </span>
              <span className="font-mono font-bold text-white">{dataPoint.lost}</span>
            </div>

            <div className="pt-2 mt-1 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-300">
              <span>Won Monthly MRR:</span>
              <span className="font-mono font-bold text-[#8CE600]">{formatMoney(dataPoint.wonRevenueUsd)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Top Header & Time Controls */}
      <div className="bg-white dark:bg-[#072457] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              Recharts Data Visualization Engine
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Lead Conversion Status & Velocity Over Time
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-100/70 mt-1">
              Visual tracking across the 4 key stages: <strong className="text-purple-600 dark:text-purple-400">New</strong>, <strong className="text-blue-600 dark:text-blue-400">Contacted</strong>, <strong className="text-emerald-600 dark:text-[#8CE600]">Won</strong>, and <strong className="text-rose-600 dark:text-rose-400">Lost</strong>.
            </p>
          </div>

          {/* Time Range Selector & Chart Style Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Period Filter */}
            <div className="p-1 bg-slate-100 dark:bg-[#051a3d] rounded-2xl flex items-center border border-slate-200 dark:border-blue-900/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeRange === '30d'
                    ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-[#8CE600] shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('6m')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeRange === '6m'
                    ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-[#8CE600] shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('12m')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeRange === '12m'
                    ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-[#8CE600] shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                12 Months
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="p-1 bg-slate-100 dark:bg-[#051a3d] rounded-2xl flex items-center border border-slate-200 dark:border-blue-900/80 text-xs">
              <button
                type="button"
                onClick={() => setChartType('stacked-area')}
                title="Stacked Area Chart (Lifecycle Over Time)"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  chartType === 'stacked-area'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('grouped-bar')}
                title="Cohort Comparison (Grouped Bar Chart)"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  chartType === 'grouped-bar'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('conversion-rate')}
                title="Win Rate & Volume Trend"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  chartType === 'conversion-rate'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Status Pills Toggles */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-blue-900/60">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Toggle Series:
          </span>

          {/* New Toggle */}
          <button
            type="button"
            onClick={() => toggleStatus('new')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              visibleStatuses.new
                ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>New Leads ({totals.totalNew})</span>
          </button>

          {/* Contacted Toggle */}
          <button
            type="button"
            onClick={() => toggleStatus('contacted')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              visibleStatuses.contacted
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Contacted / In Trial ({totals.totalContacted})</span>
          </button>

          {/* Won Toggle */}
          <button
            type="button"
            onClick={() => toggleStatus('won')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              visibleStatuses.won
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-[#8CE600] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Won / Converted ({totals.totalWon})</span>
          </button>

          {/* Lost Toggle */}
          <button
            type="button"
            onClick={() => toggleStatus('lost')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              visibleStatuses.lost
                ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span>Lost / Churned ({totals.totalLost})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Total Tracked Leads</span>
            <UserPlus className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {totals.totalLeads}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-[#8CE600] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +22.4% period velocity
          </div>
        </div>

        {/* Card 2: Win Rate % */}
        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Win Rate (Won vs Lost)</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-[#8CE600] font-mono tabular-nums">
            {totals.winRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {totals.totalWon} Won · {totals.totalLost} Lost
          </div>
        </div>

        {/* Card 3: Active in Funnel */}
        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Active in Pipeline</span>
            <PhoneCall className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-sky-300 font-mono tabular-nums">
            {totals.totalNew + totals.totalContacted}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {totals.totalNew} New · {totals.totalContacted} Contacted
          </div>
        </div>

        {/* Card 4: Won Commission Value Added */}
        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Won Monthly Commission</span>
            <DollarSign className="w-4 h-4 text-emerald-500 dark:text-[#8CE600]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {formatMoney(totals.totalRevenue)}
          </div>
          <div className="text-[11px] text-[#0A3981] dark:text-blue-300 mt-1 font-semibold">
            Based on {commissionRate}% Gold Rev-Share
          </div>
        </div>
      </div>

      {/* Main Recharts Visual: Conversion Lifecycle Timeline */}
      <div className="bg-white dark:bg-[#072457] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Lead Conversion Status Trends</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">
                ({timeRange === '30d' ? 'Weekly Granularity' : 'Monthly Cohorts'})
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-blue-100/70 mt-0.5">
              Hover over periods to inspect breakdown by conversion status, win rate, and added ARR revenue.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Won
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Contacted
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> New
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Lost
            </span>
          </div>
        </div>

        {/* Recharts Chart Canvas */}
        <div className="w-full h-80 min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'stacked-area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="wonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.won} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.won} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="contactedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.contacted} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.contacted} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.new} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.new} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.lost} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.lost} stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTimelineTooltip />} />

                {visibleStatuses.lost && (
                  <Area
                    type="monotone"
                    dataKey="lost"
                    name="Lost"
                    stackId="1"
                    stroke={colors.lost}
                    strokeWidth={2}
                    fill="url(#lostGrad)"
                  />
                )}
                {visibleStatuses.new && (
                  <Area
                    type="monotone"
                    dataKey="new"
                    name="New"
                    stackId="1"
                    stroke={colors.new}
                    strokeWidth={2}
                    fill="url(#newGrad)"
                  />
                )}
                {visibleStatuses.contacted && (
                  <Area
                    type="monotone"
                    dataKey="contacted"
                    name="Contacted"
                    stackId="1"
                    stroke={colors.contacted}
                    strokeWidth={2}
                    fill="url(#contactedGrad)"
                  />
                )}
                {visibleStatuses.won && (
                  <Area
                    type="monotone"
                    dataKey="won"
                    name="Won"
                    stackId="1"
                    stroke={colors.won}
                    strokeWidth={2.5}
                    fill="url(#wonGrad)"
                  />
                )}
              </AreaChart>
            ) : chartType === 'grouped-bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTimelineTooltip />} />

                {visibleStatuses.new && (
                  <Bar dataKey="new" name="New" fill={colors.new} radius={[4, 4, 0, 0]} maxBarSize={30} />
                )}
                {visibleStatuses.contacted && (
                  <Bar dataKey="contacted" name="Contacted" fill={colors.contacted} radius={[4, 4, 0, 0]} maxBarSize={30} />
                )}
                {visibleStatuses.won && (
                  <Bar dataKey="won" name="Won" fill={colors.won} radius={[4, 4, 0, 0]} maxBarSize={30} />
                )}
                {visibleStatuses.lost && (
                  <Bar dataKey="lost" name="Lost" fill={colors.lost} radius={[4, 4, 0, 0]} maxBarSize={30} />
                )}
              </BarChart>
            ) : (
              // Conversion Rate Line Chart
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[50, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTimelineTooltip />} />

                <Line
                  type="monotone"
                  dataKey="conversionRate"
                  name="Win Rate %"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8CE600', stroke: '#061F4A', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#8CE600', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary 2-Column Row: Funnel Donut Chart & Monthly Revenue Addition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Conversion Funnel Status Donut */}
        <div className="lg:col-span-5 bg-white dark:bg-[#072457] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-blue-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              Conversion Funnel Distribution
            </h4>
            <p className="text-xs text-slate-500 dark:text-blue-100/70 mt-0.5">
              Cumulative breakdown of all referred leads across the active lifecycle.
            </p>
          </div>

          <div className="relative w-full h-56 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0A2552" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} leads (${((Number(val) / totals.totalLeads) * 100).toFixed(1)}%)`, name]}
                  contentStyle={{ backgroundColor: '#0A2552', borderColor: '#1E40AF', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Stat Inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totals.winRate}%</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-[#8CE600] uppercase tracking-wider">Win Rate</span>
            </div>
          </div>

          {/* Legend Items Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-blue-900/60 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#061F4A]/80 border border-slate-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{item.name.split(' ')[0]}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Won Revenue Added Over Time */}
        <div className="lg:col-span-7 bg-white dark:bg-[#072457] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-blue-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />
                Recurring Commission Added by Won Leads
              </h4>
              <span className="text-xs font-mono font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                {currentCurrency.code} {currentCurrency.symbol.trim()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-blue-100/70 mt-0.5">
              Net recurring monthly revenue unlocked from closed-won client subscriptions.
            </p>
          </div>

          <div className="w-full h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 10, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#94A3B8' }} 
                  axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  formatter={(val: any) => [formatMoney(Number(val)), 'Won Monthly Share']}
                  contentStyle={{ backgroundColor: '#0A2552', borderColor: '#1E40AF', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="wonRevenueUsd" 
                  name="Won Recurring Revenue" 
                  fill="#10B981" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Avg deal size: <strong className="text-slate-900 dark:text-white font-mono">{formatMoney(totals.totalRevenue / (totals.totalWon || 1))} / mo</strong>
            </span>
            {onNavigateToLeads && (
              <button
                type="button"
                onClick={onNavigateToLeads}
                className="text-[#0A3981] dark:text-[#8CE600] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                View Detailed Lead Table →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cohort Breakdown Table */}
      <div className="bg-white dark:bg-[#072457] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Lifecycle Stage Breakdown Summary
            </h4>
            <p className="text-xs text-slate-500 dark:text-blue-100/70">
              Historical performance data points plotted on the charts above.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-blue-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Time Period</th>
                <th className="py-2.5 text-center">New</th>
                <th className="py-2.5 text-center">Contacted</th>
                <th className="py-2.5 text-center">Won</th>
                <th className="py-2.5 text-center">Lost</th>
                <th className="py-2.5 text-center">Total Period</th>
                <th className="py-2.5 text-center">Win Rate</th>
                <th className="py-2.5 text-right">Won Monthly MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-900/50">
              {chartData.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50/70 dark:hover:bg-[#0c2e64]/60 transition-colors">
                  <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{row.period}</span>
                  </td>
                  <td className="py-2.5 text-center font-mono text-purple-600 dark:text-purple-400 font-bold">{row.new}</td>
                  <td className="py-2.5 text-center font-mono text-blue-600 dark:text-blue-400 font-bold">{row.contacted}</td>
                  <td className="py-2.5 text-center font-mono text-emerald-600 dark:text-[#8CE600] font-bold">+{row.won}</td>
                  <td className="py-2.5 text-center font-mono text-rose-500 font-bold">{row.lost}</td>
                  <td className="py-2.5 text-center font-mono font-bold text-slate-900 dark:text-white">{row.total}</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#8CE600] border border-emerald-200/60 dark:border-emerald-800/60">
                      {row.conversionRate}%
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-700 dark:text-[#8CE600]">
                    {formatMoney(row.wonRevenueUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
