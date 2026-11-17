import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Building2, 
  ShieldCheck, 
  MessageCircle, 
  FileText, 
  Upload, 
  MapPin, 
  Star,
  Check,
  AlertCircle,
  Minus,
  Plus,
  Calculator,
  CreditCard,
  Smartphone,
  Lock,
  Wallet,
  Globe,
  Zap,
  Sparkles,
  Ticket,
  Tag
} from 'lucide-react';
import { SERVICES_CATALOGUE, ServiceItem, ServicePackage, getServiceBillingRates } from '../data/servicesData';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { BookingRecord, AppliedBookingDiscount } from '../types/booking';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import { PAYMENT_GATEWAYS, getGatewayById } from '../data/paymentGateways';
import { PaymentGateway, PaymentGatewayId, PaymentCheckoutResult } from '../types/payment';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { PaymentProcessor, CountryPaymentSummary } from '../utils/paymentProcessor';
import { PaymentGatewayRouter } from './PaymentGatewayRouter';
import { PaymentQRCode } from './PaymentQRCode';
import { addAppNotification } from '../utils/notificationService';
import { sendBookingConfirmationEmail, ClientEmailRecord } from '../utils/emailNotification';
import { QuickPayModal } from './QuickPayModal';
import { CalendarSyncButton } from './CalendarSyncButton';
import { QrCode, Mail, ExternalLink, Loader2, CalendarCheck, LogOut, RefreshCw } from 'lucide-react';
import { getWalletState, payWithWallet } from '../utils/walletStorage';
import { User } from 'firebase/auth';
import {
  initCalendarAuth,
  googleSignInForCalendar,
  googleCalendarSignOut,
  getCalendarAccessToken,
  pushBookingToGoogleCalendar,
  GoogleCalendarSyncResult,
} from '../utils/googleCalendarService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialPackage?: ServicePackage | null;
  initialFirm?: ProfessionalFirm | null;
  initialDate?: string;
  initialTimeSlot?: string;
  initialRequirements?: string;
  onBookingConfirmed: (booking: BookingRecord) => void;
  onViewConfirmationEmail?: (emailId?: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialPackage,
  initialFirm,
  initialDate,
  initialTimeSlot,
  initialRequirements,
  onBookingConfirmed,
  onViewConfirmationEmail,
}) => {
  const { formatPriceString, formatAmount } = useCurrency();
  const [sentEmailRecord, setSentEmailRecord] = useState<ClientEmailRecord | null>(null);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false);
  const [confirmedBookingRecord, setConfirmedBookingRecord] = useState<BookingRecord | null>(null);

  // MsmeBooks Wallet Quick Pay state
  const [walletBalanceNGN, setWalletBalanceNGN] = useState<number>(() => getWalletState().balanceNGN);
  const [quickPayWalletEnabled, setQuickPayWalletEnabled] = useState<boolean>(false);
  const [walletDeductionError, setWalletDeductionError] = useState<string | null>(null);

  // Google Calendar API Auto-Sync state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [calendarNeedsAuth, setCalendarNeedsAuth] = useState<boolean>(() => !getCalendarAccessToken());
  const [autoSyncGoogleCalendar, setAutoSyncGoogleCalendar] = useState<boolean>(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState<boolean>(false);
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncedCalendarEvent, setSyncedCalendarEvent] = useState<GoogleCalendarSyncResult | null>(null);
  const [calendarSyncError, setCalendarSyncError] = useState<string | null>(null);
  const [confirmCalendarPushPending, setConfirmCalendarPushPending] = useState<boolean>(false);
  const [lastCalendarSyncAt, setLastCalendarSyncAt] = useState<string | null>(null);

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || SERVICES_CATALOGUE[0].id
  );
  
  const currentService = SERVICES_CATALOGUE.find(s => s.id === selectedServiceId) || SERVICES_CATALOGUE[0];

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || currentService.packages[1]?.id || currentService.packages[0].id
  );

  const currentPackage = currentService.packages.find(p => p.id === selectedPackageId) || currentService.packages[0];

  // Billing Preference: 'hourly' vs 'fixed' (with frequency options: Days, Monthly, Quarterly, Bi-Yearly, Yearly)
  const [billingType, setBillingType] = useState<'hourly' | 'fixed'>('hourly');
  const [fixedFrequency, setFixedFrequency] = useState<'days' | 'monthly' | 'quarterly' | 'bi-yearly' | 'yearly'>('days');
  const [hoursNeeded, setHoursNeeded] = useState<number>(4);
  const [daysNeeded, setDaysNeeded] = useState<number>(3);
  const [billingMonths, setBillingMonths] = useState<number>(1);
  const [billingQuarters, setBillingQuarters] = useState<number>(1);
  const [billingBiYears, setBillingBiYears] = useState<number>(1);
  const [billingYears, setBillingYears] = useState<number>(1);

  // Live calculation based on service package & user-selected frequency
  // Loyalty points discount applied for this booking session (from Customer Dashboard Points Redemption)
  const [appliedPointsDiscount, setAppliedPointsDiscount] = useState<AppliedBookingDiscount | null>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_applied_service_discount');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Sync applied discount if updated from dashboard or other events
  React.useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('msmebooks_applied_service_discount');
        if (saved) setAppliedPointsDiscount(JSON.parse(saved));
        else setAppliedPointsDiscount(null);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('msmebooks_applied_discount_changed', handleSync);
    return () => window.removeEventListener('msmebooks_applied_discount_changed', handleSync);
  }, []);

  const billingRates = getServiceBillingRates(currentPackage.name);

  // Complete itemized billing invoice calculation
  const invoiceBreakdown = React.useMemo(() => {
    // Check if points discount applies to this service
    const pointsDiscountVal = (appliedPointsDiscount && (!appliedPointsDiscount.serviceId || appliedPointsDiscount.serviceId === currentService.id))
      ? appliedPointsDiscount.discountNGN
      : 0;
    const promoCodeApplied = pointsDiscountVal > 0 ? appliedPointsDiscount?.code : undefined;

    if (billingType === 'hourly') {
      const subtotal = hoursNeeded * billingRates.hourlyRateNGN;
      const net = Math.max(0, subtotal - pointsDiscountVal);
      const vat = Math.round(net * 0.075);
      return {
        frequency: 'hourly' as const,
        units: hoursNeeded,
        unitLabel: `${hoursNeeded} ${hoursNeeded === 1 ? 'Hour' : 'Hours'}`,
        unitRateNGN: billingRates.hourlyRateNGN,
        rateLabel: `${formatAmount(billingRates.hourlyRateNGN)} / hour`,
        subtotalNGN: subtotal,
        discountPercent: 0,
        discountNGN: 0,
        pointsDiscountNGN: pointsDiscountVal,
        promoCodeApplied,
        netSubtotalNGN: net,
        vatNGN: vat,
        totalNGN: net + vat,
      };
    }

    if (fixedFrequency === 'days') {
      const subtotal = daysNeeded * billingRates.fixedDayRateNGN;
      const net = Math.max(0, subtotal - pointsDiscountVal);
      const vat = Math.round(net * 0.075);
      return {
        frequency: 'days' as const,
        units: daysNeeded,
        unitLabel: `${daysNeeded} ${daysNeeded === 1 ? 'Day' : 'Days'}`,
        unitRateNGN: billingRates.fixedDayRateNGN,
        rateLabel: `${formatAmount(billingRates.fixedDayRateNGN)} / day`,
        subtotalNGN: subtotal,
        discountPercent: 0,
        discountNGN: 0,
        pointsDiscountNGN: pointsDiscountVal,
        promoCodeApplied,
        netSubtotalNGN: net,
        vatNGN: vat,
        totalNGN: net + vat,
      };
    }

    if (fixedFrequency === 'monthly') {
      const monthlyRate = billingRates.fixedDayRateNGN * 20;
      const subtotal = billingMonths * monthlyRate;
      const net = Math.max(0, subtotal - pointsDiscountVal);
      const vat = Math.round(net * 0.075);
      return {
        frequency: 'monthly' as const,
        units: billingMonths,
        unitLabel: `${billingMonths} ${billingMonths === 1 ? 'Month' : 'Months'} Retainer`,
        unitRateNGN: monthlyRate,
        rateLabel: `${formatAmount(monthlyRate)} / month`,
        subtotalNGN: subtotal,
        discountPercent: 0,
        discountNGN: 0,
        pointsDiscountNGN: pointsDiscountVal,
        promoCodeApplied,
        netSubtotalNGN: net,
        vatNGN: vat,
        totalNGN: net + vat,
      };
    }

    if (fixedFrequency === 'quarterly') {
      const quarterlyRate = billingRates.fixedDayRateNGN * 20 * 3;
      const subtotal = billingQuarters * quarterlyRate;
      const discount = Math.round(subtotal * 0.05);
      const net = Math.max(0, subtotal - discount - pointsDiscountVal);
      const vat = Math.round(net * 0.075);
      return {
        frequency: 'quarterly' as const,
        units: billingQuarters,
        unitLabel: `${billingQuarters} ${billingQuarters === 1 ? 'Quarter (3 Mos)' : 'Quarters'}`,
        unitRateNGN: quarterlyRate,
        rateLabel: `${formatAmount(quarterlyRate)} / quarter`,
        subtotalNGN: subtotal,
        discountPercent: 5,
        discountNGN: discount,
        pointsDiscountNGN: pointsDiscountVal,
        promoCodeApplied,
        netSubtotalNGN: net,
        vatNGN: vat,
        totalNGN: net + vat,
      };
    }

    if (fixedFrequency === 'bi-yearly') {
      const biYearlyRate = billingRates.fixedDayRateNGN * 20 * 6;
      const subtotal = billingBiYears * biYearlyRate;
      const discount = Math.round(subtotal * 0.10);
      const net = Math.max(0, subtotal - discount - pointsDiscountVal);
      const vat = Math.round(net * 0.075);
      return {
        frequency: 'bi-yearly' as const,
        units: billingBiYears,
        unitLabel: `${billingBiYears} ${billingBiYears === 1 ? 'Bi-Yearly (6 Mos)' : 'Terms'}`,
        unitRateNGN: biYearlyRate,
        rateLabel: `${formatAmount(biYearlyRate)} / 6-months`,
        subtotalNGN: subtotal,
        discountPercent: 10,
        discountNGN: discount,
        pointsDiscountNGN: pointsDiscountVal,
        promoCodeApplied,
        netSubtotalNGN: net,
        vatNGN: vat,
        totalNGN: net + vat,
      };
    }

    // Yearly: 12 months with 15% discount
    const annualRate = billingRates.fixedDayRateNGN * 20 * 12;
    const subtotal = billingYears * annualRate;
    const discount = Math.round(subtotal * 0.15);
    const net = Math.max(0, subtotal - discount - pointsDiscountVal);
    const vat = Math.round(net * 0.075);
    return {
      frequency: 'yearly' as const,
      units: billingYears,
      unitLabel: `${billingYears} ${billingYears === 1 ? 'Year (Annual)' : 'Years'}`,
      unitRateNGN: annualRate,
      rateLabel: `${formatAmount(annualRate)} / year`,
      subtotalNGN: subtotal,
      discountPercent: 15,
      discountNGN: discount,
      pointsDiscountNGN: pointsDiscountVal,
      promoCodeApplied,
      netSubtotalNGN: net,
      vatNGN: vat,
      totalNGN: net + vat,
    };
  }, [billingType, fixedFrequency, hoursNeeded, daysNeeded, billingMonths, billingQuarters, billingBiYears, billingYears, billingRates, formatAmount, appliedPointsDiscount, currentService.id]);

  const calculatedTotalNGN = invoiceBreakdown.totalNGN;
  const formattedCalculatedTotal = formatAmount(calculatedTotalNGN);
  const formattedRateDisplay = invoiceBreakdown.rateLabel;

  const [selectedProviderType, setSelectedProviderType] = useState<'firm' | 'auto'>(
    initialFirm ? 'firm' : 'auto'
  );
  const [selectedFirmId, setSelectedFirmId] = useState<string>(
    initialFirm?.id || PROFESSIONAL_FIRMS[0].id
  );

  const currentFirm = PROFESSIONAL_FIRMS.find(f => f.id === selectedFirmId) || PROFESSIONAL_FIRMS[0];

  // Step 3: Consultation details
  const [consultationMode, setConsultationMode] = useState<'Online Consultation' | 'Telephone' | 'Physical Office Visit' | 'On-site Business Visit'>('Online Consultation');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [appointmentDate, setAppointmentDate] = useState(initialDate || '2026-11-10');
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot || '10:30 AM - 12:00 PM');

  // Step 4: Customer Information
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Retail & Supermarkets');
  const [businessSize, setBusinessSize] = useState('1-10 Employees');
  const [requirements, setRequirements] = useState(initialRequirements || '');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(true);

  // Synchronize when opened with Quick Book parameters
  React.useEffect(() => {
    if (initialDate) setAppointmentDate(initialDate);
    if (initialTimeSlot) setTimeSlot(initialTimeSlot);
    if (initialRequirements) setRequirements(initialRequirements);
    if (initialPackage?.id) setSelectedPackageId(initialPackage.id);
    if (initialFirm?.id) setSelectedFirmId(initialFirm.id);
    if (initialService?.id) setSelectedServiceId(initialService.id);
  }, [isOpen, initialDate, initialTimeSlot, initialRequirements, initialPackage, initialFirm, initialService]);

  // Generated Booking Reference
  const [generatedRef, setGeneratedRef] = useState<string>(() => `MSME-BK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Available Time Slots
  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '01:00 PM - 02:30 PM',
    '02:30 PM - 04:00 PM',
    '04:30 PM - 06:00 PM',
  ];

  const [stepError, setStepError] = useState<string | null>(null);

  // Live wallet sufficiency check & event listener
  const hasSufficientWalletFunds = walletBalanceNGN >= calculatedTotalNGN;
  const walletShortfallNGN = Math.max(0, calculatedTotalNGN - walletBalanceNGN);

  React.useEffect(() => {
    const syncWallet = () => {
      setWalletBalanceNGN(getWalletState().balanceNGN);
    };
    window.addEventListener('msmebooks_wallet_changed', syncWallet);
    return () => window.removeEventListener('msmebooks_wallet_changed', syncWallet);
  }, []);

  React.useEffect(() => {
    if (!hasSufficientWalletFunds && quickPayWalletEnabled) {
      setQuickPayWalletEnabled(false);
    }
  }, [hasSufficientWalletFunds, quickPayWalletEnabled]);

  // Subscribe to Firebase Google Calendar auth state (in-memory token only)
  React.useEffect(() => {
    const unsubscribe = initCalendarAuth(
      (user) => {
        setGoogleUser(user);
        setCalendarNeedsAuth(false);
      },
      (user) => {
        setGoogleUser(user);
        setCalendarNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const syncBookingToGoogleCalendar = async (bookingToSync: BookingRecord, overrideToken?: string) => {
    const token = overrideToken || getCalendarAccessToken();
    if (!token) {
      setCalendarNeedsAuth(true);
      setCalendarSyncStatus('error');
      setCalendarSyncError('Please sign in with Google to authorize primary calendar event creation.');
      return;
    }

    setCalendarSyncStatus('syncing');
    setCalendarSyncError(null);

    try {
      const result = await pushBookingToGoogleCalendar(bookingToSync, token);
      setSyncedCalendarEvent(result);
      setCalendarSyncStatus('synced');
      setLastCalendarSyncAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setConfirmCalendarPushPending(false);
      setConfirmedBookingRecord((prev) =>
        prev
          ? {
              ...prev,
              calendarSynced: true,
              googleCalendarEventId: result.eventId,
              googleCalendarHtmlLink: result.htmlLink,
            }
          : prev
      );

      addAppNotification({
        type: 'booking',
        title: 'Synced to Google Calendar',
        message: `Appointment "${bookingToSync.serviceTitle}" (${bookingToSync.appointmentDate} ${bookingToSync.timeSlot}) was automatically added to your primary Google Calendar.`,
        bookingRef: bookingToSync.reference,
        actionLabel: 'Open Calendar',
      });
    } catch (err: any) {
      const msg = err?.message || 'Failed to sync appointment to Google Calendar.';
      if (msg === 'GOOGLE_CALENDAR_AUTH_EXPIRED') {
        setCalendarNeedsAuth(true);
        setCalendarSyncError('Your Google Calendar session expired. Please sign in again to push this booking.');
      } else {
        setCalendarSyncError(msg);
      }
      setLastCalendarSyncAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCalendarSyncStatus('error');
    }
  };

  const handleConnectGoogleCalendar = async (alsoPushBooking?: BookingRecord | null) => {
    setIsConnectingGoogle(true);
    setCalendarSyncError(null);
    try {
      const { user, accessToken } = await googleSignInForCalendar();
      setGoogleUser(user);
      setCalendarNeedsAuth(false);
      setAutoSyncGoogleCalendar(true);
      if (alsoPushBooking) {
        await syncBookingToGoogleCalendar(alsoPushBooking, accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setCalendarSyncError(
        err?.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in popup was closed before completion.'
          : err?.message || 'Could not sign in with Google.'
      );
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    await googleCalendarSignOut();
    setGoogleUser(null);
    setCalendarNeedsAuth(true);
    setAutoSyncGoogleCalendar(false);
  };

  // Unified PaymentProcessor: Country-Mapped Regional Gateways
  const countryPaymentSummary = React.useMemo(() => {
    return PaymentProcessor.getCountryPaymentSummary(country);
  }, [country]);

  // Payment Gateway selection & checkout states (20 regional & global gateways)
  const [selectedGatewayId, setSelectedGatewayId] = useState<PaymentGatewayId>(() => {
    return PaymentProcessor.getPrimaryGateway('Nigeria').id;
  });
  const [gatewayViewFilter, setGatewayViewFilter] = useState<'recommended' | 'all'>('recommended');
  const [gatewayRegionFilter, setGatewayRegionFilter] = useState<string>('All');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [completedPaymentResult, setCompletedPaymentResult] = useState<PaymentCheckoutResult | null>(null);

  // Auto-synchronize primary gateway whenever customer changes country
  React.useEffect(() => {
    if (country) {
      const topGw = PaymentProcessor.getPrimaryGateway(country);
      if (topGw) {
        setSelectedGatewayId(topGw.id);
      }
    }
  }, [country]);

  const selectedGateway = getGatewayById(selectedGatewayId);

  const handleQuickPayWalletCheckout = () => {
    setStepError(null);
    setWalletDeductionError(null);

    if (!fullName.trim() || !businessName.trim() || !email.trim() || !phone.trim()) {
      setStepError('Please fill in your full name, business name, email address, and phone number.');
      return;
    }

    const latestWallet = getWalletState();
    setWalletBalanceNGN(latestWallet.balanceNGN);

    if (latestWallet.balanceNGN < calculatedTotalNGN) {
      setQuickPayWalletEnabled(false);
      setWalletDeductionError(
        `Insufficient MsmeBooks Wallet balance (${formatAmount(latestWallet.balanceNGN)}) for ${formattedCalculatedTotal}. Please use manual payment below.`
      );
      return;
    }

    const newBookingId = `bkg-${Date.now()}`;
    const walletResult = payWithWallet(
      newBookingId,
      calculatedTotalNGN,
      currentService.title,
      generatedRef
    );

    if (!walletResult.success || !walletResult.transaction) {
      setWalletDeductionError(walletResult.error || 'Wallet auto-deduction could not be completed.');
      return;
    }

    if (walletResult.state) {
      setWalletBalanceNGN(walletResult.state.balanceNGN);
    }

    setCompletedPaymentResult({
      status: 'succeeded',
      transactionRef: walletResult.transaction.reference,
      amountFormatted: formattedCalculatedTotal,
      gatewayId: selectedGatewayId,
      gatewayName: 'MsmeBooks Wallet (Quick Pay)',
      channel: 'Auto Wallet Balance Deduction',
      paidAt: walletResult.transaction.timestamp,
      customerName: fullName,
      customerEmail: email,
    });

    handleFinalSubmit(
      'Paid',
      'MsmeBooks Wallet (Quick Pay)',
      walletResult.transaction.reference,
      newBookingId
    );
  };

  const handleNext = () => {
    setStepError(null);
    setWalletDeductionError(null);
    if (currentStep === 4) {
      if (!fullName.trim() || !businessName.trim() || !email.trim() || !phone.trim()) {
        setStepError('Please fill in your full name, business name, email address, and phone number.');
        return;
      }
      // If Quick Pay toggle is ON and user has sufficient wallet funds,
      // automatically deduct from wallet and skip the manual payment step (Step 5)!
      if (quickPayWalletEnabled && hasSufficientWalletFunds) {
        handleQuickPayWalletCheckout();
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = (
    paymentMode: 'Paid' | 'Quote Requested' | 'Pending Payment' = 'Paid',
    gatewayName?: string,
    transactionRef?: string,
    overrideBookingId?: string
  ) => {
    const finalBillingUnits = billingType === 'hourly' ? hoursNeeded : (
      fixedFrequency === 'days' ? daysNeeded :
      fixedFrequency === 'monthly' ? billingMonths :
      fixedFrequency === 'quarterly' ? billingQuarters :
      fixedFrequency === 'bi-yearly' ? billingBiYears : billingYears
    );

    const finalBillingUnitType = billingType === 'hourly' ? 'hours' : (
      fixedFrequency === 'days' ? 'days' :
      fixedFrequency === 'monthly' ? 'months' :
      fixedFrequency === 'quarterly' ? 'quarters' :
      fixedFrequency === 'bi-yearly' ? 'terms' : 'years'
    );

    const newBooking: BookingRecord = {
      id: overrideBookingId || `bkg-${Date.now()}`,
      reference: generatedRef,
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      packageId: currentPackage.id,
      packageName: currentPackage.name,
      packagePrice: `${formattedCalculatedTotal} (${invoiceBreakdown.unitLabel} @ ${formattedRateDisplay})`,
      billingType,
      billingFrequency: billingType === 'hourly' ? 'hourly' : fixedFrequency,
      billingUnits: finalBillingUnits,
      billingUnitType: finalBillingUnitType,
      billingRateDisplay: formattedRateDisplay,
      billingBreakdown: {
        frequency: invoiceBreakdown.frequency,
        units: invoiceBreakdown.units,
        unitLabel: invoiceBreakdown.unitLabel,
        unitRateNGN: invoiceBreakdown.unitRateNGN,
        subtotalNGN: invoiceBreakdown.subtotalNGN,
        discountPercent: invoiceBreakdown.discountPercent,
        discountNGN: invoiceBreakdown.discountNGN,
        pointsDiscountNGN: invoiceBreakdown.pointsDiscountNGN,
        promoCodeApplied: invoiceBreakdown.promoCodeApplied,
        vatNGN: invoiceBreakdown.vatNGN,
        totalNGN: invoiceBreakdown.totalNGN,
      },
      lifecycleStage: 'Booked',
      providerId: selectedProviderType === 'auto' ? 'firm-msme-direct' : currentFirm.id,
      providerName: selectedProviderType === 'auto' ? 'MsmeBooks Smart Auto-Matched Partner' : currentFirm.name,
      providerType: selectedProviderType === 'auto' ? 'Verified Match' : currentFirm.category,
      consultationMode,
      appointmentDate,
      timeSlot,
      customerName: fullName,
      businessName,
      customerEmail: email,
      customerPhone: phone,
      country,
      city,
      industry,
      businessSize,
      requirements: requirements || 'Standard onboarding and consultation requested.',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      paymentStatus: paymentMode,
      paymentGateway: gatewayName || (paymentMode === 'Paid' ? selectedGateway.name : undefined),
      paymentTransactionRef: transactionRef,
    };

    setConfirmedBookingRecord(newBooking);
    onBookingConfirmed(newBooking);
    setBookingCompleted(true);

    // Consume applied points discount voucher and clear storage
    if (appliedPointsDiscount) {
      try {
        const raw = localStorage.getItem('msmebooks_msmepoints');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.activeVouchers = (parsed.activeVouchers || []).map((v: any) =>
            v.code === appliedPointsDiscount.code ? { ...v, used: true } : v
          );
          localStorage.setItem('msmebooks_msmepoints', JSON.stringify(parsed));
        }
        localStorage.removeItem('msmebooks_applied_service_discount');
        window.dispatchEvent(new CustomEvent('msmebooks_applied_discount_changed', { detail: null }));
        setAppliedPointsDiscount(null);
      } catch (err) {
        console.error(err);
      }
    }

    // Trigger mock Booking Confirmation Email utility
    try {
      const emailRecord = sendBookingConfirmationEmail(newBooking, {
        formattedTotal: formattedCalculatedTotal,
        clientEmail: email,
        clientName: fullName,
      });
      setSentEmailRecord(emailRecord);
    } catch (e) {
      console.error('Failed to dispatch booking confirmation email:', e);
    }

    // Dispatch real-time booking notification
    addAppNotification({
      type: 'booking',
      title: 'Appointment Scheduled & Confirmed',
      message: `Your appointment for ${currentService.title} (${currentPackage.name}) with ${newBooking.providerName} is set for ${appointmentDate} (${timeSlot}). Ref: ${generatedRef}.`,
      bookingRef: generatedRef,
      actionLabel: 'View My Bookings',
    });

    if (paymentMode === 'Paid') {
      addAppNotification({
        type: 'payment',
        title: 'Payment Confirmed (Escrow Secured)',
        message: `Payment of ${formattedCalculatedTotal} verified via ${gatewayName || selectedGateway.name}. Reference: ${transactionRef || generatedRef}.`,
        bookingRef: generatedRef,
        actionLabel: 'View Invoice',
      });
    }

    // Auto-sync to user's primary Google Calendar when enabled & authenticated
    if (autoSyncGoogleCalendar && getCalendarAccessToken()) {
      void syncBookingToGoogleCalendar(newBooking);
    }
  };

  const handlePaymentCheckoutSuccess = (result: PaymentCheckoutResult) => {
    setCompletedPaymentResult(result);
    setIsCheckoutModalOpen(false);
    handleFinalSubmit('Paid', result.gatewayName, result.transactionRef);
  };

  const filteredGateways = React.useMemo(() => {
    if (gatewayViewFilter === 'recommended') {
      return countryPaymentSummary.recommendedGateways;
    }
    if (gatewayRegionFilter === 'All') return PAYMENT_GATEWAYS;
    return PAYMENT_GATEWAYS.filter(g => g.region === gatewayRegionFilter);
  }, [gatewayViewFilter, gatewayRegionFilter, countryPaymentSummary]);

  const prevOpenRef = React.useRef<boolean>(false);

  // Synchronize initial selection & live wallet balance when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setWalletBalanceNGN(getWalletState().balanceNGN);
      if (!prevOpenRef.current) {
        if (bookingCompleted) {
          setBookingCompleted(false);
          setCurrentStep(1);
          setCompletedPaymentResult(null);
          setConfirmedBookingRecord(null);
          setSentEmailRecord(null);
          setCalendarSyncStatus('idle');
          setSyncedCalendarEvent(null);
          setCalendarSyncError(null);
          setConfirmCalendarPushPending(false);
          setLastCalendarSyncAt(null);
          setGeneratedRef(`MSME-BK-${Math.floor(1000 + Math.random() * 9000)}`);
        }
        setStepError(null);
        setWalletDeductionError(null);
      }
      if (initialService) {
        setSelectedServiceId(initialService.id);
        if (initialPackage) {
          setSelectedPackageId(initialPackage.id);
        } else if (initialService.packages && initialService.packages.length > 0) {
          setSelectedPackageId(initialService.packages[1]?.id || initialService.packages[0].id);
        }
      }
      if (initialFirm) {
        setSelectedFirmId(initialFirm.id);
        setSelectedProviderType('firm');
      }
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, initialService, initialPackage, initialFirm, bookingCompleted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header with Step Indicator */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                Service Booking System
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                Ref: {generatedRef}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {bookingCompleted 
                ? 'Booking Confirmation Summary' 
                : `Step ${currentStep} of 5: ${
                    currentStep === 1 ? 'Select Service & Package' :
                    currentStep === 2 ? 'Select Professional Firm' :
                    currentStep === 3 ? 'Consultation Schedule' :
                    currentStep === 4 ? 'Business Information' :
                    'Review & Confirmation'
                  }`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!bookingCompleted && (
              <button
                type="button"
                onClick={() => setIsQuickPayOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                title="Quick Pay shortcut: simulate instant payment via Flutterwave, Stripe, or Paystack"
              >
                <Zap className="w-3.5 h-3.5 fill-[#B7E532] text-[#B7E532]" />
                <span className="hidden sm:inline">⚡ Quick Pay</span>
                <span className="sm:hidden">Pay</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        {!bookingCompleted && (
          <div className="bg-slate-100 dark:bg-slate-800 h-1.5 w-full">
            <div 
              className="bg-[#1464C8] dark:bg-[#B7E532] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        )}

        {/* MsmeBooks Wallet Quick Pay Auto-Deduct Toggle Bar */}
        {!bookingCompleted && (
          <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
            quickPayWalletEnabled && hasSufficientWalletFunds
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70'
              : 'bg-slate-50 dark:bg-[#0B1726] border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                quickPayWalletEnabled && hasSufficientWalletFunds
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : hasSufficientWalletFunds
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-[#B7E532]'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              }`}>
                <Wallet className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-black text-[#102B4E] dark:text-white">
                    Quick Pay with MsmeBooks Wallet
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 text-[#102B4E] dark:text-[#B7E532]">
                    Balance: {formatAmount(walletBalanceNGN)}
                  </span>
                  {hasSufficientWalletFunds ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                      {quickPayWalletEnabled ? 'Auto-Deduct Active • Skips Manual Payment' : 'Sufficient Funds'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                      Short by {formatAmount(walletShortfallNGN)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {hasSufficientWalletFunds
                    ? quickPayWalletEnabled
                      ? `Will deduct ${formattedCalculatedTotal} automatically on confirmation (remaining: ${formatAmount(walletBalanceNGN - calculatedTotalNGN)}).`
                      : `Enable to auto-deduct ${formattedCalculatedTotal} and skip the manual payment step.`
                    : `Wallet balance is below the ${formattedCalculatedTotal} fee — manual checkout will be used.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className={`text-[11px] font-black uppercase tracking-wider ${
                quickPayWalletEnabled && hasSufficientWalletFunds
                  ? 'text-emerald-700 dark:text-[#B7E532]'
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                {quickPayWalletEnabled && hasSufficientWalletFunds ? 'Quick Pay ON' : 'Quick Pay OFF'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={quickPayWalletEnabled && hasSufficientWalletFunds}
                aria-label="Toggle Quick Pay auto-deduct from MsmeBooks Wallet"
                disabled={!hasSufficientWalletFunds}
                onClick={() => {
                  if (!hasSufficientWalletFunds) return;
                  setWalletDeductionError(null);
                  setQuickPayWalletEnabled(prev => !prev);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:ring-offset-1 ${
                  !hasSufficientWalletFunds
                    ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed opacity-60'
                    : quickPayWalletEnabled
                    ? 'bg-emerald-600 dark:bg-[#B7E532] cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
                title={
                  hasSufficientWalletFunds
                    ? 'Automatically deduct fee from MsmeBooks Wallet and skip manual payment'
                    : `Insufficient funds: need ${formatAmount(walletShortfallNGN)} more in MsmeBooks Wallet`
                }
              >
                <span
                  className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white dark:bg-[#0A1727] shadow-xs transition-transform ${
                    quickPayWalletEnabled && hasSufficientWalletFunds ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {quickPayWalletEnabled && hasSufficientWalletFunds && (
                    <Zap className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-500 fill-current" />
                  )}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Auto-Sync to Google Calendar Bar */}
        {!bookingCompleted && (
          <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
            autoSyncGoogleCalendar && !calendarNeedsAuth
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/70'
              : 'bg-white dark:bg-[#091422] border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                autoSyncGoogleCalendar && !calendarNeedsAuth
                  ? 'bg-[#1464C8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-[#1464C8] dark:text-[#B7E532]'
              }`}>
                <CalendarCheck className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-black text-[#102B4E] dark:text-white">
                    Auto-Sync to Google Calendar
                  </span>
                  {googleUser && !calendarNeedsAuth ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#1464C8] dark:text-blue-300 flex items-center gap-1">
                      <span>{googleUser.email || googleUser.displayName || 'Google Connected'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Google Account Not Connected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {googleUser && !calendarNeedsAuth
                    ? autoSyncGoogleCalendar
                      ? 'Automatically pushes confirmed booking directly to your primary Google Calendar.'
                      : 'Google Calendar connected — toggle ON to push bookings automatically on confirmation.'
                    : 'Connect Google to push confirmed appointments directly to your primary calendar (no manual .ics needed).'}
                </p>
                {calendarSyncError && (
                  <p className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-0.5">
                    {calendarSyncError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {calendarNeedsAuth || !googleUser ? (
                <button
                  type="button"
                  onClick={() => handleConnectGoogleCalendar()}
                  disabled={isConnectingGoogle}
                  className="gsi-material-button inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#1f1f1f] border border-[#747775]/40 shadow-2xs text-xs font-semibold transition-all cursor-pointer disabled:opacity-60"
                  title="Sign in with Google to enable Auto-Sync to your primary Google Calendar"
                >
                  {isConnectingGoogle ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  )}
                  <span>{isConnectingGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleDisconnectGoogleCalendar}
                    className="text-[11px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                    title="Disconnect Google Calendar"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>

                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    autoSyncGoogleCalendar
                      ? 'text-[#1464C8] dark:text-[#B7E532]'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {autoSyncGoogleCalendar ? 'Auto-Sync ON' : 'Auto-Sync OFF'}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoSyncGoogleCalendar}
                    aria-label="Toggle Auto-Sync to Google Calendar"
                    onClick={() => setAutoSyncGoogleCalendar((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:ring-offset-1 cursor-pointer ${
                      autoSyncGoogleCalendar
                        ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                        : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white dark:bg-[#0A1727] shadow-xs transition-transform ${
                        autoSyncGoogleCalendar ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 bg-white dark:bg-[#08121E]">
          
          {/* SUCCESS SCREEN */}
          {bookingCompleted ? (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                  Appointment Successfully Scheduled
                </span>
                <h3 className="text-2xl font-black text-[#102B4E] dark:text-white mt-2">
                  Thank You, {fullName || 'Valued Client'}!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1">
                  Your service appointment has been registered under reference:
                </p>
                <div className="inline-block mt-2 px-4 py-2 bg-slate-100 dark:bg-[#0D1D31] border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-black text-[#1464C8] dark:text-[#B7E532] tracking-wider">
                  {generatedRef}
                </div>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Service:</span>
                  <span className="font-bold text-[#102B4E] dark:text-white">{currentService.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Package Tier:</span>
                  <span className="font-bold text-[#102B4E] dark:text-white">{currentPackage.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Billing Model:</span>
                  <span className="font-black text-[#1464C8] dark:text-[#B7E532]">
                    {billingType === 'hourly' ? `Per Hour (${hoursNeeded} Hours)` : `Fixed Price (${daysNeeded} Days)`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Investment:</span>
                  <span className="font-black text-emerald-700 dark:text-[#B7E532] text-sm">{formattedCalculatedTotal}</span>
                </div>
                {completedPaymentResult ? (
                  <div className="py-1.5 border-b border-slate-200 dark:border-slate-700/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 rounded-lg space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified via {completedPaymentResult.gatewayName}:</span>
                      </span>
                      <span className="font-mono font-bold text-xs text-[#1464C8] dark:text-[#B7E532]">
                        {completedPaymentResult.transactionRef}
                      </span>
                    </div>
                    {completedPaymentResult.gatewayName.includes('Wallet') && (
                      <div className="flex justify-between items-center text-[10px] text-emerald-700/90 dark:text-emerald-300/90 font-semibold pt-0.5 border-t border-emerald-200/70 dark:border-emerald-800/50">
                        <span>Remaining MsmeBooks Wallet Balance:</span>
                        <span className="font-black">{formatAmount(walletBalanceNGN)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">Selected Gateway:</span>
                    <span className="font-bold text-[#102B4E] dark:text-white">{selectedGateway.name}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Provider:</span>
                  <span className="font-bold text-[#102B4E] dark:text-white">
                    {selectedProviderType === 'auto' ? 'MsmeBooks In-House / Auto Match' : currentFirm.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Schedule:</span>
                  <span className="font-bold text-[#102B4E] dark:text-white">{appointmentDate} at {timeSlot}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Mode:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{consultationMode}</span>
                </div>
              </div>

              {/* Email Confirmation Notice Pill */}
              <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 max-w-md mx-auto flex items-center justify-between text-xs text-left">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                  <div>
                    <span className="font-bold text-[#102B4E] dark:text-white">Transaction Record Dispatched</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Sent to <strong>{email || 'your registered email'}</strong>
                    </p>
                  </div>
                </div>

                {onViewConfirmationEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewConfirmationEmail(sentEmailRecord?.id);
                    }}
                    className="px-2.5 py-1 bg-white dark:bg-[#0A1727] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1464C8] dark:text-[#B7E532] border border-blue-200 dark:border-blue-900 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    View Email Preview →
                  </button>
                )}
              </div>

              {/* Google Calendar API Sync Status & Action Card */}
              <div className={`p-4 rounded-2xl border max-w-md mx-auto text-left text-xs space-y-3 transition-all ${
                calendarSyncStatus === 'synced'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 shadow-xs'
                  : calendarSyncStatus === 'error'
                  ? 'bg-red-50/80 dark:bg-red-950/30 border-red-300 dark:border-red-800/80 shadow-xs'
                  : 'bg-slate-50 dark:bg-[#0D1D31] border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-black text-[#102B4E] dark:text-white">
                    {calendarSyncStatus === 'synced' ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : calendarSyncStatus === 'syncing' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                    ) : calendarSyncStatus === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <CalendarCheck className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                    )}
                    <span>Google Calendar Sync</span>
                  </div>

                  {/* Explicit Sync Status Indicator Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      calendarSyncStatus === 'synced'
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                        : calendarSyncStatus === 'syncing'
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-[#1464C8] dark:text-blue-200 border-blue-200 dark:border-blue-800'
                        : calendarSyncStatus === 'error'
                        ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 border-red-300 dark:border-red-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        calendarSyncStatus === 'synced'
                          ? 'bg-emerald-500'
                          : calendarSyncStatus === 'syncing'
                          ? 'bg-[#1464C8] animate-ping'
                          : calendarSyncStatus === 'error'
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>
                      Sync Status:{' '}
                      {calendarSyncStatus === 'synced'
                        ? 'Synced ✓'
                        : calendarSyncStatus === 'syncing'
                        ? 'Pushing Event...'
                        : calendarSyncStatus === 'error'
                        ? 'Sync Failed'
                        : 'Not Synced'}
                    </span>
                  </span>
                </div>

                {calendarSyncStatus === 'syncing' && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Pushing <strong>{currentService.title}</strong> ({appointmentDate}, {timeSlot}) to your primary Google Calendar...
                  </p>
                )}

                {calendarSyncStatus === 'synced' && syncedCalendarEvent && (
                  <div className="space-y-2.5">
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
                      Confirmed event <strong>{syncedCalendarEvent.summary}</strong> was pushed to your primary Google Calendar{lastCalendarSyncAt ? ` at ${lastCalendarSyncAt}` : ''} with 24h & 1h reminders.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Sync Button showing visual checkmark state */}
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-black text-[11px]"
                        title="Booking successfully pushed to your primary Google Calendar"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                        <span>Synced to Google Calendar</span>
                      </button>

                      <a
                        href={syncedCalendarEvent.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                      >
                        <span>Open Event</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {calendarSyncStatus === 'error' && (
                  <div className="space-y-2.5">
                    <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">
                      {calendarSyncError || 'Could not push appointment to Google Calendar.'}
                      {lastCalendarSyncAt ? ` (Attempted at ${lastCalendarSyncAt})` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {calendarNeedsAuth || !googleUser ? (
                        <button
                          type="button"
                          onClick={() => confirmedBookingRecord && handleConnectGoogleCalendar(confirmedBookingRecord)}
                          disabled={isConnectingGoogle}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#1f1f1f] border border-[#747775]/40 text-[11px] font-semibold cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-red-600" />
                          <span>Sign in with Google & Re-sync</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => confirmedBookingRecord && syncBookingToGoogleCalendar(confirmedBookingRecord)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-[11px] cursor-pointer shadow-xs transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Manual Re-sync to Google Calendar</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {calendarSyncStatus === 'idle' && (
                  <div className="space-y-2.5">
                    {calendarNeedsAuth || !googleUser ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Push this appointment directly to your primary Google Calendar without downloading an .ics file.
                        </p>
                        <button
                          type="button"
                          onClick={() => confirmedBookingRecord && handleConnectGoogleCalendar(confirmedBookingRecord)}
                          disabled={isConnectingGoogle}
                          className="gsi-material-button inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#1f1f1f] border border-[#747775]/40 shadow-2xs text-xs font-semibold cursor-pointer disabled:opacity-60"
                        >
                          {isConnectingGoogle ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4285F4]" />
                          ) : (
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                              <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                          )}
                          <span>{isConnectingGoogle ? 'Connecting...' : 'Sign in with Google & Sync'}</span>
                        </button>
                      </div>
                    ) : confirmCalendarPushPending ? (
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                        <p className="text-[11px] font-bold text-[#102B4E] dark:text-slate-100">
                          Confirm adding &ldquo;MsmeBooks: {currentService.title}&rdquo; on {appointmentDate} ({timeSlot}) to {googleUser.email || 'your primary Google Calendar'}?
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => confirmedBookingRecord && syncBookingToGoogleCalendar(confirmedBookingRecord)}
                            className="px-3 py-1.5 rounded-lg bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-[11px] cursor-pointer"
                          >
                            Confirm & Push Event
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCalendarPushPending(false)}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Connected as <strong>{googleUser.email || googleUser.displayName}</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={() => setConfirmCalendarPushPending(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Push to Google Calendar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={buildWhatsAppBookingUrl({
                    serviceName: currentService.title,
                    packageName: currentPackage.name,
                    billingOption: billingType === 'hourly'
                      ? `Per Hour (${hoursNeeded} hours @ ${formattedRateDisplay})`
                      : `Fixed Price (${daysNeeded} days @ ${formattedRateDisplay})`,
                    estimatedFee: formattedCalculatedTotal,
                    providerName: selectedProviderType === 'auto' ? 'MsmeBooks Expert Desk' : currentFirm.name,
                    consultationType: consultationMode,
                    preferredDate: `${appointmentDate} (${timeSlot})`,
                    bookingRef: generatedRef,
                    customerName: fullName,
                    businessName,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                  <span>Connect with Concierge on WhatsApp</span>
                </a>

                {onViewConfirmationEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewConfirmationEmail(sentEmailRecord?.id);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#102B4E] dark:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                    <span>View Confirmation Email</span>
                  </button>
                )}

                {/* Google Calendar Sync Button with live Sync Status indicator */}
                {calendarSyncStatus === 'synced' && syncedCalendarEvent ? (
                  <a
                    href={syncedCalendarEvent.htmlLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    title="Synced to primary Google Calendar — Click to view event"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>Google Calendar</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                      Synced
                    </span>
                  </a>
                ) : calendarSyncStatus === 'syncing' ? (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto px-4 py-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#1464C8] dark:text-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 opacity-80"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing Calendar...</span>
                  </button>
                ) : calendarSyncStatus === 'error' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmedBookingRecord) return;
                      if (calendarNeedsAuth || !googleUser) {
                        handleConnectGoogleCalendar(confirmedBookingRecord);
                      } else {
                        syncBookingToGoogleCalendar(confirmedBookingRecord);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-200 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    title="Initial Google Calendar sync failed — Click to manually re-sync"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-sync Google Calendar</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-200/80 dark:bg-red-900/80 text-red-800 dark:text-red-200">
                      Failed
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmedBookingRecord) return;
                      if (calendarNeedsAuth || !googleUser) {
                        handleConnectGoogleCalendar(confirmedBookingRecord);
                      } else {
                        setConfirmCalendarPushPending(true);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#1464C8] dark:text-blue-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    title="Push confirmed booking directly to your primary Google Calendar"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Sync Google Calendar</span>
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                  </button>
                )}

                {/* Calendar Sync (.ics download & Google/Outlook event deep-link) */}
                <CalendarSyncButton
                  booking={confirmedBookingRecord || {
                    id: `bkg-${Date.now()}`,
                    reference: generatedRef,
                    serviceId: currentService.id,
                    serviceTitle: currentService.title,
                    packageName: currentPackage.name,
                    packagePrice: formattedCalculatedTotal,
                    providerId: selectedProviderType === 'auto' ? 'firm-msme-direct' : currentFirm.id,
                    providerName: selectedProviderType === 'auto' ? 'MsmeBooks Expert Desk' : currentFirm.name,
                    providerType: selectedProviderType === 'auto' ? 'Certified In-House Lead' : currentFirm.partnerTier,
                    consultationMode,
                    appointmentDate,
                    timeSlot,
                    customerName: fullName || 'Client',
                    businessName: businessName || 'SME Business',
                    customerEmail: email,
                    customerPhone: phone,
                    country,
                    city,
                    industry,
                    businessSize,
                    requirements,
                    status: 'Confirmed',
                    createdAt: new Date().toISOString(),
                    paymentStatus: 'Paid',
                  }}
                />

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-slate-800 dark:hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  View My Bookings Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SELECT SERVICE, PACKAGE & BILLING MODEL */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Loyalty Points Applied Discount Banner */}
                  {appliedPointsDiscount && (
                    <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-300 dark:border-emerald-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-800 dark:text-emerald-300">
                              Loyalty Points Discount Active: {appliedPointsDiscount.discountDisplay} Off
                            </span>
                            <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.2 rounded font-bold">
                              {appliedPointsDiscount.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Auto-applied from your MsmePoints rewards. Deducted directly from your booking invoice.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPointsDiscount(null);
                          localStorage.removeItem('msmebooks_applied_service_discount');
                          window.dispatchEvent(new CustomEvent('msmebooks_applied_discount_changed', { detail: null }));
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                        title="Remove discount"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Service Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      1. Select Desired Professional Service
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => {
                        setSelectedServiceId(e.target.value);
                        const s = SERVICES_CATALOGUE.find(x => x.id === e.target.value);
                        if (s && s.packages[0]) {
                          setSelectedPackageId(s.packages[0].id);
                        }
                      }}
                      className="w-full p-3.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#102B4E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                    >
                      {SERVICES_CATALOGUE.map((srv) => (
                        <option key={srv.id} value={srv.id} className="dark:bg-[#0A1727]">
                          [{srv.category}] {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Package Scope */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      2. Choose a Service Scope Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentService.packages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        const pkgRates = getServiceBillingRates(pkg.name);
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/50 dark:bg-blue-950/40 shadow-sm' 
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">{pkg.name}</span>
                              <span className="text-[10px] font-black text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                                Flexible Billing
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{pkg.subtitle}</p>
                            
                            {/* Rates breakdown indicator */}
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                              <span>Hourly: <strong className="text-slate-800 dark:text-slate-200">{formatAmount(pkgRates.hourlyRateNGN)}/hr</strong></span>
                              <span>Fixed: <strong className="text-slate-800 dark:text-slate-200">{formatAmount(pkgRates.fixedDayRateNGN)}/day</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Choose Preferred Billing Structure: Hourly vs Fixed Day Rate */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      3. Select Preferred Billing Option & Timeline
                    </label>

                    {/* Mode Selector Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Option 1: Per Hour Billing */}
                      <div
                        onClick={() => setBillingType('hourly')}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          billingType === 'hourly'
                            ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/60 dark:bg-blue-950/50 shadow-md ring-2 ring-[#1464C8]/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                billingType === 'hourly' ? 'bg-[#1464C8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="font-black text-sm text-[#102B4E] dark:text-white">Per Hour Billing</span>
                            </div>
                            {billingType === 'hourly' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-normal">
                            Pay strictly for the dedicated hours needed with your consultant or specialist.
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard Rate:</span>
                          <span className="text-xs font-black text-[#1464C8] dark:text-[#B7E532]">
                            {formatAmount(billingRates.hourlyRateNGN)} / hour
                          </span>
                        </div>
                      </div>

                      {/* Option 2: Fixed Price Billing */}
                      <div
                        onClick={() => setBillingType('fixed')}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          billingType === 'fixed'
                            ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/60 dark:bg-blue-950/50 shadow-md ring-2 ring-[#1464C8]/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                billingType === 'fixed' ? 'bg-[#1464C8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                <Calendar className="w-4 h-4" />
                              </div>
                              <span className="font-black text-sm text-[#102B4E] dark:text-white">Fixed Price Billing</span>
                            </div>
                            {billingType === 'fixed' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-normal">
                            Fixed guaranteed amount based on total project days required for complete turnkey delivery.
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Fixed Day Rate:</span>
                          <span className="text-xs font-black text-[#1464C8] dark:text-[#B7E532]">
                            {formatAmount(billingRates.fixedDayRateNGN)} / day
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unit Controls (Hours or Days) */}
                    <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      {billingType === 'hourly' ? (
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <span className="text-xs font-bold text-[#102B4E] dark:text-white block">
                                Select Hours Needed:
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                Estimated specialist hours dedicated to your business
                              </span>
                            </div>

                            {/* Stepper Counter */}
                            <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                              <button
                                type="button"
                                onClick={() => setHoursNeeded(prev => Math.max(1, prev - 1))}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#102B4E] dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <div className="px-3 text-center min-w-[70px]">
                                <span className="font-black text-sm text-[#102B4E] dark:text-white">{hoursNeeded}</span>
                                <span className="text-[10px] text-slate-500 block">Hours</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setHoursNeeded(prev => Math.min(100, prev + 1))}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#102B4E] dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Hours Presets */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              { label: '2 Hours (Advisory Check)', value: 2 },
                              { label: '4 Hours (Half Day)', value: 4 },
                              { label: '8 Hours (Full Day)', value: 8 },
                              { label: '16 Hours (2 Days)', value: 16 },
                              { label: '40 Hours (1 Week)', value: 40 },
                            ].map((preset) => (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() => setHoursNeeded(preset.value)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  hoursNeeded === preset.value
                                    ? 'bg-[#1464C8] text-white shadow-xs'
                                    : 'bg-white dark:bg-[#0A1727] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1464C8]'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Frequency Switcher Tabs */}
                          <div>
                            <span className="text-xs font-bold text-[#102B4E] dark:text-white block mb-2">
                              Select Fixed Billing Frequency:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs font-bold">
                              {[
                                { id: 'days', label: 'Days', badge: null },
                                { id: 'monthly', label: 'Monthly', badge: '1 Mo' },
                                { id: 'quarterly', label: 'Quarterly', badge: '-5%' },
                                { id: 'bi-yearly', label: 'Bi-Yearly', badge: '-10%' },
                                { id: 'yearly', label: 'Yearly', badge: '-15%' },
                              ].map((freq) => (
                                <button
                                  key={freq.id}
                                  type="button"
                                  onClick={() => setFixedFrequency(freq.id as any)}
                                  className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer relative ${
                                    fixedFrequency === freq.id
                                      ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs font-black'
                                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  <div>{freq.label}</div>
                                  {freq.badge && (
                                    <span className={`text-[9px] px-1 py-0.2 rounded font-black mt-0.5 inline-block ${
                                      fixedFrequency === freq.id 
                                        ? 'bg-[#B7E532] text-[#102B4E]' 
                                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                    }`}>
                                      {freq.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Specific Controls per Frequency */}
                          {fixedFrequency === 'days' && (
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div>
                                  <span className="text-xs font-bold text-[#102B4E] dark:text-white block">
                                    Number of Project Days:
                                  </span>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Full turnkey delivery guaranteed within allocated days
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => setDaysNeeded(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#102B4E] dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="px-3 text-center min-w-[70px]">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{daysNeeded}</span>
                                    <span className="text-[10px] text-slate-500 block">Days</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setDaysNeeded(prev => Math.min(60, prev + 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#102B4E] dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 pt-1">
                                {[
                                  { label: '1 Day (Rapid Setup)', value: 1 },
                                  { label: '3 Days (Standard Sprint)', value: 3 },
                                  { label: '5 Days (1 Week Turnkey)', value: 5 },
                                  { label: '10 Days (2 Weeks)', value: 10 },
                                  { label: '20 Days (Full Month)', value: 20 },
                                ].map((preset) => (
                                  <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => setDaysNeeded(preset.value)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      daysNeeded === preset.value
                                        ? 'bg-[#1464C8] text-white shadow-xs'
                                        : 'bg-white dark:bg-[#0A1727] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1464C8]'
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {fixedFrequency === 'monthly' && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-xs font-bold text-[#102B4E] dark:text-white block">
                                    Monthly Subscription Cycle:
                                  </span>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Fixed monthly retainer based on 20 standard business days
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => setBillingMonths(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="px-3 text-center min-w-[70px]">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{billingMonths}</span>
                                    <span className="text-[10px] text-slate-500 block">Months</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBillingMonths(prev => Math.min(12, prev + 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {fixedFrequency === 'quarterly' && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#102B4E] dark:text-white">
                                      Quarterly Billing (3-Month Blocks):
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                                      5% Retainer Discount
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Includes quarterly reconciliation and statutory filing prep
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => setBillingQuarters(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="px-3 text-center min-w-[70px]">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{billingQuarters}</span>
                                    <span className="text-[10px] text-slate-500 block">Quarters</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBillingQuarters(prev => Math.min(4, prev + 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {fixedFrequency === 'bi-yearly' && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#102B4E] dark:text-white">
                                      Bi-Yearly Billing (6-Month Terms):
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                                      10% Half-Year Discount
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Guaranteed dedicated partner team across two quarters
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => setBillingBiYears(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="px-3 text-center min-w-[70px]">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{billingBiYears}</span>
                                    <span className="text-[10px] text-slate-500 block">Terms</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBillingBiYears(prev => Math.min(2, prev + 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {fixedFrequency === 'yearly' && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#102B4E] dark:text-white">
                                      Yearly Annual Retainer (12 Months):
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                                      15% Maximum Annual Savings
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Comprehensive annual compliance, auditing, books & tax returns
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-[#0A1727] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => setBillingYears(prev => Math.max(1, prev - 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="px-3 text-center min-w-[70px]">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{billingYears}</span>
                                    <span className="text-[10px] text-slate-500 block">Years</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBillingYears(prev => Math.min(3, prev + 1))}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#102B4E] dark:text-white flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Detailed Invoice & Billing Breakdown Preview */}
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0A1727] p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400">
                            Invoice Breakdown: {invoiceBreakdown.unitLabel}
                          </span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">
                            Rate: {invoiceBreakdown.rateLabel}
                          </span>
                        </div>

                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Gross Subtotal:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{formatAmount(invoiceBreakdown.subtotalNGN)}</span>
                        </div>

                        {invoiceBreakdown.discountPercent > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>Retainer Discount ({invoiceBreakdown.discountPercent}%):</span>
                            <span>- {formatAmount(invoiceBreakdown.discountNGN)}</span>
                          </div>
                        )}

                        {invoiceBreakdown.pointsDiscountNGN && invoiceBreakdown.pointsDiscountNGN > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-[#B7E532] font-black">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Points Redemption Discount ({invoiceBreakdown.promoCodeApplied}):</span>
                            </span>
                            <span>- {formatAmount(invoiceBreakdown.pointsDiscountNGN)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Statutory VAT (7.5%):</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{formatAmount(invoiceBreakdown.vatNGN)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/80">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Total Invoice Due:
                            </span>
                            <div className="text-2xl font-black text-emerald-700 dark:text-[#B7E532]">
                              {formattedCalculatedTotal}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>100% Escrow Protected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT PROVIDER */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between bg-blue-50/70 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                        <span className="text-slate-600 dark:text-slate-300">
                          Selected Plan: <strong className="text-[#102B4E] dark:text-white">{currentPackage.name}</strong> ({billingType === 'hourly' ? `${hoursNeeded} Hours @ Per Hour` : `${daysNeeded} Days @ Fixed Price`})
                        </span>
                      </div>
                      <span className="font-black text-emerald-700 dark:text-[#B7E532] text-sm">
                        {formattedCalculatedTotal}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Choose Your Preferred Service Provider
                    </h3>

                    {/* Auto Match vs Specific Firm Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div
                        onClick={() => setSelectedProviderType('auto')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedProviderType === 'auto'
                            ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-[#102B4E] dark:text-white">MsmeBooks Smart Match</span>
                          <span className="text-[10px] font-bold bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          Let MsmeBooks match you with the highest-rated verified partner based on your exact location, industry, and timeline.
                        </p>
                      </div>

                      <div
                        onClick={() => setSelectedProviderType('firm')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedProviderType === 'firm'
                            ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-[#102B4E] dark:text-white">Select a Specific Firm</span>
                          <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">
                            Browse
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          Choose an accredited ICAN / ACCA chartered accounting firm or certified tech deployment specialist from our directory.
                        </p>
                      </div>
                    </div>

                    {/* List of Verified Firms if selected */}
                    {selectedProviderType === 'firm' && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 block mb-1">
                          Available Qualified Firms:
                        </span>
                        {PROFESSIONAL_FIRMS.map((firm) => {
                          const isSelected = selectedFirmId === firm.id;
                          return (
                            <div
                              key={firm.id}
                              onClick={() => setSelectedFirmId(firm.id)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected 
                                  ? 'border-[#1464C8] dark:border-[#B7E532] bg-white dark:bg-[#11233b] shadow-md ring-2 ring-[#1464C8]/20' 
                                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#0D1D31]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg ${firm.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                                  {firm.logoText}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-black text-sm text-[#102B4E] dark:text-white">{firm.name}</span>
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532]" />
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    {firm.category} • {firm.city}, {firm.country}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-amber-500 flex items-center">
                                  <Star className="w-3 h-3 fill-current mr-0.5" /> {firm.rating}
                                </span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-[#1464C8] dark:border-[#B7E532] bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E]' : 'border-slate-300 dark:border-slate-700'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: CONSULTATION DETAILS & SCHEDULE */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                      >
                        <option value="Nigeria">Nigeria 🇳🇬</option>
                        <option value="Ghana">Ghana 🇬🇭</option>
                        <option value="Kenya">Kenya 🇰🇪</option>
                        <option value="South Africa">South Africa 🇿🇦</option>
                        <option value="Rwanda">Rwanda 🇷🇼</option>
                        <option value="UK / International">UK / International 🌍</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        City / State
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lagos, Abuja, Accra, Nairobi..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Consultation Mode
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Online Consultation',
                        'Telephone',
                        'Physical Office Visit',
                        'On-site Business Visit'
                      ].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setConsultationMode(mode as any)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            consultationMode === mode
                              ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50 dark:bg-blue-950/50 text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0D1D31]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Available Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CUSTOMER INFORMATION */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {stepError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{stepError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Babatunde Lawal"
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Business / Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. PrimeMart Supermarkets Ltd"
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. b.lawal@primemart.ng"
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      >
                        <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                        <option value="Restaurants & Hospitality">Restaurants & Hospitality</option>
                        <option value="Hotels & Lodges">Hotels & Lodges</option>
                        <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                        <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                        <option value="Schools & Education">Schools & Education</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other SME</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Business Size
                      </label>
                      <select
                        value={businessSize}
                        onChange={(e) => setBusinessSize(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                      >
                        <option value="1-5 Employees">1-5 Employees (Micro)</option>
                        <option value="6-20 Employees">6-20 Employees (Small)</option>
                        <option value="21-50 Employees">21-50 Employees (Growing)</option>
                        <option value="50+ Employees">50+ Employees (Medium / Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Service Requirements & Specific Notes
                    </label>
                    <textarea
                      rows={2}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Describe what you want to achieve or any specific software challenges..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Document upload simulation */}
                  <div className="p-3 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Attach Financial / Onboarding Documents (Optional)</span>
                        <p className="text-[10px] text-slate-400">PDF, Excel, or Word (Encrypted storage under NDPA)</p>
                      </div>
                    </div>
                    <div>
                      {uploadedFileName ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">{uploadedFileName}</span>
                      ) : (
                        <label className="px-3 py-1 bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-[#132842] cursor-pointer">
                          <span>Browse</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadedFileName(e.target.files[0].name);
                              }
                            }} 
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Wallet Deduction Error Banner */}
                  {walletDeductionError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{walletDeductionError}</span>
                    </div>
                  )}

                  {/* Quick Pay Pre-Confirmation Notice on Step 4 */}
                  {quickPayWalletEnabled && hasSufficientWalletFunds && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5 text-xs">
                      <Zap className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] fill-current shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-black text-emerald-900 dark:text-emerald-200">
                          Quick Pay Active — Manual Payment Step Will Be Skipped
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                          Clicking <strong>Quick Pay & Confirm Booking</strong> below will automatically deduct{' '}
                          <strong>{formattedCalculatedTotal}</strong> from your MsmeBooks Wallet (new balance:{' '}
                          <strong>{formatAmount(walletBalanceNGN - calculatedTotalNGN)}</strong>) and confirm your booking immediately.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Consent & Privacy Notice */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <input
                      type="checkbox"
                      id="consentCheck"
                      checked={agreeConsent}
                      onChange={(e) => setAgreeConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#1464C8]"
                    />
                    <label htmlFor="consentCheck" className="cursor-pointer">
                      I agree to the MsmeBooks service booking terms and privacy policy in compliance with the Nigeria Data Protection Act (NDPA). My uploaded information is kept confidential.
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: SUMMARY & CONFIRMATION */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/70 dark:border-blue-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider">
                        Engagement Overview
                      </span>
                      <span className="text-xs font-black text-[#102B4E] dark:text-white">
                        Ref: {generatedRef}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Service:</span>
                        <strong className="text-[#102B4E] dark:text-white">{currentService.title}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Package Scope:</span>
                        <strong className="text-[#102B4E] dark:text-white">{currentPackage.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Billing Option:</span>
                        <strong className="text-[#1464C8] dark:text-[#B7E532]">
                          {invoiceBreakdown.unitLabel} ({billingType === 'hourly' ? 'Hourly' : fixedFrequency.toUpperCase()})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Rate:</span>
                        <strong className="text-slate-700 dark:text-slate-200">{formattedRateDisplay}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Investment:</span>
                        <strong className="text-emerald-700 dark:text-[#B7E532] text-sm font-black">{formattedCalculatedTotal}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Provider:</span>
                        <strong className="text-[#102B4E] dark:text-white">
                          {selectedProviderType === 'auto' ? 'MsmeBooks Expert Desk' : currentFirm.name}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Consultation Schedule:</span>
                        <strong className="text-[#102B4E] dark:text-white">{appointmentDate} ({timeSlot})</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Mode:</span>
                        <strong className="text-[#102B4E] dark:text-white">{consultationMode}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="text-slate-500 dark:text-slate-400">
                      Client: <strong className="text-slate-800 dark:text-slate-200">{fullName}</strong> ({businessName})
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Contact: <strong className="text-slate-800 dark:text-slate-200">{phone}</strong> • {email}
                    </div>
                    {requirements && (
                      <div className="text-slate-500 dark:text-slate-400">
                        Notes: <em className="text-slate-700 dark:text-slate-300">{requirements}</em>
                      </div>
                    )}
                  </div>

                  {/* Wallet Deduction Error Banner */}
                  {walletDeductionError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{walletDeductionError}</span>
                    </div>
                  )}

                  {quickPayWalletEnabled && hasSufficientWalletFunds ? (
                    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-blue-50/50 dark:from-emerald-950/40 dark:via-[#0D1D31] dark:to-[#0A1727] p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700/80 space-y-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <Zap className="w-5 h-5 fill-[#B7E532] text-[#B7E532]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-[#B7E532] block">
                              Quick Pay Active — Manual Checkout Skipped
                            </span>
                            <h4 className="text-sm font-black text-[#102B4E] dark:text-white">
                              Auto-Deduct from MsmeBooks Wallet
                            </h4>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setQuickPayWalletEnabled(false)}
                          className="text-xs font-bold text-slate-500 hover:text-[#1464C8] dark:text-slate-400 dark:hover:text-[#B7E532] underline cursor-pointer"
                        >
                          Switch to Manual Payment
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 dark:bg-[#08121E]/80 p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50">
                        <div>
                          <span className="text-slate-400 block">Current Wallet Balance</span>
                          <strong className="text-[#102B4E] dark:text-white text-sm">{formatAmount(walletBalanceNGN)}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Auto-Deduction Amount</span>
                          <strong className="text-emerald-700 dark:text-[#B7E532] text-sm">-{formattedCalculatedTotal}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Remaining Balance</span>
                          <strong className="text-[#1464C8] dark:text-blue-300 text-sm">
                            {formatAmount(walletBalanceNGN - calculatedTotalNGN)}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleQuickPayWalletCheckout}
                        className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-[#B7E532] text-[#B7E532]" />
                        <span>Confirm Booking & Auto-Deduct {formattedCalculatedTotal}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Instant Mobile Scan-and-Pay Unique QR Code (Prompt 3) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                            <span>Instant Mobile Scan-and-Pay</span>
                          </span>
                          <span className="text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532]">
                            Gateway: {selectedGateway.name}
                          </span>
                        </div>

                        <PaymentQRCode
                          gateway={selectedGateway}
                          amountFormatted={formattedCalculatedTotal}
                          amountNGN={calculatedTotalNGN}
                          bookingRef={generatedRef}
                          serviceTitle={currentService.title}
                          customerName={fullName}
                          onPaymentSuccess={(res) => {
                            handlePaymentCheckoutSuccess({
                              status: 'succeeded',
                              transactionRef: res.transactionRef,
                              amountFormatted: formattedCalculatedTotal,
                              gatewayId: selectedGatewayId,
                              gatewayName: res.gatewayName,
                              channel: 'QR Code Mobile Scan',
                              paidAt: new Date().toISOString(),
                              customerName: fullName,
                              customerEmail: email,
                            });
                          }}
                        />
                      </div>

                      {/* INJECTED REGIONAL PAYMENT ROUTER COMPONENT */}
                      <PaymentGatewayRouter
                        firm={selectedProviderType === 'auto' ? null : currentFirm}
                        clientCountry={country}
                        clientCity={city}
                        amountFormatted={formattedCalculatedTotal}
                        amountNGN={calculatedTotalNGN}
                        selectedGatewayId={selectedGatewayId}
                        onSelectGateway={(id) => setSelectedGatewayId(id)}
                        onInitiatePayment={(gw) => {
                          setSelectedGatewayId(gw.id);
                          setIsCheckoutModalOpen(true);
                        }}
                        onWhatsAppCheckout={() => {
                          handleFinalSubmit('Pending Payment');
                          const url = buildWhatsAppBookingUrl({
                            serviceName: currentService.title,
                            packageName: currentPackage.name,
                            billingOption: billingType === 'hourly'
                              ? `Per Hour (${hoursNeeded} hours @ ${formattedRateDisplay})`
                              : `Fixed Price (${daysNeeded} days @ ${formattedRateDisplay})`,
                            estimatedFee: formattedCalculatedTotal,
                            providerName: selectedProviderType === 'auto' ? 'MsmeBooks Smart Match' : currentFirm.name,
                            consultationType: consultationMode,
                            preferredDate: `${appointmentDate} (${timeSlot})`,
                            bookingRef: generatedRef,
                            customerName: fullName,
                            businessName,
                            location: `${city}, ${country}`,
                          });
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        onRequestQuote={() => handleFinalSubmit('Quote Requested')}
                        clientInfo={{
                          fullName,
                          businessName,
                          email,
                          phone,
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Navigation Footer */}
        {!bookingCompleted && (
          <div className="sticky bottom-0 bg-slate-50 dark:bg-[#060F1A] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#132842] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
                  currentStep === 4 && quickPayWalletEnabled && hasSufficientWalletFunds
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black'
                    : 'text-white bg-[#1464C8] hover:bg-[#1052a5]'
                }`}
              >
                {currentStep === 4 && quickPayWalletEnabled && hasSufficientWalletFunds ? (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-[#B7E532] text-[#B7E532]" />
                    <span>Quick Pay & Confirm Booking ({formattedCalculatedTotal})</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : quickPayWalletEnabled && hasSufficientWalletFunds ? (
              <button
                type="button"
                onClick={handleQuickPayWalletCheckout}
                className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-[#B7E532] text-[#B7E532]" />
                <span>Auto-Deduct {formattedCalculatedTotal} & Confirm</span>
              </button>
            ) : null}
          </div>
        )}

      </div>

      {/* Interactive Payment Checkout Modal for Selected Gateway */}
      {isCheckoutModalOpen && (
        <PaymentCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          gateway={selectedGateway}
          amountFormatted={formattedCalculatedTotal}
          bookingRef={generatedRef}
          customerName={fullName}
          customerEmail={email}
          customerPhone={phone}
          serviceTitle={currentService.title}
          onPaymentSuccess={handlePaymentCheckoutSuccess}
        />
      )}

      {/* Quick Pay Modal (Flutterwave, Stripe, Paystack) */}
      {isQuickPayOpen && (
        <QuickPayModal
          isOpen={isQuickPayOpen}
          onClose={() => setIsQuickPayOpen(false)}
          amountFormatted={formattedCalculatedTotal}
          bookingRef={generatedRef}
          serviceTitle={currentService.title}
          customerName={fullName || 'SME Business Client'}
          customerEmail={email || 'client@business.africa'}
          onQuickPaySuccess={(gateway, txRef) => {
            setIsQuickPayOpen(false);
            handlePaymentCheckoutSuccess({
              status: 'succeeded',
              transactionRef: txRef,
              amountFormatted: formattedCalculatedTotal,
              gatewayId: gateway.toLowerCase() as PaymentGatewayId,
              gatewayName: gateway,
              channel: 'Quick Pay Shortcut',
              paidAt: new Date().toISOString(),
              customerName: fullName || 'SME Business Client',
              customerEmail: email || 'client@business.africa',
            });
          }}
        />
      )}
    </div>
  );
};
