import React from 'react';
import { 
  Phone, 
  Globe2, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onOpenDirectory: () => void;
  onOpenBecomePartner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDirectory,
  onOpenBecomePartner,
}) => {
  return (
    <footer id="footer" className="bg-[#051121] text-slate-300 border-t border-slate-800 text-xs">
      
      {/* Top Banner: Quick Contact & Global Footprint */}
      <div className="border-b border-slate-800/80 py-8 bg-[#061427]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-lime-500/40 flex items-center justify-center text-lime-400 font-extrabold text-lg">
              M
            </div>
            <div>
              <div className="font-extrabold text-white text-base">MsmeBooks Technologies</div>
              <div className="text-[11px] text-slate-400">All-in-One Accounting, POS & Business Management</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a
              href="tel:+2349158482622"
              className="flex items-center gap-2 text-slate-200 hover:text-lime-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-lime-400" />
              <span>+234 915 848 2622</span>
            </a>

            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-200 hover:text-lime-400 transition-colors"
            >
              <Globe2 className="w-4 h-4 text-lime-400" />
              <span>www.msmebooks.org</span>
            </a>

            <a
              href="mailto:partners@msmebooks.org"
              className="flex items-center gap-2 text-slate-200 hover:text-lime-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-lime-400" />
              <span>partners@msmebooks.org</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: About & Positioning */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">MsmeBooks</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                Partner Network
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              MsmeBooks is an all-in-one Accounting, POS, Inventory and Business Management Platform built for micro, small and medium-sized businesses across Africa and worldwide.
            </p>

            <div className="pt-2 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                <span>Certified Pan-African Financial Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-lime-400" />
                <span>HQ: Lagos, Nigeria • Operations: Nairobi, Accra, Johannesburg</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Cloud Accounting</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Smart POS System</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Inventory & Warehouses</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Multi-Branch Management</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">E-Commerce & Digital Payments</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Tax & Fiscal Compliance</a></li>
            </ul>
          </div>

          {/* Col 3: Partner Network */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Partner Network</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenDirectory} className="hover:text-lime-400 transition-colors text-left">
                  Find a Partner
                </button>
              </li>
              <li>
                <button onClick={onOpenBecomePartner} className="hover:text-lime-400 transition-colors text-left">
                  Become a Partner
                </button>
              </li>
              <li><a href="#become-partner" className="hover:text-lime-400 transition-colors">Commission Tiers (Up to 40%)</a></li>
              <li><a href="#partner-referrals" className="hover:text-lime-400 transition-colors">Partner Referral & Rewards</a></li>
              <li><a href="#global-map" className="hover:text-lime-400 transition-colors">Global Partner Map</a></li>
              <li><a href="#faq" className="hover:text-lime-400 transition-colors">Partner FAQ</a></li>
              <li><a href="#hero" className="hover:text-lime-400 transition-colors">Partner Portal Login</a></li>
            </ul>
          </div>

          {/* Col 4: Top Markets */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Key Markets</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇳🇬 Nigeria Hub</a></li>
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇰🇪 Kenya Hub</a></li>
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇬🇭 Ghana Hub</a></li>
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇿🇦 South Africa Hub</a></li>
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇺🇬 Uganda Hub</a></li>
              <li><a href="#countries" className="hover:text-lime-400 transition-colors">🇬🇧 UK & Global Corridor</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Flags */}
      <div className="border-t border-slate-800/80 py-6 bg-[#040d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          
          <div>
            © 2026 MsmeBooks Technologies. All rights reserved. Registered across African commercial jurisdictions.
          </div>

          <div className="flex items-center gap-4">
            <span>African-First Global Architecture:</span>
            <div className="flex items-center gap-1.5 text-base">
              <span>🇳🇬</span>
              <span>🇬🇭</span>
              <span>🇰🇪</span>
              <span>🇿🇦</span>
              <span>🇺🇬</span>
              <span>🇷🇼</span>
              <span>🇪🇬</span>
              <span>🌍</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};
