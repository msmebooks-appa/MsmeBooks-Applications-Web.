import React from 'react';
import { 
  Star, 
  Quote, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Layers,
  Store,
  Award,
} from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/partnersData';
import { SuccessStoryScale } from '../types';

const getInitials = (name: string): string => {
  if (!name) return 'MB';
  const clean = name.replace(/[^\w\s]/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MB';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarBg = (name: string): string => {
  const gradients = [
    'from-emerald-600 to-teal-700 text-white',
    'from-blue-600 to-indigo-700 text-white',
    'from-amber-600 to-orange-700 text-white',
    'from-purple-600 to-violet-800 text-white',
    'from-sky-600 to-cyan-700 text-white',
    'from-rose-600 to-pink-700 text-white',
    'from-teal-600 to-emerald-800 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

interface ReviewsAndStoriesSectionProps {
  onOpenDirectory: () => void;
  onFilterByScale?: (scale: SuccessStoryScale) => void;
}

export const ReviewsAndStoriesSection: React.FC<ReviewsAndStoriesSectionProps> = ({
  onOpenDirectory,
  onFilterByScale,
}) => {
  const transformationCaseStudies = [
    {
      business: 'Supermarket & FMCG Retail Chain',
      region: 'Lagos & Abuja, Nigeria',
      scale: 'Large-Scale Enterprise' as SuccessStoryScale,
      before: [
        'Manual handwritten bookkeeping and delayed bank slips',
        'Disconnected cash drawers and slow POS queues',
        'Disorganized warehouse inventory and unverified shrinkage',
        'Month-end reconciliations taking up to 14 days'
      ],
      after: [
        'Connected cloud ledger with automatic bank reconciliation',
        'Multi-terminal barcode POS syncing live to central ledger',
        'Real-time automated batch stock tracking and reorder alerts',
        'One-click consolidated daily P&L and sales analytics'
      ],
      metric: '94% Stock Accuracy & 4hr Daily Closing Saved'
    },
    {
      business: 'Casual Dining & Café Restaurant Group',
      region: 'Nairobi & Mombasa, Kenya',
      scale: 'Small Business' as SuccessStoryScale,
      before: [
        'Paper kitchen order tickets lost during peak lunch hours',
        'Separate card and mobile payment slips needing manual entry',
        'Unrecorded kitchen ingredient waste and food shrinkage',
        'Branch managers operating without financial visibility'
      ],
      after: [
        'Touch POS terminals with instant kitchen display routing',
        'Direct M-Pesa till integration with instant reconciliation',
        'Recipe-level inventory deduction on every order rung up',
        'Mobile dashboard for owner to track branch sales from anywhere'
      ],
      metric: '+35% Faster Guest Service & 22% Lower Food Waste'
    },
    {
      business: 'Building Materials & Wholesale Hardware',
      region: 'Johannesburg, South Africa & Accra, Ghana',
      scale: 'Mid-Market' as SuccessStoryScale,
      before: [
        'Fragmented customer credit limits on paper debtor cards',
        'Outdated desktop accounting software vulnerable to crashes',
        'Heavy penalties from delayed tax authority filings (SARS & GRA)',
        'Zero visibility into warehouse transit and damaged stock'
      ],
      after: [
        'Strict automated credit limits and automated WhatsApp statements',
        'Secure MsmeBooks cloud infrastructure with 99.9% uptime',
        'Built-in compliant VAT, WHT, and e-invoicing generation',
        'Multi-depot transfer orders with barcode verification'
      ],
      metric: '100% Tax Filing Compliance & $42k Bad Debt Recovered'
    }
  ];

  return (
    <>
      {/* SECTION 14: PARTNER SUCCESS STORIES (Before vs With MsmeBooks Partner) */}
      <section className="py-20 bg-slate-100/70 dark:bg-[#07162b] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-500/10 border border-lime-300 dark:border-lime-500/30 text-lime-800 dark:text-lime-400 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real African Business Transformations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Businesses Growing With MsmeBooks Partners
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              See the direct operational impact when local SMEs partner with certified MsmeBooks accounting, POS, and technology specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {transformationCaseStudies.map((study, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0c223e] border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 shadow-md dark:shadow-xl flex flex-col justify-between transition-colors duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{study.business}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          study.scale === 'Large-Scale Enterprise'
                            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40'
                            : study.scale === 'Mid-Market'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
                        }`}>
                          {study.scale === 'Large-Scale Enterprise' && <Building2 className="w-2.5 h-2.5" />}
                          {study.scale === 'Mid-Market' && <Layers className="w-2.5 h-2.5" />}
                          {study.scale === 'Small Business' && <Store className="w-2.5 h-2.5" />}
                          <span>{study.scale}</span>
                        </span>
                      </div>
                      <p className="text-xs text-lime-700 dark:text-lime-400 font-bold">{study.region}</p>
                    </div>
                  </div>

                  {/* Before Box */}
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Before MsmeBooks Partner</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {study.before.map((bItem, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                          <span>{bItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transition Arrow Indicator */}
                  <div className="flex items-center justify-center">
                    <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-lime-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <span>Certified Implementation</span>
                      <ArrowRight className="w-3 h-3 text-lime-600 dark:text-lime-400" />
                    </div>
                  </div>

                  {/* With MsmeBooks Partner Box */}
                  <div className="p-3.5 rounded-xl bg-lime-50 dark:bg-lime-950/20 border border-lime-300 dark:border-lime-500/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-lime-800 dark:text-lime-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                      <span>With MsmeBooks Partner</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {study.after.map((aItem, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5">
                          <span className="text-lime-600 dark:text-lime-400 font-bold">✓</span>
                          <span>{aItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-center p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-lime-800 dark:text-lime-300">
                    🏆 {study.metric}
                  </div>
                  {onFilterByScale && (
                    <button
                      type="button"
                      onClick={() => onFilterByScale(study.scale)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-lime-500 hover:text-slate-950 dark:hover:bg-lime-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Find {study.scale} Partners</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <span>Explore Partners Behind These Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 13: PARTNER REVIEWS ("What Businesses Say") */}
      <section className="py-20 bg-slate-50 dark:bg-[#091b34] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-lime-400 mb-2">
                <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                <span>Verified Client Feedback</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                What Businesses Say
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
                Read authentic testimonials from retailers, hospitality operators, and wholesalers who deployed MsmeBooks through our partner network.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm self-start sm:self-auto">
              <span className="text-2xl font-black text-lime-600 dark:text-lime-400">4.92 / 5</span>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <span>Over 1,200+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-[#0b1f3c] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-md dark:shadow-xl flex flex-col justify-between hover:border-lime-500 dark:hover:border-lime-500/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{rev.date}</span>
                  </div>

                  <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-lime-300 border border-blue-200 dark:border-blue-800 inline-block">
                    Service: {rev.serviceReceived}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                    "{rev.testimonial}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarBg(rev.author)} flex items-center justify-center font-bold text-xs border border-lime-500 dark:border-lime-400/60 shrink-0 select-none tracking-wider shadow-xs`}
                    aria-label={`${rev.author} initials`}
                  >
                    {getInitials(rev.author)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      <span>{rev.countryFlag}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {rev.role}, {rev.company}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};
