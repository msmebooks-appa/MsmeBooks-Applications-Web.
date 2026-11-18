import React from 'react';
import { FAQ_CATEGORIES } from '../data/categories';
import { FaqCategory, FaqItemData } from '../types/faq';
import { DynamicIcon } from './DynamicIcon';
import { useI18n } from '../context/I18nContext';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';

interface CategoryGridProps {
  faqs: FaqItemData[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  faqs,
  selectedCategoryId,
  onSelectCategory
}) => {
  const { t } = useI18n();

  // Compute dynamic FAQ count per category
  const getFaqCount = (catId: string) => {
    return faqs.filter(
      (f) => f.categoryId === catId && f.publicationStatus === 'Published'
    ).length;
  };

  return (
    <section className="py-14 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" id="faq-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] tracking-wider uppercase mb-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
              {t('cat.badge', 'Structured Knowledge Architecture')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
              {t('cat.title', 'Explore Answers by Category')}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('cat.description', 'Choose a topic to quickly find the exact information and step-by-step guides you need.')}
            </p>
          </div>

          {selectedCategoryId && (
            <button
              onClick={() => onSelectCategory('')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition self-start cursor-pointer"
            >
              <span>{t('cat.clearSelection', 'Reset Category Filter')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1254B5] dark:bg-[#B7E522]"></span>
            </button>
          )}
        </div>

        {/* Responsive Grid of Category Cards (Section 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {FAQ_CATEGORIES.map((cat: FaqCategory) => {
            const count = getFaqCount(cat.id);
            const isSelected = selectedCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const explorerEl = document.getElementById('faq-explorer');
                  if (explorerEl) {
                    explorerEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#EBF2FE] dark:bg-[#162A52] border-[#1254B5] dark:border-[#3B82F6] shadow-md ring-2 ring-[#1254B5]/20 dark:ring-blue-500/30'
                    : 'bg-[#F8FAFC] dark:bg-[#131E36] hover:bg-white dark:hover:bg-[#182645] border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-950/40 hover:-translate-y-0.5'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCategory(cat.id);
                  }
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#1254B5] text-white shadow-xs'
                          : 'bg-white dark:bg-[#192642] text-[#1254B5] dark:text-[#B7E522] border border-slate-200 dark:border-slate-700 group-hover:bg-[#1254B5] group-hover:text-white'
                      }`}
                    >
                      <DynamicIcon name={cat.iconName} className="w-5 h-5" />
                    </div>

                    {cat.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4FCD9] text-[#17233D] border border-[#B7E522] shadow-2xs">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#17233D] dark:text-slate-100 group-hover:text-[#1254B5] dark:group-hover:text-[#B7E522] transition-colors leading-snug">
                    {cat.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 font-mono">
                    {count} {count === 1 ? 'Answer' : 'Answers'}
                  </span>
                  
                  <span
                    className={`inline-flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-[#1254B5] dark:text-[#B7E522]' : 'text-slate-400 dark:text-slate-500 group-hover:text-[#1254B5] dark:group-hover:text-[#B7E522]'
                    }`}
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
