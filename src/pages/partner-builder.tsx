// Merged page: `partner-builder/`. Providers mirror the original partner-builder/src/main.tsx.
import App from '../apps/partner-builder/src/App';
import { AccessibilityProvider } from '../apps/partner-builder/src/context/AccessibilityContext';
import { LanguageProvider } from '../apps/partner-builder/src/context/LanguageContext';
import { CurrencyProvider } from '../apps/partner-builder/src/context/CurrencyContext';
import css from '../apps/partner-builder/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <AccessibilityProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </AccessibilityProvider>
));
