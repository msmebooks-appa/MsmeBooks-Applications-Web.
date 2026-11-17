import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Clock, TrendingUp, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export interface PipelineStageMetric {
  stage: string;
  actualDays: number;
  benchmarkDays: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
}

const DEFAULT_METRICS: PipelineStageMetric[] = [
  {
    stage: 'Applied → Review',
    actualDays: 1.8,
    benchmarkDays: 3.5,
    status: 'completed',
    description: 'Initial automated ATS parsing and recruiter resume review',
  },
  {
    stage: 'Review → Screening',
    actualDays: 2.2,
    benchmarkDays: 4.0,
    status: 'completed',
    description: 'Recruiter phone sync & compensation alignment',
  },
  {
    stage: 'Screening → Tech Interview',
    actualDays: 3.5,
    benchmarkDays: 5.2,
    status: 'in-progress',
    description: 'System architecture & hands-on live code evaluation',
  },
  {
    stage: 'Tech → Final Leadership',
    actualDays: 2.0,
    benchmarkDays: 4.5,
    status: 'upcoming',
    description: 'Executive vision, culture and behavioral deep-dive',
  },
  {
    stage: 'Final → Offer Delivery',
    actualDays: 1.5,
    benchmarkDays: 3.0,
    status: 'upcoming',
    description: 'Contract terms, stock option grant, and signing package',
  },
];

export const ApplicationInsightsD3Chart: React.FC<{
  metrics?: PipelineStageMetric[];
}> = ({ metrics = DEFAULT_METRICS }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredStage, setHoveredStage] = useState<PipelineStageMetric | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 160 };
    const width = 580 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 580 240`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y Scale: Stages
    const y = d3
      .scaleBand()
      .domain(metrics.map((d) => d.stage))
      .range([0, height])
      .padding(0.25);

    // X Scale: Days (max 7 days)
    const maxDays = Math.max(
      6,
      d3.max(metrics, (d) => Math.max(d.actualDays, d.benchmarkDays)) || 6
    );
    const x = d3.scaleLinear().domain([0, maxDays]).range([0, width]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-height)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.08);

    // Benchmark Background Bars
    g.selectAll('.bar-benchmark')
      .data(metrics)
      .enter()
      .append('rect')
      .attr('class', 'bar-benchmark')
      .attr('y', (d) => y(d.stage) || 0)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', (d) => x(d.benchmarkDays))
      .attr('fill', '#94A3B8')
      .attr('fill-opacity', 0.18)
      .attr('rx', 4);

    // Actual Progress Bars
    g.selectAll('.bar-actual')
      .data(metrics)
      .enter()
      .append('rect')
      .attr('class', 'bar-actual')
      .attr('y', (d) => (y(d.stage) || 0) + 2)
      .attr('height', y.bandwidth() - 4)
      .attr('x', 0)
      .attr('width', (d) => x(d.actualDays))
      .attr('fill', (d) => {
        if (d.status === 'completed') return '#10B981'; // Emerald
        if (d.status === 'in-progress') return '#0066CC'; // MsmeBooks Blue
        return '#64748B'; // Slate
      })
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredStage(d))
      .on('mouseleave', () => setHoveredStage(null));

    // Data Labels (Days)
    g.selectAll('.label-actual')
      .data(metrics)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.actualDays) + 6)
      .attr('y', (d) => (y(d.stage) || 0) + y.bandwidth() / 2 + 4)
      .text((d) => `${d.actualDays}d (${d.status === 'completed' ? 'Done' : d.status})`)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', 'currentColor')
      .attr('fill-opacity', 0.85);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat((d) => `${d}d`))
      .attr('font-size', '10px')
      .attr('font-family', 'inherit')
      .select('.domain')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.2);

    // Y Axis (Stage Labels)
    g.append('g')
      .call(d3.axisLeft(y))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'inherit')
      .select('.domain')
      .remove();
  }, [metrics]);

  const totalActual = metrics.reduce((acc, m) => acc + m.actualDays, 0);
  const totalBenchmark = metrics.reduce((acc, m) => acc + m.benchmarkDays, 0);
  const velocityDiff = Math.round(((totalBenchmark - totalActual) / totalBenchmark) * 100);

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>D3.js Pipeline Velocity Engine</span>
          </span>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Time Taken Between Application Stages
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3 h-3" />
            <span>{velocityDiff}% Faster than Market Average</span>
          </span>
        </div>
      </div>

      {/* D3 Render Target */}
      <div className="overflow-x-auto text-slate-700 dark:text-slate-300">
        <svg ref={svgRef} className="w-full max-w-[580px] mx-auto overflow-visible" />
      </div>

      {/* Legend & Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-emerald-500 inline-block" />
            <span>Completed Stage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-[#0066CC] inline-block" />
            <span>Active Stage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-slate-300 dark:bg-slate-700 inline-block" />
            <span>Market Benchmark</span>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 font-mono">
          Total Velocity: {totalActual.toFixed(1)} days (Market: {totalBenchmark.toFixed(1)} days)
        </div>
      </div>

      {/* Hovered Stage Inspector */}
      {hoveredStage && (
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs animate-in fade-in">
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{hoveredStage.stage}</span>
            <span className="capitalize text-emerald-600 dark:text-emerald-400">{hoveredStage.status}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
            {hoveredStage.description} · Actual: <strong>{hoveredStage.actualDays}d</strong> vs Industry Benchmark: <strong>{hoveredStage.benchmarkDays}d</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
