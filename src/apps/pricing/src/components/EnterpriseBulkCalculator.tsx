import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building,
  Server,
  Database,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
  Download,
  MessageCircle,
  Layers,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
  FileText,
  Clock,
  TrendingDown,
  HelpCircle,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../utils/currency';
import { EnterpriseQuoteModal, EnterpriseBulkConfig } from './EnterpriseQuoteModal';
import { generateQuoteDocument } from '../utils/generateQuotePdf';
import { CurrencyTrendTooltip } from './CurrencyTrendTooltip';

interface EnterpriseBulkCalculatorProps {
  currency: Currency;
  onOpenDemoModal?: () => void;
  initialBillingPeriod?: 'monthly' | 'yearly';
}

export const EnterpriseBulkCalculator: React.FC<EnterpriseBulkCalculatorProps> = ({
  currency,
  onOpenDemoModal,
  initialBillingPeriod = 'yearly',
}) => {
  // Calculator Parameters
  const [seats, setSeats] = useState<number>(100);
  const [branches, setBranches] = useState<number>(15);
  const [warehouses, setWarehouses] = useState<number>(4);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(initialBillingPeriod);

  // Enterprise Add-on Toggles
  const [addons, setAddons] = useState({
    dedicatedDb: true,
    erpConnector: true,
    prioritySla: true,
    whiteGloveMigration: false,
    privateVpc: false,
    firsTaxEngine: true,
  });

  // Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Progressive Volume Discount tiers
  const discountPercent = useMemo(() => {
    if (seats >= 1000) return 35;
    if (seats >= 500) return 30;
    if (seats >= 250) return 25;
    if (seats >= 100) return 20;
    return 15;
  }, [seats]);

  // Pricing Calculation in NGN base
  // Standard list rate per enterprise seat: ₦22,000/mo (includes full accounting, inventory, HR, unlimited POS)
  const baseSeatRateMonthly = 22000;
  const rawSeatsMonthlyNgn = seats * baseSeatRateMonthly;

  // Extra branches beyond 5 included free
  const extraBranches = Math.max(0, branches - 5);
  const branchesMonthlyNgn = extraBranches * 8000;

  // Extra warehouses beyond 2 included free
  const extraWarehouses = Math.max(0, warehouses - 2);
  const warehousesMonthlyNgn = extraWarehouses * 15000;

  // Add-on fees
  const dedicatedDbNgn = addons.dedicatedDb ? 120000 : 0;
  const erpConnectorNgn = addons.erpConnector ? 180000 : 0;
  const prioritySlaNgn = addons.prioritySla ? 95000 : 0;
  const whiteGloveMigrationNgn = addons.whiteGloveMigration ? 75000 : 0;
  const privateVpcNgn = addons.privateVpc ? 200000 : 0;
  const firsTaxEngineNgn = addons.firsTaxEngine ? 60000 : 0;

  const totalAddonsMonthlyNgn =
    dedicatedDbNgn +
    erpConnectorNgn +
    prioritySlaNgn +
    whiteGloveMigrationNgn +
    privateVpcNgn +
    firsTaxEngineNgn;

  // Gross monthly before discounts
  const grossMonthlyNgn =
    rawSeatsMonthlyNgn + branchesMonthlyNgn + warehousesMonthlyNgn + totalAddonsMonthlyNgn;

  // Bulk tier discount amount (applies to base seat licensing)
  const seatDiscountMonthlyNgn = Math.round(rawSeatsMonthlyNgn * (discountPercent / 100));

  // Net monthly after bulk scale discount
  const netMonthlyNgn = grossMonthlyNgn - seatDiscountMonthlyNgn;

  // Annual savings (20% commitment discount)
  const isYearly = billingPeriod === 'yearly';
  const effectiveMonthlyNgn = isYearly ? Math.round(netMonthlyNgn * 0.8) : netMonthlyNgn;
  const periodTotalNgn = isYearly ? effectiveMonthlyNgn * 12 : effectiveMonthlyNgn;
  const annualSavingsNgn = isYearly ? Math.round(netMonthlyNgn * 12 * 0.2) : 0;

  // Average cost per seat per month equivalent
  const costPerSeatPerMonthNgn = Math.round(effectiveMonthlyNgn / seats);

  const bulkConfig: EnterpriseBulkConfig = {
    seats,
    branches,
    warehouses,
    addons,
    billingPeriod,
    monthlyBaseNgn: grossMonthlyNgn,
    discountPercent,
    monthlyTotalNgn: effectiveMonthlyNgn,
    periodTotalNgn,
    annualSavingsNgn,
  };

  const handleInstantPdfDownload = () => {
    const activeCurrInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
    const formatFn = (amountNgn: number) => formatCurrency(amountNgn, currency);

    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 30);

    const formatDateStr = (d: Date) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const quoteNumber = `MSME-BULK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const basePlanPriceNgn = periodTotalNgn;
    const vatRate = 7.5;
    const vatAmountNgn = Math.round(basePlanPriceNgn * (vatRate / 100));
    const grandTotalPayableNgn = basePlanPriceNgn + vatAmountNgn;

    generateQuoteDocument({
      quoteNumber,
      date: formatDateStr(today),
      validUntil: formatDateStr(expiryDate),
      customer: {
        businessName: 'Enterprise Client (Bulk Calculation)',
        contactName: 'Executive Procurement Lead',
        email: 'procurement@enterprise.com',
        phone: '+234 915 848 2622',
        address: 'Enterprise Headquarters',
        country: 'Nigeria',
        taxId: 'TIN-PENDING',
      },
      items: [
        {
          id: 'enterprise_bulk_tier',
          planId: 'custom',
          planName: `Enterprise Bulk Tier (${seats} User Seats, ${branches} Outlets, ${warehouses} Depots)`,
          billingPeriod,
          basePriceNgn: effectiveMonthlyNgn,
          quantity: isYearly ? 12 : 1,
          addOns: {
            extraBranches,
            extraWarehouses,
            priorityPhoneSla: addons.prioritySla,
          },
          volumeDetails: {
            users: seats,
            transactions: 0, // Flat subscription, ₦0 per-transaction fee
          },
        },
      ],
      subtotalNgn: grossMonthlyNgn * (isYearly ? 12 : 1),
      savingsNgn: annualSavingsNgn,
      promoDiscountNgn: seatDiscountMonthlyNgn * (isYearly ? 12 : 1),
      netTaxableNgn: basePlanPriceNgn,
      vatRatePercent: vatRate,
      vatAmountNgn: vatAmountNgn,
      totalPayableNgn: grandTotalPayableNgn,
      activeCurrency: activeCurrInfo,
      formatCurrencyFn: formatFn,
    });
  };

  const whatsappInquiryUrl = `https://wa.me/2349158482622?text=${encodeURIComponent(
    `Hello MsmeBooks Enterprise Team, I configured a custom Enterprise Bulk Tier with ${seats} seats, ${branches} branches, and ${warehouses} depots on your pricing calculator (estimated at ${formatCurrency(
      effectiveMonthlyNgn,
      currency
    )}/mo). Please connect me with an enterprise account specialist.`
  )}`;

  return (
    <div
      id="enterprise-bulk-calculator"
      className="mt-14 rounded-3xl bg-gradient-to-b from-slate-900 via-[#07172E] to-[#040D1B] text-white p-6 sm:p-10 border border-blue-900/60 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-lime-500/20 border border-blue-400/30 text-lime-300 text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-inner">
            <Calculator className="w-4 h-4 text-lime-400" />
            <span>Massive Scale Architecture • 50 to 1,000+ User Seats</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Enterprise Bulk Tier Calculator</span>
          </h3>

          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Tailor high-volume deployment for supermarket chains, nationwide FMCG distributors, holding conglomerates, and multi-depot operators with flat subscription rates, dedicated cloud nodes, and <strong className="text-lime-300">₦0 per-transaction fees</strong>.
          </p>
        </div>

        {/* Flat Subscription Reassurance Badge */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 border border-lime-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>Flat Subscription Model</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                100% Predictable
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Unlimited POS receipts, branch transfers &amp; invoices. Never charged per transaction.
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders and Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* 1. User Seats Slider */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>Licensed Team User Seats</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Full ERP access, POS cashiers, branch managers, accountants &amp; executives
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-lime-400 tabular-nums">
                  {seats.toLocaleString()}
                </span>
                <span className="text-xs text-slate-300 font-bold ml-1">seats</span>
                <div className="text-[10px] font-black text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md mt-0.5 border border-blue-400/30 inline-block">
                  {discountPercent}% Scale Discount
                </div>
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={1000}
              step={10}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#84CC16]"
              aria-label="Adjust enterprise user seats"
            />

            {/* Quick Presets */}
            <div className="flex items-center justify-between gap-1.5 mt-3 pt-3 border-t border-white/5">
              {[50, 100, 250, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSeats(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    seats === preset
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {preset === 1000 ? '1,000+' : preset} seats
                </button>
              ))}
            </div>
          </div>

          {/* 2. Physical Branches & Central Warehouses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Branches Slider */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Retail Store Outlets</span>
                </span>
                <span className="text-lg font-black text-white tabular-nums">
                  {branches}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={branches}
                onChange={(e) => setBranches(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A4FD5]"
                aria-label="Adjust retail outlets"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 included free</span>
                <span>Max 200+ outlets</span>
              </div>
            </div>

            {/* Central Warehouses Slider */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Central Distribution Depots</span>
                </span>
                <span className="text-lg font-black text-white tabular-nums">
                  {warehouses}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                step={1}
                value={warehouses}
                onChange={(e) => setWarehouses(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A4FD5]"
                aria-label="Adjust distribution depots"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2 included free</span>
                <span>Max 50+ hubs</span>
              </div>
            </div>
          </div>

          {/* 3. Enterprise Infrastructure & Service Add-ons */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-blue-400" />
                <span>Enterprise Architecture Modules &amp; SLA Options</span>
              </span>
              <span className="text-[10px] text-slate-400">Select applicable requirements</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Isolated DB Node */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.dedicatedDb
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.dedicatedDb}
                  onChange={(e) => setAddons({ ...addons, dedicatedDb: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">Dedicated Database Node</div>
                  <div className="text-[10px] text-slate-300">
                    Isolated AWS/Azure cluster, zero shared-tenant latency
                  </div>
                </div>
              </label>

              {/* Custom ERP Adapter */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.erpConnector
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.erpConnector}
                  onChange={(e) => setAddons({ ...addons, erpConnector: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">Custom ERP Adapter</div>
                  <div className="text-[10px] text-slate-300">
                    Bidirectional sync for SAP, Oracle, NetSuite &amp; Dynamics
                  </div>
                </div>
              </label>

              {/* 24/7 SLA & Dedicated TAM */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.prioritySla
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.prioritySla}
                  onChange={(e) => setAddons({ ...addons, prioritySla: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">24/7 Mission-Critical SLA</div>
                  <div className="text-[10px] text-slate-300">
                    15-min emergency response &amp; dedicated Account Manager
                  </div>
                </div>
              </label>

              {/* FIRS & Tax Engine */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.firsTaxEngine
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.firsTaxEngine}
                  onChange={(e) => setAddons({ ...addons, firsTaxEngine: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">FIRS E-Invoicing Engine</div>
                  <div className="text-[10px] text-slate-300">
                    Automated QR tax stamping &amp; statutory audit archives
                  </div>
                </div>
              </label>

              {/* White-Glove Migration */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.whiteGloveMigration
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.whiteGloveMigration}
                  onChange={(e) => setAddons({ ...addons, whiteGloveMigration: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">White-Glove Migration</div>
                  <div className="text-[10px] text-slate-300">
                    Legacy data cleanup, staff certification &amp; on-site rollout
                  </div>
                </div>
              </label>

              {/* Private VPC / Air-Gapped Hybrid */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  addons.privateVpc
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.privateVpc}
                  onChange={(e) => setAddons({ ...addons, privateVpc: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-extrabold text-white">Private VPC / Hybrid Cloud</div>
                  <div className="text-[10px] text-slate-300">
                    Host on your dedicated AWS VPC or local data center
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Enterprise Investment Breakdown & RFP CTA (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-6 border border-white/15 backdrop-blur-md shadow-xl space-y-6">
            
            {/* Billing Period Selector */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Billing Cycle
              </span>
              <div className="inline-flex p-1 bg-black/40 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingPeriod === 'monthly'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    billingPeriod === 'yearly'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] bg-black/30 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Scope Summary Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Seats ({seats} seats @ ₦22k/mo):</span>
                <span className="font-semibold text-white">
                  {formatCurrency(rawSeatsMonthlyNgn, currency)}/mo
                </span>
              </div>

              <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/30">
                <span>Bulk Scale Volume Discount ({discountPercent}%):</span>
                <span>-{formatCurrency(seatDiscountMonthlyNgn, currency)}/mo</span>
              </div>

              {(extraBranches > 0 || extraWarehouses > 0) && (
                <div className="flex justify-between text-slate-300">
                  <span>Additional Outlets &amp; Depots:</span>
                  <span className="font-semibold text-white">
                    +{formatCurrency(branchesMonthlyNgn + warehousesMonthlyNgn, currency)}/mo
                  </span>
                </div>
              )}

              {totalAddonsMonthlyNgn > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Selected Enterprise Add-ons:</span>
                  <span className="font-semibold text-white">
                    +{formatCurrency(totalAddonsMonthlyNgn, currency)}/mo
                  </span>
                </div>
              )}

              {isYearly && annualSavingsNgn > 0 && (
                <div className="flex justify-between text-lime-400 font-bold bg-lime-950/40 px-2 py-1 rounded-lg border border-lime-500/30">
                  <span>Annual Commitment Discount (20% OFF):</span>
                  <span>-{formatCurrency(annualSavingsNgn, currency)}/yr</span>
                </div>
              )}
            </div>

            {/* Final Investment Number */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Estimated Enterprise Investment</span>
                <span className="text-[10px] text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                  Pre-Tax Proforma Estimate
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <CurrencyTrendTooltip currency={currency} showInlineBadge={true} align="left">
                  <span className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight hover:text-blue-300 transition-colors cursor-pointer">
                    {formatCurrency(effectiveMonthlyNgn, currency)}
                  </span>
                </CurrencyTrendTooltip>
                <span className="text-sm font-semibold text-slate-300">/ month</span>
              </div>

              {isYearly && (
                <div className="text-xs text-slate-300 mt-1">
                  Billed annually as <strong>{formatCurrency(periodTotalNgn, currency)}</strong> / year
                </div>
              )}

              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Effective Seat Rate:</span>
                <strong className="text-lime-300">
                  {formatCurrency(costPerSeatPerMonthNgn, currency)} / seat / mo
                </strong>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Request Custom Enterprise Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleInstantPdfDownload}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-white/15 cursor-pointer"
                title="Download instantly calculated quote specification"
              >
                <Download className="w-4 h-4 text-lime-400" />
                <span>Download Proforma Enterprise Spec (PDF)</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chat with Enterprise Architect on WhatsApp</span>
              </a>
            </div>

            {/* Procurement Assurance footer */}
            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2 border-t border-white/5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>FIRS &amp; NDPR Compliant • Custom Corporate Master Services Agreement (MSA)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      <EnterpriseQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        currency={currency}
        config={bulkConfig}
      />
    </div>
  );
};
