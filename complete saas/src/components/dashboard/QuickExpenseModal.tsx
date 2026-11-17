import React, { useState } from 'react';
import {
  CreditCard,
  X,
  CheckCircle2,
  DollarSign,
  Calendar,
  Building2,
  Tag,
} from 'lucide-react';
import { Company, Branch } from '../../types';
import { useToast } from '../../context/ToastContext';

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  branch: Branch;
  currencySymbol?: string;
  onExpenseCreated?: (expense: any) => void;
}

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
  company,
  branch,
  currencySymbol = company.currencySymbol || '₦',
  onExpenseCreated,
}) => {
  const toast = useToast();
  const [vendorName, setVendorName] = useState('Eko Power & Fuel Ltd');
  const [category, setCategory] = useState('Generator Diesel & Fuel');
  const [amount, setAmount] = useState('185000');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (Access Bank)');
  const [description, setDescription] = useState('Emergency diesel intake for warehouse power backup');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!vendorName.trim()) {
      toast.error('Payee / Vendor Required', 'Please provide a valid vendor or payee name for the expense record.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Invalid Amount', 'Please specify an expense amount greater than zero.');
      return;
    }

    setIsSuccess(true);
    toast.success(
      'Expense Logged Successfully',
      `${currencySymbol}${parsedAmount.toLocaleString()} recorded under ${category} paid to ${vendorName}.`
    );
    if (onExpenseCreated) {
      onExpenseCreated({
        vendorName,
        category,
        amount: parsedAmount,
        paymentMethod,
        description,
      });
    }
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 via-white to-slate-50/80 dark:from-[#081726] dark:via-[#0B1E33] dark:to-[#081726] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5 text-[#9AE61C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="expense-modal-title"
                  className="text-base sm:text-lg font-bold text-[#072644] dark:text-white"
                >
                  Log Business Expense
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] border border-[#84CC16]/40">
                  Ctrl+E Shortcut
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {company.name} • {branch.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close expense dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left flex-1">
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Expense Recorded!</strong> {currencySymbol}
                {parseFloat(amount).toLocaleString()} logged to general ledger under {category}.
              </span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Vendor / Beneficiary
            </label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="Generator Diesel & Fuel">Generator Diesel & Fuel</option>
                <option value="Store Rent & Rates">Store Rent & Rates</option>
                <option value="Packaging & Carton Boxes">Packaging & Carton Boxes</option>
                <option value="Staff Travel & Logistics">Staff Travel & Logistics</option>
                <option value="Internet & Telecoms">Internet & Telecoms</option>
                <option value="Equipment Repairs">Equipment Repairs</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Payment Source
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="Bank Transfer (Access Bank)">Bank Transfer (Access Bank)</option>
              <option value="Petty Cash Drawer">Petty Cash Drawer</option>
              <option value="Corporate Debit Card">Corporate Debit Card</option>
              <option value="Direct POS Settlement Account">Direct POS Settlement Account</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#84CC16] dark:hover:bg-[#72B013] text-white dark:text-[#072644] font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
