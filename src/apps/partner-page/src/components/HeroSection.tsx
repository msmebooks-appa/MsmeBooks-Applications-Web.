import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Play,
  Laptop,
  Smartphone,
  Tablet,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import { ASSET_IMAGES } from '../data/partnerData';

interface HeroSectionProps {
  onOpenApplyModal: () => void;
  onExploreProgram: () => void;
  onWatchVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenApplyModal,
  onExploreProgram,
  onWatchVideo
}) => {
  const [activeDeviceTab, setActiveDeviceTab] = useState<'laptop' | 'tablet' | 'mobile'>('laptop');
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'clients' | 'payouts'>('revenue');

  return (
    <section id="hero-section" className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF]/40">
      {/* Background Decorative Gradients & Grid Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#0F4C81]/15 to-[#84CC16]/20 blur-3xl opacity-70 animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-[#0F4C81]/10 blur-3xl opacity-60" />
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#0F4C81 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Trust Statement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-xs font-semibold text-[#0F4C81] mb-6 shadow-xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#84CC16] animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-[#84CC16] -ml-4" />
            <span>Built for Africa's growing MSME ecosystem</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">Over 44M+ MSMEs Digitalizing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0A192F] tracking-tight leading-[1.12] mb-6 font-display">
            Grow Your Business.{' '}
            <span className="text-[#0F4C81]">Grow Your Clients.</span>{' '}
            <span className="relative inline-block text-[#0A192F]">
              Grow Your{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C81] via-[#0284C7] to-[#65A30D]">
                  Recurring Revenue.
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2.5 text-[#84CC16]/80"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 9.5C80 2 210 2 297.5 9.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Supporting Headline */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8 font-normal">
            Partner with <strong className="font-semibold text-slate-900">MsmeBooks</strong> and empower African businesses with smarter accounting, business management, payments, inventory and digital business tools — while building a recurring revenue stream.
          </p>

          {/* Conversion Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
            <button
              id="hero-primary-cta-btn"
              onClick={onOpenApplyModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#0F4C81] to-[#1D4ED8] hover:from-[#0A3861] hover:to-[#1E3A8A] shadow-lg shadow-[#0F4C81]/30 hover:shadow-xl hover:shadow-[#0F4C81]/40 transition-all duration-200 active:scale-[0.98] group"
            >
              <Sparkles className="w-5 h-5 text-[#84CC16]" />
              <span>Become a MsmeBooks Partner</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-secondary-cta-btn"
              onClick={onExploreProgram}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all duration-200"
            >
              <span>Explore Partner Program</span>
              <TrendingUp className="w-4 h-4 text-[#0F4C81]" />
            </button>

            <button
              id="hero-video-preview-btn"
              onClick={onWatchVideo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-[#84CC16]/20 border border-[#84CC16]/40 flex items-center justify-center text-[#4D7C0F]">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>Watch 2-Min Story</span>
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
              15% to 40% Tiered Revenue Share
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
              Multi-Tenant African Client Console
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
              Zero Upfront Partnership Fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
              Local Currency Payouts (NGN, KES, GHS, ZAR)
            </span>
          </div>

        </div>

        {/* HERO VISUAL ECOSYSTEM: Laptop Dashboard + Smartphone/Tablet + Authentic Photography */}
        <div className="mt-14 relative max-w-6xl mx-auto">
          
          {/* Top Floating Badges (Prompt Mandate) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-20">
            
            {/* Badge 1: Recurring Commissions */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#65A30D]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Recurring Commissions</p>
                <p className="text-sm font-extrabold text-slate-900">Up to 40% Share</p>
              </div>
            </div>

            {/* Badge 2: Partner Dashboard */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0F4C81]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Partner Dashboard</p>
                <p className="text-sm font-extrabold text-slate-900">Multi-Tenant Console</p>
              </div>
            </div>

            {/* Badge 3: Business Growth */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Business Growth</p>
                <p className="text-sm font-extrabold text-slate-900">+3.4x Client Longevity</p>
              </div>
            </div>

            {/* Badge 4: Built for MSMEs */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Built for MSMEs</p>
                <p className="text-sm font-extrabold text-slate-900">Retail, Trade & Services</p>
              </div>
            </div>

          </div>

          {/* Main Dashboard Mockup Card */}
          <div className="relative rounded-2xl md:rounded-3xl bg-[#0A192F] p-3 sm:p-5 md:p-6 shadow-2xl border border-slate-800 ring-1 ring-white/10 overflow-hidden">
            
            {/* Window chrome header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline-block">
                  partner.msmebooks.com/console/overview
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                  <span>Pan-Africa Live Node (Lagos/Nairobi Hub)</span>
                </div>
                <span className="text-[#84CC16] font-semibold text-xs hidden md:inline">Tier: Platinum (40%)</span>
              </div>
            </div>

            {/* Inner Interactive SaaS Dashboard Display */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Live Analytics & Client Overview (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                
                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Active Businesses</span>
                    <div className="text-xl font-bold text-white mt-1">248</div>
                    <span className="text-[10px] text-[#84CC16] font-semibold flex items-center gap-0.5 mt-0.5">
                      ↑ +28 this month
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Monthly Commission</span>
                    <div className="text-xl font-bold text-[#84CC16] mt-1">₦874,500</div>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
                      Recurring monthly
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Total Paid Out</span>
                    <div className="text-xl font-bold text-sky-400 mt-1">₦12.45M</div>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
                      ✓ Direct Bank Deposit
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Client Retention</span>
                    <div className="text-xl font-bold text-white mt-1">96.8%</div>
                    <span className="text-[10px] text-[#84CC16] font-semibold mt-0.5 inline-block">
                      High stickiness
                    </span>
                  </div>
                </div>

                {/* Simulated Financial & Revenue Velocity Chart */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Cumulative Monthly Recurring Revenue (ARR/MRR)</h4>
                      <p className="text-xs text-slate-400">Portfolio subscription volume & partner earnings growth</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C81]"></span> Client Volume
                      <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] ml-2"></span> Partner Cut
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradientBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#0F4C81" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#84CC16" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#84CC16" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="500" y2="70" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="0" y1="110" x2="500" y2="110" stroke="#1E293B" strokeDasharray="3 3" />

                      {/* Area Blue (Total Volume) */}
                      <path
                        d="M 0 140 Q 80 120, 150 90 T 300 50 T 500 20 L 500 160 L 0 160 Z"
                        fill="url(#chartGradientBlue)"
                      />
                      <path
                        d="M 0 140 Q 80 120, 150 90 T 300 50 T 500 20"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="3"
                      />

                      {/* Area Lemon Green (Partner Commission) */}
                      <path
                        d="M 0 150 Q 80 140, 150 120 T 300 85 T 500 45 L 500 160 L 0 160 Z"
                        fill="url(#chartGradientGreen)"
                      />
                      <path
                        d="M 0 150 Q 80 140, 150 120 T 300 85 T 500 45"
                        fill="none"
                        stroke="#84CC16"
                        strokeWidth="3"
                      />

                      {/* Highlight Data Nodes */}
                      <circle cx="150" cy="120" r="4" fill="#84CC16" stroke="#0A192F" strokeWidth="2" />
                      <circle cx="300" cy="85" r="4" fill="#84CC16" stroke="#0A192F" strokeWidth="2" />
                      <circle cx="500" cy="45" r="6" fill="#84CC16" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>
                    <div className="absolute top-2 right-4 bg-slate-800/90 border border-[#84CC16]/50 rounded-lg px-2 py-1 text-[11px] text-white">
                      <span className="text-[#84CC16] font-bold">+148%</span> YoY Compound Commission
                    </div>
                  </div>

                  {/* Months bar */}
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1 font-mono">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>

                {/* Mini Multi-tenant Client Snippet */}
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-300">Live Client Roster (Recent Deployments)</span>
                    <span className="text-[#84CC16] hover:underline cursor-pointer">View all 248 clients →</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-white font-medium">Kafanchan Agro Mills Ltd (Nigeria)</span>
                      </div>
                      <span className="text-slate-400">Enterprise Growth</span>
                      <span className="text-[#84CC16] font-semibold">+₦18,000/mo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-white font-medium">Mombasa Logistics & Freight (Kenya)</span>
                      </div>
                      <span className="text-slate-400">Multi-Branch Pro</span>
                      <span className="text-[#84CC16] font-semibold">+KSh 3,000/mo</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: African Business Team Collaborating + Mobile Preview (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                
                {/* Photo card of real African consultants and accountants */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 group">
                  <img
                    src={ASSET_IMAGES.team}
                    alt="African business accountants and consultants collaborating on MsmeBooks platform"
                    referrerPolicy="no-referrer"
                    className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#84CC16] text-[#0A192F] mb-1">
                      Real African Professionals
                    </span>
                    <p className="text-xs text-white font-medium leading-snug">
                      Accountants, advisors and tech resellers collaborating with SME clients across African cities.
                    </p>
                  </div>
                </div>

                {/* Smartphone / Mobile App Highlight Box */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F4C81]/40 rounded-2xl p-4 border border-slate-700/80 text-white relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#84CC16]" />
                      <span className="text-xs font-bold">MsmeBooks Mobile & Tablet</span>
                    </div>
                    <span className="text-[10px] bg-[#84CC16]/20 text-[#84CC16] px-2 py-0.5 rounded-full font-medium">
                      Offline Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    Shopkeepers and SME clients issue invoices, scan barcodes, and accept payments even when internet fluctuates.
                  </p>
                  <div className="flex items-center justify-between text-xs bg-black/40 rounded-xl p-2.5 border border-white/5">
                    <span className="text-slate-400">Daily Sales Settled:</span>
                    <span className="font-mono text-[#84CC16] font-bold">₦342,800.00</span>
                  </div>
                </div>

                {/* Partner Network Visualization Note */}
                <div className="flex items-center justify-between bg-blue-950/60 rounded-xl p-3 border border-blue-900/60 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
                    <span>Partner Hub: 1,400+ Active African Nodes</span>
                  </div>
                  <span className="text-[11px] text-sky-400 font-semibold">Join Network →</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
