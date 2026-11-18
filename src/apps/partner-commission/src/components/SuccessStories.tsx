import React from 'react';
import { MapPin } from 'lucide-react';
import { CASE_STUDIES } from '../data/partnerData';
import { useCurrency } from '../context/CurrencyContext';

export const SuccessStories: React.FC = () => {
  const { currency, formatFromNGN } = useCurrency();
  return (
    <section className="py-20 lg:py-28 bg-[#F7FAFC] dark:bg-[#0B1528] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>Verified Case Studies</span>
            <span aria-hidden="true">·</span>
            <span>Pan-African Partner Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            Growing Businesses Together Across Africa and Beyond
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            See how accounting firms, hardware retailers, and business advisers build compounding recurring revenue while helping local SMEs adopt modern business technology.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => {
            const isFinancialMetric = study.metric.startsWith('₦');
            const displayMetric = isFinancialMetric
              ? currency === 'NGN'
                ? study.metric
                : formatFromNGN(15100000, { compact: true })
              : study.metric;

            return (
              <div
                key={study.id}
                className="bg-white dark:bg-[#14233c] rounded-2xl border border-slate-200 dark:border-slate-700/80 p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-6">
                  {/* Partner Header with Avatar & Details */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                    <img
                      src={study.avatarImg}
                      alt={study.partnerName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#1261B5]/20 dark:border-[#B9E51C]/40 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#142D4E] dark:text-white leading-tight">
                        {study.partnerName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{study.organization}</p>
                      <div className="flex items-center gap-2 text-[11px] text-[#1261B5] dark:text-[#B9E51C] font-semibold mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{study.city}, {study.country}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{study.tier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-[#142D4E] dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                        Business Challenge:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">{study.challenge}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider text-[10px] block mb-1">
                        MsmeBooks Partnership:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">{study.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Quantified Metric Badge */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-[#0e1b30] -mx-7 -mb-7 p-5 rounded-b-2xl">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {study.metricLabel}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#142D4E] dark:text-[#B9E51C] font-mono mt-0.5">
                      {displayMetric}
                    </span>
                    {isFinancialMetric && currency !== 'NGN' && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        (≈ ₦15.1M)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    "{study.outcome}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom verification badge */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            *Partner profiles and commercial achievements represent verified MsmeBooks partner case studies. Individual recurring earnings vary by customer volume, tier status, and subscription values.
          </p>
        </div>
      </div>
    </section>
  );
};
