import React, { useState } from 'react';
import { INDUSTRIES } from '../data/industries';
import { FaqItemData } from '../types/faq';
import { FaqItem } from './FaqItem';
import { DynamicIcon } from './DynamicIcon';
import { Building2, ArrowRight, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface IndustryFaqDirectoryProps {
  faqs: FaqItemData[];
  onVoteHelpful: (faqId: string, helpful: boolean) => void;
  onFilterIndustryInExplorer: (industryId: string) => void;
  onOpenFaqInExplorer?: (faqId: string) => void;
}

export const IndustryFaqDirectory: React.FC<IndustryFaqDirectoryProps> = ({
  faqs,
  onVoteHelpful,
  onFilterIndustryInExplorer,
  onOpenFaqInExplorer
}) => {
  const [activeIndustryId, setActiveIndustryId] = useState<string>('supermarkets');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const activeIndustry = INDUSTRIES.find((i) => i.id === activeIndustryId) || INDUSTRIES[0];

  // Get FAQs tagged with this industry
  const industryFaqs = faqs.filter(
    (f) =>
      f.publicationStatus === 'Published' &&
      f.industryIds &&
      f.industryIds.includes(activeIndustry.id)
  );

  return (
    <section className="py-16 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header (Section 13) */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
            Tailored Industry Workflows
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
            Frequently Asked Questions for Your Industry
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Discover how MsmeBooks supports the unique operational and accounting needs of businesses across different sectors.
          </p>
        </div>

        {/* 20 Industries Horizontal Scroll / Grid Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-1 mb-8 no-scrollbar scroll-smooth">
          {INDUSTRIES.map((ind) => {
            const isSelected = activeIndustryId === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => {
                  setActiveIndustryId(ind.id);
                  setOpenFaqId(null);
                }}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1254B5] text-white shadow-md shadow-blue-900/15'
                    : 'bg-[#F8FAFC] dark:bg-[#131E36] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C294A] border border-slate-200 dark:border-slate-700'
                }`}
              >
                <DynamicIcon
                  name={ind.iconName}
                  className={`w-4 h-4 ${isSelected ? 'text-[#B7E522]' : 'text-[#1254B5] dark:text-[#B7E522]'}`}
                />
                <span>{ind.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Card Banner */}
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-[#131E36] dark:via-[#0F182C] dark:to-[#131E36] p-6 sm:p-8 rounded-2xl border border-blue-100 dark:border-blue-900/50 mb-8 shadow-xs transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1254B5] text-[#B7E522] flex items-center justify-center flex-shrink-0 shadow-sm">
                <DynamicIcon name={activeIndustry.iconName} className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#1254B5] dark:text-[#B7E522]">
                  Industry Focus
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#17233D] dark:text-white mt-0.5">
                  {activeIndustry.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {activeIndustry.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 inline-flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{activeIndustry.highlightBenefit}</span>
                </div>
              </div>
            </div>

            {/* Contextual CTAs (Section 13) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1254B5] hover:bg-[#0A3D87] shadow-xs transition"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B7E522]" />
                <span>Book an Industry Demo</span>
              </a>

              <a
                href="#solutions"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#17233D] bg-[#B7E522] hover:bg-[#a2ce1d] border border-[#a2ce1d] shadow-xs transition"
              >
                <span>Explore {activeIndustry.shortTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Industry FAQs Accordion List */}
        <div className="space-y-3">
          {industryFaqs.length > 0 ? (
            industryFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openFaqId === faq.id}
                onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                onVoteHelpful={onVoteHelpful}
                allFaqs={faqs}
                onSelectRelatedQuestion={(relId) => {
                  if (industryFaqs.some((item) => item.id === relId)) {
                    setOpenFaqId(relId);
                  } else {
                    onOpenFaqInExplorer?.(relId);
                  }
                }}
              />
            ))
          ) : (
            <div className="bg-slate-50 dark:bg-[#131E36] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-600 dark:text-slate-300">
              <p className="text-sm font-medium">
                Additional FAQs for {activeIndustry.shortTitle} are maintained in our central database.
              </p>
              <button
                onClick={() => onFilterIndustryInExplorer(activeIndustry.id)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] hover:underline cursor-pointer"
              >
                <span>Search all questions tagged with {activeIndustry.shortTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
