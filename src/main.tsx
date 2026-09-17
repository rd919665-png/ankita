import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker safely for PWA offline capabilities
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  try {
    registerSW({ immediate: true });
  } catch (err) {
    console.warn('PWA service worker registration bypassed in dev:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
