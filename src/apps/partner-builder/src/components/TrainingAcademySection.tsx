import React, { useState } from 'react';
import { TRAINING_MODULES } from '../data/partnersData';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import { OfficialPartnerBadge } from './OfficialPartnerBadge';
import { TrainingCohortCountdown } from './TrainingCohortCountdown';
import { CertificatePreview } from './CertificatePreview';
import { useLanguage } from '../context/LanguageContext';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  User, 
  ArrowRight, 
  Eye,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface TrainingAcademySectionProps {
  onOpenApply: () => void;
}

export const TrainingAcademySection: React.FC<TrainingAcademySectionProps> = ({ onOpenApply }) => {
  const { t } = useLanguage();
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [candidateName, setCandidateName] = useState('Adebayo O. Johnson, FCA');
  const [companyName, setCompanyName] = useState('Apex Financial Advisory');
  const [selectedTrack, setSelectedTrack] = useState('Certified Implementation Specialist (CIS)');
  const [previewTier, setPreviewTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('gold');

  const handleOpenStudio = (customName?: string, customTrack?: string, customTier?: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    if (customName) setCandidateName(customName);
    if (customTrack) setSelectedTrack(customTrack);
    if (customTier) setPreviewTier(customTier);
    setShowCertificateModal(true);
  };

  return (
    <section id="academy" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
              {t('academy.tag', 'Partner Enablement & Academy')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
              {t('academy.title', 'Learn. Get Certified. Grow.')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6">
              {t('academy.desc', 'Our structured certification curriculum equips your engineers, accountants, and consultants with enterprise implementation methodologies. Learn how to configure multi-branch POS networks, automate statutory taxes, and execute flawless data migrations.')}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleOpenStudio()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#061F4A]" />
                Interactive Certificate & Badge Studio
              </button>
              <button
                onClick={onOpenApply}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Enroll in Partner Academy
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-blue-800/80 aspect-[16/10] bg-slate-900">
              <img
                src="/src/assets/images/partner_training_academy_1793445607501.jpg"
                alt="African professionals attending MsmeBooks training seminar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-bold text-[#8CE600] uppercase tracking-wider">
                  Accredited Classroom & Online Labs
                </div>
                <div className="text-sm font-semibold">
                  Training sessions hosted quarterly across Lagos, Nairobi, and online.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE: TrainingCohortCountdown Component (Intake Urgency Timer) */}
        <TrainingCohortCountdown 
          onOpenApply={onOpenApply} 
          onOpenStudio={() => handleOpenStudio()} 
        />

        {/* FEATURE: Certificate Preview Feature Component (Dynamic Mock Certification Badge) */}
        <CertificatePreview
          onOpenStudio={(name, track, tier) => handleOpenStudio(name, track, tier)}
          onOpenApply={onOpenApply}
        />

        {/* Distinction Notice (Section 12 mandate) */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 mb-12 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Important Programme Distinction:</strong> An <em>Official Membership Badge</em> (Bronze, Silver, Gold, Platinum) signifies your partnership agreement tier and revenue entitlement. A <em>Professional Training Certification</em> (e.g., Certified Implementation Specialist) is an earned individual accreditation verifying technical mastery in MsmeBooks deployment and compliance.
          </p>
        </div>

        {/* 6 Structured Course Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAINING_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800/80 p-6 shadow-sm hover:border-[#0A3981]/40 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-[#061F4A] px-2 py-0.5 rounded border border-transparent dark:border-blue-900">
                    {mod.code}
                  </span>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {mod.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {mod.lessons} lessons
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                  {mod.title}
                </h3>

                <div className="space-y-1.5 mb-6">
                  {mod.topics.map((t, idx) => (
                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600] shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenStudio(candidateName, mod.title)}
                  className="text-xs font-semibold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Preview Badge
                </button>
                <button 
                  onClick={onOpenApply}
                  className="text-xs font-bold text-[#0A3981] dark:text-sky-300 hover:underline cursor-pointer"
                >
                  Start Module →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Interactive Certificate & Badge Studio Modal */}
      <CertificatePreviewModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        onOpenApply={onOpenApply}
        initialName={candidateName}
        initialTier={previewTier}
      />
    </section>
  );
};

