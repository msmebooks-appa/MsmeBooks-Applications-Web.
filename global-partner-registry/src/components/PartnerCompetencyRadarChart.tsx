import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Radar,
  Info,
  Check,
  Trophy,
  Sparkles,
  Calculator,
  Store,
  Compass,
  Headphones,
  Boxes,
  HelpCircle
} from 'lucide-react';
import { Partner } from '../types';

export interface CompetencyDimension {
  key: 'accounting' | 'pos' | 'consulting' | 'support' | 'inventory';
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const COMPETENCY_DIMENSIONS: CompetencyDimension[] = [
  {
    key: 'accounting',
    label: 'Accounting',
    icon: <Calculator className="w-3.5 h-3.5 text-blue-500" />,
    description: 'Bookkeeping setup, financial reporting, chart of accounts & tax compliance',
  },
  {
    key: 'pos',
    label: 'POS Systems',
    icon: <Store className="w-3.5 h-3.5 text-emerald-500" />,
    description: 'Hardware integration, offline sync, cashier tills & receipt printing',
  },
  {
    key: 'consulting',
    label: 'Consulting',
    icon: <Compass className="w-3.5 h-3.5 text-purple-500" />,
    description: 'Process re-engineering, digital migration & multi-branch expansion advisory',
  },
  {
    key: 'support',
    label: 'Support & SLA',
    icon: <Headphones className="w-3.5 h-3.5 text-amber-500" />,
    description: 'Response speed, dedicated SLA, remote hotline & customer satisfaction',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: <Boxes className="w-3.5 h-3.5 text-rose-500" />,
    description: 'Batch tracking, expiry alerts, multi-warehouse transfers & stocktaking',
  },
];

export interface PartnerCompetencyScores {
  partnerId: string;
  partnerName: string;
  partnerLevel: string;
  scores: Record<CompetencyDimension['key'], number>;
  totalScore: number;
}

/**
 * Calculates a reliable, data-driven competency strength score (0-100)
 * derived directly from the partner's verified attributes, experience, and services.
 */
export function calculateCompetencyScores(partner: Partner): PartnerCompetencyScores {
  const specs = partner.specialties.map((s) => s.toLowerCase());
  const servs = partner.services.map((s) => s.toLowerCase());
  const indus = partner.industries.map((s) => s.toLowerCase());
  const about = (partner.about + ' ' + partner.tagline).toLowerCase();

  // 1. Accounting Score (0 - 100)
  let accounting = 48;
  if (partner.partnerType.toLowerCase().includes('accounting')) accounting += 26;
  if (specs.some((s) => s.includes('accounting') || s.includes('finance') || s.includes('bookkeep'))) accounting += 14;
  if (servs.some((s) => s.includes('accounting setup') || s.includes('bookkeeping') || s.includes('tax'))) accounting += 10;
  if (about.includes('audit') || about.includes('reconciliation') || about.includes('bookkeeping')) accounting += 6;
  accounting += Math.min(partner.yearsExperience * 1.2, 10);
  if (partner.level === 'Platinum') accounting += 4;
  accounting = Math.min(99, Math.max(40, Math.round(accounting)));

  // 2. POS Systems Score (0 - 100)
  let pos = 42;
  if (partner.partnerType.toLowerCase().includes('pos') || partner.partnerType.toLowerCase().includes('hardware')) pos += 28;
  if (specs.some((s) => s.includes('pos') || s.includes('retail') || s.includes('cashier'))) pos += 16;
  if (servs.some((s) => s.includes('pos setup') || s.includes('hardware'))) pos += 14;
  if (about.includes('barcode') || about.includes('printer') || about.includes('checkout') || about.includes('cashier')) pos += 8;
  pos += Math.min(partner.projectsCompleted / 30, 8);
  if (partner.level === 'Platinum') pos += 4;
  pos = Math.min(99, Math.max(38, Math.round(pos)));

  // 3. Consulting Score (0 - 100)
  let consulting = 45;
  if (partner.partnerType.toLowerCase().includes('consult') || partner.partnerType.toLowerCase().includes('advis') || partner.partnerType.toLowerCase().includes('erp')) consulting += 25;
  if (servs.some((s) => s.includes('consulting') || s.includes('data migration') || s.includes('training'))) consulting += 14;
  if (specs.some((s) => s.includes('multi-branch') || s.includes('wholesale') || s.includes('enterprise'))) consulting += 8;
  consulting += Math.min(partner.yearsExperience * 1.8, 14);
  if (partner.clientSuccessStories && partner.clientSuccessStories.length >= 2) consulting += 6;
  if (partner.level === 'Platinum') consulting += 4;
  consulting = Math.min(99, Math.max(40, Math.round(consulting)));

  // 4. Support & SLA Score (0 - 100)
  let support = 65;
  if (partner.responseTime.includes('30 min')) support += 27;
  else if (partner.responseTime.includes('45 min')) support += 23;
  else if (partner.responseTime.includes('1 hour')) support += 18;
  else if (partner.responseTime.includes('2 hour')) support += 12;
  else if (partner.responseTime.includes('24 hour')) support += 5;

  if (partner.remoteSupport) support += 6;
  if (partner.rating >= 4.9) support += 8;
  else if (partner.rating >= 4.8) support += 5;
  if (partner.availabilityStatus === 'Accepting New Clients') support += 4;
  support = Math.min(99, Math.max(50, Math.round(support)));

  // 5. Inventory Score (0 - 100)
  let inventory = 40;
  if (specs.some((s) => s.includes('inventory') || s.includes('warehouse') || s.includes('stock'))) inventory += 26;
  if (servs.some((s) => s.includes('inventory setup') || s.includes('warehouse'))) inventory += 18;
  if (indus.some((i) => i.includes('wholesale') || i.includes('supermarket') || i.includes('pharma') || i.includes('distribut'))) inventory += 10;
  if (about.includes('batch') || about.includes('expiry') || about.includes('stocktaking')) inventory += 8;
  inventory += Math.min(partner.yearsExperience * 1.1, 8);
  inventory = Math.min(99, Math.max(38, Math.round(inventory)));

  const scores = { accounting, pos, consulting, support, inventory };
  const totalScore = Math.round(
    Object.values(scores).reduce((acc, val) => acc + val, 0) / Object.keys(scores).length
  );

  return {
    partnerId: partner.id,
    partnerName: partner.name,
    partnerLevel: partner.level,
    scores,
    totalScore,
  };
}

export const PARTNER_CHART_COLORS = [
  {
    name: 'Emerald Green',
    border: '#10b981',
    fill: 'rgba(16, 185, 129, 0.22)',
    point: '#10b981',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    bgBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    name: 'Sky Blue',
    border: '#0284c7',
    fill: 'rgba(2, 132, 199, 0.22)',
    point: '#0284c7',
    accentText: 'text-sky-600 dark:text-sky-400',
    bgBadge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  {
    name: 'Amber Gold',
    border: '#f59e0b',
    fill: 'rgba(245, 158, 11, 0.22)',
    point: '#f59e0b',
    accentText: 'text-amber-600 dark:text-amber-400',
    bgBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
];

interface PartnerCompetencyRadarChartProps {
  partners: Partner[];
}

export const PartnerCompetencyRadarChart: React.FC<PartnerCompetencyRadarChartProps> = ({ partners }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    partnerName: string;
    dimensionLabel: string;
    score: number;
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const [showMatrixView, setShowMatrixView] = useState(false);

  // Compute scores for each partner
  const partnerScores = useMemo(() => {
    return partners.map((p) => ({
      partner: p,
      data: calculateCompetencyScores(p),
    }));
  }, [partners]);

  // Find leader for each dimension
  const dimensionLeaders = useMemo(() => {
    const leaders: Record<CompetencyDimension['key'], { partnerName: string; score: number }> = {
      accounting: { partnerName: '', score: 0 },
      pos: { partnerName: '', score: 0 },
      consulting: { partnerName: '', score: 0 },
      support: { partnerName: '', score: 0 },
      inventory: { partnerName: '', score: 0 },
    };

    COMPETENCY_DIMENSIONS.forEach((dim) => {
      let maxScore = -1;
      let topPartner = '';
      partnerScores.forEach(({ partner, data }) => {
        if (data.scores[dim.key] > maxScore) {
          maxScore = data.scores[dim.key];
          topPartner = partner.name;
        }
      });
      leaders[dim.key] = { partnerName: topPartner, score: maxScore };
    });

    return leaders;
  }, [partnerScores]);

  // Render D3 Radar Chart
  useEffect(() => {
    if (!svgRef.current || partners.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 460;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    const totalAxes = COMPETENCY_DIMENSIONS.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Radius scale: 0 to 100
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // 1. Concentric background grid polygons (levels: 20, 40, 60, 80, 100)
    const levels = [20, 40, 60, 80, 100];
    levels.forEach((level) => {
      const levelRadius = rScale(level);
      const points: [number, number][] = [];

      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleSlice - Math.PI / 2;
        const x = levelRadius * Math.cos(angle);
        const y = levelRadius * Math.sin(angle);
        points.push([x, y]);
      }

      const polygonPath = d3.line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      // Grid polygon line
      g.append('path')
        .datum(points)
        .attr('d', polygonPath)
        .attr('fill', level === 100 ? 'rgba(15, 23, 42, 0.03)' : 'none')
        .attr('class', 'stroke-slate-200 dark:stroke-slate-700/60')
        .attr('stroke-width', level === 100 ? 1.5 : 1)
        .attr('stroke-dasharray', level === 100 ? 'none' : '3,3');

      // Grid level percent label
      g.append('text')
        .attr('x', 4)
        .attr('y', -levelRadius + 3)
        .attr('class', 'fill-slate-400 dark:fill-slate-500 text-[9px] font-semibold select-none pointer-events-none')
        .text(`${level}%`);
    });

    // 2. Axis radiating spokes
    COMPETENCY_DIMENSIONS.forEach((dim, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = rScale(100) * Math.cos(angle);
      const y = rScale(100) * Math.sin(angle);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('class', 'stroke-slate-300 dark:stroke-slate-700')
        .attr('stroke-width', 1);

      // Axis Labels positioned slightly beyond radius
      const labelDistance = radius + 24;
      const labelX = labelDistance * Math.cos(angle);
      const labelY = labelDistance * Math.sin(angle);

      // Label alignment based on side of circle
      let textAnchor = 'middle';
      if (Math.abs(Math.cos(angle)) > 0.3) {
        textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
      }

      const labelGroup = g
        .append('g')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .attr('class', 'cursor-default select-none');

      labelGroup
        .append('text')
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('class', 'fill-slate-800 dark:fill-slate-200 text-[11px] font-extrabold tracking-wide')
        .text(dim.label);
    });

    // 3. Partner radar polygons
    partnerScores.forEach(({ partner, data }, partnerIdx) => {
      const colorScheme = PARTNER_CHART_COLORS[partnerIdx % PARTNER_CHART_COLORS.length];
      const isHighlighted = activePartnerId === null || activePartnerId === partner.id;
      const points: [number, number][] = [];

      COMPETENCY_DIMENSIONS.forEach((dim, i) => {
        const score = data.scores[dim.key];
        const angle = i * angleSlice - Math.PI / 2;
        const x = rScale(score) * Math.cos(angle);
        const y = rScale(score) * Math.sin(angle);
        points.push([x, y]);
      });

      const lineGenerator = d3.line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      // Polygon Area Fill and Outline
      g.append('path')
        .datum(points)
        .attr('d', lineGenerator)
        .attr('fill', colorScheme.fill)
        .attr('stroke', colorScheme.border)
        .attr('stroke-width', activePartnerId === partner.id ? 3.5 : isHighlighted ? 2.5 : 1)
        .attr('opacity', isHighlighted ? 1 : 0.25)
        .attr('class', 'transition-all duration-200 cursor-pointer')
        .on('mouseenter', () => setActivePartnerId(partner.id))
        .on('mouseleave', () => setActivePartnerId(null));

      // Vertex dots
      points.forEach((point, i) => {
        const dim = COMPETENCY_DIMENSIONS[i];
        const score = data.scores[dim.key];

        const vertex = g
          .append('circle')
          .attr('cx', point[0])
          .attr('cy', point[1])
          .attr('r', activePartnerId === partner.id ? 5.5 : 4)
          .attr('fill', colorScheme.point)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('opacity', isHighlighted ? 1 : 0.3)
          .attr('class', 'cursor-pointer transition-all duration-150')
          .on('mouseenter', (event) => {
            setActivePartnerId(partner.id);
            setHoveredPoint({
              partnerName: partner.name,
              dimensionLabel: dim.label,
              score,
              x: centerX + point[0],
              y: centerY + point[1],
              color: colorScheme.border,
            });
          })
          .on('mouseleave', () => {
            setHoveredPoint(null);
          });
      });
    });
  }, [partnerScores, activePartnerId, partners]);

  return (
    <div
      id="partner-competency-radar-container"
      ref={containerRef}
      className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all shadow-xs"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/30 flex items-center justify-center shrink-0 shadow-xs">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Competency Strengths Radar
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                D3.js Visualization
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side multi-axial evaluation across Accounting, POS, Consulting, Support & Inventory.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setShowMatrixView(false)}
            className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
              !showMatrixView
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Radar Chart
          </button>
          <button
            type="button"
            onClick={() => setShowMatrixView(true)}
            className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
              showMatrixView
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scores Matrix
          </button>
        </div>
      </div>

      {/* Partner Color Legend / Interactive Focus Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
          Comparing:
        </span>
        {partnerScores.map(({ partner, data }, idx) => {
          const color = PARTNER_CHART_COLORS[idx % PARTNER_CHART_COLORS.length];
          const isActive = activePartnerId === partner.id;

          return (
            <button
              key={partner.id}
              type="button"
              onClick={() => setActivePartnerId(isActive ? null : partner.id)}
              onMouseEnter={() => setActivePartnerId(partner.id)}
              onMouseLeave={() => setActivePartnerId(null)}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isActive
                  ? `${color.bgBadge} ring-2 ring-offset-1 ring-lime-500/50 shadow-xs scale-102`
                  : activePartnerId !== null
                  ? 'opacity-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: color.border }}
              />
              <span className="truncate max-w-[150px]">{partner.name}</span>
              <span className="text-[10px] font-extrabold opacity-75">
                ({data.totalScore}/100)
              </span>
            </button>
          );
        })}

        {activePartnerId && (
          <button
            type="button"
            onClick={() => setActivePartnerId(null)}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline ml-auto"
          >
            Show All
          </button>
        )}
      </div>

      {/* Main Content: Chart or Matrix */}
      {!showMatrixView ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center mt-2">
          {/* Radar Chart SVG Area */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[340px]">
            <svg
              ref={svgRef}
              className="w-full max-w-[440px] h-auto drop-shadow-sm overflow-visible"
            />

            {/* Interactive Floating Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute pointer-events-none z-20 bg-slate-900/95 text-white text-xs rounded-xl p-2.5 shadow-xl border border-slate-700/80 backdrop-blur-xs min-w-[140px] animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: `${hoveredPoint.x}px`,
                  top: `${Math.max(10, hoveredPoint.y - 65)}px`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: hoveredPoint.color }}
                  />
                  <span className="truncate max-w-[120px]">{hoveredPoint.partnerName}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-400 text-[10px]">
                    {hoveredPoint.dimensionLabel}:
                  </span>
                  <span className="font-extrabold text-sm text-lime-400">
                    {hoveredPoint.score}/100
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Key Competency Takeaways & Strengths breakdown */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Competency Benchmarks & Strengths</span>
            </div>

            <div className="space-y-2">
              {COMPETENCY_DIMENSIONS.map((dim) => {
                const leader = dimensionLeaders[dim.key];

                return (
                  <div
                    key={dim.key}
                    className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-xl p-2.5 transition-all hover:border-lime-500/40"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        {dim.icon}
                        <span>{dim.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">Leader:</span>
                        <span className="font-bold text-lime-700 dark:text-lime-400 truncate max-w-[120px]">
                          {leader.partnerName}
                        </span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">
                          ({leader.score}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress bars for each partner in this dimension */}
                    <div className="space-y-1 pt-1">
                      {partnerScores.map(({ partner, data }, pIdx) => {
                        const score = data.scores[dim.key];
                        const color = PARTNER_CHART_COLORS[pIdx % PARTNER_CHART_COLORS.length];
                        const isTop = score === leader.score && partnerScores.length > 1;

                        return (
                          <div key={partner.id} className="flex items-center gap-2 text-[10px]">
                            <span className="w-20 truncate text-slate-600 dark:text-slate-400 font-medium">
                              {partner.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor: color.border,
                                }}
                              />
                            </div>
                            <span
                              className={`w-7 text-right font-bold ${
                                isTop
                                  ? 'text-lime-600 dark:text-lime-400 font-extrabold'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Full Numerical Scores Matrix View */
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Competency Domain</th>
                {partnerScores.map(({ partner }, pIdx) => {
                  const color = PARTNER_CHART_COLORS[pIdx % PARTNER_CHART_COLORS.length];
                  return (
                    <th key={partner.id} className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color.border }}
                        />
                        <span className="truncate max-w-[130px]">{partner.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {COMPETENCY_DIMENSIONS.map((dim) => {
                const leader = dimensionLeaders[dim.key];

                return (
                  <tr
                    key={dim.key}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        {dim.icon}
                        <div>
                          <div>{dim.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {dim.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    {partnerScores.map(({ partner, data }) => {
                      const score = data.scores[dim.key];
                      const isLeader = score === leader.score && partnerScores.length > 1;

                      return (
                        <td key={partner.id} className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-extrabold ${
                                isLeader
                                  ? 'text-lime-600 dark:text-lime-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {score}/100
                            </span>
                            {isLeader && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-lime-500/15 text-lime-700 dark:text-lime-400 border border-lime-500/30">
                                <Trophy className="w-2.5 h-2.5" />
                                Top
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Overall Total Row */}
              <tr className="bg-slate-50 dark:bg-slate-850/90 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 text-slate-900 dark:text-white">
                  Composite Competency Index
                </td>
                {partnerScores.map(({ partner, data }) => (
                  <td key={partner.id} className="p-3">
                    <span className="text-base font-black text-lime-600 dark:text-lime-400">
                      {data.totalScore}
                    </span>
                    <span className="text-xs text-slate-400"> / 100</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
