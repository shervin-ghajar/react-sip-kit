import { getSipStore } from '../../store';
import { LineType } from '../../store/types';
import { SendMessageSessionValueType, SendMessageSessionEnum, RecordController } from './type';

/* -------------------------------------------------------------------------- */
export function teardownSession(lineObj: LineType) {
  const { removeLine } = getSipStore();
  if (lineObj == null || lineObj.sipSession == null) return;

  const session = lineObj.sipSession;
  if (session.data.teardownComplete == true) return;
  session.data.teardownComplete = true; // Run this code only once

  // End any child calls
  if (session.data.childsession) {
    session.data.childsession
      .dispose()
      .then(function () {
        session.data.childsession = null;
      })
      .catch(function (error) {
        console.error('teardownSession-dispose', { error });
        session.data.childsession = null;
        // Suppress message
      });
  }

  // Mixed Tracks
  if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
    session.data.audioSourceTrack.stop();
    session.data.audioSourceTrack = null;
  }
  // Stop any Early Media
  if (session.data.earlyMedia) {
    session.data.earlyMedia.pause();
    session.data.earlyMedia.removeAttribute('src');
    session.data.earlyMedia.load();
    session.data.earlyMedia = null;
  }
  // Stop any ringing calls
  if (session.data.ringerObj) {
    session.data.ringerObj.pause();
    session.data.ringerObj.removeAttribute('src');
    session.data.ringerObj.load();
    session.data.ringerObj = null;
  }

  // Stop Recording if we are TODO #SH
  //   StopRecording(lineObj.LineNumber, true);

  // Audio Meters
  if (lineObj.localSoundMeter !== null) {
    lineObj.localSoundMeter.stop();
    lineObj.localSoundMeter = null;
  }
  if (lineObj.remoteSoundMeter !== null) {
    lineObj.remoteSoundMeter.stop();
    lineObj.remoteSoundMeter = null;
  }

  // Make sure you have released the microphone
  if (
    session &&
    session.sessionDescriptionHandler &&
    session.sessionDescriptionHandler?.peerConnection
  ) {
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender?.track?.kind == 'audio') {
        RTCRtpSender.track.stop();
      }
    });
  }

  // End timers TODO #SH
  //   window.clearInterval(session.data.videoResampleInterval);

  // Add to stream
  //   AddCallMessage(lineObj?.BuddyObj?.identity, session); TODO #SH

  // Check if this call was missed
  if (session.data.callDirection == 'inbound') {
    if (session.data.earlyReject) {
      // Call was rejected without even ringing
      //   IncreaseMissedBadge(session.data.buddyId); TODO #SH
    } else if (session.data.terminateBy == 'them' && session.data.startTime == null) {
      // Call Terminated by them during ringing
      if (session.data.reasonCode == 0) {
        // Call was canceled, and not answered elsewhere
        // IncreaseMissedBadge(session.data.buddyId); TODO #SH
      }
    }
  }

  // Close up the UI
  //   window.setTimeout(function () {
  //     RemoveLine(lineObj);
  //   }, 1000);

  //   UpdateBuddyList();
  //   if (session.data.earlyReject != true) {
  //     UpdateUI();
  //   }
  removeLine(lineObj.lineNumber);
}
/* -------------------------------------------------------------------------- */
export async function sendMessageSession<T extends SendMessageSessionEnum>(
  session: LineType['sipSession'],
  type: T,
  value: SendMessageSessionValueType[T],
) {
  if (!session) return;
  try {
    await session.message({
      requestDelegate: {
        onAccept: () => console.log('MESSAGE accepted'),
        onReject: () => console.log('MESSAGE rejected'),
      },
      requestOptions: {
        body: {
          contentType: 'text/plain',
          content: JSON.stringify({ type, value }),
          contentDisposition: 'render',
        },
      },
    });
  } catch (error) {
    console.log('sendMessage Error', error);
  }
}
/* -------------------------------------------------------------------------- */
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export async function sendVideoActivationWithAckRetry(
  session: LineType['sipSession'],
  options?: { maxRetries?: number; delayMs?: number },
): Promise<void> {
  const maxRetries = options?.maxRetries ?? 5;
  const delayMs = options?.delayMs ?? 1000;
  let attempts = 0;

  return new Promise<void>((resolve, reject) => {
    const trySend = async () => {
      if (!session?.data?.line) return;
      const ackReceived = getSipStore().findLineByNumber(session?.data?.line)?.sipSession?.data
        ?.videoAckReceived;
      console.log('VIDEO_TOGGLE_ACK', { ackReceived });
      if (ackReceived) {
        console.log('✅ VIDEO_TOGGLE_ACK received');
        return resolve();
      }

      if (attempts >= maxRetries) {
        console.warn('❌ VIDEO_TOGGLE_ACK not received after max retries');
        return reject(new Error('ACK timeout'));
      }

      console.log(`📤 Sending VIDEO_TOGGLE (attempt #${attempts + 1})`);
      await sendMessageSession(session, SendMessageSessionEnum.VIDEO_TOGGLE, true);
      attempts++;

      setTimeout(trySend, delayMs);
    };

    trySend();
  });
}
/* -------------------------------------------------------------------------- */
/**
 * Initializes a call recorder for the specified SIP line.
 *
 * Combines both local (from senders) and remote (from receivers) media tracks
 * into a single MediaStream and records them using the MediaRecorder API.
 *
 * Returns a controller with methods to start and stop recording,
 * as well as access the recorded media as a Blob or URL.
 *
 * @param lineNumber - The SIP line number associated with the call session.
 * @returns A RecordController with controls for managing the recording lifecycle.
 */
export function recordSession(lineNumber: LineType['lineNumber']): RecordController | undefined {
  // Get session from line
  const lineObj = getSipStore().findLineByNumber(lineNumber);
  if (lineObj === null) {
    console.warn('❌ Failed to get line (' + lineNumber + ')');
    return;
  }

  const session = lineObj.sipSession;
  const pc = session?.sessionDescriptionHandler?.peerConnection;

  if (!session || !pc) {
    console.warn('❌ Failed to get session or peer connection for line', lineNumber);
    return;
  }

  // Build local stream from sender tracks
  const localStream = new MediaStream();
  pc.getSenders().forEach((sender) => {
    if (sender.track) {
      localStream.addTrack(sender.track);
    }
  });

  // Build remote stream from receiver tracks
  const remoteStream = new MediaStream();
  pc.getReceivers().forEach((receiver) => {
    if (receiver.track) {
      remoteStream.addTrack(receiver.track);
    }
  });

  // Combine both into one stream for recording
  const combinedStream = new MediaStream([...localStream.getTracks(), ...remoteStream.getTracks()]);

  // Setup recorder state
  let chunks: BlobPart[] = [];
  let recorder: MediaRecorder | null = null;
  let recordedBlob: Blob | null = null;

  return {
    /**
     * Starts recording the combined local + remote media stream
     */
    start: () => {
      chunks = [];

      try {
        recorder = new MediaRecorder(combinedStream, {
          mimeType: 'video/webm; codecs=vp8,opus',
        });
      } catch (err) {
        console.error('❌ Failed to create MediaRecorder:', err);
        return;
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        recordedBlob = new Blob(chunks, { type: 'video/webm' });
        console.log('📁 Recording complete. Blob size:', recordedBlob.size);
      };

      recorder.start();
      console.log('🔴 Recording started on line', lineNumber);
    },

    /**
     * Stops the recording and returns a Blob of the recorded media
     */
    stop: () => {
      return new Promise<Blob>((resolve) => {
        if (recorder && recorder.state !== 'inactive') {
          recorder.onstop = () => {
            recordedBlob = new Blob(chunks, { type: 'video/webm' });
            console.log('🛑 Recording stopped');
            resolve(recordedBlob);
          };
          recorder.stop();
        } else {
          console.warn('⚠️ No active recorder found to stop.');
          resolve(recordedBlob!);
        }
      });
    },

    /**
     * Returns the final Blob (after stop)
     */
    getBlob: () => recordedBlob,

    /**
     * Returns a local URL to preview/download the Blob
     */
    getUrl: () => (recordedBlob ? URL.createObjectURL(recordedBlob) : null),
  };
}
