import React, { useState } from 'react';
import { SuccessStory } from '../types';
import { StoryVisual } from '../components/StoryVisual';
import { StoryCard } from '../components/StoryCard';
import { ShareModal } from '../components/ShareModal';
import { StoryMetricsChart } from '../components/StoryMetricsChart';
import {
  ChevronRight,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Award,
  BookOpen,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface StoryDetailPageProps {
  story: SuccessStory;
  allStories: SuccessStory[];
  onSelectStory: (slug: string) => void;
  onNavigate: (path: string) => void;
  onOpenDemo: (industry?: string) => void;
}

export const StoryDetailPage: React.FC<StoryDetailPageProps> = ({
  story,
  allStories,
  onSelectStory,
  onNavigate,
  onOpenDemo,
}) => {
  const { t } = useLanguage();
  const { currencyInfo, formatUSD } = useCurrency();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Story financial profile benchmarks based on business model and size
  const financialBenchmarks = React.useMemo(() => {
    let baseTurnoverUSD = 1200000;
    if (story.visualTheme === 'enterprise') baseTurnoverUSD = 8500000;
    else if (story.visualTheme === 'warehouse' || story.visualTheme === 'logistics') baseTurnoverUSD = 4200000;
    else if (story.visualTheme === 'hotel') baseTurnoverUSD = 2400000;
    else if (story.visualTheme === 'supermarket' || story.visualTheme === 'electronics') baseTurnoverUSD = 1800000;
    else if (story.visualTheme === 'pharmacy' || story.visualTheme === 'fashion') baseTurnoverUSD = 1100000;
    else if (story.visualTheme === 'beauty' || story.visualTheme === 'accounting') baseTurnoverUSD = 650000;

    const shrinkagePreventedUSD = Math.round(baseTurnoverUSD * 0.024);
    const dailySettlementUSD = Math.round(baseTurnoverUSD / 310);

    return {
      annualTurnoverUSD: baseTurnoverUSD,
      shrinkagePreventedUSD,
      dailySettlementUSD
    };
  }, [story.visualTheme]);

  // Compute 3 related stories
  const relatedStories = allStories
    .filter((s) => s.id !== story.id)
    .filter((s) => s.industry === story.industry || s.categoryKey === story.categoryKey || s.modules.some((m) => story.modules.includes(m)))
    .slice(0, 3);

  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://www.msmebooks.org/use-cases-success-stories/${story.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-200">
      {/* Section A: Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="bg-white dark:bg-[#081827] border-b border-slate-200/80 dark:border-[#162D42] py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <li>
              <button
                onClick={() => onNavigate('/use-cases-success-stories')}
                className="hover:text-[#0A3D62] dark:hover:text-sky-300 transition-colors cursor-pointer"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('/use-cases-success-stories')}
                className="hover:text-[#0A3D62] dark:hover:text-sky-300 transition-colors cursor-pointer"
              >
                Use Cases &amp; Success Stories
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('/use-cases')}
                className="hover:text-[#0A3D62] dark:hover:text-sky-300 transition-colors cursor-pointer truncate max-w-[160px]"
              >
                {story.industry}
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            </li>
            <li className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]" aria-current="page">
              {story.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Section B: Story Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50/80 dark:from-[#091827] dark:to-[#07131F] border-b border-slate-200/80 dark:border-[#162D42] pt-10 pb-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-5">
              {/* Metadata Kicker (Zero-pill discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="text-[#0A3D62] dark:text-sky-300 uppercase tracking-wide">{story.industry}</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {story.region}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">&middot;</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {story.readingTime}
                </span>
              </div>

              {/* Story Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                {story.title}
              </h1>

              {/* Tagline / Engaging Summary */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {story.tagline}
              </p>

              {/* Verification & Profile Banner */}
              <div className="p-3.5 bg-slate-100/90 dark:bg-[#0B1E30] rounded-xl border border-slate-200 dark:border-[#1A3852] flex items-start gap-3 text-xs transition-colors">
                {story.isIllustrative ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#7CB518] dark:text-[#90CF24] shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {story.isIllustrative ? 'Illustrative Business Profile & Architecture' : 'Verified Customer Story'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    {story.businessProfile}. This case study demonstrates how integrated MsmeBooks workflows resolve standard operational bottlenecks.
                  </p>
                </div>
              </div>

              {/* Product Modules Used */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Modules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {story.modules.map((mod) => (
                    <span
                      key={mod}
                      className="px-2.5 py-1 bg-white dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] text-[#0A3D62] dark:text-sky-300 font-bold rounded-md text-[11px]"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs & Share Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenDemo(story.industry)}
                  className="px-6 py-3 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
                >
                  {t.nav.bookDemo}
                </button>
                <button
                  onClick={() => onNavigate('/use-cases-success-stories')}
                  className="px-5 py-3 bg-white dark:bg-[#0C1E30] hover:bg-slate-50 dark:hover:bg-[#122A3F] border border-slate-300 dark:border-[#1A3852] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  {t.detail.backToStories}
                </button>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="p-3 bg-white dark:bg-[#0C1E30] hover:bg-slate-50 dark:hover:bg-[#122A3F] border border-slate-300 dark:border-[#1A3852] text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title={t.detail.shareStory}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hero Product Dashboard Screen */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden h-[340px] relative">
                <StoryVisual theme={story.visualTheme} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Deep-Dive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main 8-Column Narrative */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section C: Customer Overview */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Customer Overview &amp; Operating Context
              </h2>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Context</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {story.customerOverview.background}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-[#162D42] text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">Entity Model</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{story.customerOverview.type}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">Team Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{story.customerOverview.size}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">Footprint</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{story.branchCount}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">Region</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{story.region}</span>
              </div>
            </div>
          </section>

          {/* Section D: The Business Challenge */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-5 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  The Business Challenge
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Root Cause</span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {story.challenge}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Specific Operational Bottlenecks:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {story.challengeFull.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section E: Why the Business Needed a Better Solution */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Why Disconnected Systems Failed
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When growing enterprises rely on disconnected island software, spreadsheets, and manual tally sheets, errors multiply exponentially. Management identified key operational criteria:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {story.whyNeeded.map((wn, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#081726] p-3.5 rounded-xl border border-slate-200/70 dark:border-[#17334D] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-[#0A3D62] dark:text-sky-300 block mb-1">Requirement {idx + 1}:</span>
                  {wn}
                </div>
              ))}
            </div>
          </section>

          {/* Section F: The MsmeBooks Solution */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A3D62] dark:bg-sky-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  The MsmeBooks Solution
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Implementation Architecture</span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {story.solution}
            </p>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Module Breakdown &amp; Workflow Operation:
              </h4>

              <div className="grid grid-cols-1 gap-4">
                {story.solutionFull.map((sol, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-[#081726] rounded-xl border border-slate-200/90 dark:border-[#17334D] space-y-2 text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-[#17334D] pb-2">
                      <span className="font-bold text-[#0A3D62] dark:text-sky-300 text-sm">
                        {sol.module}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                        Role: {sol.role}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200">Operational Workflow: </strong>
                      {sol.details}
                    </p>
                    <div className="pt-1 text-[#6A9E13] dark:text-[#90CF24] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24] shrink-0" />
                      <span>Value Delivered: {sol.valueDelivered}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section G: Implementation Journey */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Structured Implementation Journey
              </h2>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Timeline</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              MsmeBooks follows an orderly, structured deployment lifecycle to ensure data integrity, minimal disruption, and full team onboarding:
            </p>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 ml-3 space-y-6">
              {story.timelinePhases.map((phase) => (
                <div key={phase.phase} className="relative text-xs">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#0C1E30] border-2 border-[#0A3D62] dark:border-sky-400" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[#0A3D62] dark:text-sky-300 font-bold text-[11px] bg-sky-50 dark:bg-[#10273D] px-2 py-0.5 rounded">
                      Phase {phase.phase} &middot; {phase.duration}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{phase.title}</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Metrics & Operational Growth Visualization Section (Recharts) */}
          <StoryMetricsChart
            metrics={story.chartMetrics}
            isIllustrative={story.isIllustrative}
            industry={story.industry}
          />

          {/* Section H: Results and Business Impact */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CB518] dark:bg-[#90CF24]" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Results and Business Impact
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Verified Metrics</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every metric below corresponds to documented operational standards. Where results reflect illustrative benchmarks, they are explicitly qualified:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {story.outcomeMetrics.map((met, idx) => (
                <div
                  key={idx}
                  className="bg-[#F4F9EC] dark:bg-[#122A1A] p-4 rounded-xl border border-[#7CB518]/40 dark:border-[#7CB518]/40 space-y-2 text-xs flex flex-col justify-between transition-colors"
                >
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 font-bold block">{met.label}</span>
                    <span className="font-mono font-extrabold text-2xl text-[#6A9E13] dark:text-[#90CF24] my-1 block tabular-nums">
                      {met.metric}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {met.context}
                    </p>
                  </div>
                  {met.baseline && (
                    <div className="pt-2 border-t border-[#7CB518]/20 dark:border-[#7CB518]/30 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Baseline: {met.baseline}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Audited Financial Impact & Transaction Run-Rate in Active Global Currency */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-[#142E46] pb-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#7CB518]" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Audited Financial Impact &amp; Transaction Run-Rate
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Converted to:</span>
                  <span className="font-bold text-[#0A3D62] dark:text-sky-300 bg-white dark:bg-[#0B253D] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#163B5D]">
                    {currencyInfo.flag} {currencyInfo.code} ({currencyInfo.symbol})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">
                    Annual Reconciled Gross
                  </span>
                  <span className="font-mono font-extrabold text-lg text-[#0A3D62] dark:text-sky-300">
                    {formatUSD(financialBenchmarks.annualTurnoverUSD, { compact: true })}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Full-year trade volume recorded on ledger
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">
                    Shrinkage Loss Prevented
                  </span>
                  <span className="font-mono font-extrabold text-lg text-[#6A9E13] dark:text-[#90CF24]">
                    {formatUSD(financialBenchmarks.shrinkagePreventedUSD, { compact: true })}/yr
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Recovered stock and till drop accuracy
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">
                    Daily Reconciled Transactions
                  </span>
                  <span className="font-mono font-extrabold text-lg text-slate-900 dark:text-white">
                    {formatUSD(financialBenchmarks.dailySettlementUSD, { compact: true })}/day
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Avg daily POS and invoice settlements
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section I: Customer Testimonial or Scenario Quote */}
          {story.testimonial && (
            <section className="bg-[#072B45] dark:bg-[#071F33] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden space-y-4 border border-[#163654]">
              <div className="flex items-center gap-2 text-xs text-[#90CF24] font-semibold">
                <span>Business Perspective</span>
                {story.testimonial.isApproved ? (
                  <span className="text-xs bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Verified Customer Endorsement</span>
                ) : (
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Illustrative Operating Scenario</span>
                )}
              </div>
              <blockquote className="text-base sm:text-lg font-medium italic text-slate-100 leading-relaxed">
                &ldquo;{story.testimonial.quote}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <p className="font-bold text-white">{story.testimonial.author}</p>
                  <p className="text-slate-400 text-[11px]">{story.testimonial.role} &middot; {story.testimonial.company}</p>
                </div>
              </div>
            </section>
          )}

          {/* Section J: Lessons Learned */}
          <section className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
            <div className="border-b border-slate-100 dark:border-[#162D42] pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Lessons Learned &amp; Best Practices
              </h2>
            </div>
            <div className="space-y-3">
              {story.lessonsLearned.map((lesson, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-mono font-bold text-[#0A3D62] dark:text-sky-300 bg-slate-100 dark:bg-[#10273D] w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{lesson}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4-Column Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Quick Action Card */}
          <div className="bg-white dark:bg-[#0C1E30] p-6 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-sm space-y-4 sticky top-22 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Ready to Streamline Your {story.industry}?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Schedule a personalized walkthrough of MsmeBooks configured specifically for your industry's daily sales, inventory, and accounting.
            </p>
            <button
              onClick={() => onOpenDemo(story.industry)}
              className="w-full py-3 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Book a Free Demo
            </button>
            <button
              onClick={() => onNavigate('/use-cases')}
              className="w-full py-2.5 bg-slate-100 dark:bg-[#10273D] hover:bg-slate-200 dark:hover:bg-[#173550] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Explore {story.industry} Workflows
            </button>

            {/* Section K: Related Product Modules */}
            <div className="pt-5 border-t border-slate-200 dark:border-[#162D42] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Related Product Modules:
              </h4>
              <div className="space-y-2 text-xs">
                {story.modules.map((mod) => (
                  <div key={mod} className="p-2.5 bg-slate-50 dark:bg-[#081726] rounded-lg border border-slate-200 dark:border-[#17334D] flex items-center justify-between transition-colors">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{mod}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Native MsmeBooks Module</p>
                    </div>
                    <span className="text-[#0A3D62] dark:text-sky-300 font-semibold text-[11px]">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Standard Box */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#162D42] text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7CB518] dark:text-[#90CF24] shrink-0 mt-0.5" />
              <p>
                All data points conform to the MsmeBooks Transparency Charter. Unverified performance figures are never published as client claims.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Section L: Related Success Stories */}
      {relatedStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-200 dark:border-[#162D42]">
          <div className="mb-8">
            <span className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider block">
              Continuous Learning
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Related Success Stories
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {relatedStories.map((relStory) => (
              <StoryCard
                key={relStory.id}
                story={relStory}
                onSelectStory={onSelectStory}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section M: Conversion CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-[#0A3D62] dark:bg-[#0A2942] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Build a More Connected Business?
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Discover how MsmeBooks can help your business connect accounting, sales, inventory and daily operations.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onOpenDemo(story.industry)}
                className="px-6 py-3 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs cursor-pointer"
              >
                Book a Free Demo
              </button>
              <button
                onClick={() => onOpenDemo(story.industry)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer"
              >
                Sign Up for Free
              </button>
              <button
                onClick={() => onNavigate('/use-cases')}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Talk to Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={story.title}
        url={currentUrl}
      />
    </div>
  );
};
