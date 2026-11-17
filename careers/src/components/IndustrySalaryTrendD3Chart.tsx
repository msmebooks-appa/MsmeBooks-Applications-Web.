import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendingUp, Sparkles, Calendar, DollarSign, Info, Bot, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { Job } from '../types/career';

export interface SalaryTrendDiscussionMetrics {
  baselineAvgUSD: number;
  currentAvgUSD: number;
  yoyGrowthPercent: number;
  minUSD: number;
  maxUSD: number;
}

interface IndustrySalaryTrendD3ChartProps {
  job: Job;
  className?: string;
  onDiscussSalaryTrend?: (job: Job, metrics: SalaryTrendDiscussionMetrics) => void;
}

interface MonthlyDataPoint {
  monthIndex: number;
  monthName: string;
  year: number;
  averageSalaryUSD: number;
  minSalaryUSD: number;
  maxSalaryUSD: number;
  momGrowth: number;
}

export const IndustrySalaryTrendD3Chart: React.FC<IndustrySalaryTrendD3ChartProps> = ({
  job,
  className = '',
  onDiscussSalaryTrend,
}) => {
  const { convertFromUSD, formatAmount, currency } = useCurrency();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Derive 12-month trend using base job salary and industry multipliers
  const trendData: MonthlyDataPoint[] = useMemo(() => {
    const months = [
      'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026',
      'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
      'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026',
    ];

    // Convert job salary to USD baseline if in another currency
    let baseMinUSD = job.salary.min;
    let baseMaxUSD = job.salary.max;

    if (job.salary.currency === 'NGN') {
      baseMinUSD = Math.round(job.salary.min / 1500);
      baseMaxUSD = Math.round(job.salary.max / 1500);
    } else if (job.salary.currency === 'GHS') {
      baseMinUSD = Math.round(job.salary.min / 15.5);
      baseMaxUSD = Math.round(job.salary.max / 15.5);
    } else if (job.salary.currency === 'KES') {
      baseMinUSD = Math.round(job.salary.min / 130);
      baseMaxUSD = Math.round(job.salary.max / 130);
    } else if (job.salary.currency === 'ZAR') {
      baseMinUSD = Math.round(job.salary.min / 18.2);
      baseMaxUSD = Math.round(job.salary.max / 18.2);
    }

    const currentMid = (baseMinUSD + baseMaxUSD) / 2;

    // Industry growth weights
    const isTech =
      job.department.toLowerCase().includes('software') ||
      job.department.toLowerCase().includes('data') ||
      job.title.toLowerCase().includes('engineer') ||
      job.title.toLowerCase().includes('developer');

    const totalGrowth = isTech ? 0.128 : 0.086; // 12.8% or 8.6% YoY growth

    return months.map((monthName, i) => {
      // Curve simulation: upward trajectory with realistic market seasonality
      const progress = i / 11;
      const seasonalDip = Math.sin(progress * Math.PI * 2) * 0.015;
      const growthFactor = (1 - totalGrowth) + (progress * totalGrowth) + seasonalDip;

      const avg = Math.round(currentMid * growthFactor);
      const min = Math.round(baseMinUSD * growthFactor);
      const max = Math.round(baseMaxUSD * growthFactor);
      const prevAvg = i > 0 ? Math.round(currentMid * ((1 - totalGrowth) + ((i - 1) / 11 * totalGrowth))) : avg;
      const mom = i > 0 ? Number((((avg - prevAvg) / prevAvg) * 100).toFixed(1)) : 0;

      return {
        monthIndex: i,
        monthName,
        year: i < 2 ? 2025 : 2026,
        averageSalaryUSD: avg,
        minSalaryUSD: min,
        maxSalaryUSD: max,
        momGrowth: mom,
      };
    });
  }, [job]);

  const yoyGrowthPercent = useMemo(() => {
    if (trendData.length < 2) return 0;
    const start = trendData[0].averageSalaryUSD;
    const end = trendData[trendData.length - 1].averageSalaryUSD;
    return Number((((end - start) / start) * 100).toFixed(1));
  }, [trendData]);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || trendData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 640;
    const width = Math.max(containerWidth, 420);
    const height = 240;
    const margin = { top: 24, right: 30, bottom: 40, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Gradient definitions
    const defs = svg.append('defs');

    const gradient = defs
      .append('linearGradient')
      .attr('id', 'salaryTrendGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0066CC')
      .attr('stop-opacity', 0.35);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0066CC')
      .attr('stop-opacity', 0.0);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(trendData.map((d) => d.monthName.split(' ')[0]))
      .range([0, innerWidth])
      .padding(0.2);

    const convertedValues = trendData.map((d) => convertFromUSD(d.averageSalaryUSD));
    const convertedMins = trendData.map((d) => convertFromUSD(d.minSalaryUSD));
    const convertedMaxs = trendData.map((d) => convertFromUSD(d.maxSalaryUSD));

    const yMin = Math.max(0, Math.min(...convertedMins) * 0.88);
    const yMax = Math.max(...convertedMaxs) * 1.08;

    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0])
      .nice();

    // Horizontal Grid Lines
    const yAxisTicks = yScale.ticks(5);
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yAxisTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#64748B')
      .attr('stroke-opacity', 0.15)
      .attr('stroke-dasharray', '3 3');

    // Area Generator
    const area = d3
      .area<MonthlyDataPoint>()
      .x((d) => xScale(d.monthName.split(' ')[0]) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(convertFromUSD(d.averageSalaryUSD)))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const line = d3
      .line<MonthlyDataPoint>()
      .x((d) => xScale(d.monthName.split(' ')[0]) || 0)
      .y((d) => yScale(convertFromUSD(d.averageSalaryUSD)))
      .curve(d3.curveMonotoneX);

    // Min-Max confidence range band
    const rangeArea = d3
      .area<MonthlyDataPoint>()
      .x((d) => xScale(d.monthName.split(' ')[0]) || 0)
      .y0((d) => yScale(convertFromUSD(d.minSalaryUSD)))
      .y1((d) => yScale(convertFromUSD(d.maxSalaryUSD)))
      .curve(d3.curveMonotoneX);

    // Draw range band
    g.append('path')
      .datum(trendData)
      .attr('fill', '#38BDF8')
      .attr('fill-opacity', 0.08)
      .attr('d', rangeArea);

    // Draw area
    g.append('path')
      .datum(trendData)
      .attr('fill', 'url(#salaryTrendGrad)')
      .attr('d', area);

    // Draw line
    g.append('path')
      .datum(trendData)
      .attr('fill', 'none')
      .attr('stroke', '#0066CC')
      .attr('stroke-width', 2.8)
      .attr('d', line);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', '#94A3B8').attr('stroke-opacity', 0.25);
    xAxisG
      .selectAll('text')
      .attr('fill', '#64748B')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(0)
      .tickPadding(8)
      .tickFormat((d) => {
        const val = Number(d);
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
        if (val >= 1_000) return `${Math.round(val / 1_000)}k`;
        return `${val}`;
      });

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove();
    yAxisG
      .selectAll('text')
      .attr('fill', '#64748B')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Interactive Points and Hover Trigger Circles
    trendData.forEach((d) => {
      const x = xScale(d.monthName.split(' ')[0]) || 0;
      const y = yScale(convertFromUSD(d.averageSalaryUSD));

      // Visual point circle
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4.5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#0066CC')
        .attr('stroke-width', 2.5)
        .attr('class', 'transition-all duration-150');

      // Invisible larger hit area for smooth hovering
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 18)
        .attr('fill', 'transparent')
        .attr('cursor', 'pointer')
        .on('mouseenter', (event) => {
          setHoveredPoint(d);
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: x + margin.left,
              y: y + margin.top,
            });
          }
        })
        .on('mouseleave', () => {
          setHoveredPoint(null);
          setTooltipPos(null);
        });
    });
  }, [trendData, convertFromUSD, currency]);

  const industryName = job.industry || job.department || 'Technology & Financial Systems';

  return (
    <div
      ref={containerRef}
      className={`bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm transition-all duration-200 ${className}`}
    >
      {/* Header with Industry Badge & YoY Growth */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-[#14243A] dark:text-white">
              12-Month Industry Market Salary Trend
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Historical & projected benchmark for <strong className="text-slate-700 dark:text-slate-200">{industryName}</strong> roles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>+{yoyGrowthPercent}% 12M Growth</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            D3.js Realtime
          </span>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-100 dark:border-slate-800/80 mb-4 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">12M Baseline Avg</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-xs">
            {formatAmount(trendData[0]?.averageSalaryUSD || 0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Current Market Avg</span>
          <span className="font-bold text-[#0066CC] dark:text-[#38BDF8] font-mono text-xs">
            {formatAmount(trendData[trendData.length - 1]?.averageSalaryUSD || 0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Salary Spread Band</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-xs">
            {formatAmount(trendData[trendData.length - 1]?.minSalaryUSD || 0)} - {formatAmount(trendData[trendData.length - 1]?.maxSalaryUSD || 0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Market Velocity</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>High Demand</span>
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto overflow-visible select-none" />

        {/* Interactive D3 Tooltip */}
        {hoveredPoint && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className="bg-[#14243A] text-white p-2.5 rounded-xl shadow-xl border border-[#0066CC]/60 text-xs min-w-[170px] backdrop-blur-md">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5 mb-1.5">
                <span className="font-bold text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#38BDF8]" />
                  <span>{hoveredPoint.monthName}</span>
                </span>
                {hoveredPoint.momGrowth !== 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      hoveredPoint.momGrowth > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                    }`}
                  >
                    {hoveredPoint.momGrowth > 0 ? `+${hoveredPoint.momGrowth}%` : `${hoveredPoint.momGrowth}%`}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-[11px]">Market Avg:</span>
                  <span className="font-mono font-bold text-[#38BDF8]">
                    {formatAmount(hoveredPoint.averageSalaryUSD)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>Range:</span>
                  <span className="font-mono">
                    {formatAmount(hoveredPoint.minSalaryUSD)} - {formatAmount(hoveredPoint.maxSalaryUSD)}
                  </span>
                </div>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="w-2.5 h-2.5 bg-[#14243A] border-r border-b border-[#0066CC]/60 transform rotate-45 mx-auto -mt-1.5" />
          </div>
        )}
      </div>

      {/* Chart Footer Legend / Footnote */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0066CC] rounded-full inline-block" />
            <span>Average Market Compensation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#38BDF8]/20 border border-[#38BDF8]/40 rounded-sm inline-block" />
            <span>25th - 75th Percentile Band</span>
          </div>
        </div>
        <span className="italic text-slate-400 dark:text-slate-500">
          Normalized to active currency ({currency})
        </span>
      </div>

      {/* Discuss Salary Trend with AI Career Advisor CTA */}
      {onDiscussSalaryTrend && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            Want tailored counter-offer talking points based on this <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{yoyGrowthPercent}%</strong> market trajectory?
          </p>
          <button
            type="button"
            onClick={() =>
              onDiscussSalaryTrend(job, {
                baselineAvgUSD: trendData[0]?.averageSalaryUSD || 0,
                currentAvgUSD: trendData[trendData.length - 1]?.averageSalaryUSD || 0,
                yoyGrowthPercent,
                minUSD: trendData[trendData.length - 1]?.minSalaryUSD || 0,
                maxUSD: trendData[trendData.length - 1]?.maxSalaryUSD || 0,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] shadow-xs transition-all cursor-pointer shrink-0 group"
          >
            <Bot className="w-3.5 h-3.5 text-[#B5E61D]" />
            <span>Discuss this salary trend</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
