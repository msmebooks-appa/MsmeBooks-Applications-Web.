import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Sparkles,
  Compass,
  Award,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RefreshCw,
  Target,
  Briefcase,
  GitBranch,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { CandidateWorkExperience } from '../types/auth';

export interface CareerMilestone {
  yearIndex: number;
  horizon: string;
  timeframe: string;
  roleTitle: string;
  estimatedMonthlyUsd: number;
  readinessPercent: number;
  summary: string;
  keySkillsToAcquire: string[];
  deliverables: string[];
  recommendedCertification?: string;
}

export interface AlternateBranch {
  roleTitle: string;
  fitPercent: number;
  reason: string;
}

export interface CareerRoadmapData {
  growthThesis: string;
  milestones: CareerMilestone[];
  alternateBranches: AlternateBranch[];
  source?: string;
}

interface CareerPathPanelProps {
  currentRole: string;
  experienceLevel: string;
  skills: string[];
  workHistory: CandidateWorkExperience[];
  country: string;
  onAdoptTargetRole?: (roleTitle: string) => void;
  onAdoptSkill?: (skill: string) => void;
}

const TRACK_OPTIONS = [
  { id: 'Balanced', label: 'Balanced Growth' },
  { id: 'Technical IC (Staff/Principal)', label: 'IC Specialist' },
  { id: 'Leadership / Management', label: 'Leadership Track' },
];

export const CareerPathPanel: React.FC<CareerPathPanelProps> = ({
  currentRole,
  experienceLevel,
  skills,
  workHistory,
  country,
  onAdoptTargetRole,
  onAdoptSkill,
}) => {
  const [trackPreference, setTrackPreference] = useState<string>('Balanced');
  const [draftRole, setDraftRole] = useState<string>(currentRole || workHistory[0]?.title || 'Software Engineer');
  const [draftSkillsText, setDraftSkillsText] = useState<string>(skills.join(', '));
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adoptedToast, setAdoptedToast] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setDraftRole(currentRole || workHistory[0]?.title || 'Software Engineer');
  }, [currentRole, workHistory]);

  useEffect(() => {
    setDraftSkillsText(skills.join(', '));
  }, [skills]);

  const activeSkillsList = draftSkillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const fetchCareerRoadmap = useCallback(
    async (trackOverride?: string) => {
      const activeTrack = trackOverride ?? trackPreference;
      const parsedSkills = draftSkillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetch('/api/career-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentRole: draftRole.trim() || currentRole || workHistory[0]?.title || 'Software Engineer',
            experienceLevel,
            skills: parsedSkills,
            workHistory,
            country,
            trackPreference: activeTrack,
          }),
        });
        const data = await resp.json();
        if (!resp.ok || !data?.success || !data?.roadmap) {
          throw new Error(data?.error || 'Could not generate 3-year career roadmap.');
        }
        setRoadmap({ ...data.roadmap, source: data.source });
        setSelectedYearIdx(1);
      } catch (err: any) {
        setError(err?.message || 'Unable to generate career path roadmap right now.');
      } finally {
        setIsLoading(false);
      }
    },
    [draftRole, draftSkillsText, currentRole, experienceLevel, workHistory, country, trackPreference]
  );

  // Auto-generate on initial mount so the visualization renders immediately
  useEffect(() => {
    fetchCareerRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // D3 Interactive 3-Year Career Trajectory Visualization
  useEffect(() => {
    if (!svgRef.current || !roadmap || roadmap.milestones.length === 0) return;

    const milestones = roadmap.milestones;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 225;
    const margin = { top: 28, right: 48, bottom: 44, left: 56 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const defs = svg.append('defs');
    const areaGrad = defs
      .append('linearGradient')
      .attr('id', 'career-path-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0066CC').attr('stop-opacity', 0.28);
    areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#38BDF8').attr('stop-opacity', 0.02);

    const lineGrad = defs
      .append('linearGradient')
      .attr('id', 'career-path-line-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    lineGrad.append('stop').attr('offset', '0%').attr('stop-color', '#38BDF8');
    lineGrad.append('stop').attr('offset', '55%').attr('stop-color', '#0066CC');
    lineGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10B981');

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scalePoint<number>()
      .domain(milestones.map((m) => m.yearIndex))
      .range([0, innerW])
      .padding(0.15);

    const minUsd = (d3.min(milestones, (m) => m.estimatedMonthlyUsd) || 2000) * 0.78;
    const maxUsd = (d3.max(milestones, (m) => m.estimatedMonthlyUsd) || 8000) * 1.15;

    const yScale = d3.scaleLinear().domain([minUsd, maxUsd]).range([innerH, 0]);

    // Horizontal grid lines
    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickSize(-innerW)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.08)
      .attr('stroke-dasharray', '3,3');

    g.selectAll('.domain').remove();

    // Y Axis labels ($/mo)
    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickFormat((d) => `$${Math.round(Number(d) / 100) / 10}k`)
      )
      .selectAll('text')
      .attr('fill', 'currentColor')
      .attr('fill-opacity', 0.55)
      .style('font-size', '10px')
      .style('font-family', 'ui-monospace, monospace');

    g.selectAll('.domain, .tick line').attr('stroke-opacity', 0.12);

    // Area underneath curve
    const areaGen = d3
      .area<CareerMilestone>()
      .x((d) => xScale(d.yearIndex) ?? 0)
      .y0(innerH)
      .y1((d) => yScale(d.estimatedMonthlyUsd))
      .curve(d3.curveMonotoneX);

    g.append('path').datum(milestones).attr('fill', 'url(#career-path-area-grad)').attr('d', areaGen);

    // Curved trajectory path
    const lineGen = d3
      .line<CareerMilestone>()
      .x((d) => xScale(d.yearIndex) ?? 0)
      .y((d) => yScale(d.estimatedMonthlyUsd))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(milestones)
      .attr('fill', 'none')
      .attr('stroke', 'url(#career-path-line-grad)')
      .attr('stroke-width', 3.5)
      .attr('stroke-linecap', 'round')
      .attr('d', lineGen);

    // Milestone nodes
    const nodes = g
      .selectAll('.career-node')
      .data(milestones)
      .enter()
      .append('g')
      .attr('class', 'career-node')
      .attr('transform', (d) => `translate(${xScale(d.yearIndex) ?? 0},${yScale(d.estimatedMonthlyUsd)})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => setSelectedYearIdx(d.yearIndex));

    // Outer highlight ring for active node
    nodes
      .append('circle')
      .attr('r', (d) => (d.yearIndex === selectedYearIdx ? 15 : 10))
      .attr('fill', (d) => (d.yearIndex === selectedYearIdx ? '#0066CC' : '#38BDF8'))
      .attr('fill-opacity', (d) => (d.yearIndex === selectedYearIdx ? 0.18 : 0.1));

    // Core dot
    nodes
      .append('circle')
      .attr('r', (d) => (d.yearIndex === selectedYearIdx ? 7.5 : 5.5))
      .attr('fill', (d) =>
        d.yearIndex === 0 ? '#38BDF8' : d.yearIndex === 3 ? '#10B981' : '#0066CC'
      )
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.2);

    // Compensation pill above node
    nodes
      .append('text')
      .attr('y', -14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .style('font-size', '10px')
      .style('font-weight', '700')
      .style('font-family', 'ui-monospace, monospace')
      .text((d) => `$${d.estimatedMonthlyUsd.toLocaleString()}/mo`);

    // Horizon label below X axis
    nodes
      .append('text')
      .attr('y', (d) => innerH - yScale(d.estimatedMonthlyUsd) + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.yearIndex === selectedYearIdx ? '#0066CC' : 'currentColor'))
      .attr('fill-opacity', (d) => (d.yearIndex === selectedYearIdx ? 1 : 0.72))
      .style('font-size', '10.5px')
      .style('font-weight', (d) => (d.yearIndex === selectedYearIdx ? '800' : '600'))
      .text((d) => d.horizon);

    // Short Role label below horizon
    nodes
      .append('text')
      .attr('y', (d) => innerH - yScale(d.estimatedMonthlyUsd) + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('fill-opacity', 0.55)
      .style('font-size', '9px')
      .text((d) => (d.roleTitle.length > 20 ? `${d.roleTitle.slice(0, 18)}…` : d.roleTitle));
  }, [roadmap, selectedYearIdx]);

  const activeMilestone =
    roadmap?.milestones.find((m) => m.yearIndex === selectedYearIdx) || roadmap?.milestones[0] || null;

  const lowerSkills = activeSkillsList.map((s) => s.toLowerCase().trim());

  const handleAdoptMissingSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean) return;
    if (!lowerSkills.includes(clean.toLowerCase())) {
      const nextList = [...activeSkillsList, clean];
      setDraftSkillsText(nextList.join(', '));
    }
    if (onAdoptSkill) {
      onAdoptSkill(clean);
    }
    setAdoptedToast(`Added "${clean}" to your active skill set!`);
    setTimeout(() => setAdoptedToast(null), 3500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header & Track Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>3-Year AI Career Path Roadmap</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized progression from <strong className="text-slate-700 dark:text-slate-200">{draftRole || currentRole || 'Current Role'}</strong> ({experienceLevel}) using your active skills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchCareerRoadmap()}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Path</span>
            </>
          )}
        </button>
      </div>

      {/* Growth Track Selector + Editable Current Position & Skills */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Progression Track
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {TRACK_OPTIONS.map((track) => (
              <button
                key={track.id}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setTrackPreference(track.id);
                  fetchCareerRoadmap(track.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                  trackPreference === track.id
                    ? 'bg-[#0066CC] text-white border-[#0066CC]'
                    : 'bg-white dark:bg-[#131D35] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0066CC]/40'
                }`}
              >
                {track.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/70 dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Starting / Current Position
            </label>
            <input
              type="text"
              value={draftRole}
              onChange={(e) => setDraftRole(e.target.value)}
              placeholder="e.g., Frontend Engineer"
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066CC]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Active Skills (comma-separated)
            </label>
            <input
              type="text"
              value={draftSkillsText}
              onChange={(e) => setDraftSkillsText(e.target.value)}
              placeholder="React, TypeScript, Node.js, AWS..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {activeSkillsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Baseline Skills:
            </span>
            {activeSkillsList.slice(0, 8).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/70 dark:border-blue-800/70"
              >
                {skill}
              </span>
            ))}
            {activeSkillsList.length > 8 && (
              <span className="text-[10px] text-slate-400 font-medium">+{activeSkillsList.length - 8} more</span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {adoptedToast && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{adoptedToast}</span>
        </div>
      )}

      {isLoading && !roadmap && (
        <div className="p-10 text-center bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
          <Loader2 className="w-7 h-7 animate-spin text-[#0066CC] dark:text-[#38BDF8] mx-auto" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            AI Career Strategist is mapping your 3-year progression...
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Benchmarking next logical roles, compensation growth, and high-ROI skills.
          </p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-4">
          {/* AI Strategic Thesis */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0066CC] dark:text-[#38BDF8] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Growth Thesis</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{roadmap.growthThesis}</p>
          </div>

          {/* D3 Interactive Trajectory Chart */}
          <div className="p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>3-Year Role &amp; Compensation Trajectory</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Click any milestone node to inspect details
              </span>
            </div>

            <div className="w-full overflow-x-auto text-slate-800 dark:text-slate-200">
              <svg ref={svgRef} className="w-full h-auto min-w-[480px]" />
            </div>
          </div>

          {/* 4-Step Milestone Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {roadmap.milestones.map((m) => {
              const isSelected = m.yearIndex === selectedYearIdx;
              return (
                <button
                  key={m.yearIndex}
                  type="button"
                  onClick={() => setSelectedYearIdx(m.yearIndex)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#0066CC] dark:border-[#38BDF8] shadow-xs'
                      : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700/80 hover:border-[#0066CC]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isSelected ? 'text-[#0066CC] dark:text-[#38BDF8]' : 'text-slate-400'
                      }`}
                    >
                      {m.horizon}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${m.estimatedMonthlyUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {m.roleTitle}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                      <span>Readiness</span>
                      <span>{m.readinessPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0066CC] to-emerald-500 rounded-full"
                        style={{ width: `${m.readinessPercent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Deep-Dive Card */}
          {activeMilestone && (
            <div className="p-4 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-extrabold uppercase tracking-wider">
                      {activeMilestone.horizon} · {activeMilestone.timeframe}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Est. ${activeMilestone.estimatedMonthlyUsd.toLocaleString()}/mo USD
                    </span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>{activeMilestone.roleTitle}</span>
                  </h5>
                </div>

                {onAdoptTargetRole && activeMilestone.yearIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onAdoptTargetRole(activeMilestone.roleTitle);
                      setAdoptedToast(`Target role updated to "${activeMilestone.roleTitle}" in your profile!`);
                      setTimeout(() => setAdoptedToast(null), 3500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Set as Target Role</span>
                  </button>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{activeMilestone.summary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Skills to Acquire */}
                <div className="p-3 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Priority Skills for This Stage
                    </span>
                    {onAdoptSkill && (
                      <span className="text-[9px] text-slate-400">Click gap skill to add</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMilestone.keySkillsToAcquire.map((sk) => {
                      const hasSkill = lowerSkills.some((ls) => ls.includes(sk.toLowerCase()) || sk.toLowerCase().includes(ls));
                      if (hasSkill) {
                        return (
                          <span
                            key={sk}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 border bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{sk}</span>
                          </span>
                        );
                      }
                      return onAdoptSkill ? (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAdoptMissingSkill(sk)}
                          title={`Add "${sk}" to your profile skills`}
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 border bg-white dark:bg-[#16233F] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#0066CC] hover:text-[#0066CC] dark:hover:text-[#38BDF8] cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                          <span>{sk}</span>
                        </button>
                      ) : (
                        <span
                          key={sk}
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 border bg-white dark:bg-[#16233F] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                        >
                          <ArrowRight className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                          <span>{sk}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="p-3 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Promotion Unlock Deliverables
                  </span>
                  <ul className="space-y-1.5">
                    {activeMilestone.deliverables.map((deliv, i) => (
                      <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8] mt-0.5 shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {activeMilestone.recommendedCertification && (
                <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>High-ROI Credential: {activeMilestone.recommendedCertification}</span>
                </div>
              )}
            </div>
          )}

          {/* Adjacent / Logical Pivot Roles */}
          {roadmap.alternateBranches && roadmap.alternateBranches.length > 0 && (
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Adjacent Next-Step Branches</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roadmap.alternateBranches.map((branch, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{branch.roleTitle}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                          {branch.fitPercent}% Fit
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{branch.reason}</p>
                    </div>
                    {onAdoptTargetRole && (
                      <button
                        type="button"
                        onClick={() => {
                          onAdoptTargetRole(branch.roleTitle);
                          setAdoptedToast(`Target role updated to "${branch.roleTitle}" in your profile!`);
                          setTimeout(() => setAdoptedToast(null), 3500);
                        }}
                        className="self-start mt-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Target className="w-3 h-3" />
                        <span>Set as Target Role</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
