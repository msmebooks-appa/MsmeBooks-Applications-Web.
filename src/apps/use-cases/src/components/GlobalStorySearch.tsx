import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Building2,
  MapPin,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SuccessStory } from '../types';
import { searchStories, SearchMatchField } from '../utils/storySearch';
import { useLanguage } from '../context/LanguageContext';

interface GlobalStorySearchProps {
  stories: SuccessStory[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelectStory: (slug: string) => void;
  onApplyFilterToGrid: () => void;
  compact?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const QUICK_FILTER_CHIPS = [
  'Retail',
  'Pharmacy',
  'POS',
  'Multi-branch',
  'Logistics',
  'Accounting',
  'Restaurant',
];

export const GlobalStorySearch: React.FC<GlobalStorySearchProps> = ({
  stories,
  query,
  onQueryChange,
  onSelectStory,
  onApplyFilterToGrid,
  compact = false,
  autoFocus = false,
  className = '',
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    return searchStories(stories, query);
  }, [stories, query]);

  const previewResults = useMemo(() => {
    return results.slice(0, 6);
  }, [results]);

  // Auto focus when requested (e.g. mobile search bar expand)
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
        setIsOpen(true);
      }, 40);
    }
  }, [autoFocus]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to focus navbar search
  useEffect(() => {
    if (compact) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        // Only hijack if this input is actually visible in DOM layout
        if (inputRef.current && inputRef.current.offsetParent !== null) {
          e.preventDefault();
          inputRef.current.focus();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [compact]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset highlighted index when query changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  const getMatchBadgeLabel = (field: SearchMatchField): string => {
    switch (field) {
      case 'industry':
        return t.navSearch.matchIndustry;
      case 'company':
        return t.navSearch.matchCompany;
      case 'module':
        return t.navSearch.matchModule;
      case 'region':
        return t.navSearch.matchRegion;
      default:
        return t.navSearch.matchKeyword;
    }
  };

  const handleSelectResult = (slug: string) => {
    setIsOpen(false);
    inputRef.current?.blur();
    onSelectStory(slug);
  };

  const handleApplyToGrid = () => {
    setIsOpen(false);
    inputRef.current?.blur();
    onApplyFilterToGrid();
  };

  const handleChipClick = (chip: string) => {
    onQueryChange(chip);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setHighlightedIndex((prev) =>
        previewResults.length === 0 ? -1 : (prev + 1) % previewResults.length
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setHighlightedIndex((prev) =>
        previewResults.length === 0
          ? -1
          : prev <= 0
          ? previewResults.length - 1
          : prev - 1
      );
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && previewResults[highlightedIndex]) {
        handleSelectResult(previewResults[highlightedIndex].story.slug);
      } else {
        handleApplyToGrid();
      }
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Pill */}
      <div
        className={`relative flex items-center rounded-lg border transition-all duration-200 ${
          isOpen
            ? 'bg-white dark:bg-[#071827] border-[#0A3D62] dark:border-sky-400 ring-2 ring-[#0A3D62]/15 dark:ring-sky-400/20 shadow-xs'
            : 'bg-slate-100/90 dark:bg-[#0E2236] border-slate-200/90 dark:border-[#1A3852] hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <Search
          className={`w-3.5 h-3.5 shrink-0 ml-2.5 transition-colors ${
            isOpen || hasQuery
              ? 'text-[#0A3D62] dark:text-[#90CF24]'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onQueryChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.navSearch.placeholder}
          aria-label={t.navSearch.ariaLabel}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className={`w-full bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none py-1.5 pl-2 ${
            hasQuery ? 'pr-7' : compact ? 'pr-2.5' : 'pr-11'
          }`}
        />

        {/* Clear Button when text exists, or Ctrl/Cmd+K shortcut badge */}
        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange('');
              inputRef.current?.focus();
              setIsOpen(true);
            }}
            aria-label={t.navSearch.clearLabel}
            title={t.navSearch.clearLabel}
            className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          !compact && (
            <kbd className="hidden xl:inline-flex items-center gap-0.5 absolute right-2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-[#081726] border border-slate-200 dark:border-[#1E3B59] rounded pointer-events-none select-none">
              ⌘K
            </kbd>
          )
        )}
      </div>

      {/* Live Quick-Filter Dropdown Panel */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute mt-2 rounded-xl bg-white dark:bg-[#071F33] border border-slate-200 dark:border-[#163B5D] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            compact
              ? 'left-0 right-0 w-full'
              : 'left-0 sm:left-auto sm:right-0 w-full sm:w-[420px] md:w-[460px]'
          }`}
        >
          {/* Panel Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-[#122F4C] bg-slate-50/80 dark:bg-[#092238] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#7CB518]" />
              <span>
                {hasQuery ? t.navSearch.quickJump : t.navSearch.featuredStories}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#0A3D62] dark:text-sky-300 bg-white dark:bg-[#0B253D] px-2 py-0.5 rounded border border-slate-200/80 dark:border-[#163B5D] tabular-nums">
              {results.length} {t.navSearch.matchingStories}
            </span>
          </div>

          {/* Quick Industry & Keyword Suggestion Chips */}
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-[#122F4C] flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#071F33]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-0.5">
              {t.navSearch.popularTopics}:
            </span>
            {QUICK_FILTER_CHIPS.map((chip) => {
              const isSelected = query.toLowerCase().trim() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A3D62] text-white dark:bg-[#0E4B77]'
                      : 'bg-slate-100 dark:bg-[#0C263F] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#133554]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#102942]">
            {previewResults.length === 0 ? (
              <div className="px-4 py-8 text-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#0B253D] flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.navSearch.noMatches} &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {t.navSearch.tryKeywords}
                </p>
              </div>
            ) : (
              previewResults.map((result, idx) => {
                const { story, matchField } = result;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={story.id}
                    type="button"
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectResult(story.slug)}
                    className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      isHighlighted
                        ? 'bg-sky-50/90 dark:bg-[#0D2B48]'
                        : 'hover:bg-slate-50 dark:hover:bg-[#0B243B]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Industry & Region Kicker */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                        <span className="text-[#0A3D62] dark:text-sky-300 uppercase tracking-wide">
                          {story.industry}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">&middot;</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {story.region}
                        </span>
                        {hasQuery && (
                          <span className="ml-auto sm:ml-1 px-1.5 py-0.2 rounded bg-[#7CB518]/15 text-[#5E8C10] dark:text-[#90CF24] font-mono text-[9px] uppercase">
                            {getMatchBadgeLabel(matchField)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                        {story.title}
                      </p>

                      {/* Company / Profile & Modules */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[230px]">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {story.testimonial?.company || story.businessProfile}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                          <Layers className="w-3 h-3 shrink-0" />
                          {story.modules.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
                      {story.isIllustrative ? (
                        <span title="Illustrative Profile">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        </span>
                      ) : (
                        <span title="Verified Customer">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518]" />
                        </span>
                      )}
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isHighlighted
                            ? 'text-[#0A3D62] dark:text-[#90CF24] translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Action Footer to Apply Filter in Stories Grid */}
          <div className="px-3.5 py-2 border-t border-slate-100 dark:border-[#122F4C] bg-slate-50 dark:bg-[#092238] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleApplyToGrid}
              className="w-full py-1.5 px-3 rounded-lg bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#90CF24]" />
              <span>
                {t.navSearch.viewAllInGrid} ({results.length})
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
