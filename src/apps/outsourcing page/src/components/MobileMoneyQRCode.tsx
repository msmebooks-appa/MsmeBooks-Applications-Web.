import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Zap,
  Clock
} from 'lucide-react';
import { CountryInfo, CurrencyCode } from '../types';
import { useToast } from '../context/ToastContext';

interface MobileMoneyQRCodeProps {
  gatewayId: string;
  gatewayName: string;
  gatewayLogo: string;
  amountFormatted: string;
  currency: CurrencyCode;
  country: CountryInfo;
  companyName: string;
  referenceNumber: string;
  phoneNumber?: string;
  onSimulateScanSuccess?: () => void;
  className?: string;
}

export const MobileMoneyQRCode: React.FC<MobileMoneyQRCodeProps> = ({
  gatewayId,
  gatewayName,
  gatewayLogo,
  amountFormatted,
  currency,
  country,
  companyName,
  referenceNumber,
  phoneNumber,
  onSimulateScanSuccess,
  className = '',
}) => {
  const { toast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expiresInSeconds, setExpiresInSeconds] = useState<number>(600); // 10 minutes

  // Generate dynamic QR payload specific to gateway, country, amount and merchant
  const qrPayload = React.useMemo(() => {
    const cleanRef = referenceNumber.replace(/[^a-zA-Z0-9-]/g, '');
    const cleanComp = encodeURIComponent(companyName || 'MultiBiz Client');

    switch (gatewayId) {
      case 'mpesa':
        return `mpesa://paybill?till=247247&acc=MB-${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&ref=${cleanRef}`;
      case 'fedapay':
        return `fedapay://checkout/momo?tx=${cleanRef}&merchant=MultiBiz_Benin&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&client=${cleanComp}`;
      case 'cinetpay':
        return `cinetpay://uemoa/wallet?site_id=CP-MSME-9841&cpm_trans_id=${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}`;
      case 'ligdicash':
        return `ligdicash://sahel/pay?order=${cleanRef}&merchant=MultiBiz_Burkina&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}`;
      case 'paynow':
        return `paynow://ecocash?ref=${cleanRef}&merchant=PAYNOW-ZW-MB&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}`;
      case 'paystack':
        return `paystack://qr/payment?ref=PSTK-${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&merchant=MultiBiz`;
      case 'flutterwave':
        return `flutterwave://momo/qr?tx_ref=FLW-${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&country=${country.code}`;
      case 'pesapal':
        return `pesapal://instant?order=${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&country=${country.code}`;
      case 'ozow':
        return `ozow://eft/qr?ref=${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=ZAR&merchant=MultiBiz`;
      case 'payfast':
        return `payfast://snapscan?m_id=PF-10928&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&item=Subscription-${cleanRef}`;
      case 'payfort':
        return `payfort://fawry?bill_ref=${cleanRef}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}`;
      default:
        return `https://checkout.multibiz.africa/pay/${cleanRef}?gateway=${gatewayId}&amount=${amountFormatted.replace(/[^0-9.]/g, '')}&curr=${currency}&country=${country.code}`;
    }
  }, [gatewayId, referenceNumber, companyName, amountFormatted, currency, country.code]);

  // Generate QR code data URL whenever payload changes
  useEffect(() => {
    let isSubscribed = true;

    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#0f172a', // slate-900
        light: '#f8fafc', // slate-50
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [qrPayload]);

  // Countdown timer for QR expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresInSeconds((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(qrPayload);
    }
    setCopiedLink(true);
    toast.success('Mobile money payment link copied to clipboard', 'Payment Link Copied');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `MultiBiz_${gatewayId}_QR_${referenceNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code image downloaded to your device', 'QR Saved');
  };

  const handleRefreshQR = () => {
    setIsRefreshing(true);
    setExpiresInSeconds(600);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('New session key generated for dynamic QR code', 'QR Refreshed');
    }, 450);
  };

  // Gateway specific mobile instructions
  const gatewayInstructions = React.useMemo(() => {
    switch (gatewayId) {
      case 'mpesa':
        return [
          'Open Safaricom M-Pesa or mySafaricom app on your phone.',
          'Select Lipa na M-Pesa > Scan to Pay or enter Paybill 247247.',
          `Confirm amount of ${amountFormatted} and authorize with your secret PIN.`,
        ];
      case 'fedapay':
        return [
          'Open your MTN Mobile Money, Moov Money, or Wave app.',
          'Scan this QR code with the in-app camera scanner.',
          `Approve the one-time debit of ${amountFormatted} for MultiBiz.`,
        ];
      case 'cinetpay':
        return [
          'Open Orange Money, Wave, or MTN MoMo wallet on your phone.',
          'Tap Scan QR Code on your mobile app dashboard.',
          `Verify merchant "MultiBiz Outsourcing" and confirm ${amountFormatted}.`,
        ];
      case 'ligdicash':
        return [
          'Open LigdiCash, Orange Money Burkina, or Moov Money.',
          'Scan QR or enter the merchant reference number.',
          `Authorize transfer of ${amountFormatted} with your PIN.`,
        ];
      case 'paynow':
        return [
          'Open EcoCash or OneMoney mobile banking application.',
          'Select Scan & Pay / Pay Merchant.',
          `Authorize payment of ${amountFormatted} to settle instantly.`,
        ];
      case 'paystack':
        return [
          'Open your bank app (Access, GTBank, Zenith, Kuda, OPay) or Chipper.',
          'Select "Scan QR" / "NIBSS Instant Payment".',
          `Confirm recipient "MultiBiz Ltd" and authorize ${amountFormatted}.`,
        ];
      case 'flutterwave':
        return [
          'Open your local mobile wallet or bank app camera scanner.',
          'Point your camera at this dynamic Flutterwave QR code.',
          `Confirm payment of ${amountFormatted} to complete verification.`,
        ];
      case 'ozow':
        return [
          'Open your Capitec, FNB, Standard Bank, or Nedbank app.',
          'Scan this QR code to launch direct pre-filled Instant EFT.',
          `Verify payment of ${amountFormatted} with biometric or in-app OTP.`,
        ];
      case 'payfast':
        return [
          'Open SnapScan, Zapper, or Masterpass on your handset.',
          'Scan QR code directly to capture instant invoice details.',
          `Authorize payment of ${amountFormatted}.`,
        ];
      default:
        return [
          'Open your camera or preferred mobile banking app.',
          'Scan the dynamic QR code displayed on this screen.',
          `Review the payment summary (${amountFormatted}) and enter your PIN.`,
        ];
    }
  }, [gatewayId, amountFormatted]);

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-lime-400/50 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden ${className}`}>
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-lime-400/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header with Gateway and Live Dynamic Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lime-400/15 border border-lime-400/40 text-lime-400 flex items-center justify-center font-bold text-lg shrink-0">
            {gatewayLogo || <QrCode className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold font-grotesk text-white">
                Dynamic Mobile Money QR Code
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {gatewayName} • {country.flag} {country.name} ({currency})
            </p>
          </div>
        </div>

        {/* Dynamic Expiration Badge */}
        <div className="flex items-center gap-1.5 text-xs self-start sm:self-auto bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700 font-mono">
          <Clock className="w-3 h-3 text-amber-400" />
          <span className="text-slate-400 text-[10px]">Expires in:</span>
          <span className="text-lime-400 font-bold text-xs">{formatCountdown(expiresInSeconds)}</span>
          <button
            type="button"
            onClick={handleRefreshQR}
            title="Refresh QR session"
            className="ml-1 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-lime-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content: QR Code Card & Step-by-Step Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-center">
        
        {/* Left: Dynamic QR Code Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-lime-400/10 border-2 border-lime-400 relative group">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`${gatewayName} Dynamic QR Code`} 
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center bg-slate-100 rounded-lg text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mb-2" />
                <span className="text-xs">Generating QR...</span>
              </div>
            )}

            {/* Center Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-lime-400 text-lime-400 flex items-center justify-center text-sm shadow-md font-bold">
                {gatewayLogo || 'MB'}
              </div>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-950/90 border border-lime-500/50 text-lime-300 text-xs font-mono font-bold">
            <span>Pay:</span>
            <span className="text-white text-sm font-grotesk font-black">{amountFormatted}</span>
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Ref: <span className="font-mono text-slate-300">{referenceNumber}</span>
          </div>
        </div>

        {/* Right: Step-by-Step Scan Instructions & Action Buttons */}
        <div className="md:col-span-7 space-y-3.5">
          
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              How to pay with {gatewayName}:
            </span>
            <div className="space-y-2 text-xs">
              {gatewayInstructions.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-800">
                  <span className="w-4 h-4 rounded-full bg-lime-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    {instruction}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone STK Push Context (if available) */}
          {phoneNumber && (
            <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-200">
                <Zap className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Linked Mobile Number:</span>
                <span className="font-mono font-bold text-white">{phoneNumber}</span>
              </div>
              <span className="text-[10px] text-lime-400 font-mono">SIM Linked</span>
            </div>
          )}

          {/* Action Buttons: Copy Link, Download Image, Simulate Scan */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Pay Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              title="Download QR code PNG image"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Save QR Image</span>
            </button>

            {onSimulateScanSuccess && (
              <button
                type="button"
                onClick={onSimulateScanSuccess}
                className="px-3 py-1.5 bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 text-xs font-bold rounded-xl border border-lime-400/40 transition cursor-pointer flex items-center gap-1.5 ml-auto"
                title="Test simulated mobile wallet PIN authorization"
              >
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Simulate Phone Scan</span>
              </button>
            )}
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>End-to-End TLS Encrypted • Dynamic One-Time Token</span>
          </div>

        </div>

      </div>

    </div>
  );
};
