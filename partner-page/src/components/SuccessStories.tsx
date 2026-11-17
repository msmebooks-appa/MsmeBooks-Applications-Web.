import React, { useState } from 'react';
import { 
  CASE_STUDIES 
} from '../data/partnerData';
import { 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Laptop2, 
  Briefcase,
  MapPin
} from 'lucide-react';
import { CaseStudy } from '../types';

interface SuccessStoriesProps {
  onOpenCaseStudyModal: (caseStudy: CaseStudy) => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ onOpenCaseStudyModal }) => {
  return (
    <section id="success-stories" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#65A30D]" />
            Measurable Transformation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Partner Success Stories
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Real organizational transformation. Discover how African accounting firms, tech resellers, and consulting practices turn client relationships into predictable recurring revenue.
          </p>
        </div>

        {/* 3 Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="group rounded-2xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#0F4C81]/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={study.image}
                    alt={study.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-[#0F4C81] text-white">
                      {study.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#84CC16]" />
                      {study.location}
                    </div>
                    <div className="text-sm font-bold text-white line-clamp-1">
                      {study.firmName}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0A192F] group-hover:text-[#0F4C81] transition-colors mb-4 font-display leading-snug">
                    {study.title}
                  </h3>

                  {/* Before / Solution / Outcome Blocks */}
                  <div className="space-y-3 text-xs mb-6">
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Before:
                      </span>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {study.before}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-blue-700 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Solution:
                      </span>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {study.solution}
                      </p>
                    </div>

                    <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-200/80">
                      <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Outcome:
                      </span>
                      <p className="text-emerald-900 font-medium line-clamp-2 leading-relaxed">
                        {study.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Quick stats badge */}
                  <div className="grid grid-cols-3 gap-2 text-center py-2.5 bg-slate-100/80 rounded-xl mb-4 text-[11px]">
                    {study.growthStats.map((st, i) => (
                      <div key={i}>
                        <span className="font-extrabold text-[#0F4C81] block">{st.value}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">{st.label}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Card Footer: Read Success Story CTA */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => onOpenCaseStudyModal(study)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0F4C81] hover:text-white bg-blue-50 hover:bg-[#0F4C81] border border-blue-200 hover:border-transparent transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Read Success Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Placeholder disclaimer note */}
        <div className="text-center">
          <p className="text-xs text-slate-400 italic">
            * Case studies depict illustrative partner deployment journeys and operational metrics based on real-world African market onboarding scenarios.
          </p>
        </div>

      </div>
    </section>
  );
};
