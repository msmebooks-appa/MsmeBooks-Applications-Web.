import React from 'react';
import {
  Globe,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ArrowUp,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { CurrencyCode, LanguageCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../data/mockData';
import { LANGUAGES } from '../data/languages';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentCurrency, onSelectCurrency }) => {
  const { language, setLanguage, t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Tier: Brand + Offices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0866FF] flex items-center justify-center font-black text-white text-base shadow-md">
                MB
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">
                  Msme<span className="text-[#0866FF]">Books</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#B7F000] ml-1 mb-2" />
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0866FF] hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0866FF] hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0866FF] hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0866FF] hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Regional African Offices */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Lagos, Nigeria</span>
              </div>
              <p className="text-slate-400">14 Admiralty Way, Lekki Phase 1, Lagos</p>
              <div className="text-slate-300 font-mono pt-1">+234 1 888 2400</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Nairobi, Kenya</span>
              </div>
              <p className="text-slate-400">The Address, Muthangari Dr, Westlands</p>
              <div className="text-slate-300 font-mono pt-1">+254 20 765 1900</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Accra, Ghana</span>
              </div>
              <p className="text-slate-400">Stanbic Heights, Airport City, Accra</p>
              <div className="text-slate-300 font-mono pt-1">+233 30 299 8200</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0866FF]" />
                <span>Johannesburg, SA</span>
              </div>
              <p className="text-slate-400">Sandton City Atrium, Sandton, JHB</p>
              <div className="text-slate-300 font-mono pt-1">+27 11 550 4300</div>
            </div>
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Col 1: Product */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Financial Accounting</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Digital Invoicing</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Inventory Control</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Modern POS</a></li>
              <li><a href="#multibranch" className="hover:text-white transition-colors">Multi-Branch System</a></li>
              <li><a href="#ai-assistant" className="hover:text-white transition-colors">AI Business Assistant</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Customer CRM</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Expenses &amp; Petty Cash</a></li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#industries" className="hover:text-white transition-colors">Supermarkets &amp; Retail</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Restaurants &amp; Lounges</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Hotels &amp; Hospitality</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Real Estate &amp; Rentals</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Wholesale &amp; Distribution</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Small Manufacturers</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Accounting Practitioners</a></li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Connectors</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#integrations" className="hover:text-white transition-colors">Paystack &amp; Flutterwave</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">M-Pesa &amp; Mobile Money</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Commercial Bank Direct</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">WhatsApp Business API</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Shopify &amp; WooCommerce</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">GIG &amp; DHL Logistics</a></li>
            </ul>
          </div>

          {/* Col 4: Platform & Intelligence */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#bi" className="hover:text-white transition-colors">Business Intelligence</a></li>
              <li><a href="#bi" className="hover:text-white transition-colors">Pan-African Trade Map</a></li>
              <li><a href="#ecommerce" className="hover:text-white transition-colors">Digital Storefront &amp; POS</a></li>
              <li><a href="#multibranch" className="hover:text-white transition-colors">Multi-Branch Architecture</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">NDPR Cloud Vault</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Customer Success Stories</a></li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About MsmeBooks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Leadership &amp; Vision</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers <span className="text-[#B7F000] font-bold">We're hiring</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press &amp; Media Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
            </ul>
          </div>

          {/* Col 6: African Markets */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Markets</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">🇳🇬 Nigeria (NGN)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🇰🇪 Kenya (KES)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🇬🇭 Ghana (GHS)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🇿🇦 South Africa (ZAR)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🇷🇼 Rwanda (RWF)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🇺🇬 Uganda (UGX)</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Language + Currency + Legal + Back to top */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
            <span>&copy; {new Date().getFullYear()} MsmeBooks Technologies Inc. {t.footer.rights}</span>
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security &amp; NDPR</a>
            <a href="#" className="hover:text-slate-300">System Status (99.99%)</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector in Footer */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs">🌐</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
                title={t.nav.selectLanguage}
              >
                {Object.values(LANGUAGES).map((item) => (
                  <option key={item.code} value={item.code} className="bg-slate-900 text-white">
                    {item.flag} {item.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-[#0866FF]" />
              <select
                value={currentCurrency}
                onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                {(Object.values(CURRENCIES) as CurrencyConfig[]).map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.flag} {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
