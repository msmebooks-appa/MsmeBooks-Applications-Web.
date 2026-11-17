import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  ScanFace,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  UserProfileSettings,
  detectBiometricCapabilities,
  resolveEffectiveModality,
  verifyBiometricCredential,
} from '../utils/biometricAuth';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (updatedSettings: UserProfileSettings) => void;
  onFallbackStandard?: () => void;
  settings: UserProfileSettings;
  mode?: 'unlock-dashboard' | 'test-scan';
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  onFallbackStandard,
  settings,
  mode = 'unlock-dashboard',
}) => {
  const [phase, setPhase] = useState<'scanning' | 'verified' | 'error'>('scanning');
  const [effectiveModality, setEffectiveModality] = useState<'faceid' | 'fingerprint'>(
    resolveEffectiveModality(settings.biometricModality)
  );
  const [sensorLabel, setSensorLabel] = useState<string>('Biometric Sensor');
  const [methodBadge, setMethodBadge] = useState<string>('Hardware Passkey');

  const runVerification = useCallback(async () => {
    setPhase('scanning');
    try {
      const cap = await detectBiometricCapabilities();
      const modality = resolveEffectiveModality(settings.biometricModality, cap.recommendedModality);
      setEffectiveModality(modality);
      setSensorLabel(modality === 'faceid' ? 'Face ID Recognition' : 'Fingerprint Biometric Sensor');

      const [result] = await Promise.all([
        verifyBiometricCredential(settings),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);

      if (result.verified) {
        setMethodBadge(
          result.methodUsed === 'webauthn' ? 'WebAuthn Hardware Verified' : 'Biometric Passkey Verified'
        );
        setPhase('verified');
        setTimeout(() => {
          onVerified(result.settings);
        }, 550);
      } else {
        setPhase('error');
      }
    } catch {
      setPhase('error');
    }
  }, [settings, onVerified]);

  useEffect(() => {
    if (!isOpen) return;
    void runVerification();
  }, [isOpen, runVerification]);

  if (!isOpen) return null;

  const isFaceId = effectiveModality === 'faceid';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-auth-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B7E532]" />
            <div>
              <h3 id="biometric-auth-title" className="text-sm font-black tracking-tight">
                {mode === 'test-scan' ? 'Biometric Verification Test' : 'Biometric Quick Access'}
              </h3>
              <p className="text-[11px] text-slate-200">
                {mode === 'test-scan'
                  ? 'Confirming FaceID / Fingerprint sensor'
                  : 'Unlocking Customer Dashboard'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close biometric prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Body */}
        <div className="p-6 sm:p-7 text-center">
          {/* Animated Ring + Biometric Icon */}
          <div className="relative mx-auto w-28 h-28 flex items-center justify-center mb-5">
            {phase === 'scanning' && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-[#1464C8]/30 dark:border-[#B7E532]/30 animate-ping" />
                <span className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#1464C8] dark:border-[#B7E532] animate-spin [animation-duration:4s]" />
              </>
            )}

            <div
              className={`relative z-10 w-22 h-22 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                phase === 'verified'
                  ? 'bg-emerald-500 text-white scale-105 ring-4 ring-emerald-500/20'
                  : phase === 'error'
                  ? 'bg-rose-500/15 text-rose-500 border-2 border-rose-500/40'
                  : 'bg-blue-50 dark:bg-[#102B4E] text-[#1464C8] dark:text-[#B7E532] border-2 border-blue-200 dark:border-[#1464C8]/50'
              }`}
            >
              {phase === 'verified' ? (
                <CheckCircle2 className="w-11 h-11 animate-in zoom-in-75 duration-200" />
              ) : isFaceId ? (
                <ScanFace className="w-11 h-11" />
              ) : (
                <Fingerprint className="w-11 h-11" />
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-1.5 mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Lock className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
              <span>{phase === 'verified' ? methodBadge : sensorLabel}</span>
            </div>

            <h4 className="text-lg font-black text-[#102B4E] dark:text-white pt-1">
              {phase === 'scanning'
                ? isFaceId
                  ? 'Scanning Face ID...'
                  : 'Verifying Fingerprint...'
                : phase === 'verified'
                ? 'Identity Verified'
                : 'Verification Interrupted'}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {phase === 'scanning'
                ? `Authenticating ${settings.fullName} (${settings.businessName}) for instant access.`
                : phase === 'verified'
                ? mode === 'test-scan'
                  ? 'Biometric sensor is active and ready for fast Customer Dashboard access.'
                  : 'Access granted. Opening your Customer Dashboard...'
                : 'Could not complete biometric check. Try again or continue with standard access.'}
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col gap-2">
            {phase === 'error' && (
              <button
                type="button"
                onClick={() => void runVerification()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry {isFaceId ? 'Face ID' : 'Fingerprint'} Scan</span>
              </button>
            )}

            {mode === 'unlock-dashboard' && onFallbackStandard && phase !== 'verified' && (
              <button
                type="button"
                onClick={onFallbackStandard}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue with Standard Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
