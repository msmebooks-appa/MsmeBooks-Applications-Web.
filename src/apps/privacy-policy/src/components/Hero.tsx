import React from 'react';
import {
  ShieldCheck,
  Printer,
  Download,
  Mail,
  Calendar,
  Lock,
  Server,
  Database,
  CheckCircle2,
  FileCheck,
  Coins,
  TrendingUp
} from 'lucide-react';
import { POLICY_METADATA } from '../data/privacyPolicyData';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface HeroProps {
  onDownloadPolicy: () => void;
  onPrintPolicy: () => void;
  onContactDpo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onDownloadPolicy,
  onPrintPolicy,
  onContactDpo,
}) => {
  const { t } = useLanguage();
  const { formatMoney, currencyMeta, exchangeRateNotice } = useCurrency();

  return (
    <section id="hero" className="relative overflow-hidden bg-white dark:bg-[#0D1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Background Architectural Grid & Subtle Geometric Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.07]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1455C0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Subtle brand glow behind text */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#1455C0]/5 dark:bg-[#1455C0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-64 h-64 bg-[#B8E62E]/10 dark:bg-[#B8E62E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Core Legal Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1455C0] dark:text-[#5B95FF]">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
                {t('hero.kicker', 'MsmeBooks Legal Governance')}
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">
                {t('hero.kickerSub', 'Enterprise Pan-African SaaS Trust Framework')}
              </span>
            </div>

            {/* Main Title & Supporting Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172B4D] dark:text-white tracking-tight text-balance leading-tight">
                {t('hero.title1', 'Your Privacy.')} <br />
                <span className="text-[#1455C0] dark:text-[#5B95FF]">{t('hero.title2', 'Our Responsibility.')}</span>
              </h1>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {t('hero.subtitle', 'MsmeBooks Privacy Policy')}
              </p>
            </div>

            {/* Hero Description */}
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-pretty">
              &ldquo;{t('hero.quote', 'At MsmeBooks, we understand that your business information is valuable. We are committed to transparency, responsible data practices and protecting the personal and business information entrusted to our platform.')}&rdquo;
            </p>

            {/* Metadata strip: Effective date, last updated, version */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#5B95FF]" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('hero.effective', 'Effective:')}</span>
                <span>{POLICY_METADATA.effectiveDate}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('hero.lastUpdated', 'Last Updated:')}</span>
                <span>{POLICY_METADATA.lastUpdatedDate}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('hero.version', 'Version:')}</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{POLICY_METADATA.version}</span>
              </div>
            </div>

            {/* Action Buttons: Download PDF, Print, Contact DPO */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onDownloadPolicy}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#B8E62E]" />
                <span>{t('hero.downloadBtn', 'Download Policy Document')}</span>
              </button>

              <button
                onClick={onPrintPolicy}
                className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131F37] hover:bg-slate-50 dark:hover:bg-[#182744] border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{t('hero.printBtn', 'Print Policy')}</span>
              </button>

              <button
                onClick={onContactDpo}
                className="px-4 py-2.5 text-xs font-medium text-[#1455C0] dark:text-[#5B95FF] hover:text-[#0f449e] dark:hover:text-white hover:bg-blue-50/70 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
                <span>{t('hero.contactDpoBtn', 'Contact DPO Office')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Security & Cloud Infrastructure Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-50 to-white dark:from-[#111C30] dark:to-[#0D1726] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              {/* Top brand accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1455C0] via-[#1455C0] to-[#B8E62E]" />

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1455C0]/10 dark:bg-[#1455C0]/30 flex items-center justify-center text-[#1455C0] dark:text-[#5B95FF]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#172B4D] dark:text-white">
                        {t('hero.trustGuarantee', 'Data Trust Guarantee')}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('hero.panAfricanSaas', 'Pan-African SaaS Architecture')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t('hero.verified', 'Verified')}
                  </span>
                </div>

                {/* 3 Pillars representation */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-white dark:bg-[#16233B] rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#1455C0]/5 dark:bg-[#1455C0]/20 text-[#1455C0] dark:text-[#5B95FF] shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t('hero.p1Title', 'Cryptographic Defense')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {t('hero.p1Desc', 'AES-256 ledger encryption at rest & TLS 1.3 protocol with strict forward secrecy in transit.')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#16233B] rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#1455C0]/5 dark:bg-[#1455C0]/20 text-[#1455C0] dark:text-[#5B95FF] shrink-0 mt-0.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t('hero.p2Title', 'Sole Customer Ownership')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {t('hero.p2Desc', 'You own 100% of your business data. Continuous export in CSV, Excel, and PDF formats.')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#16233B] rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#1455C0]/5 dark:bg-[#1455C0]/20 text-[#1455C0] dark:text-[#5B95FF] shrink-0 mt-0.5">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {t('hero.p3Title', 'Pan-African & Global Compliance')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {t('hero.p3Desc', 'Fully aligned with NDPA 2023 (Nigeria), POPIA (South Africa), Kenya DPA & GDPR.')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E]" />
                    {t('hero.noSale', 'No Selling of Personal Data')}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E]" />
                    {t('hero.zeroAi', 'Zero Model Training on PII')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Transaction & Revenue Governance Trust Strip */}
        <div className="mt-10 pt-6 border-t border-slate-200/90 dark:border-slate-800">
          <div className="bg-slate-50/90 dark:bg-[#111C30]/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1455C0]/10 dark:bg-[#1455C0]/30 text-[#1455C0] dark:text-[#5B95FF] flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('hero.metrics.title', 'Pan-African SaaS Transaction & Fiscal Governance Metrics')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('hero.metrics.desc', 'Live financial figures dynamically converted to your selected reporting currency')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto text-[11px] font-mono bg-white dark:bg-[#16233B] border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                <span className="text-sm">{currencyMeta.flag}</span>
                <span className="font-bold text-[#1455C0] dark:text-[#B8E62E]">{currencyMeta.code}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400">{exchangeRateNotice}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Metric 1: Processed Volume */}
              <div className="p-3 bg-white dark:bg-[#16233B] border border-slate-200/70 dark:border-slate-700/60 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#1455C0] dark:text-[#B8E62E]" />
                  <span>{t('hero.metrics.msmeVolume', 'MSME Transactions Handled')}</span>
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-[#172B4D] dark:text-white font-mono tracking-tight">
                  {formatMoney(50_000_000_000, { compact: true })}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.msmeBase', 'Base: ₦50B Across 14 Markets')}
                </p>
              </div>

              {/* Metric 2: Daily Reconciled Volume */}
              <div className="p-3 bg-white dark:bg-[#16233B] border border-slate-200/70 dark:border-slate-700/60 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.dailyFlow', 'Daily Reconciled Flow')}
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-[#172B4D] dark:text-white font-mono tracking-tight">
                  {formatMoney(420_000_000, { compact: true })}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.dailyBase', 'Over ₦420M Reconciled Daily')}
                </p>
              </div>

              {/* Metric 3: Statutory Penalty Shield */}
              <div className="p-3 bg-white dark:bg-[#16233B] border border-slate-200/70 dark:border-slate-700/60 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.ndpaFine', 'NDPA Statutory Fine Cap')}
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-amber-700 dark:text-amber-400 font-mono tracking-tight">
                  {formatMoney(10_000_000)}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.ndpaBase', 'Statutory Max: ₦10M (Sec 48)')}
                </p>
              </div>

              {/* Metric 4: Standard Access Request Fee */}
              <div className="p-3 bg-white dark:bg-[#16233B] border border-slate-200/70 dark:border-slate-700/60 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.rightsFee', 'Data Subject Rights Fee')}
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tracking-tight">
                  Free
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('hero.metrics.freeSar', 'Free SAR Filings for Users')} (Cap: {formatMoney(5_000)})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
