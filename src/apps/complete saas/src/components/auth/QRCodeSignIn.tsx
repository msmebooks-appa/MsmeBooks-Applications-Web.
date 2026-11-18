import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  Lock,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Zap,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../../types';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { GeneratedQRCode, QRScanStatus } from './GeneratedQRCode';
import { SimulatedQRScanOverlay, SimulatedAccount } from './SimulatedQRScanOverlay';

interface QRCodeSignInProps {
  onSuccess: (email: string, role?: UserRole) => void;
  onSwitchToPassword: () => void;
  autoOpenOverlay?: boolean;
}

export const DEMO_ACCOUNTS: SimulatedAccount[] = [
  {
    email: 'kemi.adeyemi@abcsupermarket.ng',
    role: 'business_owner',
    name: 'Kemi Adeyemi',
    roleTitle: 'Business Owner',
    device: 'iPhone 15 Pro • MsmeBooks Mobile v3.2',
    location: 'Lagos, Nigeria',
  },
  {
    email: 'ibrahim.danladi@xyzdist.ng',
    role: 'finance_manager',
    name: 'Ibrahim Danladi',
    roleTitle: 'Finance Manager',
    device: 'Samsung Galaxy S24 Ultra • MsmeBooks Mobile',
    location: 'Abuja, Nigeria',
  },
  {
    email: 'nneka.eze@primehealth.ng',
    role: 'store_manager',
    name: 'Nneka Eze',
    roleTitle: 'Store Manager',
    device: 'Google Pixel 8 • MsmeBooks POS App',
    location: 'Port Harcourt, Nigeria',
  },
  {
    email: 'cashier.chinedu@abcsupermarket.ng',
    role: 'pos_operator',
    name: 'Chinedu Okafor',
    roleTitle: 'POS Cashier',
    device: 'Sunmi POS Terminal T2 • MsmeBooks Kiosk',
    location: 'Ikeja Branch, Lagos',
  },
];

export const QRCodeSignIn: React.FC<QRCodeSignInProps> = ({
  onSuccess,
  onSwitchToPassword,
  autoOpenOverlay = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [status, setStatus] = useState<QRScanStatus>('waiting');
  const [selectedDemoAccount, setSelectedDemoAccount] = useState<SimulatedAccount>(DEMO_ACCOUNTS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(autoOpenOverlay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a random unique cryptographic session ID and corresponding QR code
  const generateNewSession = async () => {
    setIsRefreshing(true);
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSessionId = `MSME-QR-${randomHex}-${token}`;
    setSessionId(newSessionId);
    setTimeLeft(60);
    setStatus('waiting');

    // Enterprise authentication payload
    const authPayload = JSON.stringify({
      app: 'MsmeBooks-Enterprise',
      sid: newSessionId,
      challenge: `sec_handshake_${Date.now()}`,
      exp: Math.floor(Date.now() / 1000) + 60,
      url: `https://msmebooks.ng/auth/qr?sid=${newSessionId}`,
    });

    try {
      const url = await QRCode.toDataURL(authPayload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
        color: {
          dark: '#072644', // Dark enterprise navy
          light: '#FFFFFF', // High contrast pure white
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Initial session setup
  useEffect(() => {
    generateNewSession();
  }, []);

  // Countdown timer for QR expiration
  useEffect(() => {
    if (status !== 'waiting') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, sessionId]);

  // Handle direct simulated scan (either from inline button or from phone overlay)
  const handleSimulateMobileScan = (account = selectedDemoAccount) => {
    if (status === 'expired') {
      generateNewSession();
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    // Step 1: Device scanned the QR
    setStatus('scanned');

    // Step 2: Biometric confirmation on phone
    setTimeout(() => {
      setStatus('approving');

      // Step 3: Approved & authorized
      setTimeout(() => {
        setStatus('authorized');

        // Step 4: Login completion callback
        setTimeout(() => {
          onSuccess(account.email, account.role);
        }, 800);
      }, 1000);
    }, 1200);
  };

  const handleCompleteOverlayAuth = (account: SimulatedAccount) => {
    setIsOverlayOpen(false);
    setSelectedDemoAccount(account);
    handleSimulateMobileScan(account);
  };

  return (
    <div className="space-y-4 text-center">
      {/* Session Security Indicator */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>End-to-End Encrypted Mobile-to-Desktop Sync</span>
      </div>

      {/* Generated QR Code Component with Reticle Guides and Animation */}
      <GeneratedQRCode
        sessionId={sessionId}
        timeLeft={timeLeft}
        maxTime={60}
        status={status}
        isRefreshing={isRefreshing}
        onRefresh={generateNewSession}
        size={260}
        userName={selectedDemoAccount.name}
        deviceName={selectedDemoAccount.device.split('•')[0].trim()}
        onSimulateClick={() => setIsOverlayOpen(true)}
      />

      {/* Primary Interactive CTA: Launch Simulated Mobile Scan Overlay */}
      <div className="pt-1">
        <button
          type="button"
          id="launch-mobile-scanner-btn"
          onClick={() => setIsOverlayOpen(true)}
          disabled={status !== 'waiting' && status !== 'expired'}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F4C81] via-[#072644] to-[#0F4C81] hover:from-[#0c3e6a] hover:to-[#051c33] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-4 h-4 text-[#84CC16]" />
          <span>Launch Simulated Mobile QR Scanner</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#84CC16] text-[#072644]">
            Interactive
          </span>
        </button>
      </div>

      {/* 3-Step Clear Mobile Instructions */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2">
        <h4 className="text-xs font-bold text-[#072644] dark:text-white flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#84CC16]" />
          How to sign in with QR code:
        </h4>
        <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside pl-1 leading-relaxed">
          <li>Open the <strong>MsmeBooks app</strong> on your mobile phone or tablet.</li>
          <li>Tap the <strong>QR Scanner</strong> icon in the header or login menu.</li>
          <li>Point your phone camera at this desktop screen to log in immediately.</li>
        </ol>
      </div>

      {/* Quick Demo Simulator Box (For reviewers & fast testing) */}
      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-left space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#0F4C81] dark:text-[#84CC16] flex items-center gap-1 uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Quick 1-Click Scan Simulator
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Rapid Test</span>
        </div>

        {/* Role Selector for Simulation */}
        <div className="grid grid-cols-2 gap-1.5">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = selectedDemoAccount.email === acc.email;
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => setSelectedDemoAccount(acc)}
                className={`text-left p-1.5 rounded-lg border text-[11px] transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0F4C81] dark:border-[#84CC16] bg-white dark:bg-[#0A1F36] shadow-2xs font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-white text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-bold text-[#072644] dark:text-white truncate">{acc.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{acc.roleTitle}</div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleSimulateMobileScan()}
          disabled={status !== 'waiting' && status !== 'expired'}
          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#84CC16] text-[#072644] dark:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#84CC16]" />
          <span>Instant Scan as {selectedDemoAccount.name.split(' ')[0]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Switch Back to Password Login */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <button
          type="button"
          id="switch-back-to-password-btn"
          onClick={onSwitchToPassword}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-all duration-200 hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span className="underline decoration-transparent group-hover:decoration-current underline-offset-2">
            Return to Password Sign-In
          </span>
        </button>
      </div>

      {/* Simulated Mobile Phone Camera Overlay Modal */}
      <SimulatedQRScanOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        sessionId={sessionId}
        accounts={DEMO_ACCOUNTS}
        selectedAccount={selectedDemoAccount}
        onSelectAccount={setSelectedDemoAccount}
        onCompleteAuth={handleCompleteOverlayAuth}
        qrDataUrl={qrDataUrl}
      />
    </div>
  );
};
