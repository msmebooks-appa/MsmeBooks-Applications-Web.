import React, { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Contrast,
  Sparkles,
  RotateCcw,
  X,
  Volume2,
  Check,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'lg' | 'xl';
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  dyslexicFont: false,
  reducedMotion: false,
};

export const AccessibilityToolbar: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-a11y');
      if (saved) return JSON.parse(saved);
    } catch {
      // Safe fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Apply classes to root HTML element
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove('a11y-font-lg', 'a11y-font-xl');
    if (settings.fontSize === 'lg') root.classList.add('a11y-font-lg');
    if (settings.fontSize === 'xl') root.classList.add('a11y-font-xl');

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Dyslexia friendly font
    if (settings.dyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    try {
      localStorage.setItem('msmebooks-a11y', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  const setFontSize = (size: 'normal' | 'lg' | 'xl') => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleDyslexicFont = () => {
    setSettings((prev) => ({ ...prev, dyslexicFont: !prev.dyslexicFont }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const resetAll = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const hasActiveModifiers =
    settings.fontSize !== 'normal' ||
    settings.highContrast ||
    settings.dyslexicFont ||
    settings.reducedMotion;

  return (
    <div className="fixed top-24 left-4 z-40" role="region" aria-label="Accessibility controls">
      {/* Trigger Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 py-2 px-2.5 rounded-full shadow-lg border transition-all cursor-pointer ${
            hasActiveModifiers
              ? 'bg-[#0A4FD5] text-white border-lime-400 ring-2 ring-lime-400/40'
              : 'bg-white/90 dark:bg-[#0D1E36]/90 backdrop-blur-md text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0A4FD5] dark:hover:border-blue-400'
          }`}
          title="Accessibility Toolbar (WCAG 2.1 AA)"
          aria-expanded={isOpen}
        >
          <Sliders className="w-4 h-4 text-[#0A4FD5] dark:text-lime-400" />
          <span className="text-[11px] font-black hidden sm:inline">A11y</span>
          {hasActiveModifiers && (
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          )}
        </button>
      ) : (
        /* Panel */
        <div className="w-72 sm:w-80 bg-white dark:bg-[#0B192C] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Accessibility Toolbar
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  WCAG 2.1 AA Compliant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {hasActiveModifiers && (
                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset to default settings"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* 1. Font Size Scaling */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                  Text Size Scaling
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {settings.fontSize === 'normal' ? '100%' : settings.fontSize === 'lg' ? '112%' : '125%'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                    settings.fontSize === 'normal'
                      ? 'bg-[#0A4FD5] text-white border-[#0A4FD5]'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                    settings.fontSize === 'lg'
                      ? 'bg-[#0A4FD5] text-white border-[#0A4FD5]'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Large (A+)
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xl')}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                    settings.fontSize === 'xl'
                      ? 'bg-[#0A4FD5] text-white border-[#0A4FD5]'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  X-Large
                </button>
              </div>
            </div>

            {/* 2. High Contrast Mode */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    High Contrast
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Enhanced borders & text sharpness
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleHighContrast}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settings.highContrast ? 'bg-[#0A4FD5]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.highContrast ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Dyslexia-Friendly Font */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#84CC16]" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Dyslexia-Friendly Font
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Higher letter spacing & weight
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleDyslexicFont}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settings.dyslexicFont ? 'bg-[#0A4FD5]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.dyslexicFont ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Reduced Motion */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Reduced Motion
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Disables smooth animations
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleReducedMotion}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settings.reducedMotion ? 'bg-[#0A4FD5]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.reducedMotion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
            Settings auto-saved for future visits
          </div>
        </div>
      )}
    </div>
  );
};
