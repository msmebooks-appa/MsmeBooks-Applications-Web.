import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MessageCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Globe2, 
  ArrowUp,
  MapPin,
  ExternalLink,
  Send,
  Sparkles,
  Zap
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavClick: (tabId: string) => void;
  onOpenRegisterFirm: () => void;
  onOpenProviderPortal: () => void;
  selectedCountry?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenRegisterFirm,
  onOpenProviderPortal,
  selectedCountry = 'Nigeria',
}) => {
  const { t, currentLanguage } = useLanguage();
  const [quickTopic, setQuickTopic] = useState<string>('General Support & Booking');
  const [customNote, setCustomNote] = useState<string>('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Derive user's locale and regional metadata
  const userLocaleInfo = useMemo(() => {
    const browserLocale = typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US';
    let timeZone = 'UTC';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
      console.error(e);
    }
    const langCode = typeof currentLanguage === 'object' && currentLanguage ? currentLanguage.code : (currentLanguage || 'en');
    return {
      browserLocale,
      appLang: langCode,
      timeZone,
      country: selectedCountry || 'Nigeria',
    };
  }, [currentLanguage, selectedCountry]);

  // Generate WhatsApp message pre-filled with locale and inquiry context
  const whatsAppUrl = useMemo(() => {
    const inquiryText = customNote.trim() 
      ? `Topic: ${quickTopic} — ${customNote.trim()}`
      : `Topic: ${quickTopic}`;

    const message = 
      `Hello MsmeBooks Support Desk,\n\n` +
      `I am reaching out via the website footer for fast assistance.\n` +
      `• ${inquiryText}\n` +
      `• Client Region: ${userLocaleInfo.country}\n` +
      `• Active Locale: ${userLocaleInfo.appLang.toUpperCase()} (${userLocaleInfo.browserLocale})\n` +
      `• Timezone: ${userLocaleInfo.timeZone}\n\n` +
      `Please connect me with an available support specialist.`;

    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [quickTopic, customNote, userLocaleInfo]);

  return (
    <footer className="bg-[#102B4E] text-white pt-12 pb-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* QUICK WHATSAPP CHAT CALLOUT BANNER (Pre-fills user locale for faster support) */}
        <div className="mb-12 bg-gradient-to-r from-[#0C223E] via-[#13325B] to-[#102B4E] rounded-3xl p-6 sm:p-8 border border-[#1464C8]/40 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-[#B7E532]/5 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7E532]/20 border border-[#B7E532]/40 text-[#B7E532] text-xs font-black uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Quick WhatsApp Concierge Desk</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7E532] animate-ping"></span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Need Help Fast? Chat Directly With a Support Lead
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Connect on official WhatsApp with your locale ({userLocaleInfo.browserLocale}) and regional context pre-configured for instant routing.
              </p>
              
              {/* Detected Locale Pill */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
                <span className="font-bold text-slate-400">Context:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                  📍 {userLocaleInfo.country}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                  🌐 Locale: {userLocaleInfo.appLang.toUpperCase()} ({userLocaleInfo.browserLocale})
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                  ⏰ {userLocaleInfo.timeZone}
                </span>
              </div>
            </div>

            {/* Interactive WhatsApp Quick Chat Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 w-full lg:max-w-md space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#B7E532] uppercase tracking-wider mb-1.5">
                  Select Assistance Topic:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'General Support & Booking',
                    'Tax Advisory & Filings',
                    'POS Hardware Implementation',
                    'Enterprise Custom Quote',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setQuickTopic(topic)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        quickTopic === topic
                          ? 'bg-[#B7E532] text-[#102B4E] shadow-sm'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional note: e.g. We have 3 retail stores in Ikeja..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/25 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B7E532]"
                />
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#B7E532] hover:bg-[#a5d427] text-[#102B4E] font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Launch WhatsApp Chat (+234 915 848 2622)</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/80">
          
          {/* Brand & Ecosystem Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1464C8] to-[#102B4E] flex items-center justify-center text-white shadow-md border border-white/20">
                <span className="font-extrabold text-lg text-white">M<span className="text-[#B7E532]">B</span></span>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Msme<span className="text-[#1464C8]">Books</span>
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-[#B7E532] text-[#102B4E] px-1.5 py-0.5 rounded">
                  Services
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-sm">
              {t('footer.mission')}
            </p>

            <div className="text-xs text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-[#B7E532]" />
                <span>Official Website: <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="text-[#B7E532] hover:underline">www.msmebooks.org</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#B7E532]" />
                <a 
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, inquiring from footer.")}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#B7E532]"
                >
                  WhatsApp: +234 915 848 2622
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B7E532]" />
                <span>Email: services@msmebooks.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B7E532] mb-4">
              Services Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  Accounting & Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  Taxation & Compliance
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  Payroll & PAYE Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  POS & Hardware Rollouts
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  Hotel PMS Implementation
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services-catalogue')} className="hover:text-white transition-colors cursor-pointer">
                  QuickBooks & Sage Migration
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Industries */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B7E532] mb-4">
              Industry Blueprints
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Retail & Supermarkets
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Restaurants & Lounges
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Hotels & Serviced Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Healthcare & Pharmacies
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Wholesale & Warehousing
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('industry-solutions')} className="hover:text-white transition-colors cursor-pointer">
                  Schools & Education
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Ecosystem & Partners */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B7E532] mb-4">
              Partners & Network
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavClick('firms-directory')} className="hover:text-white transition-colors cursor-pointer">
                  Find a Professional Firm
                </button>
              </li>
              <li>
                <button onClick={onOpenRegisterFirm} className="hover:text-white font-bold text-[#B7E532] transition-colors cursor-pointer">
                  Register Your Practice
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('partner-program')} className="hover:text-white transition-colors cursor-pointer">
                  Partner Tiers (15% - 40%)
                </button>
              </li>
              <li>
                <button onClick={onOpenProviderPortal} className="hover:text-white transition-colors cursor-pointer">
                  Provider Management Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('faqs')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Pan-African Regional Presence */}
        <div className="py-6 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-300">Regional Service Hubs:</span>
            <span>Nigeria 🇳🇬 (Lagos, Abuja, Port Harcourt)</span>
            <span>•</span>
            <span>Ghana 🇬🇭 (Accra, Kumasi)</span>
            <span>•</span>
            <span>Kenya 🇰🇪 (Nairobi)</span>
            <span>•</span>
            <span>South Africa 🇿🇦 (Johannesburg)</span>
            <span>•</span>
            <span>Rwanda 🇷🇼 (Kigali)</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold cursor-pointer"
          >
            <span>{t('scroll.up')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="pt-6 space-y-3 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Regulatory & Audit Engagement Disclaimer:</strong> MsmeBooks is a business software platform and services marketplace. Advisory, bookkeeping, tax planning, and technology implementation services are conducted in accordance with commercial standards. Where independent statutory financial audits or regulatory certifications are mandated by law, engagements are formally referred to appropriately licensed external audit firms registered with relevant professional bodies (e.g. ICAN, ACCA, FRC, ICAG, ICPAK, SAICA).
          </p>

          <p>
            <strong>Data Privacy & Security:</strong> We operate strictly under Nigeria Data Protection Act (NDPA) regulations and international privacy benchmarks. Confidential business records, tax filings, and uploaded documents are encrypted and never disclosed publicly.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-slate-500">
            <span>
              © {new Date().getFullYear()} MsmeBooks (www.msmebooks.org). {t('footer.allRights')}
            </span>
            <span>
              Official WhatsApp: +234 915 848 2622
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
