import React, { useState } from 'react';
import { FaqItemData } from '../types/faq';
import { FaqItem } from './FaqItem';
import { Layers, ArrowRight, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface SharedFaqShowcaseProps {
  faqs: FaqItemData[];
  onVoteHelpful: (faqId: string, helpful: boolean) => void;
  onNavigateToHubWithFilter: (categoryId: string | null, industryId: string | null) => void;
  onOpenFaqInExplorer?: (faqId: string) => void;
}

interface SimulatedPage {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  filterFn: (faq: FaqItemData) => boolean;
  targetCategory: string | null;
  targetIndustry: string | null;
}

export const SharedFaqShowcase: React.FC<SharedFaqShowcaseProps> = ({
  faqs,
  onVoteHelpful,
  onNavigateToHubWithFilter,
  onOpenFaqInExplorer
}) => {
  const simulatedPages: SimulatedPage[] = [
    {
      id: 'page-hotel',
      title: 'Hotel & Property Management Landing Page',
      category: 'Hospitality & PMS',
      badge: 'PMS Add-on',
      description: 'Automatically receives Hotel PMS, guest folios, restaurant dining POS, and room revenue FAQs.',
      filterFn: (f) =>
        f.categoryId === 'hotel-management' ||
        Boolean(f.industryIds && f.industryIds.includes('hotels-pms')) ||
        f.id === 'faq-hotel-pms-available',
      targetCategory: 'hotel-management',
      targetIndustry: 'hotels-pms'
    },
    {
      id: 'page-accounting',
      title: 'Accounting Product Landing Page',
      category: 'Core Financials',
      badge: 'Core Module',
      description: 'Dynamically embeds General Ledger, P&L, balance sheets, VAT tax reporting, and remote accountant access.',
      filterFn: (f) =>
        f.categoryId === 'accounting' ||
        Boolean(f.productModuleIds && f.productModuleIds.includes('module-accounting')),
      targetCategory: 'accounting',
      targetIndustry: null
    },
    {
      id: 'page-pharmacy',
      title: 'Pharmacy & Healthcare Stores Landing Page',
      category: 'Healthcare Retail',
      badge: 'Industry Solution',
      description: 'Automatically surfaces batch tracking, medicine expiry date FEFO rules, and barcode checkout questions.',
      filterFn: (f) =>
        Boolean(f.industryIds && f.industryIds.includes('pharmacies')) ||
        f.id === 'faq-inventory-batch-expiry',
      targetCategory: null,
      targetIndustry: 'pharmacies'
    },
    {
      id: 'page-pricing',
      title: 'Pricing & Subscription Landing Page',
      category: 'Billing & Plans',
      badge: 'Commercial',
      description: 'Supplies Free plan vs Enterprise comparisons, upgrade prorating, add-on costs, and refund guarantees.',
      filterFn: (f) => f.categoryId === 'pricing-billing',
      targetCategory: 'pricing-billing',
      targetIndustry: null
    },
    {
      id: 'page-pos',
      title: 'Point of Sale (POS) Hardware & Software Page',
      category: 'Retail POS',
      badge: 'Store Operations',
      description: 'Displays barcode scanners, receipt printers, cashier shifts, and offline capability FAQs.',
      filterFn: (f) => f.categoryId === 'pos',
      targetCategory: 'pos',
      targetIndustry: null
    },
    {
      id: 'page-partners',
      title: 'Partners & Resellers Program Page',
      category: 'Growth & Affiliates',
      badge: '15% - 40% Commission',
      description: 'Delivers partner tier commissions (Bronze, Silver, Gold, Platinum), tracking, and accountant partner benefits.',
      filterFn: (f) => f.categoryId === 'partners-resellers',
      targetCategory: 'partners-resellers',
      targetIndustry: null
    }
  ];

  const [activePageId, setActivePageId] = useState<string>('page-hotel');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const activePage = simulatedPages.find((p) => p.id === activePageId) || simulatedPages[0];

  // Dynamic slice of 5-8 matching FAQs from central database
  const pageFaqs = faqs
    .filter((f) => f.publicationStatus === 'Published' && activePage.filterFn(f))
    .slice(0, 6);

  return (
    <section className="py-16 bg-[#F8FAFC] dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" id="shared-faq-system">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Architecture Highlight Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
            Enterprise Reusability Standard (Section 29)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
            Centralized FAQ Syndication Across All MsmeBooks Pages
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            One single, verified database powers contextual FAQ accordions across every product, industry, pricing, and company landing page. When an answer is updated in the CMS, all landing pages update instantly.
          </p>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {simulatedPages.map((page) => {
            const isSelected = activePageId === page.id;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setActivePageId(page.id);
                  setOpenFaqId(null);
                }}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1254B5] text-white shadow-md'
                    : 'bg-white dark:bg-[#131E36] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C294A] border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{page.category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {page.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Embedded Container Preview */}
        <div className="bg-white dark:bg-[#131E36] rounded-2xl border-2 border-dashed border-[#1254B5]/40 dark:border-blue-500/40 p-6 sm:p-8 shadow-sm transition-colors duration-300">
          {/* Simulated Browser Frame Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 ml-2">
                Simulated Landing Page: {activePage.title}
              </span>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Synced with Central Hub</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#17233D] dark:text-white">
              Frequently Asked Questions on {activePage.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activePage.description}
            </p>
          </div>

          {/* Rendered Accordion items */}
          <div className="space-y-3">
            {pageFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openFaqId === faq.id}
                onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                onVoteHelpful={onVoteHelpful}
                allFaqs={faqs}
                onSelectRelatedQuestion={(relId) => {
                  if (pageFaqs.some((item) => item.id === relId)) {
                    setOpenFaqId(relId);
                  } else {
                    onOpenFaqInExplorer?.(relId);
                  }
                }}
              />
            ))}
          </div>

          {/* Contextual Route to Full Hub (Section 29) */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong>{pageFaqs.length}</strong> contextually relevant questions for this landing page.
            </span>

            <button
              onClick={() =>
                onNavigateToHubWithFilter(activePage.targetCategory, activePage.targetIndustry)
              }
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1254B5] dark:text-[#B7E522] hover:text-[#0A3D87] dark:hover:underline cursor-pointer"
            >
              <span>View All Frequently Asked Questions →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
