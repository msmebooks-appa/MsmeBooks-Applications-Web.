import React, { useState } from 'react';
import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

interface FooterProps {
  onOpenApplyModal: () => void;
  onOpenContactModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApplyModal,
  onOpenContactModal
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const navColumns = [
    {
      title: 'Platform & Ecosystem',
      links: [
        { label: 'Products', href: '#hero-section' },
        { label: 'Solutions', href: '#ecosystem' },
        { label: 'Industries', href: '#why-partner' },
        { label: 'Partner Program', href: '#commission-tiers' },
        { label: 'Partner Tiers', href: '#comparison' },
      ],
    },
    {
      title: 'Community & Media',
      links: [
        { label: 'Events', href: '#community' },
        { label: 'Videos', href: '#videos' },
        { label: 'Success Stories', href: '#success-stories' },
        { label: 'Resources', href: '#partner-dashboard' },
      ],
    },
    {
      title: 'Company & Support',
      links: [
        { label: 'About Us', href: '#hero-section' },
        { label: 'Contact', href: '#final-cta' },
        { label: 'Help Center', href: '#faqs' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms & Conditions', href: '#terms' },
      ],
    },
  ];

  return (
    <footer id="main-footer" className="bg-[#0A192F] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Strip (Prompt Mandate) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#84CC16] block mb-1">
                Stay Informed
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Get MsmeBooks Partner & Business Growth Updates
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Receive monthly partner briefs on African taxation reforms, product updates, and commission acceleration strategies.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex-1 max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  <span>Thank you for subscribing! Check your inbox for the latest partner digest.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your professional email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#84CC16]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A2540] flex items-center justify-center border border-white/10 shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white font-display">MsmeBooks</span>
                <span className="w-2 h-2 rounded-full bg-[#84CC16] inline-block ml-1"></span>
              </div>
            </div>

            {/* Tagline (Prompt Mandate) */}
            <p className="text-sm font-semibold text-slate-200">
              Business Management. Accounting. Growth.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The African business technology ecosystem and partner program empowering Micro, Small and Medium Enterprises across retail, services, wholesale, and trade with modern cloud ledgers, POS and recurring revenue channels.
            </p>

            {/* African regional operations presence */}
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#84CC16]" />
              <span>Headquarters in Lagos & Nairobi • Operating Pan-Africa</span>
            </div>
          </div>

          {/* Navigation Columns (3 cols) */}
          {navColumns.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar: Social Icons & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <p>
            © {new Date().getFullYear()} MsmeBooks Technologies Ltd. All rights reserved. Built for Africa's growing MSME ecosystem.
          </p>

          {/* Social Media Icons (Prompt Mandate: LinkedIn, Facebook, Instagram, YouTube, X) */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#84CC16] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#84CC16] transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#84CC16] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#84CC16] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#84CC16] transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
