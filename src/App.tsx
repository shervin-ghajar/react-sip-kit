import './App.css';
import { Audio, Video } from './components';
import { useSessionMethods } from './hooks';
import { useSipProvider } from './provider';
import { LineType } from './store/types';
import { useEffect, useState } from 'react';

function App({ username }: { username: string }) {
  const { lines, status } = useSipProvider();
  const { dialByNumber } = useSessionMethods();
  const renderLines = () => {
    return lines.map((line) => <SipLine key={line.lineNumber} line={line} />);
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
        <button onClick={() => dialByNumber('audio', '1013')}>{`Call 1013`}</button>
        <button onClick={() => dialByNumber('audio', '1011')}>{`Call 1011`}</button>

        <button onClick={() => dialByNumber('video', '1013')}>{`Video Call 1013`}</button>
        <button onClick={() => dialByNumber('video', '1011')}>{`Video Call 1011`}</button>
        <button onClick={() => dialByNumber('audio', '700')}>{`Audio Conference Room-700`}</button>
        <button onClick={() => dialByNumber('video', '700')}>{`Video Conference Room-700`}</button>
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
    toggleShareScreen,
    recordSession,
  } = useSessionMethods();
  const isVideoCall = line.sipSession?.callType === 'video';
  const callStarted = line.sipSession?.data.started;
  const localVideoEnabled = line.sipSession?.data.localMediaStreamStatus?.videoEnabled;
  const remoteVideoEnabled = line.sipSession?.data.remoteMediaStreamStatus?.videoEnabled;
  const remoteScreenShareEnabled =
    line.sipSession?.data.remoteMediaStreamStatus?.screenShareEnabled;
  const localScreenShareEnabled = line.sipSession?.data.localMediaStreamStatus?.screenShareEnabled;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;
  const isOutbound = line.sipSession?.data.callDirection === 'outbound';
  const isMute = !line.sipSession?.data.localMediaStreamStatus?.soundEnabled;
  const isHold = line.sipSession?.isOnHold;
  const isRecording = line.sipSession?.data?.recordMedia?.recording;

  console.log({
    localMediaStreamStatus: line.sipSession?.data.localMediaStreamStatus,
    remoteMediaStreamStatus: line.sipSession?.data.remoteMediaStreamStatus,
  });
  console.log({ recordMedia: line.sipSession?.data?.recordMedia });

  console.log({ localMediaStreamEnabled, remoteMediaStreamEnabled });
  const recorder = recordSession(line.lineNumber);
  // console.log({ recorder: recorder?.getUrl() });
  const handleTransferLine = (line: LineType, transferNumber: LineType['lineNumber']) => {
    startTransferSession(line.lineNumber); // just holds the call
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  useEffect(() => {
    if (!callStarted) return;
    line.sipSession?.initiateLocalMediaStreams(localMediaStreamEnabled);
  }, [callStarted, localVideoEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    line.sipSession?.initiateRemoteMediaStreams(remoteMediaStreamEnabled);
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
          <button style={{ color: 'kemon' }} onClick={() => handleTransferLine(line, 1013)}>
            {'Transfer To 1013'}
          </button>
          <button
            style={{ color: 'kemon' }}
            onClick={async () => await toggleShareScreen(line.lineNumber)}
          >
            {`Share Screen ${localScreenShareEnabled ? 'ON' : 'OFF'}`}
          </button>
          <button
            style={{ color: 'darkred' }}
            onClick={() => cancelAttendedTransferSession(line, 1011)}
          >
            {'Cancel Transfer To 1011'}
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
      {/* <Audio type={'transfer'} lineNumber={line.lineNumber} /> */}
      {/* <Audio type={'conference'} lineNumber={line.lineNumber} /> */}
    </div>
  );
};
