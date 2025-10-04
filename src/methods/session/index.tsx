import { SipConfigs } from '../../configs/types';
import { Line } from '../../constructors';
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
import { CallType } from '../../types';
import { utcDateNow } from '../../utils';
import { spdOptions } from './spdOptions';
import {
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
  const findLineByLineKey = getSipStore().findLineByLineKey;
  const getNewLineKey = getSipStore().getNewLineKey;
  const addLine = getSipStore().addLine;
  const updateLine = getSipStore().updateLine;
  const userAgent = getSipStore().userAgents?.[configKey];
  const { hasAudioDevice, hasVideoDevice } = getSipStore().devicesInfo;

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
    let callerID = invitation.remoteIdentity.uri.user || invitation.remoteIdentity.displayName;

    console.log(`Incoming call from: ${callerID}`);

    // Create or update buddy based on DID
    const lineObj = new Line(configKey, username, getNewLineKey(), callerID);
    lineObj.sipSession = invitation as SipInvitationType;
    const session = lineObj.sipSession;
    session.data = {};
    session.data.configKey = lineObj.configKey;
    session.data.lineKey = lineObj.lineKey;
    session.data.callDirection = 'inbound';
    session.data.terminateBy = '';
    session.data.remoteNumber = callerID;
    session.data.username = lineObj.username;
    session.data.earlyReject = false;
    session.data.callType = 'audio';
    //MediaStreamStatus
    session.data.localMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: true,
      videoEnabled: false,
    };
    session.data.remoteMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: false,
      videoEnabled: false,
    };
    // Detect Video
    if (configs?.features.enableVideo && session.request.body) {
      // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
      // even if original invite does not specify video.
      if (session.request.body.indexOf('m=video') > -1) {
        session.data.remoteMediaStreamStatus.videoEnabled = true;
        session.data.callType = 'video';
        // The invite may have video, but the buddy may be a contact
      }
    }
    const isVideoCall = session.data.callType === 'video';
    // Extract P-Asserted-Identity if available
    const sipHeaders = session.incomingInviteRequest.message.headers;
    if (sipHeaders['P-Asserted-Identity']) {
      const rawUri = sipHeaders['P-Asserted-Identity'][0].raw;
      if (rawUri.includes('<sip:')) {
        const uriParts = rawUri.split('<sip:');
        if (uriParts[1].endsWith('>')) uriParts[1] = uriParts[1].slice(0, -1);
        if (uriParts[1].includes(`@${configs?.account.domain}`)) {
          callerID = uriParts[1].split('@')[0];
          console.log('Using P-Asserted-Identity:', callerID);
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
    // Check vitals
    if (!hasAudioDevice) {
      alert('No audio device detected!');
      return;
    }

    const lineObj = findLineByLineKey(lineKey);

    if (lineObj === null) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session || session instanceof Inviter) return;
    // Stop the ringtone
    if (session.data.ringerObj) {
      session.data.ringerObj.pause();
      session.data.ringerObj.removeAttribute('src');
      session.data.ringerObj.load();
      session.data.ringerObj = null;
    }

    // Start SIP handling
    const spdOptions = answerAudioSpdOptions();
    if (!spdOptions) return console.error('answerAudioSession spdOptions is undefined');
    // MediaStreamStatus
    session.data.localMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: hasAudioDevice,
      videoEnabled: false,
    };
    session.data.remoteMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: true,
      videoEnabled: false,
    };
    session.data.videoSourceDevice = null;
    session.data.audioSourceDevice = configs?.media.audioInputDeviceId;
    session.data.audioOutputDevice = configs?.media.audioOutputDeviceId;

    // Send Answer
    session
      .accept(spdOptions)
      .then(function () {
        onInviteAccepted(lineObj, false);
      })
      .catch(function (error: any) {
        console.warn('Failed to answer call', error, session);
        session.data.reasonCode = 500;
        session.data.reasonText = 'Client Error';
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
    extraHeaders?: Array<string>,
  ) {
    console.log(222, { lineObj, dialledNumber, extraHeaders });
    if (!userAgent) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj === null) return;
    if (!hasAudioDevice) {
      alert('No audio device detected!');
      return;
    }
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

    session.data = {
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
        soundEnabled: hasAudioDevice,
        videoEnabled: false,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      earlyReject: false,
    };
    session.data.callType = 'audio';
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
        // OutgoingRequestDelegate
        onTrying: function (sip) {
          console.log('makeAudioSession 1');
          onInviteTrying(lineObj, sip);
        },
        onProgress: function (sip) {
          console.log('makeAudioSession 2');
          onInviteProgress(lineObj, sip);
        },
        onRedirect: function (sip) {
          console.log('makeAudioSession 3');
          onInviteRedirected(lineObj, sip);
        },
        onAccept: function (sip) {
          console.log('makeAudioSession 4');
          onInviteAccepted(lineObj, false, sip);
        },
        onReject: function (sip) {
          console.log('makeAudioSession 5');
          onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
        },
      },
    };
    session.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj);
  }

  /**
   * Handle inbound video calls
   * @param lineKey
   * @returns
   */
  function answerVideoSession(lineKey: LineType['lineKey'], enableVideo?: boolean) {
    const lineObj = findLineByLineKey(lineKey);
    if (!lineObj || !configs) {
      console.warn('Failed to get line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session || session instanceof Inviter) return;
    // Stop the ringtone
    if (session.data.ringerObj) {
      session.data.ringerObj.pause();
      session.data.ringerObj.removeAttribute('src');
      session.data.ringerObj.load();
      session.data.ringerObj = null;
    }
    // Check vitals
    if (!hasAudioDevice) {
      alert('No audio device detected!');
      return;
    }

    // Start SIP handling
    const spdOptions = answerVideoSpdOptions();

    session.data.localMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: true,
      videoEnabled: enableVideo ?? true,
    };
    session.data.remoteMediaStreamStatus = {
      screenShareEnabled: false,
      soundEnabled: true,
      videoEnabled: true,
    };
    session.data.videoSourceDevice = configs.media.videoInputDeviceId;
    session.data.audioSourceDevice = configs.media.audioInputDeviceId;
    session.data.audioOutputDevice = configs.media.audioOutputDeviceId;

    // Send Answer
    session
      .accept(spdOptions)
      .then(async () => {
        try {
          await onInviteAccepted(lineObj, true);
          if (session.data.localMediaStreamStatus?.videoEnabled) {
            await sendVideoActivationWithAckRetry(session, {
              delayMs: 2000,
              maxRetries: 10,
            });
          }
        } catch (error) {
          console.error('AnswerVideoSession onStateChange', error);
        }
      })
      .catch(function (error) {
        console.warn('Failed to answer call', error, session);
        session.data.reasonCode = 500;
        session.data.reasonText = 'Client Error';
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
    extraHeaders?: Array<string>,
  ) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj == null) return;

    if (!hasAudioDevice) {
      alert('No audio device detected!');
      return;
    }

    if (!hasVideoDevice) {
      console.warn('No video devices (webcam) found, switching to audio call.');
      makeAudioSession(lineObj, dialledNumber);
      return;
    }

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
    session.data = {
      configKey: lineObj.configKey,
      lineKey: lineObj.lineKey,
      callDirection: 'outbound',
      remoteNumber: dialledNumber,
      username,
      startTime: startTime,
      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: true,
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
    };
    session.data.callType = 'video';
    session.data.earlyReject = false;
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
        },
        onProgress: function (sip) {
          onInviteProgress(lineObj, sip);
        },
        onRedirect: function (sip) {
          onInviteRedirected(lineObj, sip);
        },
        onAccept: function (sip) {
          onInviteAccepted(lineObj, true, sip);
        },
        onReject: function (sip) {
          onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
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
    const lineObj = findLineByLineKey(lineKey);
    if (!lineObj || !lineObj.sipSession || lineObj.sipSession.data.callType === 'audio') return;

    const session = lineObj.sipSession;
    if (!session.data.localMediaStreamStatus || !session.data.remoteMediaStreamStatus) return;
    const screenShareEnabled = session.data.localMediaStreamStatus.screenShareEnabled;
    if (screenShareEnabled) await toggleShareScreen(lineKey);
    const toggledLocalVideo = !session.data.localMediaStreamStatus.videoEnabled;
    session.data.localMediaStreamStatus.videoEnabled = toggledLocalVideo;

    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;

    const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video');

    if (videoSender) {
      // Just toggle track.enabled
      if (videoSender.track) {
        videoSender.track.enabled = toggledLocalVideo;
      }
    } else if (toggledLocalVideo) {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const cameraTrack = cameraStream.getVideoTracks()[0];
        pc.addTrack(cameraTrack); // Add new video track to connection
      } catch (err) {
        console.error('Failed to get video track:', err);
        return;
      }
    }

    await sendMessageSession(session, SendMessageSessionEnum.VIDEO_TOGGLE, toggledLocalVideo);
    updateLine(lineObj);
  };

  /**
   * Handle toggle share screen (CallType: video)
   * @param lineKey
   * @returns
   */
  async function toggleShareScreen(lineKey: LineType['lineKey']) {
    const lineObj = findLineByLineKey(lineKey);
    if (!lineObj || !lineObj.sipSession || lineObj.sipSession.data.callType === 'audio') return;

    const session = lineObj.sipSession;
    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc || !session.data.localMediaStreamStatus) return;

    const screenShareEnabled = session.data.localMediaStreamStatus.screenShareEnabled;

    if (screenShareEnabled) {
      // === STOP screen sharing ===
      const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video');
      if (videoSender?.track) {
        // await videoSender.replaceTrack(null); // Optional: remove track
        const wasCameraEnabled = session.data.localMediaStreamStatus.videoEnabled;
        videoSender.track.enabled = wasCameraEnabled; // Stop screen track
      }

      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const cameraTrack = cameraStream.getVideoTracks()[0];

        if (videoSender) {
          await videoSender.replaceTrack(cameraTrack);
        } else {
          pc.addTrack(cameraTrack);
        }
      } catch (err) {
        console.error('Failed to restore camera:', err);
      }

      session.data.localMediaStreamStatus.screenShareEnabled = false;
      sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, false);
    } else {
      // === START screen sharing ===
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = displayStream.getVideoTracks()[0];

        screenTrack.onended = () => {
          console.log('Screen share ended, restoring camera');
          toggleShareScreen(lineKey);
        };

        let videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');

        if (videoSender) {
          await videoSender.replaceTrack(screenTrack);
        } else {
          pc.addTrack(screenTrack);
          videoSender = pc.getSenders().find((s) => s.track === screenTrack);
        }

        session.data.localMediaStreamStatus.screenShareEnabled = true;
        sendMessageSession(session, SendMessageSessionEnum.SCREEN_SHARE_TOGGLE, true);
      } catch (err) {
        console.error('Screen share failed:', err);
        return;
      }
    }
    updateLine(lineObj);
  }

  /**
   * Handle reject calls
   * @param lineKey
   * @returns
   */
  function rejectSession(lineKey: LineType['lineKey']) {
    const lineObj = findLineByLineKey(lineKey);
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

    session.data.terminateBy = 'us';
    session.data.reasonCode = 486;
    session.data.reasonText = 'Busy Here';
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
    extraHeaders?: Array<string>,
  ) {
    const userAgent = getSipStore().userAgents?.[configKey];
    if (!(userAgent && userAgent?.isRegistered())) {
      alert(`SIP userAgent for ${configKey} not registered`);
      return;
    }

    if (!hasAudioDevice) {
      alert('No audio device detected!');
      return;
    }

    // Create a Line
    const lineObj = new Line(configKey, username, getNewLineKey(), dialNumber);

    // Start Call Invite
    if (type === 'audio') {
      makeAudioSession(lineObj, dialNumber, extraHeaders);
    } else {
      makeVideoSession(lineObj, dialNumber, extraHeaders ?? []);
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
  function toggleHoldSession(lineKey: LineType['lineKey'], forcedValue?: boolean) {
    const lineObj = findLineByLineKey(lineKey);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (session.data.isHold === forcedValue) return;
    console.log('Toggle Call on hold:', lineKey);
    const toggledHold = forcedValue ?? !(session.data.isHold ?? false);
    const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
    sessionDescriptionHandlerOptions.hold = toggledHold;
    session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

    if (
      session &&
      session.sessionDescriptionHandler &&
      session.sessionDescriptionHandler.peerConnection
    ) {
      const pc = session.sessionDescriptionHandler.peerConnection;
      // Stop all the inbound streams
      pc.getReceivers().forEach(function (RTCRtpReceiver) {
        if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = toggledHold;
      });
      // Stop all the outbound streams (especially useful for Conference Calls!!)
      pc.getSenders().forEach(function (RTCRtpSender) {
        // Mute Audio
        const track = RTCRtpSender.track as MediaStreamTrackType;
        if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
          if (track.IsMixedTrack == true) {
            if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
              console.log('Toggle Mixed Audio Track : ' + session.data.audioSourceTrack.label);
              session.data.audioSourceTrack.enabled = toggledHold;
            }
          }
          console.log('Toggle Audio Track : ' + track.label);
          track.enabled = toggledHold;
        }
        // Stop Video
        else if (track && track.kind == 'video') {
          track.enabled = toggledHold;
        }
      });
    }
    console.log('Call is is on hold:', lineKey);

    session.data.isHold = toggledHold;

    updateLine(lineObj);
  }

  /* ------------------------------- TOGGLE-MUTE ------------------------------ */
  /**
   * Toggle-Mute Call Session
   * @param lineKey
   * @returns
   */
  function toggleMuteSession(lineKey: LineType['lineKey']) {
    const lineObj = findLineByLineKey(lineKey);
    if (lineObj == null || lineObj.sipSession == null) return;

    const session = lineObj.sipSession;
    if (!session.data.localMediaStreamStatus) return;
    const toggledSound = !session.data.localMediaStreamStatus.soundEnabled;
    session.data.localMediaStreamStatus.soundEnabled = toggledSound; //Toggle sound
    if (
      session &&
      session.sessionDescriptionHandler &&
      session.sessionDescriptionHandler.peerConnection
    ) {
      const pc = session.sessionDescriptionHandler.peerConnection;
      pc.getSenders().forEach(function (RTCRtpSender) {
        if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
          const track = RTCRtpSender.track as MediaStreamTrackType;

          if (track.IsMixedTrack == true) {
            if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
              console.log('Toggle Mixed Audio Track : ' + session.data.audioSourceTrack.label);
              session.data.audioSourceTrack.enabled = toggledSound;
            }
          }
          console.log('Toggle Audio Track : ' + track.label);
          track.enabled = toggledSound;
        }
      });
    }

    sendMessageSession(session, SendMessageSessionEnum.SOUND_TOGGLE, toggledSound);
    updateLine(lineObj);
  }

  /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
  /**
   * Cancle And Terminate Call Session
   * @param lineKey
   * @returns
   */
  function cancelSession(lineKey: LineType['lineKey']) {
    const lineObj = findLineByLineKey(lineKey);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (!(session instanceof Inviter)) return;
    session.data.terminateBy = 'us';
    session.data.reasonCode = 0;
    session.data.reasonText = 'Call Cancelled';

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
    const lineObj = findLineByLineKey(lineKey);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineKey + ')');
      return;
    }
    const session = lineObj.sipSession;
    if (!session) return;
    switch (session.state) {
      case SessionState.Initial:
      case SessionState.Establishing:
        if (session instanceof Inviter) {
          // An unestablished outgoing session
          session.data.terminateBy = 'us';
          session.data.reasonCode = 0;
          session.data.reasonText = 'Call Cancelled';
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

          session.data.terminateBy = 'us';
          session.data.reasonCode = 486;
          session.data.reasonText = 'Busy Here';
          teardownSession(lineObj);
        }
        break;
      case SessionState.Established:
        session.bye().catch(function (e) {
          console.warn('Problem in rejectSession(), could not bye() call', e, session);
        });

        session.data.terminateBy = 'us';
        session.data.reasonCode = 486;
        session.data.reasonText = 'Busy Here';
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
      const lineObj = findLineByLineKey(lineKey);
      if (!lineObj?.sipSession) {
        console.warn(`Line ${lineKey} not found or has no SIP session`);
        return;
      }
      const isVideoCall = lineObj.sipSession.data.callType === 'video';

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
          if (!lineObj?.sipSession?.data.recordMedia) return;
          lineObj.sipSession.data.recordMedia = {
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
        lineObj.sipSession.data.recordMedia = {
          recorder,
          recording: true,
          startTime: utcDateNow(),
        };
        updateLine(lineObj);

        console.log('Recording started for line', lineKey);
      } catch (err) {
        console.error('Failed to start recording:', err);
        if (!lineObj?.sipSession?.data.recordMedia) return;
        lineObj.sipSession.data.recordMedia = {
          recorder: null,
          recording: false,
          startTime: null,
        };
        updateLine(lineObj);
      }
    }

    function stop() {
      const lineObj = findLineByLineKey(lineKey);
      if (!lineObj?.sipSession) return;
      const recorder = lineObj?.sipSession?.data.recordMedia?.recorder;
      if (!recorder) {
        console.warn(`No active recorder for line ${lineKey}`);
        return;
      }

      recorder.stop();
      lineObj.sipSession.data.recordMedia = {
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

    const lineObj = findLineByLineKey(lineKey);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.sipSession;
    if (!session) return;
    if (!session.data.transfer) session.data.transfer = [];
    session.data.transfer.push({
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
    const transferId = session.data.transfer.length - 1;

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
    if (session.data.audioSourceDevice && session.data.audioSourceDevice != 'default') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: session.data.audioSourceDevice,
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
    if (session.data.localMediaStreamStatus?.videoEnabled) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video = {} as any;
      const video = spdOptions.sessionDescriptionHandlerOptions.constraints
        .video as VideoSessionConstraints;
      if (session.data.videoSourceDevice && session.data.videoSourceDevice != 'default') {
        video.deviceId = {
          exact: session.data.videoSourceDevice,
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
    newSession.data = {};
    newSession.delegate = {
      onBye: function () {
        console.log('New call session ended with BYE');
        if (session.data.transfer) {
          session.data.transfer[transferId].disposition = 'bye';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
        }
      },
      onSessionDescriptionHandler: function (sdh: SipSessionDescriptionHandler) {
        onTransferSessionDescriptionHandlerCreated(
          lineObj,
          session as SipSessionType,
          sdh,
          session?.data?.localMediaStreamStatus?.videoEnabled,
        );
      },
    };
    session.data.childsession = newSession as SipSessionType;
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        onTrying: function () {
          if (!session.data.transfer) return;
          session.data.transfer[transferId].disposition = 'trying';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
        },
        onProgress: function () {
          console.log('onProgress');
          if (!session.data.transfer) return;
          session.data.transfer[transferId].disposition = 'progress';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
          session.data.transfer[transferId].onCancle = () => {
            newSession.cancel().catch(function (error) {
              console.warn('Failed to CANCEL', error);
            });
            if (!session.data.transfer) return;
            session.data.transfer[transferId].accept.complete = false;
            session.data.transfer[transferId].accept.disposition = 'cancel';
            session.data.transfer[transferId].accept.eventTime = utcDateNow();
          };
          console.log('New call session canceled');
        },
        onRedirect: function (sip) {
          console.log('Redirect received:', sip);
        },
        onAccept: function () {
          if (!session.data.transfer) return;
          session.data.transfer[transferId].disposition = 'accepted';
          session.data.transfer[transferId].dispositionTime = utcDateNow();

          const transferOptions: SessionReferOptions = {
            requestDelegate: {
              onAccept: function (sip) {
                console.log('Attended transfer Accepted');
                if (!session.data.transfer) return;

                session.data.terminateBy = 'us';
                session.data.reasonCode = 202;
                session.data.reasonText = 'Attended Transfer';

                session.data.transfer[transferId].accept.complete = true;
                session.data.transfer[transferId].accept.disposition =
                  sip.message.reasonPhrase ?? '';
                session.data.transfer[transferId].accept.eventTime = utcDateNow();

                // We must end this session manually
                session.bye().catch(function (error) {
                  console.warn('Could not BYE after blind transfer:', error);
                });

                teardownSession(lineObj);
              },
              onReject: function (sip) {
                console.warn('Attended transfer rejected:', sip);
                if (!session.data.transfer) return;

                session.data.transfer[transferId].accept.complete = false;
                session.data.transfer[transferId].accept.disposition =
                  sip.message.reasonPhrase ?? '';
                session.data.transfer[transferId].accept.eventTime = utcDateNow();
              },
            },
          };

          // Send REFER
          session.refer(newSession, transferOptions).catch(function (error) {
            console.warn('Failed to REFER', error);
          });
        },
        onReject: function (sip) {
          if (!session.data.transfer) return;
          console.log('New call session rejected: ', sip.message.reasonPhrase);
          session.data.transfer[transferId].disposition = sip.message.reasonPhrase ?? '';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
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
    const lineObj = findLineByLineKey(lineKey);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.sipSession;
    if (!session) return;
    if (!session.data.transfer) return;
    session.data.transfer.forEach((transfer) => {
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
  //   StopRecording(lineObj.LineKey, true);

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

  removeLine(lineObj.lineKey);
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
      if (!session?.data?.lineKey) return;
      const ackReceived = getSipStore().getSessionByLineKey(session?.data?.lineKey)?.data
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
