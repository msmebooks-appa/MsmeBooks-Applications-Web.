import React, { useEffect, useState } from 'react';
import {
  X,
  UserCog,
  ShieldCheck,
  ScanFace,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  Bell,
  FileText,
  Sparkles,
  Lock,
  ArrowRight,
  KeyRound,
  User,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import {
  UserProfileSettings,
  BiometricModality,
  BiometricCapability,
  detectBiometricCapabilities,
  enrollBiometricCredential,
  disableBiometricCredential,
  saveUserSettings,
  getInitials,
} from '../utils/biometricAuth';
import { BiometricAuthModal } from './BiometricAuthModal';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserProfileSettings;
  onSettingsChange: (updated: UserProfileSettings) => void;
  onOpenCustomerDashboardWithBiometrics?: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onOpenCustomerDashboardWithBiometrics,
}) => {
  const [formState, setFormState] = useState<UserProfileSettings>(settings);
  const [capability, setCapability] = useState<BiometricCapability | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isTestScanOpen, setIsTestScanOpen] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    detectBiometricCapabilities().then(setCapability);
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleToggleBiometric = async () => {
    if (formState.biometricEnabled) {
      const updated = disableBiometricCredential();
      setFormState(updated);
      onSettingsChange(updated);
      showToast('Biometric Authentication disabled. Standard dashboard access restored.');
      return;
    }

    setIsEnrolling(true);
    try {
      const result = await enrollBiometricCredential(formState, formState.biometricModality);
      setFormState(result.settings);
      onSettingsChange(result.settings);
      showToast(result.note);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleSelectModality = (modality: BiometricModality) => {
    const updated = saveUserSettings({ biometricModality: modality });
    setFormState(updated);
    onSettingsChange(updated);
    showToast(
      `Biometric preference set to ${
        modality === 'faceid'
          ? 'Face ID'
          : modality === 'fingerprint'
          ? 'Fingerprint Scan'
          : 'Auto-Detect Sensor'
      }.`
    );
  };

  const handleToggleRequireOnOpen = () => {
    const nextVal = !formState.requireBiometricOnDashboardOpen;
    const updated = saveUserSettings({ requireBiometricOnDashboardOpen: nextVal });
    setFormState(updated);
    onSettingsChange(updated);
  };

  const handleToggleAlert = (field: 'bookingEmailAlerts' | 'autoInvoiceAlerts') => {
    const updated = saveUserSettings({ [field]: !formState[field] });
    setFormState(updated);
    onSettingsChange(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveUserSettings({
      fullName: formState.fullName.trim() || 'Adewale Ogunleye',
      email: formState.email.trim() || 'adewale@alpha-retail.ng',
      businessName: formState.businessName.trim() || 'Alpha Retailers Ltd',
      phone: formState.phone.trim() || '+234 803 456 7890',
    });
    setFormState(updated);
    onSettingsChange(updated);
    showToast('Profile settings saved successfully.');
  };

  const modalityOptions: {
    id: BiometricModality;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'auto',
      title: 'Auto-Detect',
      subtitle: capability?.recommendedModality === 'faceid' ? 'Uses Face ID' : 'Uses Fingerprint',
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: 'faceid',
      title: 'Face ID',
      subtitle: 'Facial Recognition',
      icon: <ScanFace className="w-4 h-4" />,
    },
    {
      id: 'fingerprint',
      title: 'Fingerprint',
      subtitle: 'Touch ID / Sensor',
      icon: <Fingerprint className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-settings-modal-title"
      >
        <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#102B4E] via-[#123A6B] to-[#1464C8] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-black text-base text-[#B7E532] shadow-inner">
                {getInitials(formState.fullName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="user-settings-modal-title" className="text-lg font-black tracking-tight">
                    User Settings & Security
                  </h2>
                  {formState.biometricEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B7E532] text-[#102B4E] text-[10px] font-black uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      Biometrics On
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  {formState.fullName} · {formState.businessName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close user settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Status Banner */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* 1. BIOMETRIC AUTHENTICATION SECTION */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1D31]/70 p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      formState.biometricEnabled
                        ? 'bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E] shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {formState.biometricModality === 'fingerprint' ? (
                      <Fingerprint className="w-5 h-5" />
                    ) : (
                      <ScanFace className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-[#102B4E] dark:text-white">
                        Biometric Authentication
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                        FaceID & Fingerprint
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Enable Face ID or fingerprint scanning for faster, one-tap access to your Customer Dashboard, booking receipts, and wallet controls.
                    </p>
                  </div>
                </div>

                {/* Primary Biometric Authentication Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.biometricEnabled}
                  aria-label="Toggle Biometric Authentication"
                  disabled={isEnrolling}
                  onClick={() => void handleToggleBiometric()}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1464C8] ${
                    formState.biometricEnabled
                      ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  } ${isEnrolling ? 'opacity-60' : ''}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-[#0A1727] shadow-sm transition-transform ${
                      formState.biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Device Capability Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#0A1727] border border-slate-200/80 dark:border-slate-800 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  <span>
                    Detected Sensor:{' '}
                    <strong className="text-[#102B4E] dark:text-white">
                      {capability?.detectedSensorLabel || 'Checking device hardware...'}
                    </strong>
                  </span>
                </span>
                <span
                  className={`font-bold ${
                    formState.biometricEnabled
                      ? 'text-emerald-600 dark:text-[#B7E532]'
                      : 'text-slate-400'
                  }`}
                >
                  {formState.biometricEnabled
                    ? formState.biometricMethodUsed === 'webauthn'
                      ? 'WebAuthn Enrolled'
                      : 'Passkey Active'
                    : 'Not Enrolled'}
                </span>
              </div>

              {/* Modality Selector */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Preferred Biometric Scanner
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modalityOptions.map((opt) => {
                    const selected = formState.biometricModality === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectModality(opt.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          selected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1464C8] dark:border-[#B7E532] text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                            : 'bg-white dark:bg-[#0A1727] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="shrink-0">{opt.icon}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-black leading-tight">{opt.title}</div>
                          <div className="text-[10px] opacity-75 truncate">{opt.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Biometric Details & Controls */}
              {formState.biometricEnabled && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                  {/* Require on Dashboard Open Sub-Toggle */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lock className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-[#102B4E] dark:text-white block">
                          Prompt Biometrics When Opening Customer Dashboard
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                          Verifies Face ID or fingerprint before displaying dashboard bookings & invoices
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formState.requireBiometricOnDashboardOpen}
                      aria-label="Prompt Biometrics When Opening Customer Dashboard"
                      onClick={handleToggleRequireOnOpen}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                        formState.requireBiometricOnDashboardOpen
                          ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-[#0A1727] transition-transform ${
                          formState.requireBiometricOnDashboardOpen ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Credential Metadata & Test Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-[#0A1727] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#102B4E] dark:text-slate-200">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Passkey ID: {formState.biometricCredentialId?.slice(0, 16) || 'Active'}...</span>
                      </div>
                      {formState.biometricLastVerifiedAt && (
                        <div>
                          Last verified:{' '}
                          {new Date(formState.biometricLastVerifiedAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsTestScanOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-[#102B4E] dark:text-white transition-colors cursor-pointer"
                      >
                        Test Scan
                      </button>
                      {onOpenCustomerDashboardWithBiometrics && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCustomerDashboardWithBiometrics();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Quick Unlock Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 2. ACCOUNT PROFILE SECTION */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserCog className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                <h3 className="text-sm font-black text-[#102B4E] dark:text-white">
                  Account Profile Details
                </h3>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formState.businessName}
                      onChange={(e) => setFormState({ ...formState, businessName: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#102B4E] dark:bg-[#B7E532] text-white dark:text-[#102B4E] text-xs font-black hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </section>

            {/* 3. NOTIFICATION & DOCUMENT PREFERENCES */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                  <div>
                    <div className="text-xs font-bold text-[#102B4E] dark:text-white">
                      Booking & Reminder Notifications
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Receive email and portal updates 24h before consultations
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.bookingEmailAlerts}
                  onClick={() => handleToggleAlert('bookingEmailAlerts')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    formState.bookingEmailAlerts
                      ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-[#0A1727] transition-transform ${
                      formState.bookingEmailAlerts ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                  <div>
                    <div className="text-xs font-bold text-[#102B4E] dark:text-white">
                      Auto-Invoice PDF Alerts
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Notify when completed bookings generate PDF invoices in Documents
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.autoInvoiceAlerts}
                  onClick={() => handleToggleAlert('autoInvoiceAlerts')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    formState.autoInvoiceAlerts
                      ? 'bg-[#1464C8] dark:bg-[#B7E532]'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-[#0A1727] transition-transform ${
                      formState.autoInvoiceAlerts ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Test Scan Biometric Prompt */}
      <BiometricAuthModal
        isOpen={isTestScanOpen}
        onClose={() => setIsTestScanOpen(false)}
        settings={formState}
        mode="test-scan"
        onVerified={(updated) => {
          setIsTestScanOpen(false);
          setFormState(updated);
          onSettingsChange(updated);
          showToast('Biometric scan verified successfully! Ready for fast Customer Dashboard access.');
        }}
      />
    </>
  );
};
