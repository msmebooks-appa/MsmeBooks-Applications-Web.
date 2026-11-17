import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  Globe
} from 'lucide-react';

interface QuickPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountFormatted: string;
  bookingRef: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  onQuickPaySuccess: (gateway: 'Paystack' | 'Flutterwave' | 'Stripe', transactionRef: string) => void;
}

export const QuickPayModal: React.FC<QuickPayModalProps> = ({
  isOpen,
  onClose,
  amountFormatted,
  bookingRef,
  serviceTitle,
  customerName,
  customerEmail,
  onQuickPaySuccess,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<'Paystack' | 'Flutterwave' | 'Stripe'>('Paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [testCardNumber, setTestCardNumber] = useState('4084 0092 8192 4819');
  const [testExpiry, setTestExpiry] = useState('12/28');
  const [testCvv, setTestCvv] = useState('892');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const prefix = selectedGateway === 'Paystack' ? 'pstk' : selectedGateway === 'Flutterwave' ? 'flw' : 'ch_stripe';
      const ref = `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      setTimeout(() => {
        onQuickPaySuccess(selectedGateway, ref);
      }, 1200);
    }, 1500);
  };

  const gateways = [
    {
      id: 'Paystack' as const,
      name: 'Paystack',
      tagline: 'Cards, Bank Transfer & USSD (Nigeria, Ghana, Kenya, South Africa)',
      badge: 'Most Popular in Africa',
      color: 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
      icon: '🇳🇬',
    },
    {
      id: 'Flutterwave' as const,
      name: 'Flutterwave',
      tagline: 'Pan-African Cards, Mobile Money & Barter (34+ African Currencies)',
      badge: 'Pan-African Reach',
      color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
      icon: '🌍',
    },
    {
      id: 'Stripe' as const,
      name: 'Stripe',
      tagline: 'Global Visa, Mastercard, Amex, Apple Pay & Google Pay (USD / EUR / GBP)',
      badge: 'Global & Diaspora',
      color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300',
      icon: '🌐',
    },
  ];

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B7E532] text-[#102B4E] flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B7E532]">
                  Instant Digital Checkout
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-white text-[10px] font-mono">
                  Sandbox Active
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Quick Pay Shortcut</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-[#102B4E] dark:text-white">
                Payment Authorized Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                {amountFormatted} paid via {selectedGateway} sandbox. Finalizing your booking confirmation record...
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary Pill */}
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Service Booking</span>
                  <span className="text-xs font-bold text-[#102B4E] dark:text-white truncate max-w-[240px] block">
                    {serviceTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Ref: {bookingRef}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-semibold">Total Payable</span>
                  <span className="text-base sm:text-lg font-black text-[#1464C8] dark:text-[#B7E532]">
                    {amountFormatted}
                  </span>
                </div>
              </div>

              {/* Gateway Selection Tabs */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Instant Payment Gateway:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {gateways.map((gw) => {
                    const isSelected = selectedGateway === gw.id;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setSelectedGateway(gw.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? `${gw.color} ring-2 ring-blue-500/30 border-current shadow-xs`
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071322] hover:bg-slate-50 dark:hover:bg-[#0D1D31]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl leading-none">{gw.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">
                                {gw.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                                {gw.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {gw.tagline}
                            </span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#1464C8] dark:border-[#B7E532]' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simulated Card Test Inputs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#102B4E] dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                    <span>Instant Authorization Sandbox</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-[#B7E532] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 256-bit Encrypted
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Card Number (Pre-filled Test Card)
                  </label>
                  <input
                    type="text"
                    value={testCardNumber}
                    onChange={(e) => setTestCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071322] text-[#102B4E] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry</label>
                    <input
                      type="text"
                      value={testExpiry}
                      onChange={(e) => setTestExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071322] text-[#102B4E] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVV / CVC</label>
                    <input
                      type="text"
                      value={testCvv}
                      onChange={(e) => setTestCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071322] text-[#102B4E] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-gradient-to-r from-[#1464C8] to-[#102B4E] hover:from-[#1052a5] hover:to-[#0C223E] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing with {selectedGateway}...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#B7E532] fill-current" />
                    <span>Authorize & Pay {amountFormatted} via {selectedGateway}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                🔒 Funds held securely in MsmeBooks Client Escrow until appointment fulfillment.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
