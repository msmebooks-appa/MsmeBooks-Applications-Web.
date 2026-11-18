import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw,
  Settings,
  CreditCard,
  XCircle,
  FileText
} from 'lucide-react';

export const CancellationWalkthrough: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [simulatedCancelled, setSimulatedCancelled] = useState(false);

  const steps = [
    {
      step: 1,
      title: 'Sign In to Dashboard',
      description: 'Log in to your verified business account at app.msmebooks.org using your authorized business email.',
      icon: Settings
    },
    {
      step: 2,
      title: 'Settings → Billing',
      description: 'From your sidebar, open Settings and click on the "Billing & Subscription" tab.',
      icon: CreditCard
    },
    {
      step: 3,
      title: 'Manage Subscription',
      description: 'Review your active tier, monthly/annual renewal date, payment method, and active branch add-ons.',
      icon: FileText
    },
    {
      step: 4,
      title: 'Select Cancel Renewal',
      description: 'Click "Cancel Subscription Renewal" and choose your primary reason for our product improvement team.',
      icon: XCircle
    },
    {
      step: 5,
      title: 'Confirm & Keep Reference',
      description: 'Receive an instant cancellation reference code (e.g., CNL-2026-9041). Access continues until your cycle expires.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="cancellation-procedure" className="scroll-mt-24 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>06. Self-Service Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
          Cancellation Procedures & Automatic Renewal Rules
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          You are always in control. Follow our transparent 5-step self-service guide to pause or cancel your subscription.
        </p>
      </div>

      {/* Step by Step Horizontal Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((s) => {
          const isSelected = activeStep === s.step;
          const Icon = s.icon;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-900 dark:bg-blue-800 border-blue-950 dark:border-blue-700 text-white shadow-sm ring-2 ring-lime-400/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-lime-400 text-blue-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    0{s.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-lime-300' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-blue-950 dark:text-white'}`}>
                  {s.title}
                </h4>
              </div>
              <p className={`text-[11px] mt-2 leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {s.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Step Preview Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Step {activeStep} Walkthrough Demonstration
            </span>
            <h3 className="text-lg font-bold text-blue-950 dark:text-white mt-0.5">
              {steps[activeStep - 1].title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 5))}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < 5 ? prev + 1 : 1))}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Detailed Explanation for the active step */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {activeStep === 1 && (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Authentication & Master Admin Privilege Requirement:
                </p>
                <p>
                  To safeguard company accounting books from accidental or unauthorized service disruption, subscription cancellations can only be executed by the <strong>Primary Account Owner</strong> or users assigned the <strong>Corporate Administrator</strong> role with verified multi-factor authentication (MFA).
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Staff accountants, cashiers, and branch inventory managers do not possess administrative billing permissions.
                </p>
              </>
            )}

            {activeStep === 2 && (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Accessing the Unified Billing Dashboard:
                </p>
                <p>
                  Inside the MsmeBooks web app or Android tablet console, tap the gear icon in the lower-left navigation tray. Select <strong>Billing & Subscription</strong>.
                </p>
                <p>
                  Here you can view your current plan (e.g. Standard, Growth, Multi-branch), payment processor token (Paystack/Flutterwave/Stripe), next automatic debit date, and historical PDF tax invoices.
                </p>
              </>
            )}

            {activeStep === 3 && (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Reviewing Renewal Consequences Prior to Cancellation:
                </p>
                <p>
                  When you select <em>Manage Subscription</em>, MsmeBooks displays an audit summary of your account:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Your exact cycle expiration date (e.g., November 14, 2026).</li>
                  <li>Connected modules that will revert to read-only status upon cycle conclusion.</li>
                  <li>Complimentary 90-day read-only data retention warranty.</li>
                </ul>
              </>
            )}

            {activeStep === 4 && (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  One-Click Cancellation Without Penalty Fees:
                </p>
                <p>
                  MsmeBooks never traps businesses. Clicking "Cancel Subscription" will never require telephone retention calls or hidden penalty fees.
                </p>
                <p>
                  Our payment webhook will immediately instruct Paystack, Flutterwave, or Stripe to cancel the recurring card authorization token.
                </p>
              </>
            )}

            {activeStep === 5 && (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cancellation Receipt & Immediate Account Confirmation:
                </p>
                <p>
                  Upon confirmation, an automated email receipt containing your unique cancellation token (e.g., <code>CNL-2026-9041</code>) is dispatched to your registered billing email address.
                </p>
                <p>
                  Your business retains 100% active operational access to POS invoicing, stock adjustments, and ledgers until 23:59 WAT on the final day of your paid cycle.
                </p>
              </>
            )}
          </div>

          {/* Interactive Simulation Card */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Simulated Subscriber Portal</span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">Live Preview</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Plan:</span>
                <span className="font-bold text-blue-950 dark:text-white">Growth Tier (Monthly)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Auto-Renewal Date:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Nov 15, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Subscription Status:</span>
                <span
                  className={`font-semibold ${
                    simulatedCancelled ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {simulatedCancelled ? 'Cancelled (Ends Nov 15)' : 'Active (Auto-Renew On)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSimulatedCancelled(!simulatedCancelled)}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                simulatedCancelled
                  ? 'bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40'
              }`}
            >
              {simulatedCancelled ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-lime-400" />
                  <span>Reactivate Subscription</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Test "Cancel Renewal" Action</span>
                </>
              )}
            </button>

            {simulatedCancelled && (
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded border border-emerald-200 dark:border-emerald-800/60 text-center">
                ✓ Cancellation simulation confirmed. Reference: <strong>CNL-2026-TEST</strong>. Card token revoked.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 4 Core Cancellation Rules Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-blue-950 dark:text-white">Immediate Auto-Renewal Cutoff</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The gateway token is disconnected immediately, ensuring no surprise debits occur on subsequent cycles.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-blue-950 dark:text-white">Full Term Access Retention</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            You retain uninterrupted software usage through the remaining days of your current paid billing period.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-blue-950 dark:text-white">Add-on Synchrony</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Monthly add-ons associated with the parent plan will conclude in tandem without lingering charges.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
          <h4 className="font-bold text-blue-950 dark:text-white">1-Click Reactivation</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Changed your mind? Reactivate your subscription at any time with complete data retention preserved.
          </p>
        </div>
      </div>
    </section>
  );
};
