import React from 'react';
import { SecurityDetailsPopover, SecurityTopic } from './SecurityDetailsPopover';

export interface SecurityTrustSectionProps {
  className?: string;
  variant?: 'sidebar' | 'badge' | 'notice' | 'card' | 'link';
  text?: string;
  showSubtitle?: boolean;
  defaultTopic?: SecurityTopic;
}

/**
 * Interactive Security Trust Section with Popover details covering
 * data encryption, GDPR compliance, and business data protection.
 */
export const SecurityTrustSection: React.FC<SecurityTrustSectionProps> = ({
  className = '',
  variant = 'sidebar',
  text,
  defaultTopic = 'encryption',
}) => {
  return (
    <div className={`security-trust-section ${className}`} id="security-trust-section">
      <SecurityDetailsPopover
        variant={variant}
        triggerText={text}
        defaultTopic={defaultTopic}
      />
    </div>
  );
};
