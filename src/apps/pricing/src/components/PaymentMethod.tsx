import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Landmark,
  Wallet,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { Currency } from '../types';
import {
  PaymentGatewayInfo,
  PaymentGatewayId,
  PaymentRegionId,
  CustomerBillingDetails,
} from '../types/cart';
import {
  PAYMENT_REGIONS,
  ALL_PAYMENT_GATEWAYS,
  getGatewaysForCurrency,
  isCurrencyNativelySupported,
} from '../data/paymentGateways';
import { ScanToPayQrCode } from './ScanToPayQrCode';

export interface PaymentMethodProps {
  currency: Currency;
  customer: CustomerBillingDetails;
  totalPayableNgn: number;
  format: (amount: number) => string;
  selectedGateway: PaymentGatewayInfo;
  onSelectGateway: (gatewayId: PaymentGatewayId) => void;
  selectedRegion: PaymentRegionId;
  onSelectRegion: (regionId: PaymentRegionId) => void;
  paymentMode: 'qr' | 'standard';
  onPaymentModeChange: (mode: 'qr' | 'standard') => void;
  isProcessing: boolean;
  onPaymentVerified: (reference: string) => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvv: string;
  setCardCvv: (val: string) => void;
  mobileMoneyPhone: string;
  setMobileMoneyPhone: (val: string) => void;
  selectedBank: string;
  setSelectedBank: (val: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  currency,
  customer,
  totalPayableNgn,
  format,
  selectedGateway,
  onSelectGateway,
  selectedRegion,
  onSelectRegion,
  paymentMode,
  onPaymentModeChange,
  isProcessing,
  onPaymentVerified,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  mobileMoneyPhone,
  setMobileMoneyPhone,
  selectedBank,
  setSelectedBank,
}) => {
  // Filter mode: 'currency_matched' (dynamic based on selected currency) vs 'region' vs 'all'
  const [filterMode, setFilterMode] = useState<'currency_matched' | 'region' | 'all'>('currency_matched');
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);
  const [pingStatus, setPingStatus] = useState<Record<string, number | null>>({});
  const [isPinging, setIsPinging] = useState<string | null>(null);

  // Dynamically surfaced gateways that natively support the active currency
  const currencyMatchedGateways = useMemo(() => {
    return getGatewaysForCurrency(currency);
  }, [currency]);

  // Gateways belonging to the currently selected region
  const regionalGateways = useMemo(() => {
    return ALL_PAYMENT_GATEWAYS.filter((g) => g.region === selectedRegion);
  }, [selectedRegion]);

  // Gateways to display based on active filter mode
  const displayedGateways = useMemo(() => {
    if (filterMode === 'currency_matched' && currencyMatchedGateways.length > 0) {
      return currencyMatchedGateways;
    }
    if (filterMode === 'region') {
      return regionalGateways;
    }
    return ALL_PAYMENT_GATEWAYS;
  }, [filterMode, currencyMatchedGateways, regionalGateways]);

  // Gateway ping simulation handler to verify API integration point
  const handleTestPing = (gatewayId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinging(gatewayId);
    const simulatedLatency = Math.floor(18 + Math.random() * 35);
    setTimeout(() => {
      setPingStatus((prev) => ({ ...prev, [gatewayId]: simulatedLatency }));
      setIsPinging(null);
    }, 600);
  };

  const isCurrentGatewayNative = isCurrencyNativelySupported(selectedGateway, currency);

  return (
    <div className="bg-slate-50 dark:bg-[#071324] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
      
      {/* 1. Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
            <span>2. Country & Currency Payment Providers</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {ALL_PAYMENT_GATEWAYS.length} integrated payment gateways across Africa and worldwide with zero setup fees.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>PCI-DSS Level 1</span>
          </span>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-800">
            {displayedGateways.length} Ready
          </span>
        </div>
      </div>

      {/* 2. Dynamic Currency Surfacing Ribbon */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-emerald-950/30 p-2.5 rounded-xl border border-blue-200/70 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-6 h-6 rounded-lg bg-[#0A4FD5] text-white flex items-center justify-center font-black text-[11px] shrink-0">
            {currency}
          </span>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Active Billing Currency:</span>
              <span className="text-[#0A4FD5] dark:text-blue-300 font-extrabold">{currency}</span>
              {currencyMatchedGateways.length > 0 && (
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {currencyMatchedGateways.length} Native Gateway{currencyMatchedGateways.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Payment gateways below automatically prioritize zero-fee native clearing in {currency}.
            </div>
          </div>
        </div>

        {/* View Switcher: Surfaced for Currency vs By Region vs All */}
        <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setFilterMode('currency_matched')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              filterMode === 'currency_matched'
                ? 'bg-[#0A4FD5] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Surfaced for {currency}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('region')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              filterMode === 'region'
                ? 'bg-[#0A4FD5] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>By Region</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#0A4FD5] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>All ({ALL_PAYMENT_GATEWAYS.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Region Tabs (Active when filterMode === 'region' or for region switching) */}
      {filterMode === 'region' && (
        <div className="space-y-1.5 animate-in fade-in duration-150">
          <label className="block text-[11px] font-semibold text-slate-500">
            Select Geographic Region:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {PAYMENT_REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => {
                  onSelectRegion(region.id);
                  const firstInRegion = ALL_PAYMENT_GATEWAYS.find((g) => g.region === region.id);
                  if (firstInRegion) onSelectGateway(firstInRegion.id);
                }}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedRegion === region.id
                    ? 'bg-[#0A4FD5] text-white border-[#0A4FD5] shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span>{region.flag}</span>
                  <span className="truncate">{region.name.split('&')[0].trim()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Gateways Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            {filterMode === 'currency_matched'
              ? `Gateways with Direct Processing in ${currency}:`
              : filterMode === 'region'
              ? `Gateways in ${PAYMENT_REGIONS.find((r) => r.id === selectedRegion)?.name}:`
              : 'All 33 Available African & Global Gateways:'}
          </span>
          <span className="text-[10px] text-slate-400">
            Click to select gateway
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
          {displayedGateways.map((gw) => {
            const isSelected = selectedGateway.id === gw.id;
            const isNative = isCurrencyNativelySupported(gw, currency);
            const ping = pingStatus[gw.id];

            return (
              <button
                key={gw.id}
                type="button"
                onClick={() => {
                  onSelectGateway(gw.id);
                  onSelectRegion(gw.region);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-blue-50/95 dark:bg-blue-950/60 border-[#0A4FD5] dark:border-blue-500 ring-2 ring-[#0A4FD5]/25 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header row: Flag + Name + Native Badge + Selection Indicator */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{gw.flag}</span>
                    <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                      {gw.name}
                    </span>
                    {gw.popular && (
                      <span className="text-[8px] bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase shrink-0">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isNative && (
                      <span className="text-[8px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                        <span>NATIVE {currency}</span>
                      </span>
                    )}
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-blue-400 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                  {gw.tagline}
                </p>

                {/* Integration Protocol & Settlement Timeline Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {gw.integrationProtocol && (
                    <span className="text-[8px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700/60 truncate max-w-[170px]">
                      {gw.integrationProtocol.split('&')[0].trim()}
                    </span>
                  )}
                  {gw.settlementTime && (
                    <span className="text-[8px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0A4FD5] dark:text-blue-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{gw.settlementTime.split('/')[0].trim()}</span>
                    </span>
                  )}
                  {gw.qrSupport?.supported && (
                    <span className="text-[8px] font-extrabold bg-lime-400/20 text-lime-800 dark:text-lime-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <QrCode className="w-2.5 h-2.5" />
                      <span>QR Ready</span>
                    </span>
                  )}
                </div>

                {/* Direct simulated handshake ping button */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="truncate">
                    Supported: {gw.supportedCurrencies?.slice(0, 3).join(', ')}
                    {gw.supportedCurrencies && gw.supportedCurrencies.length > 3 ? '...' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleTestPing(gw.id, e)}
                    disabled={isPinging === gw.id}
                    className="hover:text-blue-500 dark:hover:text-blue-400 font-mono transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Radio className="w-2.5 h-2.5 text-blue-500" />
                    <span>
                      {isPinging === gw.id
                        ? 'Pinging...'
                        : ping !== undefined && ping !== null
                        ? `Live: ${ping}ms ✓`
                        : 'Ping API'}
                    </span>
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Selected Gateway Technical Integration Point Drawer */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
          className="w-full p-2.5 px-3 flex items-center justify-between text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
            <span>
              Integration Point Specs: <strong className="text-slate-900 dark:text-white">{selectedGateway.name}</strong>
            </span>
            {isCurrentGatewayNative ? (
              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                Direct Currency Match
              </span>
            ) : (
              <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded">
                Multi-Currency Auto-Settled
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span>{showTechnicalSpecs ? 'Hide Specs' : 'View Protocol Specs'}</span>
            {showTechnicalSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showTechnicalSpecs && (
          <div className="p-3 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] space-y-2 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Integration Protocol:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px] block truncate">
                  {selectedGateway.integrationProtocol || 'RESTful API / Webhook v2'}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Settlement SLA:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px] block">
                  {selectedGateway.settlementTime || 'Instant T+0'}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Webhook Verification:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[10px] block truncate">
                  HMAC-SHA256 Signed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>
                Licensed in: <strong className="text-slate-700 dark:text-slate-300">{selectedGateway.countries.join(', ')}</strong>
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                Endpoint: https://api.msmebooks.com/v1/gateways/{selectedGateway.id}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Payment Method Mode Selection (Scan to Pay QR vs Direct Fields) */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onPaymentModeChange('qr')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            paymentMode === 'qr'
              ? 'bg-[#0A4FD5] text-white border-[#0A4FD5] shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan to Pay QR Code</span>
          <span className="text-[9px] bg-lime-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
            RECOMMENDED
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPaymentModeChange('standard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            paymentMode === 'standard'
              ? 'bg-[#0A4FD5] text-white border-[#0A4FD5] shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Direct Card / Account / STK</span>
        </button>
      </div>

      {/* 7. Active Mode Display */}
      {paymentMode === 'qr' ? (
        <ScanToPayQrCode
          gateway={selectedGateway}
          amountFormatted={format(totalPayableNgn)}
          amountNumeric={totalPayableNgn}
          currency={currency}
          customer={customer}
          onPaymentVerified={onPaymentVerified}
          isProcessing={isProcessing}
        />
      ) : (
        /* Direct Input Fields */
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200/70 dark:border-blue-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5 text-[#0A4FD5] dark:text-blue-400">
              {selectedGateway.fields.type === 'phone_stk' ? (
                <Smartphone className="w-4 h-4" />
              ) : selectedGateway.fields.type === 'instant_eft' ? (
                <Landmark className="w-4 h-4" />
              ) : selectedGateway.fields.type === 'wallet' ? (
                <Wallet className="w-4 h-4" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>{selectedGateway.name} Direct Input:</span>
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Direct Gateway Node</span>
            </span>
          </div>

          {selectedGateway.fields.type === 'phone_stk' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {selectedGateway.fields.label}:
              </label>
              <input
                type="tel"
                value={mobileMoneyPhone}
                onChange={(e) => setMobileMoneyPhone(e.target.value)}
                placeholder={selectedGateway.fields.placeholder}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                An instant STK Push or mobile money debit prompt will be dispatched to this mobile subscriber.
              </p>
            </div>
          ) : selectedGateway.fields.type === 'instant_eft' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Select Clearing Bank:
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none cursor-pointer"
              >
                <option value="Capitec Bank">Capitec Bank (Capitec Pay)</option>
                <option value="FNB (First National Bank)">FNB Instant Clearing</option>
                <option value="Standard Bank">Standard Bank South Africa</option>
                <option value="Nedbank">Nedbank Instant EFT</option>
                <option value="Absa Bank">Absa Bank</option>
                <option value="TymeBank">TymeBank Instant</option>
                <option value="Investec">Investec Private Bank</option>
                <option value="Wema Bank / Moniepoint">Wema Bank / Moniepoint</option>
              </select>
            </div>
          ) : selectedGateway.fields.type === 'virtual_account' ? (
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-[#0A4FD5] dark:text-blue-300 flex items-center justify-between">
                <span>Dedicated Dynamic Corporate Virtual Account:</span>
                <span className="text-[9px] bg-blue-200/60 dark:bg-blue-900 px-1.5 py-0.2 rounded font-mono">
                  Auto-Reconciled
                </span>
              </div>
              <div className="font-mono text-base font-black text-slate-900 dark:text-white tracking-wider">
                WEMA / MONIEPOINT / TRANSACTPAY: 0284918402
              </div>
              <div className="text-[10px] text-slate-500">
                Beneficiary Name: <strong>MsmeBooks Ltd / {customer.businessName || 'Merchant Checkout'}</strong>
              </div>
            </div>
          ) : selectedGateway.fields.type === 'wallet' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {selectedGateway.fields.label}:
              </label>
              <input
                type="text"
                value={mobileMoneyPhone}
                onChange={(e) => setMobileMoneyPhone(e.target.value)}
                placeholder={selectedGateway.fields.placeholder}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Instant wallet verification across {selectedGateway.name} secure network.
              </p>
            </div>
          ) : selectedGateway.fields.type === 'bnpl' ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
                  4 Interest-Free Installments of {format(totalPayableNgn / 4)}
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  0% APR
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                First installment of {format(totalPayableNgn / 4)} due today. Remaining 3 payments every 2 weeks. Instant software access granted immediately.
              </p>
            </div>
          ) : (
            /* Card Fields */
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Card Number:
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Expiry Date:
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    CVV / CVC:
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#0A4FD5] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
            {selectedGateway.fields.helperText}
          </p>
        </div>
      )}

    </div>
  );
};
