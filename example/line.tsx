import { SipConnection } from '.';
import { useEffect } from 'react';
import { AudioStream, LineType, VideoStream, useWatchSessionData } from 'react-sip-kit';

export const Line = ({ lineKey }: { lineKey: LineType['lineKey'] }) => {
  const {
    answerAudioSession,
    answerVideoSession,
    endSession,
    toggleLocalVideoTrack,
    toggleMuteSession,
    toggleHoldSession,
    cancelTransferSession,
    makeTransferSession,
    toggleShareScreen,
    recordSession,
    getSessionByLineKey,
  } = SipConnection.getSessionMethodsBy({ lineKey });

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
    key: { lineKey },
    name: [
      'callType',
      'startTime',
      'callDirection',
      'isHold',
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
  const recorder = recordSession(lineKey);

  /* ------------------------- Auto-initiate streams ------------------------- */
  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    if (localMediaStreamEnabled) {
      getSessionByLineKey(lineKey)?.initiateLocalMediaStreams(localMediaStreamEnabled);
    }
  }, [callStarted, localVideoEnabled, localScreenShareEnabled]);

  useEffect(() => {
    if (!callStarted) return;
    // Lazy-initiate streams when needed
    if (remoteMediaStreamEnabled) {
      getSessionByLineKey(lineKey)?.initiateRemoteMediaStreams(remoteMediaStreamEnabled);
    }
  }, [callStarted, remoteVideoEnabled, remoteScreenShareEnabled]);

  /* ------------------------------- UI Render ------------------------------- */
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}
      id={`line-${lineKey}`}
    >
      {/* Call info */}
      <p>Call Started: {callStarted ? 'Yes' : 'No'}</p>
      <p>Number: {displayNumber}</p>

      {/* Video streams */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        {localMediaStreamEnabled && (
          <VideoStream type="local" lineKey={lineKey} width={200} height={200} />
        )}
        {remoteMediaStreamEnabled && (
          <VideoStream type="remote" lineKey={lineKey} style={{ width: 200, height: 200 }} />
        )}
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
          <button onClick={() => makeTransferSession(lineKey, '1012')}>Transfer To 1012</button>
          <button onClick={async () => await toggleShareScreen(lineKey)}>
            Share Screen {localScreenShareEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => cancelTransferSession(lineKey, 1012)}>
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
              <button style={{ color: 'green' }} onClick={() => answerVideoSession(lineKey, true)}>
                Answer Video Call
              </button>
            )}
            <button
              style={{ color: 'green' }}
              onClick={() =>
                isVideoCall ? answerVideoSession(lineKey, false) : answerAudioSession(lineKey)
              }
            >
              Answer Call
            </button>
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
};
