import Lines from './lines.tsx';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SipManager } from 'react-sip-kit';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager();
/* -------------------------------------------------------------------------- */
const Providers = () => {
  const username = window.location.pathname.replace('/', '');
  const configs = SipConnection.useWatchConfigs(); // recommended for rendering lines and accessing to the initialized configs with key(custom key when adding config / default: config.account.username)
  const apiConfigs = [
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
    apiConfigs.map((config) => {
      SipConnection.add(config);
    });
  }, [apiConfigs]);

  return (
    <StrictMode>
      {configs.map((config) => {
        return <Lines key={config.key} configKey={config.key} />;
      })}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
