// Merged page: `careers/`. Providers mirror the original careers/src/main.tsx.
import App from '../apps/careers/src/App';
import { ThemeProvider } from '../apps/careers/src/context/ThemeContext';
import { AuthProvider } from '../apps/careers/src/context/AuthContext';
import { CurrencyProvider } from '../apps/careers/src/context/CurrencyContext';
import { LanguageProvider } from '../apps/careers/src/context/LanguageContext';
import css from '../apps/careers/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <ThemeProvider>
    <AuthProvider>
      <CurrencyProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </CurrencyProvider>
    </AuthProvider>
  </ThemeProvider>
));
