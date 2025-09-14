import './App.css';
import { Audio, Video } from './components';
import { useWatchSessionData } from './hooks';
import { SipConnection } from './main';
import { sessionMethods } from './methods/session';
import { LineType } from './store/types';
import { memo, useEffect } from 'react';

function App({ username }: { username: string }) {
  const { dialByNumber } = SipConnection.methods(username); // all session methods like dial, answer, toggle video, toggle share-screen and so on
  const { lines, status } = SipConnection.get(username).watch(); // watches lines and status if they change
  const renderLines = () => {
    return lines.map((line) => <SipLine key={line.lineNumber} username={username} line={line} />);
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
        Web Phone {username} {status}
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
        <button onClick={() => dialByNumber('audio', '1012')}>{`Call 1012`}</button>
        <button onClick={() => dialByNumber('audio', '1010')}>{`Call 1010`}</button>

        <button onClick={() => dialByNumber('video', '1012')}>{`Video Call 1012`}</button>
        <button onClick={() => dialByNumber('video', '1010')}>{`Video Call 1010`}</button>
        <button onClick={() => dialByNumber('audio', '700')}>{`Audio Conference Room-700`}</button>
        <button onClick={() => dialByNumber('video', '700')}>{`Video Conference Room-700`}</button>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
export default App;

const SipLine = ({ username, line }: { username: string; line: LineType }) => {
  const {
    answerAudioSession,
    answerVideoSession,
    endSession,
    toggleLocalVideoTrack,
    toggleMuteSession,
    toggleHoldSession,
    startTransferSession,
    cancelAttendedTransferSession,
    attendedTransferSession,
    toggleShareScreen,
    recordSession,
  } = sessionMethods({ username });
  const data = useWatchSessionData({ lineNumber: line.lineNumber });
  const sipSession = line.sipSession;
  const isVideoCall = data?.callType === 'video';
  const callStarted = data.started;
  const localVideoEnabled = data.localMediaStreamStatus?.videoEnabled;
  const remoteVideoEnabled = data.remoteMediaStreamStatus?.videoEnabled;
  const remoteScreenShareEnabled = data.remoteMediaStreamStatus?.screenShareEnabled;
  const localScreenShareEnabled = data.localMediaStreamStatus?.screenShareEnabled;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;
  const isOutbound = data.callDirection === 'outbound';
  const isMute = !data.localMediaStreamStatus?.soundEnabled;
  const isHold = sipSession?.isOnHold;
  const isRecording = data?.recordMedia?.recording;
  const recorder = recordSession(line.lineNumber);
  const handleTransferLine = (line: LineType, transferNumber: LineType['lineNumber']) => {
    startTransferSession(line.lineNumber); // just holds the call
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  useEffect(() => {
    if (!callStarted) return;
    sipSession?.initiateLocalMediaStreams(localMediaStreamEnabled);
  }, [callStarted, localVideoEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    sipSession?.initiateRemoteMediaStreams(remoteMediaStreamEnabled);
  }, [callStarted, remoteVideoEnabled, remoteScreenShareEnabled]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${line.lineNumber}`}
    >
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        {localMediaStreamEnabled && (
          <Video type="local" lineNumber={line.lineNumber} width={200} height={200} />
        )}
        {remoteMediaStreamEnabled && (
          <Video
            type="remote"
            lineNumber={line.lineNumber}
            style={{ display: 'flex', width: 200, height: 200 }}
          />
        )}
      </div>
      <div>
        {/* <p>Name: {line.metaData?.displayName}</p> */}
        <p>Number: {line.displayNumber}</p>
      </div>
      {callStarted ? (
        <div style={{ gap: 4, display: 'flex', justifyContent: 'center' }}>
          <button
            style={{ color: 'red' }}
            onClick={() => endSession(line.lineNumber)}
          >{`Cancel Call`}</button>
          <button
            style={{ color: 'blue' }}
            onClick={() => toggleMuteSession(line.lineNumber)}
          >{`${isMute ? 'Unmute' : 'Mute'} Call`}</button>
          <button
            style={{ color: 'blue' }}
            onClick={() => toggleLocalVideoTrack(line.lineNumber)}
          >{`Video ${localVideoEnabled ? 'ON' : 'OFF'}`}</button>
          <button
            onClick={() => toggleHoldSession(line.lineNumber)}
          >{`${isHold ? 'UnHold' : 'Hold'} Call`}</button>
          <button style={{ color: 'kemon' }} onClick={() => handleTransferLine(line, 1012)}>
            {'Transfer To 1012'}
          </button>
          <button
            style={{ color: 'kemon' }}
            onClick={async () => await toggleShareScreen(line.lineNumber)}
          >
            {`Share Screen ${localScreenShareEnabled ? 'ON' : 'OFF'}`}
          </button>
          <button
            style={{ color: 'darkred' }}
            onClick={() => cancelAttendedTransferSession(line, 1010)}
          >
            {'Cancel Transfer To 1010'}
          </button>
          <button
            style={{ color: 'darkred' }}
            onClick={async () => (isRecording ? await recorder?.stop() : await recorder?.start())}
          >
            {`${isRecording ? 'Recording' : 'Record'}`}
          </button>
        </div>
      ) : (
        !isOutbound && (
          <>
            {isVideoCall && (
              <button
                style={{ color: 'green' }}
                onClick={() => answerVideoSession(line.lineNumber, true)}
              >{`Answer Video Call`}</button>
            )}
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall
                  ? answerVideoSession(line.lineNumber, false)
                  : answerAudioSession(line.lineNumber)
              }
            >{`Answer Call`}</button>
            <button
              style={{ color: 'red' }}
              onClick={() => endSession(line.lineNumber)}
            >{`Reject Call`}</button>
          </>
        )
      )}
      {!callStarted && (
        <button
          style={{ color: 'red' }}
          onClick={() => endSession(line.lineNumber)}
        >{`Cancel Call`}</button>
      )}

      <Audio type="local" lineNumber={line.lineNumber} />
      <Audio type="remote" lineNumber={line.lineNumber} />
      <TestComponent lineNumber={line.lineNumber} />
    </div>
  );
};
const TestComponent = memo(({ lineNumber }: { lineNumber: number }) => {
  const [localMediaStreamStatus, isRecording] = useWatchSessionData({
    lineNumber,
    name: ['localMediaStreamStatus', 'recordMedia.recording'],
  });
  console.log({ localMediaStreamStatus, isRecording });
  return <>Test {localMediaStreamStatus.soundEnabled}</>;
});
