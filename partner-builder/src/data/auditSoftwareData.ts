export interface AuditSoftware {
  id: string;
  name: string;
  shortName: string;
  category: 'Working Papers & F/S' | 'AI & Analytics' | 'GRC & Internal Audit' | 'Practice & Evidence';
  brandColor: string;
  accentBg: string;
  tagline: string;
  description: string;
  protocols: string[];
  sampleEndpoint: string;
  webhookEvent: string;
  syncFrequency: string;
  supportedFormats: string[];
  keyCapabilities: string[];
  apiMethod: 'GET' | 'POST' | 'STREAM';
}

export const AUDIT_SOFTWARE_LIST: AuditSoftware[] = [
  {
    id: 'draftworx',
    name: 'Draftworx',
    shortName: 'Draftworx',
    category: 'Working Papers & F/S',
    brandColor: '#E65100', // Deep orange
    accentBg: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
    tagline: 'Automated Financial Statements & Working Papers',
    description: 'Direct bi-directional synchronisation of Chart of Accounts, Trial Balance, and Lead Schedules straight into Draftworx working paper files.',
    protocols: ['REST API v2', 'Real-Time Webhook', 'XBRL Sync'],
    sampleEndpoint: '/api/v2/audit/draftworx/trial-balance',
    webhookEvent: 'ledger.period_close.finalized',
    syncFrequency: 'Real-time (< 250ms)',
    supportedFormats: ['JSON', 'XBRL', 'CSV'],
    keyCapabilities: ['Automated Lead Schedules', 'Standardized Trial Balance Ingestion', 'Zero-Keying Balance Sheets'],
    apiMethod: 'GET'
  },
  {
    id: 'caseware',
    name: 'CaseWare',
    shortName: 'CaseWare',
    category: 'Working Papers & F/S',
    brandColor: '#0284C7', // Sky Blue
    accentBg: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
    tagline: 'Cloud & Desktop Working Paper Integration',
    description: 'Seamless integration with CaseWare Cloud and Working Papers. Stream sub-ledgers, journal postings, and opening balances without manual batch exports.',
    protocols: ['REST API v2', 'CaseWare Cloud Connector', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/caseware/subledger-sync',
    webhookEvent: 'journal_entry.posted',
    syncFrequency: 'Sub-second Continuous',
    supportedFormats: ['JSON', 'XML', 'CaseWare Data Schema'],
    keyCapabilities: ['Cloud Engagement Linking', 'Automated Journal Sampling', 'Prior Period Reconciliation'],
    apiMethod: 'GET'
  },
  {
    id: 'sap-audit',
    name: 'SAP Audit Management',
    shortName: 'SAP Audit Mgt.',
    category: 'GRC & Internal Audit',
    brandColor: '#0070F2', // SAP Blue
    accentBg: 'bg-blue-600/10 border-blue-600/30 text-blue-700 dark:text-blue-400',
    tagline: 'Enterprise Internal Audit & Continuous Control',
    description: 'Enterprise-grade connector linking MsmeBooks transaction streams into SAP GRC and Audit Management for continuous control monitoring.',
    protocols: ['REST API v2', 'SAP OData / RFC Bridge', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/sap/controls-evidence',
    webhookEvent: 'control_test.evidence_generated',
    syncFrequency: 'Event-driven & Scheduled',
    supportedFormats: ['JSON', 'OData XML', 'Parquet'],
    keyCapabilities: ['Automated Control Testing', 'GRC Risk Register Feeds', 'Continuous Audit Logging'],
    apiMethod: 'GET'
  },
  {
    id: 'auditboard',
    name: 'AuditBoard',
    shortName: 'AuditBoard',
    category: 'GRC & Internal Audit',
    brandColor: '#6366F1', // Indigo
    accentBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    tagline: 'Modern Connected Risk & SOX Compliance',
    description: 'Automate internal control evidence retrieval, policy compliance checks, and SOX testing populations from MsmeBooks directly into OpsAudit and SoxHub.',
    protocols: ['REST API v2', 'AuditBoard Webhook Receiver'],
    sampleEndpoint: '/api/v2/audit/auditboard/sox-evidence',
    webhookEvent: 'financial_period.locked',
    syncFrequency: 'Real-time (< 300ms)',
    supportedFormats: ['JSON', 'CSV Evidence Packages'],
    keyCapabilities: ['Automated SOX Sampling', 'PBC Evidence Attachment', 'Audit Trail Verification'],
    apiMethod: 'POST'
  },
  {
    id: 'tickmark',
    name: 'Tickmark',
    shortName: 'Tickmark',
    category: 'Working Papers & F/S',
    brandColor: '#10B981', // Emerald
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    tagline: 'Standardized Electronic Working Papers',
    description: 'Empowers audit teams using Tickmark to pull verified trial balance snapshots and auto-populate standard audit programs and verification tickmarks.',
    protocols: ['REST API v2', 'Real-Time Webhooks'],
    sampleEndpoint: '/api/v2/audit/tickmark/program-data',
    webhookEvent: 'transaction.flagged_for_review',
    syncFrequency: 'Real-time (< 200ms)',
    supportedFormats: ['JSON', 'CSV'],
    keyCapabilities: ['Automated Tickmark Schedules', 'Sampling Extraction', 'Workpaper Cross-Referencing'],
    apiMethod: 'GET'
  },
  {
    id: 'teammate',
    name: 'TeamMate',
    shortName: 'TeamMate',
    category: 'GRC & Internal Audit',
    brandColor: '#2563EB', // Wolters Kluwer Blue
    accentBg: 'bg-blue-600/10 border-blue-600/30 text-blue-600 dark:text-blue-400',
    tagline: 'TeamMate+ Audit Management Suite',
    description: 'Wolters Kluwer TeamMate+ integration provides complete general ledger extraction and tracking for internal audit engagements and fieldwork.',
    protocols: ['REST API v2', 'TeamMate+ Connector', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/teammate/engagement-sync',
    webhookEvent: 'audit_finding.remediated',
    syncFrequency: 'Real-time (< 400ms)',
    supportedFormats: ['JSON', 'XML', 'TeamMate DTO'],
    keyCapabilities: ['Fieldwork Evidence Feeds', 'Risk-Based Sampling', 'Auditee Management'],
    apiMethod: 'GET'
  },
  {
    id: 'metricstream',
    name: 'MetricStream',
    shortName: 'MetricStream',
    category: 'GRC & Internal Audit',
    brandColor: '#D97706', // Amber
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    tagline: 'Enterprise GRC & Risk-Based Internal Audit',
    description: 'Streamline continuous audit and GRC risk assessments across multi-branch MsmeBooks accounting setups with automated risk scoring.',
    protocols: ['REST API v2', 'Enterprise Webhooks'],
    sampleEndpoint: '/api/v2/audit/metricstream/risk-telemetry',
    webhookEvent: 'risk_threshold.exceeded',
    syncFrequency: 'Sub-second Event Stream',
    supportedFormats: ['JSON', 'XML'],
    keyCapabilities: ['Continuous Assurance Feeds', 'Multi-Entity Aggregation', 'Executive Risk Dashboards'],
    apiMethod: 'STREAM'
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    shortName: 'ServiceNow',
    category: 'GRC & Internal Audit',
    brandColor: '#059669', // Teal / Emerald
    accentBg: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
    tagline: 'Audit & Compliance Workflow Automation',
    description: 'Trigger ServiceNow GRC engagement workflows, incident reporting, and segregation of duties (SoD) audits dynamically from MsmeBooks events.',
    protocols: ['REST API v2', 'ServiceNow Integration Hub', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/servicenow/grc-events',
    webhookEvent: 'security_event.permission_modified',
    syncFrequency: 'Real-time (< 150ms)',
    supportedFormats: ['JSON'],
    keyCapabilities: ['SoD Conflict Detection', 'Automated Remediation Tickets', 'Digital Workflows'],
    apiMethod: 'POST'
  },
  {
    id: 'pinkr',
    name: 'Pinkr (Auditrack)',
    shortName: 'Pinkr (Auditrack)',
    category: 'Working Papers & F/S',
    brandColor: '#EC4899', // Pink
    accentBg: 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400',
    tagline: 'Agile Audit Workflow & Task Tracking',
    description: 'Connect MsmeBooks live transaction data directly to Pinkr Auditrack for task assignment, sign-off hierarchies, and client query resolutions.',
    protocols: ['REST API v2', 'Bi-directional Webhooks'],
    sampleEndpoint: '/api/v2/audit/pinkr/task-ledger',
    webhookEvent: 'audit_task.sign_off_completed',
    syncFrequency: 'Real-time (< 300ms)',
    supportedFormats: ['JSON', 'CSV'],
    keyCapabilities: ['Live Query Management', 'Milestone Tracking', 'Sign-off Audit Trails'],
    apiMethod: 'GET'
  },
  {
    id: 'greatsoft',
    name: 'GreatSoft',
    shortName: 'GreatSoft',
    category: 'Practice & Evidence',
    brandColor: '#7C3AED', // Purple
    accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    tagline: 'Practice Management & Statutory Audit Workflows',
    description: 'Synchronise practice management billing, client master records, and statutory audit compliance dates between GreatSoft and MsmeBooks.',
    protocols: ['REST API v2', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/greatsoft/client-master',
    webhookEvent: 'client_account.status_changed',
    syncFrequency: 'Continuous Sync',
    supportedFormats: ['JSON', 'XML'],
    keyCapabilities: ['Client Master Sync', 'Tax Filing Verification', 'Time & Billing Alignment'],
    apiMethod: 'GET'
  },
  {
    id: 'datagrow',
    name: 'DataGrow',
    shortName: 'DataGrow',
    category: 'Practice & Evidence',
    brandColor: '#0284C7', // Sky Blue
    accentBg: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
    tagline: 'High-Volume Audit Data Analytics & Extraction',
    description: 'Extract millions of POS, stock movements, and ledger line items into DataGrow for deep substantive testing and pattern identification.',
    protocols: ['REST API v2 Streaming', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/datagrow/stream-ledger',
    webhookEvent: 'batch.export_completed',
    syncFrequency: 'High-Throughput Stream',
    supportedFormats: ['JSON Streaming', 'Parquet', 'CSV'],
    keyCapabilities: ['100% Population Ingestion', 'POS Ledger Integrity', 'Trend Profiling'],
    apiMethod: 'STREAM'
  },
  {
    id: 'arbutus',
    name: 'Arbutus',
    shortName: 'Arbutus',
    category: 'AI & Analytics',
    brandColor: '#DC2626', // Red
    accentBg: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
    tagline: 'Advanced Audit Analytics & Forensic Detection',
    description: 'Run automated Arbutus forensic analytics and duplicate payment detection scripts against live MsmeBooks general ledger and purchase registers.',
    protocols: ['REST API v2', 'Arbutus Direct Connector', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/arbutus/forensic-query',
    webhookEvent: 'transaction.suspicious_pattern',
    syncFrequency: 'Real-time (< 200ms)',
    supportedFormats: ['JSON', 'Flat Delimited', 'Binary'],
    keyCapabilities: ['Benford’s Law Testing', 'Duplicate Invoicing Detection', 'Split-Payment Identification'],
    apiMethod: 'GET'
  },
  {
    id: 'exclaim',
    name: 'Exclaim Innovation',
    shortName: 'Exclaim Innovation',
    category: 'Working Papers & F/S',
    brandColor: '#0EA5E9', // Ocean
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
    tagline: 'Automated Financial Reporting & Tax Validation',
    description: 'Seamless integration with Exclaim Innovation for statutory corporate tax returns, audited balance sheet formatting, and automated disclosures.',
    protocols: ['REST API v2', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/exclaim/tax-disclosure',
    webhookEvent: 'tax_return.reconciled',
    syncFrequency: 'Real-time (< 350ms)',
    supportedFormats: ['JSON', 'XBRL'],
    keyCapabilities: ['Tax Calculation Engine', 'Statutory Financials', 'Filing Validation'],
    apiMethod: 'POST'
  },
  {
    id: 'surtech',
    name: 'Surtech',
    shortName: 'Surtech',
    category: 'Practice & Evidence',
    brandColor: '#4F46E5', // Indigo
    accentBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    tagline: 'Internal Control Verification & Risk Matrix',
    description: 'Connect internal control libraries and risk matrices to MsmeBooks operational transaction logs for real-time compliance scoring.',
    protocols: ['REST API v2', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/surtech/risk-matrix',
    webhookEvent: 'control.deficiency_flagged',
    syncFrequency: 'Sub-second (< 400ms)',
    supportedFormats: ['JSON'],
    keyCapabilities: ['Risk Matrix Alignment', 'Walkthrough Testing Logs', 'Sample Extraction'],
    apiMethod: 'GET'
  },
  {
    id: 'icabinet',
    name: 'iCabinet',
    shortName: 'iCabinet',
    category: 'Practice & Evidence',
    brandColor: '#059669', // Emerald
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    tagline: 'Encrypted Audit Working Paper & Document Filing',
    description: 'Auto-archive supporting invoices, bills, inventory counts, and bank reconciliations from MsmeBooks into iCabinet encrypted audit folders.',
    protocols: ['REST API v2', 'Document Webhooks'],
    sampleEndpoint: '/api/v2/audit/icabinet/archive-evidence',
    webhookEvent: 'invoice.attached_document_added',
    syncFrequency: 'Instant Document Dispatch',
    supportedFormats: ['PDF', 'TIFF', 'JSON Metadata'],
    keyCapabilities: ['Audit Document Vault', 'Cryptographic Hashing', 'Permanent Retention Rules'],
    apiMethod: 'POST'
  },
  {
    id: 'trullion',
    name: 'Trullion',
    shortName: 'Trullion',
    category: 'AI & Analytics',
    brandColor: '#3B82F6', // Blue
    accentBg: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    tagline: 'AI-Powered Accounting & Lease Audit Automation',
    description: 'Leverage Trullion AI to extract lease data, revenue contracts, and general ledger postings from MsmeBooks for automated IFRS 16 and ASC 606 audits.',
    protocols: ['REST API v2', 'Trullion AI Pipeline', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/trullion/contract-ledger',
    webhookEvent: 'lease_contract.amortization_calculated',
    syncFrequency: 'Real-time (< 300ms)',
    supportedFormats: ['JSON', 'PDF OCR Payloads'],
    keyCapabilities: ['IFRS 16 Schedule Validation', 'Automated Revenue Testing', 'Contract-to-GL Matching'],
    apiMethod: 'POST'
  },
  {
    id: 'inflo',
    name: 'Inflo',
    shortName: 'Inflo',
    category: 'AI & Analytics',
    brandColor: '#14B8A6', // Teal
    accentBg: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
    tagline: 'Digital Audit Engagement & Full-GL Analytics',
    description: 'Direct ingestion of full 100% General Ledger data into Inflo, powering automated journal testing, client collaboration, and engagement workpapers.',
    protocols: ['REST API v2', 'Inflo Direct Link', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/inflo/full-gl-feed',
    webhookEvent: 'ledger.period_close.finalized',
    syncFrequency: 'High-Volume Streaming',
    supportedFormats: ['JSON', 'Inflo Schema v3'],
    keyCapabilities: ['100% Journal Entry Testing', 'Four-Way Analytical Comparison', 'Interactive Client Portal'],
    apiMethod: 'STREAM'
  },
  {
    id: 'diligent',
    name: 'Diligent One',
    shortName: 'Diligent One',
    category: 'GRC & Internal Audit',
    brandColor: '#8B5CF6', // Violet
    accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    tagline: 'HighBond GRC, Audit & Executive Governance',
    description: 'Connect MsmeBooks directly into Diligent One (formerly HighBond) for enterprise audit planning, fieldwork documentation, and board-level risk reporting.',
    protocols: ['REST API v2', 'Diligent HighBond API', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/diligent/highbond-fieldwork',
    webhookEvent: 'audit_exception.escalated',
    syncFrequency: 'Real-time (< 250ms)',
    supportedFormats: ['JSON', 'XML'],
    keyCapabilities: ['HighBond Automation Feeds', 'SOX & Internal Controls', 'Board Audit Committee Packs'],
    apiMethod: 'POST'
  },
  {
    id: 'onspring',
    name: 'Onspring',
    shortName: 'Onspring',
    category: 'GRC & Internal Audit',
    brandColor: '#F59E0B', // Amber
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    tagline: 'No-Code Internal Audit & Compliance Automation',
    description: 'Empowers internal auditors using Onspring to map MsmeBooks transactions to dynamic risk registers, issue tracking, and testing workpapers.',
    protocols: ['REST API v2', 'Onspring Webhook Endpoints'],
    sampleEndpoint: '/api/v2/audit/onspring/issue-tracker',
    webhookEvent: 'compliance_deviation.detected',
    syncFrequency: 'Real-time (< 300ms)',
    supportedFormats: ['JSON', 'CSV'],
    keyCapabilities: ['Custom Audit Applets', 'Real-Time Findings Tracking', 'Automated Workpaper Routing'],
    apiMethod: 'GET'
  },
  {
    id: 'asd-audit',
    name: 'ASD Audit',
    shortName: 'ASD Audit',
    category: 'Working Papers & F/S',
    brandColor: '#0D9488', // Teal
    accentBg: 'bg-teal-600/10 border-teal-600/30 text-teal-600 dark:text-teal-400',
    tagline: 'Structured Audit Management & Engagement Suite',
    description: 'Sync engagement files, materiality thresholds, and substantive testing samples between MsmeBooks and the ASD Audit workflow platform.',
    protocols: ['REST API v2', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/asd/engagement-workpapers',
    webhookEvent: 'materiality_threshold.updated',
    syncFrequency: 'Continuous Sync',
    supportedFormats: ['JSON', 'CSV'],
    keyCapabilities: ['Materiality Benchmarking', 'Substantive Analytical Tests', 'Quality Control Sign-Offs'],
    apiMethod: 'GET'
  },
  {
    id: 'mindbridge',
    name: 'Mindbridge AI',
    shortName: 'Mindbridge AI',
    category: 'AI & Analytics',
    brandColor: '#2563EB', // Blue / Indigo
    accentBg: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    tagline: 'Ensemble AI Risk Scoring on 100% of Transactions',
    description: 'Stream all general ledger transactions, journal entries, and ledger revisions directly into Mindbridge AI for continuous anomaly detection and risk scoring.',
    protocols: ['REST API v2', 'Mindbridge Stream API', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/mindbridge/transactions-stream',
    webhookEvent: 'journal_entry.risk_anomaly_detected',
    syncFrequency: 'Real-Time (< 100ms)',
    supportedFormats: ['JSON Streaming', 'CSV'],
    keyCapabilities: ['28+ Control Point Algorithms', 'Unsupervised ML Risk Scoring', 'Human-in-the-Loop Triage'],
    apiMethod: 'STREAM'
  },
  {
    id: 'intelex',
    name: 'Intelex',
    shortName: 'Intelex',
    category: 'GRC & Internal Audit',
    brandColor: '#16A34A', // Green
    accentBg: 'bg-green-600/10 border-green-600/30 text-green-600 dark:text-green-400',
    tagline: 'Operational, EHSQ & Compliance Audit Management',
    description: 'Integrate operational accounting, warehouse asset registers, and safety compliance expenditure between MsmeBooks and Intelex Audit Systems.',
    protocols: ['REST API v2', 'Webhooks'],
    sampleEndpoint: '/api/v2/audit/intelex/operational-logs',
    webhookEvent: 'inventory_variance.exceeded_limit',
    syncFrequency: 'Real-time (< 350ms)',
    supportedFormats: ['JSON'],
    keyCapabilities: ['Asset Register Audits', 'Operational Compliance Trails', 'Corrective Action CAPA'],
    apiMethod: 'GET'
  },
  {
    id: 'datasnipper',
    name: 'DataSnipper',
    shortName: 'DataSnipper',
    category: 'AI & Analytics',
    brandColor: '#E11D48', // Rose / Red
    accentBg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
    tagline: 'Intelligent Automation Embedded in Excel Audit Workpapers',
    description: 'Instantly snip and cross-reference MsmeBooks invoices, digital receipts, and bank transactions into Excel workpapers with live API back-links.',
    protocols: ['REST API v2', 'DataSnipper Add-in Bridge'],
    sampleEndpoint: '/api/v2/audit/datasnipper/snip-document-link',
    webhookEvent: 'voucher.verified_and_stamped',
    syncFrequency: 'Instant On-Demand (< 150ms)',
    supportedFormats: ['JSON', 'PDF Document Streams', 'Excel Workbooks'],
    keyCapabilities: ['Document-to-Ledger Cross-Referencing', 'Automated Vouching & Testing', 'Instant Snipping Coordinates'],
    apiMethod: 'GET'
  },
  {
    id: 'mastercontrol',
    name: 'MasterControl Audit',
    shortName: 'MasterControl Audit',
    category: 'GRC & Internal Audit',
    brandColor: '#0891B2', // Cyan
    accentBg: 'bg-cyan-600/10 border-cyan-600/30 text-cyan-600 dark:text-cyan-400',
    tagline: 'Quality, Regulatory & Vendor Audit Compliance',
    description: 'Ensure audit readiness and regulatory trace for pharmaceutical, manufacturing, and regulated SMBs with direct MasterControl quality audit logging.',
    protocols: ['REST API v2', 'GxP Webhooks'],
    sampleEndpoint: '/api/v2/audit/mastercontrol/gxp-audit-trail',
    webhookEvent: 'batch_record.compliance_checked',
    syncFrequency: 'Real-time (< 200ms)',
    supportedFormats: ['JSON', 'XML GxP Compliant'],
    keyCapabilities: ['21 CFR Part 11 Audit Trail', 'Vendor Quality Audits', 'CAPA Workflow Sync'],
    apiMethod: 'POST'
  },
  {
    id: 'netwrix',
    name: 'Netwrix Audit',
    shortName: 'Netwrix Audit',
    category: 'GRC & Internal Audit',
    brandColor: '#4338CA', // Indigo / Slate
    accentBg: 'bg-indigo-600/10 border-indigo-600/30 text-indigo-600 dark:text-indigo-400',
    tagline: 'Continuous IT & System Change Audit Trail',
    description: 'Feed immutable user permission modifications, database write operations, and administrative ledger overrides from MsmeBooks directly to Netwrix.',
    protocols: ['REST API v2', 'Syslog / Webhook Stream'],
    sampleEndpoint: '/api/v2/audit/netwrix/system-audit-events',
    webhookEvent: 'admin_override.detected',
    syncFrequency: 'Sub-second Security Stream',
    supportedFormats: ['JSON', 'CEF / Syslog'],
    keyCapabilities: ['Privileged User Monitoring', 'Immutable Change Tracking', 'Compliance Readiness Reports'],
    apiMethod: 'STREAM'
  }
];

// Helper to divide the 25 platforms into 2 balanced rows for dual-direction sliding
export const AUDIT_ROW_1 = AUDIT_SOFTWARE_LIST.slice(0, 13);
export const AUDIT_ROW_2 = AUDIT_SOFTWARE_LIST.slice(13);
