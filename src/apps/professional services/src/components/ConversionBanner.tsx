import React from 'react';
import { 
  ArrowRight, 
  Users, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface ConversionBannerProps {
  onExploreClick: () => void;
  onFindFirmClick: () => void;
}

export const ConversionBanner: React.FC<ConversionBannerProps> = ({
  onExploreClick,
  onFindFirmClick,
}) => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-[#1464C8] via-[#1052a5] to-[#102B4E] dark:from-[#091D36] dark:via-[#0C2444] dark:to-[#07111D] text-white overflow-hidden transition-colors">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B7E532]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTAs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-white/10 text-[#B7E532] text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scale with Complete Confidence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Your Business Deserves the Right Expertise.
            </h2>

            <p className="text-sm sm:text-base text-slate-200 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              Whether you're setting up your first business, managing daily operations, or expanding across multiple locations, MsmeBooks connects you with professional services designed to support your growth.
            </p>

            {/* Three Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-white text-[#102B4E] hover:bg-slate-100 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Professional Services</span>
                <ArrowRight className="w-4 h-4 text-[#1464C8]" />
              </button>

              <button
                onClick={onFindFirmClick}
                className="px-6 py-3.5 bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/25 dark:border-white/15 transition-all cursor-pointer flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#B7E532]" />
                <span>Find a Professional Firm</span>
              </button>

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I am ready to book professional services for my business.")}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                <span>Chat with Us on WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                Virtual & On-Site Deployments
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                Accredited ICAN, ACCA & CITN Specialists
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                Official WhatsApp Desk: +234 915 848 2622
              </span>
            </div>
          </div>

          {/* Right Photographic Visual */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80"
                alt="African professional business team collaborating"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102B4E] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold text-[#B7E532] block">
                  Official Service Network
                </span>
                <p className="text-xs font-bold mt-0.5">
                  500+ Certified African accountants, auditors & software consultants ready to assist.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
