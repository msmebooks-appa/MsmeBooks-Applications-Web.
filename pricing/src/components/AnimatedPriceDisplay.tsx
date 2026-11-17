import React, { useEffect, useState, useRef } from 'react';
import { Currency } from '../types';
import { CurrencyTrendTooltip } from './CurrencyTrendTooltip';

interface AnimatedPriceDisplayProps {
  value: string; // Formatted string, e.g. "₦45,000" or "$32.50" or "Custom"
  className?: string;
  currency?: Currency;
  showTrendTooltip?: boolean;
  showInlineBadge?: boolean;
  tooltipAlign?: 'left' | 'center' | 'right';
}

export const AnimatedPriceDisplay: React.FC<AnimatedPriceDisplayProps> = ({
  value,
  className = '',
  currency,
  showTrendTooltip = false,
  showInlineBadge = false,
  tooltipAlign = 'center',
}) => {
  // Check if string is non-numeric, like "Custom" or "Free"
  const isText = value.toLowerCase().includes('custom') || value.toLowerCase().includes('free');

  // Extract symbol/prefix and pure numeric value
  const numMatch = value.match(/([\d,]+(?:\.\d+)?)/);
  const prefix = numMatch && numMatch.index !== undefined ? value.substring(0, numMatch.index) : '';
  const suffix = numMatch && numMatch.index !== undefined ? value.substring(numMatch.index + numMatch[0].length) : '';

  const targetNumber = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0;
  const hasDecimals = numMatch ? numMatch[0].includes('.') : false;

  const [currentNumber, setCurrentNumber] = useState<number>(targetNumber);
  const prevTargetRef = useRef<number>(targetNumber);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isText || isNaN(targetNumber)) {
      return;
    }

    const startVal = prevTargetRef.current;
    const endVal = targetNumber;
    prevTargetRef.current = targetNumber;

    if (startVal === endVal) {
      setCurrentNumber(endVal);
      return;
    }

    setIsAnimating(true);
    const duration = 450; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic formula for natural count-up deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const interpolated = startVal + (endVal - startVal) * easeOut;

      setCurrentNumber(interpolated);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentNumber(endVal);
        setIsAnimating(false);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetNumber, isText]);

  if (isText || !numMatch) {
    return <span className={className}>{value}</span>;
  }

  // Format current numeric value with commas
  const formattedNumber = hasDecimals
    ? currentNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(currentNumber).toLocaleString('en-US');

  const content = (
    <span
      className={`inline-block transition-transform duration-200 ${
        isAnimating ? 'scale-102 text-[#0A4FD5] dark:text-blue-400' : ''
      } ${className}`}
    >
      <span>{prefix}</span>
      <span>{formattedNumber}</span>
      <span>{suffix}</span>
    </span>
  );

  if (currency && showTrendTooltip) {
    return (
      <CurrencyTrendTooltip
        currency={currency}
        showInlineBadge={showInlineBadge}
        align={tooltipAlign}
      >
        {content}
      </CurrencyTrendTooltip>
    );
  }

  return content;
};
