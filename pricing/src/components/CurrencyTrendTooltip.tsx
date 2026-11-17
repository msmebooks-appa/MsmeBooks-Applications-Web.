import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  X,
} from 'lucide-react';
import { Currency } from '../types';
import { get30DayCurrencyTrend, TrendDataPoint } from '../utils/currencyTrends';
import { CurrencyTrendSparkline } from './CurrencyTrendSparkline';

interface CurrencyTrendTooltipProps {
  currency: Currency;
  children?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  showInlineBadge?: boolean;
  inlineLabel?: string;
  className?: string;
}

export const CurrencyTrendTooltip: React.FC<CurrencyTrendTooltipProps> = ({
  currency,
  children,
  align = 'center',
  showInlineBadge = false,
  inlineLabel,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute 30-day trend data memoized per currency
  const trend = useMemo(() => get30DayCurrencyTrend(currency), [currency]);

  // Outside click and escape dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    if (isOpen || isPinned) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isPinned]);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredPoint(null);
    }, 220);
  };

  const handleClickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned((prev) => !prev);
    setIsOpen(true);
  };

  // Alignment classes for tooltip card
  const alignmentClass =
    align === 'left'
      ? 'left-0 sm:left-auto sm:-left-4'
      : align === 'right'
      ? 'right-0 sm:right-auto sm:-right-4'
      : 'left-1/2 -translate-x-1/2';

  // Format 30-day percentage
  const formattedPercent = `${trend.changePercent >= 0 ? '+' : ''}${trend.changePercent.toFixed(2)}%`;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center ${className}`}
    >
      {/* Target Trigger */}
      {children ? (
        <div
          onClick={handleClickToggle}
          className="cursor-pointer group/currency-trigger inline-flex items-center"
          title="Click to view 30-day conversion trend"
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClickToggle}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
          title="View 30-day conversion trend sparkline"
        >
          <Activity className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
          <span>{inlineLabel || '30d Trend'}</span>
        </button>
      )}

      {/* Optional miniature micro-sparkline trigger badge */}
      {showInlineBadge && (
        <button
          type="button"
          onClick={handleClickToggle}
          className="ml-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#0A4FD5] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 transition-all cursor-pointer shadow-2xs group"
          title="Interactive 30-day historical FX trend"
        >
          {trend.isPositive ? (
            <TrendingUp className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
          )}
          <span className="tabular-nums font-mono">{formattedPercent}</span>
          <span className="text-[9px] text-slate-400 group-hover:text-[#0A4FD5] transition-colors">30d</span>
        </button>
      )}

      {/* Floating Interactive Tooltip Popover */}
      {(isOpen || isPinned) && (
        <div
          className={`absolute top-full mt-2.5 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-left cursor-default ${alignmentClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Tip Pointer */}
          <div
            className={`absolute -top-1.5 w-3 h-3 bg-white dark:bg-[#0B1728] border-t border-l border-slate-200 dark:border-slate-800 rotate-45 ${
              align === 'left' ? 'left-6' : align === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'
            }`}
          />

          {/* Header Bar */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl shrink-0" role="img" aria-label={trend.currencyInfo.country}>
                {trend.currencyInfo.flag}
              </span>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                  <span>{trend.currencyInfo.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {trend.currency}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {trend.benchmarkLabel}
                </div>
              </div>
            </div>

            {/* Pin / Close Button */}
            <div className="flex items-center gap-1">
              {isPinned && (
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                  Pinned
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsPinned(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rate Headline & 30-day Delta */}
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                {hoveredPoint ? hoveredPoint.fullDateStr : 'Current Mid-Market Rate'}
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5">
                {hoveredPoint ? (
                  hoveredPoint.formattedRate
                ) : trend.isNgnBase ? (
                  <span>
                    1 USD = <strong className="text-[#0A4FD5] dark:text-blue-400">{trend.formattedCurrentRate}</strong>
                  </span>
                ) : (
                  <span>
                    1 {trend.currency} = <strong className="text-[#0A4FD5] dark:text-blue-400">{trend.formattedCurrentRate}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* 30-day Badge */}
            <div
              className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-black tabular-nums border ${
                trend.changePercent >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}
            >
              {trend.changePercent >= 0 ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              )}
              <span>{formattedPercent}</span>
            </div>
          </div>

          {/* Interactive SVG Sparkline with Scrub */}
          <div className="mt-3 p-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1 px-1">
              <span className="font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>30-Day Conversion Trend</span>
              </span>
              <span className="text-[9px] text-slate-600 dark:text-slate-400 italic">Hover chart to inspect</span>
            </div>

            <CurrencyTrendSparkline
              points={trend.points}
              isPositive={trend.isPositive}
              width={260}
              height={62}
              onHoverPoint={setHoveredPoint}
            />
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-slate-50 dark:bg-slate-900/70 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <div className="text-slate-600 dark:text-slate-400 font-medium">30d High</div>
              <div className="font-extrabold text-slate-900 dark:text-slate-200 tabular-nums">
                ₦{trend.high.toLocaleString('en-NG', { maximumFractionDigits: 1 })}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/70 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <div className="text-slate-600 dark:text-slate-400 font-medium">30d Low</div>
              <div className="font-extrabold text-slate-900 dark:text-slate-200 tabular-nums">
                ₦{trend.low.toLocaleString('en-NG', { maximumFractionDigits: 1 })}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/70 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <div className="text-slate-600 dark:text-slate-400 font-medium">Volatility</div>
              <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {trend.volatility}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time Mid-Market Rates</span>
            </span>
            <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400">
              Updated Hourly
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
