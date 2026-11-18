import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArticleGridProps {
  articles: Article[];
  searchQuery: string;
  selectedCategory: string;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: string) => void;
  onClearFilters: () => void;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  searchQuery,
  selectedCategory,
  onSelectArticle,
  onSelectCategory,
  onClearFilters
}) => {
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured'>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const { t, dict, translateCategory } = useLanguage();

  const topics = ['All', 'Accounting', 'POS', 'Inventory', 'Finance', 'Business Management', 'AI & Automation'];
  const industries = ['All', 'Retail', 'Restaurant', 'Wholesale', 'Services'];
  const contentTypes = ['All', 'Articles', 'Guides', 'Case Studies'];

  // Filter and sort computation
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // 1. Category Nav filter
      if (selectedCategory !== 'All' && article.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // 2. Topic filter
      if (topicFilter !== 'All' && !article.category.toLowerCase().includes(topicFilter.toLowerCase())) {
        return false;
      }
      // 3. Industry filter
      if (industryFilter !== 'All' && !article.industry.toLowerCase().includes(industryFilter.toLowerCase())) {
        return false;
      }
      // 4. Content Type filter
      if (contentTypeFilter !== 'All' && article.contentType !== contentTypeFilter) {
        return false;
      }
      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesCategory = article.category.toLowerCase().includes(q);
        const matchesIndustry = article.industry.toLowerCase().includes(q);
        const matchesTags = article.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesCategory && !matchesIndustry && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return b.views - a.views;
      }
      if (sortBy === 'featured') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      // Latest: date parsing
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [articles, selectedCategory, topicFilter, industryFilter, contentTypeFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    topicFilter !== 'All' ||
    industryFilter !== 'All' ||
    contentTypeFilter !== 'All' ||
    searchQuery.trim().length > 0;

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="articles-section">
      {/* Filtering Control Bar */}
      <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Active Title & Count */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCategory === 'All' ? dict.articleGrid.title : `${translateCategory(selectedCategory)}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? t('articleGrid.foundMatching', { count: filteredArticles.length, query: searchQuery })
                  : t('articleGrid.showingAll', { count: filteredArticles.length })}
              </p>
            </div>
          </div>

          {/* Filter dropdowns and sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Topic Filter */}
            <div className="relative">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-[#0E2443] hover:bg-slate-100 dark:hover:bg-[#132F55] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400 transition-colors cursor-pointer"
                aria-label="Filter by Topic"
              >
                {topics.map((t) => (
                  <option key={t} value={t} className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">
                    Topic: {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-[#0E2443] hover:bg-slate-100 dark:hover:bg-[#132F55] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400 transition-colors cursor-pointer"
                aria-label="Filter by Industry"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind} className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">
                    Industry: {ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Content Type Filter */}
            <div className="relative">
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-[#0E2443] hover:bg-slate-100 dark:hover:bg-[#132F55] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400 transition-colors cursor-pointer"
                aria-label="Filter by Content Type"
              >
                {contentTypes.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">
                    Type: {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-blue-50/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400 transition-colors cursor-pointer"
                aria-label="Sort articles"
              >
                <option value="latest" className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">Sort: Latest</option>
                <option value="popular" className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">Sort: Most Popular</option>
                <option value="featured" className="bg-white dark:bg-[#0B1E36] text-slate-900 dark:text-white">Sort: Featured</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-blue-700 dark:text-lime-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Button if active */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setTopicFilter('All');
                  setIndustryFilter('All');
                  setContentTypeFilter('All');
                  onClearFilters();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] px-3 py-2 rounded-xl transition-colors"
                title={dict.articleGrid.clearFilters}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{dict.articleGrid.clearFilters}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {filteredArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelectArticle={onSelectArticle}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>

          {/* Pagination / Load More button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {dict.articleGrid.next} ({filteredArticles.length - visibleCount})
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty Search / Filter State with Suggestions */
        <div className="bg-white dark:bg-[#0B1E36] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dict.articleGrid.noArticlesFound}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {dict.articleGrid.noArticlesSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setTopicFilter('All');
                setIndustryFilter('All');
                setContentTypeFilter('All');
                onClearFilters();
              }}
              className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold transition-all"
            >
              {dict.articleGrid.clearFilters}
            </button>
            <button
              onClick={() => onSelectCategory('Accounting')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              {translateCategory('Accounting')}
            </button>
            <button
              onClick={() => onSelectCategory('POS')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              {translateCategory('POS')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
