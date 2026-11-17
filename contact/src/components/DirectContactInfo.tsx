import React from 'react';
import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
  MapPin,
  Clock,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export const DirectContactInfo: React.FC = () => {
  const { showToast } = useToast();
  const { tDict } = useLanguage();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `${label}: ${text}`, 'success');
  };

  const contactMethods = [
    {
      id: 'phone',
      title: tDict.direct.phoneTitle,
      value: '+234 915 848 2622',
      href: 'tel:+2349158482622',
      actionLabel: 'Call Now',
      icon: Phone,
      allowCopy: true,
      badge: 'Direct Line',
    },
    {
      id: 'whatsapp',
      title: tDict.direct.whatsappTitle,
      value: '+234 915 848 2622',
      href: 'https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Team%2C%20I%20would%20like%20to%20enquire%20about%20your%20software',
      actionLabel: 'Chat on WhatsApp',
      icon: MessageCircle,
      allowCopy: true,
      badge: 'Instant Response',
    },
    {
      id: 'email',
      title: tDict.direct.emailTitle,
      value: 'support@msmebooks.org',
      secondaryValue: 'sales@msmebooks.org',
      href: 'mailto:support@msmebooks.org',
      actionLabel: 'Email Support',
      icon: Mail,
      allowCopy: true,
      badge: 'Official Inbox',
    },
    {
      id: 'website',
      title: 'Official Website',
      value: 'www.msmebooks.org',
      href: 'https://www.msmebooks.org',
      actionLabel: 'Visit Website',
      icon: Globe,
      allowCopy: true,
      badge: 'Main Portal',
    },
  ];

  return (
    <section id="direct-contact" className="py-16 bg-[#f8fafc] dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-[#70C038] dark:text-[#a1e670] uppercase tracking-wider mb-2">
            {tDict.direct.badge}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
            {tDict.direct.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {tDict.direct.subtitle}
          </p>
        </div>

        {/* 4 Direct Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className="bg-white dark:bg-[#131E35] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#0B3B82]/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0B3B82] dark:text-[#93C5FD]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#4d8b20] dark:text-[#a1e670] bg-[#f2f9eb] dark:bg-lime-950/50 px-2 py-0.5 rounded border border-[#d2edaa] dark:border-lime-900">
                      {method.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words mb-1">
                    {method.value}
                  </p>
                  {method.secondaryValue && (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 break-words">
                      {method.secondaryValue}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={method.href}
                    target={method.id === 'website' || method.id === 'whatsapp' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] hover:text-[#082d64] dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{method.actionLabel}</span>
                    <ExternalLink className="w-3 h-3 text-[#70C038]" />
                  </a>

                  {method.allowCopy && (
                    <button
                      onClick={() => handleCopy(method.value, method.title)}
                      className="p-1.5 text-slate-400 hover:text-[#0B3B82] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      title="Copy to clipboard"
                      aria-label={`Copy ${method.title}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Address & Operating Hours Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Corporate Address */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-[#0B3B82] dark:text-[#93C5FD]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B82] dark:text-white">
                Pan-African Operational Headquarters
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                MsmeBooks Technologies, Victoria Island Commercial Corridor, Lagos, Nigeria.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Regional customer desks serving West, East, Central & Southern Africa.
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f2f9eb] dark:bg-lime-950/50 border border-[#d2edaa] dark:border-lime-900 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-[#70C038]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B82] dark:text-white">
                Official Business Hours
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 space-y-0.5">
                <p>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Monday – Friday:</span> 8:00 AM – 6:00 PM (WAT / UTC+1)
                </p>
                <p>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Saturday:</span> 9:00 AM – 2:00 PM (WAT / UTC+1)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sunday: Emergency critical support for retail & hospitality clients via online portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
