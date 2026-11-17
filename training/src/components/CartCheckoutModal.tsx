import React, { useState, useId } from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Percent, 
  Building, 
  Globe, 
  Smartphone, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  FileText,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  PAYMENT_REGIONS, 
  PAYMENT_GATEWAYS, 
  PROMO_CODES, 
  VAT_RATE, 
  CartItem, 
  CustomerBillingInfo, 
  InvoiceRecord,
  PaymentRegionId,
  PaymentGateway
} from '../data/paymentGateways';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';
import { saveCustomerInvoice, generateInvoiceNumber, generateTransactionRef } from '../utils/invoiceStorage';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (itemId: string) => void;
  onAddToCart?: (item: CartItem) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (invoice: InvoiceRecord) => void;
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onAddToCart,
  onClearCart,
  onCheckoutSuccess,
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  const formId = useId();
  if (!isOpen) return null;

  // Checkout flow step: 'cart' -> 'details_and_gateway' -> 'processing'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'processing'>('cart');
  
  // Selected Region & Gateway
  const [selectedRegionId, setSelectedRegionId] = useState<PaymentRegionId>('west_africa');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('paystack');

  // Customer Details
  const [customer, setCustomer] = useState<CustomerBillingInfo>({
    fullName: 'Amara Okafor',
    email: 'nextsoftmsmebooks@gmail.com',
    phone: '+234 803 456 7890',
    companyName: 'Apex Microfinance & Retail Ventures',
    country: 'Nigeria',
    regionId: 'west_africa',
    tin: 'TIN-NG-24901842-001',
    address: '42 Commercial Avenue, Yaba',
    city: 'Lagos'
  });

  // Promo code
  const [promoInput, setPromoInput] = useState('MSME2026');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('MSME2026');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>('15% Pan-African SME Special Applied!');

  // Processing simulation state
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Financial Calculations
  const subtotalNgn = cartItems.reduce((acc, item) => acc + item.priceNgn, 0);
  
  const promo = appliedPromoCode && PROMO_CODES[appliedPromoCode] ? PROMO_CODES[appliedPromoCode] : null;
  const discountPercentage = promo ? promo.discountPercentage : 0;
  const discountAmountNgn = Math.round(subtotalNgn * (discountPercentage / 100));
  
  const netTaxableNgn = Math.max(0, subtotalNgn - discountAmountNgn);
  
  // 7.5% EXCLUSIVE VAT CALCULATION
  const vatAmountNgn = Math.round(netTaxableNgn * VAT_RATE);
  const totalAmountNgn = netTaxableNgn + vatAmountNgn;

  // Filter gateways for active region
  const regionalGateways = PAYMENT_GATEWAYS.filter((g) => g.regionId === selectedRegionId);
  const activeGateway = PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId) || regionalGateways[0] || PAYMENT_GATEWAYS[0];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccessMsg(null);
    const cleaned = promoInput.trim().toUpperCase();

    if (!cleaned) {
      setAppliedPromoCode('');
      return;
    }

    if (PROMO_CODES[cleaned]) {
      setAppliedPromoCode(cleaned);
      setPromoSuccessMsg(`${PROMO_CODES[cleaned].badge} Promo Applied: ${PROMO_CODES[cleaned].description}`);
    } else {
      setPromoError('Invalid coupon code. Try MSME2026, AFRICA30, or PANAFRICAN.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromoCode('');
    setPromoInput('');
    setPromoSuccessMsg(null);
    setPromoError(null);
  };

  const handleRegionChange = (newRegionId: PaymentRegionId) => {
    setSelectedRegionId(newRegionId);
    const firstGateway = PAYMENT_GATEWAYS.find((g) => g.regionId === newRegionId);
    if (firstGateway) {
      setSelectedGatewayId(firstGateway.id);
    }
  };

  const handleCountryPresetChange = (countryName: string) => {
    let targetRegion: PaymentRegionId = 'west_africa';
    if (['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia'].includes(countryName)) {
      targetRegion = 'east_africa';
    } else if (['South Africa', 'Namibia', 'Botswana', 'Lesotho'].includes(countryName)) {
      targetRegion = 'south_africa';
    } else if (['Ivory Coast', 'Senegal', 'Cameroon', 'Burkina Faso', 'Egypt', 'Zimbabwe', 'Benin'].includes(countryName)) {
      targetRegion = 'other_africa';
    } else if (['United Kingdom', 'United States', 'European Union', 'Canada', 'India', 'Global'].includes(countryName)) {
      targetRegion = 'global';
    }

    setCustomer((prev) => ({ ...prev, country: countryName, regionId: targetRegion }));
    handleRegionChange(targetRegion);
  };

  // Execute Payment Simulation & Generate Tax Invoice
  const handleExecutePayment = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('processing');
    setProcessingProgress(15);
    setProcessingStatus(`Initiating secure connection with ${activeGateway.name}...`);

    setTimeout(() => {
      setProcessingProgress(45);
      if (activeGateway.id === 'mpesa') {
        setProcessingStatus('STK Push sent to Safaricom subscriber! Awaiting M-Pesa PIN...');
      } else if (activeGateway.id === 'ozow') {
        setProcessingStatus('Connecting to South African Automated Instant Bank EFT...');
      } else if (activeGateway.id === 'monnify') {
        setProcessingStatus('Generating dynamic dedicated virtual account for instant transfer...');
      } else if (activeGateway.id === 'stripe') {
        setProcessingStatus('3D Secure 2.0 biometric verification confirmed by card issuer...');
      } else {
        setProcessingStatus(`Authorizing transaction through ${activeGateway.name} secure channel...`);
      }
    }, 1000);

    setTimeout(() => {
      setProcessingProgress(80);
      setProcessingStatus('Payment verified & settled. Calculating 7.5% exclusive VAT & generating tax invoice...');
    }, 2200);

    setTimeout(() => {
      setProcessingProgress(100);
      const invoiceNumber = generateInvoiceNumber();
      const transactionRef = generateTransactionRef(activeGateway.id);
      const now = new Date();

      const newInvoice: InvoiceRecord = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        dueDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'PAID',
        customer: { ...customer, regionId: selectedRegionId },
        items: [...cartItems],
        subtotalNgn,
        discountCode: appliedPromoCode || undefined,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
        discountAmountNgn,
        netTaxableNgn,
        vatRate: VAT_RATE,
        vatAmountNgn,
        totalAmountNgn,
        currency: currentCurrency,
        paymentGatewayId: activeGateway.id,
        paymentGatewayName: activeGateway.name,
        transactionReference: transactionRef,
        paidAt: now.toISOString()
      };

      // Persist to local storage
      saveCustomerInvoice(newInvoice);

      // Clear cart
      onClearCart();

      // Trigger success callback to show InvoiceReceiptModal
      onCheckoutSuccess(newInvoice);
      setCheckoutStep('cart');
    }, 3200);
  };

  // Add default Academy Pro subscription if cart is empty
  const handleAddDefaultSubscription = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `sub-academy-pro-${Date.now()}`,
        type: 'subscription',
        title: 'MsmeBooks Academy Pro & Enterprise Cloud Suite',
        category: 'All-Access Annual Subscription',
        priceNgn: 144300,
        originalPriceNgn: 222000,
        subscriptionPlan: 'annual',
        duration: '12 Months Unlimited'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#073B75] via-[#0B4F9C] to-[#1E6FD9] text-white flex items-center justify-between border-b border-blue-900/60 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-5 h-5 text-[#72B01D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#72B01D] uppercase tracking-wider">
                  Pan-African Multi-Country Checkout
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-blue-100 font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Cart
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                MsmeBooks Enterprise Tuition &amp; Subscription Portal
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Processing State Simulation Overlay */}
        {checkoutStep === 'processing' ? (
          <div className="p-12 text-center space-y-6 my-auto">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-[#0B4F9C] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#0B4F9C]">
                {processingProgress}%
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="font-black text-lg text-slate-900 dark:text-white">
                Processing via {activeGateway.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                {processingStatus}
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl max-w-sm mx-auto text-left text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0B4F9C] dark:text-blue-300">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Banking Channel</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Statutory 7.5% exclusive VAT is computed and an official tax invoice will be issued immediately upon clearance.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Step navigation tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    checkoutStep === 'cart'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-400 ring-1 ring-[#0B4F9C]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>1. Review Cart &amp; Promo</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button
                  onClick={() => {
                    if (cartItems.length > 0) setCheckoutStep('details');
                  }}
                  disabled={cartItems.length === 0}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    checkoutStep === 'details'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-400 ring-1 ring-[#0B4F9C]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40'
                  }`}
                >
                  <span>2. Regional Gateways &amp; Billing</span>
                </button>
              </div>

              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                Currency: <span className="font-bold text-[#0B4F9C] dark:text-blue-400">{currentCurrency}</span>
              </div>
            </div>

            {/* STEP 1: CART ITEMS & PROMOTIONS */}
            {checkoutStep === 'cart' && (
              <div className="space-y-6">
                
                {/* Empty Cart Notice */}
                {cartItems.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] flex items-center justify-center mx-auto">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Your Enrollment Cart is Empty
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Add an accredited accounting masterclass, an executive training bundle, or an enterprise Academy Pro subscription.
                      </p>
                    </div>
                    <button
                      onClick={handleAddDefaultSubscription}
                      className="px-5 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#72B01D]" />
                      <span>Add MsmeBooks Academy Pro All-Access (Save 35%)</span>
                    </button>
                  </div>
                ) : (
                  /* Cart Items Table / List */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
                      <span>Items in Cart ({cartItems.length})</span>
                      <button
                        onClick={onClearCart}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-bold lowercase tracking-normal flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>clear cart</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-14 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0B4F9C] flex items-center justify-center shrink-0 font-black text-xs">
                                {item.type === 'bundle' ? 'BUNDLE' : 'PRO'}
                              </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="uppercase text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                                  {item.type}
                                </span>
                                {item.category && (
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {item.title}
                              </h4>
                              {item.duration && (
                                <p className="text-[10px] text-slate-400">
                                  {item.duration} {item.level ? `· ${item.level}` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <div>
                              <p className="font-mono font-black text-xs sm:text-sm text-[#0B4F9C] dark:text-blue-400 tabular-nums">
                                {formatCurrency(item.priceNgn, currentCurrency)}
                              </p>
                              {item.originalPriceNgn && item.originalPriceNgn > item.priceNgn && (
                                <p className="text-[10px] text-slate-400 line-through tabular-nums">
                                  {formatCurrency(item.originalPriceNgn, currentCurrency)}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onRemoveFromCart(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promotion Code Section */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Promotional Code &amp; Grant Discount</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Popular: <code className="font-mono text-[#0B4F9C] font-bold">MSME2026</code> · <code className="font-mono text-[#0B4F9C] font-bold">AFRICA30</code> · <code className="font-mono text-[#0B4F9C] font-bold">PANAFRICAN</code>
                    </span>
                  </div>

                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. AFRICA30)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      Apply Code
                    </button>
                    {appliedPromoCode && (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs cursor-pointer hover:bg-slate-300"
                      >
                        Remove
                      </button>
                    )}
                  </form>

                  {/* Feedback on Promo Code */}
                  {promoSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {promoSuccessMsg}
                      </span>
                      <span className="font-black text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        -{discountPercentage}%
                      </span>
                    </div>
                  )}

                  {promoError && (
                    <div className="p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{promoError}</span>
                    </div>
                  )}
                </div>

                {/* Financial Summary & 7.5% Exclusive VAT Section */}
                <div className="p-4 sm:p-5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                    Order Price Breakdown
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Standard Gross Subtotal:</span>
                      <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(subtotalNgn, currentCurrency)}
                      </span>
                    </div>

                    {/* PROMOTIONAL DISCOUNT WITH AMOUNT SAVED */}
                    {discountAmountNgn > 0 && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 space-y-1">
                        <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-300 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Promotional Discount ({appliedPromoCode}):</span>
                          </span>
                          <span className="font-mono font-black tabular-nums">
                            -{formatCurrency(discountAmountNgn, currentCurrency)}
                          </span>
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200 flex items-center justify-between pt-0.5 border-t border-emerald-200 dark:border-emerald-800">
                          <span>TOTAL AMOUNT SAVED:</span>
                          <span className="font-mono underline">
                            You save {formatCurrency(discountAmountNgn, currentCurrency)} ({discountPercentage}% OFF)!
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pt-1">
                      <span>Net Taxable Base:</span>
                      <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(netTaxableNgn, currentCurrency)}
                      </span>
                    </div>

                    {/* 7.5% EXCLUSIVE VAT SECTION */}
                    <div className="p-3 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-1">
                      <div className="flex justify-between items-center text-amber-900 dark:text-amber-200 font-extrabold text-xs">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Value Added Tax (7.5% Exclusive VAT):</span>
                        </span>
                        <span className="font-mono font-black tabular-nums text-amber-900 dark:text-amber-100">
                          +{formatCurrency(vatAmountNgn, currentCurrency)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Standard 7.5% exclusive VAT is computed on taxable tuition &amp; SaaS software in compliance with national commercial tax provisions.
                      </p>
                    </div>

                    {/* Grand Total */}
                    <div className="pt-2 border-t-2 border-slate-300 dark:border-slate-600 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                      <span>Total Payable:</span>
                      <span className="text-[#0B4F9C] dark:text-blue-400 font-mono text-lg tabular-nums">
                        {formatCurrency(totalAmountNgn, currentCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: REGIONAL GATEWAYS & BILLING DETAILS */}
            {checkoutStep === 'details' && (
              <div className="space-y-6">
                
                {/* Country Quick Preset & Region Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#0B4F9C]" />
                      <span>Select Your Country or Economic Region</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Auto-tailored payment rails
                    </span>
                  </div>

                  {/* Country Quick Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { name: 'Nigeria', flag: '🇳🇬' },
                      { name: 'Ghana', flag: '🇬🇭' },
                      { name: 'Kenya', flag: '🇰🇪' },
                      { name: 'South Africa', flag: '🇿🇦' },
                      { name: 'Ivory Coast', flag: '🇨🇮' },
                      { name: 'Senegal', flag: '🇸🇳' },
                      { name: 'Benin', flag: '🇧🇯' },
                      { name: 'Egypt', flag: '🇪🇬' },
                      { name: 'Zimbabwe', flag: '🇿🇼' },
                      { name: 'United Kingdom', flag: '🇬🇧' },
                      { name: 'United States', flag: '🇺🇸' },
                      { name: 'Global', flag: '🌐' }
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleCountryPresetChange(item.name)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          customer.country === item.name
                            ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.flag}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Regional Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
                    {PAYMENT_REGIONS.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => handleRegionChange(region.id)}
                        className={`py-2 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedRegionId === region.id
                            ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-blue-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-sm">{region.flag}</span>
                        <span className="text-[10px] leading-tight truncate w-full">{region.shortName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gateway Cards Grid for selected Region */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Available Payment Gateways for {PAYMENT_REGIONS.find((r) => r.id === selectedRegionId)?.name}:</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Instant Real-time Activation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {regionalGateways.map((gw) => {
                      const isSelected = selectedGatewayId === gw.id;
                      return (
                        <div
                          key={gw.id}
                          onClick={() => setSelectedGatewayId(gw.id)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? 'border-[#0B4F9C] dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                                {gw.name}
                              </span>
                              {gw.badge && (
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                                  {gw.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                              {gw.tagline}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Zap className="w-3 h-3 text-[#72B01D]" />
                              <span>Accepted: {gw.channels.slice(0, 3).join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Currencies: {gw.supportedCurrencies.join(', ')}</span>
                              <span className="text-[#0B4F9C] dark:text-blue-400 font-bold">{gw.processingTime}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Billing Form */}
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0B4F9C]" />
                    <span>Customer &amp; Tax Invoice Details (Generated on Receipt)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label htmlFor={`${formId}-fullName`} className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                        Full Name / Authorized Officer *
                      </label>
                      <input
                        id={`${formId}-fullName`}
                        type="text"
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white font-medium"
                        placeholder="e.g. Amara Okafor"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`${formId}-email`} className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                        Receipt Delivery Email *
                      </label>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white font-mono"
                        placeholder="e.g. finance@enterprise.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`${formId}-companyName`} className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                        Company / Business Name (Optional)
                      </label>
                      <input
                        id={`${formId}-companyName`}
                        type="text"
                        value={customer.companyName || ''}
                        onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                        placeholder="e.g. Apex Retail Ventures Ltd"
                      />
                    </div>

                    <div>
                      <label htmlFor={`${formId}-tin`} className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                        Tax ID / TIN for 7.5% VAT Receipt
                      </label>
                      <input
                        id={`${formId}-tin`}
                        type="text"
                        value={customer.tin || ''}
                        onChange={(e) => setCustomer({ ...customer, tin: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white font-mono"
                        placeholder="e.g. TIN-NG-24901842-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Order Recap with 7.5% VAT */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                      Total with 7.5% Exclusive VAT:
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Paying via <span className="font-bold text-[#0B4F9C] dark:text-blue-400">{activeGateway.name}</span> in <span className="font-bold">{currentCurrency}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#0B4F9C] dark:text-blue-400 font-mono tabular-nums block">
                      {formatCurrency(totalAmountNgn, currentCurrency)}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Saved {formatCurrency(discountAmountNgn, currentCurrency)}!
                    </span>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Modal Bottom Actions Footer */}
        {checkoutStep !== 'processing' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            {checkoutStep === 'cart' ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Continue Browsing
                </button>

                <button
                  onClick={() => setCheckoutStep('details')}
                  disabled={cartItems.length === 0}
                  className="px-6 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <span>Proceed to Payment Gateways ({formatCurrency(totalAmountNgn, currentCurrency)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Back to Cart
                </button>

                <button
                  onClick={handleExecutePayment}
                  className="px-6 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#72B01D]" />
                  <span>Pay {formatCurrency(totalAmountNgn, currentCurrency)} via {activeGateway.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
