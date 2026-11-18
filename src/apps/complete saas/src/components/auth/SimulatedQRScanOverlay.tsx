import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Camera,
  Flashlight,
  FlashlightOff,
  X,
  ShieldCheck,
  Check,
  Fingerprint,
  ScanFace,
  RefreshCw,
  Laptop,
  Globe,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  Wifi,
  Battery,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

export interface SimulatedAccount {
  email: string;
  role: UserRole;
  name: string;
  roleTitle: string;
  device: string;
  location: string;
}

interface SimulatedQRScanOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  accounts: SimulatedAccount[];
  selectedAccount: SimulatedAccount;
  onSelectAccount: (acc: SimulatedAccount) => void;
  onCompleteAuth: (account: SimulatedAccount) => void;
  qrDataUrl?: string;
}

type ScanStage = 'aiming' | 'detected' | 'authorizing' | 'approved';

export const SimulatedQRScanOverlay: React.FC<SimulatedQRScanOverlayProps> = ({
  isOpen,
  onClose,
  sessionId,
  accounts,
  selectedAccount,
  onSelectAccount,
  onCompleteAuth,
  qrDataUrl,
}) => {
  const [stage, setStage] = useState<ScanStage>('aiming');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [activeAccount, setActiveAccount] = useState<SimulatedAccount>(selectedAccount);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint'>('face');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStage('aiming');
      setActiveAccount(selectedAccount);
    }
  }, [isOpen, selectedAccount]);

  if (!isOpen) return null;

  // Auto detect after 1.2s if in 'aiming' stage
  const handleDetectCode = () => {
    setStage('detected');
  };

  const handleApprove = () => {
    setStage('authorizing');
    setTimeout(() => {
      setStage('approved');
      setTimeout(() => {
        onCompleteAuth(activeAccount);
      }, 900);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Container simulating realistic mobile device viewport */}
      <div className="relative w-full max-w-[360px] h-[670px] max-h-[92vh] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col justify-between overflow-hidden text-white font-sans ring-1 ring-white/10">
        {/* Dynamic Island / Hardware Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500/80" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Top Status Bar: 9:41, Cellular, WiFi, Battery */}
        <div className="relative z-30 flex items-center justify-between px-4 pt-1 text-[11px] font-semibold text-slate-300">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-bold tracking-tighter">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Mobile App Navigation Header */}
        <div className="relative z-30 flex items-center justify-between px-2 pt-2 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#0F4C81] flex items-center justify-center text-white font-black text-[10px]">
              MB
            </div>
            <div className="text-left">
              <div className="text-[11px] font-extrabold tracking-tight text-white leading-none">
                MsmeBooks Mobile
              </div>
              <div className="text-[9px] text-[#84CC16] font-medium leading-tight">
                QR Authenticator
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Flashlight Toggle */}
            <button
              type="button"
              onClick={() => setFlashlightOn(!flashlightOn)}
              title={flashlightOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                flashlightOn ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {flashlightOn ? <Flashlight className="w-3.5 h-3.5" /> : <FlashlightOff className="w-3.5 h-3.5" />}
            </button>

            {/* Close Overlay */}
            <button
              type="button"
              onClick={onClose}
              title="Close Mobile Simulator"
              className="p-1.5 rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Arena */}
        <div className="relative flex-1 my-1.5 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center select-none">
          {/* Simulated ambient lighting flash */}
          {flashlightOn && (
            <div className="absolute inset-0 bg-radial from-amber-200/25 via-amber-100/10 to-transparent pointer-events-none z-10 transition-opacity" />
          )}

          {/* Background Viewfinder Camera Preview Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-95">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Simulated Desktop Computer Screen in Viewfinder */}
          <div className="relative z-10 flex flex-col items-center justify-center p-3">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl bg-slate-800/90 border-2 border-slate-700 p-2 shadow-inner flex flex-col items-center justify-center">
              {/* Corner Reticle Brackets (High-Tech Viewfinder HUD) */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-[#84CC16] rounded-tl-md" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-[#84CC16] rounded-tr-md" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-[#84CC16] rounded-bl-md" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-[#84CC16] rounded-br-md" />

              {/* Laser Scanning Animation Beam */}
              {stage === 'aiming' && (
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#84CC16] to-transparent shadow-[0_0_12px_#84CC16] pointer-events-none animate-scan-beam z-20" />
              )}

              {/* Render Desktop's QR Code inside Viewfinder */}
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Desktop QR Code"
                  className={`w-36 h-36 object-contain rounded-lg transition-all duration-300 ${
                    stage !== 'aiming' ? 'brightness-110 contrast-125' : 'opacity-90'
                  }`}
                />
              ) : (
                <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center text-slate-900 font-mono text-xs">
                  {sessionId}
                </div>
              )}

              {/* Target Locked Banner */}
              {stage !== 'aiming' && (
                <div className="absolute -bottom-3 inset-x-4 py-1 px-2 rounded-full bg-[#84CC16] text-[#072644] text-[10px] font-black tracking-wider uppercase text-center shadow-md animate-in zoom-in-75 duration-200 z-30">
                  Target Matched: {sessionId.substring(0, 15)}...
                </div>
              )}
            </div>
          </div>

          {/* Quick Trigger Button if aiming */}
          {stage === 'aiming' && (
            <div className="relative z-20 mt-2">
              <button
                type="button"
                onClick={handleDetectCode}
                className="py-1.5 px-3 rounded-full bg-[#84CC16] hover:bg-[#65A30D] text-[#072644] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Lock on QR Code</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Slide-Up Authentication Sheet */}
        <div className="relative z-30 bg-slate-900/95 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2.5">
          {stage === 'aiming' && (
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                Point Phone at Desktop QR Code
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Position the visual matrix inside the HUD viewfinder to authenticate securely.
              </p>
            </div>
          )}

          {stage === 'detected' && (
            <div className="space-y-2.5 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#84CC16] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Desktop Auth Request
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {sessionId.substring(0, 14)}
                </span>
              </div>

              {/* Device and Location Metadata */}
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[10px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#84CC16]" />
                  <div className="text-left">
                    <div className="font-bold text-white">Desktop Workstation</div>
                    <div className="text-slate-400 text-[9px]">Chrome 128 • macOS Sonoma</div>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-400">
                  <div className="flex items-center gap-0.5 justify-end">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>Lagos, Nigeria</span>
                  </div>
                  <div>Just now</div>
                </div>
              </div>

              {/* Demo Account Switcher on Phone */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400">
                  Authenticate as:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {accounts.map((acc) => {
                    const isSelected = activeAccount.email === acc.email;
                    return (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => {
                          setActiveAccount(acc);
                          onSelectAccount(acc);
                        }}
                        className={`text-left p-1.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#84CC16] bg-[#84CC16]/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="truncate text-white font-semibold">{acc.name}</div>
                        <div className="text-[9px] text-[#84CC16] truncate">{acc.roleTitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#072644] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                >
                  {biometricType === 'face' ? (
                    <ScanFace className="w-4 h-4" />
                  ) : (
                    <Fingerprint className="w-4 h-4" />
                  )}
                  <span>Approve & Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStage('aiming')}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Deny
                </button>
              </div>
            </div>
          )}

          {stage === 'authorizing' && (
            <div className="py-2 text-center space-y-2 animate-in fade-in duration-200">
              <div className="relative mx-auto w-12 h-12 rounded-full bg-[#84CC16]/20 flex items-center justify-center text-[#84CC16]">
                <div className="absolute inset-0 rounded-full border border-[#84CC16] animate-ping opacity-75" />
                <Fingerprint className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Verifying Biometrics...</p>
                <p className="text-[10px] text-slate-400">
                  Checking hardware enclave token for {activeAccount.name}
                </p>
              </div>
            </div>
          )}

          {stage === 'approved' && (
            <div className="py-2 text-center space-y-1.5 animate-in zoom-in-95 duration-200">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#84CC16] text-[#072644] flex items-center justify-center shadow-lg animate-success-pop">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <p className="text-xs font-black text-white">Sign-In Approved!</p>
              <p className="text-[10px] text-[#84CC16] font-medium">
                Transferred authentication token to desktop browser...
              </p>
            </div>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto my-1 pointer-events-none" />
      </div>
    </div>
  );
};
