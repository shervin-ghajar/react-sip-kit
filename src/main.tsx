import App from './App.tsx';
import { SipManager } from './manager.tsx';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager();
/* -------------------------------------------------------------------------- */
const accountConfigs = {
  '3212': {
    domain: '192.168.2.27',
    username: '3212',
    password: '5dfa5e840d42f5b96bf8dc1f20f004bb',
    wssServer: '192.168.2.27',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  '3213': {
    domain: '192.168.2.27',
    username: '3213',
    password: '9fd0b0e5e5ace98c8c0fd5ead6708eb2',
    wssServer: '192.168.2.27',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  '25': {
    domain: 'teamserver.payamgostar.com',
    username: '25',
    password: 'a3ed7e436b884c20a80d478950b770a2',
    wssServer: 'teamserver.payamgostar.com',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  '6': {
    domain: 'teamserver.payamgostar.com',
    username: '6',
    password: '49c39db893b9475a8eb6fb1d70ff48ed',
    wssServer: 'teamserver.payamgostar.com',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
} as const;
const Providers = () => {
  const username = window.location.pathname.replace('/', '');
  const configs = SipConnection.useWatchConfigs();

  useEffect(() => {
    SipConnection.add({
      account: accountConfigs[username as keyof typeof accountConfigs],
      registration: {
        transportReconnectionAttempts: 3,
      },
    });
    // // updating configs after 5 seconds
    // setTimeout(() => {
    //   SipConnection.add({
    //     account: {
    //       domain: '192.168.82.31',
    //       username: '1012',
    //       password: '1012',
    //       wssServer: '192.168.82.31',
    //       webSocketPort: '8089',
    //       serverPath: '/ws',
    //     },
    //   });
    // }, 5000);

    // setTimeout(() => {
    //   SipConnection.add({
    //     account: {
    //       domain: '192.168.2.27',
    //       username: '3212',
    //       password: '5dfa5e840d42f5b96bf8dc1f20f004bb',
    //       wssServer: '192.168.2.27',
    //       webSocketPort: '8089',
    //       serverPath: '/ws',
    //     },
    //     media: {
    //       audioInputDeviceId: undefined,
    //     },
    //     registration: {
    //       transportReconnectionAttempts: 3,
    //     },
    //   });
    // }, 1000);
  }, [username]);

  console.log({ configs });
  return (
    <StrictMode>
      {configs.map((config) => {
        return <App key={config.key} configKey={config.key} />;
      })}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
