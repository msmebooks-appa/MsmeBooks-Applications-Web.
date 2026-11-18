import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  PlayCircle, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Layers
} from 'lucide-react';
import { Language, getTranslation } from '../data/translations';

interface HeroProps {
  onExploreCourses: () => void;
  onStartFree: () => void;
  onViewCertifications: () => void;
  onBookCorporate: () => void;
  onOpenSandbox: () => void;
  onTakeAssessment?: () => void;
  currentLanguage?: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCourses,
  onStartFree,
  onViewCertifications,
  onBookCorporate,
  onOpenSandbox,
  onTakeAssessment,
  currentLanguage = 'en'
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-10 pb-16 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B4F9C] dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-[#72B01D]" />
              <span>{getTranslation('heroBadge', currentLanguage)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {getTranslation('heroTitle', currentLanguage)} <span className="text-[#0B4F9C] dark:text-blue-400">MsmeBooks</span> <span className="text-[#72B01D]">Academy</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {getTranslation('heroSub', currentLanguage)}
            </p>

            {/* Primary & Adaptive Assessment CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                className="px-5 py-3 text-sm font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <span>{getTranslation('exploreCourses', currentLanguage)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onTakeAssessment && (
                <button
                  onClick={onTakeAssessment}
                  className="px-5 py-3 text-sm font-bold text-slate-950 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{getTranslation('skillAssessment', currentLanguage)}</span>
                </button>
              )}

              <button
                onClick={onStartFree}
                className="px-5 py-3 text-sm font-bold text-[#0B4F9C] dark:text-blue-400 bg-white dark:bg-slate-900 hover:bg-blue-50/80 dark:hover:bg-slate-800 border-2 border-[#0B4F9C] dark:border-blue-500 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-[#72B01D]" />
                <span>{getTranslation('startFreeLearning', currentLanguage)}</span>
              </button>

              <button
                onClick={onViewCertifications}
                className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-transparent dark:border-slate-800"
              >
                <Award className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                <span>{getTranslation('becomeCertified', currentLanguage)}</span>
              </button>

              <button
                onClick={onBookCorporate}
                className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
              >
                {getTranslation('bookCorporateTraining', currentLanguage)} →
              </button>
            </div>

            {/* Value checks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D] shrink-0" />
                <span>{getTranslation('realSoftwareSandbox', currentLanguage)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D] shrink-0" />
                <span>{getTranslation('verifiableCertificates', currentLanguage)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D] shrink-0" />
                <span>{getTranslation('partnerTiers', currentLanguage)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset + Interactive Floating Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src="/src/assets/images/hero_academy_training_1793446483834.jpg"
                alt="African business professionals in modern tech conference room learning cloud accounting and POS software"
                className="w-full h-80 sm:h-96 object-cover opacity-95 hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex items-center justify-between">
                <span className="font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-xs">
                  Cohort Session · Lagos &amp; Virtual Live Stream
                </span>
                <span className="text-[#84CC16] font-semibold flex items-center gap-1">
                  ● Live LMS Enrolled
                </span>
              </div>
            </div>

            {/* Interactive Floating Card: Preview of LMS Student Progress with dark mode */}
            <div className="mt-4 sm:-mt-12 sm:ml-6 relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-800 text-left max-w-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                    CE
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Chiamaka Eze</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Certified Bookkeeper Pathway</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#72B01D] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  88% Complete
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Current Lesson: Bank Rule Auto-Match</span>
                  <span className="font-semibold text-slate-900 dark:text-white">4 / 5 Modules</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0B4F9C] h-full rounded-full transition-all" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={onOpenSandbox}
                  className="text-[11px] font-bold text-[#0B4F9C] dark:text-blue-400 hover:text-[#073B75] flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#72B01D]" />
                  <span>Launch Practice Sandbox</span>
                </button>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Verifiable Exam Next</span>
              </div>
            </div>

          </div>
        </div>

        {/* Full-width 4-Column KPI & Proof Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="border-r last:border-0 border-slate-100 dark:border-slate-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B4F9C] dark:text-blue-400 tabular-nums">
              12,500+
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {getTranslation('kpiCertified', currentLanguage)}
            </p>
          </div>

          <div className="border-r last:border-0 border-slate-100 dark:border-slate-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#72B01D] tabular-nums">
              48+
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {getTranslation('kpiLabs', currentLanguage)}
            </p>
          </div>

          <div className="border-r last:border-0 border-slate-100 dark:border-slate-800 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B4F9C] dark:text-blue-400 tabular-nums">
              99.4%
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {getTranslation('kpiCompletion', currentLanguage)}
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              30+
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {getTranslation('kpiMarkets', currentLanguage)}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
