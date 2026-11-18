import React, { useState } from 'react';
import { mockGuides } from '../data/mockGuides';
import { BusinessGuide } from '../types';
import { BookOpen, ArrowRight, Clock, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BusinessGuidesProps {
  onSelectCategoryFilter: (cat: string) => void;
}

export const BusinessGuides: React.FC<BusinessGuidesProps> = ({
  onSelectCategoryFilter,
}) => {
  const [activeGuideModal, setActiveGuideModal] = useState<BusinessGuide | null>(null);
  const { dict, translateCategory } = useLanguage();

  return (
    <section className="bg-slate-100/60 dark:bg-[#071527] py-16 border-y border-slate-200 dark:border-slate-800" id="business-guides">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400 bg-white dark:bg-[#102A4C] px-3 py-1 rounded-full shadow-sm mb-3">
              <BookOpen className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>{dict.resourceDropdown.businessGuides}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {dict.guides.heading}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              {dict.guides.subheading}
            </p>
          </div>

          <button
            onClick={() => onSelectCategoryFilter('Accounting')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-lime-400 hover:text-blue-900 dark:hover:text-lime-300 group"
          >
            <span>{dict.guides.readGuide}</span>
            <ArrowRight className="w-4 h-4 text-lime-600 dark:text-lime-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Major Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setActiveGuideModal(guide)}
              className="group bg-white dark:bg-[#0B1E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm dark:shadow-slate-950/40 hover:shadow-xl hover:border-blue-400 dark:hover:border-lime-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                      {guide.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    {guide.readTime}
                  </span>
                  <span>·</span>
                  <span>{guide.modulesCount} Deep Modules</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors leading-snug mb-2">
                  {guide.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {guide.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-blue-700 dark:text-lime-400 group-hover:text-blue-900 dark:group-hover:text-lime-300">
                  Read Guide Modules
                </span>
                <div className="w-7 h-7 rounded-full bg-lime-100 dark:bg-lime-950/60 group-hover:bg-lime-400 dark:group-hover:bg-lime-400 text-slate-900 dark:text-lime-300 dark:group-hover:text-slate-950 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0B1E36] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase">
              {activeGuideModal.category} Curricula
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 mb-3">
              {activeGuideModal.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {activeGuideModal.description}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Curriculum Modules Included:
              </h4>
              <div className="space-y-3">
                {activeGuideModal.keyTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E2443] border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-lime-400 text-slate-950 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{topic}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-lime-400">Available</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectCategoryFilter(activeGuideModal.category.split(' ')[0]);
                  setActiveGuideModal(null);
                  const el = document.getElementById('articles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors text-center"
              >
                Browse Related Articles
              </button>
              <a
                href="https://www.msmebooks.org/register"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-sm transition-colors text-center"
              >
                Access Full MsmeBooks Toolkit
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
