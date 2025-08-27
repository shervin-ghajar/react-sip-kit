import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SipProvider } from 'react-sip-kit';

const Providers = () => {
  return (
    <StrictMode>
      <SipProvider
        configs={{
          account: {
            domain: '192.168.82.31',
            username: 'username',
            password: 'password',
            wssServer: '192.168.82.31',
            webSocketPort: '8089',
            serverPath: '/ws',
          },
        }}
      >
        <App username={'username'} />
      </SipProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
