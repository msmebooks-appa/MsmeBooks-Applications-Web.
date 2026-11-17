// Merged page: `partner-builder/`. Providers mirror the original partner-builder/src/main.tsx.
import App from '../../partner-builder/src/App';
import { AccessibilityProvider } from '../../partner-builder/src/context/AccessibilityContext';
import { LanguageProvider } from '../../partner-builder/src/context/LanguageContext';
import { CurrencyProvider } from '../../partner-builder/src/context/CurrencyContext';
import css from '../../partner-builder/src/index.css?inline';
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
