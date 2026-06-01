import { JanusConfig } from '../../../../configs/types';
import { createLine } from '../../../../constructors';
import { getRtcStore, getRtcUsernameConfigs } from '../../../../store';
import { LineDataType, LineType } from '../../../../store/types';
import { CallType } from '../../../../types';
import { utcDateNow } from '../../../../utils';
import { JanusInstance, JanusLineType, JanusSessionType } from '../../types';
import { JanusPublisher, JanusRoomSecurity, StartSessionOptions, VRCreateRequest } from './types';

export const sessionMethods = ({ configKey }: { configKey: string }) => {
  const store = getRtcStore();
  const configs = getRtcStore().configs?.[configKey] as JanusConfig;
  const username = configs?.account.username ?? '';
  const getLineByLineKey = getRtcStore().getLineByLineKey;
  const updateLine = getRtcStore().updateLine;
  const janus = getRtcStore().engines?.[configKey]! as JanusInstance;

  if (!janus) throw new Error('janus is undefined');

  /* -------------------------------------------------------------------------- */
  /*                                START SESSION                               */
  /* -------------------------------------------------------------------------- */
  function startSession(
    type: Extract<CallType, 'audio' | 'video'>,
    roomNumber: string,
    opt?: StartSessionOptions,
  ) {
    const defaultOptions = {
      autoCreate: false,
      ...getDefaultRoomSecurity(Number(roomNumber)),
      ...opt,
    };
    const { autoCreate, ...rest } = defaultOptions;
    const securityOptions = rest;
    const lineObj = createLine(configKey, username, roomNumber) as JanusLineType;
    lineObj.data.callType = type;
    ((lineObj.data.localMediaStreamData = {
      audio: {
        enabled: true,
        track: null,
      },
      video: {
        enabled: false,
        track: null,
      },
      screen: {
        enabled: false,
        track: null,
      },
    }),
      (lineObj.data.remoteMediaStreamData = {
        audio: new Map(),
        video: new Map(),
        screen: new Map(),
      }));
    const isVideoCall = lineObj.data.callType === 'video';
    const media = getRtcUsernameConfigs(configKey)?.media!;
    const hasAudio =
      media?.audioInputDeviceId === null
        ? true
        : media?.audioInputDeviceId && media.audioInputDeviceId !== 'default'
          ? { deviceId: media.audioInputDeviceId }
          : true;
    const hasVideo =
      media?.videoInputDeviceId === null && isVideoCall
        ? true
        : media?.videoInputDeviceId && media.videoInputDeviceId !== 'default'
          ? { deviceId: media.videoInputDeviceId }
          : isVideoCall;

    // let session: JanusSessionType|null = null;
    janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: (pluginHandle) => {
        const session: JanusSessionType = {
          pluginHandle,
          subscribers: new Map([]),
        };
        lineObj.session = session;

        store.addLine(lineObj);

        joinRoom(lineObj.lineKey, roomNumber, securityOptions);
      },

      onmessage: async (msg, jsep) => {
        console.log('onmessage', { msg, jsep });
        const event = msg['videoroom'];
        const session = lineObj.session as JanusSessionType;

        // Handle registration success
        if (event === 'joined') {
          // Use Janus createOffer helper with trickle enabled

          session.pluginHandle.createOffer({
            tracks: [
              {
                type: 'audio',
                capture: hasAudio,
                recv: false,
                add: true,
              },
              {
                type: 'video',
                capture: hasVideo,
                recv: false,
                add: true,
                simulcast: true,
              },
              { type: 'data' } as any,
              // {
              //   type:"screen" //TODO separate screen share
              // }
            ],
            success: (jsep) => {
              // Send call request with offer
              session.pluginHandle.send({
                message: {
                  request: 'publish',
                  audio: hasAudio,
                  video: hasVideo,
                },
                jsep: jsep,
                success(data) {
                  const startTime = utcDateNow();
                  lineObj.data.startTime = startTime;
                  lineObj.data.started = true;
                  store.updateLine(lineObj);
                },
                error(error) {
                  console.error('SEND PUBLISH ERROR', { error });
                },
              });
            },
            error: (error) => {
              console.error('createOffer error:', error);
              teardownSession(lineObj.lineKey);
            },
          });

          if (msg.publishers) {
            msg.publishers.forEach((publisher: JanusPublisher) => {
              if (!session.subscribers.has(publisher.id)) {
                subscribeToPublisher(lineObj, publisher);
              }
            });
          }
        } else if (event === 'event') {
          // Handle SDP (publisher answer)
          if (jsep) {
            session.pluginHandle.handleRemoteJsep({ jsep });
          }

          // =========================
          // NEW PUBLISHERS
          // =========================
          if (msg.publishers) {
            msg.publishers.forEach((publisher: JanusPublisher) => {
              if (!session.subscribers.has(publisher.id)) {
                subscribeToPublisher(lineObj, publisher);
              }
            });
          }

          // =========================
          // LEAVING
          // =========================
          if (msg.leaving) {
            console.log('status leaving');
            cleanupPublisher(lineObj, msg.leaving);
          }

          // =========================
          // UNPUBLISHED
          // =========================
          if (msg.unpublished && msg.unpublished !== 'ok') {
            console.log('status unpublished');
            cleanupPublisher(lineObj, msg.unpublished);
          }

          if (msg?.error?.includes('No such room') || msg.error_code === 426) {
            if (opt?.autoCreate) {
              try {
                await createRoom(lineObj.lineKey, roomNumber, securityOptions);
                return joinRoom(lineObj.lineKey, roomNumber, securityOptions);
              } catch (error) {
                console.error('onmessage join error', msg);
                teardownSession(lineObj.lineKey);
              }
            } else {
              teardownSession(lineObj.lineKey);
            }
          }

          if (msg?.error) {
            console.error('onmessage error', msg);
            session.pluginHandle.hangup();
          }
        }
      },

      onlocaltrack: (track, on) => {
        console.log('onlocaltrack', { track, on });

        if (!on) return;

        const currentLine = getLineByLineKey(lineObj.lineKey);
        if (!currentLine) return;
        // Store local tracks
        if (track.kind === 'audio') {
          track.enabled = !!hasAudio;
          currentLine.data.localMediaStreamData.audio = {
            track,
            enabled: track.enabled,
          };
        } else if (track.kind === 'video') {
          track.enabled = !!hasVideo && isVideoCall;
          currentLine.data.localMediaStreamData.video = {
            track,
            enabled: track.enabled,
          };
        }

        updateLine(currentLine);
      },
      onremotetrack: function (track, mid, on) {
        console.log('onremotetrack', { track, mid, on });
        // The publisher stream is sendonly, we don't expect anything here
      },
      ondataopen: function (data: any) {
        console.log(333, 'DataChannel opened', { data });
      },
      ondata: function (data: any) {
        console.log(333, 'Received data:', { data });
      },
      oncleanup: () => {
        console.log('oncleanup');
        if (lineObj) {
          checkAutoDestroyRoom(lineObj.lineKey, securityOptions);
          teardownSession(lineObj.lineKey);
        }
      },

      error: (error) => {
        console.error('Janus attach error:', error);
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                ROOM METHODS                                */
  /* -------------------------------------------------------------------------- */

  function getRoomsList(lineKey: LineType['lineKey']) {
    const session = store.getSessionByLineKey(lineKey) as JanusSessionType;
    const message = {
      request: 'list',
      admin_key: 'my-admin-key',
    };
    session.pluginHandle.send({
      message,
      success(data) {
        console.log(999, 'getRoomsList', { data });
      },
    });
  }

  function createRoom(
    lineKey: LineType['lineKey'],
    room: LineDataType['remoteNumber'],
    security?: JanusRoomSecurity,
  ) {
    const session = store.getSessionByLineKey(lineKey) as JanusSessionType;
    const message = {
      request: 'create',
      room: Number(room),
      description: 'Room ' + room,
      publishers: 6,
      data_channels: 'true',
      ...getDefaultRoomSecurity(Number(room), security),
    } as VRCreateRequest;
    return new Promise<void>((resolve, reject) => {
      session.pluginHandle.send({
        message,
        success: () => resolve(),
        error: reject,
      });
    });
  }

  function joinRoom(lineKey: string, roomNumber: string, security: JanusRoomSecurity) {
    const session = store.getSessionByLineKey(lineKey) as JanusSessionType;
    if (!session) throw new Error('Session not ready');

    session.pluginHandle.send({
      message: {
        request: 'join',
        room: Number(roomNumber),
        ptype: 'publisher',
        display: username,
        pin: roomNumber,
        secret: 'room-secret',
        ...security,
      },
    });
  }

  function checkAutoDestroyRoom(lineKey: LineType['lineKey'], security: JanusRoomSecurity) {
    const lineObj = getLineByLineKey(lineKey) as JanusLineType;
    if (!lineObj) return;
    const session = lineObj.session!;
    if (session.subscribers.size > 0) return;

    // destroy room
    session.pluginHandle.send({
      message: {
        request: 'destroy',
        room: Number(lineObj.remoteNumber),
        admin_key: 'my-admin-key',
        secret: 'room-secret',
        ...security,
      },
    });
  }

  function subscribeToPublisher(lineObj: JanusLineType, publisher: JanusPublisher) {
    const session = lineObj.session as JanusSessionType;
    const publisherId = publisher.id;
    const room = Number(lineObj.remoteNumber);
    if (session.subscribers?.has(publisherId)) {
      console.log('Already subscribed', publisherId);
      return;
    }

    console.log('Subscribing to', publisherId);

    janus.attach({
      plugin: 'janus.plugin.videoroom',

      success: (subscriberHandle) => {
        // ✅ store handle
        session.subscribers.set(publisherId, subscriberHandle);

        subscriberHandle.send({
          message: {
            request: 'join',
            room,
            ptype: 'subscriber',
            feed: publisherId,
            pin: String(room),
            secret: 'room-secret',
            data: true,
            streams: publisher.streams.map((s) => ({
              feed: publisher.id,
              mid: s.mid,
            })),
          },
          success(data) {
            console.log('subscriberHandle JOIN', { data });
          },
        });
        updateLine(lineObj);
      },
      ondataopen: function (data: any) {
        console.log(333, 'DataChannel opened', { data });
      },
      ondata: function (data: any) {
        console.log(333, 'Received data:', { data });
      },

      onmessage: (msg, jsep) => {
        const event = msg.videoroom;
        if (msg['error']) {
          alert(msg['error']);
        } else if (event) {
          if (event === 'attached') {
            console.log('Subscriber attached for feed', publisherId);
            // optional: mark subscriber active in state
          }

          if (event === 'event') {
            // OPTIONAL: simulcast/SVC handling
          }
        }
        if (jsep) {
          const subscriberHandle = session.subscribers.get(publisherId);
          if (!subscriberHandle) return;

          subscriberHandle.createAnswer({
            jsep,
            tracks: [{ type: 'data' } as any],
            success: (jsepAnswer) => {
              subscriberHandle.send({
                message: { request: 'start', room },
                jsep: jsepAnswer,
              });
            },

            error: console.error,
          });
        }
      },

      onremotetrack: (track, mid, on) => {
        console.log('subscriber onremotetrack', track, mid, on);
        const currentLine = getLineByLineKey(lineObj.lineKey) as JanusLineType;
        if (!currentLine) return;

        const key = `${publisherId}_${mid}`;

        if (on) {
          if (track.kind === 'audio') {
            currentLine.data.remoteMediaStreamData.audio.set(key, {
              track,
              enabled: track.enabled,
            });
          }

          if (track.kind === 'video') {
            currentLine.data.remoteMediaStreamData.video.set(key, {
              track,
              enabled: track.enabled,
            });
          }
        } else {
          currentLine.data.remoteMediaStreamData.audio.delete(key);
          currentLine.data.remoteMediaStreamData.video.delete(key);
        }

        updateLine(currentLine);
      },
      oncleanup: () => {
        removePublisherTracks(lineObj, publisherId);
      },

      error: (err) => {
        console.error('Subscriber error', err);
      },
    });
  }

  /*
  ================================
  END SESSION
  ================================
  */

  function endSession(lineKey: LineType['lineKey']) {
    const lineObj = store.getLineByLineKey(lineKey);
    if (!lineObj) return;
    const session = lineObj.session as JanusSessionType;
    session.pluginHandle.hangup();
  }

  /*
  /*
  ================================
  HOLD
  ================================
  */
  async function toggleHoldSession(lineKey: LineType['lineKey'], forcedValue?: boolean) {
    const lineObj = store.getLineByLineKey(lineKey);
    if (!lineObj) return;

    const hold = forcedValue ?? !lineObj.data.isHold;

    // Toggle audio track
    const audioTrack = lineObj.data.localMediaStreamData.audio.track;
    if (audioTrack) {
      audioTrack.enabled = !hold;
      lineObj.data.localMediaStreamData.audio.enabled = !hold;
    }

    // Toggle video track
    const videoTrack = lineObj.data.localMediaStreamData.video.track;
    if (videoTrack) {
      videoTrack.enabled = !hold;
      lineObj.data.localMediaStreamData.video.enabled = !hold;
    }

    lineObj.data.isHold = hold;
    store.updateLine(lineObj);
  }

  const toggleLocalVideoTrack = async (lineKey: JanusLineType['lineKey']) => {
    const lineObj = getLineByLineKey<JanusLineType>(lineKey);
    if (!lineObj || !lineObj.session || lineObj.data.callType === 'audio') return;

    const { session, data: lineData } = lineObj;
    const localMediaStreamData = lineData.localMediaStreamData;
    const videoSourceTrack = localMediaStreamData.video.track;

    if (!localMediaStreamData) return;

    const toggledLocalVideo = !localMediaStreamData.video.enabled;
    localMediaStreamData.video.enabled = toggledLocalVideo;

    const pc = session.pluginHandle.webrtcStuff.pc;
    if (!pc) return;
    const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video');

    if (localMediaStreamData.screen.enabled && videoSourceTrack) {
      // Screen sharing active, toggle camera track
      videoSourceTrack.enabled = toggledLocalVideo;
    } else if (videoSender?.track) {
      // Toggle existing video track
      videoSender.track.enabled = toggledLocalVideo;
    } else if (videoSourceTrack && toggledLocalVideo) {
      // Re-enable video: use replaceTrack or Janus configure
      try {
        if (videoSender) {
          await videoSender.replaceTrack(videoSourceTrack);
        } else {
          // If no sender exists, use Janus API to add track
          await session.pluginHandle.replaceTracks({
            tracks: [{ type: 'video', capture: videoSourceTrack }],
          });
        }
      } catch (error) {
        console.error('Failed to toggle video track:', error);
        localMediaStreamData.video.enabled = !toggledLocalVideo; // Revert on error
        return;
      }
    } else {
      localMediaStreamData.video.enabled = !toggledLocalVideo;
    }

    // Update store
    updateLine({ ...lineObj, data: lineData, session } as JanusLineType);
  };

  async function toggleShareScreen(lineKey: JanusLineType['lineKey']) {
    const lineObj = getLineByLineKey<JanusLineType>(lineKey);
    if (!lineObj || !lineObj.session) return; // TODO || lineObj.data.callType === 'audio'

    const { session, data: lineData } = lineObj;
    const pc = session.pluginHandle.webrtcStuff.pc;
    if (!pc) return;

    const localMediaStreamData = lineData.localMediaStreamData;
    const screenShareEnabled = localMediaStreamData.screen.enabled;
    const videoEnabled = localMediaStreamData.video.enabled;
    const videoSourceTrack = localMediaStreamData.video.track;
    const screenSourceTrack = localMediaStreamData.screen.track;

    const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
    if (!videoSender) {
      console.warn('No video sender found');
      return;
    }

    // ==================================================
    // STOP SCREEN SHARE
    // ==================================================
    if (screenShareEnabled) {
      try {
        // Restore camera if exists
        if (videoSourceTrack) {
          await session.pluginHandle.replaceTracks({
            tracks: [{ type: 'video', capture: videoSourceTrack }],
          });
          videoSourceTrack.enabled = videoEnabled ?? true;
        }

        // Stop screen capture
        if (screenSourceTrack) {
          screenSourceTrack.onended = null;
          screenSourceTrack.stop();
        }
      } catch (err) {
        console.error('Failed to restore camera:', err);
      }

      lineData.localMediaStreamData.screen.track = undefined;
      lineData.localMediaStreamData.screen.enabled = false;

      updateLine({ ...lineObj, data: lineData, session } as JanusLineType);
      return;
    }

    // ==================================================
    // START SCREEN SHARE
    // ==================================================
    try {
      // Clean previous screen track
      if (screenSourceTrack) {
        screenSourceTrack.stop();
        lineData.localMediaStreamData.screen.track = undefined;
      }

      if (!videoSourceTrack) {
        console.warn('No camera track available');
        return;
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const newScreenTrack = displayStream.getVideoTracks()[0];
      if (!newScreenTrack) {
        console.warn('No screen track returned');
        return;
      }

      newScreenTrack.enabled = true;
      lineData.localMediaStreamData.screen.track = newScreenTrack;

      // Use Janus replaceTracks API
      await session.pluginHandle.replaceTracks({
        tracks: [{ type: 'video', capture: newScreenTrack }],
      });

      lineData.localMediaStreamData.screen.enabled = true;

      // Handle user stopping share from browser UI
      newScreenTrack.onended = () => {
        if (lineData.localMediaStreamData?.screen.enabled) {
          toggleShareScreen(lineKey);
        }
      };

      updateLine({ ...lineObj, data: lineData, session } as JanusLineType);
    } catch (err) {
      console.error('Screen share failed:', err);
    }
  }

  /*
  ================================
  MUTE
  ================================
  */

  function toggleMuteSession(lineKey: LineType['lineKey']) {
    const lineObj = store.getLineByLineKey(lineKey) as JanusLineType;
    if (!lineObj) return;
    // lineObj.session?.pluginHandle.unmuteAudio()
    // const audioTrack = lineObj.data.localMediaStreamData.audio.track;
    // if (!audioTrack) return;
    const publisherHandle = lineObj.session?.pluginHandle!;

    const toggled = !lineObj.data.localMediaStreamData.audio.enabled;
    toggled ? publisherHandle.unmuteAudio() : publisherHandle.muteAudio();
    console.log('toggle tracks', lineObj.session?.pluginHandle.getLocalTracks());
    // audioTrack.enabled = toggled;
    lineObj.data.localMediaStreamData.audio.enabled = toggled;

    // publisherHandle.data({
    //   data: {
    //     audio: toggled,
    //     user: "shervin"
    //   },
    //   text: JSON.stringify({
    //     type: "mute",
    //     audio: toggled
    //   }),
    //   success(data) {
    //     console.log(888, { data })
    //   },
    //   error(error) {
    //     console.log(888, { error })
    //   },
    // });
    publisherHandle.data({
      text: 'test',
      error: (err) => console.error('DATA ERROR:', err),
      success: () => console.log('DATA SUCCESS'),
    });

    store.updateLine(lineObj);
  }

  function recordSession(lineKey: JanusLineType['lineKey']) {
    async function start() {
      const lineObj = getLineByLineKey<JanusLineType>(lineKey);
      if (!lineObj?.session) {
        console.warn(`Line ${lineKey} not found or has no Janus session`);
        return;
      }
      const isVideoCall = lineObj.data.callType === 'video';

      try {
        const chunks: BlobPart[] = [];

        // Capture screen with system audio
        let screenStream: MediaStream | null = null;
        if (isVideoCall) {
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: 'monitor' },
            audio: true,
          });
        }

        // Prepare audio mixing
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        // System audio
        if (screenStream?.getAudioTracks().length) {
          audioContext
            .createMediaStreamSource(new MediaStream(screenStream.getAudioTracks()))
            .connect(destination);
        }

        // Janus audio (local + remote)
        const pc = lineObj.session.pluginHandle.webrtcStuff.pc;

        pc.getSenders().forEach((sender) => {
          if (sender.track?.kind === 'audio') {
            audioContext
              .createMediaStreamSource(new MediaStream([sender.track]))
              .connect(destination);
          }
        });

        pc.getReceivers().forEach((receiver) => {
          if (receiver.track?.kind === 'audio') {
            audioContext
              .createMediaStreamSource(new MediaStream([receiver.track]))
              .connect(destination);
          }
        });

        // Combine video + mixed audio
        const combinedStream = new MediaStream([...destination.stream.getAudioTracks()]);
        if (isVideoCall && screenStream?.getVideoTracks().length) {
          screenStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
        }

        const mimeType = MediaRecorder.isTypeSupported(
          `${isVideoCall ? 'video' : 'audio'}/webm; codecs=vp8,opus`,
        )
          ? `${isVideoCall ? 'video' : 'audio'}/webm; codecs=vp8,opus`
          : `${isVideoCall ? 'video' : 'audio'}/webm`;

        const recorder = new MediaRecorder(combinedStream, { mimeType });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          if (!lineObj?.data.recordMedia) return;
          lineObj.data.recordMedia = {
            recorder: null,
            recording: false,
            startTime: null,
          };
          updateLine(lineObj);

          const blob = new Blob(chunks, { type: mimeType });
          chunks.length = 0;

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `recording-${isVideoCall ? 'video' : 'audio'}-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        if (screenStream?.getVideoTracks().length) {
          screenStream.getVideoTracks()[0].onended = () => {
            console.log('User clicked Stop sharing');
            recorder.stop();
          };
        }

        recorder.start();
        lineObj.data.recordMedia = {
          recorder,
          recording: true,
          startTime: utcDateNow(),
        };
        updateLine(lineObj);

        console.log('Recording started for line', lineKey);
      } catch (err) {
        console.error('Failed to start recording:', err);
        if (!lineObj?.data.recordMedia) return;
        lineObj.data.recordMedia = {
          recorder: null,
          recording: false,
          startTime: null,
        };
        updateLine(lineObj);
      }
    }

    function stop() {
      const lineObj = getLineByLineKey<JanusLineType>(lineKey);
      if (!lineObj?.session) return;
      const recorder = lineObj?.data.recordMedia?.recorder;
      if (!recorder) {
        console.warn(`No active recorder for line ${lineKey}`);
        return;
      }

      recorder.stop();
      lineObj.data.recordMedia = {
        recorder: null,
        recording: false,
        startTime: null,
      };
      updateLine(lineObj);
      console.log('Recording stopped for line', lineKey);
    }

    return { start, stop };
  }

  /*
  ================================
  CANCEL OUTGOING
  ================================
  */

  function cancelSession(lineKey: LineType['lineKey']) {
    endSession(lineKey);
  }

  /*
  ================================
  CLEANUP
  ================================
  */

  function cleanupPublisher(lineObj: JanusLineType, publisherId: number) {
    const session = lineObj.session as JanusSessionType;

    const subscriberHandle = session.subscribers.get(publisherId);
    if (!subscriberHandle) return;

    console.log('Detaching subscriber', publisherId);

    session.subscribers.delete(publisherId);

    subscriberHandle.detach();
  }

  function removePublisherTracks(lineObj: JanusLineType, publisherId: number) {
    const currentLine = getLineByLineKey(lineObj.lineKey) as JanusLineType;
    if (!currentLine) return;

    const audioMap = currentLine.data.remoteMediaStreamData.audio;
    const videoMap = currentLine.data.remoteMediaStreamData.video;

    [...audioMap.keys()].forEach((key) => {
      if (key.startsWith(`${publisherId}_`)) {
        audioMap.delete(key);
      }
    });

    [...videoMap.keys()].forEach((key) => {
      if (key.startsWith(`${publisherId}_`)) {
        videoMap.delete(key);
      }
    });

    updateLine(currentLine);
  }

  function teardownSession(lineKey: LineType['lineKey'], callback?: () => void) {
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj) return;
    // Stop all local tracks
    lineObj.data.localMediaStreamData.audio.track?.stop();
    lineObj.data.localMediaStreamData.video.track?.stop();
    lineObj.data.localMediaStreamData.screen.track?.stop();

    if (lineObj.data.recordMedia.recording) {
      lineObj.data.recordMedia.recorder?.stop();
    }

    store.removeLine(lineObj.lineKey);
    callback?.();
  }

  const getDefaultRoomSecurity = function (room: number, security?: JanusRoomSecurity) {
    return {
      is_private: false,
      pin: String(room),
      admin_key: 'my-admin-key',
      secret: 'room-secret',
      ...security,
    };
  };

  return {
    startSession,
    endSession,
    toggleHoldSession,
    toggleMuteSession,
    toggleLocalVideoTrack,
    toggleShareScreen,
    recordSession,
    cancelSession,
    teardownSession,
  };
};
