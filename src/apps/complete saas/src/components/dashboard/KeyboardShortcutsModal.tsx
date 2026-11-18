import React, { useState } from 'react';
import {
  Keyboard,
  X,
  Search,
  Zap,
  ArrowRight,
  Layers,
  Sparkles,
  DollarSign,
  ShoppingCart,
  FileText,
  CreditCard,
  Building2,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteShortcut?: (shortcutKey: string) => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Workflow & Actions' | 'Navigation & Modules' | 'Global & Search';
  tag?: string;
}

const SHORTCUTS_CATALOG: ShortcutItem[] = [
  {
    keys: ['Ctrl', 'P'],
    description: 'Open Payroll & Staff Compensation management',
    category: 'Workflow & Actions',
    tag: 'Primary',
  },
  {
    keys: ['Ctrl', 'I'],
    description: 'Create & issue New Sales Invoice',
    category: 'Workflow & Actions',
    tag: 'Frequent',
  },
  {
    keys: ['Ctrl', 'E'],
    description: 'Quick log New Business Expense',
    category: 'Workflow & Actions',
    tag: 'Frequent',
  },
  {
    keys: ['Ctrl', 'S'],
    description: 'Launch POS & Retail Checkout register',
    category: 'Workflow & Actions',
  },
  {
    keys: ['Ctrl', 'K'],
    description: 'Ask MsmeBooks AI & natural language ledger queries',
    category: 'Global & Search',
    tag: 'AI',
  },
  {
    keys: ['/'],
    description: 'Focus global search / Ask AI',
    category: 'Global & Search',
  },
  {
    keys: ['Ctrl', 'B'],
    description: 'Switch active Store Branch or Company entity',
    category: 'Navigation & Modules',
  },
  {
    keys: ['Ctrl', '1'],
    description: 'Switch to Accounting & Financial Ledgers module',
    category: 'Navigation & Modules',
  },
  {
    keys: ['Ctrl', '2'],
    description: 'Switch to POS & Sales module',
    category: 'Navigation & Modules',
  },
  {
    keys: ['Ctrl', '3'],
    description: 'Switch to Inventory & Warehousing module',
    category: 'Navigation & Modules',
  },
  {
    keys: ['Ctrl', '4'],
    description: 'Switch to Business Governance & Multi-branch module',
    category: 'Navigation & Modules',
  },
  {
    keys: ['Ctrl', 'Shift', 'S'],
    description: 'Open Security, 2FA & Session Controls',
    category: 'Global & Search',
  },
  {
    keys: ['?'],
    description: 'Show this Keyboard Shortcuts cheat sheet',
    category: 'Global & Search',
  },
  {
    keys: ['Esc'],
    description: 'Close active modal, flyout, or search overlay',
    category: 'Global & Search',
  },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onExecuteShortcut,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredShortcuts = SHORTCUTS_CATALOG.filter(
    (item) =>
      item.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.keys.some((k) => k.toLowerCase().includes(filterQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const categories = ['Workflow & Actions', 'Navigation & Modules', 'Global & Search'] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 via-white to-slate-50/80 dark:from-[#081726] dark:via-[#0B1E33] dark:to-[#081726] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shadow-md">
              <Keyboard className="w-5 h-5 text-[#9AE61C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="shortcuts-modal-title"
                  className="text-base sm:text-lg font-bold text-[#072644] dark:text-white"
                >
                  Power User Keyboard Shortcuts
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] border border-[#84CC16]/40">
                  Speed & Accessibility
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Execute core bookkeeping and POS commands instantly without lifting hands from keyboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search filter */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#071626]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search shortcuts (e.g. payroll, invoices, pos, ctrl+p)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
            />
          </div>
        </div>

        {/* Shortcuts list grouped by category */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-left flex-1">
          {categories.map((cat) => {
            const items = filteredShortcuts.filter((i) => i.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {cat}
                </span>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] overflow-hidden">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onExecuteShortcut) {
                          onExecuteShortcut(item.keys.join('+'));
                          onClose();
                        }
                      }}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0F4C81] dark:group-hover:text-[#9AE61C] transition-colors">
                          {item.description}
                        </span>
                        {item.tag && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C]">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs group-hover:border-[#0F4C81] dark:group-hover:border-[#84CC16] transition-colors">
                              {k}
                            </kbd>
                            {kIdx < item.keys.length - 1 && (
                              <span className="text-slate-400 font-mono text-[10px]">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#081726] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Tip: Works with both</span>
            <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              Ctrl
            </kbd>
            <span>(Windows/Linux) and</span>
            <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              ⌘ Cmd
            </kbd>
            <span>(macOS)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#84CC16] dark:hover:bg-[#72B013] text-white dark:text-[#072644] font-bold text-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
