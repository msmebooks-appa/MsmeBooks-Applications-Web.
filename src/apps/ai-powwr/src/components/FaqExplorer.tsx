import React, { useState, useMemo } from 'react';
import { FaqItemData, FaqCategory, IndustryDefinition, ProductModule } from '../types/faq';
import { FAQ_CATEGORIES } from '../data/categories';
import { INDUSTRIES } from '../data/industries';
import { PRODUCT_MODULES } from '../data/productModules';
import { FaqItem } from './FaqItem';
import { DynamicIcon } from './DynamicIcon';
import { useI18n } from '../context/I18nContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Building2,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface FaqExplorerProps {
  faqs: FaqItemData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedIndustry: string | null;
  onSelectIndustry: (industryId: string | null) => void;
  selectedModule: string | null;
  onSelectModule: (moduleId: string | null) => void;
  sortOrder: 'all' | 'popular' | 'recent';
  onSortChange: (sort: 'all' | 'popular' | 'recent') => void;
  onVoteHelpful: (faqId: string, helpful: boolean) => void;
  onOpenAiAssistant: () => void;
  openFaqId?: string | null;
  onOpenFaqIdChange?: (faqId: string | null) => void;
}

export const FaqExplorer: React.FC<FaqExplorerProps> = ({
  faqs,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedIndustry,
  onSelectIndustry,
  selectedModule,
  onSelectModule,
  sortOrder,
  onSortChange,
  onVoteHelpful,
  onOpenAiAssistant,
  openFaqId: controlledOpenFaqId,
  onOpenFaqIdChange
}) => {
  const { t, translateFaq } = useI18n();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [internalOpenFaqId, setInternalOpenFaqId] = useState<string | null>(null);
  const openFaqId = controlledOpenFaqId !== undefined ? controlledOpenFaqId : internalOpenFaqId;
  const setOpenFaqId = onOpenFaqIdChange || setInternalOpenFaqId;

  // Filter and sort computation
  const filteredFaqs = useMemo(() => {
    let result = faqs.filter((f) => f.publicationStatus === 'Published');

    // 1. Keyword search (full-text across English and localized question, shortAnswer, detailedAnswer, keywords, synonyms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((f) => {
        const loc = translateFaq(f);
        return (
          f.question.toLowerCase().includes(q) ||
          f.shortAnswer.toLowerCase().includes(q) ||
          f.detailedAnswer.toLowerCase().includes(q) ||
          loc.question.toLowerCase().includes(q) ||
          loc.shortAnswer.toLowerCase().includes(q) ||
          loc.detailedAnswer.toLowerCase().includes(q) ||
          f.keywords.some((k) => k.toLowerCase().includes(q)) ||
          (f.synonyms && f.synonyms.some((s) => s.toLowerCase().includes(q)))
        );
      });
    }

    // 2. Category filter
    if (selectedCategory) {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }

    // 3. Industry filter
    if (selectedIndustry) {
      result = result.filter(
        (f) => f.industryIds && f.industryIds.includes(selectedIndustry)
      );
    }

    // 4. Product module filter
    if (selectedModule) {
      result = result.filter(
        (f) => f.productModuleIds && f.productModuleIds.includes(selectedModule)
      );
    }

    // 5. Sorting
    if (sortOrder === 'popular') {
      result = [...result].sort((a, b) => b.helpfulVotes - a.helpfulVotes);
    } else if (sortOrder === 'recent') {
      result = [...result].sort(
        (a, b) => new Date(b.lastVerifiedDate).getTime() - new Date(a.lastVerifiedDate).getTime()
      );
    } else {
      // Default: display order
      result = [...result].sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return result;
  }, [faqs, searchQuery, selectedCategory, selectedIndustry, selectedModule, sortOrder, translateFaq]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategory || selectedIndustry || selectedModule || sortOrder !== 'all'
  );

  const resetAllFilters = () => {
    onSearchChange('');
    onSelectCategory(null);
    onSelectIndustry(null);
    onSelectModule(null);
    onSortChange('all');
  };

  const currentCategoryData = FAQ_CATEGORIES.find((c) => c.id === selectedCategory);
  const currentIndustryData = INDUSTRIES.find((i) => i.id === selectedIndustry);
  const currentModuleData = PRODUCT_MODULES.find((m) => m.id === selectedModule);

  return (
    <section className="py-14 bg-[#F5F8FC] dark:bg-[#0B132B] transition-colors duration-300" id="faq-explorer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wider mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
              {t('explorer.badge', 'Centralized Knowledge Hub')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
              {t('explorer.title', 'Interactive FAQ Explorer')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('explorer.description', 'Filter by product module, specific industry, or popularity to find verified guidance.')}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#131E36] border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522]" />
              <span>Filters & Topics {hasActiveFilters && '(Active)'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Layout (Left 25%, Right 75%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT SIDEBAR (25% on desktop: 3 of 12 columns) */}
          {/* ============================================================== */}
          <aside
            className={`lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Sidebar Container */}
            <div className="bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-6">
              {/* Header with clear button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
                  Filters
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#1254B5] dark:text-[#B7E522] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset all
                  </button>
                )}
              </div>

              {/* In-Sidebar Search Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Filter by Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="e.g. VAT, POS, barcode..."
                    className="w-full text-xs py-2 pl-8 pr-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#162038]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Categories List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Knowledge Categories
                  </label>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {FAQ_CATEGORIES.length}
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 text-xs custom-scrollbar">
                  <button
                    onClick={() => onSelectCategory(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                      selectedCategory === null
                        ? 'bg-[#1254B5] text-white font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All Categories</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === null ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {faqs.length}
                    </span>
                  </button>

                  {FAQ_CATEGORIES.map((cat) => {
                    const count = faqs.filter(
                      (f) => f.categoryId === cat.id && f.publicationStatus === 'Published'
                    ).length;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1254B5] text-white font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Modules Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-2">
                  Product Module
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => onSelectModule(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                      selectedModule === null
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] font-bold border border-blue-200 dark:border-blue-800'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Any Module</span>
                  </button>
                  {PRODUCT_MODULES.slice(0, 6).map((module) => {
                    const isSelected = selectedModule === module.id;
                    return (
                      <button
                        key={module.id}
                        onClick={() => onSelectModule(isSelected ? null : module.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] font-bold border border-blue-200 dark:border-blue-800'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{module.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry Solutions Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#1254B5] dark:text-[#B7E522]" />
                    Filter by Industry
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">20 sectors</span>
                </div>
                <select
                  value={selectedIndustry || ''}
                  onChange={(e) => onSelectIndustry(e.target.value || null)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                >
                  <option value="">All Industries (General)</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id} className="bg-white dark:bg-[#131E36] text-slate-800 dark:text-white">
                      {ind.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Help Banner in Sidebar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-900 to-[#1254B5] dark:from-[#0E1B38] dark:to-[#1254B5] text-white">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#B7E522] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask MsmeBooks AI
                </div>
                <p className="text-[11px] text-blue-100 leading-relaxed">
                  Have a specific question not listed here? Ask our grounded assistant anytime.
                </p>
                <button
                  onClick={onOpenAiAssistant}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#B7E522] hover:bg-[#a2ce1d] text-[#17233D] font-bold text-xs transition shadow-xs text-center cursor-pointer"
                >
                  Start AI Chat
                </button>
              </div>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* MAIN CONTENT (75% on desktop: 9 of 12 columns) */}
          {/* ============================================================== */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Control Bar: Sort toggles, active count & filter pills */}
            <div className="bg-white dark:bg-[#131E36] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#17233D] dark:text-white">
                  Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Answer' : 'Answers'}
                </span>
                {hasActiveFilters && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    (Filtered from {faqs.length})
                  </span>
                )}
              </div>

              {/* Sorting Toggles (Section 6: All FAQs | Popular | Recently Updated) */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1726] p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
                <button
                  onClick={() => onSortChange('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    sortOrder === 'all'
                      ? 'bg-white dark:bg-[#162544] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All FAQs
                </button>
                <button
                  onClick={() => onSortChange('popular')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    sortOrder === 'popular'
                      ? 'bg-white dark:bg-[#162544] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => onSortChange('recent')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    sortOrder === 'recent'
                      ? 'bg-white dark:bg-[#162544] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Recently Updated
                </button>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Active filters:</span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => onSearchChange('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {currentCategoryData && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full font-medium">
                    Category: {currentCategoryData.title}
                    <button onClick={() => onSelectCategory(null)} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {currentIndustryData && (
                  <span className="inline-flex items-center gap-1 bg-[#F4FCD9] dark:bg-[#253609] text-[#17233D] dark:text-[#B7E522] border border-[#B7E522] px-2.5 py-1 rounded-full font-medium">
                    Industry: {currentIndustryData.shortTitle}
                    <button onClick={() => onSelectIndustry(null)} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {currentModuleData && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full font-medium">
                    Module: {currentModuleData.title}
                    <button onClick={() => onSelectModule(null)} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-red-600 dark:text-rose-400 hover:underline ml-2 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Accordion Questions List */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <FaqItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openFaqId === faq.id}
                    onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    onVoteHelpful={onVoteHelpful}
                    onSelectRelatedQuestion={(relId) => {
                      const target = faqs.find((f) => f.id === relId);
                      if (target) {
                        if (selectedCategory && target.categoryId !== selectedCategory) {
                          onSelectCategory(target.categoryId);
                        }
                        if (selectedIndustry && (!target.industryIds || !target.industryIds.includes(selectedIndustry))) {
                          onSelectIndustry(null);
                        }
                        if (selectedModule && (!target.productModuleIds || !target.productModuleIds.includes(selectedModule))) {
                          onSelectModule(null);
                        }
                        if (searchQuery) {
                          onSearchChange('');
                        }
                      }
                      setOpenFaqId(relId);
                    }}
                    allFaqs={faqs}
                    searchHighlightQuery={searchQuery}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results Recommendation State */
              <div className="bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] flex items-center justify-center mx-auto">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#17233D] dark:text-white">
                  No matching answers found for "{searchQuery}"
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  We couldn't find a direct match. Try adjusting your search keywords, clear active category filters, or ask our intelligent AI support assistant.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={resetAllFilters}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>

                  <button
                    onClick={onOpenAiAssistant}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-[#1254B5] hover:bg-[#0A3D87] text-white shadow-sm transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#B7E522]" />
                    <span>Ask MsmeBooks AI</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};
