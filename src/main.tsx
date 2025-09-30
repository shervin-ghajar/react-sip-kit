import App from './App.tsx';
import { SipManager } from './manager.tsx';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager();
/* -------------------------------------------------------------------------- */
const Providers = () => {
  const username = window.location.pathname.replace('/', '');
  const [configs, setConfigs] = useState([
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
  ]);

  useEffect(() => {
    // updating configs after 10 seconds
    // setTimeout(() => {
    //   setConfigs((prev) => [
    //     ...prev,
    //     {
    //       account: {
    //         domain: '192.168.82.31',
    //         username: '1012',
    //         password: '1012',
    //         wssServer: '192.168.82.31',
    //         webSocketPort: '8089',
    //         serverPath: '/ws',
    //       },
    //     },
    //   ]);
    // }, 10000);
  }, []);

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
