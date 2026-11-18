import React from 'react';
import { MsmeBooksLogo } from './MsmeBooksLogo';
import { ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14243A] dark:bg-[#070D18] text-slate-300 dark:text-slate-400 pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="col-span-2">
            <MsmeBooksLogo size="md" variant="white" />
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm">
              MsmeBooks is a leading Pan-African SaaS company providing an all-in-one Accounting, Point of Sale (POS), Inventory, and Business Management platform for micro, small, and medium enterprises across Africa and beyond.
            </p>
            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-[#B5E61D]" />
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                www.msmebooks.org
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#why-msmebooks" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#life-at-msmebooks" className="hover:text-white transition-colors">
                  Our Culture
                </a>
              </li>
              <li>
                <a href="#job-board" className="text-[#B5E61D] font-medium hover:underline">
                  Careers (Hiring)
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Contact Us</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.msmebooks.org/accounting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Accounting & Ledgers
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/pos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Point of Sale (POS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/inventory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Inventory Tracking
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/management"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Business Management
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pricing" className="text-[#B5E61D] font-medium hover:underline">
                  Job Post Pricing & Plans
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  Careers FAQs
                </a>
              </li>
              <li>
                <a href="#talent-community" className="hover:text-white transition-colors">
                  Talent Community
                </a>
              </li>
              <li>
                <a href="#job-alerts" className="hover:text-white transition-colors">
                  Job Alerts
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-white transition-colors">
                  Applicant Privacy Notice
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MsmeBooks Technologies Limited. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-xs">Connecting African commerce to cloud reliability</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#B5E61D]">Lagos · Nairobi · Kigali · Accra · Johannesburg</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
