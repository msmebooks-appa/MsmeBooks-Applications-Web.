import React, { useState } from 'react';
import { 
  HOW_IT_WORKS_STEPS 
} from '../data/partnerData';
import { 
  UserPlus, 
  GraduationCap, 
  Send, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

interface HowItWorksProps {
  onOpenApplyModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenApplyModal }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserPlus':
        return <UserPlus className="w-6 h-6" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'Send':
        return <Send className="w-6 h-6" />;
      default:
        return <TrendingUp className="w-6 h-6" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Glow lines */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F4C81]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#84CC16]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#84CC16] text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-[#84CC16]" />
            Fast-Track Onboarding
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            How the Partner Program Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From initial registration to collecting your first recurring commission in as little as 14 days. A structured pathway designed for African professional firms and tech consultants.
          </p>
        </div>

        {/* 4-Step Visual Timeline with Animated Connecting Line */}
        <div className="relative mb-16">
          
          {/* Connecting Line between steps (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-slate-800 -translate-y-6 z-0">
            <div 
              className="h-full bg-gradient-to-r from-[#0F4C81] via-[#0284C7] to-[#84CC16] transition-all duration-500 rounded"
              style={{ width: `${(activeStep / (HOW_IT_WORKS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900/90 border-[#84CC16] shadow-xl shadow-[#84CC16]/10 scale-[1.03]'
                      : isPassed
                      ? 'bg-slate-900/60 border-blue-500/40 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Step Number Badge & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#84CC16] to-emerald-400">
                        {step.step}
                      </span>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-[#84CC16] text-[#0A192F] shadow-md shadow-[#84CC16]/30'
                            : isPassed
                            ? 'bg-[#0F4C81] text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {getStepIcon(step.iconName)}
                      </div>
                    </div>

                    {/* Step Title & Summary */}
                    <h3 className="text-xl font-bold text-white mb-2 font-display">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#84CC16] mb-3">
                      {step.summary}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {step.details}
                    </p>
                  </div>

                  {/* Duration pill */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#84CC16]" />
                      Estimated:
                    </span>
                    <span className="font-semibold text-white">{step.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Step Deep Dive Callout */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F4C81]/40 to-slate-900 p-6 sm:p-8 border border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#84CC16]/20 border border-[#84CC16]/40 flex items-center justify-center text-[#84CC16] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Step {HOW_IT_WORKS_STEPS[activeStep].step}: {HOW_IT_WORKS_STEPS[activeStep].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {HOW_IT_WORKS_STEPS[activeStep].details}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenApplyModal}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#84CC16]/20 transition-all"
          >
            <span>Start Step 01 Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
