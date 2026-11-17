import React, { useState, useEffect } from 'react';
import { Search, Compass, ChevronDown, Check, Printer } from 'lucide-react';
import { POLICY_NAV_SECTIONS } from '../data/policyData';
import { useLanguage } from '../context/LanguageContext';

interface TableOfContentsProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeSection,
  onSectionClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSections = POLICY_NAV_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="space-y-4">
      {/* Sticky reading progress card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>{t('toc.readingProgress', 'Reading Progress')}</span>
          </div>
          <span className="font-mono text-blue-900 dark:text-lime-400">{Math.round(scrollProgress)}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-lime-500 h-1.5 transition-all duration-150 rounded-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Navigation panel */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            {t('toc.policyNavigation', 'Policy Navigation')}
          </h2>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {POLICY_NAV_SECTIONS.length} {t('toc.sections', 'Sections')}
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('toc.searchPlaceholder', 'Search policy topics...')}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Anchor Links List */}
        <nav className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {filteredSections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionClick(sec.id);
                }}
                className={`group flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-900 dark:bg-blue-800 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`font-mono text-[10px] mt-0.5 shrink-0 ${
                    isActive ? 'text-lime-300 font-bold' : 'text-slate-400 dark:text-slate-500 group-hover:text-lime-600 dark:group-hover:text-lime-400'
                  }`}
                >
                  {sec.number}
                </span>
                <span className="truncate">{sec.title}</span>
              </a>
            );
          })}

          {filteredSections.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
              No matching policy topics found.
            </p>
          )}
        </nav>

        {/* Print / Save PDF tool */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="w-full py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t('toc.printBtn', 'Print Policy Document')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

