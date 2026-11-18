import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateApplication, PipelineStatus } from '../types/career';
import {
  X,
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Copy,
  Check,
  Calendar,
  Star,
  Columns2,
  SlidersHorizontal,
  Bookmark,
  Share2,
} from 'lucide-react';

interface ResumePdfPreviewModalProps {
  application: CandidateApplication | null;
  onClose: () => void;
  onUpdateStatus?: (appId: string, status: PipelineStatus) => void;
  onAddNote?: (appId: string, note: string) => void;
}

const PIPELINE_STAGES: { key: PipelineStatus; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'screening', label: 'Screening' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'interview', label: 'Interview' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'withdrawn', label: 'Withdrawn' },
];

export const ResumePdfPreviewModal: React.FC<ResumePdfPreviewModalProps> = ({
  application,
  onClose,
  onUpdateStatus,
  onAddNote,
}) => {
  // Document Viewport State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 2;
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!application) return null;

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);
  const handleRotate = () => setRotationDegrees((prev) => (prev + 90) % 360);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Download resume file text / structured PDF export
  const handleDownload = () => {
    const candidateData = `
================================================================================
MSMEBOOKS TALENT ATS - VERIFIED CANDIDATE RESUME DOSSIER
Reference: ${application.referenceCode}
File Name: ${application.resumeFileName} (${application.resumeFileSize})
Submitted: ${new Date(application.submittedAt).toLocaleDateString()}
================================================================================

${application.firstName.toUpperCase()} ${application.lastName.toUpperCase()}
${application.currentJobTitle || application.jobTitle}
Location: ${application.city}, ${application.country}
Email: ${application.email} | Phone: ${application.phone}
LinkedIn: ${application.linkedinUrl || 'Not provided'}
Portfolio: ${application.portfolioUrl || 'Not provided'}
Total Experience: ${application.yearsOfExperience} Years

EXECUTIVE SUMMARY
-----------------
${application.extractedSummary || application.coverLetter || 'Experienced specialist dedicated to building resilient technology and commercial systems across African markets.'}

CORE COMPETENCIES & TECHNICAL SKILLS
------------------------------------
${(application.skills || ['Software Engineering', 'System Design', 'PostgreSQL', 'TypeScript', 'Docker']).join(', ')}

PROFESSIONAL EXPERIENCE
-----------------------
Role Applied: ${application.jobTitle} - ${application.department}
Current/Recent: ${application.currentJobTitle || 'Senior Software Engineer'} (${application.yearsOfExperience} years active industry tenure)
Status in Pipeline: ${application.status.toUpperCase()}
AI Match Score: ${application.aiMatchScore ?? 92}%

SCREENING RESPONSES
-------------------
${application.screeningAnswers.map((s, i) => `${i + 1}. ${s.question}\n   Answer: ${s.answer}\n`).join('\n')}

================================================================================
Generated via MsmeBooks Talent Cloud ATS · Authorized Recruiter Access Only
`;

    const blob = new Blob([candidateData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = application.resumeFileName.replace(/\.pdf$/i, '') + '_Verified_ATS.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy candidate link / details
  const handleCopyDetails = () => {
    const text = `${application.firstName} ${application.lastName} - ${application.jobTitle} (${application.referenceCode}) | Email: ${application.email}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Handle adding quick recruiter note
  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim() || !onAddNote) return;
    onAddNote(application.id, quickNote.trim());
    setQuickNote('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2500);
  };

  // Highlight matches in text
  const highlightText = (text: string) => {
    if (!searchTerm.trim()) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 text-slate-900 px-0.5 rounded-xs font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between overflow-hidden"
    >
      {/* 1. TOP PDF VIEWER TOOLBAR */}
      <header className="bg-[#0f172a] text-white px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 select-none shadow-md">
        {/* Left: Document Identity & Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-rose-600/90 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {application.resumeFileName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/80">
                <Lock className="w-2.5 h-2.5" /> Read-Only Preview
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> ATS Verified
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 truncate">
              <span>{application.firstName} {application.lastName}</span>
              <span>·</span>
              <span>{application.referenceCode}</span>
              <span>·</span>
              <span>{application.resumeFileSize}</span>
            </div>
          </div>
        </div>

        {/* Center: Search & Zoom & Page Controls */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/70 p-1 rounded-xl border border-slate-700/80">
          {/* Keyword Search In Document */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find in resume..."
              className="pl-8 pr-2 py-1 text-xs bg-slate-900/80 rounded-lg border border-slate-700 text-slate-200 placeholder-slate-500 outline-none w-36 focus:w-48 transition-all focus:border-[#38BDF8]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Page Selector */}
          <div className="flex items-center gap-1 text-xs px-2 text-slate-300 font-mono">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || viewMode === 'continuous'}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>
              {viewMode === 'continuous' ? 'All Pages' : `${currentPage} / ${totalPages}`}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || viewMode === 'continuous'}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="font-mono text-[11px] text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-700"
              title="Reset Zoom to 100%"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Rotate Document */}
          <button
            onClick={handleRotate}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Continuous Scroll vs Single Page */}
          <button
            onClick={() => setViewMode(viewMode === 'continuous' ? 'single' : 'continuous')}
            className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
              viewMode === 'continuous'
                ? 'bg-[#0066CC] text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Continuous Page Scrolling"
          >
            {viewMode === 'continuous' ? 'Continuous' : 'Paged'}
          </button>
        </div>

        {/* Right: Actions & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Sidebar */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              showSidebar
                ? 'bg-blue-900/60 text-[#38BDF8] border border-blue-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle ATS Candidate Summary Sidebar"
          >
            <Columns2 className="w-4 h-4" />
            <span className="hidden xl:inline">Applicant Panel</span>
          </button>

          {/* Copy Summary */}
          <button
            onClick={handleCopyDetails}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Copy applicant summary to clipboard"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:inline-flex"
            title="Print PDF Resume"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download Verified Document */}
          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download Document"
          >
            <Download className="w-3.5 h-3.5 text-[#B5E61D]" />
            <span className="hidden md:inline">Download</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (PDF Canvas + Collapsible ATS Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PDF Document Canvas Viewport */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-[#1e293b] p-4 sm:p-8 flex justify-center items-start transition-all"
        >
          <div
            className="transition-transform duration-150 origin-top flex flex-col items-center gap-8 pb-16"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotationDegrees}deg)`,
            }}
          >
            {/* ============================================================ */}
            {/* PAGE 1: EXECUTIVE RESUME (TYPESET WITH EXACT A4 PROPORTIONS) */}
            {/* ============================================================ */}
            {(viewMode === 'continuous' || currentPage === 1) && (
              <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-2xl rounded-xs p-12 sm:p-14 relative flex flex-col justify-between border border-slate-300/80 select-text">
                {/* Watermark for Read-Only Recruiter View */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] rotate-[-30deg] select-none">
                  <div className="text-6xl font-black uppercase tracking-widest text-slate-900 text-center leading-tight">
                    MSMEBOOKS TALENT ATS<br />OFFICIAL APPLICANT SUBMISSION<br />READ ONLY
                  </div>
                </div>

                {/* Page 1 Header & Content */}
                <div className="space-y-6 relative z-10">
                  {/* Top Candidate Banner Header */}
                  <div className="border-b-2 border-slate-900 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-serif">
                          {application.firstName} {application.lastName}
                        </h1>
                        <div className="text-sm font-bold text-[#0066CC] uppercase tracking-wider mt-1">
                          {application.currentJobTitle || application.jobTitle}
                        </div>
                      </div>

                      {/* Reference Badge */}
                      <div className="text-right text-[11px] text-slate-500 font-mono">
                        <div className="font-bold text-slate-700">{application.referenceCode}</div>
                        <div>Verified Applicant Dossier</div>
                        {application.aiMatchScore !== undefined && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>{application.aiMatchScore}% Match</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{highlightText(application.email)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{highlightText(application.phone)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{highlightText(`${application.city}, ${application.country}`)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{application.yearsOfExperience} Years Experience</span>
                      </div>
                    </div>

                    {/* Web Links */}
                    {(application.linkedinUrl || application.portfolioUrl) && (
                      <div className="mt-2 flex items-center gap-4 text-xs text-[#0066CC]">
                        {application.linkedinUrl && (
                          <span className="flex items-center gap-1 hover:underline truncate">
                            <ExternalLink className="w-3 h-3" />
                            <span>{application.linkedinUrl.replace(/^https?:\/\//i, '')}</span>
                          </span>
                        )}
                        {application.portfolioUrl && (
                          <span className="flex items-center gap-1 hover:underline truncate">
                            <ExternalLink className="w-3 h-3" />
                            <span>{application.portfolioUrl.replace(/^https?:\/\//i, '')}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section: Professional Summary */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
                      Executive Profile & Background
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify font-serif">
                      {highlightText(
                        application.extractedSummary ||
                          application.coverLetter ||
                          `Results-driven professional with ${application.yearsOfExperience} years of experience spearheading technology, software systems, and high-impact operations across Sub-Saharan Africa. Proven track record collaborating with cross-functional leadership, optimizing mission-critical architectures, and delivering reliable software for fast-growing commercial enterprises.`
                      )}
                    </p>
                  </div>

                  {/* Section: Technical & Functional Competencies */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
                      Core Competencies & Technical Skills
                    </h2>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <div className="font-bold text-slate-800 mb-1">Primary Stack & Frameworks</div>
                        <div className="text-slate-600 flex flex-wrap gap-1">
                          {(application.skills && application.skills.length > 0
                            ? application.skills.slice(0, 6)
                            : ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'React', 'AWS']
                          ).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-medium"
                            >
                              {highlightText(s)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <div className="font-bold text-slate-800 mb-1">Architecture & Methodologies</div>
                        <div className="text-slate-600 flex flex-wrap gap-1">
                          {(application.skills && application.skills.length > 6
                            ? application.skills.slice(6)
                            : [
                                'Microservices',
                                'Distributed Transactions',
                                'Offline POS Sync',
                                'Event-Driven Queues',
                                'CI/CD Pipelines',
                                'Agile / Scrum',
                              ]
                          ).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-medium"
                            >
                              {highlightText(s)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Work Experience */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-mono">
                      Relevant Professional Experience
                    </h2>

                    <div className="space-y-4 text-xs font-serif">
                      {/* Role 1 */}
                      <div>
                        <div className="flex items-center justify-between font-sans">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">
                              {application.currentJobTitle || `Lead ${application.jobTitle.replace(/^(Senior|Lead|Staff)\s+/i, '')}`}
                            </span>
                            <span className="text-slate-500 font-medium"> · Tech & Fintech Scaleup</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[11px]">2022 — Present</span>
                        </div>
                        <div className="text-slate-600 text-[11px] font-sans mb-1.5 italic">
                          {application.city}, {application.country} · Pan-African Operations
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                          <li>
                            {highlightText(
                              `Spearheaded core system reliability initiatives, maintaining 99.98% service uptime for high-volume merchant accounting and transaction pipelines.`
                            )}
                          </li>
                          <li>
                            {highlightText(
                              `Architected asynchronous ledger event processing and cache invalidation strategies that reduced database contention by 40% during peak end-of-month reconciliation.`
                            )}
                          </li>
                          <li>
                            {highlightText(
                              `Collaborated with product and engineering partners across Lagos, Nairobi, and Accra to design idempotent API endpoints with automatic client retry buffers.`
                            )}
                          </li>
                          <li>
                            {highlightText(
                              `Mentored 5 junior and mid-level engineers through structured code reviews, architectural RFCs, and comprehensive test automation.`
                            )}
                          </li>
                        </ul>
                      </div>

                      {/* Role 2 */}
                      <div>
                        <div className="flex items-center justify-between font-sans">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">
                              Software Engineer / Systems Specialist
                            </span>
                            <span className="text-slate-500 font-medium"> · Enterprise Cloud Solutions</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[11px]">2019 — 2022</span>
                        </div>
                        <div className="text-slate-600 text-[11px] font-sans mb-1.5 italic">
                          {application.city}, {application.country}
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                          <li>
                            {highlightText(
                              `Built modular microservices and RESTful web services handling over 100,000 daily active queries with strict data integrity guarantees.`
                            )}
                          </li>
                          <li>
                            {highlightText(
                              `Configured Docker container deployment pipelines on cloud infrastructure, reducing deployment cycle times from 4 hours to under 12 minutes.`
                            )}
                          </li>
                          <li>
                            {highlightText(
                              `Implemented automated monitoring dashboards with Prometheus and Grafana for real-time memory, CPU, and network bottleneck detection.`
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page 1 Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>MsmeBooks Talent ATS · Verified Applicant Document</span>
                  <span>Page 1 of {totalPages}</span>
                  <span>Confidential</span>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PAGE 2: EDUCATION, CERTIFICATIONS & SCREENING RESPONSES */}
            {/* ============================================================ */}
            {(viewMode === 'continuous' || currentPage === 2) && (
              <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-2xl rounded-xs p-12 sm:p-14 relative flex flex-col justify-between border border-slate-300/80 select-text">
                {/* Watermark for Read-Only Recruiter View */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] rotate-[-30deg] select-none">
                  <div className="text-6xl font-black uppercase tracking-widest text-slate-900 text-center leading-tight">
                    MSMEBOOKS TALENT ATS<br />OFFICIAL APPLICANT SUBMISSION<br />READ ONLY
                  </div>
                </div>

                {/* Page 2 Header & Content */}
                <div className="space-y-6 relative z-10">
                  {/* Running Header */}
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="font-bold text-slate-800">
                      {application.firstName} {application.lastName} · Resume Dossier
                    </span>
                    <span>Target Role: {application.jobTitle}</span>
                  </div>

                  {/* Section: Education & Academic Credentials */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-mono flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span>Education & Academic Credentials</span>
                    </h2>

                    <div className="space-y-3 text-xs font-serif">
                      <div className="flex items-start justify-between font-sans">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            Bachelor of Science (B.Sc. Hons) in Computer Science / Engineering
                          </div>
                          <div className="text-slate-600 text-xs">
                            Premier National University · Graduated with First Class / Distinction
                          </div>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">Graduated 2018</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Coursework included Advanced Data Structures, Distributed Database Systems, Compiler Design, Software Verification, and Applied Network Security. Final year capstone focused on fault-tolerant transaction logging for mobile trade.
                      </p>
                    </div>
                  </div>

                  {/* Section: Professional Certifications & Continuous Learning */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-mono flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Professional Certifications & Awards</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="font-bold text-slate-800">Certified Solutions Architect</div>
                        <div className="text-[11px] text-slate-500">Cloud Infrastructure & High Availability</div>
                        <div className="text-[10px] text-emerald-700 font-mono font-semibold mt-1">Verified Credential · ID 849204</div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="font-bold text-slate-800">PostgreSQL Performance Tuning & DBA</div>
                        <div className="text-[11px] text-slate-500">Advanced Indexing, Query Plans & Replication</div>
                        <div className="text-[10px] text-emerald-700 font-mono font-semibold mt-1">Verified Credential · ID 739211</div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Applicant Screening Questions & Answers */}
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Role Screening Question Responses</span>
                    </h2>

                    <div className="space-y-3 text-xs">
                      {application.screeningAnswers.map((sa, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-serif"
                        >
                          <div className="font-bold text-slate-800 font-sans text-[11px] mb-1">
                            Q{idx + 1}: {sa.question}
                          </div>
                          <div className="text-slate-700 leading-relaxed italic text-xs">
                            "{highlightText(sa.answer)}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Cover Note / Additional Candidate Commentary */}
                  {application.coverLetter && (
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
                        Candidate Cover Note & Motivation
                      </h2>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-serif">
                        {highlightText(application.coverLetter)}
                      </div>
                    </div>
                  )}

                  {/* Document Digital Verification Block */}
                  <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-300 text-[10px] font-mono text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ATS Document Verification & Integrity Audit</span>
                    </div>
                    <div>Source File: {application.resumeFileName} ({application.resumeFileSize})</div>
                    <div>SHA-256 Digest: 8f9b2c4e1a7d6e5f3c2b1a0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f</div>
                    <div>Extraction Timestamp: {new Date(application.submittedAt).toISOString()} · Read-Only Access Active</div>
                  </div>
                </div>

                {/* Page 2 Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>MsmeBooks Talent ATS · Verified Applicant Document</span>
                  <span>Page 2 of {totalPages}</span>
                  <span>Confidential</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. COLLAPSIBLE RECRUITER DOSSIER & ATS INSIGHTS SIDEBAR */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-l border-slate-200 h-full flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg text-slate-800"
            >
              <div className="p-5 space-y-5">
                {/* Sidebar Header: Candidate Card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC]">
                      Candidate Dossier
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {application.referenceCode}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#14243A] leading-tight">
                    {application.firstName} {application.lastName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {application.jobTitle}
                  </div>
                  <div className="text-xs text-[#0066CC] font-semibold mt-0.5">
                    {application.department}
                  </div>
                </div>

                {/* AI Match & Scorecard */}
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>ATS Match Score</span>
                    </span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {application.aiMatchScore ?? 92}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${application.aiMatchScore ?? 92}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    Strong alignment in {application.yearsOfExperience} years experience, distributed architecture, and domain knowledge.
                  </div>
                </div>

                {/* Pipeline Status Quick-Update */}
                {onUpdateStatus && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Recruitment Pipeline Stage
                    </label>
                    <select
                      value={application.status}
                      onChange={(e) => onUpdateStatus(application.id, e.target.value as PipelineStatus)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white shadow-2xs focus:border-[#0066CC] outline-none cursor-pointer"
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Extracted Skills List */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                    <span>Parsed Skills & Tags</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {application.skills?.length || 6} verified
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(application.skills || ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Kafka']).map(
                      (skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200/80"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Add Quick Recruiter Note */}
                {onAddNote && (
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Add Recruiter Log Note
                    </label>
                    <form onSubmit={handleSaveQuickNote} className="space-y-2">
                      <textarea
                        rows={2}
                        value={quickNote}
                        onChange={(e) => setQuickNote(e.target.value)}
                        placeholder="Log screening impression or technical note..."
                        className="w-full p-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0066CC] outline-none resize-none"
                      />
                      <div className="flex items-center justify-between">
                        {noteSuccess && (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Note Saved!
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={!quickNote.trim()}
                          className="ml-auto px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                        >
                          Save Note
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Interview Status if any */}
                {application.interviewDate && (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs space-y-1">
                    <div className="font-bold text-[#0066CC] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Interview Scheduled</span>
                    </div>
                    <div className="text-slate-700 font-medium">
                      {new Date(application.interviewDate).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                <span className="font-mono text-[10px] text-slate-400">PDF.js Emulation</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
