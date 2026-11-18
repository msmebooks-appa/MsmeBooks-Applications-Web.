import React, { useState, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Check,
  MoveHorizontal,
} from 'lucide-react';
import { BusinessCaseStudy } from '../types';

interface CaseStudiesCarouselProps {
  caseStudies: BusinessCaseStudy[];
  onStartTrial?: (planId?: string) => void;
}

export const CaseStudiesCarousel: React.FC<CaseStudiesCarouselProps> = ({
  caseStudies,
  onStartTrial,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dragOffsetPx, setDragOffsetPx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const trackViewportRef = useRef<HTMLDivElement | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; active: boolean; lockedAxis: 'x' | 'y' | null }>({
    x: 0,
    y: 0,
    active: false,
    lockedAxis: null,
  });

  const totalSlides = caseStudies.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;
      const clamped = ((index % totalSlides) + totalSlides) % totalSlides;
      setActiveIndex(clamped);
    },
    [totalSlides]
  );

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  // Pointer & Touch Swipe Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Do not intercept clicks on interactive buttons/links inside the slide
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea')) {
      return;
    }

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      active: true,
      lockedAxis: e.pointerType === 'mouse' ? 'x' : null,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStartRef.current;
    if (!state.active) return;

    const dx = e.clientX - state.x;
    const dy = e.clientY - state.y;

    // Determine gesture axis for touch input so vertical scrolling stays smooth
    if (state.lockedAxis === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        if (Math.abs(dx) > Math.abs(dy)) {
          state.lockedAxis = 'x';
        } else {
          state.lockedAxis = 'y';
          state.active = false;
          setIsDragging(false);
          setDragOffsetPx(0);
          return;
        }
      } else {
        return;
      }
    }

    if (state.lockedAxis === 'x') {
      // Apply gentle edge resistance at first/last slide
      const isAtStartEdge = activeIndex === 0 && dx > 0;
      const isAtEndEdge = activeIndex === totalSlides - 1 && dx < 0;
      const dampedDx = isAtStartEdge || isAtEndEdge ? dx * 0.3 : dx;
      setDragOffsetPx(dampedDx);
    }
  };

  const finishDrag = () => {
    if (!pointerStartRef.current.active) {
      setIsDragging(false);
      setDragOffsetPx(0);
      return;
    }

    const threshold = 56;
    if (dragOffsetPx <= -threshold && activeIndex < totalSlides - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (dragOffsetPx >= threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else if (dragOffsetPx <= -threshold && activeIndex === totalSlides - 1) {
      // Allow wrap-around on deliberate swipe at end if desired; keep bounded for tactile clarity
      setActiveIndex(0);
    } else if (dragOffsetPx >= threshold && activeIndex === 0) {
      setActiveIndex(totalSlides - 1);
    }

    pointerStartRef.current = { x: 0, y: 0, active: false, lockedAxis: null };
    setIsDragging(false);
    setDragOffsetPx(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  if (totalSlides === 0) return null;

  const activeStudy = caseStudies[activeIndex];

  return (
    <div
      className="mb-14"
      role="region"
      aria-roledescription="carousel"
      aria-label="Local African Business Scaling Case Studies"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Carousel Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-semibold text-[#0A4FD5] dark:text-blue-400 tracking-wide mb-1.5">
            Scaled with MsmeBooks · Case Studies
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight text-balance">
            How Local Businesses Scale Multi-Branch Operations
          </h3>
        </div>

        {/* Navigation Controls & Counter */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MoveHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Swipe or drag</span>
          </div>

          <div
            className="text-xs font-mono tabular-nums font-semibold text-slate-600 dark:text-slate-300"
            aria-live="polite"
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous case study"
              className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B192C] text-slate-700 dark:text-slate-200 hover:border-[#0A4FD5] dark:hover:border-blue-500 hover:text-[#0A4FD5] dark:hover:text-blue-400 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next case study"
              className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B192C] text-slate-700 dark:text-slate-200 hover:border-[#0A4FD5] dark:hover:border-blue-500 hover:text-[#0A4FD5] dark:hover:text-blue-400 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Business Selector Tabs (Quick Jump) */}
      <div
        className="flex items-center gap-1.5 p-1 mb-5 bg-slate-100/90 dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Select business case study"
      >
        {caseStudies.map((study, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={study.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => goToSlide(idx)}
              className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5] ${
                isSelected
                  ? 'bg-white dark:bg-[#132642] text-[#0B192C] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="font-mono tabular-nums opacity-70 mr-1.5">{study.indexLabel}.</span>
              <span>{study.businessName}</span>
            </button>
          );
        })}
      </div>

      {/* Swipeable Carousel Viewport */}
      <div
        ref={trackViewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={finishDrag}
        className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] select-none touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className={`flex ${
            isDragging
              ? ''
              : 'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'
          }`}
          style={{
            transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffsetPx}px), 0, 0)`,
          }}
        >
          {caseStudies.map((study) => {
            const hasImageError = !!failedImages[study.id];
            return (
              <article
                key={study.id}
                aria-hidden={study.id !== activeStudy.id}
                className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                {/* Left: Full-bleed Architectural / Storefront Visual */}
                <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full bg-slate-900 overflow-hidden">
                  {!hasImageError ? (
                    <img
                      src={study.image}
                      alt={study.imageAlt}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [study.id]: true }))
                      }
                      className="w-full h-full object-cover block lg:absolute lg:inset-0"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-[#0B192C] via-[#132B4C] to-[#0A4FD5] flex flex-col items-center justify-center p-6 text-center text-white">
                      <Building2 className="w-10 h-10 text-[#84CC16] mb-3" />
                      <div className="text-base font-bold">{study.businessName}</div>
                      <div className="text-xs text-blue-200 mt-1">
                        {study.city}, {study.country}
                      </div>
                    </div>
                  )}

                  {/* Measured Contrast Scrim for Overlaid Scale Summary */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-200 mb-2">
                      <span className="font-semibold text-white">{study.businessName}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {study.city}, {study.country}
                      </span>
                    </div>

                    {/* Before -> After Scale Trajectory */}
                    <div className="pt-3 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[11px] font-medium text-slate-300 mb-0.5">
                          Before MsmeBooks
                        </div>
                        <div className="text-slate-100 leading-snug">
                          {study.scaleJourney.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-[#84CC16] mb-0.5">
                          Scaled State
                        </div>
                        <div className="font-semibold text-white leading-snug">
                          {study.scaleJourney.after}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Detailed Case Study Narrative & Quantitative Proof */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div>
                    {/* Quiet Single-Line Metadata Kicker (Zero Pills) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                      <span className="font-mono tabular-nums font-semibold text-[#0A4FD5] dark:text-blue-400">
                        Case {study.indexLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{study.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.planLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.timeframe}</span>
                    </div>

                    {/* Case Study Outcome Headline */}
                    <h4 className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight leading-snug text-balance">
                      {study.headline}
                    </h4>

                    {/* 3 Quantified KPI Strip */}
                    <div className="mt-5 py-4 border-y border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="text-lg sm:text-2xl font-extrabold text-[#0A4FD5] dark:text-blue-400 tabular-nums tracking-tight">
                            {metric.value}
                          </div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                            {metric.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {metric.context}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Challenge / Solution / Outcome Breakdown (Clean Whitespace, No Nested Card Boxes) */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-[13px] leading-relaxed">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white mb-1">
                          01. Challenge
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white mb-1">
                          02. Implementation
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {study.solution}
                        </p>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white mb-1">
                          03. Scale Outcome
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {study.outcome}
                        </p>
                      </div>
                    </div>

                    {/* Deployed Modules (Clean Unboxed List) */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Modules deployed:
                      </span>
                      {study.modulesDeployed.map((mod) => (
                        <span key={mod} className="inline-flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
                          <span>{mod}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Attributable Quote & Action Footer */}
                  <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <blockquote className="max-w-xl">
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                        "{study.quote}"
                      </p>
                      <footer className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                        {study.founderName}
                        <span className="font-normal text-slate-500 dark:text-slate-400">
                          {' '}
                          · {study.founderRole}, {study.businessName}
                        </span>
                      </footer>
                    </blockquote>

                    {onStartTrial && (
                      <button
                        type="button"
                        onClick={() => onStartTrial(study.planId)}
                        className="shrink-0 whitespace-nowrap px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0A4FD5] hover:bg-[#07389B] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B192C]"
                      >
                        <span>Try {study.planLabel.split(' ')[0]} Plan</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom Slide Progress Bar Dots */}
      <div className="mt-4 flex items-center justify-center gap-2" aria-label="Case study pagination">
        {caseStudies.map((study, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={study.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`View case study ${idx + 1}: ${study.businessName}`}
              aria-current={isCurrent ? 'true' : undefined}
              className="py-2 px-1 group focus-visible:outline-none"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'w-8 bg-[#0A4FD5] dark:bg-blue-400'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
