import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { blogCategories } from '../data/mockArticles';
import { useLanguage } from '../context/LanguageContext';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  articleCounts?: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  articleCounts = {}
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { translateCategory } = useLanguage();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="relative border-y border-slate-200/80 dark:border-slate-800 py-3 bg-white/70 dark:bg-[#0B1E36]/80 backdrop-blur-sm rounded-2xl shadow-sm px-2">
        {/* Left Scroll arrow on desktop */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0E2443] shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 hover:bg-slate-50 dark:hover:bg-[#132F55] z-10 transition-all"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-2 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blogCategories.map((category) => {
            const isActive = activeCategory.toLowerCase() === category.toLowerCase();
            const count = articleCounts[category];

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-900 dark:bg-lime-400 text-white dark:text-slate-950 shadow-sm ring-2 ring-lime-400 dark:ring-lime-300 font-bold'
                    : 'bg-slate-100/80 dark:bg-[#0E2443] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#15345E] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-slate-750'
                }`}
              >
                <span>{translateCategory(category)}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-lime-400 dark:bg-slate-900 text-slate-950 dark:text-lime-400'
                        : 'bg-white dark:bg-[#071527] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 dark:bg-slate-950 ml-0.5 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll arrow on desktop */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0E2443] shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 hover:bg-slate-50 dark:hover:bg-[#132F55] z-10 transition-all"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
