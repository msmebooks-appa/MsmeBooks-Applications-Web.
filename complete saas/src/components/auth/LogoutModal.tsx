import React from 'react';
import { LogOut, AlertCircle, Shield } from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

interface LogoutModalProps {
  isOpen: boolean;
  onConfirmLogout: () => void;
  onCancel: () => void;
  userName?: string;
  businessName?: string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onConfirmLogout,
  onCancel,
  userName = 'John',
  businessName = 'ABC Supermarket Ltd',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-xs">
          <LogOut className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-extrabold text-[#072644]">
            Sign out of MsmeBooks?
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Are you sure you want to sign out? Your current session for{' '}
            <strong className="text-[#072644]">{businessName}</strong> will be securely closed on this device.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <SecondaryButton onClick={onCancel} className="flex-1" size="md">
            Cancel
          </SecondaryButton>

          <button
            type="button"
            onClick={onConfirmLogout}
            className="flex-1 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
