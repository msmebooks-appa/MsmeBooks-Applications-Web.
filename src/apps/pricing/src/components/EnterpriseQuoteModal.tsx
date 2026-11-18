import React, { useState } from 'react';
import {
  X,
  Building,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  Sparkles,
  Server,
  Database,
  Layers,
  ArrowRight,
  MessageCircle,
  Copy,
  Clock,
  Briefcase,
  Globe,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { generateQuoteDocument } from '../utils/generateQuotePdf';
import { SUPPORTED_CURRENCIES } from '../utils/currency';

export interface EnterpriseBulkConfig {
  seats: number;
  branches: number;
  warehouses: number;
  addons: {
    dedicatedDb: boolean;
    erpConnector: boolean;
    prioritySla: boolean;
    whiteGloveMigration: boolean;
    privateVpc: boolean;
    firsTaxEngine: boolean;
  };
  billingPeriod: 'monthly' | 'yearly';
  monthlyBaseNgn: number;
  discountPercent: number;
  monthlyTotalNgn: number;
  periodTotalNgn: number;
  annualSavingsNgn: number;
}

interface EnterpriseQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  config: EnterpriseBulkConfig;
}

export const EnterpriseQuoteModal: React.FC<EnterpriseQuoteModalProps> = ({
  isOpen,
  onClose,
  currency,
  config,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [industry, setIndustry] = useState('Retail & Supermarket Chain');
  const [timeline, setTimeline] = useState('Immediate (< 30 days)');
  const [legacySystem, setLegacySystem] = useState('SAP / Oracle ERP');
  const [specialNotes, setSpecialNotes] = useState('');
  const [taxId, setTaxId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState('');
  const [isCopiedRef, setIsCopiedRef] = useState(false);

  if (!isOpen) return null;

  const quoteRefGenerated = quoteReference || `MSME-ENT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownloadPdf = () => {
    const activeCurrInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
    const formatFn = (amountNgn: number) => formatCurrency(amountNgn, currency);

    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 30);

    const formatDateStr = (d: Date) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Build cart items matching the official quotation generator schema
    const activeAddonsList = [
      config.addons.dedicatedDb && 'Isolated Dedicated Database Cluster Node',
      config.addons.erpConnector && 'Custom ERP Bidirectional Connector (SAP/Oracle/Dynamics)',
      config.addons.prioritySla && '24/7 Mission-Critical SLA with 15-min Response & Dedicated TAM',
      config.addons.whiteGloveMigration && 'White-glove Data Migration & Executive Staff Training',
      config.addons.privateVpc && 'Private VPC / On-Premise Air-gapped Hybrid Deployment',
      config.addons.firsTaxEngine && 'FIRS Electronic Invoicing & African Multi-Tax Stamping Engine',
    ].filter(Boolean) as string[];

    const basePlanPriceNgn = config.periodTotalNgn;
    const vatRate = 7.5;
    const vatAmountNgn = Math.round(basePlanPriceNgn * (vatRate / 100));
    const grandTotalPayableNgn = basePlanPriceNgn + vatAmountNgn;

    generateQuoteDocument({
      quoteNumber: quoteRefGenerated,
      date: formatDateStr(today),
      validUntil: formatDateStr(expiryDate),
      customer: {
        businessName: businessName || 'Enterprise Corporate Client',
        contactName: contactName ? `${contactName} (${jobTitle || 'Executive'})` : 'Procurement Director',
        email: email || 'procurement@enterprise.com',
        phone: phone || '+234 915 848 2622',
        address: `${industry} Division`,
        country: country || 'Nigeria',
        taxId: taxId || 'FIRS-TIN-PENDING',
      },
      items: [
        {
          id: 'enterprise_bulk_tier',
          planId: 'custom',
          planName: `Enterprise Bulk Tier (${config.seats} Seats)`,
          billingPeriod: config.billingPeriod,
          basePriceNgn: config.monthlyTotalNgn,
          quantity: config.billingPeriod === 'yearly' ? 12 : 1,
          addOns: {
            extraBranches: Math.max(0, config.branches - 5),
            extraWarehouses: Math.max(0, config.warehouses - 2),
            priorityPhoneSla: config.addons.prioritySla,
          },
          volumeDetails: {
            users: config.seats,
            transactions: 0, // Flat subscription, ₦0 transaction fees
          },
        },
      ],
      subtotalNgn: config.monthlyBaseNgn * (config.billingPeriod === 'yearly' ? 12 : 1),
      savingsNgn: config.annualSavingsNgn,
      promoDiscountNgn: Math.round(
        config.monthlyBaseNgn * (config.discountPercent / 100) * (config.billingPeriod === 'yearly' ? 12 : 1)
      ),
      netTaxableNgn: basePlanPriceNgn,
      vatRatePercent: vatRate,
      vatAmountNgn: vatAmountNgn,
      totalPayableNgn: grandTotalPayableNgn,
      activeCurrency: activeCurrInfo,
      formatCurrencyFn: formatFn,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setQuoteReference(quoteRefGenerated);

    // Simulate enterprise quote ticket dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const copyRefToClipboard = () => {
    navigator.clipboard.writeText(quoteRefGenerated);
    setIsCopiedRef(true);
    setTimeout(() => setIsCopiedRef(false), 2000);
  };

  const whatsappUrl = `https://wa.me/2349158482622?text=${encodeURIComponent(
    `Hello MsmeBooks Enterprise Team, I have generated custom Enterprise Quote #${quoteRefGenerated} for ${
      businessName || 'our company'
    } (${config.seats} seats, ${config.branches} branches, ${config.warehouses} depots). I would like to schedule an executive consultation.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white dark:bg-[#0B1728] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#07172E] via-[#0A2A5E] to-[#0A4FD5] text-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 bg-lime-400/20 text-lime-300 text-xs font-bold px-3 py-1 rounded-full border border-lime-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Enterprise Bulk Tier • Custom Quote RFP</span>
                </div>
                <span className="text-[11px] font-mono text-blue-200">
                  Ref: {quoteRefGenerated}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Request Custom Enterprise Quote
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                Dedicated infrastructure, flat subscription pricing, unlimited transactions (₦0 fees), and tailored multi-branch rollout for large enterprises.
              </p>

              {/* Dynamic Live Configuration Pill Bar */}
              <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-300">User Seats</div>
                  <div className="text-base font-black text-lime-400 tabular-nums">
                    {config.seats} Seats
                  </div>
                  <div className="text-[10px] text-blue-200">
                    {config.discountPercent}% Bulk Discount
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-300">Branches & Depots</div>
                  <div className="text-base font-black text-white tabular-nums">
                    {config.branches} Outlets / {config.warehouses} Hubs
                  </div>
                  <div className="text-[10px] text-blue-200">
                    Centralized Inventory
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-300">Billing Cycle</div>
                  <div className="text-base font-black text-white capitalize">
                    {config.billingPeriod}
                  </div>
                  <div className="text-[10px] text-lime-300 font-semibold">
                    {config.billingPeriod === 'yearly' ? '20% Annual Off Applied' : 'Monthly Flexible'}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-300">Estimated Investment</div>
                  <div className="text-base font-black text-white tabular-nums">
                    {formatCurrency(config.periodTotalNgn, currency)}
                  </div>
                  <div className="text-[10px] text-blue-200">
                    {formatCurrency(config.monthlyTotalNgn, currency)}/mo (Flat)
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
              {/* Organization Info */}
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
                  <Building className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                  <span>1. Organization & Industry Profile</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Holding Group Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Zenith Mega Retail Group Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Industry Sector
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    >
                      <option value="Retail & Supermarket Chain">Retail & Supermarket Chain</option>
                      <option value="FMCG & Wholesale Distribution">FMCG & Wholesale Distribution</option>
                      <option value="Pharmacy & Healthcare Network">Pharmacy & Healthcare Network</option>
                      <option value="Manufacturing & Multi-Depot Supply">Manufacturing & Multi-Depot Supply</option>
                      <option value="Hospitality & Quick-Service Restaurant (QSR)">Hospitality & Quick-Service Restaurant (QSR)</option>
                      <option value="Conglomerate & Diversified Holdings">Conglomerate & Diversified Holdings</option>
                      <option value="Financial & Micro-Lending Services">Financial & Micro-Lending Services</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Executive Contact Info */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
                  <User className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                  <span>2. Executive Lead / Procurement Contact</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Dr. Babatunde Adeleke"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Job Title / Designation
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Chief Operating Officer / Head of IT"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adeleke@zenithretail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Direct Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Operational Country & Headquarters
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Nigeria (Lagos / Abuja / Port Harcourt)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Tax ID (TIN / VAT) <span className="font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. 24810932-0001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Implementation Architecture & Timeline */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
                  <Server className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                  <span>3. Rollout Timeline & Technical Scope</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Go-Live Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    >
                      <option value="Immediate (< 30 days)">Immediate (&lt; 30 days)</option>
                      <option value="1 - 3 Months">1 - 3 Months</option>
                      <option value="3 - 6 Months">3 - 6 Months</option>
                      <option value="Budgeting & Next Fiscal Year">Budgeting &amp; Next Fiscal Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current ERP or Accounting System to Replace
                    </label>
                    <select
                      value={legacySystem}
                      onChange={(e) => setLegacySystem(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                    >
                      <option value="SAP / Oracle ERP">SAP / Oracle ERP</option>
                      <option value="QuickBooks Desktop / Enterprise">QuickBooks Desktop / Enterprise</option>
                      <option value="Sage Pastel / Evolution">Sage Pastel / Evolution</option>
                      <option value="Microsoft Dynamics 365">Microsoft Dynamics 365</option>
                      <option value="Tally ERP / Prime">Tally ERP / Prime</option>
                      <option value="Custom In-House System / Excel">Custom In-House System / Excel</option>
                      <option value="New Green-field Rollout">New Green-field Rollout</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Architecture, Integration or Security Requirements <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Requirement for isolated VPC hosting in Lagos/Cape Town, hardware POS terminal drivers for 120 checkout lanes, and automated FIRS tax stamping."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071324] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-[#0A4FD5] dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer shadow-xs"
                  title="Download Official Proforma Quote as PDF"
                >
                  <Download className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                  <span>Download Proforma Quote (PDF)</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#0A4FD5] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting RFP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit RFP &amp; Request Custom Quote</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>NDA &amp; Enterprise Procurement Guaranteed • Senior Architect Contact within 2 Business Hours</span>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation View */
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full mb-2">
              Enterprise RFP Registered
            </span>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Quote Request Submitted Successfully!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto">
              Thank you, <strong>{contactName || 'Executive Lead'}</strong>. Your custom enterprise quotation and architecture spec for <strong>{businessName || 'your organization'}</strong> have been queued with our Enterprise Solutions Directorate.
            </p>

            {/* Reference Box */}
            <div className="mt-5 p-4 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Enterprise Quote Reference</span>
                <button
                  type="button"
                  onClick={copyRefToClipboard}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{isCopiedRef ? 'Copied!' : 'Copy Ref'}</span>
                </button>
              </div>
              <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                {quoteRefGenerated}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Scope: <strong>{config.seats} Seats, {config.branches} Outlets, {config.warehouses} Hubs</strong></span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(config.periodTotalNgn, currency)}</span>
              </div>
            </div>

            {/* Direct next steps */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-extrabold text-xs transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Quote PDF</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-black text-xs transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect with Enterprise Director on WhatsApp</span>
              </a>
            </div>

            <div className="mt-6 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Dedicated Enterprise SLA: Response dispatched to {email || 'your email'} within 2 business hours.</span>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Return to Pricing Section
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
