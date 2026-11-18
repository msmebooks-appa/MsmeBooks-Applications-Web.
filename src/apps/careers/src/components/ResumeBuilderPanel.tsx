import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle2,
  Loader2,
  Wand2,
  AlertCircle,
  Target,
  ArrowUpRight,
  Copy,
  Check,
  Gauge,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CandidateWorkExperience, CandidateEducation } from '../types/auth';

export interface ResumeBuilderEducationEntry extends CandidateEducation {
  details?: string;
}

export interface FormattedAtsResume {
  header: {
    fullName: string;
    headline: string;
    contactLine: string;
    linksLine: string;
  };
  professionalSummary: string;
  coreCompetencies: string[];
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
  certifications: string[];
  atsScore: number;
  atsOptimizationNotes: string[];
  source?: string;
}

interface ResumeBuilderPanelProps {
  initialFullName: string;
  initialEmail: string;
  initialPhone: string;
  initialCity: string;
  initialCountry: string;
  initialTargetRole: string;
  initialSkillsText: string;
  initialBio: string;
  initialLinkedinUrl: string;
  initialPortfolioUrl: string;
  initialWorkHistory: CandidateWorkExperience[];
  initialEducation: CandidateEducation[];
  savedWorkHistory?: CandidateWorkExperience[];
  savedEducation?: CandidateEducation[];
  onSyncToProfile?: (payload: {
    fullName: string;
    phone: string;
    city: string;
    country: string;
    targetRole: string;
    skillsText: string;
    bio: string;
    linkedinUrl: string;
    portfolioUrl: string;
    workHistory: CandidateWorkExperience[];
    education: CandidateEducation[];
  }) => Promise<void> | void;
}

export const ResumeBuilderPanel: React.FC<ResumeBuilderPanelProps> = ({
  initialFullName,
  initialEmail,
  initialPhone,
  initialCity,
  initialCountry,
  initialTargetRole,
  initialSkillsText,
  initialBio,
  initialLinkedinUrl,
  initialPortfolioUrl,
  initialWorkHistory,
  initialEducation,
  savedWorkHistory,
  savedEducation,
  onSyncToProfile,
}) => {
  const [fullName, setFullName] = useState(initialFullName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [city, setCity] = useState(initialCity || '');
  const [country, setCountry] = useState(initialCountry || '');
  const [targetRole, setTargetRole] = useState(initialTargetRole || 'Software Engineer');
  const [skillsText, setSkillsText] = useState(initialSkillsText || '');
  const [summaryInput, setSummaryInput] = useState(initialBio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialPortfolioUrl || '');
  const [targetJobKeywords, setTargetJobKeywords] = useState('');
  const [certificationsText, setCertificationsText] = useState('');

  const [experiences, setExperiences] = useState<CandidateWorkExperience[]>(() =>
    initialWorkHistory && initialWorkHistory.length > 0
      ? initialWorkHistory
      : [
          {
            id: `exp-${Date.now()}-1`,
            title: initialTargetRole || 'Senior Software Engineer',
            company: 'MsmeBooks Partner Network',
            period: '2022 – Present',
            location: initialCity ? `${initialCity}, ${initialCountry}` : 'Remote',
            highlights:
              'Led end-to-end delivery of customer-facing web services and payment workflows; improved API latency by 35% and mentored 4 junior engineers.',
          },
        ]
  );

  const [educationList, setEducationList] = useState<ResumeBuilderEducationEntry[]>(() =>
    initialEducation && initialEducation.length > 0
      ? initialEducation.map((ed) => ({ ...ed, details: '' }))
      : [
          {
            id: `edu-${Date.now()}-1`,
            degree: 'B.Sc. Computer Science',
            institution: 'University of Lagos',
            year: '2020',
            details: 'First Class / Second Class Upper Honors',
          },
        ]
  );

  // Keep synced if user imports LinkedIn PDF before switching tabs
  useEffect(() => {
    if (initialWorkHistory && initialWorkHistory.length > 0) {
      setExperiences(initialWorkHistory);
    }
  }, [initialWorkHistory]);

  useEffect(() => {
    if (initialEducation && initialEducation.length > 0) {
      setEducationList((prev) =>
        initialEducation.map((ed, idx) => ({
          ...ed,
          details: prev[idx]?.details || '',
        }))
      );
    }
  }, [initialEducation]);

  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [formattedResume, setFormattedResume] = useState<FormattedAtsResume | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState(false);
  const [copiedPlainText, setCopiedPlainText] = useState(false);

  const effectiveSavedExperiences = useMemo(
    () => (savedWorkHistory && savedWorkHistory.length > 0 ? savedWorkHistory : initialWorkHistory || []),
    [savedWorkHistory, initialWorkHistory]
  );
  const effectiveSavedEducation = useMemo(
    () => (savedEducation && savedEducation.length > 0 ? savedEducation : initialEducation || []),
    [savedEducation, initialEducation]
  );

  // Real-time Resume Strength (0-100%) calculation reacting to Experience, Skills, Education, Header, & Summary
  const resumeStrength = useMemo(() => {
    // 1. Header & Contact (15 pts max)
    let contactPts = 0;
    if (fullName.trim().length >= 2) contactPts += 4;
    if (targetRole.trim().length >= 2) contactPts += 4;
    if (email.trim().includes('@')) contactPts += 3;
    if (phone.trim().length >= 6 || (city.trim() && country.trim())) contactPts += 2;
    if (linkedinUrl.trim().length >= 8 || portfolioUrl.trim().length >= 8) contactPts += 2;

    // 2. Summary & ATS Keywords (15 pts max)
    let summaryPts = 0;
    const summaryLen = summaryInput.trim().length;
    if (summaryLen >= 45) summaryPts += 10;
    else if (summaryLen >= 10) summaryPts += 5;
    if (summaryLen >= 100 || targetJobKeywords.trim().length >= 5) summaryPts += 5;

    // 3. Work Experience (35 pts max)
    const validExperiences = experiences.filter((e) => e.title.trim() && e.company.trim());
    let expPts = 0;
    if (validExperiences.length >= 1) expPts += 15;
    if (validExperiences.length >= 2) expPts += 8;
    const hasDetailedHighlights = validExperiences.some((e) => e.highlights.trim().length >= 35);
    const hasMetricOrDeepImpact = validExperiences.some(
      (e) => e.highlights.trim().length >= 80 || /\d+%|\$\d+|\d+\s*(?:x|ms|yrs|years|users|engineers)/i.test(e.highlights)
    );
    if (hasDetailedHighlights) expPts += 8;
    if (hasMetricOrDeepImpact) expPts += 4;

    // 4. Skills & Certifications (20 pts max)
    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedCerts = certificationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    let skillsPts = 0;
    if (parsedSkills.length >= 6) skillsPts += 16;
    else if (parsedSkills.length >= 3) skillsPts += 11;
    else if (parsedSkills.length >= 1) skillsPts += 6;
    if (parsedCerts.length >= 1 || parsedSkills.length >= 8) skillsPts += 4;

    // 5. Education (15 pts max)
    const validEducation = educationList.filter((ed) => ed.degree.trim() && ed.institution.trim());
    let eduPts = 0;
    if (validEducation.length >= 1) eduPts += 11;
    if (validEducation.some((ed) => ed.year.trim().length >= 2 || (ed.details || '').trim().length >= 4)) {
      eduPts += 4;
    }

    const totalScore = Math.min(100, contactPts + summaryPts + expPts + skillsPts + eduPts);

    let tier = 'Getting Started';
    let strokeColor = '#F59E0B';
    let badgeClass =
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    if (totalScore >= 85) {
      tier = 'Recruiter-Ready';
      strokeColor = '#10B981';
      badgeClass =
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (totalScore >= 60) {
      tier = 'Strong Draft';
      strokeColor = '#0066CC';
      badgeClass =
        'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800';
    }

    // Determine actionable next improvement hint
    let nextHint = 'All core sections look complete — click Build ATS Resume below to generate your PDF!';
    if (validExperiences.length === 0) {
      nextHint = 'Add at least 1 Work Experience role with title & company (+15%).';
    } else if (!hasDetailedHighlights) {
      nextHint = 'Expand your Experience highlights with measurable deliverables (+8–12%).';
    } else if (validEducation.length === 0) {
      nextHint = 'Add an Education entry with degree & institution (+11%).';
    } else if (parsedSkills.length < 6) {
      nextHint = `Add ${6 - parsedSkills.length} more Core Skills to boost ATS keyword matching (+${16 - Math.min(skillsPts, 16)}%).`;
    } else if (summaryPts < 15) {
      nextHint = 'Add a 2–3 sentence Career Summary or target job keywords (+5–15%).';
    } else if (validExperiences.length < 2) {
      nextHint = 'Add a second Work Experience entry for stronger seniority depth (+8%).';
    } else if (contactPts < 15) {
      nextHint = 'Add your LinkedIn or Portfolio URL in Header to reach 100% (+2%).';
    }

    const sections = [
      { id: 'experience', label: 'Experience', pts: expPts, max: 35 },
      { id: 'skills', label: 'Skills', pts: skillsPts, max: 20 },
      { id: 'education', label: 'Education', pts: eduPts, max: 15 },
      { id: 'summary', label: 'Summary', pts: summaryPts, max: 15 },
      { id: 'header', label: 'Header', pts: contactPts, max: 15 },
    ];

    return {
      score: totalScore,
      tier,
      strokeColor,
      badgeClass,
      nextHint,
      sections,
    };
  }, [
    fullName,
    targetRole,
    email,
    phone,
    city,
    country,
    linkedinUrl,
    portfolioUrl,
    summaryInput,
    targetJobKeywords,
    experiences,
    skillsText,
    certificationsText,
    educationList,
  ]);

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        title: '',
        company: '',
        period: '',
        location: 'Remote',
        highlights: '',
      },
    ]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        degree: '',
        institution: '',
        year: '',
        details: '',
      },
    ]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducationList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGenerateAtsResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuilding(true);
    setBuildError(null);

    try {
      const resp = await fetch('/api/build-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: [city.trim(), country.trim()].filter(Boolean).join(', '),
          targetRole: targetRole.trim(),
          linkedinUrl: linkedinUrl.trim(),
          portfolioUrl: portfolioUrl.trim(),
          summaryInput: summaryInput.trim(),
          skills: skillsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          certifications: certificationsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          targetJobKeywords: targetJobKeywords.trim(),
          experiences: experiences.filter((exp) => exp.title.trim() || exp.company.trim() || exp.highlights.trim()),
          education: educationList.filter((ed) => ed.degree.trim() || ed.institution.trim()),
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.success || !data?.resume) {
        throw new Error(data?.error || 'Could not generate ATS-optimized resume.');
      }

      setFormattedResume({
        ...data.resume,
        source: data.source,
      });
    } catch (err: any) {
      setBuildError(err?.message || 'Failed to format resume with Gemini AI.');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSyncToProfile = async () => {
    if (!onSyncToProfile) return;
    await onSyncToProfile({
      fullName,
      phone,
      city,
      country,
      targetRole,
      skillsText,
      bio: formattedResume?.professionalSummary || summaryInput,
      linkedinUrl,
      portfolioUrl,
      workHistory: experiences,
      education: educationList.map(({ id, degree, institution, year }) => ({
        id,
        degree,
        institution,
        year,
      })),
    });
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3000);
  };

  const handleLoadSavedData = () => {
    if (effectiveSavedExperiences.length > 0) {
      setExperiences(effectiveSavedExperiences);
    }
    if (effectiveSavedEducation.length > 0) {
      setEducationList(effectiveSavedEducation.map((ed) => ({ ...ed, details: '' })));
    }
    setFullName(initialFullName || fullName);
    setPhone(initialPhone || phone);
    setCity(initialCity || city);
    setCountry(initialCountry || country);
    setTargetRole(initialTargetRole || targetRole);
    setSkillsText(initialSkillsText || skillsText);
    setSummaryInput(initialBio || summaryInput);
    setLinkedinUrl(initialLinkedinUrl || linkedinUrl);
    setPortfolioUrl(initialPortfolioUrl || portfolioUrl);
    setPdfToast(
      `Loaded saved profile data (${effectiveSavedExperiences.length} roles, ${effectiveSavedEducation.length} education entries) into the builder.`
    );
    setTimeout(() => setPdfToast(null), 3500);
  };

  const handleCopyPlainText = async () => {
    if (!formattedResume) return;
    const lines: string[] = [
      formattedResume.header.fullName.toUpperCase(),
      formattedResume.header.headline,
      formattedResume.header.contactLine,
      formattedResume.header.linksLine,
      '',
      'PROFESSIONAL SUMMARY',
      formattedResume.professionalSummary,
      '',
      'CORE COMPETENCIES',
      formattedResume.coreCompetencies.join(' • '),
      '',
      'PROFESSIONAL EXPERIENCE',
      ...formattedResume.experience.flatMap((exp) => [
        `${exp.title} | ${exp.company} (${exp.location}) — ${exp.period}`,
        ...exp.bullets.map((b) => `- ${b}`),
        '',
      ]),
      'EDUCATION',
      ...formattedResume.education.map(
        (ed) => `${ed.degree} — ${ed.institution} (${ed.year})${ed.details ? ` · ${ed.details}` : ''}`
      ),
    ];

    if (formattedResume.certifications.length > 0) {
      lines.push('', 'CERTIFICATIONS', formattedResume.certifications.join(' • '));
    }

    try {
      await navigator.clipboard.writeText(lines.filter((l) => l !== undefined).join('\n'));
      setCopiedPlainText(true);
      setTimeout(() => setCopiedPlainText(false), 2500);
    } catch {}
  };

  const buildSnapshotFromEntries = (
    expSource: CandidateWorkExperience[],
    eduSource: ResumeBuilderEducationEntry[]
  ): FormattedAtsResume => {
    const cleanLocation = [city.trim(), country.trim()].filter(Boolean).join(', ');
    const contactLine = [cleanLocation, phone.trim(), email.trim()].filter(Boolean).join('  |  ');
    const linksLine = [linkedinUrl.trim(), portfolioUrl.trim()].filter(Boolean).join('  |  ');
    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedCerts = certificationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const structuredExperience = expSource
      .filter((exp) => exp.title.trim() || exp.company.trim() || exp.highlights.trim())
      .map((exp) => {
        const bullets = exp.highlights
          .split(/\n|;/)
          .map((line) => line.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean);
        return {
          title: exp.title.trim() || targetRole.trim() || 'Specialist',
          company: exp.company.trim() || 'Organization',
          location: (exp.location || '').trim() || cleanLocation || 'Remote',
          period: exp.period.trim() || 'Present',
          bullets:
            bullets.length > 0
              ? bullets
              : ['Delivered core initiatives and measurable cross-functional product outcomes.'],
        };
      });

    const structuredEducation = eduSource
      .filter((ed) => ed.degree.trim() || ed.institution.trim())
      .map((ed) => ({
        degree: ed.degree.trim() || 'Degree',
        institution: ed.institution.trim() || 'Institution',
        year: ed.year.trim(),
        details: ed.details?.trim() || '',
      }));

    return {
      header: {
        fullName: fullName.trim() || 'Candidate Resume',
        headline: targetRole.trim() || 'Technology Professional',
        contactLine,
        linksLine,
      },
      professionalSummary:
        summaryInput.trim() ||
        `Results-driven ${targetRole.trim() || 'professional'} experienced in ${
          parsedSkills.slice(0, 5).join(', ') || 'delivering scalable solutions'
        }.`,
      coreCompetencies: parsedSkills,
      experience: structuredExperience,
      education: structuredEducation,
      certifications: parsedCerts,
      atsScore: resumeStrength.score,
      atsOptimizationNotes: [],
    };
  };

  const exportAtsResumePdf = (resumeData: FormattedAtsResume, fileSuffix = 'ATS_Resume') => {
    setIsDownloadingPdf(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let curY = 18;

      const ensureSpace = (neededMm: number) => {
        if (curY + neededMm > pageHeight - 16) {
          doc.addPage();
          curY = 18;
        }
      };

      const drawSectionHeading = (title: string) => {
        ensureSpace(14);
        curY += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(20, 36, 58);
        doc.text(title.toUpperCase(), margin, curY);
        curY += 1.8;
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.45);
        doc.line(margin, curY, pageWidth - margin, curY);
        curY += 5;
      };

      // Candidate Name Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text(resumeData.header.fullName || fullName || 'Candidate Resume', margin, curY);
      curY += 6.5;

      // Target Headline
      if (resumeData.header.headline) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 102, 204);
        doc.text(resumeData.header.headline, margin, curY);
        curY += 5.5;
      }

      // Contact Line
      if (resumeData.header.contactLine) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const contactWrapped = doc.splitTextToSize(resumeData.header.contactLine, contentWidth);
        doc.text(contactWrapped, margin, curY);
        curY += contactWrapped.length * 4.2;
      }

      if (resumeData.header.linksLine) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(0, 102, 204);
        const linksWrapped = doc.splitTextToSize(resumeData.header.linksLine, contentWidth);
        doc.text(linksWrapped, margin, curY);
        curY += linksWrapped.length * 4.2;
      }

      // Professional Summary
      if (resumeData.professionalSummary) {
        drawSectionHeading('Professional Summary');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        const summaryLines = doc.splitTextToSize(resumeData.professionalSummary, contentWidth);
        ensureSpace(summaryLines.length * 4.5 + 4);
        doc.text(summaryLines, margin, curY);
        curY += summaryLines.length * 4.5 + 2;
      }

      // Core Competencies
      if (resumeData.coreCompetencies.length > 0) {
        drawSectionHeading('Core Competencies & Technical Skills');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        const skillsLine = resumeData.coreCompetencies.join('   •   ');
        const skillLines = doc.splitTextToSize(skillsLine, contentWidth);
        ensureSpace(skillLines.length * 4.5 + 4);
        doc.text(skillLines, margin, curY);
        curY += skillLines.length * 4.5 + 2;
      }

      // Professional Experience
      if (resumeData.experience.length > 0) {
        drawSectionHeading('Professional Experience');
        resumeData.experience.forEach((exp) => {
          ensureSpace(16);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.2);
          doc.setTextColor(15, 23, 42);
          doc.text(exp.title, margin, curY);

          if (exp.period) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            const periodWidth = doc.getTextWidth(exp.period);
            doc.text(exp.period, pageWidth - margin - periodWidth, curY);
          }
          curY += 4.5;

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9.3);
          doc.setTextColor(51, 65, 85);
          const companyMeta = [exp.company, exp.location].filter(Boolean).join(' · ');
          doc.text(companyMeta, margin, curY);
          curY += 4.8;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.3);
          doc.setTextColor(30, 41, 59);

          exp.bullets.forEach((bullet) => {
            const cleanBullet = bullet.replace(/^[-•*]\s*/, '').trim();
            if (!cleanBullet) return;
            const wrapped = doc.splitTextToSize(cleanBullet, contentWidth - 5);
            ensureSpace(wrapped.length * 4.3 + 2);
            doc.text('•', margin + 1, curY);
            doc.text(wrapped, margin + 5, curY);
            curY += wrapped.length * 4.3 + 1.2;
          });
          curY += 2.5;
        });
      }

      // Education
      if (resumeData.education.length > 0) {
        drawSectionHeading('Education');
        resumeData.education.forEach((ed) => {
          ensureSpace(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(ed.degree, margin, curY);

          if (ed.year) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            const yrWidth = doc.getTextWidth(ed.year);
            doc.text(ed.year, pageWidth - margin - yrWidth, curY);
          }
          curY += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.3);
          doc.setTextColor(51, 65, 85);
          const instLine = [ed.institution, ed.details].filter(Boolean).join(' — ');
          const instWrapped = doc.splitTextToSize(instLine, contentWidth);
          doc.text(instWrapped, margin, curY);
          curY += instWrapped.length * 4.3 + 2;
        });
      }

      // Certifications
      if (resumeData.certifications.length > 0) {
        drawSectionHeading('Certifications & Credentials');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.3);
        doc.setTextColor(30, 41, 59);
        const certText = resumeData.certifications.join('   •   ');
        const certWrapped = doc.splitTextToSize(certText, contentWidth);
        ensureSpace(certWrapped.length * 4.3 + 4);
        doc.text(certWrapped, margin, curY);
        curY += certWrapped.length * 4.3 + 2;
      }

      const safeName = (resumeData.header.fullName || fullName || 'Candidate').replace(/\s+/g, '_');
      doc.save(`${safeName}_${fileSuffix}.pdf`);
      setPdfToast(
        `ATS-compliant PDF downloaded (${resumeData.experience.length} role${
          resumeData.experience.length === 1 ? '' : 's'
        }, ${resumeData.education.length} education ${
          resumeData.education.length === 1 ? 'entry' : 'entries'
        }).`
      );
      setTimeout(() => setPdfToast(null), 4000);
    } catch (err) {
      console.error('Failed to export ATS PDF:', err);
      setBuildError('Failed to generate PDF file. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadAtsPdf = () => {
    const resumeData = formattedResume || buildSnapshotFromEntries(experiences, educationList);
    exportAtsResumePdf(resumeData, 'ATS_Resume');
  };

  const handleDownloadSavedProfilePdf = () => {
    const expSource = effectiveSavedExperiences.length > 0 ? effectiveSavedExperiences : experiences;
    const eduSource =
      effectiveSavedEducation.length > 0
        ? effectiveSavedEducation.map((ed) => ({ ...ed, details: '' }))
        : educationList;
    const snapshot = buildSnapshotFromEntries(expSource, eduSource);
    exportAtsResumePdf(snapshot, 'Saved_Profile_ATS_Resume');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>AI Resume Builder · ATS-Optimized PDF</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Enter your experience, education, and target role. Gemini AI rewrites your bullets into an ATS-compliant format ready for PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onSyncToProfile && (
            <button
              type="button"
              onClick={handleSyncToProfile}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-[#0066CC] dark:hover:text-[#38BDF8] border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Save to Profile</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadAtsPdf}
            disabled={isDownloadingPdf}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            title="Convert structured resume data into an ATS-compliant PDF document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'Exporting PDF...' : 'Download as PDF'}</span>
          </button>
        </div>
      </div>

      {pdfToast && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pdfToast}</span>
        </div>
      )}

      {syncToast && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Structured experience, education &amp; summary saved to your profile!</span>
        </div>
      )}

      {/* Saved Profile Data Quick-Export Bar */}
      <div className="p-3 bg-blue-50/60 dark:bg-blue-950/25 rounded-xl border border-blue-200/80 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div>
          <span className="font-bold text-[#14243A] dark:text-white flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>
              Saved Profile Data: {effectiveSavedExperiences.length} Experience Role
              {effectiveSavedExperiences.length === 1 ? '' : 's'} · {effectiveSavedEducation.length} Education
            </span>
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
            Instantly convert your saved experience and education records into a cleanly formatted, ATS-compliant PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {(effectiveSavedExperiences.length > 0 || effectiveSavedEducation.length > 0) && (
            <button
              type="button"
              onClick={handleLoadSavedData}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0066CC] text-[11px] font-bold cursor-pointer transition-colors"
            >
              Load Saved Data
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadSavedProfilePdf}
            disabled={isDownloadingPdf}
            className="px-3 py-1.5 rounded-lg bg-[#14243A] hover:bg-[#1c3252] dark:bg-[#0066CC] dark:hover:bg-[#0052A3] disabled:opacity-50 text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#B5E61D]" />
            <span>Export Saved Profile PDF</span>
          </button>
        </div>
      </div>

      {buildError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{buildError}</span>
        </div>
      )}

      {/* Real-Time Resume Strength Gauge (0-100%) */}
      <div
        className="p-3.5 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 dark:from-[#0D1527] dark:via-[#111B33] dark:to-[#0F1E3A] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-4"
        aria-label={`Resume Strength ${resumeStrength.score}%`}
      >
        {/* Circular SVG Radial Gauge */}
        <div className="relative w-20 h-20 shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-slate-200 dark:text-slate-800"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={resumeStrength.strokeColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - resumeStrength.score / 100)}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white leading-none">
              {resumeStrength.score}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Strength
            </span>
          </div>
        </div>

        {/* Section Breakdown & Live Guidance */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Resume Strength
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${resumeStrength.badgeClass}`}
            >
              {resumeStrength.tier}
            </span>
          </div>

          {/* Horizontal Animated Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${resumeStrength.score}%`,
                backgroundColor: resumeStrength.strokeColor,
              }}
            />
          </div>

          {/* Section Completion Chips */}
          <div className="flex flex-wrap gap-1.5">
            {resumeStrength.sections.map((sec) => {
              const isComplete = sec.pts >= sec.max;
              const isStarted = sec.pts > 0;
              return (
                <span
                  key={sec.id}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center gap-1 border transition-colors ${
                    isComplete
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : isStarted
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#0066CC] dark:text-[#38BDF8] border-blue-200/80 dark:border-blue-800/70'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isComplete && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />}
                  <span>
                    {sec.label} {sec.pts}/{sec.max}
                  </span>
                </span>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            <strong className="text-[#0066CC] dark:text-[#38BDF8]">Tip:</strong> {resumeStrength.nextHint}
          </p>
        </div>
      </div>

      {/* Structured Input Form */}
      <form onSubmit={handleGenerateAtsResume} className="space-y-4">
        {/* Candidate Contact & Target Role */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            1. Candidate Header &amp; Target Role
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chinedu Okafor"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Job Title</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lagos"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Nigeria"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourhandle"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio / GitHub URL</label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Career Summary Notes (Gemini will polish this for ATS)
            </label>
            <textarea
              rows={2}
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="Briefly summarize your years of experience, domain focus, and standout impact..."
              className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {/* Structured Experience Builder */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>2. Work Experience ({experiences.length})</span>
            </span>
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Click &ldquo;Add Experience&rdquo; to include a work role.
            </p>
          ) : (
            <div className="space-y-2.5">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Role #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                      title="Remove experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Job Title (e.g. Senior Backend Engineer)"
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...next[idx], company: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Company Name"
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...next[idx], period: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Dates (e.g. Jan 2022 – Present)"
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[11px] outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...next[idx], location: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Location (e.g. Lagos / Remote)"
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:border-[#0066CC]"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={exp.highlights}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx] = { ...next[idx], highlights: e.target.value };
                      setExperiences(next);
                    }}
                    placeholder="Key responsibilities, projects, and measurable outcomes (Gemini converts these into high-impact ATS bullet points)..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] outline-none focus:border-[#0066CC]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Structured Education Builder */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>3. Education ({educationList.length})</span>
            </span>
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          {educationList.length === 0 ? (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Click &ldquo;Add Education&rdquo; to include degrees or academic credentials.
            </p>
          ) : (
            <div className="space-y-2.5">
              {educationList.map((ed, idx) => (
                <div
                  key={ed.id}
                  className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) => {
                        const next = [...educationList];
                        next[idx] = { ...next[idx], degree: e.target.value };
                        setEducationList(next);
                      }}
                      placeholder="Degree / Major (e.g. B.Sc. Computer Science)"
                      className="sm:col-span-5 px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      value={ed.institution}
                      onChange={(e) => {
                        const next = [...educationList];
                        next[idx] = { ...next[idx], institution: e.target.value };
                        setEducationList(next);
                      }}
                      placeholder="University / Institution"
                      className="sm:col-span-4 px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      value={ed.year}
                      onChange={(e) => {
                        const next = [...educationList];
                        next[idx] = { ...next[idx], year: e.target.value };
                        setEducationList(next);
                      }}
                      placeholder="Year"
                      className="sm:col-span-2 px-2.5 py-1.5 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[11px] outline-none focus:border-[#0066CC]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(ed.id)}
                      className="sm:col-span-1 text-slate-400 hover:text-rose-500 flex justify-center cursor-pointer"
                      title="Remove education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ed.details || ''}
                    onChange={(e) => {
                      const next = [...educationList];
                      next[idx] = { ...next[idx], details: e.target.value };
                      setEducationList(next);
                    }}
                    placeholder="Optional honors, GPA, or relevant coursework..."
                    className="w-full px-2.5 py-1 bg-slate-50 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] outline-none focus:border-[#0066CC]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills, Certifications & ATS Keyword Alignment */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>4. Skills, Certifications &amp; ATS Optimization</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Core Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="TypeScript, React, Node.js, PostgreSQL, AWS"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Certifications (optional, comma separated)
              </label>
              <input
                type="text"
                value={certificationsText}
                onChange={(e) => setCertificationsText(e.target.value)}
                placeholder="AWS Solutions Architect, PMP, Scrum Master"
                className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Keywords / JD Snippet (optional)
            </label>
            <input
              type="text"
              value={targetJobKeywords}
              onChange={(e) => setTargetJobKeywords(e.target.value)}
              placeholder="Paste role requirements or ATS keywords to emphasize (e.g. Microservices, FinTech Ledger, CI/CD)..."
              className="w-full px-3 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleDownloadAtsPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPdf ? 'Exporting PDF...' : 'Download as PDF'}</span>
          </button>

          <button
            type="submit"
            disabled={isBuilding}
            className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isBuilding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formatting ATS Resume with Gemini AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#B5E61D]" />
                <span>{formattedResume ? 'Regenerate ATS Resume' : 'Build ATS Resume with Gemini AI'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Formatted ATS-Optimized Preview & PDF Export */}
      {formattedResume && (
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
          {/* Action Toolbar */}
          <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="px-2.5 py-1 rounded-lg bg-[#0066CC] text-white font-mono text-xs font-extrabold">
                ATS {formattedResume.atsScore}%
              </div>
              <div>
                <p className="text-xs font-bold text-[#14243A] dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                  <span>ATS-Optimized Layout Ready</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Single-column parser-safe structure with quantified action bullets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleCopyPlainText}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0066CC] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPlainText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadAtsPdf}
                disabled={isDownloadingPdf}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingPdf ? 'Exporting PDF...' : 'Download as PDF'}</span>
              </button>
            </div>
          </div>

          {/* ATS Optimization Highlights */}
          {formattedResume.atsOptimizationNotes.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Gemini ATS Improvements Applied
              </span>
              <ul className="space-y-1">
                {formattedResume.atsOptimizationNotes.map((note, idx) => (
                  <li key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Live Document Paper Preview (Single-Column ATS Standard) */}
          <div className="bg-white text-slate-900 rounded-xl border border-slate-300 shadow-md p-6 sm:p-7 space-y-4 font-sans">
            <div className="border-b-2 border-[#0066CC] pb-3">
              <h3 className="text-xl font-extrabold tracking-tight text-[#14243A]">
                {formattedResume.header.fullName}
              </h3>
              <p className="text-sm font-bold text-[#0066CC] mt-0.5">{formattedResume.header.headline}</p>
              <p className="text-[11px] text-slate-600 mt-1">{formattedResume.header.contactLine}</p>
              {formattedResume.header.linksLine && (
                <p className="text-[11px] text-[#0066CC] mt-0.5 break-all">{formattedResume.header.linksLine}</p>
              )}
            </div>

            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#14243A] border-b border-slate-200 pb-1 mb-1.5">
                Professional Summary
              </h4>
              <p className="text-xs leading-relaxed text-slate-700">{formattedResume.professionalSummary}</p>
            </div>

            {formattedResume.coreCompetencies.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#14243A] border-b border-slate-200 pb-1 mb-1.5">
                  Core Competencies &amp; Technical Skills
                </h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {formattedResume.coreCompetencies.join('  •  ')}
                </p>
              </div>
            )}

            {formattedResume.experience.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#14243A] border-b border-slate-200 pb-1 mb-2">
                  Professional Experience
                </h4>
                <div className="space-y-3">
                  {formattedResume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{exp.title}</span>
                        <span className="text-[11px] font-semibold text-slate-600 font-mono">{exp.period}</span>
                      </div>
                      <p className="text-[11px] italic text-slate-600">
                        {[exp.company, exp.location].filter(Boolean).join(' · ')}
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs leading-relaxed text-slate-700">
                            {bullet.replace(/^[-•*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formattedResume.education.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#14243A] border-b border-slate-200 pb-1 mb-2">
                  Education
                </h4>
                <div className="space-y-2">
                  {formattedResume.education.map((ed, idx) => (
                    <div key={idx}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{ed.degree}</span>
                        <span className="text-[11px] font-mono text-slate-600">{ed.year}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {[ed.institution, ed.details].filter(Boolean).join(' — ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formattedResume.certifications.length > 0 && (
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#14243A] border-b border-slate-200 pb-1 mb-1.5">
                  Certifications &amp; Credentials
                </h4>
                <p className="text-xs text-slate-700">{formattedResume.certifications.join('  •  ')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
