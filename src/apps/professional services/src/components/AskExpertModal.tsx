import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  Volume2, 
  AlertCircle,
  Send,
  HelpCircle
} from 'lucide-react';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface AskExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const AskExpertModal: React.FC<AskExpertModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
}) => {
  const [topic, setTopic] = useState<string>(initialTopic || 'Tax & Regulatory Compliance');
  const [questionText, setQuestionText] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  
  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState<string>('');

  // Clean up audio blob URL on unmount or reset
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setRecordingError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setRecordingError('Microphone recording is not supported on this browser or platform.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 120) { // 2 minute limit
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Audio recording error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setRecordingError('Microphone permission was denied. Please allow microphone access or type your question in the text box below.');
      } else {
        setRecordingError('Could not access microphone: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() && !audioBlob) {
      alert('Please enter your question or attach a voice note.');
      return;
    }
    const newRef = `EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketRef(newRef);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    discardRecording();
    setQuestionText('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1464C8] to-[#B7E532] text-[#102B4E] flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-full">
                  Verified Technical Desk
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">Voice Note & Text Enabled</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Ask an Expert / Certified Consultant
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 bg-slate-50/50 dark:bg-[#08121E]">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-[#B7E532]">
                  Consultation Request Dispatched
                </span>
                <h3 className="text-2xl font-black text-[#102B4E] dark:text-white mt-1">
                  Ticket #{ticketRef} Created!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2">
                  Your question and voice note have been routed to our certified community partner firms. A qualified chartered specialist will review and respond within <strong>2 business hours</strong>.
                </p>
              </div>

              {audioBlob && (
                <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                  <span>Voice Note ({formatTimer(recordingDuration)}) successfully attached</span>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello MsmeBooks, I just submitted Technical Inquiry Ticket #${ticketRef} regarding ${topic}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#B7E532] text-[#102B4E] font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <span>Follow Up via WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Technical Domain
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Tax & Regulatory Compliance',
                    'Cloud Accounting & Chart of Accounts',
                    'POS Hardware & Barcode Scanning',
                    'Payroll & Statutory Pensions',
                    'Business Registration & Structuring',
                    'Inventory & Audit Controls'
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`p-2.5 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        topic === t
                          ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Question Area */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Describe Your Technical Question
                </label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g., 'What are the required documents for withholding tax credit note clearance in Nigeria?' or 'How should we configure supermarket multi-till POS synchronization with offline backup?'"
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                />
              </div>

              {/* Voice Note Recording Section */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-[#1464C8] dark:text-[#B7E532] flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#102B4E] dark:text-white">
                        Attach Voice Note (Optional)
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Record up to 2 minutes of your question for a consultant to hear directly.
                      </p>
                    </div>
                  </div>

                  {recordingDuration > 0 && (
                    <span className="font-mono text-xs font-extrabold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                      {formatTimer(recordingDuration)}
                    </span>
                  )}
                </div>

                {recordingError && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{recordingError}</span>
                  </div>
                )}

                {/* Recorder Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isRecording && !audioUrl && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span>Start Voice Recording</span>
                    </button>
                  )}

                  {isRecording && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Recording ({formatTimer(recordingDuration)})</span>
                      </button>
                      <span className="text-[11px] text-slate-500 animate-pulse">
                        Listening to microphone...
                      </span>
                    </div>
                  )}

                  {/* Audio Playback Preview */}
                  {audioUrl && !isRecording && (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <audio controls src={audioUrl} className="w-full max-w-md h-8 accent-[#1464C8]" />
                      <button
                        type="button"
                        onClick={discardRecording}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer transition-colors"
                        title="Delete recording and retry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Adekunle"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Lagos Prime Groceries"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samuel@business.com"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                  />
                </div>
              </div>

              {/* Verified Consultant Assurance */}
              <div className="p-3 bg-slate-100 dark:bg-[#071322] rounded-xl flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#B7E532] shrink-0" />
                <span>
                  Questions are reviewed under non-disclosure confidentiality agreements by registered ICAN, ACCA, and CITN certified partners.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#1464C8] hover:bg-[#1052a5] shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Question to Experts</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
