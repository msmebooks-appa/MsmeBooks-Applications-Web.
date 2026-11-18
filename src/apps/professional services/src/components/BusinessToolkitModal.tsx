import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Check, 
  FileSpreadsheet, 
  Table, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  format: 'CSV' | 'JSON' | 'TXT';
  filename: string;
  content: string;
  previewRows: Array<Record<string, string>>;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-invoice',
    title: 'Pan-African SME Commercial Invoice Template',
    category: 'Billing & Invoicing',
    description: 'Compliant VAT-ready commercial invoice layout tailored for African MSMEs with withholding tax (WHT) deductions and bank details.',
    format: 'CSV',
    filename: 'MsmeBooks_SME_Invoice_Template.csv',
    content: `Invoice Number,Date,Due Date,Customer Name,Customer TIN,Item Description,Qty,Unit Price,VAT Rate %,VAT Amount,Subtotal,Total
INV-2026-001,2026-10-25,2026-11-08,Alpha Retailers Ltd,10482910-0001,Cloud POS Monthly Subscription,1,45000,7.5,3375,45000,48375
INV-2026-001,2026-10-25,2026-11-08,Alpha Retailers Ltd,10482910-0001,Onsite Financial Review (Hours),4,15000,7.5,4500,60000,64500
INV-2026-002,2026-10-26,2026-11-09,Sahara Logistics LLP,90238102-0002,Annual Statutory Returns Filing,1,120000,7.5,9000,120000,129000`,
    previewRows: [
      { 'Invoice No': 'INV-2026-001', 'Customer': 'Alpha Retailers Ltd', 'Item': 'Cloud POS Monthly Subscription', 'Qty': '1', 'Price': '₦45,000', 'VAT (7.5%)': '₦3,375', 'Total': '₦48,375' },
      { 'Invoice No': 'INV-2026-001', 'Customer': 'Alpha Retailers Ltd', 'Item': 'Onsite Financial Review (Hours)', 'Qty': '4', 'Price': '₦15,000', 'VAT (7.5%)': '₦4,500', 'Total': '₦64,500' },
      { 'Invoice No': 'INV-2026-002', 'Customer': 'Sahara Logistics LLP', 'Item': 'Annual Statutory Returns Filing', 'Qty': '1', 'Price': '₦120,000', 'VAT (7.5%)': '₦9,000', 'Total': '₦129,000' }
    ]
  },
  {
    id: 'tpl-pnl',
    title: 'Monthly SME Profit & Loss (P&L) Statement',
    category: 'Financial Management',
    description: 'Standard income, cost of goods sold (COGS), operating expenses, and net profit ledger suitable for loan applications and tax filings.',
    format: 'CSV',
    filename: 'MsmeBooks_Monthly_PnL_Template.csv',
    content: `Period,Category,Account Name,Budgeted,Actual,Variance,Notes
2026-10,Revenue,Gross Merchandise Sales,4500000,4850000,+350000,Higher weekend footfall
2026-10,Revenue,Service Consultations,850000,920000,+70000,New client retainers
2026-10,COGS,Inventory Wholesale Purchases,2800000,2950000,-150000,Supplier price increase
2026-10,COGS,Packaging & Delivery Logistics,220000,210000,+10000,Optimized dispatch
2026-10,Operating Expense,Salaries & Casual Wages,650000,650000,0,Paid on 25th
2026-10,Operating Expense,Store Rent & Utilities,300000,290000,+10000,Power conservation
2026-10,Operating Expense,Software & Cloud POS Subscriptions,45000,45000,0,MsmeBooks Standard Plan
2026-10,Tax & Reserves,VAT & WHT Remittance Provisions,240000,255000,-15000,Due by 21st next month`,
    previewRows: [
      { 'Category': 'Revenue', 'Account': 'Gross Merchandise Sales', 'Budgeted': '₦4,500,000', 'Actual': '₦4,850,000', 'Variance': '+₦350,000' },
      { 'Category': 'COGS', 'Account': 'Inventory Wholesale Purchases', 'Budgeted': '₦2,800,000', 'Actual': '₦2,950,000', 'Variance': '-₦150,000' },
      { 'Category': 'Opex', 'Account': 'Salaries & Casual Wages', 'Budgeted': '₦650,000', 'Actual': '₦650,000', 'Variance': '₦0' },
      { 'Category': 'Opex', 'Account': 'MsmeBooks Cloud POS Subscription', 'Budgeted': '₦45,000', 'Actual': '₦45,000', 'Variance': '₦0' }
    ]
  },
  {
    id: 'tpl-tax-checklist',
    title: 'Pan-African MSME Tax Compliance Checklist',
    category: 'Tax & Regulatory',
    description: 'Comprehensive month-by-month and statutory checklist for VAT, PAYE, CIT, Withholding Tax, and pension remittances.',
    format: 'TXT',
    filename: 'MsmeBooks_Tax_Compliance_Checklist.txt',
    content: `=======================================================
MSMEBOOKS PAN-AFRICAN SME TAX COMPLIANCE CHECKLIST (2026)
=======================================================

1. VALUE ADDED TAX (VAT)
[ ] Reconcile monthly sales invoices and input VAT receipts.
[ ] Calculate Output VAT minus allowable Input VAT.
[ ] File VAT returns with national tax revenue authority by 21st of following month.
[ ] Archive tax clearance invoices with verified QR codes.

2. WITHHOLDING TAX (WHT)
[ ] Deduct 5% or 10% on contractor, vendor, or professional service invoices.
[ ] Issue WHT credit notes / receipts to vendors within 30 days.
[ ] Remit deducted WHT to state or federal revenue service.

3. PAY AS YOU EARN (PAYE) & STATUTORY PENSIONS
[ ] Calculate gross employee payroll, deductions, and consolidated relief.
[ ] Remit PAYE income tax to State Internal Revenue Service by 10th.
[ ] Remit 10% employer + 8% employee statutory pension contributions to PFA.
[ ] Update employee records and pay slips.

4. COMPANY INCOME TAX (CIT) & EDUCATION TAX
[ ] Close annual management accounts with audited balances.
[ ] Reconcile capital allowances on qualifying plant & machinery.
[ ] Submit CIT returns within 6 months of financial year-end.

Note: Consult a verified MsmeBooks partner firm for localized regulatory guidelines.`,
    previewRows: [
      { 'Tax Type': 'Value Added Tax (VAT)', 'Frequency': 'Monthly (21st)', 'Action Required': 'Reconcile sales & remit net VAT', 'Status': 'Required' },
      { 'Tax Type': 'Withholding Tax (WHT)', 'Frequency': 'Per Transaction', 'Action Required': 'Deduct 5-10% & issue credit notes', 'Status': 'Required' },
      { 'Tax Type': 'PAYE & Pensions', 'Frequency': 'Monthly (10th)', 'Action Required': 'Remit payroll tax & pension funds', 'Status': 'Required' },
      { 'Tax Type': 'Company Income Tax (CIT)', 'Frequency': 'Annual (6 months)', 'Action Required': 'Submit audited accounts & returns', 'Status': 'Required' }
    ]
  },
  {
    id: 'tpl-petty-cash',
    title: 'Daily Petty Cash & Expense Voucher Tracker',
    category: 'Internal Controls',
    description: 'Prevent internal cash leakage and track daily store expenses, fuel, logistics, and sundry disbursements.',
    format: 'CSV',
    filename: 'MsmeBooks_Petty_Cash_Log.csv',
    content: `Date,Voucher No,Recipient / Payee,Expense Purpose,Category,Opening Balance,Amount Spent,Closing Balance,Approved By
2026-10-25,PCV-041,Generator Fuel Vendor,Diesel supply for main generator,Utilities,150000,35000,115000,Store Manager
2026-10-25,PCV-042,Dispatch Rider,Urgent document courier to client,Logistics,115000,4500,110500,Accountant
2026-10-26,PCV-043,Office Depot,Receipt rolls & POS thermal paper,Store Supplies,110500,18000,92500,Store Manager
2026-10-26,PCV-044,Sanitation Staff,Store cleaning detergent & sanitizers,Maintenance,92500,6200,86300,Supervisor`,
    previewRows: [
      { 'Date': '2026-10-25', 'Voucher': 'PCV-041', 'Purpose': 'Diesel generator fuel supply', 'Spent': '₦35,000', 'Balance': '₦115,000', 'Approved By': 'Store Manager' },
      { 'Date': '2026-10-25', 'Voucher': 'PCV-042', 'Purpose': 'Urgent document courier', 'Spent': '₦4,500', 'Balance': '₦110,500', 'Approved By': 'Accountant' },
      { 'Date': '2026-10-26', 'Voucher': 'PCV-043', 'Purpose': 'POS receipt rolls & paper', 'Spent': '₦18,000', 'Balance': '₦92,500', 'Approved By': 'Store Manager' }
    ]
  }
];

export const BusinessToolkitModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(TEMPLATES[0]);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (tpl: TemplateItem) => {
    try {
      const mimeType = tpl.format === 'JSON' ? 'application/json' : 'text/csv;charset=utf-8;';
      const blob = new Blob([tpl.content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', tpl.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(tpl.id);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleCopy = (tpl: TemplateItem) => {
    try {
      navigator.clipboard.writeText(tpl.content);
      setCopiedSuccess(tpl.id);
      setTimeout(() => setCopiedSuccess(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1464C8] to-[#B7E532] flex items-center justify-center text-[#102B4E] font-black shadow-md">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-full">
                  Free SME Toolkit
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">Ready-to-use CSV & Excel Files</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Business Accounting & Compliance Toolkit
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-[#08121E]">
          
          {/* Left Column: Template Selection List */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Select Business Template
            </div>
            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#0D1D31] border-[#1464C8] dark:border-[#B7E532] shadow-md ring-2 ring-[#1464C8]/10'
                      : 'bg-white dark:bg-[#0A1727] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      .{tpl.format.toLowerCase()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#102B4E] dark:text-slate-100 mt-2">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {tpl.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">{tpl.filename}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(tpl);
                      }}
                      className="text-[#1464C8] dark:text-[#B7E532] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{downloadSuccess === tpl.id ? 'Downloaded' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Preview & Download Card */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            <div className="bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-black text-base text-[#102B4E] dark:text-white">
                      {selectedTemplate.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Table className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                      <span>Live Data Preview</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Compatible with Excel, Google Sheets & MsmeBooks</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 max-h-56">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] uppercase font-black tracking-wider">
                        <tr>
                          {Object.keys(selectedTemplate.previewRows[0] || {}).map((header, idx) => (
                            <th key={idx} className="p-2.5 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-600 dark:text-slate-300 text-[11px]">
                        {selectedTemplate.previewRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 whitespace-nowrap">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Integration with MsmeBooks Software Banner */}
                <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-bold text-[#1464C8] dark:text-[#B7E532] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Cloud Import Ready</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    This file can be directly uploaded to <strong>MsmeBooks Cloud Accounting</strong> to instantly configure your chart of accounts, automated invoice generation, or vendor tax deduction tables.
                  </p>
                </div>
              </div>

              {/* Download & Copy Action Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(selectedTemplate)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSuccess === selectedTemplate.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Raw Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(selectedTemplate)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#1464C8] hover:bg-[#1052a5] shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {downloadSuccess === selectedTemplate.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download {selectedTemplate.filename}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100/80 dark:bg-[#07111D] px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Need custom template setup or bookkeeping automation? Book a verified consultant on the marketplace.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
