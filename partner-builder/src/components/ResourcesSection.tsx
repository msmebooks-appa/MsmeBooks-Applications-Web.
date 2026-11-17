import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, FileText, Image as ImageIcon, Shield, Check, Lock, ExternalLink, Archive, Sparkles, FolderArchive, FileCode, CheckCircle2, Loader2 } from 'lucide-react';
import { downloadBadgeSvg } from './OfficialPartnerBadge';
import { ReferAPeer } from './ReferAPeer';
import { CoBrandedAssetsGenerator } from './CoBrandedAssetsGenerator';

interface ResourcesSectionProps {
  onOpenApply?: () => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ onOpenApply }) => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Generate full ZIP archive of email templates, logo packs, and brand guidelines
  const handleDownloadAssetsZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // 1. Email Templates Folder
      const emailFolder = zip.folder('email_templates');
      emailFolder?.file(
        '01_cold_sme_retail_accounting_outreach.html',
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Streamline Your Business Finances with MsmeBooks</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #0A3981; padding: 24px; border-radius: 12px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MsmeBooks Cloud ERP & Accounting</h1>
    <p style="color: #8CE600; margin: 8px 0 0 0; font-weight: bold;">Certified Partner Recommendation</p>
  </div>
  <div style="padding: 24px 12px;">
    <p>Dear [Business Owner Name],</p>
    <p>Managing multi-branch sales, inventory shrinkage, and statutory tax filings can overwhelm growing retail and distribution companies.</p>
    <p>As an accredited MsmeBooks Certified Partner, our firm [Partner Practice Name] specializes in deploying modern cloud accounting and wireless POS terminals tailored for African businesses.</p>
    <div style="background-color: #f1f5f9; padding: 16px; border-left: 4px solid #0A3981; border-radius: 6px; margin: 20px 0;">
      <strong>Why local businesses are switching to MsmeBooks:</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Automated statutory tax compliance (VAT, WHT, E-Invoicing)</li>
        <li>Real-time multi-branch stock synchronisation & fraud prevention</li>
        <li>Works seamlessly on Android POS terminals, tablets, and laptops</li>
        <li>100% cloud backup with offline transaction failover</li>
      </ul>
    </div>
    <p>We are offering a complimentary 30-minute system assessment and customized live demo for your leadership team this week.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="[Your Partner Referral Link]" style="background-color: #0A3981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Schedule Your Free System Walkthrough</a>
    </p>
    <p>Kind regards,</p>
    <p><strong>[Your Name]</strong><br>[Your Title], [Partner Practice Name]<br>Official MsmeBooks Certified Practice</p>
  </div>
</body>
</html>`
      );

      emailFolder?.file(
        '02_accounting_firm_client_migration_announcement.html',
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Exciting Upgrade: Moving Your Accounts to Cloud Accounting</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>We Are Upgrading Your Practice Experience to MsmeBooks</h2>
  <p>Dear Valued Client,</p>
  <p>To provide you with instant financial statements, automated bank feeds, and real-time management dashboards, our practice is migrating our client accounting infrastructure to <strong>MsmeBooks</strong>.</p>
  <p>All legacy historical ledger entries will be seamlessly transitioned by our certified staff at zero downtime.</p>
  <p>Look out for your secure invite credentials in your inbox.</p>
</body>
</html>`
      );

      emailFolder?.file(
        '03_pos_hardware_bundle_followup.html',
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>All-in-One Cloud POS Hardware Setup for Your Store</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Complete POS Hardware & Cloud Software Solution</h2>
  <p>Hello [Store Manager],</p>
  <p>Here is the hardware compatibility and pairing guide for your new thermal receipt printers, wireless barcode scanners, and touch POS terminals bundled with MsmeBooks Retail Pro.</p>
</body>
</html>`
      );

      // 2. Brand Guidelines Folder
      const brandFolder = zip.folder('brand_guidelines');
      brandFolder?.file(
        'MsmeBooks_Brand_Identity_Guidelines_2026.md',
        `# MsmeBooks Certified Partner Brand & Identity Guidelines (2026 Edition)

## 1. Brand Essence & Mission
MsmeBooks powers modern African businesses with enterprise-grade cloud accounting, multi-terminal retail POS, and automated statutory tax compliance.

## 2. Official Color Palette
- **Corporate Deep Blue**: \`#0A3981\` (Primary Brand Accent)
- **Deep Navy Background**: \`#061F4A\` (Dark Mode Canvas)
- **Neon Lemon Green**: \`#8CE600\` (High-Contrast Energy & Success)
- **Sky Cyan**: \`#38BDF8\` (Technical Accent)
- **Pure White**: \`#FFFFFF\` (Crisp Background)

## 3. Official Typography
- Display / Headings: Outfit, Plus Jakarta Sans, Bold 700 / Black 900
- Body Copy: Plus Jakarta Sans, Regular 400 / SemiBold 600
- Numeric / Data / Code: Space Mono, monospace

## 4. Partner Badge Usage Rules
- Do NOT distort, rotate, or alter the geometry of the Official Partner Badges.
- Always maintain clear space around the badge equal to at least 25% of its width.
- Use Bronze, Silver, Gold, or Platinum strictly in accordance with your official accreditation letter.
- Always include your official Partner ID (e.g. \`MSME-PT-8421\`) on website footers and proposals.

## 5. Co-Branding Best Practices
When displaying your firm logo alongside MsmeBooks, use the "In Partnership with MsmeBooks" or "MsmeBooks Certified Practice" lockup.`
      );

      brandFolder?.file(
        'partner_tier_benefits_and_slas.json',
        JSON.stringify(
          {
            version: '2026.1',
            tiers: {
              bronze: { clients: '1-15', revShare: '15%', supportSla: '24 hours' },
              silver: { clients: '16-50', revShare: '20%', supportSla: '12 hours' },
              gold: { clients: '51-150', revShare: '30%', supportSla: '4 hours', priorityLeadRouting: true },
              platinum: { clients: '151+', revShare: '40%', supportSla: '1 hour dedicated', priorityLeadRouting: true, territoryExclusivity: true }
            },
            referralBounty: { upfrontBonusUsd: 150, lifetimeRecurringOverride: '5%' }
          },
          null,
          2
        )
      );

      // 3. Logo Packs Folder (Vector SVGs)
      const logoFolder = zip.folder('logo_packs');
      
      // Primary Deep Blue Logo
      logoFolder?.file(
        'MsmeBooks_Logo_DeepBlue.svg',
        `<svg width="320" height="80" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="80" rx="12" fill="#FFFFFF"/>
  <rect x="16" y="16" width="48" height="48" rx="12" fill="#0A3981"/>
  <path d="M28 48V32L40 42L52 32V48" stroke="#8CE600" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="76" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#0A3981">MsmeBooks</text>
  <text x="78" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="10" fill="#0284C7" letter-spacing="0.1em">OFFICIAL PARTNER ECOSYSTEM</text>
</svg>`
      );

      // White Logo for Dark Backgrounds
      logoFolder?.file(
        'MsmeBooks_Logo_White.svg',
        `<svg width="320" height="80" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="80" rx="12" fill="#061F4A"/>
  <rect x="16" y="16" width="48" height="48" rx="12" fill="#8CE600"/>
  <path d="M28 48V32L40 42L52 32V48" stroke="#061F4A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="76" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF">MsmeBooks</text>
  <text x="78" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="10" fill="#8CE600" letter-spacing="0.1em">OFFICIAL PARTNER ECOSYSTEM</text>
</svg>`
      );

      // 4 Partner Tier Badges
      const tiers = [
        { name: 'Bronze', color: '#CD7F32', stroke: '#A0522D', rate: '15%' },
        { name: 'Silver', color: '#E2E8F0', stroke: '#94A3B8', rate: '20%' },
        { name: 'Gold', color: '#FFD700', stroke: '#F59E0B', rate: '30%' },
        { name: 'Platinum', color: '#38BDF8', stroke: '#8CE600', rate: '40%' }
      ];

      tiers.forEach((t) => {
        logoFolder?.file(
          `MsmeBooks_Partner_Badge_${t.name}.svg`,
          `<svg width="300" height="340" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A3981" />
      <stop offset="100%" stop-color="#061F4A" />
    </linearGradient>
  </defs>
  <path d="M140 12 L245 48 C245 160 215 240 140 286 C65 240 35 160 35 48 L140 12 Z" fill="url(#shieldGrad)" stroke="${t.stroke}" stroke-width="6"/>
  <text x="140" y="85" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="900" font-family="sans-serif">MsmeBooks</text>
  <text x="140" y="125" text-anchor="middle" fill="${t.color}" font-size="16" font-weight="900" font-family="sans-serif">${t.name.toUpperCase()} PARTNER</text>
  <text x="140" y="155" text-anchor="middle" fill="#8CE600" font-size="12" font-weight="bold" font-family="sans-serif">${t.rate} REVENUE SHARE</text>
  <text x="140" y="270" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">ACCREDITED CERTIFICATION</text>
</svg>`
        );
      });

      // Generate the ZIP blob and trigger browser download
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'MsmeBooks_Partner_Assets_Pack_2026.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setIsZipping(false);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating assets ZIP:', err);
      setIsZipping(false);
    }
  };

  const resources = [
    {
      id: 'res-1',
      title: 'Official Partner Badges Master Kit (SVG & PNG)',
      desc: 'High-resolution vector artwork for Bronze, Silver, Gold, and Platinum partner membership badges with transparent backgrounds.',
      type: 'Badges & Branding',
      size: '14.2 MB ZIP',
      isPublic: true,
      action: () => downloadBadgeSvg('gold', 'MSME-PT-MASTER')
    },
    {
      id: 'res-2',
      title: 'MsmeBooks Enterprise Solution Brochure (2026)',
      desc: 'Complete overview of accounting, POS terminal setups, inventory multi-store sync, and African tax compliance modules for prospective clients.',
      type: 'Sales Enablement',
      size: '4.8 MB PDF',
      isPublic: true,
      action: () => triggerSampleDownload('MsmeBooks_Partner_Brochure_2026.pdf')
    },
    {
      id: 'res-3',
      title: 'Partner Client Pitch Deck (PowerPoint & Keynote)',
      desc: 'Editable presentation slides demonstrating ROI, workflow automation, and feature comparisons against legacy desktop software.',
      type: 'Presentation',
      size: '18.5 MB PPTX',
      isPublic: true,
      action: () => triggerSampleDownload('MsmeBooks_Client_Pitch_Deck.pptx')
    },
    {
      id: 'res-4',
      title: 'Promotional Social Media & Banner Marketing Kit',
      desc: 'Ready-to-publish LinkedIn, Instagram, and WhatsApp square banners with your co-branded partner logo slot.',
      type: 'Marketing Assets',
      size: '32.0 MB ZIP',
      isPublic: true,
      action: () => triggerSampleDownload('MsmeBooks_Social_Marketing_Kit.zip')
    },
    {
      id: 'res-5',
      title: 'POS Hardware Deployment & Pairing Guide',
      desc: 'Step-by-step technical manual for configuring ESC/POS thermal receipt printers, wireless barcode scanners, and cash drawers.',
      type: 'Technical Manual',
      size: '3.1 MB PDF',
      isPublic: true,
      action: () => triggerSampleDownload('MsmeBooks_POS_Hardware_Guide.pdf')
    },
    {
      id: 'res-6',
      title: 'Official Partner Agreement & Commission Policy',
      desc: 'Standard legal terms, qualifying payment definitions, refund policies, and payout schedules across African jurisdictions.',
      type: 'Legal Document',
      size: '1.2 MB PDF',
      isPublic: true,
      action: () => triggerSampleDownload('MsmeBooks_Partner_Agreement_2026.pdf')
    }
  ];

  const triggerSampleDownload = (filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([
      `MsmeBooks Partner Programme - Official Enablement Document\nResource: ${filename}\nIssued by MsmeBooks Inc. (www.msmebooks.org)\nFor accredited partner operations and client implementation.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownload = (res: typeof resources[0]) => {
    res.action();
    setDownloadedId(res.id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <section id="resources" className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Enablement Library
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Partner Resources Centre
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Download official partner badges, marketing collateral, localized sales decks, and hardware guides to accelerate your sales cycle.
          </p>
        </div>

        {/* Featured Download Assets Master ZIP Archive Card */}
        <div className="mb-12 bg-gradient-to-r from-[#0A3981] via-[#0D47A1] to-[#061F4A] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-600/70 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-[#8CE600]/15 filter blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CE600]/20 text-[#8CE600] border border-[#8CE600]/40 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Partner Kit Archive</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Download Complete Partner Assets Pack (.ZIP)
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
                Bundled ZIP archive containing high-converting HTML email outreach templates, master vector SVG logo packs (Deep Blue & White), Bronze–Platinum partner shield badges, and the 2026 Brand & Co-Branding Guidelines manual.
              </p>

              {/* Package Content Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 text-white border border-blue-400/40">
                  <FolderArchive className="w-3.5 h-3.5 text-[#8CE600]" />
                  <span>3 Formatted Folders</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 text-white border border-blue-400/40">
                  <FileCode className="w-3.5 h-3.5 text-sky-300" />
                  <span>HTML Email Sequences</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 text-white border border-blue-400/40">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                  <span>Vector Logos & Badges</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 text-white border border-blue-400/40">
                  <FileText className="w-3.5 h-3.5 text-emerald-300" />
                  <span>2026 Brand Manual</span>
                </span>
              </div>
            </div>

            {/* Download CTA Button */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadAssetsZip}
                disabled={isZipping}
                className="px-6 py-4 text-sm font-black text-[#061F4A] bg-[#8CE600] hover:bg-[#9bf011] active:scale-95 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Bundling Assets into ZIP...</span>
                  </>
                ) : zipSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#061F4A]" />
                    <span>Assets Pack Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Assets Pack (ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 6 Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-[#0A2552] rounded-2xl p-6 border border-slate-200 dark:border-blue-800/80 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-[#061F4A] px-2.5 py-1 rounded-md border border-transparent dark:border-blue-900/60">
                    {res.type}
                  </span>
                  <span className="text-slate-400 dark:text-slate-400 font-mono text-[11px]">
                    {res.size}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {res.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Accredited Distribution
                </span>
                <button
                  onClick={() => handleDownload(res)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0A3981] dark:text-sky-200 bg-blue-50 dark:bg-[#061F4A] hover:bg-blue-100 dark:hover:bg-[#08285c] rounded-lg transition-colors cursor-pointer"
                >
                  {downloadedId === res.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" />
                      <span className="text-emerald-700 dark:text-[#8CE600]">Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Co-Branded Assets Generator Studio */}
        <CoBrandedAssetsGenerator />

        {/* Refer-a-Peer Component with Social Sharing Buttons */}
        <ReferAPeer onOpenApply={onOpenApply} />
      </div>
    </section>
  );
};
