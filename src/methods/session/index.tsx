import { SipConfigs } from '../../configs/types';
import { createLine } from '../../constructors';
import { sessionEvents } from '../../events/session';
import { MediaStreamTrackType } from '../../events/session/types';
import { getSipStore } from '../../store';
import {
  LineType,
  SipInvitationType,
  SipInviterType,
  SipSessionDescriptionHandler,
  SipSessionType,
} from '../../store/types';
import { CallbackFunction, CallType } from '../../types';
import { interval, utcDateNow } from '../../utils';
import { spdOptions } from './spdOptions';
import {
  DialRequestDelegate,
  SendMessageSessionEnum,
  SendMessageSessionValueType,
  SPDOptionsType,
  VideoSessionConstraints,
} from './types';
import {
  Inviter,
  InviterInviteOptions,
  SessionReferOptions,
  SessionState,
  URI,
  UserAgent,
} from 'sip.js';

/* -------------------------------------------------------------------------- */
/*                            MAIN SESSION METHODS                            */
/* -------------------------------------------------------------------------- */
export const sessionMethods = ({ configKey }: { configKey: SipConfigs['key'] }) => {
  const configs = getSipStore().configs?.[configKey];
  const username = configs?.account.username ?? '';
  const getLineByLineKey = getSipStore().getLineByLineKey;
  const getNewLineKey = getSipStore().getNewLineKey;
  const addLine = getSipStore().addLine;
  const updateLine = getSipStore().updateLine;
  const userAgent = getSipStore().userAgents?.[configKey];

  const {
    onInviteAccepted,
    onInviteCancel,
    onInviteProgress,
    onInviteRedirected,
    onInviteRejected,
    onInviteTrying,
    onSessionDescriptionHandlerCreated,
    onSessionReceivedBye,
    onSessionReceivedMessage,
    onSessionReinvited,
    onTransferSessionDescriptionHandlerCreated,
  } = sessionEvents({ configKey });

  const { makeAudioSpdOptions, answerAudioSpdOptions, answerVideoSpdOptions, makeVideoSpdOptions } =
    spdOptions({ configKey });
  /* -------------------------------------------------------------------------- */
  /*                       Init-Session Call Functionality                      */
  /* -------------------------------------------------------------------------- */
  /**
   * Handle incoming calls
   * @param invitation
   * @returns
   */
  function receiveSession(invitation: SipInvitationType) {
    console.log('receiveSession', { invitation });
    let remoteNumber = invitation.remoteIdentity.uri.user || invitation.remoteIdentity.displayName;

    console.log(`Incoming call from: ${remoteNumber}`);

    // Create or update buddy based on DID
    const lineObj = createLine(configKey, username, getNewLineKey(), remoteNumber);
    lineObj.sipSession = invitation as SipInvitationType;
    const session = lineObj.sipSession;
    lineObj.data = {
      ...lineObj.data,
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'inbound',
      terminateBy: '',
      remoteNumber: remoteNumber,
      username: lineObj.username,
      earlyReject: false,
      callType: 'audio',
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: false,
        videoEnabled: false,
      },
    };

    // Detect Video
    let isVideoCall = false;
    if (configs?.features.enableVideo && session.request.body) {
      // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
      // even if original invite does not specify video.
      if (session.request.body.indexOf('m=video') > -1) {
        lineObj.data.remoteMediaStreamStatus!.videoEnabled = true;
        lineObj.data.callType = 'video';
        isVideoCall = true;
        // The invite may have video, but the buddy may be a contact
      }
    }
    // Extract P-Asserted-Identity if available
    const sipHeaders = session.incomingInviteRequest.message.headers;
    if (sipHeaders['P-Asserted-Identity']) {
      const rawUri = sipHeaders['P-Asserted-Identity'][0].raw;
      if (rawUri.includes('<sip:')) {
        const uriParts = rawUri.split('<sip:');
        if (uriParts[1].endsWith('>')) uriParts[1] = uriParts[1].slice(0, -1);
        if (uriParts[1].includes(`@${configs?.account.domain}`)) {
          remoteNumber = uriParts[1].split('@')[0];
          console.log('Using P-Asserted-Identity:', remoteNumber);
        }
      }
    }
    // Session Delegates
    session.delegate = {
      onBye: function (sip) {
        onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
      },
      onMessage: function (sip) {
        onSessionReceivedMessage(lineObj, sip);
      },
      onInvite: function (sip) {
        onSessionReinvited(lineObj, sip);
      },
      onSessionDescriptionHandler: function (sdh, provisional) {
        onSessionDescriptionHandlerCreated(
          lineObj,
          sdh as SipSessionDescriptionHandler,
          provisional,
          isVideoCall,
        );
      },
    };
    // incomingInviteRequestDelegate
    session.incomingInviteRequest.delegate = {
      onCancel: function (sip) {
        console.log('onInviteCancel');
        onInviteCancel(lineObj, sip, () => teardownSession(lineObj));
      },
    };

    addLine(lineObj);
  }

  /**
   * Handle inbound calls
   * @param lineKey
   * @returns
   */
  function answerAudioSession(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);

    if (lineObj === null) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session || session instanceof Inviter) return;

    // Start SIP handling
    const spdOptions = answerAudioSpdOptions();
    if (!spdOptions) return console.error('answerAudioSession spdOptions is undefined');
    // MediaStreamStatus
    lineObj.data = {
      ...lineObj.data,
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: !!configs?.media.audioInputDeviceId,
        videoEnabled: false,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      videoSourceDevice: null,
      audioSourceDevice: configs?.media.audioInputDeviceId,
      audioOutputDevice: configs?.media.audioOutputDeviceId,
    };

    // Send Answer
    session
      .accept(spdOptions)
      .then(function () {
        onInviteAccepted(lineObj, false);
      })
      .catch(function (error: any) {
        console.warn('Failed to answer call', error, session);
        lineObj.data.reasonCode = 500;
        lineObj.data.reasonText = 'Client Error';
        teardownSession(lineObj);
      });
  }

  /**
   * Handle outbound calls
   * @param lineObj
   * @param dialledNumber
   * @param extraHeaders
   * @returns
   */
  function makeAudioSession(
    lineObj: LineType,
    dialledNumber: string,
    request?: DialRequestDelegate,
    extraHeaders?: Array<string>,
  ) {
    console.log(222, { lineObj, dialledNumber, extraHeaders });
    if (!userAgent) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj === null) return;
    console.log('makeAudioSession');

    const spdOptions = makeAudioSpdOptions({ extraHeaders });
    if (!spdOptions) return;
    let startTime = utcDateNow();

    // Invite
    console.log('INVITE (audio): ' + dialledNumber + '@' + configs?.account.domain);
    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs?.account.domain,
    ) as URI;
    lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    const session = lineObj.sipSession;

    lineObj.data = {
      ...lineObj.data,
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'outbound',
      remoteNumber: dialledNumber,
      username,
      startTime: startTime,
      videoSourceDevice: null,
      audioSourceDevice: configs?.media.audioInputDeviceId,
      audioOutputDevice: configs?.media.audioOutputDeviceId,
      terminateBy: 'them',
      // MediaStreamStatus
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: !!configs?.media.audioInputDeviceId,
        videoEnabled: false,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      earlyReject: false,
      callType: 'audio',
    };
    session.delegate = {
      onBye: function (sip) {
        onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
      },
      onMessage: function (sip) {
        onSessionReceivedMessage(lineObj, sip);
      },
      onInvite: function (sip) {
        onSessionReinvited(lineObj, sip);
      },
      onSessionDescriptionHandler: function (sdh, provisional) {
        console.log('Session Description Handler created:', { sdh });
        onSessionDescriptionHandlerCreated(
          lineObj,
          sdh as SipSessionDescriptionHandler,
          provisional,
          false,
        );
      },
    };

    const inviterOptions: InviterInviteOptions = {
      // sessionDescriptionHandlerOptions: spdOptions.sessionDescriptionHandlerOptions,
      requestDelegate: {
        onTrying: function (sip) {
          console.log('makeAudioSession 1', sip);
          onInviteTrying(lineObj, sip);
          request?.onTrying?.(lineObj.lineKey, sip);
        },
        onProgress: function (sip) {
          console.log('makeAudioSession 2', sip);
          onInviteProgress(lineObj, sip);
          request?.onProgress?.(lineObj.lineKey, sip);
        },
        onRedirect: function (sip) {
          console.log('makeAudioSession 3', sip);
          onInviteRedirected(lineObj, sip);
          request?.onRedirect?.(lineObj.lineKey, sip);
        },
        onAccept: function (sip) {
          console.log('makeAudioSession 4', sip);
          onInviteAccepted(lineObj, false);
          request?.onAccept?.(lineObj.lineKey, sip);
        },
        onReject: function (sip) {
          console.log('makeAudioSession 5', sip);
          onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
          request?.onReject?.(lineObj.lineKey, sip);
        },
      },
    };
    session.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj);
    return inviterOptions.requestDelegate as NonNullable<DialRequestDelegate>;
  }

  /**
   * Handle inbound video calls
   * @param lineKey
   * @returns
   */
  function answerVideoSession(lineKey: LineType['lineKey'], enableVideo?: boolean) {
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj || !configs) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session || session instanceof Inviter) return;

    // Start SIP handling
    const spdOptions = enableVideo ? answerVideoSpdOptions() : answerAudioSpdOptions();
    lineObj.data = {
      ...lineObj.data,
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: !!configs.media.audioInputDeviceId,
        videoEnabled: (enableVideo && !!configs.media.videoInputDeviceId) ?? true,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      videoSourceDevice: configs.media.videoInputDeviceId,
      audioSourceDevice: configs.media.audioInputDeviceId,
      audioOutputDevice: configs.media.audioOutputDeviceId,
    };

    // Send Answer
    session
      .accept(spdOptions)
      .then(async () => {
        try {
          await onInviteAccepted(lineObj, true);
          if (lineObj.data.localMediaStreamStatus?.videoEnabled) {
            await sendVideoActivationWithAckRetry(
              lineKey,
              session,
              {
                delayMs: 2000,
                maxRetries: 10,
              },
              lineObj.data.localMediaStreamStatus.videoEnabled,
            );
          }
        } catch (error) {
          console.error('AnswerVideoSession onStateChange', error);
        }
      })
      .catch(function (error) {
        console.warn('Failed to answer call', error, session);
        lineObj.data.reasonCode = 500;
        lineObj.data.reasonText = 'Client Error';
        teardownSession(lineObj);
      });
    updateLine(lineObj);
  }

  /**
   * Handle outbound video calls
   * @param lineObj
   * @param dialledNumber
   * @param extraHeaders
   * @returns
   */
  function makeVideoSession(
    lineObj: LineType,
    dialledNumber: string,
    request?: DialRequestDelegate,
    extraHeaders?: Array<string>,
  ) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj == null) return;

    const spdOptions = makeVideoSpdOptions({ extraHeaders });
    if (!spdOptions) return;

    const startTime = utcDateNow();

    // Invite
    console.log('INVITE (video): ' + dialledNumber + '@' + configs?.account.domain);

    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs?.account.domain,
    ) as URI;

    lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    const session = lineObj.sipSession;
    lineObj.data = {
      ...lineObj.data,
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'outbound',
      remoteNumber: dialledNumber,
      username,
      startTime: startTime,
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: !!configs?.media.audioInputDeviceId,
        videoEnabled: !!configs?.media.videoInputDeviceId,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      videoSourceDevice: configs?.media.videoInputDeviceId,
      audioSourceDevice: configs?.media.audioInputDeviceId,
      audioOutputDevice: configs?.media.audioOutputDeviceId,
      terminateBy: 'them',
      callType: 'video',
      earlyReject: false,
    };

    session.delegate = {
      onBye: function (sip) {
        onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
      },
      onMessage: function (sip) {
        onSessionReceivedMessage(lineObj, sip);
      },
      onInvite: function (sip) {
        onSessionReinvited(lineObj, sip);
      },
      onSessionDescriptionHandler: function (sdh, provisional) {
        onSessionDescriptionHandlerCreated(
          lineObj,
          sdh as SipSessionDescriptionHandler,
          provisional,
          true,
        );
      },
    };
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        onTrying: function (sip) {
          onInviteTrying(lineObj, sip);
          request?.onTrying?.(lineObj.lineKey, sip);
        },
        onProgress: function (sip) {
          onInviteProgress(lineObj, sip);
          request?.onProgress?.(lineObj.lineKey, sip);
        },
        onRedirect: function (sip) {
          onInviteRedirected(lineObj, sip);
          request?.onRedirect?.(lineObj.lineKey, sip);
        },
        onAccept: async function (sip) {
          onInviteAccepted(lineObj, true);
          request?.onAccept?.(lineObj.lineKey, sip);
          await sendVideoActivationWithAckRetry(
            lineObj.lineKey,
            session,
            {
              delayMs: 2000,
              maxRetries: 10,
            },
            lineObj.data.localMediaStreamStatus?.videoEnabled,
          );
        },
        onReject: function (sip) {
          onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
          request?.onReject?.(lineObj.lineKey, sip);
        },
      },
    };
    session.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
  }

  /**
   * Toggling local video source (CallType: video)
   *
   * @param lineObj - The lineKey object that holds the active SIP session.
   * @param extraHeaders
   */
  const toggleLocalVideoTrack = async (lineKey: LineType['lineKey']) => {
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj || !lineObj.sipSession || lineObj.data.callType === 'audio') return;

    const { localMediaStreamStatus, videoSourceTrack } = lineObj.data;
    const session = lineObj.sipSession;

    if (!localMediaStreamStatus) return;

    const toggledLocalVideo = !localMediaStreamStatus.videoEnabled;
    localMediaStreamStatus.videoEnabled = toggledLocalVideo;

    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;

    const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video');

    if (localMediaStreamStatus.screenShareEnabled && videoSourceTrack) {
      videoSourceTrack.enabled = toggledLocalVideo;
    } else if (videoSender?.track) {
      // Just toggle camera track

      videoSender.track.enabled = toggledLocalVideo;
    } else if (videoSourceTrack && toggledLocalVideo) {
      // Reattach stored camera track if sender missing

      pc.addTrack(videoSourceTrack);
    }

    await sendMessageSession(session, SendMessageSessionEnum.VIDEO_TOGGLE, toggledLocalVideo);
    !localMediaStreamStatus.screenShareEnabled &&
      toggledLocalVideo &&
      interval(
        () => {
          session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
        },
        2,
        200,
      );
    updateLine(lineObj);
  };

  /**
   * Handle toggle share screen (CallType: video)
   * @param lineKey
   * @returns
   */
  async function toggleShareScreen(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj || !lineObj.sipSession || lineObj.data.callType === 'audio') return;

    const session = lineObj.sipSession;
    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc || !lineObj.data.localMediaStreamStatus) return;

    const { videoSourceTrack, screenSourceTrack, localMediaStreamStatus } = lineObj.data;

    const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
    if (!videoSender) {
      console.warn('No video sender found');
      return;
    }

    // ==================================================
    // STOP SCREEN SHARE
    // ==================================================
    if (localMediaStreamStatus?.screenShareEnabled) {
      try {
        // Restore camera if exists
        if (videoSourceTrack) {
          console.log({ videoSourceTrack });
          await videoSender.replaceTrack(videoSourceTrack);

          // Restore previous enabled state
          videoSourceTrack.enabled = localMediaStreamStatus?.videoEnabled ?? true;
        }

        // Properly stop screen capture (removes browser top header)
        if (screenSourceTrack) {
          screenSourceTrack.onended = null;
          screenSourceTrack.stop();
        }
      } catch (err) {
        console.error('Failed to restore camera:', err);
      }

      lineObj.data.screenSourceTrack = undefined;
      lineObj.data.localMediaStreamStatus.screenShareEnabled = false;

      sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, false);

      interval(
        () => {
          session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
        },
        2,
        200,
      );
      updateLine(lineObj);
      return;
    }

    // ==================================================
    // START SCREEN SHARE
    // ==================================================
    try {
      // Clean previous screen track if somehow exists
      if (screenSourceTrack) {
        screenSourceTrack.stop();
        lineObj.data.screenSourceTrack = undefined;
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
      lineObj.data.screenSourceTrack = newScreenTrack;

      await videoSender.replaceTrack(newScreenTrack);
      if (videoSender.track) videoSender.track.enabled = true;
      lineObj.data.localMediaStreamStatus.screenShareEnabled = true;

      // If user stops sharing from browser UI
      newScreenTrack.onended = () => {
        if (lineObj.data.localMediaStreamStatus?.screenShareEnabled) {
          toggleShareScreen(lineKey);
        }
      };

      sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, true);
      interval(
        () => {
          session.initiateLocalMediaStreams({ type: 'video', stopStream: false });
        },
        2,
        200,
      );
    } catch (err) {
      console.error('Screen share failed:', err);
      return;
    }
  }

  /**
   * Handle reject calls
   * @param lineKey
   * @returns
   */
  function rejectSession(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session || session instanceof Inviter) return;
    if (session.state == SessionState.Established) {
      session.bye().catch(function (e) {
        console.warn('Problem in rejectSession(), could not bye() call', e, session);
      });
    } else {
      session
        .reject({
          statusCode: 486,
          reasonPhrase: 'Busy Here',
        })
        .catch(function (e) {
          console.warn('Problem in rejectSession(), could not reject() call', e, session);
        });
    }

    lineObj.data.terminateBy = 'us';
    lineObj.data.reasonCode = 486;
    lineObj.data.reasonText = 'Busy Here';
    teardownSession(lineObj);
  }

  /**
   * Handle Dial User By Dial Number
   * @param type
   * @param dialNumber
   * @param extraHeaders
   * @returns
   */
  function dialByNumber(
    type: Extract<CallType, 'audio' | 'video'>,
    dialNumber: string,
    request?: DialRequestDelegate,
    extraHeaders?: Array<string>,
  ) {
    const userAgent = getSipStore().userAgents?.[configKey];
    if (!(userAgent && userAgent?.isRegistered())) {
      alert(`SIP userAgent for ${configKey} not registered`);
      return;
    }

    // Create a Line
    const lineObj = createLine(configKey, username, getNewLineKey(), dialNumber);

    // Start Call Invite
    if (type === 'audio') {
      makeAudioSession(lineObj, dialNumber, request, extraHeaders);
    } else {
      makeVideoSession(lineObj, dialNumber, request, extraHeaders ?? []);
    }
    addLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */
  /*                        In-Session Call Functionality                       */
  /*                           HOLD/MUTE/END/TRANSFER                           */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- TOGGLE-HOLD ------------------------------ */
  /**
   * Toggle Hold Call Session
   * @param lineKey
   * @param forcedValue force to be hold/unhold
   * @returns
   */
  async function toggleHoldSession(lineKey: LineType['lineKey'], forcedValue?: boolean) {
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj?.sipSession) return;
    const session = lineObj.sipSession;
    const lineData = lineObj.data;
    lineData.isHold = lineData.isHold ?? false;
    if (lineData.isHold === forcedValue) return;
    console.log('Toggle Call on hold:', lineKey);
    const toggledHold = forcedValue ?? !(lineData.isHold ?? false);
    const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
    sessionDescriptionHandlerOptions.hold = toggledHold;
    session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

    console.log('Call is is on hold:', lineKey);
    // Renegotiate
    await session.invite({
      sessionDescriptionHandlerOptions,
    });

    lineData.isHold = toggledHold;
    updateLine(lineObj);
  }
  /* ------------------------------- TOGGLE-MUTE ------------------------------ */
  /**
   * Toggle-Mute Call Session
   * @param lineKey
   * @returns
   */
  function toggleMuteSession(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);
    if (lineObj == null || lineObj.sipSession == null) return;

    const session = lineObj.sipSession;
    const lineData = lineObj.data;

    if (!lineData.localMediaStreamStatus) return;
    if (!session?.sessionDescriptionHandler?.peerConnection) return;
    const toggledSound = !lineData.localMediaStreamStatus.soundEnabled;
    lineData.localMediaStreamStatus.soundEnabled = toggledSound; //Toggle sound
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
        const track = RTCRtpSender.track as MediaStreamTrackType;
        track.enabled = toggledSound;
        lineData.audioSourceTrack = track;
      }
    });

    sendMessageSession(session, SendMessageSessionEnum.SOUND_TOGGLE, toggledSound);
    session.initiateLocalMediaStreams({ type: 'audio', stopStream: true });
    updateLine(lineObj);
  }

  /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
  /**
   * Cancle And Terminate Call Session
   * @param lineKey
   * @returns
   */
  function cancelSession(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (!(session instanceof Inviter)) return;
    lineObj.data.terminateBy = 'us';
    lineObj.data.reasonCode = 0;
    lineObj.data.reasonText = 'Call Cancelled';

    console.log('Cancelling session : ' + lineKey);
    if (session.state == SessionState.Initial || session.state == SessionState.Establishing) {
      session.cancel();
    } else {
      console.warn('Session not in correct state for cancel.', session.state);
      console.log('Attempting teardown : ' + lineKey);
      teardownSession(lineObj);
    }
  }

  /**
   * Terminate Call Session Based on Session State
   * @param lineKey
   * @returns
   */
  function endSession(lineKey: LineType['lineKey']) {
    const lineObj = getLineByLineKey(lineKey);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session) return;
    session?.initiateLocalMediaStreams &&
      interval(
        () => {
          session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
        },
        2,
        100,
      );
    switch (session.state) {
      case SessionState.Initial:
      case SessionState.Establishing:
        if (session instanceof Inviter) {
          // An unestablished outgoing session
          lineObj.data.terminateBy = 'us';
          lineObj.data.reasonCode = 0;
          lineObj.data.reasonText = 'Call Cancelled';
          session.cancel();
        } else {
          // An unestablished incoming session
          session
            .reject({
              statusCode: 486,
              reasonPhrase: 'Busy Here',
            })
            .catch(function (e) {
              console.warn('Problem in rejectSession(), could not reject() call', e, session);
            });

          lineObj.data.terminateBy = 'us';
          lineObj.data.reasonCode = 486;
          lineObj.data.reasonText = 'Busy Here';
          teardownSession(lineObj);
        }
        break;
      case SessionState.Established:
        session.bye().catch(function (e) {
          console.warn('Problem in rejectSession(), could not bye() call', e, session);
        });

        lineObj.data.terminateBy = 'us';
        lineObj.data.reasonCode = 486;
        lineObj.data.reasonText = 'Busy Here';
        teardownSession(lineObj);
        break;
      default:
        console.warn('Session not in correct state for cancel.', session.state);
        console.log('Attempting teardown : ' + lineKey);
        teardownSession(lineObj);
        break;
    }
  }

  /**
   * Records the main screen + SIP audio into a WebM file.
   * Prompts user to download the recording after stopping.
   */
  function recordSession(lineKey: LineType['lineKey']) {
    async function start() {
      const lineObj = getLineByLineKey(lineKey);
      if (!lineObj?.sipSession) {
        console.warn(`Line ${lineKey} not found or has no SIP session`);
        return;
      }
      const isVideoCall = lineObj.data.callType === 'video';

      try {
        const chunks: BlobPart[] = [];

        // Capture screen with system audio
        let screenStream: MediaStream | null = null;
        if (isVideoCall)
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: 'monitor' },
            audio: true,
          });

        // Prepare audio mixing
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        // System audio
        if (screenStream?.getAudioTracks().length) {
          audioContext
            .createMediaStreamSource(new MediaStream(screenStream.getAudioTracks()))
            .connect(destination);
        }

        // SIP audio (local + remote)
        const pc = lineObj.sipSession.sessionDescriptionHandler.peerConnection;

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
          screenStream?.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
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

          // Trigger file download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `recording-${isVideoCall ? 'video' : 'audio'}-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };
        if (screenStream?.getVideoTracks().length)
          screenStream.getVideoTracks()[0].onended = () => {
            console.log('User clicked Stop sharing');
            recorder.stop();
          };

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
      const lineObj = getLineByLineKey(lineKey);
      if (!lineObj?.sipSession) return;
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

  /* -------------------------------- TRANSFER -------------------------------- */
  /**
   * Start Transfer Call Session
   * @param lineKey
   * @param transferNumber
   */
  function makeTransferSession(lineKey: LineType['lineKey'], transferNumber: LineType['lineKey']) {
    toggleHoldSession(lineKey, true);
    queueMicrotask(() => {
      attendedTransferSession(lineKey, transferNumber);
    });
  }

  /**
   * Attend Transfer Call Session
   * @param lineObj
   * @param transferNumber
   * @returns
   */
  function attendedTransferSession(
    lineKey: LineType['lineKey'],
    transferNumber: LineType['remoteNumber'],
    request?: DialRequestDelegate,
  ) {
    const userAgent = getSipStore().userAgents?.[configKey];
    if (!(userAgent && userAgent?.isRegistered())) {
      alert(`SIP userAgent for ${configKey} not registered`);
      return;
    }
    const dstNo = String(transferNumber);
    if (dstNo === '') {
      console.warn('Cannot transfer, no number');
      return;
    }

    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.sipSession;
    const lineData = lineObj.data;
    if (!session) return;
    if (!lineData.transfer) lineData.transfer = [];
    lineData.transfer.push({
      type: 'Attended',
      to: transferNumber,
      transferTime: utcDateNow(),
      disposition: 'invite',
      dispositionTime: utcDateNow(),
      accept: {
        complete: null,
        eventTime: null,
        disposition: '',
      },
    });
    const transferId = lineData.transfer.length - 1;

    // SDP options
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    const spdOptions: SPDOptionsType = {
      earlyMedia: true,
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: { deviceId: 'default' },
          video: false,
        },
      },
    };
    console.log('attend1');
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
    if (lineData.audioSourceDevice && lineData.audioSourceDevice != 'default') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: lineData.audioSourceDevice,
      };
    }
    // Add additional Constraints
    if (supportedConstraints.autoGainControl) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
        configs?.media.autoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        configs?.media.echoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        configs?.media.noiseSuppression;
    }

    // Not sure if its possible to transfer a Video call???
    if (lineData.localMediaStreamStatus?.videoEnabled) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video = {} as any;
      const video = spdOptions.sessionDescriptionHandlerOptions.constraints
        .video as VideoSessionConstraints;
      if (lineData.videoSourceDevice && lineData.videoSourceDevice != 'default') {
        video.deviceId = {
          exact: lineData.videoSourceDevice,
        };
      }
      // Add additional Constraints
      if (supportedConstraints.frameRate && configs?.media.maxFrameRate !== '') {
        video.frameRate = String(configs?.media.maxFrameRate);
      }
      if (supportedConstraints.height && configs?.media.videoHeight != '') {
        video.height = String(configs?.media.videoHeight);
      }
      if (supportedConstraints.aspectRatio && configs?.media.videoAspectRatio != '') {
        video.aspectRatio = String(configs?.media.videoAspectRatio);
      }

      if (
        (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video === 'object' &&
          Object.keys(spdOptions.sessionDescriptionHandlerOptions.constraints.video)?.length ==
            0) ||
        typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video === 'boolean'
      )
        spdOptions.sessionDescriptionHandlerOptions.constraints.video = true;
    }

    // Create new call session
    const targetURI = UserAgent.makeURI(
      'sip:' + dstNo.replace(/#/g, '%23') + '@' + configs?.account.domain,
    ) as URI;
    const newSession = new Inviter(userAgent, targetURI, spdOptions);

    newSession.delegate = {
      onBye: function () {
        console.log('New call session ended with BYE');
        if (lineData.transfer) {
          lineData.transfer[transferId].disposition = 'bye';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
        }
      },
      onSessionDescriptionHandler: function (sdh: SipSessionDescriptionHandler) {
        onTransferSessionDescriptionHandlerCreated(
          lineObj,
          session as SipSessionType,
          sdh,
          lineData?.localMediaStreamStatus?.videoEnabled,
        );
      },
    };
    lineData.childsession = newSession as SipSessionType;
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        onTrying: function (sip) {
          if (!lineData.transfer) return;
          lineData.transfer[transferId].disposition = 'trying';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
          request?.onTrying?.(lineObj.lineKey, sip);
        },
        onProgress: function (sip) {
          console.log('onProgress');
          if (!lineData.transfer) return;
          lineData.transfer[transferId].disposition = 'progress';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
          lineData.transfer[transferId].onCancle = () => {
            newSession.cancel().catch(function (error) {
              console.warn('Failed to CANCEL', error);
            });
            if (!lineData.transfer) return;
            lineData.transfer[transferId].accept.complete = false;
            lineData.transfer[transferId].accept.disposition = 'cancel';
            lineData.transfer[transferId].accept.eventTime = utcDateNow();
          };
          request?.onProgress?.(lineObj.lineKey, sip);
          console.log('New call session canceled');
        },
        onRedirect: function (sip) {
          console.log('Redirect received:', sip);
          request?.onRedirect?.(lineObj.lineKey, sip);
        },
        onAccept: function (sip) {
          if (!lineData.transfer) return;
          lineData.transfer[transferId].disposition = 'accepted';
          lineData.transfer[transferId].dispositionTime = utcDateNow();

          const transferOptions: SessionReferOptions = {
            requestDelegate: {
              onAccept: function (sip) {
                console.log('Attended transfer Accepted');
                if (!lineData.transfer) return;

                lineData.terminateBy = 'us';
                lineData.reasonCode = 202;
                lineData.reasonText = 'Attended Transfer';

                lineData.transfer[transferId].accept.complete = true;
                lineData.transfer[transferId].accept.disposition = sip.message.reasonPhrase ?? '';
                lineData.transfer[transferId].accept.eventTime = utcDateNow();

                // We must end this session manually
                session.bye().catch(function (error) {
                  console.warn('Could not BYE after blind transfer:', error);
                });
                request?.onAccept?.(lineObj.lineKey, sip);

                teardownSession(lineObj);
              },
              onReject: function (sip) {
                console.warn('Attended transfer rejected:', sip);
                if (!lineData.transfer) return;

                lineData.transfer[transferId].accept.complete = false;
                lineData.transfer[transferId].accept.disposition = sip.message.reasonPhrase ?? '';
                lineData.transfer[transferId].accept.eventTime = utcDateNow();
                request?.onReject?.(lineObj.lineKey, sip);
              },
            },
          };

          // Send REFER
          session.refer(newSession, transferOptions).catch(function (error) {
            console.warn('Failed to REFER', error);
          });
        },
        onReject: function (sip) {
          if (!lineData.transfer) return;
          console.log('New call session rejected: ', sip.message.reasonPhrase);
          lineData.transfer[transferId].disposition = sip.message.reasonPhrase ?? '';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
          request?.onReject?.(lineObj.lineKey, sip);
        },
      },
    };
    newSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    updateLine(lineObj);
  }

  /**
   * Cancel Transfered Call Session
   * @param lineObj
   * @param transferNumber
   * @returns
   */
  function cancelTransferSession(
    lineKey: LineType['lineKey'],
    transferNumber: LineType['lineKey'],
  ) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    const dstNo = String(transferNumber);
    if (dstNo === '') {
      console.warn('Cannot transfer, no number');
      return;
    }
    const lineObj = getLineByLineKey(lineKey);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    if (!lineObj.data.transfer) return;
    lineObj.data.transfer.forEach((transfer) => {
      if (transfer.to === transferNumber) transfer.onCancle?.();
    });

    toggleHoldSession(lineKey, false);

    updateLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */
  return {
    receiveSession,
    answerAudioSession,
    answerVideoSession,
    makeAudioSession,
    makeVideoSession,
    toggleLocalVideoTrack,
    toggleShareScreen,
    rejectSession,
    dialByNumber,
    endSession,
    recordSession,
    toggleMuteSession,
    toggleHoldSession,
    makeTransferSession,
    cancelTransferSession,
    cancelSession,
    teardownSession,
  };
};

/* -------------------------------------------------------------------------- */
/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export function teardownSession(lineObj: LineType, callback?: CallbackFunction) {
  const { removeLine } = getSipStore();
  if (lineObj == null || lineObj.sipSession == null) return;

  const session = lineObj.sipSession;
  const lineData = lineObj.data;
  if (lineData.teardownComplete == true) return;
  lineData.teardownComplete = true; // Run this code only once

  // Stop ongoing recording
  if (lineObj.data.recordMedia.recording) {
    lineObj.data.recordMedia.recorder?.stop();
  }

  // End any child calls
  // if (session.data.childsession) {
  //   session.data.childsession
  //     .dispose()
  //     .then(function () {
  //       session.data.childsession = null;
  //     })
  //     .catch(function (error) {
  //       console.error('teardownSession-dispose', { error });
  //       session.data.childsession = null;
  //       // Suppress message
  //     });
  // }

  // Mixed Tracks
  if (lineData.audioSourceTrack) {
    lineData.audioSourceTrack.stop();
    lineData.audioSourceTrack = null;
  }
  if (lineData.videoSourceTrack) {
    lineData.videoSourceTrack.stop();
    lineData.videoSourceTrack = null;
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
  lineKey: LineType['lineKey'],
  session: LineType['sipSession'],
  options?: { maxRetries?: number; delayMs?: number },
  value: boolean = true,
): Promise<void> {
  const maxRetries = options?.maxRetries ?? 5;
  const delayMs = options?.delayMs ?? 1000;
  let attempts = 0;

  return new Promise<void>((resolve, reject) => {
    const trySend = async () => {
      if (lineKey) return;
      const lineObj = getSipStore().getLineByLineKey(lineKey);
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
