import './App.css';
import { Audio, Video } from './components';
import { useSipProvider } from './core/services/sip';
import { LineType } from './core/services/sip/store/types';

function App({ username }: { username: string }) {
  const {
    store: { lines },
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
  } = useSipProvider();

  console.log({ lines });

  const handleTransferLine = (line: LineType, transferNumber: LineType['LineNumber']) => {
    startTransferSession(line.LineNumber); // just holds the call
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  const renderLines = () => {
    return lines.map((line) => {
      const callStarted = line.SipSession?.data.started;
      const isVideoCall = !!line.SipSession?.data.withvideo || false;
      const isOutbound = line.SipSession?.data.calldirection === 'outbound';
      const isMute = line.SipSession?.data.isMute;
      const isHold = line.SipSession?.isOnHold;
      console.log({ callStarted }, line.SipSession?.data);
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
          id={`line-${line.LineNumber}`}
        >
          <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
          {isVideoCall && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
              <Video type="local" lineNumber={line.LineNumber} width={200} height={200} />
              <Video
                type="remote"
                lineNumber={line.LineNumber}
                style={{ display: 'flex', width: 200, height: 200 }}
              />
            </div>
          )}
          <div>
            <p>Name: {line.DisplayName}</p>
            <p>Number: {line.DisplayNumber}</p>
          </div>
          {callStarted ? (
            <div style={{ gap: 4, display: 'flex', justifyContent: 'center' }}>
              <button
                style={{ color: 'red' }}
                onClick={() => endSession(line.LineNumber)}
              >{`Cancel Call`}</button>
              <button
                style={{ color: 'blue' }}
                onClick={() =>
                  isMute ? unmuteSession(line.LineNumber) : muteSession(line.LineNumber)
                }
              >{`${isMute ? 'Unmute' : 'Mute'} Call`}</button>

              <button
                onClick={() =>
                  isHold ? unholdSession(line.LineNumber) : holdSession(line.LineNumber)
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
                      ? answerVideoSession(line.LineNumber)
                      : answerAudioSession(line.LineNumber)
                  }
                >{`Answer ${isVideoCall ? 'Video' : ''} Call`}</button>
                <button
                  style={{ color: 'red' }}
                  onClick={() => endSession(line.LineNumber)}
                >{`Reject Call`}</button>
              </>
            )
          )}

          <Audio lineNumber={line.LineNumber} />
          <Audio type={'transfer'} lineNumber={line.LineNumber} />
          <Audio type={'conference'} lineNumber={line.LineNumber} />
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
      <h2>Web Phone {username}</h2>
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
