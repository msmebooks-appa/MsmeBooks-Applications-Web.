// Merged page: `pricing/`. Providers mirror the original pricing/src/main.tsx.
import { StrictMode } from 'react';
import App from '../../pricing/src/App';
import css from '../../pricing/src/index.css?inline';
import { definePage } from '../shell/definePage';

// Service worker registration from the standalone app is disabled in the merged site
// (several pages registered different /sw.js files on the same scope):
// import { registerServiceWorker } from '../../pricing/src/services/serviceWorkerRegistration';
// registerServiceWorker();

export default definePage(css, () => (
  <StrictMode>
    <App />
  </StrictMode>
));
