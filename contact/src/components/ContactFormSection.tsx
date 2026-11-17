import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  UploadCloud,
  CheckCircle2,
  FileText,
  X,
  Phone,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Building2,
  Mail,
  User,
  Search,
  Check,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { AsYouType, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { ContactFormData, EnquiryType, CountryInfo } from '../types';
import { COUNTRIES, INDUSTRIES, ENQUIRY_TYPES } from '../data/countries';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { useConnection } from '../context/ConnectionContext';
import { SecurityLogo } from './SecurityBadges';

interface ContactFormSectionProps {
  selectedEnquiryType: EnquiryType;
  onEnquiryTypeChange: (type: EnquiryType) => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  selectedEnquiryType,
  onEnquiryTypeChange,
}) => {
  const { showToast } = useToast();
  const { tDict } = useLanguage();
  const { isOnline, incrementPendingCount } = useConnection();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Country state initialized with Nigeria
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);

  // Form State
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    companyName: '',
    email: '',
    countryCode: COUNTRIES[0].dialCode,
    phoneNumber: '',
    country: COUNTRIES[0].name,
    industry: 'Retail Store & Supermarket',
    enquiryType: selectedEnquiryType,
    subject: '',
    message: '',
    consent: false,
    attachmentName: '',
    attachmentSize: '',
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  // Dropdown states for searchable country selector
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountryRegion, setSelectedCountryRegion] = useState<string>('All');
  const [phoneCodeDropdownOpen, setPhoneCodeDropdownOpen] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState('');

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setCountryDropdownOpen(false);
      }
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(target)) {
        setPhoneCodeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync prop changes to form state
  useEffect(() => {
    setFormData((prev) => ({ ...prev, enquiryType: selectedEnquiryType }));
  }, [selectedEnquiryType]);

  // Handle Country Selection and synchronize phone formatting
  const handleCountrySelect = (country: CountryInfo) => {
    setSelectedCountry(country);
    setFormData((prev) => {
      // Re-format existing digits with the newly selected country's rules
      const digits = prev.phoneNumber.replace(/\D/g, '');
      let formattedPhone = prev.phoneNumber;
      if (digits) {
        const formatter = new AsYouType(country.code as CountryCode);
        formattedPhone = formatter.input(digits);
      }
      return {
        ...prev,
        country: country.name,
        countryCode: country.dialCode,
        phoneNumber: formattedPhone,
      };
    });

    // Check validity with new country rules
    if (formData.phoneNumber) {
      const digits = formData.phoneNumber.replace(/\D/g, '');
      const fullNumber = `${country.dialCode}${digits}`;
      const valid = isValidPhoneNumber(fullNumber, country.code as CountryCode);
      setIsPhoneValid(valid);
      if (valid && errors.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      }
    } else {
      setIsPhoneValid(null);
    }

    setCountryDropdownOpen(false);
    setPhoneCodeDropdownOpen(false);
  };

  // Automatic formatting & validation using libphonenumber-js
  const handlePhoneNumberChange = (inputVal: string) => {
    let cleanInput = inputVal;
    let activeCountry = selectedCountry;

    // If user pasted an international format starting with "+", auto-detect the country
    if (inputVal.trim().startsWith('+')) {
      const globalFormatter = new AsYouType();
      globalFormatter.input(inputVal);
      const detectedIso = globalFormatter.getCountry();
      if (detectedIso) {
        const matched = COUNTRIES.find((c) => c.code === detectedIso);
        if (matched) {
          activeCountry = matched;
          setSelectedCountry(matched);
          setFormData((prev) => ({
            ...prev,
            country: matched.name,
            countryCode: matched.dialCode,
          }));
          // Remove the dial code portion from the input display if present
          if (inputVal.startsWith(matched.dialCode)) {
            cleanInput = inputVal.slice(matched.dialCode.length).trim();
          }
        }
      }
    }

    // Format input dynamically based on the active country using AsYouType
    const formatter = new AsYouType(activeCountry.code as CountryCode);
    const formatted = formatter.input(cleanInput);

    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));

    // Check validity using libphonenumber-js isValidPhoneNumber
    const digitsOnly = formatted.replace(/\D/g, '');
    if (!digitsOnly) {
      setIsPhoneValid(null);
      if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      return;
    }

    const fullNumberToTest = `${activeCountry.dialCode}${digitsOnly}`;
    const valid = isValidPhoneNumber(fullNumberToTest, activeCountry.code as CountryCode);
    setIsPhoneValid(valid);

    if (valid && errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    }
  };

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.companyName.trim()) errs.companyName = 'Company / Business Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Business Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    // Phone validation with libphonenumber-js
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (!phoneDigits) {
      errs.phoneNumber = 'Phone number is required';
    } else {
      const fullNumber = `${selectedCountry.dialCode}${phoneDigits}`;
      const valid = isValidPhoneNumber(fullNumber, selectedCountry.code as CountryCode);
      if (!valid) {
        errs.phoneNumber = `Please enter a valid phone number for ${selectedCountry.name} (e.g. ${selectedCountry.example || '803 123 4567'})`;
      }
    }

    if (!formData.country) errs.country = 'Please select a country';
    if (!formData.subject.trim()) errs.subject = 'Subject line is required';
    if (!formData.message.trim()) {
      errs.message = 'Please provide details on how we can help';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters';
    }

    if (!formData.consent) {
      errs.consent = 'You must agree to our Privacy Policy to submit';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields correctly.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate secure backend submission & CRM routing with offline queue support
    setTimeout(() => {
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `MSME-2026-${randomTicketNum}`;
      setSubmissionId(ticketId);
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (!isOnline) {
        incrementPendingCount();
        showToast(
          'Saved to Offline Queue',
          `Reference ID ${ticketId} stored locally. Will auto-sync to cloud when online.`,
          'info'
        );
      } else {
        showToast(
          'Message Dispatched Successfully',
          `Reference ID ${ticketId} generated. Our team has received your enquiry.`,
          'success'
        );
      }
    }, 1400);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      countryCode: COUNTRIES[0].dialCode,
      phoneNumber: '',
      country: COUNTRIES[0].name,
      industry: 'Retail Store & Supermarket',
      enquiryType: 'General Enquiry',
      subject: '',
      message: '',
      consent: false,
      attachmentName: '',
      attachmentSize: '',
    });
    setSelectedCountry(COUNTRIES[0]);
    setIsPhoneValid(null);
    setErrors({});
    setIsSubmitted(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File Too Large', 'Maximum attachment size is 10MB', 'error');
        return;
      }
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentSize: formattedSize,
      }));
      showToast('File Attached', `${file.name} ready to submit`, 'info');
    }
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, attachmentName: '', attachmentSize: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    const cleanDigits = q.replace(/\D/g, '');

    return COUNTRIES.filter((c) => {
      // Search matching: name, ISO code, or dial code
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        (cleanDigits && c.dialCode.replace('+', '').includes(cleanDigits));

      if (!matchesSearch) return false;

      // Region filter
      if (selectedCountryRegion === 'All') return true;
      if (selectedCountryRegion === 'Africa') return c.isAfrican;
      return c.region === selectedCountryRegion;
    });
  }, [countrySearch, selectedCountryRegion]);

  const filteredPhoneCodes = useMemo(() => {
    const q = phoneCodeSearch.trim().toLowerCase();
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
  }, [phoneCodeSearch]);

  return (
    <section id="contact-form" className="py-16 lg:py-24 bg-white dark:bg-[#0B1120] relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column — Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131E35] rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative transition-colors">
            <div className="mb-8">
              <span className="text-xs font-bold text-[#70C038] uppercase tracking-wider block mb-2">
                {tDict.form.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
                {tDict.form.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {tDict.form.subtitle}
              </p>
            </div>

            {isSubmitted ? (
              /* Success Confirmation Card */
              <div className="py-8 px-6 text-center bg-[#f2f9eb]/60 dark:bg-lime-950/40 rounded-xl border border-[#d2edaa] dark:border-lime-900 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#70C038] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-[#0B3B82] dark:text-white mb-1">
                  {tDict.form.successTitle}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto mb-4">
                  {tDict.form.successSubtitle}{' '}
                  <span className="font-semibold text-[#0B3B82] dark:text-[#93C5FD]">{formData.enquiryType}</span>.
                </p>

                <div className="bg-white dark:bg-[#0B1120] rounded-lg p-4 max-w-md mx-auto border border-slate-200 dark:border-slate-800 text-left mb-6 shadow-xs text-xs space-y-1.5">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{tDict.form.successTicket}</span>
                    <span className="font-mono font-bold text-[#0B3B82] dark:text-[#93C5FD]">{submissionId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Business:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Email:</span>
                    <span className="text-slate-800 dark:text-white">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Verified Phone:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-white">
                      {selectedCountry.dialCode} {formData.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Subject:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                      {formData.subject}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold text-[#0B3B82] dark:text-slate-200 bg-white dark:bg-[#131E35] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                  <a
                    href="https://wa.me/2349158482622"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-[#70C038] hover:bg-[#5fa62c] hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct Support</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="on">
                {/* Row 1: Full Name & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                    >
                      {tDict.form.fullName} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="contact-full-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder={tDict.form.fullNamePlaceholder}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 ${
                          errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-company-name"
                      className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                    >
                      {tDict.form.companyName} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="contact-company-name"
                        name="organization"
                        type="text"
                        autoComplete="organization"
                        value={formData.companyName}
                        onChange={(e) => {
                          setFormData({ ...formData, companyName: e.target.value });
                          if (errors.companyName) setErrors({ ...errors, companyName: '' });
                        }}
                        placeholder={tDict.form.companyNamePlaceholder}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 ${
                          errors.companyName ? 'border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.companyName}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Business Email & Formatted Phone with libphonenumber-js */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                    >
                      {tDict.form.workEmail} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder={tDict.form.workEmailPlaceholder}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 ${
                          errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                      >
                        {tDict.form.phoneNumber} <span className="text-red-500">*</span>
                      </label>
                      {isPhoneValid === true && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d8b20] dark:text-[#a1e670]">
                          <Check className="w-3.5 h-3.5" />
                          <span>{tDict.form.validPhone}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* Searchable Dial Code Selector with Flag & Code */}
                      <div className="relative shrink-0 w-32" ref={phoneDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setPhoneCodeDropdownOpen(!phoneCodeDropdownOpen)}
                          className="w-full py-2.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1120] text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Select international country code"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.dialCode}</span>
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </button>

                        {phoneCodeDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-72 max-h-72 bg-white dark:bg-[#0F172A] rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-2.5 overflow-hidden flex flex-col">
                            <div className="relative mb-2">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                              <input
                                type="text"
                                name="phoneCodeSearch"
                                autoComplete="off"
                                aria-label="Search country or dial code"
                                value={phoneCodeSearch}
                                onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                placeholder="Search country or dial code (+234, +1...)"
                                className="w-full pl-7 pr-7 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                                autoFocus
                              />
                              {phoneCodeSearch && (
                                <button
                                  type="button"
                                  onClick={() => setPhoneCodeSearch('')}
                                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1 pb-1.5 flex justify-between">
                              <span>World Dial Codes</span>
                              <span>{filteredPhoneCodes.length} countries</span>
                            </div>
                            <div className="space-y-0.5 overflow-y-auto max-h-52 pr-1">
                              {filteredPhoneCodes.length === 0 ? (
                                <div className="text-center py-4 text-xs text-slate-400">
                                  No countries found for "{phoneCodeSearch}"
                                </div>
                              ) : (
                                filteredPhoneCodes.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(c)}
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
                                    <span className="font-mono text-slate-500 dark:text-slate-400 font-medium ml-2 shrink-0">
                                      {c.dialCode}
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Input with Auto-Formatting */}
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          id="contact-phone"
                          name="tel"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handlePhoneNumberChange(e.target.value)}
                          placeholder={selectedCountry.example || '803 123 4567'}
                          className={`w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 ${
                            errors.phoneNumber
                              ? 'border-red-500 bg-red-50/20'
                              : isPhoneValid === true
                              ? 'border-[#70C038] focus:border-[#70C038]'
                              : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                          }`}
                        />
                        {/* Real-time status indicator in input */}
                        <div className="absolute right-3 top-3 pointer-events-none">
                          {isPhoneValid === true && (
                            <CheckCircle2 className="w-4 h-4 text-[#70C038]" />
                          )}
                          {isPhoneValid === false && formData.phoneNumber.replace(/\D/g, '').length >= 5 && (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic format guidance / error */}
                    {errors.phoneNumber ? (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.phoneNumber}</p>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span>Format:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {selectedCountry.dialCode} {selectedCountry.example || '803 123 4567'}
                        </span>
                        {isPhoneValid === false && formData.phoneNumber.replace(/\D/g, '').length >= 5 && (
                          <span className="text-amber-600 dark:text-amber-400 ml-1 font-medium">· Incomplete number</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Country & Business Type / Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country Searchable Dropdown */}
                  <div className="relative" ref={countryDropdownRef}>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-sm text-left flex items-center justify-between hover:border-slate-400 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500 transition-colors"
                      aria-label="Select your country"
                    >
                      <span className="text-slate-900 dark:text-white font-medium flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">{selectedCountry.flag}</span>
                        <span className="truncate">{formData.country}</span>
                        {selectedCountry.isAfrican && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[#4d8b20] dark:text-[#a1e670] font-semibold shrink-0">
                            Pan-African Hub
                          </span>
                        )}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    </button>

                    {countryDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-80 bg-white dark:bg-[#0F172A] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-3 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        {/* Search Input */}
                        <div className="relative mb-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                          <input
                            type="text"
                            name="countrySearch"
                            autoComplete="off"
                            aria-label="Search country"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search by country, code (NG, US), or dial (+234)..."
                            className="w-full pl-8 pr-7 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                            autoFocus
                          />
                          {countrySearch && (
                            <button
                              type="button"
                              onClick={() => setCountrySearch('')}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Region Filter Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-800 text-[11px]">
                          {(['All', 'Africa', 'Americas', 'Europe', 'Asia', 'Oceania'] as const).map((reg) => (
                            <button
                              key={reg}
                              type="button"
                              onClick={() => setSelectedCountryRegion(reg)}
                              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                                selectedCountryRegion === reg
                                  ? 'bg-[#0B3B82] text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {reg === 'All' ? 'All (World)' : reg === 'Africa' ? '🌍 Africa (54)' : reg}
                            </button>
                          ))}
                        </div>

                        {/* Counter */}
                        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 py-1.5 flex justify-between">
                          <span>{selectedCountryRegion === 'Africa' ? 'African Continental Markets' : 'Global Countries & Territories'}</span>
                          <span>{filteredCountries.length} countries</span>
                        </div>

                        {/* Scrollable list */}
                        <div className="space-y-0.5 overflow-y-auto max-h-56 pr-1">
                          {filteredCountries.length === 0 ? (
                            <div className="text-center py-6 text-xs text-slate-400">
                              No countries found matching "{countrySearch}"
                            </div>
                          ) : (
                            filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => handleCountrySelect(c)}
                                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                  selectedCountry.code === c.code
                                    ? 'bg-[#f0f6ff] dark:bg-blue-950/60 text-[#0B3B82] dark:text-[#93C5FD] font-semibold ring-1 ring-[#0B3B82]/20'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span className="text-sm shrink-0">{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({c.code})</span>
                                </span>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  {c.isAfrican && (
                                    <span className="text-[10px] font-bold text-[#70C038]">
                                      Pan-Africa
                                    </span>
                                  )}
                                  <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                                    {c.dialCode}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-industry"
                      className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                    >
                      Business Type / Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contact-industry"
                      name="industry"
                      autoComplete="off"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Enquiry Type */}
                <div>
                  <label
                    htmlFor="contact-enquiry-type"
                    className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                  >
                    Enquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact-enquiry-type"
                    name="enquiryType"
                    autoComplete="off"
                    value={formData.enquiryType}
                    onChange={(e) => {
                      const val = e.target.value as EnquiryType;
                      setFormData({ ...formData, enquiryType: val });
                      onEnquiryTypeChange(val);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1120] text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#0B3B82]"
                  >
                    {ENQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 5: Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    autoComplete="off"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: '' });
                    }}
                    placeholder="e.g. Inquiring about POS & multi-branch inventory implementation"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 ${
                      errors.subject ? 'border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.subject}</p>
                  )}
                </div>

                {/* Row 6: Message / How Can We Help You? */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
                  >
                    Message / How Can We Help You? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    autoComplete="off"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Please describe your current business operations, number of branches/users, or specific software requirements..."
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-[#0B1120] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B3B82]/20 resize-y ${
                      errors.message ? 'border-red-500 bg-red-50/20' : 'border-slate-300 dark:border-slate-700 focus:border-[#0B3B82] dark:focus:border-blue-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Optional Attachment Upload */}
                <div>
                  <label
                    htmlFor="contact-attachment"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Optional Attachment (Screenshots, RFP, Specifications - Max 10MB)
                  </label>
                  <input
                    id="contact-attachment"
                    name="attachment"
                    type="file"
                    autoComplete="off"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.docx"
                  />

                  {formData.attachmentName ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0B3B82] dark:text-[#93C5FD]" />
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {formData.attachmentName}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">({formData.attachmentSize})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0B3B82] dark:hover:border-blue-500 rounded-lg bg-slate-50 dark:bg-[#0B1120] hover:bg-[#f0f6ff]/40 dark:hover:bg-blue-950/30 transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0B3B82] dark:hover:text-white"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>Click to attach file or diagnostic log</span>
                    </button>
                  )}
                </div>

                {/* Consent & Privacy Link */}
                <div>
                  <label htmlFor="contact-consent" className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="contact-consent"
                      name="consent"
                      type="checkbox"
                      autoComplete="off"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData({ ...formData, consent: e.target.checked });
                        if (errors.consent) setErrors({ ...errors, consent: '' });
                      }}
                      className="mt-0.5 w-4 h-4 text-[#0B3B82] border-slate-300 dark:border-slate-700 rounded focus:ring-[#0B3B82]"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                      I agree to MsmeBooks processing my contact details in accordance with the{' '}
                      <a
                        href="#privacy-policy"
                        onClick={(e) => {
                          e.preventDefault();
                          showToast('Privacy Policy', 'MsmeBooks complies with African & global data protection laws (NDPR, POPIA, GDPR).', 'info');
                        }}
                        className="text-[#0B3B82] dark:text-[#93C5FD] font-semibold underline hover:text-[#082d64] dark:hover:text-white"
                      >
                        Privacy Policy
                      </a>{' '}
                      to address my business enquiry.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Button & Anti-Spam Indicator */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#70C038]" />
                    <span>Secure Encrypted Submission</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-[#1D4ED8] dark:hover:bg-[#1E40AF] border-b-2 border-[#70C038] transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 text-[#70C038]" />
                      </>
                    )}
                  </button>
                </div>

                {/* Security and Compliance Trust Strip */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#70C038]" />
                      <span>Security & Compliance Guaranteed</span>
                    </span>
                    <a
                      href="#security-compliance"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('security-compliance');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] text-[#0B3B82] dark:text-[#93C5FD] font-semibold hover:underline"
                    >
                      Audit Credentials →
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                      <SecurityLogo id="iso27001" size="sm" />
                      <div className="leading-tight">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-white block">ISO 27001</span>
                        <span className="text-[10px] text-slate-400 font-medium">Certified ISMS</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                      <SecurityLogo id="soc2" size="sm" />
                      <div className="leading-tight">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-white block">SOC 2 Type II</span>
                        <span className="text-[10px] text-slate-400 font-medium">Audited Cloud</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                      <SecurityLogo id="pcidss" size="sm" />
                      <div className="leading-tight">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-white block">PCI-DSS L1</span>
                        <span className="text-[10px] text-slate-400 font-medium">POS Card Safe</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                      <SecurityLogo id="dataprivacy" size="sm" />
                      <div className="leading-tight">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-white block">NDPR & POPIA</span>
                        <span className="text-[10px] text-slate-400 font-medium">African Privacy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column — African Customer Service Representative Photography & Floating Badge */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-4/3 group">
              <img
                src="/src/assets/images/support_african_specialist_1792327888097.jpg"
                alt="African female customer service specialist wearing a headset in modern corporate office"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />

              {/* Scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B82]/80 dark:from-[#0B1120]/90 via-transparent to-transparent pointer-events-none" />

              {/* Floating element as requested in Section 5 */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 dark:bg-[#131E35]/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 dark:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#70C038]" />
                  <span className="text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] uppercase tracking-wide">
                    Dedicated Support Desk
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  "Real People. Reliable Support. Better Business."
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Our regional consultants understand African tax, banking, retail, and local enterprise operations.
                </p>
              </div>
            </div>

            {/* Support Guarantee & Direct Fast Track */}
            <div className="bg-[#f0f6ff] dark:bg-blue-950/40 rounded-xl p-6 border border-[#cbe0fb] dark:border-blue-900 space-y-4 transition-colors">
              <h3 className="text-sm font-bold text-[#0B3B82] dark:text-[#93C5FD] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#70C038]" />
                Prefer Instant Chat or Direct Dial?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect instantly with a live business consultant or customer support engineer via WhatsApp or our official phone line.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%2C%20I%20would%20like%20to%20enquire%20about%20your%20software"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-[#131E35] hover:bg-[#f2f9eb] dark:hover:bg-[#1A2846] border border-slate-200 dark:border-slate-700 hover:border-[#70C038] dark:hover:border-[#70C038] rounded-lg transition-all flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white"
                >
                  <MessageCircle className="w-4 h-4 text-[#70C038]" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href="tel:+2349158482622"
                  className="p-3 bg-white dark:bg-[#131E35] hover:bg-[#f0f6ff] dark:hover:bg-[#1A2846] border border-slate-200 dark:border-slate-700 hover:border-[#0B3B82] dark:hover:border-blue-500 rounded-lg transition-all flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white"
                >
                  <Phone className="w-4 h-4 text-[#0B3B82] dark:text-[#93C5FD]" />
                  <span>+234 915 848 2622</span>
                </a>
              </div>
            </div>

            {/* Enterprise Security & Compliance Trust Badge in Side Column */}
            <div className="p-4 bg-white dark:bg-[#131E35] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-[#70C038]" />
                  <span>Enterprise Security & Non-Disclosure</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  256-Bit TLS
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your contact details and commercial discussions are safeguarded under strict non-disclosure, NDPR, POPIA, and ISO/IEC 27001 standards. Zero commercial data syndication.
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#70C038]" />
                  <span>Sovereign African Hosting</span>
                </span>
                <a
                  href="#security-compliance"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('security-compliance');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-semibold text-[#0B3B82] dark:text-[#93C5FD] hover:underline"
                >
                  Verify Standards →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
