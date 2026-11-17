import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  Briefcase, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { HELP_ARTICLES, HelpArticle } from '../data/helpArticles';
import { useCurrency } from '../context/CurrencyContext';

interface GlobalHeaderSearchProps {
  onSelectService: (service: ServiceItem) => void;
  onSelectFirm: (firm: ProfessionalFirm) => void;
  onSelectArticle: (article: HelpArticle) => void;
}

export const GlobalHeaderSearch: React.FC<GlobalHeaderSearchProps> = ({
  onSelectService,
  onSelectFirm,
  onSelectArticle,
}) => {
  const { formatPriceString } = useCurrency();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time suggestions search results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        services: SERVICES_CATALOGUE.filter(s => s.popular).slice(0, 3),
        firms: PROFESSIONAL_FIRMS.filter(f => f.partnerTier === 'Platinum Partner' || f.partnerTier === 'Official Core Team').slice(0, 2),
        articles: HELP_ARTICLES.slice(0, 2),
        totalCount: 7,
        isPopularDefault: true,
      };
    }

    const matchedServices = SERVICES_CATALOGUE.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.shortOverview.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.challengesSolved.some(c => c.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedFirms = PROFESSIONAL_FIRMS.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.country.toLowerCase().includes(q) ||
      f.specializations.some(sp => sp.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedArticles = HELP_ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.snippet.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3);

    return {
      services: matchedServices,
      firms: matchedFirms,
      articles: matchedArticles,
      totalCount: matchedServices.length + matchedFirms.length + matchedArticles.length,
      isPopularDefault: false,
    };
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs xl:max-w-sm">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search services, firms & guides..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#1464C8] focus:bg-white dark:focus:bg-[#0D1D31] transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Instant Dropdown Suggestions Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#0A1727] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
          
          {/* Header Indicator */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#07111D] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>
              {searchResults.isPopularDefault ? 'Popular & Trending Searches' : `Found ${searchResults.totalCount} Results for "${query}"`}
            </span>
            <span className="text-[10px] text-slate-400">Press Esc to exit</span>
          </div>

          {/* Empty State */}
          {!searchResults.isPopularDefault && searchResults.totalCount === 0 && (
            <div className="p-6 text-center">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No matching results found for "{query}"
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Try searching for "POS setup", "Tax advisory", "Payroll", "Apex", or "Audit".
              </p>
            </div>
          )}

          {/* 1. Services Section */}
          {searchResults.services.length > 0 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1464C8] dark:text-[#B7E532] flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" />
                <span>Verified Services ({searchResults.services.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      onSelectService(service);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0D1D31] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#102B4E] dark:text-white truncate group-hover:text-[#1464C8] dark:group-hover:text-[#B7E532]">
                          {service.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {service.category} • from {formatPriceString(service.startingPrice)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1464C8] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Professional Firms Section */}
          {searchResults.firms.length > 0 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                <span>Professional Firms & Consultants ({searchResults.firms.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.firms.map((firm) => (
                  <button
                    key={firm.id}
                    type="button"
                    onClick={() => {
                      onSelectFirm(firm);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0D1D31] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg ${firm.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700`}>
                        {firm.logoText}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#102B4E] dark:text-white truncate group-hover:text-emerald-600">
                            {firm.name}
                          </h4>
                          {firm.isVerified && (
                            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {firm.category} • {firm.city}, {firm.country} • ⭐ {firm.rating}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Knowledge Base Help Articles Section */}
          {searchResults.articles.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                <span>Help Guides & Regulatory Articles ({searchResults.articles.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.articles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      onSelectArticle(art);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0D1D31] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-[#102B4E] dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-300">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {art.snippet}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-600 shrink-0 flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
