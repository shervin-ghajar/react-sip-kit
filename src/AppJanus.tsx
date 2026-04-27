import { memo, useState } from 'react';
import { AudioStream, VideoStream } from '.';
import './App.css';
import { JanusSessionType } from './engines/janus/types';
import { RtcConnection } from './main';
import { LineType } from './store/types';
/* -------------------------------------------------------------------------- */
function App({ configKey }: { configKey: string }) {
  const { startSession } = RtcConnection.getJanusSessionMethodsBy({ configKey }); // all session methods like dial, answer, toggle video, toggle share-screen and so on
  const { lines, status } = RtcConnection.getAccountBy({ configKey }).watch(); // watches lines and status if they change
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
        Web Phone {configKey} {status} {`(${RtcConnection.isMaster ? 'Master' : 'Follower'})`}
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
          <input type="number" value={number} onChange={(e) => setNumber(String(e.target.value))} style={{ width: 100 }} />
          <button onClick={() => number && startSession('video', number, { autoCreate: true })} style={{ fontSize: 10 }}>{`(Join or Create) Room Video`}</button>
          <button onClick={() => number && startSession('audio', number, { autoCreate: true })} style={{ fontSize: 10 }}>{`(Join or Create) Room Audio`}</button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <input type="number" value={number} onChange={(e) => setNumber(String(e.target.value))} style={{ width: 100 }} />
          <button onClick={() => number && startSession('video', number)} style={{ fontSize: 10 }}>{`Join Room Video`}</button>
          <button onClick={() => number && startSession('audio', number)} style={{ fontSize: 10 }}>{`Join Room Audio`}</button>
        </div>
        {/* <button onClick={() => RtcConnection.refreshRegistration(configKey)}>{`ReRegister`}</button>
        <button onClick={() => RtcConnection.refreshRegistration(configKey)}>{`ReRegister`}</button> */}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
export default App;
/* -------------------------------------------------------------------------- */
const SipLine = memo(({ lineKey }: { lineKey: LineType['lineKey'] }) => {
  const {
    endSession,
    toggleLocalVideoTrack,
    toggleMuteSession,
    toggleHoldSession,
    toggleShareScreen,
    recordSession,
  } = RtcConnection.getJanusSessionMethodsBy({ lineKey });

  // Watch session data reactively
  const [
    callType,
    started,
    callDirection,
    isOnHold,
    recordMedia,
    localMediaStreamData,
    remoteNumber,
  ] = RtcConnection.useWatchLineData({
    key: { lineKey },
    name: [
      'callType',
      'started',
      'callDirection',
      'isHold',
      'recordMedia',
      'localMediaStreamData',
      'remoteNumber',
    ],
  });
  // const pc = RtcConnection.getSessionBy({ lineKey })?.sessionDescriptionHandler?.peerConnection;
  // console.log('getSenders', pc?.getSenders?.());

  // Media state
  const localVideoEnabled = localMediaStreamData.video.enabled;
  // const remoteVideoEnabled = remoteMediaStreamData.video;
  // const remoteScreenShareEnabled = remoteMediaStreamData?.screen.enabled;
  const localScreenShareEnabled = localMediaStreamData?.screen.enabled;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  // const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;
  // Misc session flags
  const callStarted = started;
  const isOutbound = callDirection === 'outbound';
  const isMute = localMediaStreamData.audio.enabled;
  const isHold = isOnHold ?? false;
  const isRecording = recordMedia?.recording ?? false;
  console.log({ localMediaStreamData });
  // Recorder instance
  const recorder = recordSession(lineKey);

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
        <VideoStream
          type="remote"
          lineKey={lineKey}
          className="remote-videos"
          style={{ width: 200, height: 200, display: 'flex' }}
        />
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
          {/* <button onClick={() => makeTransferSession(lineKey, '3212')}>Transfer To 3212</button> */}
          {/* <button onClick={() => cancelTransferSession(lineKey, '3212')}>
            Cancel Transfer To 3213
          </button> */}
          <button onClick={async () => toggleShareScreen(lineKey)}>
            Share Screen {localScreenShareEnabled ? 'ON' : 'OFF'}
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
