import App from './App.tsx';
import './index.css';
import { SipProvider } from './provider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const Providers = () => {
  const username = window.location.pathname.replace('/', '');
  const configs = [
    {
      account: {
        domain: '192.168.82.31',
        username: username,
        password: username,
        wssServer: '192.168.82.31',
        webSocketPort: '8089',
        serverPath: '/ws',
      },
    },
    {
      account: {
        domain: 'mttest-0.wscall.dev.abr-plus.com',
        username: '3226',
        password: '3226',
        wssServer: 'mttest-0.wscall.dev.abr-plus.com',
        webSocketPort: '8089',
        serverPath: '/ws',
      },
    },
    {
      account: {
        domain: '192.168.82.31',
        username: '1012',
        password: '1012',
        wssServer: '192.168.82.31',
        webSocketPort: '8089',
        serverPath: '/ws',
      },
    },
  ];
  return (
    <StrictMode>
      <SipProvider configs={configs}>
        {configs.map((config) => {
          return <App key={config.account.username} username={config.account.username} />;
        })}
      </SipProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
