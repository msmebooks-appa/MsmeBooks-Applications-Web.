import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number; // 1 to 5
  className?: string;
}

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Business' },
  { id: 3, label: 'Verification' },
  { id: 4, label: 'Setup' },
  { id: 5, label: 'Complete' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full py-2 ${className}`}>
      {/* Mobile step display */}
      <div className="flex sm:hidden items-center justify-between px-2 mb-2 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-[10px] font-bold">
            {currentStep}
          </span>
          <span className="text-[#072644] font-bold">Step {currentStep} of 5:</span>
          <span className="text-[#0F4C81]">{STEPS[currentStep - 1]?.label}</span>
        </span>
        <span className="text-slate-400 font-medium">{Math.round((currentStep / 5) * 100)}%</span>
      </div>

      {/* Track bar */}
      <div className="relative flex items-center justify-between">
        {/* Connecting track line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
          <div
            className="h-full bg-gradient-to-r from-[#84CC16] to-[#0F4C81] transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-[#84CC16] text-white ring-4 ring-[#84CC16]/20 shadow-xs'
                      : isCurrent
                      ? 'bg-[#0F4C81] text-white ring-4 ring-[#0F4C81]/20 shadow-sm shadow-[#0F4C81]/30 scale-105'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>

              <span
                className={`
                  hidden sm:block text-[11px] font-semibold mt-1.5 transition-colors duration-200 tracking-tight
                  ${
                    isCompleted
                      ? 'text-[#65A30D]'
                      : isCurrent
                      ? 'text-[#0F4C81] font-bold'
                      : 'text-slate-400'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
