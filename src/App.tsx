import './App.css';
import { Audio, Video } from './components';
import { useSipProvider } from './provider';
import { LineType } from './store/types';

interface MetaDataType {
  displayName: string;
}
function App({ username }: { username: string }) {
  const {
    lines,
    status,
    session: {
      methods: {
        answerAudioSession,
        answerVideoSession,
        dialByLine,
        endSession,
        muteSession,
        unmuteSession,
        holdSession,
        unholdSession,
        startTransferSession,
        cancelAttendedTransferSession,
        attendedTransferSession,
      },
    },
  } = useSipProvider<MetaDataType>();

  const handleTransferLine = (line: LineType, transferNumber: LineType['lineNumber']) => {
    startTransferSession(line.lineNumber); // just holds the call
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  const renderLines = () => {
    return lines.map((line) => {
      const callStarted = line.sipSession?.data.started;
      const isVideoCall = !!line.sipSession?.data.withVideo || false;
      const isOutbound = line.sipSession?.data.callDirection === 'outbound';
      const isMute = line.sipSession?.data.isMute;
      const isHold = line.sipSession?.isOnHold;
      console.log({ callStarted }, line.sipSession?.data);
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
            <p>Name: {line.metaData?.displayName}</p>
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
                onClick={() =>
                  isMute ? unmuteSession(line.lineNumber) : muteSession(line.lineNumber)
                }
              >{`${isMute ? 'Unmute' : 'Mute'} Call`}</button>

              <button
                onClick={() =>
                  isHold ? unholdSession(line.lineNumber) : holdSession(line.lineNumber)
                }
              >{`${isHold ? 'UnHold' : 'Hold'} Call`}</button>
              <button style={{ color: 'kemon' }} onClick={() => handleTransferLine(line, 1012)}>
                {'Transfer To 1012'}
              </button>
              <button
                style={{ color: 'darkred' }}
                onClick={() => cancelAttendedTransferSession(line, 1012)}
              >
                {'Cancel Transfer To 1012'}
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
    });
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
        <button onClick={() => dialByLine('audio', '1010')}>{`Call 1010`}</button>
        <button onClick={() => dialByLine('audio', '1012')}>{`Call 1012`}</button>

        <button onClick={() => dialByLine('video', '1010')}>{`Video Call 1010`}</button>
        <button onClick={() => dialByLine('video', '1012')}>{`Video Call 1012`}</button>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
export default App;
