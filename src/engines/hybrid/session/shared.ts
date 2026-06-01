import { getRtcStore } from '../../../../store';
import { CallbackFunction } from '../../../../types';
import { SipLineType } from '../../types';
import { SendMessageSessionEnum, SendMessageSessionValueType } from './types';

/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export function teardownSession(lineObj: SipLineType, callback?: CallbackFunction) {
  const { removeLine } = getRtcStore();
  if (lineObj == null || lineObj.session == null) return;

  const session = lineObj.session;
  const lineData = lineObj.data;
  if (lineData.teardownComplete == true) return;
  lineData.teardownComplete = true; // Run this code only once

  // Stop ongoing recording
  if (lineObj.data.recordMedia.recording) {
    lineObj.data.recordMedia.recorder?.stop();
  }

  // End any child calls
  // if (session.data.childSession) {
  //   session.data.childSession
  //     .dispose()
  //     .then(function () {
  //       session.data.childSession = null;
  //     })
  //     .catch(function (error) {
  //       console.error('teardownSession-dispose', { error });
  //       session.data.childSession = null;
  //       // Suppress message
  //     });
  // }

  // Mixed Tracks
  if (lineData.localMediaStreamData.audio.track) {
    lineData.localMediaStreamData.audio.track.stop();
    lineData.localMediaStreamData.audio.track = null;
  }
  if (lineData.localMediaStreamData.video.track) {
    lineData.localMediaStreamData.video.track.stop();
    lineData.localMediaStreamData.video.track = null;
  }

  // // Make sure you have released the microphone
  if (
    session &&
    session.sessionDescriptionHandler &&
    session.sessionDescriptionHandler?.peerConnection
  ) {
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender?.track?.kind == 'audio' || RTCRtpSender?.track?.kind == 'video') {
        console.log(777);
        RTCRtpSender.track.stop();
      }
    });
  }
  removeLine(lineObj.lineKey);
  callback?.();
}
/* -------------------------------------------------------------------------- */
export async function sendMessageSession<T extends SendMessageSessionEnum>(
  session: SipLineType['session'],
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
  lineKey: SipLineType['lineKey'],
  session: SipLineType['session'],
  options?: { maxRetries?: number; delayMs?: number },
  value: boolean = true,
): Promise<void> {
  const maxRetries = options?.maxRetries ?? 5;
  const delayMs = options?.delayMs ?? 1000;
  let attempts = 0;

  return new Promise<void>((resolve, reject) => {
    const trySend = async () => {
      if (lineKey) return;
      const lineObj = getRtcStore().getLineByLineKey<SipLineType>(lineKey);
      const ackReceived = lineObj?.data?.videoAckReceived;
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
      await sendMessageSession(session, SendMessageSessionEnum.VIDEO_TOGGLE, value);
      attempts++;

      setTimeout(trySend, delayMs);
    };

    trySend();
  });
}
