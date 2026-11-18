import React from 'react';
import { ShieldCheck, MessageCircle, Globe, Heart, ArrowUp } from 'lucide-react';
import { POLICY_METADATA } from '../data/policyData';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white ring-1 ring-lime-400/60">
                <span className="font-extrabold text-base tracking-tighter text-white">
                  M<span className="text-lime-400">B</span>
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Msme<span className="text-lime-400">Books</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t('footer.brandDesc', 'All-in-one cloud Accounting, Point of Sale (POS), Inventory, and Business Management SaaS platform for micro, small, medium, and growing enterprises across Africa and worldwide.')}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p><strong>Official Portal:</strong> www.msmebooks.org</p>
              <p><strong>WhatsApp Support:</strong> {POLICY_METADATA.officialWhatsAppFormatted}</p>
              <p><strong>Billing Desk:</strong> {POLICY_METADATA.officialSupportEmail}</p>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Cloud Accounting</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Point of Sale (POS)</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Inventory & Warehouses</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Payroll & Staff</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Hospitality & Dining</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Marketplace Add-ons</a></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company & Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">About Us</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Pricing & Plans</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Industries Served</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Professional Services</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Certified Partners & VARs</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Help Center & Docs</a></li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#overview" className="text-lime-400 font-semibold hover:underline">
                  Refund & Cancellation Policy
                </a>
              </li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Privacy Policy</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Data Protection (NDPR)</a></li>
              <li><a href="#faq-section" className="hover:text-lime-400 transition-colors">Policy FAQs</a></li>
              <li><a href="https://www.msmebooks.org" className="hover:text-lime-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>

        {/* Pan-African Coverage Statement & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="text-slate-400">
              © {new Date().getFullYear()} MsmeBooks Technologies. {t('footer.rights', 'All rights reserved.')}
            </p>
            <p className="text-[11px] text-slate-500">
              Serving micro, small, medium, and growing enterprises in Nigeria, Kenya, Ghana, South Africa, Rwanda, Uganda, and internationally.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${POLICY_METADATA.officialWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-lime-400 hover:text-lime-300 font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Desk</span>
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label={t('footer.backToTop', 'Back to Top')}
            >
              <span>{t('footer.backToTop', 'Back to Top')}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
