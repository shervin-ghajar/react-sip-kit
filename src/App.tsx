import { AudioStream, VideoStream } from '.';
import './App.css';
import { accountConfigs, SipConnection } from './main';
import { LineType } from './store/types';
import { memo, useEffect } from 'react';

function App({ configKey }: { configKey: string }) {
  const { dialByNumber } = SipConnection.getSessionMethodsBy({ configKey }); // all session methods like dial, answer, toggle video, toggle share-screen and so on
  const { lines, status } = SipConnection.getAccountBy({ configKey }).watch(); // watches lines and status if they change
  const renderLines = () => {
    return lines.map((line) => <SipLine key={line.lineKey} lineKey={line.lineKey} />);
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <h2>
        Web Phone {configKey} {status}
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
        {Object.keys(accountConfigs).map((ac) => {
          return [
            <button onClick={() => dialByNumber('audio', ac)}>{`Call ${ac}`}</button>,
            <button onClick={() => dialByNumber('video', ac)}>{`Video Call ${ac}`}</button>,
          ];
        })}
        <button onClick={() => dialByNumber('audio', '99362038188')}>{`Call 99362038188`}</button>
        <button onClick={() => dialByNumber('audio', '700')}>{`Audio Conference Room-700`}</button>
        <button onClick={() => dialByNumber('video', '700')}>{`Video Conference Room-700`}</button>
        <button onClick={() => SipConnection.reconnect(configKey)}>{`Reconnect`}</button>
      </div>
    </div>
  );
}
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
  ] = SipConnection.useWatchSessionData({
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
    if (localMediaStreamEnabled) {
      console.log('localMediaStreamEnabled');
      SipConnection.getSessionBy({ lineKey })?.initiateLocalMediaStreams?.();
    }
  }, [callStarted, localMediaStreamEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    if (remoteMediaStreamEnabled) {
      SipConnection.getSessionBy({ lineKey })?.initiateRemoteMediaStreams?.();
    }
  }, [callStarted, remoteMediaStreamEnabled, remoteScreenShareEnabled]);

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
