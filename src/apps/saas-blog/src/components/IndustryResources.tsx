import React, { useState } from 'react';
import { mockIndustries } from '../data/mockIndustries';
import { IndustryResource } from '../types';
import { ArrowRight, CheckCircle2, Building2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface IndustryResourcesProps {
  onSelectIndustryFilter: (industryName: string) => void;
}

export const IndustryResources: React.FC<IndustryResourcesProps> = ({
  onSelectIndustryFilter,
}) => {
  const [selectedIndustryModal, setSelectedIndustryModal] = useState<IndustryResource | null>(null);
  const { dict } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="industry-resources">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400 bg-blue-50 dark:bg-[#102A4C] px-3 py-1 rounded-full mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{dict.nav.solutions}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            {dict.industry.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            {dict.industry.subheading}
          </p>
        </div>
      </div>

      {/* Grid of 12 Industry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockIndustries.map((ind) => (
          <div
            key={ind.id}
            onClick={() => setSelectedIndustryModal(ind)}
            className="group relative bg-white dark:bg-[#0B1E36] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-slate-950/40 hover:shadow-xl hover:border-blue-300 dark:hover:border-lime-500/50 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Industry Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={ind.image}
                alt={ind.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                  {ind.articleCount} Knowledge Resources
                </span>
                <h3 className="text-base font-bold leading-snug group-hover:text-lime-300 transition-colors">
                  {ind.name}
                </h3>
              </div>
            </div>

            {/* Content summary */}
            <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-[#0B1E36]">
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {ind.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-lime-400 group-hover:text-blue-900 dark:group-hover:text-lime-300 transition-colors">
                  View Sector Playbook
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Detail Modal */}
      {selectedIndustryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0B1E36] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedIndustryModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedIndustryModal.image}
                alt={selectedIndustryModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <div>
                  <span className="px-2.5 py-1 rounded bg-lime-400 text-slate-950 text-xs font-extrabold uppercase">
                    Industry Specialization
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {selectedIndustryModal.name}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {selectedIndustryModal.description}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Key MsmeBooks Capabilities for this Sector:
              </h4>
              <div className="space-y-2">
                {selectedIndustryModal.keyCapabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-900/60 mb-6">
              <div className="text-xs font-bold text-blue-900 dark:text-lime-400 uppercase tracking-wider mb-1">
                Verified Customer Outcome:
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                "{selectedIndustryModal.caseStudyHighlight}"
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectIndustryFilter(selectedIndustryModal.name.split(' ')[0]);
                  setSelectedIndustryModal(null);
                  const el = document.getElementById('articles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors text-center"
              >
                Browse {selectedIndustryModal.name} Articles
              </button>
              <a
                href="https://www.msmebooks.org/register"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-sm transition-colors text-center"
              >
                Start Free for this Industry
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
