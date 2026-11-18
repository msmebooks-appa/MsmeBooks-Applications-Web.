// Merged page: `saas-blog/`. Providers mirror the original saas-blog/src/main.tsx.
import { StrictMode } from 'react';
import App from '../apps/saas-blog/src/App';
import { ThemeProvider } from '../apps/saas-blog/src/context/ThemeContext';
import { ConnectionProvider } from '../apps/saas-blog/src/context/ConnectionContext';
import { LanguageProvider } from '../apps/saas-blog/src/context/LanguageContext';
import { CurrencyProvider } from '../apps/saas-blog/src/context/CurrencyContext';
import css from '../apps/saas-blog/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <StrictMode>
    <ThemeProvider>
      <ConnectionProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </LanguageProvider>
      </ConnectionProvider>
    </ThemeProvider>
  </StrictMode>
));
