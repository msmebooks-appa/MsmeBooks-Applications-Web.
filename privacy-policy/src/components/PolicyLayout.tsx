import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  ChevronRight,
  ArrowUp,
  Table,
  SlidersHorizontal,
  Mail,
  FileCheck2,
  ExternalLink,
  ChevronDown,
  Coins,
  Scale
} from 'lucide-react';
import { POLICY_SECTIONS, POLICY_METADATA } from '../data/privacyPolicyData';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface PolicyLayoutProps {
  onOpenCookieModal: () => void;
  onOpenRightsModal: (type?: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  onOpenCookieModal,
  onOpenRightsModal,
  searchRef
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('section-1');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const internalSearchRef = useRef<HTMLInputElement>(null);
  const effectiveSearchRef = searchRef || internalSearchRef;
  const { t, getSectionTitle, getSectionData } = useLanguage();
  const { formatMoney, currencyMeta } = useCurrency();

  const categories = ['All', 'Overview', 'Data Details', 'Governance & Rights', 'Compliance & Modules', 'Operations & Contact'];

  const categoryLabels: Record<string, string> = {
    'All': t('policy.all', 'All'),
    'Overview': t('policy.overview', 'Overview'),
    'Data Details': t('policy.dataDetails', 'Data Details'),
    'Governance & Rights': t('policy.govRights', 'Governance & Rights'),
    'Compliance & Modules': t('policy.compModules', 'Compliance & Modules'),
    'Operations & Contact': t('policy.opsContact', 'Operations & Contact')
  };

  // Filter sections by search and category
  const filteredSections = useMemo(() => {
    return POLICY_SECTIONS.filter((sec) => {
      const matchesCategory = selectedCategory === 'All' || sec.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const localizedTitle = getSectionTitle(sec.number);
      const matchTitle = sec.title.toLowerCase().includes(query) || localizedTitle.title.toLowerCase().includes(query) || localizedTitle.short.toLowerCase().includes(query);
      const matchContent = sec.content.toLowerCase().includes(query);
      const matchSub = sec.subsections?.some(
        sub => sub.title.toLowerCase().includes(query) || sub.body.toLowerCase().includes(query)
      );
      return matchTitle || matchContent || matchSub;
    });
  }, [searchQuery, selectedCategory, getSectionTitle]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      const sections = POLICY_SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(POLICY_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(id);
      setMobileTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="policy-content" className="py-12 bg-[#F7FAFC] dark:bg-[#09111e] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Sticky TOC Bar */}
        <div className="lg:hidden sticky top-18 z-30 mb-6 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1455C0] dark:text-[#5B95FF]">{t('policy.toc', 'Table of Contents')}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {activeSectionId.replace('section-', 'Sec. ')} / 25
              </span>
            </div>
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>{mobileTocOpen ? t('policy.closeMenu', 'Close Menu') : t('policy.browseSections', 'Browse Sections')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {mobileTocOpen && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 max-h-72 overflow-y-auto space-y-1">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder={t('policy.searchSections', 'Search 25 policy sections...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                />
              </div>
              {filteredSections.map((sec) => {
                const titleMeta = getSectionTitle(sec.number);
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      activeSectionId === sec.id
                        ? 'bg-[#1455C0] text-white font-medium'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="truncate">
                      {sec.number}. {titleMeta.short}
                    </span>
                    <ChevronRight className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Sidebar (Col 1-4) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-22 space-y-4">
            <div className="bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={effectiveSearchRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  placeholder={t('policy.searchSections', 'Search 25 policy sections...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] focus:ring-1 focus:ring-[#1455C0]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {t('policy.clear', 'Clear')}
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t('policy.filterByTopic', 'Filter By Topic')}
                </span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#1455C0] dark:bg-[#155de0] text-white font-medium'
                          : 'bg-slate-100 dark:bg-[#16233B] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {categoryLabels[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Contents List */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  <span>{t('policy.sectionsLabel', 'Sections')} ({filteredSections.length}/25)</span>
                  <span className="font-mono text-[11px] text-[#1455C0] dark:text-[#5B95FF]">
                    {POLICY_SECTIONS.findIndex(s => s.id === activeSectionId) + 1} {t('policy.activeOf', 'of 25 Active')}
                  </span>
                </div>

                <div className="max-h-[58vh] overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
                  {filteredSections.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                      No sections matching &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredSections.map((section) => {
                      const isActive = activeSectionId === section.id;
                      const titleMeta = getSectionTitle(section.number);
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                            isActive
                              ? 'bg-[#1455C0] dark:bg-[#155de0] text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#172B4D] dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 ${
                                isActive
                                  ? 'bg-white/20 text-white font-bold'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                              }`}
                            >
                              {section.number}
                            </span>
                            <span className="truncate">{titleMeta.short}</span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                              isActive ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                            }`}
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Utility Box in Sidebar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={scrollToTop}
                  className="text-slate-600 dark:text-slate-300 hover:text-[#1455C0] dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{t('policy.backToTop', 'Back to Top')}</span>
                </button>
                <button
                  onClick={() => onOpenRightsModal()}
                  className="text-[#1455C0] dark:text-[#5B95FF] hover:text-[#0f449e] font-semibold transition-colors"
                >
                  {t('policy.submitRequest', 'Submit Request →')}
                </button>
              </div>
            </div>

            {/* Quick Contact Box in Sidebar */}
            <div className="bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#172B4D] dark:text-white">
                <Mail className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
                <span>{t('policy.dpoOfficeInquiries', 'Privacy Office Inquiries')}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                {t('policy.dpoInquiriesHelp', 'Need immediate data clarification or legal assistance? Contact our Data Protection Officer:')}
              </p>
              <a
                href={`mailto:${POLICY_METADATA.dpoEmail}`}
                className="font-mono text-[#1455C0] dark:text-[#5B95FF] hover:underline block truncate"
              >
                {POLICY_METADATA.dpoEmail}
              </a>
            </div>
          </aside>

          {/* Right Main Content Area (Col 5-12) */}
          <main className="lg:col-span-8 space-y-8">
            {/* Search active notice */}
            {searchQuery && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-[#1455C0] dark:text-[#5B95FF] flex items-center justify-between">
                <span>
                  Filtering policy sections containing: <strong>&ldquo;{searchQuery}&rdquo;</strong> ({filteredSections.length} results)
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-semibold underline hover:text-blue-900 dark:hover:text-blue-200"
                >
                  {t('policy.clear', 'Clear')}
                </button>
              </div>
            )}

            {filteredSections.map((sec) => {
              const titleMeta = getSectionTitle(sec.number);
              const localized = getSectionData(sec.number);
              const displayTitle = localized?.title || titleMeta.title;
              const displayContent = localized?.content || sec.content;
              const displaySubsections = localized?.subsections || sec.subsections;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white dark:bg-[#111C30] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs transition-colors duration-200 relative overflow-hidden"
                >
                  {/* Top indicator on active section */}
                  {activeSectionId === sec.id && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#1455C0] dark:bg-[#5B95FF]" />
                  )}

                  {/* Section Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-mono font-semibold text-[#1455C0] dark:text-[#5B95FF]">Section {sec.number}.0</span>
                      <span aria-hidden="true">·</span>
                      <span>{categoryLabels[sec.category] || sec.category}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] dark:text-white tracking-tight">
                      {sec.number}. {displayTitle}
                    </h2>
                  </div>

                  {/* Main section narrative */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                    {displayContent}
                  </p>

                  {/* Table Data (Specifically for Section 11 Data Retention Schedule) */}
                  {sec.tableData && (
                    <div className="mb-6 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#0D1627] shadow-2xs">
                      <div className="px-4 py-3 bg-slate-50 dark:bg-[#16233B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Table className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
                          <span className="text-xs font-bold text-[#172B4D] dark:text-white">
                            {t('policy.scheduleTitle', 'MsmeBooks Statutory Data Retention Schedule')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {t('policy.scheduleSub', 'NDPA 2023 & Fiscal Tax Mandates')}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100/70 dark:bg-[#111C30] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                              {sec.tableData.headers.map((h, i) => (
                                <th key={i} className="p-3 whitespace-nowrap">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sec.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-3 font-medium text-[#172B4D] dark:text-white whitespace-nowrap">
                                  {row[0]}
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-300">
                                  {row[1]}
                                </td>
                                <td className="p-3 font-semibold text-[#1455C0] dark:text-[#5B95FF] whitespace-nowrap">
                                  {row[2]}
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                                  {row[3]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Subsections */}
                  {displaySubsections && displaySubsections.length > 0 && (
                    <div className="space-y-4">
                      {displaySubsections.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-xl bg-[#F7FAFC] dark:bg-[#0D1627] border border-slate-200/80 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-baseline gap-2">
                            {sub.letter && (
                              <span className="w-5 h-5 rounded-md bg-[#1455C0] dark:bg-[#155de0] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {sub.letter}
                              </span>
                            )}
                            <h3 className="text-sm font-bold text-[#172B4D] dark:text-white">
                              {sub.title}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {sub.body}
                          </p>

                          {/* Bullet items */}
                          {sub.items && sub.items.length > 0 && (
                            <ul className="mt-2 space-y-1.5 pl-2">
                              {sub.items.map((item, iIdx) => (
                                <li key={iIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1455C0] dark:bg-[#5B95FF] shrink-0 mt-1.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section-specific interactive tool buttons */}
                  {sec.id === 'section-12' && (
                    <div className="mt-5 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#1455C0] dark:text-[#5B95FF]">
                          {t('policy.cookieBannerTitle', 'Configure Your Browser Cookies')}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {t('policy.cookieBannerDesc', 'Choose which non-essential cookies are active on your device.')}
                        </p>
                      </div>
                      <button
                        onClick={onOpenCookieModal}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>{t('policy.cookieBtn', 'Cookie Preferences')}</span>
                      </button>
                    </div>
                  )}

                  {sec.id === 'section-13' && (
                    <div className="mt-5 space-y-3">
                      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {t('policy.exerciseRightsTitle', 'Exercise Your Privacy Rights')}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {t('policy.exerciseRightsDesc', 'Request data access, rectification, or complete tenant erasure with our automated intake workflow.')}
                          </p>
                        </div>
                        <button
                          onClick={() => onOpenRightsModal()}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>{t('policy.openRightsBtn', 'Open Rights Centre')}</span>
                        </button>
                      </div>

                      {/* Dynamic SAR Statutory Fee Schedule Notice */}
                      <div className="p-3 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#5B95FF] shrink-0" />
                          <span>
                            <strong>Statutory SAR Fees:</strong> Standard subject access requests are <strong>Free of Charge</strong>. Manifestly unfounded or administrative duplicate filings capped at <strong>{formatMoney(5_000)}</strong>.
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline">
                          ({currencyMeta.code})
                        </span>
                      </div>
                    </div>
                  )}

                  {sec.id === 'section-14' && (
                    <div className="mt-5 space-y-3">
                      {/* Statutory Fine & Penalty Thresholds Card */}
                      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                              NDPA 2023 Statutory Penalty Thresholds (Sections 48 & 49)
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                            {currencyMeta.flag} Live: {currencyMeta.code}
                          </span>
                        </div>
                        <p className="text-xs text-amber-950 dark:text-amber-100/90 leading-relaxed">
                          Under the Nigeria Data Protection Act, supervisory penalty ceilings for non-compliance are statutory benchmarks:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 bg-white dark:bg-[#111C30] rounded-lg border border-amber-200/60 dark:border-amber-800/50">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Standard Data Controllers</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                              {formatMoney(10_000_000)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              (Base: ₦10,000,000 or 2% of annual gross revenue)
                            </span>
                          </div>
                          <div className="p-2.5 bg-white dark:bg-[#111C30] rounded-lg border border-amber-200/60 dark:border-amber-800/50">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Major Data Controllers</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                              {formatMoney(10_000_000)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              (Statutory ceiling or higher statutory order)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-300">
                          {t('policy.supervisoryBody', 'Official Supervisory Body: Nigeria Data Protection Commission (NDPC)')}
                        </span>
                        <a
                          href="https://ndpc.gov.ng"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1455C0] dark:text-[#5B95FF] hover:underline font-semibold flex items-center gap-1 shrink-0"
                        >
                          <span>ndpc.gov.ng</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {sec.id === 'section-16' && (
                    <div className="mt-5 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
                          <h4 className="text-xs font-bold text-[#1455C0] dark:text-[#5B95FF]">
                            Platform Transaction & Payment Settlement Thresholds
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-semibold">
                          {currencyMeta.code} ({currencyMeta.symbol})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 bg-white dark:bg-[#111C30] rounded-lg border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Daily POS Batch Settlement</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                            {formatMoney(25_000_000)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Base: ₦25M per merchant</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#111C30] rounded-lg border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Dispute Indemnity Buffer</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                            {formatMoney(5_000_000)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Base: ₦5M reserve buffer</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#111C30] rounded-lg border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Pan-African MSME Ledger Volume</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                            {formatMoney(50_000_000_000, { compact: true })}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Base: ₦50B total transacted</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Highlight / Governance Note */}
                  {sec.highlightNote && (
                    <div className="mt-5 p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
                      <span className="font-semibold shrink-0">{t('policy.govNotice', 'Governance Notice:')}</span>
                      <span>{sec.highlightNote}</span>
                    </div>
                  )}
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
};
