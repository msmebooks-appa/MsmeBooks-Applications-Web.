import React, { useState } from 'react';
import { FaqItemData } from '../types/faq';
import { FaqItem } from './FaqItem';
import { useI18n } from '../context/I18nContext';
import { Flame, ArrowRight, HelpCircle } from 'lucide-react';

interface PopularFaqsProps {
  faqs: FaqItemData[];
  onVoteHelpful: (faqId: string, helpful: boolean) => void;
  onExploreAll: () => void;
  onOpenFaqInExplorer?: (faqId: string) => void;
}

export const PopularFaqs: React.FC<PopularFaqsProps> = ({
  faqs,
  onVoteHelpful,
  onExploreAll,
  onOpenFaqInExplorer
}) => {
  const { t } = useI18n();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Filter top popular & featured FAQs
  const popularFaqs = faqs
    .filter((f) => f.publicationStatus === 'Published' && (f.isFeatured || f.isPopular))
    .slice(0, 8);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="py-12 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" id="featured-faqs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {t('popular.badge', 'Quick Knowledge')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
              {t('popular.title', 'Most Frequently Asked Questions')}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('popular.description', 'The essential answers every business owner, accountant, and partner asks about MsmeBooks.')}
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1254B5] dark:text-[#B7E522] hover:text-[#0A3D87] dark:hover:underline self-start cursor-pointer"
          >
            <span>{t('popular.exploreAll', 'Explore All Questions')} ({faqs.length}+)</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* 2-Column Responsive Popular FAQs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {popularFaqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => toggleFaq(faq.id)}
              onVoteHelpful={onVoteHelpful}
              allFaqs={faqs}
              onSelectRelatedQuestion={(relId) => {
                if (popularFaqs.some((item) => item.id === relId)) {
                  setOpenFaqId(relId);
                } else {
                  onOpenFaqInExplorer?.(relId);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
