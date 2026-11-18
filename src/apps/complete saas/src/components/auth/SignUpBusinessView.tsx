import React, { useState } from 'react';
import { Building2, Globe, MapPin, Coins, ArrowRight, ArrowLeft } from 'lucide-react';
import { InputField } from '../common/FormInputs';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import { BUSINESS_TYPES, AFRICAN_COUNTRIES } from '../../data/mockData';

interface SignUpBusinessViewProps {
  initialData: {
    businessName: string;
    businessType: string;
    country: string;
    stateRegion: string;
    currency: string;
    businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';
  };
  onContinue: (data: {
    businessName: string;
    businessType: string;
    country: string;
    stateRegion: string;
    currency: string;
    businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';
  }) => void;
  onBack: () => void;
}

export const SignUpBusinessView: React.FC<SignUpBusinessViewProps> = ({
  initialData,
  onContinue,
  onBack,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Please select a business type';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.stateRegion.trim()) newErrors.stateRegion = 'State / Region is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountryChange = (countryName: string) => {
    const matched = AFRICAN_COUNTRIES.find((c) => c.name === countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      stateRegion: matched ? matched.defaultState : prev.stateRegion,
      currency: matched ? matched.currency : prev.currency,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    }
  };

  return (
    <AuthCard>
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={2} className="mb-4" />

      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Tell Us About Your Business
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Configure your organization entity, local currency, and operational scale.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step Indicator Sub-header */}
        <div className="text-left pb-1 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
            Step 2 — Business Profile
          </span>
          <span className="text-[11px] text-slate-400">2 of 5</span>
        </div>

        {/* Business Name */}
        <InputField
          label="Business Name"
          placeholder="e.g. ABC Supermarket Ltd"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          error={errors.businessName}
          isRequired
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        {/* Business Type Dropdown */}
        <div className="w-full space-y-1.5 text-left">
          <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
            Business Type <span className="text-[#84CC16] font-extrabold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className={`
                w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0F172A]
                transition-all duration-200 cursor-pointer
                ${
                  errors.businessType
                    ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                    : 'border-slate-200 hover:border-slate-300 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15'
                }
                focus:outline-none appearance-none
              `}
            >
              <option value="" disabled>
                Select your business type
              </option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.businessType && (
            <p className="text-xs text-red-600 font-medium">{errors.businessType}</p>
          )}
        </div>

        {/* Country & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
              Country <span className="text-[#84CC16] font-extrabold">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 focus:outline-none cursor-pointer appearance-none"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <InputField
            label="State / Region"
            placeholder="e.g. Lagos State"
            value={formData.stateRegion}
            onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })}
            error={errors.stateRegion}
            isRequired
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Currency & Business Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
              Operating Currency
            </label>
            <div className="relative">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="NGN">NGN (₦) — Nigerian Naira</option>
                <option value="KES">KES (KSh) — Kenyan Shilling</option>
                <option value="GHS">GHS (GH₵) — Ghanaian Cedi</option>
                <option value="ZAR">ZAR (R) — South African Rand</option>
                <option value="RWF">RWF (FRw) — Rwandan Franc</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="EUR">EUR (€) — Euro</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#072644] tracking-tight uppercase">
              Business Size
            </label>
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              {(['Micro', 'Small', 'Medium', 'Large'] as const).map((size) => {
                const isSelected = formData.businessSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, businessSize: size })}
                    className={`
                      py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer
                      ${
                        isSelected
                          ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#072644] ring-1 ring-[#84CC16]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex items-center gap-3">
          <SecondaryButton
            type="button"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="flex-1"
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-2"
          >
            Continue
          </PrimaryButton>
        </div>
      </form>
    </AuthCard>
  );
};
