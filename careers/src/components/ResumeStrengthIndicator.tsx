import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  FileText,
  TrendingUp,
  Zap,
  Award,
  ArrowRight,
  Upload,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  Plus,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { Job } from '../types/career';
import { INITIAL_JOBS } from '../data/initialJobs';

export interface ResumeStrengthDimension {
  category: string;
  score: number;
  weight: string;
  assessment: string;
  status: 'strong' | 'moderate' | 'needs_work';
}

export interface ActionableImprovement {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'Bullet Point Optimization' | 'Keyword Insertion' | 'Quantifiable Metrics' | 'Leadership & Architecture';
  title: string;
  issue: string;
  recommendation: string;
  exampleBefore?: string;
  exampleAfter?: string;
}

export interface ResumeStrengthReport {
  overallScore: number;
  scoreLabel: string;
  scoreColor: 'emerald' | 'blue' | 'amber' | 'rose';
  summaryFeedback: string;
  categoryScores: ResumeStrengthDimension[];
  matchedSkills: string[];
  missingSkills: string[];
  keyStrengths: string[];
  actionableImprovements: ActionableImprovement[];
  targetRoleKeywordsToInclude: string[];
}

interface ResumeStrengthIndicatorProps {
  candidateName: string;
  candidateSkills: string[];
  candidateYearsExp: number;
  candidateCurrentTitle?: string;
  initialTargetRole?: string;
  initialResumeSnippet?: string;
  availableJobs?: Job[];
  onSkillAdded?: (newSkill: string) => void;
}

const SAMPLE_RESUMES = [
  {
    id: 'sample-1',
    label: 'Olumide Adebayo · Senior FinTech Lead',
    fileName: 'Olumide_Adebayo_Senior_Dev_CV.pdf',
    currentTitle: 'Senior Full-Stack & FinTech Engineer',
    yearsExp: 6,
    skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Microservices', 'Distributed Systems'],
    snippet: 'Led payment microservices handling $14M monthly GMV across Pan-African hubs. Maintained 99.98% ledger uptime with Redis caching and PostgreSQL partitioning. Reduced API p99 latency by 35%.',
  },
  {
    id: 'sample-2',
    label: 'Amina Bello · Full-Stack Developer',
    fileName: 'Amina_Bello_FullStack_Resume.pdf',
    currentTitle: 'Full-Stack Developer',
    yearsExp: 4,
    skills: ['JavaScript', 'React', 'Node.js', 'Tailwind CSS', 'MySQL', 'Git', 'REST API'],
    snippet: 'Engineered user-facing portal interfaces and invoice generation workflows for MSME merchants. Integrated payment gateway webhooks and improved client bundle loading speed by 28%.',
  },
  {
    id: 'sample-3',
    label: 'Kwame Osei · DevOps & Reliability SRE',
    fileName: 'Kwame_Osei_DevOps_SRE_CV.pdf',
    currentTitle: 'Senior Cloud DevOps Engineer',
    yearsExp: 7,
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD', 'Terraform', 'PostgreSQL', 'Redis', 'Monitoring', 'Linux'],
    snippet: 'Managed containerized Kubernetes clusters across multi-region cloud infrastructures. Automated zero-downtime deployment pipelines with GitHub Actions, reducing deployment failure rate to under 0.2%.',
  },
];

export const ResumeStrengthIndicator: React.FC<ResumeStrengthIndicatorProps> = ({
  candidateName,
  candidateSkills = [],
  candidateYearsExp = 5,
  candidateCurrentTitle = 'Senior Software Engineer',
  initialTargetRole,
  initialResumeSnippet,
  availableJobs = INITIAL_JOBS,
  onSkillAdded,
}) => {
  // Target Job Selection
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    if (initialTargetRole) {
      const match = availableJobs.find(
        (j) => j.title.toLowerCase().includes(initialTargetRole.toLowerCase()) ||
               initialTargetRole.toLowerCase().includes(j.title.toLowerCase())
      );
      if (match) return match.id;
    }
    return availableJobs[0]?.id || 'job-1';
  });

  const [customTargetRole, setCustomTargetRole] = useState(initialTargetRole || '');
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Active target job details
  const targetJob = useMemo(() => {
    return availableJobs.find((j) => j.id === selectedJobId) || availableJobs[0];
  }, [selectedJobId, availableJobs]);

  const activeTargetTitle = isCustomRole && customTargetRole.trim() ? customTargetRole.trim() : (targetJob?.title || 'Senior Full-Stack Developer');
  const activeTargetDepartment = targetJob?.department || 'Software Engineering';
  const activeTargetSkills = targetJob?.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis'];
  const activeTargetMinExp = targetJob?.experienceLevel === 'Lead/Manager' || targetJob?.experienceLevel === 'Executive' ? 7 : targetJob?.experienceLevel === 'Senior' ? 5 : 3;

  // Active Resume Data (From Props, localStorage, or Sample)
  const [activeResumeFileName, setActiveResumeFileName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_parsed_resume');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fileName) return parsed.fileName;
      }
    } catch {}
    return 'Olumide_Adebayo_Senior_Dev_CV.pdf';
  });

  const [resumeSnippet, setResumeSnippet] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_parsed_resume');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.summary) return parsed.summary;
      }
    } catch {}
    return initialResumeSnippet || SAMPLE_RESUMES[0].snippet;
  });

  const [resumeSkills, setResumeSkills] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_parsed_resume');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.skills) && parsed.skills.length > 0) return parsed.skills;
      }
    } catch {}
    return candidateSkills.length > 0 ? candidateSkills : SAMPLE_RESUMES[0].skills;
  });

  const [resumeYearsExp, setResumeYearsExp] = useState<number>(candidateYearsExp || 5);
  const [currentJobTitle, setCurrentJobTitle] = useState<string>(candidateCurrentTitle || 'Senior Full-Stack Engineer');

  // Analysis State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSource, setAuditSource] = useState<'heuristic' | 'gemini-3.8-flash'>('heuristic');
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [addedSkillsList, setAddedSkillsList] = useState<string[]>([]);
  const [report, setReport] = useState<ResumeStrengthReport | null>(null);

  // Calculate Heuristic Resume Strength Report
  const calculateHeuristicReport = (
    rSkills: string[],
    rYears: number,
    rSnippet: string,
    tTitle: string,
    tSkills: string[],
    tMinExp: number
  ): ResumeStrengthReport => {
    const cleanResumeSkills = rSkills.map((s) => s.toLowerCase());
    const matched = tSkills.filter((s) => cleanResumeSkills.some((rs) => rs.includes(s.toLowerCase()) || s.toLowerCase().includes(rs)));
    const missing = tSkills.filter((s) => !cleanResumeSkills.some((rs) => rs.includes(s.toLowerCase()) || s.toLowerCase().includes(rs)));

    // 1. Technical Competencies Score (0 - 100)
    const techRatio = tSkills.length > 0 ? matched.length / tSkills.length : 0.8;
    const techScore = Math.min(Math.round(techRatio * 90 + (rSkills.length >= 8 ? 10 : 5)), 98);

    // 2. Experience Fit Score (0 - 100)
    let expScore = 75;
    if (rYears >= tMinExp) {
      expScore = Math.min(88 + (rYears - tMinExp) * 3, 98);
    } else {
      expScore = Math.max(50 + (rYears / tMinExp) * 30, 45);
    }

    // 3. ATS Keyword Density Score (0 - 100)
    const domainKeywords = ['distributed', 'microservices', 'ledger', 'high-throughput', 'latency', 'api', 'architecture', 'fintech', 'pos', 'accounting', 'security', 'scalability', 'ci/cd', 'database'];
    const snippetLower = rSnippet.toLowerCase();
    const matchedKeywords = domainKeywords.filter((k) => snippetLower.includes(k) || cleanResumeSkills.some((s) => s.includes(k)));
    const atsScore = Math.min(Math.round(55 + (matchedKeywords.length / domainKeywords.length) * 45), 96);

    // 4. Quantifiable Impact Score (0 - 100)
    const hasNumbers = /\d+%|\$\d+|\d+\s*M|\d+\s*k|\d+\+?\s*years/i.test(rSnippet);
    const hasActionVerbs = /architected|engineered|spearheaded|optimized|reduced|scaled|delivered|accelerated/i.test(rSnippet);
    let impactScore = 65;
    if (hasNumbers && hasActionVerbs) impactScore = 92;
    else if (hasNumbers || hasActionVerbs) impactScore = 78;

    // Weighted Overall Score
    const overallScore = Math.round(
      techScore * 0.35 +
      expScore * 0.25 +
      atsScore * 0.20 +
      impactScore * 0.20
    );

    let scoreLabel = 'Exceptional Match';
    let scoreColor: 'emerald' | 'blue' | 'amber' | 'rose' = 'emerald';

    if (overallScore >= 85) {
      scoreLabel = 'Exceptional Match';
      scoreColor = 'emerald';
    } else if (overallScore >= 72) {
      scoreLabel = 'Strong Contender';
      scoreColor = 'blue';
    } else if (overallScore >= 55) {
      scoreLabel = 'Good Potential';
      scoreColor = 'amber';
    } else {
      scoreLabel = 'Needs Strategic Optimization';
      scoreColor = 'rose';
    }

    const categoryScores: ResumeStrengthDimension[] = [
      {
        category: 'Core Technical Competencies',
        score: techScore,
        weight: '35%',
        assessment: `${matched.length} of ${tSkills.length} required stack technologies explicitly verified in resume.`,
        status: techScore >= 80 ? 'strong' : techScore >= 65 ? 'moderate' : 'needs_work',
      },
      {
        category: 'Seniority & Experience Fit',
        score: expScore,
        weight: '25%',
        assessment: `${rYears} years verified career depth aligns cleanly with ${tTitle} (${tMinExp}+ years expected).`,
        status: expScore >= 80 ? 'strong' : expScore >= 65 ? 'moderate' : 'needs_work',
      },
      {
        category: 'ATS Keyword & Semantic Density',
        score: atsScore,
        weight: '20%',
        assessment: `Strong presence of African FinTech, ledger infrastructure, and high-concurrency keywords.`,
        status: atsScore >= 80 ? 'strong' : atsScore >= 65 ? 'moderate' : 'needs_work',
      },
      {
        category: 'Quantifiable Deliverables & Impact',
        score: impactScore,
        weight: '20%',
        assessment: hasNumbers
          ? 'Quantified metrics ($ volume, % latency reduction, uptime SLA) stand out strongly to recruiters.'
          : 'Consider framing achievements with quantifiable numbers (e.g., % latency drop or volume processed).',
        status: impactScore >= 80 ? 'strong' : impactScore >= 65 ? 'moderate' : 'needs_work',
      },
    ];

    const actionableImprovements: ActionableImprovement[] = [
      {
        id: 'imp-1',
        priority: 'high',
        category: 'Bullet Point Optimization',
        title: 'Upgrade Generic Work Deliverables to Google X-Y-Z Format',
        issue: 'Recruiters scan for quantifiable impact (Accomplished [X] as measured by [Y] by doing [Z]).',
        recommendation: 'Replace generic maintenance descriptions with specific transaction volume, uptime, and latency benchmarks.',
        exampleBefore: 'Built backend APIs for invoices and helped maintain microservices in Node.js.',
        exampleAfter: 'Architected high-throughput ledger microservices handling $14M+ monthly GMV across 4 countries with 99.98% uptime, reducing p99 latency by 35% with Redis caching.',
      },
      {
        id: 'imp-2',
        priority: missing.length > 0 ? 'high' : 'medium',
        category: 'Keyword Insertion',
        title: missing.length > 0
          ? `Add Missing Target Competencies: ${missing.slice(0, 2).join(' & ')}`
          : 'Highlight Distributed Systems & Event-Driven Patterns',
        issue: missing.length > 0
          ? `The target role specifically prioritizes ${missing.join(', ')}, which are not prominent on your resume.`
          : 'High-frequency recruiter search filters prioritize asynchronous message broker terms.',
        recommendation: `Incorporate projects, certifications, or past work experience utilizing ${missing.length > 0 ? missing.join(', ') : 'Redis, Kafka, and Database Indexing'}.`,
        exampleBefore: 'Worked with databases and application data stores.',
        exampleAfter: 'Engineered PostgreSQL partitioned query strategies and Redis caching layers, scaling double-entry ledger reconciliations to 4,500 req/sec.',
      },
      {
        id: 'imp-3',
        priority: 'medium',
        category: 'Quantifiable Metrics',
        title: 'Highlight Pan-African Multi-Country Scale & Currency Rails',
        issue: 'MsmeBooks and tech scaleups prioritize experience handling multi-currency and cross-border edge cases.',
        recommendation: 'Specify African payment rails (e.g., NGN, KES, GHS, RWF) and low-bandwidth POS synchronization experience in your executive summary.',
        exampleBefore: 'Integrated payment gateways and handled foreign currencies.',
        exampleAfter: 'Integrated multi-currency payment rails across 5 African territories with automated fx re-balancing and zero ledger reconciliation drift.',
      },
    ];

    return {
      overallScore,
      scoreLabel,
      scoreColor,
      summaryFeedback: overallScore >= 80
        ? `Your resume is in the top tier for ${tTitle}. High technical alignment with strong signal on real-world system resilience.`
        : `Strong baseline profile for ${tTitle}. Bridging the highlighted skill gaps and adding quantifiable metrics will maximize interview invitation rates.`,
      categoryScores,
      matchedSkills: matched,
      missingSkills: missing,
      keyStrengths: [
        `${rYears}+ years of hands-on production engineering in modern stacks`,
        `Demonstrated experience in high-volume web systems & transactional data`,
        `Direct relevance to MsmeBooks core ERP and fintech ledger objectives`,
      ],
      actionableImprovements,
      targetRoleKeywordsToInclude: [
        'Distributed Ledgers',
        'Offline-First POS',
        'PostgreSQL Query Optimization',
        'Idempotency & Reconciliations',
        'Event-Driven Microservices',
        'CI/CD Pipelines',
      ],
    };
  };

  // Recalculate whenever target job or resume inputs change
  useEffect(() => {
    const newReport = calculateHeuristicReport(
      resumeSkills,
      resumeYearsExp,
      resumeSnippet,
      activeTargetTitle,
      activeTargetSkills,
      activeTargetMinExp
    );
    setReport(newReport);
  }, [
    resumeSkills,
    resumeYearsExp,
    resumeSnippet,
    activeTargetTitle,
    activeTargetSkills,
    activeTargetMinExp,
  ]);

  // Deep AI Audit via Gemini endpoint
  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/analyze-resume-strength', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: activeTargetTitle,
          targetDepartment: activeTargetDepartment,
          targetExperienceLevel: targetJob?.experienceLevel || 'Senior',
          targetSkills: activeTargetSkills,
          resumeData: {
            fileName: activeResumeFileName,
            fullName: candidateName,
            yearsOfExperience: resumeYearsExp,
            currentJobTitle,
            skills: resumeSkills,
            summary: resumeSnippet,
            experienceSnippet: resumeSnippet,
          },
        }),
      });

      if (!response.ok) throw new Error('API audit failed');
      const json = await response.json();
      if (json.success && json.data) {
        setReport({
          ...json.data,
          scoreColor:
            json.data.overallScore >= 85
              ? 'emerald'
              : json.data.overallScore >= 72
              ? 'blue'
              : json.data.overallScore >= 55
              ? 'amber'
              : 'rose',
        });
        setAuditSource('gemini-3.8-flash');
      }
    } catch (err) {
      console.warn('Falling back to local heuristic audit engine:', err);
      // Fallback calculation
      const fb = calculateHeuristicReport(
        resumeSkills,
        resumeYearsExp,
        resumeSnippet,
        activeTargetTitle,
        activeTargetSkills,
        activeTargetMinExp
      );
      setReport(fb);
      setAuditSource('heuristic');
    } finally {
      setIsAuditing(false);
    }
  };

  // Switch sample resumes
  const handleSelectSampleResume = (sample: typeof SAMPLE_RESUMES[0]) => {
    setActiveResumeFileName(sample.fileName);
    setCurrentJobTitle(sample.currentTitle);
    setResumeYearsExp(sample.yearsExp);
    setResumeSkills(sample.skills);
    setResumeSnippet(sample.snippet);
  };

  // Add missing skill to profile
  const handleAddMissingSkill = (skill: string) => {
    if (!resumeSkills.includes(skill)) {
      const updated = [...resumeSkills, skill];
      setResumeSkills(updated);
      setAddedSkillsList((prev) => [...prev, skill]);
      if (onSkillAdded) onSkillAdded(skill);
      try {
        const stored = localStorage.getItem('msmebooks_parsed_resume');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.skills = updated;
          localStorage.setItem('msmebooks_parsed_resume', JSON.stringify(parsed));
          window.dispatchEvent(new Event('msmebooks_resume_updated'));
        }
      } catch {}
    }
  };

  // Copy bullet point helper
  const handleCopyBullet = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedBulletId(id);
    setTimeout(() => setCopiedBulletId(null), 2500);
  };

  // SVG Gauge calculations
  const score = report?.overallScore || 82;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header & Controls Bar */}
      <div className="p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white dark:from-slate-900/80 dark:via-[#131D35] dark:to-[#0D1527] rounded-2xl border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066CC] dark:bg-[#38BDF8] text-white dark:text-[#0B132B] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#14243A] dark:text-white tracking-tight">
                  Resume Match & Strength Analyzer
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wide">
                  ATS & Job Match Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates your active resume data against specific job profile requirements with targeted improvement recommendations.
              </p>
            </div>
          </div>

          {/* AI Audit Action */}
          <button
            type="button"
            disabled={isAuditing}
            onClick={handleRunAiAudit}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-[#0066CC] hover:from-indigo-700 hover:to-[#0052A3] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-center"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing with Gemini 3.8...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
                <span>Deep AI Resume Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Configuration Row: Select Target Role & Resume Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-800 text-xs">
          {/* Target Role Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Target Job Profile to Match:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomRole(!isCustomRole)}
                className="text-[10px] font-semibold text-[#0066CC] dark:text-[#38BDF8] hover:underline"
              >
                {isCustomRole ? 'Choose from Open Jobs' : '+ Custom Role Title'}
              </button>
            </label>

            {isCustomRole ? (
              <input
                type="text"
                value={customTargetRole}
                onChange={(e) => setCustomTargetRole(e.target.value)}
                placeholder="e.g. Lead Distributed Systems Engineer"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A284A] text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A284A] text-slate-900 dark:text-white outline-none focus:border-[#0066CC] font-semibold"
              >
                {availableJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.department} · {j.experienceLevel})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Active Resume / Quick Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Active Resume Document:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {activeResumeFileName}
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              <select
                onChange={(e) => {
                  const s = SAMPLE_RESUMES.find((item) => item.id === e.target.value);
                  if (s) handleSelectSampleResume(s);
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A284A] text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Sample Candidate Resume...
                </option>
                {SAMPLE_RESUMES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Strength Indicator Main Grid */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Radial Strength Score Card */}
          <div className="lg:col-span-5 p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-[#0066CC] to-purple-600" />

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                Overall Resume Match Score
              </span>

              {/* Circular SVG Gauge */}
              <div className="relative w-36 h-36 mx-auto my-1 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className={`transition-all duration-1000 ease-out ${
                      report.scoreColor === 'emerald'
                        ? 'stroke-emerald-500'
                        : report.scoreColor === 'blue'
                        ? 'stroke-[#0066CC] dark:stroke-[#38BDF8]'
                        : report.scoreColor === 'amber'
                        ? 'stroke-amber-500'
                        : 'stroke-rose-500'
                    }`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {report.overallScore}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Match Index
                  </span>
                </div>
              </div>

              {/* Qualitative Status Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs">
                {report.scoreColor === 'emerald' && (
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800">
                    🏆 {report.scoreLabel}
                  </span>
                )}
                {report.scoreColor === 'blue' && (
                  <span className="text-[#0066CC] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800">
                    ⚡ {report.scoreLabel}
                  </span>
                )}
                {report.scoreColor === 'amber' && (
                  <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800">
                    ⚠️ {report.scoreLabel}
                  </span>
                )}
                {report.scoreColor === 'rose' && (
                  <span className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800">
                    🛠️ {report.scoreLabel}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-3 px-2 leading-relaxed">
                {report.summaryFeedback}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Audited against:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                {activeTargetTitle}
              </span>
            </div>
          </div>

          {/* Dimension Breakdown Meters */}
          <div className="lg:col-span-7 p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>4-Pillar Evaluation Dimensions</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Weighted Breakdown</span>
            </div>

            <div className="space-y-3.5">
              {report.categoryScores.map((dim, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{dim.category}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({dim.weight})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {dim.score}%
                    </span>
                  </div>

                  {/* Progress Bar Meter */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        dim.score >= 85
                          ? 'bg-emerald-500'
                          : dim.score >= 70
                          ? 'bg-[#0066CC] dark:bg-[#38BDF8]'
                          : dim.score >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {dim.assessment}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Skills Summary Chips */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Stack Match: <strong className="text-emerald-600 dark:text-emerald-400">{report.matchedSkills.length} Matched</strong> · <strong className="text-amber-600 dark:text-amber-400">{report.missingSkills.length} Gaps</strong>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Engine: {auditSource}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Matched vs. Missing Skills Section */}
      {report && (
        <div className="p-4 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Skills Comparison vs. {activeTargetTitle}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">Click missing skill to add to your profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Matched Skills */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Matched Competencies ({report.matchedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.matchedSkills.length > 0 ? (
                  report.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-[#131D35] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{sk}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs italic">No direct keyword overlap found.</span>
                )}
              </div>
            </div>

            {/* Missing Skills with 1-click Add */}
            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Target Role Gaps ({report.missingSkills.length})</span>
                </span>
                <span className="text-[10px] font-normal text-amber-700/80">Recruiter Priorities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.missingSkills.length > 0 ? (
                  report.missingSkills.map((sk) => {
                    const isAdded = addedSkillsList.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleAddMissingSkill(sk)}
                        title="Click to add this verified skill to your candidate profile"
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-white dark:bg-[#131D35] text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-400'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{sk} (Added)</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-amber-600" />
                            <span>{sk}</span>
                          </>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    🎉 Outstanding! All primary target stack requirements are satisfied.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Improvement Suggestions */}
      {report && report.actionableImprovements.length > 0 && (
        <div className="p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Actionable Resume Enhancements for {activeTargetTitle}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Implement these tailored suggestions to pass recruiter ATS filters and demonstrate executive impact.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
              {report.actionableImprovements.length} Recommendations
            </span>
          </div>

          <div className="space-y-3.5">
            {report.actionableImprovements.map((imp) => (
              <div
                key={imp.id}
                className="p-3.5 bg-slate-50/80 dark:bg-[#131D35]/70 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        imp.priority === 'high'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {imp.priority} priority
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {imp.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {imp.category}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {imp.recommendation}
                </p>

                {/* Before vs. After Bullet Point Rewriter */}
                {imp.exampleBefore && imp.exampleAfter && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 bg-white dark:bg-[#0D1527] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Original / Generic Draft:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        "{imp.exampleBefore}"
                      </p>
                    </div>

                    <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 space-y-1 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>ATS & Metric Optimized (Google X-Y-Z):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(imp.id, imp.exampleAfter)}
                          className="px-2 py-0.5 rounded bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 text-[10px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-2xs"
                        >
                          {copiedBulletId === imp.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Bullet</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        "{imp.exampleAfter}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* High-frequency keywords to include */}
          {report.targetRoleKeywordsToInclude && report.targetRoleKeywordsToInclude.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Recommended ATS Keywords to weave into your CV summary & projects:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.targetRoleKeywordsToInclude.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-[11px] font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
