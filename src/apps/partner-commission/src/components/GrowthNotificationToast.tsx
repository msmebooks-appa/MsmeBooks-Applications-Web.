import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Sparkles, 
  Award, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  Zap,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export interface GrowthMilestone {
  id: string;
  type: 'conversions' | 'revenue' | 'tier' | 'retention';
  title: string;
  description: string;
  metricBadge: string;
  rewardText: string;
  timestamp: string;
  icon: 'trophy' | 'trending' | 'sparkles' | 'award';
  colorTheme: 'lime' | 'blue' | 'purple' | 'amber';
}

export const INITIAL_MILESTONES: GrowthMilestone[] = [
  {
    id: 'ms-10-conversions',
    type: 'conversions',
    title: '🎉 Milestone Reached: First 10 Conversions!',
    description: 'Congratulations! You have successfully onboarded your first 10 active SME clients. Your recurring monthly commission baseline is now active and locked.',
    metricBadge: '10 Active Clients',
    rewardText: 'Unlocked: Dedicated Partner Growth Manager & Co-Branded Asset Kit',
    timestamp: 'Just now',
    icon: 'trophy',
    colorTheme: 'lime'
  },
  {
    id: 'ms-10pct-revenue',
    type: 'revenue',
    title: '🚀 Revenue Surge: +10% MoM Increase!',
    description: 'Outstanding momentum! Your referred monthly subscription volume jumped by +12.4% this cycle (exceeding the 10% benchmark).',
    metricBadge: '+12.4% MoM Revenue',
    rewardText: 'Unlocked: Quarterly Co-Marketing Bonus Allocation',
    timestamp: '2 hours ago',
    icon: 'trending',
    colorTheme: 'blue'
  },
  {
    id: 'ms-platinum-pace',
    type: 'tier',
    title: '⚡ Fast-Track: Platinum Tier Imminent (40%)',
    description: 'You are now 85% of the way to Platinum status (40% recurring commission). Only 2 more client sign-ups needed this quarter!',
    metricBadge: '85% to Platinum (40%)',
    rewardText: 'Unlocked: Executive Council Preview & Custom Enterprise SLA',
    timestamp: 'Yesterday',
    icon: 'sparkles',
    colorTheme: 'purple'
  },
  {
    id: 'ms-retention-100',
    type: 'retention',
    title: '⭐ 100% Client Retention Milestone',
    description: 'Zero customer churn across all active client accounts for 90 consecutive days. Recognized as Top-Tier Client Success Partner.',
    metricBadge: '100% Retention Rate',
    rewardText: 'Unlocked: Regional Priority Lead Routing',
    timestamp: '3 days ago',
    icon: 'award',
    colorTheme: 'amber'
  }
];

interface GrowthNotificationToastProps {
  activeMilestone: GrowthMilestone | null;
  onDismiss: () => void;
  onViewMilestoneTab?: () => void;
}

export const GrowthNotificationToast: React.FC<GrowthNotificationToastProps> = ({
  activeMilestone,
  onDismiss,
  onViewMilestoneTab
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!activeMilestone) return;

    setProgress(100);
    const duration = 7000; // 7 seconds
    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeMilestone, onDismiss]);

  if (!activeMilestone) return null;

  const renderIcon = () => {
    switch (activeMilestone.icon) {
      case 'trophy':
        return <Trophy className="w-5 h-5 text-[#B9E51C]" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-sky-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-purple-300" />;
      case 'award':
        return <Award className="w-5 h-5 text-amber-300" />;
    }
  };

  const getBorderColor = () => {
    switch (activeMilestone.colorTheme) {
      case 'lime':
        return 'border-[#B9E51C]/60 shadow-[#B9E51C]/15';
      case 'blue':
        return 'border-sky-400/60 shadow-sky-500/15';
      case 'purple':
        return 'border-purple-400/60 shadow-purple-500/15';
      case 'amber':
        return 'border-amber-400/60 shadow-amber-500/15';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-top-3 duration-300">
      <div 
        className={`bg-[#142D4E] text-white rounded-2xl p-4 shadow-2xl border-2 ${getBorderColor()} relative overflow-hidden backdrop-blur-md`}
      >
        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-[#1261B5] to-[#B9E51C] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
              {renderIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#B9E51C] text-[#142D4E]">
                  Growth Milestone
                </span>
                <span className="text-[10px] text-slate-400">{activeMilestone.timestamp}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
                {activeMilestone.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Dismiss milestone notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3 pl-11">
          {activeMilestone.description}
        </p>

        {/* Footer Badges & Action */}
        <div className="pl-11 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[#B9E51C] font-mono text-[11px] font-bold">
            <Flame className="w-3.5 h-3.5 text-[#B9E51C]" />
            <span>{activeMilestone.metricBadge}</span>
          </div>

          {onViewMilestoneTab && (
            <button
              onClick={() => {
                onDismiss();
                onViewMilestoneTab();
              }}
              className="text-[11px] font-semibold text-slate-200 hover:text-[#B9E51C] flex items-center gap-1 transition-colors"
            >
              <span>View Growth Progress</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface GrowthMilestonesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: GrowthMilestone[];
  onTriggerToast: (milestone: GrowthMilestone) => void;
  onViewGrowthTab: () => void;
}

export const GrowthMilestonesDrawer: React.FC<GrowthMilestonesDrawerProps> = ({
  isOpen,
  onClose,
  milestones,
  onTriggerToast,
  onViewGrowthTab
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-14 right-4 z-40 w-80 sm:w-96 bg-white dark:bg-[#142D4E] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 bg-slate-50 dark:bg-[#0c1c33] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1261B5] text-white flex items-center justify-center">
            <Trophy className="w-4 h-4 text-[#B9E51C]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Growth Milestone Feed
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive achievement & conversion alerts
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List of Milestones */}
      <div className="p-3 max-h-96 overflow-y-auto space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          Recent Achievements (Click to Preview Toast)
        </div>

        {milestones.map((ms) => (
          <div
            key={ms.id}
            onClick={() => onTriggerToast(ms)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 hover:border-[#1261B5] dark:hover:border-[#B9E51C] bg-slate-50/70 dark:bg-[#1a375e]/40 hover:bg-slate-100 dark:hover:bg-[#1a375e] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1261B5] dark:group-hover:text-[#B9E51C] transition-colors">
                {ms.title}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">{ms.timestamp}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              {ms.description}
            </p>
            <div className="flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded bg-[#1261B5]/10 dark:bg-white/10 text-[#1261B5] dark:text-[#B9E51C] font-bold">
                {ms.metricBadge}
              </span>
              <span className="text-[10px] font-semibold text-[#1261B5] dark:text-[#B9E51C] group-hover:underline flex items-center gap-0.5">
                Simulate Toast &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-slate-50 dark:bg-[#0c1c33] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            onClose();
            onViewGrowthTab();
          }}
          className="text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] hover:underline flex items-center gap-1"
        >
          <span>View Tier Upgrades Tab</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] text-slate-400 font-mono">
          4 Milestones Active
        </span>
      </div>
    </div>
  );
};
