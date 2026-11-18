import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'dropdown' 
}) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    if (code !== language) {
      setLanguage(code);
      const targetLang = availableLanguages.find(l => l.code === code);
      if (targetLang) {
        toast.locale('language', `${targetLang.flag} ${targetLang.nativeName}`, `${code.toUpperCase()} interface active`);
      }
    }
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
              language === lang.code
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-lime-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title={lang.name}
          >
            <span>{lang.flag}</span>
            <span className="uppercase">{lang.code}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Change language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline font-semibold">{currentLanguage.nativeName}</span>
        <span className="sm:hidden uppercase font-bold">{currentLanguage.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Select Language / Choisir la langue
          </div>
          {availableLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-slate-800/80 text-blue-700 dark:text-lime-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="leading-tight">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{lang.name}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-lime-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
