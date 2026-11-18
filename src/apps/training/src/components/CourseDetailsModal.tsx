import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Users, 
  Star, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ShieldCheck,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Course } from '../types';
import { StarRatingWidget } from './StarRatingWidget';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';

interface CourseDetailsModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
  onAddToCart?: (course: Course) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (courseId: string) => void;
  userRating?: number;
  averageRating?: number;
  ratingCount?: number;
  onRateCourse?: (courseId: string, rating: number) => void;
  isEnrolled?: boolean;
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnroll,
  onOpenPlayer,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  userRating,
  averageRating,
  ratingCount,
  onRateCourse,
  isEnrolled = false,
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  if (!course) return null;

  const currentAvgRating = averageRating ?? course.rating;
  const currentRatingCount = ratingCount ?? course.ratingCount;

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#073B75] dark:bg-slate-950 text-white flex items-start justify-between relative border-b border-blue-900/60 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              {course.sector && (
                <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded">
                  {course.sector}
                </span>
              )}
              <span className="bg-[#72B01D] text-white font-bold px-2 py-0.5 rounded">
                {course.category}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-200 font-medium">{course.level} Level</span>
              <span className="text-slate-300">·</span>
              <span className="text-[#84CC16] font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Verifiable Certificate Included
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {course.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 text-slate-800 dark:text-slate-200">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Duration</span>
              <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
                {course.durationHours} Hours
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Content Structure</span>
              <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
                {course.modulesCount} Modules · {course.lessonsCount} Lessons
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Language</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {course.language}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Rating</span>
              <div className="flex items-center gap-1 text-sm font-extrabold text-amber-600 dark:text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{currentAvgRating.toFixed(1)}</span>
                <span className="text-slate-400 text-xs font-normal">({currentRatingCount})</span>
              </div>
            </div>
          </div>

          {/* Interactive Star Rating Widget Panel */}
          <StarRatingWidget
            rating={currentAvgRating}
            ratingCount={currentRatingCount}
            userRating={userRating}
            onRate={(newRating) => onRateCourse && onRateCourse(course.id, newRating)}
            isEnrolled={isEnrolled}
            interactive={true}
          />

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 mb-2">
              Course Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* What You Will Learn */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 mb-3">
              {getTranslation('learningObjectives', currentLanguage)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <CheckCircle2 className="w-4 h-4 text-[#72B01D] shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Curriculum Module Accordion */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400">
                Syllabus &amp; Curriculum Breakdown
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {course.modules.length} Modules Total
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
              {course.modules.map((mod) => {
                const isOpen = !!expandedModules[mod.id];
                return (
                  <div key={mod.id} className="bg-white dark:bg-slate-900">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {mod.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 tabular-nums">
                          {mod.lessons.length} lessons
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 bg-slate-50/50 dark:bg-slate-950/40 space-y-1.5">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between py-2 px-3 bg-white dark:bg-slate-800/90 rounded-md border border-slate-200/70 dark:border-slate-700/60 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {lesson.type === 'video' && <PlayCircle className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />}
                              {lesson.type === 'interactive-demo' && <Award className="w-3.5 h-3.5 text-[#72B01D]" />}
                              {lesson.type === 'document' && <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                              {lesson.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                              <span className="font-medium text-slate-700 dark:text-slate-200">{lesson.title}</span>
                            </div>
                            <span className="text-slate-400 tabular-nums text-[11px]">
                              {lesson.durationMinutes} min
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructor Profile Card */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{course.instructor.name}</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                  Verified Master Trainer
                </span>
              </div>
              <p className="text-xs text-[#0B4F9C] dark:text-blue-400 font-medium">{course.instructor.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{course.instructor.bio}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer with Pricing & Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{getTranslation('tuitionFee', currentLanguage)}</span>
            {course.isFree ? (
              <span className="text-xl font-black text-[#72B01D]">{getTranslation('freeEnrollment', currentLanguage)}</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0B4F9C] dark:text-blue-400 tabular-nums">
                  {formatCurrency(course.priceNgn, currentCurrency)}
                </span>
                <span className="text-xs text-slate-400">Includes assessment &amp; QR credential</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(course.id)}
                className={`px-3 py-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isWishlisted
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Save course for later'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            )}

            {onAddToCart && !course.isFree && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(course);
                  onClose();
                }}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Add to Enrollment Cart"
              >
                <ShoppingCart className="w-4 h-4 text-[#72B01D]" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenPlayer(course);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-[#0B4F9C] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Launch Course Player
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <span>{course.isFree ? getTranslation('startFree', currentLanguage) : getTranslation('enrollNow', currentLanguage)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
