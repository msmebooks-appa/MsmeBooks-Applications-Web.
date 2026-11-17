import { useInsertionEffect, type ComponentType, type ReactNode } from 'react';

/**
 * Per-page document settings. Every original page folder was a standalone app
 * with its own <html>/<body> classes, <title> and Tailwind stylesheet. When the
 * pages were merged into one site, these settings moved here so that each page
 * still looks exactly like it did on its own.
 */
export interface PageMeta {
  title: string;
  htmlClass?: string;
  bodyClass?: string;
}

export interface PageProps {
  meta: PageMeta;
}

const STYLE_ATTR = 'data-msme-page-style';

/** Reset <html>/<body> to the page's original attributes (clears leftovers like `dark` or `dir="rtl"`). */
export function applyDocumentMeta(meta: PageMeta) {
  const html = document.documentElement;
  html.className = meta.htmlClass ?? '';
  html.lang = 'en';
  html.removeAttribute('dir');
  html.removeAttribute('style');
  document.body.className = meta.bodyClass ?? '';
  document.body.removeAttribute('style');
  document.title = meta.title;
}

/**
 * Wraps one original page (its providers + <App/>) so that its stylesheet is only
 * active while the page is on screen. Pages use different brand tokens with the
 * same names, so loading all stylesheets at once would make pages override each other.
 */
export function definePage(css: string, render: () => ReactNode): ComponentType<PageProps> {
  function MergedPage({ meta }: PageProps) {
    // Insertion effects run before layout/passive effects, so the page's own
    // effects (e.g. adding the `dark` class) run after the reset below.
    useInsertionEffect(() => {
      applyDocumentMeta(meta);
      const style = document.createElement('style');
      style.setAttribute(STYLE_ATTR, meta.title);
      style.textContent = css;
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }, [meta]);

    return <>{render()}</>;
  }
  return MergedPage;
}
