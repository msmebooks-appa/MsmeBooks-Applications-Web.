import React, { useState } from 'react';
import { AuditSoftware } from '../data/auditSoftwareData';
import { AuditSoftwareLogo } from './AuditSoftwareLogo';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  Code2, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuditIntegrationModalProps {
  software: AuditSoftware | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: () => void;
}

export const AuditIntegrationModal: React.FC<AuditIntegrationModalProps> = ({
  software,
  isOpen,
  onClose,
  onOpenApply,
}) => {
  const [activeTab, setActiveTab] = useState<'rest' | 'webhook' | 'auth'>('rest');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !software) return null;

  const handleCopyEndpoint = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample dynamic REST response payload based on the selected software
  const restPayload = {
    status: 200,
    timestamp: new Date().toISOString(),
    integration_partner: software.name,
    protocol: 'REST API v2.4 (OAS 3.0)',
    data_format: software.supportedFormats[0] || 'JSON',
    latency_ms: 142,
    data: {
      client_entity_id: 'MSME-NG-90421',
      fiscal_period: '2026-Q3',
      reporting_currency: 'NGN',
      audit_ready: true,
      hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      records_synced: 14820,
      lead_schedules: [
        { code: 'A-100', name: 'Cash & Cash Equivalents', balance: 48920450.00, verified: true },
        { code: 'B-200', name: 'Trade Receivables & Aging', balance: 112450300.50, verified: true },
        { code: 'C-300', name: 'Inventory & Stock Valuation', balance: 78310000.00, verified: true }
      ]
    }
  };

  // Sample Webhook payload
  const webhookPayload = {
    event: software.webhookEvent,
    event_id: 'evt_' + Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    source_platform: 'MsmeBooks Enterprise Core',
    target_software: software.name,
    delivery_status: 'delivered',
    signature_header: 'X-MsmeBooks-Signature: t=1761899120,v1=9e8...74a',
    payload: {
      action: 'AUDIT_TRIGGER',
      entity_id: 'MSME-GLOBAL-771',
      event_type: software.keyCapabilities[0],
      impacted_accounts: ['1000-CASH', '2000-AP', '4000-REVENUE'],
      sync_latency: software.syncFrequency
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-[#072048] border border-slate-200 dark:border-blue-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-[#061A3D] border-b border-slate-200 dark:border-blue-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AuditSoftwareLogo id={software.id} name={software.name} className="w-12 h-12 text-base" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {software.name}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#8CE600]/20 text-[#0A3981] dark:text-[#8CE600] border border-[#8CE600]/30">
                  Live Sync Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-blue-200 font-medium mt-0.5">
                {software.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900/80">
              <span className="text-slate-400 dark:text-blue-300 block mb-1">Architecture</span>
              <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#8CE600]" /> REST & Webhook
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900/80">
              <span className="text-slate-400 dark:text-blue-300 block mb-1">Sync Latency</span>
              <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> {software.syncFrequency}
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900/80">
              <span className="text-slate-400 dark:text-blue-300 block mb-1">Data Payloads</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {software.supportedFormats.join(', ')}
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900/80">
              <span className="text-slate-400 dark:text-blue-300 block mb-1">Security Standard</span>
              <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> TLS 1.3 / OAuth2
              </strong>
            </div>
          </div>

          {/* Description & Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-300 mb-2">
              Integration Architecture
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {software.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {software.keyCapabilities.map((cap, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0A3981] dark:text-sky-300 border border-blue-200 dark:border-blue-800"
                >
                  ✓ {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Endpoint Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Live REST API Endpoint:
              </span>
              <button
                onClick={() => handleCopyEndpoint(`https://api.msmebooks.org${software.sampleEndpoint}`)}
                className="text-xs font-semibold text-[#0A3981] dark:text-[#8CE600] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied URL!' : 'Copy Endpoint'}
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-700">
              <span className="text-[#8CE600] font-black">{software.apiMethod}</span>
              <span className="text-slate-400">https://api.msmebooks.org</span>
              <span className="text-white font-bold">{software.sampleEndpoint}</span>
            </div>
          </div>

          {/* Interactive Payload Inspector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-blue-800 pb-2">
              <button
                onClick={() => setActiveTab('rest')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'rest'
                    ? 'bg-[#0A3981] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                }`}
              >
                REST Response (JSON)
              </button>
              <button
                onClick={() => setActiveTab('webhook')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'webhook'
                    ? 'bg-[#0A3981] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                }`}
              >
                Event Webhook Payload
              </button>
              <button
                onClick={() => setActiveTab('auth')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'auth'
                    ? 'bg-[#0A3981] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                }`}
              >
                Authentication & Security
              </button>
            </div>

            {/* Tab 1: REST */}
            {activeTab === 'rest' && (
              <div className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto max-h-56 border border-slate-800">
                <pre>{JSON.stringify(restPayload, null, 2)}</pre>
              </div>
            )}

            {/* Tab 2: Webhook */}
            {activeTab === 'webhook' && (
              <div className="p-4 bg-slate-950 text-sky-400 rounded-2xl font-mono text-xs overflow-x-auto max-h-56 border border-slate-800">
                <pre>{JSON.stringify(webhookPayload, null, 2)}</pre>
              </div>
            )}

            {/* Tab 3: Auth & Security */}
            {activeTab === 'auth' && (
              <div className="p-4 bg-slate-900/90 text-slate-200 rounded-2xl text-xs space-y-3 border border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#8CE600]" />
                  Bank-Grade OAuth 2.0 & Field-Level Encryption
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• <strong>Token-Based Authentication:</strong> Bearer tokens with granular role-based scopes (e.g. `audit:read`, `ledger:export`).</li>
                  <li>• <strong>Webhook Verification:</strong> HMAC-SHA256 signature attached to header `X-MsmeBooks-Signature` on all outbound events.</li>
                  <li>• <strong>Encryption:</strong> TLS 1.3 in transit and AES-256 for all stored audit trails and financial ledgers.</li>
                  <li>• <strong>Mutual TLS (mTLS):</strong> Available for enterprise ERP and sovereign bank-grade deployments.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-[#061A3D] border-t border-slate-200 dark:border-blue-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-blue-300">
            OpenAPI 3.0 specification available in Partner Portal.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-blue-900/40 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenApply();
              }}
              className="px-5 py-2 text-xs font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              Connect with {software.name}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
