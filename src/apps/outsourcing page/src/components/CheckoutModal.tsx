import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  PhoneCall, 
  Check, 
  Building2, 
  FileText,
  Smartphone,
  Globe,
  Clock,
  Receipt,
  Printer,
  Pause,
  Play,
  Calendar,
  Zap,
  CheckCircle,
  QrCode,
  Tag,
  Percent
} from 'lucide-react';
import { CountryInfo, CurrencyCode, BillingCycle, PricingPlan } from '../types';
import { formatPrice } from '../utils/currency';
import { PAYMENT_GATEWAYS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { generateSubscriptionPDF } from '../utils/pdfGenerator';
import { MobileMoneyQRCode } from './MobileMoneyQRCode';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  customPlanConfig?: any | null;
  initialBillingCycle: BillingCycle;
  selectedCountry: CountryInfo;
  selectedCurrency: CurrencyCode;
  onPaymentSuccessAndEnterPortal: () => void;
  initialGateway?: string;
}

type CheckoutStep = 'entity' | 'payment' | 'simulating' | 'success';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  customPlanConfig,
  initialBillingCycle,
  selectedCountry,
  selectedCurrency,
  onPaymentSuccessAndEnterPortal,
  initialGateway,
}) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [cycle, setCycle] = useState<BillingCycle>(initialBillingCycle);
  const [step, setStep] = useState<CheckoutStep>('entity');
  const [paymentGateway, setPaymentGateway] = useState<string>(
    initialGateway || selectedCountry.defaultGateways[0] || 'paystack'
  );
  const [gatewayCategory, setGatewayCategory] = useState<'recommended' | 'all' | 'west' | 'east' | 'southern' | 'north_other'>('recommended');
  const [phoneNumber, setPhoneNumber] = useState<string>('+234 803 123 4567');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [downloadQuoteSuccess, setDownloadQuoteSuccess] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [lastDownloadedDoc, setLastDownloadedDoc] = useState<'receipt' | 'quote' | null>(null);
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // Discount & Promo Code states
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  
  // Business KYB Form
  const [companyName, setCompanyName] = useState<string>('Apex Retail Ventures Ltd');
  const [registrationNo, setRegistrationNo] = useState<string>('RC-1849204');
  const [taxId, setTaxId] = useState<string>('TIN-92847291');
  const [contactEmail, setContactEmail] = useState<string>('billing@apexventures.com');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [paymentMode, setPaymentMode] = useState<'checkout' | 'qr'>('checkout');

  // Success Receipt states
  const [countdown, setCountdown] = useState<number>(20);
  const [isCountdownPaused, setIsCountdownPaused] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>('MB-RC-2026-8942');

  // Sync cycle when modal opens or initialBillingCycle changes
  useEffect(() => {
    setCycle(initialBillingCycle);
  }, [initialBillingCycle, isOpen]);

  // Sync gateway when selectedCountry or initialGateway changes
  useEffect(() => {
    if (initialGateway) {
      setPaymentGateway(initialGateway);
      const gw = PAYMENT_GATEWAYS.find(g => g.id === initialGateway);
      if (gw) {
        if (gw.regions.includes('west_africa')) setGatewayCategory('west');
        else if (gw.regions.includes('east_africa')) setGatewayCategory('east');
        else if (gw.regions.includes('southern_africa')) setGatewayCategory('southern');
        else if (gw.regions.includes('other_africa')) setGatewayCategory('north_other');
        else setGatewayCategory('all');
      }
    } else if (selectedCountry?.defaultGateways?.[0]) {
      setPaymentGateway(selectedCountry.defaultGateways[0]);
      setGatewayCategory('recommended');
    }
  }, [initialGateway, selectedCountry, isOpen]);

  // Dynamic filtered list of payment gateways
  const filteredGateways = useMemo(() => {
    if (gatewayCategory === 'recommended') {
      const countryDefaults = selectedCountry.defaultGateways || [];
      const primary = PAYMENT_GATEWAYS.filter(g => countryDefaults.includes(g.id));
      const secondary = PAYMENT_GATEWAYS.filter(
        g => !countryDefaults.includes(g.id) && g.regions.includes(selectedCountry.region)
      );
      const global = PAYMENT_GATEWAYS.filter(
        g => !countryDefaults.includes(g.id) && !secondary.includes(g) && g.regions.includes('global')
      );
      const combined = [...primary, ...secondary, ...global];
      return combined.length > 0 ? combined : PAYMENT_GATEWAYS;
    }
    if (gatewayCategory === 'west') {
      return PAYMENT_GATEWAYS.filter(g => g.regions.includes('west_africa'));
    }
    if (gatewayCategory === 'east') {
      return PAYMENT_GATEWAYS.filter(g => g.regions.includes('east_africa'));
    }
    if (gatewayCategory === 'southern') {
      return PAYMENT_GATEWAYS.filter(g => g.regions.includes('southern_africa'));
    }
    if (gatewayCategory === 'north_other') {
      return PAYMENT_GATEWAYS.filter(g => g.regions.includes('other_africa'));
    }
    return PAYMENT_GATEWAYS;
  }, [gatewayCategory, selectedCountry]);

  // Find currently active gateway metadata
  const activeGatewayObj = useMemo(() => {
    return PAYMENT_GATEWAYS.find(g => g.id === paymentGateway) || PAYMENT_GATEWAYS[0];
  }, [paymentGateway]);

  // Pricing calculations with Cadence Discount, Promo Discount & 7.5% VAT
  const isCustom = !!customPlanConfig;
  const planName = isCustom ? customPlanConfig.title : selectedPlan?.name || 'Growth — Business Outsourcing';
  const periodMonths = cycle === 'annual' ? 12 : cycle === 'bi-yearly' ? 6 : cycle === 'quarterly' ? 3 : 1;

  // Undiscounted monthly benchmark
  const baseMonthlyUndiscountedUSD = isCustom
    ? Math.round((customPlanConfig.monthlyUSD || 290) / (1 - (cycle === 'annual' ? 0.2 : cycle === 'bi-yearly' ? 0.12 : cycle === 'quarterly' ? 0.05 : 0)))
    : selectedPlan?.basePriceUSD.monthly || 290;

  const rawMonthlyUSD = isCustom
    ? customPlanConfig.monthlyUSD
    : selectedPlan?.basePriceUSD[cycle] || 290;

  const grossSubtotalUSD = baseMonthlyUndiscountedUSD * periodMonths;
  const afterCadenceSubtotalUSD = rawMonthlyUSD * periodMonths;
  const cadenceDiscountUSD = Math.max(0, grossSubtotalUSD - afterCadenceSubtotalUSD);
  const cadenceDiscountPercent = grossSubtotalUSD > 0 ? Math.round((cadenceDiscountUSD / grossSubtotalUSD) * 100) : 0;

  const promoDiscountUSD = promoDiscountPercent > 0 ? Math.round(afterCadenceSubtotalUSD * (promoDiscountPercent / 100)) : 0;
  const totalDiscountUSD = cadenceDiscountUSD + promoDiscountUSD;

  // Net taxable subtotal after all discounts
  const subtotalUSD = Math.max(0, afterCadenceSubtotalUSD - promoDiscountUSD);
  const VAT_RATE = 0.075; // 7.5% statutory VAT
  const vatUSD = Math.round(subtotalUSD * VAT_RATE);
  const grandTotalUSD = subtotalUSD + vatUSD;

  const AVAILABLE_PROMOS: Record<string, { percent: number; label: string }> = {
    SME10: { percent: 10, label: '10% SME Growth Grant' },
    AFRICA15: { percent: 15, label: '15% Pan-African Expansion' },
    OHADA20: { percent: 20, label: '20% OHADA / Francophone Launch' },
  };

  const handleApplyPromo = (codeOverride?: string) => {
    const code = (codeOverride ?? promoInput).trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code or pick a voucher below.');
      return;
    }
    const found = AVAILABLE_PROMOS[code];
    if (!found) {
      setPromoError(`Promo code "${code}" is invalid. Try SME10, AFRICA15, or OHADA20.`);
      return;
    }
    setPromoError('');
    setPromoInput(code);
    setAppliedPromoCode(code);
    setPromoDiscountPercent(found.percent);
    toast.success(`${found.label} applied (-${found.percent}% off)!`, 'Discount Applied');
  };

  const handleRemovePromo = () => {
    setAppliedPromoCode(null);
    setPromoDiscountPercent(0);
    setPromoInput('');
    setPromoError('');
    toast.info('Promo discount removed from checkout summary.', 'Promo Removed');
  };

  // Trigger celebratory confetti and toast notification when payment succeeds
  useEffect(() => {
    if (step === 'success') {
      // 1. Toast notification immediate feedback
      toast.success(
        `${formatPrice(grandTotalUSD, selectedCurrency, language)} paid via ${activeGatewayObj.name}. Official Receipt #${receiptNumber} generated.`,
        'Payment Verified & Settled!'
      );

      // 2. Confetti celebratory cannon
      try {
        // Center burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#a3e635', '#3b82f6', '#10b981', '#f59e0b', '#38bdf8']
        });

        // Left cannon
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#a3e635', '#3b82f6', '#38bdf8']
          });
        }, 200);

        // Right cannon
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#a3e635', '#3b82f6', '#38bdf8']
          });
        }, 400);
      } catch (err) {
        console.error('Confetti error', err);
      }
    }
  }, [step]);

  // Auto-transition countdown timer when in success step
  useEffect(() => {
    if (step === 'success' && !isCountdownPaused) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            onPaymentSuccessAndEnterPortal();
            return 0;
          }
          return prev - 1;
        });
      }, 950);

      return () => clearInterval(interval);
    }
  }, [step, isCountdownPaused, onClose, onPaymentSuccessAndEnterPortal]);

  if (!isOpen) return null;

  // Current visual step progress calculation
  const getStepProgress = () => {
    switch (step) {
      case 'entity':
        return { currentStep: 1, percent: 33, label: 'Step 1 of 3 (2 steps remaining)' };
      case 'payment':
        return { currentStep: 2, percent: 66, label: 'Step 2 of 3 (1 step remaining)' };
      case 'simulating':
      case 'success':
        return { currentStep: 3, percent: 100, label: 'Step 3 of 3 (Payment Complete & Receipt)' };
    }
  };

  const progress = getStepProgress();

  const handleEntitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !registrationNo.trim() || !contactEmail.trim()) {
      setValidationError('Please complete all required company registration details.');
      return;
    }
    setValidationError('');
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setValidationError('Please accept the Engagement Terms & Service Agreement to continue.');
      return;
    }
    setValidationError('');
    setStep('simulating');
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setReceiptNumber(`MB-RC-2026-${randomCode}`);
    setTimeout(() => {
      setStep('success');
      setCountdown(20);
    }, 1800);
  };

  const handleSimulatedScanPay = () => {
    setValidationError('');
    setStep('simulating');
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setReceiptNumber(`MB-RC-2026-${randomCode}`);
    toast.info(`Mobile wallet authorized via dynamic QR code (${activeGatewayObj.name})`, 'Handset Payment Detected');
    setTimeout(() => {
      setStep('success');
      setCountdown(20);
    }, 1800);
  };

  const handleDownloadPDF = (type: 'receipt' | 'quote' = 'receipt') => {
    setIsGeneratingPdf(true);
    setLastDownloadedDoc(type);
    try {
      generateSubscriptionPDF({
        receiptNumber,
        documentType: type,
        language,
        companyName: companyName.trim() || 'Apex Retail Ventures Ltd',
        registrationNo: registrationNo.trim() || 'RC-1849204',
        taxId: taxId.trim() || 'TIN-92847291',
        contactEmail: contactEmail.trim() || 'billing@apexventures.com',
        planName,
        billingCycle: cycle,
        periodMonths,
        rawMonthlyUSD,
        grossSubtotalUSD,
        cadenceDiscountUSD,
        promoCode: appliedPromoCode || undefined,
        promoDiscountPercent,
        promoDiscountUSD,
        totalDiscountUSD,
        subtotalUSD,
        vatUSD,
        grandTotalUSD,
        selectedCurrency,
        selectedCountry,
        gatewayName: activeGatewayObj.name,
        gatewayId: activeGatewayObj.id,
        paymentDate: new Date(),
      });

      const editionTag = language === 'fr' ? 'Édition Légale OHADA (FR)' : 'EN Commercial Edition';
      if (type === 'receipt') {
        setDownloadSuccess(true);
        toast.success(
          `Official PDF Tax Receipt #${receiptNumber} (${editionTag}) downloaded successfully!`,
          'PDF Receipt Exported'
        );
        setTimeout(() => setDownloadSuccess(false), 4500);
      } else {
        setDownloadQuoteSuccess(true);
        toast.success(
          `Formal Outsourcing Service Quote (${editionTag}) for ${planName} generated & downloaded.`,
          'PDF Service Quote Exported'
        );
        setTimeout(() => setDownloadQuoteSuccess(false), 4500);
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      toast.error('Unable to generate PDF document. Please try again.', 'Export Failed');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrintReceipt = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3500);
    try {
      window.print();
    } catch {
      // safe fallback if iframe blocks print
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-lime-400/20">
              MB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-grotesk text-white">
                  Secure Outsourcing Subscription Checkout
                </h3>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-800 hidden sm:inline">
                  {selectedCountry.flag} {selectedCurrency} Billing
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                256-bit TLS Encrypted • Tokenized via Licensed Payment Partners
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Progress Bar & Stepper Component */}
        <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Checkout Progress
            </span>
            <span className="text-[11px] font-bold text-lime-400 font-mono">
              {progress.label}
            </span>
          </div>

          {/* Stepper Steps Row */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            
            {/* Step 1 Node */}
            <div className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
              progress.currentStep === 1 
                ? 'bg-blue-900/40 border border-blue-600/50 text-white' 
                : progress.currentStep > 1 
                  ? 'text-lime-400' 
                  : 'text-slate-500'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                progress.currentStep > 1 
                  ? 'bg-lime-400 text-slate-950' 
                  : progress.currentStep === 1 
                    ? 'bg-blue-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {progress.currentStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </div>
              <span className="font-semibold truncate">Entity Profile</span>
            </div>

            {/* Step 2 Node */}
            <div className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
              progress.currentStep === 2 
                ? 'bg-blue-900/40 border border-blue-600/50 text-white' 
                : progress.currentStep > 2 
                  ? 'text-lime-400' 
                  : 'text-slate-500'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                progress.currentStep > 2 
                  ? 'bg-lime-400 text-slate-950' 
                  : progress.currentStep === 2 
                    ? 'bg-blue-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {progress.currentStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
              </div>
              <span className="font-semibold truncate">Payment Gateway</span>
            </div>

            {/* Step 3 Node */}
            <div className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
              progress.currentStep === 3 
                ? 'bg-lime-950/60 border border-lime-600/50 text-lime-400' 
                : 'text-slate-500'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                progress.currentStep === 3 
                  ? 'bg-lime-400 text-slate-950 animate-bounce' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {step === 'success' ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
              </div>
              <span className="font-semibold truncate">Confirmation</span>
            </div>
          </div>

          {/* Smooth Continuous Linear Progress Track */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-lime-400 to-lime-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* Validation Notice */}
          {validationError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center justify-between">
              <span>{validationError}</span>
              <button 
                type="button" 
                onClick={() => setValidationError('')} 
                className="text-red-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* STEP 1: ENTITY PROFILE & ORDER SUMMARY */}
          {step === 'entity' && (
            <form onSubmit={handleEntitySubmit} className="space-y-6">
              
              {/* Order Summary Box with Discount Section & 7.5% VAT */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                      Selected Plan
                    </span>
                    <h4 className="text-base font-bold text-white font-grotesk">{planName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block mb-1">Billing Cadence</span>
                    {!isCustom ? (
                      <div className="inline-flex bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[10px] font-bold">
                        {(['monthly', 'quarterly', 'bi-yearly', 'annual'] as BillingCycle[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCycle(c)}
                            className={`px-2 py-1 rounded-md transition cursor-pointer ${
                              cycle === c
                                ? 'bg-lime-400 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {c === 'bi-yearly' ? '6M (-12%)' : c === 'annual' ? '12M (-20%)' : c === 'quarterly' ? '3M (-5%)' : '1M'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-blue-300 uppercase">
                        {cycle === 'bi-yearly' ? 'Bi-Yearly (6 Mo)' : cycle}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dedicated Discount & Promo Voucher Section */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Discounts & Promo Voucher</span>
                    </span>
                    {totalDiscountUSD > 0 && (
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/60 px-2 py-0.5 rounded-full">
                        Saving {formatPrice(totalDiscountUSD, selectedCurrency, language)}!
                      </span>
                    )}
                  </div>

                  {/* Promo Input Row */}
                  {appliedPromoCode ? (
                    <div className="flex items-center justify-between p-2 bg-emerald-950/50 border border-emerald-600/50 rounded-lg text-xs">
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          Code <strong className="font-mono text-white">{appliedPromoCode}</strong> applied (-{promoDiscountPercent}% off)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[11px] text-rose-300 hover:text-rose-200 font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoError) setPromoError('');
                          }}
                          placeholder="Enter promo code (e.g. SME10, AFRICA15, OHADA20)"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case outline-none focus:ring-1 focus:ring-lime-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyPromo()}
                          className="px-3.5 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs rounded-lg transition cursor-pointer shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <div className="text-[11px] text-rose-400">{promoError}</div>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400">Available vouchers:</span>
                        {Object.entries(AVAILABLE_PROMOS).map(([code, meta]) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleApplyPromo(code)}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-lime-300 border border-slate-700 font-mono font-bold transition cursor-pointer"
                            title={meta.label}
                          >
                            {code} (-{meta.percent}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Itemized Financial Breakdown including Discounts & 7.5% VAT */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Standard Plan Rate ({periodMonths} months @ {formatPrice(baseMonthlyUndiscountedUSD, selectedCurrency, language)}/mo):</span>
                    <span className="font-semibold text-white">{formatPrice(grossSubtotalUSD, selectedCurrency, language)}</span>
                  </div>

                  {cadenceDiscountUSD > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Multi-Month Billing Discount ({cycle.toUpperCase()} ~{cadenceDiscountPercent}% off):
                      </span>
                      <span>-{formatPrice(cadenceDiscountUSD, selectedCurrency, language)}</span>
                    </div>
                  )}

                  {promoDiscountUSD > 0 && appliedPromoCode && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Promo Voucher ({appliedPromoCode} - {promoDiscountPercent}% off):
                      </span>
                      <span>-{formatPrice(promoDiscountUSD, selectedCurrency, language)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-1 border-t border-slate-700/60">
                    <span className="text-slate-200 font-semibold">Net Taxable Subtotal (Excl. VAT):</span>
                    <span className="font-bold text-white">{formatPrice(subtotalUSD, selectedCurrency, language)}</span>
                  </div>

                  <div className="flex justify-between text-amber-300/90 font-medium">
                    <span>Statutory Value Added Tax — VAT (7.5%):</span>
                    <span>+{formatPrice(vatUSD, selectedCurrency, language)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Client Onboarding & Setup Fee:</span>
                    <span className="text-emerald-400 font-bold">WAIVED ($0)</span>
                  </div>

                  <div className="flex justify-between pt-2.5 border-t border-slate-700 text-sm font-extrabold text-lime-400">
                    <span>Total Due Today (Incl. 7.5% VAT):</span>
                    <span className="font-grotesk text-base">{formatPrice(grandTotalUSD, selectedCurrency, language)}</span>
                  </div>
                </div>
              </div>

              {/* KYB Business Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    Step 1: Business Registration & Billing Profile
                  </h4>
                  <span className="text-[11px] text-slate-400">KYB Verified</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Registered Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Global Ltd"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Company Reg / RC Number *</label>
                    <input
                      type="text"
                      required
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      placeholder="e.g. RC-1849204"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Finance / Tax ID (TIN/VAT)</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. TIN-92847291"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Finance Notification Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="billing@yourdomain.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>
              </div>

              {/* Continue to Step 2 */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Step 2: Payment Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY & SLA ACCEPTANCE */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">

              {/* Order quick recap */}
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Subscribing entity:</span>
                  <div className="font-bold text-white">{companyName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF('quote')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                    title="Download official PDF service quote before paying"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    <span>Download PDF Quote ({language.toUpperCase()})</span>
                  </button>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {totalDiscountUSD > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-700/60">
                          -{formatPrice(totalDiscountUSD, selectedCurrency, language)} saved
                        </span>
                      )}
                      <span className="text-slate-400">Total (incl. 7.5% VAT):</span>
                    </div>
                    <div className="font-bold text-lime-400 text-sm font-grotesk">{formatPrice(grandTotalUSD, selectedCurrency, language)}</div>
                  </div>
                </div>
              </div>

              {/* Payment Mode Selector: Web/Card vs Dynamic Mobile Money QR */}
              <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('checkout')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                      paymentMode === 'checkout'
                        ? 'bg-lime-400 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card / Web SIM Push</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('qr')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                      paymentMode === 'qr'
                        ? 'bg-lime-400 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Dynamic Mobile Money QR</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-mono hidden sm:inline">
                      Scan & Pay
                    </span>
                  </button>
                </div>
              </div>

              {/* Regional Payment Gateway Selector */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-lime-400" />
                    Step 2: Choose Payment Gateway ({PAYMENT_GATEWAYS.length} Pan-African & Global Options)
                  </h4>
                  <span className="text-[11px] text-lime-400 font-semibold flex items-center gap-1">
                    <span>{selectedCountry.flag}</span>
                    <span>Local {selectedCountry.name} Settlement</span>
                  </span>
                </div>

                {/* Regional Filter Switcher Tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('recommended')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      gatewayCategory === 'recommended'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>Recommended ({selectedCountry.name})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('west')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      gatewayCategory === 'west'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    West Africa (FedaPay, CinetPay, LigdiCash...)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('southern')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      gatewayCategory === 'southern'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Southern Africa (Paynow, Ozow...)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('north_other')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      gatewayCategory === 'north_other'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    North Africa (Payfort / Amazon...)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('east')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      gatewayCategory === 'east'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    East Africa (M-Pesa, Pesapal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayCategory('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      gatewayCategory === 'all'
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({PAYMENT_GATEWAYS.length})
                  </button>
                </div>

                {/* Gateway Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredGateways.map((gw) => {
                    const isSelected = paymentGateway === gw.id;
                    return (
                      <label
                        key={gw.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition relative ${
                          isSelected
                            ? 'bg-lime-950/30 border-lime-400 ring-1 ring-lime-400/50 text-white'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gateway"
                          checked={isSelected}
                          onChange={() => setPaymentGateway(gw.id)}
                          className="mt-1 accent-lime-400 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                              <span className="text-base">{gw.logo}</span>
                              <span className="truncate">{gw.name}</span>
                            </span>
                            {gw.badge && (
                              <span className="text-[9px] font-bold bg-lime-950 text-lime-400 border border-lime-800 px-1.5 py-0.2 rounded shrink-0">
                                {gw.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            {gw.paymentMethods.slice(0, 3).join(' • ')}
                            {gw.paymentMethods.length > 3 && ' + more'}
                          </div>
                          <div className="text-[9px] text-lime-300/80 mt-0.5 font-mono">
                            Supports: {gw.supportedCurrencies.join(', ')} • 0% FX surcharge
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Interactive Payment Fields: Dynamic QR Code vs Direct Form */}
                {paymentMode === 'qr' ? (
                  <div className="animate-in fade-in duration-200">
                    <MobileMoneyQRCode
                      gatewayId={paymentGateway}
                      gatewayName={activeGatewayObj.name}
                      gatewayLogo={activeGatewayObj.logo}
                      amountFormatted={formatPrice(grandTotalUSD, selectedCurrency, language)}
                      currency={selectedCurrency}
                      country={selectedCountry}
                      companyName={companyName}
                      referenceNumber={receiptNumber}
                      phoneNumber={phoneNumber}
                      onSimulateScanSuccess={handleSimulatedScanPay}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Gateway-Specific Interactive Field */}
                    {['fedapay', 'cinetpay', 'ligdicash', 'paynow', 'mpesa'].includes(paymentGateway) && (
                      <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-200 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-lime-400" />
                            {paymentGateway === 'fedapay' && 'FedaPay Mobile Money Account (Benin, Togo, West Africa)'}
                            {paymentGateway === 'cinetpay' && 'CinetPay UEMOA Mobile Money (Côte d’Ivoire, Senegal, Cameroon)'}
                            {paymentGateway === 'ligdicash' && 'LigdiCash Mobile Wallet (Burkina Faso, Sahel)'}
                            {paymentGateway === 'paynow' && 'Paynow EcoCash / OneMoney / InnBucks Number (Zimbabwe)'}
                            {paymentGateway === 'mpesa' && 'M-Pesa STK Push / Safaricom Mobile (Kenya, Tanzania)'}
                          </span>
                          <span className="text-[10px] text-lime-400 font-mono font-semibold">
                            Instant PIN Prompt
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder={
                              paymentGateway === 'paynow'
                                ? '+263 77 123 4567'
                                : paymentGateway === 'fedapay'
                                ? '+229 97 12 34 56'
                                : paymentGateway === 'cinetpay'
                                ? '+225 07 12 34 56'
                                : paymentGateway === 'ligdicash'
                                ? '+226 70 12 34 56'
                                : '+254 712 345 678'
                            }
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-lime-400"
                          />
                          <span className="text-[11px] text-slate-400 self-center hidden sm:inline">
                            Direct authorization push on handset
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentGateway === 'payfort' && (
                      <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-200 flex items-center gap-2.5 animate-in fade-in">
                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Payfort (Amazon Payment Services) tokenizes Meeza local cards, Fawry reference codes, ValU installments, and international cards with 3D Secure 2.0.
                        </span>
                      </div>
                    )}

                    {paymentGateway === 'ozow' && (
                      <div className="p-3 bg-indigo-950/30 border border-indigo-800/50 rounded-xl text-xs text-indigo-200 flex items-center gap-2.5 animate-in fade-in">
                        <Building className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          Ozow connects directly to Absa, Capitec, FNB, Nedbank, Standard Bank, and Investec with zero card transaction surcharges.
                        </span>
                      </div>
                    )}

                    {/* Quick Switcher Prompt to Dynamic QR Code */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <QrCode className="w-4 h-4 text-lime-400 shrink-0" />
                        <span>Prefer scanning with your mobile money wallet on your phone?</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('qr')}
                        className="px-3 py-1.5 rounded-xl bg-lime-400/15 hover:bg-lime-400/25 text-lime-300 border border-lime-400/40 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5 text-lime-400" />
                        <span>Generate {activeGatewayObj.name} QR Code</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="checkout-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-lime-400 cursor-pointer"
                />
                <label htmlFor="checkout-terms" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
                  I agree to the <span className="text-slate-200 font-semibold underline">MsmeBooks Service Level Agreement (SLA)</span>, Data Processing Agreement (NDPR & POPIA compliant), and recurring billing authorization. Subscriptions may be cancelled anytime before the next renewal date.
                </label>
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('entity')}
                  className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {paymentMode === 'qr' ? (
                    <>
                      <QrCode className="w-4 h-4 text-slate-950" />
                      <span>Confirm QR Transfer ({formatPrice(grandTotalUSD, selectedCurrency, language)}) & Activate</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Pay {formatPrice(grandTotalUSD, selectedCurrency, language)} via {activeGatewayObj.name} & Complete</span>
                    </>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS DETAILED RECEIPT VIEW & SERVICE ACTIVATION TIMELINE */}
          {step === 'success' && (
            <div className="py-4 px-1 sm:px-2 text-left space-y-5 relative">
              
              {/* Top Celebration Banner with Lottie/CSS-Style Micro-Animation */}
              <div className="text-center space-y-3 pb-2 flex flex-col items-center">
                
                {/* Micro-Animation Celebration Badge */}
                <div className="relative flex items-center justify-center my-1">
                  {/* Outer Pulsing Aura Ring */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-tr from-lime-400/30 via-emerald-500/30 to-blue-500/30 blur-md pointer-events-none"
                  />
                  
                  {/* Rotating Orbital Dashed Ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2.5 rounded-full border border-dashed border-lime-400/50 pointer-events-none"
                  />

                  {/* Core Spring Pop-In Seal */}
                  <motion.div
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 14, stiffness: 220 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-lime-400 via-lime-300 to-emerald-400 flex items-center justify-center text-slate-950 shadow-xl shadow-lime-400/30 relative z-10"
                  >
                    {/* Drawn Checkmark Path */}
                    <svg className="w-8 h-8 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
                      />
                    </svg>
                  </motion.div>

                  {/* Floating Celebratory Micro-Sparks */}
                  <motion.div
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                    className="absolute -top-1 -right-3 text-lime-400"
                  >
                    <Sparkles className="w-4 h-4 fill-lime-400" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: [1, 1.2, 1], y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: 0.6 }}
                    className="absolute -bottom-1 -left-3 text-emerald-400"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                  </motion.div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lime-950/80 border border-lime-800 text-lime-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Payment Authorized & Confirmed</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-white">
                  Subscription Receipt & Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Thank you, <span className="text-white font-bold">{companyName}</span>! Your subscription payment has been cleared and your dedicated accounting pod is initializing.
                </p>
              </div>

              {/* Comprehensive Official Receipt Card with Spring Unfurl & Certified Stamp */}
              <motion.div 
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-slate-950/95 border-2 border-lime-400/60 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-md"
              >
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-lime-400/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
                
                {/* Receipt Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-lime-400/20">
                      MB
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-grotesk flex items-center gap-2">
                        <span>MsmeBooks Outsourcing Voucher</span>
                        <motion.div
                          initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                          animate={{ scale: 1, opacity: 1, rotate: -8 }}
                          transition={{ delay: 0.35, type: 'spring', damping: 13, stiffness: 300 }}
                          className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/90 text-emerald-300 border border-emerald-500 px-2 py-0.5 rounded font-mono font-black uppercase shadow-xs"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>PAID & VERIFIED</span>
                        </motion.div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Receipt Reference: <span className="text-slate-200 font-mono font-bold">#{receiptNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-400 space-y-1.5">
                    <div className="flex sm:justify-end items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold flex sm:justify-end items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Settlement Status: Cleared</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end pt-0.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/70"
                        title="PDF copy dynamically localized from active Language context"
                      >
                        {language === 'fr' ? 'FR • Conforme OHADA / TVA 7,5%' : 'EN • Commercial Tax Format'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF('receipt')}
                        disabled={isGeneratingPdf}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 border border-lime-400/50 transition cursor-pointer flex items-center gap-1"
                        title="Download official PDF Receipt"
                      >
                        <Download className="w-2.5 h-2.5 text-lime-400" />
                        <span>PDF Receipt ({language.toUpperCase()})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF('quote')}
                        disabled={isGeneratingPdf}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center gap-1"
                        title="Download formal Service Quote PDF"
                      >
                        <FileText className="w-2.5 h-2.5 text-blue-400" />
                        <span>PDF Quote ({language.toUpperCase()})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1. Selected Gateway & Transaction Summary */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-lime-400" />
                      Payment Gateway & Settlement Summary
                    </span>
                    <span className="text-[10px] text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-800 font-bold">
                      {activeGatewayObj.badge || 'Licensed Regional Gateway'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">Selected Payment Gateway:</span>
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <span className="text-xl">{activeGatewayObj.logo}</span>
                        <span>{activeGatewayObj.name}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">Payment Channel & Identifier:</span>
                      <div className="text-slate-200 font-medium">
                        {paymentMode === 'qr' ? (
                          <span className="flex items-center gap-1.5 font-mono text-lime-300">
                            <QrCode className="w-3.5 h-3.5 text-lime-400" />
                            {activeGatewayObj.name} Dynamic Mobile Money QR (Settled)
                          </span>
                        ) : ['fedapay', 'cinetpay', 'ligdicash', 'paynow', 'mpesa'].includes(paymentGateway) ? (
                          <span className="flex items-center gap-1.5 font-mono text-lime-300">
                            <Smartphone className="w-3.5 h-3.5 text-lime-400" />
                            {phoneNumber} (Mobile Wallet Prompt)
                          </span>
                        ) : paymentGateway === 'payfort' ? (
                          <span>Meeza / Fawry / 3D Secure Card Token</span>
                        ) : paymentGateway === 'ozow' ? (
                          <span>Automated Instant Bank EFT</span>
                        ) : (
                          <span>{activeGatewayObj.paymentMethods.slice(0, 2).join(' / ')}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">Transaction Authorization Code:</span>
                      <div className="font-mono text-blue-300 text-xs font-semibold">
                        TXN-{paymentGateway.toUpperCase()}-{receiptNumber.replace(/[^0-9]/g, '').slice(-6)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">Settlement Jurisdiction & Currencies:</span>
                      <div className="text-slate-200 font-medium flex items-center gap-1.5">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name} ({selectedCurrency} • Zero FX Spread)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Total Amount & Subscription Breakdown */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-blue-400" />
                      Subscription Plan & Financial Breakdown
                    </span>
                    <span className="text-xs font-bold text-blue-300 uppercase">
                      {cycle === 'bi-yearly' ? 'Bi-Yearly (6 Months)' : cycle.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Subscribed Plan:</span>
                      <span className="font-bold text-white text-sm">{planName}</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Gross Plan Subscription ({periodMonths} months @ {formatPrice(baseMonthlyUndiscountedUSD, selectedCurrency, language)}/mo):</span>
                      <span className="text-slate-200">{formatPrice(grossSubtotalUSD, selectedCurrency, language)}</span>
                    </div>

                    {cadenceDiscountUSD > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Billing Cycle Savings ({cycle.toUpperCase()}):</span>
                        <span>-{formatPrice(cadenceDiscountUSD, selectedCurrency, language)}</span>
                      </div>
                    )}

                    {promoDiscountUSD > 0 && appliedPromoCode && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Promo Code Discount ({appliedPromoCode} - {promoDiscountPercent}%):</span>
                        <span>-{formatPrice(promoDiscountUSD, selectedCurrency, language)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-300 font-medium pt-1 border-t border-slate-800/80">
                      <span>Net Taxable Subtotal (Excl. VAT):</span>
                      <span className="text-white">{formatPrice(subtotalUSD, selectedCurrency, language)}</span>
                    </div>

                    <div className="flex justify-between text-amber-300/90">
                      <span>Statutory VAT / Sales Surcharge (7.5%):</span>
                      <span>+{formatPrice(vatUSD, selectedCurrency, language)}</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Client Onboarding, Account Setup & Vault:</span>
                      <span className="text-emerald-400 font-bold">WAIVED ($0)</span>
                    </div>

                    {/* Total Amount Paid Highlight Bar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between bg-lime-950/40 p-3 rounded-xl border border-lime-500/40">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400 block">
                          Total Amount Paid & Cleared
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Includes 7.5% VAT, applied discounts & full pod allocation
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-grotesk text-2xl sm:text-3xl font-black text-lime-400 block">
                          {formatPrice(grandTotalUSD, selectedCurrency, language)}
                        </span>
                        <span className="text-[10px] font-bold bg-lime-400 text-slate-950 px-2 py-0.5 rounded">
                          PAID IN FULL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Expected Service Activation Time (Prominent Highlight) */}
                <div className="bg-gradient-to-br from-blue-950/60 via-slate-900 to-lime-950/40 rounded-xl p-4 sm:p-5 border border-lime-500/40 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center border border-lime-400/40">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white font-grotesk">
                          Expected Service Activation Schedule
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Automated onboarding pipeline initiated via SLA contract
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400 text-slate-950 text-xs font-black self-start sm:self-auto shadow-sm">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Est. Full Activation: &lt; 15 Minutes</span>
                    </div>
                  </div>

                  {/* Activation Milestones Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Portal & Vault</span>
                      </div>
                      <div className="text-[11px] text-white font-semibold">Immediate Access</div>
                      <p className="text-[10px] text-slate-400">
                        Upload historical statements & receipts instantly.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-blue-800/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Dedicated Pod</span>
                      </div>
                      <div className="text-[11px] text-white font-semibold">&lt; 15 Minutes</div>
                      <p className="text-[10px] text-slate-400">
                        Certified bookkeeper and payroll lead assigned to {companyName}.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-lime-800/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-lime-400 font-bold">
                        <PhoneCall className="w-3.5 h-3.5 text-lime-400" />
                        <span>Senior Lead Call</span>
                      </div>
                      <div className="text-[11px] text-white font-semibold">Within 2 Business Hours</div>
                      <p className="text-[10px] text-slate-400">
                        Kickoff video session to align your general ledger and tax schedule.
                      </p>
                    </div>
                  </div>

                  {/* 3-Stage Progress Tracker Visual */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Onboarding Stage Progress:</span>
                      <span className="text-lime-400 font-mono font-bold">Stage 2 of 3 Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
                      <div className="p-1.5 bg-emerald-950 border border-emerald-600 rounded-lg text-emerald-300 font-bold flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>1. Payment Settled</span>
                      </div>
                      <div className="p-1.5 bg-blue-950 border border-blue-500 rounded-lg text-blue-300 font-bold flex items-center justify-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>2. Pod Provisioning</span>
                      </div>
                      <div className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 font-medium">
                        <span>3. Team Kickoff Call</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Subscribing Entity Profile & Legal Notice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Subscribing Business:</span>
                    <div className="font-bold text-white">{companyName}</div>
                    <div className="text-[11px] text-slate-400">Reg: {registrationNo} • Tax ID: {taxId || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Official Invoicing Email:</span>
                    <div className="font-bold text-white">{contactEmail}</div>
                    <div className="text-[11px] text-slate-400">NDPR, POPIA & GAAP Compliant Electronic Receipt</div>
                  </div>
                </div>

              </motion.div>

              {/* Status alerts for Download & Print actions */}
              {downloadSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Official PDF Tax Receipt #{receiptNumber} downloaded to your downloads folder!</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                    PDF READY
                  </span>
                </div>
              )}

              {downloadQuoteSuccess && (
                <div className="p-3 bg-blue-950/80 border border-blue-500/60 rounded-xl text-blue-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Formal Service Quote PDF ({planName}) downloaded successfully!</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700">
                    30D GUARANTEE
                  </span>
                </div>
              )}

              {printSuccess && (
                <div className="p-2.5 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                  <Printer className="w-4 h-4 text-lime-400" />
                  <span>Printer dialogue opened for official receipt generation!</span>
                </div>
              )}

              {/* Auto-launching Portal Progress and Countdown Pause Control */}
              <div className="bg-slate-800/70 rounded-2xl p-3.5 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">Auto-launching Client Workspace:</span>
                    <span className="text-lime-400 font-bold font-grotesk text-sm">
                      {isCountdownPaused ? 'Paused' : `in ${countdown}s...`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-600 transition cursor-pointer flex items-center gap-1"
                  >
                    {isCountdownPaused ? (
                      <>
                        <Play className="w-3 h-3 text-lime-400" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 text-amber-400" />
                        <span>Pause Countdown</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Smooth Progress Bar */}
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCountdownPaused ? "50%" : "100%" }}
                    transition={{ duration: 19.5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-blue-500 via-lime-400 to-lime-500 rounded-full"
                  />
                </div>
              </div>

              {/* Action Buttons: Download PDF Receipt, Download PDF Quote, Print, and Go to Client Portal */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPDF('receipt')}
                  disabled={isGeneratingPdf}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-lime-300 font-bold text-xs rounded-xl border border-lime-500/40 hover:border-lime-400 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  title="Download verifiable PDF Subscription Receipt"
                >
                  <Download className="w-3.5 h-3.5 text-lime-400" />
                  <span>Download PDF Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPDF('quote')}
                  disabled={isGeneratingPdf}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-blue-500/50 transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Download formal Service Quote PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Service Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Print paper copy"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPaymentSuccessAndEnterPortal();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to Client Portal Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
