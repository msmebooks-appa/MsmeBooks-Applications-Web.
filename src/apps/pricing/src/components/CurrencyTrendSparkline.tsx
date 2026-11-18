import React, { useState, useRef, useId } from 'react';
import { TrendDataPoint, generateSvgSparklinePaths } from '../utils/currencyTrends';

interface CurrencyTrendSparklineProps {
  points: TrendDataPoint[];
  isPositive: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  onHoverPoint?: (point: TrendDataPoint | null) => void;
  className?: string;
}

export const CurrencyTrendSparkline: React.FC<CurrencyTrendSparklineProps> = ({
  points,
  isPositive,
  width = 280,
  height = 70,
  showLabels = true,
  onHoverPoint,
  className = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = useId();

  const { linePath, areaPath, coords, minY, maxY } = generateSvgSparklinePaths(
    points,
    width,
    height,
    8
  );

  if (coords.length === 0) return null;

  const activePoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  // Primary stroke and fill colors based on market trend direction
  const strokeColor = isPositive ? '#10B981' : '#3B82F6';
  const fillColorTop = isPositive ? 'rgba(16, 185, 129, 0.28)' : 'rgba(59, 130, 246, 0.25)';
  const fillColorBottom = isPositive ? 'rgba(16, 185, 129, 0.01)' : 'rgba(59, 130, 246, 0.01)';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * width;

    // Find closest data coordinate
    let closestIndex = 0;
    let minDistance = Infinity;

    coords.forEach((c, idx) => {
      const dist = Math.abs(c.x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setHoverIndex(closestIndex);
    if (onHoverPoint) {
      onHoverPoint(coords[closestIndex].point);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    if (onHoverPoint) {
      onHoverPoint(null);
    }
  };

  // Find high and low coordinate points for visual reference markers
  let highCoord = coords[0];
  let lowCoord = coords[0];
  coords.forEach((c) => {
    if (c.point.rate > highCoord.point.rate) highCoord = c;
    if (c.point.rate < lowCoord.point.rate) lowCoord = c;
  });

  const firstCoord = coords[0];
  const lastCoord = coords[coords.length - 1];

  return (
    <div className={`relative select-none ${className}`}>
      {/* Interactive Tooltip Card pinned to active scrub point */}
      {activePoint && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -top-11 transition-all duration-75"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
          }}
        >
          <div className="bg-slate-900 dark:bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700/80 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-xs">
            <span className="text-slate-400">{activePoint.point.dateStr}:</span>
            <span className="font-extrabold text-lime-400 tabular-nums">
              {activePoint.point.formattedRate}
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible cursor-crosshair block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="30-day currency conversion trend chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColorTop} />
            <stop offset="100%" stopColor={fillColorBottom} />
          </linearGradient>

          {/* Glow filter for the trend line */}
          <filter id={`glow-${gradientId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={strokeColor} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Subtle Horizontal Midline Guide */}
        <line
          x1={8}
          y1={height / 2}
          x2={width - 8}
          y2={height / 2}
          stroke="currentColor"
          strokeDasharray="2 3"
          className="text-slate-200 dark:text-slate-800/80"
          strokeWidth="1"
        />

        {/* Gradient Area Fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Sparkline Curve */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${gradientId})`}
        />

        {/* Start Point Marker */}
        <circle
          cx={firstCoord.x}
          cy={firstCoord.y}
          r="2.5"
          className="fill-slate-400 dark:fill-slate-500"
        />

        {/* Current / Today Marker */}
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r="4"
          fill={strokeColor}
          className="animate-pulse"
        />
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r="2"
          fill="#FFFFFF"
        />

        {/* Active Scrub Crosshair Indicator */}
        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              y1={4}
              x2={activePoint.x}
              y2={height - 2}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="4.5"
              fill={strokeColor}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* Timeline Labels */}
      {showLabels && (
        <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mt-1 px-1 font-medium select-none">
          <span>30d ago</span>
          <span>15d</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">Today</span>
        </div>
      )}
    </div>
  );
};
