import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Zap,
  Clock,
  Download,
} from 'lucide-react';
import { PaymentGatewayInfo, CustomerBillingDetails } from '../types/cart';
import { Currency } from '../types';

interface ScanToPayQrCodeProps {
  gateway: PaymentGatewayInfo;
  amountFormatted: string;
  amountNumeric: number;
  currency: Currency;
  customer: CustomerBillingDetails;
  onPaymentVerified: () => void;
  isProcessing?: boolean;
}

export const ScanToPayQrCode: React.FC<ScanToPayQrCodeProps> = ({
  gateway,
  amountFormatted,
  amountNumeric,
  currency,
  customer,
  onPaymentVerified,
  isProcessing = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14 mins 59 secs
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  // Generate deterministic reference based on customer and gateway
  const reference = `${gateway.id.toUpperCase()}-QR-${Math.abs(
    (customer.businessName + gateway.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 89 + 1042
  ).toString().slice(0, 8)}`;

  // QR Support details or fallbacks
  const qrDetails = gateway.qrSupport || {
    supported: true,
    standardName: `${gateway.name} Dynamic QR`,
    compatibleApps: ['Mobile Banking Apps', 'Commercial Fintech Wallets', 'QR Scanner'],
    brandColor: '#0A4FD5',
    instructions: 'Scan with your mobile banking or fintech wallet app to authorize instant payment.',
  };

  // Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopyReference = () => {
    navigator.clipboard?.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = async () => {
    setIsSimulatingScan(true);
    setSimulationStatus(`Connecting to ${gateway.name} Merchant QR Switch...`);
    await new Promise((r) => setTimeout(r, 700));

    setSimulationStatus(`Simulated Scan detected by customer mobile app...`);
    await new Promise((r) => setTimeout(r, 800));

    setSimulationStatus(`Debiting ${amountFormatted} via ${qrDetails.standardName}...`);
    await new Promise((r) => setTimeout(r, 900));

    setSimulationStatus(`Instant Settlement Verified! Reconciling order...`);
    await new Promise((r) => setTimeout(r, 600));

    setIsSimulatingScan(false);
    onPaymentVerified();
  };

  const handleRegenerate = () => {
    setSecondsRemaining(899);
    setSimulationStatus(null);
  };

  // Custom QR Matrix pattern representation (17x17 grid for realistic SVG QR rendering)
  // 1 = dark block, 0 = white block
  // Finder patterns at top-left, top-right, bottom-left
  const qrMatrix: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
  ];

  return (
    <div className="bg-white dark:bg-[#0A1628] rounded-2xl p-4 sm:p-5 border-2 border-blue-500/30 dark:border-blue-600/40 shadow-xl space-y-4">
      {/* Top Header with Gateway Branding & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
            style={{ backgroundColor: qrDetails.brandColor }}
          >
            {gateway.flag}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                {gateway.name} Scan to Pay
              </h4>
              <span className="text-[10px] bg-lime-100 dark:bg-lime-950/80 text-lime-900 dark:text-lime-300 font-extrabold px-2 py-0.5 rounded-full border border-lime-300 dark:border-lime-800">
                Live QR
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Standard: <strong className="text-slate-700 dark:text-slate-300">{qrDetails.standardName}</strong>
            </p>
          </div>
        </div>

        {/* Dynamic Validity Countdown */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Main QR Code & Amount Card */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/80 dark:bg-[#070F1B]/90 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        {/* The Graphic QR Code Container */}
        <div className="relative p-3 bg-white rounded-2xl shadow-md border-2 border-slate-200 dark:border-slate-700 shrink-0 group">
          {/* Pulsing Scanner Laser Bar Effect */}
          <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-bounce opacity-70 pointer-events-none" />

          {/* SVG QR Code */}
          <svg
            className="w-36 h-36 sm:w-40 sm:h-40"
            viewBox="0 0 17 17"
            shapeRendering="crispEdges"
          >
            {qrMatrix.map((row, rIdx) =>
              row.map((cell, cIdx) =>
                cell === 1 ? (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={cIdx}
                    y={rIdx}
                    width="1"
                    height="1"
                    fill={
                      // Accent the finder corners with brand color
                      (rIdx < 7 && cIdx < 7) ||
                      (rIdx < 7 && cIdx > 9) ||
                      (rIdx > 9 && cIdx < 7)
                        ? qrDetails.brandColor
                        : '#0B192C'
                    }
                  />
                ) : null
              )
            )}
          </svg>

          {/* Center Brand Monogram Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-black shadow-lg ring-2 ring-white"
              style={{ backgroundColor: qrDetails.brandColor }}
            >
              <QrCode className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Right Info: Amount, Ref & Instructions */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Total Payable Amount:
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {amountFormatted}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">QR Reference:</span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="text-[10px] font-bold text-[#0A4FD5] dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Ref'}</span>
              </button>
            </div>
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs truncate mt-0.5">
              {reference}
            </div>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {qrDetails.instructions}
          </p>
        </div>
      </div>

      {/* Compatible Mobile Banking & Fintech Apps */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
          <Smartphone className="w-3 h-3 text-[#0A4FD5]" />
          <span>Supported Mobile Scanner Apps:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {qrDetails.compatibleApps.map((app, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200/80 dark:border-slate-700/60"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
              <span>{app}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Status / Steps */}
      {isSimulatingScan && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-200">
          <RefreshCw className="w-4 h-4 text-[#0A4FD5] animate-spin shrink-0" />
          <div className="font-semibold">{simulationStatus}</div>
        </div>
      )}

      {/* Action Buttons: Simulate Scan / Manual Verification */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={handleSimulateScan}
          disabled={isSimulatingScan || isProcessing}
          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0A4FD5] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-300" />
          <span>Simulate Scan from Mobile App (Instant Test)</span>
        </button>

        <button
          type="button"
          onClick={onPaymentVerified}
          disabled={isSimulatingScan || isProcessing}
          className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Confirm payment if scanned on phone"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>I Have Paid</span>
        </button>
      </div>

      <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        <span>Central Bank Approved & Encrypted via {gateway.name} Switch</span>
        {secondsRemaining <= 0 && (
          <button
            type="button"
            onClick={handleRegenerate}
            className="text-blue-500 font-bold underline ml-1 cursor-pointer"
          >
            Regenerate QR
          </button>
        )}
      </div>
    </div>
  );
};
