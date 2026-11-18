import React, { useState } from 'react';
import { Star, Zap, Award, Medal, ShieldCheck, Trophy } from 'lucide-react';

export type AwardBadgeType = 'top-rated' | 'fastest-responder' | 'most-certified' | 'veteran';

export interface AwardBadgeProps {
  type: AwardBadgeType;
  /** Explicit label, or defaults to standard award title (e.g. 'Top Rated 2024') */
  label?: string;
  /** Detailed reason or qualification metric for tooltip */
  reason: string;
  /** Specific sub-metric badge text, e.g. '4.95 ★' or '< 30m' or '3 Auths' */
  metricSnippet?: string;
  id?: string;
  testId?: string;
  className?: string;
}

export const AwardBadge: React.FC<AwardBadgeProps> = ({
  type,
  label,
  reason,
  metricSnippet,
  id,
  testId,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Configuration per award type
  const config = (() => {
    switch (type) {
      case 'top-rated':
        return {
          defaultLabel: 'Top Rated 2024',
          icon: <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0 group-hover/award:rotate-12 group-hover/award:scale-115 transition-transform duration-300" />,
          bgClasses: 'bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 dark:border-amber-400/50 hover:border-amber-500 hover:shadow-amber-500/20',
          dotColor: 'bg-amber-400',
          tooltipBorder: 'border-amber-500/50',
          tooltipTitle: '🏆 Top Rated Partner 2024',
          defaultTestId: 'top-rated-badge',
        };
      case 'fastest-responder':
        return {
          defaultLabel: 'Fastest Responder',
          icon: <Zap className="w-3 h-3 fill-sky-400/70 text-sky-500 shrink-0 group-hover/award:scale-125 transition-transform duration-300" />,
          bgClasses: 'bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-cyan-500/15 text-sky-900 dark:text-sky-200 border-sky-500/40 dark:border-sky-400/50 hover:border-sky-500 hover:shadow-sky-500/20',
          dotColor: 'bg-sky-400',
          tooltipBorder: 'border-sky-500/50',
          tooltipTitle: '⚡ Fastest Responder Award',
          defaultTestId: 'fastest-responder-badge',
        };
      case 'most-certified':
        return {
          defaultLabel: 'Most Certified',
          icon: <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/award:scale-125 transition-transform duration-300" />,
          bgClasses: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 text-emerald-900 dark:text-emerald-200 border-emerald-500/40 dark:border-emerald-400/50 hover:border-emerald-500 hover:shadow-emerald-500/20',
          dotColor: 'bg-emerald-400',
          tooltipBorder: 'border-emerald-500/50',
          tooltipTitle: '🎖️ Most Certified Partner',
          defaultTestId: 'most-certified-badge',
        };
      case 'veteran':
        return {
          defaultLabel: '10+ Yrs Veteran',
          icon: <Medal className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0 group-hover/award:scale-125 transition-transform duration-300" />,
          bgClasses: 'bg-gradient-to-r from-purple-500/15 via-violet-500/15 to-purple-500/15 text-purple-900 dark:text-purple-200 border-purple-500/40 dark:border-purple-400/50 hover:border-purple-500 hover:shadow-purple-500/20',
          dotColor: 'bg-purple-400',
          tooltipBorder: 'border-purple-500/50',
          tooltipTitle: '⭐ Veteran Implementation Partner',
          defaultTestId: 'veteran-badge',
        };
    }
  })();

  const displayLabel = label || config.defaultLabel;
  const activeTestId = testId || config.defaultTestId;

  return (
    <div
      className="relative inline-flex items-center group/award"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="status"
      aria-label={`${displayLabel}: ${reason}`}
    >
      <span
        id={id}
        data-testid={activeTestId}
        className={`award-badge-animated hover-award-pulse inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-2xs select-none cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 focus:outline-hidden focus:ring-2 focus:ring-lime-400 ${config.bgClasses} ${className}`}
      >
        {config.icon}
        <span className="whitespace-nowrap font-bold tracking-tight">{displayLabel}</span>
        {metricSnippet && (
          <span className="text-[9.5px] px-1 py-0.2 rounded-full font-black bg-black/10 dark:bg-white/10 ml-0.5 opacity-90 border border-current/20">
            {metricSnippet}
          </span>
        )}
      </span>

      {/* Interactive Tooltip with gentle fade & scale */}
      {showTooltip && (
        <div
          role="tooltip"
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 rounded-xl bg-slate-950/95 dark:bg-[#07192f]/98 text-slate-100 text-xs border ${config.tooltipBorder} shadow-2xl backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="font-extrabold text-[11px] text-white flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
            <span>{config.tooltipTitle}</span>
            <span className="w-1.5 h-1.5 rounded-full animate-ping bg-lime-400" />
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{reason}</p>
          <div className="text-[9.5px] text-lime-400 mt-1 font-semibold flex items-center gap-1">
            <span>✓ Verified by MsmeBooks Trust Network</span>
          </div>

          {/* Pointer down triangle */}
          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950/95 dark:bg-[#07192f]/98 border-b border-r ${config.tooltipBorder} transform rotate-45`} />
        </div>
      )}
    </div>
  );
};
