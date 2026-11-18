import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Code2, 
  Webhook, 
  ExternalLink, 
  Play, 
  Pause, 
  Search, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  X, 
  Sparkles,
  Terminal,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { AUDIT_SOFTWARE_LIST, AuditSoftwareItem } from '../data/auditSoftwareData';
import { AuditSoftwareLogo } from './AuditSoftwareLogos';

export const AuditSoftwareIntegrationSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedSoftware, setSelectedSoftware] = useState<AuditSoftwareItem | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'ts' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [simulatedWebhookState, setSimulatedWebhookState] = useState<'idle' | 'sending' | 'delivered'>('idle');

  // Split all 25 audit software platforms into Row 1 (13 items, sliding left) and Row 2 (12 items, sliding right)
  const row1Items = useMemo(() => AUDIT_SOFTWARE_LIST.slice(0, 13), []);
  const row2Items = useMemo(() => AUDIT_SOFTWARE_LIST.slice(13), []);

  // Filtered list for search & discovery grid
  const filteredList = useMemo(() => {
    return AUDIT_SOFTWARE_LIST.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleTestWebhookDispatch = () => {
    setSimulatedWebhookState('sending');
    setTimeout(() => {
      setSimulatedWebhookState('delivered');
      setTimeout(() => setSimulatedWebhookState('idle'), 4000);
    }, 600);
  };

  return (
    <section 
      id="audit-software-integrations"
      aria-label="Audit Software Integrations & REST API Webhooks"
      className="py-16 sm:py-20 bg-slate-900 border-y border-slate-800 text-white relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-lime-400">
            <Webhook className="w-3.5 h-3.5 text-lime-400" />
            <span>MsmeBooks Open Audit Ecosystem • 25+ Pre-Built Connectors</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Connect Any Audit Software via <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-lime-400 to-emerald-400">REST API & Webhooks</span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-300">
            Empower your firm's audit and assurance engagements. MsmeBooks integrates seamlessly with all leading global and African audit software suites, providing automated trial balance feeds, continuous controls monitoring, and zero double-entry.
          </p>

          {/* Quick Value Metrics */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bidirectional Trial Balance Sync
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Real-Time Webhook Event Triggers
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Workpaper Generation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SOC-2 & ISO 27001 Certified Security
            </span>
          </div>
        </div>

        {/* Controls Toolbar: Play/Pause, Search, and Category Filter */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md">
          {/* Slider Pause/Play Button for Accessibility */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              id="btn-toggle-audit-slider"
              data-testid="btn-toggle-audit-slider"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              aria-label={isPlaying ? "Pause audit software logo slider animation" : "Play audit software logo slider animation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-lime-400" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
              <span>{isPlaying ? 'Pause Slider Animation' : 'Resume Slider Animation'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Hover over any logo to pause • Click to test REST API & Webhooks
            </span>
          </div>

          {/* Search within 25 software platforms */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-audit-software"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 25 audit software..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear software search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* DUAL SLIDING LOGO SLIDERS: Sliding Left & Sliding Right */}
        <div className={`mt-8 space-y-6 ${!isPlaying ? 'slider-paused' : ''}`}>
          
          {/* Row 1: Sliding Left (Draftworx to Exclaim Innovation) */}
          <div className="relative overflow-hidden group">
            {/* Edge fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee-left gap-4 py-2">
              {/* Duplicate array for seamless infinite loop */}
              {[...row1Items, ...row1Items].map((item, idx) => (
                <button
                  key={`${item.id}-row1-${idx}`}
                  type="button"
                  onClick={() => setSelectedSoftware(item)}
                  className="shrink-0 flex items-center gap-3.5 px-4 py-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-lime-500/60 rounded-2xl transition-all hover:scale-105 hover:shadow-xl text-left cursor-pointer group/card focus:outline-none focus:ring-2 focus:ring-lime-400"
                  aria-label={`View ${item.name} REST API and Webhook integration details`}
                >
                  <AuditSoftwareLogo id={item.id} size={36} className="shrink-0 transition-transform group-hover/card:scale-110" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover/card:text-lime-400 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        API
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      {item.categoryLabel}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Right (Surtech to Netwrix Audit) */}
          <div className="relative overflow-hidden group">
            {/* Edge fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee-right gap-4 py-2">
              {/* Duplicate array for seamless infinite loop */}
              {[...row2Items, ...row2Items].map((item, idx) => (
                <button
                  key={`${item.id}-row2-${idx}`}
                  type="button"
                  onClick={() => setSelectedSoftware(item)}
                  className="shrink-0 flex items-center gap-3.5 px-4 py-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/60 rounded-2xl transition-all hover:scale-105 hover:shadow-xl text-left cursor-pointer group/card focus:outline-none focus:ring-2 focus:ring-sky-400"
                  aria-label={`View ${item.name} REST API and Webhook integration details`}
                >
                  <AuditSoftwareLogo id={item.id} size={36} className="shrink-0 transition-transform group-hover/card:scale-110" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover/card:text-sky-400 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Webhook
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      {item.categoryLabel}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Grid (when user searches) */}
        {searchQuery.trim() && (
          <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-lime-400" />
                <span>Search Results ({filteredList.length} software platforms found)</span>
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Search
              </button>
            </div>

            {filteredList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No audit software matched "{searchQuery}". You can still integrate any proprietary software with our generic REST API endpoints.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredList.map((item) => (
                  <button
                    key={`search-${item.id}`}
                    type="button"
                    onClick={() => setSelectedSoftware(item)}
                    className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-lime-500/50 rounded-xl transition-all text-left group"
                  >
                    <AuditSoftwareLogo id={item.id} size={32} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-lime-400 transition-colors">
                        {item.name}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-lime-400 flex items-center gap-1">
                        <span>Inspect REST API & Webhooks</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Architecture Highlight: How MsmeBooks Connects to Audit Software */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              RESTful Accounting API
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standardized JSON endpoints expose Trial Balances, General Ledgers, Sub-ledgers, Invoices, and Journal Vouchers formatted specifically for audit import schemas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-4">
              <Webhook className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Real-Time Webhooks
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immediate event notifications stream whenever year-end adjusting entries are posted, periods are locked, or balance sheet reconciliations are approved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Tamper-Proof Audit Trails
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cryptographically signed transaction logs ensure auditors have unalterable evidence of all ledger modifications for statutory compliance.
            </p>
          </div>
        </div>

      </div>

      {/* Integration Details & Live Webhook Simulator Modal */}
      {selectedSoftware && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-modal-title"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            
            {/* Close Button */}
            <button
              type="button"
              id="btn-close-audit-integration-modal"
              onClick={() => setSelectedSoftware(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Close integration modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <AuditSoftwareLogo id={selectedSoftware.id} size={48} className="shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id="audit-modal-title" className="text-xl font-black text-white">
                    {selectedSoftware.name} + MsmeBooks
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    {selectedSoftware.badgeText}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSoftware.categoryLabel} • Seamless Two-Way Integration
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-5 space-y-3">
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {selectedSoftware.integrationSummary}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedSoftware.description}
              </p>
            </div>

            {/* Supported Endpoints & Webhooks */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>REST API Endpoints</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {selectedSoftware.apiEndpoints.map((ep, i) => (
                    <div key={i} className="px-2 py-1 bg-slate-900 rounded border border-slate-800/80 truncate">
                      {ep}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-lime-400 mb-2 flex items-center gap-1.5">
                  <Webhook className="w-3.5 h-3.5" />
                  <span>Real-Time Webhook Events</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {selectedSoftware.webhookEvents.map((evt, i) => (
                    <div key={i} className="px-2 py-1 bg-slate-900 rounded border border-slate-800/80 truncate">
                      {evt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Webhook Dispatch Simulator */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-bold text-white">Live Webhook Event Simulator</span>
                </div>
                <button
                  type="button"
                  id="btn-simulate-webhook-dispatch"
                  onClick={handleTestWebhookDispatch}
                  disabled={simulatedWebhookState === 'sending'}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-lime-500 hover:bg-lime-400 text-slate-950 transition-colors disabled:opacity-50"
                >
                  {simulatedWebhookState === 'sending' ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : simulatedWebhookState === 'delivered' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-900" />
                      <span>200 OK Delivered!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>Dispatch Test Webhook</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-900/90 text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedSoftware.samplePayload, null, 2)}
              </pre>
            </div>

            {/* Code Snippets Tabs */}
            <div className="mt-6">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('curl')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeCodeTab === 'curl' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('ts')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeCodeTab === 'ts' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('python')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeCodeTab === 'python' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>

                <button
                  type="button"
                  id="btn-copy-integration-code"
                  onClick={() => {
                    const code = activeCodeTab === 'curl' 
                      ? selectedSoftware.curlSnippet 
                      : activeCodeTab === 'ts' 
                      ? selectedSoftware.tsSnippet 
                      : selectedSoftware.pythonSnippet;
                    handleCopyCode(code);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                {activeCodeTab === 'curl' && selectedSoftware.curlSnippet}
                {activeCodeTab === 'ts' && selectedSoftware.tsSnippet}
                {activeCodeTab === 'python' && selectedSoftware.pythonSnippet}
              </pre>
            </div>

            {/* Bottom Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Need a custom audit connector? We support private REST & GraphQL endpoints.
              </span>
              <button
                type="button"
                onClick={() => setSelectedSoftware(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
