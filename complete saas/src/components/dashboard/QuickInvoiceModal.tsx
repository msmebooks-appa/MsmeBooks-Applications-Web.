import React, { useState } from 'react';
import {
  FileText,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  Calendar,
  Building2,
} from 'lucide-react';
import { Company, Branch } from '../../types';
import { useToast } from '../../context/ToastContext';

interface QuickInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  branch: Branch;
  currencySymbol?: string;
  onInvoiceCreated?: (invoice: any) => void;
}

export const QuickInvoiceModal: React.FC<QuickInvoiceModalProps> = ({
  isOpen,
  onClose,
  company,
  branch,
  currencySymbol = company.currencySymbol || '₦',
  onInvoiceCreated,
}) => {
  const toast = useToast();
  const [customerName, setCustomerName] = useState('Abuja Trade Hub Ltd');
  const [customerEmail, setCustomerEmail] = useState('billing@abujatradehub.ng');
  const [invoiceNumber] = useState(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [vatEnabled, setVatEnabled] = useState(true);
  const [items, setItems] = useState([
    { description: 'Premium Wholesale Goods (Intake)', quantity: 2, unitPrice: 450000 },
    { description: 'Logistics & Dispatch Handling', quantity: 1, unitPrice: 35000 },
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = vatEnabled ? Math.round(subtotal * 0.075) : 0; // 7.5% VAT standard
  const total = subtotal + vat;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: 'New Product / Service Line', quantity: 1, unitPrice: 50000 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Customer Required', 'Please enter a valid customer or business name for the invoice.');
      return;
    }
    if (items.length === 0 || subtotal <= 0) {
      toast.error('Valid Line Items Required', 'Please specify at least one billable item with quantity and price.');
      return;
    }

    setIsSuccess(true);
    toast.success(
      'Invoice Issued Successfully',
      `Invoice #${invoiceNumber} for ${currencySymbol}${total.toLocaleString()} billed to ${customerName}.`
    );
    if (onInvoiceCreated) {
      onInvoiceCreated({
        id: invoiceNumber,
        customerName,
        customerEmail,
        total,
        dueDate,
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
      aria-labelledby="invoice-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 via-white to-slate-50/80 dark:from-[#081726] dark:via-[#0B1E33] dark:to-[#081726] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-[#9AE61C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="invoice-modal-title"
                  className="text-base sm:text-lg font-bold text-[#072644] dark:text-white"
                >
                  Create Sales Invoice
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] border border-[#84CC16]/40">
                  Ctrl+I Shortcut
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {company.name} • {branch.name} • #{invoiceNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close invoice dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left flex-1">
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Invoice Issued!</strong> Invoice {invoiceNumber} for {currencySymbol}
                {total.toLocaleString()} created successfully.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Customer Name / Entity
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <input
                    type="text"
                    required
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-right"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">{currencySymbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      required
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(idx, 'unitPrice', parseInt(e.target.value) || 0)}
                      className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-right"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal and VAT */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currencySymbol}{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vatEnabled}
                  onChange={(e) => setVatEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                />
                <span>Include VAT (7.5%):</span>
              </label>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currencySymbol}{vat.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-[#072644] dark:text-white">
              <span>Total Invoice Amount:</span>
              <span className="text-[#0F4C81] dark:text-[#9AE61C]">
                {currencySymbol}{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Actions */}
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
              <FileText className="w-4 h-4" />
              <span>Issue & Send Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
