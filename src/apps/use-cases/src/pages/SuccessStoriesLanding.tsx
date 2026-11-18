import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SuccessStory } from '../types';
import { INDUSTRY_CATEGORIES } from '../data/industries';
import { StoryCard } from '../components/StoryCard';
import { StoryVisual } from '../components/StoryVisual';
import {
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin,
  Layers,
  Sparkles,
  BookOpen,
  X,
  TrendingUp,
  CreditCard,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { matchesStoryQuery } from '../utils/storySearch';

interface SuccessStoriesLandingProps {
  stories: SuccessStory[];
  onSelectStory: (slug: string) => void;
  onNavigate: (path: string) => void;
  onOpenDemo: (industry?: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const SuccessStoriesLanding: React.FC<SuccessStoriesLandingProps> = ({
  stories,
  onSelectStory,
  onNavigate,
  onOpenDemo,
  searchQuery: controlledSearchQuery,
  onSearchChange,
}) => {
  const { t } = useLanguage();
  const { currencyInfo, formatUSD } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const activeSearchQuery =
    controlledSearchQuery !== undefined ? controlledSearchQuery : internalSearchQuery;

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
    setVisibleCount(9);
  };

  // Marquee featured story (first featured or first story)
  const marqueeStory = useMemo(() => {
    return stories.find((s) => s.featured && s.status === 'published') || stories[0];
  }, [stories]);

  // Filtered stories logic
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Must be published or draft if in preview
      if (story.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = INDUSTRY_CATEGORIES.find((c) => c.key === selectedCategory);
        if (catObj && !story.industry.toLowerCase().includes(catObj.name.toLowerCase()) && story.categoryKey !== selectedCategory) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion !== 'all') {
        if (!story.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }

      // Business size filter
      if (selectedSize !== 'all') {
        if (!story.businessSize.toLowerCase().includes(selectedSize.toLowerCase())) {
          return false;
        }
      }

      // Search query (company name, industry, challenge, solution, modules, keywords)
      if (activeSearchQuery.trim() && !matchesStoryQuery(story, activeSearchQuery)) {
        return false;
      }

      return true;
    });
  }, [stories, selectedCategory, activeSearchQuery, selectedRegion, selectedSize]);

  const displayedStories = filteredStories.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* 1. Hero Section (Section 4) */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50 dark:from-[#091827] dark:via-[#071421] dark:to-[#07131F] border-b border-slate-200/80 dark:border-[#162D42] pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Subtle Brand Ambient Backing */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0A3D62]/5 dark:bg-[#0A3D62]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#7CB518]/10 dark:bg-[#7CB518]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet Editorial Kicker (Zero-Pill discipline: unboxed text with dot separator) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="text-[#0A3D62] dark:text-sky-300 font-bold tracking-wide uppercase">MsmeBooks Insights &middot; Field Studies</span>
                <span aria-hidden="true">&middot;</span>
                <span className="text-slate-500 dark:text-slate-400">12 Industry Profiles</span>
              </div>

              {/* Master Headline (Exact prompt recommended copy) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
                Real Businesses. Real Challenges.{' '}
                <span className="text-[#0A3D62] dark:text-sky-400">Smarter Growth</span> with{' '}
                <span className="relative whitespace-nowrap">
                  <span className="text-[#0A3D62] dark:text-sky-400">Msme</span><span className="text-[#7CB518] dark:text-[#90CF24]">Books</span>
                </span>.
              </h1>

              {/* Supporting Text (Exact prompt copy) */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Discover how businesses use MsmeBooks to simplify accounting, manage inventory, streamline sales, connect operations and make smarter decisions from one integrated business management platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#story-grid"
                  className="px-6 py-3 text-sm font-bold text-white bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  {t.nav.stories}
                </a>
                <button
                  onClick={() => onOpenDemo()}
                  className="px-6 py-3 text-sm font-bold text-[#072B45] bg-[#7CB518] hover:bg-[#90CF24] rounded-lg transition-all shadow-xs hover:shadow cursor-pointer whitespace-nowrap"
                >
                  {t.nav.bookDemo}
                </button>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0A3D62] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t.nav.useCases}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators Strip */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-[#162D42] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7CB518] dark:text-[#90CF24]" />
                  <span>Strict Verification Standards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#0A3D62] dark:text-sky-300" />
                  <span>Multi-Branch &amp; Single-Store Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Pan-African &amp; Global Compliance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Live Story Spotlight */}
            {marqueeStory && (
              <div className="lg:col-span-5">
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
                  className="bg-white dark:bg-[#0C1E30] rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-lg hover:shadow-xl dark:shadow-black/50 transition-all p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#162D42] text-xs">
                    <span className="font-bold text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider text-[11px]">
                      Spotlight Story
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{marqueeStory.industry}</span>
                  </div>

                  {/* Visual Dashboard Screen */}
                  <div className="h-44 w-full rounded-xl overflow-hidden mb-4 border border-slate-200/80 dark:border-[#1A3852] shadow-xs">
                    <StoryVisual theme={marqueeStory.visualTheme} compact />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                    {marqueeStory.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {marqueeStory.challenge}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#162D42]">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {marqueeStory.branchCount}
                    </span>
                    <button
                      onClick={() => onSelectStory(marqueeStory.slug)}
                      className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 hover:text-[#072B45] dark:hover:text-sky-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1.5 Global Platform Revenue & Transaction Throughput Strip */}
      <section className="relative -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="bg-white dark:bg-[#0C1E30] rounded-2xl border border-slate-200/90 dark:border-[#1A3852] shadow-xl p-5 sm:p-6 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-[#162D42]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CB518] animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Audited Platform Revenue &amp; Operational Throughput
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="text-slate-400">Active Currency:</span>
              <span className="font-bold text-[#0A3D62] dark:text-sky-300 bg-sky-50 dark:bg-[#10273D] px-2 py-0.5 rounded border border-sky-100 dark:border-[#163654] flex items-center gap-1">
                <span>{currencyInfo.flag}</span>
                <span>{currencyInfo.code}</span>
                <span>({currencyInfo.symbol})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                &middot; 1 USD = {currencyInfo.ratePerUSD.toLocaleString('en-US', { maximumFractionDigits: currencyInfo.decimals > 0 ? 2 : 0 })} {currencyInfo.symbol}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Annual Reconciled Revenue */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081726] border border-slate-200/80 dark:border-[#17334D] space-y-1 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[11px]">Reconciled Annual Revenue</span>
                <TrendingUp className="w-4 h-4 text-[#7CB518]" />
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A3D62] dark:text-sky-300 tabular-nums">
                {formatUSD(3100000, { compact: true })}+
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Audited gross trade volume reconciled across 17 commercial sectors
              </p>
            </div>

            {/* Card 2: Daily Transaction Volume */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081726] border border-slate-200/80 dark:border-[#17334D] space-y-1 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[11px]">Daily Transaction Flow</span>
                <CreditCard className="w-4 h-4 text-sky-500" />
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A3D62] dark:text-sky-300 tabular-nums">
                {formatUSD(92000, { compact: true })}/day
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Over 124,500+ successful POS checkout slips, waybills &amp; folio bills
              </p>
            </div>

            {/* Card 3: Average Annual MSME Cost Recovered */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081726] border border-slate-200/80 dark:border-[#17334D] space-y-1 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[11px]">Average MSME Savings</span>
                <ShieldCheck className="w-4 h-4 text-[#7CB518]" />
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#6A9E13] dark:text-[#90CF24] tabular-nums">
                {formatUSD(18400, { compact: true })}/yr
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Contained inventory shrinkage &amp; eradicated manual overtime
              </p>
            </div>

            {/* Card 4: Active Commercial Enterprises */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081726] border border-slate-200/80 dark:border-[#17334D] space-y-1 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[11px]">Live Operating Outlets</span>
                <Building className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                2,400+
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Operating across Pan-African and international trading corridors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Industry Category Navigation & Dynamic Filter Bar (Section 5) */}
      <section id="story-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="space-y-6">
          {/* Section Header & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider mb-1">
                Curated Case Studies &amp; Scenarios
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Explore Success Stories by Industry
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{filteredStories.length}</span> verified and illustrative business profiles
            </div>
          </div>

          {/* Horizontal Scrollable Category Filter (Section 5 requirement) */}
          <div className="relative border-b border-slate-200 dark:border-[#162D42] pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {INDUSTRY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setVisibleCount(9);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0A3D62] dark:bg-[#0E4B77] text-white shadow-xs font-bold'
                        : 'bg-white dark:bg-[#0C1E30] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-[#1A3852] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prominent Search Bar (Search by Company Name, Industry, or Key Challenges) */}
          <div className="bg-white dark:bg-[#0C1E30] p-5 rounded-2xl border border-slate-200/90 dark:border-[#1A3852] shadow-sm space-y-3.5 transition-colors">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              {/* Main Search Input */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#0A3D62] dark:text-sky-300 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={activeSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-sky-400 focus:bg-white dark:focus:bg-[#081726] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
                {activeSearchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Operating Region Filter */}
              <div className="w-full md:w-56 shrink-0">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                >
                  <option value="all">All Operating Regions</option>
                  <option value="west africa">West Africa (Nigeria, Ghana, Côte d'Ivoire)</option>
                  <option value="east africa">East Africa (Kenya, Rwanda, Tanzania)</option>
                  <option value="southern africa">Southern Africa (South Africa, Zambia)</option>
                  <option value="pan-african">Pan-African Hubs</option>
                  <option value="global">Global &amp; Omnichannel</option>
                </select>
              </div>

              {/* Business Size Filter */}
              <div className="w-full md:w-52 shrink-0">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                >
                  <option value="all">All Business Sizes</option>
                  <option value="small">Small Enterprises (10-49 staff)</option>
                  <option value="medium">Medium Enterprises (50-120 staff)</option>
                  <option value="multi-branch">Multi-branch Outlets</option>
                </select>
              </div>
            </div>

            {/* Quick Suggestion Tags & Result Count */}
            <div className="flex items-center flex-wrap gap-2 text-xs pt-1 border-t border-slate-100 dark:border-[#162D42]">
              <span className="text-slate-400 dark:text-slate-500 font-semibold text-[11px] mr-1">Quick Filters:</span>
              {[
                { label: 'Supermarkets', query: 'Supermarket' },
                { label: 'Restaurant Inventory', query: 'Restaurant' },
                { label: 'Multi-Warehouse', query: 'Warehouse' },
                { label: 'Accounting Practice', query: 'Accounting' },
                { label: 'Stock Discrepancies', query: 'Discrepancy' },
                { label: 'FEFO Drug Expiry', query: 'Expiry' },
                { label: 'Fleet Haulage', query: 'Logistics' },
                { label: 'Multi-Branch', query: 'Multi-branch' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSearchChange(item.query)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    activeSearchQuery.toLowerCase() === item.query.toLowerCase()
                      ? 'bg-[#0A3D62] dark:bg-[#0E4B77] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#10273D] hover:bg-[#F4F9EC] dark:hover:bg-[#153450] hover:text-[#0A3D62] dark:hover:text-sky-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {activeSearchQuery && (
                <div className="ml-auto flex items-center gap-2 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Found <strong className="text-slate-900 dark:text-white font-mono">{filteredStories.length}</strong> stories for &ldquo;{activeSearchQuery}&rdquo;
                  </span>
                  <button
                    onClick={() => handleSearchChange('')}
                    className="text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Success Stories Card Grid (Section 6) */}
        <div className="mt-8">
          {displayedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {displayedStories.map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.25), ease: 'easeOut' }}
                  className="h-full flex flex-col"
                >
                  <StoryCard
                    story={story}
                    onSelectStory={onSelectStory}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            /* Clear Empty State */
            <div className="py-16 text-center bg-white dark:bg-[#0C1E30] rounded-2xl border border-slate-200 dark:border-[#1A3852] p-8 space-y-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#081726] rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.hero.noResultsTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.hero.noResultsDesc}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleSearchChange('');
                  setSelectedRegion('all');
                  setSelectedSize('all');
                }}
                className="px-4 py-2 bg-[#0A3D62] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {t.hero.resetFilters}
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredStories.length > visibleCount && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-8 py-3 bg-white dark:bg-[#0C1E30] hover:bg-slate-50 dark:hover:bg-[#122A3F] text-[#0A3D62] dark:text-sky-300 font-bold text-xs sm:text-sm border border-slate-300 dark:border-[#1A3852] rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
              >
                Load More Stories ({filteredStories.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>

        {/* 4. Editorial Integrity Notice (Section 6 & 15 requirement) */}
        <div className="mt-16 bg-[#F4F9EC] dark:bg-[#112718] border border-[#7CB518]/40 dark:border-[#7CB518]/50 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs transition-colors">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#6A9E13] dark:text-[#90CF24] shrink-0" />
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 dark:text-white">
                Transparency &amp; Verification Protocol
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                MsmeBooks adheres strictly to authentic storytelling. Use case profiles clearly marked as "Illustrative" describe realistic operating configurations and expected outcomes until certified real-world customer testimonials receive formal publication clearance.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/customer-reviews')}
            className="text-[#0A3D62] dark:text-sky-300 hover:underline font-bold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Review Policy &rarr;
          </button>
        </div>

        {/* 5. Conversion CTA Banner (Section 7-M) */}
        <div className="mt-16 bg-[#0A3D62] dark:bg-[#0A2942] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <BookOpen className="w-80 h-80" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#90CF24] uppercase tracking-wider block">
              Take the Next Step
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Build a More Connected Business?
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Discover how MsmeBooks can help your business connect accounting, sales, inventory and daily operations from one intelligent, accessible platform.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onOpenDemo()}
                className="px-6 py-3 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs cursor-pointer"
              >
                Book a Free Demo
              </button>
              <button
                onClick={() => onOpenDemo()}
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
    </div>
  );
};
