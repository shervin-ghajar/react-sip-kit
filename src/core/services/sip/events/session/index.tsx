import { dayJs } from '../../../../../utils';
import { CallRecordingPolicy, MaxVideoBandwidth, RecordAllCalls } from '../../configs';
import { teardownSession } from '../../methods/session';
import { getSipStore, useSipStore } from '../../store';
import { LineType, SipSessionDescriptionHandler } from '../../store/types';
import { formatShortDuration, getAudioOutputID, utcDateNow } from '../../utils';
import { SipMediaStream } from './types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';

/* -------------------------------------------------------------------------- */
// Incoming INVITE
export function onInviteCancel(lineObj: LineType, response: IncomingRequestMessage) {
  // Remote Party Canceled while ringing...
  // Check to see if this call has been completed elsewhere
  // https://github.com/InnovateAsterisk/Browser-Phone/issues/405
  let temp_cause = 0;
  const reason = response.headers['Reason'];
  if (reason !== undefined && reason.length > 0) {
    for (let i = 0; i < reason.length; i++) {
      const cause = reason[i].raw.toLowerCase().trim(); // Reason: Q.850 ;cause=16 ;text="Terminated"
      const items = cause.split(';');
      if (
        items.length >= 2 &&
        (items[0].trim() == 'sip' || items[0].trim() == 'q.850') &&
        items[1].includes('cause') &&
        cause.includes('call completed elsewhere')
      ) {
        temp_cause = parseInt(items[1].substring(items[1].indexOf('=') + 1).trim());
        // No sample provided for "token"
        break;
      }
    }
  }
  const session = lineObj.SipSession;
  if (!session) return;
  session.data.terminateby = 'them';
  session.data.reasonCode = temp_cause;
  if (temp_cause == 0) {
    session.data.reasonText = 'Call Cancelled';
    console.log('Call canceled by remote party before answer');
  } else {
    session.data.reasonText = 'Call completed elsewhere';
    console.log('Call completed elsewhere before answer');
  }

  session.dispose().catch(function (error) {
    console.log('Failed to dispose the cancel dialog', error);
  });

  teardownSession(lineObj);
}
// // Both Incoming an outgoing INVITE
export function onInviteAccepted(
  lineObj: LineType,
  includeVideo: boolean,
  response?: IncomingResponse,
) {
  console.log('onInviteAccepted');
  // Call in progress
  const session = lineObj.SipSession;
  if (!session) return;
  if (session.data.earlyMedia) {
    session.data.earlyMedia.pause();
    session.data.earlyMedia.removeAttribute('src');
    session.data.earlyMedia.load();
    session.data.earlyMedia = null;
  }

  window.clearInterval(session.data.callTimer);
  const startTime = dayJs.utc();
  session.data.startTime = startTime;
  session.data.callTimer = window.setInterval(function () {
    const now = dayJs.utc();
    const duration = dayJs.duration(now.diff(startTime));
    const timeStr = formatShortDuration(duration.asSeconds());
  }, 1000);
  session.isOnHold = false;
  session.data.started = true;

  if (includeVideo) {
    // Preview our stream from peer connection
    const localVideoStream = new MediaStream();
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (sender) {
      if (sender.track && sender.track.kind == 'video') {
        localVideoStream.addTrack(sender.track);
      }
    });
    const localVideo = document.getElementById(
      `line-${lineObj.LineNumber}-localVideo`,
    ) as HTMLVideoElement;
    if (localVideo) {
      localVideo.srcObject = localVideoStream;
      localVideo.onloadedmetadata = function (e) {
        localVideo.play();
      };
    }

    // Apply Call Bandwidth Limits
    if (MaxVideoBandwidth > -1) {
      pc.getSenders().forEach(function (sender) {
        if (sender.track && sender.track.kind == 'video') {
          const parameters = sender.getParameters();
          if (!parameters.encodings) parameters.encodings = [{}];
          parameters.encodings[0].maxBitrate = MaxVideoBandwidth * 1000;

          console.log('Applying limit for Bandwidth to: ', MaxVideoBandwidth + 'kb per second');

          // Only going to try without re-negotiations
          sender.setParameters(parameters).catch(function (e: any) {
            console.warn('Cannot apply Bandwidth Limits', e);
          });
        }
      });
    }
  }

  // Start Call Recording
  if (RecordAllCalls || CallRecordingPolicy == 'enabled') {
    // StartRecording(lineObj.LineNumber); TODO #SH Recording feature
  }

  //   if (includeVideo) {
  //     // Layout for Video Call
  //     $('#line-' + lineObj.LineNumber + '-progress').hide();
  //     $('#line-' + lineObj.LineNumber + '-VideoCall').show();
  //     $('#line-' + lineObj.LineNumber + '-ActiveCall').show();

  //     $('#line-' + lineObj.LineNumber + '-btn-Conference').hide(); // Cannot conference a Video Call (Yet...)
  //     $('#line-' + lineObj.LineNumber + '-btn-CancelConference').hide();
  //     $('#line-' + lineObj.LineNumber + '-Conference').hide();

  //     $('#line-' + lineObj.LineNumber + '-btn-Transfer').hide(); // Cannot transfer a Video Call (Yet...)
  //     $('#line-' + lineObj.LineNumber + '-btn-CancelTransfer').hide();
  //     $('#line-' + lineObj.LineNumber + '-Transfer').hide();

  //     // Default to use Camera
  //     $('#line-' + lineObj.LineNumber + '-src-camera').prop('disabled', true);
  //     $('#line-' + lineObj.LineNumber + '-src-canvas').prop('disabled', false);
  //     $('#line-' + lineObj.LineNumber + '-src-desktop').prop('disabled', false);
  //     $('#line-' + lineObj.LineNumber + '-src-video').prop('disabled', false);
  //   } else {
  //     // Layout for Audio Call
  //     $('#line-' + lineObj.LineNumber + '-progress').hide();
  //     $('#line-' + lineObj.LineNumber + '-VideoCall').hide();
  //     $('#line-' + lineObj.LineNumber + '-AudioCall').show();
  //     // Call Control
  //     $('#line-' + lineObj.LineNumber + '-btn-Mute').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-Unmute').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-start-recording').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-stop-recording').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-Hold').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-Unhold').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-Transfer').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-CancelTransfer').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-Conference').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-CancelConference').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-ShowDtmf').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-settings').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-ShowCallStats').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-HideCallStats').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-ShowTimeline').show();
  //     $('#line-' + lineObj.LineNumber + '-btn-HideTimeline').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-present-src').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-expand').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-restore').hide();
  //     $('#line-' + lineObj.LineNumber + '-btn-End').show();
  //     // Show the Call
  //     $('#line-' + lineObj.LineNumber + '-ActiveCall').show();
  //   }

  //   UpdateBuddyList();
  //   updateLineScroll(lineObj.LineNumber);

  // Start Audio Monitoring
  //   lineObj.LocalSoundMeter = StartLocalAudioMediaMonitoring(lineObj.LineNumber, session);
  //   lineObj.RemoteSoundMeter = StartRemoteAudioMediaMonitoring(lineObj.LineNumber, session);

  //   $('#line-' + lineObj.LineNumber + '-msg').html(lang.call_in_progress);

  //   if (includeVideo && StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber); TODO #SH
}

// Outgoing INVITE
export function onInviteTrying(lineObj: LineType, response: IncomingResponse) {
  // $('#line-' + lineObj.LineNumber + '-msg').html(lang.trying);
}
export function onInviteProgress(lineObj: LineType, response: IncomingResponse) {
  const audioBlobs = useSipStore().audioBlobs;
  console.log('Call Progress:', response.message.statusCode);
  const session = lineObj.SipSession;
  if (!session) return;
  // Provisional 1xx
  // response.message.reasonPhrase
  if (response.message.statusCode == 180) {
    // $('#line-' + lineObj.LineNumber + '-msg').html(lang.ringing);

    let soundFile = audioBlobs.EarlyMedia_European;
    // if (UserLocale().indexOf('us') > -1) soundFile = audioBlobs.EarlyMedia_US; TODO #SH locale
    // if (UserLocale().indexOf('gb') > -1) soundFile = audioBlobs.EarlyMedia_UK;
    // if (UserLocale().indexOf('au') > -1) soundFile = audioBlobs.EarlyMedia_Australia;
    // if (UserLocale().indexOf('jp') > -1) soundFile = audioBlobs.EarlyMedia_Japan;

    // Play Early Media
    console.log('Audio:', soundFile.url);
    if (session.data.earlyMedia) {
      // There is already early media playing
      // onProgress can be called multiple times
      // Don't add it again
      console.log('Early Media already playing');
    } else {
      const earlyMedia = new Audio(soundFile.blob as string);
      earlyMedia.preload = 'auto';
      earlyMedia.loop = true;
      earlyMedia.oncanplaythrough = function (e) {
        if (typeof earlyMedia.sinkId !== 'undefined' && getAudioOutputID() != 'default') {
          earlyMedia
            .setSinkId(getAudioOutputID())
            .then(function () {
              console.log('Set sinkId to:', getAudioOutputID());
            })
            .catch(function (e) {
              console.warn('Failed not apply setSinkId.', e);
            });
        }
        earlyMedia
          .play()
          .then(function () {
            // Audio Is Playing
          })
          .catch(function (e) {
            console.warn('Unable to play audio file.', e);
          });
      };
      session.data.earlyMedia = earlyMedia;
    }
  } else if (response.message.statusCode === 183) {
    // $('#line-' + lineObj.LineNumber + '-msg').html(response.message.reasonPhrase + '...');
    // Add UI to allow DTMF
    // $('#line-' + lineObj.LineNumber + '-early-dtmf').show();
  } else {
    // 181 = Call is Being Forwarded
    // 182 = Call is queued (Busy server!)
    // 199 = Call is Terminated (Early Dialog)
    // $('#line-' + lineObj.LineNumber + '-msg').html(response.message.reasonPhrase + '...');
  }
}
export function onInviteRejected(lineObj: LineType, response: IncomingResponse) {
  console.log('INVITE Rejected:', response.message.reasonPhrase);
  const session = lineObj.SipSession;
  if (!session) return;
  session.data.terminateby = 'them';
  session.data.reasonCode = response.message.statusCode;
  session.data.reasonText = response.message.reasonPhrase;

  teardownSession(lineObj);
}
export function onInviteRedirected(lineObj: LineType, response: IncomingResponse) {
  console.log('onInviteRedirected', response);
  // Follow???
}

// // General Session delegates
export function onSessionReceivedBye(lineObj: LineType, response: Bye) {
  // They Ended the call
  if (!lineObj?.SipSession) return;
  lineObj.SipSession.data.terminateby = 'them';
  lineObj.SipSession.data.reasonCode = 16;
  lineObj.SipSession.data.reasonText = 'Normal Call clearing';

  response.accept(); // Send OK

  teardownSession(lineObj);
}

export function onSessionReinvited(lineObj: LineType, response: IncomingRequestMessage) {
  // This may be used to include video streams
  const sdp = response.body;
  const session = lineObj.SipSession;
  if (!session) return;
  // All the possible streams will get
  // Note, this will probably happen after the streams are added
  session.data.videoChannelNames = [];
  const videoSections = sdp.split('m=video');
  if (videoSections.length >= 1) {
    for (let m = 0; m < videoSections.length; m++) {
      if (videoSections[m].indexOf('a=mid:') > -1 && videoSections[m].indexOf('a=label:') > -1) {
        // We have a label for the media
        const lines = videoSections[m].split('\r\n');
        let channel = '';
        let mid = '';
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].indexOf('a=label:') == 0) {
            channel = lines[i].replace('a=label:', '');
          }
          if (lines[i].indexOf('a=mid:') == 0) {
            mid = lines[i].replace('a=mid:', '');
          }
        }
        session.data.videoChannelNames.push({ mid: mid, channel: channel });
      }
    }
    console.log('videoChannelNames:', session.data.videoChannelNames);
    // RedrawStage(lineObj.LineNumber, false); TODO #SH
  }
}
export function onSessionReceivedMessage(lineObj: LineType, response: Message) {
  const messageType =
    response.request.headers['Content-Type'].length >= 1
      ? response.request.headers['Content-Type'][0].parsed
      : 'Unknown';
  if (messageType.indexOf('application/x-asterisk-confbridge-event') > -1) {
    // Conference Events JSON
    const msgJson = JSON.parse(response.request.body) as {
      type: string;
      bridge: {
        id: string;
        name: string;
        creationtime: string;
        video_mode: string;
      };
      channels: Array<any>;
    };

    const session = lineObj.SipSession;
    if (!session) return;
    if (!session.data) return;
    if (!session.data.ConfbridgeChannels) session.data.ConfbridgeChannels = [];
    if (!session.data.ConfbridgeEvents) session.data.ConfbridgeEvents = [];

    if (msgJson.type == 'ConfbridgeStart') {
      console.log('ConfbridgeStart!');
    } else if (msgJson.type == 'ConfbridgeWelcome') {
      console.log('Welcome to the Asterisk Conference');
      console.log('Bridge ID:', msgJson.bridge.id);
      console.log('Bridge Name:', msgJson.bridge.name);
      console.log('Created at:', msgJson.bridge.creationtime);
      console.log('Video Mode:', msgJson.bridge.video_mode);

      session.data.ConfbridgeChannels = msgJson.channels; // Write over this
      session.data.ConfbridgeChannels.forEach(function (chan) {
        // The mute and unmute status doesn't appear to be a realtime state, only what the
        // startmuted= setting of the default profile is.
        console.log(
          chan.caller.name,
          'Is in the conference. Muted:',
          chan.muted,
          'Admin:',
          chan.admin,
        );
      });
    } else if (msgJson.type == 'ConfbridgeJoin') {
      msgJson.channels.forEach(function (chan) {
        let found = false;
        session.data.ConfbridgeChannels?.forEach(function (existingChan) {
          if (existingChan.id == chan.id) found = true;
        });
        if (!found) {
          session.data.ConfbridgeChannels?.push(chan);
          session.data.ConfbridgeEvents?.push({
            event: chan.caller.name + ' (' + chan.caller.number + ') joined the conference',
            eventTime: utcDateNow(),
          });
          console.log(chan.caller.name, 'Joined the conference. Muted: ', chan.muted);
        }
      });
    } else if (msgJson.type == 'ConfbridgeLeave') {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels?.forEach(function (existingChan, i) {
          if (existingChan.id == chan.id) {
            session.data.ConfbridgeChannels?.splice(i, 1);
            console.log(chan.caller.name, 'Left the conference');
            session.data.ConfbridgeEvents?.push({
              event: chan.caller.name + ' (' + chan.caller.number + ') left the conference',
              eventTime: utcDateNow(),
            });
          }
        });
      });
    } else if (msgJson.type == 'ConfbridgeTalking') {
      const videoContainer = false; //$('#line-' + lineObj.LineNumber + '-remote-videos'); TODO #SH
      if (videoContainer) {
        //TODO #SH
        // msgJson.channels.forEach(function (chan) {
        //   videoContainer.find('video').each(function () {
        //     if (this.srcObject.channel && this.srcObject.channel == chan.id) {
        //       if (chan.talking_status == 'on') {
        //         console.log(chan.caller.name, 'is talking.');
        //         this.srcObject.isTalking = true;
        //         $(this).css('border', '1px solid red');
        //       } else {
        //         console.log(chan.caller.name, 'stopped talking.');
        //         this.srcObject.isTalking = false;
        //         $(this).css('border', '1px solid transparent');
        //       }
        //     }
        //   });
        // });
      }
    } else if (msgJson.type == 'ConfbridgeMute') {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels?.forEach(function (existingChan) {
          if (existingChan.id == chan.id) {
            console.log(existingChan.caller.name, 'is now muted');
            existingChan.muted = true;
          }
        });
      });
      //   RedrawStage(lineObj.LineNumber, false); TODO #SH
    } else if (msgJson.type == 'ConfbridgeUnmute') {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels?.forEach(function (existingChan) {
          if (existingChan.id == chan.id) {
            console.log(existingChan.caller.name, 'is now unmuted');
            existingChan.muted = false;
          }
        });
      });
      //   RedrawStage(lineObj.LineNumber, false); TODO #SH
    } else if (msgJson.type == 'ConfbridgeEnd') {
      console.log('The Asterisk Conference has ended, bye!');
    } else {
      console.warn('Unknown Asterisk Conference Event:', msgJson.type, msgJson);
    }
    // RefreshLineActivity(lineObj.LineNumber); TODO #SH
    response.accept();
  } else if (messageType.indexOf('application/x-myphone-confbridge-chat') > -1) {
    console.log('x-myphone-confbridge-chat', response);

    response.accept();
  } else {
    console.warn('Unknown message type');
    response.reject();
  }
}

export function onSessionDescriptionHandlerCreated(
  lineObj: LineType,
  sdh: SipSessionDescriptionHandler,
  provisional: boolean,
  includeVideo?: boolean,
) {
  if (sdh) {
    if (sdh.peerConnection) {
      // console.log(sdh);
      sdh.peerConnection.ontrack = function (event) {
        console.log(event);
        onTrackAddedEvent(lineObj, includeVideo);
      };
      // sdh.peerConnectionDelegate = {
      //   ontrack: function (event: any) {
      //     console.log(event);
      //     onTrackAddedEvent(lineObj, includeVideo);
      //   },
      // };
    } else {
      console.warn('onSessionDescriptionHandler fired without a peerConnection');
    }
  } else {
    console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
  }
}
function onTrackAddedEvent(lineObj: LineType, includeVideo?: boolean) {
  const { updateLine } = getSipStore();
  // Gets remote tracks
  const session = lineObj.SipSession;
  if (!session) return;
  // TODO: look at detecting video, so that UI switches to audio/video automatically.

  const pc = session.sessionDescriptionHandler.peerConnection;

  // Create MediaStreams for audio and video
  const remoteAudioStream = new MediaStream();
  const remoteVideoStream = new MediaStream();

  // Add tracks to MediaStreams
  pc.getTransceivers().forEach((transceiver) => {
    const receiver = transceiver.receiver;
    if (receiver.track) {
      if (receiver.track.kind === 'audio') {
        console.log('Adding Remote Audio Track');
        remoteAudioStream.addTrack(receiver.track);
      }
      if (includeVideo && receiver.track.kind === 'video') {
        if (transceiver.mid) {
          console.log('Adding Remote Video Track', receiver.track.readyState);
          (receiver.track as any).mid = transceiver.mid;
          remoteVideoStream.addTrack(receiver.track);
        }
      }
    }
  });

  // Attach Audio Stream
  if (remoteAudioStream.getAudioTracks().length > 0) {
    const remoteAudio = document.getElementById(
      `line-${lineObj.LineNumber}-remoteAudio`,
    ) as HTMLAudioElement;
    remoteAudio.setAttribute('id', `line-${lineObj.LineNumber}-remoteAudio`);
    remoteAudio.srcObject = remoteAudioStream;

    remoteAudio.onloadedmetadata = () => {
      if (typeof remoteAudio.sinkId !== 'undefined') {
        remoteAudio
          .setSinkId(getAudioOutputID())
          .then(() => console.log('sinkId applied:', getAudioOutputID()))
          .catch((e) => console.warn('Error using setSinkId:', e));
      }
      remoteAudio.play();
    };
  }

  // Attach Video Stream
  if (includeVideo && remoteVideoStream.getVideoTracks().length > 0) {
    const videoContainerId = `line-${lineObj.LineNumber}-remoteVideos`;
    let videoContainer = document.getElementById(videoContainerId);

    if (!videoContainer) return;
    // Clear existing videos
    videoContainer.innerHTML = '';

    remoteVideoStream.getVideoTracks().forEach((remoteVideoStreamTrack: any, index) => {
      const thisRemoteVideoStream = new MediaStream() as SipMediaStream;
      thisRemoteVideoStream.trackId = remoteVideoStreamTrack.id;
      thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
      thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);
      const videoElement = document.createElement('video');
      videoElement.id = `line-${lineObj.LineNumber}-video-${index}`;
      videoElement.srcObject = thisRemoteVideoStream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true; // Ensure autoplay works in browsers
      videoElement.className = 'video-element'; // Add styling class

      videoElement.onloadedmetadata = () => {
        videoElement.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      };

      videoContainer.appendChild(videoElement);
    });
  } else {
    console.warn('No Video Tracks Found');
  }

  updateLine(lineObj);
}
