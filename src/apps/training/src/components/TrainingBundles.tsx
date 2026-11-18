import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Percent,
  Check,
  ShoppingCart
} from 'lucide-react';
import { TrainingBundle, Course } from '../types';
import { TRAINING_BUNDLES, COURSES } from '../data/mockData';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';

interface TrainingBundlesProps {
  onEnrollBundle: (bundle: TrainingBundle) => void;
  onSelectCourse: (course: Course) => void;
  onAddToCart?: (bundle: TrainingBundle) => void;
  enrolledCourseIds?: string[];
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const TrainingBundles: React.FC<TrainingBundlesProps> = ({
  onEnrollBundle,
  onSelectCourse,
  onAddToCart,
  enrolledCourseIds = [],
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  const [selectedBundleModal, setSelectedBundleModal] = useState<TrainingBundle | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  const categories = [
    'All',
    'Accounting & Financial Management',
    'Point of Sale (POS) Operations',
    'Agriculture, Agribusiness & Farm Operations',
    'Partner & Reseller Certification'
  ];

  const filteredBundles = TRAINING_BUNDLES.filter((b) => {
    if (activeCategoryFilter === 'All') return true;
    return b.category === activeCategoryFilter;
  });

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#073B75] via-[#0B4F9C] to-[#1E6FD9] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-[#72B01D] mb-4 border border-white/10">
              <Package className="w-3.5 h-3.5" />
              <span>Comprehensive Multi-Course Career Tracks · Save up to 48%</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Curated SME Training Bundles &amp; Executive Suites
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8">
              Fast-track your enterprise career with multi-disciplinary curriculum packages. Gain deep cross-functional competence in financial accounting, POS automation, farm inventory, and certified partner advisory.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-blue-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                All Courses Fully Accredited
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                Hands-on Sandbox Practice
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                Instant Multi-Course Enrollment
              </span>
            </div>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition-all cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-[#0B4F9C] text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBundles.map((bundle) => {
            const bundledCourses = COURSES.filter((c) => bundle.courseIds.includes(c.id));
            const allEnrolled = bundle.courseIds.every((id) => enrolledCourseIds.includes(id));

            return (
              <div 
                key={bundle.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Bundle Header Ribbon */}
                  <div className={`p-6 sm:p-8 bg-gradient-to-r ${bundle.bannerGradient} text-white relative`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                        {bundle.badge}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-[#72B01D] text-slate-950 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 stroke-[2.5]" />
                        {bundle.featuredPill}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black mb-2 leading-tight">
                      {bundle.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                      {bundle.tagline}
                    </p>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-blue-300" />
                        {bundle.courseIds.length} Masterclasses Included
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-lime-400" />
                        {bundle.totalHours} Hours Total
                      </span>
                      <span>•</span>
                      <span>{bundle.totalModules} Modules</span>
                    </div>
                  </div>

                  {/* Included Courses Preview */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Included Masterclasses in this Bundle:
                      </h4>
                      <div className="space-y-2.5">
                        {bundledCourses.map((c, idx) => (
                          <div 
                            key={c.id}
                            onClick={() => onSelectCourse(c)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover/item:text-[#0B4F9C] dark:group-hover/item:text-blue-400 line-clamp-1">
                                  {c.title}
                                </h5>
                                <span className="text-[11px] text-slate-400">
                                  {c.durationHours} hrs · {c.modulesCount} modules · By {c.instructor.name}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Outcomes */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Key Competencies &amp; Credentials:
                      </h4>
                      <div className="space-y-1.5">
                        {bundle.careerOutcomes.map((outcome, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-[#72B01D] shrink-0 mt-0.5 stroke-[3]" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 sm:p-8 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-sm font-semibold">
                        {formatCurrency(bundle.originalPriceNgn, currentCurrency)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Save {bundle.discountPercentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-950 dark:text-white">
                      {formatCurrency(bundle.discountedPriceNgn, currentCurrency)}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      One-time lifetime access + All certification exams
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {onAddToCart && !allEnrolled && (
                      <button
                        type="button"
                        onClick={() => onAddToCart(bundle)}
                        className="px-4 py-3 rounded-xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                        title="Add bundle to cart"
                      >
                        <ShoppingCart className="w-4 h-4 text-[#72B01D]" />
                        <span>Add to Cart</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEnrollBundle(bundle)}
                      disabled={allEnrolled}
                      className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        allEnrolled
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                          : 'bg-[#0B4F9C] hover:bg-[#073B75] text-white hover:shadow-lg'
                      }`}
                    >
                      {allEnrolled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Already Enrolled in Bundle</span>
                        </>
                      ) : (
                        <>
                          <span>Enroll in Complete Bundle</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
