import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Receipt,
  Boxes,
  CreditCard,
  Building2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Search,
  Bell,
  RefreshCw,
  Users,
  UploadCloud,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Send,
  Smartphone,
  Filter,
  QrCode,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { BatchImportModal, ImportedContact } from './BatchImportModal';

interface HeroSectionProps {
  currency: Currency;
  onOpenTrialModal: () => void;
  onOpenDemoModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currency,
  onOpenTrialModal,
  onOpenDemoModal,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-triggered 3D parallax effects for mockup and floating callouts
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const mockupRotateX = useTransform(scrollYProgress, [0, 0.7, 1], [0, 4, 8]);
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const floatingBadgeLeftY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const floatingBadgeRightY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const [activeTab, setActiveTab] = useState<'accounting' | 'pos' | 'inventory' | 'portal' | 'analytics'>('portal');
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'Customer' | 'Supplier'>('all');
  const [importNotification, setImportNotification] = useState<string | null>(null);
  
  const [contactsList, setContactsList] = useState<ImportedContact[]>([
    {
      id: 'init-1',
      name: 'Alhaji Musa Dangote',
      company: 'Kano Wholesale Textiles & Prints',
      type: 'Customer',
      email: 'musa.dangote@kanotextiles.ng',
      phone: '+234 803 123 4567',
      taxId: '10928374-0001',
      creditLimit: 500000,
      openingBalance: 420000,
      city: 'Kano',
      portalStatus: 'Active',
    },
    {
      id: 'init-2',
      name: 'Chinedu Okafor',
      company: 'Okafor & Sons Hardware Ltd',
      type: 'Supplier',
      email: 'chinedu@okaforhardware.com',
      phone: '+234 802 987 6543',
      taxId: '20394857-0001',
      creditLimit: 1500000,
      openingBalance: 1250000,
      city: 'Lagos',
      portalStatus: 'Active',
    },
    {
      id: 'init-3',
      name: 'Folake Adeyemi',
      company: 'Lekki Luxe Interiors & Drapes',
      type: 'Customer',
      email: 'folake@lekkiluxe.com',
      phone: '+234 809 112 2334',
      taxId: '50697887-0001',
      creditLimit: 1000000,
      openingBalance: 185000,
      city: 'Lagos',
      portalStatus: 'Active',
    },
    {
      id: 'init-4',
      name: 'Emeka Eze',
      company: 'Eze Logistics & Haulage',
      type: 'Supplier',
      email: 'billing@ezelogistics.ng',
      phone: '+234 807 777 8899',
      taxId: '40596877-0001',
      creditLimit: 2000000,
      openingBalance: 340000,
      city: 'Apapa',
      portalStatus: 'Active',
    },
    {
      id: 'init-5',
      name: 'Hajiya Aisha Garba',
      company: 'Arewa Fabric Boutiques',
      type: 'Customer',
      email: 'aisha@arewaboutique.ng',
      phone: '+234 806 777 9900',
      taxId: '60789012-0001',
      creditLimit: 750000,
      openingBalance: 560000,
      city: 'Kaduna',
      portalStatus: 'Active',
    },
  ]);

  const { t } = useLanguage();

  const currInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
  const currSymbol = currInfo.symbol;

  const formatAmount = (naira: number) => {
    return formatCurrency(naira, currency);
  };

  const handleImportComplete = (newContacts: ImportedContact[]) => {
    setContactsList((prev) => {
      // Filter out duplicates by email or phone
      const existingEmails = new Set(prev.map((c) => c.email.toLowerCase()));
      const incomingUnique = newContacts.filter((c) => !existingEmails.has(c.email.toLowerCase()));
      return [...incomingUnique, ...prev];
    });
    setImportNotification(
      `Batch Ingestion Complete: ${newContacts.length} contacts onboarded! Self-service portal links and ledgers activated.`
    );
    setActiveTab('portal');
  };

  const filteredContacts = contactsList.filter((c) => {
    const matchesFilter = contactFilter === 'all' || c.type === contactFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.taxId.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(contactSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section ref={containerRef} className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white dark:from-[#050B14] dark:via-[#070F1B] dark:to-[#070F1B] transition-colors duration-300">
      {/* Decorative ambient subtle background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-3xl"></div>
        <div className="absolute top-16 right-12 w-80 h-80 rounded-full bg-lime-300/30 dark:bg-lime-500/15 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Micro-badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D1C30] border border-blue-200/80 dark:border-blue-900/60 shadow-xs text-xs font-semibold text-[#0A4FD5] dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse"></span>
            <span>{t.hero.badge}</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Accounting • POS • Inventory</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B192C] dark:text-white leading-[1.15]">
            {t.hero.titlePart1}{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0A4FD5] to-[#0E7490] dark:from-blue-400 dark:to-cyan-300">
              {t.hero.titleHighlight}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#84CC16] opacity-70"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            {t.hero.titlePart2 ? ` ${t.hero.titlePart2}` : ''}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Trust Messaging Checklist */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
              <span>{t.common.instantSetup}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
              <span>{t.hero.livePosBadge}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
              <span>{t.pricing.moneyBackGuarantee}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
              <span>{t.common.cancelAnytime}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16] shrink-0" />
              <span>{t.africanFocus.badge}</span>
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenTrialModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0A4FD5] hover:bg-[#07389B] text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>{t.common.startFreeTrial}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#0D1C30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-base px-8 py-4 rounded-xl shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
            >
              <span>{t.common.talkToSales}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">| {t.common.bookDemo}</span>
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.common.noCardRequired} • {t.common.instantSetup} • {t.common.cancelAnytime}
          </div>
        </div>

        {/* Interactive High-Fidelity SaaS Dashboard Preview with Scroll Parallax */}
        <div className="mt-12 lg:mt-16 relative max-w-5xl mx-auto" style={{ perspective: 1200 }}>
          {/* Floating Parallax Accents */}
          <motion.div
            style={{ y: floatingBadgeLeftY }}
            className="hidden xl:flex absolute -left-12 top-1/4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#0D1C30]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-xl text-xs font-bold text-slate-800 dark:text-slate-100 pointer-events-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>⚡ Offline POS Sync</span>
            <span className="text-slate-400 font-normal">| Zero Loss</span>
          </motion.div>

          <motion.div
            style={{ y: floatingBadgeRightY }}
            className="hidden xl:flex absolute -right-12 top-1/3 z-20 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#0D1C30]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-xl text-xs font-bold text-slate-800 dark:text-slate-100 pointer-events-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
            <span>📈 +31.8% Net Margin</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">Audit Ready</span>
          </motion.div>

          <motion.div
            style={{
              y: mockupY,
              rotateX: mockupRotateX,
              scale: mockupScale,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Glass frame wrapper */}
            <div className="rounded-2xl lg:rounded-3xl p-2 sm:p-3.5 bg-gradient-to-b from-blue-200/50 via-white to-slate-200/60 dark:from-blue-900/30 dark:via-[#091525] dark:to-slate-900/40 border border-white/80 dark:border-slate-800 shadow-2xl shadow-blue-900/10 dark:shadow-black/40 backdrop-blur-xl">
              <div className="bg-white dark:bg-[#0B192C] rounded-xl lg:rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-inner">
              
              {/* Dashboard Window Header Bar */}
              <div className="bg-slate-900 dark:bg-[#050B14] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                    MsmeBooks Cloud OS v4.2 • Zaria Fabrics Ltd (Lagos Branch)
                  </span>
                </div>

                {/* Sub-tabs for Dashboard Modules */}
                <div className="flex items-center gap-1 bg-slate-800/90 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => setActiveTab('accounting')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'accounting' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Accounting
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pos')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'pos' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    POS Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'inventory' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('portal')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === 'portal' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Customer/Supplier Portal</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-lime-400 text-slate-950 font-black rounded-full uppercase tracking-wider">
                      Batch Import
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'analytics' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Analytics & AI
                  </button>
                </div>
              </div>

              {/* Dashboard Content Body */}
              <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-[#070F1B]/70">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="bg-white dark:bg-[#0D1C30] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Gross Sales (MTD)</span>
                      <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[11px] font-bold flex items-center">
                        +23.4% <TrendingUp className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-[#0B192C] dark:text-white mt-1.5">
                      {formatAmount(18420500)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span>Across 3 Outlets</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Synced</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0D1C30] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Net Cash Profit</span>
                      <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        31.8% margin
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-[#0A4FD5] dark:text-blue-400 mt-1.5">
                      {formatAmount(5857700)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Operating expenses: {formatAmount(2410000)}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0D1C30] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Inventory Asset Value</span>
                      <span className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        98.4% in stock
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-[#0B192C] dark:text-white mt-1.5">
                      {formatAmount(34800000)}
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      4 items below reorder point
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0D1C30] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>VAT & WHT Accrual</span>
                      <span className="text-lime-800 dark:text-lime-300 bg-lime-100 dark:bg-lime-950/60 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        Audit Ready
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-[#0B192C] dark:text-white mt-1.5">
                      {formatAmount(1381500)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Filing scheduled for 21st
                    </div>
                  </div>
                </div>

                {/* Dynamic Tab Panel */}
                <div className="bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
                  {activeTab === 'accounting' && (
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions & Auto-Reconciled Ledgers</h4>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Bank Feed: GTBank Corporate • Stanbic IBTC</span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#091524] hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                              IN
                            </span>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">Invoice #INV-2026-094 — Biltmore Construction Ltd</div>
                              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Direct Transfer • Ref: GTB-883921 • Withholding Tax deducted (5%)</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-700 dark:text-emerald-400">+{formatAmount(1450000)}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">Today, 2:15 PM</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#091524] hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                              POS
                            </span>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">Lekki Terminal 02 — Batch POS Checkout (18 items)</div>
                              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Paystack POS Card Reader • Cashier: Blessing N.</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-800 dark:text-slate-200">+{formatAmount(348500)}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">Today, 1:40 PM</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#091524] hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold flex items-center justify-center text-[10px]">
                              EXP
                            </span>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">Diesel Consignment for Backup Generator (500L)</div>
                              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Category: Power & Utilities • Ikeja Main Depot</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-rose-600 dark:text-rose-400">-{formatAmount(475000)}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">Today, 10:15 AM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'pos' && (
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#84CC16]" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cloud Point of Sale (POS) — Online & Offline Active</h4>
                        </div>
                        <span className="text-xs bg-lime-100 dark:bg-lime-950 text-lime-900 dark:text-lime-300 font-bold px-2 py-0.5 rounded">
                          Register Active #01
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400">Active Order</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">Order #88391 • Walk-in Customer</div>
                          <div className="mt-2 text-slate-600 dark:text-slate-300 space-y-1">
                            <div className="flex justify-between">
                              <span>3x Voile Lace Fabric</span>
                              <span className="font-semibold">{formatAmount(45000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>1x Silk Damask Roll</span>
                              <span className="font-semibold">{formatAmount(28000)}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                            <span>Total Payable</span>
                            <span className="text-[#0A4FD5] dark:text-blue-400">{formatAmount(73000)}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400">Payment Modes Accepted</div>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center justify-between p-1.5 bg-white dark:bg-[#0D1C30] rounded border border-blue-200 dark:border-blue-900/60">
                              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <QrCode className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                                <span>Scan to Pay QR (NQR / Paystack / Flutterwave / OPay / PalmPay)</span>
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-[11px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live QR
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-white dark:bg-[#0D1C30] rounded border border-slate-200 dark:border-slate-700">
                              <span className="font-medium text-slate-800 dark:text-slate-200">Direct Bank Transfer (Instant)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-white dark:bg-[#0D1C30] rounded border border-slate-200 dark:border-slate-700">
                              <span className="font-medium text-slate-800 dark:text-slate-200">Card POS / Paystack / Flutterwave</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-white dark:bg-[#0D1C30] rounded border border-slate-200 dark:border-slate-700">
                              <span className="font-medium text-slate-800 dark:text-slate-200">Cash & Split Tender</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/60">
                          <div className="text-[#0A4FD5] dark:text-blue-400 font-bold">Offline Resilience</div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 leading-relaxed">
                            If internet drops during peak shopping hours, sales cashiers continue issuing receipts without delay. Encrypted sales queues auto-sync to your central ledger once network restores.
                          </p>
                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0A4FD5] dark:text-blue-400 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Zero Transaction Loss
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'inventory' && (
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Depot Inventory & Stock Transfers</h4>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Stock Valuation: FIFO Compliant</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>Inter-Branch Stock Transfer in Transit</span>
                            <span className="text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 rounded text-[10px]">In Dispatch</span>
                          </div>
                          <div className="mt-2 text-slate-600 dark:text-slate-300 space-y-1">
                            <div className="flex justify-between">
                              <span>Origin Warehouse:</span>
                              <span className="font-medium text-slate-900 dark:text-white">Ikeja Central Depot</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Destination Outlet:</span>
                              <span className="font-medium text-slate-900 dark:text-white">Victoria Island Boutique</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Consignment:</span>
                              <span className="font-semibold text-slate-900 dark:text-white">45 Cartons Fabrics (Value: {formatAmount(1850000)})</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/60">
                          <div className="flex justify-between font-bold text-amber-900 dark:text-amber-300">
                            <span>Automated Reorder Alerts</span>
                            <span className="text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.2 rounded text-[10px]">Action Required</span>
                          </div>
                          <div className="mt-2 text-slate-700 dark:text-slate-300 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span>Swiss Cotton Jacquard White</span>
                              <span className="text-red-600 dark:text-red-400 font-bold">5 rolls remaining (Reorder at 20)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Gold Brocade Thread 500m</span>
                              <span className="text-amber-700 dark:text-amber-400 font-bold">12 spools remaining (Reorder at 30)</span>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-amber-200 dark:border-amber-900/50 text-slate-600 dark:text-slate-400">
                              One-click PO generation pre-filled for primary vendor.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'portal' && (
                    <div>
                      {/* Portal Header & Controls Bar */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              Customer & Supplier Self-Service Portal
                            </h4>
                            <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                              Growth & Above
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Clients view statements & pay online. Ingest contacts instantly with bulk CSV/Excel onboarding.
                          </p>
                        </div>

                        {/* Action Buttons: Batch Import & Download Template */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const sampleCsv = `Name,Company,Type,Email,Phone,Tax_ID_TIN,Credit_Limit_NGN,Opening_Balance_NGN,City\nAmina Bello,Kano Wholesale Textiles,Customer,amina@kanotextiles.ng,+2348031234567,10928374-0001,500000,120000,Kano\nChinedu Okafor,Okafor & Sons Hardware Ltd,Supplier,chinedu@okaforhardware.com,+2348029876543,20394857-0001,1500000,0,Lagos\nFatima Danjuma,Savannah Agro Millers,Customer,fatima@savannahmillers.com,+2348055551234,30495867-0001,250000,45000,Kaduna\nEmeka Eze,Eze Logistics & Haulage,Supplier,billing@ezelogistics.ng,+2348077778899,40596877-0001,2000000,380000,Lagos`;
                              const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', 'MsmeBooks_Contacts_Template.csv');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1C30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Download pre-formatted CSV template"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>CSV/Excel Template</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsBatchImportOpen(true)}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0A4FD5] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group"
                          >
                            <UploadCloud className="w-4 h-4 text-lime-300 group-hover:scale-110 transition-transform" />
                            <span>Batch Import Customers</span>
                            <span className="bg-lime-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                              +CSV
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Notification Banner when newly imported */}
                      {importNotification && (
                        <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-semibold">{importNotification}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setImportNotification(null)}
                            className="text-emerald-600 hover:text-emerald-800 font-bold ml-2 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Metric Highlights */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5 text-xs">
                        <div className="p-2.5 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200/80 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Active Contacts</div>
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {contactsList.length} Contacts
                          </div>
                          <div className="text-[10px] text-emerald-600 font-medium">100% Portal Enabled</div>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200/80 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Outstanding Receivables</div>
                          <div className="text-sm sm:text-base font-extrabold text-[#0A4FD5] dark:text-blue-400 mt-0.5">
                            {formatAmount(
                              contactsList
                                .filter((c) => c.type === 'Customer')
                                .reduce((sum, c) => sum + c.openingBalance, 0)
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">Auto-statement delivery</div>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200/80 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">WhatsApp Portals</div>
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            Active Sync
                          </div>
                          <div className="text-[10px] text-emerald-600 font-medium">1-Click Statements</div>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-[#091524] rounded-lg border border-slate-200/80 dark:border-slate-800">
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Bulk Import Status</div>
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Ready
                          </div>
                          <div
                            className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline"
                            onClick={() => setIsBatchImportOpen(true)}
                          >
                            Upload CSV / Excel →
                          </div>
                        </div>
                      </div>

                      {/* Search & Filter Bar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setContactFilter('all')}
                            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                              contactFilter === 'all'
                                ? 'bg-[#0A4FD5] text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            All ({contactsList.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactFilter('Customer')}
                            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                              contactFilter === 'Customer'
                                ? 'bg-[#0A4FD5] text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            Customers ({contactsList.filter((c) => c.type === 'Customer').length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactFilter('Supplier')}
                            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                              contactFilter === 'Supplier'
                                ? 'bg-[#0A4FD5] text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            Suppliers ({contactsList.filter((c) => c.type === 'Supplier').length})
                          </button>
                        </div>

                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            placeholder="Search customer, company or TIN..."
                            className="w-full sm:w-64 pl-8 pr-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091524] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A4FD5]"
                          />
                        </div>
                      </div>

                      {/* Contacts Directory Table */}
                      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-[#091524] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="p-2.5">Contact & Company</th>
                              <th className="p-2.5">Type</th>
                              <th className="p-2.5">Phone / WhatsApp</th>
                              <th className="p-2.5">TIN (Tax ID)</th>
                              <th className="p-2.5 text-right">Balance Due</th>
                              <th className="p-2.5 text-center">Portal Access</th>
                              <th className="p-2.5 text-right">Self-Service Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                            {filteredContacts.map((contact) => (
                              <tr key={contact.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-2.5 whitespace-nowrap">
                                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                                      {contact.name.charAt(0)}
                                    </span>
                                    {contact.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-7.5">{contact.company}</div>
                                </td>
                                <td className="p-2.5 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                      contact.type === 'Customer'
                                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                                        : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                                    }`}
                                  >
                                    {contact.type}
                                  </span>
                                </td>
                                <td className="p-2.5 whitespace-nowrap text-[11px]">
                                  <div className="font-medium">{contact.phone}</div>
                                  <div className="text-slate-400">{contact.city}</div>
                                </td>
                                <td className="p-2.5 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                                  {contact.taxId}
                                </td>
                                <td className="p-2.5 whitespace-nowrap text-right font-bold">
                                  {contact.openingBalance > 0 ? (
                                    <span className="text-amber-600 dark:text-amber-400">
                                      {formatAmount(contact.openingBalance)}
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 font-normal">₦0 (Cleared)</span>
                                  )}
                                </td>
                                <td className="p-2.5 whitespace-nowrap text-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Portal
                                  </span>
                                </td>
                                <td className="p-2.5 whitespace-nowrap text-right">
                                  <button
                                    type="button"
                                    onClick={() => alert(`Client portal token generated for ${contact.name}. Link: https://portal.msmebooks.ng/client/${contact.id}`)}
                                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-[#0A4FD5] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    Portal Link <ExternalLink className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Bottom Rapid Import Callout */}
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50/80 via-white to-lime-50/80 dark:from-[#091524] dark:via-[#0B192C] dark:to-lime-950/20 rounded-xl border border-blue-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-300">
                            <strong>Migrating from QuickBooks, Sage, or Excel?</strong> Ingest all existing customers, suppliers, and beginning balances in one click using CSV/Excel.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsBatchImportOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#0B192C] dark:bg-slate-800 text-lime-300 hover:text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" /> Launch Batch Importer
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">MsmeBooks AI Executive Summary</h4>
                        </div>
                        <span className="text-xs bg-lime-100 dark:bg-lime-950 text-lime-900 dark:text-lime-300 font-bold px-2 py-0.5 rounded">
                          Live AI Intelligence
                        </span>
                      </div>
                      <div className="p-3.5 bg-gradient-to-r from-blue-50/70 to-lime-50/70 dark:from-blue-950/50 dark:to-lime-950/30 rounded-xl border border-blue-200/70 dark:border-blue-800/50 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#0A4FD5] text-white flex items-center justify-center shrink-0 text-xs font-black">
                            AI
                          </div>
                          <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              "Good afternoon, Amina. Your Lagos branch reached its weekly target 2 days early (+18%)."
                            </p>
                            <p>
                              • High-Margin Insight: Premium Brocade fabric is your top profit earner this week (58% margin).
                              <br />
                              • Cashflow Forecast: Expecting {formatAmount(3400000)} in client invoice settlements before Friday, sufficient to cover next week's warehouse supplier consignment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Micro-bar footer */}
              <div className="bg-slate-100/80 dark:bg-[#081322] px-4 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                ⚡ Fully synchronized across Web, Android POS Tablets, and Mobile Apps with 256-bit encryption.
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      </div>

      {/* Batch Import Customers & Suppliers Modal */}
      <BatchImportModal
        isOpen={isBatchImportOpen}
        onClose={() => setIsBatchImportOpen(false)}
        currency={currency}
        onImportComplete={handleImportComplete}
      />
    </section>
  );
};
