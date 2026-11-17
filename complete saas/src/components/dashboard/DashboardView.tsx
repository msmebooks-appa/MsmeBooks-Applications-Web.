import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Store,
  ShieldCheck,
  Sparkles,
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  FileText,
  CreditCard,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Layers,
  ArrowUpRight,
  AlertCircle,
  BarChart3,
  Shield,
  Lock,
  Keyboard,
  Zap,
} from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { MsmeBooksAIModal } from './MsmeBooksAIModal';
import { PayrollModal } from './PayrollModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { QuickInvoiceModal } from './QuickInvoiceModal';
import { QuickExpenseModal } from './QuickExpenseModal';
import { ShortcutToast } from './ShortcutToast';
import { Company, Branch, UserRole } from '../../types';
import { USER_ROLES_CATALOG } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

interface DashboardViewProps {
  company: Company;
  branch: Branch;
  role: UserRole;
  userName: string;
  onSwitchCompany: () => void;
  onSwitchBranch: () => void;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenSecuritySettings: () => void;
  onTriggerSecurityState: (type: any) => void;
  onRequestLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  company,
  branch,
  role,
  userName,
  onSwitchCompany,
  onSwitchBranch,
  onSwitchRole,
  onOpenSecuritySettings,
  onTriggerSecurityState,
  onRequestLogout,
}) => {
  const toast = useToast();
  const [activeModule, setActiveModule] = useState<'accounting' | 'pos' | 'inventory' | 'business'>('accounting');
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [permissionAlert, setPermissionAlert] = useState<string | null>(null);

  // Power User Keyboard Shortcuts & Dialog States
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [shortcutToast, setShortcutToast] = useState<{
    shortcutText: string;
    actionText: string;
    visible: boolean;
  }>({
    shortcutText: '',
    actionText: '',
    visible: false,
  });

  const triggerShortcutToast = useCallback((shortcutText: string, actionText: string) => {
    setShortcutToast({
      shortcutText,
      actionText,
      visible: true,
    });
    const timer = setTimeout(() => {
      setShortcutToast((prev) => ({ ...prev, visible: false }));
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const currentRoleInfo =
    USER_ROLES_CATALOG.find((r) => r.role === role) || USER_ROLES_CATALOG[0];

  // Role permissions checking
  const canAccessFinancials = [
    'super_admin',
    'business_owner',
    'administrator',
    'finance_manager',
    'accountant',
    'auditor',
    'external_accountant',
  ].includes(role);

  const canAccessTax = [
    'super_admin',
    'business_owner',
    'finance_manager',
    'accountant',
    'external_accountant',
  ].includes(role);

  const canAccessPOS = [
    'super_admin',
    'business_owner',
    'administrator',
    'store_manager',
    'branch_manager',
    'sales_manager',
    'pos_operator',
  ].includes(role);

  const canAccessInventory = [
    'super_admin',
    'business_owner',
    'administrator',
    'store_manager',
    'branch_manager',
    'inventory_manager',
    'sales_manager',
  ].includes(role);

  // Execute shortcut from Cheat Sheet or Programmatic Trigger
  const handleExecuteShortcut = (shortcutKey: string) => {
    switch (shortcutKey) {
      case 'Ctrl+P':
        setIsPayrollModalOpen(true);
        triggerShortcutToast('Ctrl+P', 'Payroll & Compensation');
        break;
      case 'Ctrl+I':
        setIsInvoiceModalOpen(true);
        triggerShortcutToast('Ctrl+I', 'Create Sales Invoice');
        break;
      case 'Ctrl+E':
        setIsExpenseModalOpen(true);
        triggerShortcutToast('Ctrl+E', 'Log Business Expense');
        break;
      case 'Ctrl+S':
        setActiveModule('pos');
        setActiveSubTab('Point of Sale');
        triggerShortcutToast('Ctrl+S', 'POS & Sales Checkout');
        break;
      case 'Ctrl+K':
      case '/':
        setIsAIModalOpen(true);
        triggerShortcutToast('Ctrl+K', 'Ask MsmeBooks AI');
        break;
      case 'Ctrl+B':
        onSwitchBranch();
        triggerShortcutToast('Ctrl+B', 'Switch Active Branch');
        break;
      case 'Ctrl+1':
        setActiveModule('accounting');
        setActiveSubTab('Overview');
        triggerShortcutToast('Ctrl+1', 'Accounting & Financials');
        break;
      case 'Ctrl+2':
        setActiveModule('pos');
        setActiveSubTab('Point of Sale');
        triggerShortcutToast('Ctrl+2', 'POS & Sales');
        break;
      case 'Ctrl+3':
        setActiveModule('inventory');
        setActiveSubTab('Products & Stock');
        triggerShortcutToast('Ctrl+3', 'Inventory & Stock');
        break;
      case 'Ctrl+4':
        setActiveModule('business');
        setActiveSubTab('Branches & Entities');
        triggerShortcutToast('Ctrl+4', 'Business Governance');
        break;
      case 'Ctrl+Shift+S':
        onOpenSecuritySettings();
        triggerShortcutToast('Ctrl+Shift+S', 'Security & Session Controls');
        break;
      default:
        break;
    }
  };

  // GLOBAL KEYBOARD SHORTCUTS LISTENER FOR POWER USERS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as any).isContentEditable);

      const isModifier = e.ctrlKey || e.metaKey;

      // 1. ESCAPE closes any active modal or menu
      if (e.key === 'Escape') {
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          return;
        }
        if (isPayrollModalOpen) {
          setIsPayrollModalOpen(false);
          return;
        }
        if (isInvoiceModalOpen) {
          setIsInvoiceModalOpen(false);
          return;
        }
        if (isExpenseModalOpen) {
          setIsExpenseModalOpen(false);
          return;
        }
        if (isAIModalOpen) {
          setIsAIModalOpen(false);
          return;
        }
        if (showRoleMenu) {
          setShowRoleMenu(false);
          return;
        }
      }

      // 2. '?' or 'Ctrl+/' opens Keyboard Shortcuts Cheat Sheet (when not typing in form)
      if ((!isInput && e.key === '?') || (isModifier && (e.key === '/' || e.key === '?'))) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        triggerShortcutToast('?', 'Keyboard Shortcuts Cheat Sheet');
        return;
      }

      // If user is typing in an input field, do not hijack typing keys unless combined with Ctrl/Cmd
      if (isInput && !isModifier) {
        return;
      }

      // 3. CTRL+P / CMD+P: Payroll & Staff Compensation (Overriding default browser print)
      if (isModifier && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPayrollModalOpen((prev) => !prev);
        triggerShortcutToast('Ctrl+P', 'Payroll & Compensation');
        return;
      }

      // 4. CTRL+K / CMD+K or non-input '/': Ask MsmeBooks AI & Command Palette
      if ((isModifier && e.key.toLowerCase() === 'k') || (!isInput && e.key === '/')) {
        e.preventDefault();
        setIsAIModalOpen(true);
        triggerShortcutToast(isModifier ? 'Ctrl+K' : '/', 'Ask MsmeBooks AI');
        return;
      }

      // 5. CTRL+I / CMD+I: New Invoice
      if (isModifier && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsInvoiceModalOpen(true);
        triggerShortcutToast('Ctrl+I', 'Create Sales Invoice');
        return;
      }

      // 6. CTRL+E / CMD+E: Quick Expense Logging
      if (isModifier && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExpenseModalOpen(true);
        triggerShortcutToast('Ctrl+E', 'Log Business Expense');
        return;
      }

      // 7. CTRL+S / CMD+S: POS Terminal Checkout
      if (isModifier && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setActiveModule('pos');
        setActiveSubTab('Point of Sale');
        triggerShortcutToast('Ctrl+S', 'POS & Sales Checkout');
        return;
      }

      // 8. CTRL+SHIFT+S: Security Settings
      if (isModifier && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onOpenSecuritySettings();
        triggerShortcutToast('Ctrl+Shift+S', 'Security & Session Controls');
        return;
      }

      // 9. CTRL+B / CMD+B: Switch Business Branch
      if (isModifier && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onSwitchBranch();
        triggerShortcutToast('Ctrl+B', 'Switch Active Branch');
        return;
      }

      // 10. CTRL+1 to CTRL+4: Module switcher
      if (isModifier && e.key === '1') {
        e.preventDefault();
        setActiveModule('accounting');
        setActiveSubTab('Overview');
        triggerShortcutToast('Ctrl+1', 'Accounting & Financials');
        return;
      }
      if (isModifier && e.key === '2') {
        e.preventDefault();
        setActiveModule('pos');
        setActiveSubTab('Point of Sale');
        triggerShortcutToast('Ctrl+2', 'POS & Sales');
        return;
      }
      if (isModifier && e.key === '3') {
        e.preventDefault();
        setActiveModule('inventory');
        setActiveSubTab('Products & Stock');
        triggerShortcutToast('Ctrl+3', 'Inventory & Stock');
        return;
      }
      if (isModifier && e.key === '4') {
        e.preventDefault();
        setActiveModule('business');
        setActiveSubTab('Branches & Entities');
        triggerShortcutToast('Ctrl+4', 'Business Governance');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isShortcutsModalOpen,
    isPayrollModalOpen,
    isInvoiceModalOpen,
    isExpenseModalOpen,
    isAIModalOpen,
    showRoleMenu,
    onSwitchBranch,
    onOpenSecuritySettings,
    triggerShortcutToast,
  ]);

  const handleSubTabClick = (tabName: string) => {
    // Check if clicking Payroll tab
    if (tabName.includes('Payroll')) {
      setIsPayrollModalOpen(true);
      triggerShortcutToast('Ctrl+P', 'Payroll & Compensation');
      return;
    }
    // Check permission boundaries
    if (tabName.includes('Tax') && !canAccessTax) {
      const msg = `Access Restricted: Role "${currentRoleInfo.label}" is not authorized to inspect Tax Management filings.`;
      setPermissionAlert(msg);
      toast.error('Restricted Financial Module', msg);
      return;
    }
    if ((tabName.includes('Financial') || tabName.includes('Banking')) && !canAccessFinancials) {
      const msg = `Access Restricted: Role "${currentRoleInfo.label}" does not have privileges for Banking & General Ledger.`;
      setPermissionAlert(msg);
      toast.error('Restricted Financial Module', msg);
      return;
    }
    setPermissionAlert(null);
    setActiveSubTab(tabName);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#071727] flex flex-col text-[#0F172A] dark:text-slate-100 transition-colors">
      {/* TOP HEADER: MsmeBooks Blue + Lemon Green Accent */}
      <header className="bg-[#072644] text-white border-b border-[#0F4C81]/40 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Entity Context */}
          <div className="flex items-center gap-4">
            <MsmeBooksLogo variant="dark" size="sm" showTagline={false} />

            <div className="h-6 w-px bg-white/20 hidden md:block" />

            {/* Quick Switchers for Company and Branch */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={onSwitchCompany}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Switch Business"
              >
                <Building2 className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="truncate max-w-[140px]">{company.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              <button
                type="button"
                onClick={onSwitchBranch}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Switch Branch"
              >
                <Store className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="truncate max-w-[130px]">{branch.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Center Search / Ask AI button with Ctrl+K shortcut */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-300 transition-all cursor-pointer group"
              title="Global Search & AI Ledger Queries (Ctrl+K or /)"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="truncate">Ask MsmeBooks AI: "How much did we sell this month?"</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 group-hover:bg-black/60 text-[10px] font-mono text-[#9AE61C] border border-white/10 shadow-2xs">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right User Bar & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask AI Pill (Mobile) */}
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#84CC16] text-[#072644] font-bold cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Role Badge Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#9AE61C] text-xs font-bold transition-all cursor-pointer hover:bg-[#84CC16]/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="capitalize hidden sm:inline">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Role
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {USER_ROLES_CATALOG.map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => {
                          onSwitchRole(r.role);
                          setShowRoleMenu(false);
                          toast.success(
                            'Active Role Updated',
                            `Operating view and permissions switched to ${r.label}.`
                          );
                        }}
                        className={`
                          w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer
                          ${r.role === role ? 'font-bold text-[#0F4C81] bg-[#0F4C81]/5' : 'text-slate-700'}
                        `}
                      >
                        <span>{r.label}</span>
                        {r.role === role && <span className="text-[#84CC16] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Cheat Sheet Button */}
            <button
              type="button"
              onClick={() => setIsShortcutsModalOpen(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer relative"
              title="Keyboard Shortcuts Cheat Sheet (Press ? or Ctrl+/)"
              aria-label="Keyboard Shortcuts Cheat Sheet"
            >
              <Keyboard className="w-4 h-4 text-[#9AE61C]" />
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle variant="icon" />

            {/* Security Menu */}
            <button
              type="button"
              onClick={onOpenSecuritySettings}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Security & Session Management (Ctrl+Shift+S)"
            >
              <Shield className="w-4 h-4 text-[#84CC16]" />
            </button>

            {/* Logout Trigger */}
            <button
              type="button"
              onClick={onRequestLogout}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* CORE MODULE NAVIGATION TABS: Accounting, POS, Inventory, Business Management */}
      <div className="bg-white dark:bg-[#0A1F36] border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-1 gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModule('accounting');
                  setActiveSubTab('Overview');
                  setPermissionAlert(null);
                }}
                className={`
                  px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeModule === 'accounting'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#072644]'
                  }
                `}
                title="Accounting & Finance (Ctrl+1)"
              >
                <DollarSign className="w-4 h-4 text-[#84CC16]" />
                <span>Accounting & Finance</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono opacity-80">
                  Ctrl+1
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModule('pos');
                  setActiveSubTab('Point of Sale');
                  setPermissionAlert(null);
                }}
                className={`
                  px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeModule === 'pos'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#072644]'
                  }
                `}
                title="POS & Sales (Ctrl+2 / Ctrl+S)"
              >
                <ShoppingCart className="w-4 h-4 text-[#84CC16]" />
                <span>POS & Sales</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono opacity-80">
                  Ctrl+2
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModule('inventory');
                  setActiveSubTab('Products & Stock');
                  setPermissionAlert(null);
                }}
                className={`
                  px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeModule === 'inventory'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#072644]'
                  }
                `}
                title="Inventory & Stock (Ctrl+3)"
              >
                <Package className="w-4 h-4 text-[#84CC16]" />
                <span>Inventory & Stock</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono opacity-80">
                  Ctrl+3
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModule('business');
                  setActiveSubTab('Branches & Entities');
                  setPermissionAlert(null);
                }}
                className={`
                  px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeModule === 'business'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#072644]'
                  }
                `}
                title="Business Governance (Ctrl+4)"
              >
                <Users className="w-4 h-4 text-[#84CC16]" />
                <span>Business Governance</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono opacity-80">
                  Ctrl+4
                </kbd>
              </button>
            </div>

            {/* Security Simulation Quick Triggers */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] font-bold text-slate-400">Simulate:</span>
              <button
                type="button"
                onClick={() => onTriggerSecurityState('new-device')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                New Device
              </button>
              <button
                type="button"
                onClick={() => onTriggerSecurityState('session-expired')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                Session Expired
              </button>
              <button
                type="button"
                onClick={() => onTriggerSecurityState('unauthorized')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                Unauthorized
              </button>
              <button
                type="button"
                onClick={() => onTriggerSecurityState('account-locked')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                Locked
              </button>
            </div>
          </div>

          {/* Sub-Tabs for Active Module */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs">
            {activeModule === 'accounting' && (
              <>
                {[
                  { name: 'Overview', shortcut: null },
                  { name: 'Invoices', shortcut: 'Ctrl+I' },
                  { name: 'Expenses', shortcut: 'Ctrl+E' },
                  { name: 'Payroll & Salaries', shortcut: 'Ctrl+P' },
                  { name: 'Income', shortcut: null },
                  { name: 'Payments', shortcut: null },
                  { name: 'Banking & Reconciliation', shortcut: null },
                  { name: 'Financial Reports', shortcut: null },
                  { name: 'Tax Management (VAT/WHT)', shortcut: null },
                ].map(({ name, shortcut }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSubTabClick(name)}
                    className={`
                      px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5
                      ${
                        activeSubTab === name
                          ? 'bg-[#84CC16]/20 text-[#072644] ring-1 ring-[#84CC16]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    <span>{name}</span>
                    {shortcut && (
                      <kbd className="px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 text-[9px] font-mono text-[#0F4C81] dark:text-[#9AE61C] border border-slate-300 dark:border-slate-600">
                        {shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </>
            )}

            {activeModule === 'pos' && (
              <>
                {[
                  'Point of Sale',
                  'Sales History',
                  'Returns & Refunds',
                  'Receipts',
                  'Cashier Management',
                  'Registers & Drawer',
                  'Discounts & Promotions',
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleSubTabClick(tab)}
                    className={`
                      px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap
                      ${
                        activeSubTab === tab
                          ? 'bg-[#84CC16]/20 text-[#072644] ring-1 ring-[#84CC16]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </>
            )}

            {activeModule === 'inventory' && (
              <>
                {[
                  'Products & Stock',
                  'Categories',
                  'Purchases & Orders',
                  'Stock Transfers',
                  'Warehouses & Depots',
                  'Suppliers',
                  'Stock Adjustments',
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleSubTabClick(tab)}
                    className={`
                      px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap
                      ${
                        activeSubTab === tab
                          ? 'bg-[#84CC16]/20 text-[#072644] ring-1 ring-[#84CC16]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </>
            )}

            {activeModule === 'business' && (
              <>
                {[
                  'Branches & Entities',
                  'Employees & RBAC Roles',
                  'Customers',
                  'Vendors',
                  'Consolidated Reports',
                  'Settings & API',
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleSubTabClick(tab)}
                    className={`
                      px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap
                      ${
                        activeSubTab === tab
                          ? 'bg-[#84CC16]/20 text-[#072644] ring-1 ring-[#84CC16]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Permission Boundary Alert Banner if restricted */}
        {permissionAlert && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs sm:text-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span className="font-semibold">{permissionAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setPermissionAlert(null)}
              className="text-amber-800 hover:underline font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Summary Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#072644]">
                {company.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0F4C81] text-white">
                {branch.name}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D]">
                {company.industry}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active Session: <strong className="text-[#072644]">{userName}</strong> • Role:{' '}
              <strong className="text-[#0F4C81] capitalize">{role.replace('_', ' ')}</strong> • Currency:{' '}
              <strong className="text-[#072644]">{company.currency} ({company.currencySymbol})</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#072644] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
              title="Quick Invoice (Ctrl+I)"
            >
              <FileText className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span>New Invoice</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white dark:bg-slate-900 text-[9px] font-mono border border-slate-300 dark:border-slate-600">
                Ctrl+I
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#072644] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
              title="Quick Expense (Ctrl+E)"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span>Log Expense</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white dark:bg-slate-900 text-[9px] font-mono border border-slate-300 dark:border-slate-600">
                Ctrl+E
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsPayrollModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#072644] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
              title="Payroll & Staff Compensation (Ctrl+P)"
            >
              <Users className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span>Payroll</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white dark:bg-slate-900 text-[9px] font-mono border border-slate-300 dark:border-slate-600">
                Ctrl+P
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Ask MsmeBooks AI (Ctrl+K or /)"
            >
              <Sparkles className="w-4 h-4 text-[#84CC16]" />
              <span>Ask AI</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/30 text-[9px] font-mono text-[#9AE61C] border border-white/20">
                Ctrl+K
              </kbd>
            </button>

            <button
              type="button"
              onClick={onOpenSecuritySettings}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#072644] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Security & 2FA (Ctrl+Shift+S)"
            >
              <Lock className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span className="hidden sm:inline">Security</span>
            </button>
          </div>
        </div>

        {/* 4 CORE KPI METRICS: Sales, Net Margin, Pending Invoices, Inventory Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Today's Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Gross Sales (Today)</span>
              <div className="w-8 h-8 rounded-lg bg-[#84CC16]/10 text-[#65A30D] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#072644]">
              {company.currencySymbol}3,842,500
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#65A30D] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs yesterday (87 orders)</span>
            </div>
          </div>

          {/* KPI 2: Net Profit Margin */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Net Profit (Month-to-Date)</span>
              <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#072644]">
              {company.currencySymbol}12,180,000
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#65A30D] font-bold">
              <span>28.4% gross operating margin</span>
            </div>
          </div>

          {/* KPI 3: Invoices Receivable */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Receivables Outstanding</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F4C81] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#072644]">
              {company.currencySymbol}6,420,000
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <span>5 active invoices (2 overdue)</span>
            </div>
          </div>

          {/* KPI 4: Inventory Health */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Stock & SKUs Tracked</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#072644]">
              1,420 SKUs
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
              <span>4 items below reorder threshold</span>
            </div>
          </div>
        </div>

        {/* OPERATIONS GRID: POS Quick Checkout & Recent Ledger Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Transactions Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#072644]">
                  Recent Business Transactions
                </h3>
                <p className="text-xs text-slate-500">Live operational log for {branch.name}</p>
              </div>
              <span className="text-xs font-bold text-[#0F4C81] hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Customer / Vendor</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0F4C81]">POS-2026-9481</td>
                    <td className="py-3 px-3">Retail POS Checkout</td>
                    <td className="py-3 px-3 font-semibold text-[#072644]">Walk-in Customer</td>
                    <td className="py-3 px-3 text-right font-bold text-[#072644]">
                      {company.currencySymbol}48,500
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] font-bold text-[10px]">
                        Paid (Cash/Card)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0F4C81]">INV-2026-095</td>
                    <td className="py-3 px-3">Wholesale Invoice</td>
                    <td className="py-3 px-3 font-semibold text-[#072644]">Lekki Palms Store Ltd</td>
                    <td className="py-3 px-3 text-right font-bold text-[#072644]">
                      {company.currencySymbol}1,370,000
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-[#0F4C81] font-bold text-[10px]">
                        Due in 7 days
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0F4C81]">PO-2026-041</td>
                    <td className="py-3 px-3">Stock Intake PO</td>
                    <td className="py-3 px-3 font-semibold text-[#072644]">Dangote Sugar Refinery</td>
                    <td className="py-3 px-3 text-right font-bold text-[#072644]">
                      {company.currencySymbol}2,400,000
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] font-bold text-[10px]">
                        Received
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0F4C81]">EXP-2026-118</td>
                    <td className="py-3 px-3">Utility / Diesel</td>
                    <td className="py-3 px-3 font-semibold text-[#072644]">Eko Power & Fuel Ltd</td>
                    <td className="py-3 px-3 text-right font-bold text-[#072644]">
                      {company.currencySymbol}320,000
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: AI Assistant Quick Prompts & Branch Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#84CC16] text-[#072644] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#072644]">Ask MsmeBooks AI</h3>
                <p className="text-[11px] text-slate-500">Fast answers about your operations</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#84CC16] hover:bg-[#84CC16]/5 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>"How much did we sell this month?"</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </button>

              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#84CC16] hover:bg-[#84CC16]/5 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>"Which products are running low?"</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </button>

              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#84CC16] hover:bg-[#84CC16]/5 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>"Show me my outstanding invoices."</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </button>

              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#84CC16] hover:bg-[#84CC16]/5 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>"Compare this month's sales with last month."</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Open Full AI Assistant
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Ask MsmeBooks AI Modal */}
      <MsmeBooksAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        company={company}
        branch={branch}
        role={role}
      />

      {/* Power User Shortcut Modals */}
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        company={company}
        branch={branch}
        role={role}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onExecuteShortcut={handleExecuteShortcut}
      />

      <QuickInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        company={company}
        branch={branch}
      />

      <QuickExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        company={company}
        branch={branch}
      />

      {/* Visual Feedback Toast for Shortcuts */}
      <ShortcutToast
        shortcutText={shortcutToast.shortcutText}
        actionText={shortcutToast.actionText}
        visible={shortcutToast.visible}
      />
    </div>
  );
};
