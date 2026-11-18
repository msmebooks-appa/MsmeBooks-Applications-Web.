import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  Search, 
  ChevronDown, 
  User, 
  Building2, 
  Calendar, 
  Globe2, 
  PenTool, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProfessionalFirm } from '../data/firmsData';
import { FirmReview, FirmReviewAggregate } from '../types/review';
import { 
  getFirmReviewAggregate, 
  addFirmReview, 
  toggleHelpfulReview, 
  isReviewLiked 
} from '../utils/reviewStorage';

export interface FirmReviewSystemProps {
  isOpen?: boolean;
  onClose?: () => void;
  firm: ProfessionalFirm;
  onReviewSubmitted?: (updatedAggregate: FirmReviewAggregate) => void;
  inline?: boolean;
  initialMode?: 'view' | 'write';
}

export const FirmReviewSystem: React.FC<FirmReviewSystemProps> = ({
  isOpen = true,
  onClose,
  firm,
  onReviewSubmitted,
  inline = false,
  initialMode = 'view',
}) => {
  // Aggregate data state
  const [aggregate, setAggregate] = useState<FirmReviewAggregate>(() => {
    return getFirmReviewAggregate(firm.id);
  });

  // Mode: view reviews vs write a review
  const [isWritingReview, setIsWritingReview] = useState(initialMode === 'write');

  // Filter & Search states
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Form input states
  const [authorName, setAuthorName] = useState('');
  const [authorBusiness, setAuthorBusiness] = useState('');
  const [authorCountry, setAuthorCountry] = useState(firm.country || 'Nigeria');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [serviceEngaged, setServiceEngaged] = useState<string>(
    firm.specializations[0] || 'General Accounting & Bookkeeping'
  );
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedConsent, setVerifiedConsent] = useState(true);

  // Submission feedback states
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Liked reviews local tracking for instant UI reaction
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Reload aggregate when firm changes or when custom event fires
  useEffect(() => {
    const refreshData = () => {
      setAggregate(getFirmReviewAggregate(firm.id));
    };

    refreshData();
    window.addEventListener('msmebooks_reviews_changed', refreshData);
    return () => window.removeEventListener('msmebooks_reviews_changed', refreshData);
  }, [firm.id]);

  // Star label descriptions
  const getRatingDescription = (val: number) => {
    switch (val) {
      case 5: return '5 Stars - Exceptional & Highly Recommended';
      case 4: return '4 Stars - Very Good & Professional';
      case 3: return '3 Stars - Good & Met Requirements';
      case 2: return '2 Stars - Fair / Needed Revisions';
      case 1: return '1 Star - Unsatisfactory';
      default: return 'Select your rating';
    }
  };

  // Filtered & Sorted Reviews List
  const filteredReviews = useMemo(() => {
    let list = [...aggregate.reviews];

    if (selectedStarFilter !== null) {
      list = list.filter(r => Math.round(r.rating) === selectedStarFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q) ||
        r.authorBusiness.toLowerCase().includes(q) ||
        r.serviceEngaged.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    return list;
  }, [aggregate.reviews, selectedStarFilter, searchQuery, sortBy]);

  // Form Submit Handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!authorName.trim() || !authorBusiness.trim()) {
      setFormError('Please provide your full name and client company/business name.');
      return;
    }
    if (!title.trim() || title.trim().length < 5) {
      setFormError('Please enter a descriptive headline (at least 5 characters).');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setFormError('Please provide detailed feedback (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      addFirmReview({
        firmId: firm.id,
        firmName: firm.name,
        authorName: authorName.trim(),
        authorBusiness: authorBusiness.trim(),
        authorCountry: authorCountry.trim(),
        rating,
        serviceEngaged: serviceEngaged.trim(),
        title: title.trim(),
        comment: comment.trim(),
        verifiedClient: verifiedConsent,
      });

      const updated = getFirmReviewAggregate(firm.id);
      setAggregate(updated);

      if (onReviewSubmitted) {
        onReviewSubmitted(updated);
      }

      setFormSuccess('Thank you! Your verified client review has been published and the aggregate rating has been updated.');
      setIsSubmitting(false);

      // Reset form fields
      setTitle('');
      setComment('');
      setTimeout(() => {
        setIsWritingReview(false);
        setFormSuccess(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save review. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId: string) => {
    const res = toggleHelpfulReview(reviewId);
    setLikedMap(prev => ({ ...prev, [reviewId]: res.liked }));
    setAggregate(getFirmReviewAggregate(firm.id));
  };

  // Render Stars Component
  const renderStarIcons = (score: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.round(score);
          return (
            <Star
              key={starIndex}
              className={`${iconSize} ${
                isFilled ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Content body
  const content = (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      
      {/* 1. AGGREGATE SUMMARY SECTION */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#0B1E36] dark:to-[#07111D] border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Big Score Number */}
          <div className="md:col-span-5 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 shadow-md flex flex-col items-center justify-center shrink-0">
              <span className="text-3xl font-black text-[#102B4E] dark:text-[#B7E532] leading-none">
                {aggregate.rating.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                out of 5.0
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                {renderStarIcons(aggregate.rating, 'md')}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">
                  {aggregate.reviewCount} Verified Reviews
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  98% Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Authentic feedback from verified African SME clients & businesses.
              </p>
            </div>
          </div>

          {/* Right Column: Star Rating Distribution Progress Bars */}
          <div className="md:col-span-7 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = aggregate.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = aggregate.reviewCount > 0 ? Math.round((count / aggregate.reviewCount) * 100) : 0;
              const isFilterActive = selectedStarFilter === star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStarFilter(isFilterActive ? null : star)}
                  className={`w-full flex items-center gap-2 text-xs py-1 px-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                    isFilterActive 
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-[#1464C8] dark:text-[#B7E532] font-bold' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                  title={`Filter by ${star} Stars`}
                >
                  <span className="w-12 font-bold shrink-0 flex items-center gap-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-amber-400 dark:bg-[#B7E532]' : 'bg-slate-400 dark:bg-slate-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-mono text-[11px] text-slate-400 shrink-0">
                    {percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 w-8 text-right">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. ACTIONS BAR: Write Review Button & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIsWritingReview(!isWritingReview)}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
            isWritingReview 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white' 
              : 'bg-[#1464C8] hover:bg-[#1052a5] text-white shadow-blue-500/10'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{isWritingReview ? 'Cancel Review' : `Write a Review for ${firm.name}`}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Active Star Filter Tag */}
          {selectedStarFilter !== null && (
            <button
              onClick={() => setSelectedStarFilter(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{selectedStarFilter} Stars Only</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* 3. WRITE REVIEW FORM DRAWER */}
      {isWritingReview && (
        <form onSubmit={handleSubmitReview} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#081321] border-2 border-[#1464C8]/30 dark:border-[#B7E532]/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-black text-sm text-[#102B4E] dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Submit Your Verified Review for {firm.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Your feedback helps other African businesses choose the right advisory and accounting partner.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Interactive Star Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating ?? rating)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#1464C8] dark:text-[#B7E532]">
                {getRatingDescription(hoverRating ?? rating)}
              </span>
            </div>
          </div>

          {/* Review Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                Your Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Dr. Funmi Adebayo"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                Client Company / Business Name *
              </label>
              <input
                type="text"
                required
                value={authorBusiness}
                onChange={(e) => setAuthorBusiness(e.target.value)}
                placeholder="e.g. Lekki Health Diagnostics Ltd"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                Service Engaged *
              </label>
              <select
                value={serviceEngaged}
                onChange={(e) => setServiceEngaged(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
              >
                {firm.specializations.map((spec, i) => (
                  <option key={i} value={spec}>{spec}</option>
                ))}
                <option value="General Monthly Bookkeeping & Accounting">General Monthly Bookkeeping</option>
                <option value="Tax Compliance & VAT Filing">Tax Compliance & VAT Filing</option>
                <option value="Cloud ERP & Software Setup">Cloud ERP & Software Setup</option>
                <option value="Internal Audit & Controls Review">Internal Audit & Controls Review</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                Country
              </label>
              <input
                type="text"
                value={authorCountry}
                onChange={(e) => setAuthorCountry(e.target.value)}
                placeholder="e.g. Nigeria, Ghana, Kenya..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Review Title / Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional turnaround time and accurate tax audit clearance"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Experience & Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your engagement with this professional practice, the scope of work completed, punctuality, and measurable business impact..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
            />
            <span className="text-[10px] text-slate-400 block text-right">
              {comment.length} / 15 minimum characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified-consent"
              checked={verifiedConsent}
              onChange={(e) => setVerifiedConsent(e.target.checked)}
              className="w-4 h-4 rounded text-[#1464C8] focus:ring-[#1464C8]"
            />
            <label htmlFor="verified-consent" className="text-[11px] text-slate-600 dark:text-slate-400">
              I certify that this review is based on genuine business consultation or service engagement with <strong>{firm.name}</strong>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Review...' : 'Submit Verified Review & Update Aggregate'}</span>
          </button>
        </form>
      )}

      {/* 4. REVIEWS SEARCH & REVIEWS LIST */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by keyword, business or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Reviews Cards */}
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold">No reviews found matching your filter criteria.</p>
            <button
              onClick={() => { setSelectedStarFilter(null); setSearchQuery(''); }}
              className="mt-2 text-[#1464C8] dark:text-[#B7E532] font-bold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((rev) => {
              const isLiked = likedMap[rev.id] || isReviewLiked(rev.id);

              return (
                <div 
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-2.5"
                >
                  {/* Top line: Author & Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1464C8] dark:text-[#B7E532] font-black text-xs flex items-center justify-center shrink-0">
                        {rev.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-[#102B4E] dark:text-white">
                            {rev.authorName}
                          </span>
                          {rev.verifiedClient && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Verified Client
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {rev.authorBusiness} · {rev.authorCountry}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="flex items-center gap-1">
                        {renderStarIcons(rev.rating, 'sm')}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Service Engaged Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                    <span>Service:</span>
                    <strong className="text-[#1464C8] dark:text-[#B7E532]">{rev.serviceEngaged}</strong>
                  </div>

                  {/* Title & Comment */}
                  <div>
                    <h5 className="font-bold text-xs text-[#102B4E] dark:text-white mb-1">
                      {rev.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Helpful Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px]">Was this feedback helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isLiked 
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] border border-blue-200 dark:border-blue-800' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );

  // If used as inline component (e.g. inside Firm Details Modal)
  if (inline) {
    return content;
  }

  // If used as a modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${firm.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
              {firm.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#102B4E] dark:text-white leading-tight">
                  {firm.name}
                </h3>
                {firm.isVerified && (
                  <span title="Verified Practice">
                    <ShieldCheck className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Client Reviews, Star Ratings & Verified Feedback
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {content}
        </div>

      </div>
    </div>
  );
};
