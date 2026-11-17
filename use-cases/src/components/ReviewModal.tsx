import React, { useState } from 'react';
import { X, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: {
    customerName: string;
    role: string;
    companyName: string;
    industry: string;
    region: string;
    modulesUsed: string[];
    rating: number;
    quote: string;
    detailedFeedback: string;
    consentGiven: boolean;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    customerName: '',
    role: '',
    companyName: '',
    industry: 'Retail & Supermarkets',
    region: 'Lagos, Nigeria',
    modulesUsed: 'POS, Inventory, Accounting',
    quote: '',
    detailedFeedback: '',
    consentGiven: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.quote || !formData.consentGiven) return;

    onSubmitReview({
      customerName: formData.customerName,
      role: formData.role,
      companyName: formData.companyName,
      industry: formData.industry,
      region: formData.region,
      modulesUsed: formData.modulesUsed.split(',').map((m) => m.trim()),
      rating,
      quote: formData.quote,
      detailedFeedback: formData.detailedFeedback || formData.quote,
      consentGiven: formData.consentGiven,
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0B1E30] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-[#1A3852] overflow-hidden relative max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="bg-[#0A3D62] dark:bg-[#07243B] text-white p-5 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#90CF24] font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Verification Protocol</span>
          </div>
          <h3 className="text-lg font-bold">Share Your MsmeBooks Experience</h3>
          <p className="text-xs text-slate-300 mt-1">
            Help other growing businesses learn how you transformed your accounting and point of sale.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-[#7CB518] dark:text-[#90CF24] rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Review Submitted for Verification</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, {formData.customerName}. Per our transparency guidelines, our team will verify your submission before publishing it as a verified customer story.
              </p>
              <button
                onClick={handleClose}
                className="mt-3 px-5 py-2 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Mary Okon"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Okon Pharmacy Ltd"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City &amp; Country</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g. Abuja, Nigeria"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-slate-500 dark:text-slate-400 font-semibold ml-2">({rating}/5)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Summary / Quote *</label>
                <input
                  type="text"
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="One sentence summary of how MsmeBooks helped your business"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Story &amp; Results</label>
                <textarea
                  rows={3}
                  value={formData.detailedFeedback}
                  onChange={(e) => setFormData({ ...formData, detailedFeedback: e.target.value })}
                  placeholder="Describe your previous challenges, which modules helped, and the business impact..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#081726] rounded-lg border border-slate-200 dark:border-[#17334D]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentGiven}
                    onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-0.5 rounded text-[#0A3D62] focus:ring-[#0A3D62]"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    I confirm that I am authorized to represent this business and authorize MsmeBooks to verify and publish this case study or testimonial on www.msmebooks.org.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Submit for Editorial Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
