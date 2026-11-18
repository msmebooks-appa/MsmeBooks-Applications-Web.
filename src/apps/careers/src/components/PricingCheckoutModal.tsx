import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  Globe,
  Receipt,
  Check,
  Phone,
  Smartphone,
  Landmark,
  Search,
  ExternalLink,
  ChevronRight,
  Printer,
  Users,
  Target,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { PricingPlan, BillingCycle, Currency } from '../types/pricing';
import { BILLING_DISCOUNTS } from '../data/pricingPlans';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { AddCountryCurrencyModal } from './AddCountryCurrencyModal';
import {
  PAYMENT_REGIONS,
  PAYMENT_GATEWAYS,
  PaymentRegionId,
  PaymentGateway,
} from '../data/paymentGateways';
import { UserRole } from '../types/auth';
import { setCandidatePlan } from '../utils/planQuotas';

interface PricingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  billingCycle: BillingCycle;
  currency: Currency;
  onSuccess: (creditsGranted: number | 'unlimited', planName: string) => void;
}

export const PricingCheckoutModal: React.FC<PricingCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { currentCurrency, currentConfig, formatAmount, setCurrency: setGlobalCurrency, currencies } = useCurrency();

  // Active Billing Cycle & Quantity: 1 for monthly, 12 for yearly
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(billingCycle);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);

  React.useEffect(() => {
    setSelectedBillingCycle(billingCycle);
  }, [billingCycle]);

  // Specific requirement: 1 for monthly and 12 for yearly quantity subscription plan
  const planQuantity =
    selectedBillingCycle === 'yearly'
      ? 12
      : selectedBillingCycle === 'biyearly'
      ? 6
      : selectedBillingCycle === 'quarterly'
      ? 3
      : 1;

  // Target Role for subscription (Employers, Recruiters / Agencies, Headhunters)
  const [subscriberRole, setSubscriberRole] = useState<'employer' | 'agency' | 'headhunter'>(
    (user?.role === 'agency' || user?.role === 'headhunter' ? user.role : 'employer') as any
  );

  // Region and Gateway Selection
  const [selectedRegionId, setSelectedRegionId] = useState<PaymentRegionId>('west-africa');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('paystack');
  const [gatewaySearch, setGatewaySearch] = useState('');

  // Form Fields
  const [billingName, setBillingName] = useState(user?.fullName || '');
  const [billingEmail, setBillingEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(
    user?.role === 'employer'
      ? (user.roleData.data as any).companyName || ''
      : user?.role === 'agency'
      ? (user.roleData.data as any).agencyName || ''
      : user?.role === 'headhunter'
      ? (user.roleData.data as any).practiceName || ''
      : ''
  );

  // Specific Gateway Input States
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // M-Pesa / Mobile Money States
  const [mobileNumber, setMobileNumber] = useState('+254 712 345 678');
  const [selectedNetwork, setSelectedNetwork] = useState('Safaricom');
  const [isStkPushed, setIsStkPushed] = useState(false);
  const [stkConfirmed, setStkConfirmed] = useState(false);

  // Ozow Instant EFT Bank State
  const [selectedBank, setSelectedBank] = useState('Capitec Bank');

  // Transact Pay Corporate Reference
  const [corporateAccountRef, setCorporateAccountRef] = useState('CORP-MSME-2026-X8');

  // Processing & Confirmation States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paidAtDate, setPaidAtDate] = useState('');

  // Selected Gateway lookup
  const selectedGateway: PaymentGateway = useMemo(() => {
    return (
      PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId) ||
      PAYMENT_GATEWAYS[0]
    );
  }, [selectedGatewayId]);

  // Filtered gateways based on region and search query
  const filteredGateways = useMemo(() => {
    return PAYMENT_GATEWAYS.filter((g) => {
      const matchRegion = g.regionId === selectedRegionId;
      if (!gatewaySearch.trim()) return matchRegion;
      const q = gatewaySearch.toLowerCase().trim();
      const matchName = g.name.toLowerCase().includes(q);
      const matchCountry = g.countries.some((c) => c.toLowerCase().includes(q));
      const matchMethod = g.methods.some((m) => m.toLowerCase().includes(q));
      return (matchRegion || matchName || matchCountry) && (matchName || matchCountry || matchMethod);
    });
  }, [selectedRegionId, gatewaySearch]);

  if (!isOpen || !plan) return null;

  const discountInfo = BILLING_DISCOUNTS[selectedBillingCycle];

  // Pricing calculations based on selected billing cycle & quantity (1 for monthly, 12 for yearly)
  const getTotalUSD = () => {
    switch (selectedBillingCycle) {
      case 'monthly':
        return plan.priceMonthlyUSD;
      case 'quarterly':
        return plan.priceQuarterlyUSD;
      case 'biyearly':
        return plan.priceBiYearlyUSD;
      case 'yearly':
        return plan.priceYearlyUSD;
    }
  };

  const getRegularTotalUSD = () => {
    return plan.priceMonthlyUSD * discountInfo.periodMonths;
  };

  const totalUSD = getTotalUSD();
  const regularTotalUSD = getRegularTotalUSD();
  const savingsUSD = Math.max(0, regularTotalUSD - totalUSD);

  const formatPrice = (usd: number) => formatAmount(usd);

  // Handle region switch and auto-select primary gateway in that region
  const handleSelectRegion = (regionId: PaymentRegionId) => {
    setSelectedRegionId(regionId);
    const firstGateway = PAYMENT_GATEWAYS.find((g) => g.regionId === regionId);
    if (firstGateway) {
      setSelectedGatewayId(firstGateway.id);
    }
  };

  // Simulate M-Pesa STK Push
  const handleTriggerStkPush = () => {
    setIsStkPushed(true);
    setTimeout(() => {
      setStkConfirmed(true);
    }, 1800);
  };

  // Complete Payment Action
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const receipt = `MSME-INV-${selectedGateway.name.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const nowIso = new Date().toISOString();
      setReceiptNumber(receipt);
      setPaidAtDate(nowIso);

      // Save purchase into localStorage
      try {
        const purchases = JSON.parse(localStorage.getItem('msmebooks_plan_purchases') || '[]');
        purchases.unshift({
          receipt,
          planId: plan.id,
          planName: plan.name,
          subscriberRole,
          gatewayId: selectedGateway.id,
          gatewayName: selectedGateway.name,
          gatewayRegion: selectedGateway.regionName,
          billingCycle: selectedBillingCycle,
          quantity: planQuantity, // 1 for monthly, 12 for yearly
          currency: currentCurrency,
          amount: formatAmount(totalUSD),
          jobCredits: plan.jobPostCredits,
          purchasedAt: nowIso,
          billingEmail,
          billingName,
          companyName,
        });
        localStorage.setItem('msmebooks_plan_purchases', JSON.stringify(purchases));

        // Candidate subscription activation
        if (plan.planCategory === 'candidate' || plan.targetAudience === 'candidate' || plan.applicationsLimitMonthly) {
          setCandidatePlan(
            plan.id as any,
            plan.name,
            plan.applicationsLimitMonthly || 'unlimited'
          );
        } else {
          // Employer credit vacancies
          const currentCredits = Number(localStorage.getItem('msmebooks_vacancies_credit') || '0');
          if (plan.jobPostCredits === 'unlimited') {
            localStorage.setItem('msmebooks_vacancies_credit', '9999');
          } else if (plan.jobPostCredits) {
            localStorage.setItem('msmebooks_vacancies_credit', String(currentCredits + plan.jobPostCredits));
          }
        }
      } catch (err) {
        console.error(err);
      }

      setIsProcessing(false);
      setIsCompleted(true);
      onSuccess(plan.jobPostCredits ?? 0, plan.name);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[94vh] transition-colors duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#14243A] via-[#193252] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#B5E61D] shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5E61D]">
                  Pan-African & Global Payment Gateway
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/15 text-white">
                  {discountInfo.label} Billing
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight mt-0.5">
                {isCompleted ? 'Subscription Active & Payment Confirmed' : `Subscribe to ${plan.name}`}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* World Currency Selector for Checkout */}
        <div className="px-6 py-2.5 bg-slate-100/90 dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              Checkout Billing Currency:
            </span>
            <span className="font-bold text-[#14243A] dark:text-white flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700">
              <span>{currentConfig.flag}</span>
              <span>
                {currentConfig.code} ({currentConfig.symbol})
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Change:</span>
            <select
              value={currentCurrency}
              onChange={(e) => setGlobalCurrency(e.target.value)}
              aria-label="Select billing currency for checkout"
              className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] rounded-lg border border-slate-200 dark:border-slate-700 outline-none cursor-pointer max-w-[200px] sm:max-w-none truncate"
            >
              <optgroup label="Default System Currency (Nigeria)">
                {currencies
                  .filter((c) => c.code === 'NGN')
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country} (Default)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Popular World Currencies">
                {currencies
                  .filter((c) => c.isPopular && c.code !== 'NGN')
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Africa">
                {currencies
                  .filter((c) => c.region === 'Africa' && !c.isPopular && c.code !== 'NGN')
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Americas">
                {currencies
                  .filter((c) => c.region === 'Americas' && !c.isPopular)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Europe">
                {currencies
                  .filter((c) => c.region === 'Europe' && !c.isPopular)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Middle East">
                {currencies
                  .filter((c) => c.region === 'Middle East' && !c.isPopular)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Asia">
                {currencies
                  .filter((c) => c.region === 'Asia' && !c.isPopular)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Oceania & Global">
                {currencies
                  .filter((c) => (c.region === 'Oceania' || c.region === 'Global') && !c.isPopular)
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.country}
                    </option>
                  ))}
              </optgroup>
            </select>

            <button
              type="button"
              onClick={() => setShowAddCountryModal(true)}
              className="px-2 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Add any country and currency"
            >
              <Plus className="w-3 h-3" />
              <span>+ Add Country</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {!isCompleted ? (
            <form onSubmit={handlePay} className="space-y-6">
              {/* 1. Target Subscriber Role Switcher */}
              <div className="bg-slate-50 dark:bg-[#0D1527] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Subscribing Entity Category:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Configured for your recruitment tier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSubscriberRole('employer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      subscriberRole === 'employer'
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 border-[#0066CC] dark:border-[#38BDF8] shadow-xs ring-1 ring-[#0066CC]/20'
                        : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Building2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Employer / Company</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Direct MSME requisitions & ATS payroll sync
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubscriberRole('agency')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      subscriberRole === 'agency'
                        ? 'bg-purple-50/80 dark:bg-purple-950/60 border-purple-500 dark:border-purple-400 shadow-xs ring-1 ring-purple-500/20'
                        : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Recruitment Agency</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Multi-client pipeline & candidate rosters
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubscriberRole('headhunter')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      subscriberRole === 'headhunter'
                        ? 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-500 dark:border-amber-400 shadow-xs ring-1 ring-amber-500/20'
                        : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Executive Headhunter</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Confidential executive mandates & search
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Order Summary, Plan Quantity & Currency */}
              <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                      Selected Subscription Plan
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Currency Switcher */}
                  <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 text-xs font-bold flex-wrap">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-1 hidden sm:inline">Currency:</span>
                    <select
                      value={currentCurrency}
                      onChange={(e) => setGlobalCurrency(e.target.value as any)}
                      aria-label="Checkout currency"
                      className="px-2 py-1 text-xs font-bold bg-slate-50 dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] rounded-lg border border-slate-200 dark:border-slate-700 outline-none cursor-pointer max-w-[160px] truncate"
                    >
                      <optgroup label="Default System Currency (Nigeria)">
                        {currencies
                          .filter((c) => c.code === 'NGN')
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.symbol}) - {c.country} (Default)
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Popular World Currencies">
                        {currencies
                          .filter((c) => c.isPopular && c.code !== 'NGN')
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.symbol}) - {c.country}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="All World Countries">
                        {currencies
                          .filter((c) => !c.isPopular && c.code !== 'NGN')
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.symbol}) - {c.country}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddCountryModal(true)}
                      className="px-2 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Add any country and currency"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>

                {/* Plan Term & Quantity Selector: 1 for monthly, 12 for yearly */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Select Subscription Term & Quantity:</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                      {selectedBillingCycle === 'yearly' ? 'Yearly: Qty 12 Mo (Best Value)' : 'Monthly: Qty 1 Mo'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(['monthly', 'yearly', 'quarterly', 'biyearly'] as BillingCycle[]).map((cycle) => {
                      const isSelected = selectedBillingCycle === cycle;
                      const info = BILLING_DISCOUNTS[cycle];
                      const qty = cycle === 'yearly' ? 12 : cycle === 'biyearly' ? 6 : cycle === 'quarterly' ? 3 : 1;

                      return (
                        <button
                          key={cycle}
                          type="button"
                          onClick={() => setSelectedBillingCycle(cycle)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-xs'
                              : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-[#1A284A] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs capitalize">{info.label}</span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#0066CC] dark:text-[#38BDF8]'
                              }`}
                            >
                              Qty: {qty}
                            </span>
                          </div>
                          <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {cycle === 'monthly' ? '1 Month Plan' : cycle === 'yearly' ? '12 Months (Save 25%)' : `${qty} Months`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Posting Capacity</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {plan.jobPostCredits === 'unlimited' ? 'Unlimited Vacancies' : `${plan.jobPostCredits} Vacancies`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Plan Quantity</span>
                    <span className="font-bold text-[#0066CC] dark:text-[#38BDF8] font-mono">
                      {planQuantity} Month{planQuantity > 1 ? 's' : ''} ({selectedBillingCycle})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Term Savings</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {discountInfo.discountPercent > 0 ? `${discountInfo.discountPercent}% Off` : 'Standard Rate'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Billed</span>
                    <span className="font-extrabold text-[#0066CC] dark:text-[#38BDF8] text-sm sm:text-base">
                      {formatPrice(totalUSD)}
                    </span>
                  </div>
                </div>

                {savingsUSD > 0 && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
                    <span>Discount Applied ({discountInfo.label} · Qty {planQuantity} Months):</span>
                    <span>Saved {formatPrice(savingsUSD)}</span>
                  </div>
                )}
              </div>

              {/* 3. Regional Payment Gateways Selection (The Core Feature) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Select Payment Gateway by Region</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    22+ Certified African & Global Gateways Supported
                  </span>
                </div>

                {/* Region Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {PAYMENT_REGIONS.map((region) => {
                    const isActive = selectedRegionId === region.id;
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => handleSelectRegion(region.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#0066CC] text-white shadow-xs ring-2 ring-[#0066CC]/30'
                            : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#223561]'
                        }`}
                      >
                        <span className="text-sm">{region.flag}</span>
                        <span>{region.shortLabel}</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">
                          {region.gatewaysCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Gateways Grid for the selected region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {filteredGateways.map((gw) => {
                    const isSelected = selectedGatewayId === gw.id;
                    return (
                      <div
                        key={gw.id}
                        onClick={() => setSelectedGatewayId(gw.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#0066CC] dark:border-[#38BDF8] ring-2 ring-[#0066CC]/20 shadow-xs'
                            : 'bg-white dark:bg-[#0D1527] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 hover:bg-slate-50/60 dark:hover:bg-[#142038]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors">
                              {gw.name}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-[#0066CC] border-[#0066CC] text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                            {gw.tagline}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                            {gw.methods[0]}
                          </span>
                          {gw.badge && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-100/70 dark:bg-blue-900/50 text-[#0066CC] dark:text-[#38BDF8] font-bold text-[9px]">
                              {gw.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Gateway Specific Checkout Inputs */}
              <div className="p-4 bg-slate-50/80 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Selected Rail: {selectedGateway.name} ({selectedGateway.regionName})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">256-bit Encrypted</span>
                </div>

                {/* Card Flow (Stripe, Paystack, Flutterwave, Yoco, Peach, DPO, Razorpay, Mollie, 2Checkout, Payfort) */}
                {selectedGateway.flowType === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 •••• •••• 4242"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* M-Pesa / Telco Mobile Money Flow */}
                {selectedGateway.flowType === 'mobile_money' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">Instant STK Push Notification:</span>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                          A direct SIM payment prompt will appear on your phone screen requesting your PIN.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Operator / Network
                        </label>
                        <select
                          value={selectedNetwork}
                          onChange={(e) => setSelectedNetwork(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value="Safaricom">🇰🇪 Safaricom M-Pesa</option>
                          <option value="Vodacom">🇹🇿 Vodacom M-Pesa</option>
                          <option value="MTN">🇬🇭 🇺🇬 MTN Mobile Money</option>
                          <option value="Orange">🇨🇲 🇸🇳 Orange Money</option>
                          <option value="EcoCash">🇿🇼 EcoCash (Zimbabwe)</option>
                          <option value="Airtel">🇰🇪 🇺🇬 Airtel Money</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Wallet Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            required
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="+254 7XX XXX XXX"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {!isStkPushed ? (
                      <button
                        type="button"
                        onClick={handleTriggerStkPush}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Send Test STK Push to Phone</span>
                      </button>
                    ) : (
                      <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>STK Push sent to {mobileNumber}. Check phone.</span>
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {stkConfirmed ? '✓ Authorized on Phone' : 'Awaiting PIN...'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Ozow Instant EFT Flow */}
                {selectedGateway.flowType === 'instant_eft' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Landmark className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">Automated South African Instant EFT:</span>
                        <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                          Direct real-time interbank clearance via Ozow without entering credit card numbers.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Your South African Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                        <option value="Capitec Bank">Capitec Bank (Capitec Pay)</option>
                        <option value="FNB">First National Bank (FNB)</option>
                        <option value="Standard Bank">Standard Bank South Africa</option>
                        <option value="ABSA">ABSA Bank</option>
                        <option value="Nedbank">Nedbank</option>
                        <option value="Investec">Investec Private Banking</option>
                        <option value="TymeBank">TymeBank</option>
                        <option value="Discovery Bank">Discovery Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PayPal Flow */}
                {selectedGateway.flowType === 'paypal' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-center space-y-2">
                    <div className="text-sm font-bold text-[#003087] dark:text-[#38BDF8]">
                      PayPal One-Touch Checkout
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                      Clicking submit will securely connect to PayPal to confirm your recurring subscription.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#131D35] rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      <span>✓ Global Buyer Protection Included</span>
                    </div>
                  </div>
                )}

                {/* Corporate B2B Flow (Transact Pay) */}
                {selectedGateway.flowType === 'corporate_b2b' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-100 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200">
                      <span className="font-bold">B2B Corporate Direct Clearing:</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Generated dedicated commercial invoice with automated bank reconciliation for HR and finance departments.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Corporate Billing Reference / PO Number
                      </label>
                      <input
                        type="text"
                        value={corporateAccountRef}
                        onChange={(e) => setCorporateAccountRef(e.target.value)}
                        placeholder="e.g. CORP-MSME-2026-X8"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* LigdiCash & Sahel Digital Wallet Flow */}
                {selectedGateway.flowType === 'wallet' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Sahel Digital Wallet Mobile Number (Burkina Faso / Mali / Niger)
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+226 70 00 00 00"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16233F] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Billing Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Billing Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Billing Representative Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="e.g. Olumide Adebayo"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Receipt Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="billing@company.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Agency / Headhunting Practice
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Sahara Commerce Technologies Ltd"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* 6. Submit Button & Security Notice */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Licensed payment processing via {selectedGateway.name}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authorizing with {selectedGateway.name}...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatPrice(totalUSD)} via {selectedGateway.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation & Invoice Screen */
            <div className="py-6 text-center space-y-6 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold mb-2">
                  <span>✓ Billed via {selectedGateway.name} ({selectedGateway.regionName})</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Subscription & Requisition Slots Active!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                  Your <strong className="text-[#0066CC] dark:text-[#38BDF8]">{plan.name}</strong> has been successfully credited for {billingName || companyName || 'your organization'}.
                </p>
              </div>

              {/* Digital Invoice Box */}
              <div className="p-5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold">Payment Gateway:</span>
                  <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">{selectedGateway.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Reference:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscriber Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {subscriberRole === 'employer' ? 'Employer / Company' : subscriberRole === 'agency' ? 'Recruiter / Agency' : 'Executive Headhunter'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan & Term Quantity:</span>
                  <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">
                    {plan.name} · Quantity: {planQuantity} Month{planQuantity > 1 ? 's' : ''} ({selectedBillingCycle})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credited Vacancies:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {plan.jobPostCredits === 'unlimited' ? 'Unlimited Postings' : `${plan.jobPostCredits} Active Requisitions`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billed Amount:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(totalUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Sent To:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{billingEmail}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A284A] dark:hover:bg-[#253966] text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Start Posting Vacancies
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Country & Currency Modal */}
      <AddCountryCurrencyModal
        isOpen={showAddCountryModal}
        onClose={() => setShowAddCountryModal(false)}
      />
    </div>
  );
};
