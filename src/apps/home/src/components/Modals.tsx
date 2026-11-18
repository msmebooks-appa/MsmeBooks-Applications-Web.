import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface ModalsProps {
  isStartFreeOpen: boolean;
  isBookDemoOpen: boolean;
  isVideoOpen: boolean;
  onCloseStartFree: () => void;
  onCloseBookDemo: () => void;
  onCloseVideo: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isStartFreeOpen,
  isBookDemoOpen,
  isVideoOpen,
  onCloseStartFree,
  onCloseBookDemo,
  onCloseVideo,
}) => {
  // Start Free Trial Form state
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [trialForm, setTrialForm] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    industry: 'Retail & Supermarket',
    branches: '1 branch',
  });

  // Demo Form state
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    date: '2026-09-18',
    time: '11:00 AM WAT',
  });

  // Video Chapter state
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);
  const videoChapters = [
    { title: 'Morning Opening & Float Setup', duration: '0:35' },
    { title: 'POS Barcode Scanning & Checkout', duration: '1:10' },
    { title: 'Inter-Branch Stock Transfer', duration: '1:45' },
    { title: 'Sending WhatsApp Invoices', duration: '2:15' },
    { title: 'Daily P&L & Cash Reconciliation', duration: '2:50' },
  ];

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialSubmitted(true);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <>
      {/* 1. START FREE TRIAL MODAL */}
      {isStartFreeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
            <button
              onClick={onCloseStartFree}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {trialSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  Welcome to MsmeBooks!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Your 14-day free workspace for <strong>{trialForm.businessName || 'Your Business'}</strong> is ready. Check your WhatsApp and email for your instant credentials.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setTrialSubmitted(false);
                      onCloseStartFree();
                    }}
                    className="px-6 py-3 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md"
                  >
                    Enter Your Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>14-Day Full Feature Free Trial</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                    Start Your Free Trial
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No credit card required &bull; Cancel anytime &bull; Free onboarding
                  </p>
                </div>

                <form onSubmit={handleTrialSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business or Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={trialForm.businessName}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, businessName: e.target.value })
                      }
                      placeholder="e.g. Afrimart Supermarkets Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={trialForm.fullName}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Babatunde Adeleke"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={trialForm.phone}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, phone: e.target.value })
                        }
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={trialForm.email}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, email: e.target.value })
                      }
                      placeholder="e.g. founder@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Country
                      </label>
                      <select
                        value={trialForm.country}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, country: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900 font-medium"
                      >
                        <option>🇳🇬 Nigeria</option>
                        <option>🇰🇪 Kenya</option>
                        <option>🇬🇭 Ghana</option>
                        <option>🇿🇦 South Africa</option>
                        <option>🇷🇼 Rwanda</option>
                        <option>🇺🇬 Uganda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Branches
                      </label>
                      <select
                        value={trialForm.branches}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, branches: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900 font-medium"
                      >
                        <option>1 single location</option>
                        <option>2 - 4 branches</option>
                        <option>5 - 10 branches</option>
                        <option>10+ branches / Chains</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Create Free Account Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7F000]" />
                    <span>Your data is protected under 256-bit encryption</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. BOOK A DEMO MODAL */}
      {isBookDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative transition-colors duration-200">
            <button
              onClick={onCloseBookDemo}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300 mx-auto flex items-center justify-center">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  Demo Confirmed!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  A calendar invite and Zoom/Google Meet link have been sent to <strong>{demoForm.email}</strong>. Our African solutions team will walk you through your exact industry workflow.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setDemoSubmitted(false);
                      onCloseBookDemo();
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-[#0866FF] hover:bg-slate-800 dark:hover:bg-[#0752D4] text-white font-bold text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Personalized 1-on-1 Walkthrough</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                    Book a Live Demo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    See how MsmeBooks can eliminate manual bookkeeping and stock shrinkage for your business.
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={demoForm.businessName}
                      onChange={(e) =>
                        setDemoForm({ ...demoForm, businessName: e.target.value })
                      }
                      placeholder="e.g. Palms Hospitality Group"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={demoForm.fullName}
                        onChange={(e) =>
                          setDemoForm({ ...demoForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Kwame Boateng"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Work Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={demoForm.phone}
                        onChange={(e) =>
                          setDemoForm({ ...demoForm, phone: e.target.value })
                        }
                        placeholder="+233 24 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) =>
                        setDemoForm({ ...demoForm, email: e.target.value })
                      }
                      placeholder="kwame@palmshotels.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0866FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={demoForm.date}
                        onChange={(e) =>
                          setDemoForm({ ...demoForm, date: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0866FF]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={demoForm.time}
                        onChange={(e) =>
                          setDemoForm({ ...demoForm, time: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0866FF]"
                      >
                        <option>10:00 AM WAT</option>
                        <option>11:30 AM WAT</option>
                        <option>02:00 PM WAT</option>
                        <option>04:30 PM WAT</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-[#0866FF] hover:bg-slate-800 dark:hover:bg-[#0752D4] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Calendar className="w-4 h-4 text-[#B7F000]" />
                      <span>Confirm Demo Schedule</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CINEMATIC VIDEO PLAYER MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-800 relative text-white">
            <button
              onClick={onCloseVideo}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pr-12">
              <div className="text-xs font-bold text-[#B7F000] uppercase tracking-wider">
                Interactive Product Walkthrough
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                How MsmeBooks Runs a Multi-Store African Business
              </h3>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"
                alt="Product video preview"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover filter brightness-60"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40">
                <div className="w-16 h-16 rounded-full bg-[#0866FF] text-white flex items-center justify-center shadow-xl mb-3 animate-pulse">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <div className="text-lg font-bold font-display text-white">
                  Chapter {activeVideoChapter + 1}: {videoChapters[activeVideoChapter].title}
                </div>
                <div className="text-xs text-slate-300 mt-1 font-mono">
                  Timestamp: {videoChapters[activeVideoChapter].duration} &bull; 1080p High Definition
                </div>
              </div>
            </div>

            {/* Chapter Navigator */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {videoChapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVideoChapter(idx)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    activeVideoChapter === idx
                      ? 'bg-[#0866FF] text-white border-blue-400'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                    <span>Part 0{idx + 1}</span>
                    <span>{ch.duration}</span>
                  </div>
                  <div className="font-semibold line-clamp-1 mt-0.5">{ch.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
