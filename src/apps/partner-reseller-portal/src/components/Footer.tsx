import React from 'react';
import { MsmeLogo } from './MsmeLogo';
import { Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenApply: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  onOpenSchedule: (letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApply,
  onOpenPortal,
  onOpenAdmin,
  onOpenSchedule
}) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <MsmeLogo variant="white" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t(
                'footer.description',
                'MsmeBooks Partner Ecosystem empowers accountants, business advisors, software consultants, and enterprise resellers with next-generation cloud business tools and lucrative recurring commissions.'
              )}
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-lime-400" />
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                www.msmebooks.org
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Regional Commercial Hubs: Lagos · Nairobi · Accra · Johannesburg · London
            </p>
          </div>

          {/* Column 2: Programme Tracks */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Partnership Tracks
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Accounting Practitioners</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">POS & Retail Agents</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Software Distributors</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">SME Business Advisors</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Incubators & Tech Hubs</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Affiliates & Creators</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Commercial Schedules */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Legal Schedules
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button type="button" onClick={() => onOpenSchedule('A')} className="hover:text-white transition-colors text-left">
                  Schedule A: Categories
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenSchedule('B')} className="hover:text-white transition-colors text-left">
                  Schedule B: Commissions (15-40%)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenSchedule('C')} className="hover:text-white transition-colors text-left">
                  Schedule C: Benefits
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenSchedule('D')} className="hover:text-white transition-colors text-left">
                  Schedule D: Brand Rules
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenSchedule('E')} className="hover:text-white transition-colors text-left">
                  Schedule E: Data Protection
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenSchedule('F')} className="hover:text-white transition-colors text-left">
                  Schedule F: Code of Conduct
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Portals & Access */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Partner Access
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button type="button" onClick={onOpenPortal} className="text-lime-300 font-semibold hover:underline text-left">
                  Open Partner Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenAdmin} className="hover:text-white transition-colors text-left">
                  Admin Approval Desk
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenApply} className="hover:text-white transition-colors text-left">
                  Submit New Application
                </button>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">Earnings Calculator</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Partner FAQ</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} MsmeBooks Enterprise Technologies Limited. All rights reserved. Registered across African commercial jurisdictions.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>GDPR / NDPR / POPIA Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
