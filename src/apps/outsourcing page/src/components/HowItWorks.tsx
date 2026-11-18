import React from 'react';
import { 
  CheckCircle2, 
  Layers, 
  FileText, 
  CreditCard, 
  Users, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HowItWorksProps {
  onStartStep1: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartStep1 }) => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Services',
      description: 'Explore professional outsourcing categories or select an all-in-one Growth or Professional bundle.',
      icon: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-300 dark:border-blue-500/50',
    },
    {
      step: '02',
      title: 'Tell Us About Your Business',
      description: 'Complete a brief 2-minute business assessment: operating country, entity structure, staffing headcount, and transaction volume.',
      icon: <FileText className="w-5 h-5 text-lime-600 dark:text-lime-400" />,
      color: 'border-lime-300 dark:border-lime-500/50',
    },
    {
      step: '03',
      title: 'Get Your Tailored Plan',
      description: 'Review transparent pricing configured in your local currency with zero hidden setup fees.',
      icon: <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      color: 'border-sky-300 dark:border-sky-500/50',
    },
    {
      step: '04',
      title: 'Subscribe & Pay Locally',
      description: 'Checkout securely via Paystack, M-Pesa, Ozow, Flutterwave, or Stripe with instant tax invoice issuance.',
      icon: <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-300 dark:border-emerald-500/50',
    },
    {
      step: '05',
      title: 'Meet Your Dedicated Pod',
      description: 'Execute the SLA & NDA. Meet your assigned Lead Chartered Accountant, Payroll Specialist, and HR Coordinator.',
      icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'border-indigo-300 dark:border-indigo-500/50',
    },
    {
      step: '06',
      title: 'Track, Review & Grow',
      description: 'Upload bank statements & receipts to your encrypted vault. Receive monthly management accounts and relax on compliance.',
      icon: <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-300 dark:border-amber-500/50',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wide uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400"></span>
            Operational Delivery Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            How MsmeBooks Outsourcing Works in 6 Simple Steps
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            From initial business assessment to routine month-end ledger closing, our structured onboarding ensures effortless continuity.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-800/80 rounded-2xl p-6 border ${st.color} hover:shadow-lg dark:hover:bg-slate-800 transition-all duration-200 relative group flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {st.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-700 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition font-grotesk">
                    {st.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-grotesk text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center text-[11px] font-bold text-lime-700 dark:text-lime-400">
                <span>Phase {st.step} of Service Lifecycle</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartStep1}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer"
          >
            <span>Start Your 6-Step Journey Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
