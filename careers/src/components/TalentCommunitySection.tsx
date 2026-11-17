import React, { useState } from 'react';
import { Users, Send, CheckCircle2 } from 'lucide-react';
import { WorkArrangement, TalentCommunityMember } from '../types/career';

interface TalentCommunityProps {
  onRegisterTalent: (member: TalentCommunityMember) => void;
}

export const TalentCommunitySection: React.FC<TalentCommunityProps> = ({ onRegisterTalent }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [areaOfInterest, setAreaOfInterest] = useState('Software Engineering');
  const [preferredArrangement, setPreferredArrangement] = useState<WorkArrangement | 'Any'>('Remote');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please provide your name and a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please consent to recruitment communications.');
      return;
    }

    const member: TalentCommunityMember = {
      id: `tc-${Date.now()}`,
      fullName,
      email,
      country,
      areaOfInterest,
      preferredArrangement,
      registeredAt: new Date().toISOString(),
    };

    onRegisterTalent(member);
    setSubmitted(true);
    setError('');
  };

  return (
    <section id="talent-community" className="py-20 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-[#14243A] dark:from-[#09101F] dark:to-[#111C33] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-transparent dark:border-slate-800">
          {/* Subtle Lemon green background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B5E61D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0066CC]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-white/5 rounded-full text-xs font-semibold text-[#B5E61D] mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>MsmeBooks Talent Community</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Your Next Opportunity Could Be Around the Corner.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-normal">
                Don't see a position that matches your skills today? Join our talent community and be among the first to hear about future opportunities as MsmeBooks expands into new markets across Africa.
              </p>

              <div className="mt-8 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D]" />
                  <span>Early access notifications before public postings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D]" />
                  <span>Direct matching by our Pan-African talent acquisition team</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D]" />
                  <span>Invitations to exclusive MsmeBooks engineering and product tech talks</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Registration Form */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-[#131D35] rounded-2xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-xl border border-slate-100 dark:border-slate-700/80">
                {submitted ? (
                  <div className="py-8 text-center space-y-3 animate-in fade-in">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#14243A] dark:text-white">Welcome to the Community!</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. We've added you to our talent roster for <strong>{areaOfInterest}</strong>. You'll receive updates when relevant roles open.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFullName('');
                        setEmail('');
                      }}
                      className="text-xs font-semibold text-[#0066CC] dark:text-[#38BDF8] hover:underline pt-2 inline-block"
                    >
                      Register another profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-base font-bold text-[#14243A] dark:text-white">
                      Join Our Talent Community
                    </h3>

                    {error && (
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Amina Diallo"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="amina@example.com"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Country
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Rwanda">Rwanda</option>
                          <option value="Ghana">Ghana</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Other">Other African Country / Diaspora</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Area of Interest
                        </label>
                        <select
                          value={areaOfInterest}
                          onChange={(e) => setAreaOfInterest(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                        >
                          <option value="Software Engineering">Software Engineering</option>
                          <option value="Product & Design">Product & Design</option>
                          <option value="Sales & Business Development">Sales & Business Dev</option>
                          <option value="Marketing & Communications">Marketing & Growth</option>
                          <option value="Finance & Accounting">Finance & Accounting</option>
                          <option value="Customer Success">Customer Success</option>
                          <option value="Data & Artificial Intelligence">Data & AI</option>
                          <option value="Internships & Graduate Programs">Graduate Trainee</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Work Arrangement
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 text-xs">
                        {(['Remote', 'Hybrid', 'On-site', 'Any'] as const).map((arr) => (
                          <button
                            type="button"
                            key={arr}
                            onClick={() => setPreferredArrangement(arr)}
                            className={`py-1.5 text-center rounded-lg border transition-colors ${
                              preferredArrangement === arr
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8] font-semibold'
                                : 'bg-slate-50 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#20325A]'
                            }`}
                          >
                            {arr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0066CC] mt-0.5"
                        />
                        <span>
                          I agree to MsmeBooks retaining my details for future career openings. You may unsubscribe anytime.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Join Our Talent Community</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
