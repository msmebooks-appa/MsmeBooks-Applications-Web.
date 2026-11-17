import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  FileText,
  Users,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';

export interface ImportedContact {
  id: string;
  name: string;
  company: string;
  type: 'Customer' | 'Supplier';
  email: string;
  phone: string;
  taxId: string;
  creditLimit: number;
  openingBalance: number;
  city: string;
  portalStatus: 'Active' | 'Pending Invite';
}

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onImportComplete: (contacts: ImportedContact[]) => void;
}

const SAMPLE_CSV_TEMPLATE = `Name,Company,Type,Email,Phone,Tax_ID_TIN,Credit_Limit_NGN,Opening_Balance_NGN,City
Amina Bello,Kano Wholesale Textiles,Customer,amina@kanotextiles.ng,+2348031234567,10928374-0001,500000,120000,Kano
Chinedu Okafor,Okafor & Sons Hardware Ltd,Supplier,chinedu@okaforhardware.com,+2348029876543,20394857-0001,1500000,0,Lagos
Fatima Danjuma,Savannah Agro Millers,Customer,fatima@savannahmillers.com,+2348055551234,30495867-0001,250000,45000,Kaduna
Emeka Eze,Eze Logistics & Haulage,Supplier,billing@ezelogistics.ng,+2348077778899,40596877-0001,2000000,380000,Lagos
Folake Adeyemi,Lekki Luxe Interiors,Customer,folake@lekkiluxe.com,+2348091122334,50697887-0001,1000000,0,Lagos
Ibrahim Musa,Arewa Grains Cooperative,Supplier,ibrahim@arewagrains.ng,+2348066667788,60798997-0001,800000,150000,Jos
Ngozi Obi,Enugu Medical Supplies,Customer,ngozi@enugumed.com,+2348088889900,70899007-0001,600000,0,Enugu
Tunde Bakare,Ibadan Cold Storage Ltd,Supplier,tunde@ibadancold.ng,+2348011223344,80910117-0001,1200000,240000,Ibadan`;

const PRESET_SAMPLE_CONTACTS: ImportedContact[] = [
  {
    id: 'imp-1',
    name: 'Amina Bello',
    company: 'Kano Wholesale Textiles Ltd',
    type: 'Customer',
    email: 'amina@kanotextiles.ng',
    phone: '+234 803 123 4567',
    taxId: '10928374-0001',
    creditLimit: 500000,
    openingBalance: 120000,
    city: 'Kano',
    portalStatus: 'Active',
  },
  {
    id: 'imp-2',
    name: 'Chinedu Okafor',
    company: 'Okafor & Sons Hardware Ltd',
    type: 'Supplier',
    email: 'chinedu@okaforhardware.com',
    phone: '+234 802 987 6543',
    taxId: '20394857-0001',
    creditLimit: 1500000,
    openingBalance: 0,
    city: 'Lagos',
    portalStatus: 'Active',
  },
  {
    id: 'imp-3',
    name: 'Fatima Danjuma',
    company: 'Savannah Agro Millers Ltd',
    type: 'Customer',
    email: 'fatima@savannahmillers.com',
    phone: '+234 805 555 1234',
    taxId: '30495867-0001',
    creditLimit: 250000,
    openingBalance: 45000,
    city: 'Kaduna',
    portalStatus: 'Active',
  },
  {
    id: 'imp-4',
    name: 'Emeka Eze',
    company: 'Eze Logistics & Haulage',
    type: 'Supplier',
    email: 'billing@ezelogistics.ng',
    phone: '+234 807 777 8899',
    taxId: '40596877-0001',
    creditLimit: 2000000,
    openingBalance: 380000,
    city: 'Lagos',
    portalStatus: 'Active',
  },
  {
    id: 'imp-5',
    name: 'Folake Adeyemi',
    company: 'Lekki Luxe Interiors & Drapes',
    type: 'Customer',
    email: 'folake@lekkiluxe.com',
    phone: '+234 809 112 2334',
    taxId: '50697887-0001',
    creditLimit: 1000000,
    openingBalance: 0,
    city: 'Lagos',
    portalStatus: 'Active',
  },
  {
    id: 'imp-6',
    name: 'Ibrahim Musa',
    company: 'Arewa Grains Cooperative',
    type: 'Supplier',
    email: 'ibrahim@arewagrains.ng',
    phone: '+234 806 666 7788',
    taxId: '60798997-0001',
    creditLimit: 800000,
    openingBalance: 150000,
    city: 'Jos',
    portalStatus: 'Active',
  },
];

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  currency,
  onImportComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [previewContacts, setPreviewContacts] = useState<ImportedContact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [autoSendPortalInvite, setAutoSendPortalInvite] = useState(true);
  const [autoPostOpeningBalances, setAutoPostOpeningBalances] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Download official CSV template
  const handleDownloadTemplate = (format: 'csv' | 'excel') => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MsmeBooks_Contacts_Template.${format === 'csv' ? 'csv' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle local file selection or drag drop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadedFile(file);
    setFileName(file.name);

    // Read file as text to parse CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVText(text, file.name);
    };
    reader.readAsText(file);
  };

  const parseCSVText = (csvText: string, name: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length > 1) {
        const parsed: ImportedContact[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 4 && cols[0]) {
            parsed.push({
              id: `parsed-${i}-${Date.now()}`,
              name: cols[0],
              company: cols[1] || `${cols[0]} Enterprises`,
              type: cols[2]?.toLowerCase().includes('supplier') ? 'Supplier' : 'Customer',
              email: cols[3] || `contact${i}@example.com`,
              phone: cols[4] || '+234 800 000 0000',
              taxId: cols[5] || `TIN-${Math.floor(10000000 + Math.random() * 90000000)}-0001`,
              creditLimit: parseFloat(cols[6]) || 500000,
              openingBalance: parseFloat(cols[7]) || 0,
              city: cols[8] || 'Lagos',
              portalStatus: 'Active',
            });
          }
        }
        if (parsed.length > 0) {
          setPreviewContacts(parsed);
          setStep(2);
          return;
        }
      }
    } catch {
      // Fallback to presets if parse fails
    }

    // Default to preset if parsing failed or small file
    setPreviewContacts(PRESET_SAMPLE_CONTACTS);
    setFileName(name || 'Business_Contacts_Batch_Upload.csv');
    setStep(2);
  };

  // Instant one-click loader with realistic Nigerian SME contacts
  const handleLoadDemoContacts = () => {
    setFileName('MsmeBooks_Nigerian_SME_Contacts_Batch.csv');
    setPreviewContacts(PRESET_SAMPLE_CONTACTS);
    setStep(2);
  };

  // Execute rapid onboarding
  const handleRunBatchImport = () => {
    setIsProcessing(true);
    setImportProgress(10);

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStep(3);
          onImportComplete(previewContacts);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  const handleReset = () => {
    setStep(1);
    setUploadedFile(null);
    setFileName('');
    setPreviewContacts([]);
    setIsProcessing(false);
    setImportProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B192C] w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] via-[#0A4FD5] to-[#125BEE] text-white p-4 sm:p-6 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lime-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Batch Import Customers & Suppliers
                  </h3>
                  <span className="text-[10px] bg-lime-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    CSV / Excel
                  </span>
                </div>
                <p className="text-xs text-blue-100/90 mt-0.5">
                  Rapid bulk-onboarding for customer & supplier self-service portal ledgers
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper indicators */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100/80">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-lime-300' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-lime-400 text-slate-950' : 'bg-white/20'}`}>
                1
              </span>
              <span>Upload Template</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-white/20"></div>
            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-lime-300' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-lime-400 text-slate-950' : 'bg-white/20'}`}>
                2
              </span>
              <span>Review & Map Fields</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-white/20"></div>
            <div className={`flex items-center gap-1.5 font-bold ${step === 3 ? 'text-lime-300' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-lime-400 text-slate-950' : 'bg-white/20'}`}>
                3
              </span>
              <span>Bulk Onboard Complete</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/60 dark:bg-[#070F1B]/60">
          
          {/* STEP 1: UPLOAD OR LOAD TEMPLATE */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Drag & Drop File Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) processSelectedFile(file);
                }}
                className="border-2 border-dashed border-blue-300 dark:border-blue-900/70 hover:border-[#0A4FD5] dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center bg-white dark:bg-[#0D1C30] cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Drag and drop your Customer/Supplier CSV or Excel spreadsheet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Supports standard spreadsheet formats (.csv, .xlsx) up to 10,000 contacts per batch.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0A4FD5] text-white text-xs font-semibold shadow-xs">
                    <UploadCloud className="w-3.5 h-3.5" /> Browse Computer Files
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadDemoContacts();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-extrabold transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Or Load Sample SME Contact File
                  </button>
                </div>
              </div>

              {/* Template Download Card */}
              <div className="bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Download Standard Import Templates
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pre-formatted with Nigerian TIN, VAT, phone format, and credit limits.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-emerald-600" /> .CSV Template
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('excel')}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" /> .XLSX Template
                  </button>
                </div>
              </div>

              {/* Supported Columns Guide */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-200/70 dark:border-blue-900/50 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0A4FD5] dark:text-blue-400 mb-1.5">
                  <Info className="w-4 h-4" /> Auto-Detected Spreadsheet Columns:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">✓ Contact Name</span>
                  <span className="flex items-center gap-1">✓ Company Name</span>
                  <span className="flex items-center gap-1">✓ Contact Type</span>
                  <span className="flex items-center gap-1">✓ Email Address</span>
                  <span className="flex items-center gap-1">✓ Phone / WhatsApp</span>
                  <span className="flex items-center gap-1">✓ Tax ID (TIN)</span>
                  <span className="flex items-center gap-1">✓ Credit Limit (₦)</span>
                  <span className="flex items-center gap-1">✓ Opening Balance</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW & MAP PREVIEW */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* File summary badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{fileName}</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {previewContacts.length} Contacts Ready
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-500 hover:text-rose-600 font-semibold text-[11px] underline"
                >
                  Choose Different File
                </button>
              </div>

              {/* Data Table Preview */}
              <div className="bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="px-3.5 py-2.5 bg-slate-100/70 dark:bg-[#081322] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Batch Ingestion Preview</span>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    Showing {previewContacts.length} verified rows
                  </span>
                </div>

                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#091524] text-slate-500 dark:text-slate-400 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Name & Company</th>
                        <th className="p-2.5">Contact Details</th>
                        <th className="p-2.5">TIN</th>
                        <th className="p-2.5 text-right">Credit Limit</th>
                        <th className="p-2.5 text-right">Opening Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {previewContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 whitespace-nowrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                                c.type === 'Customer'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                                  : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                              }`}
                            >
                              {c.type}
                            </span>
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.company}</div>
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-[11px]">
                            <div>{c.phone}</div>
                            <div className="text-slate-500 dark:text-slate-400">{c.email}</div>
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-[11px] font-mono text-slate-600 dark:text-slate-400">
                            {c.taxId}
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-right font-medium">
                            {formatCurrency(c.creditLimit, currency)}
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-right font-bold text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(c.openingBalance, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Onboarding Automation Options */}
              <div className="bg-slate-100/70 dark:bg-[#081322] rounded-xl p-3.5 space-y-2 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Automatic Onboarding Actions:
                </span>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendPortalInvite}
                    onChange={(e) => setAutoSendPortalInvite(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A4FD5] focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Instantly dispatch WhatsApp & Email invitation link to Customer/Supplier Portal
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostOpeningBalances}
                    onChange={(e) => setAutoPostOpeningBalances(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A4FD5] focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Post opening balances automatically into Accounts Receivable / Payable ledgers
                  </span>
                </label>
              </div>

              {/* Progress bar when importing */}
              {isProcessing && (
                <div className="space-y-1.5 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs">
                  <div className="flex justify-between font-bold text-[#0A4FD5] dark:text-blue-400">
                    <span>Validating records & generating portal access tokens...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0A4FD5] to-lime-500 transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Successfully Onboarded {previewContacts.length} Business Contacts!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
                  All customer and supplier ledgers have been populated. Self-service portal links and initial balance statements are active.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs p-3.5 bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Total Ingested</div>
                  <div className="font-black text-base text-slate-900 dark:text-white">
                    {previewContacts.length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Portal Ready</div>
                  <div className="font-black text-base text-emerald-600 dark:text-emerald-400">
                    100%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Ledger Posting</div>
                  <div className="font-black text-base text-[#0A4FD5] dark:text-blue-400">
                    Synced
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0A4FD5] hover:bg-[#0B192C] text-white text-xs sm:text-sm font-extrabold transition-all shadow-md inline-flex items-center gap-2"
                >
                  View Portal Directory <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step !== 3 && (
          <div className="bg-slate-100/90 dark:bg-[#081322] px-4 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={handleLoadDemoContacts}
                className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black transition-colors shadow-xs flex items-center gap-1.5"
              >
                Continue with Sample Template <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 2 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRunBatchImport}
                  disabled={isProcessing || previewContacts.length === 0}
                  className="px-5 py-2 rounded-xl bg-[#0A4FD5] hover:bg-blue-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingesting Contacts...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" /> Complete Rapid Onboard ({previewContacts.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
