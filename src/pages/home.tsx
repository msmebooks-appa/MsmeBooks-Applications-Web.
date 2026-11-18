// Merged page: `home/`. Providers mirror the original home/src/main.tsx.
import { StrictMode } from 'react';
import App from '../apps/home/src/App';
import css from '../apps/home/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <StrictMode>
    <App />
  </StrictMode>
));
