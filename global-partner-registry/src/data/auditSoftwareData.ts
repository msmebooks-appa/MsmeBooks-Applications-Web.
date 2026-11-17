import React from 'react';

export interface AuditSoftwareItem {
  id: string;
  name: string;
  shortName: string;
  category: 'workpapers' | 'risk_sox' | 'data_analytics' | 'practice_mgmt' | 'compliance_grc';
  categoryLabel: string;
  description: string;
  integrationSummary: string;
  brandColor: string;
  accentBg: string;
  badgeText: string;
  apiEndpoints: string[];
  webhookEvents: string[];
  samplePayload: Record<string, any>;
  curlSnippet: string;
  tsSnippet: string;
  pythonSnippet: string;
}

export const AUDIT_SOFTWARE_LIST: AuditSoftwareItem[] = [
  {
    id: 'draftworx',
    name: 'Draftworx',
    shortName: 'Draftworx',
    category: 'workpapers',
    categoryLabel: 'Financial Statements & Workpapers',
    description: 'Automated financial statement drafting and compliant audit working paper management.',
    integrationSummary: 'Push live trial balances, adjusting journal entries, and general ledger accounts directly into Draftworx working papers via REST API.',
    brandColor: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    badgeText: 'REST API & Webhooks Ready',
    apiEndpoints: ['/api/v1/audit/draftworx/trial-balance', '/api/v1/audit/draftworx/adjustments'],
    webhookEvents: ['trial_balance.updated', 'journal_entry.adjusted', 'closing_lock.applied'],
    samplePayload: {
      event: 'audit.trial_balance.updated',
      software: 'Draftworx',
      client_id: 'cl-84920',
      period_ending: '2026-12-31',
      accounts_count: 142,
      total_debit: 4850200.50,
      total_credit: 4850200.50,
      balanced: true,
      timestamp: '2026-10-31T09:45:00Z',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/draftworx/sync \\
  -H "Authorization: Bearer msme_live_sec_key" \\
  -H "Content-Type: application/json" \\
  -d '{"period":"2026-Q4","auto_map_leads":true}'`,
    tsSnippet: `import { MsmeBooksAuditClient } from '@msmebooks/audit-sdk';

const client = new MsmeBooksAuditClient({ apiKey: process.env.MSME_API_KEY });
const syncResult = await client.draftworx.pushTrialBalance({
  periodEnding: '2026-12-31',
  format: 'draftworx_xml',
  includeSupportingSchedules: true,
});`,
    pythonSnippet: `import requests

resp = requests.post(
    "https://api.msmebooks.com/v1/audit/draftworx/sync",
    headers={"Authorization": "Bearer msme_live_key"},
    json={"period": "2026-FY", "sync_subledgers": True}
)
print(resp.json())`,
  },
  {
    id: 'caseware',
    name: 'Caseware',
    shortName: 'Caseware Cloud',
    category: 'workpapers',
    categoryLabel: 'Cloud Audit & Analytics',
    description: 'Leading global cloud platform for audit engagements, risk assessment, and financial reporting.',
    integrationSummary: 'Bidirectional sync with Caseware Cloud engagements, automating trial balance imports and substantive testing schedules.',
    brandColor: '#2563eb',
    accentBg: 'rgba(37, 99, 235, 0.12)',
    badgeText: 'Caseware Cloud Certified',
    apiEndpoints: ['/api/v1/audit/caseware/engagements', '/api/v1/audit/caseware/gl-export'],
    webhookEvents: ['engagement.linked', 'workpaper.signoff', 'reconciliation.mismatch'],
    samplePayload: {
      event: 'caseware.engagement.synced',
      engagement_id: 'cw-eng-2026-90',
      status: 'active_fieldwork',
      materiality_threshold: 75000.0,
      unadjusted_differences: 0,
      timestamp: '2026-10-31T09:40:00Z',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/caseware/trial-balance \\
  -H "Authorization: Bearer msme_live_sec_key" \\
  -d '{"engagement_id":"cw-9921","map_standard_leads":true}'`,
    tsSnippet: `await msmeBooks.caseware.syncEngagement({
  engagementId: 'CW-ENG-849',
  periodEnding: '2026-12-31',
  exportAnalyticalReviews: true
});`,
    pythonSnippet: `caseware_sync = msme_client.caseware.push_trial_balance(
    engagement_id="CW-2026-01",
    include_reconciliations=True
)`,
  },
  {
    id: 'sap-audit-mgt',
    name: 'SAP Audit Mgt.',
    shortName: 'SAP Audit',
    category: 'risk_sox',
    categoryLabel: 'Enterprise Risk & Internal Audit',
    description: 'SAP Audit Management provides end-to-end audit lifecycle tracking from planning to remediation.',
    integrationSummary: 'Push automated continuous controls monitoring data and ledger anomaly triggers straight into SAP Audit Management work packages.',
    brandColor: '#0284c7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    badgeText: 'SAP NetWeaver / REST Ready',
    apiEndpoints: ['/api/v1/audit/sap/work-packages', '/api/v1/audit/sap/controls-evidence'],
    webhookEvents: ['sap.control.exception', 'sap.finding.created', 'sap.audit.approved'],
    samplePayload: {
      event: 'sap.audit.control_tested',
      package_id: 'SAP-WP-2026-A1',
      control_id: 'SOX-ITGC-04',
      status: 'EFFECTIVE',
      sample_size: 500,
      exceptions_found: 0,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/sap/controls-evidence \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"audit_plan_id":"SAP-2026-Q4","control_code":"FIN-01"}'`,
    tsSnippet: `const sapWorkPackage = await msmeBooks.sapAudit.streamEvidence({
  controlId: 'SOX-FIN-404',
  verificationPeriod: '2026-Q3'
});`,
    pythonSnippet: `sap_evidence = msme.sap_audit.export_control_testing(
    control_id="FIN-01",
    work_package="WP-SAP-892"
)`,
  },
  {
    id: 'auditboard',
    name: 'Auditboard',
    shortName: 'Auditboard',
    category: 'risk_sox',
    categoryLabel: 'Connected SOX, Risk & Audit',
    description: 'Modern connected risk, internal audit, and SOX management platform.',
    integrationSummary: 'Instantly transmit verified controls testing evidence, population samples, and segregation-of-duties logs into AuditBoard OpsAudit.',
    brandColor: '#7c3aed',
    accentBg: 'rgba(124, 58, 237, 0.12)',
    badgeText: 'OpsAudit & SOXHUB Sync',
    apiEndpoints: ['/api/v1/audit/auditboard/samples', '/api/v1/audit/auditboard/evidence'],
    webhookEvents: ['auditboard.sample.generated', 'auditboard.issue.flagged'],
    samplePayload: {
      event: 'auditboard.evidence.uploaded',
      workpaper_code: 'WP-REV-001',
      automated_test: true,
      verification_status: 'passed',
      records_evaluated: 1240,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/auditboard/samples \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"population":"revenue_journal_lines","seed":42,"sample_count":25}'`,
    tsSnippet: `const auditboardSample = await msmeBooks.auditboard.createTestingSample({
  module: 'OpsAudit',
  workpaperId: 'WP-REV-2026',
  auditCycle: 'FY2026-YearEnd'
});`,
    pythonSnippet: `auditboard_res = msme_client.auditboard.post_testing_sample(
    workpaper_ref="WP-REV-01",
    strata=[{"range": [0, 50000], "count": 10}]
)`,
  },
  {
    id: 'tickmark',
    name: 'Tickmark',
    shortName: 'Tickmark',
    category: 'workpapers',
    categoryLabel: 'Audit Workpaper Automation',
    description: 'Specialized workpaper indexing, electronic tickmark tracking, and substantive testing software.',
    integrationSummary: 'Seamlessly link MsmeBooks account balances to standard Tickmark audit schedules with real-time discrepancy alerts.',
    brandColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    badgeText: 'Automated Tickmarking',
    apiEndpoints: ['/api/v1/audit/tickmark/schedules', '/api/v1/audit/tickmark/annotations'],
    webhookEvents: ['schedule.reconciled', 'variance.detected'],
    samplePayload: {
      event: 'tickmark.schedule.verified',
      schedule_ref: 'SCH-BANK-01',
      variance: 0.0,
      tickmark_symbol: '✓_CONFIRMED',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/tickmark/schedules \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"schedule_type":"bank_reconciliation"}'`,
    tsSnippet: `await msmeBooks.tickmark.attachAuditSchedule({
  scheduleCode: 'C-1',
  periodEnding: '2026-12-31',
  autoTickVerified: true
});`,
    pythonSnippet: `schedule = msme.tickmark.generate_schedule(
    code="A-1",
    account_filter="cash_and_equivalents"
)`,
  },
  {
    id: 'teammate',
    name: 'Teammate',
    shortName: 'TeamMate+ (WK)',
    category: 'compliance_grc',
    categoryLabel: 'Global Audit Management',
    description: 'Wolters Kluwer TeamMate+ audit and risk management system used by premier audit firms worldwide.',
    integrationSummary: 'Push structured audit work programs, electronic working papers, and findings into TeamMate+ seamlessly.',
    brandColor: '#0284c7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    badgeText: 'TeamMate+ API Connected',
    apiEndpoints: ['/api/v1/audit/teammate/programs', '/api/v1/audit/teammate/findings'],
    webhookEvents: ['teammate.program.synced', 'teammate.finding.closed'],
    samplePayload: {
      event: 'teammate.workprogram.synced',
      audit_project_id: 'TM-2026-AUD-09',
      procedures_completed: 18,
      procedures_total: 18,
      status: 'ReadyForReview',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/teammate/programs \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"project_id":"TM-2026-09"}'`,
    tsSnippet: `const teamMateSync = await msmeBooks.teamMate.pushWorkPapers({
  projectId: 'TM-PRJ-441',
  milestone: 'YearEndFieldwork'
});`,
    pythonSnippet: `tm_res = msme.teammate.sync_audit_files(
    project_id="TM-2026-AUD",
    files=["TrialBalance.xlsx", "GL_Detail.parquet"]
)`,
  },
  {
    id: 'metric-stream',
    name: 'Metric stream',
    shortName: 'MetricStream',
    category: 'compliance_grc',
    categoryLabel: 'GRC & Continuous Audit',
    description: 'Enterprise governance, risk management, regulatory compliance, and internal audit software.',
    integrationSummary: 'Automated continuous risk assessments and financial metrics pipeline directly feeding MetricStream GRC dashboards.',
    brandColor: '#ea580c',
    accentBg: 'rgba(234, 88, 12, 0.12)',
    badgeText: 'GRC Pipeline Integrated',
    apiEndpoints: ['/api/v1/audit/metricstream/kri-feed', '/api/v1/audit/metricstream/remediation'],
    webhookEvents: ['metricstream.kri.breached', 'metricstream.action.logged'],
    samplePayload: {
      event: 'metricstream.kri.evaluated',
      kri_code: 'KRI-UNRECONCILED-BAL',
      metric_value: 0.0,
      threshold_status: 'GREEN',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/metricstream/kri-feed \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"assessment_cycle":"2026-ANNUAL"}'`,
    tsSnippet: `const kriUpdate = await msmeBooks.metricStream.publishKriUpdate({
  indicator: 'CASH_RATIO_VOLATILITY',
  status: 'OPTIMAL'
});`,
    pythonSnippet: `metric_stream.publish_metrics({
    "cycle": "2026-Q4",
    "liquidity_check": True
})`,
  },
  {
    id: 'servicenow',
    name: 'Servicenow',
    shortName: 'ServiceNow Audit',
    category: 'compliance_grc',
    categoryLabel: 'Enterprise Digital Workflow',
    description: 'ServiceNow Audit Management connects enterprise workflows with continuous compliance validation.',
    integrationSummary: 'Push automated audit task checklists, approval gates, and ledger change records into ServiceNow GRC Audit modules.',
    brandColor: '#16a34a',
    accentBg: 'rgba(22, 163, 74, 0.12)',
    badgeText: 'ServiceNow Store Ready',
    apiEndpoints: ['/api/v1/audit/servicenow/audit-tasks', '/api/v1/audit/servicenow/evidence-records'],
    webhookEvents: ['sn.audit_task.completed', 'sn.remediation.assigned'],
    samplePayload: {
      event: 'sn.audit_task.auto_resolved',
      sys_id: 'sn_task_948202472',
      task_type: 'automated_ledger_reconciliation',
      status: 'Closed Complete',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/servicenow/audit-tasks \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"sysparm_engagement":"ENG001004"}'`,
    tsSnippet: `const snAuditTask = await msmeBooks.serviceNow.postAuditEvidence({
  engagementSysId: 'ENG001004',
  attachmentType: 'AutomatedReconciliationReport'
});`,
    pythonSnippet: `sn_response = msme.servicenow.update_audit_engagement(
    engagement_id="ENG001004",
    data={"auto_audit_status": "Passed"}
)`,
  },
  {
    id: 'pinkr',
    name: 'Pinkr( Auditrack)',
    shortName: 'Pinkr / Auditrack',
    category: 'compliance_grc',
    categoryLabel: 'Continuous Audit Trail & Tracking',
    description: 'Real-time financial transaction traceability, audit trail recording, and fraud event logging.',
    integrationSummary: 'Streams every journal mutation, user ledger override, and currency conversion directly to the Auditrack tamper-evident log.',
    brandColor: '#ec4899',
    accentBg: 'rgba(236, 72, 153, 0.12)',
    badgeText: 'Realtime Audit Trail',
    apiEndpoints: ['/api/v1/audit/pinkr/event-stream', '/api/v1/audit/pinkr/hash-chain'],
    webhookEvents: ['pinkr.ledger.tamper_check', 'pinkr.audit_trail.stamped'],
    samplePayload: {
      event: 'pinkr.audit_trail.tamper_verified',
      block_height: 89402,
      cryptographic_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      integrity_status: 'VALID',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/pinkr/event-stream \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"verify_integrity":true}'`,
    tsSnippet: `const auditTrailVerification = await msmeBooks.pinkr.verifyAuditTrail({
  startDate: '2026-01-01',
  endDate: '2026-10-31'
});`,
    pythonSnippet: `pinkr_status = msme.pinkr.stream_ledger_events(
    channel="production-general-ledger"
)`,
  },
  {
    id: 'greatsoft',
    name: 'Greatsoft',
    shortName: 'GreatSoft',
    category: 'practice_mgmt',
    categoryLabel: 'Practice Management & Audit Records',
    description: 'Comprehensive accounting practice management, time tracking, client billing, and statutory audit register.',
    integrationSummary: 'Connect client accounting records and engagement progress directly to GreatSoft CRM and billing modules.',
    brandColor: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    badgeText: 'GreatSoft Certified',
    apiEndpoints: ['/api/v1/audit/greatsoft/engagements', '/api/v1/audit/greatsoft/client-billing'],
    webhookEvents: ['greatsoft.job.synced', 'greatsoft.invoice.matched'],
    samplePayload: {
      event: 'greatsoft.job.updated',
      job_code: 'GS-AUD-2026',
      wip_hours_allocated: 42.5,
      engagement_stage: 'Final Analytical Review',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/greatsoft/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"client_code":"GS-C992"}'`,
    tsSnippet: `await msmeBooks.greatSoft.linkEngagement({
  jobId: 'GS-2026-AUDIT',
  syncClientWorkpapers: true
});`,
    pythonSnippet: `gs_job = msme.greatsoft.update_job_status(
    job_id="GS-2026",
    status="FieldworkComplete"
)`,
  },
  {
    id: 'datagrow',
    name: 'Datagrow',
    shortName: 'DataGrow',
    category: 'compliance_grc',
    categoryLabel: 'Agricultural & SME Audit Tracking',
    description: 'Precision compliance, harvest tracking, inventory validation, and statutory farm audit management.',
    integrationSummary: 'Synchronize inventory counts, warehouse valuation, and harvest ledger adjustments straight into DataGrow audit sheets.',
    brandColor: '#84cc16',
    accentBg: 'rgba(132, 204, 22, 0.12)',
    badgeText: 'Agri-Audit Specialized',
    apiEndpoints: ['/api/v1/audit/datagrow/inventory-verification', '/api/v1/audit/datagrow/valuation'],
    webhookEvents: ['datagrow.inventory.verified', 'datagrow.cost_basis.updated'],
    samplePayload: {
      event: 'datagrow.audit.valuation_confirmed',
      batch_id: 'DG-HARVEST-2026-B4',
      biological_asset_value: 320000.0,
      inspection_passed: true,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/datagrow/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"crop_cycle":"2026-Q3"}'`,
    tsSnippet: `await msmeBooks.dataGrow.pushInventoryAudit({
  warehouseId: 'WH-LAGOS-01',
  valuationMethod: 'FIFO'
});`,
    pythonSnippet: `dg_res = msme.datagrow.export_crop_inventory(
    cycle="2026-Q4"
)`,
  },
  {
    id: 'arbutus',
    name: 'Arbutus',
    shortName: 'Arbutus Analytics',
    category: 'data_analytics',
    categoryLabel: 'Audit Analytics & Fraud Detection',
    description: 'High-speed audit analytics software engineered for massive data interrogation and Benford law analysis.',
    integrationSummary: 'Direct connector feeds 100% of general ledger transactions into Arbutus tables for instant automated anomaly queries.',
    brandColor: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.12)',
    badgeText: 'Automated Benford & G/L Scan',
    apiEndpoints: ['/api/v1/audit/arbutus/table-export', '/api/v1/audit/arbutus/benford-scan'],
    webhookEvents: ['arbutus.query.executed', 'arbutus.anomaly.alert'],
    samplePayload: {
      event: 'arbutus.fraud_scan.completed',
      records_analyzed: 45089,
      benford_compliance_score: 98.4,
      round_dollar_flags: 3,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/arbutus/benford-scan \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"account_range":"4000-4999"}'`,
    tsSnippet: `const scanResults = await msmeBooks.arbutus.runAnalytics({
  ledger: 'GeneralLedger2026',
  tests: ['DuplicateInvoices', 'WeekendPostings', 'BenfordAnalysis']
});`,
    pythonSnippet: `arbutus_scan = msme.arbutus.execute_scripts(
    test_suite="StandardYearEndAudit"
)`,
  },
  {
    id: 'exclaim-innovation',
    name: 'Exclaim innovation',
    shortName: 'Exclaim Innovation',
    category: 'compliance_grc',
    categoryLabel: 'Regulatory Compliance & Tax Audit',
    description: 'Automated regulatory governance, statutory reporting, and digital audit workpapers.',
    integrationSummary: 'Direct feed maps statutory tax registers and VAT schedules into Exclaim Innovation audit packages.',
    brandColor: '#6366f1',
    accentBg: 'rgba(99, 102, 241, 0.12)',
    badgeText: 'Regulatory Tax Audit Ready',
    apiEndpoints: ['/api/v1/audit/exclaim/statutory-vat', '/api/v1/audit/exclaim/withholding-tax'],
    webhookEvents: ['exclaim.vat_return.validated', 'exclaim.tax_audit.ready'],
    samplePayload: {
      event: 'exclaim.tax_schedule.verified',
      vat_reconciled: true,
      withholding_tax_variance: 0.0,
      compliance_seal: 'EXCLAIM-SEAL-904',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/exclaim/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"tax_period":"2026-M10"}'`,
    tsSnippet: `await msmeBooks.exclaim.pushTaxAuditWorkpapers({
  vatPeriod: '2026-10',
  autoReconcile: true
});`,
    pythonSnippet: `exclaim_tax = msme.exclaim.sync_schedules(
    tax_type="VAT_WHT",
    period="2026-Q3"
)`,
  },
  {
    id: 'surtech',
    name: 'Surtech',
    shortName: 'Surtech',
    category: 'compliance_grc',
    categoryLabel: 'Fintech Audit & Control Systems',
    description: 'Surtech provides automated reconciliation controls and enterprise fintech audit integrations.',
    integrationSummary: 'Push multi-gateway payment settlement records and multi-currency exchange reconciliations into Surtech.',
    brandColor: '#0284c7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    badgeText: 'Fintech Reconciliation API',
    apiEndpoints: ['/api/v1/audit/surtech/settlement-reconciliation', '/api/v1/audit/surtech/fx-audit'],
    webhookEvents: ['surtech.settlement.matched', 'surtech.fx_gain_loss.confirmed'],
    samplePayload: {
      event: 'surtech.reconciliation.cleared',
      batch_ref: 'SURTECH-FX-2026-10',
      settlement_accounts: 4,
      discrepancy_amount: 0.0,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/surtech/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"channel":"online_settlements"}'`,
    tsSnippet: `await msmeBooks.surtech.reconcilePaymentChannels({
  period: '2026-10',
  gateways: ['Paystack', 'Flutterwave', 'Stripe']
});`,
    pythonSnippet: `surtech_recon = msme.surtech.verify_settlements(
    batch_date="2026-10-31"
)`,
  },
  {
    id: 'icabinet',
    name: 'Icabinet',
    shortName: 'iCabinet',
    category: 'workpapers',
    categoryLabel: 'Secure Audit Archive & Document Vault',
    description: 'Encrypted document management vault designed for audit firm working paper retention and client records.',
    integrationSummary: 'Automatically archive verified audit workpapers, management representation letters, and trial balances into tamper-proof iCabinet folders.',
    brandColor: '#0d9488',
    accentBg: 'rgba(13, 148, 136, 0.12)',
    badgeText: '256-Bit Vault Sync',
    apiEndpoints: ['/api/v1/audit/icabinet/archive-vault', '/api/v1/audit/icabinet/evidence-index'],
    webhookEvents: ['icabinet.document.archived', 'icabinet.retention_policy.sealed'],
    samplePayload: {
      event: 'icabinet.archive.completed',
      cabinet_id: 'ICAB-2026-ENG-49',
      documents_sealed: 34,
      encryption: 'AES-GCM-256',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/icabinet/archive \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"client_id":"cl-9912","lock_retention_years":7}'`,
    tsSnippet: `await msmeBooks.iCabinet.archiveEngagementFiles({
  clientFolder: 'Acme-Holdings-2026',
  files: ['TrialBalance.pdf', 'SignedBankConfirmation.pdf']
});`,
    pythonSnippet: `icabinet_archive = msme.icabinet.seal_engagement_box(
    folder_id="ICAB-891"
)`,
  },
  {
    id: 'trullion',
    name: 'Trullion',
    shortName: 'Trullion AI',
    category: 'workpapers',
    categoryLabel: 'AI Accounting & Lease Audit',
    description: 'AI-driven accounting orchestration and audit platform for revenue recognition and lease accounting (IFRS 16 / ASC 842).',
    integrationSummary: 'Push contractual lease commitments and revenue schedules for instant AI contract comparison and audit testing.',
    brandColor: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.12)',
    badgeText: 'IFRS 16 / ASC 842 AI Audit',
    apiEndpoints: ['/api/v1/audit/trullion/lease-schedules', '/api/v1/audit/trullion/revenue-testing'],
    webhookEvents: ['trullion.contract.analyzed', 'trullion.audit_entry.created'],
    samplePayload: {
      event: 'trullion.lease.ai_verified',
      contract_id: 'TRUL-LEASE-892',
      ifrs16_liability_calculated: 1450000.0,
      confidence_score: 0.998,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/trullion/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"standard":"IFRS_16","period":"2026-FY"}'`,
    tsSnippet: `const trullionResult = await msmeBooks.trullion.syncLeasePortfolio({
  accountingStandard: 'IFRS16',
  autoDraftJournalEntries: true
});`,
    pythonSnippet: `trullion_ai = msme.trullion.audit_revenue_contracts(
    contracts_folder="2026_SaaS_Agreements"
)`,
  },
  {
    id: 'inflo',
    name: 'Inflo',
    shortName: 'Inflo Software',
    category: 'data_analytics',
    categoryLabel: 'Digital Audit Platform & Client Ingest',
    description: 'Digital audit platform delivering end-to-end client data extraction, process mining, and transaction risk scoring.',
    integrationSummary: 'Automated connector exports raw journals with pre-formatted Inflo ingestion schemas for instant engagement kick-off.',
    brandColor: '#3b82f6',
    accentBg: 'rgba(59, 130, 246, 0.12)',
    badgeText: 'Inflo Data Pipeline Ready',
    apiEndpoints: ['/api/v1/audit/inflo/data-ingest', '/api/v1/audit/inflo/process-mining'],
    webhookEvents: ['inflo.ingest.success', 'inflo.anomaly.scored'],
    samplePayload: {
      event: 'inflo.dataset.ingested',
      dataset_rows: 62900,
      ingestion_time_seconds: 3.2,
      data_integrity_check: 'PASS',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/inflo/data-ingest \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"client_code":"INF-492"}'`,
    tsSnippet: `await msmeBooks.inflo.streamAuditDataset({
  engagementRef: 'INF-ENG-2026',
  periodEnding: '2026-12-31'
});`,
    pythonSnippet: `inflo_client.push_dataset(
    engagement_id="INFLO-2026-A",
    file_format="parquet"
)`,
  },
  {
    id: 'diligent-one',
    name: 'Diligent one',
    shortName: 'Diligent One Platform',
    category: 'risk_sox',
    categoryLabel: 'Modern GRC, ESG & Internal Audit',
    description: 'Unified GRC platform for board governance, risk oversight, SOX compliance, and internal audit reporting.',
    integrationSummary: 'Push financial risk metrics, executive audit committee summaries, and SOX controls evidence to Diligent One.',
    brandColor: '#eab308',
    accentBg: 'rgba(234, 179, 8, 0.12)',
    badgeText: 'Diligent One Connected',
    apiEndpoints: ['/api/v1/audit/diligent/board-risk', '/api/v1/audit/diligent/sox-testing'],
    webhookEvents: ['diligent.audit_report.published', 'diligent.control.certified'],
    samplePayload: {
      event: 'diligent.sox.certified',
      cycle: '2026-Q4',
      certifying_officer: 'CFO',
      controls_passed_pct: 100.0,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/diligent/sox-testing \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"cycle":"2026-Q4"}'`,
    tsSnippet: `await msmeBooks.diligentOne.postRiskSummary({
  auditCommitteeQuarter: '2026-Q4',
  includeFinancialAssurance: true
});`,
    pythonSnippet: `diligent_res = msme.diligent.sync_controls(
    framework="SOX-404",
    auto_certify=True
)`,
  },
  {
    id: 'onspring',
    name: 'Onspring',
    shortName: 'Onspring Audit',
    category: 'risk_sox',
    categoryLabel: 'No-Code Audit Workflow & GRC',
    description: 'No-code process automation for internal audit planning, workpaper review, and issue tracking.',
    integrationSummary: 'Two-way integration triggers custom Onspring review workflows whenever material ledger entries are finalized.',
    brandColor: '#14b8a6',
    accentBg: 'rgba(20, 184, 166, 0.12)',
    badgeText: 'Onspring Workflow Triggers',
    apiEndpoints: ['/api/v1/audit/onspring/workflows', '/api/v1/audit/onspring/findings-tracker'],
    webhookEvents: ['onspring.workflow.triggered', 'onspring.issue.resolved'],
    samplePayload: {
      event: 'onspring.workflow.dispatched',
      workflow_name: 'YearEndAuditReview',
      stage: 'SeniorManagerReview',
      target_completion: '2026-11-15',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/onspring/workflows \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"trigger_audit_cycle":true}'`,
    tsSnippet: `await msmeBooks.onspring.startAuditWorkflow({
  appId: 'ONSPRING-AUDIT-APP-12',
  engagementCode: 'ENG-2026-44'
});`,
    pythonSnippet: `onspring_wf = msme.onspring.trigger_review_sequence(
    engagement_id="ENG-2026-44"
)`,
  },
  {
    id: 'asd-audit',
    name: 'ASD Audit',
    shortName: 'ASD Audit',
    category: 'workpapers',
    categoryLabel: 'Statutory Assurance & Workpapers',
    description: 'Tailored statutory audit platform for African and emerging market accounting practices.',
    integrationSummary: 'Push localized chart of accounts, statutory financial formats, and disclosure checklists directly into ASD Audit.',
    brandColor: '#f97316',
    accentBg: 'rgba(249, 115, 22, 0.12)',
    badgeText: 'African Statutory Formats',
    apiEndpoints: ['/api/v1/audit/asdaudit/chart-of-accounts', '/api/v1/audit/asdaudit/statutory-schedules'],
    webhookEvents: ['asdaudit.statutory_pack.generated', 'asdaudit.compliance.confirmed'],
    samplePayload: {
      event: 'asdaudit.pack.finalized',
      client_name: 'West African Agri Holdings',
      statutory_standard: 'IFRS for SMEs',
      audit_opinion_type: 'Unqualified',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/asdaudit/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"standard":"IFRS_SME"}'`,
    tsSnippet: `await msmeBooks.asdAudit.generateStatutoryPack({
  standard: 'IFRS_SME',
  includeTaxReconciliation: true
});`,
    pythonSnippet: `asd_res = msme.asd_audit.export_statutory_accounts(
    year=2026
)`,
  },
  {
    id: 'mindbridge-ai',
    name: 'Minbridge AI',
    shortName: 'MindBridge Ai',
    category: 'data_analytics',
    categoryLabel: 'AI Financial Risk & Anomaly Scoring',
    description: 'Pioneering AI auditing engine that analyzes 100% of journal entries and scores transaction risk using multiple machine learning algorithms.',
    integrationSummary: 'Push entire general ledger datasets directly to MindBridge Ai Auditor via automated API for complete ensemble AI anomaly detection.',
    brandColor: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    badgeText: '100% G/L AI Ensemble Scoring',
    apiEndpoints: ['/api/v1/audit/mindbridge/ensemble-ingest', '/api/v1/audit/mindbridge/risk-scores'],
    webhookEvents: ['mindbridge.scoring.completed', 'mindbridge.high_risk_entry.flagged'],
    samplePayload: {
      event: 'mindbridge.analysis.completed',
      total_entries_scored: 84320,
      high_risk_entries: 12,
      medium_risk_entries: 94,
      ai_ensemble_model: 'v4.2.1',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/mindbridge/ensemble-ingest \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"ai_ensemble_analysis":true}'`,
    tsSnippet: `const aiAuditReport = await msmeBooks.mindBridge.scoreGeneralLedger({
  period: '2026-FY',
  aiModels: ['ExpertSystem', 'BenfordLaw', 'VectorDistance', 'RareFlow']
});`,
    pythonSnippet: `mb_score = msme.mindbridge.run_ai_auditor(
    dataset="GL_2026_Full",
    export_top_anomalies=True
)`,
  },
  {
    id: 'intelex',
    name: 'Intelex',
    shortName: 'Intelex Audit',
    category: 'compliance_grc',
    categoryLabel: 'EHS, Quality & Regulatory Audit',
    description: 'Enterprise Environmental, Health, Safety, Quality (EHSQ) and ESG regulatory audit software.',
    integrationSummary: 'Stream carbon accounting metrics, sustainability expenditure ledgers, and ISO compliance data directly into Intelex audit modules.',
    brandColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    badgeText: 'ESG & Quality Audit Sync',
    apiEndpoints: ['/api/v1/audit/intelex/esg-ledger', '/api/v1/audit/intelex/iso-audit'],
    webhookEvents: ['intelex.esg_metric.updated', 'intelex.iso_audit.passed'],
    samplePayload: {
      event: 'intelex.esg.verified',
      audit_protocol: 'ISO 14001',
      emissions_expense_reconciled: true,
      non_conformances: 0,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/intelex/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"standard":"ISO_14001"}'`,
    tsSnippet: `await msmeBooks.intelex.syncSustainabilityAudit({
  framework: 'ISO_14001',
  periodEnding: '2026-10-31'
});`,
    pythonSnippet: `intelex_res = msme.intelex.push_esg_metrics(
    protocol="GRI_Standards"
)`,
  },
  {
    id: 'datasnipper',
    name: 'Datasnipper',
    shortName: 'DataSnipper',
    category: 'data_analytics',
    categoryLabel: 'Intelligent Excel Audit Automation',
    description: 'Transforms audit and financial documentation with AI and OCR matching directly inside Microsoft Excel.',
    integrationSummary: 'Sync general ledger transactions, invoices, and bank statements directly to DataSnipper Document Matching test packs.',
    brandColor: '#6366f1',
    accentBg: 'rgba(99, 102, 241, 0.12)',
    badgeText: 'Excel & OCR Document Match',
    apiEndpoints: ['/api/v1/audit/datasnipper/test-packs', '/api/v1/audit/datasnipper/ocr-packets'],
    webhookEvents: ['datasnipper.snip.matched', 'datasnipper.sample.snapped'],
    samplePayload: {
      event: 'datasnipper.document_match.completed',
      sample_size: 40,
      vouching_matches_found: 40,
      variance_unexplained: 0.0,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/datasnipper/test-packs \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"test_name":"accounts_payable_vouching"}'`,
    tsSnippet: `const snipperPack = await msmeBooks.dataSnipper.generateTestPack({
  testType: 'VouchingSample',
  accountRange: 'AccountsPayable'
});`,
    pythonSnippet: `datasnipper_res = msme.datasnipper.build_excel_test_pack(
    test_type="ThreeWayMatch"
)`,
  },
  {
    id: 'master-control-audit',
    name: 'Master control Audit',
    shortName: 'MasterControl',
    category: 'compliance_grc',
    categoryLabel: 'Life Sciences & Quality Audit',
    description: 'Quality management system audit and CAPA software engineered for pharmaceuticals, medical devices, and regulated industries.',
    integrationSummary: 'Push financial batch audit evidence and supplier quality validation records straight into MasterControl Audit.',
    brandColor: '#dc2626',
    accentBg: 'rgba(220, 38, 38, 0.12)',
    badgeText: 'FDA / GxP Quality Audit Sync',
    apiEndpoints: ['/api/v1/audit/mastercontrol/capa-evidence', '/api/v1/audit/mastercontrol/batch-release'],
    webhookEvents: ['mastercontrol.audit.passed', 'mastercontrol.capa.closed'],
    samplePayload: {
      event: 'mastercontrol.audit.closed',
      audit_id: 'MC-QMS-2026-89',
      standard: 'ISO 13485 / 21 CFR Part 11',
      capa_required: false,
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/mastercontrol/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"audit_standard":"ISO_13485"}'`,
    tsSnippet: `await msmeBooks.masterControl.submitQualityEvidence({
  auditId: 'MC-2026-QMS',
  complianceStandard: 'ISO13485'
});`,
    pythonSnippet: `mc_res = msme.master_control.export_gxp_audit(
    batch_id="BATCH-2026-09"
)`,
  },
  {
    id: 'netwrix-audit',
    name: 'Netwrix Audit',
    shortName: 'Netwrix Audit',
    category: 'compliance_grc',
    categoryLabel: 'IT Security, Identity & Compliance Audit',
    description: 'Comprehensive IT data security, privileged user monitoring, and cybersecurity compliance auditing.',
    integrationSummary: 'Push audit logs of admin privilege escalations, financial database schema mutations, and API key rotations into Netwrix.',
    brandColor: '#0284c7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    badgeText: 'ITGC & Cyber Audit Stamped',
    apiEndpoints: ['/api/v1/audit/netwrix/privilege-logs', '/api/v1/audit/netwrix/security-events'],
    webhookEvents: ['netwrix.privilege.audited', 'netwrix.schema.change_verified'],
    samplePayload: {
      event: 'netwrix.itgc.verified',
      audit_type: 'Financial_Database_Access',
      privileged_events: 18,
      unauthorized_access_detected: false,
      integrity_status: 'CLEAN',
    },
    curlSnippet: `curl -X POST https://api.msmebooks.com/v1/audit/netwrix/sync \\
  -H "Authorization: Bearer msme_live_key" \\
  -d '{"itgc_scope":"all_finance_systems"}'`,
    tsSnippet: `await msmeBooks.netwrix.exportSecurityAuditStream({
  scope: 'FinanceSystemITGC',
  certifyDatabaseIntegrity: true
});`,
    pythonSnippet: `netwrix_res = msme.netwrix.verify_system_access(
    quarter="2026-Q4"
)`,
  },
];
