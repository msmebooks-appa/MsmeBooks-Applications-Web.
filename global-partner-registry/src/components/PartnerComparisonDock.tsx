import React, { useState, useRef } from 'react';
import {
  Scale,
  X,
  ArrowRight,
  RotateCcw,
  Award,
  Briefcase,
  CheckCircle2,
  Star,
  Zap,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { Partner } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface PartnerComparisonDockProps {
  selectedPartners: Partner[];
  onRemovePartner: (partnerId: string) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export function getPartnerCertifications(partner: Partner): string[] {
  if (partner.certifications && partner.certifications.length > 0) {
    return partner.certifications;
  }

  const certs: string[] = [];

  if (partner.level === 'Platinum') {
    certs.push('MsmeBooks Master Certified Consultant');
  } else if (partner.level === 'Gold') {
    certs.push('MsmeBooks Advanced Certified Specialist');
  } else {
    certs.push('MsmeBooks Certified Implementation Partner');
  }

  const lowerType = partner.partnerType.toLowerCase();
  const specs = partner.specialties.map((s) => s.toLowerCase());

  if (lowerType.includes('accounting') || specs.some((s) => s.includes('account') || s.includes('tax'))) {
    certs.push('Financial Accounting & IFRS Advisory Certified');
  }
  if (lowerType.includes('pos') || specs.some((s) => s.includes('pos') || s.includes('hardware'))) {
    certs.push('POS & Retail Hardware Systems Specialist');
  }
  if (lowerType.includes('erp') || lowerType.includes('consult') || specs.some((s) => s.includes('inventory') || s.includes('branch'))) {
    certs.push('Enterprise ERP & Cloud Migration Accredited');
  }

  if (partner.verification?.trainingCompleted) {
    certs.push('Verified Technical SLA & Deployment Verified');
  }

  return certs;
}

export const PartnerComparisonDock: React.FC<PartnerComparisonDockProps> = ({
  selectedPartners,
  onRemovePartner,
  onClearAll,
  onOpenModal,
}) => {
  const [hoveredPartner, setHoveredPartner] = useState<Partner | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState<number>(150);
  const [arrowOffset, setArrowOffset] = useState<number>(0);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const { formatBudget } = useCurrency();

  if (selectedPartners.length === 0) return null;

  const handlePartnerHover = (
    partner: Partner,
    e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>
  ) => {
    if (dockRef.current) {
      const dockRect = dockRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      const rawCenterX = itemRect.left - dockRect.left + itemRect.width / 2;

      // Clamp tooltip center within dock width so it does not spill outside
      const tooltipHalfWidth = 150;
      const minX = tooltipHalfWidth + 8;
      const maxX = Math.max(minX, dockRect.width - tooltipHalfWidth - 8);
      const clampedX = Math.max(minX, Math.min(maxX, rawCenterX));

      setTooltipLeft(clampedX);
      setArrowOffset(rawCenterX - clampedX);
    }
    setHoveredPartner(partner);
  };

  const handlePartnerLeave = () => {
    setHoveredPartner(null);
  };

  return (
    <div
      ref={dockRef}
      id="partner-comparison-dock"
      data-testid="partner-comparison-dock"
      className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94vw] sm:w-auto bg-slate-900/95 dark:bg-[#07162b]/95 backdrop-blur-xl border border-lime-500/40 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-2xl shadow-slate-950/60 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* On-Hover Snapshot Tooltip */}
      {hoveredPartner && (
        <div
          id="partner-dock-hover-tooltip"
          data-testid="partner-dock-hover-tooltip"
          className="absolute bottom-full mb-3 pointer-events-none z-50 transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{
            left: `${tooltipLeft}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-72 sm:w-80 bg-slate-900/98 dark:bg-[#07162b]/98 text-white rounded-2xl p-3.5 shadow-2xl border border-lime-500/40 backdrop-blur-xl">
            {/* Top Header: Logo, Name, Partner Level & Rating */}
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-700/60">
              <img
                src={hoveredPartner.logo}
                alt={hoveredPartner.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                    {hoveredPartner.name}
                  </h4>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-lime-500/15 text-lime-400 border border-lime-500/30 shrink-0">
                    {hoveredPartner.level}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {hoveredPartner.rating}
                  </span>
                  <span>•</span>
                  <span className="truncate flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {hoveredPartner.city}, {hoveredPartner.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Expertise Area */}
            <div className="py-2.5 border-b border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-lime-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Primary Expertise Area
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hoveredPartner.yearsExperience}+ yrs exp
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {hoveredPartner.partnerType}
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {hoveredPartner.specialties.slice(0, 3).map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Certifications */}
            {(() => {
              const partnerCerts = getPartnerCertifications(hoveredPartner);
              return (
                <div className="pt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-lime-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Core Certifications ({partnerCerts.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {partnerCerts.slice(0, 3).map((cert: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 text-[11px] text-slate-200 leading-tight"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium truncate">{cert}</span>
                      </div>
                    ))}
                    {partnerCerts.length > 3 && (
                      <div className="text-[10px] text-slate-400 pl-5">
                        +{partnerCerts.length - 3} more verified credentials
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Bottom quick snapshot row */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                Replies in {hoveredPartner.responseTime}
              </span>
              <span className="text-emerald-400 font-semibold">
                {formatBudget(hoveredPartner.startingBudget, hoveredPartner.minBudgetUSD)}
              </span>
            </div>

            {/* Downward triangle arrow */}
            <div
              className="absolute top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900 dark:border-t-[#07162b]"
              style={{
                left: `calc(50% + ${arrowOffset}px)`,
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Indicator & Count */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center border border-lime-500/30">
          <Scale className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            Compare Partners
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-lime-500 text-slate-950 font-extrabold">
              {selectedPartners.length}/3
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            {selectedPartners.length === 1 ? 'Select 1 more to compare' : 'Hover chips for snapshot'}
          </div>
        </div>
      </div>

      {/* Selected Partner Mini Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs py-0.5">
        {selectedPartners.map((partner) => {
          const isHovered = hoveredPartner?.id === partner.id;

          return (
            <div
              key={partner.id}
              tabIndex={0}
              onMouseEnter={(e) => handlePartnerHover(partner, e)}
              onMouseLeave={handlePartnerLeave}
              onFocus={(e) => handlePartnerHover(partner, e)}
              onBlur={handlePartnerLeave}
              className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl transition-all cursor-pointer select-none text-xs text-white shrink-0 group ${
                isHovered
                  ? 'bg-slate-700/90 border-lime-500/70 shadow-xs ring-1 ring-lime-400/50'
                  : 'bg-slate-800/90 border-slate-700/80 hover:border-slate-500'
              } border`}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-5 h-5 rounded-md object-cover"
              />
              <span className="font-semibold text-[11px] max-w-[80px] sm:max-w-[100px] truncate">
                {partner.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartnerLeave();
                  onRemovePartner(partner.id);
                }}
                className="p-0.5 text-slate-400 hover:text-red-400 rounded transition-colors"
                title={`Remove ${partner.name}`}
                aria-label={`Remove ${partner.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Primary Compare Trigger Button */}
      <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
        <button
          type="button"
          id="btn-open-comparison-modal"
          data-testid="btn-open-comparison"
          onClick={onOpenModal}
          className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-lime-500/20 transition-all flex items-center gap-1.5 transform active:scale-95"
        >
          <span>Compare ({selectedPartners.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onClearAll}
          title="Clear selected partners"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors hidden sm:block"
          aria-label="Clear all comparisons"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
