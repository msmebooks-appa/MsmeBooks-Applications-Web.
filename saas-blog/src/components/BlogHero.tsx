import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BlogHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (category: string) => void;
}

export const BlogHero: React.FC<BlogHeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const { t, dict } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
  };

  const trendingTopics = [
    { label: dict.hero.topicAccounting, category: 'Accounting' },
    { label: dict.hero.topicPos, category: 'POS' },
    { label: dict.hero.topicInventory, category: 'Inventory' },
    { label: dict.hero.topicCashflow, category: 'Finance' },
    { label: dict.hero.topicRetail, category: 'Retail' },
    { label: dict.hero.topicAi, category: 'AI & Automation' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-[#050E1A] dark:via-[#071527] dark:to-[#091C33] pt-16 pb-20 border-b border-slate-200/60 dark:border-slate-800">
      {/* Decorative ambient background rings in MsmeBooks blue & subtle lemon tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-lime-400/15 dark:bg-lime-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Anti-slop clean kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-transparent dark:border-blue-800/60 text-xs font-semibold uppercase tracking-wider mb-6">
          <TrendingUp className="w-3.5 h-3.5 text-blue-700 dark:text-lime-400" />
          <span>{t('hero.kicker')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
          <span className="text-blue-800 dark:text-blue-200 font-medium">{t('hero.updatedWeekly')}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12] mb-6">
          {t('hero.titlePart1')}{' '}
          <span className="text-blue-700 dark:text-lime-400 underline decoration-lime-400 decoration-wavy decoration-2">
            {t('hero.titleHighlight')}
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {t('hero.subtitle')}
        </p>

        {/* Search Field with lemon-green search button */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
          <div className="flex flex-col sm:flex-row items-center p-2 bg-white dark:bg-[#0B1E36] rounded-2xl sm:rounded-full shadow-lg shadow-blue-900/5 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-lime-400 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-lime-400/20 transition-all">
            <div className="flex items-center w-full px-3 py-2 sm:py-0">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 bg-transparent text-sm sm:text-base focus:outline-none"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery('');
                    onSearchChange('');
                    onSearchSubmit('');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
                >
                  {t('hero.clear')}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0 px-7 py-3 rounded-xl sm:rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{t('hero.searchButton')}</span>
            </button>
          </div>
        </form>

        {/* Trending Topic quick links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.trendingTopics')}</span>
          {trendingTopics.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelectCategory(item.category);
              }}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0E2443] border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 hover:border-blue-300 dark:hover:border-lime-500 hover:bg-blue-50/50 dark:hover:bg-[#122E54] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
