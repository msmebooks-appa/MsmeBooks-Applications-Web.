import React from 'react';
import { 
  Compass, 
  UserCheck, 
  CalendarCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onExploreClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onExploreClick }) => {
  const steps = [
    {
      number: '01',
      title: 'Explore Services',
      description: 'Browse our comprehensive catalogue of accounting, tax, payroll, implementation, and consulting services tailored to African SMEs.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'Choose Your Expert',
      description: 'Select an accredited accounting firm, certified tech specialist, or let MsmeBooks automatically match you with the best-fit partner.',
      icon: UserCheck,
    },
    {
      number: '03',
      title: 'Book Your Consultation',
      description: 'Schedule an appointment online for a virtual or on-site engagement, or initiate an instant conversation via WhatsApp.',
      icon: CalendarCheck,
    },
    {
      number: '04',
      title: 'Get Professional Support',
      description: 'Work with your assigned specialist, review deliverables, maintain compliance, and accelerate your business growth.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B7E532]"></span>
            Clear, Frictionless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            How MsmeBooks Professional Services Work
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            From discovering the right service to receiving hands-on professional support, our seamless process connects your business with trusted expertise.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-[#1464C8]/30 via-[#B7E532] to-[#1464C8]/30 -translate-y-8 -z-0"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-[#0A1727] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-[#1464C8]/60 dark:hover:border-[#1464C8]/80 z-10"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#102B4E] dark:bg-[#0D1D31] text-[#B7E532] flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 group-hover:bg-[#1464C8] transition-all">
                      {step.number}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] flex items-center justify-center group-hover:bg-[#B7E532]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#1464C8] dark:text-[#B7E532]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#102B4E] dark:text-white group-hover:text-[#1464C8] dark:group-hover:text-[#B7E532] transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-[#1464C8] dark:text-[#B7E532]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-[#1464C8] dark:hover:bg-[#1052a5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Exploring Services Now</span>
            <ArrowRight className="w-4 h-4 text-[#B7E532]" />
          </button>
        </div>

      </div>
    </section>
  );
};
