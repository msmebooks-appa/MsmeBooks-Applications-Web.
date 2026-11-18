import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, className = '' }) => {
  const { language, setLanguage, currentOption, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border focus:outline-hidden focus:ring-2 focus:ring-[#7CB518]/40 ${
          isOpen
            ? 'bg-slate-100 dark:bg-[#162D42] text-[#0A3D62] dark:text-sky-300 border-[#0A3D62]/30 dark:border-sky-500/40'
            : 'bg-white dark:bg-[#0B1E30] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#1F3D5A] hover:bg-slate-50 dark:hover:bg-[#122A3F]'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language / Choisir la langue / Selecionar idioma / Seleccionar idioma"
      >
        <span className="text-sm leading-none" role="img" aria-label={currentOption.name}>
          {currentOption.flag}
        </span>
        <span className="font-bold tracking-wide uppercase">{currentOption.code}</span>
        {!compact && (
          <span className="hidden 2xl:inline text-slate-500 dark:text-slate-400 font-normal">
            ({currentOption.nativeName})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0A3D62] dark:text-sky-300' : ''
          }`}
        />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white dark:bg-[#0B1E30] border border-slate-200 dark:border-[#1E3B59] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 focus:outline-hidden"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-[#162D42] flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#7CB518]" />
              Select Language / Idioma
            </span>
            <span className="text-[10px] bg-[#7CB518]/15 text-[#689912] dark:text-[#90CF24] px-1.5 py-0.5 rounded font-bold font-mono">
              Pan-African
            </span>
          </div>

          <div className="py-1">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-[#112A42] text-[#0A3D62] dark:text-white font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122A3F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{item.nativeName}</span>
                        <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-400">
                          [{item.code}]
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {item.region}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#7CB518]/20 dark:bg-[#7CB518]/30 flex items-center justify-center text-[#689912] dark:text-[#90CF24] shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
