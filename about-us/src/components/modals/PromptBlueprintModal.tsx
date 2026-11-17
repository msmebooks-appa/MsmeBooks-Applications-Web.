import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, Sparkles } from 'lucide-react';

interface PromptBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MASTER_PROMPT_TEXT = `MASTER WEBSITE DESIGN PROMPT
MsmeBooks — About Us Landing Page
Website: https://www.msmebooks.org
Page: /about-us
Design Direction: Premium Global SaaS | Modern African Technology | Enterprise Trust | Pan-African Business Empowerment

1. PROJECT OBJECTIVE
Design and develop a world-class, fully responsive, professional About Us landing page for MsmeBooks, an African-built, cloud-based, all-in-one Accounting, Point of Sale (POS), Inventory, and Business Management SaaS platform.
The page must communicate MsmeBooks' identity, mission, vision, business philosophy, product capabilities, African roots, global ambitions, and commitment to helping businesses grow.
The design must feel as professional and polished as leading global SaaS platforms such as Zoho, Xero, QuickBooks, Sage, Odoo, and Stripe, while establishing a distinctive MsmeBooks identity.

Primary positioning statement:
"Built for African Businesses. Designed for Global Growth."

Brand storytelling message:
"We believe every business, regardless of size or location, deserves access to intelligent, affordable, and powerful technology to manage operations, make better decisions, and achieve sustainable growth."

2. STRICT BRAND IDENTITY REQUIREMENTS
Brand Name: MsmeBooks
Official Website: www.msmebooks.org
Brand Colors — Mandatory:
Primary: MsmeBooks Blue (#0B4EA2)
Secondary: MsmeBooks Lemon Green (#84CC16)
Supporting: White, very light grey, and subtle neutral backgrounds
Text: Deep navy, charcoal, and dark grey

3. PAN-AFRICAN PHOTOGRAPHY AND VISUAL DIRECTION
Authentic professional photographs showing diverse African business owners, accountants, entrepreneurs, technology professionals, and SMEs across Nigeria, Ghana, Kenya, South Africa, Rwanda, Egypt, and beyond.

4. 15 FULL PAGE SECTIONS
Section 1: Hero (Who We Are)
Section 2: Our Story (Born from Africa's Business Challenges)
Section 3: Our Mission, Vision & Purpose
Section 4: The Problem We Are Solving (Visual Transformation Matrix)
Section 5: What We Do (8 Connected Cloud Suites)
Section 6: Built in Africa. Ready for the World.
Section 7: Who We Serve (12 Industry Sectors)
Section 8: Our Core Values (6 Modern Value Cards)
Section 9: The People & Thinking Behind MsmeBooks
Section 10: Our Partner Ecosystem (8 Partner Tracks)
Section 11: Our Commitment to Business Growth
Section 12: Trust, Security & Reliability (4 Trust Pillars)
Section 13: Customer Success Stories (Illustrative Use Cases)
Section 14: Frequently Asked Questions (8 Core Inquiries)
Section 15: Final Conversion CTA (Get Started, Book Demo, Explore)

5. CONTACT & VERIFICATION
Website: www.msmebooks.org
Phone: +2349158482622
Closing Brand Statement: "MsmeBooks — Empowering Businesses. Simplifying Growth."`;

export const PromptBlueprintModal: React.FC<PromptBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400 text-slate-900 flex items-center justify-center">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-lime-400">Master Prompt Blueprint</span>
              <h3 className="text-lg font-bold">MsmeBooks About Us Page Prompt</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Use this standardized prompt specification for web designers, AI agents, or marketing teams.
            </p>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#0B4EA2] hover:bg-[#083770] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 dark:bg-black text-slate-200 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 dark:border-zinc-800">
            {MASTER_PROMPT_TEXT}
          </pre>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
