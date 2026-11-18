import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Minus,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  ArrowRight,
  X,
  Filter,
  Zap,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { COMPARISON_CATEGORIES, PRICING_PLANS } from '../data/pricingData';
import { ComparisonFeature, Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface ComparisonTableProps {
  onSelectPlan: (planId: string) => void;
  currency?: Currency;
}

export type EditionGroup = 'all' | 'sme' | 'enterprise' | 'ultimate';

export interface EditionConfig {
  id: EditionGroup;
  title: string;
  shortTitle: string;
  badge: string;
  plans: string[];
  description: string;
  userRange: string;
}

export const COMPARISON_EDITIONS: EditionConfig[] = [
  {
    id: 'sme',
    title: 'Core SME Edition',
    shortTitle: 'Core SME',
    badge: 'Starter • Growth • Business',
    plans: ['starter', 'growth', 'business'],
    description: 'Essential digital bookkeeping, cloud POS, e-commerce sync, and customer records (1 - 3 Users).',
    userRange: '1 - 3 Users',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Edition',
    shortTitle: 'Enterprise',
    badge: 'Premium • Enterprise • Superior',
    plans: ['premium', 'enterprise', 'superior'],
    description: 'Multi-warehouse logistics, POS hardware terminal drivers, 5-10 store channels, and BI analytics (10 - 20 Users).',
    userRange: '10 - 20 Users',
  },
  {
    id: 'ultimate',
    title: 'Ultimate Edition',
    shortTitle: 'Ultimate',
    badge: 'Ultimate • Ultimate-Prime • Custom',
    plans: ['ultimate', 'ultimate_prime', 'custom'],
    description: 'Unlimited printing labels, multi-entity consolidation, 99.99% SLA, and dedicated ERP engineering (30 - 50+ Users).',
    userRange: '30 - 50+ Users',
  },
  {
    id: 'all',
    title: 'All 9 Plans',
    shortTitle: 'All 9 Plans',
    badge: 'Overview Matrix',
    plans: ['starter', 'growth', 'business', 'premium', 'enterprise', 'superior', 'ultimate', 'ultimate_prime', 'custom'],
    description: 'Complete comparative matrix across all 9 plans from Starter to Custom.',
    userRange: '1 - 50+ Users',
  },
];

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onSelectPlan, currency = 'NGN' }) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [planFilterGroup, setPlanFilterGroup] = useState<EditionGroup>('sme');
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);
  const [pinnedFeatures, setPinnedFeatures] = useState<string[]>(['Team User Licenses', 'Chart of Accounts', 'Automated Depreciations']);
  const [activeCategoryTooltip, setActiveCategoryTooltip] = useState<string | null>(null);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

  // Trigger brief skeleton loader on currency or edition group change
  useEffect(() => {
    setIsTableLoading(true);
    const timer = setTimeout(() => {
      setIsTableLoading(false);
    }, 380);
    return () => clearTimeout(timer);
  }, [currency, planFilterGroup]);

  const togglePinFeature = (featureName: string) => {
    setPinnedFeatures((prev) =>
      prev.includes(featureName) ? prev.filter((name) => name !== featureName) : [...prev, featureName]
    );
  };

  const toggleCategory = (catName: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    COMPARISON_CATEGORIES.forEach((cat) => {
      allCollapsed[cat.category] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  const currentEdition =
    COMPARISON_EDITIONS.find((e) => e.id === planFilterGroup) || COMPARISON_EDITIONS[0];

  // Determine active plan columns based on the 3 broken editions
  const activePlans = useMemo(() => {
    if (planFilterGroup === 'all') return PRICING_PLANS;
    const targetEdition = COMPARISON_EDITIONS.find((e) => e.id === planFilterGroup);
    if (!targetEdition) return PRICING_PLANS;
    return PRICING_PLANS.filter((plan) => targetEdition.plans.includes(plan.id));
  }, [planFilterGroup]);

  // Extract feature value for a specific plan
  const getFeatureValueForPlan = (feature: ComparisonFeature, planId: string): boolean | string | undefined => {
    if (feature[planId] !== undefined) return feature[planId];
    if (planId === 'ultimate_prime' && feature['mega_org'] !== undefined) return feature['mega_org'];
    return undefined;
  };

  // Determine if a feature is identical across all currently active plans
  const checkFeatureIdentical = (feature: ComparisonFeature, plans: typeof PRICING_PLANS): boolean => {
    if (plans.length <= 1) return false;
    const firstVal = getFeatureValueForPlan(feature, plans[0].id);
    return plans.every((p) => {
      const val = getFeatureValueForPlan(feature, p.id);
      return val === firstVal;
    });
  };

  // Determine if a specific cell represents an upgraded capability or unique selling point
  const checkIsUniqueSellingPoint = (
    feature: ComparisonFeature,
    planId: string,
    plans: typeof PRICING_PLANS
  ): boolean => {
    const currentVal = getFeatureValueForPlan(feature, planId);
    if (currentVal === undefined || currentVal === false) return false;

    // Check plan index in full tier order
    const planIndex = plans.findIndex((p) => p.id === planId);
    if (planIndex <= 0) {
      // First tier plan - only unique if no other plan has it
      const countOthersWithSameVal = plans.filter((p) => p.id !== planId && getFeatureValueForPlan(feature, p.id) === currentVal).length;
      return countOthersWithSameVal === 0;
    }

    // Check if lower tiers lacked this feature
    const prevLowerTiers = plans.slice(0, planIndex);
    const allLowerLackedIt = prevLowerTiers.every((lp) => {
      const lVal = getFeatureValueForPlan(feature, lp.id);
      return lVal === false || lVal === undefined;
    });

    if (allLowerLackedIt) {
      return true;
    }

    // Check if this tier has a top-tier keyword (e.g. "Unlimited", highest number)
    const currentStr = String(currentVal).toLowerCase();
    if (currentStr.includes('unlimited') || currentStr.includes('dedicated') || currentStr.includes('99.99%') || currentStr.includes('50+')) {
      const matchingCount = plans.filter((p) => String(getFeatureValueForPlan(feature, p.id)).toLowerCase() === currentStr).length;
      return matchingCount <= 2;
    }

    return false;
  };

  const renderValue = (
    val: boolean | string | undefined,
    isHighlight = false,
    isUniqueSellingPoint = false,
    isIdenticalRow = false
  ) => {
    if (val === undefined || val === false) {
      return (
        <div className="flex justify-center">
          <Minus className={`w-4 h-4 transition-colors ${
            isIdenticalRow && highlightDifferences
              ? 'text-slate-200 dark:text-slate-700'
              : 'text-slate-300 dark:text-slate-600'
          }`} />
        </div>
      );
    }

    if (val === true) {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-all ${
              isUniqueSellingPoint && highlightDifferences
                ? 'bg-[#84CC16] text-slate-950 ring-4 ring-[#84CC16]/40 scale-110 shadow-md shadow-lime-500/20'
                : isIdenticalRow && highlightDifferences
                ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                : 'bg-[#84CC16]/20 dark:bg-[#84CC16]/25 text-[#65A30D] dark:text-[#84CC16]'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          {isUniqueSellingPoint && highlightDifferences && (
            <span className="text-[9px] font-black uppercase text-[#0A4FD5] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-200/60 dark:border-blue-900/50">
              Unlocked
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded leading-tight inline-block text-center transition-all ${
            isUniqueSellingPoint && highlightDifferences
              ? 'text-[#0A4FD5] dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950 font-black ring-2 ring-blue-500/40 shadow-xs scale-105'
              : isHighlight
              ? 'text-[#0A4FD5] dark:text-blue-400 bg-blue-50/90 dark:bg-blue-950/80 font-bold border border-blue-200/50 dark:border-blue-900/40'
              : isIdenticalRow && highlightDifferences
              ? 'text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/40'
              : 'text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80'
          }`}
        >
          {val}
        </span>
        {isUniqueSellingPoint && highlightDifferences && (
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1 rounded">
            Top Tier
          </span>
        )}
      </div>
    );
  };

  // Filter categories and features based on search & category pill
  const filteredCategories = COMPARISON_CATEGORIES.map((cat) => {
    if (selectedCategory !== 'All' && cat.category !== selectedCategory) {
      return null;
    }

    const filteredFeatures = cat.features.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.tooltip && f.tooltip.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (searchQuery && filteredFeatures.length === 0) {
      return null;
    }

    return {
      ...cat,
      features: filteredFeatures,
    };
  }).filter(Boolean) as typeof COMPARISON_CATEGORIES;

  const totalMatchingFeatures = filteredCategories.reduce(
    (acc, cat) => acc + cat.features.length,
    0
  );

  const allFeaturesMap = useMemo(() => {
    const map = new Map<string, { feature: ComparisonFeature; category: string }>();
    COMPARISON_CATEGORIES.forEach((cat) => {
      cat.features.forEach((feat) => {
        map.set(feat.name, { feature: feat, category: cat.category });
      });
    });
    return map;
  }, []);

  const pinnedFeatureList = useMemo(() => {
    return pinnedFeatures
      .map((name) => allFeaturesMap.get(name))
      .filter(Boolean) as { feature: ComparisonFeature; category: string }[];
  }, [pinnedFeatures, allFeaturesMap]);

  return (
    <section id="comparison" className="py-16 lg:py-24 bg-white dark:bg-[#070F1B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
            <span>Comprehensive Plan Capability Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Compare All 9 Plans, Features & Limits
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Detailed breakdown of accounting controls, e-commerce storefronts, point of sale hardware, HR modules, and statutory compliance.
          </p>
        </div>

        {/* Filter Controls: Category pills + Search input + Plan column filter */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-white dark:bg-[#0D1C30] text-[#0A4FD5] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Categories
              </button>
              {COMPARISON_CATEGORIES.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.category
                      ? 'bg-white dark:bg-[#0D1C30] text-[#0A4FD5] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g. chart of accounts, POS, QR)..."
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear feature search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Plan Column Filter & Highlight Differences Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-[#0B182B] rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Compare Columns:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {COMPARISON_EDITIONS.map((edition) => (
                    <button
                      key={edition.id}
                      type="button"
                      onClick={() => setPlanFilterGroup(edition.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        planFilterGroup === edition.id
                          ? 'bg-[#0A4FD5] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      <span>{edition.title}</span>
                      <span
                        className={`ml-1.5 text-[10px] font-medium hidden sm:inline ${
                          planFilterGroup === edition.id
                            ? 'text-blue-200'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        ({edition.plans.length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlight & Difference Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-3">
                {/* Difference Only Toggle Button */}
                <button
                  type="button"
                  onClick={() => setOnlyDifferences(!onlyDifferences)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    onlyDifferences
                      ? 'bg-[#0A4FD5] text-white shadow-blue-500/25 ring-2 ring-blue-400/40 hover:bg-[#07389B]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-[#0A4FD5] hover:text-[#0A4FD5]'
                  }`}
                  title="Hide rows where all plans have the exact same capability to focus on differentiating features"
                  aria-pressed={onlyDifferences}
                >
                  {onlyDifferences ? (
                    <EyeOff className="w-3.5 h-3.5 text-lime-300" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Difference Only</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      onlyDifferences
                        ? 'bg-lime-400 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {onlyDifferences ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Highlight Differences Toggle Button */}
                <button
                  type="button"
                  onClick={() => setHighlightDifferences(!highlightDifferences)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    highlightDifferences
                      ? 'bg-[#0A4FD5] text-white shadow-blue-500/25 ring-2 ring-blue-400/40 hover:bg-[#07389B]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-[#0A4FD5] hover:text-[#0A4FD5]'
                  }`}
                  title="Automatically gray out identical features across plans and emphasize unique selling points"
                  aria-pressed={highlightDifferences}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${highlightDifferences ? 'text-lime-300' : 'text-slate-400'}`} />
                  <span>Highlight</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      highlightDifferences
                        ? 'bg-lime-400 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {highlightDifferences ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Quick Expand All / Collapse All Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const anyCollapsed = filteredCategories.some((c) => !!collapsedCategories[c.category]);
                    if (anyCollapsed) {
                      expandAll();
                    } else {
                      collapseAll();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-[#0A4FD5] hover:text-[#0A4FD5] shadow-xs"
                  title="Expand or collapse all feature category headers at once"
                >
                  {filteredCategories.some((c) => !!collapsedCategories[c.category]) ? (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#0A4FD5]" />
                      <span>Expand All</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-3.5 h-3.5 text-slate-500" />
                      <span>Collapse All</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-2 flex-wrap">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{totalMatchingFeatures}</strong> capabilities across{' '}
                <strong className="text-slate-900 dark:text-white">{activePlans.length}</strong> plans
              </span>
              {highlightDifferences && (
                <span className="text-[#0A4FD5] dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/50">
                  ⚡ Identical features grayed out · USPs highlighted
                </span>
              )}
              <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50/90 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/50 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Cached Offline</span>
              </span>
            </div>
          </div>

          {/* Active Edition Highlight Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/70 dark:from-[#0B1A30] dark:via-[#091524] dark:to-[#0F1E38] rounded-xl border border-blue-200/70 dark:border-blue-900/50 text-xs shadow-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-black text-[#0A4FD5] dark:text-blue-300 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0A4FD5] dark:bg-blue-400"></span>
                {currentEdition.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border border-blue-200/80 dark:border-blue-800/80 text-[11px] shadow-xs">
                {currentEdition.badge}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-xs">
                {currentEdition.description}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 font-black text-[#0A4FD5] dark:text-blue-300 text-xs border border-blue-200/60 dark:border-blue-800/60">
                {currentEdition.userRange}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container with Sticky Column Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-[#0B192C]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              
              {/* Sticky Table Header */}
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-[#091525]/95 backdrop-blur-sm sticky top-20 z-20">
                  <th className="py-4 px-6 text-sm font-black text-slate-900 dark:text-white min-w-[220px] w-1/4 sticky left-0 bg-slate-50/95 dark:bg-[#091525]/95 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Capabilities & Limits
                  </th>
                  {activePlans.map((plan) => {
                    const isPopular = plan.isPopular;
                    const priceFormatted = plan.customPricing
                      ? 'Custom'
                      : plan.monthlyPrice === 0
                      ? 'Free'
                      : `${formatCurrency(plan.monthlyPrice, currency)}/mo`;

                    return (
                      <th
                        key={plan.id}
                        className={`py-4 px-3 text-center text-xs min-w-[120px] ${
                          isPopular
                            ? 'font-black text-[#0A4FD5] dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-900/50'
                            : 'font-extrabold text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="inline-flex items-center gap-1 justify-center">
                          <span>{plan.name}</span>
                          {isPopular && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                          {priceFormatted}
                        </div>
                        <div className="text-[9px] text-[#0A4FD5] dark:text-blue-300 font-semibold">
                          {plan.usersLimit}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body organized by Categories */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {/* 1. Skeleton Loader State */}
                {isTableLoading && (
                  <>
                    {[...Array(6)].map((_, sIdx) => (
                      <tr key={`skel-${sIdx}`} className="animate-pulse bg-slate-50/50 dark:bg-slate-900/30">
                        <td className="py-4 px-6 sticky left-0 bg-white dark:bg-[#0B192C]">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-1"></div>
                          <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
                        </td>
                        {activePlans.map((p) => (
                          <td key={p.id} className="py-4 px-3 text-center">
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-14 mx-auto"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* 2. Pinned Features Section (Locked at top of table for easy side-by-side comparison) */}
                {!isTableLoading && pinnedFeatureList.length > 0 && (
                  <>
                    <tr className="bg-gradient-to-r from-lime-50 via-emerald-50 to-lime-50 dark:from-lime-950/40 dark:via-slate-900 dark:to-lime-950/40 border-y-2 border-lime-300 dark:border-lime-700/80 sticky top-36 z-10 shadow-xs">
                      <td colSpan={activePlans.length + 1} className="py-2.5 px-6">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-lime-500 text-slate-950 font-black shadow-2xs">
                              <Pin className="w-3.5 h-3.5 fill-slate-950" />
                            </span>
                            <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                              Pinned Features for Side-by-Side Comparison ({pinnedFeatureList.length})
                            </span>
                            <span className="text-[11px] text-lime-800 dark:text-lime-300 font-medium hidden md:inline">
                              — Locked at the top of the matrix
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPinnedFeatures([])}
                            className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 hover:bg-red-100 cursor-pointer transition-colors"
                          >
                            Unpin All
                          </button>
                        </div>
                      </td>
                    </tr>

                    {pinnedFeatureList.map(({ feature, category }, pIdx) => {
                      const isIdentical = checkFeatureIdentical(feature, activePlans);
                      if (onlyDifferences && isIdentical) return null;

                      return (
                        <tr
                          key={`pinned-${pIdx}`}
                          className="bg-lime-50/20 dark:bg-lime-950/15 hover:bg-lime-50/40 dark:hover:bg-lime-950/30 transition-colors border-b border-lime-200/50 dark:border-lime-900/40"
                        >
                          <td className="py-3 px-6 sticky left-0 z-10 bg-white dark:bg-[#0B192C] font-semibold text-slate-900 dark:text-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold">{feature.name}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                                  {category}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => togglePinFeature(feature.name)}
                                className="p-1 rounded-md text-lime-600 dark:text-lime-400 hover:bg-lime-100 dark:hover:bg-lime-900/50 cursor-pointer"
                                title="Unpin feature from top"
                              >
                                <Pin className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                          </td>

                          {activePlans.map((plan) => {
                            const isPopular = plan.isPopular;
                            const val = getFeatureValueForPlan(feature, plan.id);
                            const isUsp = checkIsUniqueSellingPoint(feature, plan.id, activePlans);

                            return (
                              <td
                                key={plan.id}
                                className={`py-3 px-3 text-center transition-colors ${
                                  isPopular
                                    ? 'bg-blue-50/30 dark:bg-blue-950/20 border-x border-blue-100 dark:border-blue-900/40'
                                    : ''
                                }`}
                              >
                                {renderValue(val, isPopular, isUsp, isIdentical)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </>
                )}

                {/* 3. Regular Categories with Hierarchical Accordion & Header Tooltip */}
                {!isTableLoading &&
                  filteredCategories.map((catGroup) => {
                    const isCollapsed = !!collapsedCategories[catGroup.category];
                    const isTooltipOpen = activeCategoryTooltip === catGroup.category;

                    return (
                      <React.Fragment key={catGroup.category}>
                        {/* Category Header Row with explicit Plus / Minus indicator button & Contextual Tooltip */}
                        <tr
                          onClick={() => toggleCategory(catGroup.category)}
                          className="bg-slate-100/90 dark:bg-[#0D1E36] hover:bg-slate-200/80 dark:hover:bg-[#122846] cursor-pointer transition-colors border-y border-slate-200 dark:border-slate-800"
                        >
                          <td colSpan={activePlans.length + 1} className="py-3 px-6">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCategory(catGroup.category);
                                    }}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer font-black shadow-xs ${
                                      isCollapsed
                                        ? 'bg-[#0A4FD5] text-white hover:bg-[#07389B] ring-2 ring-blue-400/40'
                                        : 'bg-white dark:bg-slate-800 text-[#0A4FD5] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                                    }`}
                                    aria-label={
                                      isCollapsed
                                        ? `Expand ${catGroup.category} features`
                                        : `Collapse ${catGroup.category} features`
                                    }
                                    title={isCollapsed ? 'Click plus (+) to expand features' : 'Click minus (−) to collapse features'}
                                  >
                                    {isCollapsed ? (
                                      <Plus className="w-4 h-4 stroke-[2.5]" />
                                    ) : (
                                      <Minus className="w-4 h-4 stroke-[2.5]" />
                                    )}
                                  </button>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {/* Hierarchical Parent Category Badge */}
                                    {catGroup.parentCategory && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
                                        {catGroup.parentCategory}
                                      </span>
                                    )}

                                    <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                                      {catGroup.category}
                                    </span>

                                    {/* Contextual Info Tooltip Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCategoryTooltip(isTooltipOpen ? null : catGroup.category);
                                      }}
                                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                                        isTooltipOpen
                                          ? 'bg-[#0A4FD5] text-white'
                                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                                      }`}
                                      title={`Hover or click to see what ${catGroup.category} means for business owners`}
                                    >
                                      <Info className="w-3.5 h-3.5" />
                                    </button>

                                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 hidden md:inline">
                                      — {catGroup.description}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                                    {catGroup.features.length} features
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                                      isCollapsed
                                        ? 'bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300 border border-blue-200 dark:border-blue-900 shadow-xs'
                                        : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {isCollapsed ? (
                                      <>
                                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>Expand Features</span>
                                      </>
                                    ) : (
                                      <>
                                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>Collapse</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Contextual Tooltip Popover Box */}
                              {isTooltipOpen && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-1 p-3.5 rounded-xl bg-white dark:bg-[#071322] border border-blue-200 dark:border-blue-900 shadow-md text-xs animate-in fade-in duration-150"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5">
                                      <ShieldCheck className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-xs mb-1">
                                          Plain-English Value for SME Owners: {catGroup.category}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                                          {catGroup.tooltip || catGroup.description}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setActiveCategoryTooltip(null)}
                                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                      title="Close explanation"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Feature rows */}
                        {!isCollapsed &&
                          catGroup.features.map((feature, fIdx) => {
                            const isIdentical = checkFeatureIdentical(feature, activePlans);
                            const isPinned = pinnedFeatures.includes(feature.name);

                            // Difference Only Filter: Hide identical feature rows if toggled
                            if (onlyDifferences && isIdentical) {
                              return null;
                            }

                            return (
                              <tr
                                key={fIdx}
                                className={`transition-all duration-200 ${
                                  highlightDifferences && isIdentical
                                    ? 'opacity-35 dark:opacity-30 hover:opacity-100 bg-slate-50/30 dark:bg-slate-900/20'
                                    : highlightDifferences && !isIdentical
                                    ? 'bg-blue-50/25 dark:bg-blue-950/25 border-l-4 border-l-[#0A4FD5] dark:border-l-blue-400 hover:bg-blue-50/45 dark:hover:bg-blue-950/40'
                                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td
                                  className={`py-3.5 px-6 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors ${
                                    highlightDifferences && isIdentical
                                      ? 'bg-slate-50/95 dark:bg-[#091524]/95 text-slate-400 dark:text-slate-500 font-normal'
                                      : highlightDifferences && !isIdentical
                                      ? 'bg-white dark:bg-[#0B192C] text-slate-900 dark:text-white font-bold'
                                      : 'bg-white dark:bg-[#0B192C] font-medium text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span>{feature.name}</span>
                                      {feature.tooltip && (
                                        <span
                                          title={feature.tooltip}
                                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help"
                                        >
                                          <HelpCircle className="w-3.5 h-3.5 inline" />
                                        </span>
                                      )}
                                      {highlightDifferences && !isIdentical && (
                                        <span className="text-[9px] font-black uppercase text-[#0A4FD5] dark:text-blue-300 bg-blue-100/90 dark:bg-blue-900/80 px-1.5 py-0.2 rounded tracking-wider">
                                          Differentiator
                                        </span>
                                      )}
                                      {highlightDifferences && isIdentical && (
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 italic">
                                          (same across plans)
                                        </span>
                                      )}
                                    </div>

                                    {/* Pin Feature Button */}
                                    <button
                                      type="button"
                                      onClick={() => togglePinFeature(feature.name)}
                                      className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                                        isPinned
                                          ? 'text-lime-600 dark:text-lime-400 hover:bg-lime-100 dark:hover:bg-lime-950/70'
                                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                      }`}
                                      title={isPinned ? 'Unpin feature from top' : 'Pin feature to top for side-by-side comparison'}
                                    >
                                      <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                                    </button>
                                  </div>
                                </td>

                                {/* Plan columns */}
                                {activePlans.map((plan) => {
                                  const isPopular = plan.isPopular;
                                  const val = getFeatureValueForPlan(feature, plan.id);
                                  const isUsp = checkIsUniqueSellingPoint(feature, plan.id, activePlans);

                                  return (
                                    <td
                                      key={plan.id}
                                      className={`py-3 px-3 text-center transition-colors ${
                                        isPopular
                                          ? 'bg-blue-50/30 dark:bg-blue-950/20 border-x border-blue-100 dark:border-blue-900/40'
                                          : ''
                                      }`}
                                    >
                                      {renderValue(val, isPopular, isUsp, isIdentical)}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={activePlans.length + 1} className="py-12 px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                      <div className="max-w-md mx-auto space-y-2">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          No features found matching &ldquo;{searchQuery}&rdquo;.
                        </p>
                        <p className="text-xs text-slate-400">
                          Try searching for keywords like &ldquo;chart of accounts&rdquo;, &ldquo;POS&rdquo;, &ldquo;commission&rdquo;, &ldquo;stores&rdquo;, or &ldquo;payroll&rdquo;.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Bottom Sticky Action Footer */}
              <tfoot>
                <tr className="bg-slate-50 dark:bg-[#091525] border-t-2 border-slate-200 dark:border-slate-800">
                  <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200 text-xs sticky left-0 bg-slate-50 dark:bg-[#091525] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                    Ready to subscribe?
                  </td>
                  {activePlans.map((plan) => {
                    const isPopular = plan.isPopular;

                    return (
                      <td
                        key={plan.id}
                        className={`py-3 px-2 text-center ${
                          isPopular
                            ? 'bg-blue-50/60 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-900/50'
                            : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectPlan(plan.id)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                            isPopular
                              ? 'bg-[#0A4FD5] hover:bg-[#07389B] text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:text-[#0A4FD5] dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Select {plan.name}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>

            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
