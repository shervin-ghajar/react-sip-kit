import { RtcConfig, SipConfig } from '../../../../configs/types';
import { createLine } from '../../../../constructors';
import { getRtcStore } from '../../../../store';
import { LineDataType, LineType } from '../../../../store/types';
import { CallbackFunction, CallType } from '../../../../types';
import { utcDateNow } from '../../../../utils';
import { sessionEvents } from '../../events/session';
import { MediaStreamTrackType } from '../../events/session/types';
import {
  SipInvitationType,
  SipInviterType,
  SipLineType,
  SipSessionDescriptionHandler,
  SipSessionTransferType,
  SipSessionType,
  SipUserAgent,
} from '../../types';
import { sendMessageSession, sendVideoActivationWithAckRetry, teardownSession } from './shared';
import { spdOptions } from './spdOptions';
import {
  DialRequestDelegate,
  SendMessageSessionEnum,
  SendMessageSessionValueType,
  SPDOptionsType,
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
export const sessionMethods = ({ configKey }: { configKey: RtcConfig['key'] }) => {
  const configs = getRtcStore().configs?.[configKey] as SipConfig;
  const username = configs?.account.username ?? '';
  const getLineByLineKey = getRtcStore().getLineByLineKey;
  const addLine = getRtcStore().addLine;
  const updateLine = getRtcStore().updateLine;
  const userAgent = getRtcStore().engines?.[configKey] as SipUserAgent;

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
  } = sessionEvents();

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
    const lineObj = createLine<SipLineType>(configKey, username, remoteNumber);
    lineObj.session = invitation as SipInvitationType;
    const session = lineObj.session;
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
      localMediaStreamData: {
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
      },
      remoteMediaStreamData: {
        audio: {
          enabled: false,
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
      },
    };

    // Detect Video
    let isVideoCall = false;
    if (configs?.features.enableVideo && session.request.body) {
      // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
      // even if original invite does not specify video.
      if (session.request.body.indexOf('m=video') > -1) {
        lineObj.data.remoteMediaStreamData.video.enabled = true;
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
  function answerAudioSession(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);

    if (lineObj === null) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.session;
    if (!session || session instanceof Inviter) return;

    // Start SIP handling
    const spdOptions = answerAudioSpdOptions();
    if (!spdOptions) return console.error('answerAudioSession spdOptions is undefined');
    // MediaStreamStatus
    lineObj.data = {
      ...lineObj.data,
      localMediaStreamData: {
        audio: {
          enabled: !!configs?.media.audioInputDeviceId,
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
      },
      remoteMediaStreamData: {
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
      },

      videoInputDeviceId: null,
      audioInputDeviceId: configs?.media.audioInputDeviceId,
      audioOutputDeviceId: configs?.media.audioOutputDeviceId,
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
    lineObj: SipLineType,
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
    lineObj.session = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    const session = lineObj.session;

    lineObj.data = {
      ...lineObj.data,
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'outbound',
      remoteNumber: dialledNumber,
      username,
      startTime: startTime,
      videoInputDeviceId: null,
      audioInputDeviceId: configs?.media.audioInputDeviceId,
      audioOutputDeviceId: configs?.media.audioOutputDeviceId,
      terminateBy: 'them',
      // MediaStreamStatus
      localMediaStreamData: {
        audio: {
          enabled: !!configs?.media.audioInputDeviceId,
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
      },
      remoteMediaStreamData: {
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
  function answerVideoSession(lineKey: SipLineType['lineKey'], enableVideo?: boolean) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj || !configs) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.session;
    if (!session || session instanceof Inviter) return;

    // Start SIP handling
    const spdOptions = enableVideo ? answerVideoSpdOptions() : answerAudioSpdOptions();
    lineObj.data = {
      ...lineObj.data,
      localMediaStreamData: {
        audio: {
          enabled: !!configs.media.audioInputDeviceId,
          track: null,
        },
        video: {
          enabled: (enableVideo && !!configs.media.videoInputDeviceId) ?? true,
          track: null,
        },
        screen: {
          enabled: false,
          track: null,
        },
      },
      remoteMediaStreamData: {
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
      },
      videoInputDeviceId: configs.media.videoInputDeviceId,
      audioInputDeviceId: configs.media.audioInputDeviceId,
      audioOutputDeviceId: configs.media.audioOutputDeviceId,
    };

    // Send Answer
    session
      .accept(spdOptions)
      .then(async () => {
        try {
          await onInviteAccepted(lineObj, true);
          if (lineObj.data.localMediaStreamData.video?.enabled) {
            await sendVideoActivationWithAckRetry(
              lineKey,
              session,
              {
                delayMs: 2000,
                maxRetries: 10,
              },
              lineObj.data.localMediaStreamData.video.enabled,
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
    lineObj: SipLineType,
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

    lineObj.session = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    const session = lineObj.session;
    lineObj.data = {
      ...lineObj.data,
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'outbound',
      remoteNumber: dialledNumber,
      username,
      startTime: startTime,

      localMediaStreamData: {
        audio: {
          enabled: !!configs?.media.audioInputDeviceId,
          track: null,
        },
        video: {
          enabled: !!configs?.media.videoInputDeviceId,
          track: null,
        },
        screen: {
          enabled: false,
          track: null,
        },
      },
      remoteMediaStreamData: {
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
      },
      videoInputDeviceId: configs?.media.videoInputDeviceId,
      audioInputDeviceId: configs?.media.audioInputDeviceId,
      audioOutputDeviceId: configs?.media.audioOutputDeviceId,
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
            lineObj.data.localMediaStreamData?.video.enabled,
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
  const toggleLocalVideoTrack = async (lineKey: SipLineType['lineKey']) => {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj || !lineObj.session || lineObj.data.callType === 'audio') return;

    const localMediaStreamData = lineObj.data.localMediaStreamData;
    const videoSourceTrack = localMediaStreamData.video.track;
    const session = lineObj.session;

    if (!localMediaStreamData) return;

    const toggledLocalVideo = !localMediaStreamData.video.enabled;
    localMediaStreamData.video.enabled = toggledLocalVideo;

    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;

    const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video');

    if (localMediaStreamData.screen.enabled && videoSourceTrack) {
      videoSourceTrack.enabled = toggledLocalVideo;
    } else if (videoSender?.track) {
      // Just toggle camera track

      videoSender.track.enabled = toggledLocalVideo;
    } else if (videoSourceTrack && toggledLocalVideo) {
      // Reattach stored camera track if sender missing

      pc.addTrack(videoSourceTrack);
    }

    await sendMessageSession(session, SendMessageSessionEnum.VIDEO_TOGGLE, toggledLocalVideo);
    !localMediaStreamData.screen.enabled &&
      toggledLocalVideo &&
      // interval(
      //   () => {
      //     session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
      //   },
      //   2,
      //   200,
      // );
      updateLine(lineObj);
  };

  /**
   * Handle toggle share screen (CallType: video)
   * @param lineKey
   * @returns
   */
  async function toggleShareScreen(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj || !lineObj.session || lineObj.data.callType === 'audio') return;

    const session = lineObj.session;
    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;

    const localMediaStreamData = lineObj.data.localMediaStreamData;
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
          console.log({ videoSourceTrack });
          await videoSender.replaceTrack(videoSourceTrack);

          // Restore previous enabled state
          videoSourceTrack.enabled = videoEnabled ?? true;
        }

        // Properly stop screen capture (removes browser top header)
        if (screenSourceTrack) {
          screenSourceTrack.onended = null;
          screenSourceTrack.stop();
        }
      } catch (err) {
        console.error('Failed to restore camera:', err);
      }

      lineObj.data.localMediaStreamData.screen.track = undefined;
      lineObj.data.localMediaStreamData.screen.enabled = false;

      sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, false);

      // interval(
      //   () => {
      //     session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
      //   },
      //   2,
      //   200,
      // );
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
        lineObj.data.localMediaStreamData.screen.track = undefined;
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
      lineObj.data.localMediaStreamData.screen.track = newScreenTrack;

      await videoSender.replaceTrack(newScreenTrack);
      if (videoSender.track) videoSender.track.enabled = true;
      lineObj.data.localMediaStreamData.screen.enabled = true;

      // If user stops sharing from browser UI
      newScreenTrack.onended = () => {
        if (lineObj.data.localMediaStreamData?.screen.enabled) {
          toggleShareScreen(lineKey);
        }
      };

      sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, true);
      // interval(
      //   () => {
      //     session.initiateLocalMediaStreams({ type: 'video', stopStream: false });
      //   },
      //   2,
      //   200,
      // );
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
  function rejectSession(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineKey + ')');
      return;
    }
    const session = lineObj.session;
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
    const userAgent = getRtcStore().engines?.[configKey] as SipUserAgent;
    if (!(userAgent && userAgent?.isRegistered())) {
      alert(`SIP userAgent for ${configKey} not registered`);
      return;
    }

    // Create a Line
    const lineObj = createLine<SipLineType>(configKey, username, dialNumber);

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
  async function toggleHoldSession(lineKey: SipLineType['lineKey'], forcedValue?: boolean) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj?.session) return;
    const session = lineObj.session;
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
  function toggleMuteSession(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (lineObj == null || lineObj.session == null) return;

    const session = lineObj.session;
    const lineData = lineObj.data;

    if (!lineData.localMediaStreamData) return;
    if (!session?.sessionDescriptionHandler?.peerConnection) return;
    const toggledSound = !lineData.localMediaStreamData.audio.enabled;
    lineData.localMediaStreamData.audio.enabled = toggledSound; //Toggle sound
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
        const track = RTCRtpSender.track as MediaStreamTrackType;
        track.enabled = toggledSound;
        lineData.localMediaStreamData.audio.track = track;
      }
    });

    sendMessageSession(session, SendMessageSessionEnum.SOUND_TOGGLE, toggledSound);
    // session.initiateLocalMediaStreams({ type: 'audio', stopStream: true });
    updateLine(lineObj);
  }

  /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
  /**
   * Cancle And Terminate Call Session
   * @param lineKey
   * @returns
   */
  function cancelSession(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (lineObj == null || lineObj.session == null) return;
    const session = lineObj.session;
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
  function endSession(lineKey: SipLineType['lineKey']) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineKey + ')');
      return;
    }
    const session = lineObj.session;
    if (!session) return;
    // session?.initiateLocalMediaStreams &&
    //   interval(
    //     () => {
    //       session.initiateLocalMediaStreams({ type: 'video', stopStream: true });
    //     },
    //     2,
    //     100,
    //   );
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
  function recordSession(lineKey: SipLineType['lineKey']) {
    async function start() {
      const lineObj = getLineByLineKey<SipLineType>(lineKey);
      if (!lineObj?.session) {
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
        const pc = lineObj.session.sessionDescriptionHandler.peerConnection;

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
      const lineObj = getLineByLineKey<SipLineType>(lineKey);
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

  /* -------------------------------- TRANSFER -------------------------------- */
  /**
   * Start Transfer Call Session
   * @param lineKey
   * @param transferNumber
   */
  async function makeTransferSession(
    type: SipSessionTransferType['type'],
    lineKey: SipLineType['lineKey'],
    transferNumber: SipLineType['lineKey'],
    request?: DialRequestDelegate,
  ) {
    await toggleHoldSession(lineKey, true);
    await handleTransferSession(type, lineKey, transferNumber, request);
  }

  /**
   * Attend Transfer Call Session
   * @param lineObj
   * @param transferNumber
   * @returns
   */
  async function handleTransferSession(
    type: SipSessionTransferType['type'],
    lineKey: SipLineType['lineKey'],
    transferNumber: SipLineType['remoteNumber'],
    request?: DialRequestDelegate,
  ) {
    const userAgent = getRtcStore().engines?.[configKey] as SipUserAgent;
    if (!(userAgent && userAgent?.isRegistered())) {
      alert(`SIP userAgent for ${configKey} not registered`);
      return;
    }
    const remoteNumber = String(transferNumber);
    if (remoteNumber === '') {
      console.warn('Cannot transfer, no number');
      return;
    }

    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj?.session) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.session;
    const lineData = lineObj.data;
    if (!session) return;
    if (!lineData.transfer) lineData.transfer = [];
    lineData.transfer.push({
      type: type,
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
    const isVideoCall = lineData.callType === 'video';

    // SDP options
    const spdOptions: SPDOptionsType = isVideoCall ? makeVideoSpdOptions() : makeAudioSpdOptions();

    // Create new call session
    const targetURI = UserAgent.makeURI(
      'sip:' + remoteNumber.replace(/#/g, '%23') + '@' + configs?.account.domain,
    ) as URI;
    const newSession = new Inviter(userAgent, targetURI, spdOptions);

    newSession.delegate = {
      onRefer(referral) {
        console.log('onRefer');
      },
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
          isVideoCall,
        );
      },
    };
    lineObj.childSession = newSession as SipSessionType;
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        onTrying: function (sip) {
          if (!lineData.transfer) return;
          lineData.transfer[transferId].disposition = 'trying';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
          request?.onTrying?.(lineObj.lineKey, sip);
          updateLine(lineObj);
        },
        onProgress: async function (sip) {
          console.log('onProgress', lineData.transfer);
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
            updateLine(lineObj);
          };
          request?.onProgress?.(lineObj.lineKey, sip);
          console.log('New call session onProgress');

          updateLine(lineObj);
        },
        onRedirect: function (sip) {
          console.log('Redirect received:', sip);
          request?.onRedirect?.(lineObj.lineKey, sip);
        },
        onAccept: function (sip) {
          if (!lineData.transfer) return;
          lineData.transfer[transferId].disposition = 'accepted';
          lineData.transfer[transferId].dispositionTime = utcDateNow();

          onTransferRefer(lineKey, targetURI, transferId, request);
        },
        onReject: function (sip) {
          if (!lineData.transfer) return;
          console.log('New call session rejected: ', sip.message.reasonPhrase);
          lineData.transfer[transferId].disposition = sip.message.reasonPhrase ?? '';
          lineData.transfer[transferId].dispositionTime = utcDateNow();
          request?.onReject?.(lineObj.lineKey, sip);
          updateLine(lineObj);
        },
      },
    };
    if (type === 'blind') {
      onTransferRefer(lineKey, targetURI, transferId, request);
    } else
      await newSession.invite(inviterOptions).catch(function (e) {
        console.warn('Failed to send INVITE:', e);
      });
    updateLine(lineObj);
  }

  const onTransferRefer = (
    lineKey: string,
    targetURI: URI,
    transferId: number,
    request?: DialRequestDelegate,
  ) => {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj?.session) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.session;
    const lineData = lineObj.data;
    if (!lineObj.childSession) return;
    const transferOptions: SessionReferOptions = {
      requestDelegate: {
        onAccept: async function (sip) {
          console.log('Attended transfer Accepted');
          if (!lineData.transfer) return;

          lineData.terminateBy = 'us';
          lineData.reasonCode = 202;
          lineData.reasonText = 'Attended Transfer';

          lineData.transfer[transferId].accept.complete = true;
          lineData.transfer[transferId].accept.disposition = sip.message.reasonPhrase ?? '';
          lineData.transfer[transferId].accept.eventTime = utcDateNow();

          request?.onAccept?.(lineObj.lineKey, sip);
          // We must end this session manually
          endSession(lineKey);
        },
        onReject: function (sip) {
          console.warn('Attended transfer rejected:', sip);
          if (!lineData.transfer) return;

          lineData.transfer[transferId].accept.complete = false;
          lineData.transfer[transferId].accept.disposition = sip.message.reasonPhrase ?? '';
          lineData.transfer[transferId].accept.eventTime = utcDateNow();
          request?.onReject?.(lineObj.lineKey, sip);
          updateLine(lineObj);
        },
      },
    };

    // Send REFER
    session
      .refer(
        lineData.transfer[transferId].type === 'blind' ? targetURI : lineObj.childSession,
        transferOptions,
      )
      .catch(function (error) {
        console.warn('Failed to REFER', error);
      });
  };

  /**
   * Cancel Transfered Call Session
   * @param lineObj
   * @param transferNumber
   * @returns
   */
  async function cancelTransferSession(
    lineKey: SipLineType['lineKey'],
    transferNumber: SipLineType['lineKey'],
  ) {
    const remoteNumber = String(transferNumber);
    if (remoteNumber === '') {
      console.warn('Cannot transfer, no number');
      return;
    }
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj?.session) {
      console.warn('Null line or session');
      return;
    }

    if (!lineObj.data.transfer) return;
    lineObj.data.transfer.forEach((transfer) => {
      if (transfer.to === transferNumber) transfer.onCancle?.();
    });

    await toggleHoldSession(lineKey, false);

    updateLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */
  async function setMediaStreamConfigs(
    lineKey: LineType['lineKey'],
    configs: Partial<
      Pick<LineDataType, 'audioInputDeviceId' | 'audioOutputDeviceId' | 'videoInputDeviceId'>
    >,
  ) {
    const lineObj = getLineByLineKey<SipLineType>(lineKey);
    if (!lineObj) return;

    const { audioInputDeviceId: newAudioInputId, videoInputDeviceId: newVideoInputId } = configs;

    // Previous device ids (before change)
    const prevAudioInputId = lineObj.data.audioInputDeviceId;
    const prevVideoInputId = lineObj.data.videoInputDeviceId;

    // 1) Persist the config change onto the line
    const nextLineObj: SipLineType = {
      ...lineObj,
      ...configs,
    };
    updateLine(nextLineObj);

    // 2) Handle audio input device switching (during call)
    if (typeof newAudioInputId !== 'undefined' && newAudioInputId !== prevAudioInputId) {
      try {
        await switchAudioInputDevice(nextLineObj, newAudioInputId);
      } catch (err) {
        console.error('[setMediaStreamConfigs] switchAudioInputDevice failed', err);
      }
    }

    // 3) Handle video input device switching (during call)
    if (typeof newVideoInputId !== 'undefined' && newVideoInputId !== prevVideoInputId) {
      try {
        await switchVideoInputDevice(nextLineObj, newVideoInputId);
      } catch (err) {
        console.error('[setMediaStreamConfigs] switchVideoInputDevice failed', err);
      }
    }
  }

  async function switchAudioInputDevice(
    line: SipLineType,
    audioInputDeviceId: string | null | undefined,
  ) {
    const pc = line.session?.sessionDescriptionHandler.peerConnection;
    if (!pc) return;

    const lineData = line as any as LineDataType; // if you separate types, adjust

    const soundEnabled = lineData.localMediaStreamData.audio.enabled;

    let audioConstraints: MediaStreamConstraints['audio'];

    if (audioInputDeviceId === null) {
      // explicit "system default"
      audioConstraints = true;
    } else if (audioInputDeviceId && audioInputDeviceId !== 'default') {
      audioConstraints = { deviceId: { exact: audioInputDeviceId } };
    } else {
      // undefined or "default": keep using default
      audioConstraints = true;
    }

    // Get new track from the chosen device
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
      video: false,
    });

    const newAudioTrack = stream.getAudioTracks()[0];
    if (!newAudioTrack) {
      console.warn('[switchAudioInputDevice] No audio track from getUserMedia');
      return;
    }

    const oldTrack = lineData.localMediaStreamData.audio?.track ?? null;

    // Set enabled flag (preserve previous state if possible)
    const wasEnabled = soundEnabled ? soundEnabled : (oldTrack?.enabled ?? true);

    newAudioTrack.enabled = wasEnabled;

    // Replace in PeerConnection sender
    const sender = pc.getSenders().find((s: RTCRtpSender) => s.track?.kind === 'audio');
    if (sender) {
      await sender.replaceTrack(newAudioTrack);
    } else {
      pc.addTrack(newAudioTrack);
    }

    // Update lineData state for React components (Audio renderer)
    lineData.localMediaStreamData.audio.track = newAudioTrack;
    lineData.localMediaStreamData.audio.enabled = wasEnabled;

    updateLine(lineData as any as SipLineType);

    // Stop old track to free resources
    oldTrack?.stop();
  }

  async function switchVideoInputDevice(
    line: SipLineType,
    videoInputDeviceId: string | null | undefined,
  ) {
    const pc = line.session?.sessionDescriptionHandler.peerConnection;
    if (!pc) return;

    const lineObj = line;
    const lineData = lineObj.data;
    const videoState = lineData.localMediaStreamData.video;
    const videoEnabled = !!videoState.enabled;

    // You can decide: if video is OFF and user changes device, do we open camera now?
    // Here: we still open the device, but keep track.enabled = videoEnabled
    let videoConstraints: MediaStreamConstraints['video'];

    if (videoInputDeviceId === null && videoEnabled) {
      videoConstraints = true;
    } else if (videoInputDeviceId && videoInputDeviceId !== 'default') {
      videoConstraints = { deviceId: { exact: videoInputDeviceId } };
    } else {
      videoConstraints = videoEnabled || videoInputDeviceId === null ? true : false;
    }

    if (!videoConstraints) {
      // If videoEnabled is false and we decide not to open a new stream
      // you might just keep existing track disabled.
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
    const newVideoTrack = stream.getVideoTracks()[0];

    if (!newVideoTrack) {
      console.warn('[switchVideoInputDevice] No video track from getUserMedia');
      return;
    }

    const oldTrack = videoState.track ?? null;

    newVideoTrack.enabled = videoEnabled;

    const sender = pc.getSenders().find((s: RTCRtpSender) => s.track?.kind === 'video');
    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    } else {
      pc.addTrack(newVideoTrack);
    }

    // Update store / line data
    lineData.localMediaStreamData.video = {
      ...videoState,
      track: newVideoTrack,
      enabled: videoEnabled,
    };

    oldTrack?.stop();

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
    setMediaStreamConfigs,
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
