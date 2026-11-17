import React, { useState, useRef, useEffect, useId } from 'react';
import { Eye, Sun, Sparkles, SlidersHorizontal, Type, ZapOff, Underline, Focus, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility, TextSize } from '../context/AccessibilityContext';

interface AccessibilitySettingsMenuProps {
  className?: string;
  variant?: 'navbar' | 'mobile';
}

export const AccessibilitySettingsMenu: React.FC<AccessibilitySettingsMenuProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const {
    settings,
    setHighContrast,
    setTextSize,
    setReduceMotion,
    setUnderlinedLinks,
    setFocusHighlight,
    resetSettings,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const isAnyActive =
    settings.highContrast ||
    settings.textSize !== 'normal' ||
    settings.reduceMotion ||
    settings.underlinedLinks ||
    settings.focusHighlight;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (variant === 'mobile') {
    return (
      <div className={`space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            Accessibility & WCAG 2.1
          </span>
          {isAnyActive && (
            <button
              onClick={resetSettings}
              type="button"
              className="text-[10px] text-slate-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset
            </button>
          )}
        </div>

        {/* High contrast quick switch */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60 dark:border-blue-900/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">High Contrast (WCAG)</span>
          <button
            type="button"
            onClick={() => setHighContrast(!settings.highContrast)}
            className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              settings.highContrast ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                settings.highContrast ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Text size selector */}
        <div className="py-1.5 border-b border-slate-200/60 dark:border-blue-900/40">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Text Size Scaling</div>
          <div className="grid grid-cols-3 gap-1">
            {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                  settings.textSize === size
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-transparent'
                    : 'bg-white dark:bg-blue-900/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-800'
                }`}
              >
                {size === 'normal' ? '100%' : size === 'large' ? '112%' : '125%'}
              </button>
            ))}
          </div>
        </div>

        {/* Reduce motion */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Reduce Motion</span>
          <button
            type="button"
            onClick={() => setReduceMotion(!settings.reduceMotion)}
            className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              settings.reduceMotion ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                settings.reduceMotion ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer border ${
          isOpen || isAnyActive
            ? 'bg-blue-50/90 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] border-[#0A3981] dark:border-[#8CE600] ring-1 ring-[#0A3981]/20 dark:ring-[#8CE600]/30 shadow-xs'
            : 'text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] bg-slate-100/90 dark:bg-blue-950/70 hover:bg-slate-200/80 dark:hover:bg-blue-900/60 border-slate-200 dark:border-blue-800/70 shadow-xs'
        }`}
        title="Accessibility Settings (WCAG 2.1 AA)"
        aria-label="Open Accessibility Settings Menu"
      >
        <Eye className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600] shrink-0" />
        <span className="hidden xl:inline text-xs font-bold">A11y</span>
        {isAnyActive && (
          <span className="w-2 h-2 rounded-full bg-[#8CE600] animate-pulse" title="Custom Accessibility Active" />
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 dark:text-blue-300 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180 text-[#0A3981] dark:text-[#8CE600]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="dialog"
            aria-label="Accessibility Settings"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] bg-white/98 dark:bg-[#072048]/98 backdrop-blur-md border border-slate-200 dark:border-blue-800/90 rounded-2xl shadow-2xl p-3 z-50 divide-y divide-slate-100 dark:divide-blue-900/60"
          >
            {/* Header */}
            <div className="pb-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                  <span>Accessibility Preferences</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-blue-200/80">
                  WCAG 2.1 AA Compliance Suite
                </div>
              </div>

              {isAnyActive && (
                <button
                  type="button"
                  onClick={resetSettings}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="py-2.5 space-y-2.5">
              {/* High Contrast Mode Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">High Contrast Mode</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-300">Max WCAG color contrast</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHighContrast(!settings.highContrast)}
                  role="switch"
                  aria-checked={settings.highContrast}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.highContrast ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                      settings.highContrast ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Text Size Scaling */}
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <Type className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Text Size Scaling</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-300">Scale base font dimensions</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => {
                    const isActive = settings.textSize === size;
                    const label = size === 'normal' ? 'Normal (100%)' : size === 'large' ? 'Large (112%)' : 'X-Large (125%)';
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTextSize(size)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-transparent shadow-xs'
                            : 'bg-white dark:bg-blue-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-800/70 hover:bg-slate-100'
                        }`}
                      >
                        {size === 'normal' ? '100%' : size === 'large' ? '112%' : '125%'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <ZapOff className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Reduce Motion</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-300">Disable marquees & animations</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReduceMotion(!settings.reduceMotion)}
                  role="switch"
                  aria-checked={settings.reduceMotion}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.reduceMotion ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                      settings.reduceMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Underline Links */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <Underline className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Underline Links</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-300">High-visibility hyperlinks</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUnderlinedLinks(!settings.underlinedLinks)}
                  role="switch"
                  aria-checked={settings.underlinedLinks}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.underlinedLinks ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                      settings.underlinedLinks ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Focus Ring Highlight */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <Focus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Keyboard Focus Rings</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-300">Neon outline on active tab elements</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFocusHighlight(!settings.focusHighlight)}
                  role="switch"
                  aria-checked={settings.focusHighlight}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.focusHighlight ? 'bg-[#0A3981] dark:bg-[#8CE600]' : 'bg-slate-300 dark:bg-blue-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white dark:bg-[#061F4A] shadow-md transform transition-transform ${
                      settings.focusHighlight ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-blue-200/70">
              <span>Saved locally</span>
              <span className="font-semibold text-[#0A3981] dark:text-[#8CE600]">WCAG 2.1 AA Compliant</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
