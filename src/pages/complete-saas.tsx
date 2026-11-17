// Merged page: `complete saas/`. Providers mirror the original complete saas/src/main.tsx.
import { StrictMode } from 'react';
import App from '../../complete saas/src/App';
import { ThemeProvider } from '../../complete saas/src/context/ThemeContext';
import { LanguageProvider } from '../../complete saas/src/context/LanguageContext';
import { ToastProvider } from '../../complete saas/src/context/ToastContext';
import css from '../../complete saas/src/index.css?inline';
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
