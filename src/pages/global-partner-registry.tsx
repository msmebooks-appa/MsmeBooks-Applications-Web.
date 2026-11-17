// Merged page: `global-partner-registry/`. Providers mirror the original global-partner-registry/src/main.tsx.
import { StrictMode } from 'react';
import App from '../../global-partner-registry/src/App';
import css from '../../global-partner-registry/src/index.css?inline';
import { definePage } from '../shell/definePage';

// Service worker (vite-plugin-pwa) registration from the standalone app is disabled in the merged site:
// import { registerSW } from 'virtual:pwa-register';
// if (import.meta.env.PROD) registerSW({ immediate: true });

export default definePage(css, () => (
  <StrictMode>
    <App />
  </StrictMode>
));
