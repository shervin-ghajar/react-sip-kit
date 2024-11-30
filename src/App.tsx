import './App.css';
import { useSipProvider } from './core/services/sip/provider';

function App() {
  const { userAgent, lines, buddies, AnswerAudioCall, RejectCall } = useSipProvider();
  console.log(222, { userAgent, lines, buddies });

  const renderLines = () => {
    return lines.map((line) => {
      const isVideoCall = !!line.SipSession?.data.withvideo || false;
      return (
        <>
          <h2>Call Screen</h2>
          <p>Name: {line.DisplayName}</p>
          <p>Number: {line.DisplayNumber}</p>
          <button
            onClick={() => AnswerAudioCall(line.LineNumber)}
          >{`Answer ${isVideoCall ? 'Video' : ''} Call`}</button>
          <button onClick={() => RejectCall(line.LineNumber)}>{`Reject Call`}</button>
          {isVideoCall && (
            <div style={{ display: 'block', gap: 4 }}>
              <video id="remoteVideo"></video>
              <video id="localVideo" muted={true}></video>
            </div>
          )}
        </>
      );
    });
  };
  return (
    <div>
      <h2>Web Phone</h2>
      {renderLines()}
      <button onClick={() => {}}>{`Call 1005`}</button>
    </div>
  );
}

export default App;
