// Merged page: `careers/`. Providers mirror the original careers/src/main.tsx.
import App from '../../careers/src/App';
import { ThemeProvider } from '../../careers/src/context/ThemeContext';
import { AuthProvider } from '../../careers/src/context/AuthContext';
import { CurrencyProvider } from '../../careers/src/context/CurrencyContext';
import { LanguageProvider } from '../../careers/src/context/LanguageContext';
import css from '../../careers/src/index.css?inline';
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
