import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Upload, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  AlertTriangle,
  Receipt, 
  X,
  FileCheck2,
  Send,
  Bell,
  Sparkles,
  Unlock
} from 'lucide-react';
import { 
  CurrencyCode, 
  CountryInfo, 
  DeliverableTask, 
  FinancialReportDoc, 
  ComplianceDeadline,
  SlaMilestone,
  SlaNotificationEvent
} from '../types';
import { 
  MOCK_CLIENT_TASKS, 
  MOCK_CLIENT_REPORTS, 
  MOCK_COMPLIANCE_DEADLINES 
} from '../data/mockData';
import { formatPrice } from '../utils/currency';
import { useToast } from '../context/ToastContext';
import { 
  SlaTrackerWidget, 
  DEFAULT_SLA_MILESTONES, 
  evaluateMilestoneStatus 
} from './SlaTrackerWidget';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  selectedCountry: CountryInfo;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  selectedCountry,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'sla' | 'tasks' | 'vault' | 'reports' | 'compliance' | 'messages' | 'billing'>('overview');
  const [tasks, setTasks] = useState<DeliverableTask[]>(MOCK_CLIENT_TASKS);
  const [reports] = useState<FinancialReportDoc[]>(MOCK_CLIENT_REPORTS);
  const [deadlines] = useState<ComplianceDeadline[]>(MOCK_COMPLIANCE_DEADLINES);

  // SLA Tracker milestones & Real-time Notification states
  const [milestones, setMilestones] = useState<SlaMilestone[]>(DEFAULT_SLA_MILESTONES);
  const [slaNotifications, setSlaNotifications] = useState<SlaNotificationEvent[]>([]);
  const [activeBannerNotification, setActiveBannerNotification] = useState<SlaNotificationEvent | null>(null);
  const [showNotificationHistory, setShowNotificationHistory] = useState<boolean>(false);

  const slaSummary = useMemo(() => {
    let critical = 0;
    let warning = 0;
    milestones.forEach((m) => {
      const ev = evaluateMilestoneStatus(m, milestones);
      if (ev.riskLevel === 'critical') critical += 1;
      if (ev.riskLevel === 'warning') warning += 1;
    });
    const m2 = milestones.find((m) => m.id === 'm-2');
    return {
      atRiskTotal: critical + warning,
      critical,
      ledgerPercent: m2 ? m2.percent : 94,
    };
  }, [milestones]);

  // Vault state
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; size: string; date: string; type: string }[]>([
    { id: 'f-1', name: 'GTBank_Statement_October_2026.pdf', size: '2.8 MB', date: 'Oct 30, 2026', type: 'Bank Statement' },
    { id: 'f-2', name: 'Vendor_Invoices_Batch_Oct.zip', size: '14.2 MB', date: 'Oct 28, 2026', type: 'Accounts Payable' },
    { id: 'f-3', name: 'Monthly_Sales_Register_Summary.xlsx', size: '1.4 MB', date: 'Oct 27, 2026', type: 'POS & Sales' },
  ]);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Message chat state
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: string; isUser: boolean }[]>([
    { id: 'm-1', sender: 'Adeola Adeleke, FCA (Lead Accountant)', text: 'Good day! We have completed the bank reconciliations for October. Please review the drafted management accounts.', time: '10:15 AM', isUser: false },
    { id: 'm-2', sender: 'Apex Retail Admin', text: 'Thank you Adeola! We will check the margin breakdown by tomorrow morning.', time: '10:45 AM', isUser: true },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  if (!isOpen) return null;

  // Real-time Notification Trigger when a project milestone is marked completed
  const handleMilestoneCompleted = (completedMilestone: SlaMilestone, unblockedTitles: string[]) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const event: SlaNotificationEvent = {
      id: `notif-${Date.now()}`,
      milestoneId: completedMilestone.id,
      milestoneTitle: completedMilestone.title,
      phase: completedMilestone.phase,
      owner: completedMilestone.owner,
      unblockedTitles,
      timestamp,
    };

    setSlaNotifications((prev) => [event, ...prev]);
    setActiveBannerNotification(event);

    // Sync related deliverable task if Phase 02 completed
    if (completedMilestone.id === 'm-2') {
      setTasks((prev) =>
        prev.map((t) => (t.id === 'task-1' ? { ...t, status: 'Completed' } : t))
      );
    }

    const unlockSuffix =
      unblockedTitles.length > 0
        ? ` Unlocked dependent milestone(s): ${unblockedTitles.join(', ')}.`
        : '';

    toast.success(
      `${completedMilestone.phase} "${completedMilestone.title}" marked 100% completed by ${completedMilestone.owner}.${unlockSuffix}`,
      'SLA Milestone Completed!'
    );

    setTimeout(() => {
      setActiveBannerNotification((curr) => (curr?.id === event.id ? null : curr));
    }, 9000);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile = {
        id: `f-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: 'Today, Just Now',
        type: 'Supporting Document',
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      setUploadNotice(`Successfully encrypted & synced: ${file.name}`);
      toast.success(`${file.name} encrypted & added to Client Vault.`, 'Document Synced');
      setTimeout(() => setUploadNotice(null), 4000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      sender: 'You (Client)',
      text: newMessageText,
      time: 'Just now',
      isUser: true,
    };
    setMessages([...messages, msg]);
    setNewMessageText('');

    // Simulate pod auto reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'Adeola Adeleke, FCA (Lead Accountant)',
          text: 'Acknowledged! Our team is reviewing this right away.',
          time: 'Just now',
          isUser: false,
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Top Header of Client Portal */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-slate-900 border border-blue-500/40 flex items-center justify-center text-white font-extrabold text-sm">
              MB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-grotesk text-white">
                  Client Outsourcing Portal
                </h2>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-950/80 border border-lime-800 px-2 py-0.5 rounded">
                  Active Subscription: Growth Business
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Client: <span className="text-slate-200 font-semibold">Apex Retail Ventures Ltd</span> • Market: {selectedCountry.name} ({selectedCountry.flag})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Real-time Milestone Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotificationHistory(!showNotificationHistory)}
              className="relative px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-bold border border-slate-700 transition cursor-pointer"
              title="Real-time SLA Milestone Notifications"
            >
              <Bell className={`w-4 h-4 ${slaNotifications.length > 0 ? 'text-lime-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Alerts</span>
              {slaNotifications.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-lime-400 text-slate-950">
                  {slaNotifications.length}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dropdown History for SLA Notifications */}
            {showNotificationHistory && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-40 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    Real-Time Milestone Feed
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotificationHistory(false)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {slaNotifications.length === 0 ? (
                  <p className="text-[11px] text-slate-400 py-3 text-center">
                    No milestones completed in this session yet. Mark an unblocked milestone complete in the SLA Tracker to test live triggers.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {slaNotifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono">
                          <span>{n.phase} Completed</span>
                          <span>{n.timestamp}</span>
                        </div>
                        <div className="font-bold text-white">{n.milestoneTitle}</div>
                        {n.unblockedTitles.length > 0 && (
                          <div className="text-[10px] text-lime-300 flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            <span>Unlocked: {n.unblockedTitles.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Milestone Completion Alert Banner */}
        {activeBannerNotification && (
          <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-lime-950/80 border border-lime-400/70 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-start sm:items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-lime-300 uppercase text-[10px] tracking-wider">
                    Real-Time Milestone Alert • {activeBannerNotification.timestamp}
                  </span>
                  <span className="font-bold text-white">
                    {activeBannerNotification.phase}: {activeBannerNotification.milestoneTitle} Completed!
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Verified by {activeBannerNotification.owner}.
                  {activeBannerNotification.unblockedTitles.length > 0 && (
                    <span className="text-lime-300 font-semibold ml-1">
                      Automatically unlocked: {activeBannerNotification.unblockedTitles.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveBannerNotification(null)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold self-end sm:self-auto cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 sm:px-6 pt-3 bg-slate-950/40 border-b border-slate-800 scrollbar-thin">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            {
              id: 'sla',
              label: 'SLA Tracker',
              icon: <ShieldCheck className="w-4 h-4" />,
              badge:
                slaSummary.atRiskTotal > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                    {slaSummary.atRiskTotal} Risk
                  </span>
                ) : null,
            },
            { id: 'tasks', label: 'Tasks & Deliverables', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'vault', label: 'Secure Document Vault', icon: <Upload className="w-4 h-4" /> },
            { id: 'reports', label: 'Financial Reports', icon: <FileText className="w-4 h-4" /> },
            { id: 'compliance', label: 'Compliance Calendar', icon: <Calendar className="w-4 h-4" /> },
            { id: 'messages', label: 'Service Pod Chat', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'billing', label: 'Subscription & Billing', icon: <CreditCard className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-lime-400 border-t-2 border-lime-400 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {'badge' in tab && tab.badge}
            </button>
          ))}
        </div>

        {/* Main Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Assigned Service Pod Card */}
              <div className="bg-gradient-to-r from-blue-950/60 to-slate-800/80 rounded-2xl p-5 border border-blue-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Adeola Adeleke"
                    className="w-14 h-14 rounded-full object-cover border-2 border-lime-400"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                      Your Dedicated Lead Practitioner
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Adeola Adeleke, FCA
                    </h3>
                    <div className="text-xs text-slate-300">
                      Senior Chartered Accountant • ICAN Fellow #18420
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat With Adeola</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-lime-400 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Documents</span>
                  </button>
                </div>
              </div>

              {/* Financial Status KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400">October Cash Position</div>
                  <div className="text-2xl font-extrabold text-white font-grotesk mt-1">
                    {formatPrice(48500, selectedCurrency)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    +14.2% vs previous month
                  </div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400">Active Payroll Count</div>
                  <div className="text-2xl font-extrabold text-white font-grotesk mt-1">
                    22 Staff
                  </div>
                  <div className="text-[11px] text-blue-300 font-semibold mt-1">
                    All payslips generated
                  </div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400">Ledger Closing Status</div>
                  <div className="text-2xl font-extrabold text-lime-400 font-grotesk mt-1">
                    {slaSummary.ledgerPercent}% Reconciled
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">
                    Target: Nov 05 Closing
                  </div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-xs text-slate-400">Next Tax Deadline</div>
                  <div className="text-2xl font-extrabold text-amber-400 font-grotesk mt-1">
                    Nov 10
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold mt-1 flex items-center gap-1">
                    {slaSummary.critical > 0 && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                    <span>PAYE Monthly Remittance</span>
                  </div>
                </div>
              </div>

              {/* Integrated Service Level Agreement (SLA) Tracker Widget */}
              <SlaTrackerWidget
                tasks={tasks}
                milestones={milestones}
                onMilestonesChange={setMilestones}
                onMilestoneCompleted={handleMilestoneCompleted}
                selectedCurrency={selectedCurrency}
                onNavigateToTab={(tab) => setActiveTab(tab as any)}
              />

              {/* Active Tasks & Recent Reports Two-Column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active Deliverable Tasks */}
                <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                      Active Outsourced Deliverables
                    </h4>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs font-bold text-lime-400 hover:underline cursor-pointer"
                    >
                      View All ({tasks.length}) →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{t.title}</div>
                          <div className="text-[11px] text-slate-400">Assigned: {t.assignedTo}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          t.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Financial Reports */}
                <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Approved Financial Reports
                    </h4>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                    >
                      All Reports ({reports.length}) →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {reports.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{r.title}</div>
                          <div className="text-[10px] text-slate-400">{r.period} • {r.fileSize}</div>
                        </div>
                        <button
                          onClick={() => toast.success(`Signed copy downloaded: ${r.title}`, 'Financial Report Ready')}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition cursor-pointer"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 1B: DEDICATED SLA TRACKER VIEW */}
          {activeTab === 'sla' && (
            <SlaTrackerWidget
              tasks={tasks}
              milestones={milestones}
              onMilestonesChange={setMilestones}
              onMilestoneCompleted={handleMilestoneCompleted}
              selectedCurrency={selectedCurrency}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {/* TAB 2: TASKS & DELIVERABLES */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-grotesk">
                    Service Tasks & Deliverables Tracking
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live operational milestones maintained by your dedicated MsmeBooks pod.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{task.title}</span>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                          {task.category}
                        </span>
                      </div>
                      <div className="text-slate-400 text-xs">
                        Assigned to: <span className="text-slate-200 font-medium">{task.assignedTo}</span> • Supporting docs attached: {task.documentCount}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Due Date</div>
                        <div className="font-bold text-slate-200">{task.dueDate}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        task.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        task.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-grotesk">
                  Encrypted Document Vault (256-Bit TLS)
                </h3>
                <p className="text-xs text-slate-400">
                  Securely deposit bank statements (PDF/CSV), invoices, receipts, and payroll schedules for your accounting pod.
                </p>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-lime-400 rounded-2xl p-6 sm:p-8 text-center bg-slate-800/30 transition">
                <input
                  type="file"
                  id="vault-file-upload"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
                <label htmlFor="vault-file-upload" className="cursor-pointer space-y-3 block">
                  <div className="w-12 h-12 rounded-full bg-blue-900/60 border border-blue-700 flex items-center justify-center mx-auto text-blue-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-lime-400 underline">
                      Click to choose files
                    </span>{' '}
                    <span className="text-slate-400 text-sm">or drag and drop here</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Accepts PDF, Excel, CSV, Word, PNG, JPG (Max 50MB per file)
                  </div>
                </label>
              </div>

              {uploadNotice && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{uploadNotice}</span>
                </div>
              )}

              {/* Deposited Files Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deposited Working Files ({uploadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck2 className="w-5 h-5 text-lime-400 shrink-0" />
                        <div>
                          <div className="font-bold text-white">{file.name}</div>
                          <div className="text-[10px] text-slate-400">{file.type} • {file.size} • Uploaded {file.date}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.info(`Encrypted preview opened for ${file.name}`, 'Document Vault')}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Preview / Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: FINANCIAL REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white font-grotesk">
                  Monthly Management Accounts & Tax Statements
                </h3>
                <p className="text-xs text-slate-400">
                  Audit-ready financial statements prepared by your assigned Chartered Accountants.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          {rep.type}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                          {rep.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-grotesk">
                        {rep.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Reporting Period: {rep.period} • Generated on {rep.dateGenerated}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">{rep.fileSize}</span>
                      <button
                        onClick={() => toast.success(`Certified copy downloaded: ${rep.title}`, 'Certified PDF Ready')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Certified PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COMPLIANCE CALENDAR */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white font-grotesk">
                  Statutory Tax & Regulatory Deadlines
                </h3>
                <p className="text-xs text-slate-400">
                  Automatic deadline tracking to guarantee zero late filing fines across your operating countries.
                </p>
              </div>

              <div className="space-y-2.5">
                {deadlines.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center font-bold">
                        {item.type}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400">Authority: {item.authority} ({selectedCountry.name})</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Statutory Due Date</div>
                      <div className="text-xs font-bold text-amber-400">{item.dueDate}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Protected by MsmeBooks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SERVICE POD CHAT */}
          {activeTab === 'messages' && (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 flex flex-col h-[480px]">
              {/* Chat Header */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Adeola Adeleke"
                    className="w-9 h-9 rounded-full object-cover border-2 border-lime-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Adeola Adeleke, FCA (Lead Accountant)</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Active
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">
                  Encrypted Client Channel
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-1">{m.sender} • {m.time}</div>
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs ${
                        m.isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-700 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type an inquiry or instruction for your lead accountant..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: BILLING & SUBSCRIPTION */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                      Current Subscription
                    </span>
                    <h3 className="text-xl font-bold font-grotesk text-white">
                      Growth — Business Outsourcing Plan
                    </h3>
                    <p className="text-xs text-slate-400">
                      Includes Bookkeeping, Monthly Management Accounts, Payroll (25 staff), and Tax Filing.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Retainer Fee</div>
                    <div className="text-2xl font-extrabold text-lime-400 font-grotesk">
                      {formatPrice(290, selectedCurrency)}
                      <span className="text-xs text-slate-400 font-normal"> / month</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Next Scheduled Renewal: </span>
                    <span className="font-bold text-white">Nov 30, 2026 (Auto-Renew On)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success('Latest Official Tax Invoice downloaded!', 'Invoice Exported')}
                      className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Download Latest Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
