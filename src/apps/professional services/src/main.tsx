import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { initBookingReminderService } from './utils/reminderService.ts';
import './index.css';

// Register Service Worker for PWA offline support & 1-hour booking reminders
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        initBookingReminderService();
      })
      .catch((error) => {
        console.warn('Service worker registration error:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </ThemeProvider>
);

