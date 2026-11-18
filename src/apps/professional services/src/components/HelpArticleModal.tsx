import React from 'react';
import { X, BookOpen, Clock, Tag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HelpArticle } from '../data/helpArticles';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';

interface HelpArticleModalProps {
  article: HelpArticle | null;
  onClose: () => void;
  onBookRecommendedService?: (service: ServiceItem) => void;
}

export const HelpArticleModal: React.FC<HelpArticleModalProps> = ({
  article,
  onClose,
  onBookRecommendedService,
}) => {
  if (!article) return null;

  const recommendedService = article.recommendedServiceId
    ? SERVICES_CATALOGUE.find(s => s.id === article.recommendedServiceId)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1464C8] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#B7E532] uppercase tracking-wider block">
                MsmeBooks Knowledge Base • {article.category}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#102B4E] dark:text-white leading-tight">
            {article.title}
          </h2>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium italic">
            "{article.snippet}"
          </div>

          <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>{article.content}</p>
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {article.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Recommended Service CTA */}
          {recommendedService && onBookRecommendedService && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#102B4E] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase text-[#B7E532] tracking-wider block">
                  Recommended Solution For This Topic
                </span>
                <h4 className="text-sm font-black mt-0.5">{recommendedService.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{recommendedService.shortOverview}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookRecommendedService(recommendedService);
                }}
                className="px-4 py-2 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
