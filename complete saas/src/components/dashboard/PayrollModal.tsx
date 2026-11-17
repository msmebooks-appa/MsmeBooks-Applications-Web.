import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  Building2,
  X,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Check,
  Search,
} from 'lucide-react';
import { Company, Branch, UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  branch: Branch;
  role: UserRole;
  currencySymbol?: string;
}

interface EmployeePayroll {
  id: string;
  name: string;
  role: string;
  department: string;
  grossPay: number;
  taxPAYE: number;
  pension: number;
  netPay: number;
  bankName: string;
  accountNumber: string;
  status: 'Approved' | 'Pending' | 'Paid';
}

const INITIAL_STAFF_PAYROLL: EmployeePayroll[] = [
  {
    id: 'EMP-001',
    name: 'Ibrahim Danladi',
    role: 'Finance & Compliance Manager',
    department: 'Finance',
    grossPay: 850000,
    taxPAYE: 102000,
    pension: 68000,
    netPay: 680000,
    bankName: 'Access Bank PLC',
    accountNumber: '•••• 4921',
    status: 'Approved',
  },
  {
    id: 'EMP-002',
    name: 'Ngozi Okonjo',
    role: 'Head Store Operations',
    department: 'Operations',
    grossPay: 720000,
    taxPAYE: 86400,
    pension: 57600,
    netPay: 576000,
    bankName: 'Zenith Bank',
    accountNumber: '•••• 8812',
    status: 'Approved',
  },
  {
    id: 'EMP-003',
    name: 'Tunde Bakare',
    role: 'Senior Inventory Controller',
    department: 'Inventory',
    grossPay: 550000,
    taxPAYE: 60500,
    pension: 44000,
    netPay: 445500,
    bankName: 'GTBank (Guaranty Trust)',
    accountNumber: '•••• 3045',
    status: 'Pending',
  },
  {
    id: 'EMP-004',
    name: 'Amina Bello',
    role: 'Lead POS Cashier',
    department: 'Retail POS',
    grossPay: 380000,
    taxPAYE: 38000,
    pension: 30400,
    netPay: 311600,
    bankName: 'First Bank of Nigeria',
    accountNumber: '•••• 1290',
    status: 'Pending',
  },
  {
    id: 'EMP-005',
    name: 'Emeka Nwosu',
    role: 'Warehouse & Logistics Lead',
    department: 'Logistics',
    grossPay: 420000,
    taxPAYE: 42000,
    pension: 33600,
    netPay: 344400,
    bankName: 'UBA (United Bank for Africa)',
    accountNumber: '•••• 7734',
    status: 'Approved',
  },
];

export const PayrollModal: React.FC<PayrollModalProps> = ({
  isOpen,
  onClose,
  company,
  branch,
  role,
  currencySymbol = company.currencySymbol || '₦',
}) => {
  const toast = useToast();
  const [payrollPeriod, setPayrollPeriod] = useState('September 2026');
  const [staffList, setStaffList] = useState<EmployeePayroll[]>(INITIAL_STAFF_PAYROLL);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<EmployeePayroll | null>(null);

  if (!isOpen) return null;

  // Role permissions checking for payroll
  const canManagePayroll = [
    'super_admin',
    'business_owner',
    'finance_manager',
    'accountant',
    'administrator',
  ].includes(role);

  // Financial calculations
  const totalGross = staffList.reduce((acc, curr) => acc + curr.grossPay, 0);
  const totalTax = staffList.reduce((acc, curr) => acc + curr.taxPAYE, 0);
  const totalPension = staffList.reduce((acc, curr) => acc + curr.pension, 0);
  const totalNet = staffList.reduce((acc, curr) => acc + curr.netPay, 0);

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDisburseBatch = () => {
    if (!canManagePayroll) {
      toast.error(
        'Permission Restricted',
        'Your user role does not possess disbursement authorization to approve batch salary transfers.'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setStaffList((prev) =>
        prev.map((staff) => ({
          ...staff,
          status: 'Paid',
        }))
      );
      setIsProcessing(false);
      setBatchSuccess(true);
      toast.success(
        'Payroll Disbursed Successfully',
        `Batch payment of ${currencySymbol}${totalNet.toLocaleString()} transferred to ${staffList.length} staff bank accounts.`
      );
      setTimeout(() => setBatchSuccess(false), 3500);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Staff ID,Name,Role,Department,Gross Pay,PAYE Tax,Pension 8%,Net Pay,Bank,Account,Status\n';
    const csvRows = staffList
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.role}","${s.department}",${s.grossPay},${s.taxPAYE},${s.pension},${s.netPay},"${s.bankName}","${s.accountNumber}","${s.status}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MsmeBooks-Payroll-${branch.name.replace(/\s+/g, '-')}-${payrollPeriod.replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      'Payroll Register Exported',
      `Employee compensation breakdown downloaded for ${payrollPeriod}.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payroll-modal-title"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 via-white to-slate-50/80 dark:from-[#081726] dark:via-[#0B1E33] dark:to-[#081726] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5 text-[#9AE61C]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="payroll-modal-title"
                  className="text-base sm:text-lg font-bold text-[#072644] dark:text-white"
                >
                  Payroll & Staff Compensation
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] border border-[#84CC16]/40">
                  Ctrl+P Shortcut
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {company.name} • {branch.name} • {payrollPeriod}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={payrollPeriod}
              onChange={(e) => setPayrollPeriod(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close payroll dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RBAC Notice if user role has limited access */}
        {!canManagePayroll && (
          <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Read-Only Preview:</strong> Your current role (
                <span className="capitalize">{role.replace('_', ' ')}</span>) does not have disbursement authority. Switch to Business Owner or Finance Manager to approve batches.
              </span>
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Total Gross Wages
              </span>
              <div className="text-base sm:text-lg font-bold text-[#072644] dark:text-white">
                {currencySymbol}{totalGross.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">
                {staffList.length} Active Employees
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                PAYE Tax Deductions
              </span>
              <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                {currencySymbol}{totalTax.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Remittable to State IRS</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Pension Fund (8%)
              </span>
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                {currencySymbol}{totalPension.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">RSA Pension Custodian</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#84CC16]/40 dark:border-[#84CC16]/30 bg-[#84CC16]/10 dark:bg-[#84CC16]/5 space-y-1">
              <span className="text-[11px] font-semibold text-[#0F4C81] dark:text-[#9AE61C] block">
                Total Net Disbursable
              </span>
              <div className="text-base sm:text-lg font-bold text-[#072644] dark:text-[#9AE61C]">
                {currencySymbol}{totalNet.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Bank Transfer Batch Ready
              </span>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                disabled={!canManagePayroll || isProcessing}
                onClick={handleDisburseBatch}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  !canManagePayroll
                    ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500'
                    : 'bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#84CC16] dark:hover:bg-[#72B013] text-white dark:text-[#072644]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Processing Disbursement...' : 'Disburse Payroll Batch'}</span>
              </button>
            </div>
          </div>

          {/* Batch Success Feedback Banner */}
          {batchSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Disbursement Completed!</strong> Direct salary payments totaling{' '}
                {currencySymbol}{totalNet.toLocaleString()} have been authorized and sent to bank switch.
              </span>
            </div>
          )}

          {/* Staff Payroll Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#071626]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071F36] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Role & Dept</th>
                    <th className="py-2.5 px-3 text-right">Gross Pay</th>
                    <th className="py-2.5 px-3 text-right">PAYE Tax</th>
                    <th className="py-2.5 px-3 text-right">Pension (8%)</th>
                    <th className="py-2.5 px-3 text-right">Net Pay</th>
                    <th className="py-2.5 px-3">Bank Details</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#072644] dark:text-white">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{staff.id}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{staff.role}</div>
                        <div className="text-[10px] text-slate-400">{staff.department}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {currencySymbol}{staff.grossPay.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">
                        -{currencySymbol}{staff.taxPAYE.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400">
                        -{currencySymbol}{staff.pension.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#072644] dark:text-[#9AE61C]">
                        {currencySymbol}{staff.netPay.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">{staff.bankName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{staff.accountNumber}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            staff.status === 'Paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : staff.status === 'Approved'
                              ? 'bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C]'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#081726] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              Ctrl+P
            </kbd>
            <span>toggles this payroll window anytime from anywhere in the app</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
