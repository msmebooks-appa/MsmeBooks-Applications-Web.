import type { ComponentType } from 'react';
import type { PageMeta, PageProps } from './shell/definePage';

export type PageGroup = 'Company' | 'Product' | 'Partners' | 'Resources' | 'Legal';

export interface RouteDef {
  id: string;
  /** Canonical URL path of the page. */
  path: string;
  /** Other paths that should redirect to `path`. */
  aliases?: string[];
  /** Extra path prefixes handled by the page's own internal routing. */
  ownedPrefixes?: string[];
  label: string;
  group: PageGroup;
  /** Original folder the page lives in. */
  folder: string;
  meta: PageMeta;
  load: () => Promise<{ default: ComponentType<PageProps> }>;
}

export const ROUTES: RouteDef[] = [
  // ---------------------------------------------------------------- Company
  {
    id: 'home',
    path: '/',
    aliases: ['/home', '/index.html'],
    label: 'Home',
    group: 'Company',
    folder: 'home',
    meta: {
      title: 'MsmeBooks - African Business & FinTech Platform',
      htmlClass: 'scroll-smooth',
      bodyClass: 'bg-[#F8FAFD] text-[#0F172A] font-sans antialiased selection:bg-[#B7F000] selection:text-[#0866FF]',
    },
    load: () => import('./pages/home'),
  },
  {
    id: 'about-us',
    path: '/about-us',
    aliases: ['/about'],
    label: 'About Us',
    group: 'Company',
    folder: 'about-us',
    meta: {
      title: 'About MsmeBooks | Empowering African Businesses with Smart Business Software',
      htmlClass: 'scroll-smooth',
      bodyClass:
        'bg-white dark:bg-black text-slate-800 dark:text-slate-100 antialiased font-sans selection:bg-lime-400 selection:text-slate-900 transition-colors duration-200',
    },
    load: () => import('./pages/about-us'),
  },
  {
    id: 'careers',
    path: '/careers',
    label: 'Careers',
    group: 'Company',
    folder: 'careers',
    meta: {
      title: 'MsmeBooks Careers & Recruitment Portal',
      bodyClass:
        "bg-[#F7F9FC] text-[#14243A] dark:bg-[#0B132B] dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased transition-colors duration-200",
    },
    load: () => import('./pages/careers'),
  },
  {
    id: 'contact',
    path: '/contact-us',
    aliases: ['/contact'],
    label: 'Contact',
    group: 'Company',
    folder: 'contact',
    meta: {
      title: 'Contact MsmeBooks | Sales, Support & Business Enquiries',
      htmlClass: 'scroll-smooth',
      bodyClass: 'bg-white text-slate-900 antialiased selection:bg-lime-200 selection:text-slate-900 font-sans',
    },
    load: () => import('./pages/contact'),
  },

  // ---------------------------------------------------------------- Product
  {
    id: 'pricing',
    path: '/pricing',
    label: 'Pricing',
    group: 'Product',
    folder: 'pricing',
    meta: {
      title: 'MsmeBooks Pricing - Simple, Transparent Plans for African Businesses',
      htmlClass: 'scroll-smooth',
      bodyClass: 'font-sans antialiased text-slate-800 bg-white selection:bg-[#84CC16]/30 selection:text-[#0A4FD5]',
    },
    load: () => import('./pages/pricing'),
  },
  {
    id: 'complete-saas',
    path: '/get-started',
    aliases: ['/complete-saas'],
    label: 'Get Started (Sign Up / Login)',
    group: 'Product',
    folder: 'complete saas',
    meta: {
      title: 'MsmeBooks - Complete SaaS Authentication Experience',
      bodyClass:
        "bg-[#F8FAFC] dark:bg-[#071727] text-[#0F172A] dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased min-h-screen transition-colors duration-200",
    },
    load: () => import('./pages/complete-saas'),
  },
  {
    id: 'use-cases',
    path: '/use-cases-success-stories',
    // The use-cases page has its own internal router for these paths.
    ownedPrefixes: ['/use-cases', '/customer-reviews', '/platform'],
    label: 'Use Cases & Success Stories',
    group: 'Product',
    folder: 'use-cases',
    meta: {
      title: 'MsmeBooks - Use Cases & Success Stories',
      bodyClass: 'bg-slate-50 text-slate-900 antialiased font-sans',
    },
    load: () => import('./pages/use-cases'),
  },
  {
    id: 'professional-services',
    path: '/professional-services',
    label: 'Professional Services',
    group: 'Product',
    folder: 'professional services',
    meta: {
      title: 'Professional Business Services | MsmeBooks',
      bodyClass:
        'bg-white dark:bg-[#07111E] text-slate-800 dark:text-slate-100 antialiased font-sans selection:bg-[#B7E532] selection:text-[#102B4E] transition-colors duration-200',
    },
    load: () => import('./pages/professional-services'),
  },
  {
    id: 'outsourcing',
    path: '/outsourcing',
    label: 'Outsourcing (Accounting, Payroll & HR)',
    group: 'Product',
    folder: 'outsourcing page',
    meta: {
      title: 'MsmeBooks Outsourcing - Accounting, Payroll & HR Platform',
      bodyClass:
        'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-lime-400 selection:text-slate-950',
    },
    load: () => import('./pages/outsourcing'),
  },

  // ---------------------------------------------------------------- Partners
  {
    id: 'partners',
    path: '/partners',
    aliases: ['/partner'],
    label: 'Partner Ecosystem',
    group: 'Partners',
    folder: 'partner-page',
    meta: {
      title: 'MsmeBooks - African Business Management & Partner Ecosystem',
      htmlClass: 'scroll-smooth',
      bodyClass: 'bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#84CC16]/25 selection:text-[#0F172A]',
    },
    load: () => import('./pages/partner-page'),
  },
  {
    id: 'partner-programme',
    path: '/partner-programme',
    aliases: ['/partner-builder'],
    label: 'Partner Programme',
    group: 'Partners',
    folder: 'partner-builder',
    meta: {
      title: 'MsmeBooks Partner Programme',
      htmlClass: 'scroll-smooth',
      bodyClass: 'bg-white text-slate-900 antialiased selection:bg-[#8CE600]/30 selection:text-[#0A3981]',
    },
    load: () => import('./pages/partner-builder'),
  },
  {
    id: 'partner-commission',
    path: '/partner-commission',
    label: 'Partner Commission',
    group: 'Partners',
    folder: 'partner-commission',
    meta: {
      title: 'MsmeBooks Partner Commission Program | Earn Recurring Revenue',
      htmlClass: 'scroll-smooth',
      bodyClass:
        "bg-[#F7FAFC] text-[#253247] font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#B9E51C]/40 selection:text-[#142D4E]",
    },
    load: () => import('./pages/partner-commission'),
  },
  {
    id: 'partner-reseller-portal',
    path: '/partner-reseller-portal',
    label: 'Partner & Reseller Portal',
    group: 'Partners',
    folder: 'partner-reseller-portal',
    meta: {
      title: 'MsmeBooks Partner Programme - Agreement & Portal',
      bodyClass: 'bg-white text-slate-900 font-sans antialiased selection:bg-lime-200 selection:text-slate-900',
    },
    load: () => import('./pages/partner-reseller-portal'),
  },
  {
    id: 'partner-registry',
    path: '/partner-registry',
    aliases: ['/global-partner-registry'],
    label: 'Global Partner Registry',
    group: 'Partners',
    folder: 'global-partner-registry',
    meta: {
      title: 'MsmeBooks Global Partner Registry & Directory | Find Verified Business Tech Partners',
      bodyClass: 'bg-slate-950 text-slate-100 antialiased selection:bg-lime-500 selection:text-slate-950',
    },
    load: () => import('./pages/global-partner-registry'),
  },

  // ---------------------------------------------------------------- Resources
  {
    id: 'faq',
    path: '/faq',
    aliases: ['/faqs', '/help', '/ai-power'],
    label: 'AI FAQ & Knowledge Centre',
    group: 'Resources',
    folder: 'ai-powwr',
    meta: {
      title: 'MsmeBooks - AI-Powered FAQ & Knowledge Centre',
      bodyClass: 'bg-[#F5F8FC] text-[#17233D] antialiased selection:bg-[#B7E522] selection:text-[#17233D]',
    },
    load: () => import('./pages/ai-power'),
  },
  {
    id: 'blog',
    path: '/blog',
    aliases: ['/saas-blog'],
    label: 'Blog',
    group: 'Resources',
    folder: 'saas-blog',
    meta: {
      title: 'MsmeBooks - SaaS Blog & Business Knowledge Center',
      bodyClass: 'bg-slate-50 text-slate-900 antialiased selection:bg-lime-300 selection:text-slate-900',
    },
    load: () => import('./pages/saas-blog'),
  },
  {
    id: 'training',
    path: '/training',
    aliases: ['/academy'],
    label: 'Training Academy',
    group: 'Resources',
    folder: 'training',
    meta: {
      title: 'MsmeBooks Academy - SaaS LMS & Training Ecosystem',
      bodyClass: 'bg-slate-50 text-slate-900 antialiased font-sans selection:bg-blue-600 selection:text-white',
    },
    load: () => import('./pages/training'),
  },

  // ---------------------------------------------------------------- Legal
  {
    id: 'privacy-policy',
    path: '/privacy-policy',
    aliases: ['/privacy'],
    label: 'Privacy Policy',
    group: 'Legal',
    folder: 'privacy-policy',
    meta: {
      title: 'MsmeBooks Privacy Policy | Data Protection & Privacy',
      htmlClass: 'scroll-smooth',
      bodyClass:
        'bg-[#F7FAFC] dark:bg-[#09111e] text-[#172B4D] dark:text-slate-100 antialiased selection:bg-[#B8E62E]/30 selection:text-[#1455C0] transition-colors duration-200',
    },
    load: () => import('./pages/privacy-policy'),
  },
  {
    id: 'terms',
    path: '/terms-and-conditions',
    aliases: ['/terms'],
    label: 'Terms & Conditions',
    group: 'Legal',
    folder: 'terms and condition',
    meta: {
      title: 'MsmeBooks Terms & Conditions | SaaS Terms of Service',
      htmlClass: 'scroll-smooth',
      bodyClass:
        'bg-white dark:bg-[#07131F] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#84CC16]/25 selection:text-[#0B3558] dark:selection:text-[#84CC16] transition-colors duration-200',
    },
    load: () => import('./pages/terms'),
  },
  {
    id: 'refund-policy',
    path: '/refund-policy',
    aliases: ['/refund'],
    label: 'Refund & Cancellation Policy',
    group: 'Legal',
    folder: 'refund policy',
    meta: {
      title: 'Refund & Cancellation Policy | MsmeBooks',
      htmlClass: 'scroll-smooth',
      bodyClass: 'bg-slate-50 text-slate-900 font-sans antialiased selection:bg-lime-200 selection:text-slate-900',
    },
    load: () => import('./pages/refund-policy'),
  },
];

export const GROUP_ORDER: PageGroup[] = ['Company', 'Product', 'Partners', 'Resources', 'Legal'];

function normalise(pathname: string): string {
  const p = pathname.replace(/\/+$/, '').toLowerCase();
  return p === '' ? '/' : p;
}

const startsWithSegment = (path: string, prefix: string) => path === prefix || path.startsWith(prefix + '/');

export interface RouteMatch {
  route: RouteDef;
  /** Set when the URL was an alias and should be replaced by the canonical path. */
  redirectTo?: string;
}

export function matchRoute(pathname: string): RouteMatch | null {
  const path = normalise(pathname);

  for (const route of ROUTES) {
    if (route.aliases?.some((a) => path === a)) return { route, redirectTo: route.path };
  }
  for (const route of ROUTES) {
    if (route.path === '/') {
      if (path === '/') return { route };
      continue;
    }
    if (startsWithSegment(path, route.path)) return { route };
    if (route.ownedPrefixes?.some((p) => startsWithSegment(path, p))) return { route };
  }
  return null;
}

/**
 * Links inside the pages point at https://www.msmebooks.org/<path>. When that path
 * is one of the merged pages, it is opened in-app instead of leaving the site.
 */
export function internalPathForUrl(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '');
  if (url.origin !== window.location.origin && host !== 'msmebooks.org') return null;

  const path = normalise(url.pathname);
  if (path === '/') {
    if (url.hash === '#pricing') return '/pricing';
    return url.origin === window.location.origin ? null : '/' + url.hash;
  }
  const match = matchRoute(path);
  if (!match) return null;
  return (match.redirectTo ?? path) + url.search + url.hash;
}
