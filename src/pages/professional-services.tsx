// Merged page: `professional services/`. Providers mirror the original professional services/src/main.tsx.
import App from '../apps/professional services/src/App';
import { ThemeProvider } from '../apps/professional services/src/context/ThemeContext';
import { LanguageProvider } from '../apps/professional services/src/context/LanguageContext';
import { CurrencyProvider } from '../apps/professional services/src/context/CurrencyContext';
import css from '../apps/professional services/src/index.css?inline';
import { definePage } from '../shell/definePage';

// Service worker + booking reminders from the standalone app are disabled in the merged site
// (several pages registered different /sw.js files on the same scope):
// import { initBookingReminderService } from '../apps/professional services/src/utils/reminderService';
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
