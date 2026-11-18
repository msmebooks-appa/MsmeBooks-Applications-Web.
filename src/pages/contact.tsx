// Merged page: `contact/`. Providers mirror the original contact/src/main.tsx.
import App from '../apps/contact/src/App';
import css from '../apps/contact/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <App />
));
