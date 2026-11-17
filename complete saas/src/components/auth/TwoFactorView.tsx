import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  Mail,
  Smartphone,
  Key,
  Lock,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  ChevronRight,
  Grid3x3,
  QrCode,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { OTPInput } from '../common/OTPInput';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { SecurityNotice } from '../common/Alerts';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import { TwoFactorMethod } from '../../types';
import { PatternLock } from '../security/PatternLock';

interface TwoFactorViewProps {
  initialMethod?: TwoFactorMethod;
  userPhone?: string;
  userEmail?: string;
  onVerify: () => void;
  onBackToSignIn: () => void;
}

export const TwoFactorView: React.FC<TwoFactorViewProps> = ({
  initialMethod = 'sms',
  userPhone = '+234 803 ••• 4567',
  userEmail = 'john.adeyemi@abcsupermarket.ng',
  onVerify,
  onBackToSignIn,
}) => {
  const [method, setMethod] = useState<TwoFactorMethod>(initialMethod);
  const [otp, setOtp] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Authenticator & Mobile QR Code States
  const [totpQrDataUrl, setTotpQrDataUrl] = useState<string>('');
  const [mobileChallengeQrUrl, setMobileChallengeQrUrl] = useState<string>('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [showTotpQr, setShowTotpQr] = useState(true);
  const [mobileScanStatus, setMobileScanStatus] = useState<'waiting' | 'scanned' | 'approved'>('waiting');

  const TOTP_SECRET = 'JBSWY3DPEHPK3PXP';

  // Generate TOTP QR Code and Mobile 2FA Challenge QR Code
  useEffect(() => {
    // Standard TOTP URI compatible with Google Authenticator, Microsoft Authenticator, Authy
    const totpUri = `otpauth://totp/MsmeBooks:${encodeURIComponent(userEmail)}?secret=${TOTP_SECRET}&issuer=MsmeBooks`;
    QRCode.toDataURL(totpUri, {
      errorCorrectionLevel: 'M',
      margin: 1.5,
      width: 220,
      color: {
        dark: '#072644',
        light: '#FFFFFF',
      },
    }).then(setTotpQrDataUrl).catch(console.error);

    // Mobile Push/Scan 2FA Handshake QR
    const challengeUri = JSON.stringify({
      flow: '2fa-challenge',
      session: `2FA-${Date.now().toString(36).toUpperCase()}`,
      user: userEmail,
      exp: Math.floor(Date.now() / 1000) + 120,
    });
    QRCode.toDataURL(challengeUri, {
      errorCorrectionLevel: 'H',
      margin: 1.5,
      width: 240,
      color: {
        dark: '#072644',
        light: '#FFFFFF',
      },
    }).then(setMobileChallengeQrUrl).catch(console.error);
  }, [userEmail]);

  const handleVerify = (codeToVerify = otp) => {
    if (codeToVerify.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerify();
    }, 700);
  };

  const handleOTPChange = (val: string) => {
    setOtp(val);
    if (error) setError('');
    if (val.length === 6) {
      handleVerify(val);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(TOTP_SECRET);
    setIsCopiedKey(true);
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleAutofillDemoCode = () => {
    const demoCode = '482915';
    setOtp(demoCode);
    handleVerify(demoCode);
  };

  const handleSimulateMobile2FAScan = () => {
    setMobileScanStatus('scanned');
    setTimeout(() => {
      setMobileScanStatus('approved');
      setTimeout(() => {
        onVerify();
      }, 700);
    }, 1000);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setOtp('');
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const methodDetails: Record<
    TwoFactorMethod,
    { title: string; desc: string; icon: React.ReactNode }
  > = {
    sms: {
      title: 'SMS OTP',
      desc: `Sent to ${userPhone}`,
      icon: <Smartphone className="w-5 h-5 text-[#0F4C81]" />,
    },
    email: {
      title: 'Email OTP',
      desc: `Sent to ${userEmail}`,
      icon: <Mail className="w-5 h-5 text-[#0F4C81]" />,
    },
    authenticator: {
      title: 'Authenticator App',
      desc: 'Scan QR with Google Authenticator / Authy',
      icon: <ShieldCheck className="w-5 h-5 text-[#0F4C81]" />,
    },
    qr_code: {
      title: 'Mobile QR Scan',
      desc: 'Instant scan with linked MsmeBooks app',
      icon: <QrCode className="w-5 h-5 text-[#0F4C81]" />,
    },
    pattern: {
      title: 'Pattern Lock (Gesture)',
      desc: 'Connect 3x3 dots on touchscreen',
      icon: <Grid3x3 className="w-5 h-5 text-[#0F4C81]" />,
    },
    backup: {
      title: 'Backup Recovery Code',
      desc: 'Use one of your 8-digit emergency keys',
      icon: <Key className="w-5 h-5 text-[#0F4C81]" />,
    },
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center mx-auto mb-1">
          {method === 'pattern' ? (
            <Grid3x3 className="w-6 h-6 text-[#0F4C81]" />
          ) : method === 'qr_code' ? (
            <QrCode className="w-6 h-6 text-[#0F4C81]" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-[#0F4C81]" />
          )}
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Two-Step Verification
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {method === 'pattern'
            ? 'Draw your Android-style 3x3 gesture unlock pattern to verify this session.'
            : method === 'qr_code'
            ? 'Scan the verification challenge QR code with your linked mobile device.'
            : method === 'authenticator'
            ? 'Scan the QR code below using your authenticator app (Google Authenticator, Authy, Microsoft Authenticator) and enter the 6-digit TOTP.'
            : 'Protect your MsmeBooks account with an additional layer of security. Enter the 6-digit verification code sent to your registered device.'}
        </p>
      </div>

      {showMethodSelector ? (
        /* Alternative Methods Selector Modal View */
        <div className="space-y-4 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-[#072644] uppercase tracking-wider">
              Choose Verification Method
            </span>
            <button
              type="button"
              onClick={() => setShowMethodSelector(false)}
              className="text-xs text-[#0F4C81] hover:underline font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2">
            {(['authenticator', 'qr_code', 'sms', 'email', 'pattern', 'backup'] as TwoFactorMethod[]).map((m) => {
              const item = methodDetails[m];
              const isSelected = method === m;
              return (
                <div
                  key={m}
                  onClick={() => {
                    setMethod(m);
                    setShowMethodSelector(false);
                    setOtp('');
                    setError('');
                  }}
                  className={`
                    p-3.5 rounded-xl border-2 transition-all duration-200 ease-out flex items-center justify-between cursor-pointer
                    hover:-translate-y-0.5 hover:shadow-xs
                    ${
                      isSelected
                        ? 'border-[#84CC16] bg-[#84CC16]/5 ring-1 ring-[#84CC16]/30'
                        : 'border-slate-200 hover:border-[#0F4C81]/40 bg-white hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#072644]">{item.title}</h4>
                        {m === 'qr_code' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#0F4C81]/10 text-[#0F4C81]">
                            QR Code
                          </span>
                        )}
                        {m === 'pattern' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#84CC16]/20 text-[#65A30D]">
                            Mobile
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#84CC16] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main 2FA Entry */
        <div className="space-y-4">
          {/* Active Method Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {methodDetails[method].icon}
            <span>{methodDetails[method].title}: {methodDetails[method].desc}</span>
          </div>

          {/* 1. AUTHENTICATOR APP WITH DYNAMIC QR CODE */}
          {method === 'authenticator' && (
            <div className="space-y-3">
              {/* QR Code Container */}
              {showTotpQr && totpQrDataUrl && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center">
                  <div className="relative w-44 h-44 rounded-lg overflow-hidden border border-slate-100 p-1 bg-white">
                    <img
                      src={totpQrDataUrl}
                      alt="Scan TOTP QR Code with Authenticator App"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 text-[9px] text-white font-medium text-center backdrop-blur-xs">
                      Scan with Google Authenticator
                    </div>
                  </div>

                  {/* Manual Key Display & Copy */}
                  <div className="mt-2.5 flex items-center justify-between w-full max-w-[240px] px-2 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                    <div className="text-left font-mono text-slate-600 truncate mr-2">
                      {TOTP_SECRET}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="text-[#0F4C81] hover:text-[#072644] font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      {isCopiedKey ? (
                        <>
                          <Check className="w-3 h-3 text-[#65A30D]" />
                          <span className="text-[#65A30D]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 6-Digit OTP Entry */}
              <div>
                <label className="block text-xs font-bold text-slate-700 text-left mb-1.5">
                  Enter 6-Digit Code from App
                </label>
                <OTPInput
                  value={otp}
                  onChange={handleOTPChange}
                  disabled={isVerifying}
                  isError={Boolean(error)}
                />
                {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}
              </div>

              {/* Quick Demo Autofill Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowTotpQr((prev) => !prev)}
                  className="text-xs text-slate-500 hover:text-[#0F4C81] underline cursor-pointer"
                >
                  {showTotpQr ? 'Hide QR Code' : 'Show Setup QR Code'}
                </button>
                <button
                  type="button"
                  onClick={handleAutofillDemoCode}
                  className="text-xs font-semibold text-[#0F4C81] hover:text-[#072644] flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-current text-[#84CC16]" />
                  <span>Autofill Demo Code</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. DIRECT MOBILE QR SCAN CHALLENGE */}
          {method === 'qr_code' && (
            <div className="space-y-3 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-xl bg-white p-2 border-2 border-slate-200 shadow-sm flex items-center justify-center">
                {mobileChallengeQrUrl && (
                  <img
                    src={mobileChallengeQrUrl}
                    alt="2FA Mobile Challenge QR Code"
                    className={`w-full h-full object-contain ${
                      mobileScanStatus !== 'waiting' ? 'blur-xs opacity-50' : ''
                    }`}
                  />
                )}

                {/* Status Overlays */}
                {mobileScanStatus === 'scanned' && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                    <Smartphone className="w-8 h-8 text-[#0F4C81] animate-bounce mb-1" />
                    <span className="text-xs font-bold text-[#072644]">Device Connected</span>
                    <span className="text-[10px] text-slate-500">Awaiting biometrics...</span>
                  </div>
                )}

                {mobileScanStatus === 'approved' && (
                  <div className="absolute inset-0 bg-[#84CC16]/20 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                    <CheckCircle2 className="w-10 h-10 text-[#65A30D] mb-1" />
                    <span className="text-xs font-bold text-[#072644]">2FA Authorized!</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 max-w-xs text-center">
                Open MsmeBooks on your phone, tap QR Scan, and point camera at this code.
              </p>

              <button
                type="button"
                onClick={handleSimulateMobile2FAScan}
                disabled={mobileScanStatus !== 'waiting'}
                className="w-full max-w-xs py-2 px-3 rounded-xl bg-[#0F4C81] hover:bg-[#072644] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Simulate Scan & Authorize via Mobile</span>
              </button>
            </div>
          )}

          {/* 3. PATTERN LOCK 2FA */}
          {method === 'pattern' && (
            <div className="py-2 flex flex-col items-center">
              <PatternLock
                size={260}
                minNodes={4}
                mode="verify"
                targetPattern={[0, 1, 2, 4, 6]}
                onSuccess={() => {
                  setIsVerifying(true);
                  setTimeout(() => {
                    setIsVerifying(false);
                    onVerify();
                  }, 600);
                }}
                promptText="Draw 3x3 unlock pattern gesture"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Mobile & POS gesture verification • Demo pattern: top row across, center, bottom-left
              </p>
            </div>
          )}

          {/* 4. SMS / EMAIL / BACKUP OTP */}
          {method !== 'pattern' && method !== 'authenticator' && method !== 'qr_code' && (
            <div>
              <OTPInput
                value={otp}
                onChange={handleOTPChange}
                disabled={isVerifying}
                isError={Boolean(error)}
              />
              {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}
            </div>
          )}

          {/* Trust Device Option */}
          <div className="flex items-center justify-between text-xs text-left pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer accent-[#0F4C81]"
              />
              <span>Trust this device for 30 days</span>
            </label>
          </div>

          {/* Secondary Options */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            {method !== 'pattern' && method !== 'qr_code' ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-[#0F4C81] hover:text-[#0A365C] font-semibold flex items-center gap-1 disabled:text-slate-400 transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer disabled:hover:translate-x-0"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                Zero network lag
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowMethodSelector(true)}
              className="text-[#0F4C81] hover:text-[#0A365C] font-semibold underline underline-offset-2 hover:decoration-current transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer"
            >
              Use another method
            </button>
          </div>

          {/* Primary CTA (For OTP only; pattern and QR code verify automatically) */}
          {method !== 'pattern' && method !== 'qr_code' && (
            <div className="pt-2">
              <PrimaryButton
                onClick={() => handleVerify()}
                isLoading={isVerifying}
                disabled={otp.length !== 6}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Verify & Continue
              </PrimaryButton>
            </div>
          )}

          {/* Security Notice */}
          <div className="pt-1 text-center">
            <SecurityNotice
              text={
                method === 'pattern'
                  ? 'Keep your pattern gesture private from shoulder-surfers in retail areas.'
                  : method === 'qr_code'
                  ? 'Only scan QR codes generated by the verified MsmeBooks portal.'
                  : 'Never share your verification code with anyone.'
              }
            />
          </div>

          {/* Back to sign in */}
          <div className="pt-2 border-t border-slate-100 text-center text-xs">
            <button
              type="button"
              onClick={onBackToSignIn}
              className="group inline-flex items-center justify-center gap-1 text-slate-500 hover:text-[#0F4C81] dark:hover:text-[#9AE61C] font-medium transition-all duration-200 ease-out hover:-translate-x-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
              <span className="underline decoration-transparent hover:decoration-current underline-offset-2">
                Back to Sign In
              </span>
            </button>
          </div>
        </div>
      )}
    </AuthCard>
  );
};
