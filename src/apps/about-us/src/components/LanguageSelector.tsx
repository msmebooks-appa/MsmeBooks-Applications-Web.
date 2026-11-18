import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, Check, Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  const { currentLanguage, setLanguageCode, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t.lang_menu_title}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="font-mono font-bold text-slate-800 dark:text-white uppercase">
          {variant === 'desktop' ? currentLanguage.nativeName : currentLanguage.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[#0B4EA2] dark:text-[#38BDF8]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-zinc-950 shadow-xl border border-slate-200 dark:border-zinc-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          role="menu"
        >
          <div className="px-3 py-2 bg-slate-50 dark:bg-black/80 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
            <span>{t.lang_menu_title}</span>
          </div>

          <div className="py-1 divide-y divide-slate-50 dark:divide-zinc-800/60">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLanguage.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguageCode(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-blue-50/60 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/70 font-bold text-[#0B4EA2] dark:text-[#38BDF8]'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">
                          ({lang.code})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {lang.region}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0B4EA2] dark:text-lime-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 bg-slate-50 dark:bg-black/90 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono">
            {t.lang_menu_footer}
          </div>
        </div>
      )}
    </div>
  );
};
