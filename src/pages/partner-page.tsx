// Merged page: `partner-page/`. Providers mirror the original partner-page/src/main.tsx.
import { StrictMode } from 'react';
import App from '../apps/partner-page/src/App';
import css from '../apps/partner-page/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <StrictMode>
    <App />
  </StrictMode>
));
