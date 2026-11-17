import React from 'react';
import { Article } from '../types';
import { ArrowRight, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedArticleProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
  onSelectArticle,
}) => {
  const { translateCategory, dict } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16 relative z-10">
      <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-200 dark:hover:border-lime-500/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Image with Subtle Zoom Hover and Featured Badge */}
          <div
            className="lg:col-span-7 relative min-h-[340px] lg:min-h-[460px] overflow-hidden group cursor-pointer"
            onClick={() => onSelectArticle(article)}
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent lg:hidden" />
            
            {/* Featured Sticker / Tag in lemon green */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-lime-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                {dict.featured.featuredBadge}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold">
                {translateCategory(article.category)}
              </span>
            </div>

            {/* Photo caption tag */}
            <div className="absolute bottom-3 left-4 right-4 hidden sm:block">
              <span className="text-[11px] text-white/90 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                {article.featuredImageCaption || 'African SME founder analyzing live MsmeBooks financial dashboard'}
              </span>
            </div>
          </div>

          {/* Right Column: Article Details */}
          <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-white dark:bg-[#0B1E36]">
            <div>
              {/* Category & Kicker for desktop */}
              <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                <span className="text-blue-700 dark:text-lime-400 uppercase tracking-wider font-bold">
                  {translateCategory(article.category)}
                </span>
                <span>·</span>
                <span className="text-slate-400 dark:text-slate-500">{article.contentType}</span>
              </div>

              {/* Title */}
              <h2
                onClick={() => onSelectArticle(article)}
                className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight hover:text-blue-700 dark:hover:text-lime-400 cursor-pointer transition-colors mb-4"
              >
                {article.title}
              </h2>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                {article.excerpt}
              </p>

              {/* Key Bullet Highlights */}
              <div className="space-y-2 mb-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                  <span>Real-time cloud balance sheets vs month-end blind spots</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                  <span>Automated bank feeds reduce reconciliation time by 68%</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta & Read Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Author & Meta */}
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {article.author.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{article.publishedAt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Read Article Button */}
              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-lime-400 dark:hover:bg-lime-500 text-white dark:text-slate-950 font-bold text-sm shadow-sm hover:shadow transition-all group shrink-0"
              >
                <span>{dict.featured.readStory}</span>
                <ArrowRight className="w-4 h-4 text-lime-300 dark:text-slate-950 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
