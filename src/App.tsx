import { AudioStream, VideoStream } from '.';
import './App.css';
import { SipConnection } from './main';
import { LineType } from './store/types';
import { memo, useEffect, useState } from 'react';

/* -------------------------------------------------------------------------- */
export const accountConfigs = {
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
/* -------------------------------------------------------------------------- */
function App({ configKey }: { configKey: string }) {
  const { dialByNumber } = SipConnection.getSessionMethodsBy({ configKey }); // all session methods like dial, answer, toggle video, toggle share-screen and so on
  const { lines, status } = SipConnection.getAccountBy({ configKey }).watch(); // watches lines and status if they change
  const [number, setNumber] = useState<string>();
  const renderLines = () => {
    return lines.map((line) => <SipLine key={line.lineKey} lineKey={line.lineKey} />);
  };
  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <h2>
        Web Phone {configKey} {status} {`(${SipConnection.isMaster ? 'Master' : 'Follower'})`}
      </h2>
      <div
        style={{
          backgroundColor: 'lightgray',
          border: '1px solid black',
          minHeight: 300,
          width: '80%',
        }}
      >
        <h4>Call/Chat Section</h4>
        {renderLines()}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          border: '1px solid lightGray',
          padding: 24,
        }}
      >
        <h4>Call Action Buttons</h4>

        <div style={{ display: 'flex', gap: 4 }}>
          <input type="number" value={number} onChange={(e) => setNumber(String(e.target.value))} />
          <button onClick={() => number && dialByNumber('audio', number)}>{`Call`}</button>
          <button onClick={() => number && dialByNumber('video', number)}>{`Video Call`}</button>
        </div>
        <button onClick={() => SipConnection.reconnectTransport(configKey)}>{`Reconnect`}</button>
        <button onClick={() => SipConnection.refreshRegistration(configKey)}>{`ReRegister`}</button>
      </div>
    </div>
  );
}

export const ConfigForm = () => {
  const [fields, setFields] = useState({
    domain: 'teamserver.payamgostar.com',
    username: '',
    password: '',
    wssServer: 'teamserver.payamgostar.com',
    webSocketPort: '8089',
    serverPath: '/ws',
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,
    iceGatheringTimeout: 5000,
  });

  const handleregister = () => {
    if (
      fields.domain &&
      fields.password &&
      fields.serverPath &&
      fields.username &&
      fields.webSocketPort &&
      fields.wssServer
    ) {
      const { iceCandidatePoolSize, iceGatheringTimeout, iceTransportPolicy, ...rest } = fields;
      SipConnection.add({
        account: rest,
        media: {},
        registration: {
          transportReconnectionAttempts: 5,
          peerConnectionConfiguration: {
            iceServers: [
              {
                urls: ['stun:stun.1st.co.com:3478'],
              },
              {
                urls: [
                  'turn:stun.1st.co.com:3478?transport=udp',
                  'turn:stun.1st.co.com:3478?transport=tcp',
                  'turns:stun.1st.co.com:5349',
                ],
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
  };
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
      <div style={{ display: 'flex', gap: 4 }}>
        Register:
        {Object.keys(accountConfigs).map((acc) => (
          <button
            key={acc}
            onClick={() => {
              const key = acc as keyof typeof accountConfigs;
              setFields((prev) => ({ ...prev, ...accountConfigs[key] }));
            }}
          >
            {acc}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.keys(fields).map((field) => {
          return (
            <div
              key={field}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
            >
              <label>{field}</label>
              <input
                value={(fields as any)[field]}
                onChange={(e) => {
                  setFields((prev) => ({ ...prev, [field]: e.target.value }));
                }}
              />
            </div>
          );
        })}
        <button onClick={handleregister}>Register</button>
      </div>
    </div>
  );
};
/* -------------------------------------------------------------------------- */
export default App;

const SipLine = memo(({ lineKey }: { lineKey: LineType['lineKey'] }) => {
  const {
    answerAudioSession,
    answerVideoSession,
    endSession,
    toggleLocalVideoTrack,
    toggleMuteSession,
    toggleHoldSession,
    cancelTransferSession,
    makeTransferSession,
    toggleShareScreen,
    recordSession,
  } = SipConnection.getSessionMethodsBy({ lineKey });

  // Watch session data reactively
  const [
    callType,
    started,
    callDirection,
    isOnHold,
    recordMedia,
    localMediaStreamStatus,
    remoteMediaStreamStatus,
    remoteNumber,
  ] = SipConnection.useWatchLineData({
    key: { lineKey },
    name: [
      'callType',
      'started',
      'callDirection',
      'isHold',
      'recordMedia',
      'localMediaStreamStatus',
      'remoteMediaStreamStatus',
      'remoteNumber',
    ],
  });
  const pc = SipConnection.getSessionBy({ lineKey })?.sessionDescriptionHandler?.peerConnection;
  console.log('getSenders', pc?.getSenders?.());

  // Media state
  const localVideoEnabled = localMediaStreamStatus?.videoEnabled ?? false;
  const remoteVideoEnabled = remoteMediaStreamStatus?.videoEnabled ?? false;
  const remoteScreenShareEnabled = remoteMediaStreamStatus?.screenShareEnabled ?? false;
  const localScreenShareEnabled = localMediaStreamStatus?.screenShareEnabled ?? false;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;
  // Misc session flags
  const callStarted = started;
  const isVideoCall = callType === 'video';
  const isOutbound = callDirection === 'outbound';
  const isMute = !localMediaStreamStatus?.soundEnabled;
  const isHold = isOnHold ?? false;
  const isRecording = recordMedia?.recording ?? false;
  console.log({ localMediaStreamStatus });
  // Recorder instance
  const recorder = recordSession(lineKey);

  /* ------------------------- Auto-initiate streams ------------------------- */
  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    SipConnection.getSessionBy({ lineKey })?.initiateLocalMediaStreams?.({
      type: 'video',
    });
  }, [callStarted]);

  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    SipConnection.getSessionBy({ lineKey })?.initiateRemoteMediaStreams?.();
  }, [callStarted]);

  /* ------------------------------- UI Render ------------------------------- */
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${lineKey}`}
    >
      {/* Call info */}
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      <p>Number: {remoteNumber}</p>

      {/* Video streams */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4, overflow: 'auto' }}>
        {localMediaStreamEnabled && (
          <VideoStream type="local" lineKey={lineKey} style={{ width: 100, height: 100 }} />
        )}
        {remoteMediaStreamEnabled && (
          <VideoStream
            type="remote"
            lineKey={lineKey}
            className="remote-videos"
            style={{ width: 200, height: 200, display: 'flex' }}
          />
        )}
      </div>

      {/* Call controls */}
      {callStarted ? (
        <div style={{ gap: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ color: 'red' }} onClick={() => endSession(lineKey)}>
            End Call
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleMuteSession(lineKey)}>
            {isMute ? 'Unmute' : 'Mute'}
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleLocalVideoTrack(lineKey)}>
            Video {localVideoEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => toggleHoldSession(lineKey)}>{isHold ? 'UnHold' : 'Hold'}</button>
          <button onClick={() => makeTransferSession(lineKey, '3212')}>Transfer To 3212</button>
          <button onClick={async () => toggleShareScreen(lineKey)}>
            Share Screen {localScreenShareEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => cancelTransferSession(lineKey, '3212')}>
            Cancel Transfer To 3213
          </button>
          <button
            onClick={async () => (isRecording ? await recorder?.stop() : await recorder?.start())}
          >
            {isRecording ? 'Recording...' : 'Record'}
          </button>
          <button
            onClick={() => {
              SipConnection.getSessionBy({ lineKey })?.initiateLocalMediaStreams?.({
                type: 'video',
                stopStream: false,
              });
            }}
          >
            {'Initiate Media'}
          </button>
        </div>
      ) : (
        // Incoming call actions
        !isOutbound && (
          <>
            {isVideoCall && (
              <button style={{ color: 'green' }} onClick={() => answerVideoSession(lineKey, true)}>
                Answer Video Call
              </button>
            )}
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall ? answerVideoSession(lineKey, false) : answerAudioSession(lineKey)
              }
            >
              Answer Call
            </button>
            <button style={{ color: 'red' }} onClick={() => endSession(lineKey)}>
              Reject Call
            </button>
          </>
        )
      )}

      {/* Cancel outbound call before connected */}
      {!callStarted && (
        <button style={{ color: 'red' }} onClick={() => endSession(lineKey)}>
          Cancel Call
        </button>
      )}

      {/* Always render audio */}
      <AudioStream type="local" lineKey={lineKey} />
      <AudioStream type="remote" lineKey={lineKey} />
    </div>
  );
});
