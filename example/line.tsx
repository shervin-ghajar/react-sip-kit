import { SipConnection } from '.';
import { useEffect } from 'react';
import { AudioStream, LineType, VideoStream, useWatchSessionData } from 'react-sip-kit';

export const Line = ({ lineNumber }: { lineNumber: LineType['lineNumber'] }) => {
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
    getSessionByNumber,
  } = SipConnection.methods();

  // Watch session data reactively
  const [
    callType,
    startTime,
    callDirection,
    isOnHold,
    recordMedia,
    localMediaStreamStatus,
    remoteMediaStreamStatus,
    displayNumber,
  ] = useWatchSessionData({
    lineNumber,
    name: [
      'callType',
      'startTime',
      'callDirection',
      'isOnHold',
      'recordMedia',
      'localMediaStreamStatus',
      'remoteMediaStreamStatus',
      'displayNumber',
    ],
  });

  // Media state
  const localVideoEnabled = localMediaStreamStatus?.videoEnabled ?? false;
  const remoteVideoEnabled = remoteMediaStreamStatus?.videoEnabled ?? false;
  const remoteScreenShareEnabled = remoteMediaStreamStatus?.screenShareEnabled ?? false;
  const localScreenShareEnabled = localMediaStreamStatus?.screenShareEnabled ?? false;

  const localMediaStreamEnabled = localVideoEnabled || localScreenShareEnabled;
  const remoteMediaStreamEnabled = remoteVideoEnabled || remoteScreenShareEnabled;

  // Misc session flags
  const callStarted = !!startTime;
  const isVideoCall = callType === 'video';
  const isOutbound = callDirection === 'outbound';
  const isMute = !localMediaStreamStatus?.soundEnabled;
  const isHold = isOnHold ?? false;
  const isRecording = recordMedia?.recording ?? false;

  // Recorder instance
  const recorder = recordSession(lineNumber);

  // Attended transfer example (hold, then transfer after 500ms)
  const handleTransferLine = (transferNumber: LineType['lineNumber']) => {
    startTransferSession(lineNumber);
    setTimeout(() => {
      attendedTransferSession(lineNumber, transferNumber);
    }, 500);
  };

  /* ------------------------- Auto-initiate streams ------------------------- */
  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    if (localMediaStreamEnabled) {
      getSessionByNumber(lineNumber)?.initiateLocalMediaStreams({
        videoEnabled: localMediaStreamEnabled,
      });
    }
  }, [callStarted, localVideoEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    if (remoteMediaStreamEnabled) {
      getSessionByNumber(lineNumber)?.initiateRemoteMediaStreams({
        videoEnabled: remoteMediaStreamEnabled,
      });
    }
  }, [callStarted, remoteVideoEnabled, remoteScreenShareEnabled]);

  /* ------------------------------- UI Render ------------------------------- */
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${lineNumber}`}
    >
      {/* Call info */}
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      <p>Number: {displayNumber}</p>

      {/* Video streams */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        {localMediaStreamEnabled && (
          <VideoStream type="local" lineNumber={lineNumber} width={200} height={200} />
        )}
        {remoteMediaStreamEnabled && (
          <VideoStream type="remote" lineNumber={lineNumber} style={{ width: 200, height: 200 }} />
        )}
      </div>

      {/* Call controls */}
      {callStarted ? (
        <div style={{ gap: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ color: 'red' }} onClick={() => endSession(lineNumber)}>
            End Call
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleMuteSession(lineNumber)}>
            {isMute ? 'Unmute' : 'Mute'}
          </button>
          <button style={{ color: 'blue' }} onClick={() => toggleLocalVideoTrack(lineNumber)}>
            Video {localVideoEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => toggleHoldSession(lineNumber)}>
            {isHold ? 'UnHold' : 'Hold'}
          </button>
          <button onClick={() => handleTransferLine(1012)}>Transfer To 1012</button>
          <button onClick={async () => await toggleShareScreen(lineNumber)}>
            Share Screen {localScreenShareEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => cancelAttendedTransferSession(lineNumber, 1010)}>
            Cancel Transfer To 1010
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
              <button
                style={{ color: 'green' }}
                onClick={() => answerVideoSession(lineNumber, true)}
              >
                Answer Video Call
              </button>
            )}
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall ? answerVideoSession(lineNumber, false) : answerAudioSession(lineNumber)
              }
            >
              Answer Call
            </button>
            <button style={{ color: 'red' }} onClick={() => endSession(lineNumber)}>
              Reject Call
            </button>
          </>
        )
      )}

      {/* Cancel outbound call before connected */}
      {!callStarted && (
        <button style={{ color: 'red' }} onClick={() => endSession(lineNumber)}>
          Cancel Call
        </button>
      )}

      {/* Always render audio */}
      <AudioStream type="local" lineNumber={lineNumber} />
      <AudioStream type="remote" lineNumber={lineNumber} />
    </div>
  );
};
