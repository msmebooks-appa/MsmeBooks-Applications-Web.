import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  CheckCircle2, 
  Download, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  MessageSquare, 
  Volume2, 
  Settings, 
  Maximize, 
  ChevronRight, 
  ArrowLeft,
  Award,
  Timer,
  Coffee,
  X,
  Printer,
  FileCheck,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Course, Lesson } from '../types';
import { isCourseSavedOffline, downloadCourseForOffline, removeCourseFromOffline } from '../utils/offlineCourseStorage';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
  onOpenSandbox: () => void;
  onOpenAIAssistant: () => void;
  onCompleteCourse: () => void;
  isOffline?: boolean;
}

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  onBack,
  onOpenSandbox,
  onOpenAIAssistant,
  onCompleteCourse,
  isOffline = false
}) => {
  // Offline course caching state
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(() => isCourseSavedOffline(course.id));
  const [offlineFeedback, setOfflineFeedback] = useState<string | null>(null);

  const handleToggleOfflineCache = async () => {
    if (isSavedOffline) {
      await removeCourseFromOffline(course.id);
      setIsSavedOffline(false);
      setOfflineFeedback('Removed course from offline cache.');
    } else {
      await downloadCourseForOffline(course);
      setIsSavedOffline(true);
      setOfflineFeedback('Course modules and notes cached for offline study!');
    }
    setTimeout(() => setOfflineFeedback(null), 3500);
  };
  // Current active module and lesson
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Playback simulation states
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x'>('1x');
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'resources' | 'quiz' | 'notes'>('overview');

  // Pomodoro Study Timer State
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>('focus');
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroCyclesCompleted, setPomodoroCyclesCompleted] = useState(1);
  const [pomodoroAlertMessage, setPomodoroAlertMessage] = useState<string | null>(null);

  // Notes PDF preview modal
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Completed lessons tracking
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, boolean>>({
    'les-101': true,
    'free-les-1': true
  });

  // Quiz interactive state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentModule = course.modules[activeModuleIndex] || course.modules[0];
  const currentLesson: Lesson = currentModule?.lessons[activeLessonIndex] || {
    id: 'placeholder',
    title: 'Lesson Introduction',
    durationMinutes: 15,
    type: 'video',
    transcript: 'Welcome to this lesson...'
  };

  const isCurrentLessonCompleted = !!completedLessonIds[currentLesson.id];

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPomodoroRunning && pomodoroTimeLeft === 0) {
      setIsPomodoroRunning(false);
      if (pomodoroMode === 'focus') {
        setPomodoroCyclesCompleted((c) => c + 1);
        setPomodoroAlertMessage('🎉 Focus session complete! Take a 5-minute breather.');
        setPomodoroMode('shortBreak');
        setPomodoroTimeLeft(5 * 60);
      } else {
        setPomodoroAlertMessage('⚡ Break over! Ready to resume your learning session?');
        setPomodoroMode('focus');
        setPomodoroTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroTimeLeft, pomodoroMode]);

  const handleSetPomodoroMode = (mode: PomodoroMode) => {
    setPomodoroMode(mode);
    setIsPomodoroRunning(false);
    if (mode === 'focus') setPomodoroTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setPomodoroTimeLeft(5 * 60);
    else setPomodoroTimeLeft(15 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < currentModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeModuleIndex < course.modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    } else {
      onCompleteCourse();
    }
    setQuizSubmitted(false);
  };

  const handleQuizSelect = (qId: string, optIndex: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [qId]: optIndex
    }));
  };

  // Calculate total course completion percentage
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.keys(completedLessonIds).length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Client-side printable notes trigger
  const handlePrintCourseNotes = () => {
    window.print();
  };

  // Client-side file download fallback
  const handleDownloadNotesFile = () => {
    const notesContent = `
MSMEBOOKS ACADEMY - COURSE STUDY SUMMARY & CURRICULUM NOTES
===========================================================
COURSE TITLE: ${course.title}
CATEGORY: ${course.category}
INSTRUCTOR: ${course.instructor.name} (${course.instructor.title})
DURATION: ${course.durationHours} Hours | LEVEL: ${course.level}
OFFLINE CHEAT SHEET & MODULE BREAKDOWN

OVERVIEW:
${course.description}

KEY LEARNING OBJECTIVES:
${course.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

CURRICULUM BREAKDOWN:
${course.modules.map((m, mIdx) => `
MODULE ${mIdx + 1}: ${m.title}
${m.lessons.map((l, lIdx) => `  ${mIdx + 1}.${lIdx + 1} ${l.title} (${l.durationMinutes} min)`).join('\n')}
`).join('\n')}

CORE SOFTWARE FORMULAS & SHORTCUTS:
- Chart of Accounts Default Structure: 1000 Assets, 2000 Liabilities, 3000 Equity, 4000 Revenue, 5000 Expenses
- Value Added Tax (VAT): Net Amount * 7.5% = VAT Output / Input
- Inventory Valuation: (Opening Stock Value + Purchases) / Total Available Units = Weighted Average Unit Cost
- Shift Balancing: Counted Physical Cash - (Opening Float + Cash Sales - Cash Drops) = Shift Cash Variance
- Shortcut: [Shift + S] to open Multi-Location Stock Transfer
- Shortcut: [Ctrl + Enter] to Post & Print POS Slip

Generated offline from MsmeBooks Learning Ecosystem.
Accredited Training for African SMEs.
    `.trim();

    const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.slug}_Study_Notes_MsmeBooks.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Learning Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Academy</span>
          </button>

          <div className="border-l border-slate-800 pl-3">
            <h1 className="font-bold text-white text-xs sm:text-sm line-clamp-1">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              {currentModule?.title} · {currentLesson.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Pomodoro Timer Launcher in Top Bar */}
          <button
            onClick={() => setPomodoroOpen(!pomodoroOpen)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isPomodoroRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Pomodoro Study Timer (25m Focus / 5m Break)"
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tabular-nums font-bold">{formatTimer(pomodoroTimeLeft)}</span>
            <span className="hidden md:inline text-[10px] text-slate-400">({pomodoroMode})</span>
          </button>

          {/* Download Course Notes Button */}
          <button
            onClick={() => setShowNotesModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download Course Summary & Offline Notes"
          >
            <Download className="w-3.5 h-3.5 text-[#72B01D]" />
            <span className="hidden sm:inline">Course Notes (PDF)</span>
          </button>

          {/* Download for Offline Study Button */}
          <button
            onClick={handleToggleOfflineCache}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isSavedOffline
                ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isSavedOffline ? 'Course saved offline. Click to clear.' : 'Save full course modules & lessons for offline study'}
          >
            <WifiOff className={`w-3.5 h-3.5 ${isSavedOffline ? 'text-[#72B01D]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isSavedOffline ? 'Offline Ready' : 'Save for Offline'}</span>
          </button>

          {/* Course Progress Bar */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Progress:</span>
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#72B01D] h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <span className="font-bold text-[#84CC16] tabular-nums">{progressPercent}%</span>
          </div>

          <button
            onClick={onOpenSandbox}
            className="px-3 py-1.5 text-xs font-semibold bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#84CC16]" />
            <span className="hidden sm:inline">Practice Sandbox</span>
          </button>
        </div>
      </div>

      {/* Offline Status or Cache Feedback Strip */}
      {(offlineFeedback || isOffline || isSavedOffline) && (
        <div className={`px-4 py-1.5 text-xs flex items-center justify-between border-b ${
          isOffline
            ? 'bg-amber-950/90 border-amber-700/60 text-amber-200'
            : isSavedOffline
            ? 'bg-emerald-950/70 border-emerald-800/60 text-emerald-200'
            : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
            {isOffline ? (
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#72B01D] shrink-0" />
            )}
            <span>
              {offlineFeedback ? (
                offlineFeedback
              ) : isOffline ? (
                <><strong>Offline Mode Active:</strong> You are accessing downloaded course modules and cached syllabus materials. All local progress is saved.</>
              ) : (
                <><strong>Offline Cache Ready:</strong> All {course.modules.length} modules, video transcripts, and quizzes are stored locally on your device for offline study.</>
              )}
            </span>
          </div>
          {isSavedOffline && (
            <span className="text-[10px] font-mono text-[#84CC16] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
              CACHED
            </span>
          )}
        </div>
      )}

      {/* Pomodoro Timer Flyout Dropdown */}
      {pomodoroOpen && (
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Pomodoro Focus Timer</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    Cycle {pomodoroCyclesCompleted} of 4
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Boost software retention with 25-minute deliberate practice intervals.
                </p>
              </div>
            </div>

            {/* Mode selectors */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => handleSetPomodoroMode('focus')}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  pomodoroMode === 'focus' ? 'bg-[#0B4F9C] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => handleSetPomodoroMode('shortBreak')}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  pomodoroMode === 'shortBreak' ? 'bg-[#72B01D] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleSetPomodoroMode('longBreak')}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  pomodoroMode === 'longBreak' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black font-mono tracking-wider text-amber-400 tabular-nums">
                {formatTimer(pomodoroTimeLeft)}
              </div>

              <button
                onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPomodoroRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#72B01D] hover:bg-[#5B8D17] text-slate-950'
                }`}
              >
                {isPomodoroRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPomodoroRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPomodoroRunning(false);
                  handleSetPomodoroMode(pomodoroMode);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPomodoroOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer ml-1"
                title="Close flyout"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {pomodoroAlertMessage && (
            <div className="mt-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 py-1 rounded border border-emerald-800">
              {pomodoroAlertMessage}
            </div>
          )}
        </div>
      )}

      {/* Main Player & Sidebar Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Video / Interactive Stage & Content */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
          
          {/* Simulated High-Fidelity Video Display */}
          <div className="relative aspect-video bg-black flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Visual background simulation */}
            <div className="absolute inset-0 flex items-center justify-center bg-radial from-slate-800 to-black p-8 text-center">
              <div className="max-w-md space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#0B4F9C]/80 border border-blue-400/30 flex items-center justify-center mx-auto text-white shadow-lg">
                  <Play className={`w-7 h-7 text-white ml-1 ${isPlaying ? 'animate-pulse' : ''}`} />
                </div>
                <div className="text-white text-base font-bold">{currentLesson.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive simulation &amp; cloud software demonstration. Audio explanation with live screen walkthrough.
                </p>
                <div className="inline-flex items-center gap-2 text-[11px] text-[#84CC16] bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-ping" />
                  <span>Interactive Stream Active ({playbackSpeed})</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Captions Bar */}
            {captionsEnabled && (
              <div className="relative z-10 mx-auto mb-14 px-4 py-1.5 bg-black/80 backdrop-blur-md rounded-md text-center max-w-lg text-xs text-slate-100 border border-slate-700/60 shadow-md">
                "{currentLesson.transcript ? currentLesson.transcript.substring(0, 110) + '...' : 'In this lesson, we configure company currency, automated tax rates, and post your first ledger transaction.'}"
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2">
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-[#72B01D] h-full w-2/3" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <span className="tabular-nums text-[11px]">
                    08:42 / {currentLesson.durationMinutes}:00
                  </span>

                  <button 
                    onClick={() => setCaptionsEnabled(!captionsEnabled)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${captionsEnabled ? 'bg-[#72B01D] text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                  >
                    CC
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5 text-[10px]">
                    {(['1x', '1.25x', '1.5x'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1 rounded ${playbackSpeed === spd ? 'bg-[#0B4F9C] text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleToggleComplete(currentLesson.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCurrentLessonCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="px-3 py-1 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content & Discussion Tabs */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lesson Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'transcript'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Transcript &amp; Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'resources'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Resources &amp; Templates</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Knowledge Check</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl text-xs sm:text-sm">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">About this Lesson</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {currentLesson.contentSnippet || 
                      'In this session, we dive into MsmeBooks operational workflows, focusing on double-entry ledger mappings, transaction reconciliation, and automated financial statements for small businesses.'}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Competencies</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D]" />
                      Configuring multi-currency ledgers and automatic FX gain/loss calculation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D]" />
                      Establishing automated VAT and withholding tax schedules
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D]" />
                      Exporting audited trial balance and management P&amp;L reports
                    </li>
                  </ul>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[#84CC16] rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete Course Notes &amp; Offline Summary (PDF)</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono max-w-3xl">
                {currentLesson.transcript || 
                  'Welcome to this lesson in MsmeBooks Academy. In this module we explore practical accounting entries, automated tax calculations, and how to balance inventory ledgers across branches.'}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3 max-w-2xl">
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0B4F9C]/30 text-blue-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {currentLesson.downloadableResource?.name || 'MsmeBooks_SME_Chart_of_Accounts.xlsx'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {currentLesson.downloadableResource?.size || '142 KB'} · Microsoft Excel Template
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDownloadNotesFile}
                    className="px-3 py-1.5 bg-[#0B4F9C] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="p-5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#84CC16]" />
                    <span>Module Knowledge Check</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Answer these scenario-based questions to verify your understanding before proceeding.
                  </p>
                </div>

                {currentLesson.quiz && currentLesson.quiz.length > 0 ? (
                  currentLesson.quiz.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3 pt-3 border-t border-slate-700">
                      <p className="text-xs font-bold text-slate-200">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswers[q.id] === optIdx;
                          const isCorrect = optIdx === q.correctAnswer;
                          
                          let btnStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700';
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                            else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                          } else if (isSelected) {
                            btnStyle = 'bg-[#0B4F9C] border-blue-400 text-white font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => !quizSubmitted && handleQuizSelect(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-mono font-bold mr-2">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700 text-xs">
                          <p className="font-bold text-[#84CC16]">Explanation:</p>
                          <p className="text-slate-300 mt-0.5">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 py-4">
                    This lesson is an interactive practical demonstration. Launch the Software Sandbox below to complete the practical task.
                  </div>
                )}

                {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                  <div className="pt-2 flex items-center justify-between">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedQuizAnswers({});
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Right: Lesson Navigation Sidebar */}
        <div className="w-full lg:w-80 bg-slate-950 border-l border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Course Curriculum
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {course.modules.length} Modules · {totalLessons} Lessons
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="p-3">
                <div className="text-xs font-bold text-slate-200 mb-2">
                  {mod.title}
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((les, lesIdx) => {
                    const isSelected = activeModuleIndex === modIdx && activeLessonIndex === lesIdx;
                    const isDone = !!completedLessonIds[les.id];

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          setActiveModuleIndex(modIdx);
                          setActiveLessonIndex(lesIdx);
                          setQuizSubmitted(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B4F9C] text-white font-semibold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                          {les.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Download Course Notes Modal / Printable Document View */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 no-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B4F9C] text-white font-bold flex items-center justify-center text-sm">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">MsmeBooks Academy Course Notes</h3>
                  <p className="text-[11px] text-slate-500">Official syllabus summary &amp; offline study guide</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCourseNotes}
                  className="px-3.5 py-1.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  onClick={handleDownloadNotesFile}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>

                <button
                  onClick={() => setShowNotesModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Print-optimized) */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded">
                  {course.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-2 mb-1">
                  {course.title}
                </h1>
                <p className="text-xs text-slate-600 italic">
                  Instructor: {course.instructor.name} · {course.durationHours} Hours · Level: {course.level}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-1.5">
                  Course Synopsis
                </h4>
                <p className="text-slate-700">
                  {course.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-2">
                  Learning Objectives
                </h4>
                <div className="space-y-1.5 pl-4 list-decimal">
                  {course.learningObjectives.map((obj, idx) => (
                    <div key={idx} className="text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-[#0B4F9C]">{idx + 1}.</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-3">
                  Module &amp; Lesson Breakdown
                </h4>
                <div className="space-y-4">
                  {course.modules.map((m, mIdx) => (
                    <div key={m.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-900 text-xs mb-2">
                        {m.title}
                      </h5>
                      <div className="space-y-1 pl-3 text-slate-600 text-xs">
                        {m.lessons.map((l, lIdx) => (
                          <div key={l.id} className="flex items-center justify-between py-0.5">
                            <span>{mIdx + 1}.{lIdx + 1} {l.title}</span>
                            <span className="text-slate-400 font-mono">{l.durationMinutes} mins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cheat Sheet & Shortcuts */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-[#0B4F9C] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#72B01D]" />
                  <span>MsmeBooks Quick Operational Cheat Sheet</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-mono">
                  <div>
                    <strong>• Chart Classification:</strong><br />
                    1000 Assets · 2000 Liab · 3000 Equity · 4000 Sales · 5000 Expense
                  </div>
                  <div>
                    <strong>• VAT Calculation:</strong><br />
                    Net Sales × 7.5% = VAT Output Due to Revenue
                  </div>
                  <div>
                    <strong>• Shift Balancing:</strong><br />
                    Cash Count - (Float + Cash Sales - Drops) = Variance
                  </div>
                  <div>
                    <strong>• Keyboard Shortcuts:</strong><br />
                    [Shift + S] Stock Transfer · [Ctrl + P] Print POS Slip
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
                Official Study Material · © MsmeBooks Academy · Pan-African SME Learning System
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
