import './App.css';
import { Audio, Video } from './components';
import { useSipProvider } from './core/services/sip/provider';

function App() {
  const {
    lines,
    AnswerAudioCall,
    AnswerVideoCall,
    DialByLine,
    endCall,
    muteSession,
    unmuteSession,
    holdSession,
    unholdSession,
    startTransferSession,
    cancelTransferSession,
    attendedTransferSession,
  } = useSipProvider();

  const handleTransfer = (num: number) => {
    startTransferSession(num);
    setTimeout(() => {
      attendedTransferSession(num);
    }, 2000);
  };
  const renderLines = () => {
    return lines.map((line) => {
      const callStarted = line.SipSession?.data.started;
      const isVideoCall = !!line.SipSession?.data.withvideo || false;
      const isOutbound = line.SipSession?.data.calldirection === 'outbound';
      const isMute = line.SipSession?.data.isMute;
      const isHold = line.SipSession?.isOnHold;
      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
          id={`line-${line.LineNumber}`}
        >
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
          {!isOutbound && (
            <button
              onClick={() =>
                isVideoCall ? AnswerVideoCall(line.LineNumber) : AnswerAudioCall(line.LineNumber)
              }
            >{`Answer ${isVideoCall ? 'Video' : ''} Call`}</button>
          )}
          <button onClick={() => endCall(line.LineNumber)}>{`Reject Call`}</button>
          <button
            onClick={() => (isMute ? unmuteSession(line.LineNumber) : muteSession(line.LineNumber))}
          >{`${isMute ? 'Unmute' : 'Mute'} Call`}</button>

          <button
            onClick={() => (isHold ? unholdSession(line.LineNumber) : holdSession(line.LineNumber))}
          >{`${isHold ? 'UnHold' : 'Hold'} Call`}</button>
          <Audio lineNumber={line.LineNumber} />
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
      <h2>Web Phone</h2>
      <div
        style={{
          backgroundColor: 'lightgray',
          border: '1px solid black',
          minHeight: 400,
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
        <button onClick={() => DialByLine('audio', '1005')}>{`Call 1005`}</button>
        <button onClick={() => DialByLine('video', '1005')}>{`Video Call 1005`}</button>
      </div>
    </div>
  );
}

export default App;
