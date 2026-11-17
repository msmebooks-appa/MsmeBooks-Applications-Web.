import React, { useState } from 'react';
import { UserPlus, UserCheck, Share2, DollarSign, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onOpenApplyModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenApplyModal }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      number: '01',
      title: 'Register',
      shortDesc: 'Complete the online MsmeBooks Partner Application.',
      icon: UserPlus,
      details:
        'Fill out our secure partner form with your practice or business background, professional domain, and estimated customer reach. No registration fees or starter payments required.'
    },
    {
      number: '02',
      title: 'Get Approved',
      shortDesc: 'Receive partner tier assignment & portal credentials.',
      icon: UserCheck,
      details:
        'Our partner enablement team reviews your submission within 24 to 48 hours. Upon approval, you receive access to your personalized MsmeBooks Partner Portal and unique tracking IDs.'
    },
    {
      number: '03',
      title: 'Promote MsmeBooks',
      shortDesc: 'Share links, introduce clients & conduct demos.',
      icon: Share2,
      details:
        'Use your designated referral link, alphanumeric partner coupon code, pre-built sales pitch decks, or demo scripts to introduce retail, services, and corporate clients to MsmeBooks.'
    },
    {
      number: '04',
      title: 'Earn Commissions',
      shortDesc: 'Receive 15% to 40% recurring on active subscriptions.',
      icon: DollarSign,
      details:
        'Whenever an attributed customer pays their monthly or annual MsmeBooks subscription, your commission is automatically calculated and logged into your transparent earnings ledger.'
    },
    {
      number: '05',
      title: 'Track and Withdraw',
      shortDesc: 'Monitor approved ledger & withdraw via bank/fintech.',
      icon: Wallet,
      details:
        'Reconcile earnings on a 30-day clearance cycle. Request automated payouts directly into your local commercial bank account or supported digital payment rails once minimum threshold is met.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0E1A30] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>5-Step Partnership Journey</span>
            <span aria-hidden="true">·</span>
            <span>Fast & Transparent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            How the Partner Commission Program Works
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            From initial registration to recurring monthly bank payouts, we provide a structured, friction-free experience for accounting practices, IT providers, and business advisers.
          </p>
        </div>

        {/* Five Step Cards Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isSelected = activeStep === idx + 1;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx + 1)}
                className={`relative rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#F7FAFC] to-white dark:from-[#182c4d] dark:to-[#14233c] border-[#1261B5] dark:border-[#B9E51C] shadow-md ring-2 ring-[#1261B5]/20 dark:ring-[#B9E51C]/20'
                    : 'bg-white dark:bg-[#14233c] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Step Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-[#1261B5] dark:text-[#B9E51C] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                      STEP {step.number}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#1261B5] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#0c182c] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#142D4E] dark:text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.shortDesc}</p>
                </div>

                {/* Progress bar state */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Phase {idx + 1} of 5</span>
                  {isSelected ? (
                    <span className="text-[#1261B5] dark:text-[#B9E51C] font-semibold flex items-center gap-1">
                      Active Step <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span>Click to view</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Active Step Detail Box */}
        <div className="mt-8 bg-slate-50 dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
              <span>Step {steps[activeStep - 1].number} in Detail:</span>
              <span className="text-[#142D4E] dark:text-white">{steps[activeStep - 1].title}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {steps[activeStep - 1].details}
            </p>
          </div>

          <button
            onClick={onOpenApplyModal}
            className="px-6 py-3 text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Start Step 1 Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
