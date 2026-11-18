import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Calculator, 
  LayoutDashboard, 
  Trophy, 
  Headphones, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface TourStep {
  id: string;
  targetId?: string;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
  position?: 'top' | 'bottom' | 'center' | 'bottom-left' | 'bottom-right';
  highlightPadding?: number;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    targetId: 'hero',
    titleKey: 'tour.welcomeTitle',
    descKey: 'tour.welcomeDesc',
    icon: Sparkles,
    position: 'center'
  },
  {
    id: 'calculator',
    targetId: 'calculator',
    titleKey: 'tour.calculatorTitle',
    descKey: 'tour.calculatorDesc',
    icon: Calculator,
    position: 'top'
  },
  {
    id: 'dashboard',
    targetId: 'dashboard',
    titleKey: 'tour.dashboardTitle',
    descKey: 'tour.dashboardDesc',
    icon: LayoutDashboard,
    position: 'bottom'
  },
  {
    id: 'leaderboard',
    targetId: 'leaderboard',
    titleKey: 'tour.leaderboardTitle',
    descKey: 'tour.leaderboardDesc',
    icon: Trophy,
    position: 'top'
  },
  {
    id: 'support',
    targetId: 'live-chat-trigger',
    titleKey: 'tour.supportTitle',
    descKey: 'tour.supportDesc',
    icon: Headphones,
    position: 'bottom-left'
  },
  {
    id: 'apply',
    targetId: undefined,
    titleKey: 'tour.applyTitle',
    descKey: 'tour.applyDesc',
    icon: CheckCircle2,
    position: 'center'
  }
];

interface PartnerOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApplyModal: () => void;
}

export const PartnerOnboardingTour: React.FC<PartnerOnboardingTourProps> = ({
  isOpen,
  onClose,
  onOpenApplyModal
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const step = TOUR_STEPS[currentStepIndex];

  // Scroll to and highlight target on step change
  useEffect(() => {
    if (!isOpen) return;

    const updateTargetRect = () => {
      if (step.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    updateTargetRect();
    const timer = setTimeout(updateTargetRect, 300);

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [isOpen, currentStepIndex, step.targetId]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const totalSteps = TOUR_STEPS.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const StepIcon = step.icon;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('msme-partner-tour-completed', 'true');
    onClose();
  };

  const handleComplete = () => {
    localStorage.setItem('msme-partner-tour-completed', 'true');
    onClose();
    onOpenApplyModal();
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Partner Onboarding Tour"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 transition-all duration-300"
    >
      {/* Dark overlay backdrop with subtle cutout glow */}
      <div 
        onClick={handleSkip}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Target element spotlight frame if target exists */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl border-2 border-[#B9E51C] shadow-[0_0_0_9999px_rgba(10,18,34,0.75)] transition-all duration-300 z-40 animate-pulse"
          style={{
            top: `${Math.max(10, targetRect.top - 8)}px`,
            left: `${Math.max(10, targetRect.left - 8)}px`,
            width: `${Math.min(window.innerWidth - 20, targetRect.width + 16)}px`,
            height: `${targetRect.height + 16}px`
          }}
        />
      )}

      {/* Tour Floating Card */}
      <div 
        className="relative z-50 w-full max-w-lg bg-white dark:bg-[#142D4E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
          <div 
            className="bg-[#1261B5] dark:bg-[#B9E51C] h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Card Header */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1261B5]/10 dark:bg-[#1261B5]/25 text-[#1261B5] dark:text-[#B9E51C] flex items-center justify-center shadow-xs">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-[#1261B5] dark:text-[#B9E51C]">
                  {t('tour.stepOf', { current: currentStepIndex + 1, total: totalSteps })}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">
                  ({progressPercentage}%)
                </span>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#142D4E] dark:text-white tracking-tight leading-snug">
              {t(step.titleKey)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(step.descKey)}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-7 bg-[#1261B5] dark:bg-[#B9E51C]'
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0f2139] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-lg transition-colors"
          >
            {t('tour.skip')}
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('tour.back')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-bold shadow-md shadow-[#1261B5]/25 transition-all flex items-center gap-1.5 group"
            >
              <span>{isLastStep ? t('tour.finish') : t('tour.next')}</span>
              {isLastStep ? (
                <CheckCircle2 className="w-4 h-4 text-[#B9E51C]" />
              ) : (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
