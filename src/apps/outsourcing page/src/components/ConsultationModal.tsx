import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  User, 
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Lock,
  Layers,
  FileText,
  CreditCard,
  Building,
  Briefcase,
  Sliders,
  DollarSign,
  TrendingDown,
  Info
} from 'lucide-react';
import { CountryInfo, CurrencyCode, ProfessionalProfile } from '../types';
import { VERIFIED_PROFESSIONALS, COUNTRIES } from '../data/mockData';
import { formatPrice } from '../utils/currency';
import { useToast } from '../context/ToastContext';

export type BookingPricingModel = 'hourly' | 'fixed' | 'free';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  selectedCountry: CountryInfo;
  preselectedPro?: ProfessionalProfile | null;
  initialPricingModel?: BookingPricingModel;
  onProceedToCheckout?: (bookingConfig: any) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  selectedCountry,
  preselectedPro,
  initialPricingModel = 'hourly',
  onProceedToCheckout,
}) => {
  const { toast } = useToast();
  const [pricingModel, setPricingModel] = useState<BookingPricingModel>(initialPricingModel);
  const [serviceCategory, setServiceCategory] = useState<string>('Accounting & Financial Reporting');
  const [selectedProId, setSelectedProId] = useState<string>(preselectedPro?.id || 'prof-1');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM - 12:00 PM');
  
  // Hourly rate configuration
  const [hourlyHours, setHourlyHours] = useState<number>(2);
  
  // Fixed rate configuration
  const [fixedTier, setFixedTier] = useState<'retainer' | 'audit' | 'board'>('retainer');

  // Contact details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState<string>('');
  
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedBookingSummary, setConfirmedBookingSummary] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update selected pro and initial model if preselectedPro changes
  useEffect(() => {
    if (preselectedPro) {
      setSelectedProId(preselectedPro.id);
    }
  }, [preselectedPro]);

  useEffect(() => {
    if (initialPricingModel) {
      setPricingModel(initialPricingModel);
    }
  }, [initialPricingModel]);

  const selectedPro = useMemo(() => {
    return VERIFIED_PROFESSIONALS.find(p => p.id === selectedProId) || VERIFIED_PROFESSIONALS[0];
  }, [selectedProId]);

  // Pricing calculations
  // 1. Hourly calculations
  const hourlyDiscount = hourlyHours >= 10 ? 0.10 : hourlyHours >= 5 ? 0.05 : 0;
  const rawHourlyTotalUSD = hourlyHours * selectedPro.hourlyRateUSD;
  const discountedHourlyUSD = Math.round(rawHourlyTotalUSD * (1 - hourlyDiscount));

  // 2. Fixed calculations
  const fixedRateMultiplier = fixedTier === 'audit' ? 0.65 : fixedTier === 'board' ? 1.4 : 1.0;
  const fixedTotalUSD = Math.round(selectedPro.fixedRateUSD * fixedRateMultiplier);

  // Active pricing values
  const activeRateUSD = pricingModel === 'hourly' 
    ? discountedHourlyUSD 
    : pricingModel === 'fixed' 
    ? fixedTotalUSD 
    : 0;

  const vatAmountUSD = Math.round(activeRateUSD * 0.075);
  const grandTotalUSD = activeRateUSD + vatAmountUSD;

  // Trigger positive feedback confetti animation upon successful booking
  useEffect(() => {
    if (isConfirmed) {
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#a3e635', '#2563eb', '#10b981', '#38bdf8', '#f59e0b']
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#a3e635', '#2563eb', '#ffffff']
          });
        }, 180);

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#a3e635', '#2563eb', '#ffffff']
          });
        }, 360);
      } catch (err) {
        console.error('Confetti animation error:', err);
      }
    }
  }, [isConfirmed]);

  if (!isOpen) return null;

  const getBookingPayload = () => ({
    title: pricingModel === 'hourly'
      ? `${hourlyHours}-Hour Advisory with ${selectedPro.name}`
      : pricingModel === 'fixed'
      ? `Fixed Outsourcing: ${fixedTier === 'retainer' ? 'Monthly Dedicated Retainer' : fixedTier === 'audit' ? 'Milestone Audit & Tax Health Check' : 'Executive Board & Valuation Pack'} (${selectedPro.name})`
      : `Free 30-Min Discovery with ${selectedPro.name}`,
    pricingModel,
    proName: selectedPro.name,
    proTitle: selectedPro.title,
    proAvatar: selectedPro.avatarUrl,
    selectedDate,
    selectedTimeSlot,
    clientName,
    clientEmail,
    companyName,
    serviceCategory,
    hours: pricingModel === 'hourly' ? hourlyHours : undefined,
    hourlyRateUSD: selectedPro.hourlyRateUSD,
    fixedTier: pricingModel === 'fixed' ? fixedTier : undefined,
    baseRateUSD: activeRateUSD,
    totalPayableUSD: grandTotalUSD,
    bookingRef: `MSME-BK-${Math.floor(10000 + Math.random() * 90000)}`,
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMessage('Please provide your full name and work email address.');
      return;
    }
    setErrorMessage('');

    const payload = getBookingPayload();
    setConfirmedBookingSummary(payload);
    setIsConfirmed(true);

    const modelName = pricingModel === 'hourly' ? 'Hourly Engagement' : pricingModel === 'fixed' ? 'Fixed Retainer' : 'Free Discovery';
    toast.success(
      `${modelName} booked with ${selectedPro.name}. Calendar invite sent to ${clientEmail}.`,
      'Outsourcing Service Reserved'
    );
  };

  const handleCheckoutHandover = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMessage('Please provide your full name and work email address before checkout.');
      return;
    }
    setErrorMessage('');

    const payload = getBookingPayload();
    if (onProceedToCheckout) {
      onProceedToCheckout(payload);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-lime-400/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-grotesk text-white">
                  Book Outsourcing Services & Consultation
                </h3>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-800 hidden sm:inline">
                  {selectedCountry.flag} {selectedCurrency} Rates
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose between Fixed Retainer, Hourly Advisory, or Free Discovery
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsConfirmed(false);
              setErrorMessage('');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isConfirmed && confirmedBookingSummary ? (
            <div className="text-center py-4 sm:py-6 space-y-5 relative overflow-hidden">
              
              {/* Animated glowing celebration avatar with draw-in checkmark */}
              <div className="relative flex items-center justify-center my-2">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute w-20 h-20 rounded-full bg-lime-400/30"
                />
                
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-lime-400 to-lime-300 shadow-2xl shadow-lime-400/40 flex items-center justify-center border-4 border-slate-900"
                >
                  <Check className="w-8 h-8 text-slate-950 stroke-[3]" />
                </motion.div>
              </div>

              {/* Success Heading & Badge */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-950 border border-lime-800 text-lime-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Outsourcing Engagement Reserved & Confirmed</span>
                </div>
                
                <h4 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-white">
                  Booking Confirmed!
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  A calendar invitation and direct Google Meet room have been dispatched to{' '}
                  <span className="font-bold text-lime-400">{clientEmail}</span>.
                </p>
              </div>

              {/* Official Booking Confirmation Voucher Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 max-w-lg mx-auto text-left text-xs space-y-3.5 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={selectedPro.avatarUrl} 
                      alt={selectedPro.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-lime-400" 
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{selectedPro.name}</div>
                      <div className="text-[11px] text-slate-400">{selectedPro.title}</div>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-800 font-bold">
                    Ref: {confirmedBookingSummary.bookingRef}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Rate Model:</span>
                    <span className="font-bold text-white uppercase text-xs">
                      {pricingModel === 'hourly' && `Hourly Rate (${hourlyHours} Hours @ ${formatPrice(selectedPro.hourlyRateUSD, selectedCurrency)}/hr)`}
                      {pricingModel === 'fixed' && `Fixed Scope Package (${fixedTier.toUpperCase()})`}
                      {pricingModel === 'free' && 'Free 30-Min Discovery Session'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Scheduled Date & Time:</span>
                    <span className="font-bold text-lime-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedDate} • {selectedTimeSlot}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Subscribing Client:</span>
                    <span className="font-semibold text-slate-200">
                      {clientName} {companyName ? `(${companyName})` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Engagement Fee:</span>
                    <span className="font-extrabold text-base text-lime-400 font-grotesk">
                      {pricingModel === 'free' ? 'FREE ($0)' : formatPrice(grandTotalUSD, selectedCurrency)}
                    </span>
                  </div>
                </div>

                {/* Scope Note */}
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">SLA & Regulatory Backing: </span>
                    {pricingModel === 'hourly' && 'Includes time-stamped advisory memo, recorded video session, and timesheet logging.'}
                    {pricingModel === 'fixed' && 'Full deliverable completion guarantee under MsmeBooks standard professional SLA.'}
                    {pricingModel === 'free' && 'Discovery session to scope and structure your ongoing outsourcing requirements.'}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {pricingModel !== 'free' && onProceedToCheckout && (
                  <button
                    type="button"
                    onClick={() => {
                      onProceedToCheckout(confirmedBookingSummary);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatPrice(grandTotalUSD, selectedCurrency)} Online Now</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmed(false);
                    setErrorMessage('');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-5">
              
              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
                  <span>{errorMessage}</span>
                  <button type="button" onClick={() => setErrorMessage('')} className="text-red-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* RATE MODEL SELECTION: FIXED VS HOURLY VS FREE DISCOVERY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Outsourcing Pricing Model
                  </label>
                  <span className="text-[11px] text-lime-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Transparent Rates • Zero Hidden Surcharges
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Hourly Rates Option */}
                  <button
                    type="button"
                    onClick={() => setPricingModel('hourly')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      pricingModel === 'hourly'
                        ? 'bg-blue-950/60 border-lime-400 ring-2 ring-lime-400/50 text-white shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                          <Clock className="w-3.5 h-3.5 text-lime-400" />
                          Hourly Rates
                        </span>
                        <span className="text-[9px] font-bold bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">
                          Flexible
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-lime-400 font-grotesk mt-0.5">
                        {formatPrice(selectedPro.hourlyRateUSD, selectedCurrency)}
                        <span className="text-[10px] text-slate-400 font-normal"> / hr</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        Pay strictly for hours worked on specific audits, troubleshooting, or modeling.
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[9px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-lime-400 shrink-0" />
                      <span>1 to 40 hours with timesheet</span>
                    </div>
                  </button>

                  {/* Option 2: Fixed Rates Option */}
                  <button
                    type="button"
                    onClick={() => setPricingModel('fixed')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      pricingModel === 'fixed'
                        ? 'bg-blue-950/60 border-lime-400 ring-2 ring-lime-400/50 text-white shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          Fixed Rates
                        </span>
                        <span className="text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                          100% Fixed
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-lime-400 font-grotesk mt-0.5">
                        {formatPrice(selectedPro.fixedRateUSD, selectedCurrency)}
                        <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        Fixed monthly retainer or project scope. Zero unexpected hour overages.
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[9px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Guaranteed SLA deliverables</span>
                    </div>
                  </button>

                  {/* Option 3: Free Discovery Call */}
                  <button
                    type="button"
                    onClick={() => setPricingModel('free')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      pricingModel === 'free'
                        ? 'bg-blue-950/60 border-lime-400 ring-2 ring-lime-400/50 text-white shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                          <Video className="w-3.5 h-3.5 text-blue-400" />
                          Free Discovery
                        </span>
                        <span className="text-[9px] font-bold bg-lime-950 text-lime-300 px-1.5 py-0.5 rounded">
                          Free $0
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white font-grotesk mt-0.5">
                        $0 Free
                        <span className="text-[10px] text-slate-400 font-normal"> (30 Mins)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        Introductory consultation to assess your accounting & compliance requirements.
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[9px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Zero commitment video call</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* DYNAMIC CONFIGURATION ACCORDING TO SELECTED PRICING MODEL */}

              {/* 1. HOURLY RATES CONFIGURATION */}
              {pricingModel === 'hourly' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-lime-400" />
                        Hourly Engagement Duration & Hours Allocation
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Base rate: {formatPrice(selectedPro.hourlyRateUSD, selectedCurrency)}/hour with certified sign-off.
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-lime-400 font-mono">
                      {hourlyHours} Hours Selected
                    </span>
                  </div>

                  {/* Preset hour chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { hours: 1, label: '1 Hour', desc: 'Ad-Hoc Advisory' },
                      { hours: 2, label: '2 Hours', desc: 'Audit & Review' },
                      { hours: 5, label: '5 Hours', desc: '5% Bundle Off' },
                      { hours: 10, label: '10 Hours', desc: '10% Retainer Off' },
                    ].map((preset) => (
                      <button
                        key={preset.hours}
                        type="button"
                        onClick={() => setHourlyHours(preset.hours)}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          hourlyHours === preset.hours
                            ? 'bg-lime-400 text-slate-950 font-bold border-lime-400 shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-medium'
                        }`}
                      >
                        <div className="font-bold text-xs">{preset.label}</div>
                        <div className="text-[10px] opacity-80">{preset.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Hourly Slider */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Adjust hours:</span>
                      <span className="text-white font-bold">{hourlyHours} billable hours</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="1"
                      value={hourlyHours}
                      onChange={(e) => setHourlyHours(Number(e.target.value))}
                      className="w-full accent-lime-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>1 hr (Min)</span>
                      <span>10 hrs</span>
                      <span>20 hrs</span>
                      <span>40 hrs (Full Project Block)</span>
                    </div>
                  </div>

                  {/* Calculation summary line */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="text-slate-400">
                      <span>Calculated Rate: </span>
                      <span className="font-mono text-white">
                        {hourlyHours} hrs × {formatPrice(selectedPro.hourlyRateUSD, selectedCurrency)}
                        {hourlyDiscount > 0 && ` (-${hourlyDiscount * 100}% block discount)`}
                      </span>
                    </div>
                    <div className="font-bold text-lime-400 text-sm font-grotesk">
                      {formatPrice(discountedHourlyUSD, selectedCurrency)}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. FIXED RATES CONFIGURATION */}
              {pricingModel === 'fixed' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        Fixed-Rate Outsourcing Packages & Scopes
                      </span>
                      <p className="text-[11px] text-slate-400">
                        100% price certainty. Guaranteed deliverables backed by SLA.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Zero Overages
                    </span>
                  </div>

                  {/* Fixed Tier Cards */}
                  <div className="space-y-2">
                    {[
                      {
                        id: 'retainer' as const,
                        title: 'Fixed Monthly Dedicated Retainer',
                        rateUSD: selectedPro.fixedRateUSD,
                        cadence: '/ month',
                        desc: selectedPro.fixedPackageScope || 'Monthly Full-Cycle Management Accounts & Tax Filing Retainer',
                        badge: 'Recommended',
                      },
                      {
                        id: 'audit' as const,
                        title: 'Fixed Milestone Audit & Tax Health Check',
                        rateUSD: Math.round(selectedPro.fixedRateUSD * 0.65),
                        cadence: 'one-time fee',
                        desc: 'Complete historic general ledger clean-up, past VAT/CIT gap audit, and compliance sign-off.',
                        badge: 'Milestone',
                      },
                      {
                        id: 'board' as const,
                        title: 'Executive Board Pack & CFO Restructuring',
                        rateUSD: Math.round(selectedPro.fixedRateUSD * 1.4),
                        cadence: 'comprehensive scope',
                        desc: 'IFRS valuation pack, 3-year cash flow forecasting model, and presentation for investors & lenders.',
                        badge: 'CFO Level',
                      },
                    ].map((tier) => {
                      const isSelected = fixedTier === tier.id;
                      return (
                        <label
                          key={tier.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'bg-blue-950/60 border-lime-400 text-white ring-1 ring-lime-400/40'
                              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="fixedTier"
                            checked={isSelected}
                            onChange={() => setFixedTier(tier.id)}
                            className="mt-1 accent-lime-400 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                {tier.title}
                              </span>
                              <span className="font-extrabold text-lime-400 text-xs font-grotesk whitespace-nowrap">
                                {formatPrice(tier.rateUSD, selectedCurrency)} <span className="text-[10px] text-slate-400 font-normal">{tier.cadence}</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                              {tier.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SPECIALIST SELECTION & SERVICE DOMAIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Assigned Chartered Specialist
                  </label>
                  <select
                    value={selectedProId}
                    onChange={(e) => setSelectedProId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer outline-none focus:ring-1 focus:ring-lime-400"
                  >
                    {VERIFIED_PROFESSIONALS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.title} ({p.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Outsourcing Service Discipline
                  </label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer outline-none focus:ring-1 focus:ring-lime-400"
                  >
                    <option value="Accounting & Financial Reporting">Accounting & Financial Reporting</option>
                    <option value="Payroll Outsourcing & Compliance">Payroll Outsourcing & Compliance</option>
                    <option value="HR Administration & Governance">HR Administration & Governance</option>
                    <option value="Statutory Tax & Regulatory Returns">Statutory Tax & Regulatory Returns</option>
                    <option value="Virtual CFO Strategic Advisory">Virtual CFO Strategic Advisory</option>
                    <option value="Cross-Border EAC/ECOWAS Trade">Cross-Border EAC/ECOWAS Trade</option>
                  </select>
                </div>
              </div>

              {/* DATE & TIME SLOT SELECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Kickoff Video Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Time Slot (WAT / EAT / SAST)
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer outline-none focus:ring-1 focus:ring-lime-400"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM (Morning Slot)</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM (Mid-Day Slot)</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon Slot)</option>
                    <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Late Afternoon)</option>
                  </select>
                </div>
              </div>

              {/* CLIENT DETAILS */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Client & Entity Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tunde Balogun"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Company / Entity Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Global Ventures Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="tunde@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+234 / +254 / +27 ..."
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Specific Outsourcing Scope or Brief (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what you'd like your accounting specialist to handle (e.g. Monthly VAT audit, backlog reconciliations, payroll setup)..."
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>
              </div>

              {/* LIVE PRICING SUMMARY CARD */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Contracting Model:</span>
                  <span className="font-bold text-white uppercase">
                    {pricingModel === 'hourly' && `Hourly Engagement (${hourlyHours} hrs)`}
                    {pricingModel === 'fixed' && `Fixed Scope (${fixedTier.toUpperCase()})`}
                    {pricingModel === 'free' && 'Discovery Call (Zero Cost)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Base Rate:</span>
                  <span className="font-semibold text-white">
                    {pricingModel === 'free' ? '$0' : formatPrice(activeRateUSD, selectedCurrency)}
                  </span>
                </div>

                {pricingModel !== 'free' && (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Statutory VAT (7.5%):</span>
                    <span>{formatPrice(vatAmountUSD, selectedCurrency)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Due:</span>
                    <span className="text-[10px] text-slate-500">256-Bit SSL Encrypted Booking</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-lime-400 font-grotesk block">
                      {pricingModel === 'free' ? 'FREE ($0)' : formatPrice(grandTotalUSD, selectedCurrency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* DUAL SUBMISSION CTAS */}
              <div className="space-y-2.5 pt-1">
                {pricingModel !== 'free' && onProceedToCheckout ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCheckoutHandover}
                      className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Instant Gateway Checkout</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Book & Request Invoice</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirm Consultation Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
