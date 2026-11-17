// Merged page: `partner-commission/`. Providers mirror the original partner-commission/src/main.tsx.
import App from '../../partner-commission/src/App';
import { LanguageProvider } from '../../partner-commission/src/context/LanguageContext';
import { CurrencyProvider } from '../../partner-commission/src/context/CurrencyContext';
import css from '../../partner-commission/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <LanguageProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </LanguageProvider>
));
