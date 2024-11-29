import App from './App.tsx';
import { SipProvider } from './core/services/sip/provider.tsx';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SipProvider
      config={{
        domain: '178.252.176.54',
        username: '1004',
        password: '170acf60c079777853d3b5f2e7d4564b',
        wssServer: '178.252.176.54',
        webSocketPort: '8089',
        serverPath: '/ws',
      }}
    >
      <App />
    </SipProvider>
  </StrictMode>,
);
