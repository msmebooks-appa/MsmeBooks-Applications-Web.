import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface PayoutVisualSummaryProps {
  totalEarned?: number;
  pendingPayouts?: number;
  accruingCycle?: number;
  nextPayoutDate?: string;
  nextPayoutDayLabel?: string;
  payoutMethod?: string;
  onViewPayouts?: () => void;
  onViewCommissions?: () => void;
}

export const PayoutVisualSummary: React.FC<PayoutVisualSummaryProps> = ({
  totalEarned = 16240.00,
  pendingPayouts = 1440.00,
  accruingCycle = 480.00,
  nextPayoutDate = 'Nov 15, 2026',
  nextPayoutDayLabel = 'Friday · In 4 Days',
  payoutMethod = 'First Bank Nigeria (•••8821)',
  onViewPayouts,
  onViewCommissions
}) => {
  const [showWireDetails, setShowWireDetails] = useState(false);
  const { currency, setCurrency, formatMoney, currentCurrency } = useCurrency();
  const [showInUsd, setShowInUsd] = useState(false);

  const formatAmount = (valUsd: number) => {
    if (showInUsd || currency === 'USD') {
      return `$${valUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return formatMoney(valUsd);
  };

  return (
    <div className="w-full space-y-3">
      {/* Header bar with contextual switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#0A3981]/10 dark:bg-[#8CE600]/15 text-[#0A3981] dark:text-[#8CE600]">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Financial & Payout Summary
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Disbursement Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bi-weekly automated revenue share settlement via direct institutional wire
            </p>
          </div>
        </div>

        {/* Currency preview toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#072457] p-1 rounded-xl border border-slate-200 dark:border-blue-900 text-[11px]">
          <span className="text-slate-400 dark:text-slate-400 px-1.5 font-medium">Currency:</span>
          <button
            onClick={() => setShowInUsd(false)}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              !showInUsd
                ? 'bg-white dark:bg-[#8CE600] text-[#0A3981] dark:text-[#061F4A] shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{currentCurrency.flag}</span>
            <span>{currentCurrency.code} ({currentCurrency.symbol.trim()})</span>
          </button>
          {currency !== 'USD' && (
            <button
              onClick={() => setShowInUsd(true)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                showInUsd
                  ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
          )}
        </div>
      </div>

      {/* 3-Card Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: TOTAL EARNED */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-[#0A2552] dark:via-[#0A2552] dark:to-[#071c3d] p-5 rounded-2xl border border-slate-200/90 dark:border-blue-800 shadow-xs hover:shadow-md transition-all duration-200">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 dark:bg-[#8CE600]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/80 text-emerald-600 dark:text-[#8CE600] flex items-center justify-center shadow-xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Total Earned
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Lifetime Settled Revenue
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/70">
              <TrendingUp className="w-3 h-3" /> +18.4% YoY
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {formatAmount(totalEarned)}
            </div>
            {!showInUsd && currency !== 'USD' && (
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                ≈ ${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" />
              14 wire batches settled
            </span>
            {onViewPayouts && (
              <button
                onClick={onViewPayouts}
                className="font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                History <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: PENDING PAYOUTS */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/20 dark:from-[#0A2552] dark:via-[#0A2552] dark:to-[#071c3d] p-5 rounded-2xl border border-slate-200/90 dark:border-blue-800 shadow-xs hover:shadow-md transition-all duration-200">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 dark:bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Pending Payouts
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Approved for Disbursement
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200/70 dark:border-amber-800/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Locked & Approved
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-[#8CE600] font-mono tabular-nums tracking-tight">
              {formatAmount(pendingPayouts)}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <span>+{formatAmount(accruingCycle)} unbilled current cycle accrual</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              Next batch status: <strong className="text-slate-700 dark:text-slate-200">Cleared</strong>
            </span>
            {onViewCommissions && (
              <button
                onClick={onViewCommissions}
                className="font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Breakdown <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 3: NEXT PAYOUT DATE */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/20 dark:from-[#0A2552] dark:via-[#0A2552] dark:to-[#071c3d] p-5 rounded-2xl border border-slate-200/90 dark:border-blue-800 shadow-xs hover:shadow-md transition-all duration-200">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 dark:bg-sky-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/80 text-[#0A3981] dark:text-sky-300 flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Next Payout Date
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Bi-Weekly Scheduled Wire
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0A3981] dark:text-sky-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200/70 dark:border-blue-800/70">
              {nextPayoutDayLabel}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {nextPayoutDate}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate">
              <Building2 className="w-3 h-3 shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{payoutMethod}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              Method: Direct Bank Wire
            </span>
            <button
              onClick={() => setShowWireDetails(!showWireDetails)}
              className="font-bold text-[#0A3981] dark:text-sky-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Wire Details <ChevronRight className={`w-3 h-3 transition-transform ${showWireDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Wire Settlement Routing Drawer */}
      {showWireDetails && (
        <div className="bg-slate-100 dark:bg-[#072457] border border-slate-200 dark:border-blue-800/80 rounded-2xl p-4 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Building2 className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                Institutional Wire Settlement Route
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Funds are wired automatically via automated clearing on the 15th and end of each calendar month. No manual invoice submission is required for Gold tier accredited partners.
              </p>
            </div>
            <button
              onClick={() => setShowWireDetails(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-200/80 dark:border-blue-900/70 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Beneficiary Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Adeyemi Advisory Ltd</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Destination Institution</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">First Bank of Nigeria</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Account Reference</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">0129••••8821</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Settlement SLA</span>
              <span className="font-semibold text-emerald-600 dark:text-[#8CE600]">T+0 Instant Wire</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
