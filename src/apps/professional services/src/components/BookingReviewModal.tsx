import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { BookingRecord } from '../types/booking';
import { addFirmReview } from '../utils/reviewStorage';

interface BookingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord;
  onReviewSubmitted: (bookingId: string, rating: number, comment: string, tags: string[]) => void;
}

const REVIEW_TAGS = [
  'Punctual & Responsive',
  'ICAN / ACCA Certified',
  'Flawless Delivery',
  'Great Communication',
  'Saved Us Tax Fines',
  'Clear Financial Insights',
  'Highly Recommended',
];

export const BookingReviewModal: React.FC<BookingReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(booking.userRating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState(booking.feedback || booking.userReviewText || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(booking.userReviewTags || ['Flawless Delivery']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Add to Firm Review Storage so FirmDirectory updates in real time
      addFirmReview({
        firmId: booking.providerId || 'firm-cedar',
        firmName: booking.providerName || 'Cedar Professional Services Limited',
        authorName: booking.customerName || 'Verified Client',
        authorBusiness: booking.businessName || 'SME Business',
        authorCountry: booking.country || 'Nigeria',
        rating,
        serviceEngaged: booking.serviceTitle,
        title: reviewTitle.trim() || `${booking.packageName} Service Review`,
        comment: reviewComment.trim(),
        verifiedClient: true,
      });

      // 2. Dispatch custom event for reviews changed
      window.dispatchEvent(new CustomEvent('msmebooks_reviews_changed'));

      // 3. Callback to update booking in parent state & localStorage
      onReviewSubmitted(booking.id, rating, reviewComment.trim(), selectedTags);

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-[#102B4E] dark:bg-[#060F1A] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#102B4E] flex items-center justify-center font-black">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B7E532] block">
                Verified Client Review
              </span>
              <h3 className="text-base font-black text-white">
                Rate & Review Professional Practice
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-[#102B4E] dark:text-white">
                Thank You for Your Feedback!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Your rating has been saved and is now visible on {booking.providerName}'s public directory badge.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Engagement Summary */}
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-[#102B4E] dark:text-white truncate">
                  {booking.serviceTitle}
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-between">
                  <span>Provider: <strong>{booking.providerName}</strong></span>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-[#B7E532]">Ref: {booking.reference}</span>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="text-center py-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  How would you rate this service delivery?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {rating === 5 && 'Outstanding 5.0 — Exceeded All Expectations'}
                  {rating === 4 && 'Very Good 4.0 — High Quality Professional Service'}
                  {rating === 3 && 'Average 3.0 — Met Basic Requirements'}
                  {rating === 2 && 'Below Average 2.0 — Needs Improvement'}
                  {rating === 1 && 'Unsatisfactory 1.0 — Significant Issues'}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Headline / Summary (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Flawless POS setup & responsive support"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071322] text-[#102B4E] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                />
              </div>

              {/* Detailed Review Comment */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Your Detailed Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details of the consultant's responsiveness, technical expertise, and deliverable quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071322] text-[#102B4E] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                />
              </div>

              {/* Praise Tags */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Highlights:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REVIEW_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? 'bg-[#1464C8] text-white border-[#1464C8]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !reviewComment.trim()}
                  className="w-full py-3 bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Verified Review...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#B7E532]" />
                      <span>Publish Review & Update Firm Rating</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
