import React, { useState } from 'react';
import { 
  AUDIT_SOFTWARE_LIST, 
  AUDIT_ROW_1, 
  AUDIT_ROW_2, 
  AuditSoftware 
} from '../data/auditSoftwareData';
import { AuditSoftwareLogo } from './AuditSoftwareLogo';
import { AuditIntegrationModal } from './AuditIntegrationModal';
import { 
  Network, 
  Zap, 
  Webhook, 
  Code2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Search,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AuditSoftwareSliderSectionProps {
  onOpenApply: () => void;
}

export const AuditSoftwareSliderSection: React.FC<AuditSoftwareSliderSectionProps> = ({
  onOpenApply,
}) => {
  const { t } = useLanguage();
  const [selectedSoftware, setSelectedSoftware] = useState<AuditSoftware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [codeTab, setCodeTab] = useState<'curl' | 'webhook' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCardClick = (software: AuditSoftware) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
  };

  const categories = [
    'All',
    'Working Papers & F/S',
    'AI & Analytics',
    'GRC & Internal Audit',
    'Practice & Evidence'
  ];

  const filteredList = AUDIT_SOFTWARE_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const curlCode = `# 1. Extract Live General Ledger & Trial Balance into Audit Software
curl -X GET "https://api.msmebooks.org/api/v2/audit/trial-balance" \\
  -H "Authorization: Bearer msme_live_sec_99420ab..." \\
  -H "X-Audit-Software: Draftworx" \\
  -H "Accept: application/json" \\
  -d "fiscal_year=2026&period=Q3&include_schedules=true"`;

  const webhookCode = `// 2. Real-Time Webhook Handler (Express/Node.js)
app.post('/webhook/msmebooks-audit-events', (req, res) => {
  const signature = req.headers['x-msmebooks-signature'];
  // Verify HMAC-SHA256 signature
  if (!verifyMsmeBooksHmac(req.rawBody, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const { event, payload } = req.body;
  if (event === 'ledger.period_close.finalized') {
    // Automatically trigger CaseWare / Inflo / Mindbridge working paper sync
    syncLeadSchedulesToAuditSoftware(payload.entity_id, payload.schedules);
  }
  res.status(200).json({ received: true });
});`;

  const pythonCode = `# 3. Python Audit Analytics & Sampling Script (Arbutus / Mindbridge / DataSnipper)
import requests

headers = {
    "Authorization": "Bearer msme_live_sec_99420ab...",
    "X-Audit-Software": "Mindbridge-AI"
}
response = requests.get(
    "https://api.msmebooks.org/api/v2/audit/journal-entries",
    headers=headers,
    params={"limit": 50000, "risk_anomaly_filter": True}
)
audit_population = response.json()
print(f"Ingested {len(audit_population['records'])} risk-scored entries.")`;

  const getCodeSnippet = () => {
    switch (codeTab) {
      case 'curl':
        return curlCode;
      case 'webhook':
        return webhookCode;
      case 'python':
        return pythonCode;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="integrations" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-700/80 text-xs font-bold uppercase tracking-wider mb-4">
            <Network className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            {t('audit.tag', 'Bi-Directional Audit Ecosystem')}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            {t('audit.title', 'Integrate Any Audit Software with MsmeBooks')}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {t('audit.desc', 'Eliminate manual CSV downloads, spreadsheet re-keying, and outdated lead schedules. Connect your audit practice’s preferred software directly to MsmeBooks using our high-speed REST API and real-time Event Webhooks.')}
          </p>

          {/* Quick Protocol Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A2552] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-800 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-[#8CE600]" /> REST API v2.4 (OpenAPI 3.0)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A2552] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-800 shadow-sm">
              <Webhook className="w-3.5 h-3.5 text-sky-500" /> Event Webhooks (HMAC-SHA256)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A2552] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> AES-256 & TLS 1.3 Encryption
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A2552] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 25+ Verified Audit Platforms
            </span>
          </div>
        </div>
      </div>

      {/* DUAL-DIRECTION LOGO SLIDER SYSTEM */}
      <div className="relative w-full space-y-6 my-4">
        {/* Soft Left & Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-[#061F4A] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-[#061F4A] to-transparent z-20 pointer-events-none" />

        {/* Track Label 1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500 dark:text-blue-300 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8CE600] animate-pulse" />
            {t('audit.track1_label', 'Row 1 • Sliding Left: Working Papers, Reporting & Continuous Assurance')}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400 dark:text-blue-400">
            Hover any card to pause • Click to inspect API specs
          </span>
        </div>

        {/* TRACK 1: Sliding Left (Rows 1-13 duplicated) */}
        <div className="overflow-hidden py-2">
          <div className="animate-marquee-left flex items-center gap-4">
            {/* First Set */}
            {AUDIT_ROW_1.map((item) => (
              <button
                key={`row1-a-${item.id}`}
                onClick={() => handleCardClick(item)}
                className="group shrink-0 flex items-center gap-3.5 px-5 py-3.5 bg-white dark:bg-[#072048] hover:bg-blue-50/80 dark:hover:bg-[#0A295C] border border-slate-200 dark:border-blue-800/80 hover:border-[#8CE600] dark:hover:border-[#8CE600] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer transform hover:-translate-y-1 w-72"
              >
                <AuditSoftwareLogo id={item.id} name={item.name} className="w-10 h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600] transition-colors">
                      {item.shortName}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800">
                      API
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-300 truncate font-medium">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}

            {/* Duplicated Set for Infinite Loop */}
            {AUDIT_ROW_1.map((item) => (
              <button
                key={`row1-b-${item.id}`}
                onClick={() => handleCardClick(item)}
                className="group shrink-0 flex items-center gap-3.5 px-5 py-3.5 bg-white dark:bg-[#072048] hover:bg-blue-50/80 dark:hover:bg-[#0A295C] border border-slate-200 dark:border-blue-800/80 hover:border-[#8CE600] dark:hover:border-[#8CE600] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer transform hover:-translate-y-1 w-72"
              >
                <AuditSoftwareLogo id={item.id} name={item.name} className="w-10 h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600] transition-colors">
                      {item.shortName}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800">
                      API
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-300 truncate font-medium">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Track Label 2 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500 dark:text-blue-300 font-bold uppercase tracking-wider pt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            {t('audit.track2_label', 'Row 2 • Sliding Right: AI Analytics, Sampling & Intelligent Verification')}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400 dark:text-blue-400">
            Real-time webhook events on transaction post
          </span>
        </div>

        {/* TRACK 2: Sliding Right (Rows 14-25 duplicated) */}
        <div className="overflow-hidden py-2">
          <div className="animate-marquee-right flex items-center gap-4">
            {/* First Set */}
            {AUDIT_ROW_2.map((item) => (
              <button
                key={`row2-a-${item.id}`}
                onClick={() => handleCardClick(item)}
                className="group shrink-0 flex items-center gap-3.5 px-5 py-3.5 bg-white dark:bg-[#072048] hover:bg-blue-50/80 dark:hover:bg-[#0A295C] border border-slate-200 dark:border-blue-800/80 hover:border-[#8CE600] dark:hover:border-[#8CE600] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer transform hover:-translate-y-1 w-72"
              >
                <AuditSoftwareLogo id={item.id} name={item.name} className="w-10 h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600] transition-colors">
                      {item.shortName}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800">
                      Webhook
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-300 truncate font-medium">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}

            {/* Duplicated Set for Infinite Loop */}
            {AUDIT_ROW_2.map((item) => (
              <button
                key={`row2-b-${item.id}`}
                onClick={() => handleCardClick(item)}
                className="group shrink-0 flex items-center gap-3.5 px-5 py-3.5 bg-white dark:bg-[#072048] hover:bg-blue-50/80 dark:hover:bg-[#0A295C] border border-slate-200 dark:border-blue-800/80 hover:border-[#8CE600] dark:hover:border-[#8CE600] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 text-left cursor-pointer transform hover:-translate-y-1 w-72"
              >
                <AuditSoftwareLogo id={item.id} name={item.name} className="w-10 h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600] transition-colors">
                      {item.shortName}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800">
                      Webhook
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-300 truncate font-medium">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STRATEGIC ARCHITECTURE & DEVELOPER CODE WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-white dark:bg-[#072048] border-2 border-slate-200 dark:border-blue-800/80 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Why This Solves Audit Headaches */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#8CE600] text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Manual Data Entry For Auditors
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-white tracking-tight leading-tight">
                How MsmeBooks Connects with Your Audit Stack
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether your engagement methodology relies on traditional working paper platforms like <strong>Draftworx, CaseWare, and Tickmark</strong>, or cutting-edge AI anomaly tools like <strong>Mindbridge, Trullion, and DataSnipper</strong>, MsmeBooks streams verified financial data instantly.
              </p>

              {/* 3 Value Pillars */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Automated Lead Schedules & Trial Balance
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Extract real-time Chart of Accounts and sub-ledger trial balances directly into working paper software. Zero manual CSV file re-formatting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Event Webhooks on Period Closes & Adjusting Entries
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      When a client updates a reconciliation, adjusts inventory, or closes a month, webhooks dispatch real-time payloads straight to your audit repository.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      100% Population Testing & Forensic Analytics
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Stream every single POS sale, expense voucher, and journal entry into analytics engines like Arbutus, Inflo, and Mindbridge for 100% full-population testing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenApply}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {t('audit.request_sandbox', 'Request Audit API Sandbox Key')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCardClick(AUDIT_SOFTWARE_LIST[0])}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-white bg-slate-100 dark:bg-blue-900/60 hover:bg-slate-200 dark:hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  {t('audit.view_specs', 'View API Specs')}
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Code Console & Protocol Switcher */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              
              {/* Code Bar Header */}
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                    msmebooks-audit-gateway
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCodeTab('curl')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                      codeTab === 'curl' 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    cURL (REST)
                  </button>
                  <button
                    onClick={() => setCodeTab('webhook')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                      codeTab === 'webhook' 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Node.js Webhook
                  </button>
                  <button
                    onClick={() => setCodeTab('python')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                      codeTab === 'python' 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Python Analytics
                  </button>
                </div>
              </div>

              {/* Code Body */}
              <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-72 leading-relaxed">
                <pre className="text-emerald-400">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>

              {/* Code Bar Footer */}
              <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-mono">
                  Standard OpenAPI 3.0 • JSON & XBRL formats
                </span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied Snippet!' : 'Copy Snippet'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Platform Directory & Search Bar */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-blue-900/60">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  All 25 Supported Audit Platforms at a Glance
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select any category or search your practice’s platform to preview supported endpoints.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audit software..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0A3981] dark:bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-blue-800/80'
                  }`}
                >
                  {cat} {cat === 'All' && `(${AUDIT_SOFTWARE_LIST.length})`}
                </button>
              ))}
            </div>

            {/* Compact Grid of Filtered Software */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredList.map((software) => (
                <button
                  key={software.id}
                  onClick={() => handleCardClick(software)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#061F4A] hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-blue-800/70 text-left transition-all group cursor-pointer"
                >
                  <AuditSoftwareLogo id={software.id} name={software.name} className="w-7 h-7 text-xs shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600]">
                      {software.shortName}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-400 truncate">
                      {software.category.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Detail Modal */}
      <AuditIntegrationModal
        software={selectedSoftware}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenApply={onOpenApply}
      />
    </section>
  );
};
