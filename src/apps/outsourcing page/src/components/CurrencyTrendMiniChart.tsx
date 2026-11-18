import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { TrendingUp, TrendingDown, Clock, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { CurrencyCode } from '../types';
import { EXCHANGE_RATES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface CurrencyTrendMiniChartProps {
  currency: CurrencyCode;
  currencySymbol: string;
  className?: string;
}

interface DataPoint {
  date: Date;
  rate: number;
  dayIndex: number;
}

export const CurrencyTrendMiniChart: React.FC<CurrencyTrendMiniChartProps> = ({
  currency,
  currencySymbol,
  className = '',
}) => {
  const { language } = useLanguage();
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Generate deterministic 30-day historical trend based on current base exchange rate
  const { data, minRate, maxRate, changePercent, currentRate } = useMemo(() => {
    const baseRate = EXCHANGE_RATES[currency] || 1;
    const now = new Date();
    const points: DataPoint[] = [];

    // Seeded pseudo-random noise for smooth realistic market drift over 30 days
    const seedOffset = currency.charCodeAt(0) * 7 + (currency.charCodeAt(1) || 0) * 13;
    let runningRate = baseRate * (currency === 'USD' ? 1 : 0.985);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      // Controlled volatility walk
      const sineMod = Math.sin((i + seedOffset) * 0.45) * 0.008;
      const noise = (((i * 17 + seedOffset) % 19) / 19 - 0.48) * 0.006;
      const dailyDrift = 1 + sineMod + noise;

      if (currency !== 'USD') {
        runningRate = runningRate * dailyDrift;
      } else {
        runningRate = 1;
      }

      points.push({
        date: d,
        rate: Number(runningRate.toFixed(currency === 'UGX' || currency === 'TZS' ? 0 : 2)),
        dayIndex: 30 - i
      });
    }

    // Force last point to match current official rate
    if (points.length > 0) {
      points[points.length - 1].rate = baseRate;
    }

    const rates = points.map(p => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const startRate = points[0].rate;
    const endRate = points[points.length - 1].rate;
    const diff = endRate - startRate;
    const pct = startRate > 0 ? (diff / startRate) * 100 : 0;

    // Find min and max points for markers
    let minPoint = points[0];
    let maxPoint = points[0];
    for (const p of points) {
      if (p.rate < minPoint.rate) minPoint = p;
      if (p.rate > maxPoint.rate) maxPoint = p;
    }

    return {
      data: points,
      minRate: min,
      maxRate: max,
      minPoint,
      maxPoint,
      changePercent: Number(pct.toFixed(2)),
      currentRate: baseRate,
    };
  }, [currency]);

  // Chart dimensions
  const width = 360;
  const height = 120;
  const margin = { top: 14, right: 14, bottom: 24, left: 14 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);
  }, [data, innerWidth]);

  const yScale = useMemo(() => {
    const padding = (maxRate - minRate) * 0.18 || 0.05;
    return d3.scaleLinear()
      .domain([minRate - padding, maxRate + padding])
      .range([innerHeight, 0]);
  }, [minRate, maxRate, innerHeight]);

  // D3 Line and Area Generators
  const areaPath = useMemo(() => {
    const areaGen = d3.area<DataPoint>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.rate))
      .curve(d3.curveMonotoneX);
    return areaGen(data) || '';
  }, [data, xScale, yScale, innerHeight]);

  const linePath = useMemo(() => {
    const lineGen = d3.line<DataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.rate))
      .curve(d3.curveMonotoneX);
    return lineGen(data) || '';
  }, [data, xScale, yScale]);

  const isPositiveChange = changePercent >= 0;
  const activePoint = hoveredPoint || data[data.length - 1];

  // Tailored outsourcing guidance based on FX direction
  const outsourcingAdvice = useMemo(() => {
    if (currency === 'USD') {
      return {
        tag: 'Benchmark Anchor',
        color: 'text-blue-400',
        text: 'USD is the global benchmark. Choose Annual billing to lock in an unconditional 20% discount on all outsourced payroll and accounting operations.',
      };
    }
    if (changePercent > 1.5) {
      return {
        tag: 'Hedge Recommended',
        color: 'text-amber-400',
        text: `${currency} has drifted ${changePercent}% vs USD over the past 30 days. Locking in an Annual or Bi-Yearly retainer shields your company against local currency devaluation.`,
      };
    }
    if (changePercent < -1.5) {
      return {
        tag: 'Favorable Window',
        color: 'text-emerald-400',
        text: `${currency} is currently strong against USD (${Math.abs(changePercent)}% gain). Lock in 12-month capacity now while purchasing power is maximized.`,
      };
    }
    return {
      tag: 'Stable FX Range',
      color: 'text-lime-400',
      text: `${currency} has remained stable with low volatility (±${Math.abs(changePercent)}%). Ideal stability window for multi-entity payroll outsourcing.`,
    };
  }, [currency, changePercent]);

  return (
    <div className={`bg-slate-800/90 dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 dark:border-slate-800 text-slate-200 shadow-md ${className}`}>
      
      {/* Header with Title & Timing Badge */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/60 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-lime-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            30-Day {currency} FX Trend (D3.js)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          {currency === 'USD' ? (
            <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-[10px]">
              Base Global Benchmark
            </span>
          ) : isPositiveChange ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px]">
              <TrendingUp className="w-3 h-3" />
              +{changePercent}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-[10px]">
              <TrendingDown className="w-3 h-3" />
              {changePercent}% (Favorable)
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Inspector */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            {hoveredPoint ? (
              <span className="text-lime-300 font-semibold">
                ● {hoveredPoint.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}:
              </span>
            ) : (
              <span>Current Spot Exchange Rate:</span>
            )}
          </span>
          <div className="text-base font-extrabold text-lime-400 font-mono tracking-tight">
            1 USD = {activePoint.rate.toLocaleString()} {currency}
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400 space-y-0.5">
          <div className="flex items-center justify-end gap-1">
            <span className="text-slate-400">30d Low:</span>
            <span className="text-slate-200 font-mono font-semibold">{minRate.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-slate-400">30d High:</span>
            <span className="text-slate-200 font-mono font-semibold">{maxRate.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Area Chart via D3 */}
      <div className="relative w-full">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-28 overflow-visible select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={`gradient-${currency}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Horizontal guide lines */}
            <line x1="0" y1={0} x2={innerWidth} y2={0} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1={innerHeight / 2} x2={innerWidth} y2={innerHeight / 2} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#334155" strokeWidth="1" opacity="0.6" />

            {/* Filled Area */}
            <path
              d={areaPath}
              fill={`url(#gradient-${currency})`}
            />

            {/* Continuous Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#a3e635"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Vertical Guide Line (Crosshair) */}
            {hoveredPoint && (
              <line
                x1={xScale(hoveredPoint.date)}
                y1={0}
                x2={xScale(hoveredPoint.date)}
                y2={innerHeight}
                stroke="#a3e635"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.8"
              />
            )}

            {/* Active Data Point Marker */}
            {activePoint && (
              <g transform={`translate(${xScale(activePoint.date)}, ${yScale(activePoint.rate)})`}>
                <circle r="4.5" fill="#a3e635" className="animate-pulse" />
                <circle r="8" fill="none" stroke="#a3e635" strokeWidth="1.5" opacity="0.6" />
              </g>
            )}

            {/* Invisible hover trigger columns for high interactivity */}
            {data.map((point, index) => {
              const xPos = xScale(point.date);
              const colWidth = innerWidth / data.length;
              return (
                <rect
                  key={index}
                  x={xPos - colWidth / 2}
                  y={0}
                  width={colWidth}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point)}
                />
              );
            })}
          </g>

          {/* Date Axis labels */}
          <text x={margin.left} y={height - 4} fontSize="9" fill="#94a3b8" textAnchor="start">
            30 days ago
          </text>
          <text x={width / 2} y={height - 4} fontSize="9" fill="#64748b" textAnchor="middle">
            15 days ago
          </text>
          <text x={width - margin.right} y={height - 4} fontSize="9" fill="#a3e635" textAnchor="end" fontWeight="bold">
            Today (Live)
          </text>
        </svg>
      </div>

      {/* Subscription Timing & Hedging Advice Footer */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 dark:border-slate-800 text-[10px] text-slate-300 flex items-start gap-2 leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
        <div>
          <span className={`font-bold mr-1.5 ${outsourcingAdvice.color}`}>
            [{outsourcingAdvice.tag}]:
          </span>
          <span>{outsourcingAdvice.text}</span>
        </div>
      </div>

    </div>
  );
};
