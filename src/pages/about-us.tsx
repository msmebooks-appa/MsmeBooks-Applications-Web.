// Merged page: `about-us/`. Providers mirror the original about-us/src/main.tsx.
import App from '../apps/about-us/src/App';
import { ThemeProvider } from '../apps/about-us/src/context/ThemeContext';
import { LanguageProvider } from '../apps/about-us/src/context/LanguageContext';
import { CurrencyProvider } from '../apps/about-us/src/context/CurrencyContext';
import { ConnectionProvider } from '../apps/about-us/src/context/ConnectionContext';
import css from '../apps/about-us/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <ThemeProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </ThemeProvider>
));
