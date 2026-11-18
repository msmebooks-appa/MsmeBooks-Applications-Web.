// Merged page: `ai-powwr/`. Providers mirror the original ai-powwr/src/main.tsx.
import App from '../apps/ai-powwr/src/App';
import { I18nProvider } from '../apps/ai-powwr/src/context/I18nContext';
import { CurrencyProvider } from '../apps/ai-powwr/src/context/CurrencyContext';
import { ConnectionProvider } from '../apps/ai-powwr/src/context/ConnectionContext';
import css from '../apps/ai-powwr/src/index.css?inline';
import { definePage } from '../shell/definePage';

export default definePage(css, () => (
  <I18nProvider>
    <CurrencyProvider>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </CurrencyProvider>
  </I18nProvider>
));
