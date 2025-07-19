import './App.css';
import { Audio, Video } from './components';
import { useSessionMethods } from './hooks';
import { useSipProvider } from './provider';
import { LineType } from './store/types';
import { useEffect } from 'react';

function App({ username }: { username: string }) {
  const { lines, status } = useSipProvider();
  const { dialByNumber } = useSessionMethods();
  const renderLines = () => {
    return lines.map((line) => <SipLine line={line} />);
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
        <button onClick={() => dialByNumber('audio', '1011')}>{`Call 1011`}</button>
        <button onClick={() => dialByNumber('audio', '1013')}>{`Call 1013`}</button>

        <button onClick={() => dialByNumber('video', '1011')}>{`Video Call 1011`}</button>
        <button onClick={() => dialByNumber('video', '1013')}>{`Video Call 1013`}</button>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
export default App;

const SipLine = ({ line }: { line: LineType }) => {
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
  } = useSessionMethods();
  const callStarted = line.sipSession?.data.started;
  const isVideoCall = line.sipSession?.data.localMediaStreamStatus?.videoEnabled;
  const isOutbound = line.sipSession?.data.callDirection === 'outbound';
  const isMute = !line.sipSession?.data.localMediaStreamStatus?.soundEnabled;
  const isHold = line.sipSession?.isOnHold;
  console.log({ callStarted, isVideoCall }, line.sipSession?.data);
  const handleTransferLine = (line: LineType, transferNumber: LineType['lineNumber']) => {
    startTransferSession(line.lineNumber); // just holds the call
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  useEffect(() => {
    if (!callStarted) return;
    setTimeout(() => {
      line.sipSession?.initiateLocalMediaStreams(isVideoCall);
      line.sipSession?.initiateRemoteMediaStreams(isVideoCall);
    }, 3000);
  }, [callStarted, isVideoCall]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${line.lineNumber}`}
    >
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      {isVideoCall && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Video type="local" lineNumber={line.lineNumber} width={200} height={200} />
          <Video
            type="remote"
            lineNumber={line.lineNumber}
            style={{ display: 'flex', width: 200, height: 200 }}
          />
        </div>
      )}
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
          >{`Video ${isVideoCall ? 'ON' : 'OFF'}`}</button>
          <button
            onClick={() => toggleHoldSession(line.lineNumber)}
          >{`${isHold ? 'UnHold' : 'Hold'} Call`}</button>
          <button style={{ color: 'kemon' }} onClick={() => handleTransferLine(line, 1013)}>
            {'Transfer To 1013'}
          </button>
          <button
            style={{ color: 'darkred' }}
            onClick={() => cancelAttendedTransferSession(line, 1013)}
          >
            {'Cancel Transfer To 1013'}
          </button>
        </div>
      ) : (
        !isOutbound && (
          <>
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall
                  ? answerVideoSession(line.lineNumber)
                  : answerAudioSession(line.lineNumber)
              }
            >{`Answer ${isVideoCall ? 'Video' : ''} Call`}</button>
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

      <Audio lineNumber={line.lineNumber} />
      <Audio type={'transfer'} lineNumber={line.lineNumber} />
      <Audio type={'conference'} lineNumber={line.lineNumber} />
    </div>
  );
};
