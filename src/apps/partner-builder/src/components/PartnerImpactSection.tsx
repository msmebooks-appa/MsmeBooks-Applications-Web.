import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe2, 
  Sparkles, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Pause, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface MonthlyDataPoint {
  month: string;
  shortMonth: string;
  commissionsPaid: number; // in USD
  cumulativeCommissions: number;
  activePartners: number;
  newPartners: number;
  topCountry: string;
  flag: string;
}

const HISTORICAL_IMPACT_DATA: MonthlyDataPoint[] = [
  { month: 'Jan 2025', shortMonth: 'Jan', commissionsPaid: 45000, cumulativeCommissions: 450000, activePartners: 32, newPartners: 6, topCountry: 'Nigeria', flag: '🇳🇬' },
  { month: 'Feb 2025', shortMonth: 'Feb', commissionsPaid: 58000, cumulativeCommissions: 508000, activePartners: 39, newPartners: 7, topCountry: 'Nigeria', flag: '🇳🇬' },
  { month: 'Mar 2025', shortMonth: 'Mar', commissionsPaid: 72000, cumulativeCommissions: 580000, activePartners: 48, newPartners: 9, topCountry: 'Kenya', flag: '🇰🇪' },
  { month: 'Apr 2025', shortMonth: 'Apr', commissionsPaid: 89000, cumulativeCommissions: 669000, activePartners: 56, newPartners: 8, topCountry: 'Kenya', flag: '🇰🇪' },
  { month: 'May 2025', shortMonth: 'May', commissionsPaid: 105000, cumulativeCommissions: 774000, activePartners: 65, newPartners: 9, topCountry: 'Ghana', flag: '🇬🇭' },
  { month: 'Jun 2025', shortMonth: 'Jun', commissionsPaid: 124000, cumulativeCommissions: 898000, activePartners: 73, newPartners: 8, topCountry: 'Nigeria', flag: '🇳🇬' },
  { month: 'Jul 2025', shortMonth: 'Jul', commissionsPaid: 146000, cumulativeCommissions: 1044000, activePartners: 82, newPartners: 9, topCountry: 'South Africa', flag: '🇿🇦' },
  { month: 'Aug 2025', shortMonth: 'Aug', commissionsPaid: 168000, cumulativeCommissions: 1212000, activePartners: 91, newPartners: 9, topCountry: 'Rwanda', flag: '🇷🇼' },
  { month: 'Sep 2025', shortMonth: 'Sep', commissionsPaid: 195000, cumulativeCommissions: 1407000, activePartners: 102, newPartners: 11, topCountry: 'Kenya', flag: '🇰🇪' },
  { month: 'Oct 2025', shortMonth: 'Oct', commissionsPaid: 218000, cumulativeCommissions: 1625000, activePartners: 114, newPartners: 12, topCountry: 'Senegal', flag: '🇸🇳' },
  { month: 'Nov 2025', shortMonth: 'Nov', commissionsPaid: 242000, cumulativeCommissions: 1867000, activePartners: 125, newPartners: 11, topCountry: 'Côte d’Ivoire', flag: '🇨🇮' },
  { month: 'Dec 2025', shortMonth: 'Dec', commissionsPaid: 275000, cumulativeCommissions: 2142000, activePartners: 133, newPartners: 8, topCountry: 'Nigeria', flag: '🇳🇬' },
  { month: 'Jan 2026', shortMonth: 'Jan 26', commissionsPaid: 308000, cumulativeCommissions: 2450000, activePartners: 142, newPartners: 9, topCountry: 'Pan-Africa', flag: '🌍' }
];

const REGIONAL_FLOW_DATA = [
  { region: 'West Africa', share: 42, amount: 1029000, color: '#0A3981', countries: 'Nigeria, Ghana, Senegal, Côte d’Ivoire', flag: '🇳🇬 🇬🇭 🇸🇳 🇨🇮' },
  { region: 'East Africa', share: 36, amount: 882000, color: '#0284C7', countries: 'Kenya, Rwanda, Uganda, Tanzania', flag: '🇰🇪 🇷🇼 🇺🇬 🇹🇿' },
  { region: 'Southern Africa', share: 14, amount: 343000, color: '#8CE600', countries: 'South Africa, Botswana, Zambia', flag: '🇿🇦 🇧🇼 🇿🇲' },
  { region: 'North Africa & Diaspora', share: 8, amount: 196000, color: '#F59E0B', countries: 'Egypt, UK, UAE Trade Corridor', flag: '🇪🇬 🇬🇧 🇦🇪' }
];

const RECENT_LIVE_EVENTS = [
  { id: 1, type: 'commission', text: '+$145 commission wired to David Mwangi', location: 'Nairobi, Kenya', flag: '🇰🇪', ago: '2s ago' },
  { id: 2, type: 'partner', text: 'New Gold Partner practice accredited', location: 'Dakar, Senegal', flag: '🇸🇳', ago: '8s ago' },
  { id: 3, type: 'commission', text: '+$380 monthly recurring share disbursed', location: 'Lagos, Nigeria', flag: '🇳🇬', ago: '15s ago' },
  { id: 4, type: 'client', text: '32 new retail stores onboarded via POS Partner', location: 'Accra, Ghana', flag: '🇬🇭', ago: '24s ago' },
  { id: 5, type: 'commission', text: '+$520 enterprise implementation bonus wired', location: 'Johannesburg, South Africa', flag: '🇿🇦', ago: '31s ago' },
  { id: 6, type: 'partner', text: 'Kazinga Advisory advanced to Silver Tier', location: 'Kampala, Uganda', flag: '🇺🇬', ago: '42s ago' }
];

const PartnerImpactSectionComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'commissions' | 'partners' | 'regions'>('commissions');
  const [timeframe, setTimeframe] = useState<'all' | '12m' | '6m'>('all');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveEvents, setLiveEvents] = useState(RECENT_LIVE_EVENTS);
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyDataPoint | null>(null);
  const [liveCommissionTotal, setLiveCommissionTotal] = useState<number>(2450890);
  const [livePartnerCount, setLivePartnerCount] = useState<number>(142);

  // SVG ref for D3 rendering
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Real-time simulated ticker for live telemetry
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      // Simulate real-time increment in commissions ($10 to $85)
      const inc = Math.floor(Math.random() * 65) + 15;
      setLiveCommissionTotal((prev) => prev + inc);

      // Occasionally add a live stream notification event
      if (Math.random() > 0.6) {
        const sampleLocations = [
          { loc: 'Nairobi, Kenya', flag: '🇰🇪', text: `+$${inc * 4} recurring commission settlement` },
          { loc: 'Lagos, Nigeria', flag: '🇳🇬', text: `+$${inc * 5} monthly rev share wire` },
          { loc: 'Abidjan, Côte d’Ivoire', flag: '🇨🇮', text: `+$${inc * 3} POS cloud recurring fee` },
          { loc: 'Kigali, Rwanda', flag: '🇷🇼', text: `+$${inc * 3} EBM E-Tax sync bonus` },
          { loc: 'Dar es Salaam, Tanzania', flag: '🇹🇿', text: `+$${inc * 4} safari enterprise client payout` }
        ];
        const picked = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        
        setLiveEvents((prev) => [
          {
            id: Date.now(),
            type: 'commission',
            text: picked.text,
            location: picked.loc,
            flag: picked.flag,
            ago: 'Just now'
          },
          ...prev.slice(0, 5)
        ]);
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Filter historical data based on timeframe
  const filteredData = useMemo(() => {
    if (timeframe === '6m') return HISTORICAL_IMPACT_DATA.slice(-6);
    if (timeframe === '12m') return HISTORICAL_IMPACT_DATA.slice(-12);
    return HISTORICAL_IMPACT_DATA;
  }, [timeframe]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 800;
    const height = 380;
    const margin = { top: 35, right: 35, bottom: 45, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add defs for rich gradient fills
    const defs = svg.append('defs');

    // Commission Area Gradient (Corporate Blue to Neon Green tint)
    const commGradient = defs
      .append('linearGradient')
      .attr('id', 'commissions-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    commGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0A3981')
      .attr('stop-opacity', 0.55);

    commGradient
      .append('stop')
      .attr('offset', '60%')
      .attr('stop-color', '#0284C7')
      .attr('stop-opacity', 0.25);

    commGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8CE600')
      .attr('stop-opacity', 0.02);

    // Partner Bar Gradient
    const partnerGradient = defs
      .append('linearGradient')
      .attr('id', 'partners-bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    partnerGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8CE600')
      .attr('stop-opacity', 0.95);

    partnerGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0A3981')
      .attr('stop-opacity', 0.85);

    // ==========================================
    // VIEW 1: COMMISSIONS PAID AREA CHART
    // ==========================================
    if (activeTab === 'commissions') {
      const xScale = d3
        .scalePoint()
        .domain(filteredData.map((d) => d.shortMonth))
        .range([0, innerWidth])
        .padding(0.2);

      const maxVal = d3.max(filteredData, (d) => d.cumulativeCommissions) || 2500000;
      const yScale = d3
        .scaleLinear()
        .domain([0, maxVal * 1.1])
        .range([innerHeight, 0])
        .nice();

      // Horizontal Grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.12)
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#0A3981')
        .attr('stroke-dasharray', '3 3');

      // D3 Area Generator
      const area = d3
        .area<MonthlyDataPoint>()
        .x((d) => xScale(d.shortMonth) || 0)
        .y0(innerHeight)
        .y1((d) => yScale(d.cumulativeCommissions))
        .curve(d3.curveMonotoneX);

      // D3 Line Generator
      const line = d3
        .line<MonthlyDataPoint>()
        .x((d) => xScale(d.shortMonth) || 0)
        .y((d) => yScale(d.cumulativeCommissions))
        .curve(d3.curveMonotoneX);

      // Render Area with gradient
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'url(#commissions-gradient)')
        .attr('d', area);

      // Render Line
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#0A3981')
        .attr('stroke-width', 3.5)
        .attr('d', line);

      // Milestone Threshold Line ($1M Milestone)
      if (maxVal >= 1000000) {
        const y1M = yScale(1000000);
        g.append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', y1M)
          .attr('y2', y1M)
          .attr('stroke', '#8CE600')
          .attr('stroke-dasharray', '5 4')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.85);

        g.append('text')
          .attr('x', innerWidth - 5)
          .attr('y', y1M - 6)
          .attr('text-anchor', 'end')
          .attr('fill', '#4d7c0f')
          .attr('class', 'text-[10px] font-mono font-bold dark:fill-[#8CE600]')
          .text('★ $1M Cumulative Partner Payout Milestone');
      }

      // Render Data Points
      g.selectAll('.dot')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.shortMonth) || 0)
        .attr('cy', (d) => yScale(d.cumulativeCommissions))
        .attr('r', 5)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#0A3981')
        .attr('stroke-width', 2.5)
        .attr('class', 'cursor-pointer transition-transform duration-150 hover:scale-150')
        .on('mouseenter', (_, d) => setHoveredPoint(d))
        .on('mouseleave', () => setHoveredPoint(null));

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .call((sel) => sel.select('.domain').attr('stroke', '#94a3b8').attr('opacity', 0.5))
        .selectAll('text')
        .attr('fill', '#64748b')
        .attr('class', 'text-[11px] font-bold')
        .attr('dy', '14px');

      // Y Axis
      g.append('g')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickFormat((d) => `$${(Number(d) / 1000).toFixed(0)}k`)
        )
        .call((sel) => sel.select('.domain').remove())
        .selectAll('text')
        .attr('fill', '#64748b')
        .attr('class', 'text-[10px] font-mono font-semibold');
    }

    // ==========================================
    // VIEW 2: ACTIVE PARTNERS ONBOARDED BARS
    // ==========================================
    else if (activeTab === 'partners') {
      const xScale = d3
        .scaleBand()
        .domain(filteredData.map((d) => d.shortMonth))
        .range([0, innerWidth])
        .padding(0.35);

      const maxPartners = d3.max(filteredData, (d) => d.activePartners) || 150;
      const yScale = d3
        .scaleLinear()
        .domain([0, maxPartners * 1.15])
        .range([innerHeight, 0])
        .nice();

      // Grid lines
      g.append('g')
        .attr('opacity', 0.12)
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#0A3981')
        .attr('stroke-dasharray', '3 3');

      // Bars with rounded top
      g.selectAll('.bar')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.shortMonth) || 0)
        .attr('y', (d) => yScale(d.activePartners))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => innerHeight - yScale(d.activePartners))
        .attr('rx', 6)
        .attr('fill', 'url(#partners-bar-gradient)')
        .attr('class', 'cursor-pointer transition-opacity duration-150 hover:opacity-80')
        .on('mouseenter', (_, d) => setHoveredPoint(d))
        .on('mouseleave', () => setHoveredPoint(null));

      // Bar Value labels
      g.selectAll('.bar-label')
        .data(filteredData)
        .enter()
        .append('text')
        .attr('x', (d) => (xScale(d.shortMonth) || 0) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d.activePartners) - 7)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0A3981')
        .attr('class', 'text-[10px] font-mono font-extrabold dark:fill-[#8CE600]')
        .text((d) => d.activePartners);

      // Target Progression Goal Line
      const goalLine = d3
        .line<MonthlyDataPoint>()
        .x((d) => (xScale(d.shortMonth) || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.activePartners * 1.08))
        .curve(d3.curveCatmullRom);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#0A3981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.6)
        .attr('d', goalLine);

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .call((sel) => sel.select('.domain').attr('stroke', '#94a3b8').attr('opacity', 0.5))
        .selectAll('text')
        .attr('fill', '#64748b')
        .attr('class', 'text-[11px] font-bold')
        .attr('dy', '14px');

      // Y Axis
      g.append('g')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickFormat((d) => `${d} firms`)
        )
        .call((sel) => sel.select('.domain').remove())
        .selectAll('text')
        .attr('fill', '#64748b')
        .attr('class', 'text-[10px] font-mono font-semibold');
    }

    // ==========================================
    // VIEW 3: REGIONAL CAPITAL FLOW DONUT CHART
    // ==========================================
    else if (activeTab === 'regions') {
      const radius = Math.min(innerWidth, innerHeight) / 2 + 10;
      const donutG = g
        .append('g')
        .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

      const pie = d3
        .pie<{ region: string; share: number; amount: number; color: string }>()
        .value((d) => d.share)
        .sort(null);

      const arc = d3
        .arc<d3.PieArcDatum<{ region: string; share: number; amount: number; color: string }>>()
        .innerRadius(radius * 0.58)
        .outerRadius(radius * 0.92)
        .cornerRadius(6)
        .padAngle(0.03);

      const arcs = donutG
        .selectAll('.arc')
        .data(pie(REGIONAL_FLOW_DATA))
        .enter()
        .append('g')
        .attr('class', 'arc cursor-pointer group');

      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => d.data.color)
        .attr('class', 'transition-transform duration-200 hover:scale-105')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2);

      // Center Text Summary
      donutG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-8px')
        .attr('fill', '#0A3981')
        .attr('class', 'text-2xl font-black font-mono tracking-tight dark:fill-white')
        .text('$2.45M');

      donutG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '14px')
        .attr('fill', '#64748b')
        .attr('class', 'text-[10px] font-bold uppercase tracking-wider dark:fill-blue-200')
        .text('Pan-Africa Payouts');

      donutG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '30px')
        .attr('fill', '#8CE600')
        .attr('class', 'text-[10px] font-mono font-bold dark:fill-[#8CE600]')
        .text('● 100% Wire Settlement');
    }
  }, [activeTab, filteredData]);

  return (
    <section id="impact" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#8CE600]" />
            Real-Time Partner Economic Impact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Measurable Partner Impact Across Africa
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            Verifiable ecosystem metrics, cumulative commission flow, and partner onboarding growth powered by live MsmeBooks network telemetry.
          </p>
        </div>

        {/* Global Metric Impact KPI Hero Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
          
          {/* KPI 1: Total Commissions Paid */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-[#0A2552] dark:via-[#072049] dark:to-[#061F4A] p-4 sm:p-6 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                Total Commissions Paid
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A3981] dark:text-white font-mono tracking-tight tabular-nums">
              ${liveCommissionTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 dark:text-[#8CE600]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>+$280K Paid This Month</span>
            </div>
          </div>

          {/* KPI 2: Active Partners Onboarded */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-[#0A2552] dark:via-[#072049] dark:to-[#061F4A] p-4 sm:p-6 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                Active Certified Partners
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-[#8CE600] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A3981] dark:text-white font-mono tracking-tight tabular-nums">
              {livePartnerCount} Firms
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600 dark:text-blue-200">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
              <span>+9 Joined This Quarter</span>
            </div>
          </div>

          {/* KPI 3: MSME Clients Empowered */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-[#0A2552] dark:via-[#072049] dark:to-[#061F4A] p-4 sm:p-6 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                MSMEs Managed
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A3981] dark:text-white font-mono tracking-tight tabular-nums">
              18,450+
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600 dark:text-blue-200">
              <span>Supermarkets, Clinics, Farms</span>
            </div>
          </div>

          {/* KPI 4: Wire Settlements */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-[#0A2552] dark:via-[#072049] dark:to-[#061F4A] p-4 sm:p-6 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                Settlement Reliability
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-[#8CE600] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A3981] dark:text-white font-mono tracking-tight">
              100.0%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600 dark:text-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Settlement Delays</span>
            </div>
          </div>

        </div>

        {/* Interactive D3 Visualization Workspace */}
        <div className="bg-slate-50 dark:bg-[#072457] rounded-3xl border border-slate-200 dark:border-blue-800/80 p-4 sm:p-8 shadow-sm mb-8">
          
          {/* Visualizer Top Bar Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-blue-900/60">
            
            {/* Metric Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#061F4A] p-1.5 rounded-2xl border border-slate-200 dark:border-blue-900 shadow-xs overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('commissions')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'commissions'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Total Commissions Paid</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('partners')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'partners'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Active Partners Onboarded</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('regions')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'regions'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Regional Capital Flow</span>
              </button>
            </div>

            {/* Timeframe Filter and Live Stream Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab !== 'regions' && (
                <div className="flex items-center bg-white dark:bg-[#061F4A] rounded-xl border border-slate-200 dark:border-blue-900 p-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <button
                    onClick={() => setTimeframe('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timeframe === 'all' ? 'bg-[#0A3981] text-white dark:bg-blue-600' : 'hover:text-[#0A3981]'
                    }`}
                  >
                    All-Time
                  </button>
                  <button
                    onClick={() => setTimeframe('12m')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timeframe === '12m' ? 'bg-[#0A3981] text-white dark:bg-blue-600' : 'hover:text-[#0A3981]'
                    }`}
                  >
                    12 Mo
                  </button>
                  <button
                    onClick={() => setTimeframe('6m')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timeframe === '6m' ? 'bg-[#0A3981] text-white dark:bg-blue-600' : 'hover:text-[#0A3981]'
                    }`}
                  >
                    6 Mo
                  </button>
                </div>
              )}

              {/* Live Telemetry Pulse Button */}
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isLiveActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#8CE600] border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-[#061F4A] text-slate-500 border-slate-200 dark:border-blue-900'
                }`}
                title="Toggle Real-Time Telemetry Simulation"
              >
                <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span>{isLiveActive ? 'Live Telemetry Active' : 'Live Paused'}</span>
              </button>
            </div>
          </div>

          {/* D3 SVG Canvas Area */}
          <div ref={containerRef} className="relative w-full mt-6">
            <svg
              ref={svgRef}
              viewBox="0 0 800 380"
              className="w-full h-auto max-h-[420px] overflow-visible"
              aria-label="Partner Impact D3 Real-Time Chart"
            />

            {/* Interactive Tooltip on Data Point Hover */}
            {hoveredPoint && activeTab !== 'regions' && (
              <div className="absolute top-2 right-4 bg-slate-900/95 dark:bg-[#041535]/95 text-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-700 dark:border-blue-700 backdrop-blur-md text-xs pointer-events-none max-w-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between gap-3 font-extrabold mb-1">
                  <span>{hoveredPoint.month}</span>
                  <span>{hoveredPoint.flag} {hoveredPoint.topCountry}</span>
                </div>
                {activeTab === 'commissions' ? (
                  <div className="space-y-1">
                    <div className="text-sm font-black font-mono text-[#8CE600]">
                      ${hoveredPoint.cumulativeCommissions.toLocaleString()} Cumulative
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      ${hoveredPoint.commissionsPaid.toLocaleString()} paid in this single month
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-black font-mono text-[#8CE600]">
                      {hoveredPoint.activePartners} Active Certified Partners
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      +{hoveredPoint.newPartners} new practices graduated
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Regional Flow Legend (Shown when Regional Tab is Active) */}
          {activeTab === 'regions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-blue-900/60">
              {REGIONAL_FLOW_DATA.map((r, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#061F4A] p-3.5 rounded-xl border border-slate-200 dark:border-blue-900/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span>{r.region}</span>
                    </span>
                    <span className="text-xs font-black font-mono" style={{ color: r.color }}>
                      {r.share}%
                    </span>
                  </div>
                  <div className="text-base font-black font-mono text-[#0A3981] dark:text-white">
                    ${(r.amount / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {r.flag} {r.countries}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Real-Time Live Telemetry Stream Bar */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-blue-200 font-bold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Partner Telemetry Feed:</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
              {liveEvents.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white/90 dark:bg-[#061F4A]/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-900 text-slate-700 dark:text-slate-200 flex items-center gap-2 whitespace-nowrap shadow-2xs text-[11px]"
                >
                  <span>{ev.flag}</span>
                  <span className="font-semibold">{ev.text}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({ev.ago})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export const PartnerImpactSection = React.memo(PartnerImpactSectionComponent);

