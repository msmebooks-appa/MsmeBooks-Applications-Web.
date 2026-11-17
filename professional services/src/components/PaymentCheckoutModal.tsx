import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  ArrowRight, 
  Clock, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw,
  QrCode,
  Zap,
  Globe,
  Wallet
} from 'lucide-react';
import { PaymentGateway, PaymentCheckoutResult, PaymentGatewayId } from '../types/payment';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateway: PaymentGateway;
  amountFormatted: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  onPaymentSuccess: (result: PaymentCheckoutResult) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  gateway,
  amountFormatted,
  bookingRef,
  customerName,
  customerEmail,
  customerPhone,
  serviceTitle,
  onPaymentSuccess,
}) => {
  // Common states
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'card' | 'transfer' | 'mobile_money' | 'ussd' | 'wallet' | 'upi'>('card');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states for Card
  const [cardNumber, setCardNumber] = useState('4084 0092 8192 4819');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [cardPin, setCardPin] = useState('1234');

  // Form states for Mobile Money (M-Pesa, CinetPay, FedaPay, LigdiCash, Paynow)
  const [mobileNumber, setMobileNumber] = useState(customerPhone || '+254 712 345 678');
  const [momoProvider, setMomoProvider] = useState<string>('Orange Money');
  const [stkPushSent, setStkPushSent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Form states for South Africa EFT (Ozow, Peach Payments)
  const [selectedSaBank, setSelectedSaBank] = useState('Capitec Bank');
  const [selectedMollieBank, setSelectedMollieBank] = useState('ING');

  // Form states for Razorpay UPI
  const [upiId, setUpiId] = useState('merchant@okhdfcbank');

  // Virtual Account generated for this transaction
  const virtualAccount = {
    bank: gateway.id === 'monnify'
      ? 'Moniepoint MFB / Monnify'
      : gateway.id === 'transactpay'
      ? 'Providus Bank / TransactPay'
      : 'Wema Bank / MsmeBooks Checkout',
    accountNumber: gateway.id === 'monnify' ? '6019384729' : '8910482910',
    beneficiary: 'MsmeBooks Enterprise Subscriptions Escrow',
    expiresIn: '29:45',
  };

  // Set default sub-tab according to gateway type
  useEffect(() => {
    if (gateway.id === 'mpesa' || gateway.id === 'cinetpay' || gateway.id === 'fedapay' || gateway.id === 'ligdicash' || gateway.id === 'paynow') {
      setActiveSubTab('mobile_money');
    } else if (gateway.id === 'transactpay' || gateway.id === 'monnify' || gateway.id === 'ozow' || gateway.id === 'peachpayments' || gateway.id === 'mollie') {
      setActiveSubTab('transfer');
    } else if (gateway.id === 'paypal') {
      setActiveSubTab('wallet');
    } else if (gateway.id === 'razorpay') {
      setActiveSubTab('upi');
    } else {
      setActiveSubTab('card');
    }
  }, [gateway.id]);

  // Handle countdown for STK push / transfer simulation
  useEffect(() => {
    let timer: any;
    if (stkPushSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [stkPushSent, countdown]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSimulatePayment = (channelOverride?: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const prefix = gateway.id.toUpperCase().slice(0, 4);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const txnRef = `${prefix}-TXN-${randomSuffix}`;

      onPaymentSuccess({
        gatewayId: gateway.id,
        gatewayName: gateway.name,
        transactionRef: txnRef,
        amountFormatted,
        status: 'succeeded',
        channel: channelOverride || activeSubTab,
        paidAt: new Date().toISOString(),
        customerEmail,
        customerName,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Gateway Branded Header */}
        <div 
          className="p-5 text-white flex items-center justify-between border-b border-white/10"
          style={{ backgroundColor: '#102B4E' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm"
              style={{ backgroundColor: gateway.accentColor }}
            >
              {gateway.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  {gateway.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-[#B7E532]">
                  {gateway.region}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Reference: <strong className="text-white">{bookingRef}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Total Payable</span>
              <span className="text-base font-black text-[#B7E532]">{amountFormatted}</span>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount Pill for Mobile */}
        <div className="sm:hidden bg-[#0A1727] px-5 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-300">Amount Due:</span>
          <span className="font-black text-[#B7E532] text-sm">{amountFormatted}</span>
        </div>

        {/* Sub-channel Tab Selector */}
        <div className="bg-slate-50 dark:bg-[#07111D] p-2 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubTab('card')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'card'
                ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>

          {(gateway.id === 'paystack' || gateway.id === 'flutterwave' || gateway.id === 'monnify' || gateway.id === 'transactpay' || gateway.id === 'ozow' || gateway.id === 'peachpayments' || gateway.id === 'mollie') && (
            <button
              onClick={() => setActiveSubTab('transfer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'transfer'
                  ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{gateway.id === 'ozow' ? 'Instant EFT' : 'Bank Transfer'}</span>
            </button>
          )}

          {(gateway.id === 'mpesa' || gateway.id === 'cinetpay' || gateway.id === 'fedapay' || gateway.id === 'ligdicash' || gateway.id === 'paynow' || gateway.id === 'flutterwave' || gateway.id === 'pesapal') && (
            <button
              onClick={() => setActiveSubTab('mobile_money')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'mobile_money'
                  ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Money</span>
            </button>
          )}

          {gateway.id === 'razorpay' && (
            <button
              onClick={() => setActiveSubTab('upi')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'upi'
                  ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI / QR</span>
            </button>
          )}

          {(gateway.id === 'paypal' || gateway.id === 'twocheckout') && (
            <button
              onClick={() => setActiveSubTab('wallet')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'wallet'
                  ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet Checkout</span>
            </button>
          )}

          {(gateway.id === 'paystack' || gateway.id === 'monnify') && (
            <button
              onClick={() => setActiveSubTab('ussd')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'ussd'
                  ? 'bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>USSD Code</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* 1. OZOW INSTANT EFT VIEW (South Africa) */}
          {gateway.id === 'ozow' && activeSubTab === 'transfer' && (
            <div className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800">
                <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs">
                  <Building2 className="w-4 h-4 text-[#00BFA5]" />
                  <span>Ozow Instant EFT — Authorize via your SA Bank</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Direct automated EFT settlement with zero card required. Fast, free and cleared immediately.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Capitec Bank', 'FNB', 'Standard Bank', 'ABSA', 'Nedbank', 'TymeBank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedSaBank(b)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        selectedSaBank === b
                          ? 'border-[#00BFA5] bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(`Ozow Instant EFT (${selectedSaBank})`)}
                disabled={isProcessing}
                className="w-full py-3 bg-[#00BFA5] hover:bg-[#00a68f] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to {selectedSaBank}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize {amountFormatted} with {selectedSaBank}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 2. PAYPAL DIGITAL WALLET VIEW */}
          {gateway.id === 'paypal' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-center space-y-2">
                <div className="text-[#003087] font-black text-2xl tracking-tighter">
                  <i>Pay</i><i className="text-[#0079C1]">Pal</i>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Log in to your PayPal account to complete your MsmeBooks subscription payment securely.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Order Ref:</span>
                  <strong className="font-mono">{bookingRef}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Amount Charged:</span>
                  <strong className="text-base text-[#003087] dark:text-[#B7E532] font-black">{amountFormatted}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment('PayPal Wallet Checkout')}
                disabled={isProcessing}
                className="w-full py-3 bg-[#FFC439] hover:bg-[#f4b82d] text-[#003087] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating PayPal Wallet...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay with PayPal ({amountFormatted})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 3. RAZORPAY UPI VIEW */}
          {gateway.id === 'razorpay' && activeSubTab === 'upi' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-xs font-bold text-slate-500">Scan UPI QR with GPay / PhonePe / Paytm:</span>
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-xs">
                  <QrCode className="w-28 h-28 text-slate-800" />
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">VPA: msmebooks.sub@hdfcbank</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Or enter your Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment('Razorpay UPI')}
                disabled={isProcessing}
                className="w-full py-3 bg-[#0C2340] hover:bg-[#1a3860] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />}
                <span>Send UPI Approval Request</span>
              </button>
            </div>
          )}

          {/* 4. MOLLIE (Europe iDEAL / SEPA) */}
          {gateway.id === 'mollie' && activeSubTab === 'transfer' && (
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950/40 p-4 rounded-2xl border border-orange-200 dark:border-orange-800">
                <span className="text-xs font-bold text-orange-900 dark:text-orange-200 block">
                  Select your European iDEAL Bank:
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['ING Bank', 'Rabobank', 'ABN AMRO', 'SNS Bank', 'ASN Bank', 'bunq'].map((bk) => (
                    <button
                      key={bk}
                      type="button"
                      onClick={() => setSelectedMollieBank(bk)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                        selectedMollieBank === bk
                          ? 'border-[#FF6B00] bg-orange-100/60 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1D31]'
                      }`}
                    >
                      {bk}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(`Mollie iDEAL (${selectedMollieBank})`)}
                disabled={isProcessing}
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Authorize with {selectedMollieBank}</span>
              </button>
            </div>
          )}

          {/* 5. M-PESA, CINETPAY, FEDAPAY, LIGDICASH, PAYNOW MOBILE MONEY */}
          {(activeSubTab === 'mobile_money' || gateway.id === 'mpesa' || gateway.id === 'cinetpay' || gateway.id === 'fedapay' || gateway.id === 'ligdicash' || gateway.id === 'paynow') && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>{gateway.name} Mobile Money Push Prompt</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Enter your registered mobile subscriber number. A payment prompt will be dispatched directly to your mobile screen.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber Phone Number
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+254 7XX / +225 07 / +229 97 / +263 77"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              {stkPushSent ? (
                <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#102B4E] dark:text-white">
                      Payment Prompt Dispatched to {mobileNumber}!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Check your mobile screen and confirm your PIN to authorize <strong>{amountFormatted}</strong>.
                    </p>
                    <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                      Awaiting network confirmation ({countdown}s)...
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(`${gateway.name} Mobile Money`)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Confirm Mobile Payment Received</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStkPushSent(true);
                    setCountdown(30);
                  }}
                  className="w-full py-3 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  style={{ backgroundColor: gateway.accentColor }}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Direct Mobile PIN Prompt</span>
                </button>
              )}
            </div>
          )}

          {/* 6. BANK TRANSFER / DEDICATED VIRTUAL ACCOUNT (Monnify, TransactPay, Paystack) */}
          {activeSubTab === 'transfer' && (gateway.id === 'monnify' || gateway.id === 'transactpay' || gateway.id === 'paystack' || gateway.id === 'flutterwave') && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1464C8] dark:text-[#B7E532]">
                    <Building2 className="w-4 h-4" />
                    <span>{gateway.name} Automated NIP Virtual Account</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-amber-600">
                    Expires in {virtualAccount.expiresIn}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Transfer exact total of <strong>{amountFormatted}</strong> to this dedicated escrow account. Payment will be recognized within seconds.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Destination Bank:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{virtualAccount.bank}</strong>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-base font-mono font-black text-[#1464C8] dark:text-[#B7E532] tracking-wider">
                      {virtualAccount.accountNumber}
                    </strong>
                    <button
                      onClick={() => handleCopy(virtualAccount.accountNumber, 'acc')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="Copy account number"
                    >
                      {copiedText === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Beneficiary Name:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{virtualAccount.beneficiary}</strong>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Order Reference:</span>
                  <strong className="text-slate-800 dark:text-slate-100 font-mono">{bookingRef}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(`${gateway.name} Bank Transfer`)}
                disabled={isProcessing}
                className="w-full py-3 bg-[#102B4E] hover:bg-[#1464C8] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Interbank Transfer...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                    <span>I have Sent the Transfer ({amountFormatted})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 7. USSD VIEW (Paystack & Monnify) */}
          {activeSubTab === 'ussd' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Dial USSD string on your phone:</span>
                <div className="text-lg font-mono font-black text-[#1464C8] dark:text-[#B7E532] tracking-wider py-1.5 px-4 bg-white dark:bg-[#0A1727] rounded-xl border border-slate-200 dark:border-slate-700 inline-block">
                  {gateway.id === 'monnify' ? '*5573*1*819201#' : '*737*50*95000*8192#'}
                </div>
                <p className="text-[11px] text-slate-500">Supported by all Nigerian commercial and microfinance banks.</p>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(`${gateway.name} USSD`)}
                disabled={isProcessing}
                className="w-full py-3 bg-[#1464C8] hover:bg-[#1052a5] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>I have Completed USSD Prompt</span>
              </button>
            </div>
          )}

          {/* 8. STANDARD CARD VIEW (Stripe, Paystack, Flutterwave, Yoco, Payfort, 2Checkout, etc.) */}
          {activeSubTab === 'card' && (
            <div className="space-y-4">
              {gateway.id === 'stripe' && (
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('Apple Pay / Google Pay')}
                  disabled={isProcessing}
                  className="w-full py-3 bg-black hover:bg-slate-900 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-white/20"
                >
                  <span> Pay / G Pay Quick Checkout</span>
                  <span className="text-xs text-slate-400">• {amountFormatted}</span>
                </button>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  defaultValue={customerName}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Number (Visa / Mastercard / Verve / Amex)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-100 pl-10"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CVV (3 digits)
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePayment(`${gateway.name} Card`)}
                disabled={isProcessing}
                className="w-full py-3 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: gateway.accentColor }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Securing transaction with {gateway.name}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {amountFormatted} with {gateway.name}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security & Compliance Footer */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit SSL Encrypted • PCI-DSS Certified</span>
            </span>
            <span className="font-semibold text-slate-500">MsmeBooks Trusted Rail</span>
          </div>

        </div>

      </div>
    </div>
  );
};
