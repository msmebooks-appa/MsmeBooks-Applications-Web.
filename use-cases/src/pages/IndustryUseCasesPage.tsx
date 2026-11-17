import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { INDUSTRY_USE_CASES } from '../data/industries';
import { SuccessStory } from '../types';
import { StoryCard } from '../components/StoryCard';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  Building,
  Activity,
  FileSpreadsheet,
  Search,
  Tag,
  Briefcase,
  Truck,
  ShoppingCart,
  UtensilsCrossed,
  Network,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface IndustryTag {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  industryIds: string[];
  description: string;
}

const CATEGORY_TAGS: IndustryTag[] = [
  {
    id: 'all',
    label: 'All Industries',
    shortLabel: 'All',
    icon: Layers,
    industryIds: [
      'retail',
      'restaurants',
      'hotels',
      'wholesale',
      'accounting',
      'fashion',
      'electronics',
      'pharmacies',
      'beauty',
      'manufacturing',
      'logistics',
      'professional',
      'education',
      'realestate',
      'ecommerce',
      'multibranch'
    ],
    description: 'All 17 MSME operational blueprints'
  },
  {
    id: 'retail',
    label: 'Retail & Commerce',
    shortLabel: 'Retail',
    icon: ShoppingCart,
    industryIds: ['retail', 'fashion', 'electronics', 'pharmacies', 'beauty', 'ecommerce'],
    description: 'Supermarkets, fashion, consumer electronics, pharmacies & web shops'
  },
  {
    id: 'logistics',
    label: 'Logistics & Supply Chain',
    shortLabel: 'Logistics',
    icon: Truck,
    industryIds: ['logistics', 'wholesale', 'manufacturing'],
    description: 'Commercial fleet transport, wholesale depots & production facilities'
  },
  {
    id: 'services',
    label: 'Services & Advisory',
    shortLabel: 'Services',
    icon: Briefcase,
    industryIds: ['accounting', 'professional', 'education', 'realestate'],
    description: 'Accounting firms, consulting practices, schools & property managers'
  },
  {
    id: 'hospitality',
    label: 'Hospitality & Dining',
    shortLabel: 'Hospitality',
    icon: UtensilsCrossed,
    industryIds: ['restaurants', 'hotels'],
    description: 'Table service dining, cafes, boutique hotels & conference lodges'
  },
  {
    id: 'multibranch',
    label: 'Multi-Branch Enterprises',
    shortLabel: 'Multi-Branch',
    icon: Network,
    industryIds: ['multibranch', 'wholesale', 'retail'],
    description: 'Multi-outlet businesses with central purchasing & consolidation'
  }
];

interface IndustryUseCasesPageProps {
  stories: SuccessStory[];
  onSelectStory: (slug: string) => void;
  onNavigate: (path: string) => void;
  onOpenDemo: (industry?: string) => void;
}

export const IndustryUseCasesPage: React.FC<IndustryUseCasesPageProps> = ({
  stories,
  onSelectStory,
  onNavigate,
  onOpenDemo,
}) => {
  const { t } = useLanguage();
  const [selectedTagId, setSelectedTagId] = useState<string>('all');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('retail');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Tag Object
  const activeTag = useMemo(() => {
    return CATEGORY_TAGS.find((t) => t.id === selectedTagId) || CATEGORY_TAGS[0];
  }, [selectedTagId]);

  // Filtered industries according to tag and keyword search
  const filteredIndustries = useMemo(() => {
    return INDUSTRY_USE_CASES.filter((ind) => {
      // Tag filter
      if (selectedTagId !== 'all') {
        if (!activeTag.industryIds.includes(ind.id)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ind.name.toLowerCase().includes(q);
        const matchesDesc = ind.shortDesc.toLowerCase().includes(q) || ind.heroSummary.toLowerCase().includes(q);
        const matchesChallenges = ind.commonChallenges.some((c) => c.toLowerCase().includes(q));
        const matchesModules = ind.msmeModules.some((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesChallenges && !matchesModules) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTagId, activeTag, searchQuery]);

  // Ensure activeIndustry is always valid within filtered list if possible
  const activeIndustry = useMemo(() => {
    const found = filteredIndustries.find((ind) => ind.id === selectedIndustryId);
    if (found) return found;
    return filteredIndustries[0] || INDUSTRY_USE_CASES[0];
  }, [filteredIndustries, selectedIndustryId]);

  // Matching Success Stories for the selected tag category
  const matchingCategoryStories = useMemo(() => {
    if (selectedTagId === 'all') {
      return stories.slice(0, 3);
    }

    return stories.filter((story) => {
      return activeTag.industryIds.includes(story.categoryKey) ||
        activeTag.industryIds.some((id) => story.industry.toLowerCase().includes(id));
    });
  }, [stories, selectedTagId, activeTag]);

  // Representative single story for the active industry
  const matchingSingleStory = useMemo(() => {
    return stories.find((s) => s.slug === activeIndustry.relevantStorySlug || s.categoryKey === activeIndustry.id);
  }, [stories, activeIndustry]);

  const handleTagClick = (tagId: string) => {
    setSelectedTagId(tagId);
    const tag = CATEGORY_TAGS.find((t) => t.id === tagId);
    if (tag && tag.industryIds.length > 0) {
      // If the current selected industry is not in this tag, pick the first one
      if (!tag.industryIds.includes(selectedIndustryId)) {
        setSelectedIndustryId(tag.industryIds[0]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* 1. Hero Header */}
      <section className="bg-white dark:bg-[#091827] border-b border-slate-200/80 dark:border-[#162D42] pt-10 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider">Industry Solutions</span>
            <span aria-hidden="true">&middot;</span>
            <span>Tailored Operational Workflows</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#6A9E13] dark:text-[#90CF24] font-semibold">{filteredIndustries.length} Sectors Available</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            MsmeBooks Configured for Your Specific Industry
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Every business type has distinct operating realities. Filter by category tags like <strong>Retail</strong>, <strong>Logistics</strong>, or <strong>Services</strong> to explore how MsmeBooks unites point of sale, stock tracking, and accounting for your exact model.
          </p>

          <div className="pt-1 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenDemo(activeIndustry.name)}
              className="px-5 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Request {activeIndustry.name} Demo
            </button>
            <button
              onClick={() => onNavigate('/use-cases-success-stories')}
              className="px-4 py-2.5 bg-slate-100 dark:bg-[#0C1E30] hover:bg-slate-200 dark:hover:bg-[#122A3F] text-slate-700 dark:text-slate-200 border border-transparent dark:border-[#1A3852] text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse All Customer Stories
            </button>
          </div>
        </div>
      </section>

      {/* 2. Tag-Based Filtering Bar at the Top */}
      <section className="bg-slate-100/80 dark:bg-[#081827]/90 border-b border-slate-200 dark:border-[#162D42] py-4 sticky top-18 z-30 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Tag Buttons Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mr-1 hidden sm:flex">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Categories:</span>
              </span>

              {CATEGORY_TAGS.map((tag) => {
                const isSelected = selectedTagId === tag.id;
                const IconComponent = tag.icon;
                const count = tag.id === 'all'
                  ? INDUSTRY_USE_CASES.length
                  : INDUSTRY_USE_CASES.filter((ind) => tag.industryIds.includes(ind.id)).length;

                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A3D62] dark:bg-[#0E4B77] text-white shadow-xs'
                        : 'bg-white dark:bg-[#0C1E30] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-[#1A3852] hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#90CF24]' : 'text-slate-400'}`} />
                    <span>{tag.shortLabel}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-[#122A3F] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.useCasesPage.searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Active Tag Context Strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5 truncate">
              <strong className="text-slate-700 dark:text-slate-300">{activeTag.label}:</strong> {activeTag.description}
            </span>
            <span className="font-mono text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline">
              {filteredIndustries.length} industries found
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Left Selector + Right Deep Dive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation: Industry Selector Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0C1E30] rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs p-4 sticky top-40 space-y-2 transition-colors">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-[#162D42] mb-2 flex items-center justify-between">
              <span>{activeTag.shortLabel} Industries</span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {filteredIndustries.length} total
              </span>
            </div>

            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
              {filteredIndustries.map((ind) => {
                const isCurrent = ind.id === activeIndustry.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustryId(ind.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0A3D62] dark:bg-[#0E4B77] text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#122A3F]'
                    }`}
                  >
                    <span className="truncate pr-2">{ind.name}</span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isCurrent ? 'translate-x-1 text-[#90CF24]' : 'opacity-30'
                      }`}
                    />
                  </button>
                );
              })}

              {filteredIndustries.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
                  <p>No industries match your search in this category.</p>
                  <button
                    onClick={() => {
                      setSelectedTagId('all');
                      setSearchQuery('');
                    }}
                    className="text-[#0A3D62] dark:text-sky-300 font-bold underline cursor-pointer"
                  >
                    View All Industries
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Main Panel: Comprehensive Industry Blueprint */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Industry Overview & Hero Summary */}
            <div className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162D42] pb-3">
                <span className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider">
                  Operational Blueprint
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  Tag: {activeTag.shortLabel}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeIndustry.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeIndustry.heroSummary}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeIndustry.shortDesc}
              </p>
            </div>

            {/* 2. Common Challenges vs Relevant MsmeBooks Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Industry Challenges */}
              <div className="bg-white dark:bg-[#0C1E30] p-6 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-3 transition-colors">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Common Operating Challenges
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {activeIndustry.commonChallenges.map((ch, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Business Benefits */}
              <div className="bg-white dark:bg-[#0C1E30] p-6 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-3 transition-colors">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7CB518] dark:bg-[#90CF24]" />
                  Expected Business Benefits
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {activeIndustry.expectedBenefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24] mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Relevant MsmeBooks Modules & Highlights */}
            <div className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Core Modules Supporting This Sector
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeIndustry.msmeModules.map((mod, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-[#081726] rounded-xl border border-slate-200/80 dark:border-[#17334D] space-y-1.5 text-xs transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0A3D62] dark:text-sky-300 text-sm">{mod.name}</span>
                      <span className="text-[10px] font-mono text-[#6A9E13] dark:text-[#90CF24] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {mod.highlight}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{mod.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Example Daily Workflows */}
            <div className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-5 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162D42] pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  A Typical Day in {activeIndustry.name} with MsmeBooks
                </h3>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Daily Lifecycle</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeIndustry.dailyWorkflows.map((flow, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/80 dark:bg-[#081726] rounded-xl border border-slate-200 dark:border-[#17334D] space-y-1.5 text-xs transition-colors">
                    <span className="font-mono font-bold text-[#0A3D62] dark:text-sky-300 text-[11px] bg-white dark:bg-[#0E283F] px-2 py-0.5 rounded border border-slate-200 dark:border-[#17334D] inline-block">
                      {flow.time} &middot; {flow.step}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{flow.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Practical Use-Case Scenarios */}
            <div className="bg-white dark:bg-[#0C1E30] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-4 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Practical Real-World Scenarios
              </h3>
              <div className="space-y-4">
                {activeIndustry.practicalScenarios.map((sc, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-[#17334D] bg-slate-50 dark:bg-[#081726] space-y-2 text-xs transition-colors">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sc.scenarioTitle}</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-700 dark:text-slate-200">Situation: </strong>
                      {sc.situation}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-700 dark:text-slate-200">MsmeBooks Action: </strong>
                      {sc.msmeAction}
                    </p>
                    <p className="text-[#6A9E13] dark:text-[#90CF24] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Impact: {sc.impact}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Relevant Customer Story Card if exists */}
            {matchingSingleStory && (
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="bg-[#F4F9EC] dark:bg-[#122A1A] p-6 rounded-2xl border border-[#7CB518]/50 dark:border-[#7CB518]/50 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A9E13] dark:text-[#90CF24] block">
                    Representative Case Study for {activeIndustry.name}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {matchingSingleStory.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md line-clamp-1">
                    {matchingSingleStory.challenge}
                  </p>
                </div>
                <button
                  onClick={() => onSelectStory(matchingSingleStory.slug)}
                  className="px-4 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Read Case Study &rarr;
                </button>
              </motion.div>
            )}

            {/* 7. Conversion CTA */}
            <div className="bg-[#0A3D62] dark:bg-[#0A2942] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">See MsmeBooks for {activeIndustry.name}</h3>
                <p className="text-xs text-slate-200 mt-1">
                  Book a walkthrough tailored to your inventory, point of sale, and branch network.
                </p>
              </div>
              <button
                onClick={() => onOpenDemo(activeIndustry.name)}
                className="px-5 py-2.5 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] text-xs font-bold rounded-lg shrink-0 cursor-pointer whitespace-nowrap"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Matching Stories for the Selected Category Tag */}
        {matchingCategoryStories.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-[#162D42] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24]" />
                  <span>Category Showcase: {activeTag.label}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Related Success Stories in {activeTag.shortLabel}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/use-cases-success-stories')}
                className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>View All Success Stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {matchingCategoryStories.map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.05, 0.2), ease: 'easeOut' }}
                  className="h-full flex flex-col"
                >
                  <StoryCard
                    story={story}
                    onSelectStory={onSelectStory}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
