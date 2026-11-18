import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  FileText, 
  Briefcase, 
  DollarSign, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { PARTNER_TIERS } from '../data/mockData';
import { Course } from '../types';

interface PartnerAcademyProps {
  onStartPartnerCourse: () => void;
}

export const PartnerAcademy: React.FC<PartnerAcademyProps> = ({
  onStartPartnerCourse
}) => {
  const [partnerApplicationSubmitted, setPartnerApplicationSubmitted] = useState(false);
  const [applicantType, setApplicantType] = useState('Accounting / Audit Firm');

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Partner Academy Hero */}
        <div className="bg-[#073B75] dark:bg-slate-950 text-white p-8 sm:p-12 rounded-3xl border border-blue-900 shadow-md relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#84CC16] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span>Certified Partner &amp; Reseller Program</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Grow Your Professional Practice with <span className="text-[#84CC16]">MsmeBooks</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Earn between <span className="text-white font-bold">15% and 40% recurring commissions</span> by delivering cloud accounting, retail POS, and inventory setup services to African businesses.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onStartPartnerCourse}
                className="px-6 py-3 text-xs font-bold text-slate-950 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-2"
              >
                <span>Enroll in Partner Bootcamp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#partner-tiers"
                className="px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                View Commission Tiers
              </a>
            </div>
          </div>
        </div>

        {/* Commission Tiers Grid */}
        <div id="partner-tiers" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400">
              Partner Program Economics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Accreditation &amp; Commission Structure
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Commission rates apply to all client subscription renewals managed under your partner account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNER_TIERS.map((tier) => {
              const isGold = tier.tier === 'Gold';
              return (
                <div
                  key={tier.tier}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isGold
                      ? 'border-[#0B4F9C] dark:border-blue-500 shadow-lg ring-2 ring-[#0B4F9C]/20 relative'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {isGold && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B4F9C] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-lg text-slate-900 dark:text-white">{tier.tier} Partner</span>
                      <span className="text-xs font-bold text-[#72B01D] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        Tier Level
                      </span>
                    </div>

                    <div className="my-4">
                      <span className="text-3xl font-black text-[#0B4F9C] dark:text-blue-400">{tier.commissionRate}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Paid monthly on client subscriptions</p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200 text-[11px]">Accreditation Perk:</p>
                      {tier.perks.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#72B01D] shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={onStartPartnerCourse}
                      className="w-full py-2 px-3 text-xs font-bold text-[#0B4F9C] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Qualify for {tier.tier}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner Registration Form */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Apply for MsmeBooks Partner Accreditation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gain immediate access to partner training materials, client presentation decks, and demo sandboxes.
            </p>
          </div>

          {!partnerApplicationSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPartnerApplicationSubmitted(true);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Financial Consult Ltd"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Primary Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Adekunle, ACA"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="grace@apexfinancial.ng"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Practice / Reseller Type</label>
                  <select
                    value={applicantType}
                    onChange={(e) => setApplicantType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                  >
                    <option>Accounting / Audit Firm</option>
                    <option>POS Hardware &amp; IT Vendor</option>
                    <option>Business Consultant / Tax Agent</option>
                    <option>Software Reseller / Distributor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
              >
                Submit Partner Accreditation Application
              </button>
            </form>
          ) : (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-center space-y-2 text-emerald-900 dark:text-emerald-200 text-xs">
              <CheckCircle2 className="w-8 h-8 text-[#72B01D] mx-auto" />
              <h4 className="font-extrabold text-sm">Application Received!</h4>
              <p className="text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Thank you! Your partner application is under review. You can now start the <span className="font-bold">MsmeBooks Certified Implementation Partner &amp; Reseller Bootcamp</span> immediately.
              </p>
              <button
                onClick={onStartPartnerCourse}
                className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0B4F9C] rounded-lg cursor-pointer"
              >
                Go to Partner Bootcamp Course →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
