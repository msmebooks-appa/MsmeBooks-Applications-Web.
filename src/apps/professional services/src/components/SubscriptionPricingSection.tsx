import React, { useState, useMemo, useEffect } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Building2, 
  Users, 
  Coins, 
  MessageCircle, 
  Tag, 
  CreditCard, 
  Globe2, 
  CheckCircle2, 
  Printer, 
  Download, 
  Percent, 
  Lock,
  Award,
  MapPin,
  FileText,
  Star,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { 
  SUBSCRIPTION_PLANS, 
  PROMO_CODES, 
  calculateSubscriptionTotals, 
  PromoCodeDefinition,
  VAT_RATE_PERCENT 
} from '../data/subscriptionData';
import { 
  PAYMENT_GATEWAYS, 
  getGatewaysByRegion 
} from '../data/paymentGateways';
import { 
  PaymentGateway, 
  PaymentGatewayId, 
  PaymentRegionKey, 
  SubscriptionInvoiceReceipt,
  PaymentCheckoutResult,
  SubscriptionPlan
} from '../types/payment';
import { PaymentProcessor } from '../utils/paymentProcessor';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { SubscriptionInvoiceModal } from './SubscriptionInvoiceModal';

interface SubscriptionPricingSectionProps {
  selectedCountry?: string;
  onOpenMyBookings?: () => void;
}

// Sample target showcase country list with flags and cities
const SHOWCASE_COUNTRIES = [
  { name: 'Nigeria', flag: '🇳🇬', city: 'Lagos / Abuja', region: 'West Africa', marketReach: 'Top 1% Directory Placement' },
  { name: 'Ghana', flag: '🇬🇭', city: 'Accra / Kumasi', region: 'West Africa', marketReach: 'Ghana SME Directory' },
  { name: 'Kenya', flag: '🇰🇪', city: 'Nairobi / Mombasa', region: 'East Africa', marketReach: 'East Africa Hub Spotlight' },
  { name: 'Rwanda', flag: '🇷🇼', city: 'Kigali', region: 'East Africa', marketReach: 'Kigali Financial Center' },
  { name: 'South Africa', flag: '🇿🇦', city: 'Johannesburg / Sandton', region: 'South Africa', marketReach: 'Southern Africa Corporate Desk' },
  { name: 'Côte d’Ivoire', flag: '🇨🇮', city: 'Abidjan', region: 'Other Africa', marketReach: 'Francophone West Africa' },
  { name: 'Egypt', flag: '🇪🇬', city: 'Cairo / Giza', region: 'Other Africa', marketReach: 'North Africa & MENA Desk' },
  { name: 'United Kingdom', flag: '🇬🇧', city: 'London / Manchester', region: 'Global', marketReach: 'UK Diaspora & Inward Investment' },
  { name: 'Global & International', flag: '🌐', city: 'Worldwide', region: 'Global', marketReach: '54 African Nations + Global Consortia' },
];

export const SubscriptionPricingSection: React.FC<SubscriptionPricingSectionProps> = ({
  selectedCountry = 'Nigeria',
}) => {
  const { formatAmount } = useCurrency();

  // Active Billing Cycle (Monthly or Annual with 20% savings)
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Annual');

  // Selected Partner Showcase Plan (default to most popular: partner-firm)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('partner-firm');
  const selectedPlan: SubscriptionPlan = useMemo(() => {
    return SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1] || SUBSCRIPTION_PLANS[0];
  }, [selectedPlanId]);

  // Showcase Preview Country (for live directory profile simulation)
  const [previewCountry, setPreviewCountry] = useState<string>(selectedCountry || 'Nigeria');

  // Promo Code State
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeDefinition | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Regional Payment Gateway State driven by unified PaymentProcessor
  const defaultRegion: PaymentRegionKey = useMemo(() => {
    return PaymentProcessor.getPaymentRegion(selectedCountry);
  }, [selectedCountry]);

  const [activePaymentRegion, setActivePaymentRegion] = useState<PaymentRegionKey>(defaultRegion);
  const [selectedGatewayId, setSelectedGatewayId] = useState<PaymentGatewayId>(() => {
    return PaymentProcessor.getPrimaryGateway(selectedCountry).id;
  });

  // Automatically synchronize region & gateway selection when user country changes
  useEffect(() => {
    setActivePaymentRegion(defaultRegion);
    const primary = PaymentProcessor.getPrimaryGateway(selectedCountry);
    setSelectedGatewayId(primary.id);
    setPreviewCountry(selectedCountry);
  }, [defaultRegion, selectedCountry]);

  // Professional Partner Practice Checkout Form
  const [practiceName, setPracticeName] = useState('Danjuma & Associates Chartered Accountants');
  const [managingPartner, setManagingPartner] = useState('Alhaji Ibrahim Danjuma, FCA');
  const [practiceLicenseNo, setPracticeLicenseNo] = useState('ICAN/FRC/2018/002914');
  const [customerEmail, setCustomerEmail] = useState('partners@danjuma-cpa.org');
  const [customerPhone, setCustomerPhone] = useState('+234 803 294 1092');
  const [customerCity, setCustomerCity] = useState('Lagos');
  const [taxIdOrTIN, setTaxIdOrTIN] = useState('TIN-29184019-001');

  // Checkout Modal & Invoice Modal states
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<SubscriptionInvoiceReceipt | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Calculate live financial totals (no extra modules - clean plan price + promo discount + 7.5% exclusive VAT)
  const totals = useMemo(() => {
    return calculateSubscriptionTotals(selectedPlan, billingCycle, [], appliedPromo);
  }, [selectedPlan, billingCycle, appliedPromo]);

  // Regional payment gateways list mapped to active region
  const regionalGateways = useMemo(() => {
    return getGatewaysByRegion(activePaymentRegion);
  }, [activePaymentRegion]);

  const selectedGateway = useMemo(() => {
    return PAYMENT_GATEWAYS.find(g => g.id === selectedGatewayId) || regionalGateways[0] || PAYMENT_GATEWAYS[0];
  }, [selectedGatewayId, regionalGateways]);

  // Promo Code Validation
  const handleApplyPromo = (codeToApply?: string) => {
    const raw = (codeToApply || promoInput).trim().toUpperCase();
    setPromoError(null);
    setPromoSuccess(null);

    if (!raw) {
      setPromoError('Please enter a promotion code.');
      return;
    }

    const match = PROMO_CODES.find(p => p.code === raw);
    if (match) {
      setAppliedPromo(match);
      setPromoInput(raw);
      setPromoSuccess(`Code ${match.code} applied! Saved ${match.discountPercent}% off subtotal.`);
    } else {
      setPromoError(`Invalid promotion code "${raw}". Try MSMEGROWTH20, WESTAFRICA15, or WELCOME10.`);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoSuccess(null);
    setPromoError(null);
  };

  // Trigger Checkout
  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  // Helper to construct a complete invoice object
  const buildInvoiceObject = (paymentResult?: PaymentCheckoutResult): SubscriptionInvoiceReceipt => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-2026-${randomSuffix}`;
    const receiptNumber = `RCP-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    return {
      invoiceNumber,
      receiptNumber,
      issuedAt: now,
      dueDate: now,
      paidAt: now,
      status: 'Paid',
      customer: {
        fullName: managingPartner,
        businessName: practiceName,
        email: customerEmail,
        phone: customerPhone,
        country: selectedCountry,
        city: customerCity,
        taxIdOrTIN: taxIdOrTIN || undefined,
        practiceLicenseNumber: practiceLicenseNo || undefined,
      },
      partnerDetails: {
        tierName: selectedPlan.tier,
        countryCoverage: selectedPlan.countryCoverage || 'Pan-African & Global Directories',
        directoryBadges: selectedPlan.directoryBadges || ['Verified Partner'],
        partnerRosterSize: selectedPlan.userSeats,
      },
      plan: {
        id: selectedPlan.id,
        name: selectedPlan.name,
        billingCycle,
        basePriceNGN: totals.planTotalNGN,
      },
      extraModules: [],
      pricing: {
        subtotalBeforeDiscountNGN: totals.subtotalBeforeDiscountNGN,
        promoCodeApplied: appliedPromo ? appliedPromo.code : undefined,
        discountPercent: appliedPromo ? appliedPromo.discountPercent : undefined,
        discountAmountNGN: totals.discountAmountNGN,
        subtotalAfterDiscountNGN: totals.subtotalAfterDiscountNGN,
        vatRatePercent: VAT_RATE_PERCENT,
        vatAmountNGN: totals.vatAmountNGN,
        totalAmountPaidNGN: totals.totalAmountPaidNGN,
        currency: 'NGN',
      },
      payment: {
        gatewayId: paymentResult ? paymentResult.gatewayId : selectedGateway.id,
        gatewayName: paymentResult ? paymentResult.gatewayName : selectedGateway.name,
        transactionReference: paymentResult ? paymentResult.transactionRef : `REF-MSME-PARTNER-${randomSuffix}`,
        channelUsed: paymentResult ? paymentResult.channel : selectedGateway.supportedMethods[0] || 'Card / Instant Rail',
        status: 'Verified & Cleared',
      },
    };
  };

  // Payment Success Handler: Generates official Tax Invoice & Receipt
  const handlePaymentSuccess = (result: PaymentCheckoutResult) => {
    setIsCheckoutModalOpen(false);
    const newInvoice = buildInvoiceObject(result);
    setGeneratedInvoice(newInvoice);
    setIsInvoiceModalOpen(true);
  };

  // Instant Invoice Preview / Generation Handler
  const handlePreviewInvoice = () => {
    const inv = buildInvoiceObject();
    setGeneratedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const activeCountryObj = SHOWCASE_COUNTRIES.find(c => c.name.toLowerCase() === previewCountry.toLowerCase()) || SHOWCASE_COUNTRIES[0];

  return (
    <section id="subscriptions-pricing" className="py-20 bg-slate-50 dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Pan-African & Global Professional Partner Directory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Professional Business & Partner Showcase Subscriptions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Showcase your firm’s services, accredited qualifications, and professional practice profile across countries in Africa and globally. Gain direct appointment bookings, verified regulatory status, and top directory ranking.
          </p>

          {/* Billing Cycle Toggle (Monthly vs Annual with -20% badge) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setBillingCycle('Monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                billingCycle === 'Monthly'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingCycle('Annual')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === 'Annual'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span>Billed Annually</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#B7E532] text-[#102B4E] shadow-2xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 1. PROFESSIONAL BUSINESS & PARTNER SHOWCASE CARDS */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1464C8] dark:text-[#B7E532]" />
                1. Select Partner Practice Showcase Tier
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Choose your directory visibility reach across African markets and global financial hubs.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Step 1 of 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const displayRate = billingCycle === 'Annual' ? plan.priceAnnualMonthlyNGN : plan.priceMonthlyNGN;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#0A1727] ring-3 ring-[#1464C8] dark:ring-[#B7E532] shadow-xl shadow-blue-500/10'
                      : 'bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  {/* Top Popular or Active Tag */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1464C8] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Most Popular for Established Firms</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300 font-black text-xs">
                        {plan.tier}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#1464C8] dark:border-[#B7E532] bg-[#1464C8] dark:bg-[#B7E532]' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white dark:text-[#102B4E]" />}
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-[#102B4E] dark:text-white mt-4 leading-tight">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[36px]">
                      {plan.tagline}
                    </p>

                    {/* Price Display */}
                    <div className="my-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white">
                          {formatAmount(displayRate)}
                        </span>
                        <span className="text-xs font-bold text-slate-400">/ month</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {billingCycle === 'Annual' 
                          ? `Billed annually at ${formatAmount(displayRate * 12)} / year (-20%)`
                          : 'Billed monthly with no long-term contract'}
                      </span>
                    </div>

                    {/* Directory Country Scope & Team Seats */}
                    <div className="space-y-2 mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1E33] text-xs">
                      <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <Globe2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 dark:text-white block">Directory Coverage:</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{plan.countryCoverage}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 dark:text-white block">Partner Seats:</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{plan.userSeats}</span>
                        </div>
                      </div>
                    </div>

                    {/* Directory Status Badges */}
                    <div className="mb-5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Directory Profile Badges
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.directoryBadges.map((badge, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300 border border-blue-100 dark:border-blue-900/60"
                          >
                            ✓ {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Included Showcase Features
                      </span>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Plan Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                    }}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-[#1464C8] text-white hover:bg-[#1052a5]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ Showcase Tier Selected' : 'Choose This Showcase Tier'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. LIVE PAN-AFRICAN & GLOBAL DIRECTORY PROFILE SHOWCASE PREVIEW */}
        <div className="mb-14 bg-gradient-to-r from-[#102B4E] to-[#0A1727] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#1464C8]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#B7E532] tracking-wider mb-1">
                  <Globe2 className="w-4 h-4" />
                  Live Directory Showcase Simulation
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  How Your Firm Profile Appears to Clients Across Africa & Globally
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Click any country to see your verified partner badge, booking desk, and service listings rendered for local clients.
                </p>
              </div>

              {/* Country Selection Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {SHOWCASE_COUNTRIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setPreviewCountry(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      previewCountry.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-[#B7E532] text-[#102B4E] shadow-sm scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Directory Card */}
            <div className="bg-white dark:bg-[#07111D] text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 border border-slate-200/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1464C8] to-[#102B4E] flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                    {practiceName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-black text-[#102B4E] dark:text-white">
                        {practiceName || 'Danjuma & Associates Chartered Accountants'}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-900/60 text-[#1464C8] dark:text-blue-300 flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
                        {selectedPlan.tier}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        ★ Top Rated
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        ⚡ Fastest Response (&lt;30m)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{activeCountryObj.city}, {activeCountryObj.name} {activeCountryObj.flag}</span>
                      </span>
                      <span>·</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Managing Partner: {managingPartner}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Reg: {practiceLicenseNo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button on Simulated Card */}
                <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                  <div className="text-right hidden sm:block mr-2">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Client Star Rating</span>
                    <span className="text-xs font-black text-amber-500 flex items-center justify-end gap-1">
                      ★★★★★ (4.9 / 5.0 · 48 Reviews)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleProceedToCheckout()}
                    className="w-full sm:w-auto px-4 py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-black rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Activate This Listing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Showcase Practice Offerings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1727] border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white block mb-0.5">
                    1. Statutory Audit & IFRS Review
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Compliant annual audit reports with express digital sign-off.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1727] border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white block mb-0.5">
                    2. Cross-Border Tax & VAT Advisory
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Multinational transfer pricing and local revenue compliance.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1727] border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white block mb-0.5">
                    3. Cloud Accounting ERP Migration
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    MsmeBooks turnkey chart of accounts setup for SMEs.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. PARTNER CHECKOUT, REGIONAL PAYMENT ROUTER & 7.5% EXCLUSIVE VAT */}
        <div className="bg-white dark:bg-[#0A1727] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#1464C8] dark:text-[#B7E532] tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                2. Partner Registration, Regional Gateway & Tax Invoice
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#102B4E] dark:text-white">
                Partner Firm Details & Regional Payment Rails
              </h3>
            </div>
            <button
              type="button"
              onClick={handlePreviewInvoice}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              title="Preview official partner tax invoice before paying"
            >
              <FileText className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Preview Tax Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Partner Profile Form & Regional Payment Gateways */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Partner Practice Form Fields */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Partner Practice Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Practice / Firm Legal Name *
                    </label>
                    <input
                      type="text"
                      value={practiceName}
                      onChange={(e) => setPracticeName(e.target.value)}
                      placeholder="e.g. Danjuma & Associates CPAs"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Managing Partner / Lead Practitioner *
                    </label>
                    <input
                      type="text"
                      value={managingPartner}
                      onChange={(e) => setManagingPartner(e.target.value)}
                      placeholder="e.g. Alhaji Ibrahim Danjuma, FCA"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Professional License / Reg Number *
                    </label>
                    <input
                      type="text"
                      value={practiceLicenseNo}
                      onChange={(e) => setPracticeLicenseNo(e.target.value)}
                      placeholder="e.g. ICAN/FRC/2018/002914 or SAICA/CPA"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Tax Identification No. (TIN / VAT ID)
                    </label>
                    <input
                      type="text"
                      value={taxIdOrTIN}
                      onChange={(e) => setTaxIdOrTIN(e.target.value)}
                      placeholder="e.g. TIN-29184019-001"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Practice Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Direct WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[#1464C8]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                      Primary Operating City & Country
                    </label>
                    <input
                      type="text"
                      value={`${customerCity}, ${selectedCountry}`}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Payment Gateway Router (Mapped by Unified PaymentProcessor) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Gateway by Region
                  </h4>
                  <span className="text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532]">
                    Selected Country: {selectedCountry}
                  </span>
                </div>

                {/* Region Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
                  {(['Nigeria & West Africa', 'East Africa', 'South Africa', 'Other Africa Countries', 'Global & International'] as PaymentRegionKey[]).map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => {
                        setActivePaymentRegion(reg);
                        const list = getGatewaysByRegion(reg);
                        if (list.length > 0) setSelectedGatewayId(list[0].id);
                      }}
                      className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activePaymentRegion === reg
                          ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {reg === 'Nigeria & West Africa' && '🇳🇬 West Africa'}
                      {reg === 'East Africa' && '🇰🇪 East Africa'}
                      {reg === 'South Africa' && '🇿🇦 South Africa'}
                      {reg === 'Other Africa Countries' && '🌍 Other Africa'}
                      {reg === 'Global & International' && '🌐 Global'}
                    </button>
                  ))}
                </div>

                {/* Gateways in Selected Region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {regionalGateways.map((gw) => {
                    const isSelected = selectedGatewayId === gw.id;

                    return (
                      <div
                        key={gw.id}
                        onClick={() => setSelectedGatewayId(gw.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-50/50 dark:bg-blue-950/40 border-[#1464C8] dark:border-[#B7E532] shadow-xs'
                            : 'bg-slate-50 dark:bg-[#0D1D31] border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0 shadow-2xs"
                            style={{ backgroundColor: gw.accentColor }}
                          >
                            {gw.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-[#102B4E] dark:text-white truncate">
                                {gw.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {gw.supportedMethods.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#1464C8] dark:border-[#B7E532] bg-[#1464C8] dark:bg-[#B7E532]' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white dark:text-[#102B4E]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Cart Breakdown, Promo Code, 7.5% Exclusive VAT & Checkout Actions */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#060F1A] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Showcase Subscription Cart</span>
                  <span className="text-[#1464C8] dark:text-[#B7E532] font-black">{billingCycle} Billing</span>
                </h4>

                {/* Partner Plan Line Item */}
                <div className="py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                      {selectedPlan.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {selectedPlan.countryCoverage} · {billingCycle === 'Annual' ? '12 Months Access (-20%)' : 'Monthly Access'}
                    </span>
                  </div>
                  <span className="font-black text-slate-800 dark:text-white">
                    {formatAmount(totals.planTotalNGN)}
                  </span>
                </div>

                {/* Promotion Code Section */}
                <div className="my-4 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                    <span>Promotion Code & Partner Discount</span>
                  </label>
                  
                  {appliedPromo ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                      <div>
                        <strong>{appliedPromo.code}</strong> Applied ({appliedPromo.discountPercent}% Off)
                        <span className="block text-[11px] text-emerald-600 dark:text-emerald-300 font-bold">
                          Amount Saved: {formatAmount(totals.discountAmountNGN)}
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. MSMEGROWTH20"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyPromo()}
                          className="px-4 py-2 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Promo Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                        <span className="text-slate-400">Try:</span>
                        {PROMO_CODES.map((p) => (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleApplyPromo(p.code)}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-[#1464C8] cursor-pointer"
                          >
                            {p.code} (-{p.discountPercent}%)
                          </button>
                        ))}
                      </div>

                      {promoError && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                          {promoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotals & 7.5% Exclusive VAT Section */}
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Subscription Rate:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatAmount(totals.subtotalBeforeDiscountNGN)}
                    </span>
                  </div>

                  {totals.discountAmountNGN > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount ({appliedPromo?.code}):</span>
                      <span>-{formatAmount(totals.discountAmountNGN)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Net Subtotal:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatAmount(totals.subtotalAfterDiscountNGN)}
                    </span>
                  </div>

                  {/* Explicit 7.5% Exclusive VAT Line Item */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-extrabold border border-amber-200 dark:border-amber-900/60">
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      <span>VAT (7.5% Statutory Exclusive Rate):</span>
                    </div>
                    <span>+{formatAmount(totals.vatAmountNGN)}</span>
                  </div>
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-black text-[#102B4E] dark:text-white uppercase tracking-wider">
                    Total Amount Due:
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#1464C8] dark:text-[#B7E532]">
                      {formatAmount(totals.totalAmountPaidNGN)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Incl. 7.5% exclusive statutory VAT
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Pay via Selected Regional Gateway */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay via {selectedGateway.name} ({formatAmount(totals.totalAmountPaidNGN)})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {/* Secondary CTA: Generate / Preview Official Tax Invoice & Receipt */}
                <button
                  type="button"
                  onClick={handlePreviewInvoice}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#0D1D31] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  <span>Generate & Print Partner Tax Invoice / Receipt</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Official VAT receipt with QR code generated immediately upon payment</span>
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* MODAL 1: Payment Checkout Modal (Supports regional gateway checkout) */}
      <PaymentCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        gateway={selectedGateway}
        amountFormatted={formatAmount(totals.totalAmountPaidNGN)}
        bookingRef={`SUB-PARTNER-${selectedPlan.tier.replace(/\s+/g, '-').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`}
        customerName={managingPartner}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        serviceTitle={`${selectedPlan.name} (${billingCycle}) - ${practiceName}`}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* MODAL 2: Official Partner Tax Invoice & Payment Receipt Modal (With Print & Download) */}
      <SubscriptionInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={generatedInvoice}
      />

    </section>
  );
};
