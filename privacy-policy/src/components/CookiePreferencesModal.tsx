import React, { useState, useEffect } from 'react';
import { X, Cookie, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('msmebooks_cookie_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFunctional(parsed.functional ?? true);
        setAnalytics(parsed.analytics ?? true);
        setMarketing(parsed.marketing ?? false);
      } catch (e) {
        // use defaults
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(
      'msmebooks_cookie_prefs',
      JSON.stringify({
        essential: true,
        functional,
        analytics,
        marketing,
        savedAt: new Date().toISOString()
      })
    );
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
    localStorage.setItem(
      'msmebooks_cookie_prefs',
      JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
        savedAt: new Date().toISOString()
      })
    );
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] dark:bg-[#0A1220] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#B8E62E]" />
            <div>
              <h3 className="text-sm font-bold">{t('cookie.title', 'Cookie & Tracking Preferences')}</h3>
              <p className="text-[11px] text-slate-300">{t('cookie.subtitle', 'Manage Local Storage & Analytics Consent')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('cookie.saved', 'Your cookie consent preferences have been updated and saved!')}</span>
            </div>
          )}

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[13px]">
            {t('cookie.intro', 'MsmeBooks respects your digital sovereignty. Customize which categories of cookies and browser storage you permit on your device.')}
          </p>

          <div className="space-y-3 pt-2">
            {/* Essential */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1627]/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D] dark:text-white">{t('cookie.essentialTitle', 'Strictly Necessary Cookies')}</span>
                  <span className="text-[10px] uppercase font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                    {t('cookie.alwaysActive', 'Always Active (Statutory)')}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t('cookie.essentialDesc', 'Required for secure user authentication, role enforcement, CSRF protection, and multi-tenant ledger isolation.')}
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  disabled
                  checked
                  className="rounded text-slate-400 cursor-not-allowed w-4 h-4"
                />
              </div>
            </div>

            {/* Functional */}
            <div className="p-3.5 bg-white dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D] dark:text-white">{t('cookie.functionalTitle', 'Functional & Currency Preferences')}</span>
                  <span className="text-[10px] uppercase font-mono bg-blue-50 dark:bg-blue-950/60 text-[#1455C0] dark:text-[#5B95FF] px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t('cookie.functionalDesc', 'Remembers language choice, active reporting currency, theme mode, and cached legal schedules.')}
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  id="pref-functional"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="rounded text-[#1455C0] dark:text-[#5B95FF] focus:ring-[#1455C0] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="p-3.5 bg-white dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D] dark:text-white">{t('cookie.analyticsTitle', 'Analytical & Telemetry Metrics')}</span>
                  <span className="text-[10px] uppercase font-mono bg-blue-50 dark:bg-blue-950/60 text-[#1455C0] dark:text-[#5B95FF] px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t('cookie.analyticsDesc', 'Helps us assess interface performance and detect bugs. All metrics are aggregated with IP anonymization.')}
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  id="pref-analytics"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="rounded text-[#1455C0] dark:text-[#5B95FF] focus:ring-[#1455C0] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Marketing */}
            <div className="p-3.5 bg-white dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172B4D] dark:text-white">{t('cookie.marketingTitle', 'Marketing & External Beacons')}</span>
                  <span className="text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t('cookie.marketingDesc', 'Used to measure effectiveness of promotional campaigns across Pan-African channels. Disabled by default.')}
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  id="pref-marketing"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="rounded text-[#1455C0] dark:text-[#5B95FF] focus:ring-[#1455C0] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto px-4 py-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-lg transition-colors"
            >
              {t('cookie.acceptAll', 'Accept All Cookies')}
            </button>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t('chat.close', 'Cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] font-semibold rounded-lg shadow-sm transition-colors"
              >
                {t('cookie.saveBtn', 'Save Preferences')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
