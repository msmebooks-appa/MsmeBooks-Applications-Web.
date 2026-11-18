import React, { useState } from 'react';
import { 
  Puzzle, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck2,
  Users,
  Building,
  Sparkles,
  Database
} from 'lucide-react';

export const AddonsAndServices: React.FC = () => {
  return (
    <div className="space-y-12">
      
      {/* Section 03: Add-on Modules & Marketplace Purchases */}
      <section id="addons" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>03. Modular Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Add-on Modules & Marketplace Purchases
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Refund parameters for specialized business tools, point of sale terminals, payroll capacity, and third-party marketplace integrations.
          </p>
        </div>

        {/* Addons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 1st Party Proprietary Add-ons */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-900 dark:text-blue-400">
              <Layers className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950 dark:text-white">Native MsmeBooks Add-ons</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Point of Sale registers, inventory barcoding, multi-warehouse sync, hotel & restaurant table management.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-lime-600 dark:text-lime-400 font-bold">✓</span>
                <span><strong className="text-slate-900 dark:text-white">Unused / Unactivated:</strong> 100% refundable within 7 days if no transactions or records were created.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold">✕</span>
                <span><strong className="text-slate-900 dark:text-white">Activated Modules:</strong> Non-refundable once live data, branch syncing, or POS tickets are processed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong className="text-slate-900 dark:text-white">Recurring Add-ons:</strong> Follows monthly subscription rules; cancel anytime to halt next cycle.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: AI & Consumption Services */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-lime-50 dark:bg-lime-950/40 border border-lime-200 dark:border-lime-800/40 flex items-center justify-center text-lime-700 dark:text-lime-400">
              <Sparkles className="w-5 h-5 text-lime-700 dark:text-lime-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950 dark:text-white">AI & Consumable Credits</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automated bank statement optical OCR, WhatsApp invoice delivery packs, automated financial audit assistant.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-lime-600 dark:text-lime-400 font-bold">✓</span>
                <span><strong className="text-slate-900 dark:text-white">Defective Execution:</strong> If OCR parsing fails due to platform outages, consumed credits are replenished.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold">✕</span>
                <span><strong className="text-slate-900 dark:text-white">Consumed Units:</strong> Credits spent delivering WhatsApp messages or OCR scans are strictly non-refundable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong className="text-slate-900 dark:text-white">Expiry:</strong> Unused prepurchased bundles do not expire for 365 days from invoice date.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: 3rd Party Marketplace Apps */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Puzzle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950 dark:text-white">Marketplace Extensions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Independent payment connectors, third-party logistics plugins, external tax filing bridges.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                <span><strong className="text-slate-900 dark:text-white">Independent Sellers:</strong> Subject to the originating independent developer's refund terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lime-600 dark:text-lime-400 font-bold">✓</span>
                <span><strong className="text-slate-900 dark:text-white">Dispute Mediation:</strong> MsmeBooks will freeze billing for non-functional extensions upon verified complaint.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong className="text-slate-900 dark:text-white">Merchant of Record:</strong> Receipts identify whether MsmeBooks or the partner is the vendor.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Section 04: Professional Services Refund Policy */}
      <section id="professional-services" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>04. Professional Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Implementation & Professional Services Refund Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Governing onboarding, chart-of-accounts setup, historical ledger migration, staff training, and technical advisory.
          </p>
        </div>

        {/* 3 Project Lifecycle Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-lime-400 uppercase tracking-wider">Stage 1</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800/40">Eligible</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Before Work Begins</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Subscriber provides written notice of cancellation at least 48 hours before the scheduled kickoff meeting or engineer assignment.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Refund Settlement:</p>
              <p>Full refund less a 5% administrative and payment merchant processing fee.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-lime-400 uppercase tracking-wider">Stage 2</span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-transparent dark:border-amber-800/40">Milestone-Prorated</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Work in Progress</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When data migration, template design, or system configuration has commenced but formal delivery sign-off is pending.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Refund Settlement:</p>
              <p>Completed milestones and logged engineering hours are non-refundable. All unperformed milestone payments are refunded.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-lime-400 uppercase tracking-wider">Stage 3</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-transparent dark:border-slate-700">Non-Refundable</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Completed Services</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Following client sign-off, live launch, or upon delivery of completed ledger migration and staff training sessions.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Remedy & Warranty:</p>
              <p>Non-refundable. Covered by a 30-day configuration warranty for bug fixes or re-mappings at zero extra cost.</p>
            </div>
          </div>

        </div>

        {/* Third-Party Consultant Clarification */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-900 dark:text-lime-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Services Delivered by Independent Certified Accounting Partners
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Where professional bookkeeping or audit setup is executed by an independent certified MsmeBooks partner, the partner's service contract dictates refund obligations. MsmeBooks provides dispute arbitration upon customer escalation.
              </p>
            </div>
          </div>
          <a
            href="mailto:services@msmebooks.org?subject=Professional%20Services%20Inquiry"
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white hover:border-blue-900 dark:hover:border-lime-400 rounded-lg font-semibold shrink-0 transition-colors text-center"
          >
            Request Service Support
          </a>
        </div>

      </section>

    </div>
  );
};
