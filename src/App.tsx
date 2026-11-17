import { Component, Suspense, lazy, startTransition, useCallback, useEffect, useMemo, useState, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { GROUP_ORDER, ROUTES, internalPathForUrl, matchRoute, type RouteDef } from './routes';
import type { PageProps } from './shell/definePage';
import { applyDocumentMeta } from './shell/definePage';
import './shell/shell.css';

const PAGES: Record<string, ComponentType<PageProps>> = Object.fromEntries(
  ROUTES.map((route) => [route.id, lazy(route.load)]),
);

function currentPath() {
  return window.location.pathname || '/';
}

/* -------------------------------------------------------------------------- */
/* Error boundary - one broken page must not take the whole site down          */
/* -------------------------------------------------------------------------- */
class PageErrorBoundary extends Component<{ label: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[MsmeBooks] The "${this.props.label}" page crashed:`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div id="msme-shell-message">
          <h1>Something went wrong on “{this.props.label}”.</h1>
          <p>Please refresh the page or pick another page from the menu.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div id="msme-shell-loader" role="status" aria-live="polite">
      <span className="msme-shell-spinner" aria-hidden="true" />
      <span>Loading MsmeBooks…</span>
    </div>
  );
}

function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) {
  useEffect(() => {
    applyDocumentMeta({ title: 'Page not found | MsmeBooks' });
  }, []);
  return (
    <div id="msme-shell-message">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist. Try one of these instead:</p>
      <ul>
        {ROUTES.map((r) => (
          <li key={r.id}>
            <a
              href={r.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(r.path);
              }}
            >
              {r.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Floating page switcher (the only shell UI - every page keeps its own nav)   */
/* -------------------------------------------------------------------------- */
function PageSwitcher({ active, onNavigate }: { active: RouteDef | null; onNavigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const groups = useMemo(
    () => GROUP_ORDER.map((group) => ({ group, routes: ROUTES.filter((r) => r.group === group) })),
    [],
  );

  return (
    <div id="msme-shell">
      {open && <div className="msme-shell-backdrop" onClick={() => setOpen(false)} />}
      {open && (
        <nav className="msme-shell-panel" aria-label="All MsmeBooks pages">
          <div className="msme-shell-panel-head">
            <strong>All MsmeBooks pages</strong>
            <button type="button" className="msme-shell-close" aria-label="Close menu" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="msme-shell-groups">
            {groups.map(({ group, routes }) => (
              <section key={group}>
                <h2>{group}</h2>
                <ul>
                  {routes.map((r) => (
                    <li key={r.id}>
                      <a
                        href={r.path}
                        aria-current={active?.id === r.id ? 'page' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          onNavigate(r.path);
                        }}
                      >
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      )}
      <button
        type="button"
        className="msme-shell-toggle"
        aria-expanded={open}
        aria-label="Open the list of all pages"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="msme-shell-toggle-icon" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>Pages</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* App shell                                                                   */
/* -------------------------------------------------------------------------- */
export default function App() {
  const [path, setPath] = useState(currentPath);
  const match = matchRoute(path);
  const route = match?.route ?? null;

  // Alias URLs (e.g. /about -> /about-us) are rewritten to the canonical path.
  useEffect(() => {
    if (match?.redirectTo) {
      window.history.replaceState(window.history.state, '', match.redirectTo + window.location.search + window.location.hash);
      setPath(match.redirectTo);
    }
  }, [match?.redirectTo]);

  const navigate = useCallback((to: string) => {
    const target = new URL(to, window.location.origin);
    if (target.pathname + target.search + target.hash === window.location.pathname + window.location.search + window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', target.pathname + target.search + target.hash);
    startTransition(() => setPath(target.pathname));
  }, []);

  // Browser back / forward.
  useEffect(() => {
    const onPop = () => startTransition(() => setPath(currentPath()));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Open links to other merged pages in-app instead of reloading / leaving the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute('download')) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // Pure in-page anchors (#section) are left to the page itself.
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) return;
      const internal = internalPathForUrl(url);
      if (!internal) return;
      e.preventDefault();
      navigate(internal);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  // Start every newly opened page at the top (unless the URL targets a section).
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [route?.id]);

  const Page = route ? PAGES[route.id] : null;

  return (
    <>
      {route && Page ? (
        // Suspense sits outside the keyed boundary so that, during a navigation
        // (a transition), the current page stays visible until the next one is loaded.
        <Suspense fallback={<PageLoader />}>
          <PageErrorBoundary key={route.id} label={route.label}>
            <Page meta={route.meta} />
          </PageErrorBoundary>
        </Suspense>
      ) : (
        <NotFound onNavigate={navigate} />
      )}
      <PageSwitcher active={route} onNavigate={navigate} />
    </>
  );
}
