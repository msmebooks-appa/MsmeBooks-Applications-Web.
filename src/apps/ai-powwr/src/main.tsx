import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { I18nProvider } from './context/I18nContext.tsx';
import { ConnectionProvider } from './context/ConnectionContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <CurrencyProvider>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </CurrencyProvider>
  </I18nProvider>
);
