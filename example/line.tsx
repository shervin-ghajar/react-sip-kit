import { useEffect } from 'react';
import { AudioStream, LineType, useSessionMethods, VideoStream } from 'react-sip-kit';

export const Line = ({ line }: { line: LineType }) => {
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

  // Call/session state helpers
  const isVideoCall = line.sipSession?.callType === 'video';
  const callStarted = line.sipSession?.data.started;

  // Media state
  const localVideoEnabled = line.sipSession?.data.localMediaStreamStatus?.videoEnabled;
  const remoteVideoEnabled = line.sipSession?.data.remoteMediaStreamStatus?.videoEnabled;
  const remoteScreenShareEnabled =
    line.sipSession?.data.remoteMediaStreamStatus?.screenShareEnabled;
  const localScreenShareEnabled = line.sipSession?.data.localMediaStreamStatus?.screenShareEnabled;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;

  // Misc session flags
  const isOutbound = line.sipSession?.data.callDirection === 'outbound';
  const isMute = !line.sipSession?.data.localMediaStreamStatus?.soundEnabled;
  const isHold = line.sipSession?.isOnHold;
  const isRecording = line.sipSession?.data?.recordMedia?.recording;

  // Recorder instance
  const recorder = recordSession(line.lineNumber);

  // Attended transfer example (hold, then transfer after 500ms)
  const handleTransferLine = (line: LineType, transferNumber: LineType['lineNumber']) => {
    startTransferSession(line.lineNumber);
    setTimeout(() => {
      attendedTransferSession(line, transferNumber);
    }, 500);
  };

  /* ------------------------- Auto-initiate streams ------------------------- */

  useEffect(() => {
    if (!callStarted) return;
    line.sipSession?.initiateLocalMediaStreams(localMediaStreamEnabled);
  }, [callStarted, localVideoEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    line.sipSession?.initiateRemoteMediaStreams(remoteMediaStreamEnabled);
  }, [callStarted, remoteVideoEnabled, remoteScreenShareEnabled]);

  /* ------------------------------- UI Render ------------------------------- */

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${line.lineNumber}`}
    >
      {/* Call info */}
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      <p>Number: {line.displayNumber}</p>

      {/* Video streams (local/remote) */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        {localMediaStreamEnabled && (
          <VideoStream type="local" lineNumber={line.lineNumber} width={200} height={200} />
        )}
        {remoteMediaStreamEnabled && (
          <VideoStream
            type="remote"
            lineNumber={line.lineNumber}
            style={{ width: 200, height: 200 }}
          />
        )}
      </div>

      {/* Call controls */}
      {callStarted ? (
        <div style={{ gap: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ color: 'red' }} onClick={() => endSession(line.lineNumber)}>
            Cancel Call
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleMuteSession(line.lineNumber)}>
            {isMute ? 'Unmute' : 'Mute'} Call
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleLocalVideoTrack(line.lineNumber)}>
            Video {localVideoEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => toggleHoldSession(line.lineNumber)}>
            {isHold ? 'UnHold' : 'Hold'} Call
          </button>
          <button onClick={() => handleTransferLine(line, 1012)}>Transfer To 1012</button>
          <button onClick={async () => await toggleShareScreen(line.lineNumber)}>
            Share Screen {localScreenShareEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => cancelAttendedTransferSession(line, 1010)}>
            Cancel Transfer To 1010
          </button>
          <button
            onClick={async () => (isRecording ? await recorder?.stop() : await recorder?.start())}
          >
            {isRecording ? 'Recording...' : 'Record'}
          </button>
        </div>
      ) : (
        // Incoming call actions (only for inbound calls)
        !isOutbound && (
          <>
            {isVideoCall && (
              <button
                style={{ color: 'green' }}
                onClick={() => answerVideoSession(line.lineNumber, true)}
              >
                Answer Video Call
              </button>
            )}
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall
                  ? answerVideoSession(line.lineNumber, false)
                  : answerAudioSession(line.lineNumber)
              }
            >
              Answer Call
            </button>
            <button style={{ color: 'red' }} onClick={() => endSession(line.lineNumber)}>
              Reject Call
            </button>
          </>
        )
      )}

      {/* Cancel outbound call before connected */}
      {!callStarted && (
        <button style={{ color: 'red' }} onClick={() => endSession(line.lineNumber)}>
          Cancel Call
        </button>
      )}

      {/* Always render audio streams */}
      <AudioStream type="local" lineNumber={line.lineNumber} />
      <AudioStream type="remote" lineNumber={line.lineNumber} />
    </div>
  );
};
