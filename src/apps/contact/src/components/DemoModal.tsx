import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, CheckCircle2, Sparkles, Building2, User, Mail, Phone, Check, ChevronDown, Search } from 'lucide-react';
import { AsYouType, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { useConnection } from '../context/ConnectionContext';
import { COUNTRIES } from '../data/countries';
import { CountryInfo } from '../types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const { tDict } = useLanguage();
  const { isOnline, incrementPendingCount } = useConnection();
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'Accounting & Ledgers',
    'Point of Sale (POS)',
  ]);
  const [demoDate, setDemoDate] = useState('2026-10-22');
  const [demoTime, setDemoTime] = useState('11:00 AM WAT');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryPickerRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setCountryPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDemoCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    const cleanDigits = q.replace(/\D/g, '');
    return COUNTRIES.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        (cleanDigits && c.dialCode.replace('+', '').includes(cleanDigits))
      );
    });
  }, [countrySearch]);

  if (!isOpen) return null;

  const toggleModule = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      showToast('Required Fields', 'Please provide your name, business name, and email.', 'error');
      return;
    }

    if (phone.trim()) {
      const cleanDigits = phone.replace(/\D/g, '');
      const full = phone.startsWith('+') ? phone : `${selectedCountry.dialCode}${cleanDigits}`;
      const valid = isValidPhoneNumber(full, selectedCountry.code as CountryCode);
      if (!valid) {
        showToast(
          'Invalid Phone Number',
          `Please enter a valid phone number for ${selectedCountry.name} (${selectedCountry.dialCode} ${selectedCountry.example || '803 123 4567'}).`,
          'error'
        );
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('confirmed');
      if (!isOnline) {
        incrementPendingCount();
        showToast(
          'Demo Request Queued Offline',
          `Saved locally. Slot for ${demoDate} will be transmitted once reconnected.`,
          'info'
        );
      } else {
        showToast(
          'Demo Scheduled!',
          `Your personalized demo is booked for ${demoDate} at ${demoTime}.`,
          'success'
        );
      }
    }, 1200);
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  const modulesList = [
    'Accounting & Ledgers',
    'Point of Sale (POS)',
    'Inventory & Stock Tracking',
    'Hotel & Hospitality',
    'Multi-Branch Management',
    'e-Invoicing & Tax Compliance',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#131E35] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8 animate-in fade-in zoom-in-95 transition-colors">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#70C038]" />
              <span className="text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] uppercase tracking-wider">
                LIVE PRODUCT WALKTHROUGH
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B3B82] dark:text-white">
              {tDict.demo.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-6">
              {tDict.demo.subtitle}
            </p>

            <form onSubmit={handleBookDemo} className="space-y-4 text-xs">
              {/* Modules selection */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Select Modules to Explore
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modulesList.map((mod) => {
                    const isChecked = selectedModules.includes(mod);
                    return (
                      <button
                        type="button"
                        key={mod}
                        onClick={() => toggleModule(mod)}
                        className={`p-2 rounded-lg text-left font-medium border transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#f0f6ff] dark:bg-blue-950/60 border-[#0B3B82] dark:border-blue-500 text-[#0B3B82] dark:text-[#93C5FD] font-semibold'
                            : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{mod}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="date"
                      value={demoDate}
                      onChange={(e) => setDemoDate(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <select
                      value={demoTime}
                      onChange={(e) => setDemoTime(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    >
                      <option value="10:00 AM WAT">10:00 AM WAT (West Africa)</option>
                      <option value="11:00 AM WAT">11:00 AM WAT (West Africa)</option>
                      <option value="02:00 PM WAT">02:00 PM WAT (West Africa)</option>
                      <option value="04:00 PM WAT">04:00 PM WAT (West Africa)</option>
                      <option value="12:00 PM EAT">12:00 PM EAT (East Africa)</option>
                      <option value="03:00 PM SAST">03:00 PM SAST (Southern Africa)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="work@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="flex gap-1.5">
                    {/* Country Dial Code Picker */}
                    <div className="relative shrink-0 w-28" ref={countryPickerRef}>
                      <button
                        type="button"
                        onClick={() => setCountryPickerOpen(!countryPickerOpen)}
                        className="w-full py-2 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1120] text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-1 truncate">
                          <span>{selectedCountry.flag}</span>
                          <span className="font-mono text-[11px]">{selectedCountry.dialCode}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                      </button>

                      {countryPickerOpen && (
                        <div className="absolute left-0 mt-1 w-64 max-h-56 bg-white dark:bg-[#0F172A] rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-2 overflow-hidden flex flex-col">
                          <div className="relative mb-1.5">
                            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country or code..."
                              className="w-full pl-6 pr-6 py-1 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded focus:outline-none focus:border-[#0B3B82]"
                              autoFocus
                            />
                            {countrySearch && (
                              <button
                                type="button"
                                onClick={() => setCountrySearch('')}
                                className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-0.5 overflow-y-auto max-h-40 pr-0.5">
                            {filteredDemoCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setCountryPickerOpen(false);
                                  setCountrySearch('');
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                                  selectedCountry.code === c.code
                                    ? 'bg-[#f0f6ff] dark:bg-blue-950/60 text-[#0B3B82] dark:text-[#93C5FD] font-semibold'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span>{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <span className="font-mono text-slate-400 text-[11px] ml-1 shrink-0">
                                  {c.dialCode}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        placeholder={selectedCountry.example || '803 123 4567'}
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          const asYouType = new AsYouType(selectedCountry.code as CountryCode);
                          setPhone(asYouType.input(val));
                        }}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg text-xs font-bold text-slate-950 bg-[#70C038] hover:bg-[#5fa62c] hover:text-white transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Demo Session...</span>
                  ) : (
                    <>
                      <span>Confirm Demo Reservation</span>
                      <Sparkles className="w-4 h-4 text-slate-900" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#f2f9eb] dark:bg-lime-950/50 border border-[#d2edaa] dark:border-lime-900 text-[#70C038] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-[#0B3B82] dark:text-white">Demo Successfully Scheduled!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto">
              A calendar invitation and Google Meet / Zoom link have been prepared for{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{email}</span>.
            </p>
            <div className="my-6 p-4 bg-slate-50 dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 text-left text-xs max-w-sm mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Business:</span>
                <span className="font-bold text-slate-800 dark:text-white">{company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{demoDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Time:</span>
                <span className="font-semibold text-[#0B3B82] dark:text-[#93C5FD]">{demoTime}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#0B3B82] dark:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold hover:bg-[#082d64] dark:hover:bg-[#1E40AF] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
