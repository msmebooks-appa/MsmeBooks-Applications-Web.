import React, { useState } from 'react';
import { Building2, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { CompanyCard } from './SelectionCards';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import { Company } from '../../types';
import { MOCK_COMPANIES } from '../../data/mockData';

interface CompanySelectionViewProps {
  companies?: Company[];
  selectedCompanyId?: string;
  userName?: string;
  onSelectCompany: (company: Company) => void;
  onRegisterNewBusiness: () => void;
  onSignOut: () => void;
}

export const CompanySelectionView: React.FC<CompanySelectionViewProps> = ({
  companies = MOCK_COMPANIES,
  selectedCompanyId = MOCK_COMPANIES[0].id,
  userName = 'John',
  onSelectCompany,
  onRegisterNewBusiness,
  onSignOut,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedCompanyId);

  const selectedCompany = companies.find((c) => c.id === selectedId) || companies[0];

  const handleContinue = () => {
    if (selectedCompany) {
      onSelectCompany(selectedCompany);
    }
  };

  return (
    <div className="w-full max-w-[620px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-6 sm:p-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="md" showTagline={false} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-xs font-bold text-[#0F4C81]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
          <span>Multi-Tenant Architecture</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Select Your Business
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Welcome, <strong className="text-[#072644]">{userName}</strong>. Choose the registered business entity you want to manage.
        </p>
      </div>

      {/* Companies List */}
      <div className="space-y-3 mb-6">
        {companies.map((comp) => (
          <CompanyCard
            key={comp.id}
            company={comp}
            isSelected={comp.id === selectedId}
            onSelect={(c) => setSelectedId(c.id)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <PrimaryButton onClick={handleContinue} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Continue to Branch Selection
        </PrimaryButton>

        <div className="flex items-center justify-between gap-3 pt-2 text-xs">
          <button
            type="button"
            onClick={onRegisterNewBusiness}
            className="group text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] font-bold flex items-center gap-1.5 transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#84CC16] transition-transform duration-200 group-hover:scale-125" />
            <span className="underline decoration-transparent hover:decoration-current underline-offset-2">
              Register Another Business
            </span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="text-slate-500 hover:text-red-600 font-medium transition-colors duration-200 cursor-pointer hover:underline underline-offset-2"
          >
            Switch Account / Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
