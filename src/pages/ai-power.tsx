// Merged page: `ai-powwr/`. Providers mirror the original ai-powwr/src/main.tsx.
import App from '../../ai-powwr/src/App';
import { I18nProvider } from '../../ai-powwr/src/context/I18nContext';
import { CurrencyProvider } from '../../ai-powwr/src/context/CurrencyContext';
import { ConnectionProvider } from '../../ai-powwr/src/context/ConnectionContext';
import css from '../../ai-powwr/src/index.css?inline';
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
