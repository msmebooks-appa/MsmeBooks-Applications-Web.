import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Award, 
  Mail, 
  PhoneCall, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Globe2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenPortal: () => void;
  onOpenPartnerPortal: () => void;
  onOpenAdmin: () => void;
  onOpenConsultation: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPortal,
  onOpenPartnerPortal,
  onOpenAdmin,
  onOpenConsultation,
  onNavigateSection,
}) => {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 pt-16 pb-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 border border-blue-400/40 flex items-center justify-center text-white font-extrabold text-xl shadow-lg relative">
                M
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-grotesk">Msme</span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-grotesk">Books</span>
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"></span>
                </div>
                <span className="text-[10px] tracking-widest font-semibold text-lime-600 dark:text-lime-400 uppercase">
                  OUTSOURCING PLATFORM
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-lime-400" />
                <span>{t.footer.officialDomain} </span>
                <a href="https://www.msmebooks.org" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lime-400 font-bold underline">
                  www.msmebooks.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.footer.accreditation}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                {t.footer.digestTitle}
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder={t.footer.digestPlaceholder}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-lime-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  {t.footer.digestJoin}
                </button>
              </form>
              {subscribed && (
                <div className="text-[11px] text-lime-400 font-medium mt-1.5">
                  {t.footer.subscribedNotice}
                </div>
              )}
            </div>

          </div>

          {/* Col 2: Outsourcing Services */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-grotesk">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Bookkeeping Outsourcing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Accounting & Reporting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Payroll Outsourcing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Human Resources (HR)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Tax & Regulatory Filings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Virtual CFO Advisory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-lime-400 transition cursor-pointer">
                  Inventory & POS Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-grotesk">
              {t.footer.industriesTitle}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Retail & Supermarkets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Restaurants & Hospitality
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Technology & SaaS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Manufacturing & FMCG
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Healthcare & Pharmacies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Construction & Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-lime-400 transition cursor-pointer">
                  Nonprofits & Donor Grants
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Regional Hubs */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-grotesk">
              {t.footer.operationsTitle}
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div>
                <span className="font-bold text-slate-200">West Africa Hub:</span>
                <p className="text-[11px]">Victoria Island, Lagos, Nigeria • Airport Residential, Accra, Ghana</p>
              </div>
              <div>
                <span className="font-bold text-slate-200">East Africa Hub:</span>
                <p className="text-[11px]">Westlands, Nairobi, Kenya • Kigali Innovation City, Rwanda</p>
              </div>
              <div>
                <span className="font-bold text-slate-200">Southern Africa Hub:</span>
                <p className="text-[11px]">Sandton, Johannesburg, South Africa</p>
              </div>
              <div>
                <span className="font-bold text-slate-200">Global & Diaspora:</span>
                <p className="text-[11px]">Canary Wharf, London, United Kingdom</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={onOpenPortal}
                className="text-left text-lime-400 hover:underline font-bold"
              >
                Enter Client Outsourcing Portal →
              </button>
              <button
                onClick={onOpenPartnerPortal}
                className="text-left text-blue-400 hover:underline font-bold"
              >
                Join Partner Ecosystem (Up to 40% Commission) →
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left text-slate-500 hover:text-slate-300"
              >
                Central Operations Console (Staff)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Security Row */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {t.footer.rights}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>NDPR & POPIA Compliant</span>
            <span>•</span>
            <span>GDPR Aligned</span>
            <span>•</span>
            <span>256-bit TLS Encryption</span>
            <span>•</span>
            <span>Terms of Engagement</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
