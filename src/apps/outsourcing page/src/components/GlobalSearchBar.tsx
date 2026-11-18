import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  UserCheck, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';
import { SERVICE_CATEGORIES, VERIFIED_PROFESSIONALS, FAQS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface GlobalSearchBarProps {
  onNavigateSection: (sectionId: string) => void;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ 
  onNavigateSection,
  className = ''
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  const matchingServices = cleanQuery
    ? SERVICE_CATEGORIES.filter(s => 
        s.name.toLowerCase().includes(cleanQuery) ||
        s.shortDesc.toLowerCase().includes(cleanQuery) ||
        s.deliverables.some(d => d.toLowerCase().includes(cleanQuery))
      ).slice(0, 4)
    : [];

  const matchingProfessionals = cleanQuery
    ? VERIFIED_PROFESSIONALS.filter(p =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.title.toLowerCase().includes(cleanQuery) ||
        p.specialization.toLowerCase().includes(cleanQuery) ||
        p.country.toLowerCase().includes(cleanQuery) ||
        p.credentials.some(c => c.toLowerCase().includes(cleanQuery))
      ).slice(0, 4)
    : [];

  const matchingFaqs = cleanQuery
    ? FAQS.filter(f =>
        f.question.toLowerCase().includes(cleanQuery) ||
        f.answer.toLowerCase().includes(cleanQuery) ||
        f.category.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const hasResults = matchingServices.length > 0 || matchingProfessionals.length > 0 || matchingFaqs.length > 0;

  const handleSelectService = (_serviceId: string) => {
    onNavigateSection('services');
    setIsOpen(false);
  };

  const handleSelectProfessional = (_profId: string) => {
    onNavigateSection('marketplace');
    setIsOpen(false);
  };

  const handleSelectFaq = (_question: string) => {
    onNavigateSection('faqs');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition duration-150 cursor-pointer shadow-xs group"
        title={language === 'fr' ? 'Rechercher services, comptables, FAQs...' : 'Search services, verified CPAs, FAQs...'}
      >
        <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-lime-400 transition-colors" />
        <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
          {language === 'fr' ? 'Rechercher...' : 'Search platform...'}
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Search Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            ref={containerRef}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          >
            {/* Input Header */}
            <div className="relative flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <Search className="w-5 h-5 text-blue-600 dark:text-lime-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'fr' 
                  ? 'Rechercher par service, pays, nom de comptable ou question...' 
                  : 'Search by service, country, accountant name, or question...'}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-2 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-4 space-y-4">
              {!cleanQuery ? (
                <div className="py-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-lime-400 mb-2">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {language === 'fr' ? 'Recherche Globale Intelligente' : 'Global Platform Search'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                    {language === 'fr'
                      ? 'Tapez un mot-clé pour trouver instantanément des services d’externalisation, des experts agréés ICAN/ACCA/CPA, ou des réponses aux questions fréquentes.'
                      : 'Type a keyword to discover outsourcing services, licensed ICAN/ACCA/CPA professionals, or quick answers to FAQs.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                    {['Payroll', 'Bookkeeping', 'Tax Audits', 'Kenya', 'Nigeria', 'South Africa', 'Virtual CFO'].map(keyword => (
                      <button
                        key={keyword}
                        onClick={() => setQuery(keyword)}
                        className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !hasResults ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  <p>{language === 'fr' ? `Aucun résultat trouvé pour "${query}"` : `No matching results for "${query}"`}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'fr' ? 'Essayez de chercher "comptabilité", "paie", ou "fiscalité".' : 'Try searching for "payroll", "bookkeeping", or "tax".'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Matching Services */}
                  {matchingServices.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-lime-400 mb-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{language === 'fr' ? 'Services d\'externalisation' : 'Outsourcing Services'} ({matchingServices.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {matchingServices.map(service => (
                          <div
                            key={service.id}
                            onClick={() => handleSelectService(service.id)}
                            className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-lime-500/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                          >
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-lime-400">
                                {service.name}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {service.shortDesc}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-lime-400 font-semibold shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Professionals */}
                  {matchingProfessionals.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{language === 'fr' ? 'Experts-Comptables Vérifiés' : 'Verified Professionals'} ({matchingProfessionals.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {matchingProfessionals.map(prof => (
                          <div
                            key={prof.id}
                            onClick={() => handleSelectProfessional(prof.id)}
                            className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={prof.avatarUrl} 
                                alt={prof.name} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                              />
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  {prof.name} <span className="text-[11px] font-normal text-slate-400">({prof.country})</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {prof.title} · {prof.specialization}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>Profile</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching FAQs */}
                  {matchingFaqs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'} ({matchingFaqs.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {matchingFaqs.map((faq, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectFaq(faq.question)}
                            className="group flex items-start justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-slate-800/60 cursor-pointer transition"
                          >
                            <div>
                              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                {faq.question}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {faq.answer}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-semibold shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                              <span>Read</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>MsmeBooks Outsourcing Directory</span>
              <span>Press <kbd className="font-semibold text-slate-700 dark:text-slate-300">ESC</kbd> to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
