import React from 'react';
import { Logo } from './Logo';
import { useI18n } from '../context/I18nContext';
import { PhoneCall, Mail, Globe, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer id="footer" className="bg-[#0D1829] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" showTagline={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              MsmeBooks is the all-in-one cloud accounting, Point of Sale (POS), inventory, and business management software empowering African micro, small, medium, and growing enterprises.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#B7E522]" />
                <a href="https://www.msmebooks.org" className="hover:underline">www.msmebooks.org</a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#B7E522]" />
                <a href="tel:+2349158482622" className="hover:underline">+234 915 848 2622</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B7E522]" />
                <span>Pan-African Support Hubs & Global Remote Delivery</span>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white tracking-wider uppercase">Products</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#accounting" className="hover:text-white transition">Accounting & Ledger</a></li>
              <li><a href="#pos" className="hover:text-white transition">Point of Sale (POS)</a></li>
              <li><a href="#inventory" className="hover:text-white transition">Inventory & Warehousing</a></li>
              <li><a href="#hotel-management" className="hover:text-white transition">Hotel & PMS Add-on</a></li>
              <li><a href="#hr-payroll" className="hover:text-white transition">HR & Payroll</a></li>
              <li><a href="#multi-branch" className="hover:text-white transition">Multi-Branch System</a></li>
              <li><a href="#marketplace" className="hover:text-white transition">Marketplace & APIs</a></li>
            </ul>
          </div>

          {/* Industries Column */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white tracking-wider uppercase">Industries</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#industries" className="hover:text-white transition">Supermarkets & Retail</a></li>
              <li><a href="#industries" className="hover:text-white transition">Restaurants & Bars</a></li>
              <li><a href="#industries" className="hover:text-white transition">Hotels & Guest Houses</a></li>
              <li><a href="#industries" className="hover:text-white transition">Pharmacies & Clinics</a></li>
              <li><a href="#industries" className="hover:text-white transition">Fashion & Apparel</a></li>
              <li><a href="#industries" className="hover:text-white transition">Construction & Projects</a></li>
              <li><a href="#industries" className="hover:text-white transition">Accounting & Audit Firms</a></li>
            </ul>
          </div>

          {/* Resources & Support Column */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white tracking-wider uppercase">Knowledge Hub</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#faq-hub" className="text-[#B7E522] font-semibold hover:underline">Help & FAQ Centre</a></li>
              <li><a href="#getting-started" className="hover:text-white transition">Getting Started Guide</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing & Free Plan</a></li>
              <li><a href="#partners" className="hover:text-white transition">Partner Program (Up to 40%)</a></li>
              <li><a href="#data-migration" className="hover:text-white transition">Migrate from Sage/QuickBooks</a></li>
              <li><a href="#security-privacy" className="hover:text-white transition">Security & Trust</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Compliance and Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B7E522]" />
            <span>© 2026 MsmeBooks Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            <span>•</span>
            <a href="#sla" className="hover:text-white transition">SLA & Security</a>
            <span>•</span>
            <a href="https://www.msmebooks.org" className="hover:text-white transition">www.msmebooks.org</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
