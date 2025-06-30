import App from './App.tsx';
import { SipProvider } from './core/services/sip/provider.tsx';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const Providers = () => {
  console.log('window.location', window.location.pathname.replace('/', ''));
  const username = window.location.pathname.replace('/', '');
  return (
    <StrictMode>
      <SipProvider
        config={{
          domain: '192.168.82.31',
          username: username,
          password: username,
          wssServer: '192.168.82.31',
          webSocketPort: '8089',
          serverPath: '/ws',
        }}
      >
        <App username={username} />
      </SipProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
