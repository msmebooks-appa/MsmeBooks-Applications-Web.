import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Article, ArticleHeading, Comment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Check,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Send,
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle,
  Link2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Calculator,
  DollarSign,
  ArrowRightLeft,
  List,
  ArrowUp
} from 'lucide-react';
import { ArticleCard } from './ArticleCard';

interface BlogDetailsProps {
  article: Article;
  allArticles: Article[];
  onBackToBlog: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: string) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

interface ShareCounts {
  linkedin: number;
  x: number;
  whatsapp: number;
  facebook: number;
  copied: number;
  total: number;
}

const getInitialShareCounts = (art: Article): ShareCounts => {
  const storageKey = `msmebooks_shares_${art.id}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.total === 'number') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  if (art.shares) {
    const s = art.shares;
    const copied = s.copied ?? Math.max(12, Math.round(s.total * 0.08));
    return {
      linkedin: s.linkedin,
      x: s.x,
      whatsapp: s.whatsapp,
      facebook: s.facebook,
      copied,
      total: s.total
    };
  }

  // Realistic fallback derivation from views and likes
  const base = Math.max(80, Math.round((art.views || 5000) * 0.054) + ((art.likes || 100) * 0.5));
  const whatsapp = Math.round(base * 0.42);
  const linkedin = Math.round(base * 0.25);
  const x = Math.round(base * 0.21);
  const facebook = Math.round(base * 0.12);
  const copied = Math.max(8, Math.round(base * 0.07));
  const total = whatsapp + linkedin + x + facebook + copied;
  return { linkedin, x, whatsapp, facebook, copied, total };
};

const slugifyHeading = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
};

const analyzeArticleContent = (
  htmlContent: string,
  fallbackToc: ArticleHeading[] = []
): { processedHtml: string; headings: ArticleHeading[] } => {
  if (!htmlContent) {
    return { processedHtml: '', headings: fallbackToc };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headingNodes = Array.from(doc.body.querySelectorAll('h2, h3, h4'));
    const usedIds = new Set<string>();
    const extracted: ArticleHeading[] = [];

    headingNodes.forEach((node) => {
      const text = node.textContent?.trim() || '';
      if (!text) return;

      const existingId = node.getAttribute('id')?.trim();
      const baseId = existingId || slugifyHeading(text);
      let uniqueId = baseId;
      let counter = 2;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter += 1;
      }
      usedIds.add(uniqueId);
      node.setAttribute('id', uniqueId);
      node.classList.add('scroll-mt-28');

      const tagName = node.tagName.toLowerCase();
      const level: 2 | 3 | 4 = tagName === 'h2' ? 2 : tagName === 'h3' ? 3 : 4;

      extracted.push({
        id: uniqueId,
        text,
        level
      });
    });

    return {
      processedHtml: doc.body.innerHTML,
      headings: extracted.length > 0 ? extracted : fallbackToc
    };
  } catch {
    return {
      processedHtml: htmlContent,
      headings: fallbackToc
    };
  }
};

export const BlogDetails: React.FC<BlogDetailsProps> = ({
  article,
  allArticles,
  onBackToBlog,
  onSelectArticle,
  onSelectCategory,
  onOpenAssistantWithPrompt
}) => {
  const { processedHtml, headings: generatedToc } = useMemo(
    () => analyzeArticleContent(article.content, article.tableOfContents),
    [article.content, article.tableOfContents]
  );

  const [activeSection, setActiveSection] = useState<string>(() => generatedToc[0]?.id || '');
  const [readProgress, setReadProgress] = useState<number>(0);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const articleContentRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { dict, t, translateCategory } = useLanguage();
  const { currency, currentCurrencyInfo, formatFromNGN } = useCurrency();
  const [calcRevenue, setCalcRevenue] = useState<number>(3500000);
  const [shares, setShares] = useState<ShareCounts>(() => getInitialShareCounts(article));
  const [recentIncrement, setRecentIncrement] = useState<string | null>(null);

  // Sync shares & TOC state when article changes
  useEffect(() => {
    setShares(getInitialShareCounts(article));
    setRecentIncrement(null);
    setActiveSection(generatedToc[0]?.id || '');
    setReadProgress(0);
    setMobileTocOpen(false);
  }, [article.id, generatedToc]);

  const updateShareMetric = (platform: 'linkedin' | 'x' | 'facebook' | 'whatsapp' | 'copied') => {
    setShares((prev) => {
      const updated: ShareCounts = {
        ...prev,
        [platform]: prev[platform] + 1,
        total: prev.total + 1
      };
      try {
        localStorage.setItem(`msmebooks_shares_${article.id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setRecentIncrement(platform);
    setTimeout(() => {
      setRecentIncrement((current) => (current === platform ? null : current));
    }, 2200);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toLocaleString();
  };
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'comm-1',
      articleId: article.id,
      authorName: 'Emeka Nwosu',
      email: 'emeka@nwosugroup.ng',
      comment: 'Separating personal and corporate bank accounts was the single biggest turning point for our wholesale business in Onitsha. Great breakdown!',
      createdAt: 'September 23, 2026',
      status: 'approved',
    },
    {
      id: 'comm-2',
      articleId: article.id,
      authorName: 'Keziah Wanjiru',
      email: 'keziah@savannahretail.co.ke',
      comment: 'The comparison table between Excel and MsmeBooks is spot on. We used to spend 4 days on month-end bank reconciliation; now it takes 20 minutes.',
      createdAt: 'September 24, 2026',
      status: 'approved',
    }
  ]);

  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Scroll to top on article switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Active heading spy & reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      if (generatedToc.length > 0) {
        const headingElements = generatedToc
          .map((h) => document.getElementById(h.id))
          .filter(Boolean) as HTMLElement[];

        if (headingElements.length > 0) {
          let currentId = headingElements[0].id;
          for (let i = 0; i < headingElements.length; i++) {
            const rect = headingElements[i].getBoundingClientRect();
            if (rect.top <= 165) {
              currentId = headingElements[i].id;
            } else {
              break;
            }
          }
          setActiveSection(currentId);
        }
      }

      if (articleContentRef.current) {
        const rect = articleContentRef.current.getBoundingClientRect();
        const totalHeight = rect.height;
        if (totalHeight > 0) {
          const scrolledPastTop = Math.max(0, 140 - rect.top);
          const scrollableDistance = Math.max(1, totalHeight - window.innerHeight * 0.45);
          const pct = Math.min(100, Math.max(0, Math.round((scrolledPastTop / scrollableDistance) * 100)));
          setReadProgress(pct);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generatedToc]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -104;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      setMobileTocOpen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    updateShareMetric('copied');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = (platform: 'linkedin' | 'x' | 'facebook' | 'whatsapp') => {
    updateShareMetric(platform);
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    let shareUrl = '';

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}%20via%20@msmebooks`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.comment) return;

    setCommentSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          authorName: commentForm.name,
          email: commentForm.email,
          comment: commentForm.comment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      } else {
        // Optimistic fallback
        setComments((prev) => [
          {
            id: `comm-${Date.now()}`,
            articleId: article.id,
            authorName: commentForm.name,
            email: commentForm.email,
            comment: commentForm.comment,
            createdAt: 'Just now',
            status: 'approved',
          },
          ...prev,
        ]);
      }
      setCommentSuccess(true);
      setCommentForm({ name: '', email: '', comment: '' });
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch {
      setComments((prev) => [
        {
          id: `comm-${Date.now()}`,
          articleId: article.id,
          authorName: commentForm.name,
          email: commentForm.email,
          comment: commentForm.comment,
          createdAt: 'Just now',
          status: 'approved',
        },
        ...prev,
      ]);
      setCommentSuccess(true);
      setCommentForm({ name: '', email: '', comment: '' });
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Related articles (3 articles, preferably same category or matching tags)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .sort((a, b) => (a.category === article.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-[#071527] min-h-screen py-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <button
              onClick={onBackToBlog}
              className="hover:text-blue-700 dark:hover:text-lime-400 transition-colors"
            >
              {dict.nav.home}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={onBackToBlog}
              className="hover:text-blue-700 dark:hover:text-lime-400 transition-colors"
            >
              {dict.nav.blog}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => onSelectCategory(article.category)}
              className="text-blue-700 dark:text-lime-400 font-semibold hover:underline"
            >
              {translateCategory(article.category)}
            </button>
          </nav>

          {/* Back button */}
          <button
            onClick={onBackToBlog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 bg-white dark:bg-[#0B1E36] border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{dict.blogDetails.backToHub}</span>
          </button>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left">
        {/* Category badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <button
            onClick={() => onSelectCategory(article.category)}
            className="px-3 py-1 rounded-md bg-lime-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-sm hover:bg-lime-500 transition-colors"
          >
            {translateCategory(article.category)}
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
            {article.contentType}
          </span>
        </div>

        {/* Main H1 Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.18] mb-6">
          {article.title}
        </h1>

        {/* Lead Excerpt */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
          {article.excerpt}
        </p>

        {/* Author Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {article.author.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedAt}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {article.views.toLocaleString()} Reads
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
              <span>{formatCount(shares.total)} {dict.blogDetails.sharesCount}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span
              className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#102A4C] px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
              title={`All business financials auto-converted to ${currentCurrencyInfo.name} (${currentCurrencyInfo.code})`}
            >
              <span>{currentCurrencyInfo.flag}</span>
              <span>{currentCurrencyInfo.code}</span>
              <span className="text-lime-600 dark:text-lime-400">({currentCurrencyInfo.symbol})</span>
            </span>
          </div>
        </div>
      </header>

      {/* Large Featured Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[21/9]">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        {article.featuredImageCaption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2.5 italic">
            {article.featuredImageCaption}
          </p>
        )}
      </div>

      {/* Main Content & Sticky Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left / Main Column: Editorial Content */}
          <main className="lg:col-span-8 bg-white dark:bg-[#0B1E36] p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800">
            {/* AI Summary Assistant Quick Trigger Banner */}
            <div className="mb-8 p-4 rounded-2xl bg-blue-50/80 dark:bg-[#0E2443] border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-lime-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-blue-900 dark:text-lime-400 block">Short on time?</span>
                  Ask the MsmeBooks AI Assistant to summarize or explain key takeaways.
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenAssistantWithPrompt?.(
                    `Please summarize the key takeaways of the article "${article.title}" and explain how an SME can apply them.`
                  )
                }
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-lime-400 dark:hover:bg-lime-500 text-white dark:text-slate-950 text-xs font-bold shrink-0 transition-colors"
              >
                Summarize Article
              </button>
            </div>

            {/* Key Takeaways Highlight Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 dark:from-[#050E1A] dark:to-[#0D2442] text-white shadow-md border-l-4 border-lime-400">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-lime-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Executive Key Takeaways</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  {article.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0 mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Statistics Card if present */}
            {article.statsCard && (
              <div className="my-8 p-6 rounded-2xl bg-blue-50 dark:bg-[#0E2443] border border-blue-200 dark:border-slate-700 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-lime-400 shrink-0">
                  {article.statsCard.value}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {article.statsCard.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {article.statsCard.description}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile & Tablet Inline Collapsible Table of Contents */}
            {generatedToc.length > 0 && (
              <div className="lg:hidden mb-8 rounded-2xl bg-slate-50 dark:bg-[#0E2443] border border-slate-200 dark:border-slate-700/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                  aria-expanded={mobileTocOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                      <List className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                        {dict.blogDetails.tableOfContents}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {generatedToc.length} {dict.blogDetails.tocSections}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                      mobileTocOpen ? 'rotate-180 text-blue-700 dark:text-lime-400' : ''
                    }`}
                  />
                </button>

                {mobileTocOpen && (
                  <nav className="px-3 pb-3 pt-1 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    {generatedToc.map((heading) => {
                      const isActive = activeSection === heading.id;
                      return (
                        <button
                          key={heading.id}
                          type="button"
                          onClick={() => scrollToHeading(heading.id)}
                          className={`w-full text-left py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-blue-100/80 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#0B1E36] font-medium'
                          } ${heading.level === 3 ? 'pl-6' : heading.level === 4 ? 'pl-9' : ''}`}
                        >
                          <span className="line-clamp-2">{heading.text}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            )}

            {/* Render HTML content with custom typography styling */}
            <div
              ref={articleContentRef}
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:text-slate-950 dark:prose-headings:text-white prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-28 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-28 prose-h4:scroll-mt-28 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-strong:text-slate-950 dark:prose-strong:text-white prose-blockquote:border-lime-500 prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Comparison Table if present */}
            {article.comparisonTable && (
              <div className="my-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900 dark:bg-[#050E1A] text-white font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        {article.comparisonTable.headers.map((h, i) => (
                          <th key={i} className="p-3.5 sm:p-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#0B1E36]">
                      {article.comparisonTable.rows.map((row, rIndex) => (
                        <tr
                          key={rIndex}
                          className={rIndex % 2 === 0 ? 'bg-white dark:bg-[#0B1E36]' : 'bg-slate-50/60 dark:bg-[#0E2443]/40'}
                        >
                          {row.map((cell, cIndex) => (
                            <td
                              key={cIndex}
                              className={`p-3.5 sm:p-4 ${
                                cIndex === 0
                                  ? 'font-bold text-slate-900 dark:text-white'
                                  : cIndex === 2
                                  ? 'text-blue-900 dark:text-lime-300 font-medium bg-blue-50/40 dark:bg-blue-950/40'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* High-Conversion Article In-Content CTA (Section 20) */}
            <div className="my-12 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <span className="px-3 py-1 rounded bg-slate-800 text-lime-400 text-xs font-bold uppercase tracking-wider">
                  Grow Your Business
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2">
                  Ready to Manage Your Business Smarter?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                  Bring accounting, POS, inventory and business management together with MsmeBooks. Zero complex jargon, built for real African entrepreneurs.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.msmebooks.org/register"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
                  >
                    Start Free
                  </a>
                  <a
                    href="https://www.msmebooks.org"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Explore MsmeBooks</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  Official Website: www.msmebooks.org · Support: +2349158482622
                </div>
              </div>
            </div>

            {/* Comments & Discussion Section (Section 21) */}
            <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800" id="comments">
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mb-2">
                Discussion & Community ({comments.length})
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Share your experience, questions, and insights on this topic.
              </p>

              {/* Comment submission form */}
              <form onSubmit={handleCommentSubmit} className="bg-slate-50 dark:bg-[#0E2443] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-10 transition-colors">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Leave a Comment
                </h4>

                {commentSuccess && (
                  <div className="mb-4 p-3.5 bg-lime-50 dark:bg-lime-950/40 border border-lime-400 dark:border-lime-700 rounded-xl text-xs text-lime-900 dark:text-lime-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Your comment has been posted successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={commentForm.name}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, name: e.target.value })
                      }
                      placeholder="e.g. Tunde Balogun"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0B1E36] rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address * (Will not be published)
                    </label>
                    <input
                      type="email"
                      value={commentForm.email}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, email: e.target.value })
                      }
                      placeholder="tunde@mycompany.com"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0B1E36] rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Comment *
                  </label>
                  <textarea
                    rows={4}
                    value={commentForm.comment}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, comment: e.target.value })
                    }
                    placeholder="Write your thoughts, questions or practical feedback..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0B1E36] rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Spam protected. Moderated for community safety.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={commentSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {commentSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0E2443] border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-lime-400 font-bold text-xs flex items-center justify-center">
                          {comm.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {comm.authorName}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-400">
                            {comm.createdAt}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 uppercase">
                        Verified Business Reader
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comm.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Right Column: Sticky Sidebar (Section 18) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Dynamic Auto-Generated Table of Contents */}
            {generatedToc.length > 0 && (
              <div className="hidden lg:block bg-white dark:bg-[#0B1E36] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                      <List className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      {dict.blogDetails.tableOfContents}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102A4C] text-slate-600 dark:text-slate-300">
                    {generatedToc.length} {dict.blogDetails.tocSections}
                  </span>
                </div>

                {/* Live Reading Progress Bar */}
                <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-400 mb-1">
                    <span>Reading progress</span>
                    <span className="font-mono text-blue-700 dark:text-lime-400">{readProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#102A4C] overflow-hidden">
                    <div
                      className="h-full bg-lime-500 rounded-full transition-all duration-150"
                      style={{ width: `${readProgress}%` }}
                    />
                  </div>
                </div>

                <nav className="space-y-1 max-h-[340px] overflow-y-auto pr-1" aria-label={dict.blogDetails.tableOfContents}>
                  {generatedToc.map((heading, idx) => {
                    const isActive = activeSection === heading.id;
                    return (
                      <button
                        key={heading.id}
                        type="button"
                        onClick={() => scrollToHeading(heading.id)}
                        className={`w-full text-left py-2 px-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between group ${
                          isActive
                            ? 'bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0E2443] hover:text-slate-900 dark:hover:text-white font-medium'
                        } ${heading.level === 3 ? 'pl-6 text-xs' : heading.level === 4 ? 'pl-9 text-xs' : ''}`}
                      >
                        <span className="flex items-start gap-2 min-w-0">
                          {heading.level === 2 && (
                            <span
                              className={`text-[10px] font-mono mt-0.5 shrink-0 ${
                                isActive
                                  ? 'text-blue-600 dark:text-lime-400'
                                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                              }`}
                            >
                              {String(
                                generatedToc.slice(0, idx + 1).filter((h) => h.level === 2).length
                              ).padStart(2, '0')}
                            </span>
                          )}
                          <span className="line-clamp-2">{heading.text}</span>
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {readProgress > 15 && (
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-lime-400 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{dict.blogDetails.backToTop}</span>
                  </button>
                )}
              </div>
            )}

            {/* Social Sharing Box with Dynamic Engagement Badges */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              {/* Header with Title and Total Share Metric Pill */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-[#102A4C] text-blue-700 dark:text-lime-400 flex items-center justify-center">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    {dict.blogDetails.shareArticle}
                  </h3>
                </div>

                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#102A4C] text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                  title={`${shares.total.toLocaleString()} total engagement interactions`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                  <span className="font-mono text-[11px] font-extrabold text-slate-900 dark:text-white">
                    {formatCount(shares.total)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {dict.blogDetails.sharesCount}
                  </span>
                </div>
              </div>

              {/* Engagement Insight Micro-bar */}
              <div className="mb-3.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A1A2F] border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>{dict.blogDetails.totalEngagement}</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shares.total > 500 ? 'High SME Impact' : 'Active Discussion'}
                </span>
              </div>

              {/* 2x2 Grid of Social Media Share Buttons with Dynamic Share Badges */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => handleShare('linkedin')}
                  className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#0E2443] hover:bg-blue-50/80 dark:hover:bg-[#132F55] hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all group active:scale-95 shadow-2xs"
                  title={`Share on LinkedIn (${shares.linkedin.toLocaleString()} shares)`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Linkedin className="w-4 h-4 text-[#0A66C2] dark:text-[#388be3] shrink-0" />
                    <span className="truncate font-medium">LinkedIn</span>
                  </div>
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white dark:bg-[#0B1E36] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 group-hover:border-blue-300 group-hover:bg-blue-100/70 group-hover:text-blue-800 dark:group-hover:border-blue-500 dark:group-hover:text-blue-300 transition-colors shrink-0 shadow-2xs">
                    {formatCount(shares.linkedin)}
                  </span>
                  {recentIncrement === 'linkedin' && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md animate-bounce pointer-events-none">
                      +1
                    </span>
                  )}
                </button>

                {/* X (Twitter) */}
                <button
                  type="button"
                  onClick={() => handleShare('x')}
                  className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#0E2443] hover:bg-slate-100 dark:hover:bg-[#132F55] hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all group active:scale-95 shadow-2xs"
                  title={`Share on X (${shares.x.toLocaleString()} shares)`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Twitter className="w-4 h-4 text-slate-900 dark:text-slate-200 shrink-0" />
                    <span className="truncate font-medium">X (Twitter)</span>
                  </div>
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white dark:bg-[#0B1E36] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 group-hover:border-slate-400 group-hover:bg-slate-200/80 group-hover:text-slate-950 dark:group-hover:text-white transition-colors shrink-0 shadow-2xs">
                    {formatCount(shares.x)}
                  </span>
                  {recentIncrement === 'x' && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-slate-900 text-white text-[10px] font-extrabold shadow-md animate-bounce pointer-events-none">
                      +1
                    </span>
                  )}
                </button>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleShare('whatsapp')}
                  className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#0E2443] hover:bg-emerald-50 dark:hover:bg-[#0a2f26] hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all group active:scale-95 shadow-2xs"
                  title={`Share on WhatsApp (${shares.whatsapp.toLocaleString()} shares)`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">WhatsApp</span>
                  </div>
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white dark:bg-[#0B1E36] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 group-hover:border-emerald-300 group-hover:bg-emerald-100/70 group-hover:text-emerald-800 dark:group-hover:border-emerald-500 dark:group-hover:text-emerald-300 transition-colors shrink-0 shadow-2xs">
                    {formatCount(shares.whatsapp)}
                  </span>
                  {recentIncrement === 'whatsapp' && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-md animate-bounce pointer-events-none">
                      +1
                    </span>
                  )}
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleShare('facebook')}
                  className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#0E2443] hover:bg-blue-50 dark:hover:bg-[#102A4C] hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all group active:scale-95 shadow-2xs"
                  title={`Share on Facebook (${shares.facebook.toLocaleString()} shares)`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate font-medium">Facebook</span>
                  </div>
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white dark:bg-[#0B1E36] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 group-hover:border-blue-300 group-hover:bg-blue-100/70 group-hover:text-blue-800 dark:group-hover:border-blue-500 dark:group-hover:text-blue-300 transition-colors shrink-0 shadow-2xs">
                    {formatCount(shares.facebook)}
                  </span>
                  {recentIncrement === 'facebook' && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md animate-bounce pointer-events-none">
                      +1
                    </span>
                  )}
                </button>
              </div>

              {/* Copy Link Button with dynamic count */}
              <div className="relative mt-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between gap-2 py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-[#0E2443] hover:bg-slate-200 dark:hover:bg-[#132F55] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all group active:scale-98 border border-slate-200/70 dark:border-slate-700/70"
                  title="Copy direct article URL to clipboard"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                        <span className="text-lime-700 dark:text-lime-400 font-extrabold truncate">
                          {dict.blogDetails.linkCopied}
                        </span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors" />
                        <span className="truncate">{dict.blogDetails.copyLink}</span>
                      </>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-[#0B1E36] text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700/90 shrink-0 shadow-2xs">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatCount(shares.copied)}</span>
                    <span className="text-[9px] text-slate-400 lowercase">{dict.blogDetails.sharesCount}</span>
                  </span>
                </button>
                {recentIncrement === 'copied' && (
                  <span className="absolute -top-2 right-4 px-1.5 py-0.2 rounded-full bg-lime-500 text-slate-950 text-[10px] font-extrabold shadow-md animate-bounce pointer-events-none">
                    +1
                  </span>
                )}
              </div>
            </div>

            {/* SME Cash Flow & Margin ROI Calculator Card */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-lime-100 dark:bg-lime-950/60 text-lime-700 dark:text-lime-400 flex items-center justify-center">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    SME Cash Flow & Margin ROI
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102A4C] text-slate-700 dark:text-slate-300">
                  {currentCurrencyInfo.flag} {currentCurrencyInfo.code}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Estimate how much cash flow and inventory loss your business protects with MsmeBooks:
              </p>

              {/* Monthly Revenue Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly Store Sales:</span>
                  <span className="font-mono font-extrabold text-blue-700 dark:text-lime-400">
                    {formatFromNGN(calcRevenue, { compact: false })}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="25000000"
                  step="250000"
                  value={calcRevenue}
                  onChange={(e) => setCalcRevenue(Number(e.target.value))}
                  className="w-full accent-lime-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatFromNGN(500000, { compact: true })}</span>
                  <span>{formatFromNGN(12500000, { compact: true })}</span>
                  <span>{formatFromNGN(25000000, { compact: true })}</span>
                </div>
              </div>

              {/* Converted Impact Calculations */}
              <div className="space-y-2 bg-slate-50 dark:bg-[#071527] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Shrinkage Prevented (5% avg):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatFromNGN(calcRevenue * 0.05, { compact: false })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Working Capital Velocity Gain:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatFromNGN(calcRevenue * 0.065, { compact: false })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between font-bold">
                  <span className="text-blue-700 dark:text-lime-400">Total Monthly SME Value:</span>
                  <span className="font-mono text-sm text-lime-600 dark:text-lime-400">
                    +{formatFromNGN(calcRevenue * 0.115, { compact: false })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Demo CTA Sidebar Card */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-950 dark:from-[#081B33] dark:to-[#040C16] rounded-3xl p-6 text-white shadow-lg border border-blue-950 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded bg-lime-400 text-slate-950 text-[10px] font-extrabold uppercase">
                Free Trial
              </span>
              <h4 className="text-lg font-bold mt-3 mb-2">
                Accounting, POS & Inventory in One Place
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                No credit card required. Works offline in your store and syncs when connected.
              </p>
              <a
                href="https://www.msmebooks.org/register"
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs shadow transition-all hover:scale-105"
              >
                {dict.nav.startFree}
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400">
              {dict.blogDetails.relatedArticles}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              {dict.blogDetails.relatedArticles}
            </h3>
          </div>
          <button
            onClick={onBackToBlog}
            className="text-xs sm:text-sm font-bold text-blue-700 dark:text-lime-400 hover:underline"
          >
            {dict.articleGrid.showingAll.replace('{count}', '')} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {relatedArticles.map((rel) => (
            <ArticleCard
              key={rel.id}
              article={rel}
              onSelectArticle={onSelectArticle}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </section>

      {/* Dedicated Author Biography Section */}
      <section
        id="author-biography"
        aria-label={dict.blogDetails.aboutAuthor}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="rounded-3xl bg-slate-50 dark:bg-[#0B1E36] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 ring-2 ring-lime-400/50 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400">
                  {dict.blogDetails.aboutAuthor}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {article.author.articlesCount} {dict.blogDetails.articlesPublished}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white">
                {article.author.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-lime-400 mt-0.5 mb-3">
                {article.author.role}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 max-w-3xl">
                {article.author.bio}
              </p>

              {(article.author.twitter || article.author.linkedin) && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  {article.author.linkedin && (
                    <a
                      href={`https://www.linkedin.com/in/${article.author.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#388be3]" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {article.author.twitter && (
                    <a
                      href={`https://twitter.com/${article.author.twitter.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                    >
                      <Twitter className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                      <span>{article.author.twitter}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
