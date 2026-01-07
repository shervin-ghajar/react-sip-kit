import { SipConfigs } from '../../configs/types';
import { sendMessageSession } from '../../methods/session';
import { SendMessageRequestBody, SendMessageSessionEnum } from '../../methods/session/types';
import { getSipStore, getSipUsernameConfigs } from '../../store';
import { LineType, SipSessionDescriptionHandler, SipSessionType } from '../../store/types';
import { CallbackFunction } from '../../types';
import { utcDateNow } from '../../utils';
import { SipMediaStream } from './types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';

export const sessionEvents = ({ configKey }: { configKey: SipConfigs['key'] }) => {
  const updateLine = getSipStore().updateLine;

  function onInviteCancel(
    lineObj: LineType,
    response: IncomingRequestMessage,
    callback?: CallbackFunction<any>,
  ) {
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
          (items[0].trim() === 'sip' || items[0].trim() === 'q.850') &&
          items[1].includes('cause') &&
          cause.includes('call completed elsewhere')
        ) {
          temp_cause = parseInt(items[1].substring(items[1].indexOf('=') + 1).trim());
          // No sample provided for "token"
          break;
        }
      }
    }
    const session = lineObj.sipSession;
    if (!session) return;
    session.data.terminateBy = 'them';
    session.data.reasonCode = temp_cause;
    if (temp_cause === 0) {
      session.data.reasonText = 'Call Cancelled';
      console.log('Call canceled by remote party before answer!');
    } else {
      session.data.reasonText = 'Call completed elsewhere';
      console.log('Call completed elsewhere before answer');
    }

    session.dispose().catch(function (error) {
      console.log('Failed to dispose the cancel dialog', error);
    });

    callback?.();
  }
  // // Both Incoming an outgoing INVITE
  async function onInviteAccepted(
    lineObj: LineType,
    videoEnabled: boolean,
    response?: IncomingResponse,
  ) {
    // Call in progress
    const session = lineObj.sipSession;
    console.log('onInviteAccepted', { lineObj, session });
    if (!session) return;
    if (session.data.earlyMedia) {
      session.data.earlyMedia.pause();
      session.data.earlyMedia.removeAttribute('src');
      session.data.earlyMedia.load();
      session.data.earlyMedia = null;
    }

    const startTime = utcDateNow();
    session.data.startTime = startTime;

    session.data.started = true;
    session.initiateLocalMediaStreams = async ({
      videoEnabled: isVideoEnabled = videoEnabled,
      pc = getSipStore().getSessionByLineKey(lineObj.lineKey)?.sessionDescriptionHandler
        .peerConnection ?? session.sessionDescriptionHandler.peerConnection,
      configs = getSipUsernameConfigs(configKey),
    } = {}) => {
      try {
        const media = configs?.media;
        const line = getSipStore().findLineByLineKey(lineObj.lineKey);
        const screenShareEnabled =
          line?.sipSession?.data.localMediaStreamStatus?.screenShareEnabled;

        let localStream: MediaStream;

        if (screenShareEnabled) {
          // === screen share already in place, preserve it ===
          localStream = new MediaStream();
          pc.getSenders().forEach(function (sender) {
            if (sender.track && sender.track.kind === 'video') {
              localStream.addTrack(sender.track);
            }
          });
        } else {
          // === normal camera/audio ===
          const constraints: MediaStreamConstraints = {
            audio: media?.audioInputDeviceId
              ? media.audioInputDeviceId !== 'default'
                ? { deviceId: { exact: media.audioInputDeviceId } }
                : true
              : false,
            video:
              isVideoEnabled && media?.videoInputDeviceId
                ? media.videoInputDeviceId !== 'default'
                  ? { deviceId: { exact: media.videoInputDeviceId } }
                  : true
                : false,
          };

          localStream = await navigator.mediaDevices.getUserMedia(constraints);
        }

        // Replace existing audio/video tracks in PeerConnection
        localStream.getTracks().forEach((track) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            pc.addTrack(track, localStream);
          }
        });

        // Update local <video> preview
        if (isVideoEnabled) {
          const localVideo = document.getElementById(
            `line-${lineObj.lineKey}-localVideo`,
          ) as HTMLVideoElement;

          if (localVideo) {
            localVideo.srcObject = new MediaStream(localStream.getVideoTracks());
            await localVideo.play().catch(() => {
              console.warn('Autoplay prevented for local video element');
            });
          }
        }

        updateLine(lineObj);
      } catch (err) {
        console.error('initiateLocalMediaStreams failed:', err);
      }
    };
    session.initiateLocalMediaStreams();
    updateLine(lineObj);
  }

  // Outgoing INVITE
  function onInviteTrying(lineObj: LineType, response: IncomingResponse) {
    // $('#line-' + lineObj.LineKey + '-msg').html(lang.trying);
  }
  function onInviteProgress(lineObj: LineType, response: IncomingResponse) {
    console.log('Call Progress:', response.message.statusCode);
    const session = lineObj.sipSession;
    if (!session) return;
    // Provisional 1xx
    // response.message.reasonPhrase
    if (response.message.statusCode === 180) {
    } else if (response.message.statusCode === 183) {
      // $('#line-' + lineObj.LineKey + '-msg').html(response.message.reasonPhrase + '...');
      // Add UI to allow DTMF
      // $('#line-' + lineObj.LineKey + '-early-dtmf').show();
    } else {
      // 181 = Call is Being Forwarded
      // 182 = Call is queued (Busy server!)
      // 199 = Call is Terminated (Early Dialog)
      // $('#line-' + lineObj.LineKey + '-msg').html(response.message.reasonPhrase + '...');
    }
    updateLine(lineObj);
  }
  function onInviteRejected(
    lineObj: LineType,
    response: IncomingResponse,
    callback?: CallbackFunction<any>,
  ) {
    console.log('INVITE Rejected:', response.message.reasonPhrase);
    const session = lineObj.sipSession;
    if (!session) return;
    session.data.terminateBy = 'them';
    session.data.reasonCode = response.message.statusCode;
    session.data.reasonText = response.message.reasonPhrase;

    callback?.();
  }
  function onInviteRedirected(lineObj: LineType, response: IncomingResponse) {
    console.log('onInviteRedirected', response);
    // Follow???
  }

  // // General Session delegates
  function onSessionReceivedBye(
    lineObj: LineType,
    response: Bye,
    callback?: CallbackFunction<any>,
  ) {
    // They Ended the call
    console.log('onSessionReceivedBye', { lineObj });
    if (!lineObj?.sipSession) return;
    lineObj.sipSession.data.terminateBy = 'them';
    lineObj.sipSession.data.reasonCode = 16;
    lineObj.sipSession.data.reasonText = 'Normal Call clearing';

    response.accept(); // Send OK

    callback?.();
  }

  function onSessionReinvited(lineObj: LineType, response: IncomingRequestMessage) {
    // This may be used to include video streams
    const sdp = response.body;
    const session = lineObj.sipSession;
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
    }
  }
  function onSessionReceivedMessage(lineObj: LineType, response: Message) {
    try {
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

        const session = lineObj.sipSession;
        if (!session) return;
        if (!session.data) return;
        if (!session.data.confBridgeChannels) session.data.confBridgeChannels = [];
        if (!session.data.confBridgeEvents) session.data.confBridgeEvents = [];

        if (msgJson.type == 'ConfbridgeStart') {
          console.log('ConfbridgeStart!');
        } else if (msgJson.type == 'ConfbridgeWelcome') {
          console.log('Welcome to the Asterisk Conference');
          console.log('Bridge ID:', msgJson.bridge.id);
          console.log('Bridge Name:', msgJson.bridge.name);
          console.log('Created at:', msgJson.bridge.creationtime);
          console.log('Video Mode:', msgJson.bridge.video_mode);

          session.data.confBridgeChannels = msgJson.channels; // Write over this
          session.data.confBridgeChannels.forEach(function (chan) {
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
            session.data.confBridgeChannels?.forEach(function (existingChan) {
              if (existingChan.id == chan.id) found = true;
            });
            if (!found) {
              session.data.confBridgeChannels?.push(chan);
              session.data.confBridgeEvents?.push({
                event: chan.caller.name + ' (' + chan.caller.number + ') joined the conference',
                eventTime: utcDateNow(),
              });
              console.log(chan.caller.name, 'Joined the conference. Muted: ', chan.muted);
            }
          });
        } else if (msgJson.type == 'ConfbridgeLeave') {
          msgJson.channels.forEach(function (chan) {
            session.data.confBridgeChannels?.forEach(function (existingChan, i) {
              if (existingChan.id == chan.id) {
                session.data.confBridgeChannels?.splice(i, 1);
                console.log(chan.caller.name, 'Left the conference');
                session.data.confBridgeEvents?.push({
                  event: chan.caller.name + ' (' + chan.caller.number + ') left the conference',
                  eventTime: utcDateNow(),
                });
              }
            });
          });
        } else if (msgJson.type === 'ConfbridgeTalking') {
          const videoContainer = false; //$('#line-' + lineObj.LineKey + '-remote-videos'); TODO #SH
          if (videoContainer) {
            //TODO #SH
          }
        } else if (msgJson.type == 'ConfbridgeMute') {
          msgJson.channels.forEach(function (chan) {
            session.data.confBridgeChannels?.forEach(function (existingChan) {
              if (existingChan.id == chan.id) {
                console.log(existingChan.caller.name, 'is now muted');
                existingChan.muted = true;
              }
            });
          });
          //   RedrawStage(lineObj.LineKey, false); TODO #SH
        } else if (msgJson.type === 'ConfbridgeUnmute') {
          msgJson.channels.forEach(function (chan) {
            session.data.confBridgeChannels?.forEach(function (existingChan) {
              if (existingChan.id == chan.id) {
                console.log(existingChan.caller.name, 'is now unmuted');
                existingChan.muted = false;
              }
            });
          });
        } else if (msgJson.type == 'ConfbridgeEnd') {
          console.log('The Asterisk Conference has ended, bye!');
        } else {
          console.warn('Unknown Asterisk Conference Event:', msgJson.type, msgJson);
        }
        response.accept();
      } else if (messageType.indexOf('application/x-myphone-confbridge-chat') > -1) {
        console.log('x-myphone-confbridge-chat', response);

        response.accept();
      } else if (messageType.indexOf('text/plain') > -1) {
        if (!lineObj?.sipSession?.data.remoteMediaStreamStatus) return;
        const body = JSON.parse(response.request.body);
        switch (body.type as SendMessageSessionEnum) {
          case SendMessageSessionEnum.SOUND_TOGGLE:
            lineObj.sipSession.data.remoteMediaStreamStatus.soundEnabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.SOUND_TOGGLE>
            ).value;
            break;
          case SendMessageSessionEnum.VIDEO_TOGGLE:
            lineObj.sipSession.data.remoteMediaStreamStatus.videoEnabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.VIDEO_TOGGLE>
            ).value;
            sendMessageSession(lineObj.sipSession, SendMessageSessionEnum.VIDEO_TOGGLE_ACK, '');
            break;
          case SendMessageSessionEnum.SCREEN_SHARE_TOGGLE:
            lineObj.sipSession.data.remoteMediaStreamStatus.screenShareEnabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.SCREEN_SHARE_TOGGLE>
            ).value;
            break;
          case SendMessageSessionEnum.VIDEO_TOGGLE_ACK:
            lineObj.sipSession.data.videoAckReceived = true;
            break;
          default:
            response.reject();
            break;
        }
        response.accept();
      } else {
        console.warn('Unknown message type');
        response.reject();
      }
      updateLine(lineObj);
    } catch (error) {
      console.error('onSessionReceiveMessage Error', error);
    }
  }
  /* -------------------------------------------------------------------------- */
  function onSessionDescriptionHandlerCreated(
    lineObj: LineType,
    sdh: SipSessionDescriptionHandler,
    provisional: boolean,
    includeVideo?: boolean,
  ) {
    if (sdh) {
      console.log('onSessionDescriptionHandlerCreated', sdh.peerConnection);
      if (sdh.peerConnection) {
        sdh.peerConnection.ontrack = function (event) {
          onTrackAddedEvent(lineObj, includeVideo);
        };
      } else {
        console.warn('onSessionDescriptionHandler fired without a peerConnection');
      }
    } else {
      console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
    }
  }

  async function onTrackAddedEvent(lineObj: LineType, videoEnabled?: boolean) {
    // Gets remote tracks
    const session = lineObj.sipSession;
    if (!session) return;

    session.initiateRemoteMediaStreams = ({
      videoEnabled: isVideoEnabled = videoEnabled,
      pc = getSipStore().getSessionByLineKey(lineObj.lineKey)?.sessionDescriptionHandler
        .peerConnection ?? session.sessionDescriptionHandler.peerConnection,
      configs = getSipUsernameConfigs(configKey),
    } = {}) => {
      const media = configs?.media;

      const remoteAudioTracks = new Map<string, MediaStream>();
      const remoteVideoTracks = new Map<string, MediaStream>();
      const audioContainerId = `line-${lineObj.lineKey}-remoteAudios`;
      const videoContainerId = `line-${lineObj.lineKey}-remoteVideos`;

      const audioContainer = document.getElementById(audioContainerId);
      const videoContainer = document.getElementById(videoContainerId);

      console.log('initiateRemoteMediaStreams', {
        isVideoEnabled,
        pc,
      });

      // Gather all remote tracks
      pc.getTransceivers().forEach((transceiver) => {
        const track = transceiver.receiver?.track;
        if (!track) return;

        const stream = new MediaStream([track]);

        if (track.kind === 'audio') {
          remoteAudioTracks.set(track.id, stream);
        }

        if (isVideoEnabled && track.kind === 'video') {
          (track as any).mid = transceiver.mid;
          console.log(222, 'trackTest', transceiver);
          remoteVideoTracks.set(track.id, stream);
        }
      });

      // Inject all remote audio tracks
      if (audioContainer) {
        audioContainer.innerHTML = '';

        remoteAudioTracks.forEach((stream, trackId) => {
          const audio = document.createElement('audio');
          audio.id = `line-${lineObj.lineKey}-audio-${trackId}`;
          audio.autoplay = true;
          audio.srcObject = stream;
          audio.controls = false;

          audio.onloadedmetadata = () => {
            if (typeof audio.sinkId !== 'undefined' && media?.audioOutputDeviceId) {
              audio
                .setSinkId(media?.audioOutputDeviceId)
                .then(() => console.log('sinkId set:', media?.audioOutputDeviceId))
                .catch((e) => console.warn('setSinkId error:', e));
            }
            audio.play().catch((err) => console.error('Audio play error:', err));
          };

          audioContainer.appendChild(audio);
        });
      } else {
        console.warn(`Remote audio container not found: ${audioContainerId}`);
      }

      // Inject all remote video tracks
      if (videoContainer) {
        videoContainer.innerHTML = '';
        console.log({ remoteVideoTracks });
        remoteVideoTracks.forEach((stream, trackId) => {
          const video = document.createElement('video');
          video.id = `line-${lineObj.lineKey}-video-${trackId}`;
          video.srcObject = stream;
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;

          video.onloadedmetadata = () => {
            if (typeof video.sinkId !== 'undefined' && media?.videoInputDeviceId) {
              video
                .setSinkId(media?.videoInputDeviceId)
                .then(() => console.log('sinkId set:', media?.videoInputDeviceId))
                .catch((e) => console.warn('setSinkId error:', e));
            }
            video.play().catch((err) => console.error('Video play error:', err));
          };

          videoContainer.appendChild(video);
        });
      } else {
        console.warn(`Remote video container not found: ${videoContainerId}`);
      }

      updateLine(lineObj);
    };
    session.initiateRemoteMediaStreams();
    updateLine(lineObj);
  }

  function onTransferSessionDescriptionHandlerCreated(
    lineObj: LineType,
    session: SipSessionType,
    sdh: SipSessionDescriptionHandler,
    includeVideo?: boolean,
  ) {
    if (sdh) {
      if (sdh.peerConnection) {
        sdh.peerConnection.ontrack = function () {
          const pc = sdh.peerConnection;

          // Gets Remote Audio Track (Local audio is setup via initial GUM)
          const remoteAudioStream = new MediaStream();
          const remoteVideoStream = new MediaStream();

          // Add tracks to MediaStreams
          pc.getReceivers().forEach((receiver) => {
            if (receiver.track) {
              if (receiver.track.kind === 'audio') {
                console.log('Adding Remote Audio Track');
                remoteAudioStream.addTrack(receiver.track);
              }
              if (includeVideo && receiver.track.kind === 'video') {
                console.log('Adding Remote Video Track', receiver.track.readyState);
                remoteVideoStream.addTrack(receiver.track);
              }
            }
          });

          // Attach Audio Stream
          const remoteAudio = document.createElement('audio');
          remoteAudio.setAttribute('id', `line-${lineObj.lineKey}-transfer-remoteAudio`);
          remoteAudio.srcObject = remoteAudioStream;
          remoteAudio.onloadedmetadata = function () {
            if (typeof remoteAudio.sinkId !== 'undefined' && session?.data?.audioOutputDevice) {
              remoteAudio
                .setSinkId(session.data.audioOutputDevice)
                .then(function () {
                  console.log('sinkId applied: ' + session.data.audioOutputDevice);
                })
                .catch(function (e) {
                  console.warn('Error using setSinkId: ', e);
                });
            }
            remoteAudio.play();
          };

          // Attach Video Stream
          if (includeVideo && remoteVideoStream.getVideoTracks().length > 0) {
            const remoteVideo = document.createElement('video');
            remoteVideoStream.getVideoTracks().forEach((remoteVideoStreamTrack: any, index) => {
              const thisRemoteVideoStream = new MediaStream() as SipMediaStream;
              thisRemoteVideoStream.trackId = remoteVideoStreamTrack.id;
              thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
              thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);
              remoteVideo.id = `line-${lineObj.lineKey}-video-${index}`;
              remoteVideo.srcObject = thisRemoteVideoStream;
              remoteVideo.autoplay = true;
              remoteVideo.playsInline = true;
              remoteVideo.muted = true; // Ensure autoplay works in browsers
              remoteVideo.className = 'video-element'; // Add styling class

              remoteVideo.onloadedmetadata = () => {
                remoteVideo.play().catch((error) => {
                  console.error('Error playing video:', error);
                });
              };
            });
          } else {
            console.warn('No Video Tracks Found');
          }
        };
      } else {
        console.warn('onSessionDescriptionHandler fired without a peerConnection');
      }
    } else {
      console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
    }
  }

  return {
    onInviteCancel,
    onInviteAccepted,
    onInviteTrying,
    onInviteProgress,
    onInviteRejected,
    onInviteRedirected,
    onSessionReceivedBye,
    onSessionReinvited,
    onSessionReceivedMessage,
    onSessionDescriptionHandlerCreated,
    onTrackAddedEvent,
    onTransferSessionDescriptionHandlerCreated,
  };
};
