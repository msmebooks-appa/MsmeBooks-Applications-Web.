import React, { useState, useId } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Smartphone,
  Building,
  Globe,
  Sparkles,
  Percent,
  Lock,
  ShoppingCart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Course } from '../types';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';
import { 
  PAYMENT_REGIONS, 
  PAYMENT_GATEWAYS, 
  PROMO_CODES, 
  VAT_RATE, 
  PaymentRegionId,
  InvoiceRecord,
  CustomerBillingInfo
} from '../data/paymentGateways';
import { saveCustomerInvoice, generateInvoiceNumber, generateTransactionRef } from '../utils/invoiceStorage';

interface EnrollmentModalProps {
  course: Course | null;
  onClose: () => void;
  onSuccess: (course: Course, invoice?: InvoiceRecord) => void;
  onAddToCart?: (course: Course) => void;
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  course,
  onClose,
  onSuccess,
  onAddToCart,
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  const formId = useId();
  if (!course) return null;

  // Regional Payment selection
  const [selectedRegionId, setSelectedRegionId] = useState<PaymentRegionId>('west_africa');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('paystack');

  // Customer info
  const [customer, setCustomer] = useState<CustomerBillingInfo>({
    fullName: 'Amara Okafor',
    email: 'nextsoftmsmebooks@gmail.com',
    phone: '+234 803 456 7890',
    companyName: 'Apex Microfinance & Retail Ventures',
    country: 'Nigeria',
    regionId: 'west_africa',
    tin: 'TIN-NG-24901842-001'
  });

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState('MSME2026');
  const [appliedPromo, setAppliedPromo] = useState<string>('MSME2026');
  const [promoMessage, setPromoMessage] = useState<string | null>('15% Pan-African SME Special Applied!');
  const [promoError, setPromoError] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Financial calculations
  const rawPriceNgn = course.isFree ? 0 : course.priceNgn;
  const promo = appliedPromo && PROMO_CODES[appliedPromo] ? PROMO_CODES[appliedPromo] : null;
  const discountRate = promo ? promo.discountPercentage : 0;
  const discountAmountNgn = Math.round(rawPriceNgn * (discountRate / 100));
  
  const netTaxableNgn = Math.max(0, rawPriceNgn - discountAmountNgn);
  
  // 7.5% EXCLUSIVE VAT CALCULATION
  const vatAmountNgn = course.isFree ? 0 : Math.round(netTaxableNgn * VAT_RATE);
  const finalPriceNgn = course.isFree ? 0 : netTaxableNgn + vatAmountNgn;

  // Available gateways
  const regionalGateways = PAYMENT_GATEWAYS.filter((g) => g.regionId === selectedRegionId);
  const activeGateway = PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId) || regionalGateways[0] || PAYMENT_GATEWAYS[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoMessage(null);
    const cleaned = promoCodeInput.trim().toUpperCase();

    if (!cleaned) {
      setAppliedPromo('');
      return;
    }

    if (PROMO_CODES[cleaned]) {
      setAppliedPromo(cleaned);
      setPromoMessage(`${PROMO_CODES[cleaned].badge} Applied: ${PROMO_CODES[cleaned].description}`);
    } else {
      setPromoError('Invalid coupon. Try MSME2026, AFRICA30, or PANAFRICAN.');
    }
  };

  const handleRegionSelect = (rId: PaymentRegionId) => {
    setSelectedRegionId(rId);
    const firstGw = PAYMENT_GATEWAYS.find((g) => g.regionId === rId);
    if (firstGw) setSelectedGatewayId(firstGw.id);
  };

  const handleEnroll = () => {
    setIsProcessing(true);
    setProcessingStatus(`Connecting with ${activeGateway.name}...`);

    setTimeout(() => {
      setProcessingStatus('Verifying payment & calculating 7.5% exclusive VAT...');
    }, 800);

    setTimeout(() => {
      setIsProcessing(false);
      const invoiceNumber = generateInvoiceNumber();
      const transactionRef = generateTransactionRef(activeGateway.id);
      const now = new Date();

      const invoice: InvoiceRecord = {
        id: `inv-course-${course.id}-${Date.now()}`,
        invoiceNumber,
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        dueDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'PAID',
        customer: { ...customer, regionId: selectedRegionId },
        items: [
          {
            id: `item-${course.id}`,
            type: 'course',
            title: course.title,
            category: course.category,
            thumbnail: course.thumbnail,
            priceNgn: course.priceNgn,
            originalPriceNgn: course.priceNgn,
            courseId: course.id,
            duration: `${course.durationHours} hrs`,
            level: course.level,
            instructorName: course.instructor.name
          }
        ],
        subtotalNgn: rawPriceNgn,
        discountCode: appliedPromo || undefined,
        discountPercentage: discountRate > 0 ? discountRate : undefined,
        discountAmountNgn,
        netTaxableNgn,
        vatRate: VAT_RATE,
        vatAmountNgn,
        totalAmountNgn: finalPriceNgn,
        currency: currentCurrency,
        paymentGatewayId: activeGateway.id,
        paymentGatewayName: activeGateway.name,
        transactionReference: transactionRef,
        paidAt: now.toISOString()
      };

      saveCustomerInvoice(invoice);
      onSuccess(course, invoice);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-xs text-slate-800 dark:text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#073B75] via-[#0B4F9C] to-[#1E6FD9] text-white flex items-center justify-between border-b border-blue-900/60 dark:border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-[#72B01D] uppercase tracking-wider block">
              Enrollment &amp; Official Tax Invoice
            </span>
            <h3 className="font-extrabold text-base text-white mt-0.5 line-clamp-1">
              {course.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Order Summary & Financial Calculation */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>{getTranslation('standardTuition', currentLanguage)}:</span>
              <span className="tabular-nums font-mono font-bold text-slate-800 dark:text-white">
                {course.isFree ? getTranslation('freeCourses', currentLanguage) : formatCurrency(rawPriceNgn, currentCurrency)}
              </span>
            </div>

            {/* DISCOUNT WITH AMOUNT SAVED */}
            {!course.isFree && discountAmountNgn > 0 && (
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-0.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Promo ({appliedPromo}):
                  </span>
                  <span className="font-mono tabular-nums">-{formatCurrency(discountAmountNgn, currentCurrency)}</span>
                </div>
                <div className="text-[10px] font-extrabold text-right">
                  You save {formatCurrency(discountAmountNgn, currentCurrency)} ({discountRate}% OFF)!
                </div>
              </div>
            )}

            {!course.isFree && (
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Net Taxable Base:</span>
                <span className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {formatCurrency(netTaxableNgn, currentCurrency)}
                </span>
              </div>
            )}

            {/* 7.5% EXCLUSIVE VAT SECTION */}
            {!course.isFree && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-0.5">
                <div className="flex justify-between items-center text-amber-900 dark:text-amber-200 font-extrabold">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>VAT (7.5% Exclusive):</span>
                  </span>
                  <span className="font-mono tabular-nums">+{formatCurrency(vatAmountNgn, currentCurrency)}</span>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                  Commercial SaaS 7.5% exclusive Value Added Tax with formal tax receipt generation.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pt-1">
              <span>Digital Certificate &amp; Verification QR:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included Free</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
              <span>{getTranslation('totalPayable', currentLanguage)}:</span>
              <span className="text-[#0B4F9C] dark:text-blue-400 font-mono text-base tabular-nums">
                {course.isFree ? getTranslation('freeCourses', currentLanguage) : formatCurrency(finalPriceNgn, currentCurrency)}
              </span>
            </div>
          </div>

          {/* Regional Payment Channels (If Paid) */}
          {!course.isFree && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Select Regional Payment Gateway
                </label>
                <span className="text-[10px] text-slate-400">
                  Tailored for {PAYMENT_REGIONS.find((r) => r.id === selectedRegionId)?.shortName}
                </span>
              </div>

              {/* Region Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
                {PAYMENT_REGIONS.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => handleRegionSelect(region.id)}
                    className={`py-1.5 px-1.5 rounded-lg text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      selectedRegionId === region.id
                        ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-xs">{region.flag}</span>
                    <span className="text-[9px] leading-tight truncate w-full">{region.shortName}</span>
                  </button>
                ))}
              </div>

              {/* Gateway Cards */}
              <div className="grid grid-cols-2 gap-2">
                {regionalGateways.map((gw) => {
                  const isSelected = selectedGatewayId === gw.id;
                  return (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGatewayId(gw.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0B4F9C] bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-400 font-bold ring-1 ring-[#0B4F9C]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                          {gw.name}
                        </span>
                        {gw.badge && (
                          <span className="text-[8px] font-extrabold uppercase px-1 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300">
                            {gw.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-1 truncate">
                        {gw.channels.slice(0, 2).join(' · ')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER COUPON CODE (e.g. MSME2026)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold uppercase text-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    {getTranslation('apply', currentLanguage)}
                  </button>
                </form>

                {promoMessage && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {promoMessage}
                  </p>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {promoError}
                  </p>
                )}
              </div>

              {/* Customer TIN field for invoice */}
              <div className="pt-1">
                <label htmlFor={`${formId}-customerTin`} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Tax ID / TIN for Official VAT Invoice:
                </label>
                <input
                  id={`${formId}-customerTin`}
                  type="text"
                  value={customer.tin || ''}
                  onChange={(e) => setCustomer({ ...customer, tin: e.target.value })}
                  placeholder="e.g. TIN-NG-24901842-001"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#72B01D] shrink-0" />
            <span>Instant access &amp; official tax receipt generated with 7.5% exclusive VAT compliance.</span>
          </div>

          {/* Processing feedback indicator */}
          {isProcessing && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/80 border border-[#0B4F9C] text-[#0B4F9C] dark:text-blue-300 rounded-xl text-xs flex items-center gap-2 animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-[#0B4F9C] border-t-transparent animate-spin" />
              <span>{processingStatus}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer transition-colors"
            >
              {getTranslation('cancel', currentLanguage)}
            </button>

            {onAddToCart && !course.isFree && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(course);
                  onClose();
                }}
                className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add this course to cart and continue shopping"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#72B01D]" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            )}
          </div>

          <button
            onClick={handleEnroll}
            disabled={isProcessing}
            className="px-6 py-2.5 font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {isProcessing
                ? 'Clearing...'
                : course.isFree
                ? getTranslation('confirmFreeEnrollment', currentLanguage)
                : `Pay ${formatCurrency(finalPriceNgn, currentCurrency)} via ${activeGateway.name}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
