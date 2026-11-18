import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Users, DollarSign, Briefcase, Layers } from 'lucide-react';
import { PARTNERS_DATA } from '../data/partnersData';
import { Partner, PartnerLevel } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

type GroupByMode = 'region' | 'tier' | 'firms';
type MetricFocusMode = 'both' | 'clients' | 'revenue';

interface ImpactDataPoint {
  name: string;
  shortLabel: string;
  partnerCount: number;
  clientsServed: number;
  projectsCompleted: number;
  revenueManagedUSD: number;
  revenueManagedConverted: number;
  sharePercent: number;
}

const REGION_MAP: Record<string, string> = {
  Nigeria: 'West Africa',
  Ghana: 'West Africa',
  Senegal: 'West Africa',
  "Côte d'Ivoire": 'West Africa',
  Kenya: 'East Africa',
  Rwanda: 'East Africa',
  Uganda: 'East Africa',
  Tanzania: 'East Africa',
  Ethiopia: 'East Africa',
  'South Africa': 'Southern Africa',
  Zambia: 'Southern Africa',
  Botswana: 'Southern Africa',
  Egypt: 'North & Central',
  Morocco: 'North & Central',
  Cameroon: 'North & Central',
  'United Kingdom': 'Global Hubs',
  'United States': 'Global Hubs',
  UAE: 'Global Hubs',
  Canada: 'Global Hubs',
  India: 'Global Hubs',
};

const TIER_BASE_REVENUE_PER_CLIENT_USD: Record<PartnerLevel, number> = {
  Platinum: 165000,
  Gold: 125000,
  Silver: 95000,
  Bronze: 70000,
};

const CHART_PALETTE = ['#65a30d', '#0284c7', '#2563eb', '#0d9488', '#d97706', '#4f46e5', '#db2777', '#059669'];

export function estimatePartnerRevenueManagedUSD(partner: Partner): number {
  const basePerClient = TIER_BASE_REVENUE_PER_CLIENT_USD[partner.level] ?? 90000;
  const coverageMult = partner.businessSizeCoverage.includes('Enterprise')
    ? 1.28
    : partner.businessSizeCoverage.includes('Medium')
    ? 1.08
    : 0.9;
  return Math.round(partner.businessesSupported * basePerClient * coverageMult);
}

function formatCompactMoney(amount: number, symbol: string): string {
  if (amount >= 1_000_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '')}T`;
  }
  if (amount >= 1_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (amount >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(0)}k`;
  }
  return `${symbol}${amount.toLocaleString()}`;
}

export const SuccessImpactDashboard: React.FC = () => {
  const [groupBy, setGroupBy] = useState<GroupByMode>('region');
  const [metricMode, setMetricMode] = useState<MetricFocusMode>('both');
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null);

  const { currentCurrency, convertFromUSD } = useCurrency();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const poolSummary = useMemo(() => {
    const enriched = PARTNERS_DATA.map((partner) => ({
      partner,
      revenueManagedUSD: estimatePartnerRevenueManagedUSD(partner),
    }));

    const totalClientsServed = enriched.reduce((sum, item) => sum + item.partner.businessesSupported, 0);
    const totalProjectsCompleted = enriched.reduce((sum, item) => sum + item.partner.projectsCompleted, 0);
    const totalRevenueManagedUSD = enriched.reduce((sum, item) => sum + item.revenueManagedUSD, 0);
    const avgRating =
      enriched.reduce((sum, item) => sum + item.partner.rating, 0) / Math.max(enriched.length, 1);

    return {
      enriched,
      partnerCount: enriched.length,
      totalClientsServed,
      totalProjectsCompleted,
      totalRevenueManagedUSD,
      avgRevenuePerClientUSD: Math.round(totalRevenueManagedUSD / Math.max(totalClientsServed, 1)),
      avgRating,
    };
  }, []);

  const chartData = useMemo<ImpactDataPoint[]>(() => {
    const { enriched, totalClientsServed, totalRevenueManagedUSD } = poolSummary;

    if (groupBy === 'firms') {
      const topFirms = [...enriched]
        .sort((a, b) => b.revenueManagedUSD - a.revenueManagedUSD)
        .slice(0, 8);

      const sumTopClients = topFirms.reduce((s, x) => s + x.partner.businessesSupported, 0);
      const sumTopRev = topFirms.reduce((s, x) => s + x.revenueManagedUSD, 0);

      return topFirms.map(({ partner, revenueManagedUSD }) => {
        const shortName =
          partner.name.length > 16 ? `${partner.name.slice(0, 14).trim()}…` : partner.name;
        const shareBasis =
          metricMode === 'clients'
            ? (partner.businessesSupported / Math.max(sumTopClients, 1)) * 100
            : (revenueManagedUSD / Math.max(sumTopRev, 1)) * 100;
        return {
          name: partner.name,
          shortLabel: shortName,
          partnerCount: 1,
          clientsServed: partner.businessesSupported,
          projectsCompleted: partner.projectsCompleted,
          revenueManagedUSD,
          revenueManagedConverted: convertFromUSD(revenueManagedUSD),
          sharePercent: Number(shareBasis.toFixed(1)),
        };
      });
    }

    const orderedKeys =
      groupBy === 'region'
        ? ['West Africa', 'East Africa', 'Southern Africa', 'North & Central', 'Global Hubs']
        : ['Platinum', 'Gold', 'Silver', 'Bronze'];

    const buckets = new Map<
      string,
      { partnerCount: number; clientsServed: number; projectsCompleted: number; revenueManagedUSD: number }
    >();

    orderedKeys.forEach((key) => {
      buckets.set(key, { partnerCount: 0, clientsServed: 0, projectsCompleted: 0, revenueManagedUSD: 0 });
    });

    enriched.forEach(({ partner, revenueManagedUSD }) => {
      const key =
        groupBy === 'region' ? REGION_MAP[partner.country] || 'Global Hubs' : partner.level;
      const prev = buckets.get(key) || {
        partnerCount: 0,
        clientsServed: 0,
        projectsCompleted: 0,
        revenueManagedUSD: 0,
      };
      buckets.set(key, {
        partnerCount: prev.partnerCount + 1,
        clientsServed: prev.clientsServed + partner.businessesSupported,
        projectsCompleted: prev.projectsCompleted + partner.projectsCompleted,
        revenueManagedUSD: prev.revenueManagedUSD + revenueManagedUSD,
      });
    });

    return orderedKeys
      .map((key) => {
        const val = buckets.get(key)!;
        const shareBasis =
          metricMode === 'clients'
            ? (val.clientsServed / Math.max(totalClientsServed, 1)) * 100
            : (val.revenueManagedUSD / Math.max(totalRevenueManagedUSD, 1)) * 100;
        return {
          name: groupBy === 'tier' ? `${key} Tier` : key,
          shortLabel: key,
          partnerCount: val.partnerCount,
          clientsServed: val.clientsServed,
          projectsCompleted: val.projectsCompleted,
          revenueManagedUSD: val.revenueManagedUSD,
          revenueManagedConverted: convertFromUSD(val.revenueManagedUSD),
          sharePercent: Number(shareBasis.toFixed(1)),
        };
      })
      .filter((row) => row.partnerCount > 0);
  }, [groupBy, metricMode, poolSummary, convertFromUSD]);

  const totalRevenueConverted = useMemo(
    () => convertFromUSD(poolSummary.totalRevenueManagedUSD),
    [poolSummary.totalRevenueManagedUSD, convertFromUSD]
  );

  const avgRevenuePerClientConverted = useMemo(
    () => convertFromUSD(poolSummary.avgRevenuePerClientUSD),
    [poolSummary.avgRevenuePerClientUSD, convertFromUSD]
  );

  const pieDistributionData = useMemo(() => {
    if (groupBy === 'firms') {
      return chartData.slice(0, 5);
    }
    return chartData;
  }, [chartData, groupBy]);

  const axisTickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 23, 42, 0.08)';
  const clientsColor = isDark ? '#84cc16' : '#65a30d';
  const revenueColor = isDark ? '#38bdf8' : '#0284c7';

  return (
    <section
      id="success-impact-dashboard"
      data-testid="success-impact-dashboard"
      aria-label="Success Impact Dashboard"
      className="mt-5 rounded-2xl bg-white/95 dark:bg-[#0c1f38]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 shadow-lg shadow-blue-950/5 overflow-hidden"
    >
      {/* Dashboard Top Header & Interactive Controls */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Success Impact Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span>{poolSummary.partnerCount} certified partner portfolios</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>Collective clients served &amp; annualized revenue managed</span>
          </p>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            role="group"
            aria-label="Group impact metrics by"
            className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70"
          >
            {(
              [
                { id: 'region', label: 'By Region' },
                { id: 'tier', label: 'By Tier' },
                { id: 'firms', label: 'Top Firms' },
              ] as { id: GroupByMode; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-testid={`impact-group-${opt.id}`}
                onClick={() => {
                  setGroupBy(opt.id);
                  setActiveSliceIndex(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  groupBy === opt.id
                    ? 'bg-white dark:bg-[#07162b] text-slate-900 dark:text-lime-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Focus metric series"
            className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70"
          >
            {(
              [
                { id: 'both', label: 'Combined' },
                { id: 'clients', label: 'Clients Served' },
                { id: 'revenue', label: 'Revenue Managed' },
              ] as { id: MetricFocusMode; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-testid={`impact-metric-${opt.id}`}
                onClick={() => setMetricMode(opt.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  metricMode === opt.id
                    ? 'bg-slate-900 dark:bg-lime-500 text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/35">
        <div className="px-5 py-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Collective Clients Served</span>
            <Users className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
          </div>
          <div
            data-testid="impact-total-clients"
            className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight"
          >
            {poolSummary.totalClientsServed.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Active SME &amp; enterprise accounts
          </p>
        </div>

        <div className="px-5 py-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Revenue Managed</span>
            <DollarSign className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          </div>
          <div
            data-testid="impact-total-revenue"
            className="text-xl sm:text-2xl font-extrabold text-sky-700 dark:text-sky-300 tabular-nums tracking-tight"
          >
            {formatCompactMoney(totalRevenueConverted, currentCurrency.symbol)}
            <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {currentCurrency.code}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Annualized POS &amp; ledger throughput
          </p>
        </div>

        <div className="px-5 py-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Avg. Revenue / Client</span>
            <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCompactMoney(avgRevenuePerClientConverted, currentCurrency.symbol)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Weighted across {poolSummary.partnerCount} partner cohorts
          </p>
        </div>

        <div className="px-5 py-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Projects Completed</span>
            <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {poolSummary.totalProjectsCompleted.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            {poolSummary.avgRating.toFixed(2)} / 5.0 avg verified rating
          </p>
        </div>
      </div>

      {/* Charts Workspace: Main Comparison Chart + Portfolio Share Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Primary Recharts Visualization (8 Columns) */}
        <div className="lg:col-span-8 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {groupBy === 'region' && 'Regional Clients Served vs. Revenue Managed'}
                {groupBy === 'tier' && 'Partner Tier Impact Breakdown'}
                {groupBy === 'firms' && 'Top 8 Partner Firms by Managed Volume'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hover bars or trend points to inspect firm count, projects, and revenue figures
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              {metricMode !== 'revenue' && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: clientsColor }}
                    aria-hidden="true"
                  />
                  <span>Clients Served</span>
                </span>
              )}
              {metricMode !== 'clients' && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: revenueColor }}
                    aria-hidden="true"
                  />
                  <span>Revenue Managed ({currentCurrency.code})</span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-[290px]" data-testid="impact-main-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 12, left: 0, bottom: groupBy === 'firms' ? 20 : 4 }}
              >
                <defs>
                  <linearGradient id="impactRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={revenueColor} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={revenueColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                  interval={0}
                  angle={groupBy === 'firms' ? -14 : 0}
                  textAnchor={groupBy === 'firms' ? 'end' : 'middle'}
                  height={groupBy === 'firms' ? 48 : 28}
                />
                {metricMode !== 'revenue' && (
                  <YAxis
                    yAxisId="clients"
                    orientation="left"
                    tick={{ fill: axisTickColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val: number) => val.toLocaleString()}
                    width={46}
                  />
                )}
                {metricMode !== 'clients' && (
                  <YAxis
                    yAxisId="revenue"
                    orientation={metricMode === 'revenue' ? 'left' : 'right'}
                    tick={{ fill: axisTickColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val: number) => formatCompactMoney(val, currentCurrency.symbol)}
                    width={64}
                  />
                )}
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.04)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0]?.payload as ImpactDataPoint | undefined;
                    if (!row) return null;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 shadow-xl text-xs space-y-1.5 min-w-[210px]">
                        <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                          {row.name}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500 dark:text-slate-400">Clients Served</span>
                          <span className="font-bold text-lime-700 dark:text-lime-400 tabular-nums">
                            {row.clientsServed.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500 dark:text-slate-400">Revenue Managed</span>
                          <span className="font-bold text-sky-700 dark:text-sky-400 tabular-nums">
                            {formatCompactMoney(row.revenueManagedConverted, currentCurrency.symbol)}{' '}
                            {currentCurrency.code}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{row.partnerCount} partner{row.partnerCount === 1 ? '' : 's'}</span>
                          <span className="tabular-nums">{row.projectsCompleted.toLocaleString()} projects</span>
                        </div>
                      </div>
                    );
                  }}
                />
                {metricMode !== 'revenue' && (
                  <Bar
                    yAxisId="clients"
                    dataKey="clientsServed"
                    name="Clients Served"
                    fill={clientsColor}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                )}
                {metricMode === 'both' && (
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenueManagedConverted"
                    name="Revenue Managed"
                    stroke={revenueColor}
                    strokeWidth={2.5}
                    fill="url(#impactRevenueGradient)"
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                )}
                {metricMode === 'revenue' && (
                  <Bar
                    yAxisId="revenue"
                    dataKey="revenueManagedConverted"
                    name="Revenue Managed"
                    fill={revenueColor}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Distribution Breakdown (4 Columns) */}
        <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {metricMode === 'clients' ? 'Clients Served Share' : 'Revenue Managed Share'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {groupBy === 'firms'
                ? 'Top 5 firms proportion'
                : groupBy === 'region'
                ? 'Distribution across regional hubs'
                : 'Distribution across partner tiers'}
            </p>
          </div>

          <div className="relative h-[180px] my-2" data-testid="impact-share-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDistributionData}
                  dataKey={metricMode === 'clients' ? 'clientsServed' : 'revenueManagedConverted'}
                  nameKey="shortLabel"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveSliceIndex(index)}
                  onMouseLeave={() => setActiveSliceIndex(null)}
                >
                  {pieDistributionData.map((entry, idx) => (
                    <Cell
                      key={entry.shortLabel}
                      fill={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      opacity={activeSliceIndex === null || activeSliceIndex === idx ? 1 : 0.45}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0]?.payload as ImpactDataPoint | undefined;
                    if (!row) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-lg text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                        <div className="text-slate-600 dark:text-slate-300 tabular-nums">
                          {metricMode === 'clients'
                            ? `${row.clientsServed.toLocaleString()} clients (${row.sharePercent}%)`
                            : `${formatCompactMoney(row.revenueManagedConverted, currentCurrency.symbol)} (${row.sharePercent}%)`}
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Readout */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {activeSliceIndex !== null && pieDistributionData[activeSliceIndex]
                  ? pieDistributionData[activeSliceIndex].shortLabel
                  : 'Network Total'}
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                {activeSliceIndex !== null && pieDistributionData[activeSliceIndex]
                  ? `${pieDistributionData[activeSliceIndex].sharePercent}%`
                  : metricMode === 'clients'
                  ? poolSummary.totalClientsServed.toLocaleString()
                  : formatCompactMoney(totalRevenueConverted, currentCurrency.symbol)}
              </span>
            </div>
          </div>

          {/* Clean Tabular Breakdown List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {pieDistributionData.map((row, idx) => (
              <div
                key={row.shortLabel}
                onMouseEnter={() => setActiveSliceIndex(idx)}
                onMouseLeave={() => setActiveSliceIndex(null)}
                className={`py-1.5 flex items-center justify-between gap-2 transition-colors ${
                  activeSliceIndex === idx ? 'bg-slate-50 dark:bg-slate-800/50 -mx-2 px-2 rounded' : ''
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-xs shrink-0"
                    style={{ backgroundColor: CHART_PALETTE[idx % CHART_PALETTE.length] }}
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                    {row.shortLabel}
                  </span>
                </span>
                <span className="flex items-center gap-2.5 shrink-0 tabular-nums">
                  <span className="text-slate-500 dark:text-slate-400">
                    {metricMode === 'clients'
                      ? `${row.clientsServed.toLocaleString()}`
                      : formatCompactMoney(row.revenueManagedConverted, currentCurrency.symbol)}
                  </span>
                  <span className="w-10 text-right font-bold text-slate-900 dark:text-white">
                    {row.sharePercent}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
