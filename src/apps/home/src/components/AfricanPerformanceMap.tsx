import React, { useState, useMemo } from 'react';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Building2,
  CheckCircle2,
  BarChart2,
  DollarSign,
  Percent,
  Compass,
} from 'lucide-react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../data/mockData';

export type MapMetricType = 'revenue' | 'growth' | 'margin' | 'merchants';

export interface RegionalPerformance {
  id: string;
  name: string;
  shortCode: string;
  bloc: string;
  hubCity: string;
  country: string;
  flag: string;
  pin: { x: number; y: number };
  svgPolygon: string;
  revenueNGN: number;
  growthRate: number; // e.g. 58.4 (%)
  profitMargin: number; // e.g. 28.5 (%)
  merchantCount: number; // e.g. 1420
  txVelocityPerMin: number;
  primaryCurrency: CurrencyCode;
  intensityScore: number; // 0 - 100
  status: 'Peak Velocity' | 'Rapid Scaling' | 'Stable Expansion' | 'Emerging Corridor';
  keyDrivers: string[];
  recentMilestone: string;
}

export const REGIONAL_METRICS: RegionalPerformance[] = [
  {
    id: 'west-africa',
    name: 'West Africa Commercial Bloc',
    shortCode: 'WA-ECOWAS',
    bloc: 'ECOWAS Corridor',
    hubCity: 'Lagos & Accra',
    country: 'Nigeria & Ghana',
    flag: '🇳🇬',
    pin: { x: 245, y: 295 },
    svgPolygon:
      'M 80,210 Q 110,180 180,195 Q 230,190 270,225 L 305,255 L 290,325 L 260,340 L 210,335 L 170,320 L 120,290 L 80,240 Z',
    revenueNGN: 48600000,
    growthRate: 64.8,
    profitMargin: 29.4,
    merchantCount: 4820,
    txVelocityPerMin: 342,
    primaryCurrency: 'NGN',
    intensityScore: 96,
    status: 'Peak Velocity',
    keyDrivers: ['Fast Retail POS Sync', 'B2B Wholesale Invoicing', 'Open Banking Pay-ins'],
    recentMilestone: '+82% surge in daily retail transactions across Lagos & Accra depots',
  },
  {
    id: 'east-africa',
    name: 'East Africa Digital Belt',
    shortCode: 'EA-EAC',
    bloc: 'East African Community (EAC)',
    hubCity: 'Nairobi & Kigali',
    country: 'Kenya & Rwanda',
    flag: '🇰🇪',
    pin: { x: 415, y: 325 },
    svgPolygon:
      'M 370,240 Q 420,210 470,220 Q 520,260 480,310 L 455,365 L 430,420 L 390,410 L 375,360 L 355,310 Z',
    revenueNGN: 38200000,
    growthRate: 58.2,
    profitMargin: 31.8,
    merchantCount: 3650,
    txVelocityPerMin: 288,
    primaryCurrency: 'KES',
    intensityScore: 89,
    status: 'Rapid Scaling',
    keyDrivers: ['M-PESA / Mobile Money Ledgers', 'Agritech Supply Chains', 'Cross-Border EAC Invoicing'],
    recentMilestone: '99.98% mobile money auto-reconciliation uptime across 4 currencies',
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa Industrial Axis',
    shortCode: 'SA-SADC',
    bloc: 'SADC Enterprise Grid',
    hubCity: 'Johannesburg & Lusaka',
    country: 'South Africa & Zambia',
    flag: '🇿🇦',
    pin: { x: 360, y: 500 },
    svgPolygon:
      'M 300,430 Q 360,420 420,440 L 435,490 L 410,540 L 360,575 L 305,580 L 285,530 L 295,470 Z',
    revenueNGN: 34500000,
    growthRate: 46.5,
    profitMargin: 26.2,
    merchantCount: 2940,
    txVelocityPerMin: 215,
    primaryCurrency: 'ZAR',
    intensityScore: 78,
    status: 'Stable Expansion',
    keyDrivers: ['Multi-Warehouse Logistics', 'Mining & Equipment Supplies', 'Omnichannel Franchising'],
    recentMilestone: '14 multi-branch retail chains onboarded in Gauteng and Copperbelt',
  },
  {
    id: 'north-africa',
    name: 'North Africa Commercial Gateway',
    shortCode: 'NA-MAGHREB',
    bloc: 'North African Trade Network',
    hubCity: 'Cairo & Casablanca',
    country: 'Egypt & Morocco',
    flag: '🇪🇬',
    pin: { x: 420, y: 110 },
    svgPolygon:
      'M 130,70 Q 250,50 380,55 Q 490,70 480,140 L 420,180 L 330,170 L 240,175 L 140,145 Z',
    revenueNGN: 29800000,
    growthRate: 52.1,
    profitMargin: 27.5,
    merchantCount: 2210,
    txVelocityPerMin: 194,
    primaryCurrency: 'EGP',
    intensityScore: 74,
    status: 'Rapid Scaling',
    keyDrivers: ['Arabic & French Dual-Language Invoicing', 'E-commerce Fulfillment', 'Tourism & Hospitality ERP'],
    recentMilestone: 'Instant bilingual Arabic/French tax invoice formatting deployed',
  },
  {
    id: 'central-africa',
    name: 'Central Africa Trade Basin',
    shortCode: 'CA-CEMAC',
    bloc: 'CEMAC Economic Hub',
    hubCity: 'Douala & Yaoundé',
    country: 'Cameroon & Gabon',
    flag: '🇨🇲',
    pin: { x: 290, y: 350 },
    svgPolygon:
      'M 275,260 Q 330,250 365,280 L 370,360 L 340,410 L 290,415 L 265,360 L 260,300 Z',
    revenueNGN: 18400000,
    growthRate: 41.2,
    profitMargin: 22.8,
    merchantCount: 1480,
    txVelocityPerMin: 112,
    primaryCurrency: 'XAF',
    intensityScore: 62,
    status: 'Emerging Corridor',
    keyDrivers: ['FCFA Multi-Agency Sync', 'Timber & Agro-Commodities', 'Wholesale Depot Management'],
    recentMilestone: 'Offline-first POS adoption grew by +114% in coastal wholesale districts',
  },
];

// Major Trade Corridors shown on map
const TRADE_CONNECTIONS = [
  { from: { x: 245, y: 295 }, to: { x: 415, y: 325 }, label: 'Lagos ⇄ Nairobi' },
  { from: { x: 415, y: 325 }, to: { x: 360, y: 500 }, label: 'Nairobi ⇄ Joburg' },
  { from: { x: 245, y: 295 }, to: { x: 420, y: 110 }, label: 'Lagos ⇄ Cairo' },
  { from: { x: 245, y: 295 }, to: { x: 290, y: 350 }, label: 'Lagos ⇄ Douala' },
  { from: { x: 290, y: 350 }, to: { x: 415, y: 325 }, label: 'Douala ⇄ Kigali' },
  { from: { x: 360, y: 500 }, to: { x: 415, y: 325 }, label: 'Lusaka ⇄ Dar es Salaam' },
];

interface AfricanPerformanceMapProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo?: () => void;
}

export const AfricanPerformanceMap: React.FC<AfricanPerformanceMapProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const currency: CurrencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const [selectedMetric, setSelectedMetric] = useState<MapMetricType>('revenue');
  const [activeRegionId, setActiveRegionId] = useState<string>('west-africa');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const activeRegion = useMemo(() => {
    return (
      REGIONAL_METRICS.find((r) => r.id === (hoveredRegionId || activeRegionId)) ||
      REGIONAL_METRICS[0]
    );
  }, [activeRegionId, hoveredRegionId]);

  // Aggregate stats across all African territories
  const aggregatedTotals = useMemo(() => {
    const totalRev = REGIONAL_METRICS.reduce((acc, r) => acc + r.revenueNGN, 0);
    const avgGrowth = (
      REGIONAL_METRICS.reduce((acc, r) => acc + r.growthRate, 0) / REGIONAL_METRICS.length
    ).toFixed(1);
    const totalMerchants = REGIONAL_METRICS.reduce((acc, r) => acc + r.merchantCount, 0);
    const totalTxVelocity = REGIONAL_METRICS.reduce((acc, r) => acc + r.txVelocityPerMin, 0);

    return {
      totalRev,
      avgGrowth,
      totalMerchants,
      totalTxVelocity,
    };
  }, []);

  // Compute color based on selected metric and score
  const getIntensityFill = (region: RegionalPerformance, isSelected: boolean) => {
    let score = region.intensityScore;

    if (selectedMetric === 'growth') {
      score = (region.growthRate / 70) * 100;
    } else if (selectedMetric === 'margin') {
      score = (region.profitMargin / 35) * 100;
    } else if (selectedMetric === 'merchants') {
      score = (region.merchantCount / 5000) * 100;
    }

    if (score >= 90) {
      return isSelected
        ? 'rgba(183, 240, 0, 0.95)' // Lemon Lime highlight
        : 'rgba(183, 240, 0, 0.65)';
    }
    if (score >= 75) {
      return isSelected
        ? 'rgba(8, 102, 255, 0.95)' // Electric Blue
        : 'rgba(8, 102, 255, 0.65)';
    }
    if (score >= 60) {
      return isSelected
        ? 'rgba(14, 165, 233, 0.95)' // Sky Blue
        : 'rgba(14, 165, 233, 0.55)';
    }
    return isSelected
      ? 'rgba(99, 102, 241, 0.95)' // Indigo
      : 'rgba(99, 102, 241, 0.45)';
  };

  const getIntensityBadge = (score: number) => {
    if (score >= 90) return { label: 'Top Tier • Peak', color: 'text-[#B7F000]' };
    if (score >= 75) return { label: 'Tier 1 • High', color: 'text-blue-400' };
    if (score >= 60) return { label: 'Tier 2 • Strong', color: 'text-sky-400' };
    return { label: 'Tier 3 • Emerging', color: 'text-indigo-400' };
  };

  return (
    <div className="mt-12 bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-8">
      {/* Map Header & Interactive Metric Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0866FF] dark:text-blue-400">
            <Compass className="w-4 h-4" />
            <span>Pan-African Geospatial Intelligence</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Regional Business Performance Heatmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Live telemetry across 5 core African trade corridors. Click or hover on any region to inspect localized revenue, margins, and transaction velocity in your selected currency.
          </p>
        </div>

        {/* Metric Selector Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-[#131D31] rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          {[
            { id: 'revenue', label: 'Revenue Volume', icon: DollarSign },
            { id: 'growth', label: 'YoY Growth Rate', icon: TrendingUp },
            { id: 'margin', label: 'Profit Margins', icon: Percent },
            { id: 'merchants', label: 'Active Density', icon: Building2 },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id as MapMetricType)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0866FF] text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-400/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (7 cols): Interactive SVG Map of Africa */}
        <div className="lg:col-span-7 bg-[#F8FAFD] dark:bg-[#090E1A] p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/90 relative flex flex-col justify-between overflow-hidden">
          {/* Top Map Action Bar */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Live African Mesh Network
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                ({aggregatedTotals.totalTxVelocity} tx/sec global aggregate)
              </span>
            </div>

            {/* Quick Region Selector Pills */}
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar">
              {REGIONAL_METRICS.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setActiveRegionId(reg.id)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    activeRegionId === reg.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {reg.flag} {reg.shortCode.split('-')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] max-h-[500px] flex items-center justify-center my-2 select-none">
            <svg
              viewBox="0 0 580 620"
              className="w-full h-full drop-shadow-md"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Continental Base Filter Glow */}
                <filter id="africaGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
                </filter>
                <linearGradient id="tradeLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0866FF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#B7F000" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0866FF" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Africa Continent Silhouette Background Outline */}
              <path
                d="M 120,65 Q 230,40 370,45 Q 490,65 480,140 Q 425,190 475,225 Q 525,270 480,320 L 450,380 L 435,440 L 420,500 L 360,580 L 300,585 L 280,530 L 290,470 L 265,420 L 260,340 L 165,325 L 115,290 L 75,230 Q 80,150 120,65 Z"
                fill="currentColor"
                className="text-slate-200/70 dark:text-slate-850/80 transition-colors"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Trade Corridor Connection Arcs */}
              {TRADE_CONNECTIONS.map((c, i) => (
                <g key={i}>
                  <line
                    x1={c.from.x}
                    y1={c.from.y}
                    x2={c.to.x}
                    y2={c.to.y}
                    stroke="url(#tradeLineGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-60"
                  />
                </g>
              ))}

              {/* Regional Polygons with Dynamic Intensity Fill */}
              {REGIONAL_METRICS.map((region) => {
                const isSelected = activeRegionId === region.id;
                const isHovered = hoveredRegionId === region.id;
                const fill = getIntensityFill(region, isSelected || isHovered);

                return (
                  <g
                    key={region.id}
                    onClick={() => setActiveRegionId(region.id)}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Region Shape */}
                    <path
                      d={region.svgPolygon}
                      fill={fill}
                      stroke={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      className="transition-all duration-300 hover:opacity-95"
                    />

                    {/* Regional Label Text on SVG */}
                    <text
                      x={region.pin.x}
                      y={region.pin.y - 14}
                      textAnchor="middle"
                      className="fill-slate-900 dark:fill-white font-mono text-[10px] font-black pointer-events-none drop-shadow-xs"
                    >
                      {region.shortCode}
                    </text>
                  </g>
                );
              })}

              {/* Animated Regional Hub Pins / Pulse Rings */}
              {REGIONAL_METRICS.map((region) => {
                const isSelected = activeRegionId === region.id;

                return (
                  <g
                    key={`pin-${region.id}`}
                    transform={`translate(${region.pin.x}, ${region.pin.y})`}
                    onClick={() => setActiveRegionId(region.id)}
                    className="cursor-pointer"
                  >
                    {/* Outer Pulse */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="none"
                        stroke="#B7F000"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      r="10"
                      fill={isSelected ? '#0866FF' : '#1E293B'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-all duration-200 shadow-md"
                    />

                    {/* Inner Center Dot */}
                    <circle
                      r="4"
                      fill={isSelected ? '#B7F000' : '#38BDF8'}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Legend Bar */}
          <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Performance Intensity Scale:
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" /> Emerging
                </span>
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500/80" /> Moderate
                </span>
                <span className="flex items-center gap-1 text-[#0866FF] dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF]" /> Strong
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-[#B7F000]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B7F000]" /> Peak (90%+)
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Click any territory to inspect telemetry
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Selected Region Deep Dive Inspector */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0A1E4A] to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeRegion.flag}</span>
                <div>
                  <h4 className="text-lg font-black font-display text-white">
                    {activeRegion.name}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeRegion.bloc} • {activeRegion.hubCity}
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 ${
                  getIntensityBadge(activeRegion.intensityScore).color
                }`}
              >
                {activeRegion.status}
              </span>
            </div>

            {/* Primary KPI Metric Card for Selected Metric */}
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {selectedMetric === 'revenue' && 'Recorded Regional Revenue (Global Synced)'}
                {selectedMetric === 'growth' && 'Year-Over-Year Velocity Growth'}
                {selectedMetric === 'margin' && 'Average Operating Profit Margin'}
                {selectedMetric === 'merchants' && 'Active Commercial Outlets & Depots'}
              </span>

              <div className="text-3xl sm:text-4xl font-black font-mono text-[#B7F000] tracking-tight">
                {selectedMetric === 'revenue' && currency.format(activeRegion.revenueNGN)}
                {selectedMetric === 'growth' && `+${activeRegion.growthRate}% YoY`}
                {selectedMetric === 'margin' && `${activeRegion.profitMargin}% Net`}
                {selectedMetric === 'merchants' && `${activeRegion.merchantCount.toLocaleString()} Outlets`}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Baseline Home Currency: {activeRegion.primaryCurrency}</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Score: {activeRegion.intensityScore}/100
                </span>
              </div>
            </div>

            {/* 4-Stat Metric Matrix */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Revenue Share:</div>
                <div className="font-bold text-white font-mono text-sm mt-0.5">
                  {((activeRegion.revenueNGN / aggregatedTotals.totalRev) * 100).toFixed(1)}% of total
                </div>
                <div className="text-[10px] text-slate-400">
                  {currency.format(activeRegion.revenueNGN, { compact: true })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Tx Velocity:</div>
                <div className="font-bold text-[#B7F000] font-mono text-sm mt-0.5">
                  {activeRegion.txVelocityPerMin} tx/min
                </div>
                <div className="text-[10px] text-slate-400">Real-time sync</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Merchant Outlets:</div>
                <div className="font-bold text-white font-mono text-sm mt-0.5">
                  {activeRegion.merchantCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Cloud active branches</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Profit Margin:</div>
                <div className="font-bold text-emerald-400 font-mono text-sm mt-0.5">
                  {activeRegion.profitMargin}%
                </div>
                <div className="text-[10px] text-slate-400">Operating ratio</div>
              </div>
            </div>

            {/* Key Growth Drivers */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Key Regional Performance Drivers:
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                {activeRegion.keyDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F000] shrink-0" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Milestone Note */}
            <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-200">
              <span className="font-bold text-blue-300">Territory Highlight: </span>
              <span>{activeRegion.recentMilestone}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 space-y-2">
            <button
              onClick={onOpenStartFree}
              className="w-full py-3 px-4 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Deploy Regional Ledger in {activeRegion.country}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenBookDemo && (
              <button
                onClick={onOpenBookDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Request Enterprise Regional Walkthrough</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
