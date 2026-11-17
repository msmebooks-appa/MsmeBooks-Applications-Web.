import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Download, 
  Printer, 
  Trash2, 
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Building2,
  RefreshCw
} from 'lucide-react';
import { 
  ClientEmailRecord, 
  getStoredEmails, 
  markEmailAsRead, 
  deleteEmail 
} from '../utils/emailNotification';

interface EmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedEmailId?: string;
}

export const EmailInboxModal: React.FC<EmailInboxModalProps> = ({
  isOpen,
  onClose,
  initialSelectedEmailId,
}) => {
  const [emails, setEmails] = useState<ClientEmailRecord[]>(() => getStoredEmails());
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(
    initialSelectedEmailId || emails[0]?.id || null
  );
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    const handleEmailsChanged = () => {
      const stored = getStoredEmails();
      setEmails(stored);
      if (initialSelectedEmailId && stored.some(e => e.id === initialSelectedEmailId)) {
        setSelectedEmailId(initialSelectedEmailId);
      } else if (!selectedEmailId && stored.length > 0) {
        setSelectedEmailId(stored[0].id);
      }
    };

    window.addEventListener('msmebooks_emails_changed', handleEmailsChanged);
    window.addEventListener('storage', handleEmailsChanged);
    return () => {
      window.removeEventListener('msmebooks_emails_changed', handleEmailsChanged);
      window.removeEventListener('storage', handleEmailsChanged);
    };
  }, [initialSelectedEmailId, selectedEmailId]);

  useEffect(() => {
    if (initialSelectedEmailId) {
      setSelectedEmailId(initialSelectedEmailId);
    }
  }, [initialSelectedEmailId]);

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0] || null;

  useEffect(() => {
    if (selectedEmail && !selectedEmail.read) {
      markEmailAsRead(selectedEmail.id);
      setEmails(prev => prev.map(e => e.id === selectedEmail.id ? { ...e, read: true } : e));
    }
  }, [selectedEmail?.id]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string) => {
    deleteEmail(id);
    const updated = emails.filter(e => e.id !== id);
    setEmails(updated);
    if (selectedEmailId === id) {
      setSelectedEmailId(updated[0]?.id || null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-[#B7E532]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                  Electronic Notification Vault
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">
                  {emails.length} Transaction Record{emails.length === 1 ? '' : 's'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Client Booking & Payment Confirmation Emails
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Inbox List + Right Preview */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-50 dark:bg-[#08121E]">
          
          {/* LEFT: Email Inbox List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1727] flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Inbox Messages</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532] text-[10px]">
                {emails.filter(e => !e.read).length} Unread
              </span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/80">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No confirmation emails recorded yet.</p>
                  <p className="text-[11px] mt-1">Complete a booking to receive an instant electronic confirmation.</p>
                </div>
              ) : (
                emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      type="button"
                      onClick={() => setSelectedEmailId(email.id)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer relative flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-[#1464C8] dark:border-[#B7E532]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-extrabold text-[#1464C8] dark:text-[#B7E532] truncate">
                          {email.bookingRef}
                        </span>
                        <span className="text-slate-400 text-[10px] shrink-0">
                          {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {email.subject}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="truncate">{email.providerName}</span>
                        <span className="font-extrabold text-emerald-700 dark:text-[#B7E532]">
                          {email.totalAmountFormatted}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Email Message Preview */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100/60 dark:bg-[#08121E] p-4 sm:p-6">
            {selectedEmail ? (
              <div className="space-y-4 max-w-3xl mx-auto w-full">
                
                {/* Email Action Bar */}
                <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[11px] text-slate-400">Recipient:</div>
                    <div className="font-black text-slate-800 dark:text-slate-100">
                      {selectedEmail.toName} &lt;{selectedEmail.toEmail}&gt;
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyRef(selectedEmail.bookingRef)}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy Booking Reference"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRef ? 'Copied' : 'Copy Ref'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Print or Save PDF Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedEmail.id)}
                      className="px-2.5 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Rendered HTML Email Content */}
                <div 
                  className="bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 shadow-sm overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                />

                {/* Footer Assurance */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                  <span>
                    This electronic transaction record is digitally preserved in your local browser storage and synchronised with MsmeBooks escrow records.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Select an email to view details.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
