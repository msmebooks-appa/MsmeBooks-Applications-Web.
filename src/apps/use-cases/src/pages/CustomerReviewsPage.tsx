import React, { useState } from 'react';
import { CustomerReview, SuccessStory } from '../types';
import { ReviewModal } from '../components/ReviewModal';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Filter,
  MessageSquarePlus,
  ArrowRight,
  Layers,
  MapPin,
  Building,
  Quote,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface CustomerReviewsPageProps {
  reviews: CustomerReview[];
  stories: SuccessStory[];
  onSelectStory: (slug: string) => void;
  onOpenDemo: () => void;
  onAddNewReview: (review: any) => void;
}

export const CustomerReviewsPage: React.FC<CustomerReviewsPageProps> = ({
  reviews,
  stories,
  onSelectStory,
  onOpenDemo,
  onAddNewReview,
}) => {
  const { t } = useLanguage();
  const { currencyInfo, formatUSD } = useCurrency();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const filteredReviews = reviews.filter((rev) => {
    if (selectedIndustry !== 'all' && !rev.industry.toLowerCase().includes(selectedIndustry.toLowerCase())) {
      return false;
    }
    if (selectedModule !== 'all' && !rev.modulesUsed.some((m) => m.toLowerCase().includes(selectedModule.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* Header */}
      <section className="bg-white dark:bg-[#091827] border-b border-slate-200/80 dark:border-[#162D42] pt-12 pb-14 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="text-[#0A3D62] dark:text-sky-300 uppercase tracking-wider">{t.reviewsPage.badge}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Real MSME Experiences</span>
            <span aria-hidden="true">&middot;</span>
            <span className="font-mono text-[#6A9E13] dark:text-[#90CF24] bg-emerald-50 dark:bg-[#0D2619] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{formatUSD(14200000, { compact: true })} Client Volume Audited ({currencyInfo.code})</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
                {t.reviewsPage.title}
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.reviewsPage.subtitle}
              </p>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto transition-all"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#90CF24]" />
              <span>{t.reviewsPage.submitReview}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Verification Policy Alert Banner */}
        <div className="bg-[#F4F9EC] dark:bg-[#112718] border border-[#7CB518]/40 dark:border-[#7CB518]/50 rounded-xl p-4 flex items-center justify-between gap-4 text-xs transition-colors">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#6A9E13] dark:text-[#90CF24] shrink-0" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Verification Guarantee:</strong> In accordance with MsmeBooks Editorial Standards, published reviews undergo identity and authorization verification. Reviews marked with (Illustrative Profile) demonstrate typical workflows.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0C1E30] p-4 rounded-xl border border-slate-200 dark:border-[#1A3852] shadow-xs flex flex-wrap items-center gap-4 text-xs transition-colors">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Reviews:</span>
          </div>

          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
            >
              <option value="all">All Industries</option>
              <option value="retail">Retail &amp; Supermarkets</option>
              <option value="restaurant">Restaurants &amp; Dining</option>
              <option value="wholesale">Wholesale &amp; Distribution</option>
              <option value="accounting">Accounting &amp; Bookkeeping</option>
              <option value="ecommerce">E-commerce &amp; Omnichannel</option>
            </select>
          </div>

          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
            >
              <option value="all">All Modules</option>
              <option value="pos">Point of Sale (POS)</option>
              <option value="inventory">Inventory &amp; Stock</option>
              <option value="accounting">Accounting &amp; Ledger</option>
              <option value="multi-branch">Multi-branch Operations</option>
            </select>
          </div>

          <div className="ml-auto text-slate-400 dark:text-slate-500 font-mono text-[11px]">
            Showing {filteredReviews.length} reviews
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#0C1E30] rounded-2xl border border-slate-200 dark:border-[#1A3852] shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-sky-400/50 transition-all"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162D42] pb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{rev.date}</span>
                </div>

                {/* Quote */}
                <blockquote className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>

                {/* Detailed Feedback */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.detailedFeedback}
                </p>

                {/* Modules Tagging */}
                <div className="pt-2 flex flex-wrap gap-1 text-[10px]">
                  {rev.modulesUsed.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-[#10273D] text-slate-700 dark:text-slate-300 rounded font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Profile Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#162D42] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{rev.customerName}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{rev.role} &middot; {rev.companyName}</p>
                  </div>
                  {rev.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] text-[#6A9E13] dark:text-[#90CF24] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24]" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {rev.region}
                  </span>
                  {rev.linkedStorySlug && (
                    <button
                      onClick={() => onSelectStory(rev.linkedStorySlug!)}
                      className="text-[#0A3D62] dark:text-sky-300 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Full Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="mt-12 bg-[#0A3D62] dark:bg-[#0A2942] text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Have Questions About Your Business Setup?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Talk with our product implementation advisors to evaluate how MsmeBooks integrates with your hardware and workflow.
            </p>
          </div>
          <button
            onClick={onOpenDemo}
            className="px-6 py-3 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] text-xs sm:text-sm font-bold rounded-lg cursor-pointer whitespace-nowrap"
          >
            Book a Free Demo
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitReview={(newRev) => {
          onAddNewReview(newRev);
        }}
      />
    </div>
  );
};
