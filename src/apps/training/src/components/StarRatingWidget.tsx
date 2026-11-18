import React, { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

interface StarRatingWidgetProps {
  rating: number; // Average rating (e.g. 4.8)
  ratingCount?: number;
  userRating?: number;
  onRate?: (rating: number) => void;
  isEnrolled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean; // If true, shows the interactive rating panel
  compactInteractive?: boolean; // If true, renders inline interactive stars on cards
}

const RATING_LABELS: Record<number, string> = {
  1: '1 - Needs Improvement',
  2: '2 - Fair',
  3: '3 - Good & Practical',
  4: '4 - Very Good / Highly Recommended',
  5: '5 - Exceptional Masterclass'
};

export const StarRatingWidget: React.FC<StarRatingWidgetProps> = ({
  rating,
  ratingCount,
  userRating,
  onRate,
  isEnrolled = true,
  size = 'sm',
  showCount = true,
  interactive = false,
  compactInteractive = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [recentlyRated, setRecentlyRated] = useState(false);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starValue: number) => {
    if (!onRate) return;
    onRate(starValue);
    setRecentlyRated(true);
    setTimeout(() => {
      setRecentlyRated(false);
    }, 4000);
  };

  // 1. Compact inline interactive mode (e.g. For Course Catalog Cards)
  if (compactInteractive && onRate) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <div 
          className="flex items-center gap-0.5"
          onMouseLeave={() => setHoverRating(null)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating !== null ? hoverRating >= star : (userRating || Math.round(rating)) >= star);
            return (
              <button
                key={star}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick(star);
                }}
                onMouseEnter={() => setHoverRating(star)}
                className="p-0.5 transition-transform hover:scale-125 cursor-pointer text-amber-400"
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`${starSizes[size]} ${
                    isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {userRating ? (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            You: {userRating}★
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-medium">
            (Tap to rate)
          </span>
        )}
      </div>
    );
  }

  // 2. Full interactive panel mode (e.g. Inside CourseDetailsModal)
  if (interactive) {
    const activeValue = hoverRating !== null ? hoverRating : (userRating || 0);

    return (
      <div className="p-4 bg-gradient-to-r from-amber-50/70 to-yellow-50/70 rounded-xl border border-amber-200/90 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              Student Course Rating &amp; Review
            </span>
            {isEnrolled && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Enrolled Student
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 font-bold text-slate-800 tabular-nums">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-extrabold">{rating.toFixed(1)}</span>
            {ratingCount !== undefined && (
              <span className="text-slate-500 font-normal text-xs">
                ({ratingCount.toLocaleString()} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        </div>

        {/* Interactive Star Row */}
        {isEnrolled ? (
          <div className="bg-white p-3 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-700 block">
                {userRating ? 'Your submitted rating:' : 'Rate this course (click to submit):'}
              </span>

              <div 
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = activeValue >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 transition-all hover:scale-120 cursor-pointer text-amber-400 focus:outline-none"
                      title={RATING_LABELS[star]}
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:text-right">
              {hoverRating ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md inline-block">
                  {RATING_LABELS[hoverRating]}
                </span>
              ) : userRating ? (
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>You rated: {userRating} of 5 Stars</span>
                  </span>
                  <p className="text-[10px] text-slate-500">Click any star to update your rating anytime</p>
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Select 1 to 5 stars to submit your review
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Enroll in this course to submit your personal verified student rating and review.</span>
            <span className="text-[#0B4F9C] font-semibold">Verified Enrollment Required</span>
          </div>
        )}

        {recentlyRated && (
          <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your rating has been recorded and factored into the average course rating.</span>
          </div>
        )}
      </div>
    );
  }

  // 3. Standard Read-Only Display Mode (with optional fraction representation)
  return (
    <div className="flex items-center gap-1 text-slate-800">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating >= star;
          const isHalf = !isFilled && rating >= star - 0.5;

          return (
            <div key={star} className="relative">
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            </div>
          );
        })}
      </div>

      <span className="font-extrabold text-slate-900 tabular-nums ml-0.5">
        {rating.toFixed(1)}
      </span>

      {showCount && ratingCount !== undefined && (
        <span className="text-slate-400 text-xs font-normal">
          ({ratingCount})
        </span>
      )}
    </div>
  );
};
