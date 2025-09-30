import App from './App.tsx';
import { SipManager } from './manager.tsx';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager();
/* -------------------------------------------------------------------------- */
const Providers = () => {
  const username = window.location.pathname.replace('/', '');
  const configs = SipConnection.useWatchConfigs();

  useEffect(() => {
    SipConnection.add({
      account: {
        domain: '192.168.82.31',
        username: username,
        password: username,
        wssServer: '192.168.82.31',
        webSocketPort: '8089',
        serverPath: '/ws',
      },
    });
    // updating configs after 5 seconds
    setTimeout(() => {
      SipConnection.add({
        account: {
          domain: '192.168.82.31',
          username: '1012',
          password: '1012',
          wssServer: '192.168.82.31',
          webSocketPort: '8089',
          serverPath: '/ws',
        },
      });
    }, 5000);

    setTimeout(() => {
      SipConnection.add({
        key: 'test',
        account: {
          domain: '192.168.82.31',
          username: '1012',
          password: '1012',
          wssServer: '192.168.82.31',
          webSocketPort: '8089',
          serverPath: '/ws',
        },
      });
    }, 10000);
  }, []);

  return (
    <StrictMode>
      {configs.map((config) => {
        return <App key={config.key} username={config.account.username} />;
      })}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
