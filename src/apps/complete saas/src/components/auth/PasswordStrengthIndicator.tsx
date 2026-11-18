import React, { useMemo } from 'react';
import { Check, ShieldAlert, ShieldCheck, Sparkles, Cpu, Clock, HelpCircle } from 'lucide-react';

export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

export type EntropyTier = 'weak' | 'medium' | 'strong' | 'enterprise';
export type EntropyColor = 'red' | 'yellow' | 'green';

export interface PasswordStrengthResult {
  entropyBits: number; // Calculated Shannon/Information entropy in bits
  poolSize: number; // Character pool size (e.g. 26, 52, 62, 95)
  score: number; // 0 to 4
  percentage: number; // 0 to 100% normalized to 100 bits
  tier: EntropyTier;
  color: EntropyColor;
  label: string;
  colorClass: string; // Tailwind background for progress bar
  bgClass: string; // Tailwind card background
  textClass: string; // Tailwind text color
  borderClass: string; // Tailwind border color
  badgeBgClass: string; // Tailwind badge background
  hint: string;
  crackTime: string;
  rules: PasswordRule[];
}

/**
 * Calculates mathematical information entropy (in bits) of a password string.
 *
 * Formula:
 * 1. Base pool size R determined by character set combinations (lowercase: 26, uppercase: 26, digits: 10, symbols: 33).
 * 2. Raw Hartley entropy: E_raw = length * log2(poolSize)
 * 3. Shannon character distribution entropy to account for character variety:
 *    H = - sum(p_i * log2(p_i))
 * 4. Deductions applied for sequential patterns, repeated characters, and common dictionary sequences.
 */
export function evaluatePasswordEntropy(password: string = ''): PasswordStrengthResult {
  const pwd = password || '';
  const length = pwd.length;

  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const hasLength8 = length >= 8;
  const hasLength12 = length >= 12;

  const rules: PasswordRule[] = [
    { id: 'length', label: '8+ characters', met: hasLength8 },
    { id: 'upper', label: 'Uppercase letter (A–Z)', met: hasUpper },
    { id: 'lower', label: 'Lowercase letter (a–z)', met: hasLower },
    { id: 'number', label: 'Number (0–9)', met: hasNumber },
    { id: 'symbol', label: 'Special symbol (!@#$%^&*)', met: hasSymbol },
  ];

  if (!pwd) {
    return {
      entropyBits: 0,
      poolSize: 0,
      score: 0,
      percentage: 0,
      tier: 'weak',
      color: 'red',
      label: 'Enter password',
      colorClass: 'bg-slate-300 dark:bg-slate-700',
      bgClass: 'bg-slate-50 dark:bg-slate-800/40',
      textClass: 'text-slate-400 dark:text-slate-500',
      borderClass: 'border-slate-200 dark:border-slate-700',
      badgeBgClass: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
      hint: 'Include uppercase, lowercase, numbers, and symbols to maximize entropy.',
      crackTime: 'Instant',
      rules,
    };
  }

  // Calculate character pool size (R)
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 33;
  if (poolSize === 0) poolSize = 26;

  // Base raw entropy = length * log2(poolSize)
  const rawEntropy = length * Math.log2(poolSize);

  // Shannon entropy based on character frequencies
  const charFrequencies: Record<string, number> = {};
  for (const char of pwd) {
    charFrequencies[char] = (charFrequencies[char] || 0) + 1;
  }

  let shannonH = 0;
  for (const char in charFrequencies) {
    const p = charFrequencies[char] / length;
    shannonH -= p * Math.log2(p);
  }
  const shannonBits = length * shannonH;

  // Combine raw entropy and Shannon entropy (weighted blend)
  let baseEntropy = Math.min(rawEntropy, shannonBits * 1.15);

  // Apply deductions for common weaknesses
  let deductions = 0;

  // Penalty for repetitive consecutive characters (e.g. "aaa", "111")
  const repeatMatches = pwd.match(/(.)\1+/g);
  if (repeatMatches) {
    repeatMatches.forEach((m) => {
      deductions += (m.length - 1) * 3;
    });
  }

  // Penalty for common sequential sequences (e.g. "123", "abc", "qwerty")
  const lowercasePwd = pwd.toLowerCase();
  const commonSequences = [
    '12345',
    '1234',
    '123',
    'abc',
    'abcd',
    'password',
    'qwerty',
    'admin',
    'welcome',
    'login',
  ];
  commonSequences.forEach((seq) => {
    if (lowercasePwd.includes(seq)) {
      deductions += seq.length * 2.5;
    }
  });

  // Minimum length penalty
  if (length < 8) {
    deductions += (8 - length) * 6;
  }

  // Effective entropy calculation
  const finalEntropy = Math.max(8, Math.round(baseEntropy - deductions));

  // Percentage scaled up to 100 bits (100 bits = practically unbreakable)
  const percentage = Math.min(100, Math.round((finalEntropy / 95) * 100));

  // Determine Tier and Red/Yellow/Green Feedback:
  // RED: Weak (< 40 bits)
  // YELLOW: Medium/Moderate (40 - 64 bits)
  // GREEN: Strong (65 - 84 bits)
  // GREEN (Vibrant): Enterprise Grade (>= 85 bits)
  if (finalEntropy < 40) {
    return {
      entropyBits: finalEntropy,
      poolSize,
      score: 1,
      percentage: Math.max(15, percentage),
      tier: 'weak',
      color: 'red',
      label: 'Weak',
      colorClass: 'bg-red-500',
      bgClass: 'bg-red-50/70 dark:bg-red-950/20',
      textClass: 'text-red-600 dark:text-red-400',
      borderClass: 'border-red-200 dark:border-red-900/40',
      badgeBgClass: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
      hint: length < 8
        ? 'Extend password to at least 8 characters to meet baseline entropy.'
        : 'Mix uppercase, numbers, and symbols to resist dictionary attacks.',
      crackTime: '< 3 minutes (Brute-force)',
      rules,
    };
  }

  if (finalEntropy < 65) {
    return {
      entropyBits: finalEntropy,
      poolSize,
      score: 2,
      percentage,
      tier: 'medium',
      color: 'yellow',
      label: 'Moderate',
      colorClass: 'bg-amber-400 dark:bg-yellow-400',
      bgClass: 'bg-amber-50/70 dark:bg-amber-950/20',
      textClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-200 dark:border-amber-900/40',
      badgeBgClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      hint: !hasSymbol
        ? 'Add a special symbol (@, #, $, %) to elevate to Strong tier.'
        : 'Extend length to 12+ characters to achieve enterprise-grade security.',
      crackTime: '~45 days (Modern GPU cluster)',
      rules,
    };
  }

  if (finalEntropy < 85) {
    return {
      entropyBits: finalEntropy,
      poolSize,
      score: 3,
      percentage,
      tier: 'strong',
      color: 'green',
      label: 'Strong',
      colorClass: 'bg-[#84CC16]',
      bgClass: 'bg-lime-50/70 dark:bg-lime-950/20',
      textClass: 'text-[#65A30D] dark:text-[#9AE61C]',
      borderClass: 'border-lime-200 dark:border-lime-900/40',
      badgeBgClass: 'bg-lime-100 dark:bg-lime-950/60 text-[#4d7c0f] dark:text-[#9AE61C] border border-lime-200 dark:border-lime-800',
      hint: hasLength12
        ? 'Excellent entropy. High defense against offline dictionary tables.'
        : 'Tip: Adding 2 more characters achieves Enterprise Grade status.',
      crackTime: '~1,200 years (Enterprise cluster)',
      rules,
    };
  }

  // Enterprise Grade (>= 85 bits)
  return {
    entropyBits: finalEntropy,
    poolSize,
    score: 4,
    percentage: 100,
    tier: 'enterprise',
    color: 'green',
    label: 'Enterprise Grade',
    colorClass: 'bg-[#65A30D] dark:bg-[#84CC16]',
    bgClass: 'bg-emerald-50/80 dark:bg-emerald-950/25',
    textClass: 'text-[#4d7c0f] dark:text-[#84CC16]',
    borderClass: 'border-emerald-200 dark:border-emerald-900/40',
    badgeBgClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#84CC16] border border-emerald-200 dark:border-emerald-800',
    hint: 'Maximum cryptographic entropy. Fully resistant to high-performance brute force.',
    crackTime: '> 100,000 years (Quantum resistant)',
    rules,
  };
}

// Alias for backwards compatibility
export const evaluatePasswordStrength = evaluatePasswordEntropy;

interface PasswordStrengthIndicatorProps {
  password?: string;
  className?: string;
  showRulesList?: boolean;
  showEntropyDetails?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
  className = '',
  showRulesList = true,
  showEntropyDetails = true,
}) => {
  const result = useMemo(() => evaluatePasswordEntropy(password), [password]);

  if (!password) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border p-3.5 transition-all duration-300 text-left ${result.bgClass} ${result.borderClass} ${className}`}
      aria-live="polite"
    >
      {/* Header: Status, Red/Yellow/Green Tag, & Entropy Bits */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {result.color === 'green' ? (
            <ShieldCheck className={`w-4 h-4 ${result.textClass}`} />
          ) : result.color === 'yellow' ? (
            <Sparkles className={`w-4 h-4 ${result.textClass}`} />
          ) : (
            <ShieldAlert className={`w-4 h-4 ${result.textClass}`} />
          )}

          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
            Password Strength:
          </span>

          {/* Color-Coded Label (Red / Yellow / Green) */}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${result.badgeBgClass}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                result.color === 'red'
                  ? 'bg-red-500'
                  : result.color === 'yellow'
                  ? 'bg-amber-400'
                  : 'bg-[#84CC16]'
              }`}
            />
            {result.label}
          </span>
        </div>

        {/* Entropy Bits Counter Badge */}
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
          <Cpu className="w-3 h-3 text-[#0F4C81] dark:text-[#9AE61C]" />
          <span>{result.entropyBits} bits</span>
        </div>
      </div>

      {/* Real-time Color-Coded Entropy Progress Bar (Red / Yellow / Green) */}
      <div className="space-y-1 mb-2.5">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-300 rounded-full ${result.colorClass}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>

        {/* Entropy Tiers Legend */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-0.5">
          <span className={result.color === 'red' ? 'font-bold text-red-500' : ''}>
            Weak (&lt;40b)
          </span>
          <span className={result.color === 'yellow' ? 'font-bold text-amber-500' : ''}>
            Moderate (40-64b)
          </span>
          <span className={result.color === 'green' ? 'font-bold text-[#65A30D] dark:text-[#9AE61C]' : ''}>
            Strong (65b+)
          </span>
        </div>
      </div>

      {/* Contextual Hint & Crack Time Estimate */}
      <div className="space-y-1.5 mb-2.5">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
          {result.hint}
        </p>

        {showEntropyDetails && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
            <Clock className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C] flex-shrink-0" />
            <span>
              Estimated cracking resistance:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {result.crackTime}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Real-time Checklist of Complexity Rules */}
      {showRulesList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50">
          {result.rules.map((rule) => (
            <div
              key={rule.id}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                rule.met
                  ? 'text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  rule.met
                    ? 'bg-[#84CC16] text-[#072644]'
                    : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                }`}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{rule.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
