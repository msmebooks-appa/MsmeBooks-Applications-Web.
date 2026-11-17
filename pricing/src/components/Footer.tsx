import React from 'react';
import { Phone, Mail, Globe, ShieldCheck, Lock, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B192C] dark:bg-[#050C16] text-slate-400 text-xs border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A4FD5] to-[#1E60E5] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Msme<span className="text-[#0A4FD5]">Books</span>
                <span className="ml-1 inline-block w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              {t.footer.brandDesc}
            </p>

            <div className="pt-2 space-y-2 text-slate-300">
              <a
                href="tel:+2349158482622"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>+234 915 848 2622</span>
              </a>
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>www.msmebooks.org</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>support@msmebooks.org</span>
              </div>
            </div>

            {/* Chat with Sales on WhatsApp CTA Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Sales%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20pricing%20plans%20and%20onboarding%20support%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-black text-xs transition-all shadow-md hover:shadow-lg group cursor-pointer"
                title="Chat with Sales on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Chat with Sales on WhatsApp</span>
              </a>
            </div>

            {/* Security Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Lock className="w-3 h-3 text-emerald-400" />
                {t.footer.sslBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3 h-3 text-lime-400" />
                {t.footer.gdprBadge}
              </span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.platformTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#plans" className="hover:text-white transition-colors">{t.nav.pricingPlans}</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">Cloud Double-Entry Accounting</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">Offline POS & Cashier Registers</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">Multi-Warehouse Inventory</a></li>
              <li><a href="#ai-assistant" className="hover:text-white transition-colors">{t.nav.aiAssistant}</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">E-commerce Storefronts</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">Statutory VAT & WHT Filing</a></li>
            </ul>
          </div>

          {/* Col 3: African Focus & Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.smeSolutionsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#african-focus" className="hover:text-white transition-colors">Retailers & Supermarkets</a></li>
              <li><a href="#african-focus" className="hover:text-white transition-colors">Pharmacies & Chemists</a></li>
              <li><a href="#african-focus" className="hover:text-white transition-colors">Wholesalers & Distributors</a></li>
              <li><a href="#african-focus" className="hover:text-white transition-colors">Restaurants & Food Outlets</a></li>
              <li><a href="#african-focus" className="hover:text-white transition-colors">Fashion & Fabric Boutiques</a></li>
              <li><a href="#african-focus" className="hover:text-white transition-colors">Paystack & Flutterwave Gateway</a></li>
            </ul>
          </div>

          {/* Col 4: Company & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.companySupportTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Sales%20Team%2C%20I%20have%20an%20inquiry%20regarding%20subscription%20plans%20and%20business%20solutions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-[#1EBE5D] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Chat with Sales on WhatsApp</span>
                </a>
              </li>
              <li><a href="#faq" className="hover:text-white transition-colors">{t.nav.faqs}</a></li>
              <li><a href="#plan-matcher" className="hover:text-white transition-colors">{t.nav.planMatcher}</a></li>
              <li><a href="tel:+2349158482622" className="hover:text-white transition-colors">Book 1-on-1 Onboarding</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Data Migration Service</a></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {t.footer.copyright}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>{t.footer.panAfricanNote}</span>
            <div className="border-l border-slate-700 pl-4 py-0.5">
              <LanguageSelector compact={true} />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
