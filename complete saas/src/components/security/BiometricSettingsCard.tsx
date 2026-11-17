import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  ScanFace,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Laptop,
  Lock,
  RefreshCw,
  AlertCircle,
  Key,
  Shield,
  Sliders,
  Check,
  Zap,
  CheckCheck,
  Volume2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BiometricMethod, BiometricPreferences } from '../../types';

interface BiometricSettingsCardProps {
  userName?: string;
  companyName?: string;
  onPreferencesChange?: (prefs: BiometricPreferences) => void;
}

const STORAGE_KEY = 'msmebooks_biometric_preferences';

const DEFAULT_PREFERENCES: BiometricPreferences = {
  enabled: true,
  preferredMethod: 'fingerprint',
  requireForHighValueTransactions: true,
  requireOnAppResume: false,
  allowPatternFallback: true,
  trustDevice30Days: true,
  sensorHaptic: true,
  registeredKeyId: 'FIDO2-SEC-KEY-9284-ENCLAVE',
  lastUpdated: '11 Oct 2026, 14:15',
  authenticatorName: 'Touch ID / Apple Secure Enclave',
};

export const BiometricSettingsCard: React.FC<BiometricSettingsCardProps> = ({
  userName = 'John',
  companyName = 'ABC Supermarket Ltd',
  onPreferencesChange,
}) => {
  const toast = useToast();

  // Load saved preferences from localStorage or default
  const [preferences, setPreferences] = useState<BiometricPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });

  // Simulation & Success Animation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<
    'idle' | 'prompting' | 'registering' | 'verifying' | 'success'
  >('idle');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successAnimationKey, setSuccessAnimationKey] = useState(0);
  const [isTestScannerOpen, setIsTestScannerOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync to localStorage
  const persistPreferences = (newPrefs: BiometricPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch {
      // LocalStorage write error ignored
    }
    setPreferences(newPrefs);
    onPreferencesChange?.(newPrefs);
  };

  // Trigger simulated biometric preference save with full success animation
  const handleSimulateSave = (
    overridePrefs?: Partial<BiometricPreferences>,
    successMessage = 'Hardware Registered'
  ) => {
    const updated = {
      ...preferences,
      ...overridePrefs,
      lastUpdated: new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setIsSimulating(true);
    setSimulationStep('prompting');

    // Step 1: Detect hardware sensor
    const timer1 = setTimeout(() => {
      setSimulationStep('registering');

      // Step 2: Register biometric hardware with secure enclave
      const timer2 = setTimeout(() => {
        setSimulationStep('verifying');

        // Step 3: Complete verification & Trigger Success Animation
        const timer3 = setTimeout(() => {
          persistPreferences(updated);
          setIsSimulating(false);
          setSimulationStep('success');
          setShowSuccessBanner(true);
          setSuccessAnimationKey((prev) => prev + 1);
          setHasUnsavedChanges(false);

          toast.success(
            successMessage,
            `Biometric hardware registered successfully! Hardware credentials (${updated.preferredMethod.toUpperCase()}) secured with device enclave.`
          );

          // Auto-fade banner after 6 seconds
          const dismissTimer = setTimeout(() => {
            setShowSuccessBanner(false);
            setSimulationStep('idle');
          }, 6000);

          return () => clearTimeout(dismissTimer);
        }, 600);

        return () => clearTimeout(timer3);
      }, 750);

      return () => clearTimeout(timer2);
    }, 500);

    return () => clearTimeout(timer1);
  };

  // Toggle Biometric Login
  const handleToggleBiometric = (enabled: boolean) => {
    if (enabled) {
      handleSimulateSave(
        { enabled: true },
        'Hardware Registered'
      );
    } else {
      const disabledPrefs = { ...preferences, enabled: false };
      persistPreferences(disabledPrefs);
      setShowSuccessBanner(false);
      setSimulationStep('idle');
      toast.info(
        'Biometric Login Disabled',
        'Standard password and 2FA credentials will be required for account entry.'
      );
    }
  };

  // Helper to update specific sub-preference
  const updatePreferenceField = <K extends keyof BiometricPreferences>(
    field: K,
    val: BiometricPreferences[K]
  ) => {
    setPreferences((prev) => {
      const updated = { ...prev, [field]: val };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div
      id="biometric-settings-section"
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        showSuccessBanner
          ? 'border-[#84CC16] bg-[#84CC16]/5 dark:bg-[#84CC16]/10 shadow-lg shadow-[#84CC16]/10 ring-1 ring-[#84CC16]/30'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#071626]/50'
      } space-y-4`}
    >
      {/* Header & Toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
              preferences.enabled
                ? 'bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}
          >
            {preferences.preferredMethod === 'face' ? (
              <ScanFace className="w-5 h-5" />
            ) : (
              <Fingerprint className="w-5 h-5" />
            )}

            {/* Subtle active status pulse dot */}
            {preferences.enabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#84CC16] rounded-full border-2 border-white dark:border-[#071626] animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="enable-biometric-login-toggle"
                className="text-sm font-extrabold text-[#072644] dark:text-white cursor-pointer select-none hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors"
              >
                Enable Biometric Login
              </label>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  preferences.enabled
                    ? 'bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {preferences.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign in instantly using Touch ID, Face ID, Windows Hello, or Android Biometrics (WebAuthn / FIDO2).
            </p>
          </div>
        </div>

        {/* The Primary Toggle */}
        <div className="flex flex-col items-end">
          <label
            htmlFor="enable-biometric-login-toggle"
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
              Enable Biometric Login
            </span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                id="enable-biometric-login-toggle"
                aria-label="Enable Biometric Login"
                checked={preferences.enabled}
                onChange={(e) => handleToggleBiometric(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C81]" />
            </div>
          </label>
          <span className="text-[10px] text-slate-400 mt-1 select-none font-medium">
            {preferences.enabled ? 'Hardware Active' : 'Off - Click to Register'}
          </span>
        </div>
      </div>

      {/* Confirmation Success Animation Showcase Banner */}
      {showSuccessBanner && (
        <div
          key={`success-banner-${successAnimationKey}`}
          className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-[#84CC16]/20 via-emerald-500/15 to-[#84CC16]/10 border border-[#84CC16]/50 text-slate-800 dark:text-slate-100 animate-success-pop shadow-md"
        >
          {/* Animated background aura */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#84CC16]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-start gap-3">
              {/* Animated Success Badge with Ripple Rings */}
              <div className="relative shrink-0 mt-0.5">
                <div className="absolute inset-0 rounded-full bg-[#84CC16]/40 animate-ripple-ring pointer-events-none" />
                <div className="w-9 h-9 rounded-full bg-[#84CC16] text-[#072644] flex items-center justify-center font-black shadow-md shadow-[#84CC16]/30">
                  <Check className="w-5 h-5 stroke-[3] animate-bounce" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-[#072644] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Biometric Hardware Registered Successfully!</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#84CC16] animate-spin" />
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cryptographic key pair{' '}
                  <span className="font-mono font-bold text-[#0F4C81] dark:text-[#84CC16]">
                    {preferences.registeredKeyId}
                  </span>{' '}
                  was registered and verified with the hardware enclave. Your biometric login for{' '}
                  <span className="font-bold">{userName}</span> is active and ready.
                </p>

                {/* Micro details pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/70 dark:bg-[#071626]/80 text-[#072644] dark:text-white font-semibold border border-[#84CC16]/30">
                    <CheckCircle2 className="w-3 h-3 text-[#65A30D] dark:text-[#84CC16]" />
                    Modality: {preferences.preferredMethod.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/70 dark:bg-[#071626]/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <ShieldCheck className="w-3 h-3 text-[#0F4C81] dark:text-[#9AE61C]" />
                    High-Value Challenge:{' '}
                    {preferences.requireForHighValueTransactions ? 'Active (>₦500k)' : 'Standard'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Updated: {preferences.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Dismiss banner button */}
            <button
              type="button"
              onClick={() => setShowSuccessBanner(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs font-bold cursor-pointer transition-colors"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Simulated Hardware Registration Animation Overlay */}
      {isSimulating && (
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/50 text-xs space-y-3.5 animate-in fade-in shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Radar scanner graphic with simulated scanning beam */}
              <div className="relative w-10 h-10 rounded-xl bg-[#0F4C81]/15 dark:bg-[#0F4C81]/30 flex items-center justify-center overflow-hidden border border-[#0F4C81]/30">
                <div className="absolute inset-1 rounded-lg bg-[#84CC16]/20 animate-bio-radar pointer-events-none" />
                <div className="absolute left-1 right-1 h-0.5 bg-[#84CC16] shadow-[0_0_6px_#84CC16] animate-scan-beam pointer-events-none" />
                {preferences.preferredMethod === 'face' ? (
                  <ScanFace className="w-5 h-5 text-[#0F4C81] dark:text-[#9AE61C] z-10" />
                ) : (
                  <Fingerprint className="w-5 h-5 text-[#0F4C81] dark:text-[#9AE61C] z-10" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#072644] dark:text-white">
                    {simulationStep === 'prompting' && 'Detecting Biometric Hardware Sensor...'}
                    {simulationStep === 'registering' && 'Registering Biometric Hardware with Device Enclave...'}
                    {simulationStep === 'verifying' && 'Finalizing Hardware Registration & P-256 Attestation...'}
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#84CC16] animate-ping" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Communicating with device security chip ({preferences.authenticatorName})...
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-[#0F4C81] dark:text-blue-300 font-bold uppercase tracking-wider shrink-0">
              REGISTERING HARDWARE
            </span>
          </div>

          {/* Registration Milestones Track */}
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                simulationStep === 'prompting' || simulationStep === 'registering' || simulationStep === 'verifying'
                  ? 'border-[#84CC16]/60 bg-[#84CC16]/10 text-[#072644] dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  simulationStep === 'prompting'
                    ? 'text-amber-500 animate-spin'
                    : 'text-[#65A30D] dark:text-[#84CC16]'
                }`}
              />
              <span>1. Sensor Detected</span>
            </div>

            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                simulationStep === 'registering' || simulationStep === 'verifying'
                  ? 'border-[#84CC16]/60 bg-[#84CC16]/10 text-[#072644] dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  simulationStep === 'registering'
                    ? 'text-amber-500 animate-spin'
                    : simulationStep === 'verifying'
                    ? 'text-[#65A30D] dark:text-[#84CC16]'
                    : 'text-slate-400'
                }`}
              />
              <span>2. Registering Enclave</span>
            </div>

            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                simulationStep === 'verifying'
                  ? 'border-[#84CC16]/60 bg-[#84CC16]/10 text-[#072644] dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  simulationStep === 'verifying'
                    ? 'text-amber-500 animate-spin'
                    : 'text-slate-400'
                }`}
              />
              <span>3. Key Attestation</span>
            </div>
          </div>

          {/* Smooth Progress Bar with percentage */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Hardware Handshake Progress</span>
              <span className="font-mono font-bold text-[#0F4C81] dark:text-[#9AE61C]">
                {simulationStep === 'prompting' ? '35%' : simulationStep === 'registering' ? '75%' : '98%'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0F4C81] via-[#0F4C81] to-[#84CC16] transition-all duration-300 rounded-full"
                style={{
                  width:
                    simulationStep === 'prompting'
                      ? '35%'
                      : simulationStep === 'registering'
                      ? '75%'
                      : '98%',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Expanded Preferences Panel when Biometric is Enabled */}
      {preferences.enabled && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          {/* Modality Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Preferred Biometric Hardware Modality:
              </span>
              <span className="text-[11px] text-slate-400">
                FIDO2 Level 2 Certified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  updatePreferenceField('preferredMethod', 'fingerprint');
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  preferences.preferredMethod === 'fingerprint'
                    ? 'border-[#0F4C81] dark:border-[#84CC16] bg-white dark:bg-[#0A1F36] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    preferences.preferredMethod === 'fingerprint'
                      ? 'bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#84CC16]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#072644] dark:text-white flex items-center gap-1">
                    <span>Touch ID / Fingerprint</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Capacitive or optical sensor on phone or laptop.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  updatePreferenceField('preferredMethod', 'face');
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  preferences.preferredMethod === 'face'
                    ? 'border-[#0F4C81] dark:border-[#84CC16] bg-white dark:bg-[#0A1F36] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    preferences.preferredMethod === 'face'
                      ? 'bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#84CC16]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <ScanFace className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#072644] dark:text-white flex items-center gap-1">
                    <span>Face ID / Windows Hello</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Infrared 3D depth facial recognition.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  updatePreferenceField('preferredMethod', 'auto');
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  preferences.preferredMethod === 'auto'
                    ? 'border-[#0F4C81] dark:border-[#84CC16] bg-white dark:bg-[#0A1F36] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    preferences.preferredMethod === 'auto'
                      ? 'bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#84CC16]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#072644] dark:text-white flex items-center gap-1">
                    <span>Any Authenticator</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Auto-selects whichever sensor is available.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Granular Security Policies */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1F36]/60 space-y-2.5">
            <span className="font-bold text-slate-700 dark:text-slate-200 block text-xs">
              Biometric Authorization Policies:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.requireForHighValueTransactions}
                  onChange={(e) =>
                    updatePreferenceField(
                      'requireForHighValueTransactions',
                      e.target.checked
                    )
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    High-Value Step-Up Verification
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                    Require fingerprint or face scan for customer refunds and invoices &gt; ₦500,000.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.allowPatternFallback}
                  onChange={(e) =>
                    updatePreferenceField('allowPatternFallback', e.target.checked)
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Pattern Lock / PIN Fallback
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                    Allow Android 3x3 pattern lock if biometric scanner reports moisture or sensor error.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.trustDevice30Days}
                  onChange={(e) =>
                    updatePreferenceField('trustDevice30Days', e.target.checked)
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Trust Hardware Profile for 30 Days
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                    Bypass master password challenge on this enrolled browser session.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.sensorHaptic}
                  onChange={(e) =>
                    updatePreferenceField('sensorHaptic', e.target.checked)
                  }
                  className="mt-0.5 w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Tactile Sensor Vibration (Haptic)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                    Vibrate touch surface upon successful biometric token read.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Device Enclave Info Card & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-[#072644] dark:text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#84CC16]" />
                <span>Enclave: {preferences.authenticatorName}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-mono">
                Key ID: {preferences.registeredKeyId} • Alg: ES256
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Test Biometric Sensor */}
              <button
                type="button"
                onClick={() => setIsTestScannerOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Test Sensor</span>
              </button>

              {/* Save Preferences Button with Confirmation Animation */}
              <button
                type="button"
                id="save-biometric-preferences-btn"
                aria-label="Register Biometric Hardware"
                disabled={isSimulating}
                onClick={() => handleSimulateSave({}, 'Hardware Registered')}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-[#84CC16] hover:bg-[#65A30D] text-[#072644] ring-2 ring-[#84CC16]/40'
                    : 'bg-[#0F4C81] hover:bg-[#072644] text-white'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>
                      {hasUnsavedChanges
                        ? 'Save Biometric Preferences *'
                        : 'Register Biometric Hardware'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Biometric Sensor Test Simulation Modal */}
      {isTestScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#071626] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsTestScannerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#84CC16] flex items-center justify-center">
              {preferences.preferredMethod === 'face' ? (
                <ScanFace className="w-6 h-6" />
              ) : (
                <Fingerprint className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#072644] dark:text-white">
                Biometric Sensor Diagnostic
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Testing hardware communication with{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {preferences.authenticatorName}
                </span>
                .
              </p>
            </div>

            {/* Visual Scanner Arena with animated beam & radar pulse */}
            <div className="relative mx-auto w-36 h-36 rounded-2xl border-2 border-dashed border-[#0F4C81]/30 dark:border-[#84CC16]/40 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0A1F36]">
              {/* Radar pulse ring */}
              <div className="absolute inset-2 rounded-xl bg-[#84CC16]/10 animate-bio-radar pointer-events-none" />

              {/* Vertical scanning beam */}
              <div className="absolute left-2 right-2 h-0.5 bg-[#84CC16] shadow-[0_0_8px_#84CC16] animate-scan-beam pointer-events-none" />

              {preferences.preferredMethod === 'face' ? (
                <ScanFace className="w-16 h-16 text-[#0F4C81] dark:text-[#84CC16] opacity-80" />
              ) : (
                <Fingerprint className="w-16 h-16 text-[#0F4C81] dark:text-[#84CC16] opacity-80" />
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Place finger on reader or look directly into camera to authenticate.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsTestScannerOpen(false);
                  handleSimulateSave({}, 'Biometric Diagnostic Passed');
                }}
                className="flex-1 py-2 px-3 bg-[#84CC16] hover:bg-[#65A30D] text-[#072644] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Simulate Successful Touch</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTestScannerOpen(false)}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
