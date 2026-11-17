import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Video,
  FileText,
  TrendingUp,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Play,
  Eye,
  Link as LinkIcon,
  Film,
  Camera,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap
} from 'lucide-react';
import { ClientTestimonial, ClientMetric, SpotlightIndustry } from '../data/clientTestimonials';

interface SubmitStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newStory: ClientTestimonial) => void;
}

type IndustryType = SpotlightIndustry;

interface PresetOption {
  id: string;
  label: string;
  url: string;
}

const PRESET_AVATARS: PresetOption[] = [
  {
    id: 'av-1',
    label: 'Corporate Lead',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'av-2',
    label: 'Founder & Innovator',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'av-3',
    label: 'Operations Executive',
    url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&auto=format&fit=crop&q=80'
  }
];

const PRESET_COVERS: PresetOption[] = [
  {
    id: 'cov-1',
    label: 'Modern Enterprise Office',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'cov-2',
    label: 'Team Strategy Session',
    url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'cov-3',
    label: 'Digital Operations Hub',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80'
  }
];

const COUNTRY_OPTIONS = [
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Ivory Coast', flag: '🇨🇮' },
];

export const SubmitStoryModal: React.FC<SubmitStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [submittedStory, setSubmittedStory] = useState<ClientTestimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Fields: SME & Contact
  const [companyName, setCompanyName] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [role, setRole] = useState<string>('Founder & CEO');
  const [city, setCity] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('Nigeria');
  const [industry, setIndustry] = useState<IndustryType>('Retail');
  const [consentForSlider, setConsentForSlider] = useState<boolean>(true);

  // Form Fields: Story Narrative
  const [headline, setHeadline] = useState<string>('');
  const [quote, setQuote] = useState<string>('');
  const [beforeState, setBeforeState] = useState<string>('');
  const [afterState, setAfterState] = useState<string>('');
  const [fullStory, setFullStory] = useState<string>('');

  // Form Fields: Key Metric
  const [metricLabel, setMetricLabel] = useState<string>('Monthly Reconciliation Time');
  const [metricValue, setMetricValue] = useState<string>('3 Hours');
  const [metricChange, setMetricChange] = useState<string>('-85% reduction');

  // Form Fields: Implementation details
  const [partnerName, setPartnerName] = useState<string>('Apex Strategic Financials');
  const [partnerTier, setPartnerTier] = useState<string>('Diamond Elite');
  const [implementationTime, setImplementationTime] = useState<string>('2 Weeks');
  const [modulesUsedText, setModulesUsedText] = useState<string>('Multi-Store POS Sync, Automated Bank Feeds, Tax Compliance Gateway');

  // Form Fields: Media & Video Integration Placeholder
  const [storyType, setStoryType] = useState<'video' | 'text'>('video');
  const [videoMethod, setVideoMethod] = useState<'url' | 'upload'>('url');
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=sample-msme-case');
  const [videoDuration, setVideoDuration] = useState<string>('2:10 min');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<{ name: string; size: string } | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(100);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);

  // Avatar & Cover
  const [avatarUrl, setAvatarUrl] = useState<string>(PRESET_AVATARS[0].url);
  const [coverUrl, setCoverUrl] = useState<string>(PRESET_COVERS[0].url);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState<boolean>(false);
  const [customCoverUploaded, setCustomCoverUploaded] = useState<boolean>(false);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Focus trap / ESC handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Selected Country object
  const currentCountryObj = COUNTRY_OPTIONS.find((c) => c.name === selectedCountry) || COUNTRY_OPTIONS[0];

  // Helper to handle custom image file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'avatar') {
          setAvatarUrl(reader.result);
          setCustomAvatarUploaded(true);
        } else {
          setCoverUrl(reader.result);
          setCustomCoverUploaded(true);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle video file upload simulation
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSimulatingUpload(true);
    setVideoUploadProgress(15);

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedVideoFile({
      name: file.name,
      size: `${sizeInMb} MB`,
    });

    // Simulate progress
    const timer1 = setTimeout(() => setVideoUploadProgress(65), 300);
    const timer2 = setTimeout(() => {
      setVideoUploadProgress(100);
      setIsSimulatingUpload(false);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Sample African SME story prefill for fast testing
  const handlePrefillSample = () => {
    setCompanyName('Kilifi Organic Dairies & Agro Ltd');
    setClientName('David Kamau');
    setRole('Managing Director & Co-Founder');
    setCity('Mombasa & Kilifi');
    setSelectedCountry('Kenya');
    setIndustry('Agriculture');
    setConsentForSlider(true);
    setHeadline('Cut inventory spillage by 88% and automated KRA iTax compliance');
    setQuote('Running a fresh dairy processing chain across the coast meant every cold-room delay cost money. MsmeBooks and our local partner gave us real-time milk collection batching and automated M-Pesa vendor payouts.');
    setBeforeState('Farmgate milk purchase vouchers were scribbled on clipboards, leading to disputes with 320 dairy farmers every month-end closing.');
    setAfterState('Every milk batch received at the chiller gate is logged via barcode handhelds, with automatic farmer SMS receipts and instant payments.');
    setFullStory('Kilifi Organic Dairies processes over 18,000 liters of pasteurized milk and artisanal yogurts daily. Previously, the lack of real-time inventory synchronization caused significant spoilage and inaccurate cost-of-goods calculations. Working with certified implementation specialists, we deployed MsmeBooks Batch Track and Farmgate Agent Ledger. Our gross operating margin rose by 19% in the first quarter.');
    setMetricLabel('Spoilage & Leakage');
    setMetricValue('0.3%');
    setMetricChange('Down from 6.8%');
    setPartnerName('Equator Cloud Financials');
    setPartnerTier('Platinum');
    setImplementationTime('3 Weeks');
    setModulesUsedText('Farmgate Batch Receipts, Cold Chain Spoilage Ledger, Automated KRA iTax Export, M-Pesa Bulk Pay');
    setStoryType('video');
    setVideoMethod('url');
    setVideoUrl('https://youtube.com/watch?v=kilifi-organic-spotlight');
    setVideoDuration('2:18 min');
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!clientName.trim()) newErrors.clientName = 'Your name or founder name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!headline.trim()) newErrors.headline = 'Story headline is required';
    if (!quote.trim()) newErrors.quote = 'A brief summary quote is required';
    if (!beforeState.trim()) newErrors.beforeState = 'Please describe the challenge before MsmeBooks';
    if (!afterState.trim()) newErrors.afterState = 'Please describe the transformation / solution';
    if (!fullStory.trim()) newErrors.fullStory = 'Please provide the narrative background';

    if (storyType === 'video' && videoMethod === 'url' && !videoUrl.trim()) {
      newErrors.videoUrl = 'Please provide a video link or embed URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Compile full story object
  const constructStoryObject = (): ClientTestimonial => {
    const modules = modulesUsedText
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const metrics: ClientMetric[] = [
      {
        label: metricLabel || 'Primary Result',
        value: metricValue || '100% Verified',
        change: metricChange || 'Significant improvement',
      },
    ];

    const newId = `spotlight-comm-${Date.now()}`;
    const countryObj = COUNTRY_OPTIONS.find((c) => c.name === selectedCountry) || COUNTRY_OPTIONS[0];

    return {
      id: newId,
      clientName: clientName.trim(),
      role: role.trim() || 'Business Leader',
      companyName: companyName.trim(),
      industry,
      location: `${city.trim()}, ${selectedCountry}`,
      countryFlag: countryObj.flag,
      type: storyType,
      avatarUrl,
      coverUrl,
      videoDuration: storyType === 'video' ? videoDuration || '2:00 min' : undefined,
      videoThumbnailUrl: storyType === 'video' ? coverUrl : undefined,
      videoUrl: storyType === 'video' ? videoUrl : undefined,
      headline: headline.trim(),
      quote: quote.trim(),
      fullStory: fullStory.trim(),
      metrics,
      modulesUsed: modules.length > 0 ? modules : ['MsmeBooks Core Ledger', 'Automated Bank Feeds'],
      partnerInvolved: {
        name: partnerName.trim() || 'Verified Independent Setup',
        tier: partnerTier || 'Certified Partner',
        city: `${city.trim()}, ${selectedCountry}`,
      },
      implementationTime: implementationTime || '2 Weeks',
      verifiedDate: 'Just Now',
      beforeState: beforeState.trim(),
      afterState: afterState.trim(),
      rating: 5.0,
      isCommunitySubmission: true,
      featuredOnSlider: consentForSlider,
      consentForSlider: consentForSlider,
      transcript:
        storyType === 'video'
          ? [
              {
                time: '0:00',
                speaker: clientName.trim(),
                text: headline.trim(),
              },
              {
                time: '0:45',
                speaker: clientName.trim(),
                text: quote.trim(),
              },
            ]
          : undefined,
    };
  };

  // Handle final submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab('form');
      return;
    }

    setIsSubmitting(true);
    const story = constructStoryObject();

    // Brief timeout for realistic feedback feeling
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedStory(story);
      onSubmitSuccess(story);
    }, 600);
  };

  const previewStory = constructStoryObject();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c1f38] text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-lime-500/20 text-lime-600 dark:text-lime-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 id="submit-modal-title" className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Submit Your SME Success Story
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share how MsmeBooks transformed your business operations with our global community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Demo Pre-fill for reviewers / testers */}
            <button
              type="button"
              onClick={handlePrefillSample}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 text-lime-700 dark:text-lime-400 border border-lime-500/30 text-xs font-semibold transition-colors"
              title="Auto-fill with sample African SME data"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fill Sample Story</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close submission modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Confirmation View if Story has been submitted */}
        {submittedStory ? (
          <div className="p-8 sm:p-12 text-center max-w-xl mx-auto my-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-lime-500/20 text-lime-500 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-500 text-slate-950 mb-3 inline-block">
                Registry Live Contribution
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Story Successfully Published!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Thank you, <strong>{submittedStory.clientName}</strong>! <strong>{submittedStory.companyName}</strong> has been added to the MsmeBooks Client Spotlight registry and is now visible to SMEs across Africa.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left flex items-center gap-4">
              <img
                src={submittedStory.avatarUrl}
                alt={submittedStory.clientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-lime-500"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  &ldquo;{submittedStory.headline}&rdquo;
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {submittedStory.industry} • {submittedStory.location} {submittedStory.countryFlag}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-lime-500/20 text-lime-600 dark:text-lime-400">
                {submittedStory.type === 'video' ? 'Video Case' : 'Text Review'}
              </span>
            </div>

            {/* Slider Consent Confirmation Badge */}
            <div className="flex items-center justify-between text-xs py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Main Landing Page Slider Placement:</span>
              <span className={`font-bold inline-flex items-center gap-1.5 ${submittedStory.featuredOnSlider ? 'text-lime-600 dark:text-lime-400' : 'text-slate-500'}`}>
                {submittedStory.featuredOnSlider ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-lime-500" />
                    <span>Consent Granted (Queued for Slider)</span>
                  </>
                ) : (
                  <span>Registry Only (No Slider)</span>
                )}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View in Client Spotlight Registry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedStory(null);
                  handlePrefillSample();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
              >
                Submit Another Story
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* View Mode Switcher: Edit Form vs Live Registry Preview */}
            <div className="px-6 py-2 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'form'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Edit Story Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Registry Preview</span>
                </button>
              </div>

              <div className="hidden sm:block text-[11px] text-slate-400">
                {storyType === 'video' ? '📹 Video Spotlight enabled' : '📄 Written Case Study enabled'}
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="overflow-y-auto p-6 sm:p-8 flex-1">
              
              {activeTab === 'preview' ? (
                /* LIVE REGISTRY CARD PREVIEW */
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-center mb-4">
                    <span className="text-xs font-semibold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
                      Interactive Card Preview
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      How your card appears in the registry
                    </h3>
                  </div>

                  {/* Rendered Preview Card */}
                  <article className="bg-white dark:bg-[#0d223f] border-2 border-lime-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col group">
                    <div className="relative h-48 w-full bg-slate-900">
                      <img
                        src={previewStory.coverUrl}
                        alt="Preview cover"
                        className="w-full h-full object-cover brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                          {previewStory.industry}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-lime-500 text-slate-950 shadow-md">
                          {previewStory.type === 'video' ? (
                            <>
                              <Video className="w-3 h-3" />
                              <span>Video • {previewStory.videoDuration}</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3" />
                              <span>Case Study</span>
                            </>
                          )}
                        </span>
                      </div>

                      {previewStory.type === 'video' && (
                        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-lime-400" />
                          <span>{previewStory.location || 'Location'}</span>
                        </div>
                        <span className="text-base">{previewStory.countryFlag}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Metric */}
                        <div className="bg-lime-50 dark:bg-lime-950/30 border border-lime-200 dark:border-lime-800/40 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-lime-800 dark:text-lime-300 font-semibold">
                              {previewStory.metrics[0].label}
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white">
                              {previewStory.metrics[0].value}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-lime-500 text-slate-950">
                            <TrendingUp className="w-3 h-3" />
                            {previewStory.metrics[0].change}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug mb-2">
                          &ldquo;{previewStory.headline || 'Your Headline Will Appear Here'}&rdquo;
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                          {previewStory.quote || 'Your summary quote will show here...'}
                        </p>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-700 dark:text-lime-400 font-bold border border-lime-500/30">
                            ✨ Community Contributor
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Partner: {previewStory.partnerInvolved.name}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 mt-4">
                        <img
                          src={previewStory.avatarUrl}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-lime-500"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {previewStory.clientName || 'Your Name'}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {previewStory.role} • {previewStory.companyName || 'Company'}
                          </div>
                        </div>
                      </div>

                      {/* Slider Consent Status in Preview */}
                      {previewStory.featuredOnSlider && (
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] bg-lime-500/10 -mx-5 -mb-5 px-5 py-2.5">
                          <span className="flex items-center gap-1.5 font-bold text-lime-700 dark:text-lime-300">
                            <Sparkles className="w-3.5 h-3.5 fill-lime-500 text-lime-500" />
                            <span>Approved for Landing Page Slider</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500 text-slate-950">
                            Slider Enabled
                          </span>
                        </div>
                      )}
                    </div>
                  </article>

                  <div className="text-center pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('form')}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      ← Back to Form to Make Edits
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: Format Selector */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                      Story Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStoryType('video')}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          storyType === 'video'
                            ? 'bg-white dark:bg-slate-800 border-lime-500 shadow-sm ring-2 ring-lime-500/20'
                            : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className={`p-2 rounded-lg ${storyType === 'video' ? 'bg-lime-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <Video className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Video Spotlight & Text</span>
                            {storyType === 'video' && <Check className="w-4 h-4 text-lime-500" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Integrate video link (YouTube/Vimeo) or upload video footage with player controls
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoryType('text')}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          storyType === 'text'
                            ? 'bg-white dark:bg-slate-800 border-lime-500 shadow-sm ring-2 ring-lime-500/20'
                            : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className={`p-2 rounded-lg ${storyType === 'text' ? 'bg-lime-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <FileText className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Written Case Study</span>
                            {storyType === 'text' && <Check className="w-4 h-4 text-lime-500" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Before-and-after operational breakdown with audited metrics and quotes
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: SME & Contact Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Building2 className="w-4 h-4 text-lime-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        1. Business & Contact Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          SME / Enterprise Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Atlas Agro Processing Ltd"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                            errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        />
                        {errors.companyName && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.companyName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="story-industry-dropdown" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Industry Sector <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="story-industry-dropdown"
                          data-testid="story-industry-dropdown"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value as IndustryType)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer"
                        >
                          <option value="Retail">Retail (e.g. Supermarkets, Wholesale & E-commerce)</option>
                          <option value="Agriculture">Agriculture (e.g. Farming, Agro-Processing & Allied)</option>
                          <option value="Tech">Tech (e.g. Software, Fintech, SaaS & IT Services)</option>
                          <option value="Healthcare & Pharmacy">Healthcare & Pharmacy</option>
                          <option value="Hospitality & Restaurants">Hospitality & Restaurants</option>
                          <option value="Logistics & Distribution">Logistics & Supply Chain</option>
                          <option value="Manufacturing">Manufacturing & Production</option>
                          <option value="Professional Services">Professional & Financial Services</option>
                          <option value="Retail & Supermarkets">Retail & Supermarkets (Legacy)</option>
                          <option value="Manufacturing & Agro">Manufacturing & Agro (Legacy)</option>
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Select the industry sector that best describes your business operations
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Contact / Founder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Fatima Mansoor"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                            errors.clientName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        />
                        {errors.clientName && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.clientName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Founder / Contact Title
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Managing Partner & CFO"
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          City / Region <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Ikeja, Lagos"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                            errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.city}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Country
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        >
                          {COUNTRY_OPTIONS.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.flag} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Transformation Narrative */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <FileText className="w-4 h-4 text-lime-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        2. Success Story & Results
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Story Catchy Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Cut invoice reconciliation time from 5 days to 2 hours with automated POS sync"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                          errors.headline ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                        } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                      />
                      {errors.headline && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.headline}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Executive Summary Quote <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        placeholder="A concise quote from you highlighting the business impact..."
                        className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                          errors.quote ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                        } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                      />
                      {errors.quote && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.quote}</span>
                        </p>
                      )}
                    </div>

                    {/* Challenge vs Solution Dual Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>The Challenge (Before MsmeBooks)</span> <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={beforeState}
                          onChange={(e) => setBeforeState(e.target.value)}
                          placeholder="What bottlenecks, manual logs, or cash discrepancies were slowing you down?"
                          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                            errors.beforeState ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        />
                        {errors.beforeState && (
                          <p className="text-xs text-red-500 mt-1">{errors.beforeState}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>The Transformation (After Setup)</span> <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={afterState}
                          onChange={(e) => setAfterState(e.target.value)}
                          placeholder="How did MsmeBooks and automated modules streamline your financial operations?"
                          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                            errors.afterState ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                        />
                        {errors.afterState && (
                          <p className="text-xs text-red-500 mt-1">{errors.afterState}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Detailed Narrative Story <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={fullStory}
                        onChange={(e) => setFullStory(e.target.value)}
                        placeholder="Provide details about your business background, team adoption, and operational evolution..."
                        className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border ${
                          errors.fullStory ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-lime-500'
                        } text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                      />
                      {errors.fullStory && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullStory}</p>
                      )}
                    </div>

                    {/* Breakthrough Impact Metric */}
                    <div className="p-4 rounded-xl bg-lime-50/50 dark:bg-lime-950/20 border border-lime-200/80 dark:border-lime-900/40">
                      <span className="text-xs font-bold uppercase tracking-wider text-lime-800 dark:text-lime-300 flex items-center gap-1.5 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Key Breakthrough Metric Achieved</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Metric Label
                          </label>
                          <input
                            type="text"
                            value={metricLabel}
                            onChange={(e) => setMetricLabel(e.target.value)}
                            placeholder="e.g. Month-end Closing"
                            className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Achieved Result
                          </label>
                          <input
                            type="text"
                            value={metricValue}
                            onChange={(e) => setMetricValue(e.target.value)}
                            placeholder="e.g. 2 Hours"
                            className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Percentage / Impact
                          </label>
                          <input
                            type="text"
                            value={metricChange}
                            onChange={(e) => setMetricChange(e.target.value)}
                            placeholder="e.g. -90% time saved"
                            className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Video Integration Placeholder (When Video format selected) */}
                  {storyType === 'video' && (
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-lime-400" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            3. Video Integration Placeholder
                          </h3>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 font-semibold border border-lime-500/30">
                          Video Testimonial Channel
                        </span>
                      </div>

                      {/* Video Source Tabs: Link vs Upload */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVideoMethod('url')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            videoMethod === 'url'
                              ? 'bg-lime-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Paste Video Link (YouTube / Vimeo / Loom)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoMethod('upload')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            videoMethod === 'upload'
                              ? 'bg-lime-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Video File (.mp4 / .mov)</span>
                        </button>
                      </div>

                      {videoMethod === 'url' ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">
                              External Video Link or Embed URL <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                              />
                            </div>
                            {errors.videoUrl && (
                              <p className="text-xs text-red-400 mt-1">{errors.videoUrl}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-1/2">
                              <label className="block text-xs text-slate-300 mb-1">
                                Video Duration (min:sec)
                              </label>
                              <input
                                type="text"
                                value={videoDuration}
                                onChange={(e) => setVideoDuration(e.target.value)}
                                placeholder="e.g. 2:15 min"
                                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                              />
                            </div>
                            <div className="w-1/2 text-xs text-slate-400 pt-5">
                              Supported: YouTube, Vimeo, Loom, Cloudflare Stream, Wistia
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Direct Video Dropzone / Upload Placeholder */
                        <div className="space-y-3">
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/quicktime,video/webm"
                            onChange={handleVideoFileSelect}
                            className="hidden"
                          />
                          
                          <div
                            onClick={() => videoInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-700 hover:border-lime-500/80 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60 group"
                          >
                            <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-lime-500/20 text-slate-400 group-hover:text-lime-400 mx-auto flex items-center justify-center transition-colors mb-3">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors">
                              {uploadedVideoFile ? `Selected: ${uploadedVideoFile.name}` : 'Click to select or drop video file here'}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              MP4, MOV, or WebM • Max 150MB • 1080p / 4K recommended
                            </p>

                            {uploadedVideoFile && (
                              <div className="mt-4 max-w-sm mx-auto">
                                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                                  <span>{isSimulatingUpload ? 'Simulating upload...' : 'File Ready'}</span>
                                  <span>{videoUploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-lime-400 transition-all duration-300"
                                    style={{ width: `${videoUploadProgress}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-lime-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{uploadedVideoFile.size} • Encoded for Web Playback</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="w-1/2">
                            <label className="block text-xs text-slate-300 mb-1">
                              Video Duration (min:sec)
                            </label>
                            <input
                              type="text"
                              value={videoDuration}
                              onChange={(e) => setVideoDuration(e.target.value)}
                              placeholder="e.g. 1:55 min"
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Video Player Mockup Preview */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                          <span>Video Spotlight Player Interface Preview:</span>
                          <span className="text-lime-400 font-mono text-[11px]">Ready for HTML5 / Stream Hook</span>
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                          <img
                            src={coverUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          
                          <div className="absolute m-auto w-12 h-12 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </div>

                          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 text-xs">
                            <img src={avatarUrl} alt="Speaker" className="w-5 h-5 rounded-full object-cover border border-lime-400" />
                            <span className="font-bold text-white text-[11px]">{clientName || 'Founder Name'}</span>
                          </div>

                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 font-mono">
                            <span>0:00</span>
                            <div className="flex-1 mx-3 h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-1/4 bg-lime-400" />
                            </div>
                            <span>{videoDuration || '2:15 min'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Images & Visual Media */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Camera className="w-4 h-4 text-lime-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        4. Visual Media & Founder Portrait
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Avatar Selection / Upload */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                        <label className="block text-xs font-bold text-slate-900 dark:text-white">
                          Founder Profile Photo / Avatar
                        </label>
                        <div className="flex items-center gap-4">
                          <img
                            src={avatarUrl}
                            alt="Selected avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-lime-500 shadow-md"
                          />
                          <div className="space-y-1.5 flex-1">
                            <input
                              ref={avatarInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'avatar')}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => avatarInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Custom Photo</span>
                            </button>
                            <p className="text-[11px] text-slate-400">
                              {customAvatarUploaded ? 'Custom image loaded' : 'Or choose a preset below:'}
                            </p>
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          {PRESET_AVATARS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setAvatarUrl(p.url);
                                setCustomAvatarUploaded(false);
                              }}
                              className={`relative rounded-full overflow-hidden w-9 h-9 border-2 transition-transform ${
                                avatarUrl === p.url && !customAvatarUploaded
                                  ? 'border-lime-500 scale-110 shadow'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                              title={p.label}
                            >
                              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cover Photo Selection / Upload */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                        <label className="block text-xs font-bold text-slate-900 dark:text-white">
                          Story Card Cover / Video Thumbnail
                        </label>
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                          <img
                            src={coverUrl}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                            <input
                              ref={coverInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'cover')}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => coverInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Cover</span>
                            </button>
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] text-slate-400">Presets:</span>
                          {PRESET_COVERS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setCoverUrl(p.url);
                                setCustomCoverUploaded(false);
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                                coverUrl === p.url && !customCoverUploaded
                                  ? 'bg-lime-500 text-slate-950 font-bold border-lime-500'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Step 6: Modules & Implementation Partner Credit */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <ShieldCheck className="w-4 h-4 text-lime-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        5. Implementation Partner & Modules Used
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Implementation Partner Name
                        </label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="e.g. PrimeLedger Africa"
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Partner Level / Tier
                        </label>
                        <select
                          value={partnerTier}
                          onChange={(e) => setPartnerTier(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        >
                          <option value="Diamond Elite">Diamond Elite</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Gold">Gold</option>
                          <option value="Silver Certified">Silver Certified</option>
                          <option value="Direct Setup">Direct In-House Setup</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Implementation Duration
                        </label>
                        <input
                          type="text"
                          value={implementationTime}
                          onChange={(e) => setImplementationTime(e.target.value)}
                          placeholder="e.g. 2 Weeks"
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        MsmeBooks Modules Activated (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={modulesUsedText}
                        onChange={(e) => setModulesUsedText(e.target.value)}
                        placeholder="Multi-Store POS Sync, Automated Bank Feeds, Tax Compliance"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                      />
                    </div>
                  </div>

                  {/* Step 6: Main Landing Page Slider Consent Checkbox */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-lime-500/10 via-emerald-500/5 to-slate-50 dark:to-slate-900/60 border border-lime-500/30 dark:border-lime-500/20">
                    <label htmlFor="consent-to-slider-checkbox" className="flex items-start gap-3.5 cursor-pointer select-none">
                      <div className="pt-0.5">
                        <input
                          id="consent-to-slider-checkbox"
                          data-testid="consent-to-slider-checkbox"
                          type="checkbox"
                          checked={consentForSlider}
                          onChange={(e) => setConsentForSlider(e.target.checked)}
                          className="w-5 h-5 rounded text-lime-500 focus:ring-lime-400 focus:ring-offset-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 cursor-pointer accent-lime-500"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Consent to be featured on main landing page slider
                          </span>
                          {consentForSlider ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-500 text-slate-950 shadow-sm">
                              <Sparkles className="w-3 h-3 fill-slate-950" />
                              <span>Featured Slider Approved</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Spotlight Registry Only
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          I consent to have my company's story, verified metrics, and quote featured on the main landing page slider and high-visibility marketing showcases.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Consent & Submission Notice */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-500 flex-shrink-0 mt-0.5" />
                    <span>
                      By submitting, you authorize MsmeBooks to publish this case study in the public Client Spotlight directory to encourage other emerging market businesses. You can edit or remove your community submission at any time.
                    </span>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Card in Registry</span>
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Adding to Registry...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 fill-slate-950" />
                            <span>Submit Story & Add to Registry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
