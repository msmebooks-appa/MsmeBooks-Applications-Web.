// Merged page: `home/`. Providers mirror the original home/src/main.tsx.
import { StrictMode } from 'react';
import App from '../../home/src/App';
import css from '../../home/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <StrictMode>
    <App />
  </StrictMode>
));
