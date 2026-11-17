import React, { useState } from 'react';
import {
  LifeBuoy,
  BookOpen,
  PlayCircle,
  Wrench,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

interface HelpCentreResourcesProps {
  onTechnicalSupportClick: () => void;
  onOpenDemo: () => void;
}

export const HelpCentreResources: React.FC<HelpCentreResourcesProps> = ({
  onTechnicalSupportClick,
  onOpenDemo,
}) => {
  const { showToast } = useToast();
  const { tDict } = useLanguage();
  const [activeModal, setActiveModal] = useState<'help' | 'knowledge' | null>(null);

  const resources = [
    {
      id: 'help-centre',
      icon: LifeBuoy,
      title: 'Help Centre',
      description: 'Find answers to frequently asked questions and product guidance.',
      actionText: 'Browse FAQs',
      onClick: () => {
        const el = document.getElementById('faqs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'knowledge-base',
      icon: BookOpen,
      title: 'Knowledge Base',
      description: 'Explore tutorials, user guides, and step-by-step instructions.',
      actionText: 'View Guides & Tutorials',
      onClick: () => setActiveModal('knowledge'),
    },
    {
      id: 'product-demos',
      icon: PlayCircle,
      title: 'Product Demonstrations',
      description: 'Discover how MsmeBooks features work through interactive guided sessions.',
      actionText: 'Watch / Request Demo',
      onClick: onOpenDemo,
    },
    {
      id: 'technical-support',
      icon: Wrench,
      title: 'Technical Support',
      description: 'Contact our team for assistance with your account or software.',
      actionText: 'Submit Support Ticket',
      onClick: onTechnicalSupportClick,
    },
  ];

  return (
    <section id="help-centre" className="py-16 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-[#70C038] dark:text-[#a1e670] uppercase tracking-wider mb-2">
            {tDict.resources.badge}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
            {tDict.resources.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {tDict.resources.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.id}
                className="bg-[#f8fafc] dark:bg-[#131E35] rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-[#0B3B82]/40 dark:hover:border-blue-500/40 hover:bg-white dark:hover:bg-[#1A2846] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#f0f6ff] dark:group-hover:bg-blue-950/60 transition-all">
                    <Icon className="w-5 h-5 text-[#0B3B82] dark:text-[#93C5FD] group-hover:text-[#70C038] transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B3B82] dark:text-white mb-2">{res.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{res.description}</p>
                </div>

                <button
                  onClick={res.onClick}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] group-hover:text-white group-hover:bg-[#0B3B82] dark:group-hover:bg-[#1D4ED8] bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 group-hover:border-[#0B3B82] dark:group-hover:border-[#1D4ED8] transition-all flex items-center justify-between"
                >
                  <span>{res.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#70C038] group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal for Knowledge Base */}
      {activeModal === 'knowledge' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131E35] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0B3B82] dark:text-[#93C5FD]" />
                <h3 className="text-lg font-bold text-[#0B3B82] dark:text-white">
                  MsmeBooks Knowledge Base & Guides
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0B3B82] dark:hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 dark:bg-[#0B1120] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Setting Up Your First Retail Store</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Hardware setup, barcode scanners, receipt printers</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0B3B82] dark:hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 dark:bg-[#0B1120] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Chart of Accounts & Beginning Balances</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Importing balances from Excel and legacy software</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0B3B82] dark:hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 dark:bg-[#0B1120] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Regional Tax Compliance & Invoicing</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">FIRS (Nigeria), GRA (Ghana), KRA eTIMS (Kenya) filing</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast('Support Notice', 'Complete documentation library is accessible via your MsmeBooks customer console.', 'info');
                }}
                className="px-4 py-2 bg-[#0B3B82] dark:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg hover:bg-[#082d64] dark:hover:bg-[#1E40AF]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
