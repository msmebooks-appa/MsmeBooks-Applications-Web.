// Merged page: `training/`. Providers mirror the original training/src/main.tsx.
import App from '../apps/training/src/App';
import css from '../apps/training/src/index.css?inline';
import { definePage } from '../shell/definePage';

// Service worker registration from the standalone app is disabled in the merged site
// (several pages registered different /sw.js files on the same scope):
// import { registerServiceWorker } from '../apps/training/src/utils/offlineCourseStorage';
// registerServiceWorker();

export default definePage(css, () => (
  <App />
));
