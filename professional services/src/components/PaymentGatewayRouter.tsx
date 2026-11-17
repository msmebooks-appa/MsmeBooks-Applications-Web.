import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Globe2, 
  Check, 
  Copy, 
  ArrowRight, 
  MessageCircle, 
  AlertCircle,
  HelpCircle,
  Send,
  Zap,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { ProfessionalFirm } from '../data/firmsData';
import { PaymentGateway, PaymentGatewayId, PaymentRegionKey } from '../types/payment';
import { PaymentProcessor, CountryPaymentSummary } from '../utils/paymentProcessor';
import { PAYMENT_GATEWAYS, getGatewayById, getGatewaysByRegion } from '../data/paymentGateways';

export interface PaymentGatewayRouterProps {
  firm?: ProfessionalFirm | null;
  clientCountry: string;
  clientCity: string;
  amountFormatted: string;
  amountNGN: number;
  selectedGatewayId: PaymentGatewayId;
  onSelectGateway: (gatewayId: PaymentGatewayId) => void;
  onInitiatePayment: (gateway: PaymentGateway) => void;
  onWhatsAppCheckout: () => void;
  onRequestQuote: () => void;
  clientInfo: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
  };
}

export const PaymentGatewayRouter: React.FC<PaymentGatewayRouterProps> = ({
  firm,
  clientCountry,
  clientCity,
  amountFormatted,
  amountNGN,
  selectedGatewayId,
  onSelectGateway,
  onInitiatePayment,
  onWhatsAppCheckout,
  onRequestQuote,
  clientInfo,
}) => {
  // 1. Detect Firm's Operating Country & Region
  const firmCountry = firm?.country || clientCountry || 'Nigeria';
  const firmRegion: PaymentRegionKey = useMemo(() => {
    return PaymentProcessor.getPaymentRegion(firmCountry);
  }, [firmCountry]);

  // Client's detected country summary
  const clientCountrySummary: CountryPaymentSummary = useMemo(() => {
    return PaymentProcessor.getCountryPaymentSummary(clientCountry);
  }, [clientCountry]);

  // Firm's detected country summary
  const firmCountrySummary: CountryPaymentSummary = useMemo(() => {
    return PaymentProcessor.getCountryPaymentSummary(firmCountry);
  }, [firmCountry]);

  // Is this a cross-border booking?
  const isCrossBorder = clientCountry.toLowerCase().trim() !== firmCountry.toLowerCase().trim();

  // Primary gateway recommended for the firm's operating region
  const primaryRegionalGateway: PaymentGateway = useMemo(() => {
    return PaymentProcessor.getPrimaryGateway(firmCountry);
  }, [firmCountry]);

  // Gateways list for firm's region
  const regionalGateways: PaymentGateway[] = useMemo(() => {
    return getGatewaysByRegion(firmRegion);
  }, [firmRegion]);

  // Auto-sync primary gateway when firm changes
  useEffect(() => {
    if (primaryRegionalGateway && (!selectedGatewayId || !regionalGateways.some(g => g.id === selectedGatewayId))) {
      onSelectGateway(primaryRegionalGateway.id);
    }
  }, [firmCountry, firmRegion, primaryRegionalGateway, selectedGatewayId, regionalGateways, onSelectGateway]);

  const activeGateway = getGatewayById(selectedGatewayId) || primaryRegionalGateway || PAYMENT_GATEWAYS[0];

  // Specific Regional UI Interactive States:
  // Nigeria UI states
  const [nigeriaSubRail, setNigeriaSubRail] = useState<'transfer' | 'card' | 'ussd'>('transfer');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // East Africa M-Pesa UI states
  const [mpesaPhone, setMpesaPhone] = useState(clientInfo.phone || '+254 712 345 678');
  const [stkPushTriggered, setStkPushTriggered] = useState(false);
  const [stkTimer, setStkTimer] = useState(60);

  // South Africa Ozow UI states
  const [selectedSaBank, setSelectedSaBank] = useState<string>('Capitec Pay');

  // Other Africa Mobile Money states
  const [selectedMoMoProvider, setSelectedMoMoProvider] = useState<string>('Orange Money');
  const [momoPhone, setMomoPhone] = useState(clientInfo.phone || '+225 07 08 09 10');

  // Global Card states
  const [cardHolder, setCardHolder] = useState(clientInfo.fullName || 'Corporate Account');

  // Handle STK push countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stkPushTriggered && stkTimer > 0) {
      interval = setInterval(() => setStkTimer((prev) => prev - 1), 1000);
    } else if (stkTimer === 0) {
      setStkPushTriggered(false);
      setStkTimer(60);
    }
    return () => clearInterval(interval);
  }, [stkPushTriggered, stkTimer]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateStkPush = () => {
    setStkPushTriggered(true);
    setStkTimer(45);
  };

  return (
    <div className="space-y-4 pt-1">
      {/* 1. AUTOMATIC FIRM & REGIONAL DETECTION BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/60 dark:from-[#0B1E36] dark:to-[#0A1727] border border-blue-200/80 dark:border-blue-900/60 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-[#07111D] border border-blue-100 dark:border-blue-900 shadow-2xs shrink-0">
              {firmCountrySummary.flag}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">
                  Firm Operating Region: {firmCountry} ({firmRegion})
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {firmCountrySummary.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                Firm Headquarters: <strong>{firm?.name || 'MsmeBooks Professional Network'}</strong> ({firm?.city || clientCity}, {firmCountry})
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Local Clearing Rails: <strong>{firmCountrySummary.localRailsDescription}</strong>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-200/60 dark:border-blue-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Payable</span>
            <span className="text-sm font-black text-[#1464C8] dark:text-[#B7E532] bg-white dark:bg-[#07111D] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
              {amountFormatted}
            </span>
          </div>
        </div>

        {/* Cross-Border Routing Notice */}
        {isCrossBorder && (
          <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <Globe2 className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Cross-Border Settlement:</strong> Client location is <strong>{clientCountry}</strong> {clientCountrySummary.flag} booking a firm in <strong>{firmCountry}</strong> {firmCountrySummary.flag}. Currency conversion and regional clearing rails are automatically harmonized.
            </span>
          </div>
        )}
      </div>

      {/* 2. REGIONAL GATEWAY SELECTOR (Primary & Regional Alternatives) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Active Regional Gateway ({firmRegion})
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Primary: <strong className="text-[#1464C8] dark:text-[#B7E532]">{primaryRegionalGateway.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {regionalGateways.map((gw) => {
            const isSelected = activeGateway.id === gw.id;
            const isPrimary = gw.id === primaryRegionalGateway.id;

            return (
              <button
                key={gw.id}
                type="button"
                onClick={() => onSelectGateway(gw.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#1464C8]/30 dark:ring-[#B7E532]/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1727] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ backgroundColor: gw.accentColor }}
                  >
                    {gw.name.slice(0, 2).toUpperCase()}
                  </div>
                  {isPrimary && (
                    <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                      Primary
                    </span>
                  )}
                </div>

                <div>
                  <span className="font-black text-xs text-[#102B4E] dark:text-white block truncate">
                    {gw.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {gw.supportedMethods[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INJECTED SPECIFIC REGIONAL PAYMENT UI */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#081321] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Gateway Header & Trust Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-xs"
              style={{ backgroundColor: activeGateway.accentColor }}
            >
              {activeGateway.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#102B4E] dark:text-white">
                  {activeGateway.name} Injected Regional Checkout
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  · {activeGateway.region}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeGateway.tagline}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PCI-DSS Level 1 Encrypted</span>
          </div>
        </div>

        {/* SPECIFIC REGIONAL RAIL UI SWITCHER */}

        {/* A. NIGERIA & WEST AFRICA (Paystack, Monnify, Flutterwave, TransactPay) */}
        {firmRegion === 'Nigeria & West Africa' && (
          <div className="space-y-3">
            {/* Sub-rail toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0F2238] rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setNigeriaSubRail('transfer')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  nigeriaSubRail === 'transfer'
                    ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NIP Instant Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setNigeriaSubRail('card')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  nigeriaSubRail === 'card'
                    ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Debit Card (Mastercard/Visa/Verve)</span>
              </button>
              <button
                type="button"
                onClick={() => setNigeriaSubRail('ussd')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  nigeriaSubRail === 'ussd'
                    ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Bank USSD</span>
              </button>
            </div>

            {/* Sub-rail 1: Virtual Account NIP Transfer */}
            {nigeriaSubRail === 'transfer' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider">
                    Dynamic Dedicated Virtual Account
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Expires in 30:00 mins
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#07111D] border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Bank Name</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200 font-mono">
                      Wema Bank / Providus
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#07111D] border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Account Number</span>
                      <strong className="text-xs text-[#1464C8] dark:text-[#B7E532] font-mono tracking-wider">
                        8291048291
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('8291048291', 'accNumber')}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Copy account number"
                    >
                      {copiedField === 'accNumber' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#07111D] border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Beneficiary Name</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200 truncate block">
                      MsmeBooks / {firm?.name?.slice(0, 16) || 'Consulting'}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Transfer exact fee of <strong>{amountFormatted}</strong> from your Nigerian bank app. Account automatically verifies payment via {activeGateway.name} webhooks within 30 seconds.
                </p>
              </div>
            )}

            {/* Sub-rail 2: Card input preview */}
            {nigeriaSubRail === 'card' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Enter Nigerian Debit / Credit Card
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                    <span>Mastercard</span> · <span>Visa</span> · <span>Verve</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number: 5399 •••• •••• ••••"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                    defaultValue="5399 2810 9482 1948"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/28"
                      className="px-3 py-2 text-xs bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-center"
                    />
                    <input
                      type="password"
                      placeholder="CVV: 3 digits"
                      defaultValue="829"
                      className="px-3 py-2 text-xs bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-rail 3: USSD Codes */}
            {nigeriaSubRail === 'ussd' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Select your bank to generate direct USSD payment string
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { bank: 'GTBank', ussd: '*737*2*8291048291#' },
                    { bank: 'Zenith Bank', ussd: '*966*8291048291#' },
                    { bank: 'UBA', ussd: '*919*8291048291#' },
                    { bank: 'Access Bank', ussd: '*901*8291048291#' },
                    { bank: 'First Bank', ussd: '*894*8291048291#' },
                    { bank: 'Stanbic IBTC', ussd: '*909*8291048291#' },
                  ].map((b) => (
                    <div 
                      key={b.bank}
                      onClick={() => copyToClipboard(b.ussd, b.bank)}
                      className="p-2 rounded-lg bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-[#1464C8]"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 block">{b.bank}</span>
                        <strong className="text-[11px] font-mono text-[#1464C8] dark:text-[#B7E532]">{b.ussd}</strong>
                      </div>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* B. EAST AFRICA (M-Pesa STK Push / Peach Payments / DPO Pay) */}
        {firmRegion === 'East Africa' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#008000] text-white flex items-center justify-center font-black text-[10px]">
                    MP
                  </div>
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-xs">
                    Safaricom Lipa Na M-Pesa (STK Push)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  Instant Prompt
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  M-Pesa Registered Mobile Phone Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="flex-1 px-3 py-2 bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateStkPush}
                    disabled={stkPushTriggered}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      stkPushTriggered
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-[#008000] hover:bg-[#006600] text-white shadow-xs'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{stkPushTriggered ? `Push Sent (${stkTimer}s)` : 'Send STK Push'}</span>
                  </button>
                </div>
              </div>

              {stkPushTriggered && (
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2 animate-pulse">
                  <Smartphone className="w-4 h-4 shrink-0 text-[#008000]" />
                  <span>
                    <strong>Check your phone now:</strong> Enter your 4-digit M-Pesa PIN on the Safaricom SIM toolkit prompt to complete payment of <strong>{amountFormatted}</strong>.
                  </span>
                </div>
              )}

              {/* Manual Paybill Alternative */}
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Or use Paybill manually:</span>
                <span className="font-mono">
                  Business No: <strong>400200</strong> · Acc: <strong>MSME-BK</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* C. SOUTH AFRICA (Ozow Instant EFT / Yoco / Pesapal) */}
        {firmRegion === 'South Africa' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/80 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-orange-900 dark:text-orange-200 text-xs">
                  Ozow Instant EFT & Capitec Pay (Zero Card Surcharges)
                </span>
                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300">
                  Instant Clearing
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Select Your South African Bank:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Capitec Pay', 'FNB', 'Standard Bank', 'Absa', 'Nedbank', 'Investec'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedSaBank(bank)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedSaBank === bank
                          ? 'bg-[#E03A00] text-white shadow-xs'
                          : 'bg-white dark:bg-[#07111D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#E03A00]'
                      }`}
                    >
                      <span>{bank}</span>
                      {selectedSaBank === bank && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                You will be connected to <strong>{selectedSaBank}</strong> via Ozow Instant EFT. No card details stored. Immediate automated booking reconciliation.
              </p>
            </div>
          </div>
        )}

        {/* D. OTHER AFRICA COUNTRIES (CinetPay, FedaPay, LigdiCash, Payfort, Paynow) */}
        {firmRegion === 'Other Africa Countries' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-900 dark:text-purple-200 text-xs">
                  Francophone & North Africa Mobile Money / Electronic Pay
                </span>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">
                  CinetPay / FedaPay
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Choose Mobile Network Operator:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave'].map((momo) => (
                    <button
                      key={momo}
                      type="button"
                      onClick={() => setSelectedMoMoProvider(momo)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedMoMoProvider === momo
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-white dark:bg-[#07111D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#7C3AED]'
                      }`}
                    >
                      <span className="truncate">{momo}</span>
                      {selectedMoMoProvider === momo && <Check className="w-3 h-3 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="Mobile number (+225 / +229 / +221 ...)"
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold"
                />
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                You will receive a prompt from <strong>{selectedMoMoProvider}</strong> to authorize <strong>{amountFormatted}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* E. GLOBAL & INTERNATIONAL (Stripe, PayPal, Razorpay, Mollie, 2Checkout) */}
        {firmRegion === 'Global & International' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                  Global Borderless Card & Digital Wallet Checkout
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Stripe / PayPal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onInitiatePayment(activeGateway)}
                  className="py-2.5 px-3 bg-black text-white hover:bg-slate-900 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Pay with Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => onInitiatePayment(activeGateway)}
                  className="py-2.5 px-3 bg-white dark:bg-[#07111D] text-slate-800 dark:text-slate-200 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Google Pay</span>
                </button>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <input
                  type="text"
                  placeholder="Cardholder Full Legal Name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct international multi-currency processing in USD, EUR, GBP, or CAD with 3D-Secure 2.0 fraud protection.
              </p>
            </div>
          </div>
        )}

        {/* 4. MAIN ACTION BUTTONS */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => onInitiatePayment(activeGateway)}
              className="py-3 px-4 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Pay {amountFormatted} via {activeGateway.name}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Direct WhatsApp Concierge Checkout */}
            <button
              type="button"
              onClick={onWhatsAppCheckout}
              className="py-3 px-4 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#102B4E]" />
              <span>Continue via WhatsApp Concierge</span>
            </button>
          </div>

          {/* Alternative Enterprise Quote Option */}
          <button
            type="button"
            onClick={onRequestQuote}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-[#0D1D31] hover:bg-slate-100 dark:hover:bg-[#132842] rounded-xl transition-colors cursor-pointer text-center"
          >
            Request Official Proposal & Invoice for Corporate Board Approval Instead
          </button>
        </div>

      </div>
    </div>
  );
};
