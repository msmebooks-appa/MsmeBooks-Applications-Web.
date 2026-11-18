import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  Award,
  Calendar,
  Building2,
  FileCheck2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Partner } from '../types';
import { getSkillVerification, SkillVerificationDetails } from '../utils/skillVerification';

interface VerifiedSkillTagProps {
  partner: Partner;
  skill: string;
  isSelected?: boolean;
  onSelect?: (skill: string) => void;
  id?: string;
  testId?: string;
  variant?: 'specialty' | 'service';
  priceBadge?: React.ReactNode;
}

export const VerifiedSkillTag: React.FC<VerifiedSkillTagProps> = ({
  partner,
  skill,
  isSelected = false,
  onSelect,
  id,
  testId,
  variant = 'specialty',
  priceBadge,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const verification: SkillVerificationDetails = React.useMemo(() => {
    return getSkillVerification(partner, skill);
  }, [partner, skill]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const sanitizedId = (id || `skill-tag-${partner.id}-${skill}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
  const tooltipId = `tooltip-${sanitizedId}`;

  const isSpecialty = variant === 'specialty';

  return (
    <div
      ref={containerRef}
      className="relative inline-flex group/skill-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {/* Clickable Tag Button */}
      <button
        type="button"
        id={sanitizedId}
        data-testid={testId || sanitizedId}
        data-skill={skill}
        data-verified={verification.isVerified ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(skill);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-pressed={isSelected}
        aria-label={`${skill} - Verified expertise by ${verification.authority}. Last verified ${verification.lastVerifiedDate}. Click to filter directory.`}
        className={
          isSpecialty
            ? `group text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-2xs select-none relative ${
                isSelected
                  ? 'bg-lime-500 text-slate-950 border-lime-600 font-bold shadow-xs scale-102 ring-2 ring-lime-400/50'
                  : 'bg-slate-100 hover:bg-lime-50/90 dark:bg-slate-800 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 hover:text-lime-700 dark:hover:text-lime-300 border-slate-200 dark:border-slate-700 hover:border-lime-400/70 hover:scale-102 active:scale-98'
              }`
            : `text-[10.5px] px-2 py-1 rounded-lg border font-medium flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer select-none relative ${
                isSelected
                  ? 'bg-lime-500 text-slate-950 border-lime-600 font-bold ring-2 ring-lime-400/50'
                  : 'bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-950/70 dark:hover:bg-blue-900/80 text-slate-700 dark:text-slate-200 border-blue-200/80 dark:border-blue-800/70 hover:border-lime-400 active:scale-98'
              }`
        }
      >
        {/* Selected Checkmark OR Verified Badge Visual Indicator */}
        {isSelected ? (
          <Check className="w-3 h-3 stroke-[3] text-slate-950 shrink-0" aria-hidden="true" />
        ) : (
          /* Badge Verification visual indicator */
          <span
            data-testid={`badge-verification-indicator-${sanitizedId}`}
            className="inline-flex items-center justify-center shrink-0"
            title={`Badge Verified: Click or hover to view certification by ${verification.authority}`}
          >
            {verification.isVerified ? (
              <span className="relative flex items-center justify-center">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-115 transition-transform"
                  aria-hidden="true"
                />
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              </span>
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            )}
          </span>
        )}

        <span className="truncate max-w-[135px] font-medium">{skill}</span>

        {/* Optional Price Badge for Services */}
        {priceBadge}
      </button>

      {/* Hover / Focus Floating Tooltip with Verification Details */}
      {isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3 rounded-xl bg-slate-900/95 dark:bg-slate-950/98 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto text-left"
        >
          {/* Header with Verification Status & Tier */}
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-700/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{skill}</span>
                  <span className="text-[10px] font-normal text-slate-400">Expertise</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{verification.isVerified ? 'Verified Credential' : 'Accreditation Pending'}</span>
                </div>
              </div>
            </div>

            <span className="text-[9.5px] px-1.5 py-0.5 rounded-md font-bold bg-lime-500/15 text-lime-400 border border-lime-500/30 shrink-0 whitespace-nowrap">
              {verification.verificationTier}
            </span>
          </div>

          {/* Verification Details: Authority & Last Verified Date */}
          <div className="space-y-2 text-xs">
            {/* Certification Authority */}
            <div className="flex items-start gap-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
              <Building2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Certification Authority
                </div>
                <div
                  data-testid="badge-verification-authority"
                  className="text-[11px] font-bold text-slate-100 leading-tight mt-0.5"
                >
                  {verification.authority}
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                  Code: {verification.authorityCode}
                </div>
              </div>
            </div>

            {/* Date of Last Verification */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>Last Verified</span>
                </div>
                <div
                  data-testid="badge-verification-date"
                  className="text-[11px] font-extrabold text-white mt-0.5"
                >
                  {verification.lastVerifiedDate}
                </div>
              </div>

              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <FileCheck2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Valid Through</span>
                </div>
                <div className="text-[11px] font-extrabold text-emerald-300 mt-0.5">
                  {verification.validThrough}
                </div>
              </div>
            </div>

            {/* Credential Reference & Standard */}
            <div className="text-[10px] text-slate-400 px-1 pt-1 space-y-0.5">
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span className="text-slate-500">Credential Ref:</span>
                <span className="text-slate-300 font-semibold">{verification.credentialId}</span>
              </div>
              <div className="text-[9.5px] text-slate-300 leading-snug line-clamp-1" title={verification.standardReference}>
                <span className="text-slate-500">Standard: </span>
                {verification.standardReference}
              </div>
            </div>
          </div>

          {/* Tooltip Footer / Action Prompt */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-lime-400 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Click tag to filter directory</span>
            </span>
            <span className="text-[9px] text-slate-500">Esc to close</span>
          </div>

          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-slate-900/95 dark:border-t-slate-950/98"></div>
        </div>
      )}
    </div>
  );
};
