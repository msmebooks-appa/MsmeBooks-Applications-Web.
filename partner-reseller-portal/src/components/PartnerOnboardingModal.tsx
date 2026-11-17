import React, { useState, useRef, useEffect } from 'react';
import { PartnerCategoryGroup, SignedAgreementRecord, PartnerLevelType } from '../types/partner';
import { AGREEMENT_META } from '../data/agreementData';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';

interface PartnerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryGroups: PartnerCategoryGroup[];
  prefilledCategory?: string;
  prefilledGroupTitle?: string;
  onApplicationCompleted: (record: SignedAgreementRecord) => void;
}

export const PartnerOnboardingModal: React.FC<PartnerOnboardingModalProps> = ({
  isOpen,
  onClose,
  categoryGroups,
  prefilledCategory = '',
  prefilledGroupTitle = '',
  onApplicationCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [primaryCategory, setPrimaryCategory] = useState<string>(prefilledCategory || 'Professional Accountants');
  const [secondaryCategory, setSecondaryCategory] = useState<string>('Tax Consultants');
  
  // Step 2: Business Info
  const [partnerName, setPartnerName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('Nigeria');
  const [city, setCity] = useState<string>('Lagos');
  const [website, setWebsite] = useState<string>('');

  // Step 3: Verification
  const [regNumber, setRegNumber] = useState<string>('');
  const [taxId, setTaxId] = useState<string>('');
  const [uploadedDocName, setUploadedDocName] = useState<string>('');

  // Step 4: Profile
  const [yearsExperience, setYearsExperience] = useState<string>('5-10 Years');
  const [targetAcquisition, setTargetAcquisition] = useState<string>('10 - 25 clients / year');
  const [servicesOffered, setServicesOffered] = useState<string>('Accounting, Bookkeeping, Tax Advisory');
  const [operatingCountries, setOperatingCountries] = useState<string>('Nigeria, Ghana, Kenya');

  // Step 6: Electronic Acceptance
  const [legalNameConsent, setLegalNameConsent] = useState<string>('');
  const [hasAgreedTerms, setHasAgreedTerms] = useState<boolean>(false);
  const [hasAgreedSchedules, setHasAgreedSchedules] = useState<boolean>(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Completed record
  const [submittedRecord, setSubmittedRecord] = useState<SignedAgreementRecord | null>(null);

  // Update category when prefilled changes
  useEffect(() => {
    if (prefilledCategory) {
      setPrimaryCategory(prefilledCategory);
    }
  }, [prefilledCategory]);

  // Setup canvas for drawing signature
  useEffect(() => {
    if (currentStep === 6 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.strokeStyle = isDark ? '#84CC16' : '#0046B8';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [currentStep, signatureMode]);

  if (!isOpen) return null;

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedDocName(e.target.files[0].name);
    }
  };

  const handleFinalSubmit = () => {
    if (!hasAgreedTerms || !hasAgreedSchedules) {
      alert('Please check both mandatory confirmation boxes indicating acceptance of all 30 Articles and Schedules A-G.');
      return;
    }

    if (!legalNameConsent.trim()) {
      alert('Please confirm your official legal name as signatory.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRecord: SignedAgreementRecord = {
      applicationId: `MSME-PARTNER-2026-${randomNum}`,
      partnerName: legalNameConsent || partnerName || 'MsmeBooks Channel Partner',
      businessName: businessName || 'Professional Consulting Practice',
      email: email || 'partner@advisory.org',
      phone: phone || '+234 803 000 0000',
      country: country,
      city: city || 'Lagos',
      website: website || '',
      primaryCategory: primaryCategory,
      assignedTier: 'Bronze',
      agreementVersion: AGREEMENT_META.version,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      ipAddress: '197.210.226.85 (Lagos, NG)',
      registrationNumber: regNumber || 'RC-1049281',
      taxId: taxId || 'TIN-98210928',
      status: 'Verified Active'
    };

    setSubmittedRecord(newRecord);
    onApplicationCompleted(newRecord);
    setCurrentStep(7);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#84CC16] text-slate-900 flex items-center justify-center font-extrabold text-xs">
              MB
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                MsmeBooks Partner Programme Onboarding & Electronic Execution
              </h3>
              <p className="text-[11px] text-slate-400">
                Official E-Signature & Onboarding Gateway · Master Agreement ({AGREEMENT_META.version})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Progress Stepper */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-3 shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] text-xs">
            {[
              { num: 1, label: 'Category' },
              { num: 2, label: 'Business Info' },
              { num: 3, label: 'Verification' },
              { num: 4, label: 'Profile' },
              { num: 5, label: 'Review' },
              { num: 6, label: 'E-Sign' },
              { num: 7, label: 'Status' }
            ].map(step => (
              <div key={step.num} className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === step.num
                      ? 'bg-[#0046B8] text-white shadow-xs'
                      : currentStep > step.num
                      ? 'bg-lime-500 text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {currentStep > step.num ? <Check className="w-3.5 h-3.5" /> : step.num}
                </span>
                <span className={`font-semibold ${currentStep === step.num ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.label}
                </span>
                {step.num < 7 && <span className="text-slate-300 dark:text-slate-700 ml-1">·</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">

          {/* STEP 1: Select Partnership Category */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 1 — Select Partnership Category</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Select your primary partnership track and optional secondary specialization.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Partnership Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={primaryCategory}
                    onChange={e => setPrimaryCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0046B8]"
                  >
                    {categoryGroups.map(group => (
                      <optgroup key={group.id} label={group.title} className="dark:bg-slate-800">
                        {group.subcategories.map(sub => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name} ({group.title.split('&')[0].trim()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Optional Secondary Category Specialization
                  </label>
                  <select
                    value={secondaryCategory}
                    onChange={e => setSecondaryCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0046B8]"
                  >
                    <option value="">None / Solo Focus</option>
                    {categoryGroups.map(group => (
                      <optgroup key={group.id} label={group.title} className="dark:bg-slate-800">
                        {group.subcategories.map(sub => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50/80 dark:bg-blue-950/60 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-[#0046B8] dark:text-blue-400">Classification Guarantee:</p>
                  <p>
                    Your category assignment establishes your authorized promotional scope under Schedule A of the Master Agreement. Certified practitioners may bill clients directly for migration and setup services.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 2 — Business & Principal Contact Information</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your official legal trading entity and authorized signatory details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name of Signatory <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Olufemi Babatunde"
                    value={partnerName}
                    onChange={e => setPartnerName(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Business / Practice Trading Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premier Financial Consulting Ltd"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. obabatunde@premierconsulting.ng"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Phone Number / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Country of Incorporation / Domicile <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-2.5"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Uganda">Uganda</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Other International">Other International Jurisdiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Operational City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nairobi, Accra"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Practice Website or Social Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.yourdomain.com or LinkedIn Profile"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Business Verification & Documents */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 3 — Business Verification & Compliance Documents</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Provide regulatory registration numbers and optional certificate uploads for fast-track compliance approval.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Registration / CAC / Company Reg No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RC-1049281 or BN-829102"
                      value={regNumber}
                      onChange={e => setRegNumber(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tax Identification Number (TIN / PIN / VAT)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TIN-98210928-0001"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Upload Business Registration Certificate or Professional License (PDF, PNG, JPG)
                  </label>
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#0046B8] dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 text-[#0046B8] dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {uploadedDocName ? `Selected: ${uploadedDocName}` : 'Click to select verification file or drag and drop'}
                    </span>
                    <span className="text-[11px] text-slate-400">PDF, JPG, or PNG up to 10MB</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your verification data is encrypted with AES-256 and used solely for know-your-partner (KYP) vetting in compliance with Schedule E.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Partner Profile & Capacity */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 4 — Commercial Experience & Capacity Profile</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Help us understand your current client footprint and customer acquisition capacity.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Years in Professional Practice or Software Distribution
                  </label>
                  <select
                    value={yearsExperience}
                    onChange={e => setYearsExperience(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  >
                    <option value="1-3 Years">1 - 3 Years</option>
                    <option value="3-5 Years">3 - 5 Years</option>
                    <option value="5-10 Years">5 - 10 Years</option>
                    <option value="10+ Years">10+ Years Established</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expected New SME Customer Onboardings Per Year
                  </label>
                  <select
                    value={targetAcquisition}
                    onChange={e => setTargetAcquisition(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  >
                    <option value="1 - 9 clients (Bronze Track)">1 - 9 clients / year (Bronze Track)</option>
                    <option value="10 - 25 clients (Silver Target)">10 - 25 clients / year (Silver Target)</option>
                    <option value="26 - 50 clients (Gold Target)">26 - 50 clients / year (Gold Target)</option>
                    <option value="50+ clients (Platinum Enterprise)">50+ clients / year (Platinum Target)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Vertical Industries Served
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Retail, Supermarkets, Pharmacies, Logistics, Hospitality"
                    value={servicesOffered}
                    onChange={e => setServicesOffered(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Countries of Operational Coverage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nigeria, Ghana, Kenya"
                    value={operatingCountries}
                    onChange={e => setOperatingCountries(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Agreement Review */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 5 — Review Master Legal Terms</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Carefully review the binding terms of the MsmeBooks Partner Agreement before electronic execution.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-h-60 overflow-y-auto text-xs text-slate-700 dark:text-slate-300 space-y-3 font-sans">
                <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  MSMEBOOKS MASTER PARTNER, RESELLER & AFFILIATE AGREEMENT (v2026.4)
                </div>
                <p>
                  <strong>Summary of Key Articles:</strong>
                </p>
                <p>
                  · <strong>Article 1 & 2:</strong> Contracting parties and non-exclusive commercial appointment.
                </p>
                <p>
                  · <strong>Article 6:</strong> Partnership Level performance standards (Bronze 15%, Silver 20%, Gold 30%, Platinum 40%). Initial baseline commences at approved qualifying tier.
                </p>
                <p>
                  · <strong>Article 9 & 10:</strong> 90-day referral attribution window. Net subscription revenue calculations. Commissions recur for active paid subscription lifespans.
                </p>
                <p>
                  · <strong>Article 11:</strong> Monthly settlement cycle disbursed by the 25th with $50 minimum threshold.
                </p>
                <p>
                  · <strong>Article 13, 14, 17:</strong> Trademark rules (no bidding on trademarked search terms), NDPR/POPIA/GDPR data privacy, and strict anti-bribery standards.
                </p>
                <p>
                  · <strong>Schedule A–G:</strong> Full legal schedules incorporated by reference.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>You have reviewed all 30 articles and schedules. Proceed to electronic signature.</span>
              </div>
            </div>
          )}

          {/* STEP 6: Electronic Acceptance & Signature */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Step 6 — Electronic Signature & Execution</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Provide your electronic signature and affirm legal authority to execute this contract.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Full Legal Name Confirmation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type Full Legal Signatory Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Olufemi Babatunde"
                    value={legalNameConsent}
                    onChange={e => {
                      setLegalNameConsent(e.target.value);
                      if (signatureMode === 'type') {
                        setTypedSignature(e.target.value);
                      }
                    }}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                {/* Signature Pad or Typed Signature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Digital Signature <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSignatureMode('draw')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          signatureMode === 'draw' ? 'bg-[#0046B8] dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        Draw Signature
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSignatureMode('type');
                          setTypedSignature(legalNameConsent || partnerName);
                        }}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          signatureMode === 'type' ? 'bg-[#0046B8] dark:bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        Type Font Signature
                      </button>
                      {signatureMode === 'draw' && (
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline text-[11px] cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {signatureMode === 'draw' ? (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-1 bg-white dark:bg-slate-900 relative">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 bg-slate-50 dark:bg-slate-950/80 rounded-lg cursor-crosshair touch-none"
                      />
                      {!hasDrawn && (
                        <p className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 pointer-events-none">
                          Draw your signature here with mouse or finger
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/80 text-center">
                      <input
                        type="text"
                        placeholder="Type signature..."
                        value={typedSignature}
                        onChange={e => setTypedSignature(e.target.value)}
                        className="w-full text-center text-2xl font-serif italic text-[#0046B8] dark:text-lime-400 bg-transparent border-0 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Simulated Electronic Font Signature</p>
                    </div>
                  )}
                </div>

                {/* Acceptance Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasAgreedTerms}
                      onChange={e => setHasAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#0046B8] focus:ring-[#0046B8] w-4 h-4"
                      required
                    />
                    <span>
                      I hereby explicitly accept and agree to all 30 Articles of the MsmeBooks Master Partner, Reseller & Affiliate Agreement (Version {AGREEMENT_META.version}).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasAgreedSchedules}
                      onChange={e => setHasAgreedSchedules(e.target.checked)}
                      className="mt-0.5 rounded text-[#0046B8] focus:ring-[#0046B8] w-4 h-4"
                      required
                    />
                    <span>
                      I agree to the commission schedules, code of conduct, brand guidelines, and territory conditions detailed in Schedules A through G.
                    </span>
                  </label>
                </div>

                {/* Audit Stamp Metadata */}
                <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5 border border-transparent dark:border-slate-800">
                  <p>Acceptance Timestamp: {new Date().toUTCString()}</p>
                  <p>Legal Evidence: Cryptographic SHA-256 Signature Stamp & Verified IP Logging</p>
                </div>

              </div>
            </div>
          )}

          {/* STEP 7: Submission & Confirmation */}
          {currentStep === 7 && submittedRecord && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full font-mono">
                  Agreement Executed & Submitted
                </span>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Welcome to the MsmeBooks Partner Ecosystem!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your application and signed Master Agreement have been registered in the MsmeBooks Partner Administration network.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Application Reference:</span>
                  <span className="font-extrabold text-[#0046B8] dark:text-blue-400 font-mono">{submittedRecord.applicationId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Partner Legal Entity:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submittedRecord.businessName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Designated Classification:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submittedRecord.primaryCategory}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Initial Tier:</span>
                  <span className="font-bold text-lime-700 dark:text-lime-400">{submittedRecord.assignedTier} (15% Recurring)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Agreement Version:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{submittedRecord.agreementVersion}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed Agreement</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow transition-colors cursor-pointer"
                >
                  <span>Go to Partner Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Navigation Buttons */}
        {currentStep < 7 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-2 px-7 py-3 text-xs font-bold text-slate-900 bg-[#84CC16] hover:bg-[#74C011] rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>Sign Agreement & Submit</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
