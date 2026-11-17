import React from 'react';
import { Check, ShieldCheck, Globe, Building2, Sparkles } from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { SecurityTrustSection } from '../common/SecurityTrustSection';
import { SecurityDetailsPopover } from '../common/SecurityDetailsPopover';

export interface AuthLayoutProps {
  children: React.ReactNode;
  visualType?: 'supermarket' | 'distribution' | 'pharmacy' | 'agriculture' | 'security';
  heroHeadline?: string;
  heroCopy?: string;
  benefits?: string[];
  activeQuote?: {
    text: string;
    author: string;
    title: string;
    company: string;
    location: string;
  };
}

const VISUAL_PRESETS = {
  supermarket: {
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=80',
    headline: 'Unified Retail & Supermarket Accounting.',
    copy: 'POS, barcode checkout, multi-aisle inventory and cashier shifts—synchronized across all your stores.',
    quote: {
      text: 'MsmeBooks unified our 3 supermarket branches in Lagos and cut daily register reconciliation time by 80%.',
      author: 'Kemi Adeyemi',
      title: 'Managing Director',
      company: 'ABC Supermarket Ltd',
      location: 'Victoria Island, Lagos',
    },
  },
  distribution: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    headline: 'High-Velocity Wholesale & Distribution Control.',
    copy: 'Manage purchase orders, bulk pallet dispatch, multi-depot stock transfers, and credit terms seamlessly.',
    quote: {
      text: 'Our FMCG distribution network across Abuja and Kano runs on MsmeBooks with zero missing stock discrepancies.',
      author: 'Alhaji Ibrahim Danjuma',
      title: 'Chief Operations Officer',
      company: 'XYZ Distribution Ltd',
      location: 'Wuse 2, Abuja',
    },
  },
  pharmacy: {
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1600&q=80',
    headline: 'Compliant Healthcare & Pharmacy Operations.',
    copy: 'Batch expiry tracking, prescription POS, supplier invoices, and audit-ready financial statements.',
    quote: {
      text: 'Batch tracking and POS invoicing are rock solid. MsmeBooks gives us confidence during every regulatory audit.',
      author: 'Dr. Ngozi Eze',
      title: 'Superintendent Pharmacist',
      company: 'Prime Health Pharmacy Ltd',
      location: 'GRA, Port Harcourt',
    },
  },
  agriculture: {
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=80',
    headline: 'Agri-Business & Food Processing Operations.',
    copy: 'Track harvest procurement, processing costs, warehouse silos, and direct wholesale trade sales.',
    quote: {
      text: 'From grain intake in Kano to packaged distribution nationwide, MsmeBooks keeps our financial health crystal clear.',
      author: 'Mansur Garba',
      title: 'Finance Director',
      company: 'Sahel Agri-Foods Ltd',
      location: 'Bompai, Kano',
    },
  },
  security: {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80',
    headline: 'Enterprise Security & Multi-Tenant Governance.',
    copy: 'Two-factor cryptographic verification, role-based branch privileges, and continuous audit trails.',
    quote: {
      text: 'Every financial entry is tamper-proof and role-governed. It feels like an enterprise banking core for MSMEs.',
      author: 'Tunde Balogun',
      title: 'Managing Partner',
      company: 'Balogun Agro-Ventures Ltd',
      location: 'Ibadan, Oyo State',
    },
  },
};

export const AuthCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`w-full max-w-[460px] mx-auto bg-white dark:bg-[#0A1F36] rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-all ${className}`}
    >
      {children}
    </div>
  );
};


export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  visualType = 'supermarket',
  heroHeadline,
  heroCopy,
  benefits = [
    'Smart Accounting & Financial Management',
    'Powerful POS & Inventory Control',
    'Multi-Branch Business Management',
  ],
  activeQuote,
}) => {
  const preset = VISUAL_PRESETS[visualType] || VISUAL_PRESETS.supermarket;
  const finalHeadline = heroHeadline || preset.headline;
  const finalCopy = heroCopy || preset.copy;
  const finalQuote = activeQuote || preset.quote;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* LEFT COLUMN: African Business Visual Showcase (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between overflow-hidden bg-[#072644] text-white p-8 xl:p-14">
        {/* Background Image Overlay with Professional African Business Context */}
        <div className="absolute inset-0 z-0">
          <img
            src={preset.image}
            alt="African Business Visual"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Deep MsmeBooks Blue + Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#072644] via-[#0A365C]/90 to-[#0F4C81]/80" />
          {/* Subtle geometric pattern accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#84CC16_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* Top Header / Brand Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <MsmeBooksLogo variant="dark" size="md" showTagline={false} />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
            <span>Built for African Businesses. Ready for the World.</span>
          </div>
        </div>

        {/* Middle Hero Content */}
        <div className="relative z-10 max-w-xl my-auto py-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#9AE61C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>African Business Operating System</span>
          </div>

          <h1 className="text-3xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {finalHeadline}
          </h1>

          <p className="text-base xl:text-lg text-slate-200 leading-relaxed font-normal">
            {finalCopy}
          </p>

          {/* Benefits with Lemon Green Checkmarks */}
          <div className="pt-2 space-y-3.5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#84CC16]/20 border border-[#84CC16] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#9AE61C] stroke-[3]" />
                </div>
                <span className="text-sm xl:text-base font-semibold text-slate-100">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Live African Entrepreneur Social Proof Quote Card */}
          <div className="pt-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-lg space-y-3">
              <p className="text-sm italic text-slate-200 leading-relaxed">
                "{finalQuote.text}"
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                <div>
                  <span className="font-bold text-white block">{finalQuote.author}</span>
                  <span className="text-slate-300">
                    {finalQuote.title}, {finalQuote.company}
                  </span>
                </div>
                <span className="text-[#9AE61C] font-semibold">{finalQuote.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refactored Security Trust Section with Interactive Details Popover */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-6 border-t border-white/10 gap-3">
          <SecurityTrustSection
            variant="sidebar"
            text="Bank-grade 256-bit encryption"
          />
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] flex-shrink-0">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Serving 18+ African nations</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Card Area */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto bg-[#F8FAFC] dark:bg-[#071727] transition-colors">
        {/* Top Header / Theme Toggle Bar */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="lg:hidden">
            <MsmeBooksLogo size="sm" showTagline={false} />
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
            <span>Secure Cloud Session</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SecurityDetailsPopover
                variant="badge"
                triggerText="Security Details"
              />
            </div>
            <ThemeToggle variant="icon" />
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="my-auto flex items-center justify-center py-4">{children}</div>

        {/* Shared Bottom Footer */}
        <div className="pt-6 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#privacy" className="hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <SecurityDetailsPopover
              variant="link"
              triggerText="Security & Compliance"
            />
            <span>•</span>
            <a href="#help" className="hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors">
              Support Center
            </a>
          </div>
          <p>© {new Date().getFullYear()} MsmeBooks Inc. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
};
