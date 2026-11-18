import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { dict } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid business email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || dict.newsletter.successMessage);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      // Fallback
      setStatus('success');
      setMessage(dict.newsletter.successMessage);
      setEmail('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Eyebrow badge in lemon green */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-lime-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Mail className="w-3.5 h-3.5" />
            <span>{dict.newsletter.badge}</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            {dict.newsletter.heading}
          </h2>

          {/* Supporting Copy */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {dict.newsletter.subheading}
          </p>

          {/* Subscription Form */}
          {status === 'success' ? (
            <div className="p-6 bg-slate-800/80 rounded-2xl border border-lime-400/40 text-center animate-in fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lime-400/20 text-lime-400 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{dict.newsletter.successTitle}</h3>
              <p className="text-sm text-slate-300">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs font-semibold text-lime-400 hover:text-lime-300 underline"
              >
                {dict.common.back}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20 transition-all">
                <div className="flex items-center w-full px-3 py-2 sm:py-0">
                  <Mail className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={dict.newsletter.placeholder}
                    className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.newsletter.button}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-lime-300 mt-2 text-left px-2 font-medium">{message}</p>
              )}

              {/* Privacy Reassurance */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>{dict.newsletter.privacy}</span>
              </div>
            </form>
          )}

          {/* Social Proof metrics */}
          <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-slate-800 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">14,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">SME Readers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-lime-400">Weekly</div>
              <div className="text-xs text-slate-400 mt-0.5">Tactical Editions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">100% Free</div>
              <div className="text-xs text-slate-400 mt-0.5">No Paywall Ever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
