import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { errorMonitoringService } from './services/errorMonitoringService';

// Initialize production error monitoring & unhandled rejection handlers
errorMonitoringService.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
