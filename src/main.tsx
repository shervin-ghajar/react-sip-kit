import JanusApp from './AppJanus.tsx';
import SipApp from './AppSip.tsx';
import { RtcManager } from './manager.tsx';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

/* -------------------------------------------------------------------------- */
export const RtcConnection = new RtcManager({ enableBroadcast: false });
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
export const sipAccountConfigs = {
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
  '4': {
    domain: 'teamserver.payamgostar.com',
    username: '4',
    password: '0c739d7d704a43bfad9a4671913256d0',
    wssServer: 'teamserver.payamgostar.com',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  '37': {
    domain: 'teamserver.payamgostar.com',
    username: '37',
    password: '0e2c26569ab64c01b6fe8e2386574652',
    wssServer: 'teamserver.payamgostar.com',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
} as const;

export const janusAccountConfigs = {
  '25': {
    janusServer: 'https://janus.1st.co.com/janus',
    username: '25',
  },
  '6': {
    janusServer: 'https://janus.1st.co.com/janus',
    username: '6',
  },
  '4': {
    janusServer: 'https://janus.1st.co.com/janus',
    username: '4',
  },
  '37': {
    janusServer: 'https://janus.1st.co.com/janus',
    username: '37',
  },
} as const;

const defaultSipFields = {
  engine: 'sip',
  domain: 'teamserver.payamgostar.com',
  username: '',
  password: '',
  wssServer: 'teamserver.payamgostar.com',
  webSocketPort: '8089',
  serverPath: '/ws',
  iceTransportPolicy: 'all',
  iceCandidatePoolSize: 10,
  iceGatheringTimeout: 5000,
};
const defaultJanusFields = {
  engine: 'janus',
  janusServer: 'https://janus.1st.co.com/janus',
  username: '',
};
export const ConfigForm = () => {
  const [fields, setFields] = useState<any>({
    engine: '',
  });

  const handleregister = () => {
    switch (fields.engine) {
      case 'sip':
        if (
          fields.domain &&
          fields.password &&
          fields.serverPath &&
          fields.username &&
          fields.webSocketPort &&
          fields.wssServer
        ) {
          const { iceCandidatePoolSize, iceGatheringTimeout, iceTransportPolicy, engine, ...rest } =
            fields;
          RtcConnection.add({
            engine,
            account: rest as any,
            media: {
              // videoInputDeviceId: null,
              // audioInputDeviceId: null
            },
            registration: {
              transportReconnectionAttempts: 100,
              peerConnectionConfiguration: {
                iceServers: [
                  {
                    urls: ['stun:stun.1st.co.com:3478'],
                  },
                  {
                    urls: ['turn:stun.1st.co.com:5349'],
                    username: 'alovoip',
                    credential: '123',
                  },
                ],
                iceTransportPolicy: iceTransportPolicy as any,
                iceCandidatePoolSize: iceCandidatePoolSize,
                rtcpMuxPolicy: 'require',
              },
              iceGatheringTimeout: iceGatheringTimeout,
            },
          });
        }
        break;

      case 'janus':
        if (fields.janusServer && fields.username) {
          const { iceTransportPolicy, engine, ...rest } = fields;
          RtcConnection.add({
            engine,
            account: rest as any,
            registration: {
              transportReconnectionAttempts: 5,
              peerConnectionConfiguration: {
                iceServers: [
                  {
                    urls: ['stun:stun.1st.co.com:3478'],
                  },
                  {
                    urls: ['turn:stun.1st.co.com:5349'],
                    username: 'alovoip',
                    credential: '123',
                  },
                ],
                iceTransportPolicy: iceTransportPolicy as any,
              },
            },
          });
        }
        break;
    }
  };

  const accountConfigs = fields.engine === 'sip' ? sipAccountConfigs : janusAccountConfigs;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <p>v0.0.2</p>
      {fields.engine && (
        <div style={{ display: 'flex', gap: 4 }}>
          Register:
          {Object.keys(accountConfigs).map((acc) => (
            <button
              key={acc}
              onClick={() => {
                const key = acc as keyof typeof accountConfigs;
                setFields((prev: any) => ({ ...prev, ...accountConfigs[key] }));
              }}
            >
              {acc}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.keys(fields).map((field) => {
          return (
            <div
              key={field}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
            >
              <label>{field}</label>
              {field === 'engine' ? (
                <select
                  name=""
                  id=""
                  value={fields[field]}
                  onChange={(e) =>
                    setFields(() => {
                      const engine = e.target.value;
                      if (engine === 'sip') return { ...defaultSipFields };
                      if (engine === 'janus') return { ...defaultJanusFields };
                      return { engine: '' };
                    })
                  }
                >
                  <option value="">none</option>
                  <option value="sip">sip</option>
                  <option value="janus">janus</option>
                </select>
              ) : (
                <input
                  value={(fields as any)[field]}
                  onChange={(e) => {
                    setFields((prev: any) => ({ ...prev, [field]: e.target.value }));
                  }}
                />
              )}
            </div>
          );
        })}
        <button onClick={handleregister}>Register</button>
      </div>
    </div>
  );
};
/* -------------------------------------------------------------------------- */

const Providers = () => {
  const configs = RtcConnection.useWatchConfigs();
  console.log({ configs });
  return (
    <StrictMode>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <ConfigForm />
        {configs.map((config) => {
          switch (config.engine) {
            case 'janus':
              return <JanusApp key={config.key} configKey={config.key} />;
            case 'sip':
              return <SipApp key={config.key} configKey={config.key} />;
          }
        })}
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
