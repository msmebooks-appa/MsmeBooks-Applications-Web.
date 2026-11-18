import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

createRoot(document.getElementById('root')!).render(
  <AccessibilityProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </LanguageProvider>
  </AccessibilityProvider>
);

