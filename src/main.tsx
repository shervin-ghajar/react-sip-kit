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
      media: {
        audioInputDeviceId: '68433516f49e3de0ace8ffb524eaab36ac15e937c471fb59f14654350c8e9b02',
      },
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

    setTimeout(() => {
      SipConnection.add({
        account: {
          domain: '192.168.82.31',
          username: username,
          password: username,
          wssServer: '192.168.82.31',
          webSocketPort: '8089',
          serverPath: '/ws',
        },
        media: {
          audioInputDeviceId: undefined,
        },
        registration: {
          transportReconnectionAttempts: 3,
        },
      });
    }, 5000);
    setTimeout(() => {
      SipConnection.add({
        account: {
          domain: '192.168.82.31',
          username: username,
          password: username,
          wssServer: '192.168.82.31',
          webSocketPort: '8089',
          serverPath: '/ws',
        },
        media: {
          audioInputDeviceId: undefined,
          audioOutputDeviceId: undefined,
          videoInputDeviceId: undefined,
        },
        registration: {
          transportReconnectionAttempts: 3,
        },
      });
    }, 10000);
  }, []);

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
