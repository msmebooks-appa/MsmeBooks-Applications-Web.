import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, Clock, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export type QRScanStatus = 'waiting' | 'scanned' | 'approving' | 'authorized' | 'expired';

export interface GeneratedQRCodeProps {
  sessionId: string;
  payloadUrl?: string;
  timeLeft: number;
  maxTime?: number;
  status: QRScanStatus;
  isRefreshing?: boolean;
  onRefresh: () => void;
  size?: number;
  userName?: string;
  deviceName?: string;
  onSimulateClick?: () => void;
}

export const GeneratedQRCode: React.FC<GeneratedQRCodeProps> = ({
  sessionId,
  payloadUrl,
  timeLeft,
  maxTime = 60,
  status,
  isRefreshing = false,
  onRefresh,
  size = 260,
  userName = 'Authorized User',
  deviceName = 'Mobile Device',
  onSimulateClick,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Generate QR code data URL whenever sessionId or payloadUrl changes
  useEffect(() => {
    let isMounted = true;

    const generateCode = async () => {
      try {
        setGenerationError(null);
        const contentToEncode =
          payloadUrl ||
          JSON.stringify({
            app: 'MsmeBooks-Enterprise',
            sid: sessionId,
            ts: Date.now(),
            exp: Math.floor(Date.now() / 1000) + timeLeft,
            authEndpoint: `https://msmebooks.ng/auth/qr?sid=${sessionId}`,
          });

        const url = await QRCode.toDataURL(contentToEncode, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: size,
          color: {
            dark: '#072644', // Dark enterprise navy
            light: '#FFFFFF',
          },
        });

        if (isMounted) {
          setDataUrl(url);
        }
      } catch (err) {
        console.error('Error generating QR Code:', err);
        if (isMounted) {
          setGenerationError('Failed to generate secure QR pattern.');
        }
      }
    };

    generateCode();

    return () => {
      isMounted = false;
    };
  }, [sessionId, payloadUrl, size, timeLeft]);

  // Expiration calculation for radial indicator
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const circumference = 2 * Math.PI * 7;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="flex flex-col items-center">
      {/* Container Card with Reticles and Scan Overlays */}
      <div
        onClick={status === 'waiting' && onSimulateClick ? onSimulateClick : undefined}
        title={status === 'waiting' && onSimulateClick ? 'Click to open simulated mobile scanner' : undefined}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`relative rounded-2xl bg-white p-3 shadow-md border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 select-none ${
          status === 'waiting' && onSimulateClick
            ? 'cursor-pointer hover:border-[#0F4C81] dark:hover:border-[#84CC16] hover:shadow-lg'
            : ''
        }`}
      >
        {/* Holographic Reticle Corner Guides */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0F4C81] dark:border-[#84CC16] rounded-tl-sm pointer-events-none transition-colors" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0F4C81] dark:border-[#84CC16] rounded-tr-sm pointer-events-none transition-colors" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0F4C81] dark:border-[#84CC16] rounded-bl-sm pointer-events-none transition-colors" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0F4C81] dark:border-[#84CC16] rounded-br-sm pointer-events-none transition-colors" />

        {/* Laser Scanning Animation Beam (Active while waiting for scan) */}
        {status === 'waiting' && !isRefreshing && (
          <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-[#84CC16] to-transparent shadow-[0_0_12px_#84CC16] z-20 pointer-events-none animate-scan-beam" />
        )}

        {/* QR Code Matrix with Center Brand Badge */}
        {dataUrl && status !== 'expired' && !generationError && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={dataUrl}
              alt="Secure QR code for authentication"
              className={`w-full h-full object-contain rounded-lg transition-all duration-300 ${
                status === 'scanned' || status === 'approving'
                  ? 'blur-[2px] scale-95 opacity-50'
                  : ''
              }`}
            />

            {/* Central Security Emblem */}
            <div className="absolute inset-auto w-10 h-10 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center p-1 z-10 pointer-events-none">
              <div className="w-full h-full rounded-lg bg-[#072644] flex items-center justify-center text-white font-black text-xs tracking-tighter">
                <span className="text-[#84CC16]">M</span>B
              </div>
            </div>
          </div>
        )}

        {generationError && (
          <div className="text-center p-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-1 text-red-500" />
            <p className="text-xs font-semibold">{generationError}</p>
          </div>
        )}

        {/* Overlay: Scanned / Device Connected */}
        {status === 'scanned' && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0A1F36]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#84CC16] flex items-center justify-center mb-2 animate-bounce">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-extrabold text-[#072644] dark:text-white">Device Connected!</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Paired with {deviceName}
            </p>
          </div>
        )}

        {/* Overlay: Approving / Biometric Processing */}
        {status === 'approving' && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0A1F36]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center mb-2 animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-xs font-extrabold text-[#072644] dark:text-white">Verifying Authorization</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Biometric token confirmed on mobile device...
            </p>
          </div>
        )}

        {/* Overlay: Authorized / Success */}
        {status === 'authorized' && (
          <div className="absolute inset-0 bg-white dark:bg-[#0A1F36] flex flex-col items-center justify-center p-4 text-center z-30 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#84CC16] text-[#072644] flex items-center justify-center mb-2 shadow-lg animate-in zoom-in-50 duration-300">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <p className="text-sm font-extrabold text-[#072644] dark:text-white">Login Confirmed!</p>
            <p className="text-[11px] text-[#65A30D] dark:text-[#84CC16] font-semibold mt-0.5">
              Signing in as {userName}...
            </p>
          </div>
        )}

        {/* Overlay: Expired Code */}
        {status === 'expired' && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0A1F36]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#072644] dark:text-white">QR Code Expired</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-3">
              Codes expire every {maxTime}s for enterprise protection.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#0F4C81] text-white hover:bg-[#072644] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Code</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub-bar with Session ID and Expiration Dial */}
      <div
        style={{ width: `${size}px` }}
        className="flex items-center justify-between text-xs px-1 mt-2 text-slate-500 dark:text-slate-400"
      >
        <span className="font-mono text-[10px] tracking-wider text-slate-400 dark:text-slate-500">
          {sessionId || 'INITIALIZING'}
        </span>

        {status === 'waiting' && (
          <div className="flex items-center gap-1.5 font-medium">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  className="stroke-slate-200 dark:stroke-slate-700 fill-none stroke-[2]"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  className="stroke-[#84CC16] fill-none stroke-[2] transition-all duration-1000"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
            </div>
            <span className={timeLeft < 15 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
              {timeLeft}s
            </span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Generate new session QR code"
              className="p-1 hover:text-[#0F4C81] dark:hover:text-[#84CC16] rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
