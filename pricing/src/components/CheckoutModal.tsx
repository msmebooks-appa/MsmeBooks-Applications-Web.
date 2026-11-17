import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Sparkles,
  Tag,
  Loader2,
  HelpCircle,
  FileText,
  FileDown,
  TrendingUp,
  QrCode,
  Scan,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { PAYMENT_REGIONS, ALL_PAYMENT_GATEWAYS, getDefaultRegionForCurrency } from '../data/paymentGateways';
import { PaymentRegionId, PaymentGatewayId, CustomerBillingDetails } from '../types/cart';
import { LocalComplianceTooltip } from './LocalComplianceTooltip';
import { POPULAR_CHECKOUT_COUNTRIES, getComplianceForCountry } from '../data/countryCompliance';
import { triggerConfetti } from '../utils/confetti';
import { generateQuoteDocument } from '../utils/generateQuotePdf';
import { CheckoutCurrencySelector } from './CheckoutCurrencySelector';
import { SUPPORTED_CURRENCIES } from '../utils/currency';
import { PaymentMethod } from './PaymentMethod';
import { calculateRegionalTax } from '../utils/regionalTaxCalculator';
import { RegionalTaxCalculator } from './RegionalTaxCalculator';
import { AlternativeOpenBankingSection } from './AlternativeOpenBankingSection';
import { LinkedBankAccount } from '../data/openBankingProviders';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    selectedRegion,
    setSelectedRegion,
    selectedGatewayId,
    setSelectedGatewayId,
    subtotalNgn,
    planSavingsNgn,
    appliedPromo,
    promoDiscountNgn,
    netTaxableAmountNgn,
    vatRatePercent,
    vatAmountNgn,
    totalPayableNgn,
    completePayment,
  } = useCart();

  const { format, currency, activeCurrency, setCurrency } = useCurrency();

  // Form State
  const [customer, setCustomer] = useState<CustomerBillingDetails>({
    fullName: 'Amina Yusuf',
    businessName: 'Zaria Fabrics & Retail Ltd',
    email: 'amina@zariafabrics.com',
    phone: '+234 915 848 2622',
    country: 'Nigeria',
    city: 'Lagos',
    billingAddress: '14 Admiralty Way, Lekki Phase 1',
    taxIdentificationNumber: '24810932-0001',
  });

  // Simulated gateway input fields
  const [cardNumber, setCardNumber] = useState('5399 4120 8940 3319');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('+254 712 345 678');
  const [selectedBank, setSelectedBank] = useState('Capitec Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentMode, setPaymentMode] = useState<'qr' | 'standard'>('qr');
  const [isB2BExempt, setIsB2BExempt] = useState(false);
  const [isTaxRecalculating, setIsTaxRecalculating] = useState(false);
  const [linkedBankAccount, setLinkedBankAccount] = useState<LinkedBankAccount | null>(null);
  const [useOpenBankingMethod, setUseOpenBankingMethod] = useState(false);

  const currentGateway =
    ALL_PAYMENT_GATEWAYS.find((g) => g.id === selectedGatewayId) || ALL_PAYMENT_GATEWAYS[0];

  const countryCompliance = getComplianceForCountry(customer.country);

  // Dynamically compute regional tax rules based on selected country and net taxable base
  const regionalTaxCalc = React.useMemo(() => {
    return calculateRegionalTax(
      customer.country,
      netTaxableAmountNgn,
      isB2BExempt,
      customer.taxIdentificationNumber
    );
  }, [customer.country, netTaxableAmountNgn, isB2BExempt, customer.taxIdentificationNumber]);

  const activeVatRatePercent = regionalTaxCalc.effectiveTaxRatePercent;
  const activeVatAmountNgn = regionalTaxCalc.taxAmountNgn;
  const activeTotalPayableNgn = regionalTaxCalc.totalPayableNgn;

  const handleCountryChange = (newCountry: string) => {
    setIsTaxRecalculating(true);
    setTimeout(() => setIsTaxRecalculating(false), 240);
    const compliance = getComplianceForCountry(newCountry);
    setCustomer((prev) => ({
      ...prev,
      country: newCountry,
    }));
    if (compliance.region) {
      setSelectedRegion(compliance.region);
    }
  };

  const handleQrPaymentSuccess = async () => {
    setIsProcessing(true);
    setProcessingStep(`Listening on ${currentGateway.name} Merchant QR Switch...`);
    await new Promise((r) => setTimeout(r, 700));
    setProcessingStep(`Instant NIP / Central Settlement Confirmed...`);
    await new Promise((r) => setTimeout(r, 600));

    const qrName = currentGateway.qrSupport?.standardName || `${currentGateway.name} Scan to Pay QR`;
    const methodSummary = `${currentGateway.name} (${qrName})`;
    setIsProcessing(false);
    triggerConfetti(4000);
    await completePayment(customer, methodSummary, {
      vatRatePercent: activeVatRatePercent,
      vatAmountNgn: activeVatAmountNgn,
      totalPayableNgn: activeTotalPayableNgn,
      taxAuthority: regionalTaxCalc.taxAuthority,
      taxSchemeName: regionalTaxCalc.taxSchemeName,
      taxBreakdown: regionalTaxCalc.breakdown,
      isTaxExempt: regionalTaxCalc.isExempted,
    });
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Realistic multi-step simulated payment gateway verification
    if (useOpenBankingMethod && linkedBankAccount) {
      setProcessingStep(
        `Connecting to ${linkedBankAccount.bank.apiProvider} Open-Banking API (${linkedBankAccount.bank.name})...`
      );
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep(
        `Verifying ${linkedBankAccount.bank.railName} mandate ${linkedBankAccount.mandateId}...`
      );
      await new Promise((r) => setTimeout(r, 900));
      setProcessingStep(
        `Direct low-fee settlement confirmed from ${linkedBankAccount.maskedAccountNumber}...`
      );
    } else {
      setProcessingStep(`Connecting to ${currentGateway.name} Secure Gateway...`);
      await new Promise((r) => setTimeout(r, 700));

      if (paymentMode === 'qr') {
        setProcessingStep(`Verifying ${currentGateway.qrSupport?.standardName || currentGateway.name + ' QR'} scan & instant settlement...`);
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('Instant QR payment cleared by central switch...');
      } else if (currentGateway.fields.type === 'phone_stk') {
        setProcessingStep(`Sending instant STK push to ${mobileMoneyPhone}...`);
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('STK prompt approved by subscriber. Finalizing settlement...');
      } else if (currentGateway.fields.type === 'instant_eft') {
        setProcessingStep(`Authorizing Instant EFT transfer via ${selectedBank}...`);
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('Bank transfer cleared by central settlement...');
      } else if (currentGateway.fields.type === 'virtual_account') {
        setProcessingStep('Generating dedicated dynamic virtual account & reconciling payment...');
        await new Promise((r) => setTimeout(r, 900));
        setProcessingStep('Automated deposit confirmed and credited...');
      } else {
        setProcessingStep('Authorizing 3D-Secure 2.0 Card authentication...');
        await new Promise((r) => setTimeout(r, 800));
        setProcessingStep('Card charge authorized and tokenized...');
      }
    }

    await new Promise((r) => setTimeout(r, 600));

    let methodSummary = `${currentGateway.name} (Credit/Debit Card)`;
    if (useOpenBankingMethod && linkedBankAccount) {
      methodSummary = `${linkedBankAccount.bank.name} (${linkedBankAccount.bank.apiProvider} Open-Banking ${linkedBankAccount.maskedAccountNumber})`;
    } else if (paymentMode === 'qr') {
      methodSummary = `${currentGateway.name} (${currentGateway.qrSupport?.standardName || 'Scan to Pay QR'})`;
    } else if (currentGateway.fields.type === 'phone_stk') {
      methodSummary = `${currentGateway.name} (Mobile STK Push: ${mobileMoneyPhone})`;
    } else if (currentGateway.fields.type === 'instant_eft') {
      methodSummary = `${currentGateway.name} (Instant EFT: ${selectedBank})`;
    } else if (currentGateway.fields.type === 'virtual_account') {
      methodSummary = `${currentGateway.name} (Dynamic Virtual Bank Transfer)`;
    } else if (currentGateway.fields.type === 'wallet') {
      methodSummary = `${currentGateway.name} (Digital Wallet Checkout)`;
    }

    setIsProcessing(false);
    triggerConfetti(4000);
    await completePayment(customer, methodSummary, {
      vatRatePercent: activeVatRatePercent,
      vatAmountNgn: activeVatAmountNgn,
      totalPayableNgn: activeTotalPayableNgn,
      taxAuthority: regionalTaxCalc.taxAuthority,
      taxSchemeName: regionalTaxCalc.taxSchemeName,
      taxBreakdown: regionalTaxCalc.breakdown,
      isTaxExempt: regionalTaxCalc.isExempted,
    });
  };

  const handleDownloadQuote = () => {
    const quoteNumber = `QUO-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date();
    const validUntilDate = new Date();
    validUntilDate.setDate(today.getDate() + 30);

    generateQuoteDocument({
      quoteNumber,
      date: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      validUntil: validUntilDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      customer: {
        businessName: customer.businessName,
        contactName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.billingAddress,
        country: customer.country,
        taxId: customer.taxIdentificationNumber,
      },
      items,
      subtotalNgn,
      savingsNgn: planSavingsNgn,
      promoDiscountNgn,
      netTaxableNgn: netTaxableAmountNgn,
      vatRatePercent: activeVatRatePercent,
      vatAmountNgn: activeVatAmountNgn,
      totalPayableNgn: activeTotalPayableNgn,
      activeCurrency,
      formatCurrencyFn: format,
    });
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white dark:bg-[#0B192C] rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0B192C] via-[#0A4FD5] to-[#125BEE] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lime-400 border border-white/15">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>Pan-African & Global Secure Checkout</span>
                <span className="text-[10px] bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase">
                  PCI-DSS Tier 1
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Choose from 23 regional gateways with instant automated receipt & invoice generation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCheckout}
            disabled={isProcessing}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <form onSubmit={handlePayNow} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top In-Checkout Multi-Currency Selector & Exchange Rate Engine */}
          <CheckoutCurrencySelector />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (7 cols): Customer Info & Regional Gateway Selection */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Customer & Business Billing Details */}
              <div className="bg-slate-50 dark:bg-[#071324] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0A4FD5]" />
                    <span>1. Customer & Business Details</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">For Official Invoice</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Country of Operation & Jurisdiction Selector with Tooltip */}
                  <div className="sm:col-span-2 bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200/70 dark:border-blue-900/60">
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                      <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0A4FD5]" />
                        <span>Country of Operation / Tax Jurisdiction:</span>
                      </label>
                      <LocalComplianceTooltip country={customer.country} variant="badge-popover" placement="bottom" />
                    </div>
                    <select
                      value={customer.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5] cursor-pointer"
                    >
                      {POPULAR_CHECKOUT_COUNTRIES.map((c) => {
                        const comp = getComplianceForCountry(c);
                        return (
                          <option key={c} value={c}>
                            {comp.flag} {c} — {comp.taxAuthority.split('/')[0].trim()} ({comp.vatRate.split('(')[0].trim()})
                          </option>
                        );
                      })}
                    </select>

                    {/* Smart Local Currency Recommendation Banner */}
                    {countryCompliance.localCurrencyCode &&
                      countryCompliance.localCurrencyCode !== currency &&
                      SUPPORTED_CURRENCIES[countryCompliance.localCurrencyCode] && (
                        <div className="mt-2.5 p-2 rounded-xl bg-blue-100/70 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 flex items-center justify-between gap-2 text-[11px] animate-in fade-in duration-150">
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 min-w-0">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">
                              Switch checkout billing to <strong>{countryCompliance.localCurrencyCode}</strong> ({SUPPORTED_CURRENCIES[countryCompliance.localCurrencyCode]?.symbol.trim()})?
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrency(countryCompliance.localCurrencyCode);
                              const targetReg = getDefaultRegionForCurrency(countryCompliance.localCurrencyCode);
                              setSelectedRegion(targetReg);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0A4FD5] hover:bg-[#083ea8] text-white font-bold text-[10px] shrink-0 shadow-xs transition-colors cursor-pointer"
                          >
                            Switch to {countryCompliance.localCurrencyCode}
                          </button>
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Business / Organization Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.businessName}
                      onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                      placeholder="e.g. Zaria Fabrics Ltd"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Contact Person Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Amina Yusuf"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Invoice Delivery Email:
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="billing@company.com"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number (SMS & Alerts):
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+234 915 848 2622"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      City / State:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="e.g. Lagos, Nairobi, Johannesburg"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Billing Street Address:
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.billingAddress}
                      onChange={(e) => setCustomer({ ...customer, billingAddress: e.target.value })}
                      placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Tax Identification Number ({countryCompliance.taxAuthority.split('(')[0].trim()} TIN / VAT ID):
                      </label>
                      <span className="text-[10px] text-slate-400">Optional for registered firms</span>
                    </div>
                    <input
                      type="text"
                      value={customer.taxIdentificationNumber}
                      onChange={(e) =>
                        setCustomer({ ...customer, taxIdentificationNumber: e.target.value })
                      }
                      placeholder={`e.g. ${countryCompliance.code === 'NG' ? '24810932-0001' : countryCompliance.code === 'KE' ? 'P051234567Z' : countryCompliance.code === 'ZA' ? '4123456789' : 'Tax ID or VAT registration number'}`}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>
                </div>

                {/* Context-Aware Regional Compliance Notice Card */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <LocalComplianceTooltip country={customer.country} variant="inline-card" />
                </div>
              </div>

              {/* 2. Country & Currency Payment Providers with Dynamic Currency Surfacing */}
              <PaymentMethod
                currency={currency}
                customer={customer}
                totalPayableNgn={totalPayableNgn}
                format={format}
                selectedGateway={currentGateway}
                onSelectGateway={setSelectedGatewayId}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                isProcessing={isProcessing}
                onPaymentVerified={handleQrPaymentSuccess}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvv={cardCvv}
                setCardCvv={setCardCvv}
                mobileMoneyPhone={mobileMoneyPhone}
                setMobileMoneyPhone={setMobileMoneyPhone}
                selectedBank={selectedBank}
                setSelectedBank={setSelectedBank}
              />

              {/* 3. Alternative Payment Method: Open-Banking Direct Bank Account Linking */}
              <AlternativeOpenBankingSection
                customer={customer}
                totalPayableNgn={activeTotalPayableNgn}
                format={format}
                isActiveMethod={useOpenBankingMethod}
                onToggleActiveMethod={setUseOpenBankingMethod}
                linkedAccount={linkedBankAccount}
                onLinkAccount={setLinkedBankAccount}
              />

            </div>

            {/* Right Column (5 cols): Order Summary, 7.5% Exclusive VAT & Payment Action */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Order Summary Card */}
              <div className="bg-slate-50 dark:bg-[#071324] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0A4FD5]" />
                    <span>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Currency: {activeCurrency.code}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-slate-800/50"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.planName} Plan ({item.billingPeriod === 'yearly' ? 'Annual' : 'Monthly'})
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Duration: {item.quantity} {item.quantity === 1 ? 'Month' : 'Months'}
                          {item.billingPeriod === 'yearly' ? ` (${item.quantity / 12} ${item.quantity === 12 ? 'Year' : 'Years'})` : ''}
                          {item.volumeDetails ? ` • ${item.volumeDetails.users} ${item.volumeDetails.users === 1 ? 'Seat' : 'Seats'} • Unlimited Tx (₦0 fees)` : ''}
                          {item.addOns?.extraBranches ? ` • +${item.addOns.extraBranches} Branches` : ''}
                          {item.addOns?.extraWarehouses ? ` • +${item.addOns.extraWarehouses} Depots` : ''}
                        </div>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {format(item.basePriceNgn * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Discounts */}
                <div className="space-y-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Subtotal:</span>
                    <span>{format(subtotalNgn)}</span>
                  </div>

                  {planSavingsNgn > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Annual 20% Billing Discount:</span>
                      <span>-{format(planSavingsNgn)}</span>
                    </div>
                  )}

                  {appliedPromo && promoDiscountNgn > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-300/40">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Promo Code ({appliedPromo.code}):</span>
                      </span>
                      <span>Amount Saved: -{format(promoDiscountNgn)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span>Net Taxable Amount:</span>
                    <span className="font-bold">{format(netTaxableAmountNgn)}</span>
                  </div>
                </div>

                {/* Dynamic Regional Tax Calculator (Country-Specific Statutory Levies & B2B Exemption) */}
                <RegionalTaxCalculator
                  taxCalculation={regionalTaxCalc}
                  currency={currency}
                  isRecalculating={isTaxRecalculating}
                  userTaxId={customer.taxIdentificationNumber}
                  onTaxIdChange={(newTin) => setCustomer((prev) => ({ ...prev, taxIdentificationNumber: newTin }))}
                  isB2BExempt={isB2BExempt}
                  onToggleB2BExempt={setIsB2BExempt}
                />

                {/* Grand Total */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                      Total Payable Now:
                    </span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-[#0B192C] dark:text-white">
                        {format(activeTotalPayableNgn)}
                      </span>
                      {currency !== 'NGN' && (
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          ≈ ₦{Math.round(activeTotalPayableNgn).toLocaleString()} NGN (Baseline)
                        </div>
                      )}
                    </div>
                  </div>

                  {currency !== 'NGN' && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span>Official Exchange Rate:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        1 {currency} ≈ ₦{(1 / activeCurrency.rateFromNgn).toFixed(2)} NGN
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right">
                    Zero hidden conversion markups • Instant activation & tax invoice
                  </div>
                </div>

                {/* Processing Feedback */}
                {isProcessing && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-300 dark:border-blue-800 flex items-center gap-3 text-xs text-[#0A4FD5] dark:text-blue-300 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="font-semibold">{processingStep}</span>
                  </div>
                )}

                {/* Pay Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="w-full py-4 px-4 bg-[#0A4FD5] hover:bg-[#073AA0] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : useOpenBankingMethod && linkedBankAccount ? (
                    <>
                      <Landmark className="w-4 h-4 text-lime-400 group-hover:scale-110 transition-transform" />
                      <span>
                        Pay {format(activeTotalPayableNgn)} via {linkedBankAccount.bank.name} ({linkedBankAccount.bank.apiProvider} Direct)
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : paymentMode === 'qr' ? (
                    <>
                      <QrCode className="w-4 h-4 text-lime-400 group-hover:scale-110 transition-transform" />
                      <span>
                        Verify & Pay {format(activeTotalPayableNgn)} with {currentGateway.name} QR
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>
                        Pay {format(activeTotalPayableNgn)} with {currentGateway.name}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Download PDF Quote for Internal Business Approvals */}
                <button
                  type="button"
                  onClick={handleDownloadQuote}
                  disabled={items.length === 0}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                  <span>Download PDF Proforma Quote for Internal Approvals</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-500" />
                  <span>
                    Official Tax Invoice & Payment Receipt generated automatically on completion.
                  </span>
                </div>

              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
