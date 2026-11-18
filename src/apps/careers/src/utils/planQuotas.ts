// Utility to manage and track:
// 1. Employer Free 1 Job Weekly Post and monthly posting credits
// 2. Candidate / Job Seeker Free 10 Job Applications Monthly & Paid Plans (Career Plus, Career Pro, Executive VIP)

export interface EmployerWeeklyPostInfo {
  isAvailable: boolean;
  lastPostDate: string | null;
  daysUntilNext: number;
  formattedResetDate: string | null;
}

export interface CandidateQuotaInfo {
  planId: 'free' | 'candidate-career-plus' | 'candidate-career-pro' | 'candidate-executive-vip';
  planName: string;
  monthlyLimit: number | 'unlimited';
  usedThisMonth: number;
  remainingThisMonth: number | 'unlimited';
  canApply: boolean;
  currentMonthKey: string;
}

const EMPLOYER_WEEKLY_KEY = 'msmebooks_employer_weekly_post';
const CANDIDATE_PLAN_KEY = 'msmebooks_candidate_plan_quota';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Returns the current year-month key (e.g. "2026-10")
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * -------------------------------------------------------------
 * EMPLOYER: Free One Job Weekly Post Status
 * -------------------------------------------------------------
 */
export const getEmployerWeeklyPostStatus = (): EmployerWeeklyPostInfo => {
  try {
    const raw = localStorage.getItem(EMPLOYER_WEEKLY_KEY);
    if (!raw) {
      return {
        isAvailable: true,
        lastPostDate: null,
        daysUntilNext: 0,
        formattedResetDate: null,
      };
    }

    const data = JSON.parse(raw);
    const lastTimestamp = data.lastWeeklyPostAt ? new Date(data.lastWeeklyPostAt).getTime() : 0;
    const now = Date.now();
    const elapsed = now - lastTimestamp;

    if (elapsed >= SEVEN_DAYS_MS || lastTimestamp === 0) {
      return {
        isAvailable: true,
        lastPostDate: data.lastWeeklyPostAt || null,
        daysUntilNext: 0,
        formattedResetDate: null,
      };
    }

    const remainingMs = SEVEN_DAYS_MS - elapsed;
    const daysUntilNext = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    const nextAvailableDate = new Date(lastTimestamp + SEVEN_DAYS_MS);

    return {
      isAvailable: false,
      lastPostDate: data.lastWeeklyPostAt,
      daysUntilNext: Math.max(1, daysUntilNext),
      formattedResetDate: nextAvailableDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    };
  } catch (e) {
    console.error('Failed to read employer weekly post status:', e);
    return {
      isAvailable: true,
      lastPostDate: null,
      daysUntilNext: 0,
      formattedResetDate: null,
    };
  }
};

/**
 * Records that an employer just posted using their free weekly post slot
 */
export const recordEmployerWeeklyPost = (): void => {
  try {
    const existing = JSON.parse(localStorage.getItem(EMPLOYER_WEEKLY_KEY) || '{}');
    existing.lastWeeklyPostAt = new Date().toISOString();
    localStorage.setItem(EMPLOYER_WEEKLY_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to record employer weekly post:', e);
  }
};

/**
 * -------------------------------------------------------------
 * CANDIDATE: Monthly Job Application Quota & Paid Plans
 * Free: 10 applications monthly
 * Career Plus: 30 applications monthly
 * Career Pro: 100 applications monthly
 * Executive VIP: Unlimited applications monthly
 * -------------------------------------------------------------
 */
export const getCandidateApplicationQuota = (): CandidateQuotaInfo => {
  const monthKey = getCurrentMonthKey();
  try {
    const raw = localStorage.getItem(CANDIDATE_PLAN_KEY);
    let state = raw ? JSON.parse(raw) : null;

    if (!state) {
      state = {
        planId: 'free',
        planName: 'Free Job Seeker',
        monthlyLimit: 10,
        monthUsage: {},
      };
    }

    // Determine limit based on current plan
    let monthlyLimit: number | 'unlimited' = 10;
    let planName = 'Free Job Seeker';

    switch (state.planId) {
      case 'candidate-career-plus':
        monthlyLimit = 30;
        planName = 'Career Plus';
        break;
      case 'candidate-career-pro':
        monthlyLimit = 100;
        planName = 'Career Pro';
        break;
      case 'candidate-executive-vip':
        monthlyLimit = 'unlimited';
        planName = 'Executive VIP';
        break;
      case 'free':
      default:
        monthlyLimit = 10;
        planName = 'Free Job Seeker';
        break;
    }

    const monthUsage = state.monthUsage || {};
    const usedThisMonth = Number(monthUsage[monthKey]) || 0;

    const canApply = monthlyLimit === 'unlimited' ? true : usedThisMonth < monthlyLimit;
    const remainingThisMonth =
      monthlyLimit === 'unlimited' ? 'unlimited' : Math.max(0, monthlyLimit - usedThisMonth);

    return {
      planId: state.planId || 'free',
      planName,
      monthlyLimit,
      usedThisMonth,
      remainingThisMonth,
      canApply,
      currentMonthKey: monthKey,
    };
  } catch (e) {
    console.error('Failed to read candidate application quota:', e);
    return {
      planId: 'free',
      planName: 'Free Job Seeker',
      monthlyLimit: 10,
      usedThisMonth: 0,
      remainingThisMonth: 10,
      canApply: true,
      currentMonthKey: monthKey,
    };
  }
};

/**
 * Increments the candidate's application count for the current month
 */
export const recordCandidateApplication = (): CandidateQuotaInfo => {
  const monthKey = getCurrentMonthKey();
  try {
    const raw = localStorage.getItem(CANDIDATE_PLAN_KEY);
    const state = raw ? JSON.parse(raw) : { planId: 'free', monthUsage: {} };

    if (!state.monthUsage) state.monthUsage = {};
    const currentCount = Number(state.monthUsage[monthKey]) || 0;
    state.monthUsage[monthKey] = currentCount + 1;

    localStorage.setItem(CANDIDATE_PLAN_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to record candidate application:', e);
  }

  return getCandidateApplicationQuota();
};

/**
 * Sets or updates candidate plan (Career Plus, Career Pro, Executive VIP)
 */
export const setCandidatePlan = (
  planId: 'free' | 'candidate-career-plus' | 'candidate-career-pro' | 'candidate-executive-vip',
  planName: string,
  monthlyLimit: number | 'unlimited'
): CandidateQuotaInfo => {
  try {
    const raw = localStorage.getItem(CANDIDATE_PLAN_KEY);
    const state = raw ? JSON.parse(raw) : { monthUsage: {} };
    state.planId = planId;
    state.planName = planName;
    state.monthlyLimit = monthlyLimit;
    state.upgradedAt = new Date().toISOString();

    localStorage.setItem(CANDIDATE_PLAN_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to set candidate plan:', e);
  }

  return getCandidateApplicationQuota();
};
