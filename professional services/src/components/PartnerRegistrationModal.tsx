import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Upload, 
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [firmName, setFirmName] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [category, setCategory] = useState('Chartered Accounting Firm');
  const [licenseBody, setLicenseBody] = useState('ICAN');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
              Partner Network Onboarding
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Register Your Professional Practice
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 bg-white dark:bg-[#08121E]">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-[#102B4E] dark:text-white">
                Application Received!
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying to join the MsmeBooks Professional Services Directory. Our partner accreditation committee will review your practice credentials and contact you within <strong>48 hours</strong>.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-xs text-left space-y-1">
                <div>Firm: <strong className="text-slate-800 dark:text-slate-200">{firmName || 'Cedar Partners'}</strong></div>
                <div>Category: <strong className="text-slate-800 dark:text-slate-200">{category}</strong></div>
                <div>Accreditation Body: <strong className="text-slate-800 dark:text-slate-200">{licenseBody} (Lic: {licenseNumber || 'Verified'})</strong></div>
                <div>Contact: <strong className="text-slate-800 dark:text-slate-200">{email}</strong></div>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Return to Marketplace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Firm / Practice Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="e.g. Apex Chartered Accountants"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    CAC / RGD Registration Number
                  </label>
                  <input
                    type="text"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    placeholder="e.g. RC 1492042 / BN 29104"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Professional Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  >
                    <option value="Chartered Accounting Firm">Chartered Accounting Firm</option>
                    <option value="Tax & Regulatory Advisory">Tax & Regulatory Advisory</option>
                    <option value="Certified Implementation Partner">Certified Implementation Partner</option>
                    <option value="Business Advisory & Strategy">Business Advisory & Strategy</option>
                    <option value="Internal Audit & Risk Practice">Internal Audit & Risk Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Accreditation / Licensing Body *
                  </label>
                  <select
                    value={licenseBody}
                    onChange={(e) => setLicenseBody(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  >
                    <option value="ICAN (Nigeria)">ICAN (Nigeria)</option>
                    <option value="ANAN (Nigeria)">ANAN (Nigeria)</option>
                    <option value="CITN (Taxation Nigeria)">CITN (Taxation Nigeria)</option>
                    <option value="ACCA Global">ACCA Global</option>
                    <option value="ICAG (Ghana)">ICAG (Ghana)</option>
                    <option value="ICPAK (Kenya)">ICPAK (Kenya)</option>
                    <option value="SAICA (South Africa)">SAICA (South Africa)</option>
                    <option value="ICPAR (Rwanda)">ICPAR (Rwanda)</option>
                    <option value="Tech / Implementation Certified">Tech / Implementation Certified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Practice License / Membership ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. ICAN/FP/2018/0491"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Primary Operating City & Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Managing Partner / Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Dr. Emeka Obi, FCA"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. partner@firm.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 802 345 6789"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Upload credential document */}
              <div className="p-3 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Upload Practice License / Certificate (PDF/JPG)</span>
                    <p className="text-[10px] text-slate-400">Used strictly for vetting. Never made public.</p>
                  </div>
                </div>
                <div>
                  {fileName ? (
                    <span className="text-emerald-600 dark:text-[#B7E532] font-bold text-xs">{fileName}</span>
                  ) : (
                    <label className="px-3 py-1 bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-[#132842] cursor-pointer">
                      <span>Browse</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }} 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Partner Registration for Vetting</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
