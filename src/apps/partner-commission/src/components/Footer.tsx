import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onOpenApplyModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAgreementModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApplyModal,
  onOpenAdminModal,
  onOpenAgreementModal
}) => {
  return (
    <footer className="bg-[#142D4E] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Pan-African Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1261B5] flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 7H16" stroke="#B9E51C" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16.5" cy="15.5" r="1.5" fill="#B9E51C"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Msme<span className="text-[#B9E51C]">Books</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                  Partner Commission Program
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Empowering accountants, bookkeepers, IT resellers, POS agents, and advisors across Africa and worldwide with sustainable recurring commission revenue.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#B9E51C]" />
                <span>Pan-African SaaS Infrastructure · Operating in 18+ Markets</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B9E51C]" />
                <a href="mailto:partners@msmebooks.org" className="hover:underline text-slate-300">
                  partners@msmebooks.org
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Partner Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider">
              Partner Program
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#tiers" className="hover:text-white transition-colors">Commission Tiers (15%–40%)</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">18 Partner Categories</a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">Earnings Calculator</a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition-colors">Partner Portal Preview</a>
              </li>
              <li>
                <button
                  onClick={onOpenApplyModal}
                  className="hover:text-white transition-colors text-left font-semibold text-[#B9E51C]"
                >
                  Partner Registration Form &rarr;
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminModal}
                  className="hover:text-white transition-colors text-left text-slate-400 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-[#1261B5]" />
                  <span>Admin Control Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: MsmeBooks Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider">
              MsmeBooks Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Core Cloud Accounting</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">POS Touch & Retail Terminal</a>
              </li>
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Multi-Location Inventory</a>
              </li>
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Payroll & PAYE Compliance</a>
              </li>
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">SME Pricing Plans</a>
              </li>
              <li>
                <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Book a Product Demo</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={onOpenAgreementModal}
                  className="hover:text-white transition-colors text-left underline font-medium text-slate-200"
                >
                  Partner Agreement Terms
                </button>
              </li>
              <li>
                <a href="#payouts" className="hover:text-white transition-colors">Commission Payout Policy</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Referral Attribution Rules</a>
              </li>
              <li>
                <span className="text-slate-400">Privacy & Data Handling</span>
              </li>
              <li>
                <span className="text-slate-400">Terms and Conditions</span>
              </li>
              <li>
                <span className="text-slate-400">Help Center & Support Desk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} MsmeBooks Inc. (www.msmebooks.org). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAgreementModal}
              className="hover:text-slate-200 underline"
            >
              Partner Agreement
            </button>
            <span aria-hidden="true">·</span>
            <span>NDPA & GDPR Aligned</span>
            <span aria-hidden="true">·</span>
            <span>Official Pan-African Partner Ecosystem</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
