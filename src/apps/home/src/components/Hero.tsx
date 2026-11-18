import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
  CreditCard,
  Building,
  Layers,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
  onOpenVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
  onOpenVideo,
}) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'month' | 'quarter' | 'year'>('month');
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;

  // Baseline amounts in NGN
  const revenueBase = activeTab === 'month' ? 2845500 : activeTab === 'quarter' ? 8420000 : 34800000;
  const expenseBase = activeTab === 'month' ? 685300 : activeTab === 'quarter' ? 2040000 : 8120000;
  const profitBase = revenueBase - expenseBase;
  const newCustomers = activeTab === 'month' ? 128 : activeTab === 'quarter' ? 394 : 1420;
  const lowStock = 24;

  return (
    <section id="hero" className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#F0F6FF]/70 via-[#F8FAFD] to-white dark:from-[#0B132B]/90 dark:via-[#090E1A] dark:to-[#090E1A] transition-colors duration-200">
      {/* Background Decorative Atmosphere & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(#0866FF 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glowing aura */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/15 via-[#B7F000]/10 to-transparent dark:from-blue-600/15 dark:via-[#B7F000]/10 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/10 via-sky-300/15 to-transparent dark:from-blue-500/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Conversions */}
          <div className="lg:col-span-6 space-y-7">
            {/* African FinTech Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F000] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0866FF]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0866FF] dark:text-blue-300">
                {t.hero.badge}
              </span>
              <span className="text-[11px] font-semibold bg-[#B7F000] text-slate-900 px-2 py-0.5 rounded-full">
                {t.hero.year}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.12] font-black tracking-tight text-slate-950 dark:text-white font-display">
              {t.hero.title1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0866FF] via-[#0D5BDE] to-sky-400 dark:to-[#B7F000]">
                {t.hero.title2}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={onOpenStartFree}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-extrabold text-base text-white bg-[#0866FF] hover:bg-[#0752D4] shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>{t.hero.ctaStart}</span>
                <ArrowRight
                  className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                    isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''
                  }`}
                />
              </button>

              <button
                onClick={onOpenBookDemo}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
              >
                <Calendar className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000]" />
                <span>{t.hero.ctaDemo}</span>
              </button>

              <button
                onClick={onOpenVideo}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#B7F000]/30 flex items-center justify-center text-[#0866FF] dark:text-[#B7F000]">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>{t.hero.ctaTour}</span>
              </button>
            </div>

            {/* Microcopy */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7F000]"></span>
              <span>No complicated setup. Powerful tools. One connected platform.</span>
            </div>

            {/* Trust Indicators Strip */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span>3-minute setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span>14+ African countries</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Floating Dashboard UI & Interactive Metric Cards */}
          <div className="lg:col-span-6 relative">
            {/* Outer Perspective Wrapper */}
            <div className="relative mx-auto max-w-[620px] lg:max-w-none">
              {/* Soft glow under the 3D dashboard */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-[#B7F000]/15 to-blue-500/10 dark:from-blue-600/20 dark:via-[#B7F000]/20 rounded-3xl blur-2xl -z-10" />

              {/* Main Desktop Screen / Dashboard Frame */}
              <div className="bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden transform lg:-rotate-1 lg:hover:rotate-0 transition-transform duration-500">
                {/* Browser / App Header Bar */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-[#B7F000]" />
                    </div>
                    <div className="ml-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 text-[11px] text-slate-300 font-mono">
                      <ShieldCheck className="w-3 h-3 text-[#B7F000]" />
                      <span>app.msmebooks.africa/dashboard</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-500/20 text-[#B7F000] font-semibold text-[10px]">
                      LIVE SYNC
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#0866FF] flex items-center justify-center font-bold text-xs">
                      MB
                    </div>
                  </div>
                </div>

                {/* Dashboard Inner App Shell */}
                <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-[#0A101D]/70 space-y-4">
                  {/* Top Bar inside app */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                        Business Executive Summary
                      </h2>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Lagos Multi-Store &amp; Warehouse</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950/80 text-[#0866FF] dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                          All Branches
                        </span>
                      </div>
                    </div>

                    {/* Timeframe Filter Tabs */}
                    <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {(['month', 'quarter', 'year'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveTab(t)}
                          className={`px-3 py-1 rounded-md capitalize transition-all ${
                            activeTab === t
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                              : 'hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {t === 'month' ? 'This Month' : t === 'quarter' ? 'Q3' : 'Year 2026'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top 4 KPI Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Revenue */}
                    <div className="p-3 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                        <span>{t.hero.totalRevenue}</span>
                        <TrendingUp className="w-3.5 h-3.5 text-[#0866FF] dark:text-blue-400" />
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display mt-1">
                        {currency.format(revenueBase)}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                        <span className="px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          +24.8%
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">{t.hero.vsLastMonth}</span>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div className="p-3 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                        <span>{t.hero.operatingExpenses}</span>
                        <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display mt-1">
                        {currency.format(expenseBase)}
                      </div>
                      <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 mt-0.5">
                        <span className="px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                          -8.4%
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">cost control</span>
                      </div>
                    </div>

                    {/* Net Profit (Lemon Green Accent) */}
                    <div className="p-3 bg-gradient-to-br from-white to-[#F7FFE0] dark:from-[#131D31] dark:to-lime-950/30 rounded-xl border border-[#B7F000] shadow-xs relative overflow-hidden">
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>{t.hero.netProfit}</span>
                        <span className="w-2 h-2 rounded-full bg-[#B7F000]" />
                      </div>
                      <div className="text-base sm:text-lg font-black text-[#0A58D0] dark:text-[#B7F000] font-display mt-1">
                        {currency.format(profitBase)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                        <span className="bg-[#B7F000] text-slate-900 px-1 py-0.5 rounded text-[10px] font-bold">
                          {((profitBase / revenueBase) * 100).toFixed(1)}% {t.hero.margin}
                        </span>
                      </div>
                    </div>

                    {/* Cash Flow */}
                    <div className="p-3 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                        <span>Positive Cash Flow</span>
                        <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display mt-1">
                        {currency.format(profitBase * 0.94)}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        ● Live Bank Sync
                      </div>
                    </div>
                  </div>

                  {/* Visual Chart Area + Transactions Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Sales & Expense Chart Visualization */}
                    <div className="sm:col-span-7 bg-white dark:bg-[#131D31] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Sales Velocity &amp; Cash Flow
                        </span>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1 text-[#0866FF] dark:text-blue-400 font-semibold">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#0866FF]"></span> Sales
                          </span>
                          <span className="flex items-center gap-1 text-[#B7F000] font-semibold text-slate-700 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#B7F000]"></span> Net
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="h-28 flex items-end justify-between gap-1.5 sm:gap-2 pt-2 px-1">
                        {[
                          { day: 'Mon', h1: 55, h2: 38 },
                          { day: 'Tue', h1: 72, h2: 54 },
                          { day: 'Wed', h1: 60, h2: 45 },
                          { day: 'Thu', h1: 85, h2: 68 },
                          { day: 'Fri', h1: 96, h2: 78 },
                          { day: 'Sat', h1: 100, h2: 84 },
                          { day: 'Sun', h1: 68, h2: 52 },
                        ].map((bar, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                            <div className="w-full flex items-end justify-center gap-1 h-24">
                              <div
                                style={{ height: `${bar.h1}%` }}
                                className="w-2.5 sm:w-3.5 rounded-t-sm bg-[#0866FF] group-hover:bg-[#0752D4] transition-all"
                              />
                              <div
                                style={{ height: `${bar.h2}%` }}
                                className="w-2.5 sm:w-3.5 rounded-t-sm bg-[#B7F000] group-hover:brightness-95 transition-all"
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Transactions & Outstanding Invoices */}
                    <div className="sm:col-span-5 bg-white dark:bg-[#131D31] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recent Transactions</span>
                        <span className="text-[10px] text-[#0866FF] dark:text-[#B7F000] font-semibold">Live POS</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                              POS
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">Retail Counter 1</div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500">Card &bull; 2 mins ago</div>
                            </div>
                          </div>
                          <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
                            +{currency.format(42500)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                              INV
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">Apex Logistics Ltd</div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500">Transfer &bull; Paid</div>
                            </div>
                          </div>
                          <span className="font-bold text-[11px] text-[#0866FF] dark:text-blue-400">
                            +{currency.format(280000)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
                              PO
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">Supplier Restock</div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500">Inventory PO #4092</div>
                            </div>
                          </div>
                          <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                            -{currency.format(185000)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 text-center">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Automatic M-Pesa &amp; Paystack Reconciliation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 1: Low Stock Alert (Top Left) */}
              <div className="absolute -top-6 -left-6 sm:-left-8 hidden sm:flex items-center gap-3 p-3 bg-white/95 dark:bg-[#0E172A]/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700 animate-float-slow">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Re-Order Alert</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    24 items low at Ikeja branch
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 2: Cashier POS Checkout Success (Bottom Right) */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 hidden sm:flex items-center gap-3 p-3 bg-white/95 dark:bg-[#0E172A]/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700">
                <div className="w-10 h-10 rounded-xl bg-[#B7F000]/25 text-slate-950 dark:text-[#B7F000] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#B7F000]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    POS Receipt Issued
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    WhatsApp invoice sent instantly
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
