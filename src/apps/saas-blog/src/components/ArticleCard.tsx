import React from 'react';
import { Article } from '../types';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onSelectCategory?: (category: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  onSelectCategory
}) => {
  const { translateCategory, dict } = useLanguage();

  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group relative flex flex-col bg-white dark:bg-[#0B1E36] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-slate-950/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
    >
      {/* Lemon-green accent top line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Image Container with Zoom effect */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={article.featuredImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory?.(article.category);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase hover:bg-blue-800 dark:hover:bg-[#15345E] transition-colors shadow-sm"
          >
            {translateCategory(article.category)}
          </button>
        </div>

        {/* Content Type tag if not standard */}
        {article.contentType !== 'Articles' && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-2 py-0.5 rounded bg-lime-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              {article.contentType}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Unboxed Metadata Header (Anti-slop) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-semibold text-blue-700 dark:text-lime-400">{translateCategory(article.category)}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span>{article.publishedAt}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            {article.readTime}
          </span>
        </div>

        {/* Article Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors mb-3 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Footer: Author & Read More Link with animated arrow */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
              {article.author.name}
            </span>
          </div>

          {/* Read More Link */}
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-lime-400 group-hover:text-blue-900 dark:group-hover:text-lime-300 transition-colors">
            <span>{dict.articleCard.readArticle}</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </article>
  );
};
