import App from './App.tsx';
import './index.css';
import { SipProvider } from './provider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const Providers = () => {
  console.log('window.location', window.location.pathname.replace('/', ''));
  const username = window.location.pathname.replace('/', '');
  return (
    <StrictMode>
      <SipProvider
        configs={{
          account: {
            domain: '192.168.82.31',
            username: username,
            password: username,
            wssServer: '192.168.82.31',
            webSocketPort: '8089',
            serverPath: '/ws',
          },
        }}
      >
        <App username={username} />
      </SipProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
