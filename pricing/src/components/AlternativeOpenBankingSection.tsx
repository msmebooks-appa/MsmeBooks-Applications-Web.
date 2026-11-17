import React, { useState, useMemo, useEffect } from 'react';
import {
  Landmark,
  Link2,
  ShieldCheck,
  Search,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  RefreshCw,
  KeyRound,
  Unlink,
  Building2,
} from 'lucide-react';
import {
  AFRICAN_OPEN_BANKING_BANKS,
  AfricanOpenBankingBank,
  LinkedBankAccount,
  getBanksForCountry,
  calculateOpenBankingSettlementFeeNgn,
} from '../data/openBankingProviders';
import { CustomerBillingDetails } from '../types/cart';

interface AlternativeOpenBankingSectionProps {
  customer: CustomerBillingDetails;
  totalPayableNgn: number;
  format: (amountNgn: number) => string;
  isActiveMethod: boolean;
  onToggleActiveMethod: (active: boolean) => void;
  linkedAccount: LinkedBankAccount | null;
  onLinkAccount: (account: LinkedBankAccount | null) => void;
}

type LinkingStep = 'select_bank' | 'verify_otp' | 'linked';

export const AlternativeOpenBankingSection: React.FC<AlternativeOpenBankingSectionProps> = ({
  customer,
  totalPayableNgn,
  format,
  isActiveMethod,
  onToggleActiveMethod,
  linkedAccount,
  onLinkAccount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [countryScope, setCountryScope] = useState<'local' | 'all'>('local');
  const [bankSearch, setBankSearch] = useState<string>('');
  const [selectedBankId, setSelectedBankId] = useState<string>(() => {
    const localBanks = getBanksForCountry(customer.country);
    return localBanks[0]?.id || AFRICAN_OPEN_BANKING_BANKS[0].id;
  });

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountType, setAccountType] = useState<LinkedBankAccount['accountType']>('Business Current');
  const [step, setStep] = useState<LinkingStep>(linkedAccount ? 'linked' : 'select_bank');
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupError, setLookupError] = useState<string>('');
  const [verifiedHolderName, setVerifiedHolderName] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('482910');
  const [isAuthorizingMandate, setIsAuthorizingMandate] = useState<boolean>(false);

  // Sync default bank selection when customer changes country (only if not currently linked)
  useEffect(() => {
    if (linkedAccount) return;
    const localBanks = getBanksForCountry(customer.country);
    if (localBanks.length > 0 && !localBanks.some((b) => b.id === selectedBankId)) {
      setSelectedBankId(localBanks[0].id);
      setAccountNumber('');
      setLookupError('');
    }
  }, [customer.country, linkedAccount, selectedBankId]);

  // Keep step synced if linkedAccount changes externally
  useEffect(() => {
    if (linkedAccount) {
      setStep('linked');
    } else if (step === 'linked') {
      setStep('select_bank');
    }
  }, [linkedAccount, step]);

  const availableBanks = useMemo(() => {
    const base =
      countryScope === 'local'
        ? getBanksForCountry(customer.country)
        : AFRICAN_OPEN_BANKING_BANKS;
    const query = bankSearch.trim().toLowerCase();
    if (!query) return base;
    return base.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.country.toLowerCase().includes(query) ||
        b.apiProvider.toLowerCase().includes(query) ||
        b.railName.toLowerCase().includes(query)
    );
  }, [countryScope, customer.country, bankSearch]);

  const selectedBank: AfricanOpenBankingBank = useMemo(() => {
    return (
      AFRICAN_OPEN_BANKING_BANKS.find((b) => b.id === selectedBankId) ||
      availableBanks[0] ||
      AFRICAN_OPEN_BANKING_BANKS[0]
    );
  }, [selectedBankId, availableBanks]);

  const activeSettlementBank = linkedAccount?.bank || selectedBank;

  const feeStats = useMemo(() => {
    return calculateOpenBankingSettlementFeeNgn(totalPayableNgn, activeSettlementBank);
  }, [totalPayableNgn, activeSettlementBank]);

  const handleUseDemoAccount = () => {
    setAccountNumber(selectedBank.sampleAccount);
    setLookupError('');
  };

  const handleVerifyAccountLookup = async () => {
    const cleaned = accountNumber.replace(/\s+/g, '');
    if (cleaned.length < 8 || !/^\d+$/.test(cleaned)) {
      setLookupError(
        `Enter a valid ${selectedBank.accountLength}-digit account number for ${selectedBank.name}.`
      );
      return;
    }

    setLookupError('');
    setIsLookingUp(true);
    await new Promise((r) => setTimeout(r, 550));
    setIsLookingUp(false);

    const holder =
      (customer.businessName || customer.fullName || 'MSMEBOOKS MERCHANT')
        .trim()
        .toUpperCase();
    setVerifiedHolderName(holder);
    setStep('verify_otp');
  };

  const handleAuthorizeMandate = async () => {
    if (otpCode.trim().length < 4) {
      setLookupError('Enter the 6-digit open-banking authorization token.');
      return;
    }

    setLookupError('');
    setIsAuthorizingMandate(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsAuthorizingMandate(false);

    const cleaned = accountNumber.replace(/\s+/g, '');
    const last4 = cleaned.slice(-4);
    const newLinked: LinkedBankAccount = {
      id: `ob-${selectedBank.id}-${Date.now()}`,
      bank: selectedBank,
      maskedAccountNumber: `•••• ${last4}`,
      accountHolderName: verifiedHolderName || customer.businessName.toUpperCase(),
      accountType,
      mandateId: `MND-${selectedBank.apiProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 899999)}`,
      linkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onLinkAccount(newLinked);
    onToggleActiveMethod(true);
    setStep('linked');
  };

  const handleUnlinkAccount = () => {
    onLinkAccount(null);
    onToggleActiveMethod(false);
    setStep('select_bank');
    setAccountNumber('');
    setVerifiedHolderName('');
    setLookupError('');
  };

  return (
    <section
      aria-label="Alternative Payment Method: Open-Banking Direct Settlement"
      className={`rounded-2xl border transition-colors ${
        isActiveMethod && linkedAccount
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/70 dark:border-emerald-700'
          : 'bg-slate-50 dark:bg-[#071324] border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3. Alternative Payment Method · Open-Banking Direct Debit
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Link your local African bank account via Mono, Okra, Stitch, PesaLink, or GhIPSS for direct, low-fee settlement.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {linkedAccount ? (
            <button
              type="button"
              onClick={() => onToggleActiveMethod(!isActiveMethod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                isActiveMethod
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#0A4FD5]'
              }`}
            >
              {isActiveMethod ? 'Active for Checkout' : 'Use Linked Bank'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#0A4FD5] transition-colors cursor-pointer whitespace-nowrap"
            >
              {isExpanded ? 'Collapse' : 'Link Bank Account'}
            </button>
          )}
        </div>
      </div>

      {/* Low-Fee Comparison Strip (Always Visible) */}
      <div className="px-4 sm:px-5 py-2.5 bg-white/70 dark:bg-slate-900/60 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">
            Direct Open-Banking Fee:
          </span>
          <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
            {format(feeStats.openBankingFeeNgn)} ({activeSettlementBank.feeRatePercent}% capped)
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400">
            vs. Standard Card Processing (~{format(feeStats.standardCardFeeNgn)})
          </span>
        </div>

        <div className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
          Save {format(feeStats.feeSavingsNgn)} on clearing fees
        </div>
      </div>

      {/* Interactive Linking Body */}
      {(isExpanded || linkedAccount) && (
        <div className="p-4 sm:p-5 space-y-4">
          {step === 'select_bank' && (
            <div className="space-y-4">
              {/* Filter Bar: Local Country vs Pan-African + Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setCountryScope('local')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      countryScope === 'local'
                        ? 'bg-[#0A4FD5] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {customer.country} Banks
                  </button>
                  <button
                    type="button"
                    onClick={() => setCountryScope('all')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      countryScope === 'all'
                        ? 'bg-[#0A4FD5] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    All African Banks ({AFRICAN_OPEN_BANKING_BANKS.length})
                  </button>
                </div>

                <div className="relative flex-1 sm:max-w-[230px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search bank or Mono / Stitch..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                  />
                </div>
              </div>

              {/* Selectable Open-Banking Institutions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {availableBanks.length > 0 ? (
                  availableBanks.map((bank) => {
                    const isPicked = bank.id === selectedBank.id;
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => {
                          setSelectedBankId(bank.id);
                          setLookupError('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          isPicked
                            ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#0A4FD5] dark:border-blue-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: bank.accentColor }}
                              aria-hidden="true"
                            />
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {bank.name}
                            </span>
                          </div>
                          {isPicked && (
                            <CheckCircle2 className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0" />
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {bank.apiProvider} API
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{bank.railName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums shrink-0">{bank.clearingTime}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="sm:col-span-2 p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    No banks matched "{bankSearch}". Switch to All African Banks or clear search.
                  </div>
                )}
              </div>

              {/* Account Input & Lookup Verification */}
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                    <span>Link {selectedBank.name} Account</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Powered by {selectedBank.apiProvider} · {selectedBank.currency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Account Number ({selectedBank.accountLength} digits)
                      </label>
                      <button
                        type="button"
                        onClick={handleUseDemoAccount}
                        className="text-[10px] font-semibold text-[#0A4FD5] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Use sample ({selectedBank.sampleAccount})
                      </button>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        if (lookupError) setLookupError('');
                      }}
                      placeholder={selectedBank.sampleAccount}
                      maxLength={16}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) =>
                        setAccountType(e.target.value as LinkedBankAccount['accountType'])
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5] cursor-pointer"
                    >
                      <option value="Business Current">Business Current</option>
                      <option value="Corporate Checking">Corporate Checking</option>
                      <option value="SME Savings">SME Savings</option>
                    </select>
                  </div>
                </div>

                {lookupError && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {lookupError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Read-only name enquiry & single tokenized debit mandate</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyAccountLookup}
                    disabled={isLookingUp}
                    className="px-4 py-2 min-h-[40px] rounded-xl bg-[#0A4FD5] hover:bg-[#073AA0] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {isLookingUp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying {selectedBank.apiProvider}...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Link Bank</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'verify_otp' && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Account Verified via {selectedBank.apiProvider} Name Enquiry
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {verifiedHolderName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {selectedBank.name} · •••• {accountNumber.replace(/\s+/g, '').slice(-4)} · {accountType}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('select_bank')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Bank OTP / Hardware Token to Authorize Direct Debit Mandate
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={8}
                      placeholder="6-digit OTP"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAuthorizeMandate}
                    disabled={isAuthorizingMandate}
                    className="px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isAuthorizingMandate ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Authorizing Mandate...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Authorize & Activate Bank Pay</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Demo verification token pre-filled. Authorizing sets {selectedBank.name} as your active checkout payment method.
                </p>
              </div>
            </div>
          )}

          {step === 'linked' && linkedAccount && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span>{linkedAccount.bank.name}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-mono tabular-nums">{linkedAccount.maskedAccountNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {linkedAccount.accountHolderName} · {linkedAccount.accountType}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                      Mandate {linkedAccount.mandateId} · {linkedAccount.bank.apiProvider} ({linkedAccount.bank.railName})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUnlinkAccount}
                  className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Unlink</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActiveMethod}
                    onChange={(e) => onToggleActiveMethod(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Pay this order directly via {linkedAccount.bank.name} ({linkedAccount.bank.clearingTime})
                  </span>
                </label>

                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  Clearing fee: {format(feeStats.openBankingFeeNgn)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
