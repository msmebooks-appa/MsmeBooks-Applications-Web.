// Merged page: `partner-commission/`. Providers mirror the original partner-commission/src/main.tsx.
import App from '../apps/partner-commission/src/App';
import { LanguageProvider } from '../apps/partner-commission/src/context/LanguageContext';
import { CurrencyProvider } from '../apps/partner-commission/src/context/CurrencyContext';
import css from '../apps/partner-commission/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <LanguageProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </LanguageProvider>
));
