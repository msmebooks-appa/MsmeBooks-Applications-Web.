import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Zap, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Search, 
  FileText, 
  Download,
  Building2,
  Lock,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { WalletState, WalletTransaction } from '../types/wallet';
import {
  DEFAULT_LINKED_PAYMENT_METHODS,
  DEFAULT_SMART_TOP_UP,
  getWalletState,
  payWithWallet,
  topUpWallet,
  updateSmartTopUpConfig,
} from '../utils/walletStorage';
import { BookingRecord } from '../types/booking';
import { useCurrency } from '../context/CurrencyContext';

interface WalletSectionProps {
  bookings: BookingRecord[];
  onBookingPaid?: (bookingId: string) => void;
  onOpenBookingInvoice?: (booking: BookingRecord) => void;
}

export const WalletSection: React.FC<WalletSectionProps> = ({
  bookings,
  onBookingPaid,
  onOpenBookingInvoice,
}) => {
  const { formatAmount } = useCurrency();
  const [walletState, setWalletState] = useState<WalletState>(() => getWalletState());
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(100000);
  const [customTopUpInput, setCustomTopUpInput] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('Paystack Instant Card Checkout');
  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Smart Top-Up local form state synced with walletState.smartTopUp
  const smartTopUp = walletState.smartTopUp || DEFAULT_SMART_TOP_UP;
  const linkedMethods = walletState.linkedMethods || DEFAULT_LINKED_PAYMENT_METHODS;
  const [thresholdInput, setThresholdInput] = useState<string>(String(smartTopUp.thresholdNGN));
  const [reloadAmountInput, setReloadAmountInput] = useState<string>(String(smartTopUp.reloadAmountNGN));
  const [selectedLinkedMethodId, setSelectedLinkedMethodId] = useState<string>(smartTopUp.linkedMethodId);

  // Sync wallet state and Smart Top-up rules with custom events
  useEffect(() => {
    const handleWalletChanged = () => {
      const latest = getWalletState();
      setWalletState(latest);
      if (latest.smartTopUp) {
        setThresholdInput(String(latest.smartTopUp.thresholdNGN));
        setReloadAmountInput(String(latest.smartTopUp.reloadAmountNGN));
        setSelectedLinkedMethodId(latest.smartTopUp.linkedMethodId);
      }
    };
    const handleSmartTopUpTriggered = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.amountNGN) {
        setActionSuccessToast(
          `Smart Top-Up auto-reloaded +${formatAmount(detail.amountNGN)} via ${detail.methodLabel} because your balance dropped below ${formatAmount(detail.thresholdNGN)}.`
        );
        setTimeout(() => setActionSuccessToast(null), 6500);
      }
    };
    window.addEventListener('msmebooks_wallet_changed', handleWalletChanged);
    window.addEventListener('msmebooks_smart_topup_triggered', handleSmartTopUpTriggered);
    return () => {
      window.removeEventListener('msmebooks_wallet_changed', handleWalletChanged);
      window.removeEventListener('msmebooks_smart_topup_triggered', handleSmartTopUpTriggered);
    };
  }, [formatAmount]);

  const handleToggleSmartTopUp = () => {
    const nextEnabled = !smartTopUp.enabled;
    const parsedThreshold = Math.max(10000, parseInt(thresholdInput.replace(/[^\d]/g, ''), 10) || smartTopUp.thresholdNGN);
    const parsedReload = Math.max(10000, parseInt(reloadAmountInput.replace(/[^\d]/g, ''), 10) || smartTopUp.reloadAmountNGN);

    const { state, autoReloadResult } = updateSmartTopUpConfig({
      enabled: nextEnabled,
      thresholdNGN: parsedThreshold,
      reloadAmountNGN: parsedReload,
      linkedMethodId: selectedLinkedMethodId,
    });
    setWalletState(state);

    if (nextEnabled) {
      if (autoReloadResult.triggered && autoReloadResult.transaction) {
        setActionSuccessToast(
          `Smart Top-Up enabled! Balance was below ${formatAmount(parsedThreshold)}, so +${formatAmount(parsedReload)} was automatically reloaded via ${autoReloadResult.methodLabel}.`
        );
      } else {
        setActionSuccessToast(
          `Smart Top-Up enabled: will auto-load +${formatAmount(parsedReload)} whenever balance drops below ${formatAmount(parsedThreshold)}.`
        );
      }
    } else {
      setActionSuccessToast('Smart Top-Up auto-reload paused.');
    }
    setTimeout(() => setActionSuccessToast(null), 5500);
  };

  const handleSaveSmartTopUpRules = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedThreshold = parseInt(thresholdInput.replace(/[^\d]/g, ''), 10);
    const parsedReload = parseInt(reloadAmountInput.replace(/[^\d]/g, ''), 10);

    if (isNaN(parsedThreshold) || parsedThreshold < 10000 || isNaN(parsedReload) || parsedReload < 10000) {
      setActionSuccessToast('Please enter a valid threshold and auto-reload amount of at least ₦10,000.');
      setTimeout(() => setActionSuccessToast(null), 4000);
      return;
    }

    const { state, autoReloadResult } = updateSmartTopUpConfig({
      thresholdNGN: parsedThreshold,
      reloadAmountNGN: parsedReload,
      linkedMethodId: selectedLinkedMethodId,
    });
    setWalletState(state);

    if (autoReloadResult.triggered && autoReloadResult.transaction) {
      setActionSuccessToast(
        `Smart Top-Up rules saved & auto-reloaded +${formatAmount(parsedReload)} via ${autoReloadResult.methodLabel}!`
      );
    } else {
      setActionSuccessToast(
        `Smart Top-Up rules updated: Auto-load +${formatAmount(parsedReload)} when balance < ${formatAmount(parsedThreshold)}.`
      );
    }
    setTimeout(() => setActionSuccessToast(null), 5500);
  };

  const totalCreditsLoaded = useMemo(() => {
    return walletState.transactions
      .filter(t => t.type === 'credit')
      .reduce((acc, t) => acc + t.amountNGN, 0);
  }, [walletState]);

  const totalPaymentsMade = useMemo(() => {
    return walletState.transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, t) => acc + t.amountNGN, 0);
  }, [walletState]);

  // Bookings that can be paid via 1-click wallet payment
  const pendingPaymentBookings = useMemo(() => {
    return bookings.filter(b => 
      b.status !== 'Completed' && 
      (b.paymentStatus === 'Pending Payment' || b.paymentStatus === 'Quote Requested' || b.status === 'Pending Review')
    );
  }, [bookings]);

  const parseBookingAmount = (booking: BookingRecord): number => {
    if (booking.billingBreakdown?.totalNGN) return booking.billingBreakdown.totalNGN;
    const match = booking.packagePrice.match(/₦\s*([\d,]+)/);
    if (match) return parseInt(match[1].replace(/,/g, ''), 10);
    return 75000;
  };

  const handleExecuteTopUp = () => {
    const amountToLoad = customTopUpInput ? parseInt(customTopUpInput.replace(/,/g, ''), 10) : topUpAmount;
    if (isNaN(amountToLoad) || amountToLoad <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const res = topUpWallet(amountToLoad, selectedChannel);
      setWalletState(res.state);
      setIsProcessing(false);
      setShowTopUpModal(false);
      setCustomTopUpInput('');
      setActionSuccessToast(`🎉 Successfully pre-loaded ${formatAmount(amountToLoad)} credits into your MsmeBooks Wallet!`);
      setTimeout(() => setActionSuccessToast(null), 5000);
    }, 600);
  };

  const handle1ClickPayBooking = (booking: BookingRecord) => {
    const amount = parseBookingAmount(booking);
    if (walletState.balanceNGN < amount) {
      setTopUpAmount(amount - walletState.balanceNGN > 50000 ? amount - walletState.balanceNGN : 50000);
      setShowTopUpModal(true);
      setActionSuccessToast(`Insufficient wallet credits. Pre-load at least ${formatAmount(amount - walletState.balanceNGN)} to complete this 1-click payment.`);
      setTimeout(() => setActionSuccessToast(null), 5000);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = payWithWallet(booking.id, amount, booking.serviceTitle, booking.reference);
      if (result.success && result.state) {
        setWalletState(result.state);

        // Update booking state in parent and localStorage
        if (onBookingPaid) {
          onBookingPaid(booking.id);
        } else {
          try {
            const raw = localStorage.getItem('msmebooks_client_bookings');
            if (raw) {
              const list: BookingRecord[] = JSON.parse(raw);
              const updated = list.map(b => {
                if (b.id === booking.id) {
                  return {
                    ...b,
                    paymentStatus: 'Paid' as const,
                    status: 'Confirmed' as const,
                    paymentGateway: 'MsmeBooks Wallet (1-Click Instant Payment)',
                    paymentTransactionRef: result.transaction?.reference,
                  };
                }
                return b;
              });
              localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
              window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
            }
          } catch (e) {
            console.error(e);
          }
        }

        if (result.smartTopUpTriggered && result.autoReloadTransaction) {
          setActionSuccessToast(
            `⚡ 1-Click Payment (${formatAmount(amount)}) complete & Smart Top-Up auto-reloaded +${formatAmount(result.autoReloadTransaction.amountNGN)}!`
          );
        } else {
          setActionSuccessToast(`⚡ 1-Click Payment Complete: ${formatAmount(amount)} paid from your wallet for "${booking.serviceTitle}" (${booking.reference})!`);
        }
        setTimeout(() => setActionSuccessToast(null), 5500);
      } else {
        setActionSuccessToast(result.error || 'Payment failed.');
        setTimeout(() => setActionSuccessToast(null), 5000);
      }
      setIsProcessing(false);
    }, 500);
  };

  const handleExportCSV = () => {
    if (!walletState.transactions || walletState.transactions.length === 0) {
      setActionSuccessToast('No wallet transactions available to export.');
      setTimeout(() => setActionSuccessToast(null), 3500);
      return;
    }

    // CSV Headers tailored for tax accounting & audit purposes
    const headers = [
      'Transaction Reference',
      'Date & Time (UTC)',
      'Transaction Type',
      'Category',
      'Description',
      'Payment Method / Channel',
      'Amount (NGN)',
      'Running Balance (NGN)',
      'Status',
      'Tax & Accounting Classification',
      'Linked Service Reference'
    ];

    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const value = String(str).replace(/"/g, '""');
      return `"${value}"`;
    };

    const rows = walletState.transactions.map(tx => {
      const isCredit = tx.type === 'credit';
      const taxClassification = isCredit
        ? 'Pre-funded Capital / Non-Taxable Deposit'
        : 'Allowable Business Expense / Deductible Professional Services (CIT / PIT)';

      return [
        escapeCsv(tx.reference),
        escapeCsv(new Date(tx.timestamp).toISOString()),
        escapeCsv(isCredit ? 'Credit (Top-Up)' : 'Debit (Payment)'),
        escapeCsv(tx.category || (isCredit ? 'Wallet Funding' : 'Professional Service')),
        escapeCsv(tx.description),
        escapeCsv(tx.paymentMethod || 'Direct Wallet Transfer'),
        escapeCsv(tx.amountNGN.toFixed(2)),
        escapeCsv(tx.balanceAfterNGN.toFixed(2)),
        escapeCsv(tx.status.toUpperCase()),
        escapeCsv(taxClassification),
        escapeCsv(tx.bookingReference || 'N/A')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `msmebooks_wallet_tax_transactions_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActionSuccessToast('📊 Tax transaction history exported as CSV successfully! File ready for your tax filing & audit records.');
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  const filteredTransactions = useMemo(() => {
    return walletState.transactions.filter(t => {
      const matchesType = 
        txFilter === 'all' ? true : 
        txFilter === 'credit' ? t.type === 'credit' : 
        t.type === 'debit';

      const matchesSearch = searchQuery.trim() === '' ? true : (
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return matchesType && matchesSearch;
    });
  }, [walletState.transactions, txFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {actionSuccessToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
            <span>{actionSuccessToast}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setActionSuccessToast(null)} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Wallet Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Corporate Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1A2F] via-[#102B4E] to-[#1464C8] text-white p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between min-h-[220px]">
          {/* Card Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#B7E532]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#1464C8]/30 blur-3xl pointer-events-none" />

          {/* Top Row: Card Brand & 1-Click Badge */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Wallet className="w-5 h-5 text-[#B7E532]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B7E532] block">
                  Pan-African Business Account
                </span>
                <h3 className="text-base font-black tracking-tight text-white">
                  MsmeBooks Digital Wallet
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {smartTopUp.enabled && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-[#B7E532]/50 text-[10px] font-black text-[#B7E532]">
                  <RefreshCw className="w-3 h-3" />
                  <span>Smart Top-up ON</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black text-[#B7E532]">
                <Zap className="w-3.5 h-3.5 fill-[#B7E532]" />
                <span>1-Click Payments Active</span>
              </div>
            </div>
          </div>

          {/* Center: Current Balance */}
          <div className="my-6 relative z-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300 block mb-1">
              Available Pre-loaded Balance
            </span>
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span>{formatAmount(walletState.balanceNGN)}</span>
              <span className="text-xs font-bold text-[#B7E532] px-2 py-0.5 rounded-md bg-white/10">
                Instant Settlement
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Zero transaction fees for certified accounting, tax audit, and corporate legal services.
            </p>
          </div>

          {/* Bottom Row: Pre-load Action & Wallet Card Number */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="text-xs text-slate-300 font-mono tracking-wider flex items-center gap-2">
              <span>WAL-ID: 9840 •••• 8102</span>
              <span className="w-2 h-2 rounded-full bg-[#B7E532] animate-pulse"></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-white/20 hover:scale-[1.02]"
                title="Export transaction history as CSV for tax filing and accounting"
              >
                <Download className="w-3.5 h-3.5 text-[#B7E532]" />
                <span className="hidden sm:inline">Tax CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="px-4 py-2 bg-[#B7E532] hover:bg-[#a3d027] text-[#102B4E] font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Pre-load Credits</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats & Security Breakdown */}
        <div className="bg-white dark:bg-[#0A1727] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-black text-[#102B4E] dark:text-white uppercase tracking-wider block mb-3">
              Wallet Performance
            </span>
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071322] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Total Pre-loaded Credits
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-[#B7E532]">
                  {formatAmount(totalCreditsLoaded)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071322] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Services Paid via 1-Click
                </span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-300">
                  {formatAmount(totalPaymentsMade)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
              <span>NDPR & CBN Compliant Escrow</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Credits remain securely safeguarded until your professional milestone sign-off.
            </p>
          </div>
        </div>
      </div>

      {/* Smart Top-up Auto-Reload Configuration Card */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-sm ${
          smartTopUp.enabled
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
            : 'bg-white dark:bg-[#0A1727] border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                smartTopUp.enabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-[#1464C8] dark:text-[#B7E532]'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${smartTopUp.enabled ? 'animate-spin' : ''}`} style={smartTopUp.enabled ? { animationDuration: '6s' } : undefined} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-[#102B4E] dark:text-white">
                  Smart Top-up Auto-Reload
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    smartTopUp.enabled
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-[#B7E532] border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {smartTopUp.enabled ? 'Auto-Reload Active' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically reload wallet credits via your linked payment method whenever your balance drops below your configured minimum threshold.
              </p>
            </div>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Smart Top-up
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={smartTopUp.enabled}
              aria-label="Toggle Smart Top-up automatic balance reload"
              onClick={handleToggleSmartTopUp}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1464C8] ${
                smartTopUp.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  smartTopUp.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveSmartTopUpRules} className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Threshold Setting */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                <span>Minimum Balance Threshold (NGN)</span>
              </label>
              <input
                type="number"
                min={10000}
                step={10000}
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {[50000, 100000, 150000, 250000].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setThresholdInput(String(preset))}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-pointer transition-colors ${
                      Number(thresholdInput) === preset
                        ? 'bg-[#1464C8] text-white border-[#1464C8]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatAmount(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Reload Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                <span>Auto-Reload Amount (NGN)</span>
              </label>
              <input
                type="number"
                min={10000}
                step={10000}
                value={reloadAmountInput}
                onChange={(e) => setReloadAmountInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {[100000, 200000, 300000, 500000].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReloadAmountInput(String(preset))}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-pointer transition-colors ${
                      Number(reloadAmountInput) === preset
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    +{formatAmount(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Linked Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                <span>Linked Payment Method</span>
              </label>
              <select
                value={selectedLinkedMethodId}
                onChange={(e) => setSelectedLinkedMethodId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8] cursor-pointer"
                aria-label="Select linked payment method for Smart Top-up"
              >
                {linkedMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.label} ({method.provider})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                Encrypted mandate used automatically when balance falls below threshold.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
              <span>
                Rule: When balance &lt; <strong>{formatAmount(Number(thresholdInput) || smartTopUp.thresholdNGN)}</strong> → Auto-load <strong>+{formatAmount(Number(reloadAmountInput) || smartTopUp.reloadAmountNGN)}</strong> via{' '}
                <strong>{linkedMethods.find(m => m.id === selectedLinkedMethodId)?.label || 'Linked Card'}</strong>
              </span>
              {smartTopUp.lastAutoReloadAt && (
                <span className="text-[10px] text-emerald-700 dark:text-[#B7E532] font-bold">
                  (Last auto-reload: {new Date(smartTopUp.lastAutoReloadAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})
                </span>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#102B4E] hover:bg-[#1464C8] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
              <span>Save Auto-Reload Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* 1-Click Pay Pending Bookings Section */}
      {pendingPaymentBookings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-blue-50/80 dark:from-[#0B1E34] dark:via-[#09222B] dark:to-[#0B1E34] p-5 sm:p-6 rounded-3xl border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1464C8] text-white flex items-center justify-center font-black">
                <Zap className="w-4 h-4 fill-[#B7E532] text-[#B7E532]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#102B4E] dark:text-white">
                  Pending Bookings Eligible for 1-Click Wallet Checkout
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use your pre-loaded balance to confirm pending appointments instantly without re-entering card numbers.
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-[#1464C8] dark:text-[#B7E532] px-2.5 py-1 rounded-full bg-white dark:bg-[#071322] border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
              {pendingPaymentBookings.length} Awaiting Payment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingPaymentBookings.map((b) => {
              const amount = parseBookingAmount(b);
              const canAfford = walletState.balanceNGN >= amount;

              return (
                <div 
                  key={b.id}
                  className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-[#1464C8] dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {b.reference}
                      </span>
                      <span className="text-xs font-black text-[#102B4E] dark:text-[#B7E532]">
                        {formatAmount(amount)}
                      </span>
                    </div>
                    <h5 className="font-black text-xs text-[#102B4E] dark:text-white mt-1.5 leading-snug">
                      {b.serviceTitle}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b.providerName} • {b.appointmentDate} at {b.timeSlot}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {canAfford ? '✓ Full Wallet Balance Available' : '⚠️ Top-up needed for 1-click'}
                    </span>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handle1ClickPayBooking(b)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{canAfford ? '1-Click Pay Now' : 'Pre-load & Pay'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="bg-white dark:bg-[#0A1727] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-base font-black text-[#102B4E] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Wallet Transaction History</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live audit ledger of all pre-loaded credits, 1-click payments, and service deposits.
            </p>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] dark:bg-[#1464C8] dark:hover:bg-[#102B4E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs border border-white/10 cursor-pointer hover:scale-[1.02]"
              title="Export transaction history as CSV for tax filing and audit records"
            >
              <Download className="w-3.5 h-3.5 text-[#B7E532]" />
              <span>Export Tax CSV</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All (${walletState.transactions.length})` },
                { id: 'credit', label: `Top-Ups (${walletState.transactions.filter(t => t.type === 'credit').length})` },
                { id: 'debit', label: `Payments (${walletState.transactions.filter(t => t.type === 'debit').length})` },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTxFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    txFilter === f.id
                      ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by transaction reference, service title, or payment method..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
          />
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTransactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No transactions match your search filter.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'credit';

              return (
                <div 
                  key={tx.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCredit 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#B7E532]' 
                        : 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300'
                    }`}>
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4 fill-current" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-xs text-[#102B4E] dark:text-white">
                          {tx.description}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {tx.reference}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>
                          {new Date(tx.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {tx.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{tx.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className={`text-sm font-black ${
                      isCredit 
                        ? 'text-emerald-600 dark:text-[#B7E532]' 
                        : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {isCredit ? '+' : '-'}{formatAmount(tx.amountNGN)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Bal: {formatAmount(tx.balanceAfterNGN)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Top-Up Pre-load Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0A1727] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1464C8] text-white flex items-center justify-center font-black">
                  <Plus className="w-5 h-5 text-[#B7E532] stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#102B4E] dark:text-white">
                    Pre-load MsmeBooks Wallet Credits
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant balance availability for 1-click booking payments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Amount Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Select Credit Amount to Pre-load:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[50000, 100000, 250000, 500000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTopUpAmount(amt);
                      setCustomTopUpInput('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      topUpAmount === amt && !customTopUpInput
                        ? 'border-[#1464C8] bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] shadow-xs ring-2 ring-[#1464C8]/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#071322] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    +{formatAmount(amt)}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customTopUpInput}
                  onChange={(e) => setCustomTopUpInput(e.target.value)}
                  placeholder="Or enter custom amount in ₦ (e.g. 150000)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                />
              </div>
            </div>

            {/* Funding Channel Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Select Funding Channel:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'Paystack Instant Card Checkout', title: 'Debit Card (Visa / Mastercard / Verve)', desc: 'Instant processing via Paystack 3D Secure' },
                  { id: 'Access Bank NIBSS Direct Transfer', title: 'Virtual Dedicated Bank Transfer', desc: 'Direct corporate account transfer (Instant credit)' },
                  { id: 'USSD / Mobile Money Gateway', title: 'USSD / M-Pesa / Mobile Money', desc: 'Dial *737# or STK push for East/West African networks' },
                ].map(ch => (
                  <label
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedChannel === ch.id
                        ? 'border-[#1464C8] bg-blue-50/60 dark:bg-blue-950/40 text-[#102B4E] dark:text-white ring-1 ring-[#1464C8]'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black block">{ch.title}</span>
                      <span className="text-[11px] text-slate-400">{ch.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="topUpChannel"
                      checked={selectedChannel === ch.id}
                      onChange={() => setSelectedChannel(ch.id)}
                      className="accent-[#1464C8]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteTopUp}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Top-Up...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                    <span>Confirm & Pre-load Credits</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
