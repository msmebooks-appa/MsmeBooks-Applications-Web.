import React, { useState } from 'react';
import { mockCaseStudies } from '../data/mockCaseStudies';
import { CaseStudy } from '../types';
import { TrendingUp, ArrowRight, MapPin, CheckCircle, X, DollarSign, Wallet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export const CaseStudiesSection: React.FC = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  const { dict } = useLanguage();
  const { formatFromNGN, currentCurrencyInfo } = useCurrency();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="case-studies">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400 bg-blue-50 dark:bg-[#102A4C] px-3.5 py-1.5 rounded-full mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          <span>{dict.resourceDropdown.customerStories}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          {dict.caseStudies.heading}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
          {dict.caseStudies.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockCaseStudies.map((cs) => (
          <div
            key={cs.id}
            onClick={() => setActiveCaseStudy(cs)}
            className="group bg-white dark:bg-[#0B1E36] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-slate-950/40 hover:shadow-xl hover:border-blue-300 dark:hover:border-lime-500/50 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Business Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={cs.image}
                alt={cs.businessName}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold">
                  {cs.industry}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/90 bg-slate-950/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                <MapPin className="w-3 h-3 text-lime-400" />
                <span>{cs.location}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between bg-white dark:bg-[#0B1E36]">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors mb-2">
                  {cs.businessName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {cs.story}
                </p>

                {/* Converted Financial Impact Metric */}
                {cs.financialImpactNGN && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-[#0E2443] border border-blue-200/80 dark:border-blue-800/80 flex items-center justify-between">
                    <div className="text-[10px] font-semibold text-blue-900 dark:text-blue-300">
                      {cs.financialImpactLabel}
                    </div>
                    <div className="text-xs font-mono font-extrabold text-blue-700 dark:text-lime-400">
                      {formatFromNGN(cs.financialImpactNGN, { compact: true })}
                    </div>
                  </div>
                )}

                {/* Highlight Result in Lemon Green Box */}
                <div className="p-3.5 rounded-xl bg-lime-50/80 dark:bg-lime-950/30 border border-lime-300/60 dark:border-lime-800/60 mb-6">
                  <div className="text-[11px] font-bold text-lime-900 dark:text-lime-400 uppercase tracking-wider mb-1">
                    Key Result Achieved:
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-lime-300">
                    {cs.growthMetric}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-lime-400 group-hover:text-blue-900 dark:group-hover:text-lime-300">
                  Read Case Study
                </span>
                <ArrowRight className="w-4 h-4 text-lime-600 dark:text-lime-400 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0B1E36] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <img
                src={activeCaseStudy.image}
                alt={activeCaseStudy.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <div>
                  <span className="px-2.5 py-1 rounded bg-lime-400 text-slate-950 text-xs font-extrabold uppercase">
                    {activeCaseStudy.industry}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {activeCaseStudy.businessName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeCaseStudy.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-1">
                  The Challenge:
                </h4>
                <p>{activeCaseStudy.story}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-1">
                  The Transformation with MsmeBooks:
                </h4>
                <p>{activeCaseStudy.result}</p>
              </div>

              <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-950/40 border border-lime-300 dark:border-lime-700">
                <div className="text-xs font-bold text-lime-900 dark:text-lime-400 uppercase tracking-wider mb-1">
                  Verified Outcome:
                </div>
                <div className="text-base font-extrabold text-slate-950 dark:text-lime-300">
                  {activeCaseStudy.growthMetric}
                </div>
                {activeCaseStudy.financialImpactNGN && (
                  <div className="mt-2 pt-2 border-t border-lime-200 dark:border-lime-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {activeCaseStudy.financialImpactLabel}:
                    </span>
                    <span className="font-mono font-bold text-slate-950 dark:text-lime-300">
                      {formatFromNGN(activeCaseStudy.financialImpactNGN)} ({currentCurrencyInfo.code})
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-2">
                  MsmeBooks Features Deployed:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeCaseStudy.platformFeaturesUsed.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#0E2443] text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/60 text-xs font-semibold"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Want similar results in your business?
              </span>
              <a
                href="https://www.msmebooks.org/register"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-sm transition-all"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
