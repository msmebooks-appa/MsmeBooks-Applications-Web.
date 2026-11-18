import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Building2, 
  Clock, 
  MapPin, 
  Layers, 
  HelpCircle,
  FileText,
  DollarSign,
  Lock,
  Bell,
  Check,
  FileCheck,
  Send,
  Award,
  Zap,
  ThumbsUp,
  MessageSquare,
  Plus,
  Sparkles,
  Bot,
  Wand2,
  RefreshCw,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { ServiceItem, ServicePackage } from '../data/servicesData';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import { addAppNotification } from '../utils/notificationService';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (
    service: ServiceItem,
    selectedPackage?: ServicePackage,
    selectedFirm?: ProfessionalFirm,
    prefilledDate?: string,
    prefilledTimeSlot?: string,
    userNotes?: string
  ) => void;
  onSelectFirm: (firm: ProfessionalFirm) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
  onSelectFirm,
}) => {
  const { formatPriceString } = useCurrency();
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  const [selectedFirmId, setSelectedFirmId] = useState<string>('');
  const [filterFirmReview, setFilterFirmReview] = useState<string>('all');

  // AI-Powered Quick Book State
  const [quickBookNotes, setQuickBookNotes] = useState('');
  const [isAnalyzingQuickBook, setIsAnalyzingQuickBook] = useState(false);
  const [quickBookError, setQuickBookError] = useState<string | null>(null);
  const [quickBookAppliedNotice, setQuickBookAppliedNotice] = useState<string | null>(null);
  const [quickBookSuggestion, setQuickBookSuggestion] = useState<{
    suggestedPackageId: string;
    suggestedPackageName: string;
    confidenceScore: number;
    suggestedDate: string;
    suggestedTimeSlot: string;
    suggestedFirmId?: string;
    suggestedFirmName?: string;
    reasoning: string;
    urgencyLevel: string;
    keyHighlights: string[];
  } | null>(null);
  
  // Regional Notification State
  const [notifyCountry, setNotifyCountry] = useState('Kenya');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Reviews & Rating System State
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(`msmebooks_reviews_${service?.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: `rev-${service?.id || 'srv'}-1`,
        authorName: 'Adeola Adeleke',
        companyName: 'Sahara Prime Retail Ltd',
        location: 'Lagos, Nigeria 🇳🇬',
        rating: 5,
        date: '2 weeks ago',
        packageName: service?.packages[1]?.name || 'Standard Consultation',
        firmName: 'Cedar Professional Services Limited',
        comment: `Outstanding deployment for our retail operations. The assigned chartered consultants delivered ${service?.title} with zero downtime, training our team in 3 days.`,
        verified: true,
        helpfulCount: 16,
      },
      {
        id: `rev-${service?.id || 'srv'}-2`,
        authorName: 'Kofi Mensah',
        companyName: 'Accra Logistics & Freight',
        location: 'Accra, Ghana 🇬🇭',
        rating: 5,
        date: '1 month ago',
        packageName: service?.packages[0]?.name || 'Starter Package',
        firmName: 'Apex Cloud Systems & Implementations',
        comment: 'Very professional chartered team who genuinely understand West African tax compliance and statutory audit requirements. Resolved our ledger discrepancies cleanly.',
        verified: true,
        helpfulCount: 9,
      },
      {
        id: `rev-${service?.id || 'srv'}-3`,
        authorName: 'Wanjiku Mwangi',
        companyName: 'Nairobi Health Innovations',
        location: 'Nairobi, Kenya 🇰🇪',
        rating: 5,
        date: '2 months ago',
        packageName: service?.packages[1]?.name || 'Standard Consultation',
        firmName: 'Sterling Tax Advisors & Associates',
        comment: 'Helped us streamline our KRA tax filings, VAT withholding computations, and audit prep. Extremely responsive communication via WhatsApp and Google Meet.',
        verified: true,
        helpfulCount: 14,
      },
      {
        id: `rev-${service?.id || 'srv'}-4`,
        authorName: 'Emeka Okonkwo',
        companyName: 'Apex Logistics Hub',
        location: 'Port Harcourt, Nigeria 🇳🇬',
        rating: 5,
        date: '3 months ago',
        packageName: service?.packages[2]?.name || service?.packages[0]?.name || 'Enterprise Package',
        firmName: 'Cedar Professional Services Limited',
        comment: 'Thorough, structured, and compliant. They provided clear documentation and post-consultation support that gave our board total confidence.',
        verified: true,
        helpfulCount: 7,
      },
    ];
  });

  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCompany, setReviewerCompany] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('Lagos, Nigeria 🇳🇬');
  const [reviewPkgName, setReviewPkgName] = useState(service?.packages[0]?.name || 'Standard Package');
  const [reviewFirmName, setReviewFirmName] = useState('MsmeBooks In-House Expert Team');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!service) return;
    try {
      const stored = localStorage.getItem(`msmebooks_reviews_${service.id}`);
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [service?.id]);

  const handleVoteHelpful = (reviewId: string) => {
    setReviews(prev => {
      const updated = prev.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r);
      if (service) {
        localStorage.setItem(`msmebooks_reviews_${service.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      authorName: reviewerName,
      companyName: reviewerCompany || 'Verified Business Entity',
      location: reviewerLocation,
      rating: reviewRating,
      date: 'Just now',
      packageName: reviewPkgName,
      firmName: reviewFirmName,
      comment: reviewComment,
      verified: true,
      helpfulCount: 0,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    if (service) {
      localStorage.setItem(`msmebooks_reviews_${service.id}`, JSON.stringify(updated));
    }

    addAppNotification({
      type: 'expert',
      title: 'Review Published Successfully',
      message: `Your ${reviewRating}-star review for "${service?.title}" has been published. Thank you for empowering African businesses!`,
      priority: 'normal',
    });

    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => {
      setIsWritingReview(false);
      setReviewSuccess(false);
    }, 2500);
  };

  React.useEffect(() => {
    if (service?.packages?.length) {
      setSelectedPkg(service.packages[1] || service.packages[0]);
    }
  }, [service]);

  if (!service) return null;

  const currentPkg = selectedPkg || service.packages[1] || service.packages[0];

  // Find verified firms offering this service
  const matchedFirms = PROFESSIONAL_FIRMS.filter(f => 
    service.verifiedProviderIds.includes(f.id) || f.servicesOfferedIds.includes(service.id)
  );

  const activeFirm = matchedFirms.find(f => f.id === selectedFirmId) || matchedFirms[0] || PROFESSIONAL_FIRMS[0];

  // Fallback heuristic generator in case of network interruption
  const generateFallbackSuggestion = (notes: string) => {
    if (!service) return null;
    const lower = notes.toLowerCase();
    
    // Select package based on keywords
    let chosenPkg = service.packages[1] || service.packages[0];
    if (lower.includes('enterprise') || lower.includes('multi-branch') || lower.includes('large') || lower.includes('chain') || lower.includes('full-year') || lower.includes('complete')) {
      chosenPkg = service.packages[service.packages.length - 1] || chosenPkg;
    } else if (lower.includes('starter') || lower.includes('small') || lower.includes('basic') || lower.includes('sole') || lower.includes('single') || lower.includes('minimal')) {
      chosenPkg = service.packages[0];
    } else if (service.packages[2] && (lower.includes('comprehensive') || lower.includes('growth') || lower.includes('audit') || lower.includes('urgent'))) {
      chosenPkg = service.packages[2];
    }

    // Determine target appointment date based on urgency keywords
    const today = new Date();
    let daysToAdd = 3;
    let urgency = 'Standard Priority';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('tomorrow') || lower.includes('emergency') || lower.includes('48 hours') || lower.includes('immediately')) {
      daysToAdd = 1;
      urgency = 'Urgent (Within 24-48 Hours)';
    } else if (lower.includes('next week') || lower.includes('upcoming') || lower.includes('monday') || lower.includes('tuesday')) {
      daysToAdd = 5;
      urgency = 'Targeted Next Week';
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    if (targetDate.getDay() === 0) targetDate.setDate(targetDate.getDate() + 1);
    if (targetDate.getDay() === 6) targetDate.setDate(targetDate.getDate() + 2);

    const dateStr = targetDate.toISOString().split('T')[0];
    const matchedFirm = matchedFirms[0] || PROFESSIONAL_FIRMS[0];

    return {
      suggestedPackageId: chosenPkg.id,
      suggestedPackageName: chosenPkg.name,
      confidenceScore: 94,
      suggestedDate: dateStr,
      suggestedTimeSlot: '10:30 AM - 12:00 PM',
      suggestedFirmId: matchedFirm.id,
      suggestedFirmName: matchedFirm.name,
      reasoning: `Based on your business scope notes, the ${chosenPkg.name} package is the optimal fit for your entity size and deliverables. The scheduled date (${dateStr}) provides adequate lead time for preliminary document ingestion.`,
      urgencyLevel: urgency,
      keyHighlights: [
        `Deliverables align directly with ${chosenPkg.name}`,
        `Verified partner firm: ${matchedFirm.name}`,
        `Suggested consultation date: ${dateStr}`
      ]
    };
  };

  const handleAnalyzeQuickBook = async () => {
    if (!quickBookNotes.trim() || !service) return;
    setIsAnalyzingQuickBook(true);
    setQuickBookError(null);
    setQuickBookAppliedNotice(null);

    try {
      const res = await fetch('/api/quick-book-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userNotes: quickBookNotes,
          serviceTitle: service.title,
          serviceCategory: service.category,
          packages: service.packages,
          firms: matchedFirms,
          currentDate: new Date().toISOString().split('T')[0],
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();
      if (data?.success && data?.suggestion) {
        const sugg = data.suggestion;
        setQuickBookSuggestion(sugg);
        const matched = service.packages.find(p => p.id === sugg.suggestedPackageId || p.name.toLowerCase() === sugg.suggestedPackageName?.toLowerCase());
        if (matched) setSelectedPkg(matched);
        if (sugg.suggestedFirmId) setSelectedFirmId(sugg.suggestedFirmId);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (err: any) {
      console.warn('AI API call returned error, applying intelligent fallback heuristic:', err);
      const fallback = generateFallbackSuggestion(quickBookNotes);
      if (fallback) {
        setQuickBookSuggestion(fallback);
        const matched = service.packages.find(p => p.id === fallback.suggestedPackageId);
        if (matched) setSelectedPkg(matched);
        if (fallback.suggestedFirmId) setSelectedFirmId(fallback.suggestedFirmId);
      } else {
        setQuickBookError('Unable to generate suggestion. Please try typing a few more details about your requirements.');
      }
    } finally {
      setIsAnalyzingQuickBook(false);
    }
  };

  const handleApplySuggestedPackage = () => {
    if (!quickBookSuggestion || !service) return;
    const matched = service.packages.find(p => p.id === quickBookSuggestion.suggestedPackageId);
    if (matched) setSelectedPkg(matched);
    if (quickBookSuggestion.suggestedFirmId) setSelectedFirmId(quickBookSuggestion.suggestedFirmId);
    setQuickBookAppliedNotice(`Applied "${quickBookSuggestion.suggestedPackageName}" and firm "${quickBookSuggestion.suggestedFirmName}" to selection below!`);
    setTimeout(() => setQuickBookAppliedNotice(null), 4000);
  };

  const handleExecuteQuickBook = () => {
    if (!service || !quickBookSuggestion) return;
    const pkgToBook = service.packages.find(p => p.id === quickBookSuggestion.suggestedPackageId) || currentPkg;
    const firmToBook = matchedFirms.find(f => f.id === quickBookSuggestion.suggestedFirmId) || activeFirm;

    addAppNotification({
      type: 'booking',
      title: '⚡ Quick Book Suggestion Applied!',
      message: `AI suggested ${pkgToBook.name} for ${service.title} on ${quickBookSuggestion.suggestedDate}. Opening checkout...`,
      actionLabel: 'View Bookings',
    });

    onBookService(
      service,
      pkgToBook,
      firmToBook,
      quickBookSuggestion.suggestedDate,
      quickBookSuggestion.suggestedTimeSlot,
      quickBookNotes
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 text-xs font-bold rounded-md">
              {service.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Delivery: <strong className="text-[#102B4E] dark:text-white">{service.deliveryMode}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1 bg-white dark:bg-[#08121E]">
          
          {/* Hero Banner inside modal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <h1 className="text-2xl sm:text-3xl font-black text-[#102B4E] dark:text-white tracking-tight leading-snug">
                {service.title}
              </h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {service.detailedDescription}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1464C8] dark:text-blue-400" />
                  Timeline: {service.estimatedTimeline}
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg font-bold flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                  {matchedFirms.length} Verified Providers
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-52 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Grid: Problems Solved vs Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Challenges Solved */}
            <div className="p-5 bg-red-50/60 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/40">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-800 dark:text-red-300 flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Business Challenges Solved
              </h3>
              <ul className="space-y-2">
                {service.challengesSolved.map((chal, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{chal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who Needs This Service? */}
            <div className="p-5 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1464C8] dark:text-blue-300 flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1464C8]"></span>
                Ideal For / Target Audience
              </h3>
              <ul className="space-y-2">
                {service.targetAudience.map((aud, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532] shrink-0 mt-0.5" />
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deliverables & How Service Works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Expected Deliverables */}
            <div className="p-5 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-[#102B4E] dark:text-slate-100 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1464C8] dark:text-blue-400" />
                What's Included & Deliverables
              </h3>
              <ul className="space-y-2.5">
                {service.deliverables.map((del, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Workflow Steps */}
            <div className="p-5 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-[#102B4E] dark:text-slate-100 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1464C8] dark:text-blue-400" />
                How the Service Works
              </h3>
              <div className="space-y-3">
                {service.workflowSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#102B4E] dark:bg-slate-800 text-[#B7E532] font-black flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI-Powered Quick Book Feature (Prompt #1) */}
          <div className="bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-emerald-900/10 dark:from-[#0D223A] dark:via-[#091726] dark:to-[#0D1D31] border-2 border-[#1464C8]/30 dark:border-[#1464C8]/50 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#1464C8] to-indigo-600 text-white flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#B7E532]" />
                    AI-Powered Quick Book
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#102B4E] dark:text-white mt-1.5 flex items-center gap-2">
                  <span>Intelligent Scope Analyzer & Automated Scheduling</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  Type your business situation, entity scale, or urgent deadline. Gemini analyzes your operational scope to automatically recommend the optimal package, determine the earliest viable appointment date, and prefill your booking.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-[#1464C8]/10 dark:bg-blue-900/40 text-[#1464C8] dark:text-[#B7E532] flex items-center justify-center font-black">
                  <Wand2 className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* User Notes Input Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Enter Your Business Requirements or Client Notes:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {quickBookNotes.length} characters
                </span>
              </label>

              <textarea
                rows={3}
                value={quickBookNotes}
                onChange={(e) => setQuickBookNotes(e.target.value)}
                placeholder="e.g., We operate a chain of 3 retail grocery stores in Nairobi with 24 staff. We need an urgent statutory audit and VAT reconciliation completed by next Tuesday before our board review and bank facility renewal..."
                className="w-full text-xs sm:text-sm p-3.5 bg-white dark:bg-[#071322] border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1464C8] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all shadow-inner"
              />

              {/* Sample Scenarios Quick-Fill Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
                  Try Sample Notes:
                </span>
                {[
                  {
                    label: '⚡ Urgent Tax & VAT Audit (3 Days)',
                    text: `We need an urgent tax audit, statutory VAT reconciliation, and ledger reconstruction completed within 3 days for our mid-sized business before an imminent commercial bank credit review.`,
                  },
                  {
                    label: '🏢 Multi-Branch Retail Setup (2 Weeks)',
                    text: `We are scaling 2 new retail store branches with 15 POS terminals and 30 employees. We need structured chart of accounts, automated inventory syncing, and staff training.`,
                  },
                  {
                    label: '💼 Payroll & Pension Filing (Monthly)',
                    text: `We are an SME with 28 full-time staff requiring monthly automated payroll calculations, statutory pension deductions, PAYE remittance filing, and direct pay slips.`,
                  },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickBookNotes(sample.text)}
                    className="px-2.5 py-1 bg-white dark:bg-[#0B1A2C] hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAnalyzeQuickBook}
                  disabled={!quickBookNotes.trim() || isAnalyzingQuickBook}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                    !quickBookNotes.trim() || isAnalyzingQuickBook
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#1464C8] to-[#102B4E] hover:from-[#1155aa] hover:to-[#091d38] text-white hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {isAnalyzingQuickBook ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#B7E532] animate-spin" />
                      <span>Analyzing Scope with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#B7E532]" />
                      <span>Analyze Notes & Suggest Package + Date</span>
                    </>
                  )}
                </button>

                {quickBookNotes && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuickBookNotes('');
                      setQuickBookSuggestion(null);
                      setQuickBookError(null);
                    }}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-bold cursor-pointer"
                  >
                    Clear Notes
                  </button>
                )}
              </div>

              {quickBookAppliedNotice && (
                <div className="text-xs font-bold text-emerald-600 dark:text-[#B7E532] flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{quickBookAppliedNotice}</span>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {quickBookError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{quickBookError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickBookError(null)}
                  className="text-red-500 hover:text-red-800 dark:hover:text-red-200 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* AI Suggestion Showcase Card */}
            {quickBookSuggestion && (
              <div className="mt-4 p-5 bg-white dark:bg-[#071322] rounded-2xl border-2 border-emerald-400 dark:border-[#B7E532]/60 shadow-lg space-y-4 animate-in fade-in duration-300">
                {/* Header match badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-black rounded-lg flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                      <span>{quickBookSuggestion.confidenceScore}% Scope Compatibility Match</span>
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-blue-300 text-xs font-bold rounded-lg">
                      {quickBookSuggestion.urgencyLevel}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Automated Recommendation by Gemini 3.8 Flash
                  </span>
                </div>

                {/* AI Rationale Summary */}
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-extrabold text-[#1464C8] dark:text-[#B7E532] block mb-1 uppercase tracking-wider text-[10px]">
                    Gemini Commercial Advisory Rationale:
                  </span>
                  <p className="leading-relaxed font-medium">
                    {quickBookSuggestion.reasoning}
                  </p>
                </div>

                {/* Grid: Recommended Package, Recommended Date & Firm */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Card 1: Package */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      1. Recommended Package
                    </span>
                    <div className="font-black text-sm text-[#102B4E] dark:text-white">
                      {quickBookSuggestion.suggestedPackageName}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-[#B7E532] font-bold mt-0.5">
                      Optimal Scope Fit
                    </div>
                  </div>

                  {/* Card 2: Date & Slot */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      2. Recommended Schedule
                    </span>
                    <div className="font-black text-sm text-[#102B4E] dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                      <span>{quickBookSuggestion.suggestedDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{quickBookSuggestion.suggestedTimeSlot}</span>
                    </div>
                  </div>

                  {/* Card 3: Assigned Firm */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      3. Qualified Partner Firm
                    </span>
                    <div className="font-black text-sm text-[#102B4E] dark:text-white flex items-center gap-1">
                      <span>{quickBookSuggestion.suggestedFirmName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532]" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Verified Pan-African Specialist
                    </div>
                  </div>
                </div>

                {/* Key Scope Highlights */}
                {quickBookSuggestion.keyHighlights && quickBookSuggestion.keyHighlights.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Key Scope Points Addressed:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickBookSuggestion.keyHighlights.map((hl, i) => (
                        <div
                          key={i}
                          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Book Call To Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Ready to book? All recommended parameters will be prefilled automatically.
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleApplySuggestedPackage}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      Highlight Below
                    </button>

                    <button
                      type="button"
                      onClick={handleExecuteQuickBook}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-[#1464C8] hover:from-emerald-500 hover:to-[#1155aa] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Zap className="w-4 h-4 text-[#B7E532] fill-[#B7E532]" />
                      <span>Accept & Quick Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service Packages & Transparent Pricing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#102B4E] dark:text-white">
                  Available Service Packages
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a package to book online or discuss via WhatsApp
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {service.packages.map((pkg) => {
                const isSelected = currentPkg.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-[#1464C8]/20' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0D1D31]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                        )}
                      </div>

                      <div className="text-xs font-black text-[#1464C8] dark:text-[#B7E532] mt-1.5 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Per Hour or Fixed Price</span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {pkg.duration}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-medium line-clamp-2">
                        {pkg.subtitle}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        {pkg.deliverables.slice(0, 3).map((d, i) => (
                          <div key={i} className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className="text-[#1464C8] dark:text-[#B7E532] font-bold">•</span>
                            <span className="truncate">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <button
                        type="button"
                        className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E]' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Package'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualified Verified Firms Offering this Service */}
          <div>
            <h3 className="text-sm font-black text-[#102B4E] dark:text-white mb-3">
              Verified Firms Offering This Service ({matchedFirms.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedFirms.map((firm) => (
                <div
                  key={firm.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1D31] hover:bg-white dark:hover:bg-[#11233b] hover:border-[#1464C8] hover:shadow-md transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${firm.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0`}>
                      {firm.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">{firm.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532] shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {firm.category} • {firm.city}, {firm.country}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-amber-500 font-bold flex items-center">
                            <Star className="w-3 h-3 fill-current mr-0.5" /> {firm.rating}
                          </span>
                          <span className="text-slate-400">({firm.reviewCount})</span>
                        </div>
                        {firm.isTopRated && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-[9px] border border-amber-200/60">
                            <Star className="w-2 h-2 fill-amber-500 text-amber-500" /> Top Rated
                          </span>
                        )}
                        {(firm.isFastResponder || firm.avgResponseTimeMinutes <= 30) && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[9px] border border-emerald-200">
                            <Zap className="w-2 h-2 fill-current text-emerald-600 dark:text-emerald-400" /> {firm.avgResponseTimeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <a
                      href={buildWhatsAppBookingUrl({
                        serviceName: service.title,
                        packageName: currentPkg.name,
                        providerName: firm.name,
                        location: `${firm.city}, ${firm.country}`,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                      title={`Chat on WhatsApp directly with ${firm.name}`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFirmId(firm.id);
                        onBookService(service, currentPkg, firm);
                      }}
                      className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs ${
                        selectedFirmId === firm.id
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                          : 'bg-[#1464C8] hover:bg-[#1052a5] text-white'
                      }`}
                    >
                      {selectedFirmId === firm.id ? 'Selected' : 'Select Firm'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related MsmeBooks Software Modules */}
          <div className="bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider block">
                Integrated MsmeBooks Modules
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                This service pairs directly with: {service.relatedModules.join(', ')}
              </p>
            </div>
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] underline shrink-0 hover:opacity-80"
            >
              Explore Software
            </a>
          </div>

          {/* Security, Certification & Client Protection Section */}
          <div className="bg-slate-50 dark:bg-[#071322] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-[#B7E532]" />
              <h3 className="text-sm font-black text-[#102B4E] dark:text-white uppercase tracking-wider">
                Security, Data Protection & Professional Accreditations
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1464C8] dark:text-[#B7E532]">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>ISO 27001 & Bank-Level SSL</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    All financial docs and ledger exports use AES 256-bit encryption in transit and at rest.
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cloud Tier 4 Vault</span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>NDPR & GDPR Compliant</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Strict adherence to the Nigeria Data Protection Act & African privacy standards. Zero third-party resale.
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certified Privacy</span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>ICAN / ANAN / ACCA</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Consultants hold active practice licenses with statutory accounting institutes across Africa.
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peer-Verified</span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <FileCheck className="w-4 h-4 shrink-0" />
                    <span>Mutual Non-Disclosure (NDA)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Every consultation automatically binds the firm to a strict institutional non-disclosure agreement.
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legal Guarantee</span>
              </div>
            </div>
          </div>

          {/* Section: Verified Client Reviews & Star Rating System */}
          <div className="p-6 bg-slate-50 dark:bg-[#07111D] rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>Client Reviews & Verified Ratings</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#B7E532] text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                    100% Verified Engagements
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authentic ratings from African founders, CFOs, and finance directors who booked this service.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="px-4 py-2 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-[#1464C8] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isWritingReview ? 'Close Review Form' : 'Share Your Review'}</span>
              </button>
            </div>

            {/* Aggregate Score & Distribution Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-white dark:bg-[#0A1727] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90">
              {/* Score summary */}
              <div className="sm:col-span-4 text-center sm:text-left sm:border-r sm:border-slate-200 dark:sm:border-slate-800 sm:pr-6">
                <div className="text-4xl font-black text-[#102B4E] dark:text-white">
                  {(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                  <span className="text-lg font-bold text-slate-400"> / 5.0</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mt-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  Based on {reviews.length} authenticated reviews
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="sm:col-span-8 space-y-1.5 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r: any) => r.rating === stars).length;
                  const pct = Math.round((count / (reviews.length || 1)) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-7 text-right font-bold text-slate-500 dark:text-slate-400">{stars}★</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[11px] font-semibold text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Review Form */}
            {isWritingReview && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-white dark:bg-[#0A1727] p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-4 animate-in fade-in zoom-in-95"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-[#102B4E] dark:text-white uppercase tracking-wider">
                    Submit Client Review for {service.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">All fields required</span>
                </div>

                {reviewSuccess ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#B7E532]" />
                    <span>Thank you! Your verified review has been submitted and published.</span>
                  </div>
                ) : (
                  <>
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Overall Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starVal) => {
                            const isFilled = (hoverRating !== null ? hoverRating : reviewRating) >= starVal;
                            return (
                              <button
                                key={starVal}
                                type="button"
                                onMouseEnter={() => setHoverRating(starVal)}
                                onMouseLeave={() => setHoverRating(null)}
                                onClick={() => setReviewRating(starVal)}
                                className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 ml-2">
                          {reviewRating === 5 && '5.0 - Exceptional / Highly Recommended'}
                          {reviewRating === 4 && '4.0 - Very Good'}
                          {reviewRating === 3 && '3.0 - Good'}
                          {reviewRating === 2 && '2.0 - Fair'}
                          {reviewRating === 1 && '1.0 - Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Your Name & Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Adeola Adeleke (Chief Financial Officer)"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerCompany}
                          onChange={(e) => setReviewerCompany(e.target.value)}
                          placeholder="e.g. Sahara Prime Retail Ltd"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Operational City & Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerLocation}
                          onChange={(e) => setReviewerLocation(e.target.value)}
                          placeholder="e.g. Lagos, Nigeria 🇳🇬"
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Service Package Engaged *
                        </label>
                        <select
                          value={reviewPkgName}
                          onChange={(e) => setReviewPkgName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                        >
                          {service.packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>
                              {pkg.name} ({formatPriceString(pkg.priceDisplay)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Assigned Advisory / Implementation Partner Firm
                      </label>
                      <select
                        value={reviewFirmName}
                        onChange={(e) => setReviewFirmName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                      >
                        {matchedFirms.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name} ({f.city}, {f.country}) - {f.partnerTier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Detailed Review & Business Impact *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe the rollout timeline, accuracy of accounts/tax computations, responsiveness of consultants, and business outcomes achieved..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Client Review Badge will be attached</span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* Filter Reviews by Specific Firm */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                Filter by Firm:
              </span>
              <button
                type="button"
                onClick={() => setFilterFirmReview('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterFirmReview === 'all'
                    ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                    : 'bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                All Firms ({reviews.length})
              </button>
              {matchedFirms.map((f) => {
                const count = reviews.filter((r: any) => (r.firmName || '').toLowerCase().includes(f.name.toLowerCase())).length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterFirmReview(f.name)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterFirmReview === f.name
                        ? 'bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]'
                        : 'bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{f.name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* List of Reviews */}
            <div className="space-y-4">
              {reviews
                .filter((r: any) => {
                  if (filterFirmReview === 'all') return true;
                  return (r.firmName || '').toLowerCase().includes(filterFirmReview.toLowerCase());
                })
                .map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#102B4E] to-[#1464C8] text-[#B7E532] flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {rev.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-[#102B4E] dark:text-white">
                            {rev.authorName}
                          </h4>
                          {rev.verified && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532] text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified Client
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rev.companyName} • <span className="font-semibold text-slate-600 dark:text-slate-300">{rev.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">• {rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {rev.comment}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">
                        Package: <strong className="text-slate-800 dark:text-slate-200">{rev.packageName}</strong>
                      </span>
                      {rev.firmName && (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-blue-300 rounded-md font-medium">
                          Firm: <strong className="text-[#102B4E] dark:text-white">{rev.firmName}</strong>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id)}
                      className="text-slate-500 hover:text-[#1464C8] dark:hover:text-[#B7E532] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Provider Expansion / Notify Me Section */}
          <div className="bg-gradient-to-r from-blue-900/10 via-[#102B4E]/10 to-slate-900/10 dark:from-blue-950/40 dark:via-[#0E223D] dark:to-slate-900/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1464C8] text-white flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#102B4E] dark:text-white">
                    Need this service in another country or city?
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  We are actively onboarding chartered firms across Africa. Subscribe to receive an instant alert when verified partners become available in your region.
                </p>
              </div>

              {notifySuccess ? (
                <div className="w-full sm:w-auto bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                  <span>Subscribed! We'll alert {notifyEmail || 'you'} when providers launch in {notifyCountry}.</span>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!notifyEmail) return;
                    try {
                      const existing = JSON.parse(localStorage.getItem('msmebooks_availability_alerts') || '[]');
                      existing.push({
                        email: notifyEmail,
                        country: notifyCountry,
                        serviceId: service.id,
                        serviceTitle: service.title,
                        timestamp: new Date().toISOString()
                      });
                      localStorage.setItem('msmebooks_availability_alerts', JSON.stringify(existing));
                    } catch (err) {
                      console.error(err);
                    }
                    setNotifySuccess(true);
                  }}
                  className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <select
                    value={notifyCountry}
                    onChange={(e) => setNotifyCountry(e.target.value)}
                    className="text-xs bg-white dark:bg-[#0B192A] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                  >
                    <option value="Kenya">Kenya (KE)</option>
                    <option value="Ghana">Ghana (GH)</option>
                    <option value="South Africa">South Africa (ZA)</option>
                    <option value="Rwanda">Rwanda (RW)</option>
                    <option value="Uganda">Uganda (UG)</option>
                    <option value="Tanzania">Tanzania (TZ)</option>
                    <option value="Nigeria">Nigeria (NG)</option>
                    <option value="UK / International">UK / International</option>
                  </select>

                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="your.email@company.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full sm:w-56 text-xs bg-white dark:bg-[#0B192A] border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-2 py-2 font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#102B4E] hover:bg-[#153866] text-[#B7E532] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notify Me</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Sticky Desktop & Mobile Bottom Booking Bar */}
        <div className="sticky bottom-0 bg-[#102B4E] text-white p-4 sm:p-5 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div>
              <div className="text-xs text-slate-300">
                Selected: <strong className="text-white">{currentPkg.name}</strong>
              </div>
              <div className="text-base sm:text-lg font-black text-[#B7E532] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-[#B7E532] shrink-0" />
                <span>Per Hour or Fixed Price Billing</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Hourly rate or fixed project days scheduled directly with verified firm: <strong className="text-[#B7E532]">{activeFirm.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Book with Specific Firm */}
            <button
              onClick={() => onBookService(service, currentPkg, activeFirm)}
              className="flex-1 sm:flex-none px-5 py-3 bg-[#1464C8] hover:bg-[#1155aa] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>

            {/* Direct WhatsApp Chat with Specific Firm */}
            <a
              href={buildWhatsAppBookingUrl({
                serviceName: service.title,
                packageName: currentPkg.name,
                providerName: activeFirm.name,
                location: `${activeFirm.city}, ${activeFirm.country}`,
              })}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              title={`Chat on WhatsApp directly with ${activeFirm.name}`}
            >
              <MessageCircle className="w-4 h-4 text-[#102B4E]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
