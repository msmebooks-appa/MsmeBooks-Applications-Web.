import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AGREEMENT_ARTICLES, AGREEMENT_META, AGREEMENT_SCHEDULES } from '../data/agreementData';
import {
  Search,
  X,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Download,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Navigation,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PartnerAgreementViewerProps {
  onOpenApply: () => void;
  onOpenSchedule: (letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') => void;
}

export const PartnerAgreementViewer: React.FC<PartnerAgreementViewerProps> = ({
  onOpenApply,
  onOpenSchedule
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchScope, setSearchScope] = useState<'all' | 'titles' | 'clauses'>('all');
  const [expandedArticles, setExpandedArticles] = useState<number[]>([1, 2, 6, 10, 11, 30]); // Default marquee open
  const [activeTab, setActiveTab] = useState<'articles' | 'schedules'>('articles');
  const [activeJumpArticle, setActiveJumpArticle] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'all',
    'Parties & Scope',
    'Commercial & Commission',
    'Rights & Compliance',
    'Legal & Governance'
  ];

  // Quick search presets for high-demand clauses
  const quickClausePresets = [
    { label: 'Commission Rates', query: 'commission' },
    { label: '90-Day Attribution', query: 'attribution' },
    { label: 'Monthly Payouts', query: 'payment' },
    { label: 'Termination Run-Off', query: 'termination' },
    { label: 'Data Privacy & NDPR', query: 'privacy' },
    { label: 'Trademark & Logo Bidding', query: 'trademark' },
    { label: 'Arbitration & Disputes', query: 'arbitration' },
    { label: 'Anti-Bribery', query: 'bribery' },
    { label: 'Implementation Fees', query: 'implementation' }
  ];

  // Listen for keyboard shortcut '/' or 'Cmd+K' to focus global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
          ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        const agreementSection = document.getElementById('agreement');
        agreementSection?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Articles in real-time based on keyword query and scope
  const filteredArticles = useMemo(() => {
    return AGREEMENT_ARTICLES.filter(article => {
      // Category filter
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }

      // Keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = `article ${article.number}`.includes(q) || `art ${article.number}`.includes(q) || `art. ${article.number}`.includes(q);
        const matchesCategory = article.category.toLowerCase().includes(q);
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSummary = article.summary.toLowerCase().includes(q);
        const matchesContent = article.content.toLowerCase().includes(q);

        if (searchScope === 'titles') {
          return matchesNumber || matchesTitle || matchesCategory;
        }

        if (searchScope === 'clauses') {
          return matchesContent || matchesSummary;
        }

        return matchesNumber || matchesTitle || matchesCategory || matchesSummary || matchesContent;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, searchScope]);

  // Filter Schedules in real-time based on search query
  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return AGREEMENT_SCHEDULES;
    const q = searchQuery.toLowerCase().trim();
    return AGREEMENT_SCHEDULES.filter(schedule => {
      const matchesLetter = `schedule ${schedule.letter.toLowerCase()}`.includes(q);
      const matchesTitle = schedule.title.toLowerCase().includes(q);
      const matchesSubtitle = schedule.subtitle.toLowerCase().includes(q);
      const matchesSummary = schedule.summary.toLowerCase().includes(q);
      const matchesSections = schedule.sections.some(
        sec => sec.heading.toLowerCase().includes(q) || sec.body.toLowerCase().includes(q)
      );
      return matchesLetter || matchesTitle || matchesSubtitle || matchesSummary || matchesSections;
    });
  }, [searchQuery]);

  // Count search query matches in article
  const countOccurrences = (text: string, query: string): number => {
    if (!query.trim()) return 0;
    try {
      const regex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  };

  const toggleArticle = (num: number) => {
    setExpandedArticles(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const expandAll = () => {
    setExpandedArticles(AGREEMENT_ARTICLES.map(a => a.number));
  };

  const collapseAll = () => {
    setExpandedArticles([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchScope('all');
    searchInputRef.current?.focus();
  };

  // Scroll to article card smoothly
  const scrollToArticle = (articleNum: number) => {
    setActiveJumpArticle(articleNum);
    if (!expandedArticles.includes(articleNum)) {
      setExpandedArticles(prev => [...prev, articleNum]);
    }
    const element = document.getElementById(`agreement-article-${articleNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setActiveJumpArticle(null);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to highlight matching text in articles
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark
              key={index}
              className="bg-lime-200 dark:bg-lime-400 text-slate-900 font-bold px-0.5 rounded shadow-2xs"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <section id="agreement" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
              <span>Section 04</span>
              <span aria-hidden="true">·</span>
              <span>{t('agreement.badge', 'Legal Framework & Master Agreement')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('agreement.title', 'Master Partner Terms & Schedules')}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'agreement.subtitle',
                'Review the comprehensive 30-article legal agreement and schedules defining terms of engagement, licensing rights, non-solicitation, and automated commission protocols.'
              )}
            </p>
          </div>

          {/* Quick Actions (Print / Download / Apply) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onOpenApply}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-lime-300" />
              <span>Execute Agreement</span>
            </button>
          </div>
        </div>

        {/* Legal Instrument Metadata Card */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-medium">Contracting Entity</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{AGREEMENT_META.legalEntity}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-medium">Agreement Version & Date</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{AGREEMENT_META.version} · {AGREEMENT_META.effectiveDate}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-medium">Official Portal & Terms</p>
            <p className="font-bold text-[#0046B8] dark:text-blue-400 mt-0.5">{AGREEMENT_META.portalUrl}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-medium">Arbitration & Dispute Venue</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">Commercial Arbitration Rules</p>
          </div>
        </div>

        {/* GLOBAL REAL-TIME SEARCH BAR CONTAINER */}
        <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-blue-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-6 rounded-2xl border-2 border-blue-200/90 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <label htmlFor="agreement-global-search" className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0046B8] dark:text-blue-400" />
                <span>Global Agreement & Clause Search</span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type any keyword, clause, or term to filter all 30 legal articles and Schedules A–G in real time.
              </p>
            </div>

            {searchQuery.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0046B8] dark:text-lime-400 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-2xs">
                  {filteredArticles.length} Article{filteredArticles.length === 1 ? '' : 's'} · {filteredSchedules.length} Schedule{filteredSchedules.length === 1 ? '' : 's'} Filtered
                </span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Search Input with Shortcut and Clear Button */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0046B8] dark:text-blue-400" />
            <input
              id="agreement-global-search"
              ref={searchInputRef}
              type="text"
              placeholder={t('agreement.searchPlaceholder', 'Search 30 articles and schedules by keyword (e.g. commission, audit, termination)...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400 focus:border-transparent transition-all shadow-xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                  press / to focus
                </kbd>
              )}
            </div>
          </div>

          {/* Search Scope Switcher & Quick Preset Filter Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300 shrink-0">Popular Clauses:</span>
              {quickClausePresets.map(preset => {
                const isActive = searchQuery.toLowerCase().trim() === preset.query.toLowerCase().trim();
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSearchQuery(isActive ? '' : preset.query)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-2xs font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Scope Filter */}
            <div className="flex items-center gap-1 self-start sm:self-auto bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shrink-0">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium px-1.5">Scope:</span>
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  searchScope === 'all' ? 'bg-[#0046B8] dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Content
              </button>
              <button
                type="button"
                onClick={() => setSearchScope('titles')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  searchScope === 'titles' ? 'bg-[#0046B8] dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Titles Only
              </button>
              <button
                type="button"
                onClick={() => setSearchScope('clauses')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  searchScope === 'clauses' ? 'bg-[#0046B8] dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Clause Text Only
              </button>
            </div>
          </div>

          {/* Quick Match Jump Navigator */}
          {searchQuery.trim() && filteredArticles.length > 0 && (
            <div className="pt-2 border-t border-blue-200/60 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Navigation className="w-3.5 h-3.5 text-[#0046B8] dark:text-blue-400" />
                <span>Jump to Clause:</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {filteredArticles.map(article => (
                  <button
                    key={article.number}
                    type="button"
                    onClick={() => scrollToArticle(article.number)}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-300 font-mono text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Art. {article.number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Match Banner for Schedules */}
        {searchQuery.trim() && filteredSchedules.length > 0 && activeTab === 'articles' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Found matching terms in <strong>{filteredSchedules.length} Agreement Schedules</strong>: {filteredSchedules.map(s => `Schedule ${s.letter}`).join(', ')}.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className="inline-flex items-center gap-1 font-bold text-[#0046B8] dark:text-lime-400 hover:underline shrink-0 cursor-pointer"
            >
              <span>Switch to Matching Schedules ({filteredSchedules.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Switcher: 30 Articles vs Schedules A-G */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'articles'
                  ? 'border-[#0046B8] dark:border-lime-400 text-[#0046B8] dark:text-lime-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Agreement Articles ({filteredArticles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'schedules'
                  ? 'border-[#0046B8] dark:border-lime-400 text-[#0046B8] dark:text-lime-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Agreement Schedules ({filteredSchedules.length})</span>
            </button>
          </div>

          {activeTab === 'articles' && (
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={collapseAll}
                className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        {/* View 1: 30 Articles */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'All Operational Areas' : cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                Showing {filteredArticles.length} of 30 Articles
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-3.5">
              {filteredArticles.map(article => {
                const isOpen = expandedArticles.includes(article.number);
                const hasSearchMatch = searchQuery.trim() && (
                  article.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                  article.summary.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                  article.content.toLowerCase().includes(searchQuery.toLowerCase().trim())
                );
                const occurrences = searchQuery.trim()
                  ? countOccurrences(`${article.title} ${article.summary} ${article.content}`, searchQuery.trim())
                  : 0;
                const isJumpHighlighted = activeJumpArticle === article.number;

                return (
                  <div
                    id={`agreement-article-${article.number}`}
                    key={article.number}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 ${
                      isJumpHighlighted
                        ? 'ring-3 ring-lime-500 border-lime-500 shadow-lg'
                        : hasSearchMatch
                        ? 'border-blue-400 dark:border-blue-500 ring-1 ring-blue-300 dark:ring-blue-500/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleArticle(article.number)}
                      className="w-full px-5 py-4 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#0046B8] dark:text-blue-400 font-mono">
                            Article {article.number}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">·</span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {article.category}
                          </span>
                          {hasSearchMatch && (
                            <span className="text-[10px] font-bold text-lime-900 dark:text-lime-300 bg-lime-100 dark:bg-lime-950/80 px-2 py-0.5 rounded-full border border-lime-300 dark:border-lime-700 flex items-center gap-1">
                              <span>Match: {occurrences} occurrence{occurrences === 1 ? '' : 's'}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {highlightMatch(article.title, searchQuery)}
                        </h3>
                        {!isOpen && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {highlightMatch(article.summary, searchQuery)}
                          </p>
                        )}
                      </div>

                      <div className="text-slate-400 dark:text-slate-500 shrink-0 mt-1 sm:mt-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-[#0046B8] dark:text-blue-400">Summary & Purpose: </span>
                          {highlightMatch(article.summary, searchQuery)}
                        </div>
                        <div className="whitespace-pre-line font-sans text-slate-800 dark:text-slate-200 leading-relaxed">
                          {highlightMatch(article.content, searchQuery)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 space-y-2 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No articles matched "{searchQuery}"
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try checking the Agreement Schedules tab or clear your search term.
                </p>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-3 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline cursor-pointer"
                >
                  Clear search and show all 30 articles
                </button>
              </div>
            )}

          </div>
        )}

        {/* View 2: Schedules A through G */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            {searchQuery.trim() && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredSchedules.length} of 7 Schedules matching "{searchQuery}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchedules.map(schedule => (
                <div
                  key={schedule.letter}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0046B8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 px-2.5 py-1 rounded-md font-mono">
                        Schedule {schedule.letter}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Version v2026.4</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {highlightMatch(schedule.title, searchQuery)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {highlightMatch(schedule.subtitle, searchQuery)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {highlightMatch(schedule.summary, searchQuery)}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-2">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Key Provisions Highlight:</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {highlightMatch(schedule.sections[0]?.body || '', searchQuery)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenSchedule(schedule.letter)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline cursor-pointer"
                    >
                      <span>Read Full Schedule {schedule.letter}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Download/Print Schedule"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No schedules match "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-3 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline cursor-pointer"
                >
                  Clear search and show all schedules
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
