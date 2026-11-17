import React from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';
import { LEARNING_PATHS, COURSES } from '../data/mockData';
import { LearningPath, Course } from '../types';

interface LearningPathsProps {
  onSelectPath: (path: LearningPath) => void;
  onSelectCourse: (course: Course) => void;
}

export const LearningPaths: React.FC<LearningPathsProps> = ({
  onSelectPath,
  onSelectCourse
}) => {
  return (
    <section id="learning-paths" className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 mb-2 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            <Award className="w-3.5 h-3.5 text-[#72B01D]" />
            Structured Career Pathways
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Industry-Recognized MsmeBooks Certifications
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Multi-course career tracks designed around genuine accounting, retail, and SME operational workflows. Earn verifiable credentials that boost your business credibility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {LEARNING_PATHS.map((path) => {
            const pathCourses = COURSES.filter((c) => path.courses.includes(c.id));

            return (
              <div
                key={path.id}
                className="bg-slate-50/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-bold text-[#72B01D] tracking-wide uppercase">
                        {path.targetRole}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {path.title}
                      </h3>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-100/70 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300 shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {path.description}
                  </p>

                  {/* Path Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <BookOpen className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                      <span className="tabular-nums">{path.coursesCount}</span> Required Courses
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-[#72B01D]" />
                      <span className="tabular-nums">{path.durationHours}</span> Hours Total
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0B4F9C] dark:text-blue-400 font-semibold">
                      Hands-on Labs
                    </span>
                  </div>

                  {/* Included Courses list */}
                  <div className="space-y-2 mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Curriculum Pathway:
                    </p>
                    {pathCourses.map((c, idx) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectCourse(c)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 cursor-pointer text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {c.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0 ml-2">
                          {c.durationHours}h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Examination requirements */}
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs mb-5">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#72B01D] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Accreditation Exam: </span>
                        <span className="text-slate-600 dark:text-slate-300">{path.examRequirements}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcome badge & action button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-medium">Outcome Credential:</span>
                    <span className="font-bold text-[#0B4F9C] dark:text-blue-400">{path.certificationTitle}</span>
                  </div>

                  <button
                    onClick={() => onSelectPath(path)}
                    className="py-2.5 px-4 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Start Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
