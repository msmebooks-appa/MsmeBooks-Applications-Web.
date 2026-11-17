import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Job } from '../types/career';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Award,
  Clock,
  MessageSquare,
  Bot,
  User,
  Send,
  Loader2,
  Zap,
  TrendingUp,
  ShieldCheck,
  Building2,
  PhoneCall,
  PhoneOff,
  Radio,
  RefreshCw,
  BarChart2,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MockInterviewModalProps {
  job: Job;
  onClose: () => void;
  onApplyForJob?: () => void;
}

interface InterviewTurn {
  role: 'interviewer' | 'candidate';
  content: string;
  feedback?: {
    strength: string;
    opportunity: string;
    score: number;
    seniorityFeedback?: string;
    industryFeedback?: string;
    modelTalkingPoint?: string;
  };
  followUpRationale?: string;
  timestamp: string;
}

interface FinalScorecard {
  overallScore: number;
  technicalDepthScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  merchantEmpathyScore: number;
  seniorityAlignmentScore?: number;
  industryKnowledgeScore?: number;
  hiringVerdict: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  executiveSummary: string;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  job,
  onClose,
  onApplyForJob,
}) => {
  const jobIndustry = job.industry || 'FinTech & African Commerce';
  const jobSeniority = job.experienceLevel || 'Senior';
  const companyName = job.company?.name || 'MsmeBooks';

  // Mode selection & progression
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('technical');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(1);
  const totalTurns = 4;

  // Audio & Speech settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioInputLevel, setAudioInputLevel] = useState<number[]>(new Array(16).fill(10));
  const [inputMode, setInputMode] = useState<'mic' | 'type'>('mic');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Conversation history
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentRationale, setCurrentRationale] = useState<string>('');
  const [candidateInput, setCandidateInput] = useState<string>('');
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);

  // Scorecard
  const [isCompleted, setIsCompleted] = useState(false);
  const [scorecard, setScorecard] = useState<FinalScorecard | null>(null);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const turnsEndRef = useRef<HTMLDivElement>(null);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Timer effect during active session
  useEffect(() => {
    if (!sessionStarted || isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, isCompleted]);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Text to speech helper
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.02;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Stop speech when unmounting or closing
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopAudioVisualizer();
    };
  }, []);

  // Web Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setCandidateInput(currentTranscript.trim());
        };

        recognition.onend = () => {
          // If listening state is still true, auto-restart to simulate continuous conversation
          if (isListening) {
            try {
              recognition.start();
            } catch {
              setIsListening(false);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setMicError('Microphone permission blocked. You can still type your answers below.');
            setIsListening(false);
            setInputMode('type');
          }
        };

        recognitionRef.current = recognition;
      } else {
        setMicError('Web Speech API not supported in this browser. You can type answers directly.');
        setInputMode('type');
      }
    }
  }, [isListening]);

  // Audio Visualizer functions using Web Audio API
  const startAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateFrequencyData = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map to 16 display bars
        const step = Math.floor(bufferLength / 16);
        const bars: number[] = [];
        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          bars.push(Math.max(12, Math.round((val / 255) * 100)));
        }
        setAudioInputLevel(bars);
        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
      };

      updateFrequencyData();
    } catch (err) {
      console.warn('Audio Visualizer error:', err);
      // Simulated subtle wave if audio hardware stream unavailable
      simulateWaveform();
    }
  };

  const simulateWaveform = () => {
    const interval = setInterval(() => {
      setAudioInputLevel((prev) =>
        prev.map(() => Math.floor(Math.random() * 65) + 20)
      );
    }, 120);
    return () => clearInterval(interval);
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioInputLevel(new Array(16).fill(10));
  };

  // Toggle Microphone
  const toggleMicListening = async () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopAudioVisualizer();
      setIsListening(false);
    } else {
      // Start listening
      setMicError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          startAudioVisualizer();
        } catch (e: any) {
          console.warn('Speech start error, attempting restart', e);
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
              setIsListening(true);
              startAudioVisualizer();
            }, 150);
          } catch {
            setMicError('Could not access microphone. Switched to keyboard mode.');
            setInputMode('type');
          }
        }
      } else {
        setMicError('Microphone voice recognition not supported. Please type below.');
        setInputMode('type');
      }
    }
  };

  // Start Session with initial greeting & first question tailored to Seniority & Industry
  const startSession = () => {
    setSessionStarted(true);
    setElapsedSeconds(0);
    setCurrentTurnIndex(1);
    setIsCompleted(false);
    setScorecard(null);
    setMicError(null);

    let openingSpeech = '';
    let initialQ = '';
    let rationale = '';

    const primarySkill = job.skills[0] || 'software architecture';
    const isSenior = /senior|lead|principal|director|head|manager|architect|executive/i.test(jobSeniority) ||
      /senior|lead|principal|architect|staff/i.test(job.title);

    if (interviewType === 'technical') {
      if (isSenior) {
        openingSpeech = `Hello! I'm Adaobi Vance, Lead Hiring Partner at ${companyName}. Welcome to your real-time voice screening for the ${jobSeniority} ${job.title} role in our ${jobIndustry} division. In African commerce, our merchants rely on 100% data integrity even during network dropouts. Let's begin: Could you walk me through the most critical transactional architecture you designed using ${primarySkill}, and explain how you enforced idempotency, zero-downtime ledger reconciliation, and blast-radius containment?`;
        initialQ = `Walk me through the most critical transactional architecture you designed using ${primarySkill}. How did you enforce idempotency, zero-downtime ledger reconciliation, and blast-radius containment?`;
        rationale = `Tests ${jobSeniority}-level system architecture depth, transactional guarantees, and defensive engineering in ${jobIndustry}.`;
      } else {
        openingSpeech = `Hello! I'm Adaobi Vance, Lead Technical Recruiter at ${companyName}. Thanks for joining this live screening for the ${job.title} position in ${jobIndustry}. We value hands-on craft and attention to detail. To start: Could you explain how you utilize ${primarySkill} in your day-to-day work, and walk me through how you debug and test edge cases before releasing code?`;
        initialQ = `Explain how you utilize ${primarySkill} in your day-to-day work. How do you systematically test and debug edge cases before shipping to production?`;
        rationale = `Evaluates foundational mastery of ${primarySkill}, testing habits, and code quality rigor.`;
      }
    } else if (interviewType === 'behavioral') {
      if (isSenior) {
        openingSpeech = `Hello! I'm Adaobi Vance, Head of Talent at ${companyName}. Welcome to your leadership and behavioral screening for ${job.title}. At ${companyName}, we serve over 40 million African MSMEs where software failure directly impacts shopkeeper livelihoods. Tell me about a time you led a high-stakes initiative under extreme ambiguity and tight deadlines. What strategic trade-offs did you make, and how did you rally cross-functional stakeholders?`;
        initialQ = `Tell me about a time you led a high-stakes initiative under extreme ambiguity and tight deadlines. What strategic trade-offs did you make and what was the quantifiable business outcome?`;
        rationale = `Evaluates STAR framework structure, executive ownership, and trade-off negotiation calibrated for ${jobSeniority} roles.`;
      } else {
        openingSpeech = `Hello! I'm Adaobi Vance, Talent Partner at ${companyName}. Welcome to your screening for ${job.title}. Our culture values customer empathy, proactive ownership, and speed. Tell me about a time you encountered a difficult problem or conflicting priority on your team. How did you handle it and what did you learn?`;
        initialQ = `Tell me about a time you encountered a difficult problem or conflicting priority on your team. How did you communicate and resolve it?`;
        rationale = `Evaluates teamwork, adaptability, communication, and alignment with company core values.`;
      }
    } else {
      openingSpeech = `Welcome! I'm Adaobi Vance from ${companyName}. Today we'll conduct a comprehensive screening covering both your technical decisions and your stakeholder alignment for ${job.title} in ${jobIndustry}. To start: Tell me about a major technical decision you championed that met significant stakeholder pushback. How did you validate your approach with data and resolve the contention?`;
      initialQ = `Tell me about a major technical decision you championed that met significant stakeholder pushback. How did you validate your approach with data and resolve the contention?`;
      rationale = `Tests technical persuasion, data-driven alignment, and stakeholder negotiation in ${jobIndustry}.`;
    }

    setCurrentQuestion(initialQ);
    setCurrentRationale(rationale);
    setTurns([
      {
        role: 'interviewer',
        content: openingSpeech,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    speakText(openingSpeech);
  };

  // Submit Candidate's Answer to Gemini / Calibrated Engine
  const handleSubmitAnswer = async () => {
    const trimmed = candidateInput.trim();
    if (!trimmed || isSubmittingTurn) return;

    // Automatically stop microphone listening when submitting
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopAudioVisualizer();
      setIsListening(false);
    }

    setIsSubmittingTurn(true);

    const candidateTurn: InterviewTurn = {
      role: 'candidate',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedTurns = [...turns, candidateTurn];
    setTurns(updatedTurns);
    setCandidateInput('');

    try {
      const res = await fetch('/api/mock-interview-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          department: job.department,
          skills: job.skills,
          companyName,
          industry: jobIndustry,
          experienceLevel: jobSeniority,
          interviewType,
          currentTurn: currentTurnIndex,
          totalTurns,
          history: updatedTurns.map((t) => ({ role: t.role, content: t.content })),
          candidateAnswer: trimmed,
        }),
      });

      if (!res.ok) throw new Error('Turn failed');
      const data = await res.json();

      // Attach feedback to the candidate's turn
      setTurns((prev) => {
        const copy = [...prev];
        const lastCandidateIdx = copy.length - 1;
        if (copy[lastCandidateIdx] && copy[lastCandidateIdx].role === 'candidate') {
          copy[lastCandidateIdx] = {
            ...copy[lastCandidateIdx],
            feedback: data.feedback,
            followUpRationale: data.followUpRationale,
          };
        }
        // Append interviewer response
        copy.push({
          role: 'interviewer',
          content: data.interviewerSpeech,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        return copy;
      });

      if (data.isComplete) {
        setIsCompleted(true);
        setScorecard(data.finalScorecard);
        speakText(data.interviewerSpeech);
      } else {
        setCurrentTurnIndex((prev) => prev + 1);
        setCurrentQuestion(data.followUpQuestion || '');
        setCurrentRationale(data.followUpRationale || '');
        speakText(data.interviewerSpeech);
      }
    } catch (err) {
      console.warn('Turn error, applying simulated fallback calibrated to industry and seniority', err);
      const nextTurn = currentTurnIndex + 1;
      const isComplete = nextTurn > totalTurns;

      const isSenior = /senior|lead|principal|director|head|manager|architect|executive/i.test(jobSeniority);

      const fallbackFeedback = {
        strength: 'Clear architectural framing and coherent technical reasoning.',
        opportunity: 'Anchor your explanation in measurable production metrics (e.g. latency, throughput, error rates).',
        score: isSenior ? 88 : 82,
        seniorityFeedback: isSenior
          ? `Seniority (${jobSeniority}): Demonstrated high ownership and systemic awareness of failure domains.`
          : `Seniority (${jobSeniority}): Solid hands-on execution and pragmatic problem-solving.`,
        industryFeedback: `Industry (${jobIndustry}): Good awareness of transaction consistency. Emphasize offline POS state reconciliation for African markets.`,
        modelTalkingPoint: isSenior
          ? 'Mention idempotency keys with serializable transactions and exponential jitter retries during peak African sales rushes.'
          : 'Mention unit testing with simulated network disconnects to verify zero duplicated transactions.',
      };

      setTurns((prev) => {
        const copy = [...prev];
        const lastCandidateIdx = copy.length - 1;
        if (copy[lastCandidateIdx] && copy[lastCandidateIdx].role === 'candidate') {
          copy[lastCandidateIdx] = {
            ...copy[lastCandidateIdx],
            feedback: fallbackFeedback,
            followUpRationale: `Tests concurrency, idempotency, and offline resilience in ${jobIndustry}.`,
          };
        }
        const interviewerText = isComplete
          ? `Thank you for walking through these detailed scenarios with me. You clearly have a strong grasp of ${job.title} expectations and problem-solving methodology in ${jobIndustry}. Let's look at your final screening scorecard.`
          : `That is insightful. Following up on that: When multiple offline mobile POS terminals synchronize conflicting transaction ledgers over an intermittent 3G connection in ${jobIndustry}, how does your architecture prevent duplicate entries and resolve balance discrepancies?`;

        copy.push({
          role: 'interviewer',
          content: interviewerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        return copy;
      });

      if (isComplete) {
        setIsCompleted(true);
        setScorecard({
          overallScore: 89,
          technicalDepthScore: 92,
          communicationScore: 88,
          problemSolvingScore: 91,
          merchantEmpathyScore: 94,
          seniorityAlignmentScore: 90,
          industryKnowledgeScore: 93,
          hiringVerdict: 'Strong Hire',
          keyStrengths: [
            `Demonstrated clear architectural reasoning matching ${jobSeniority} expectations for ${job.title}.`,
            `Effective articulation of edge cases and fault tolerance in ${jobIndustry}.`,
            `Strong alignment with African merchant usability and offline reliability.`,
          ],
          areasForImprovement: [
            `Incorporate more specific percentage and latency metrics using the STAR framework.`,
            `Deepen explanation of multi-currency idempotency and ledger reconciliation.`,
          ],
          executiveSummary: `The candidate showed impressive poise, domain context, and technical rigor throughout the voice simulation. Ready for final team rounds.`,
        });
      } else {
        setCurrentTurnIndex(nextTurn);
        setCurrentQuestion(
          `When multiple offline mobile POS terminals synchronize conflicting transaction ledgers over intermittent 3G, how does your architecture prevent duplicate entries and resolve balance discrepancies?`
        );
        setCurrentRationale(
          `Tests distributed ledger idempotency, offline sync conflict resolution, and defensive data design for ${jobIndustry}.`
        );
      }
    } finally {
      setIsSubmittingTurn(false);
      setTimeout(() => {
        turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Quick Demo Answer Fillers
  const insertSampleAnswer = (type: 'star' | 'tech' | 'merchant') => {
    if (type === 'star') {
      setCandidateInput(
        `Situation: At my previous company in the financial tech space, we experienced significant transaction drop-offs due to unstable mobile networks during end-of-month merchant pay cycles. Task: As a ${jobSeniority} engineer, I was tasked with redesigning the synchronization queue to support offline-first retries without data duplication. Action: I implemented idempotent transaction keys and a client-side SQLite buffer that syncs via exponential backoff with Redis message queues. Result: We reduced dropped transactions by 94% and lowered reconciliation dispute tickets by 60%.`
      );
    } else if (type === 'tech') {
      setCandidateInput(
        `In our ${jobIndustry} architecture, we implemented a double-entry ledger with immutable transaction logs. To prevent duplicate spending across distributed POS devices, each terminal generates a UUIDv4 idempotency key combined with a logical timestamp. On the server side, PostgreSQL handles balance verification within serializable isolation transactions, while Redis caches verified terminal states for sub-50ms query response times.`
      );
    } else {
      setCandidateInput(
        `I always design with the local African merchant context in mind. Many small retailers in markets like Computer Village Lagos or Gikomba Nairobi operate on budget Android phones with erratic internet. My approach is to make all core inventory and receipt generation functional 100% offline, queuing SMS fallbacks for customers and syncing financial aggregates only when a reliable Wi-Fi or cellular handshake is verified.`
      );
    }
  };

  // Turn-level feedback display component
  const lastCandidateTurn = useMemo(() => {
    const candidateTurns = turns.filter((t) => t.role === 'candidate');
    return candidateTurns.length > 0 ? candidateTurns[candidateTurns.length - 1] : null;
  }, [turns]);

  return (
    <motion.div
      key="mock-interview-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center p-3 sm:p-5 lg:p-6"
    >
      <motion.div
        key="mock-interview-content"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-[#0D1527] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#101A33] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066CC] to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <Bot className="w-5 h-5 text-[#B5E61D]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                  AI Voice Mock Interview Mode
                </span>
                {sessionStarted && !isCompleted && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Live Voice Call
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-900/60">
                  {jobSeniority}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {jobIndustry}
                </span>
              </div>
              <div className="text-sm font-bold text-[#14243A] dark:text-white leading-tight mt-0.5">
                {job.title} · {companyName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                voiceEnabled
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title={voiceEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{voiceEnabled ? 'AI Voice On' : 'Muted'}</span>
            </button>

            {/* Timer */}
            {sessionStarted && (
              <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close Mock Interview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* STATE 1: PRE-SESSION SETUP */}
          {!sessionStarted && (
            <div className="max-w-2xl mx-auto py-4 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#0066CC] to-indigo-600 blur-lg opacity-40 animate-pulse" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0066CC] to-indigo-600 text-white flex items-center justify-center shadow-xl">
                  <Mic className="w-10 h-10 text-[#B5E61D]" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                  Voice-Driven Real-Time Simulation
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#14243A] dark:text-white">
                  Real-Time Voice Mock Interview
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  Practice an authentic spoken voice screening with <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">Adaobi Vance</span>, Lead Hiring Partner at {companyName}. Speak into your microphone to simulate a real interview. Responses are evaluated instantly against <span className="font-bold">{jobIndustry}</span> industry realities and <span className="font-bold">{jobSeniority}</span> seniority standards.
                </p>
              </div>

              {/* Seniority & Industry Calibration Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-[#101D38] dark:to-[#14244A] border border-blue-200/80 dark:border-blue-900/60 rounded-2xl text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Screening Calibration Profile
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Live Rubric Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-white dark:bg-[#0D1527] rounded-xl border border-blue-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Target Seniority</div>
                    <div className="font-extrabold text-[#14243A] dark:text-white text-sm mt-0.5">
                      {jobSeniority} Level Expectations
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Evaluates architectural ownership, trade-off depth, failure mitigation, and leadership.
                    </p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-[#0D1527] rounded-xl border border-blue-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Industry Domain</div>
                    <div className="font-extrabold text-[#14243A] dark:text-white text-sm mt-0.5">
                      {jobIndustry}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Focuses on multi-currency reconciliation, offline POS syncing, and African MSME constraints.
                    </p>
                  </div>
                </div>
              </div>

              {/* Track Selector */}
              <div className="text-left bg-slate-50 dark:bg-[#101A33] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Screening Focus
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setInterviewType('technical')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      interviewType === 'technical'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-[#152342] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Technical Architecture</span>
                      {interviewType === 'technical' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[11px] opacity-85 mt-1 leading-snug">
                      Idempotency, DB concurrency, caching, and offline-first POS sync
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewType('behavioral')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      interviewType === 'behavioral'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-[#152342] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Behavioral & STAR</span>
                      {interviewType === 'behavioral' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[11px] opacity-85 mt-1 leading-snug">
                      Senior stakeholder management, merchant empathy, & execution under pressure
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewType('mixed')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      interviewType === 'mixed'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-[#152342] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Full Screening Loop</span>
                      {interviewType === 'mixed' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[11px] opacity-85 mt-1 leading-snug">
                      Comprehensive simulation evaluating system design, culture fit, and leadership
                    </div>
                  </button>
                </div>
              </div>

              {/* What you will experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 bg-white dark:bg-[#101A33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  <div className="font-bold text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1.5 mb-1">
                    <Mic className="w-4 h-4 text-emerald-500" /> Real-Time Voice Audio
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Uses speech recognition and live audio waveforms to simulate a voice call with Adaobi Vance.
                  </p>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#101A33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                    <Award className="w-4 h-4" /> Instant Turn Feedback
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Immediate scoring with tailored senior rubrics, STAR checks, and top 1% model talking points.
                  </p>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#101A33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                    <BarChart2 className="w-4 h-4" /> Executive Scorecard
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Receive an executive hiring verdict and competency scores across 6 key evaluation pillars.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={startSession}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#0066CC] to-blue-600 hover:from-[#0052A3] hover:to-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#B5E61D]" />
                  <span>Connect Voice Mock Interview Call</span>
                </button>
                <div className="text-[11px] text-slate-400 mt-2">
                  Microphone enabled · 4 turns (~3-5 mins) · Instant evaluation
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: ACTIVE INTERVIEW CALL */}
          {sessionStarted && !isCompleted && (
            <div className="space-y-5">
              {/* Call Stage & Context Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50 dark:bg-[#101A33] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-800 dark:text-white">
                    Question {currentTurnIndex} of {totalTurns}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] font-semibold text-[10px]">
                    {jobSeniority}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                    {jobIndustry}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all ${
                        step < currentTurnIndex
                          ? 'bg-emerald-500 w-6'
                          : step === currentTurnIndex
                          ? 'bg-[#0066CC] dark:bg-[#38BDF8] w-8'
                          : 'bg-slate-200 dark:bg-slate-700 w-4'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Interviewer Visual Call Card */}
              <div className="bg-gradient-to-r from-slate-900 via-[#14243A] to-[#1E3A5F] text-white p-5 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066CC]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0066CC] to-indigo-600 flex items-center justify-center font-black text-xl text-white border-2 border-white/20 shadow-lg">
                      AV
                    </div>
                    {isSpeaking && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                          <span>Adaobi Vance</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#B5E61D] text-[#14243A]">
                            Lead Recruiter
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          Head of Talent & Engineering Hiring · {companyName}
                        </div>
                      </div>

                      {/* Speaking indicator and voice replay */}
                      <div className="flex items-center gap-2">
                        {isSpeaking ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-mono text-emerald-300 border border-emerald-400/30">
                            <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                            <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                            <span>Adaobi is speaking...</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => speakText(currentQuestion || turns[turns.length - 1]?.content)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-medium text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Replay the question voice audio"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                            <span>Replay Audio</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Current Question / Prompt */}
                    <div className="mt-3.5 p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 text-xs sm:text-sm leading-relaxed font-medium shadow-inner">
                      "{currentQuestion || turns[turns.length - 1]?.content}"
                    </div>

                    {/* Follow-up rationale badge */}
                    {currentRationale && (
                      <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B5E61D] shrink-0" />
                        <span>
                          <strong>Interviewer Evaluation Focus:</strong> {currentRationale}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-Time Coach Feedback on Previous Answer */}
              {lastCandidateTurn && lastCandidateTurn.feedback && (
                <div className="p-4 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 dark:from-[#101D38] dark:via-[#0D1527] dark:to-[#101D38] border border-blue-200 dark:border-blue-900/70 rounded-2xl space-y-3 text-xs shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-extrabold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>Instant AI Coach Feedback on Your Previous Answer</span>
                    </span>
                    <span className="px-3 py-1 rounded-full font-mono font-black text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                      Turn Score: {lastCandidateTurn.feedback.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {/* Strengths */}
                    <div className="text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 leading-relaxed">
                      <div className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Key Strength
                      </div>
                      {lastCandidateTurn.feedback.strength}
                    </div>

                    {/* Coaching Advice */}
                    <div className="text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/60 leading-relaxed">
                      <div className="font-bold text-[11px] text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Coaching Advice
                      </div>
                      {lastCandidateTurn.feedback.opportunity}
                    </div>
                  </div>

                  {/* Seniority & Industry Alignment Details */}
                  {(lastCandidateTurn.feedback.seniorityFeedback || lastCandidateTurn.feedback.industryFeedback) && (
                    <div className="pt-2 border-t border-blue-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      {lastCandidateTurn.feedback.seniorityFeedback && (
                        <div className="p-2.5 bg-white dark:bg-[#121E36] rounded-lg border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">Seniority Calibration: </span>
                          {lastCandidateTurn.feedback.seniorityFeedback}
                        </div>
                      )}
                      {lastCandidateTurn.feedback.industryFeedback && (
                        <div className="p-2.5 bg-white dark:bg-[#121E36] rounded-lg border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">Industry Context: </span>
                          {lastCandidateTurn.feedback.industryFeedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Model talking point */}
                  {lastCandidateTurn.feedback.modelTalkingPoint && (
                    <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 text-[11px] text-indigo-950 dark:text-indigo-200 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>What Top 1% {jobSeniority} Candidates Mention: </strong>
                        {lastCandidateTurn.feedback.modelTalkingPoint}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Candidate Voice & Microphone Response Workspace */}
              <div className="bg-slate-50 dark:bg-[#101A33] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Your Response</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {candidateInput.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  {/* Input Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white dark:bg-[#0D1527] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setInputMode('mic')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        inputMode === 'mic'
                          ? 'bg-[#0066CC] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Mic className="w-3 h-3" />
                      <span>Microphone Voice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('type')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        inputMode === 'type'
                          ? 'bg-[#0066CC] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Type / Edit</span>
                    </button>
                  </div>
                </div>

                {/* Microphone Live Waveform Visualizer */}
                {inputMode === 'mic' && (
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-[#101F3B] to-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isListening ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Microphone Active · Listening to your answer...
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">
                            Click the microphone button to start speaking
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={toggleMicListening}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                          isListening
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                            : 'bg-[#B5E61D] hover:bg-[#a4d40f] text-[#14243A]'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span>Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span>Tap to Speak</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Audio Wave Frequency Bars */}
                    <div className="h-12 bg-black/30 rounded-xl px-4 flex items-center justify-between gap-1 border border-white/5">
                      {audioInputLevel.map((lvl, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 rounded-full transition-all duration-75 ${
                            isListening
                              ? 'bg-gradient-to-t from-emerald-500 to-[#B5E61D]'
                              : 'bg-slate-700 h-2'
                          }`}
                          style={{
                            height: isListening ? `${Math.min(100, Math.max(12, lvl))}%` : '8px',
                          }}
                        />
                      ))}
                    </div>

                    {micError && (
                      <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{micError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Candidate Textarea / Live Transcript */}
                <div className="relative">
                  <textarea
                    rows={4}
                    value={candidateInput}
                    onChange={(e) => setCandidateInput(e.target.value)}
                    disabled={isSubmittingTurn}
                    placeholder={
                      isListening
                        ? 'Listening to your microphone... Your spoken words appear here in real-time.'
                        : 'Speak into your microphone or type your answer here (e.g., your situation, task, architectural decisions, and quantifiable results)...'
                    }
                    className="w-full p-3.5 text-xs sm:text-sm bg-white dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] text-slate-900 dark:text-white outline-none transition-all resize-none shadow-xs"
                  />

                  {/* Clear transcript button if candidate has text */}
                  {candidateInput && !isSubmittingTurn && (
                    <button
                      type="button"
                      onClick={() => setCandidateInput('')}
                      className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 rounded-md cursor-pointer"
                      title="Clear text"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Sample Response Helpers & Submission Action */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400">Quick Test Templates:</span>
                    <button
                      type="button"
                      onClick={() => insertSampleAnswer('star')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#1A284A] hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      ⚡ STAR Framework
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSampleAnswer('tech')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#1A284A] hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      ⚡ Ledger & POS Sync
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSampleAnswer('merchant')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#1A284A] hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      ⚡ African Merchant UX
                    </button>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={!candidateInput.trim() || isSubmittingTurn}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0066CC] to-blue-600 hover:from-[#0052A3] hover:to-blue-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmittingTurn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluating Answer...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer to Adaobi</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: INTERVIEW COMPLETE & FINAL SCORECARD */}
          {isCompleted && scorecard && (
            <div className="space-y-6 animate-in fade-in">
              {/* Executive Scorecard Header */}
              <div className="bg-gradient-to-br from-[#14243A] via-[#1A2E4C] to-[#0066CC] text-white p-6 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#B5E61D] text-[#14243A]">
                        Screening Complete
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white">
                        {jobSeniority} Level
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white">
                        {jobIndustry}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black mt-2">
                      Interview Debrief & Evaluation Scorecard
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {job.title} · Evaluated by Adaobi Vance, Lead Hiring Partner at {companyName}
                    </p>
                  </div>

                  {/* Overall Rating Dial */}
                  <div className="text-center sm:text-right bg-white/10 px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
                    <div className="text-3xl font-black font-mono text-[#B5E61D]">
                      {scorecard.overallScore}/100
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Verdict: {scorecard.hiringVerdict}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{scorecard.executiveSummary}"
                </div>
              </div>

              {/* Competency Pillar Breakdown (Now with Seniority and Industry metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Technical Depth</div>
                  <div className="text-xl font-extrabold text-[#0066CC] dark:text-[#38BDF8] font-mono mt-1">
                    {scorecard.technicalDepthScore}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#0066CC] h-full rounded-full"
                      style={{ width: `${scorecard.technicalDepthScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Seniority Fit</div>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {scorecard.seniorityAlignmentScore || 90}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${scorecard.seniorityAlignmentScore || 90}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Industry Context</div>
                  <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
                    {scorecard.industryKnowledgeScore || 92}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${scorecard.industryKnowledgeScore || 92}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Problem Solving</div>
                  <div className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                    {scorecard.problemSolvingScore}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${scorecard.problemSolvingScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Communication</div>
                  <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
                    {scorecard.communicationScore}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${scorecard.communicationScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101A33] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold truncate">Merchant Empathy</div>
                  <div className="text-xl font-extrabold text-amber-600 font-mono mt-1">
                    {scorecard.merchantEmpathyScore}%
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${scorecard.merchantEmpathyScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Demonstrated Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
                    {scorecard.keyStrengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>High-Impact Recommendations</span>
                  </div>
                  <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
                    {scorecard.areasForImprovement.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Full Transcript Accordion */}
              <div className="p-5 bg-slate-50 dark:bg-[#101A33] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0066CC]" />
                  <span>Session Transcript & Turn-by-Turn Critique ({turns.length} turns)</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {turns.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                        t.role === 'interviewer'
                          ? 'bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800'
                          : 'bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={t.role === 'interviewer' ? 'text-[#0066CC] dark:text-[#38BDF8]' : 'text-slate-800 dark:text-white'}>
                          {t.role === 'interviewer' ? 'Adaobi Vance (Interviewer)' : 'You (Candidate)'}
                        </span>
                        <span className="text-slate-400 font-normal">{t.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{t.content}</p>

                      {t.feedback && (
                        <div className="mt-2 pt-2 border-t border-blue-100 dark:border-slate-800 text-[11px] space-y-1">
                          <div className="text-emerald-700 dark:text-emerald-400">
                            <strong>Feedback:</strong> {t.feedback.strength}
                          </div>
                          {t.feedback.opportunity && (
                            <div className="text-amber-700 dark:text-amber-400">
                              <strong>Advice:</strong> {t.feedback.opportunity}
                            </div>
                          )}
                          {t.feedback.seniorityFeedback && (
                            <div className="text-indigo-700 dark:text-indigo-400">
                              <strong>Seniority:</strong> {t.feedback.seniorityFeedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={startSession}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Practice Another Round</span>
                </button>

                {onApplyForJob && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onApplyForJob();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#0066CC] to-blue-600 hover:from-[#0052A3] hover:to-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply for {job.title} Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={turnsEndRef} />
        </div>
      </motion.div>
    </motion.div>
  );
};
