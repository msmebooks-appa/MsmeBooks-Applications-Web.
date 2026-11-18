import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap, 
  Trophy, 
  Users, 
  ShieldCheck, 
  Flame, 
  Globe2, 
  ChevronRight, 
  Share2,
  ExternalLink
} from 'lucide-react';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'sales' | 'community' | 'expertise';
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  perk: string;
  progressCurrent?: number;
  progressTarget?: number;
}

const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'First Referral',
    description: 'Onboard your first active SME commercial business to MsmeBooks cloud accounting or POS.',
    category: 'sales',
    icon: '🎯',
    isUnlocked: true,
    unlockedDate: 'April 14, 2024',
    xpReward: 250,
    perk: 'Activated 15% recurring commission payouts'
  },
  {
    id: 'ach-2',
    title: 'Completed Certification',
    description: 'Passed the MsmeBooks Certified Cloud Advisor & Statutory E-Tax Assessment with distinction.',
    category: 'onboarding',
    icon: '🎓',
    isUnlocked: true,
    unlockedDate: 'May 02, 2024',
    xpReward: 500,
    perk: 'Official high-res digital badge & public directory listing'
  },
  {
    id: 'ach-3',
    title: 'Reached Gold Tier',
    description: 'Scaled practice portfolio past 50 active commercial client accounts.',
    category: 'sales',
    icon: '🥇',
    isUnlocked: true,
    unlockedDate: 'October 19, 2026',
    xpReward: 1000,
    perk: 'Boosted recurring rev-share to 30% + priority inbound lead routing'
  },
  {
    id: 'ach-4',
    title: 'Lightning Responder',
    description: 'Accepted and contacted newly routed prospective leads in under 60 minutes.',
    category: 'expertise',
    icon: '⚡',
    isUnlocked: true,
    unlockedDate: 'November 04, 2026',
    xpReward: 350,
    perk: 'Preferred placement in national client matching algorithm'
  },
  {
    id: 'ach-5',
    title: 'Pan-African Expansion',
    description: 'Manage active SME client stores across 2 or more African sovereign jurisdictions.',
    category: 'expertise',
    icon: '🌍',
    isUnlocked: true,
    unlockedDate: 'November 06, 2026',
    xpReward: 750,
    perk: 'Multi-currency settlement enabled (USD, NGN, KES, GHS)'
  },
  {
    id: 'ach-6',
    title: 'Peer Network Mentor',
    description: 'Referred 2 or more chartered accounting firms to the MsmeBooks Partner Programme.',
    category: 'community',
    icon: '🤝',
    isUnlocked: false,
    xpReward: 500,
    perk: '+$150 bounty per peer + 5% lifetime recurring override',
    progressCurrent: 1,
    progressTarget: 2
  },
  {
    id: 'ach-7',
    title: 'Platinum Apex Partner',
    description: 'Surpass 151+ active commercial business client subscriptions.',
    category: 'sales',
    icon: '🏆',
    isUnlocked: false,
    xpReward: 2500,
    perk: '40% lifetime rev-share + regional territory exclusivity',
    progressCurrent: 48,
    progressTarget: 151
  }
];

export const PartnerAchievementsSystem: React.FC = () => {
  const [achievements] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENTS);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const totalXp = achievements
    .filter((a) => a.isUnlocked)
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  const handleShareBadge = (badge: AchievementBadge) => {
    setSharedToast(`Shared "${badge.title}" badge to LinkedIn & X!`);
    setTimeout(() => setSharedToast(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800 p-5 sm:p-6 shadow-sm transition-colors">
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-blue-900/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#8CE600] border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gamification & Recognition</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Badges Earned & Partner Achievements</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0A3981] dark:text-[#8CE600]">
              Level 4 Advisor
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            Complete high-impact partner activities to unlock higher rev-share brackets, territory perks, and XP rewards.
          </p>
        </div>

        {/* Total XP Score Pill */}
        <div className="bg-gradient-to-r from-blue-900/10 to-emerald-500/10 dark:from-[#061F4A] dark:to-[#082a63] p-3 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-lg shadow-sm">
            ⚡
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-200 block">
              Cumulative XP
            </span>
            <span className="text-lg font-black font-mono text-[#0A3981] dark:text-[#8CE600]">
              {totalXp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="py-4">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Badges Unlocked: {unlockedCount} of {totalCount}</span>
          </span>
          <span className="text-[#0A3981] dark:text-[#8CE600] font-mono">{percentage}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#061F4A] h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-blue-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0A3981] via-[#0284C7] to-[#8CE600] transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 mt-2">
        {achievements.map((badge) => {
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-slate-50/70 dark:bg-[#072457] border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-xs'
                  : 'bg-slate-100/40 dark:bg-[#061F4A]/40 border-slate-200 dark:border-blue-900/40 opacity-75 hover:opacity-90'
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 flex items-center justify-center text-xl shadow-xs">
                  {badge.icon}
                </div>

                <div className="flex items-center gap-1">
                  {badge.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#8CE600] px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar for Locked Badges */}
              {!badge.isUnlocked && badge.progressCurrent !== undefined && badge.progressTarget !== undefined && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-blue-900/60">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                    <span>Target: {badge.progressTarget}</span>
                    <span>{badge.progressCurrent} / {badge.progressTarget}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0A3981] dark:bg-[#8CE600] h-full rounded-full"
                      style={{ width: `${(badge.progressCurrent / badge.progressTarget) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Perk Callout */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-blue-900/50 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700 dark:text-[#8CE600] truncate max-w-[170px]">
                  {badge.perk}
                </span>
                <span className="font-mono font-bold text-slate-400 dark:text-slate-400 text-[10px]">
                  +{badge.xpReward} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Toast */}
      {sharedToast && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-[#8CE600] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{sharedToast}</span>
        </div>
      )}

      {/* Modal Detail for Selected Badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-blue-800 relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-[#061F4A] border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center text-3xl mx-auto shadow-md mb-3">
                {selectedBadge.icon}
              </div>

              <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] mb-2 uppercase">
                {selectedBadge.isUnlocked ? `Unlocked on ${selectedBadge.unlockedDate}` : 'In Progress'}
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedBadge.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 mt-2 leading-relaxed">
                {selectedBadge.description}
              </p>

              <div className="bg-slate-50 dark:bg-[#061F4A] rounded-2xl p-4 border border-slate-200 dark:border-blue-900 text-left my-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">XP Reward:</span>
                  <span className="font-black font-mono text-[#0A3981] dark:text-[#8CE600]">
                    +{selectedBadge.xpReward} XP
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Associated Perk:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedBadge.perk}
                  </span>
                </div>
              </div>

              {selectedBadge.isUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    handleShareBadge(selectedBadge);
                    setSelectedBadge(null);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0A3981] dark:bg-blue-600 hover:bg-[#072c66] rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#8CE600]" />
                  <span>Share Achievement to Social Profiles</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
