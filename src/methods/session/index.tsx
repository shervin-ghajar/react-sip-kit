import { getSipStore } from '../../store';
import { LineType } from '../../store/types';

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
  if (lineObj.LocalSoundMeter != null) {
    lineObj.LocalSoundMeter.stop();
    lineObj.LocalSoundMeter = null;
  }
  if (lineObj.RemoteSoundMeter != null) {
    lineObj.RemoteSoundMeter.stop();
    lineObj.RemoteSoundMeter = null;
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
