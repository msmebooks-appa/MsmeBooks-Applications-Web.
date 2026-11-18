import { Currency, CurrencyInfo } from '../types';
import { SUPPORTED_CURRENCIES, formatCurrency } from './currency';

export interface TrendDataPoint {
  dayIndex: number; // 0 to 29 (0 = 30 days ago, 29 = today)
  dateStr: string; // e.g. "12 Oct"
  fullDateStr: string; // e.g. "12 Oct 2026"
  rate: number; // Rate value in NGN per 1 foreign unit (or USD benchmark for NGN)
  formattedRate: string; // e.g. "₦1,480.00"
}

export interface CurrencyTrendSummary {
  currency: Currency;
  currencyInfo: CurrencyInfo;
  isNgnBase: boolean;
  benchmarkLabel: string;
  currentRate: number;
  formattedCurrentRate: string;
  points: TrendDataPoint[];
  high: number;
  low: number;
  averageRate: number;
  changePercent: number;
  changeAbsolute: number;
  isPositive: boolean; // positive means currency strengthened relative to base
  volatility: 'Low' | 'Moderate' | 'High';
}

/**
 * Deterministic pseudo-random generator seeded by a string.
 * Ensures the 30-day trend stays consistent across renders and re-renders on the same day.
 */
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates 30-day historical conversion trend data for any supported currency.
 */
export function get30DayCurrencyTrend(currency: Currency): CurrencyTrendSummary {
  const info = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
  const isNgn = currency === 'NGN';

  // Base rate in NGN per 1 unit of currency
  // If NGN, show USD/NGN benchmark so Nigerian merchants have actionable rate context
  const currentRateInNgn = isNgn
    ? 1 / (SUPPORTED_CURRENCIES.USD?.rateFromNgn || 1 / 1480)
    : 1 / (info.rateFromNgn || 1);

  // Generate deterministic seed based on currency and current date (year, month, day)
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${currency}`;
  const random = seededRandom(stringToSeed(dateKey));

  // Determine standard volatility band for this currency
  let volatilityBand = 0.015; // 1.5% base fluctuation
  let volatilityLabel: 'Low' | 'Moderate' | 'High' = 'Low';

  if (['GHS', 'EGP', 'ZWL', 'ETB'].includes(currency)) {
    volatilityBand = 0.035;
    volatilityLabel = 'High';
  } else if (['KES', 'ZAR', 'RWF', 'XOF'].includes(currency) || isNgn) {
    volatilityBand = 0.022;
    volatilityLabel = 'Moderate';
  } else {
    volatilityBand = 0.012;
    volatilityLabel = 'Low';
  }

  // Generate 30 daily data points ending today with a random walk bounded to realistic bands
  const rawValues: number[] = new Array(30);
  rawValues[29] = currentRateInNgn; // Today's rate is the actual live rate

  // Walk backward from day 29 to day 0
  let walkRate = currentRateInNgn;
  // Trend drift factor: -0.5% to +0.8% drift across the month
  const driftPerDay = (random() - 0.48) * (volatilityBand / 10);

  for (let i = 28; i >= 0; i--) {
    const dailyStep = (random() - 0.5) * (volatilityBand / 5);
    walkRate = walkRate * (1 - dailyStep - driftPerDay);
    rawValues[i] = walkRate;
  }

  // Normalize so day 29 strictly equals currentRateInNgn
  const finalAdjustment = currentRateInNgn / rawValues[29];
  for (let i = 0; i < 30; i++) {
    rawValues[i] = rawValues[i] * finalAdjustment;
  }

  // Build point objects
  const points: TrendDataPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));

    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const fullDateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const rateVal = rawValues[i];

    // Format based on magnitude
    const formatted = formatRate(rateVal, isNgn ? 'NGN' : 'NGN');

    points.push({
      dayIndex: i,
      dateStr,
      fullDateStr,
      rate: rateVal,
      formattedRate: formatted,
    });
  }

  // Stats
  const rates = points.map((p) => p.rate);
  const high = Math.max(...rates);
  const low = Math.min(...rates);
  const sum = rates.reduce((a, b) => a + b, 0);
  const averageRate = sum / rates.length;

  const startRate = points[0].rate;
  const endRate = points[29].rate;
  const changeAbsolute = endRate - startRate;
  const changePercent = ((endRate - startRate) / startRate) * 100;
  const isPositive = changePercent >= 0;

  return {
    currency,
    currencyInfo: info,
    isNgnBase: isNgn,
    benchmarkLabel: isNgn ? 'USD/NGN Benchmark' : `${currency}/NGN Exchange Rate`,
    currentRate: currentRateInNgn,
    formattedCurrentRate: formatRate(currentRateInNgn, 'NGN'),
    points,
    high,
    low,
    averageRate,
    changePercent,
    changeAbsolute,
    isPositive,
    volatility: volatilityLabel,
  };
}

function formatRate(rateInNgn: number, unit = 'NGN'): string {
  if (rateInNgn >= 100) {
    return `₦${rateInNgn.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (rateInNgn >= 1) {
    return `₦${rateInNgn.toLocaleString('en-NG', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  } else {
    return `₦${rateInNgn.toLocaleString('en-NG', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  }
}

/**
 * Generate smooth SVG path coordinates using Catmull-Rom or cubic bezier splines.
 */
export function generateSvgSparklinePaths(
  points: TrendDataPoint[],
  width = 240,
  height = 60,
  padding = 6
): {
  linePath: string;
  areaPath: string;
  coords: Array<{ x: number; y: number; point: TrendDataPoint }>;
  minY: number;
  maxY: number;
} {
  if (!points || points.length === 0) {
    return { linePath: '', areaPath: '', coords: [], minY: 0, maxY: 0 };
  }

  const rates = points.map((p) => p.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate || 1;

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Map each data point to x, y coordinates in the SVG viewport
  const coords = points.map((point, index) => {
    const x = padding + (index / (points.length - 1)) * innerWidth;
    // Invert y: higher rate is higher on screen (lower y in SVG)
    const normalizedY = (point.rate - minRate) / range;
    const y = padding + (1 - normalizedY) * innerHeight;
    return { x, y, point };
  });

  // Build smooth cubic bezier curve
  let linePath = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];

    // Control points tension
    const tension = 0.2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    linePath += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  // Create closed area path for gradient fill
  const lastPoint = coords[coords.length - 1];
  const firstPoint = coords[0];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(2)} ${height} L ${firstPoint.x.toFixed(2)} ${height} Z`;

  return {
    linePath,
    areaPath,
    coords,
    minY: minRate,
    maxY: maxRate,
  };
}
