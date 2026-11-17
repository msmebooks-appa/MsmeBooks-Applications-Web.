// Merged page: `professional services/`. Providers mirror the original professional services/src/main.tsx.
import App from '../../professional services/src/App';
import { ThemeProvider } from '../../professional services/src/context/ThemeContext';
import { LanguageProvider } from '../../professional services/src/context/LanguageContext';
import { CurrencyProvider } from '../../professional services/src/context/CurrencyContext';
import css from '../../professional services/src/index.css?inline';
import { definePage } from '../shell/definePage';

// Service worker + booking reminders from the standalone app are disabled in the merged site
// (several pages registered different /sw.js files on the same scope):
// import { initBookingReminderService } from '../../professional services/src/utils/reminderService';
// navigator.serviceWorker.register('/sw.js').then(() => initBookingReminderService());

export default definePage(css, () => (
  <ThemeProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </ThemeProvider>
));
