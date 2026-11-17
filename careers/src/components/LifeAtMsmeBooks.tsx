import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MapPin,
  Users,
  Code2,
  Heart,
  Laptop,
  Maximize2,
  X,
  ChevronRight,
  ArrowUpRight,
  Award,
  Zap,
  Globe2,
  BookOpen,
  Coffee,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Film,
  Video,
  FileText,
  Copy,
  Check,
  Share2,
  Sliders,
} from 'lucide-react';

import mentorshipImg from '../assets/images/nairobi_dev_pair_programming_1793395123411.jpg';
import teamCollabImg from '../assets/images/multicultural_team_collab_1792771768589.jpg';
import femaleEngineerImg from '../assets/images/life_female_engineer_1792354229834.jpg';
import teamStrategyImg from '../assets/images/life_team_strategy_1792354230261.jpg';
import remoteWorkImg from '../assets/images/life_remote_work_1792354230966.jpg';
import devMentorshipImg from '../assets/images/african_devs_mentorship_fixed_1794519631016.jpg';
import heroTeamImg from '../assets/images/hero_african_tech_team_1792354230230.jpg';

interface GalleryItem {
  id: string;
  title: string;
  category: 'mentorship' | 'multicultural' | 'workspaces' | 'craft';
  categoryLabel: string;
  image: string;
  location: string;
  aspect: string;
  span: string;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  description: string;
  tags: string[];
}

export interface VideoChapter {
  timestamp: string;
  seconds: number;
  title: string;
}

export interface VideoTranscriptLine {
  speaker: string;
  timestamp: string;
  text: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: 'culture' | 'testimonials' | 'day-to-day';
  categoryLabel: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  location: string;
  speaker: {
    name: string;
    role: string;
    avatar: string;
  };
  description: string;
  keyTakeaways: string[];
  chapters: VideoChapter[];
  transcript: VideoTranscriptLine[];
  tags: string[];
}

export const LifeAtMsmeBooks: React.FC = () => {
  const [mediaMode, setMediaMode] = useState<'all' | 'videos' | 'photos'>('all');
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('all');
  const [activeVideoCategory, setActiveVideoCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Video playback simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(15); // in seconds
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeVideoModalTab, setActiveVideoModalTab] = useState<'overview' | 'chapters' | 'transcript'>('overview');
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Video Playback ticker simulation
  useEffect(() => {
    if (selectedVideo && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= selectedVideo.durationSeconds) {
            setIsPlaying(false);
            return selectedVideo.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedVideo, isPlaying, playbackSpeed]);

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setCurrentProgress(0);
    setIsPlaying(true);
    setActiveVideoModalTab('overview');
  };

  const handleSeek = (seconds: number) => {
    setCurrentProgress(seconds);
    setIsPlaying(true);
  };

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyTranscript = (video: VideoItem) => {
    const fullText = video.transcript
      .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
      .join('\n\n');
    navigator.clipboard?.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // =========================================================================
  // VIDEO GALLERY DATA: CULTURE, TESTIMONIALS & DAY-TO-DAY WORK ENVIRONMENT
  // =========================================================================
  const videoItems: VideoItem[] = [
    {
      id: 'vid-culture-1',
      title: 'Building for 44M African MSMEs: Our Mission, Autonomy & Ethos',
      category: 'culture',
      categoryLabel: 'Company Culture',
      duration: '4:15',
      durationSeconds: 255,
      thumbnail: heroTeamImg,
      location: 'Pan-African Distributed (HQ Nairobi & Lagos)',
      speaker: {
        name: 'Kofi Mensah & Squad',
        role: 'VP of Product & Engineering Leaders',
        avatar: teamStrategyImg,
      },
      description:
        'An unfiltered look into our founding philosophy: why we reject corporate bureaucracy in favor of autonomous squads, how we build for low-bandwidth African retail environments, and what drives our 94% team retention rate.',
      keyTakeaways: [
        'Autonomous squads own end-to-end service lifecycles from ideation to production telemetry',
        'Direct connection to our 120,000+ MSME merchants across 5 countries',
        'Radical transparent salaries and Pan-African equity grants',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Introduction & Founding Mission' },
        { timestamp: '1:10', seconds: 70, title: 'The 44M MSME Digital Deficit' },
        { timestamp: '2:30', seconds: 150, title: 'Squad Autonomy & Async RFC Culture' },
        { timestamp: '3:45', seconds: 225, title: 'Why Engineers Stay: Career Velocity' },
      ],
      transcript: [
        {
          speaker: 'Kofi Mensah',
          timestamp: '0:00',
          text: 'When we founded MsmeBooks, the prevailing fintech trend was copying Silicon Valley SaaS templates that collapsed the moment an internet connection blinked in a roadside market.',
        },
        {
          speaker: 'Kofi Mensah',
          timestamp: '1:10',
          text: 'There are 44 million micro, small, and medium enterprises across Sub-Saharan Africa. They generate 80% of employment, yet 90% still keep their ledgers on physical cardboard paper.',
        },
        {
          speaker: 'Sandrine Uwase',
          timestamp: '2:30',
          text: 'At MsmeBooks, our engineering squads operate with radical independence. We don’t ask for three layers of approval to ship an optimization—we write an RFC, discuss it asynchronously, and deploy.',
        },
        {
          speaker: 'Kofi Mensah',
          timestamp: '3:45',
          text: 'If you want to build systems where your code directly secures the livelihood of families and business owners, there is no higher-leverage place to work.',
        },
      ],
      tags: ['Company Culture', 'Mission', 'Squad Autonomy', 'Pan-African'],
    },
    {
      id: 'vid-testimonials-1',
      title: "From Junior Dev to AI Squad Lead in Kigali: Sandrine's Journey",
      category: 'testimonials',
      categoryLabel: 'Employee Testimonials',
      duration: '5:05',
      durationSeconds: 305,
      thumbnail: femaleEngineerImg,
      location: 'Kigali Tech Innovation Lab, Rwanda',
      speaker: {
        name: 'Sandrine Uwase',
        role: 'Lead AI & OCR Engineer',
        avatar: femaleEngineerImg,
      },
      description:
        'Sandrine reflects on her 3-year career arc at MsmeBooks: shipping her first TypeScript microservice, benefiting from senior architectural mentorship, and now leading the pan-African machine-learning team processing over $14M in monthly retail invoices.',
      keyTakeaways: [
        'Structured 1-on-1 mentorship pairings guarantee rapid junior-to-lead growth',
        '$1,500 yearly learning stipend spent on international conferences & cloud certifications',
        '48% female engineering leadership representation across tech departments',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Joining as a Junior Engineer in Kigali' },
        { timestamp: '1:20', seconds: 80, title: 'Code Reviews as Teaching Sessions' },
        { timestamp: '2:45', seconds: 165, title: 'Building the Computer Vision OCR Engine' },
        { timestamp: '4:10', seconds: 250, title: 'Advice for Female Developers in Africa' },
      ],
      transcript: [
        {
          speaker: 'Sandrine Uwase',
          timestamp: '0:00',
          text: 'I joined MsmeBooks fresh out of university in Kigali. In many companies, junior engineers are relegated to updating button colors or writing documentation no one reads.',
        },
        {
          speaker: 'Sandrine Uwase',
          timestamp: '1:20',
          text: 'Here, Dennis Kipkemboi paired with me from day two. He walked me through distributed transaction rollback logic on PostgreSQL, treating code reviews as masterclasses rather than hurdles.',
        },
        {
          speaker: 'Sandrine Uwase',
          timestamp: '2:45',
          text: 'Within two years, I was leading our smart OCR team. We trained models to parse crumpled, handwritten receipts in French, Swahili, and Pidgin with 98.4% precision.',
        },
        {
          speaker: 'Sandrine Uwase',
          timestamp: '4:10',
          text: 'MsmeBooks proved to me that high-caliber engineering leadership in Africa has no glass ceilings.',
        },
      ],
      tags: ['Testimonial', 'Career Growth', 'Women in Tech', 'Kigali Hub'],
    },
    {
      id: 'vid-daytoday-1',
      title: 'A Day in the Life: Pair Programming & Code Reviews in Nairobi',
      category: 'day-to-day',
      categoryLabel: 'Day-to-Day Work',
      duration: '3:50',
      durationSeconds: 230,
      thumbnail: mentorshipImg,
      location: 'Nairobi Innovation Hub, Kenya',
      speaker: {
        name: 'Amina Bello & Dennis Kipkemboi',
        role: 'Systems Reliability & Backend Squad',
        avatar: mentorshipImg,
      },
      description:
        'Step inside our Nairobi Innovation Hub for a typical day: morning async standups on Slack, collaborative terminal pair-debugging on SQLite synchronization, quiet 4-hour focus blocks, and lunch discussions on Pan-African monetary policy.',
      keyTakeaways: [
        'Protected 4-hour deep work focus windows with zero meetings every afternoon',
        'Async written standups reduce calendar fragmentation to less than 15% of the week',
        'Collaborative pair-programming stations with dual 4K monitors and mechanical keyboards',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Morning Coffee & Async Slack Check-In' },
        { timestamp: '1:05', seconds: 65, title: 'Live Pair Programming: Offline SQLite Sync' },
        { timestamp: '2:15', seconds: 135, title: 'No-Meeting Afternoon Focus Window' },
        { timestamp: '3:10', seconds: 190, title: 'Team Knowledge Sharing & Retrospective' },
      ],
      transcript: [
        {
          speaker: 'Amina Bello',
          timestamp: '0:00',
          text: 'Our day begins with Kenyan coffee and a 3-sentence written update in Slack. No one is forced into a 45-minute verbal round-robin standup where everyone stares at their shoes.',
        },
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '1:05',
          text: 'Today Amina and I are pairing on our local-first sync protocol. When a cashier in Kisumu loses connection, their offline SQLite ledger has to merge seamlessly with Postgres without duplicate invoices.',
        },
        {
          speaker: 'Amina Bello',
          timestamp: '2:15',
          text: 'From 1:00 PM to 5:00 PM, all notifications are silenced. It is our company-wide deep work window. No meetings are allowed to be scheduled across any squad.',
        },
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '3:10',
          text: 'We finish the day by reviewing PRs. When you log off at MsmeBooks, you genuinely leave work feeling accomplished instead of exhausted.',
        },
      ],
      tags: ['Day in the Life', 'Pair Programming', 'Deep Work', 'Nairobi Hub'],
    },
    {
      id: 'vid-testimonials-2',
      title: 'Why I Left Big Tech to Architect Ledgers: Dennis’s Story',
      category: 'testimonials',
      categoryLabel: 'Employee Testimonials',
      duration: '4:40',
      durationSeconds: 280,
      thumbnail: devMentorshipImg,
      location: 'Nairobi Hub, Kenya',
      speaker: {
        name: 'Dennis Kipkemboi',
        role: 'Principal Systems Architect',
        avatar: devMentorshipImg,
      },
      description:
        'Dennis explains why moving from a multinational cloud conglomerate to MsmeBooks gave him the hardest computer science challenges of his career—building distributed idempotency, sub-second multi-currency ledgers, and mentoring Africa’s next engineering generation.',
      keyTakeaways: [
        'Solves complex distributed systems problems under real-world infrastructure constraints',
        'Mentorship is formally evaluated as a core engineering KPI alongside code delivery',
        'Direct equity ownership in high-growth African infrastructure',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Trading Silicon Valley for African FinTech' },
        { timestamp: '1:30', seconds: 90, title: 'The True Challenge of Offline Resilience' },
        { timestamp: '2:55', seconds: 175, title: 'Culture of Teaching Over Gatekeeping' },
        { timestamp: '3:50', seconds: 230, title: 'Why Real Impact Matters' },
      ],
      transcript: [
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '0:00',
          text: 'People asked me why I left a comfortable senior position at a US cloud provider to join a Pan-African accounting startup. My answer was simple: the engineering problems here are harder and more meaningful.',
        },
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '1:30',
          text: 'In Silicon Valley, you have gigabit fiber and endless redundant power. In Nairobi or Lagos, your app has to survive power surges, spotty 3G, and multi-currency exchange rate volatility in real time.',
        },
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '2:55',
          text: 'What I treasure most is our apprenticeship ethos. Every week I spend 6 hours pair-programming with our junior and mid-level engineers. We build software together, not in silos.',
        },
        {
          speaker: 'Dennis Kipkemboi',
          timestamp: '3:50',
          text: 'Seeing a mother run her wholesale pharmacy business with the software we designed is a feeling no ad-optimization algorithm can ever match.',
        },
      ],
      tags: ['Testimonial', 'Senior Leadership', 'Systems Architecture', 'Impact'],
    },
    {
      id: 'vid-culture-2',
      title: 'Radical Merchant Empathy: Inside Open-Air Market Field Visits',
      category: 'culture',
      categoryLabel: 'Company Culture',
      duration: '3:30',
      durationSeconds: 210,
      thumbnail: teamStrategyImg,
      location: 'Makola Market (Accra) & Balogun (Lagos)',
      speaker: {
        name: 'Tariro Moyo',
        role: 'Staff Product Experience Designer',
        avatar: femaleEngineerImg,
      },
      description:
        'Engineers and designers leaving their desks to spend days with vegetable traders, textile wholesalers, and auto-parts retailers. Witness how hands-on field testing drives our ultra-high contrast UI and one-thumb POS designs.',
      keyTakeaways: [
        'Mandatory field immersion days for all product and engineering hires',
        'Direct observation of glare, noise, and one-handed checkout workflows',
        'Fast feedback loops: merchant feedback turns into PRs within 48 hours',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Why Desks Lie and Markets Don’t' },
        { timestamp: '1:00', seconds: 60, title: 'Testing UI Under Midday Equatorial Sun' },
        { timestamp: '2:05', seconds: 125, title: 'Designing for Single-Thumb Speed' },
        { timestamp: '3:00', seconds: 180, title: 'Merchant Trust as Our Primary Metric' },
      ],
      transcript: [
        {
          speaker: 'Tariro Moyo',
          timestamp: '0:00',
          text: 'A design system that looks gorgeous on an Apple Studio Display in an air-conditioned office can be utterly illegible under the intense equatorial sun of Balogun Market.',
        },
        {
          speaker: 'Tariro Moyo',
          timestamp: '1:00',
          text: 'That is why every engineer at MsmeBooks spends time on the ground. We watch merchants handle cash, answer phone calls, and punch in inventory simultaneously.',
        },
        {
          speaker: 'Tariro Moyo',
          timestamp: '2:05',
          text: 'This field empathy taught us to eliminate dropdown menus in favor of high-contrast tactile number pads and voice-assisted receipt notes.',
        },
        {
          speaker: 'Tariro Moyo',
          timestamp: '3:00',
          text: 'When merchants see that you took the time to understand their environment, they don’t just become users—they become our fiercest advocates.',
        },
      ],
      tags: ['Merchant Empathy', 'User Research', 'Field Study', 'Design Systems'],
    },
    {
      id: 'vid-daytoday-2',
      title: 'Distributed Autonomy: Ergonomic Remote Workspace Tour from Cape Town',
      category: 'day-to-day',
      categoryLabel: 'Day-to-Day Work',
      duration: '3:15',
      durationSeconds: 195,
      thumbnail: remoteWorkImg,
      location: 'Distributed Hub (Cape Town / Remote)',
      speaker: {
        name: 'Marcus Van Der Merwe',
        role: 'Senior Staff Frontend Architect',
        avatar: remoteWorkImg,
      },
      description:
        'Tour Marcus’s remote workstation in Cape Town: Herman Miller ergonomic seating, multi-display setup, automated solar backup battery, and how our async documentation rituals keep teammates synced without time zone friction.',
      keyTakeaways: [
        '$1,500 initial home workspace stipend plus annual hardware refresh cycle',
        'Solar and UPS power backup subsidies for all remote teammates',
        'Asynchronous documentation first: Notion RFCs replace status syncs',
      ],
      chapters: [
        { timestamp: '0:00', seconds: 0, title: 'Home Office Setup & Hardware Stipend' },
        { timestamp: '1:00', seconds: 60, title: 'Tackling Load-Shedding with Solar Backups' },
        { timestamp: '1:50', seconds: 110, title: 'Async Collaboration Across UTC+0 to UTC+3' },
        { timestamp: '2:40', seconds: 160, title: 'Work-Life Harmony & Cape Town Trails' },
      ],
      transcript: [
        {
          speaker: 'Marcus Van Der Merwe',
          timestamp: '0:00',
          text: 'Remote work at MsmeBooks isn’t an afterthought—it’s built on institutional support. Every teammate receives $1,500 for an ergonomic chair, dual displays, and noise-canceling headsets.',
        },
        {
          speaker: 'Marcus Van Der Merwe',
          timestamp: '1:00',
          text: 'In South Africa, load-shedding power cuts can be disruptive. MsmeBooks provided an EcoFlow solar battery backup so my development setup never drops a beat.',
        },
        {
          speaker: 'Marcus Van Der Merwe',
          timestamp: '1:50',
          text: 'Because our engineering processes rely on written RFCs and Notion documentation, I can coordinate with teammates in Lagos and Nairobi without 8 hours of Zoom fatigue.',
        },
        {
          speaker: 'Marcus Van Der Merwe',
          timestamp: '2:40',
          text: 'When my focus block ends, I can hike Lion’s Head or spend time with family. It is genuine flexibility coupled with world-class engineering rigor.',
        },
      ],
      tags: ['Remote Work', 'Ergonomics', 'Async Collaboration', 'Cape Town'],
    },
  ];

  // =========================================================================
  // PHOTO GALLERY DATA
  // =========================================================================
  const galleryItems: GalleryItem[] = [
    {
      id: 'photo-1',
      title: 'Dev Mentorship & Pair-Programming in Nairobi',
      category: 'mentorship',
      categoryLabel: 'Developer Mentorship',
      image: mentorshipImg,
      location: 'Nairobi Innovation Hub, Kenya',
      aspect: 'aspect-[16/10]',
      span: 'md:col-span-8',
      quote: {
        text: 'At MsmeBooks, code reviews are teaching sessions, never gatekeeping. Senior engineers pair directly with junior colleagues on production microservices.',
        author: 'Dennis Kipkemboi',
        role: 'Principal Systems Architect',
      },
      description:
        'Our Nairobi engineering squad reviewing transaction rollback safeguards for offline POS ledgers. We invest in 1-on-1 mentorship, peer debugging circles, and distributed pair-programming so every developer builds mastery quickly.',
      tags: ['Pair-Programming', 'Mentorship', 'Code Quality', 'Nairobi'],
    },
    {
      id: 'photo-2',
      title: 'Cross-Functional Squad Architecture Session',
      category: 'multicultural',
      categoryLabel: 'Multicultural Teams',
      image: teamCollabImg,
      location: 'Kigali Tech Innovation Lab, Rwanda',
      aspect: 'aspect-[4/3] md:aspect-auto',
      span: 'md:col-span-4',
      quote: {
        text: 'Working with teammates across East, West, and Southern Africa brings perspectives you simply cannot find in homogeneous teams.',
        author: 'Sandrine Uwase',
        role: 'Lead AI Engineer',
      },
      description:
        'Product managers, data scientists, and UX designers from Rwanda, Nigeria, and Kenya mapping out our smart OCR receipt parsing engine at our Kigali lab.',
      tags: ['Pan-African', 'AI Squad', 'Cross-Border', 'Kigali'],
    },
    {
      id: 'photo-3',
      title: 'Female Engineering Leadership in Fintech',
      category: 'craft',
      categoryLabel: 'Software Craft',
      image: femaleEngineerImg,
      location: 'Lagos Island Tech Center, Nigeria',
      aspect: 'aspect-[4/3]',
      span: 'md:col-span-4',
      quote: {
        text: '48% of our engineering and product leads are African women shaping the infrastructure that powers billions in retail trade.',
        author: 'Amina Bello',
        role: 'Senior Staff Engineer',
      },
      description:
        'Deep focus time in Lagos building sub-second reconciliation algorithms for multi-currency retail transactions. We treat software engineering as an art form with strict performance benchmarks.',
      tags: ['Women in Tech', 'Deep Work', 'Lagos Hub', 'Architecture'],
    },
    {
      id: 'photo-4',
      title: 'Ergonomic Distributed Work From Anywhere',
      category: 'workspaces',
      categoryLabel: 'Modern Workspaces',
      image: remoteWorkImg,
      location: 'Distributed Hub (Cape Town / Remote)',
      aspect: 'aspect-[4/3]',
      span: 'md:col-span-4',
      quote: {
        text: 'True flexibility means having the tools and autonomy to do your best work from home, a co-working space, or a regional hub.',
        author: 'Tariro Moyo',
        role: 'Senior Product Designer',
      },
      description:
        'Every MsmeBooks teammate receives an ergonomic home office stipend, Herman Miller chair subsidy, noise-canceling hardware, and access to WeWork / local tech spaces across Africa.',
      tags: ['Ergonomics', 'Async Autonomy', 'Remote-First', 'Focus'],
    },
    {
      id: 'photo-5',
      title: 'Merchant-Centric Product Ideation',
      category: 'craft',
      categoryLabel: 'Product & Design',
      image: teamStrategyImg,
      location: 'Accra Collaboration Studio, Ghana',
      aspect: 'aspect-[4/3]',
      span: 'md:col-span-4',
      quote: {
        text: 'Before we write a single line of backend logic, we whiteboard directly with local merchants to understand their daily hustle.',
        author: 'Kofi Mensah',
        role: 'Head of Product Operations',
      },
      description:
        'Designers and engineers in Accra debating invoice layouts, low-bandwidth optimizations, and simplified inventory tracking for retail store managers.',
      tags: ['Product Discovery', 'Whiteboarding', 'Accra', 'Impact'],
    },
  ];

  // Filters
  const filteredVideos = videoItems.filter((v) => {
    if (activeVideoCategory === 'all') return true;
    return v.category === activeVideoCategory;
  });

  const filteredPhotos = galleryItems.filter((item) => {
    if (activePhotoCategory === 'all') return true;
    return item.category === activePhotoCategory;
  });

  return (
    <section
      id="life-at-msmebooks"
      className="py-24 bg-[#F8FAFC] dark:bg-[#070D1A] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 relative overflow-hidden"
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B5E61D]/10 dark:bg-[#B5E61D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =========================================================================
            SECTION HEADER & EDITORIAL HEADLINE
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            {/* Unboxed Metadata Header */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
              <span>Culture & Community · Pan-African Innovation</span>
            </div>

            {/* Requested Engaging Editorial Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14243A] dark:text-white tracking-tight leading-tight text-balance">
              Great People. Bold Ideas.{' '}
              <span className="text-[#0066CC] dark:text-[#38BDF8]">Real Impact.</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              We are a distributed collective of engineers, designers, financial experts, and product architects
              across Nairobi, Lagos, Kigali, Accra, and Cape Town. We reject bureaucratic red tape in favor of deep
              craft, authentic mentorship, and an obsession with empowering Africa's 44 million MSMEs.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black text-[#0066CC] dark:text-[#38BDF8] font-mono">48%</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Women in Tech Leads
              </div>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black text-[#0066CC] dark:text-[#38BDF8] font-mono">20+</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Pan-African Hubs
              </div>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">94%</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Team Retention Rate
              </div>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black text-[#0066CC] dark:text-[#38BDF8] font-mono">$1.5k</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Annual Learning Grant
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRIMARY SECTION TOGGLE (VIDEO GALLERY vs PHOTO BENTO)
           ========================================================================= */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMediaMode('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mediaMode === 'all'
                  ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Media ({videoItems.length + galleryItems.length})
            </button>
            <button
              type="button"
              onClick={() => setMediaMode('videos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mediaMode === 'videos'
                  ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#B5E61D]" />
              <span>Video Gallery ({videoItems.length})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-[#B5E61D]/20 text-[#14243A] dark:text-[#B5E61D]">
                Interactive
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMediaMode('photos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mediaMode === 'photos'
                  ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Photo Bento ({galleryItems.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {mediaMode === 'videos'
              ? 'Watch employee stories, culture highlights & work environments'
              : 'Interactive stories from our Pan-African hubs'}
          </div>
        </div>

        {/* =========================================================================
            SECTION A: VIDEO GALLERY (RESPONSIVE SHOWCASE WITH PLACEHOLDERS & MODAL)
           ========================================================================= */}
        {(mediaMode === 'all' || mediaMode === 'videos') && (
          <div className="mb-20">
            {/* Video Sub-Header & Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-1">
                  <Video className="w-4 h-4 text-[#B5E61D]" />
                  <span>Life at MsmeBooks Video Stories</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#14243A] dark:text-white">
                  Company Culture, Employee Testimonials & Work Life
                </h3>
              </div>

              {/* Video Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveVideoCategory('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    activeVideoCategory === 'all'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Videos ({videoItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoCategory('culture')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeVideoCategory === 'culture'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Company Culture</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoCategory('testimonials')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeVideoCategory === 'testimonials'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Employee Testimonials</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoCategory('day-to-day')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeVideoCategory === 'day-to-day'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Day-to-Day Work</span>
                </button>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleOpenVideo(video)}
                  className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Video Poster & Play Button Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/90 via-[#14243A]/30 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs font-semibold text-white">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] flex items-center gap-1.5 font-bold">
                        {video.category === 'culture' && <Heart className="w-3 h-3 text-rose-400" />}
                        {video.category === 'testimonials' && <Users className="w-3 h-3 text-sky-400" />}
                        {video.category === 'day-to-day' && <Laptop className="w-3 h-3 text-emerald-400" />}
                        <span>{video.categoryLabel}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold flex items-center gap-1 text-white">
                        <Clock className="w-3 h-3 text-[#B5E61D]" />
                        <span>{video.duration}</span>
                      </span>
                    </div>

                    {/* Center Animated Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-[#14243A]/90 backdrop-blur-md text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-[#0066CC] group-hover:text-white transition-all duration-300">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Location Indicator */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-[#B5E61D] shrink-0" />
                      <span className="truncate">{video.location}</span>
                    </div>
                  </div>

                  {/* Video Content & Speaker Card */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white leading-snug group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors mb-2">
                        {video.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    {/* Speaker Metadata */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-200">
                          <img
                            src={video.speaker.avatar}
                            alt={video.speaker.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#14243A] dark:text-white leading-tight">
                            {video.speaker.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {video.speaker.role}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Watch</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION B: PHOTOGRAPHY BENTO GALLERY
           ========================================================================= */}
        {(mediaMode === 'all' || mediaMode === 'photos') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-1">
                  <Film className="w-4 h-4 text-[#B5E61D]" />
                  <span>Photo Perspectives & Workspaces</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#14243A] dark:text-white">
                  Everyday Life Across Our Pan-African Studios
                </h3>
              </div>

              {/* Photo Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActivePhotoCategory('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    activePhotoCategory === 'all'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Photos ({galleryItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoCategory('mentorship')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activePhotoCategory === 'mentorship'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Mentorship</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoCategory('multicultural')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activePhotoCategory === 'multicultural'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Multicultural Teams</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoCategory('workspaces')}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activePhotoCategory === 'workspaces'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                      : 'bg-white dark:bg-[#0D1527] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Workspaces</span>
                </button>
              </div>
            </div>

            {/* Photo Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className={`${item.span} group relative rounded-3xl overflow-hidden bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between`}
                >
                  <div className={`relative w-full ${item.aspect} overflow-hidden bg-slate-900`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/90 via-[#14243A]/25 to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white">
                      <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#B5E61D]" />
                        <span>{item.location}</span>
                      </span>

                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#B5E61D] mb-1">
                        {item.categoryLabel}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {item.quote && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <blockquote className="text-xs italic text-slate-700 dark:text-slate-300 relative pl-3 border-l-2 border-[#0066CC] dark:border-[#38BDF8]">
                          "{item.quote.text}"
                        </blockquote>
                        <div className="mt-2 text-[11px] font-bold text-[#14243A] dark:text-white flex items-center justify-between">
                          <span>{item.quote.author}</span>
                          <span className="text-slate-400 font-normal">{item.quote.role}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            CULTURE MANIFESTO CARDS (HOW WE OPERATE)
           ========================================================================= */}
        <div className="mt-16 p-8 sm:p-10 bg-white dark:bg-[#0D1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#B5E61D]" />
              <span>Our Operating Philosophy</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] dark:text-white">
              Built for African Realities. Driven by Human Craft.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              We know great software is not built by burned-out engineers attending endless meetings. Here is what you can rely on when you join MsmeBooks:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111A30] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center font-bold mb-3">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#14243A] dark:text-white mb-1.5">
                  Radical Merchant Empathy
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Engineers spend regular days in real retail markets—talking with kiosk owners, pharmacy cashiers, and FMCG wholesalers to test UI usability under real sun and low connectivity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-[#0066CC] dark:text-[#38BDF8] font-bold">
                Direct Field Exposure
              </div>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111A30] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
                  <Laptop className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#14243A] dark:text-white mb-1.5">
                  Async-First Focus Time
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  No calendar Tetris. We prioritize written RFC proposals, asynchronous loom reviews, and 4-hour protected deep work windows every single weekday.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                No Pointless Meetings
              </div>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111A30] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#14243A] dark:text-white mb-1.5">
                  High-Stakes Mentorship
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Junior engineers are paired directly with senior leads. Every employee receives $1,500 annually for tech books, certifications, and global developer conferences.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                $1,500 Annual Stipend
              </div>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111A30] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#14243A] dark:text-white mb-1.5">
                  Engineered for Harsh Realities
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Power blinks, network bandwidth fluctuates, and tax regulations evolve. We build resilient local-first SQLite offline engines that never drop a single transaction.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                Zero-Data-Loss Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE VIDEO PLAYER MODAL WITH CHAPTERS & TRANSCRIPT
         ========================================================================= */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-[#0E1729] rounded-3xl max-w-5xl w-full text-white shadow-2xl border border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B5E61D] animate-pulse" />
                <span className="font-extrabold uppercase tracking-wider text-[#B5E61D]">
                  {selectedVideo.categoryLabel}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300 truncate max-w-xs">{selectedVideo.location}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-[16/9] w-full bg-black overflow-hidden group select-none shrink-0">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPlaying ? 'brightness-100 scale-100' : 'brightness-75'
                }`}
              />

              {/* Subtle Ambient Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

              {/* Animated Audio Equalizer waves when playing */}
              {isPlaying && (
                <div className="absolute top-4 right-4 flex items-end gap-1 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="w-1 bg-[#B5E61D] rounded-full animate-bounce h-4" />
                  <span className="w-1 bg-[#38BDF8] rounded-full animate-bounce h-6 [animation-delay:0.2s]" />
                  <span className="w-1 bg-[#B5E61D] rounded-full animate-bounce h-3 [animation-delay:0.4s]" />
                  <span className="w-1 bg-white rounded-full animate-bounce h-5 [animation-delay:0.1s]" />
                  <span className="text-[10px] font-mono text-slate-300 ml-1.5">LIVE STREAM</span>
                </div>
              )}

              {/* Big Center Play/Pause button on hover / paused */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                {!isPlaying && (
                  <div className="w-20 h-20 rounded-full bg-[#0066CC]/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transform scale-100 hover:scale-110 transition-transform">
                    <Play className="w-9 h-9 fill-current translate-x-1" />
                  </div>
                )}
              </div>

              {/* Video Player Bottom Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
                {/* Scrubbable Timeline Track */}
                <div
                  className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer transition-all flex items-center"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.max(0, Math.min(1, clickX / rect.width));
                    handleSeek(Math.floor(percent * selectedVideo.durationSeconds));
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#0066CC] to-[#B5E61D] rounded-full relative"
                    style={{
                      width: `${(currentProgress / selectedVideo.durationSeconds) * 100}%`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 hover:text-[#B5E61D] transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:text-[#B5E61D] transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <div className="font-mono text-[11px] text-slate-300">
                      <span>{formatSeconds(currentProgress)}</span> / <span>{selectedVideo.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg text-[11px] font-mono">
                      {[1, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-[#0066CC] text-white font-bold'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const elem = document.documentElement;
                        if (!document.fullscreenElement) {
                          elem.requestFullscreen?.().catch(() => {});
                        } else {
                          document.exitFullscreen?.().catch(() => {});
                        }
                      }}
                      className="p-1.5 hover:text-[#B5E61D] transition-colors cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Sub-Navigation (Overview, Chapters, Transcript) */}
            <div className="px-6 py-3 bg-[#0A101D] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveVideoModalTab('overview')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    activeVideoModalTab === 'overview'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Overview & Takeaways
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoModalTab('chapters')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeVideoModalTab === 'chapters'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#B5E61D]" />
                  <span>Interactive Chapters ({selectedVideo.chapters.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoModalTab('transcript')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeVideoModalTab === 'transcript'
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Full Transcript</span>
                </button>
              </div>

              {activeVideoModalTab === 'transcript' && (
                <button
                  type="button"
                  onClick={() => handleCopyTranscript(selectedVideo)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTranscript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#B5E61D]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Transcript</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Modal Body Tab Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs sm:text-sm">
              {/* TAB 1: OVERVIEW */}
              {activeVideoModalTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      {selectedVideo.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      {selectedVideo.description}
                    </p>
                  </div>

                  {/* Speaker Details */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                      <img
                        src={selectedVideo.speaker.avatar}
                        alt={selectedVideo.speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{selectedVideo.speaker.name}</div>
                      <div className="text-xs text-slate-400">{selectedVideo.speaker.role}</div>
                      <div className="text-[11px] text-[#B5E61D] mt-0.5 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{selectedVideo.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  <div className="p-5 bg-blue-950/30 rounded-2xl border border-blue-900/50 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#B5E61D]" />
                      <span>Key Takeaways & Engineering Practices</span>
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {selectedVideo.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D] mt-1.5 shrink-0" />
                          <span className="text-slate-200 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CHAPTERS */}
              {activeVideoModalTab === 'chapters' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 mb-2">
                    Click any chapter timestamp to immediately jump playback to that moment:
                  </div>
                  {selectedVideo.chapters.map((chapter, idx) => {
                    const isActive =
                      currentProgress >= chapter.seconds &&
                      (idx === selectedVideo.chapters.length - 1 ||
                        currentProgress < selectedVideo.chapters[idx + 1].seconds);

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSeek(chapter.seconds)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-[#0066CC]/20 border-[#0066CC] text-white shadow-sm'
                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                              isActive
                                ? 'bg-[#0066CC] text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {chapter.timestamp}
                          </span>
                          <span className="font-semibold text-xs sm:text-sm">{chapter.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="text-[10px] font-bold text-[#B5E61D] uppercase tracking-wider">
                              Now Playing
                            </span>
                          )}
                          <Play className="w-4 h-4 text-slate-400 hover:text-white" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: TRANSCRIPT */}
              {activeVideoModalTab === 'transcript' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 mb-2">
                    Verified verbatim transcript with timestamps. Click any timestamp to jump:
                  </div>
                  {selectedVideo.transcript.map((line, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#38BDF8]">{line.speaker}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const [m, s] = line.timestamp.split(':').map(Number);
                            handleSeek(m * 60 + s);
                          }}
                          className="font-mono text-[11px] text-slate-400 hover:text-[#B5E61D] cursor-pointer"
                        >
                          [{line.timestamp}]
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Actions CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Inspired by our culture and mission? We are actively hiring across African hubs.
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideo(null);
                    const el = document.getElementById('job-board');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Open Engineering Roles</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HIGH-RESOLUTION CINEMATIC LIGHTBOX MODAL (PHOTO)
         ========================================================================= */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-[#14243A] rounded-3xl max-w-4xl w-full text-white shadow-2xl border border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B5E61D]" />
                <span className="font-bold uppercase tracking-wider text-[#B5E61D]">
                  {selectedPhoto.categoryLabel}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{selectedPhoto.location}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <div className="relative aspect-[16/9] w-full bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedPhoto.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {selectedPhoto.description}
                </p>

                {selectedPhoto.quote && (
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
                    <p className="text-xs sm:text-sm italic text-slate-200">
                      "{selectedPhoto.quote.text}"
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#B5E61D] flex items-center justify-between">
                      <span>{selectedPhoto.quote.author}</span>
                      <span className="text-slate-400 font-normal">{selectedPhoto.quote.role}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(null);
                      const el = document.getElementById('job-board');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore Open Positions</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
