import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  highContrast: boolean;
  textSize: TextSize;
  reduceMotion: boolean;
  dyslexicFont: boolean;
  underlinedLinks: boolean;
  focusHighlight: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setHighContrast: (enabled: boolean) => void;
  setTextSize: (size: TextSize) => void;
  setReduceMotion: (enabled: boolean) => void;
  setDyslexicFont: (enabled: boolean) => void;
  setUnderlinedLinks: (enabled: boolean) => void;
  setFocusHighlight: (enabled: boolean) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  textSize: 'normal',
  reduceMotion: false,
  dyslexicFont: false,
  underlinedLinks: false,
  focusHighlight: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('msmebooks_a11y');
        if (saved) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to default
      }
      // Check system reduced motion
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        return { ...DEFAULT_SETTINGS, reduceMotion: true };
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // High Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Text Size
    root.classList.remove('text-size-large', 'text-size-xlarge');
    if (settings.textSize === 'large') {
      root.classList.add('text-size-large');
    } else if (settings.textSize === 'xlarge') {
      root.classList.add('text-size-xlarge');
    }

    // Reduced Motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Underlined Links
    if (settings.underlinedLinks) {
      root.classList.add('underlined-links');
    } else {
      root.classList.remove('underlined-links');
    }

    // Focus Highlight
    if (settings.focusHighlight) {
      root.classList.add('focus-highlight');
    } else {
      root.classList.remove('focus-highlight');
    }

    try {
      localStorage.setItem('msmebooks_a11y', JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  const setHighContrast = (highContrast: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast }));
  };

  const setTextSize = (textSize: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize }));
  };

  const setReduceMotion = (reduceMotion: boolean) => {
    setSettings((prev) => ({ ...prev, reduceMotion }));
  };

  const setDyslexicFont = (dyslexicFont: boolean) => {
    setSettings((prev) => ({ ...prev, dyslexicFont }));
  };

  const setUnderlinedLinks = (underlinedLinks: boolean) => {
    setSettings((prev) => ({ ...prev, underlinedLinks }));
  };

  const setFocusHighlight = (focusHighlight: boolean) => {
    setSettings((prev) => ({ ...prev, focusHighlight }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setHighContrast,
        setTextSize,
        setReduceMotion,
        setDyslexicFont,
        setUnderlinedLinks,
        setFocusHighlight,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
