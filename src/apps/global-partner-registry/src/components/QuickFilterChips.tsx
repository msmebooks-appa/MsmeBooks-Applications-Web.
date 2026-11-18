import React from 'react';
import {
  Star,
  Zap,
  Banknote,
  Clock,
  Wifi,
  Sparkles,
  Check,
  X,
  SlidersHorizontal,
  Building2,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { Partner } from '../types';
import { isTopRatedPartner, isFastResponse } from './PartnerCard';

export interface QuickFilterTagConfig {
  id: string;
  label: string;
  shortDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  predicate: (partner: Partner) => boolean;
  accentClass: {
    active: string;
    badge: string;
  };
}

export const QUICK_FILTER_TAGS: QuickFilterTagConfig[] = [
  {
    id: 'verified-only',
    label: 'Verified Partners Only',
    shortDescription: 'Hide unverified listings & show accredited partners',
    icon: ShieldCheck,
    predicate: (p) => p.verified === true,
    accentClass: {
      active: 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm',
      badge: 'bg-slate-950/20 text-slate-950',
    },
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    shortDescription: 'Rating ≥ 4.90 & 30+ client reviews',
    icon: Star,
    predicate: (p) => isTopRatedPartner(p),
    accentClass: {
      active: 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm',
      badge: 'bg-slate-950/20 text-slate-950',
    },
  },
  {
    id: 'available-now',
    label: 'Available Now',
    shortDescription: 'Currently accepting new client projects',
    icon: Zap,
    predicate: (p) => p.availabilityStatus === 'Accepting New Clients',
    accentClass: {
      active: 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm',
      badge: 'bg-slate-950/20 text-slate-950',
    },
  },
  {
    id: 'budget-friendly',
    label: 'Budget Friendly',
    shortDescription: 'Starting projects under $500',
    icon: Banknote,
    predicate: (p) =>
      p.budgetTier === 'Budget (< $500)' ||
      (p.minBudgetUSD !== undefined && p.minBudgetUSD <= 500) ||
      Boolean(p.startingBudget && parseInt(p.startingBudget.replace(/[^0-9]/g, ''), 10) <= 500),
    accentClass: {
      active: 'bg-lime-500 text-slate-950 border-lime-400 font-extrabold shadow-sm',
      badge: 'bg-slate-950/20 text-slate-950',
    },
  },
  {
    id: 'fast-response',
    label: 'Fast Response',
    shortDescription: 'Replies in under 2 hours',
    icon: Clock,
    predicate: (p) => isFastResponse(p.responseTime),
    accentClass: {
      active: 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-sm',
      badge: 'bg-slate-950/20 text-slate-950',
    },
  },
  {
    id: 'remote-support',
    label: 'Remote Support',
    shortDescription: 'Virtual setup and online consulting',
    icon: Wifi,
    predicate: (p) => p.remoteSupport === true,
    accentClass: {
      active: 'bg-indigo-500 text-white border-indigo-400 font-extrabold shadow-sm',
      badge: 'bg-white/20 text-white',
    },
  },
  {
    id: 'platinum-tier',
    label: 'Platinum Tier',
    shortDescription: 'Top-tier Platinum accredited partners',
    icon: Sparkles,
    predicate: (p) => p.level === 'Platinum',
    accentClass: {
      active: 'bg-purple-600 text-white border-purple-400 font-extrabold shadow-sm',
      badge: 'bg-white/20 text-white',
    },
  },
  {
    id: 'enterprise-stories',
    label: 'Enterprise Stories',
    shortDescription: 'Proven multi-branch and enterprise rollouts',
    icon: Building2,
    predicate: (p) => Boolean(p.clientSuccessStories?.some(s => s.implementationScale === 'Large-Scale Enterprise')),
    accentClass: {
      active: 'bg-violet-600 text-white border-violet-400 font-extrabold shadow-sm',
      badge: 'bg-white/20 text-white',
    },
  },
  {
    id: 'sme-stories',
    label: 'Small Business Stories',
    shortDescription: 'Verified SME and local retail deployments',
    icon: Store,
    predicate: (p) => Boolean(p.clientSuccessStories?.some(s => s.implementationScale === 'Small Business')),
    accentClass: {
      active: 'bg-teal-600 text-white border-teal-400 font-extrabold shadow-sm',
      badge: 'bg-white/20 text-white',
    },
  },
];

export interface QuickFilterChipsProps {
  activeTags: string[];
  onToggleTag: (tagId: string) => void;
  onClearTags?: () => void;
  allPartners: Partner[];
  totalFilteredCount?: number;
}

export const QuickFilterChips: React.FC<QuickFilterChipsProps> = ({
  activeTags = [],
  onToggleTag,
  onClearTags,
  allPartners,
  totalFilteredCount,
}) => {
  return (
    <div
      id="quick-filter-chips-container"
      data-testid="quick-filter-chips"
      className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/20 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Filters
          </span>
          {activeTags.length > 0 && (
            <span
              id="quick-filters-active-count"
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-lime-500 text-slate-950 shadow-xs"
            >
              {activeTags.length} active
            </span>
          )}
          {typeof totalFilteredCount === 'number' && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              ({totalFilteredCount} {totalFilteredCount === 1 ? 'partner' : 'partners'} shown)
            </span>
          )}
        </div>

        {activeTags.length > 0 && onClearTags && (
          <button
            type="button"
            id="btn-clear-quick-filters"
            data-testid="btn-clear-quick-filters"
            onClick={onClearTags}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 font-semibold transition-colors self-end sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset quick filters</span>
          </button>
        )}
      </div>

      {/* Chips Horizontal Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
        {QUICK_FILTER_TAGS.map((tag) => {
          const isActive = activeTags.includes(tag.id);
          const Icon = tag.icon;
          const count = allPartners.filter(tag.predicate).length;

          return (
            <button
              key={tag.id}
              type="button"
              id={`chip-${tag.id}`}
              data-testid={`quick-filter-${tag.id}`}
              onClick={() => onToggleTag(tag.id)}
              aria-pressed={isActive}
              title={`${tag.label}: ${tag.shortDescription}`}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                isActive
                  ? `${tag.accentClass.active} ring-2 ring-lime-500/30 dark:ring-lime-400/20 scale-[1.02]`
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="relative flex items-center justify-center">
                {isActive ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                )}
                {tag.id === 'available-now' && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                )}
              </span>

              <span>{tag.label}</span>

              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                  isActive
                    ? tag.accentClass.badge
                    : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
