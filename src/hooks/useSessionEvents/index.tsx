import { useSipStore } from '../../store';
import { LineType, SipSessionDescriptionHandler, SipSessionType } from '../../store/types';
import { CallbackFunction } from '../../types';
import { dayJs, utcDateNow } from '../../utils';
import { SipMediaStream } from './types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';

export const useSessionEvents = () => {
  const updateLine = useSipStore((state) => state.updateLine);
  const audioBlobs = useSipStore((state) => state.audioBlobs);
  const { maxVideoBandwidth, audioOutputDeviceId } = useSipStore((state) => state.configs.media);

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
  function onInviteAccepted(lineObj: LineType, includeVideo: boolean, response?: IncomingResponse) {
    // Call in progress
    console.log('onInviteAccepted');
    const session = lineObj.sipSession;
    if (!session) return;
    if (session.data.earlyMedia) {
      session.data.earlyMedia.pause();
      session.data.earlyMedia.removeAttribute('src');
      session.data.earlyMedia.load();
      session.data.earlyMedia = null;
    }

    const startTime = dayJs.utc();
    session.data.startTime = startTime;

    session.isOnHold = false;
    session.data.started = true;

    if (includeVideo) {
      // Preview our stream from peer connection
      const localVideoStream = new MediaStream();
      const pc = session.sessionDescriptionHandler.peerConnection;
      pc.getSenders().forEach(function (sender) {
        if (sender.track && sender.track.kind === 'video') {
          localVideoStream.addTrack(sender.track);
        }
      });
      const localVideo = document.getElementById(
        `line-${lineObj.lineNumber}-localVideo`,
      ) as HTMLVideoElement;
      console.log('onInviteAccepted', { localVideo, localVideoStream });
      if (localVideo) {
        localVideo.srcObject = localVideoStream;
        localVideo.onloadedmetadata = function (e) {
          console.log('onInviteAccepted', 'play');
          localVideo.play();
        };
      }

      // Apply Call Bandwidth Limits
      if (maxVideoBandwidth > -1) {
        pc.getSenders().forEach(function (sender) {
          if (sender.track && sender.track.kind === 'video') {
            const parameters = sender.getParameters();
            if (!parameters.encodings) parameters.encodings = [{}];
            parameters.encodings[0].maxBitrate = maxVideoBandwidth * 1000;

            console.log('Applying limit for Bandwidth to: ', maxVideoBandwidth + 'kb per second');

            // Only going to try without re-negotiations
            sender.setParameters(parameters).catch(function (e: any) {
              console.warn('Cannot apply Bandwidth Limits', e);
            });
          }
        });
      }
    }

    // Start Call Recording
    // if (RecordAllCalls || CallRecordingPolicy == 'enabled') {
    // StartRecording(lineObj.LineNumber); TODO #SH Recording feature
    // }

    //   if (includeVideo && StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber); TODO #SH

    updateLine(lineObj);
  }

  // Outgoing INVITE
  function onInviteTrying(lineObj: LineType, response: IncomingResponse) {
    // $('#line-' + lineObj.LineNumber + '-msg').html(lang.trying);
  }
  function onInviteProgress(lineObj: LineType, response: IncomingResponse) {
    console.log('Call Progress:', response.message.statusCode);
    const session = lineObj.sipSession;
    if (!session) return;
    // Provisional 1xx
    // response.message.reasonPhrase
    if (response.message.statusCode === 180) {
      // $('#line-' + lineObj.LineNumber + '-msg').html(lang.ringing);

      let soundFile = audioBlobs.Ringtone;
      console.log({ soundFile });

      // Play Early Media
      console.log('Audio:', soundFile.url);
      if (session.data.earlyMedia) {
        // There is already early media playing
        // onProgress can be called multiple times
        // Don't add it again
        console.log('Early Media already playing');
      } else {
        const earlyMedia = new Audio(soundFile.url as string);
        earlyMedia.preload = 'auto';
        earlyMedia.loop = true;
        earlyMedia.oncanplaythrough = function (e) {
          if (typeof earlyMedia.sinkId !== 'undefined' && audioOutputDeviceId !== 'default') {
            earlyMedia
              .setSinkId(audioOutputDeviceId)
              .then(function () {
                console.log('Set sinkId to:', audioOutputDeviceId);
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
      // RedrawStage(lineObj.LineNumber, false); TODO #SH
    }
  }
  function onSessionReceivedMessage(lineObj: LineType, response: Message) {
    const messageType =
      response.request.headers['Content-Type'].length >= 1
        ? response.request.headers['Content-Type'][0].parsed
        : 'Unknown';

    console.log('onMessage', response.request.body, messageType);
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
          session.data.confBridgeChannels?.forEach(function (existingChan) {
            if (existingChan.id == chan.id) {
              console.log(existingChan.caller.name, 'is now muted');
              existingChan.muted = true;
            }
          });
        });
        //   RedrawStage(lineObj.LineNumber, false); TODO #SH
      } else if (msgJson.type === 'ConfbridgeUnmute') {
        msgJson.channels.forEach(function (chan) {
          session.data.confBridgeChannels?.forEach(function (existingChan) {
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
    } else if (messageType.indexOf('text/plain') > -1) {
      console.log('MAJID');
      response.accept();
    } else {
      console.warn('Unknown message type');
      response.reject();
    }
    updateLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */
  function onSessionDescriptionHandlerCreated(
    lineObj: LineType,
    sdh: SipSessionDescriptionHandler,
    provisional: boolean,
    includeVideo?: boolean,
  ) {
    if (sdh) {
      if (sdh.peerConnection) {
        console.log(222, 'onSessionDescriptionHandlerCreated', sdh, {
          peerConnection: sdh.peerConnection,
        });
        sdh.peerConnection.ontrack = function (event) {
          console.log(222, { event });
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
    // Gets remote tracks
    console.log('onTrackAddedEvent');
    const session = lineObj.sipSession;
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
        `line-${lineObj.lineNumber}-remoteAudio`,
      ) as HTMLAudioElement;
      remoteAudio.setAttribute('id', `line-${lineObj.lineNumber}-remoteAudio`);
      remoteAudio.srcObject = remoteAudioStream;

      remoteAudio.onloadedmetadata = () => {
        if (typeof remoteAudio.sinkId !== 'undefined') {
          remoteAudio
            .setSinkId(audioOutputDeviceId)
            .then(() => console.log('sinkId applied:', audioOutputDeviceId))
            .catch((e) => console.warn('Error using setSinkId:', e));
        }
        remoteAudio.play();
      };
    }

    // Attach Video Stream
    if (includeVideo && remoteVideoStream.getVideoTracks().length > 0) {
      const videoContainerId = `line-${lineObj.lineNumber}-remoteVideos`;
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
        videoElement.id = `line-${lineObj.lineNumber}-video-${index}`;
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
          remoteAudio.setAttribute('id', `line-${lineObj.lineNumber}-transfer-remoteAudio`);
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
              remoteVideo.id = `line-${lineObj.lineNumber}-video-${index}`;
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
