import React, { useState } from 'react';
import { Store, Building2, MapPin, ArrowRight, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';
import { BranchCard } from './SelectionCards';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { Company, Branch } from '../../types';

interface BranchSelectionViewProps {
  company: Company;
  selectedBranchId?: string;
  onSelectBranch: (branch: Branch) => void;
  onBackToCompanies: () => void;
}

export const BranchSelectionView: React.FC<BranchSelectionViewProps> = ({
  company,
  selectedBranchId,
  onSelectBranch,
  onBackToCompanies,
}) => {
  // If no branch selected yet, default to first or Head Office
  const [selectedId, setSelectedId] = useState<string>(
    selectedBranchId || company.branches[0]?.id || 'all'
  );

  const canAccessAllBranches = [
    'super_admin',
    'business_owner',
    'administrator',
    'finance_manager',
    'auditor',
  ].includes(company.userRole);

  const allBranchesMock: Branch = {
    id: 'all_branches',
    name: 'All Branches (Consolidated View)',
    location: `${company.branchesCount} Locations across ${company.location}`,
    state: company.location,
    code: 'CONSOL-ALL',
    isHeadOffice: false,
    phone: 'Enterprise Line',
    managerName: 'Consolidated Management',
  };

  const handleContinue = () => {
    if (selectedId === 'all_branches') {
      onSelectBranch(allBranchesMock);
    } else {
      const found = company.branches.find((b) => b.id === selectedId) || company.branches[0];
      onSelectBranch(found);
    }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-6 sm:p-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>

        {/* Current Company Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-xs text-[#072644] font-bold">
          <Building2 className="w-3.5 h-3.5 text-[#0F4C81]" />
          <span>{company.name}</span>
          <span className="text-slate-400">•</span>
          <span className="text-[#65A30D] font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#84CC16]" />
            {company.userRole.replace('_', ' ')}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Select a Branch
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Choose the location you want to work with today. POS registers and stock counts will synchronize to this terminal.
        </p>
      </div>

      {/* Branches List */}
      <div className="space-y-2.5 mb-6">
        {/* Consolidated Option for Admins */}
        {canAccessAllBranches && (
          <div
            onClick={() => setSelectedId('all_branches')}
            className={`
              w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ease-out cursor-pointer flex items-center justify-between group
              hover:-translate-y-0.5 active:translate-y-0
              ${
                selectedId === 'all_branches'
                  ? 'border-[#84CC16] bg-[#84CC16]/5 ring-2 ring-[#84CC16]/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 hover:border-[#0F4C81]/30 dark:hover:border-[#84CC16]/30 hover:bg-slate-100/50 dark:hover:bg-slate-800 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F4C81] text-[#9AE61C] flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#072644]">
                    All Branches (Consolidated View)
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#84CC16]/20 text-[#65A30D]">
                    Executive
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Consolidated financials, inventory, and cross-branch sales analytics.
                </p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                selectedId === 'all_branches'
                  ? 'border-[#84CC16] bg-[#84CC16] text-white'
                  : 'border-slate-300'
              }`}
            >
              {selectedId === 'all_branches' && <span className="text-xs font-bold">✓</span>}
            </div>
          </div>
        )}

        {/* Individual Branch Cards */}
        {company.branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isSelected={branch.id === selectedId}
            onSelect={(b) => setSelectedId(b.id)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-3">
        <PrimaryButton onClick={handleContinue} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Confirm & Open Workspace
        </PrimaryButton>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToCompanies}
            className="group text-xs text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] font-semibold inline-flex items-center gap-1.5 transition-all duration-200 ease-out hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
            <span className="underline decoration-transparent hover:decoration-current underline-offset-2">
              Back to Company Selection
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
