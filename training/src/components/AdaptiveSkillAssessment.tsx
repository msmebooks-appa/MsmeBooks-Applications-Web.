import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Clock, 
  BookOpen, 
  X, 
  Target,
  Zap,
  TrendingUp,
  Check
} from 'lucide-react';
import { AssessmentQuestion, AssessmentResult, Course } from '../types';
import { ASSESSMENT_QUESTIONS, COURSES } from '../data/mockData';

interface AdaptiveSkillAssessmentProps {
  onClose: () => void;
  onApplyRecommendation: (result: AssessmentResult) => void;
  targetCourse?: Course;
}

export const AdaptiveSkillAssessment: React.FC<AdaptiveSkillAssessmentProps> = ({
  onClose,
  onApplyRecommendation,
  targetCourse = COURSES[0]
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate assessment results
      calculateResults();
    }
  };

  const calculateResults = () => {
    let advancedPoints = 0;
    let intermediatePoints = 0;
    let beginnerPoints = 0;

    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      const selectedOptIdx = selectedAnswers[idx];
      if (selectedOptIdx !== undefined) {
        const opt = q.options[selectedOptIdx];
        if (opt.isBest) advancedPoints += 20;
        else if (opt.level === 'Intermediate') intermediatePoints += 15;
        else beginnerPoints += 5;
      }
    });

    const totalScore = Math.min(100, advancedPoints + intermediatePoints + beginnerPoints);
    let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (totalScore >= 75) level = 'Advanced';
    else if (totalScore >= 45) level = 'Intermediate';

    // Map modules for the target course: prioritize vs fast-track
    const recommendedModules = targetCourse.modules.map((m, idx) => {
      // If student showed advanced knowledge in fundamentals, early modules can be fast-tracked
      const isFastTrack = level === 'Advanced' ? idx < 2 : (level === 'Intermediate' && idx === 0);
      return {
        id: m.id,
        title: m.title,
        status: isFastTrack ? ('fast-track' as const) : ('priority' as const),
        reason: isFastTrack 
          ? 'Diagnostic verified solid baseline knowledge; fast-track to save study time.'
          : 'High impact topic: focus on practical software sandbox exercises here.'
      };
    });

    const timeSaved = level === 'Advanced' ? 4.5 : (level === 'Intermediate' ? 2.5 : 0);

    const result: AssessmentResult = {
      scorePercentage: totalScore,
      level,
      summary: level === 'Advanced'
        ? 'Excellent proficiency! You demonstrate strong double-entry, VAT, and inventory control fundamentals. We recommend jumping directly to advanced management reporting and multi-branch automation.'
        : level === 'Intermediate'
        ? 'Good operational grasp! You understand core daily operations. Focus on formalizing reconciliation controls, tax withholding compliance, and biological asset/inventory valuations.'
        : 'Foundational pathway recommended. We suggest progressing sequentially through the hands-on interactive demos and sandbox exercises to build rock-solid accounting fundamentals.',
      recommendedCourseId: targetCourse.id,
      recommendedModules,
      timeSavedHours: timeSaved
    };

    setAssessmentResult(result);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setAssessmentResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#073B75] to-[#0B4F9C] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#72B01D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#72B01D] bg-white/10 px-2 py-0.5 rounded-md">
                  Adaptive AI Diagnostic
                </span>
                <span className="text-xs text-blue-200">5 Questions</span>
              </div>
              <h2 className="font-black text-lg sm:text-xl">
                Pre-Course Skill Assessment
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assessment Body */}
        {!isCompleted ? (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#72B01D] rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Box */}
            <div className="bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/80 rounded-2xl p-4 text-xs">
              <span className="font-bold text-[#0B4F9C] dark:text-blue-400 uppercase tracking-wider text-[10px] block mb-1">
                Real-World SME Business Scenario:
              </span>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                "{currentQ.scenario}"
              </p>
            </div>

            {/* Question Text */}
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#0B4F9C] bg-blue-50/60 dark:bg-blue-900/30 dark:border-blue-500 text-[#0B4F9C] dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 border ${
                      isSelected 
                        ? 'border-[#0B4F9C] bg-[#0B4F9C] text-white' 
                        : 'border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-relaxed flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip Assessment &amp; Take Full Course
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="px-6 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? 'Analyze My Skill Profile' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Results View */
          assessmentResult && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Score and Level Badge */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#72B01D] text-slate-950">
                  <Award className="w-4 h-4" />
                  <span>Proficiency Rating: {assessmentResult.level} ({assessmentResult.scorePercentage}%)</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Personalized Learning Recommendation
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {assessmentResult.summary}
                </p>

                {assessmentResult.timeSavedHours > 0 && (
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <Clock className="w-4 h-4" />
                    <span>Estimated Time Saved: ~{assessmentResult.timeSavedHours} Hours by Fast-Tracking</span>
                  </div>
                )}
              </div>

              {/* Module Customization Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Tailored Syllabus for: {targetCourse.title}
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {assessmentResult.recommendedModules.map((m, idx) => (
                    <div 
                      key={m.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        m.status === 'priority'
                          ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          m.status === 'priority'
                            ? 'bg-[#0B4F9C] text-white'
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {m.status === 'priority' ? idx + 1 : '✓'}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {m.reason}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        m.status === 'priority'
                          ? 'bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {m.status === 'priority' ? 'Priority Module' : 'Fast-Track / Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic</span>
                </button>

                <button
                  onClick={() => onApplyRecommendation(assessmentResult)}
                  className="px-6 py-3 bg-[#72B01D] hover:bg-[#5B8D17] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-lime-900/20 transition-all cursor-pointer"
                >
                  <span>Launch Customized Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )
        )}

      </div>
    </div>
  );
};
