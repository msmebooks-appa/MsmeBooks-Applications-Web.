import React, { useState, useEffect, useMemo } from 'react';
import { Job } from '../types/career';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  Plus,
  X,
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Award,
  Clock,
  Lightbulb,
  Code2,
  ChevronRight,
  TrendingUp,
  Layers,
  FileText,
  User,
} from 'lucide-react';

export interface RecommendedCourse {
  skill: string;
  courseTitle: string;
  provider: string;
  duration: string;
  cost: string;
  certificateType: string;
  url: string;
  description: string;
  whyItBridgesGap: string;
  syllabusHighlights?: string[];
}

export interface SkillsGapAnalysisData {
  matchScore: number;
  matchVerdict: string;
  overallAssessment: string;
  matchedSkills: string[];
  gapSkills: string[];
  recommendedCourses: RecommendedCourse[];
  interviewTalkingPoints: string[];
  portfolioProjectIdea?: string;
  estimatedWeeksToBridge?: number;
}

interface SkillsGapAnalysisSectionProps {
  jobs: Job[];
  initialSelectedJobId?: string;
  onSelectJobForDetails?: (job: Job) => void;
  onSelectJobForApply?: (job: Job) => void;
}

const PRESET_RESUMES = [
  {
    name: 'Olumide (Senior Backend)',
    role: 'Senior Backend Engineer',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'System Architecture'],
    experienceYears: 6,
  },
  {
    name: 'Amina (Lead Product Mgr)',
    role: 'Lead Product Manager',
    skills: ['Product Strategy', 'Agile', 'User Research', 'FinTech', 'SQL'],
    experienceYears: 8,
  },
  {
    name: 'David (Frontend / React Dev)',
    role: 'Frontend Engineer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'REST APIs'],
    experienceYears: 4,
  },
  {
    name: 'Zainab (Cloud & DevOps)',
    role: 'DevOps / Cloud Engineer',
    skills: ['AWS', 'Docker', 'Linux', 'Python', 'CI/CD Pipelines'],
    experienceYears: 5,
  },
];

export const SkillsGapAnalysisSection: React.FC<SkillsGapAnalysisSectionProps> = ({
  jobs,
  initialSelectedJobId,
  onSelectJobForDetails,
  onSelectJobForApply,
}) => {
  const { user } = useAuth();

  // 1. Job Selection
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    if (initialSelectedJobId) return initialSelectedJobId;
    return jobs[0]?.id || '';
  });

  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Filter jobs
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchDept = departmentFilter === 'All' || j.department === departmentFilter;
      const matchSearch =
        !jobSearchTerm.trim() ||
        j.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        j.company?.name?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        j.skills?.some((s) => s.toLowerCase().includes(jobSearchTerm.toLowerCase()));
      return matchDept && matchSearch;
    });
  }, [jobs, departmentFilter, jobSearchTerm]);

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  // 2. Candidate Resume / Skills State
  const [candidateSkills, setCandidateSkills] = useState<string[]>(() => {
    if (user?.roleData?.role === 'candidate' && Array.isArray(user.roleData.data.skills) && user.roleData.data.skills.length > 0) {
      return user.roleData.data.skills;
    }
    try {
      const cached = localStorage.getItem('msmebooks_candidate_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          return parsed.skills;
        }
      }
    } catch {}
    return ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [candidateTitle, setCandidateTitle] = useState(() => {
    if (user?.roleData?.role === 'candidate' && user.roleData.data.targetRole) {
      return user.roleData.data.targetRole;
    }
    return 'Senior Software Engineer';
  });

  // 3. Analysis State
  const [analysisData, setAnalysisData] = useState<SkillsGapAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // 4. Learning Plan State (Saved courses persisted in localStorage)
  const [savedCourses, setSavedCourses] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_learning_plan');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedToast, setSavedToast] = useState('');

  const toggleSaveCourse = (courseTitle: string) => {
    setSavedCourses((prev) => {
      const isSaved = prev.includes(courseTitle);
      const updated = isSaved ? prev.filter((t) => t !== courseTitle) : [...prev, courseTitle];
      try {
        localStorage.setItem('msmebooks_learning_plan', JSON.stringify(updated));
      } catch {}
      setSavedToast(isSaved ? 'Course removed from study plan.' : 'Course saved to your study plan!');
      setTimeout(() => setSavedToast(''), 2500);
      return updated;
    });
  };

  // Run Gap Analysis
  const runGapAnalysis = async (targetJob: Job, skillsToCompare: string[]) => {
    if (!targetJob) return;
    setIsLoading(true);
    setAnalysisError('');

    try {
      const res = await fetch('/api/skills-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: targetJob,
          candidateProfile: {
            skills: skillsToCompare,
            targetRole: candidateTitle,
            yearsOfExperience: 5,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to analyze skills`);
      }

      const data = await res.json();
      if (data.success) {
        setAnalysisData(data);
      } else {
        throw new Error(data.error || 'Failed to complete skills gap analysis');
      }
    } catch (err: any) {
      console.warn('Skills gap analysis fetch error:', err);
      // Client-side heuristic fallback
      const jobSkills = targetJob.skills || [];
      const matched = jobSkills.filter((js) =>
        skillsToCompare.some(
          (cs) =>
            cs.toLowerCase().trim() === js.toLowerCase().trim() ||
            cs.toLowerCase().includes(js.toLowerCase()) ||
            js.toLowerCase().includes(cs.toLowerCase())
        )
      );
      const gaps = jobSkills.filter(
        (js) => !matched.some((ms) => ms.toLowerCase().trim() === js.toLowerCase().trim())
      );
      const matchScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 75;

      setAnalysisData({
        matchScore,
        matchVerdict: matchScore >= 75 ? 'Strong Technical Alignment' : 'Bridgeable Growth Alignment',
        overallAssessment: `You match ${matched.length} of ${jobSkills.length} required skills for ${targetJob.title}. Focus on bridging the remaining ${gaps.length} skill gap${gaps.length > 1 ? 's' : ''} with verified free learning paths.`,
        matchedSkills: matched,
        gapSkills: gaps,
        recommendedCourses: gaps.map((gap) => ({
          skill: gap,
          courseTitle: `${gap} Professional Certification & Mastery`,
          provider: 'freeCodeCamp & Open Courseware',
          duration: '8-12 hours · Self-paced',
          cost: '100% Free',
          certificateType: 'Free Verified Certificate',
          url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(gap)}`,
          description: `Comprehensive project-oriented training and exercises to master ${gap} for production deployments.`,
          whyItBridgesGap: `Directly satisfies the technical competency requirement outlined in the job description for ${targetJob.title}.`,
          syllabusHighlights: [`Core ${gap} Architecture`, 'Production Best Practices & Tooling', 'Hands-on Portfolio Labs'],
        })),
        interviewTalkingPoints: [
          `Highlight your strong foundations in ${matched.slice(0, 2).join(' and ')} as proof of quick adaptability.`,
          `Explain your ongoing study in ${gaps[0] || 'emerging tools'} to demonstrate commitment to professional mastery.`,
          `Emphasize hands-on projects you have built to validate your self-directed upskilling speed.`,
        ],
        portfolioProjectIdea: `Construct a real-world micro-service demonstrating ${gaps[0] || 'core technologies'} integrated with a modern cloud database.`,
        estimatedWeeksToBridge: Math.max(1, Math.ceil(gaps.length * 1.5)),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Re-run whenever selectedJob or candidateSkills changes
  useEffect(() => {
    if (selectedJob) {
      runGapAnalysis(selectedJob, candidateSkills);
    }
  }, [selectedJob?.id, candidateSkills]);

  // Skill management
  const handleAddSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !candidateSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCandidateSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidateSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleApplyPresetResume = (preset: typeof PRESET_RESUMES[0]) => {
    setCandidateSkills(preset.skills);
    setCandidateTitle(preset.role);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#B5E61D]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0066CC] to-indigo-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-[#B5E61D] border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Skills Gap Analysis & Free Upskilling Paths</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Benchmark Your Resume Against Any Job Opening
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Select an open vacancy below. Our AI compares your technical competencies against the hiring squad’s required skills, detects proficiency gaps, and curates specific <strong>100% free courses and certifications</strong> from top universities and platforms.
          </p>
        </div>
      </div>

      {/* SECTION 1: CANDIDATE RESUME PROFILE & PRESETS */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Your Current Resume Competencies ({candidateSkills.length})
            </span>
          </div>

          {/* Quick preset candidate profiles */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Profiles:</span>
            {PRESET_RESUMES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPresetResume(preset)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Skills Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {candidateSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#1A284A] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-2xs group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove skill"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Add custom skill inline */}
          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="+ Add skill..."
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-800 dark:text-slate-200 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none w-32 focus:w-44 transition-all"
            />
            {customSkillInput.trim() && (
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-1 rounded-md bg-[#0066CC] text-white hover:bg-[#0052A3] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: JOB SELECTOR */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Select Job Opening to Benchmark ({filteredJobs.length} roles available)
            </span>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartmentFilter(dept)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  departmentFilter === dept
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Selector Grid */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={jobSearchTerm}
              onChange={(e) => setJobSearchTerm(e.target.value)}
              placeholder="Filter openings by role title, technology, or company..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
            />
          </div>
        </div>

        {/* Horizontal Scrollable Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {filteredJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/60 border-[#0066CC] dark:border-[#38BDF8] shadow-xs'
                    : 'bg-white dark:bg-[#1A284A] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">{job.department}</span>
                    <span>{job.workArrangement}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {job.title}
                  </h4>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{job.company?.name || 'MsmeBooks'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500 font-mono font-semibold">
                    {job.salary?.min ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}/mo` : 'Competitive'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(job.skills || []).length} required skills
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SKILLS GAP ANALYSIS OVERVIEW */}
      {selectedJob && (
        <div className="p-5 sm:p-6 bg-white dark:bg-[#131D35] rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-6 animate-in fade-in">
          {/* Header Bar of Selected Job */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                  Target Benchmark Role
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedJob.company?.name || 'MsmeBooks Technologies'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedJob.location?.city}, {selectedJob.location?.country}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {selectedJob.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => runGapAnalysis(selectedJob, candidateSkills)}
                disabled={isLoading}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Re-Analyze</span>
              </button>

              {onSelectJobForApply && (
                <button
                  type="button"
                  onClick={() => onSelectJobForApply(selectedJob)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Match Score & Verdict Card */}
          {analysisData && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-[#0D1527] dark:via-[#16223D] dark:to-[#0D1527] rounded-2xl border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {/* Radial Match Score Meter */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="stroke-slate-200 dark:stroke-slate-700/80"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${
                          analysisData.matchScore >= 75
                            ? 'stroke-emerald-500'
                            : analysisData.matchScore >= 50
                            ? 'stroke-[#0066CC] dark:stroke-[#38BDF8]'
                            : 'stroke-amber-500'
                        } transition-all duration-700 ease-out`}
                        strokeDasharray={`${analysisData.matchScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono font-black text-base text-slate-900 dark:text-white leading-none">
                        {analysisData.matchScore}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">
                        Match
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {analysisData.matchVerdict}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-[#0066CC] dark:bg-blue-950 dark:text-[#38BDF8]">
                        {analysisData.gapSkills.length === 0
                          ? '100% Skills Satisfied'
                          : `${analysisData.gapSkills.length} Skill Gap${analysisData.gapSkills.length > 1 ? 's' : ''} to Bridge`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-xl">
                      {analysisData.overallAssessment}
                    </p>
                  </div>
                </div>

                {analysisData.estimatedWeeksToBridge !== undefined && (
                  <div className="p-3 bg-white dark:bg-[#1A284A] rounded-xl border border-slate-200 dark:border-slate-700 text-center shrink-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Estimated Upskilling
                    </div>
                    <div className="text-base font-black text-[#0066CC] dark:text-[#38BDF8] font-mono mt-0.5">
                      ~{analysisData.estimatedWeeksToBridge} Weeks
                    </div>
                    <div className="text-[10px] text-slate-500">at 5 hrs/week study</div>
                  </div>
                )}
              </div>

              {/* Skills Breakdown Grid: Matched vs Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/60">
                {/* Matched Skills */}
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Matched Skills ({analysisData.matchedSkills.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Direct Resume Fit
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisData.matchedSkills.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No direct keyword overlap found.</p>
                    ) : (
                      analysisData.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{skill}</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Identified Skill Gaps */}
                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Identified Skill Gaps ({analysisData.gapSkills.length})</span>
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                      Bridge via Free Courses
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisData.gapSkills.length === 0 ? (
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>All role requirements are present in your resume!</span>
                      </span>
                    ) : (
                      analysisData.gapSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{skill}</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: RECOMMENDED FREE COURSES & CERTIFICATIONS */}
          {analysisData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Free Courses & Certifications to Bridge Gaps</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Curated 100% free courses, university audit tracks, and official badges directly aligned with {selectedJob.title}.
                  </p>
                </div>

                {savedCourses.length > 0 && (
                  <span className="text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    {savedCourses.length} Course{savedCourses.length > 1 ? 's' : ''} in Study Plan
                  </span>
                )}
              </div>

              {analysisData.recommendedCourses.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 dark:bg-[#1A284A] rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">No Critical Skill Gaps Detected!</p>
                  <p className="mt-1 max-w-md mx-auto">
                    Your candidate background satisfies the essential qualifications for this vacancy. You are well-positioned to apply directly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {analysisData.recommendedCourses.map((course, idx) => {
                    const isSaved = savedCourses.includes(course.courseTitle);
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-white dark:bg-[#1A284A] rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-[#0066CC]/60 dark:hover:border-[#38BDF8]/60 transition-all shadow-xs flex flex-col justify-between group"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 text-xs mb-2">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              Bridges: {course.skill}
                            </span>
                            <span className="px-2 py-0.5 rounded-md font-extrabold text-[10px] bg-[#B5E61D]/30 text-[#14243A] dark:text-[#B5E61D] border border-[#B5E61D]/50">
                              {course.cost}
                            </span>
                          </div>

                          {/* Course Title */}
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                            {course.courseTitle}
                          </h5>

                          {/* Provider & Duration Metadata */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 mb-2.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {course.provider}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{course.duration}</span>
                            </span>
                          </div>

                          {/* Why it bridges gap */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                            {course.whyItBridgesGap}
                          </p>

                          {/* Syllabus Highlights */}
                          {course.syllabusHighlights && course.syllabusHighlights.length > 0 && (
                            <div className="space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                              {course.syllabusHighlights.slice(0, 2).map((sh, sIdx) => (
                                <div key={sIdx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                                  <span className="truncate">{sh}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => toggleSaveCourse(course.courseTitle)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#131D35]'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            <span>{isSaved ? 'In Study Plan' : 'Save Course'}</span>
                          </button>

                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>Access Course</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: INTERVIEW TALKING POINTS & PORTFOLIO STRATEGY */}
          {analysisData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              {/* Interview Talking Points */}
              <div className="p-4 bg-slate-50 dark:bg-[#1A284A] rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    How to Address Skill Gaps in Interviews
                  </span>
                </div>
                <div className="space-y-2">
                  {analysisData.interviewTalkingPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <p className="leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekend Portfolio Project Idea */}
              <div className="p-4 bg-slate-50 dark:bg-[#1A284A] rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Proof-of-Work Portfolio Project Idea
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysisData.portfolioProjectIdea ||
                    'Build an open-source integration micro-service connecting your core backend skills with the required target database to demonstrate real execution.'}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Attach repository link on your Application submission</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
