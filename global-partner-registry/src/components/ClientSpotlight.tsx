import React, { useState, useId } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  X, 
  Maximize2, 
  Subtitles, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  ExternalLink,
  RotateCcw,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { 
  CLIENT_SPOTLIGHT_DATA, 
  ClientTestimonial, 
  loadCommunityStories, 
  saveCommunityStory, 
  deleteCommunityStory 
} from '../data/clientTestimonials';
import { SubmitStoryModal } from './SubmitStoryModal';

// Helper to compute user initials from client/founder name
export const getInitials = (name: string): string => {
  if (!name) return 'MB';
  const clean = name.replace(/[^\w\s]/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MB';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generates consistent elegant gradient background from name
export const getAvatarBg = (name: string): string => {
  const gradients = [
    'from-emerald-600 to-teal-700 text-white',
    'from-blue-600 to-indigo-700 text-white',
    'from-amber-600 to-orange-700 text-white',
    'from-purple-600 to-violet-800 text-white',
    'from-sky-600 to-cyan-700 text-white',
    'from-rose-600 to-pink-700 text-white',
    'from-teal-600 to-emerald-800 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

interface ClientSpotlightProps {
  onOpenDirectory?: () => void;
  onSelectPartnerByName?: (partnerName: string) => void;
}

type FormatFilter = 'all' | 'video' | 'text';

export const ClientSpotlight: React.FC<ClientSpotlightProps> = ({
  onOpenDirectory,
  onSelectPartnerByName,
}) => {
  // Master list of stories (base dataset + stored community submissions)
  const [stories, setStories] = useState<ClientTestimonial[]>(() => {
    const community = loadCommunityStories();
    return [...community, ...CLIENT_SPOTLIGHT_DATA];
  });

  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Submit Story Modal & Toast
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedStoryId, setHighlightedStoryId] = useState<string | null>(null);

  // Modal states
  const [activeVideoItem, setActiveVideoItem] = useState<ClientTestimonial | null>(null);
  const [activeCaseStudyItem, setActiveCaseStudyItem] = useState<ClientTestimonial | null>(null);
  
  // Video Player Simulated Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSec, setProgressSec] = useState<number>(18);
  const [totalSec, setTotalSec] = useState<number>(134); // ~2:14

  const announcementId = useId();

  // Story submission handler
  const handleStorySubmitted = (newStory: ClientTestimonial) => {
    const updatedCommunity = saveCommunityStory(newStory);
    setStories([...updatedCommunity, ...CLIENT_SPOTLIGHT_DATA]);
    setHighlightedStoryId(newStory.id);
    setToastMessage(`"${newStory.companyName}" successfully added to the spotlight registry!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Delete community story handler
  const handleDeleteCommunityStory = (storyId: string, companyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCommunity = deleteCommunityStory(storyId);
    setStories([...updatedCommunity, ...CLIENT_SPOTLIGHT_DATA]);
    setToastMessage(`Removed "${companyName}" from community stories.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Industry Categories for Filtering (Supporting Retail, Agriculture, Tech and core sectors)
  const industries = [
    { id: 'all', label: 'All Industries' },
    { id: 'Retail', label: 'Retail' },
    { id: 'Agriculture', label: 'Agriculture' },
    { id: 'Tech', label: 'Tech' },
    { id: 'Healthcare', label: 'Healthcare & Pharmacy' },
    { id: 'Hospitality', label: 'Hospitality & Restaurants' },
    { id: 'Logistics', label: 'Logistics & Supply Chain' },
    { id: 'Manufacturing', label: 'Manufacturing & Agro' },
    { id: 'Professional Services', label: 'Professional Services' },
  ];

  // Helper to test if a story belongs to an industry filter
  const checkStoryIndustry = (storyIndustry: string, filterId: string) => {
    if (filterId === 'all') return true;
    if (storyIndustry === filterId) return true;
    const lower = storyIndustry.toLowerCase();
    if (filterId === 'Retail') return lower.includes('retail') || lower.includes('supermarket');
    if (filterId === 'Agriculture') return lower.includes('agri') || lower.includes('agro') || lower.includes('farm');
    if (filterId === 'Tech') return lower.includes('tech') || lower.includes('software') || lower.includes('digital');
    if (filterId === 'Healthcare') return lower.includes('health') || lower.includes('pharm') || lower.includes('cure');
    if (filterId === 'Hospitality') return lower.includes('hosp') || lower.includes('restaur') || lower.includes('café');
    if (filterId === 'Logistics') return lower.includes('logist') || lower.includes('distrib') || lower.includes('freight');
    if (filterId === 'Manufacturing') return lower.includes('manuf') || lower.includes('production');
    if (filterId === 'Professional Services') return lower.includes('profess') || lower.includes('advisory') || lower.includes('consult');
    return false;
  };

  // Filtered stories
  const filteredStories = stories.filter((story) => {
    const matchesIndustry = checkStoryIndustry(story.industry, selectedIndustry);
    const matchesFormat = formatFilter === 'all' || story.type === formatFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      story.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.quote.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesIndustry && matchesFormat && matchesSearch;
  });

  // Open Video Modal
  const handleOpenVideo = (item: ClientTestimonial) => {
    setActiveVideoItem(item);
    setIsPlaying(true);
    setProgressSec(12);
    // Rough estimation of duration seconds for scrubber
    if (item.videoDuration) {
      const parts = item.videoDuration.replace(' min', '').split(':');
      if (parts.length === 2) {
        setTotalSec(parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10));
      } else {
        setTotalSec(120);
      }
    } else {
      setTotalSec(120);
    }
  };

  const handleCloseVideo = () => {
    setActiveVideoItem(null);
    setIsPlaying(false);
  };

  const handleCloseCaseStudy = () => {
    setActiveCaseStudyItem(null);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find active caption based on progress
  const getActiveCaption = () => {
    if (!activeVideoItem?.transcript || activeVideoItem.transcript.length === 0) return null;
    // Map current progress to a transcript block
    const pct = progressSec / (totalSec || 1);
    const index = Math.min(
      Math.floor(pct * activeVideoItem.transcript.length),
      activeVideoItem.transcript.length - 1
    );
    return activeVideoItem.transcript[index];
  };

  const activeCaption = getActiveCaption();

  return (
    <section 
      id="client-spotlight" 
      aria-label="Client Spotlight: SME Success Stories"
      className="py-20 bg-slate-50 dark:bg-[#07162b] text-slate-900 dark:text-slate-100 relative transition-colors duration-300"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-lime-500/5 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-700 dark:text-lime-400 font-semibold text-xs tracking-wider uppercase mb-3 border border-lime-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SME Transformation Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Client Spotlight
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Real African and emerging market SMEs who modernised their financial operations, eliminated inventory leakage, and accelerated growth with MsmeBooks.
            </p>
          </div>

          {/* Header Action Buttons: Submit Your Story + Find a Partner */}
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-lime-500/25 active:scale-95 group"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Submit Your Story</span>
            </button>

            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold transition-all shadow-sm group border border-slate-700/60"
              >
                <span>Find an Implementation Partner</span>
                <ArrowRight className="w-4 h-4 text-lime-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toolbar: Industry Segmented Buttons + Format Toggle + Search */}
        <div className="bg-white dark:bg-[#0d223f] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-10 space-y-4">
          
          {/* Top Row: Search Input and Format Switcher */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SME business, owner, city, or metric..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Format Segmented Controller (All / Video / Text) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFormatFilter('all')}
                aria-pressed={formatFilter === 'all'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formatFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>All Formats</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('video')}
                aria-pressed={formatFilter === 'video'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formatFilter === 'video'
                    ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Stories ({stories.filter(s => s.type === 'video').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('text')}
                aria-pressed={formatFilter === 'text'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formatFilter === 'text'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Case Studies ({stories.filter(s => s.type === 'text').length})</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Industry Filter Segmented Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>Filter by Industry Type:</span>
              <span id={announcementId} className="text-lime-600 dark:text-lime-400 font-semibold" aria-live="polite">
                Showing {filteredStories.length} of {stories.length} SME spotlights
              </span>
            </div>

            <div 
              role="toolbar" 
              aria-label="Industry filters"
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            >
              {industries.map((ind) => {
                const isSelected = selectedIndustry === ind.id;
                const count = ind.id === 'all' 
                  ? stories.length 
                  : stories.filter(s => checkStoryIndustry(s.industry, ind.id)).length;

                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setSelectedIndustry(ind.id)}
                    aria-pressed={isSelected}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-950 dark:font-bold border-transparent shadow-sm'
                        : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{ind.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State when no results match filter */}
        {filteredStories.length === 0 && (
          <div className="bg-white dark:bg-[#0d223f] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4 stroke-1" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No SME spotlights found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              We couldn&apos;t find any client testimonials matching your active filters.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry('all');
                  setFormatFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 text-slate-950 font-bold text-sm hover:bg-lime-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset all filters</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-lime-400" />
                <span>Submit Your Story</span>
              </button>
            </div>
          </div>
        )}

        {/* Spotlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              className={`bg-white dark:bg-[#0d223f] border ${
                highlightedStoryId === story.id
                  ? 'border-lime-500 ring-2 ring-lime-400 shadow-xl shadow-lime-500/20'
                  : 'border-slate-200/90 dark:border-slate-800/80 hover:border-lime-500/40 dark:hover:border-lime-500/30'
              } rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group`}
            >
              {/* Media Card Header (Cover Image + Video Play Trigger or Badge) */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={story.coverUrl}
                  alt={`${story.companyName} operations`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Floating Tags */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                      {story.industry}
                    </span>
                    {story.isCommunitySubmission && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-lime-400 text-slate-950 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>Community</span>
                      </span>
                    )}
                    {story.featuredOnSlider && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 shadow-md" title="Consent granted for main landing page slider showcase">
                        <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                        <span>Slider</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {story.type === 'video' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-lime-500 text-slate-950 shadow-md">
                        <Video className="w-3 h-3" />
                        <span>Video • {story.videoDuration || '2:00 min'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md">
                        <FileText className="w-3 h-3 text-lime-400" />
                        <span>Case Review</span>
                      </span>
                    )}

                    {story.isCommunitySubmission && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCommunityStory(story.id, story.companyName, e)}
                        title="Delete your submitted story"
                        aria-label={`Delete ${story.companyName} community story`}
                        className="p-1 rounded-md bg-black/70 hover:bg-red-600 text-white/80 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Big Interactive Video Play Button if format is video */}
                {story.type === 'video' && (
                  <button
                    type="button"
                    onClick={() => handleOpenVideo(story)}
                    aria-label={`Play video testimonial for ${story.companyName}`}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-lime-400 transition-all focus:outline-none focus:ring-4 focus:ring-lime-500/50"
                  >
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </button>
                )}

                {/* Bottom Overlay on Image: Location & Flag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    <span>{story.location}</span>
                  </div>
                  <span className="text-base">{story.countryFlag}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  
                  {/* Primary Key Impact Metric Banner */}
                  {story.metrics.length > 0 && (
                    <div className="bg-lime-50 dark:bg-lime-950/30 border border-lime-200 dark:border-lime-800/40 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-lime-800 dark:text-lime-300 font-semibold">
                          {story.metrics[0].label}
                        </div>
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {story.metrics[0].value}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-lime-500 text-slate-950">
                          <TrendingUp className="w-3 h-3" />
                          {story.metrics[0].change}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Headline */}
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug mb-2.5">
                    &ldquo;{story.headline}&rdquo;
                  </h3>

                  {/* Snippet Quote */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {story.quote}
                  </p>

                  {/* Implementation Partner Credit */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span className="truncate">Setup by <strong className="text-slate-700 dark:text-slate-200">{story.partnerInvolved.name}</strong></span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-700/50 flex-shrink-0">
                      {story.partnerInvolved.tier}
                    </span>
                  </div>
                </div>

                {/* Footer: SME Founder info & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  
                  {/* Founder Profile Info */}
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarBg(story.clientName)} flex items-center justify-center font-bold text-xs shadow-sm border-2 border-white dark:border-slate-700 shrink-0 select-none tracking-wider`}
                      aria-label={`${story.clientName} initials`}
                    >
                      {getInitials(story.clientName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {story.clientName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {story.role} • {story.companyName}
                      </div>
                    </div>
                  </div>

                  {/* Primary Trigger Button */}
                  <div className="pt-1">
                    {story.type === 'video' ? (
                      <button
                        type="button"
                        onClick={() => handleOpenVideo(story)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm group-hover:shadow"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Watch Video Spotlight ({story.videoDuration})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveCaseStudyItem(story)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-all"
                      >
                        <FileText className="w-4 h-4 text-lime-400" />
                        <span>Read Full Case Study</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE VIDEO SPOTLIGHT MODAL
          ========================================================================= */}
      {activeVideoItem && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
                  <Video className="w-4 h-4" />
                </span>
                <div>
                  <h3 id="video-modal-title" className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                    {activeVideoItem.companyName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    SME Video Spotlight • {activeVideoItem.industry} • {activeVideoItem.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseVideo}
                aria-label="Close video player"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              
              {/* Background Video Frame image */}
              <img
                src={activeVideoItem.coverUrl}
                alt={activeVideoItem.companyName}
                className="w-full h-full object-cover filter brightness-[0.75]"
              />

              {/* Audio Waveform Visualizer overlay when playing */}
              {isPlaying && (
                <div className="absolute top-4 right-4 flex items-end gap-1 h-6 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce h-3" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce h-5 delay-75" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce h-2 delay-150" />
                  <span className="w-1 bg-lime-400 rounded-full animate-bounce h-4 delay-100" />
                  <span className="text-[10px] text-lime-300 font-mono ml-1">AUDIO LIVE</span>
                </div>
              )}

              {/* Speaker Overlay in top-left */}
              <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                <div 
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarBg(activeVideoItem.clientName)} flex items-center justify-center font-bold text-[10px] border border-lime-400 shrink-0 select-none`}
                  aria-label={`${activeVideoItem.clientName} initials`}
                >
                  {getInitials(activeVideoItem.clientName)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{activeVideoItem.clientName}</div>
                  <div className="text-[10px] text-slate-300 leading-tight">{activeVideoItem.role}</div>
                </div>
              </div>

              {/* Centered Play/Pause Toggle Indicator */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="absolute w-16 h-16 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform focus:outline-none"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-slate-950" />
                ) : (
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                )}
              </button>

              {/* Live Closed Captions Overlay */}
              {showCaptions && activeCaption && (
                <div className="absolute bottom-16 left-6 right-6 text-center pointer-events-none">
                  <div className="inline-block px-4 py-2 rounded-lg bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10 shadow-lg max-w-xl">
                    <span className="text-lime-400 font-bold">{activeCaption.speaker}: </span>
                    <span>&ldquo;{activeCaption.text}&rdquo;</span>
                  </div>
                </div>
              )}

              {/* Video Player Bottom Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
                
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-300 w-10 text-right">
                    {formatSeconds(progressSec)}
                  </span>
                  <div 
                    className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer relative group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setProgressSec(Math.round(clickPos * totalSec));
                    }}
                  >
                    <div 
                      className="h-full bg-lime-400 relative transition-all"
                      style={{ width: `${(progressSec / totalSec) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 w-10">
                    {formatSeconds(totalSec)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-lime-400 p-1"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-lime-400 p-1"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                      {[1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-1 rounded ${playbackSpeed === spd ? 'font-bold text-lime-400' : 'text-slate-400'}`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCaptions(!showCaptions)}
                      aria-pressed={showCaptions}
                      className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                        showCaptions ? 'bg-lime-500 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      <Subtitles className="w-3.5 h-3.5" />
                      <span>CC {showCaptions ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Video Details & Implementation Case Notes */}
            <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 overflow-y-auto space-y-5">
              
              {/* Highlight Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeVideoItem.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">{m.label}</div>
                    <div className="text-lg font-black text-white">{m.value}</div>
                    <div className="text-xs text-lime-400 font-semibold mt-0.5">{m.change}</div>
                  </div>
                ))}
              </div>

              {/* Quote & Story */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-1">Implementation Story</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeVideoItem.fullStory}
                </p>
              </div>

              {/* Modules Deployed & Implementation Partner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-2 font-medium">MsmeBooks Modules Activated:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVideoItem.modulesUsed.map((mod, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Certified Implementation Partner:</div>
                    <div className="font-bold text-white text-sm">{activeVideoItem.partnerInvolved.name}</div>
                    <div className="text-[11px] text-lime-400">{activeVideoItem.partnerInvolved.tier} • {activeVideoItem.partnerInvolved.city}</div>
                  </div>

                  {onSelectPartnerByName && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseVideo();
                        onSelectPartnerByName(activeVideoItem.partnerInvolved.name);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-lime-500 text-slate-950 font-bold text-xs hover:bg-lime-400 transition-colors"
                    >
                      View Partner
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          IN-DEPTH TEXT CASE STUDY MODAL
          ========================================================================= */}
      {activeCaseStudyItem && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1f38] text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            
            {/* Modal Header with Cover Banner */}
            <div className="relative h-44 w-full bg-slate-900">
              <img
                src={activeCaseStudyItem.coverUrl}
                alt={activeCaseStudyItem.companyName}
                className="w-full h-full object-cover brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <button
                type="button"
                onClick={handleCloseCaseStudy}
                aria-label="Close case study"
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-lime-500 text-slate-950 mb-1 inline-block">
                  Verified Case Study • {activeCaseStudyItem.industry}
                </span>
                <h3 id="case-modal-title" className="text-xl sm:text-2xl font-black text-white">
                  {activeCaseStudyItem.companyName}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Founder Profile Strip */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarBg(activeCaseStudyItem.clientName)} flex items-center justify-center font-bold text-sm border-2 border-lime-500 shrink-0 select-none shadow-sm tracking-wider`}
                    aria-label={`${activeCaseStudyItem.clientName} initials`}
                  >
                    {getInitials(activeCaseStudyItem.clientName)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {activeCaseStudyItem.clientName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {activeCaseStudyItem.role} • {activeCaseStudyItem.location} {activeCaseStudyItem.countryFlag}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Implementation</span>
                  <span className="font-bold text-lime-600 dark:text-lime-400">{activeCaseStudyItem.implementationTime}</span>
                </div>
              </div>

              {/* Breakthrough Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCaseStudyItem.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-lime-50/60 dark:bg-lime-950/20 border border-lime-200/80 dark:border-lime-900/40">
                    <div className="text-[11px] font-semibold text-lime-800 dark:text-lime-300 uppercase tracking-wider">
                      {m.label}
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {m.value}
                    </div>
                    <div className="text-xs font-semibold text-lime-600 dark:text-lime-400 mt-1">
                      {m.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Before vs After Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>The Challenge (Before)</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeCaseStudyItem.beforeState}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-200 dark:border-emerald-900/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>The Solution (After)</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeCaseStudyItem.afterState}
                  </p>
                </div>
              </div>

              {/* In-depth Narrative */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Transformation Narrative
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCaseStudyItem.fullStory}
                </p>
              </div>

              {/* Modules Activated & Partner Involved */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Setup Facilitated By:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeCaseStudyItem.partnerInvolved.name}
                  </div>
                  <div className="text-xs text-lime-600 dark:text-lime-400">
                    {activeCaseStudyItem.partnerInvolved.tier} • {activeCaseStudyItem.partnerInvolved.city}
                  </div>
                </div>

                {onOpenDirectory && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCaseStudy();
                      onOpenDirectory();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-lime-500 text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    <span>Browse Directory Partners</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Toast Notification for Community Submission */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-lime-500/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 max-w-md"
        >
          <div className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold leading-snug flex-1">{toastMessage}</span>
          <button 
            type="button"
            onClick={() => setToastMessage(null)} 
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Submit Your Story Modal */}
      <SubmitStoryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={handleStorySubmitted}
      />

    </section>
  );
};
