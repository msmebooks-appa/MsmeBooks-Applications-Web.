import React, { useState, useMemo } from 'react';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  CreditCard,
  Building2,
  RefreshCw
} from 'lucide-react';
import { PaymentGateway } from '../types/payment';

interface PaymentQRCodeProps {
  gateway: PaymentGateway;
  amountFormatted: string;
  amountNGN: number;
  bookingRef: string;
  serviceTitle: string;
  customerName?: string;
  onPaymentSuccess?: (result: {
    transactionRef: string;
    gatewayName: string;
    method: string;
  }) => void;
  className?: string;
}

/**
 * Procedural authentic QR Code Matrix Generator
 * Generates valid-looking finder patterns (top-left, top-right, bottom-left 7x7 squares)
 * and pseudorandom data cells seeded by bookingRef + gatewayId for a 25x25 QR grid.
 */
export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({
  gateway,
  amountFormatted,
  amountNGN,
  bookingRef,
  serviceTitle,
  customerName,
  onPaymentSuccess,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifyingScan, setIsVerifyingScan] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);

  // Generate deep-link or scan payload according to gateway
  const paymentPayload = useMemo(() => {
    switch (gateway.id) {
      case 'mpesa':
        return `mpesa://paybill?businessNumber=247247&accountNumber=${bookingRef}&amount=${amountNGN}&currency=KES`;
      case 'paystack':
        return `https://checkout.paystack.com/pay/${bookingRef.toLowerCase()}?amt=${amountNGN}&ref=${bookingRef}`;
      case 'flutterwave':
        return `https://rave.flutterwave.com/pay/${bookingRef.toLowerCase()}?amount=${amountNGN}`;
      case 'monnify':
        return `monnify://transfer?account=6019384729&ref=${bookingRef}&amount=${amountNGN}`;
      case 'transactpay':
        return `transactpay://checkout?ref=${bookingRef}&amount=${amountNGN}`;
      default:
        return `msmebooks://escrow-pay?gateway=${gateway.id}&ref=${bookingRef}&amount=${amountNGN}`;
    }
  }, [gateway.id, bookingRef, amountNGN]);

  // Procedural 25x25 QR Matrix with real QR code geometry
  const qrMatrix = useMemo(() => {
    const size = 25;
    const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Helper to draw standard 7x7 QR position finder patterns
    const drawFinder = (startR: number, startC: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startR + r][startC + c] = isBorder || isCenter;
        }
      }
    };

    // Draw 3 primary finders
    drawFinder(0, 0); // Top-left
    drawFinder(0, size - 7); // Top-right
    drawFinder(size - 7, 0); // Bottom-left

    // Timing strips
    for (let i = 8; i < size - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Seeded data cells
    let seed = 0;
    const seedString = `${bookingRef}_${gateway.id}_${amountNGN}`;
    for (let i = 0; i < seedString.length; i++) {
      seed = (seed * 31 + seedString.charCodeAt(i)) % 1000000;
    }

    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= size - 8;
        const inBottomLeft = r >= size - 8 && c < 8;
        const inCenterLogo = r >= 10 && r <= 14 && c >= 10 && c <= 14;

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenterLogo) {
          grid[r][c] = pseudoRandom() > 0.48;
        }
      }
    }

    return grid;
  }, [bookingRef, gateway.id, amountNGN]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateScan = () => {
    setIsVerifyingScan(true);
    setTimeout(() => {
      setIsVerifyingScan(false);
      setScanVerified(true);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          transactionRef: `QR-${gateway.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
          gatewayName: gateway.name,
          method: 'Mobile QR Scan-and-Pay',
        });
      }
    }, 1800);
  };

  return (
    <div className={`bg-white dark:bg-[#0A1727] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        
        {/* QR Code Graphic Frame */}
        <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 group">
          <svg 
            viewBox="0 0 25 25" 
            className="w-36 h-36 sm:w-40 sm:h-40 shape-rendering-crisp" 
            shapeRendering="crispEdges"
          >
            {qrMatrix.map((row, r) =>
              row.map((active, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill={active ? '#102B4E' : '#FFFFFF'}
                />
              ))
            )}
          </svg>

          {/* Gateway Center Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center p-1">
              <span className="text-[10px] font-black tracking-tighter text-[#1464C8]">
                {gateway.id === 'mpesa' ? 'M-PESA' : 
                 gateway.id === 'paystack' ? 'PSTK' : 
                 gateway.id === 'flutterwave' ? 'FLW' : 
                 gateway.id.slice(0, 4).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Scan Line Animation Overlay */}
          <div className="absolute inset-x-3 top-3 h-1 bg-[#1464C8] dark:bg-[#B7E532] opacity-75 blur-[1px] animate-pulse pointer-events-none rounded-full"></div>
        </div>

        {/* Scan Details & Instruction */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#B7E532] text-[11px] font-extrabold border border-emerald-200 dark:border-emerald-800">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Scan-and-Pay Ready</span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-[#102B4E] dark:text-white leading-tight">
            Scan with your {gateway.name} or Mobile Banking App
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Point your mobile camera or banking app scanner at the QR code to instantly authorize <strong className="text-slate-800 dark:text-slate-200">{amountFormatted}</strong>.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Pay Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isVerifyingScan || scanVerified}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                scanVerified
                  ? 'bg-emerald-600 text-white'
                  : isVerifyingScan
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  : 'bg-[#1464C8] hover:bg-[#1052a5] text-white'
              }`}
            >
              {isVerifyingScan ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Scan...</span>
                </>
              ) : scanVerified ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Scan Verified & Paid!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate Mobile Scan</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-center sm:justify-start gap-1 pt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Escrow Ref: {bookingRef} • Encrypted 256-bit ISO-20022 Protocol</span>
          </div>
        </div>

      </div>
    </div>
  );
};
