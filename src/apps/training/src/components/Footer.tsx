import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      
      {/* Top Value Banner */}
      <div className="bg-[#073B75] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Ready to Accelerate Your Business &amp; Career with MsmeBooks?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
              Join over 12,500 accountants, retail cashiers, and implementation partners across Africa. Start with our free foundation modules today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('courses')}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Start Learning Today
            </button>
            <button
              onClick={() => onSelectTab('corporate')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              Corporate Inquiries
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0B4F9C] flex items-center justify-center text-white font-bold text-lg">
                M<span className="w-1.5 h-3.5 bg-[#72B01D] rounded-full ml-0.5" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">MsmeBooks</span>
                <span className="text-[10px] font-bold text-white bg-[#72B01D] px-1.5 py-0.5 rounded ml-1.5 uppercase">
                  Academy
                </span>
                <p className="text-[10px] text-slate-400">Learn Smarter · Manage Better · Grow Faster</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier SaaS digital training academy and learning management system for MsmeBooks accounting, Point of Sale, inventory, and hotel PMS software across Africa.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#72B01D]" />
                <span>Lagos · Nairobi · Accra · Johannesburg · London</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#72B01D]" />
                <span>academy@msmebooks.org</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academics */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Training Tracks
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white cursor-pointer">
                  Cloud Accounting &amp; Ledger
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white cursor-pointer">
                  Point of Sale (POS) Cashiering
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white cursor-pointer">
                  Warehouse &amp; Stock FIFO
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white cursor-pointer">
                  Hotel PMS &amp; Guest Folios
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white cursor-pointer">
                  Nigerian VAT &amp; WHT Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Ecosystem &amp; Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('learning-paths')} className="hover:text-white cursor-pointer">
                  Structured Learning Paths
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sandbox')} className="hover:text-white cursor-pointer">
                  Interactive Software Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('verify-certificate')} className="hover:text-white cursor-pointer">
                  Verify Digital Certificate
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('corporate')} className="hover:text-white cursor-pointer">
                  Corporate Training Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('partners')} className="hover:text-white cursor-pointer">
                  Partner Accreditation (Up to 40%)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('wishlist')} className="hover:text-white cursor-pointer">
                  Saved Courses (Wishlist)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('live-training')} className="hover:text-white cursor-pointer">
                  Virtual Live Masterclasses
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Newsletter &amp; Updates
            </h4>
            <p className="text-slate-400 text-[11px]">
              Receive monthly business management tutorials and new software feature guides.
            </p>

            {!subscribed ? (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0B4F9C]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-700 rounded-lg text-emerald-300 text-[11px]">
                ✓ Subscribed to MsmeBooks Academy Dispatch.
              </div>
            )}
          </div>

        </div>

        {/* Quiet Sub-footer */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MsmeBooks Academy. All rights reserved. Registered SaaS platform.</p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.msmebooks.org" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Main MsmeBooks Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>WCAG 2.2 Accessible</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
