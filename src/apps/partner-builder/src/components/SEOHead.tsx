import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  currentSection?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'MsmeBooks Partner Programme – Earn 15%–40% Recurring Commission',
  description = 'Join the official MsmeBooks SaaS Partner Programme. Earn up to 40% recurring commissions, access accredited technical certification, receive metallic partner badges, and get listed in the verified Pan-African directory.',
  currentSection
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = currentSection 
      ? `${currentSection} | MsmeBooks Partner Programme` 
      : title;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'MsmeBooks Partner Programme');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'keywords', 'MsmeBooks, SaaS Partner Programme, accounting software partner, POS distributor Africa, ICAN, KRA eTIMS, Caseware integration, recurring commission software');

    // 3. Inject Structured Data (JSON-LD)
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://www.msmebooks.org/#organization',
          'name': 'MsmeBooks',
          'url': 'https://www.msmebooks.org',
          'logo': 'https://www.msmebooks.org/assets/logo.png',
          'description': 'Pan-African cloud accounting, multi-branch POS, and inventory ERP ecosystem.',
          'sameAs': [
            'https://www.linkedin.com/company/msmebooks',
            'https://twitter.com/msmebooks'
          ]
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://www.msmebooks.org/#software',
          'name': 'MsmeBooks Cloud Accounting & POS Platform',
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web, Android, iOS, Windows, macOS',
          'description': 'Enterprise-grade accounting, invoicing, barcode POS, and statutory tax compliance software with 25+ audit system integrations.',
          'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'USD',
            'lowPrice': '15',
            'highPrice': '150',
            'offerCount': '4'
          }
        },
        {
          '@type': 'EducationalOccupationalProgram',
          '@id': 'https://www.msmebooks.org/#academy',
          'name': 'MsmeBooks Partner Technical & Implementation Certification Academy',
          'description': 'Accredited training tracks for accountants and IT consultants covering ERP migration, statutory tax automation, multi-branch POS, and audit software ledger sync.',
          'educationalCredentialAwarded': 'Certified Implementation Specialist (CIS)',
          'timeToComplete': 'P4W',
          'programPrerequisites': 'Professional accounting, audit, or business technology experience'
        },
        {
          '@type': 'OfferCatalog',
          '@id': 'https://www.msmebooks.org/#partner-tiers',
          'name': 'MsmeBooks Partner Programme Commission Structure',
          'itemListElement': [
            {
              '@type': 'Offer',
              'name': 'Bronze Partner Tier',
              'description': '15% lifetime recurring commission on all subscribed client accounts',
              'price': '0',
              'priceCurrency': 'USD'
            },
            {
              '@type': 'Offer',
              'name': 'Silver Partner Tier',
              'description': '20% lifetime recurring commission on all subscribed client accounts with co-marketing perks',
              'price': '0',
              'priceCurrency': 'USD'
            },
            {
              '@type': 'Offer',
              'name': 'Gold Partner Tier',
              'description': '30% lifetime recurring commission + priority regional directory listing and lead distribution',
              'price': '0',
              'priceCurrency': 'USD'
            },
            {
              '@type': 'Offer',
              'name': 'Platinum Partner Tier',
              'description': '40% lifetime recurring commission + dedicated Technical Account Manager and quarterly co-marketing fund',
              'price': '0',
              'priceCurrency': 'USD'
            }
          ]
        }
      ]
    };

    const scriptId = 'msmebooks-jsonld-schema';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(jsonLdData, null, 2);

    return () => {
      // Keep script or clean up if needed
    };
  }, [title, description, currentSection]);

  return null;
};
