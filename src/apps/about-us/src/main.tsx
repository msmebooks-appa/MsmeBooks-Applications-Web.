import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ConnectionProvider } from './context/ConnectionContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </ThemeProvider>
);


