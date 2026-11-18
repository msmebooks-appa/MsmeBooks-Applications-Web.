import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { POLICY_FAQS } from '../data/policyData';
import { useLanguage } from '../context/LanguageContext';

interface FaqSectionProps {
  onContactSupportClick: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onContactSupportClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-2']);
  const { t } = useLanguage();

  const categories = ['All', 'Subscriptions', 'Add-ons & Services', 'Payment & Disputes', 'Partners & Data'];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All':
        return t('faq.all', 'All');
      case 'Subscriptions':
        return t('faq.catSubscriptions', 'Subscriptions');
      case 'Add-ons & Services':
        return t('faq.catAddons', 'Add-ons & Services');
      case 'Payment & Disputes':
        return t('faq.catPayments', 'Payment & Disputes');
      case 'Partners & Data':
        return t('faq.catPartners', 'Partners & Data');
      default:
        return cat;
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = POLICY_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq-section" className="scroll-mt-24 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>{t('faq.tag', '16. Subscriber Knowledge Base')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
          {t('faq.title', 'Frequently Asked Questions')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          {t('faq.subtitle', 'Instant answers to 24+ common questions regarding subscriptions, refund turnaround, invoices, and dispute resolution.')}
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('faq.searchPlaceholder', 'Search FAQs (e.g. duplicate payment, annual plan, data retention, WhatsApp)...')}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-150 shadow-xs"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full py-4 px-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-lime-700 dark:text-lime-300 bg-lime-50 dark:bg-lime-950/40 px-2 py-0.5 rounded border border-lime-200 dark:border-lime-800/40">
                      {getCategoryLabel(faq.category)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-blue-950 dark:text-white mt-1">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 mt-1 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-900 dark:text-lime-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">No matching questions found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try different keywords or contact our billing desk directly on WhatsApp.
            </p>
          </div>
        )}
      </div>

      {/* Still Need Help Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-blue-900 dark:border-slate-800">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-lime-400" />
            <span>{t('faq.needHelp', 'Still have questions about your billing statement?')}</span>
          </h3>
          <p className="text-xs text-slate-300">
            {t('faq.needHelpDesc', 'Our finance and compliance specialists are available to guide you through your account records.')}
          </p>
        </div>
        <button
          onClick={onContactSupportClick}
          className="px-5 py-2.5 text-xs font-bold text-blue-950 bg-lime-400 hover:bg-lime-300 active:bg-lime-500 rounded-lg shrink-0 transition-colors whitespace-nowrap"
        >
          {t('faq.contactBtn', 'Contact Billing Support')}
        </button>
      </div>
    </section>
  );
};

