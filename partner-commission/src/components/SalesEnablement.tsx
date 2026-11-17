import React, { useState } from 'react';
import { Download, Search, Check, ArrowRight } from 'lucide-react';
import { SALES_RESOURCES } from '../data/partnerData';

export const SalesEnablement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const filteredResources = SALES_RESOURCES.filter(
    (res) =>
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (id: string, title: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0E1A30] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
              <span>Partner Enablement</span>
              <span aria-hidden="true">·</span>
              <span>Training & Assets</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
              Partner Tools, Training & Sales Enablement
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              We equip your practice with ready-to-use client pitch decks, Pan-African tax compliance handbooks, co-branding graphics, and implementation guides.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#14233c] text-[#142D4E] dark:text-white focus:bg-white dark:focus:bg-[#1a2d4c] focus:outline-none focus:ring-2 focus:ring-[#1261B5]/30 focus:border-[#1261B5] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-[#F7FAFC] dark:bg-[#14233c] p-6 flex flex-col justify-between hover:border-[#1261B5]/40 dark:hover:border-[#B9E51C]/40 hover:shadow-md transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
                    {res.category}
                  </span>
                  {res.badge && (
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0c182c] border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                      {res.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#142D4E] dark:text-white group-hover:text-[#1261B5] dark:group-hover:text-[#B9E51C] transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{res.fileSize}</span>
                <button
                  onClick={() => handleDownload(res.id, res.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#0e1b30] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#1261B5] dark:hover:text-[#B9E51C] hover:border-[#1261B5] dark:hover:border-[#B9E51C] transition-colors flex items-center gap-1.5"
                >
                  {downloadedId === res.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C]" />
                      <span className="text-emerald-700 dark:text-[#B9E51C]">Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Kit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Training CTA Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#142D4E] to-[#1261B5] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-700/50">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider block">
              MsmeBooks Academy & Certification
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Enroll in Certified Partner Onboarding & Product Masterclasses
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Master MsmeBooks Core Accounting, multi-branch POS setups, inventory barcode workflows, and African VAT/WHT compliance in self-paced modules.
            </p>
          </div>

          <a
            href="#faq"
            className="px-6 py-3 rounded-xl text-xs font-bold text-[#142D4E] bg-[#B9E51C] hover:bg-[#aadb14] transition-colors whitespace-nowrap flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Explore Partner Academy</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
