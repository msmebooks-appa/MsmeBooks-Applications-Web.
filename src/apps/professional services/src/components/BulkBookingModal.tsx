import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Sparkles,
  CreditCard,
  QrCode,
  FileText,
  Percent,
  Check,
  Send,
  Users
} from 'lucide-react';
import { ServiceItem, ServicePackage } from '../data/servicesData';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { PAYMENT_GATEWAYS } from '../data/paymentGateways';
import { BookingRecord } from '../types/booking';
import { useCurrency } from '../context/CurrencyContext';
import { PaymentQRCode } from './PaymentQRCode';
import { addAppNotification } from '../utils/notificationService';

export interface BulkCartItem {
  service: ServiceItem;
  selectedPackage: ServicePackage;
  selectedFirm: ProfessionalFirm;
  consultationMode: 'Online Consultation' | 'Telephone' | 'Physical Office Visit' | 'On-site Business Visit';
}

interface BulkBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: BulkCartItem[];
  onUpdateCartItem: (serviceId: string, updates: Partial<BulkCartItem>) => void;
  onRemoveCartItem: (serviceId: string) => void;
  onClearCart: () => void;
  onBookingComplete?: () => void;
}

export const BulkBookingModal: React.FC<BulkBookingModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateCartItem,
  onRemoveCartItem,
  onClearCart,
  onBookingComplete,
}) => {
  const { currentCurrency, formatPriceString } = useCurrency();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('Apex Industrial Holdings Ltd');
  const [contactName, setContactName] = useState('Tunde Balogun');
  const [contactEmail, setContactEmail] = useState('t.balogun@apexholdings.africa');
  const [contactPhone, setContactPhone] = useState('+234 803 456 7890');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [kickOffDate, setKickOffDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [deploymentStrategy, setDeploymentStrategy] = useState<'simultaneous' | 'staggered'>('simultaneous');
  const [specialInstructions, setSpecialInstructions] = useState('Please coordinate initial stakeholder discovery session with the finance & audit leadership committee.');
  const [paymentGatewayName, setPaymentGatewayName] = useState<'Paystack' | 'Flutterwave' | 'M-Pesa' | 'Monnify' | 'Bank Transfer'>('Paystack');

  if (!isOpen) return null;

  // Selected Gateway Object
  const selectedGatewayObj = PAYMENT_GATEWAYS.find(g => 
    g.name.toLowerCase().includes(paymentGatewayName.toLowerCase()) || 
    g.id.toLowerCase().includes(paymentGatewayName.toLowerCase().replace(/[^a-z]/g, ''))
  ) || PAYMENT_GATEWAYS[0];

  // Financial Computations in NGN base
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 45000;
  };

  const subtotalNGN = cart.reduce((sum, item) => sum + parsePrice(item.selectedPackage.priceDisplay), 0);
  const discountPercent = cart.length >= 2 ? 10 : 0;
  const discountNGN = Math.round(subtotalNGN * (discountPercent / 100));
  const discountedSubtotalNGN = subtotalNGN - discountNGN;
  const vatNGN = Math.round(discountedSubtotalNGN * 0.075);
  const totalNGN = discountedSubtotalNGN + vatNGN;

  // Format currency helpers
  const formatAmt = (amtNGN: number) => {
    const converted = amtNGN * currentCurrency.rateFromNGN;
    return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  const handleConfirmBulkBooking = () => {
    const bulkBatchId = `MSME-BULK-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdBookings: BookingRecord[] = cart.map((item, index) => {
      const itemSubtotal = parsePrice(item.selectedPackage.priceDisplay);
      const itemDiscount = Math.round(itemSubtotal * (discountPercent / 100));
      const itemNet = itemSubtotal - itemDiscount;
      const itemVat = Math.round(itemNet * 0.075);
      const itemTotal = itemNet + itemVat;

      return {
        id: `bulk-item-${Date.now()}-${index}`,
        reference: `${bulkBatchId}-${index + 1}`,
        serviceId: item.service.id,
        serviceTitle: item.service.title,
        packageId: item.selectedPackage.id,
        packageName: item.selectedPackage.name,
        packagePrice: item.selectedPackage.priceDisplay,
        providerId: item.selectedFirm.id,
        providerName: item.selectedFirm.name,
        providerType: item.selectedFirm.category,
        consultationMode: item.consultationMode,
        appointmentDate: kickOffDate,
        timeSlot: index % 2 === 0 ? '10:00 AM - 12:00 PM' : '02:00 PM - 04:00 PM',
        customerName: contactName,
        businessName: companyName,
        customerEmail: contactEmail,
        customerPhone: contactPhone,
        country,
        city,
        industry: 'Enterprise & Multi-Service Group',
        businessSize: '50-250 Employees',
        requirements: `[Bulk Batch #${bulkBatchId}] Strategy: ${deploymentStrategy}. ${specialInstructions}`,
        status: 'Confirmed',
        lifecycleStage: 'Booked',
        createdAt: new Date().toISOString(),
        paymentStatus: 'Paid',
        paymentGateway: paymentGatewayName,
        paymentTransactionRef: `TX-BULK-${Date.now().toString(36).toUpperCase()}`,
        billingType: 'fixed',
        billingFrequency: 'monthly',
        billingUnits: 1,
        billingBreakdown: {
          frequency: 'monthly',
          units: 1,
          unitLabel: 'Bulk Package',
          unitRateNGN: itemSubtotal,
          subtotalNGN: itemSubtotal,
          discountPercent,
          discountNGN: itemDiscount,
          vatNGN: itemVat,
          totalNGN: itemTotal,
        },
        batchItemsCount: cart.length,
        batchServices: cart.map(c => ({
          serviceId: c.service.id,
          serviceTitle: c.service.title,
          packageName: c.selectedPackage.name,
          price: c.selectedPackage.priceDisplay,
        })),
      };
    });

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('msmebooks_client_bookings') || '[]');
      const updated = [...createdBookings, ...existing];
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Trigger window event for reactive sync across open tabs & App.tsx
    window.dispatchEvent(new Event('msmebooks_bookings_changed'));

    // Trigger rich notification
    addAppNotification({
      type: 'booking',
      title: `Enterprise Bulk Booking Confirmed (${cart.length} Services)`,
      message: `Successfully scheduled ${cart.length} professional service packages under Batch #${bulkBatchId}. 10% Enterprise Discount applied!`,
      priority: 'high',
      linkId: bulkBatchId,
      bookingRef: bulkBatchId,
      actionType: 'open_bookings',
      actionLabel: 'View in Dashboard',
      metadata: {
        batchId: bulkBatchId,
        servicesCount: cart.length,
        totalAmount: formatAmt(totalNGN),
        companyName,
      },
    });

    setIsSubmitted(true);
    if (onBookingComplete) {
      onBookingComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#102B4E] to-[#1464C8] text-[#B7E532] flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#102B4E] dark:text-white">
                  Enterprise Bulk Service Booking
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#B7E532] text-[10px] font-black border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <Percent className="w-2.5 h-2.5" /> 10% Bundle Discount
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Schedule multiple verified service packages across certified partners in a single unified workflow.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!isSubmitted && (
          <div className="px-6 py-3 bg-slate-50 dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                  currentStep === 1 ? 'text-[#1464C8] dark:text-[#B7E532]' : 'text-slate-500'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                  currentStep === 1 ? 'bg-[#1464C8] text-white' : 'bg-slate-200 dark:bg-slate-800'
                }`}>1</span>
                <span>Services ({cart.length})</span>
              </button>

              <span className="text-slate-300 dark:text-slate-700">→</span>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={cart.length === 0}
                className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                  currentStep === 2 ? 'text-[#1464C8] dark:text-[#B7E532]' : 'text-slate-500'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                  currentStep === 2 ? 'bg-[#1464C8] text-white' : 'bg-slate-200 dark:bg-slate-800'
                }`}>2</span>
                <span>Enterprise Details</span>
              </button>

              <span className="text-slate-300 dark:text-slate-700">→</span>

              <button
                onClick={() => setCurrentStep(3)}
                disabled={cart.length === 0}
                className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                  currentStep === 3 ? 'text-[#1464C8] dark:text-[#B7E532]' : 'text-slate-500'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                  currentStep === 3 ? 'bg-[#1464C8] text-white' : 'bg-slate-200 dark:bg-slate-800'
                }`}>3</span>
                <span>Billing & Confirmation</span>
              </button>
            </div>

            <span className="text-xs font-black text-[#102B4E] dark:text-[#B7E532] hidden sm:inline">
              Total: {formatAmt(totalNGN)}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {/* SUCCESS SCREEN */}
          {isSubmitted ? (
            <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50 dark:ring-emerald-950/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#102B4E] dark:text-white">
                  Bulk Order Scheduled Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  All <strong className="text-[#102B4E] dark:text-white">{cart.length} professional service packages</strong> have been booked and registered for <strong className="text-[#102B4E] dark:text-white">{companyName}</strong>. 
                  Assigned partner firms have been notified and will reach out prior to kick-off on <strong className="text-[#1464C8] dark:text-[#B7E532]">{kickOffDate}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#07111D] rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Entity:</span>
                  <span className="font-bold">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Services:</span>
                  <span className="font-bold">{cart.length} Certified Packages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enterprise Discount:</span>
                  <span className="font-bold text-emerald-600 dark:text-[#B7E532]">10% Applied (-{formatAmt(discountNGN)})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-extrabold text-[#102B4E] dark:text-white">Consolidated Total:</span>
                  <span className="font-black text-sm text-[#1464C8] dark:text-[#B7E532]">{formatAmt(totalNGN)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClearCart();
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: CONFIGURE SERVICES IN BULK CART */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#102B4E] dark:text-white">
                        Selected Service Packages ({cart.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Customize tier packages and assigned providers for each selected service.
                      </p>
                    </div>

                    {cart.length > 0 && (
                      <button
                        onClick={onClearCart}
                        className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-[#07111D] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
                      <p className="text-xs text-slate-500">Your bulk booking cart is empty.</p>
                      <button
                        onClick={onClose}
                        className="mt-3 px-4 py-2 bg-[#1464C8] text-white text-xs font-bold rounded-xl"
                      >
                        Explore Marketplace Services
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, idx) => {
                        const matchingFirms = PROFESSIONAL_FIRMS.filter(f =>
                          item.service.verifiedProviderIds.includes(f.id) || f.servicesOfferedIds.includes(item.service.id)
                        );
                        const availableFirms = matchingFirms.length > 0 ? matchingFirms : [PROFESSIONAL_FIRMS[0]];

                        return (
                          <div
                            key={item.service.id}
                            className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <span className="w-6 h-6 rounded-full bg-[#102B4E] dark:bg-[#1464C8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="space-y-1">
                                <h4 className="text-xs font-black text-[#102B4E] dark:text-white leading-tight">
                                  {item.service.title}
                                </h4>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300">
                                  {item.service.category}
                                </span>
                              </div>
                            </div>

                            {/* Package Select */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="text-xs">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  Package Tier
                                </label>
                                <select
                                  value={item.selectedPackage.id}
                                  onChange={(e) => {
                                    const nextPkg = item.service.packages.find(p => p.id === e.target.value) || item.service.packages[0];
                                    onUpdateCartItem(item.service.id, { selectedPackage: nextPkg });
                                  }}
                                  className="bg-white dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                                >
                                  {item.service.packages.map((pkg) => (
                                    <option key={pkg.id} value={pkg.id}>
                                      {pkg.name} ({formatPriceString(pkg.priceDisplay)})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Provider Firm Select */}
                              <div className="text-xs">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  Assigned Provider Firm
                                </label>
                                <select
                                  value={item.selectedFirm.id}
                                  onChange={(e) => {
                                    const nextFirm = PROFESSIONAL_FIRMS.find(f => f.id === e.target.value) || PROFESSIONAL_FIRMS[0];
                                    onUpdateCartItem(item.service.id, { selectedFirm: nextFirm });
                                  }}
                                  className="bg-white dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer max-w-[200px] truncate"
                                >
                                  {availableFirms.map((f) => (
                                    <option key={f.id} value={f.id}>
                                      {f.name} ({f.city}) - ★{f.rating}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Remove Item Button */}
                              <button
                                onClick={() => onRemoveCartItem(item.service.id)}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer self-end md:self-center"
                                title="Remove service from bulk order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ENTERPRISE INFO & SCHEDULING */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#102B4E] dark:text-white">
                      Enterprise Organization & Coordination Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Provide contact credentials for stakeholder orientation and schedule the kick-off timeline.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Corporate / Organization Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                        placeholder="e.g. Apex Holdings Ltd"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Primary Stakeholder / Director Name *
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                        placeholder="e.g. Tunde Balogun"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                        placeholder="tunde@company.africa"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Phone / WhatsApp Contact *
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                        placeholder="+234 803 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold cursor-pointer"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Uganda">Uganda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        City / Operational State
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                        placeholder="e.g. Lagos / Nairobi / Accra"
                      />
                    </div>
                  </div>

                  {/* Kick-off and Strategy */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Target Kick-Off Date *
                      </label>
                      <input
                        type="date"
                        value={kickOffDate}
                        onChange={(e) => setKickOffDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Implementation Rollout Strategy
                      </label>
                      <select
                        value={deploymentStrategy}
                        onChange={(e) => setDeploymentStrategy(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold cursor-pointer"
                      >
                        <option value="simultaneous">Simultaneous Kick-off (All providers in parallel)</option>
                        <option value="staggered">Staggered Milestones (Sequential phased delivery)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Coordination Notes & Deliverable Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#07111D] border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                      placeholder="Specify any internal ERP modules, compliance deadlines, or team availability..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CONSOLIDATED INVOICE, PAYMENT QR & CONFIRMATION */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Invoice Summary (7 Cols) */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-[#07111D] rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#102B4E] dark:text-white mb-3 flex items-center justify-between">
                          <span>Consolidated Order Breakdown</span>
                          <span className="text-[10px] text-emerald-600 dark:text-[#B7E532] font-black">
                            10% Multi-Service Discount
                          </span>
                        </h4>

                        <div className="space-y-2 text-xs">
                          {cart.map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-slate-600 dark:text-slate-300 py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                              <span className="line-clamp-1 flex-1 pr-2">
                                {i + 1}. {c.service.title} ({c.selectedPackage.name})
                              </span>
                              <span className="font-bold text-slate-800 dark:text-slate-100">
                                {formatAmt(parsePrice(c.selectedPackage.priceDisplay))}
                              </span>
                            </div>
                          ))}

                          <div className="pt-2 flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Catalog Subtotal:</span>
                            <span>{formatAmt(subtotalNGN)}</span>
                          </div>

                          <div className="flex justify-between text-emerald-600 dark:text-[#B7E532] font-bold">
                            <span>Enterprise 10% Bundle Discount:</span>
                            <span>-{formatAmt(discountNGN)}</span>
                          </div>

                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Statutory 7.5% VAT:</span>
                            <span>+{formatAmt(vatNGN)}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-300 dark:border-slate-700 flex justify-between text-sm font-black text-[#102B4E] dark:text-white">
                            <span>Consolidated Total:</span>
                            <span className="text-[#1464C8] dark:text-[#B7E532]">
                              {formatAmt(totalNGN)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                          Preferred Settlement Gateway
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {(['Paystack', 'Flutterwave', 'M-Pesa', 'Monnify', 'Bank Transfer'] as const).map((gw) => (
                            <button
                              key={gw}
                              type="button"
                              onClick={() => setPaymentGatewayName(gw)}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                paymentGatewayName === gw
                                  ? 'bg-[#1464C8] text-white border-[#1464C8] shadow-xs'
                                  : 'bg-slate-50 dark:bg-[#07111D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{gw}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* QR Code and Quick Pay (5 Cols) */}
                    <div className="md:col-span-5 bg-slate-50 dark:bg-[#07111D] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B4E] dark:text-white mb-2">
                        <QrCode className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                        <span>Corporate Scan-and-Pay</span>
                      </div>
                      <PaymentQRCode
                        gateway={selectedGatewayObj}
                        amountFormatted={formatAmt(totalNGN)}
                        amountNGN={totalNGN}
                        bookingRef={`BULK-${Math.floor(100000 + Math.random() * 900000)}`}
                        serviceTitle={`Bulk Package (${cart.length} Services)`}
                        customerName={companyName}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isSubmitted && (
          <div className="sticky bottom-0 bg-slate-50 dark:bg-[#07111D] p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-[#0A1727] border border-slate-300 dark:border-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 3 ? (
              <button
                disabled={cart.length === 0}
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="px-6 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBulkBooking}
                className="px-6 py-2.5 bg-[#B7E532] hover:bg-[#a5d426] text-[#102B4E] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Schedule {cart.length} Services</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
