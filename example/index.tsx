import App from './App.tsx';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SipManager } from 'react-sip-kit';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager();
/* -------------------------------------------------------------------------- */
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
  ];

  useEffect(() => {
    // adding each config to SipConnection to get initialized
    configs.map((config) => {
      SipConnection.add(config);
    });
  }, [configs]);

  return (
    <StrictMode>
      {configs.map((config) => {
        return <App key={config.account.username} username={config.account.username} />;
      })}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
