import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types/language';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, languages, currentConfig } = useLanguage();
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

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg border transition-all text-xs font-semibold cursor-pointer select-none ${
          compact
            ? 'px-2.5 py-1.5 bg-slate-50 dark:bg-[#15223E] hover:bg-slate-100 dark:hover:bg-[#1B2C50] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 w-full justify-between'
            : 'px-2.5 py-1.5 bg-slate-50 dark:bg-[#15223E] hover:bg-slate-100 dark:hover:bg-[#1B2C50] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs hover:border-[#0066CC]/50 dark:hover:border-[#38BDF8]/50'
        }`}
        title={`Current Language: ${currentConfig.localName} (${currentConfig.name}). Click to change language.`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none" role="img" aria-label={currentConfig.name}>
            {currentConfig.flag}
          </span>
          <span className="font-bold text-[#14243A] dark:text-white uppercase tracking-wider text-[11px]">
            {currentConfig.code}
          </span>
          {!compact && (
            <span className="text-slate-500 dark:text-slate-400 hidden xl:inline text-[11px] font-medium">
              {currentConfig.localName}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0066CC] dark:text-[#38BDF8]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#131D35] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            compact ? 'left-0 right-auto w-full' : ''
          }`}
        >
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#0D1527] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#14243A] dark:text-white">
              <Globe className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>Select Language / Langue</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">
              Pan-African
            </span>
          </div>

          {/* Languages List */}
          <div className="p-1.5 space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-[#1A284A] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 leading-tight">
                        <span className="font-bold">{item.localName}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                          ({item.name})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {item.region}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0 ml-2" />
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
