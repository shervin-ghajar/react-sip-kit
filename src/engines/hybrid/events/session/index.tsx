import { RtcConfig } from '../../../../configs/types';
import { sendMessageSession, teardownSession } from '../../methods/session';
import { SendMessageRequestBody, SendMessageSessionEnum } from '../../methods/session/types';
import { getRtcStore, getRtcUsernameConfigs } from '../../../../store';
import {
  LineDataType,
} from '../../../../store/types';
import { CallbackFunction } from '../../../../types';
import { utcDateNow } from '../../../../utils';
import { SipLineType, SipSessionDescriptionHandler, SipSessionType } from '../../types';
import { SipMediaStream } from './types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';

export const sessionEvents = ({ configKey }: { configKey: RtcConfig['key'] }) => {
  const updateLine = getRtcStore().updateLine;

  function onInviteCancel(
    lineObj: SipLineType,
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
    const session = lineObj.session;
    if (!session) return;
    lineObj.data.terminateBy = 'them';
    lineObj.data.reasonCode = temp_cause;
    if (temp_cause === 0) {
      lineObj.data.reasonText = 'Call Cancelled';
      console.log('Call canceled by remote party before answer!');
    } else {
      lineObj.data.reasonText = 'Call completed elsewhere';
      console.log('Call completed elsewhere before answer');
    }

    session.dispose().catch(function (error) {
      console.log('Failed to dispose the cancel dialog', error);
    });

    callback?.();
  }
  // // Both Incoming an outgoing INVITE
  async function onInviteAccepted(lineObj: SipLineType, videoEnabled: boolean) {
    // Call in progress
    const defaultSession = lineObj.session;
    console.log('onInviteAccepted', { lineObj, session: defaultSession });
    if (!defaultSession) return;

    const defaultPC = defaultSession.sessionDescriptionHandler.peerConnection;

    defaultSession.initiateLocalMediaStreams = async function ({
      videoEnabled: isVideoEnabled = videoEnabled,
      configs = getRtcUsernameConfigs(configKey),
      type = undefined,
      stopStream = true,
    } = {}) {
      const session = this;
      const lineData = getRtcStore().getLineDataByLineKey(lineObj?.lineKey!) ?? lineObj.data;
      const pc = session.sessionDescriptionHandler.peerConnection;
      if (!session || !lineData) return;

      if (!pc) return;


      const videoSourceTrack = lineData.localMediaStreamData.video.track
      const audioSourceTrack = lineData.localMediaStreamData.audio.track
      const screenSourceTrack = lineData.localMediaStreamData.screen.track

      const media = configs?.media;

      // ===============================
      // Determine desired states
      // ===============================
      const soundEnabled = lineData.localMediaStreamData.audio.enabled ?? true;
      const videoEnabled = lineData.localMediaStreamData.video.enabled ?? isVideoEnabled;
      const useScreen = !!lineData.localMediaStreamData.screen.enabled;

      let newAudioTrack: LineDataType['localMediaStreamData']['audio']['track'] = audioSourceTrack;
      let newVideoTrack: LineDataType['localMediaStreamData']['video']['track'] = useScreen
        ? screenSourceTrack
        : videoSourceTrack;

      console.log('initiateLocalMediaStreams 1', { stopStream });

      const initiateLocalAudioStream = async function () {
        console.log('initiateLocalMediaStreams 2');
        // ===============================
        // AUDIO
        // ===============================
        if (!newAudioTrack || newAudioTrack.readyState === 'ended') {
          try {
            const audioConstraints: MediaStreamConstraints['audio'] =
              media?.audioInputDeviceId === null
                ? true
                : media?.audioInputDeviceId && media.audioInputDeviceId !== 'default'
                  ? { deviceId: { exact: media.audioInputDeviceId } }
                  : true;
            console.log('initiateLocalMediaStreams 3');

            let audioStream = await navigator.mediaDevices.getUserMedia({
              audio: audioConstraints,
              video: false,
            });

            newAudioTrack = audioStream.getAudioTracks()[0];
            lineData.localMediaStreamData.audio.track = newAudioTrack;
          } catch (err) {
            console.error('Failed to get audio track', err);
          }
        }

        if (newAudioTrack) {
          console.log('initiateLocalMediaStreams 4');
          const sender = pc.getSenders().find((s) => s.track?.kind === 'audio');

          // Apply your previous logic for enabling
          newAudioTrack.enabled = !!(soundEnabled ?? media?.audioInputDeviceId);
          if (sender) sender.replaceTrack(newAudioTrack);
          else pc.addTrack(newAudioTrack);
          stopStream && sender?.track?.stop();
        }

        // ===============================
        // Update session flags
        // ===============================
        lineData.localMediaStreamData.audio.enabled = !!soundEnabled;
      };

      const initiateLocalVideoStream = async function () {
        // ===============================
        // VIDEO
        // ===============================
        console.log('initiateLocalMediaStreams 5', { videoEnabled }, media?.videoInputDeviceId);

        console.log({ videoEnabled });
        if (!newVideoTrack || newVideoTrack.readyState === 'ended') {
          if (!useScreen && (videoEnabled || media?.videoInputDeviceId === null)) {
            try {
              const videoConstraints: MediaStreamConstraints['video'] =
                media?.videoInputDeviceId === null && isVideoEnabled
                  ? true
                  : media?.videoInputDeviceId && media.videoInputDeviceId !== 'default'
                    ? { deviceId: { exact: media.videoInputDeviceId } }
                    : isVideoEnabled;
              console.log({ videoConstraints });
              console.log('initiateLocalMediaStreams 6');

              let cameraStream = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
              });
              newVideoTrack = cameraStream.getVideoTracks()[0];
              lineData.localMediaStreamData.video.track = newVideoTrack;
            } catch (err) {
              console.error('Failed to get camera track', err);
              newVideoTrack = undefined;
            }
          }
        }

        if (newVideoTrack) {
          if (newVideoTrack.readyState === 'live') {
            console.log('initiateLocalMediaStreams 7', { newVideoTrack, stopStream });

            const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
            // Enable logic: screen OR videoEnabled OR deviceId is null
            newVideoTrack.enabled = !!((useScreen || videoEnabled) ?? media?.videoInputDeviceId);

            if (sender) sender.replaceTrack(newVideoTrack);
            else pc.addTrack(newVideoTrack);
            stopStream && newVideoTrack.enabled && sender?.track?.stop();
          }
        }

        // ===============================
        // Local preview
        // ===============================
        const localVideoEl = document.getElementById(
          `line-${lineObj.lineKey}-localVideo`,
        ) as HTMLVideoElement;
        if (localVideoEl) {
          if (newVideoTrack) {
            localVideoEl.srcObject = new MediaStream([newVideoTrack]);
            localVideoEl.autoplay = true;
            localVideoEl.muted = true;
            localVideoEl.playsInline = true;
            await localVideoEl
              .play()
              .catch(() => console.warn('Autoplay prevented for local video element'));
          } else {
            localVideoEl.srcObject = null;
          }
        }
        // ===============================
        // Update session flags
        // ===============================
        lineData.localMediaStreamData.video.enabled = !!videoEnabled;
      };
      if (type) {
        type === 'audio' && (await initiateLocalAudioStream());
        type === 'video' && (await initiateLocalVideoStream());
      } else {
        await initiateLocalAudioStream();
        await initiateLocalVideoStream();
      }
      updateLine({ ...lineObj, data: lineData, session: session } as SipLineType);
    };
    // ------------------------------------------------
    // Wait for ICE before starting media
    // ------------------------------------------------
    const waitForIce = () =>
      new Promise<void>((resolve) => {
        const isIceReady = () =>
          defaultPC.iceConnectionState === 'connected' ||
          defaultPC.iceConnectionState === 'completed';

        if (isIceReady()) {
          resolve();
          return;
        }

        const handler = () => {
          if (isIceReady()) {
            defaultPC.removeEventListener('iceconnectionstatechange', handler);
            resolve();
          }
        };

        defaultPC.addEventListener('iceconnectionstatechange', handler);
      });

    await waitForIce();

    const startTime = utcDateNow();

    lineObj.data.startTime = startTime;
    lineObj.data.started = true;

    await defaultSession.initiateLocalMediaStreams();

    updateLine(lineObj);
  }

  // Outgoing INVITE
  function onInviteTrying(lineObj: SipLineType, response: IncomingResponse) {
    // $('#line-' + lineObj.LineKey + '-msg').html(lang.trying);
  }
  function onInviteProgress(lineObj: SipLineType, response: IncomingResponse) {
    console.log('Call Progress:', response.message.statusCode);
    const session = lineObj.session;
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
    lineObj: SipLineType,
    response: IncomingResponse,
    callback?: CallbackFunction<any>,
  ) {
    console.log('INVITE Rejected:', response.message.reasonPhrase);
    const lineData = lineObj.data;
    if (!lineData) return;
    lineData.terminateBy = 'them';
    lineData.reasonCode = response.message.statusCode ?? 0;
    lineData.reasonText = response.message.reasonPhrase ?? '';

    callback?.();
  }
  function onInviteRedirected(lineObj: SipLineType, response: IncomingResponse) {
    console.log('onInviteRedirected', response);
    // Follow???
  }

  // // General Session delegates
  function onSessionReceivedBye(
    lineObj: SipLineType,
    response: Bye,
    callback?: CallbackFunction<any>,
  ) {
    // They Ended the call
    console.log('onSessionReceivedBye', { lineObj });
    const lineData = lineObj.data;
    if (!lineData) return;
    lineData.terminateBy = 'them';
    lineData.reasonCode = 16;
    lineData.reasonText = 'Normal Call clearing';

    response.accept(); // Send OK

    callback?.();
  }

  function onSessionReinvited(lineObj: SipLineType, response: IncomingRequestMessage) {
    // This may be used to include video streams
    const sdp = response.body;
    const session = lineObj.session;
    const lineData = lineObj.data;
    if (!lineData) return;
    // All the possible streams will get
    // Note, this will probably happen after the streams are added
    lineData.videoChannelNames = [];
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
          lineData.videoChannelNames.push({ mid: mid, channel: channel });
        }
      }
      console.log('videoChannelNames:', lineData.videoChannelNames);
    }
  }
  function onSessionReceivedMessage(lineObj: SipLineType, response: Message) {
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

        const session = lineObj.session;
        if (!session) return;
        if (!session.data) return;
        if (!lineObj.data?.confBridgeChannels) lineObj.data.confBridgeChannels = [];
        if (!lineObj.data?.confBridgeEvents) lineObj.data.confBridgeEvents = [];

        if (msgJson.type == 'ConfbridgeStart') {
          console.log('ConfbridgeStart!');
        } else if (msgJson.type == 'ConfbridgeWelcome') {
          console.log('Welcome to the Asterisk Conference');
          console.log('Bridge ID:', msgJson.bridge.id);
          console.log('Bridge Name:', msgJson.bridge.name);
          console.log('Created at:', msgJson.bridge.creationtime);
          console.log('Video Mode:', msgJson.bridge.video_mode);

          lineObj.data.confBridgeChannels = msgJson.channels; // Write over this
          lineObj.data.confBridgeChannels.forEach(function (chan) {
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
            lineObj.data.confBridgeChannels?.forEach(function (existingChan) {
              if (existingChan.id == chan.id) found = true;
            });
            if (!found) {
              lineObj.data.confBridgeChannels?.push(chan);
              lineObj.data.confBridgeEvents?.push({
                event: chan.caller.name + ' (' + chan.caller.number + ') joined the conference',
                eventTime: utcDateNow(),
              });
              console.log(chan.caller.name, 'Joined the conference. Muted: ', chan.muted);
            }
          });
        } else if (msgJson.type == 'ConfbridgeLeave') {
          msgJson.channels.forEach(function (chan) {
            lineObj.data.confBridgeChannels?.forEach(function (existingChan, i) {
              if (existingChan.id == chan.id) {
                lineObj.data.confBridgeChannels?.splice(i, 1);
                console.log(chan.caller.name, 'Left the conference');
                lineObj.data.confBridgeEvents?.push({
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
            lineObj.data.confBridgeChannels?.forEach(function (existingChan) {
              if (existingChan.id == chan.id) {
                console.log(existingChan.caller.name, 'is now muted');
                existingChan.muted = true;
              }
            });
          });
          //   RedrawStage(lineObj.LineKey, false); TODO #SH
        } else if (msgJson.type === 'ConfbridgeUnmute') {
          msgJson.channels.forEach(function (chan) {
            lineObj.data.confBridgeChannels?.forEach(function (existingChan) {
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
        const remoteMediaStreamData = lineObj?.data.remoteMediaStreamData
        if (!remoteMediaStreamData) return;
        const body = JSON.parse(response.request.body);
        switch (body.type as SendMessageSessionEnum) {
          case SendMessageSessionEnum.SOUND_TOGGLE:
            remoteMediaStreamData.audio.enabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.SOUND_TOGGLE>
            ).value;
            break;
          case SendMessageSessionEnum.VIDEO_TOGGLE:
            remoteMediaStreamData.video.enabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.VIDEO_TOGGLE>
            ).value;
            sendMessageSession(lineObj.session, SendMessageSessionEnum.VIDEO_TOGGLE_ACK, '');
            break;
          case SendMessageSessionEnum.SCREEN_SHARE_TOGGLE:
            remoteMediaStreamData.screen.enabled = (
              body as SendMessageRequestBody<SendMessageSessionEnum.SCREEN_SHARE_TOGGLE>
            ).value;
            break;
          case SendMessageSessionEnum.VIDEO_TOGGLE_ACK:
            lineObj.data.videoAckReceived = true;
            break;
          default:
            response.reject();
            break;
        }
        response.accept();
        lineObj.session?.initiateRemoteMediaStreams?.();
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
    lineObj: SipLineType,
    sdh: SipSessionDescriptionHandler,
    provisional: boolean,
    includeVideo?: boolean,
  ) {
    if (sdh) {
      console.log('onSessionDescriptionHandlerCreated', sdh.peerConnection);
      const pc = sdh.peerConnection;
      if (pc) {
        pc.ontrack = function (event) {
          onTrackAddedEvent(lineObj, includeVideo);
        };
      } else {
        console.warn('onSessionDescriptionHandler fired without a peerConnection');
      }
    } else {
      console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
    }
  }

  async function onTrackAddedEvent(lineObj: SipLineType, videoEnabled?: boolean) {
    // Gets remote tracks
    const session = lineObj.session;
    if (!session) return;

    const pc = session.sessionDescriptionHandler.peerConnection;

    const onIceConnectionComplete = () => {
      session.initiateRemoteMediaStreams = function ({
        videoEnabled: isVideoEnabled = videoEnabled,
        configs = getRtcUsernameConfigs(configKey),
      } = {}) {
        const media = configs?.media;
        const pc = this.sessionDescriptionHandler.peerConnection;
        const remoteAudioTracks = new Map<string, MediaStream>();
        const remoteVideoTracks = new Map<string, MediaStream>();
        const audioContainerId = `line-${lineObj.lineKey}-remoteAudios`;
        const videoContainerId = `line-${lineObj.lineKey}-remoteVideos`;

        const audioContainer = document.getElementById(audioContainerId);
        const videoContainer = document.getElementById(videoContainerId);

        console.log('initiateRemoteMediaStreams', {
          isVideoEnabled,
          getTransceivers: pc.getTransceivers(),
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
    };

    // waites until session media conncetion complete.
    pc.oniceconnectionstatechange = () => {
      console.log('ICE state:', pc.iceConnectionState, pc.iceGatheringState);

      switch (pc.iceConnectionState) {
        case 'connected':
        case 'completed':
          onIceConnectionComplete();
          break;

        case 'disconnected':
        case 'failed':
          teardownSession(lineObj);
          break;
      }
    };
  }

  function onTransferSessionDescriptionHandlerCreated(
    lineObj: SipLineType,
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
            if (typeof remoteAudio.sinkId !== 'undefined' && lineObj?.data?.audioOutputDeviceId) {
              remoteAudio
                .setSinkId(lineObj.data.audioOutputDeviceId)
                .then(function () {
                  console.log('sinkId applied: ' + lineObj.data.audioOutputDeviceId);
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
