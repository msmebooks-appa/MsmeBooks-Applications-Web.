import React, { useState } from 'react';
import { SectionItem, LegalCategory } from '../types/terms';
import { Search, ChevronDown, ChevronRight, X, ListFilter, ArrowUp } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';

interface TableOfContentsProps {
  sections: SectionItem[];
  categories: LegalCategory[];
  activeSectionId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSection: (id: string) => void;
  expandedAll: boolean;
  onToggleExpandAll: () => void;
  readProgress: number;
  t: TranslationDictionary;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  categories,
  activeSectionId,
  searchQuery,
  onSearchChange,
  onSelectSection,
  expandedAll,
  onToggleExpandAll,
  readProgress,
  t
}) => {
  // Category collapse states
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'cat-foundations': true,
    'cat-saas-scope': true,
    'cat-data-compliance': true,
    'cat-industry-modules': true,
    'cat-governance-partners': true,
    'cat-legal-liability': true,
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Filter sections by search query
  const filteredSections = searchQuery.trim() === ''
    ? sections
    : sections.filter(sec => {
        const q = searchQuery.toLowerCase();
        return (
          sec.title.toLowerCase().includes(q) ||
          sec.summary.toLowerCase().includes(q) ||
          sec.content.some(c => c.toLowerCase().includes(q)) ||
          sec.definitions?.some(d => d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q))
        );
      });

  const matchingSectionIds = new Set(filteredSections.map(s => s.id));

  // Determine active section name for mobile sticky bar
  const currentActiveSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-80 shrink-0 hidden lg:block no-print">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden transition-colors duration-200">
          {/* Header with Title & Reading Progress */}
          <div className="p-4 bg-slate-50 dark:bg-[#0D2238] border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B3558] dark:text-[#84CC16] flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>{t.toc.title}</span>
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {readProgress}% {t.toc.readProgress}
              </span>
            </div>

            {/* Reading Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-[#84CC16] h-full transition-all duration-150 ease-out"
                style={{ width: `${readProgress}%` }}
              />
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.toc.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#07131F] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16] focus:border-[#0B3558] dark:focus:border-[#84CC16] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search results count / Expand All Toggle */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
              {searchQuery ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  {filteredSections.length} {t.toc.matchCount}
                </span>
              ) : (
                <span>{t.toc.totalNumbered}</span>
              )}
              <button
                onClick={onToggleExpandAll}
                className="hover:text-[#0B3558] dark:hover:text-[#84CC16] font-medium text-slate-600 dark:text-slate-300 transition-colors"
              >
                {expandedAll ? t.toc.collapseAll : t.toc.expandAll}
              </button>
            </div>
          </div>

          {/* Scrollable Section Directory */}
          <div className="overflow-y-auto p-2 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 flex-1 overscroll-contain">
            {categories.map((category) => {
              const categorySections = sections.filter(s =>
                category.sectionIds.includes(s.number) && (searchQuery === '' || matchingSectionIds.has(s.id))
              );

              if (categorySections.length === 0) return null;

              const isOpen = openCategories[category.id] ?? true;

              return (
                <div key={category.id} className="pt-2 first:pt-0">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-[#0B3558] dark:hover:text-[#84CC16] rounded transition-colors text-left"
                  >
                    <span className="truncate">{category.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-1 space-y-0.5 pl-1.5">
                      {categorySections.map((sec) => {
                        const isActive = activeSectionId === sec.id;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => onSelectSection(sec.id)}
                            className={`w-full group flex items-start gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all ${
                              isActive
                                ? 'bg-[#F0F7FD] dark:bg-[#0D2A4A] text-[#0B3558] dark:text-[#A3E635] font-semibold border-l-2 border-[#84CC16]'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-slate-900 dark:hover:text-white font-normal'
                            }`}
                          >
                            <span className={`font-mono text-[11px] tabular-nums shrink-0 mt-0.5 ${
                              isActive ? 'text-[#84CC16] font-bold' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            }`}>
                              {sec.number}.
                            </span>
                            <span className="leading-snug line-clamp-1 truncate">
                              {sec.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Footer Action in TOC */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0D2238] border-t border-slate-200 dark:border-slate-800 text-center transition-colors">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B3558] dark:hover:text-[#84CC16] transition-colors"
            >
              <ArrowUp className="w-3 h-3 text-[#84CC16]" />
              <span>{t.toc.backToTop}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Sticky "Jump to Section" Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 no-print">
        <div className="bg-[#0B3558] dark:bg-[#0A1A2C] text-white p-2.5 rounded-xl shadow-xl flex items-center justify-between border border-blue-900/50 dark:border-slate-700/80 transition-colors">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 text-left truncate flex-1 mr-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#84CC16] shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-blue-200 dark:text-blue-300 uppercase font-semibold leading-none">
                Section {currentActiveSection.number} of {sections.length} ({readProgress}%)
              </div>
              <div className="text-xs font-medium text-white truncate mt-0.5">
                {currentActiveSection.title}
              </div>
            </div>
          </button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#84CC16] text-[#072238] rounded-lg shrink-0"
          >
            {t.toc.jumpToSection}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 dark:bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0A1A2C] rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-t border-slate-200 dark:border-slate-800 transition-colors">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0D2238]">
              <div>
                <h3 className="text-sm font-bold text-[#0B3558] dark:text-white">{t.toc.sectionsTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.toc.jumpDirectly}</p>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search input */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0A1A2C]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.toc.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Section List */}
            <div className="overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onSelectSection(sec.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 py-2.5 px-3 text-left rounded-lg text-xs transition-colors ${
                    activeSectionId === sec.id
                      ? 'bg-[#F0F7FD] dark:bg-[#0D2A4A] text-[#0B3558] dark:text-[#A3E635] font-semibold border-l-2 border-[#84CC16]'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#0D2238]'
                  }`}
                >
                  <span className="font-mono text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 font-bold">
                    {sec.number}.
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white leading-tight">{sec.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{sec.summary}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 dark:bg-[#0D2238] border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#07131F] border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                {t.toc.closeNavigator}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
