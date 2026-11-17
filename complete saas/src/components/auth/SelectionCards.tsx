import React from 'react';
import { Building2, MapPin, Store, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Company, Branch } from '../../types';

interface CompanyCardProps {
  company: Company;
  isSelected?: boolean;
  onSelect: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isSelected = false,
  onSelect,
}) => {
  // Initials for avatar
  const initials = company.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={() => onSelect(company)}
      className={`
        w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ease-out cursor-pointer
        relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group
        hover:-translate-y-0.5 active:translate-y-0
        ${
          isSelected
            ? 'border-[#84CC16] bg-[#84CC16]/5 shadow-md shadow-[#84CC16]/10 ring-2 ring-[#84CC16]/30'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#0F4C81]/40 dark:hover:border-[#84CC16]/40 hover:shadow-md hover:bg-slate-50/70 dark:hover:bg-slate-800'
        }
      `}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        {/* Company Avatar / Logo */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base flex-shrink-0 transition-colors
            ${
              isSelected
                ? 'bg-[#0F4C81] text-[#9AE61C]'
                : 'bg-gradient-to-br from-[#0F4C81] to-[#0A365C] text-white'
            }
          `}
        >
          {initials}
        </div>

        {/* Company Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-[#072644] tracking-tight">{company.name}</h3>
            {isSelected && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D]">
                <Check className="w-3 h-3 stroke-[3]" /> Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-700">{company.industry}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              {company.location}
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-1 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#0F4C81] bg-[#0F4C81]/10 px-2 py-0.5 rounded-md">
              <Store className="w-3 h-3" />
              {company.branchesCount} {company.branchesCount === 1 ? 'Branch' : 'Branches'}
            </span>
            {company.warehousesCount > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Building2 className="w-3 h-3 text-slate-400" />
                {company.warehousesCount} {company.warehousesCount === 1 ? 'Warehouse' : 'Warehouses'}
              </span>
            )}
            <span className="inline-flex items-center gap-1 font-bold text-[#072644] bg-slate-100 px-2 py-0.5 rounded-md capitalize">
              <ShieldCheck className="w-3 h-3 text-[#84CC16]" />
              {company.userRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Select button / indicator */}
      <div className="self-end sm:self-center">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ease-out
            ${
              isSelected
                ? 'bg-[#84CC16] text-white shadow-xs'
                : 'border border-slate-300 dark:border-slate-600 text-slate-400 group-hover:border-[#0F4C81] dark:group-hover:border-[#84CC16] group-hover:text-[#0F4C81] dark:group-hover:text-[#84CC16] group-hover:scale-105'
            }
          `}
        >
          {isSelected ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};

interface BranchCardProps {
  branch: Branch;
  isSelected?: boolean;
  onSelect: (branch: Branch) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(branch)}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ease-out cursor-pointer
        flex items-center justify-between gap-3 group
        hover:-translate-y-0.5 active:translate-y-0
        ${
          isSelected
            ? 'border-[#84CC16] bg-[#84CC16]/5 ring-2 ring-[#84CC16]/20'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#0F4C81]/40 dark:hover:border-[#84CC16]/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${
              branch.isHeadOffice
                ? 'bg-[#0F4C81] text-white'
                : isSelected
                ? 'bg-[#84CC16]/20 text-[#65A30D]'
                : 'bg-slate-100 text-slate-600'
            }
          `}
        >
          <Store className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#072644]">{branch.name}</h4>
            {branch.isHeadOffice && (
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#0F4C81] text-white">
                HQ
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 px-1 rounded bg-slate-100">
              {branch.code}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {branch.location}
            </span>
            <span>•</span>
            <span>Mgr: {branch.managerName}</span>
          </div>
        </div>
      </div>

      <div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center border transition-all
          ${
            isSelected
              ? 'border-[#84CC16] bg-[#84CC16] text-white'
              : 'border-slate-300 text-transparent'
          }
        `}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>
    </div>
  );
};
