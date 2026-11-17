import React, { useState } from 'react';
import { Building, MapPin, Phone, Hash, Calendar, Globe, Upload, ArrowRight, Check } from 'lucide-react';
import { InputField } from '../common/FormInputs';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';

interface BusinessSetupViewProps {
  initialData: {
    businessAddress: string;
    taxIdNumber: string;
    financialYearStart: string;
    website?: string;
  };
  businessName: string;
  onComplete: (data: {
    businessAddress: string;
    taxIdNumber: string;
    financialYearStart: string;
    website?: string;
  }) => void;
  onSkip: () => void;
}

export const BusinessSetupView: React.FC<BusinessSetupViewProps> = ({
  initialData,
  businessName,
  onComplete,
  onSkip,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <AuthCard>
      <ProgressIndicator currentStep={4} className="mb-4" />

      {/* Header */}
      <div className="text-center space-y-1.5 mb-5">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Set Up Your Business
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Configure financial details and tax identifiers for <strong className="text-[#072644] font-semibold">{businessName || 'your business'}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Step Indicator */}
        <div className="text-left pb-1 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
            Step 4 — Business Details & Tax
          </span>
          <span className="text-[11px] text-slate-400">4 of 5</span>
        </div>

        {/* Business Logo Upload Area */}
        <div className="text-left space-y-1">
          <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
            Business Logo
          </label>
          <div
            onClick={() => setLogoUploaded(!logoUploaded)}
            className={`
              border-2 border-dashed rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all
              ${
                logoUploaded
                  ? 'border-[#84CC16] bg-[#84CC16]/5 text-[#072644]'
                  : 'border-slate-200 hover:border-[#0F4C81]/40 bg-slate-50 hover:bg-white text-slate-500'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs
                  ${
                    logoUploaded
                      ? 'bg-[#84CC16] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-[#0F4C81]'
                  }
                `}
              >
                {logoUploaded ? <Check className="w-5 h-5 stroke-[3]" /> : <Upload className="w-5 h-5" />}
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#072644] block">
                  {logoUploaded ? 'Logo attached: company_logo.png' : 'Click to upload business logo'}
                </span>
                <span className="text-slate-400 text-[11px]">PNG, JPG or SVG up to 5MB</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#0F4C81] underline">
              {logoUploaded ? 'Change' : 'Browse'}
            </span>
          </div>
        </div>

        {/* Business Address */}
        <InputField
          label="Business Address"
          placeholder="e.g. 14A Victoria Island Commercial Way, Lagos"
          value={formData.businessAddress}
          onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
          isRequired
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        {/* Tax Identification Number (TIN) */}
        <InputField
          label="Tax Identification Number (TIN)"
          placeholder="e.g. TIN-99482103-001"
          value={formData.taxIdNumber}
          onChange={(e) => setFormData({ ...formData, taxIdNumber: e.target.value })}
          isRequired
          leftIcon={<Hash className="w-4 h-4" />}
          helperText="Required for compliant VAT invoicing and tax reporting."
        />

        {/* Financial Year Start & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
              Financial Year Start
            </label>
            <div className="relative">
              <select
                value={formData.financialYearStart}
                onChange={(e) => setFormData({ ...formData, financialYearStart: e.target.value })}
                className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="January 1">January 1st</option>
                <option value="April 1">April 1st</option>
                <option value="July 1">July 1st</option>
                <option value="October 1">October 1st</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <InputField
            label="Website (Optional)"
            placeholder="www.yourcompany.com"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        {/* Actions */}
        <div className="pt-3 space-y-2">
          <PrimaryButton type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Complete Setup
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onSkip} fullWidth size="sm">
            Skip for now
          </SecondaryButton>
        </div>
      </form>
    </AuthCard>
  );
};
