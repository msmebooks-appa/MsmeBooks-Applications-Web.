import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ShieldCheck, 
  Award, 
  Layers, 
  Users 
} from 'lucide-react';

export const WhyLearnAndFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the digital certificate verification work?',
      a: 'Every MsmeBooks certificate is issued with a permanent unique registration number and cryptographic QR code. Anyone (employers, audit clients, partner directories) can visit /academy/verify-certificate, input the code, and instantly view verified graduation date, score, instructor signature, and validated skills.'
    },
    {
      q: 'What is the Practical Software Training Sandbox?',
      a: 'The sandbox is a safe, realistic interactive simulation of MsmeBooks Cloud Accounting, POS, Inventory, and Hotel PMS. Learners practice posting real invoices, performing cashier shift balances, and logging warehouse shipments without touching live business or bank data.'
    },
    {
      q: 'How do corporate training packages and team seat licenses work?',
      a: 'Corporate administrators can purchase packs of seats (from 5 to 500+) with volume discounts up to 20%. You can assign mandatory compliance courses, set completion deadlines, and download consolidated audit progress reports by branch or department.'
    },
    {
      q: 'How does the MsmeBooks Partner & Reseller Commission work?',
      a: 'Accredited partners earn recurring commissions based on their tier: Bronze (15%), Silver (20%), Gold (30%), and Platinum (40%). When you onboard clients to MsmeBooks, you receive monthly payouts on their active subscriptions as long as they remain on the software.'
    },
    {
      q: 'Are courses self-paced or scheduled live?',
      a: 'All courses are self-paced with 24/7 lifetime access, video lessons, and interactive software labs. In addition, registered students can attend weekly live masterclasses hosted by master instructors via Zoom and Microsoft Teams.'
    }
  ];

  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Why Learn with MsmeBooks Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
              Enterprise Value
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Why Professionals Learn with MsmeBooks Academy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Designed specifically for the realities of African SME operations, local taxation regulations, and multi-currency commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[#0B4F9C] dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Hands-on Software Sandbox</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Learn by doing. Perform real journal entries, invoice test customers, reconcile cash drawers, and manage hotel guest folios in an isolated demo environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-[#72B01D]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tax &amp; Compliance Grounded</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Modules are built around Nigerian and West African fiscal laws, including 7.5% VAT Output/Input schedules, Withholding Tax (WHT) deductions, and multi-currency ledgers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Permanent Verifiable Credentials</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Graduates receive industry-recognized digital certificates with public verification URLs and QR codes for instant verification on LinkedIn and company resumes.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-4 sm:p-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
