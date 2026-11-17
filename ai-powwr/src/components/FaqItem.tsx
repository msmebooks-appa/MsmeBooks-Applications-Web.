import React, { useState, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useI18n } from '../context/I18nContext';
import { FaqItemData } from '../types/faq';
import { INITIAL_FAQS } from '../data/faqs';
import { FAQ_CATEGORIES } from '../data/categories';
import {
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
  Coins
} from 'lucide-react';

interface FaqItemProps {
  faq: FaqItemData;
  isOpen: boolean;
  onToggle: () => void;
  onVoteHelpful: (faqId: string, helpful: boolean) => void;
  onSelectRelatedQuestion?: (relatedFaqId: string) => void;
  searchHighlightQuery?: string;
  allFaqs?: FaqItemData[];
}

export const FaqItem: React.FC<FaqItemProps> = ({
  faq,
  isOpen,
  onToggle,
  onVoteHelpful,
  onSelectRelatedQuestion,
  searchHighlightQuery = '',
  allFaqs
}) => {
  const { currencyInfo, formatFromUSD } = useCurrency();
  const { t, translateFaq } = useI18n();
  const item = translateFaq(faq);
  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState<'yes' | 'no' | null>(null);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#faq-${faq.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = (isHelpful: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted) return;
    setHasVoted(isHelpful ? 'yes' : 'no');
    onVoteHelpful(faq.id, isHelpful);
  };

  // Availability badge styling helper
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Beta':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Add-on':
        return 'bg-[#F4FCD9] dark:bg-[#253609] text-[#17233D] dark:text-[#B7E522] border-[#B7E522]';
      case 'Planned':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  // Helper to highlight matching keywords safely
  const highlightText = (text: string, query: string) => {
    if (!query || query.trim().length < 2) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-[#B7E522]/40 dark:bg-[#B7E522]/30 text-[#17233D] dark:text-[#B7E522] font-bold rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Dynamic 3 Related FAQ Articles recommendation engine based on Category and Keyword Tags
  const relatedFaqs = useMemo(() => {
    const pool = (allFaqs && allFaqs.length > 0 ? allFaqs : INITIAL_FAQS).filter(
      (f) => f.id !== faq.id && f.publicationStatus === 'Published'
    );

    const scored = pool.map((candidate) => {
      let score = 0;
      const matchingTags: string[] = [];

      // 1. Direct explicit link in relatedFaqIds
      if (faq.relatedFaqIds && faq.relatedFaqIds.includes(candidate.id)) {
        score += 30;
        matchingTags.push('Curated Link');
      }

      // 2. Exact Category match
      if (candidate.categoryId === faq.categoryId) {
        score += 16;
        const cat = FAQ_CATEGORIES.find((c) => c.id === candidate.categoryId);
        if (cat) {
          matchingTags.push(cat.title.split('&')[0].trim());
        }
      }

      // 3. Keyword tags match
      const currentKeywords = (faq.keywords || []).map((k) => k.toLowerCase().trim());
      const candidateKeywords = (candidate.keywords || []).map((k) => k.toLowerCase().trim());

      currentKeywords.forEach((kw) => {
        if (kw.length > 2 && candidateKeywords.includes(kw)) {
          score += 8;
          if (matchingTags.length < 3 && !matchingTags.includes(`#${kw}`)) {
            matchingTags.push(`#${kw}`);
          }
        }
      });

      // 4. Product Module overlap
      if (faq.productModuleIds && candidate.productModuleIds) {
        const sharedModules = faq.productModuleIds.filter((m) => candidate.productModuleIds?.includes(m));
        if (sharedModules.length > 0) {
          score += sharedModules.length * 5;
        }
      }

      // 5. Industry overlap
      if (faq.industryIds && candidate.industryIds) {
        const sharedIndustries = faq.industryIds.filter((ind) => candidate.industryIds?.includes(ind));
        if (sharedIndustries.length > 0) {
          score += sharedIndustries.length * 4;
        }
      }

      // 6. Subcategory overlap
      if (faq.subcategoryId && candidate.subcategoryId && faq.subcategoryId === candidate.subcategoryId) {
        score += 6;
      }

      // 7. Popularity / Helpful vote tie-breaker
      score += (candidate.isFeatured ? 2 : 0) + (candidate.isPopular ? 2 : 0) + Math.min(candidate.helpfulVotes * 0.05, 3);

      return {
        faq: candidate,
        score,
        matchingTags: matchingTags.slice(0, 2)
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Guarantee 3 suggestions: if scored candidates exist take top 3
    const topScored = scored.slice(0, 3);

    // If fewer than 3, fallback/fill with top published from pool
    if (topScored.length < 3) {
      const existingIds = new Set([faq.id, ...topScored.map((s) => s.faq.id)]);
      const remaining = pool.filter((p) => !existingIds.has(p.id));
      for (const rem of remaining) {
        if (topScored.length >= 3) break;
        const cat = FAQ_CATEGORIES.find((c) => c.id === rem.categoryId);
        topScored.push({
          faq: rem,
          score: 1,
          matchingTags: cat ? [cat.title.split('&')[0].trim()] : ['Suggested']
        });
      }
    }

    return topScored;
  }, [faq, allFaqs]);

  const handleSelectRelated = (relatedId: string, relatedSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onSelectRelatedQuestion) {
      onSelectRelatedQuestion(relatedId);
    }

    // Wait for React state/filter updates so the target article is mounted and expanded before scrolling
    setTimeout(() => {
      const openTarget = document.querySelector<HTMLElement>(
        `[data-faq-id="${relatedId}"][data-faq-open="true"]`
      );
      const el = openTarget || document.getElementById(`faq-${relatedSlug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-[#1254B5]', 'dark:ring-[#B7E522]', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-[#1254B5]', 'dark:ring-[#B7E522]');
        }, 1500);
      }
    }, 80);
  };

  return (
    <article
      id={`faq-${faq.slug}`}
      data-faq-id={faq.id}
      data-faq-open={isOpen ? 'true' : 'false'}
      className={`border rounded-2xl transition-all duration-200 bg-white dark:bg-[#131E36] overflow-hidden ${
        isOpen
          ? 'border-[#1254B5]/50 dark:border-blue-500/50 shadow-md ring-1 ring-[#1254B5]/20 dark:ring-blue-500/30'
          : 'border-slate-200/90 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-500/60 hover:shadow-xs'
      }`}
    >
      {/* Accordion Header */}
      <div className="w-full py-4.5 px-5 sm:px-6 flex items-start justify-between gap-4">
        {/* Toggle Question Button */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex-1 text-left cursor-pointer focus:outline-none group pr-2"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                faq.featureStatus
              )}`}
            >
              {faq.featureStatus}
            </span>

            {faq.subscriptionPlan !== 'All Plans' && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {faq.subscriptionPlan}
              </span>
            )}

            {faq.isFeatured && (
              <span className="text-[11px] font-semibold text-[#1254B5] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-900/50">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#17233D] dark:text-slate-100 group-hover:text-[#1254B5] dark:group-hover:text-[#B7E522] transition-colors leading-snug">
            {highlightText(item.question, searchHighlightQuery)}
          </h3>
        </button>

        {/* Action Buttons (Copy link & Toggle chevron) */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          <button
            type="button"
            onClick={handleCopyLink}
            title={t('faq.copyLink', 'Copy direct link to this FAQ')}
            aria-label={t('faq.copyLink', 'Copy direct link to this FAQ')}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-[#1254B5] dark:hover:text-[#B7E522] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isOpen ? 'bg-[#1254B5] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Expanded Body (Progressive Disclosure) */}
      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 space-y-4 animate-fadeIn">
          {/* Direct Short Answer (Section 27) */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            <span className="text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wide block mb-1">
              {t('faq.directSummary', 'Direct Summary')}
            </span>
            {highlightText(item.shortAnswer, searchHighlightQuery)}
          </div>

          {/* Detailed Guidance & Explanations */}
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>{highlightText(item.detailedAnswer, searchHighlightQuery)}</p>
          </div>

          {/* Live Currency Benchmark Card for Pricing & Billing questions */}
          {(faq.categoryId === 'pricing-billing' || faq.id === 'faq-is-msmebooks-free' || faq.id === 'faq-pricing-cost') && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/60 dark:from-[#131E36] dark:to-[#17233D] border border-blue-200 dark:border-blue-900/60 text-xs">
              <div className="font-bold flex items-center justify-between text-[#1254B5] dark:text-[#B7E522] mb-2">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  {t('faq.livePlanBenchmarks', 'Live Plan Benchmarks in')} {currencyInfo.flag} {currencyInfo.code} ({currencyInfo.symbol}):
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-[#1254B5] dark:text-blue-300 px-2 py-0.5 rounded-full font-mono">
                  1$ = {currencyInfo.rateAgainstUSD.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Free Starter</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatFromUSD(0)}</span>
                </div>
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Growth Retail</span>
                  <span className="font-bold text-[#1254B5] dark:text-blue-300">{formatFromUSD(15)}/mo</span>
                </div>
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Enterprise</span>
                  <span className="font-bold text-[#1254B5] dark:text-blue-300">{formatFromUSD(49)}/mo</span>
                </div>
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Hotel PMS</span>
                  <span className="font-bold text-[#17233D] dark:text-[#B7E522]">+{formatFromUSD(20)}/mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions if provided */}
          {item.steps && item.steps.length > 0 && (
            <div className="mt-3 bg-slate-50 dark:bg-[#0E1726]/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-2.5">
                {t('faq.stepByStep', 'Step-by-Step Instructions:')}
              </span>
              <ol className="space-y-2">
                {item.steps.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-[#1254B5] dark:bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Related Landing Pages & Resources */}
          {faq.relatedLandingPages && faq.relatedLandingPages.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
                {t('faq.exploreRelated', 'Explore Related:')}
              </span>
              {faq.relatedLandingPages.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1254B5] dark:text-blue-300 hover:text-[#0A3D87] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2.5 py-1 rounded-md transition"
                >
                  <span>{link.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}

          {/* Metadata Footer: Reviewed Date, Author, and Helpfulness Vote (Section 27) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {t('faq.lastReviewed', 'Last reviewed')}: <strong className="text-slate-700 dark:text-slate-200">{faq.lastVerifiedDate}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {t('faq.verifiedBy', 'Verified by')}: {faq.reviewer}
              </span>
            </div>

            {/* "Was this answer helpful?" (Section 27) */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-[#0E1726] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {t('faq.wasHelpful', 'Was this helpful?')}
              </span>
              <button
                onClick={(e) => handleVote(true, e)}
                disabled={hasVoted !== null}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold transition cursor-pointer ${
                  hasVoted === 'yes'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
                title="Mark as helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t('faq.yes', 'Yes')} ({faq.helpfulVotes + (hasVoted === 'yes' ? 1 : 0)})</span>
              </button>

              <button
                onClick={(e) => handleVote(false, e)}
                disabled={hasVoted !== null}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold transition cursor-pointer ${
                  hasVoted === 'no'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300'
                }`}
                title="Mark as unhelpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{t('faq.no', 'No')}</span>
              </button>
            </div>
          </div>

          {/* Feedback response toast */}
          {hasVoted && (
            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {hasVoted === 'yes' ? t('faq.thanksHelpful') : t('faq.thanksUnhelpful')}
            </div>
          )}

          {/* Related Articles Section (driven by relatedFaqIds + category/keyword tags) */}
          {relatedFaqs && relatedFaqs.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[#1254B5] dark:text-[#B7E522] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#17233D] dark:text-white flex items-center gap-1.5">
                    <span>{t('faq.relatedArticles', 'Related Articles')}</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {relatedFaqs.length}
                    </span>
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                  {t('faq.suggestedByTags', 'Suggested based on related links, category & tags')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {relatedFaqs.map(({ faq: relFaq, matchingTags }) => {
                  const translatedRel = translateFaq(relFaq);
                  return (
                    <button
                      key={relFaq.id}
                      type="button"
                      onClick={(e) => handleSelectRelated(relFaq.id, relFaq.slug, e)}
                      className="text-left rounded-xl p-3 bg-slate-50/80 dark:bg-[#0E1726]/90 hover:bg-blue-50/60 dark:hover:bg-[#162544] border border-slate-200/80 dark:border-slate-800 hover:border-[#1254B5]/40 dark:hover:border-[#B7E522]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm"
                    >
                      <div>
                        {/* Tags & Feature Status Header */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            {matchingTags && matchingTags.length > 0 ? (
                              matchingTags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#1254B5] dark:text-[#B7E522] bg-blue-100/60 dark:bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60 truncate max-w-[110px]"
                                >
                                  <Tag className="w-2.5 h-2.5 shrink-0 opacity-70" />
                                  <span className="truncate">{tag}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Related
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${getBadgeStyle(
                              relFaq.featureStatus
                            )}`}
                          >
                            {relFaq.featureStatus}
                          </span>
                        </div>

                        {/* Question */}
                        <p className="text-xs font-bold text-[#17233D] dark:text-slate-100 line-clamp-2 group-hover:text-[#1254B5] dark:group-hover:text-[#B7E522] transition-colors leading-snug">
                          {translatedRel.question}
                        </p>

                        {/* Answer brief preview */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {translatedRel.shortAnswer}
                        </p>
                      </div>

                      {/* Action footer */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#1254B5] dark:text-[#B7E522]">
                        <span>{t('faq.readArticle', 'Read answer')}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
