import React from 'react';
import { 
  Heart, 
  Trash2, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  ArrowRight, 
  ShoppingBag,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data/mockData';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';

interface WishlistViewProps {
  wishlistCourseIds: string[];
  onToggleWishlist: (courseId: string) => void;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  onExploreCourses: () => void;
  onClearWishlist: () => void;
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistCourseIds,
  onToggleWishlist,
  onSelectCourse,
  onEnrollCourse,
  onExploreCourses,
  onClearWishlist,
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  const wishlistedCourses = COURSES.filter((c) => wishlistCourseIds.includes(c.id));

  // Calculations
  const totalHours = wishlistedCourses.reduce((acc, c) => acc + c.durationHours, 0);
  const totalTuitionNgn = wishlistedCourses.reduce((acc, c) => acc + (c.isFree ? 0 : c.priceNgn), 0);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              <Heart className="w-3.5 h-3.5 fill-[#0B4F9C] dark:fill-blue-400 text-[#0B4F9C] dark:text-blue-400" />
              <span>{getTranslation('savedCourses', currentLanguage)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Learning Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track and plan courses you want to take. When ready, enroll directly to begin hands-on software training.
            </p>
          </div>

          {wishlistedCourses.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right px-4 py-2 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 text-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Saved Items Total</span>
                <span className="font-extrabold text-sm text-[#0B4F9C] dark:text-blue-400 tabular-nums">
                  {formatCurrency(totalTuitionNgn, currentCurrency)}
                </span>
              </div>

              <button
                onClick={onClearWishlist}
                className="px-3.5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {wishlistedCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-2xl mx-auto space-y-5 shadow-xs transition-colors">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900 shadow-xs">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {getTranslation('emptyWishlist', currentLanguage)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {getTranslation('emptyWishlistDesc', currentLanguage)}
              </p>
            </div>

            <button
              onClick={onExploreCourses}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{getTranslation('exploreCourses', currentLanguage)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Suggestions Strip */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Popular Courses to Add:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COURSES.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 line-clamp-1 pr-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{c.title}</span>
                      <span className="text-[10px] text-slate-400">{c.level} · {c.durationHours}h</span>
                    </div>
                    <button
                      onClick={() => onToggleWishlist(c.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#0B4F9C] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-md shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Heart className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Summary statistics bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition-colors">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Saved Courses</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm tabular-nums">
                  {wishlistedCourses.length} Courses
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Total Study Time</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm tabular-nums">
                  {totalHours} Hours
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Certificates Included</span>
                <span className="font-extrabold text-[#72B01D] text-sm tabular-nums">
                  {wishlistedCourses.filter(c => c.certificateEligible).length} Verifiable Credentials
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Estimated Investment</span>
                <span className="font-extrabold text-[#0B4F9C] dark:text-blue-400 text-sm tabular-nums">
                  {formatCurrency(totalTuitionNgn, currentCurrency)}
                </span>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all overflow-hidden flex flex-col group text-left relative"
                >
                  {/* Top Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category & sector tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      {course.sector && (
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded shadow-xs backdrop-blur-xs ${
                          course.sector === 'Government & Public Sector'
                            ? 'bg-blue-900/90 text-blue-100'
                            : course.sector === 'Private Sector'
                            ? 'bg-emerald-900/90 text-emerald-100'
                            : 'bg-slate-900/85 text-slate-100'
                        }`}>
                          {course.sector === 'Government & Public Sector' ? 'Government' : course.sector === 'Private Sector' ? 'Private' : 'Core'}
                        </span>
                      )}
                      <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs truncate max-w-[150px]">
                        {course.category}
                      </span>
                    </div>

                    {/* Remove Wishlist Button on image corner */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(course.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm transition-transform active:scale-95 cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>

                    {/* Duration & level */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#72B01D]" />
                        <span className="tabular-nums">{course.durationHours} hours</span>
                      </span>
                      <span className="bg-black/50 px-1.5 py-0.5 rounded text-[10px]">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                        <span className="tabular-nums">{course.modulesCount} modules</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{course.lessonsCount} lessons</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#72B01D] font-semibold flex items-center gap-0.5">
                          <Award className="w-3 h-3" /> Certificate
                        </span>
                      </div>

                      <h3 
                        onClick={() => onSelectCourse(course)}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {course.tagline}
                      </p>
                    </div>

                    {/* Bottom action footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {course.instructor.name}
                          </p>
                        </div>

                        <div className="text-right">
                          {course.isFree ? (
                            <span className="text-sm font-extrabold text-[#72B01D]">FREE</span>
                          ) : (
                            <span className="text-sm font-extrabold text-[#0B4F9C] dark:text-blue-400 tabular-nums">
                              {formatCurrency(course.priceNgn, currentCurrency)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg transition-colors cursor-pointer text-center"
                        >
                          {getTranslation('curriculum', currentLanguage)}
                        </button>
                        <button
                          onClick={() => onEnrollCourse(course)}
                          className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors shadow-xs cursor-pointer text-center"
                        >
                          {course.isFree ? getTranslation('startFree', currentLanguage) : getTranslation('enrollNow', currentLanguage)}
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
