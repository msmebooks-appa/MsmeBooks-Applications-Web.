import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  ExternalLink, 
  Sparkles, 
  BadgeCheck, 
  Filter, 
  TrendingUp, 
  Check, 
  Copy, 
  Hash, 
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export type SocialPlatform = 'all' | 'linkedin' | 'twitter' | 'instagram';

export interface SocialPost {
  id: string;
  platform: 'linkedin' | 'twitter' | 'instagram';
  author: string;
  handle: string;
  initials: string;
  avatarBg: string;
  role: string;
  tier: 'Gold Partner' | 'Platinum Partner' | 'Silver Partner';
  tierColor: string;
  location: string;
  countryFlag: string;
  timestamp: string;
  content: string;
  hashtags: string[];
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
  clientHighlight?: {
    company: string;
    industry: string;
    savings: string;
  };
  verified: boolean;
}

const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'linkedin',
    author: 'Adeyemi & Co. Financial Advisory',
    handle: 'adeyemi-financial',
    initials: 'AF',
    avatarBg: 'bg-gradient-to-br from-[#0A3981] to-[#061F4A] text-white border-blue-200 dark:border-blue-600',
    role: 'Principal Audit Partner',
    tier: 'Gold Partner',
    tierColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    location: 'Lagos, Nigeria',
    countryFlag: '🇳🇬',
    timestamp: '18m ago',
    content: 'Just deployed MsmeBooks Cloud POS across 14 supermarket branches in Ikeja! Offline sync handled a 2-hour fiber outage seamlessly without a single lost transaction. Proud to be an accredited Gold Partner 🥇',
    hashtags: ['#MsmeBooksPartner', '#CloudAccounting', '#RetailPOS', '#FintechAfrica'],
    metrics: { likes: 142, shares: 38, comments: 24 },
    clientHighlight: {
      company: 'GreenField Supermarkets (14 stores)',
      industry: 'FMCG Retail',
      savings: '99.9% Uptime during grid outages'
    },
    verified: true
  },
  {
    id: 'post-2',
    platform: 'twitter',
    author: 'Nairobi Advisory Systems',
    handle: '@NairobiAdvisory',
    initials: 'NA',
    avatarBg: 'bg-gradient-to-br from-[#4F46E5] to-[#312E81] text-white border-indigo-200 dark:border-indigo-600',
    role: 'Managing Director & Systems Lead',
    tier: 'Platinum Partner',
    tierColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    location: 'Nairobi, Kenya',
    countryFlag: '🇰🇪',
    timestamp: '1h ago',
    content: 'Another client migrated from legacy on-premise accounting to @MsmeBooks cloud! Client saved $4,200/yr in hardware server maintenance. 30% recurring rev-share hit our bank account right on time today! 🚀💼',
    hashtags: ['#MsmeBooksPartner', '#KenyaBusiness', '#SaaSGrowth', '#AuditReady'],
    metrics: { likes: 215, shares: 64, comments: 19 },
    clientHighlight: {
      company: 'Rift Valley Fresh Marts',
      industry: 'Cold-Chain Grocery',
      savings: '$4,200/yr saved on hardware servers'
    },
    verified: true
  },
  {
    id: 'post-3',
    platform: 'linkedin',
    author: 'Amara Okafor, FCA',
    handle: 'amara-okafor-fca',
    initials: 'AO',
    avatarBg: 'bg-gradient-to-br from-[#059669] to-[#064E3B] text-white border-emerald-200 dark:border-emerald-600',
    role: 'Senior Chartered Accountant',
    tier: 'Gold Partner',
    tierColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    location: 'Abuja, Nigeria',
    countryFlag: '🇳🇬',
    timestamp: '3h ago',
    content: 'Delighted to complete the MsmeBooks Partner Academy certification! Seamless Caseware and FIRS tax integration makes year-end statutory compliance 5x faster for our SME audit clients. Highly recommend!',
    hashtags: ['#MsmeBooksPartner', '#CharteredAccountant', '#TaxCompliance', '#ICAN'],
    metrics: { likes: 310, shares: 82, comments: 45 },
    verified: true
  },
  {
    id: 'post-4',
    platform: 'instagram',
    author: 'Kigali Smart Retail Tech',
    handle: '@kigali_smart_pos',
    initials: 'KS',
    avatarBg: 'bg-gradient-to-br from-[#0284C7] to-[#075985] text-white border-sky-200 dark:border-sky-600',
    role: 'POS Hardware & Cloud Integrator',
    tier: 'Silver Partner',
    tierColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
    location: 'Kigali, Rwanda',
    countryFlag: '🇷🇼',
    timestamp: '5h ago',
    content: 'EBM v2 electronic billing machine synchronization live in Rwanda! Bilingual French & English invoice receipts configured in 5 minutes. Ready for our retail chain demo tomorrow! ✨',
    hashtags: ['#MsmeBooksPartner', '#RwandaTech', '#SmartRetail', '#KigaliEntrepreneurs'],
    metrics: { likes: 184, shares: 29, comments: 16 },
    clientHighlight: {
      company: 'Nyabugogo Pharmacy Hub',
      industry: 'Healthcare Retail',
      savings: 'Full Rwanda Revenue EBM v2 sync'
    },
    verified: true
  },
  {
    id: 'post-5',
    platform: 'linkedin',
    author: 'Gold Coast Systems Integration',
    handle: 'gold-coast-systems',
    initials: 'GC',
    avatarBg: 'bg-gradient-to-br from-[#D97706] to-[#78350F] text-white border-amber-200 dark:border-amber-600',
    role: 'Enterprise Solutions Partner',
    tier: 'Platinum Partner',
    tierColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    location: 'Accra, Ghana',
    countryFlag: '🇬🇭',
    timestamp: '8h ago',
    content: 'Earned our first $1,800 monthly recurring commission milestone today via MsmeBooks Partner Portal wire transfer! Payout settled directly to Ecobank Ghana. The 5% recurring referral override adds up quickly! 💰📈',
    hashtags: ['#MsmeBooksPartner', '#GhanaFintech', '#RecurringRevenue', '#AccraBusiness'],
    metrics: { likes: 275, shares: 54, comments: 33 },
    verified: true
  },
  {
    id: 'post-6',
    platform: 'twitter',
    author: 'Casablanca Audit Partners',
    handle: '@CasablancaAudit',
    initials: 'CA',
    avatarBg: 'bg-gradient-to-br from-[#BE123C] to-[#881337] text-white border-rose-200 dark:border-rose-600',
    role: 'Financial Systems Partner',
    tier: 'Gold Partner',
    tierColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    location: 'Casablanca, Morocco',
    countryFlag: '🇲🇦',
    timestamp: '12h ago',
    content: 'Bilingual Arabic & French accounting interfaces in @MsmeBooks are a game changer for North Africa. Onboarding 20 pharmacy clients this quarter with automated VAT ledgers. 🇲🇦📊',
    hashtags: ['#MsmeBooksPartner', '#MoroccoTech', '#ComptabilitéSaaS', '#NorthAfrica'],
    metrics: { likes: 198, shares: 41, comments: 27 },
    verified: true
  }
];

export const PartnerSocialWallSection: React.FC = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedHashtag, setCopiedHashtag] = useState(false);

  const filteredPosts = useMemo(() => {
    if (platformFilter === 'all') return posts;
    return posts.filter((p) => p.platform === platformFilter);
  }, [posts, platformFilter]);

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((currentPosts) =>
        currentPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              metrics: {
                ...p.metrics,
                likes: isLiked ? p.metrics.likes + 1 : p.metrics.likes - 1
              }
            };
          }
          return p;
        })
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleCopyHashtag = () => {
    navigator.clipboard.writeText('#MsmeBooksPartner');
    setCopiedHashtag(true);
    setTimeout(() => setCopiedHashtag(false), 2000);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />;
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />;
      default:
        return <Hash className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />;
    }
  };

  return (
    <section id="community" className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200/60 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
              <span>Partner Community Social Wall</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight leading-tight">
              Real Impact. Shared in Real Time.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 max-w-2xl mt-3">
              Hear directly from certified accountants, IT resellers, and advisory firms deploying MsmeBooks across Africa and globally.
            </p>
          </div>

          {/* Social Proof Stats & Hashtag Tag Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#072457] border border-slate-200 dark:border-blue-800 hover:border-[#0A3981] dark:hover:border-[#8CE600] text-xs font-bold text-slate-800 dark:text-white shadow-xs transition-all cursor-pointer"
              title="Copy official hashtag"
            >
              <Hash className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              <span>#MsmeBooksPartner</span>
              {copiedHashtag ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 text-xs font-bold text-white shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#8CE600]" />
              <span>Join Discussion</span>
            </a>
          </div>
        </div>

        {/* Platform Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {(['all', 'linkedin', 'twitter', 'instagram'] as SocialPlatform[]).map((plat) => {
            const isActive = platformFilter === plat;
            const labels: Record<SocialPlatform, string> = {
              all: 'All Community Feeds (6)',
              linkedin: 'LinkedIn Network',
              twitter: 'X / Twitter Feed',
              instagram: 'Instagram Showcases'
            };
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setPlatformFilter(plat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#072457] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-800/80 hover:bg-slate-50 dark:hover:bg-blue-900/40'
                }`}
              >
                {getPlatformIcon(plat)}
                <span>{labels[plat]}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Grid of Social Wall Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-[#072457] rounded-2xl p-5 border border-slate-200 dark:border-blue-800/80 shadow-xs hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(10,57,129,0.35)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Author & Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${post.avatarBg} font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs border-2 select-none tracking-tight ring-1 ring-black/5 dark:ring-white/10`}
                          aria-label={`Initials for ${post.author}`}
                        >
                          {post.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                              {post.author}
                            </span>
                            {post.verified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600] shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span>{post.countryFlag}</span>
                            <span>{post.location}</span>
                            <span>·</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-blue-950/80">
                        {getPlatformIcon(post.platform)}
                      </div>
                    </div>

                    {/* Tier badge */}
                    <div className="mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${post.tierColor}`}>
                        {post.tier}
                      </span>
                    </div>

                    {/* Content text */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold text-[#0A3981] dark:text-sky-300 hover:underline cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Client highlight card if present */}
                    {post.clientHighlight && (
                      <div className="mb-4 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/80 text-xs">
                        <div className="text-[10px] font-bold uppercase text-[#0A3981] dark:text-[#8CE600] flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Implementation Milestone</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-white">
                          {post.clientHighlight.company}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          {post.clientHighlight.savings}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer interaction metrics */}
                  <div className="pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked
                          ? 'text-red-500 font-bold'
                          : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{post.metrics.likes}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{post.metrics.shares}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.metrics.comments}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://msmebooks.org/partners#${post.id}`);
                        setCopiedHashtag(true);
                        setTimeout(() => setCopiedHashtag(false), 2000);
                      }}
                      className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors cursor-pointer"
                      title="Share post"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
