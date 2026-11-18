// Merged page: `complete saas/`. Providers mirror the original complete saas/src/main.tsx.
import { StrictMode } from 'react';
import App from '../apps/complete saas/src/App';
import { ThemeProvider } from '../apps/complete saas/src/context/ThemeContext';
import { LanguageProvider } from '../apps/complete saas/src/context/LanguageContext';
import { ToastProvider } from '../apps/complete saas/src/context/ToastContext';
import css from '../apps/complete saas/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
));
