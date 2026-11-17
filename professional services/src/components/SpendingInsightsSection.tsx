import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Receipt,
  Sparkles,
  Plus,
} from 'lucide-react';
import { BookingRecord } from '../types/booking';
import { SERVICES_CATALOGUE } from '../data/servicesData';
import { useCurrency } from '../context/CurrencyContext';

interface SpendingInsightsSectionProps {
  bookings: BookingRecord[];
  monthlyBudgetLimit: number;
  onNewBookingClick?: () => void;
}

type CategoryKey = 'accounting' | 'tax' | 'pos' | 'advisory';

interface MonthlyExpenditureRow {
  monthKey: string;
  month: string;
  monthFull: string;
  accounting: number;
  tax: number;
  pos: number;
  advisory: number;
  paidAmount: number;
  pendingAmount: number;
  total: number;
  bookingCount: number;
  budget: number;
  services: string[];
}

const CATEGORY_META: {
  key: CategoryKey;
  label: string;
  color: string;
}[] = [
  { key: 'accounting', label: 'Accounting & Bookkeeping', color: '#1464C8' },
  { key: 'tax', label: 'Tax & Compliance', color: '#10B981' },
  { key: 'pos', label: 'POS & Systems', color: '#F59E0B' },
  { key: 'advisory', label: 'Advisory & Audit', color: '#8B5CF6' },
];

export function extractBookingFeeNGN(booking: BookingRecord, ngnPerUsd = 1492): number {
  if (booking.billingBreakdown?.totalNGN && booking.billingBreakdown.totalNGN > 0) {
    return booking.billingBreakdown.totalNGN;
  }
  const ngnMatch = booking.packagePrice?.match(/₦\s*([\d,]+)/);
  if (ngnMatch?.[1]) {
    const parsed = parseInt(ngnMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  const usdMatch = booking.packagePrice?.match(/\$\s*([\d,]+)/);
  if (usdMatch?.[1]) {
    const parsed = parseInt(usdMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed * ngnPerUsd);
  }
  return 85000;
}

function classifyBookingCategory(booking: BookingRecord): CategoryKey {
  const service = SERVICES_CATALOGUE.find((s) => s.id === booking.serviceId);
  const combined = `${service?.category || ''} ${booking.serviceTitle || ''}`.toLowerCase();

  if (
    combined.includes('tax') ||
    combined.includes('vat') ||
    combined.includes('statutory') ||
    combined.includes('compliance') ||
    combined.includes('filing')
  ) {
    return 'tax';
  }
  if (
    combined.includes('pos') ||
    combined.includes('hardware') ||
    combined.includes('software') ||
    combined.includes('retail') ||
    combined.includes('inventory') ||
    combined.includes('cloud')
  ) {
    return 'pos';
  }
  if (
    combined.includes('advisory') ||
    combined.includes('audit') ||
    combined.includes('strategy') ||
    combined.includes('funding') ||
    combined.includes('payroll') ||
    combined.includes('cfo')
  ) {
    return 'advisory';
  }
  return 'accounting';
}

function parseBookingMonthKey(booking: BookingRecord): string {
  const dateStr = booking.appointmentDate || booking.createdAt || '';
  const ymMatch = dateStr.match(/^(\d{4})-(\d{2})/);
  if (ymMatch) {
    return `${ymMatch[1]}-${ymMatch[2]}`;
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabels(monthKey: string): { short: string; full: string } {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const dt = new Date(year, monthIdx, 1);
  return {
    short: dt.toLocaleDateString('en-US', { month: 'short' }),
    full: dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
}

function buildContiguousMonthKeys(endKey: string, count: number): string[] {
  const [yStr, mStr] = endKey.split('-');
  const endDate = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, 1);
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

export const SpendingInsightsSection: React.FC<SpendingInsightsSectionProps> = ({
  bookings,
  monthlyBudgetLimit,
  onNewBookingClick,
}) => {
  const { formatAmount, convertFromNGN, currencies } = useCurrency();
  const [chartMode, setChartMode] = useState<'category-bar' | 'trend-area' | 'status-bar'>('category-bar');
  const [timeframeMonths, setTimeframeMonths] = useState<6 | 12>(6);

  const ngnPerUsd = useMemo(() => {
    const usd = currencies.find((c) => c.code === 'USD');
    return usd && usd.rateFromNGN > 0 ? 1 / usd.rateFromNGN : 1492;
  }, [currencies]);

  const {
    monthlyRows,
    totalSpendNGN,
    paidSpendNGN,
    pendingSpendNGN,
    averageMonthlyNGN,
    activeMonthsCount,
    peakMonth,
    categoryTotals,
  } = useMemo(() => {
    const monthBuckets: Record<
      string,
      {
        accounting: number;
        tax: number;
        pos: number;
        advisory: number;
        paidAmount: number;
        pendingAmount: number;
        bookingCount: number;
        services: string[];
      }
    > = {};

    const bookingMonthKeys: string[] = [];

    for (const booking of bookings) {
      const monthKey = parseBookingMonthKey(booking);
      bookingMonthKeys.push(monthKey);

      if (!monthBuckets[monthKey]) {
        monthBuckets[monthKey] = {
          accounting: 0,
          tax: 0,
          pos: 0,
          advisory: 0,
          paidAmount: 0,
          pendingAmount: 0,
          bookingCount: 0,
          services: [],
        };
      }

      const feeNGN = extractBookingFeeNGN(booking, ngnPerUsd);
      const category = classifyBookingCategory(booking);
      const bucket = monthBuckets[monthKey];

      bucket[category] += feeNGN;
      if (booking.paymentStatus === 'Paid') {
        bucket.paidAmount += feeNGN;
      } else {
        bucket.pendingAmount += feeNGN;
      }
      bucket.bookingCount += 1;
      if (booking.serviceTitle && !bucket.services.includes(booking.serviceTitle)) {
        bucket.services.push(booking.serviceTitle);
      }
    }

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sortedKeys = [...bookingMonthKeys, currentMonthKey].sort();
    const latestKey = sortedKeys[sortedKeys.length - 1] || currentMonthKey;

    const timelineKeys = buildContiguousMonthKeys(latestKey, timeframeMonths);

    const rows: MonthlyExpenditureRow[] = timelineKeys.map((key) => {
      const b = monthBuckets[key] || {
        accounting: 0,
        tax: 0,
        pos: 0,
        advisory: 0,
        paidAmount: 0,
        pendingAmount: 0,
        bookingCount: 0,
        services: [],
      };
      const labels = formatMonthLabels(key);
      const total = b.accounting + b.tax + b.pos + b.advisory;
      return {
        monthKey: key,
        month: timeframeMonths === 12 ? `${labels.short} '${key.slice(2, 4)}` : labels.short,
        monthFull: labels.full,
        accounting: b.accounting,
        tax: b.tax,
        pos: b.pos,
        advisory: b.advisory,
        paidAmount: b.paidAmount,
        pendingAmount: b.pendingAmount,
        total,
        bookingCount: b.bookingCount,
        budget: monthlyBudgetLimit,
        services: b.services,
      };
    });

    const total = rows.reduce((sum, r) => sum + r.total, 0);
    const paid = rows.reduce((sum, r) => sum + r.paidAmount, 0);
    const pending = rows.reduce((sum, r) => sum + r.pendingAmount, 0);
    const activeMonths = rows.filter((r) => r.bookingCount > 0);
    const avg = activeMonths.length > 0 ? Math.round(total / activeMonths.length) : 0;
    const peak =
      [...rows].sort((a, b) => b.total - a.total)[0] ||
      ({
        monthFull: 'N/A',
        total: 0,
        bookingCount: 0,
      } as MonthlyExpenditureRow);

    const catTotals = CATEGORY_META.map((meta) => {
      const value = rows.reduce((sum, r) => sum + r[meta.key], 0);
      return {
        ...meta,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
      };
    }).filter((item) => item.value > 0);

    return {
      monthlyRows: rows,
      totalSpendNGN: total,
      paidSpendNGN: paid,
      pendingSpendNGN: pending,
      averageMonthlyNGN: avg,
      activeMonthsCount: activeMonths.length,
      peakMonth: peak,
      categoryTotals: catTotals,
    };
  }, [bookings, monthlyBudgetLimit, timeframeMonths, ngnPerUsd]);

  const formatAxisCurrency = (valueNGN: number): string => {
    const converted = convertFromNGN(valueNGN);
    if (converted >= 1_000_000) return `${(converted / 1_000_000).toFixed(1)}M`;
    if (converted >= 1_000) return `${Math.round(converted / 1_000)}k`;
    return `${Math.round(converted)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#102B4E] via-[#1464C8] to-[#0A1727] text-white p-6 rounded-3xl shadow-lg border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B7E532]">
              <TrendingUp className="w-4 h-4" />
              <span>Spending Insights · Booking History Analytics</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatAmount(totalSpendNGN)}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Across {bookings.length} Booking{bookings.length === 1 ? '' : 's'} ({timeframeMonths} Months)
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1.5 max-w-2xl">
              Real-time monthly expenditure calculated directly from your scheduled, in-progress, and completed professional service bookings.
            </p>
          </div>

          {/* Controls: Timeframe + Chart Type */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15">
              {([6, 12] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTimeframeMonths(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    timeframeMonths === m
                      ? 'bg-white text-[#102B4E] shadow-xs'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {m}M Window
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setChartMode('category-bar')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartMode === 'category-bar'
                    ? 'bg-[#B7E532] text-[#102B4E] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>By Category</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('trend-area')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartMode === 'trend-area'
                    ? 'bg-[#B7E532] text-[#102B4E] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trend</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('status-bar')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartMode === 'status-bar'
                    ? 'bg-[#B7E532] text-[#102B4E] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Paid vs Due</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Paid Expenditure
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-[#B7E532] mt-1 truncate flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formatAmount(paidSpendNGN)}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Cleared bookings</span>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending / Quoted
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1 truncate flex items-center gap-1.5">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formatAmount(pendingSpendNGN)}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Awaiting settlement</span>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active-Month Avg
          </span>
          <div className="text-lg font-black text-[#1464C8] dark:text-[#B7E532] mt-1 truncate">
            {formatAmount(averageMonthlyNGN)}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Across {activeMonthsCount} active month{activeMonthsCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Peak Spend Month
          </span>
          <div className="text-lg font-black text-[#102B4E] dark:text-white mt-1 truncate">
            {peakMonth.total > 0 ? peakMonth.monthFull : 'No Spend Yet'}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            {peakMonth.total > 0
              ? `${formatAmount(peakMonth.total)} (${peakMonth.bookingCount} booking${peakMonth.bookingCount === 1 ? '' : 's'})`
              : 'Book a service to begin'}
          </span>
        </div>
      </div>

      {/* Main Chart + Category Donut Grid */}
      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-[#0A1727] p-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <BarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-black text-[#102B4E] dark:text-white">
            No Booking Expenditure History Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Once you book accounting, tax advisory, or POS implementation services, your monthly spending insights will appear here automatically.
          </p>
          {onNewBookingClick && (
            <button
              type="button"
              onClick={onNewBookingClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1464C8] text-white text-xs font-black hover:bg-[#1052a5] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book a Service</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Primary Monthly Expenditure Chart (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0A1727] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                  <span>Monthly Services Expenditure</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                    Recharts
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly totals aggregated from booking history vs. your {formatAmount(monthlyBudgetLimit)} budget ceiling.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50">
                <span className="w-2.5 border-t-2 border-dashed border-rose-500 inline-block" />
                <span>Budget Cap: {formatAmount(monthlyBudgetLimit)}</span>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'category-bar' ? (
                  <BarChart data={monthlyRows} margin={{ top: 12, right: 12, left: -4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => formatAxisCurrency(Number(v) || 0)}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const row = payload[0].payload as MonthlyExpenditureRow;
                          return (
                            <div className="bg-white dark:bg-[#0D1D31] p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 min-w-[210px]">
                              <div className="font-black text-[#102B4E] dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-1 flex items-center justify-between gap-3">
                                <span>{row.monthFull}</span>
                                <span className="text-[#1464C8] dark:text-[#B7E532]">
                                  {formatAmount(row.total)}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">
                                {row.bookingCount} booking{row.bookingCount === 1 ? '' : 's'} scheduled
                              </div>
                              {CATEGORY_META.map((cat) =>
                                row[cat.key] > 0 ? (
                                  <div key={cat.key} className="flex justify-between gap-3 text-[11px]">
                                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                      <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                      />
                                      {cat.label}:
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                      {formatAmount(row[cat.key])}
                                    </span>
                                  </div>
                                ) : null
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <ReferenceLine
                      y={monthlyBudgetLimit}
                      stroke="#F43F5E"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Bar dataKey="accounting" name="Accounting & Books" fill="#1464C8" stackId="spend" />
                    <Bar dataKey="tax" name="Tax & Compliance" fill="#10B981" stackId="spend" />
                    <Bar dataKey="pos" name="POS & Systems" fill="#F59E0B" stackId="spend" />
                    <Bar
                      dataKey="advisory"
                      name="Advisory & Audit"
                      fill="#8B5CF6"
                      stackId="spend"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : chartMode === 'status-bar' ? (
                  <BarChart data={monthlyRows} margin={{ top: 12, right: 12, left: -4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => formatAxisCurrency(Number(v) || 0)}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const row = payload[0].payload as MonthlyExpenditureRow;
                          return (
                            <div className="bg-white dark:bg-[#0D1D31] p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                              <div className="font-black text-[#102B4E] dark:text-white">
                                {row.monthFull} ({row.bookingCount} bookings)
                              </div>
                              <div className="flex justify-between gap-4 text-emerald-600 dark:text-[#B7E532]">
                                <span>Paid:</span>
                                <span className="font-bold">{formatAmount(row.paidAmount)}</span>
                              </div>
                              <div className="flex justify-between gap-4 text-amber-500">
                                <span>Pending / Due:</span>
                                <span className="font-bold">{formatAmount(row.pendingAmount)}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <ReferenceLine
                      y={monthlyBudgetLimit}
                      stroke="#F43F5E"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Bar dataKey="paidAmount" name="Paid Bookings" fill="#10B981" stackId="status" />
                    <Bar
                      dataKey="pendingAmount"
                      name="Pending / Quoted"
                      fill="#F59E0B"
                      stackId="status"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={monthlyRows} margin={{ top: 12, right: 12, left: -4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendingInsightsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1464C8" stopOpacity={0.75} />
                        <stop offset="95%" stopColor="#1464C8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => formatAxisCurrency(Number(v) || 0)}
                    />
                    <Tooltip
                      formatter={(value: unknown) => [formatAmount(Number(value) || 0), 'Monthly Expenditure']}
                      labelFormatter={(label, items) => {
                        const row = items?.[0]?.payload as MonthlyExpenditureRow | undefined;
                        return row ? `${row.monthFull} (${row.bookingCount} bookings)` : String(label);
                      }}
                      contentStyle={{
                        backgroundColor: '#0D1D31',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <ReferenceLine
                      y={monthlyBudgetLimit}
                      stroke="#F43F5E"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Monthly Expenditure"
                      stroke="#1464C8"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#spendingInsightsGrad)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Donut Chart (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0A1727] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                <span>Spend by Service Category</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Share of total booked services across practice areas
              </p>
            </div>

            <div className="w-full h-48 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={74}
                    paddingAngle={4}
                  >
                    {categoryTotals.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => [formatAmount(Number(value) || 0), 'Category Spend']}
                    contentStyle={{
                      backgroundColor: '#0D1D31',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {categoryTotals.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span className="font-black text-[#102B4E] dark:text-white shrink-0 ml-2">
                    {formatAmount(cat.value)}{' '}
                    <span className="text-[10px] text-slate-400 font-bold">({cat.percent}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Ledger Table */}
      <div className="bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
              Monthly Booking Expenditure Ledger
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#B7E532]" />
            <span>Derived live from {bookings.length} booking history records</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#071322] text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Pending / Due</th>
                <th className="p-3">Primary Services</th>
                <th className="p-3 text-right">Monthly Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {monthlyRows.map((row) => (
                <tr
                  key={row.monthKey}
                  className={`transition-colors ${
                    row.bookingCount > 0
                      ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      : 'opacity-55'
                  }`}
                >
                  <td className="p-3 font-black text-[#102B4E] dark:text-white whitespace-nowrap">
                    {row.monthFull}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.bookingCount > 0
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.bookingCount} {row.bookingCount === 1 ? 'booking' : 'bookings'}
                    </span>
                  </td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatAmount(row.paidAmount)}
                  </td>
                  <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">
                    {formatAmount(row.pendingAmount)}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {row.services.length > 0 ? row.services.join(', ') : '—'}
                  </td>
                  <td className="p-3 font-black text-right text-[#1464C8] dark:text-[#B7E532] whitespace-nowrap">
                    {formatAmount(row.total)}
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
