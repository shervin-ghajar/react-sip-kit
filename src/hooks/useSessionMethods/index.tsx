import { Line } from '../../constructors';
import { useSipStore } from '../../store';
import {
  LineType,
  SipInvitationType,
  SipInviterType,
  SipSessionDescriptionHandler,
  SipSessionType,
} from '../../store/types';
import { dayJs, utcDateNow } from '../../utils';
import { useSessionEvents } from '../useSessionEvents';
import { MediaStreamTrackType } from '../useSessionEvents/types';
import { useSpdOptions } from '../useSpdOptions';
import { SPDOptionsType, VideoSessionConstraints } from './types';
import {
  Inviter,
  InviterInviteOptions,
  SessionReferOptions,
  SessionState,
  URI,
  UserAgent,
  Web,
} from 'sip.js';

export const useSessionMethods = () => {
  const configs = useSipStore((state) => state.configs);
  const findLineByNumber = useSipStore((state) => state.findLineByNumber);
  const getNewLineNumber = useSipStore((state) => state.getNewLineNumber);
  const addLine = useSipStore((state) => state.addLine);
  const removeLine = useSipStore((state) => state.removeLine);
  const updateLine = useSipStore((state) => state.updateLine);
  const countIdSessions = useSipStore((state) => state.countIdSessions);
  const userAgent = useSipStore((state) => state.userAgent);
  const audioBlobs = useSipStore((state) => state.audioBlobs);
  const { hasAudioDevice, hasVideoDevice } = useSipStore((state) => state.devicesInfo);

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
  } = useSessionEvents();

  const { answerAudioSpdOptions, makeAudioSpdOptions, answerVideoSpdOptions, makeVideoSpdOptions } =
    useSpdOptions();
  /* -------------------------------------------------------------------------- */
  /*                       Init-Session Call Functionality                      */
  /* -------------------------------------------------------------------------- */
  /**
   * Handle incoming calls
   * @param session
   * @returns
   */
  function receiveSession(session: SipInvitationType) {
    console.log('receiveSession', { session });
    const callerID = session.remoteIdentity.displayName || session.remoteIdentity.uri.user || '';
    let did = session.remoteIdentity.uri.user ?? '';

    console.log(`Incoming call from: ${callerID}`);

    const startTime = dayJs.utc().toISOString();
    // Create or update buddy based on DID
    const lineObj = new Line(getNewLineNumber(), callerID);
    lineObj.sipSession = session as SipInvitationType;
    lineObj.sipSession.data = {};
    lineObj.sipSession.data.line = lineObj.lineNumber;
    lineObj.sipSession.data.callDirection = 'inbound';
    lineObj.sipSession.data.terminateBy = '';
    lineObj.sipSession.data.src = did;
    lineObj.sipSession.data.earlyReject = false;
    // Detect Video
    lineObj.sipSession.data.withVideo = false;
    if (configs.features.enableVideo && lineObj.sipSession.request.body) {
      // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
      // even if original invite does not specify video.
      if (lineObj.sipSession.request.body.indexOf('m=video') > -1) {
        lineObj.sipSession.data.withVideo = true;
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
        if (uriParts[1].includes(`@${configs.account.domain}`)) {
          did = uriParts[1].split('@')[0];
          console.log('Using P-Asserted-Identity:', did);
        }
      }
    }
    // Session Delegates
    lineObj.sipSession.delegate = {
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
          session.data.withVideo,
        );
      },
    };
    // incomingInviteRequestDelegate
    lineObj.sipSession.incomingInviteRequest.delegate = {
      onCancel: function (sip) {
        console.log('onInviteCancel');
        onInviteCancel(lineObj, sip, () => teardownSession(lineObj));
      },
    };

    // Auto Answer options
    // let autoAnswerRequested = false;
    // let answerTimeout = 1000;
    // if (!AutoAnswerEnabled && IntercomPolicy == 'enabled') {
    //   // Check headers only if policy is allow
    //   // https://github.com/InnovateAsterisk/Browser-Phone/issues/126
    //   // Alert-Info: info=alert-autoanswer
    //   // Alert-Info: answer-after=0
    //   // Call-info: answer-after=0; x=y
    //   // Call-Info: Answer-After=0
    //   // Alert-Info: ;info=alert-autoanswer
    //   // Alert-Info: <sip:>;info=alert-autoanswer
    //   // Alert-Info: <sip:domain>;info=alert-autoanswer
    //   // const ci = session.request.headers['Call-Info'];
    //   // if (ci !== undefined && ci.length > 0) {
    //   //   for (let i = 0; i < ci.length; i++) {
    //   //     const raw_ci = ci[i].raw.toLowerCase();
    //   //     if (raw_ci.indexOf('answer-after=') > 0) {
    //   //       const temp_seconds_autoanswer = parseInt(
    //   //         raw_ci
    //   //           .substring(raw_ci.indexOf('answer-after=') + 'answer-after='.length)
    //   //           .split(';')[0],
    //   //       );
    //   //       if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
    //   //         autoAnswerRequested = true;
    //   //         if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
    //   //         break;
    //   //       }
    //   //     }
    //   //   }
    //   // }
    //   // const ai = session.request.headers['Alert-Info'];
    //   // if (autoAnswerRequested === false && ai !== undefined && ai.length > 0) {
    //   //   for (let i = 0; i < ai.length; i++) {
    //   //     const raw_ai = ai[i].raw.toLowerCase();
    //   //     if (raw_ai.indexOf('auto answer') > 0 || raw_ai.indexOf('alert-autoanswer') > 0) {
    //   //       autoAnswerRequested = true;
    //   //       break;
    //   //     }
    //   //     if (raw_ai.indexOf('answer-after=') > 0) {
    //   //       const temp_seconds_autoanswer = parseInt(
    //   //         raw_ai
    //   //           .substring(raw_ai.indexOf('answer-after=') + 'answer-after='.length)
    //   //           .split(';')[0],
    //   //       );
    //   //       if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
    //   //         autoAnswerRequested = true;
    //   //         if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
    //   //         break;
    //   //       }
    //   //     }
    //   //   }
    //   // }
    // }

    // Check if that buddy is not already on a call?? //TODO #SH
    // const streamVisible = $('#stream-' + buddyObj?.identity).is(':visible');
    // if (streamVisible || CurrentCalls == 0) {
    //   // If you are already on the selected buddy who is now calling you, switch to his call.
    //   // NOTE: This will put other calls on hold
    //   if (CurrentCalls == 0) SelectLine(lineObj.LineNumber);
    // }

    // Show notification / Ring / Windows Etc
    // ======================================

    // Play Ring Tone if not on the phone
    // Retrieve EnableRingtone from configs or set a default value
    const currentCalls = countIdSessions(session.id);
    if (configs.features.enableRingtone) {
      if (currentCalls >= 1) {
        // Play Alert
        console.log('Audio:', audioBlobs.CallWaiting.url);
        const ringer = new Audio(audioBlobs.CallWaiting.url as string);
        ringer.preload = 'auto';
        ringer.loop = false;
        ringer.oncanplaythrough = function () {
          if (
            typeof ringer.sinkId !== 'undefined' &&
            configs.media.ringerOutputDeviceId != 'default'
          ) {
            ringer
              .setSinkId(configs.media.ringerOutputDeviceId)
              .then(function () {
                console.log('Set sinkId to:', configs.media.ringerOutputDeviceId);
              })
              .catch(function (e) {
                console.warn('Failed not apply setSinkId.', e);
              });
          }
          // If there has been no interaction with the page at all... this page will not work
          ringer
            .play()
            .then(function () {
              // Audio Is Playing
            })
            .catch(function (e) {
              console.warn('Unable to play audio file.', e);
            });
        };
        lineObj.sipSession.data.ringerObj = ringer;
      } else {
        // Play Ring Tone
        console.log('Audio:', audioBlobs.Ringtone.url, audioBlobs.Ringtone);
        const ringer = new Audio(audioBlobs.Ringtone.blob as string);
        ringer.preload = 'auto';
        ringer.loop = true;
        ringer.oncanplaythrough = function () {
          if (
            typeof ringer.sinkId !== 'undefined' &&
            configs.media.ringerOutputDeviceId != 'default'
          ) {
            ringer
              .setSinkId(configs.media.ringerOutputDeviceId)
              .then(function () {
                console.log('Set sinkId to:', configs.media.ringerOutputDeviceId);
              })
              .catch(function (e) {
                console.warn('Failed not apply setSinkId.', e);
              });
          }
          // If there has been no interaction with the page at all... this page will not work
          ringer
            .play()
            .then(function () {
              // Audio Is Playing
            })
            .catch(function (e) {
              console.warn('Unable to play audio file.', e);
            });
        };
        lineObj.sipSession.data.ringerObj = ringer;
      }
    }
    addLine(lineObj);
  }

  /**
   * Handle inbound calls
   * @param lineNumber
   * @returns
   */
  function answerAudioSession(lineNumber: LineType['lineNumber']) {
    // Check vitals
    if (!hasAudioDevice) {
      alert('lang.alert_no_microphone');
      return;
    }

    const lineObj = findLineByNumber(lineNumber);
    if (lineObj === null) {
      console.warn('Failed to get line (' + lineNumber + ')');
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
    // Save Devices
    session.data.withVideo = false;
    session.data.videoSourceDevice = null;
    session.data.audioSourceDevice = configs.media.audioInputDeviceId;
    session.data.audioOutputDevice = configs.media.audioOutputDeviceId;

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
      console.error('lang.alert_no_microphone');
      return;
    }
    console.log('makeAudioSession');

    const spdOptions = makeAudioSpdOptions({ extraHeaders });
    if (!spdOptions) return;
    let startTime = dayJs.utc().toISOString();

    // Invite
    console.log('INVITE (audio): ' + dialledNumber + '@' + configs.account.domain);
    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs.account.domain,
    ) as URI;
    lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.sipSession.data = {};
    lineObj.sipSession.data.line = lineObj.lineNumber;
    lineObj.sipSession.data.callDirection = 'outbound';
    lineObj.sipSession.data.dialledNumber = dialledNumber;
    lineObj.sipSession.data.startTime = startTime;
    lineObj.sipSession.data.videoSourceDevice = null;
    lineObj.sipSession.data.audioSourceDevice = configs.media.audioInputDeviceId;
    lineObj.sipSession.data.audioOutputDevice = configs.media.audioOutputDeviceId;
    lineObj.sipSession.data.terminateBy = 'them';
    lineObj.sipSession.data.withVideo = false;
    lineObj.sipSession.data.earlyReject = false;
    lineObj.sipSession.isOnHold = false;
    lineObj.sipSession.delegate = {
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
    lineObj.sipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj);
  }

  /**
   * Handle inbound video calls
   * @param lineNumber
   * @returns
   */
  function answerVideoSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Failed to get line (' + lineNumber + ')');
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
      alert('lang.alert_no_microphone');
      return;
    }

    // Start SIP handling
    const spdOptions = answerVideoSpdOptions();

    // Save Devices
    session.data.withVideo = true;
    session.data.videoSourceDevice = configs.media.videoInputDeviceId;
    session.data.audioSourceDevice = configs.media.audioInputDeviceId;
    session.data.audioOutputDevice = configs.media.audioOutputDeviceId;

    // Send Answer
    session
      .accept(spdOptions)
      .then(function () {
        onInviteAccepted(lineObj, true);
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
      alert('lang.alert_no_microphone');
      return;
    }

    if (hasVideoDevice == false) {
      console.warn('No video devices (webcam) found, switching to audio call.');
      makeAudioSession(lineObj, dialledNumber);
      return;
    }

    const spdOptions = makeVideoSpdOptions({ extraHeaders });
    if (!spdOptions) return;

    const startTime = dayJs.utc().toISOString();

    // Invite
    console.log('INVITE (video): ' + dialledNumber + '@' + configs.account.domain);

    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs.account.domain,
    ) as URI;
    console.log('video', { spdOptions });

    lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.sipSession.data = {};
    lineObj.sipSession.data.line = lineObj.lineNumber;
    lineObj.sipSession.data.callDirection = 'outbound';
    lineObj.sipSession.data.dialledNumber = dialledNumber;
    lineObj.sipSession.data.startTime = startTime;

    lineObj.sipSession.data.videoSourceDevice = configs.media.videoInputDeviceId;
    lineObj.sipSession.data.audioSourceDevice = configs.media.audioInputDeviceId;
    lineObj.sipSession.data.audioOutputDevice = configs.media.audioOutputDeviceId;
    lineObj.sipSession.data.terminateBy = 'them';
    lineObj.sipSession.data.withVideo = true;
    lineObj.sipSession.data.earlyReject = false;
    lineObj.sipSession.isOnHold = false;
    lineObj.sipSession.delegate = {
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
    lineObj.sipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj); TODO
  }

  /**
   * Handle reject calls
   * @param lineNumber
   * @returns
   */
  function rejectSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
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
   * Handle Dial User By Line Number
   * @param type
   * @param dialNumber
   * @param extraHeaders
   * @returns
   */
  function dialByLine(type: 'audio' | 'video', dialNumber: string, extraHeaders?: Array<string>) {
    if (userAgent == null || userAgent.isRegistered() == false) {
      // onError //TODO #SH
      alert('SIP userAgent not registered');
      return;
    }

    // if (EnableAlphanumericDial) {
    //   numDial = numDial.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
    // } else {
    //   numDial = numDial.replace(telNumericRegEx, "").substring(0, MaxDidLength);
    // }
    // if (numDial.length == 0) {
    //   console.warn("Enter number to dial");
    //   return;
    // }

    // Create a Buddy if one is not already existing
    // Create a Line
    const lineObj = new Line(getNewLineNumber(), dialNumber);

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

  /* ------------------------------- HOLD/UNHOLD ------------------------------ */
  /**
   * Hold Call Session
   * @param lineNumber
   * @returns
   */
  function holdSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (session.isOnHold == true) {
      console.log('Call is already on hold:', lineNumber);
      return;
    }
    console.log('Putting Call on hold:', lineNumber);
    session.isOnHold = true;

    const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
    sessionDescriptionHandlerOptions.hold = true;
    session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

    const options = {
      requestDelegate: {
        onAccept: function () {
          if (
            session &&
            session.sessionDescriptionHandler &&
            session.sessionDescriptionHandler.peerConnection
          ) {
            const pc = session.sessionDescriptionHandler.peerConnection;
            // Stop all the inbound streams
            pc.getReceivers().forEach(function (RTCRtpReceiver) {
              if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = false;
            });
            // Stop all the outbound streams (especially useful for Conference Calls!!)
            pc.getSenders().forEach(function (RTCRtpSender) {
              // Mute Audio
              const track = RTCRtpSender.track as MediaStreamTrackType;
              if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
                if (track.IsMixedTrack == true) {
                  if (
                    session.data.audioSourceTrack &&
                    session.data.audioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Muting Mixed Audio Track : ' + session.data.audioSourceTrack.label,
                    );
                    session.data.audioSourceTrack.enabled = false;
                  }
                }
                console.log('Muting Audio Track : ' + track.label);
                track.enabled = false;
              }
              // Stop Video
              else if (track && track.kind == 'video') {
                track.enabled = false;
              }
            });
          }
          session.isOnHold = true;
          console.log('Call is is on hold:', lineNumber);

          // Log Hold
          if (!session.data.hold) session.data.hold = [];
          session.data.hold.push({ event: 'hold', eventTime: utcDateNow() });
          session.data.isHold = true;

          // updateLineScroll(lineNumber);

          // Custom Web hook
        },
        onReject: function () {
          session.isOnHold = false;
          console.warn('Failed to put the call on hold:', lineNumber);
        },
      },
    };
    session.invite(options).catch(function (error) {
      session.isOnHold = false;
      console.warn('Error attempting to put the call on hold:', error);
    });
    updateLine(lineObj);
  }

  /**
   * Un-Hold Call Session
   * @param lineNumber
   * @returns
   */
  function unholdSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (session.isOnHold == false) {
      console.log('Call is already off hold:', lineNumber);
      return;
    }
    console.log('Taking call off hold:', lineNumber);
    session.isOnHold = false;

    const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
    sessionDescriptionHandlerOptions.hold = false;
    session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

    const options = {
      requestDelegate: {
        onAccept: function () {
          if (
            session &&
            session.sessionDescriptionHandler &&
            session.sessionDescriptionHandler.peerConnection
          ) {
            const pc = session.sessionDescriptionHandler.peerConnection;
            // Restore all the inbound streams
            pc.getReceivers().forEach(function (RTCRtpReceiver) {
              if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = true;
            });
            // Restore all the outbound streams
            pc.getSenders().forEach(function (RTCRtpSender) {
              // Unmute Audio
              const track = RTCRtpSender.track as MediaStreamTrackType;
              if (track && track.kind == 'audio') {
                if (track.IsMixedTrack == true) {
                  if (
                    session.data.audioSourceTrack &&
                    session.data.audioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Unmuting Mixed Audio Track : ' + session.data.audioSourceTrack.label,
                    );
                    session.data.audioSourceTrack.enabled = true;
                  }
                }
                console.log('Unmuting Audio Track : ' + track.label);
                track.enabled = true;
              } else if (track && track.kind == 'video') {
                track.enabled = true;
              }
            });
          }
          session.isOnHold = false;
          console.log('Call is off hold:', lineNumber);

          // Log Hold
          if (!session.data.hold) session.data.hold = [];
          session.data.hold.push({ event: 'unhold', eventTime: utcDateNow() });
          session.data.isHold = false;

          // updateLineScroll(lineNumber);
        },
        onReject: function () {
          session.isOnHold = true;
          console.warn('Failed to put the call on hold', lineNumber);
        },
      },
    };
    session.invite(options).catch(function (error) {
      session.isOnHold = true;
      console.warn('Error attempting to take to call off hold', error);
    });
    updateLine(lineObj);
  }

  /* ------------------------------- MUTE/UNMUTE ------------------------------ */
  /**
   * Mute Call Session
   * @param lineNumber
   * @returns
   */
  function muteSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.sipSession == null) return;

    const session = lineObj.sipSession;

    const options = {
      sessionDescriptionHandlerModifiers: [],
      requestDelegate: {
        onAccept: function () {
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
                  if (
                    session.data.audioSourceTrack &&
                    session.data.audioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Muting Mixed Audio Track : ' + session.data.audioSourceTrack.label,
                    );
                    session.data.audioSourceTrack.enabled = false;
                  }
                }
                console.log('Muting Audio Track : ' + track.label);
                track.enabled = false;
              }
            });
          }
          if (!session.data.mute) session.data.mute = [];
          session.data.mute.push({ event: 'mute', eventTime: utcDateNow() });
          session.data.isMute = true;
        },
        onReject: function () {
          session.data.isMute = false;
          console.warn('Failed to put the call mute', lineNumber);
        },
      },
    };
    session.invite(options).catch(function (error) {
      session.data.isMute = false;
      console.warn('Error attempting to take to call un-mute', error);
    });
    updateLine(lineObj);
  }

  /**
   * Un-Mute Call Session
   * @param lineNumber
   * @returns
   */
  function unmuteSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.sipSession == null) return;

    const session = lineObj.sipSession;

    const options = {
      sessionDescriptionHandlerModifiers: [Web.holdModifier],

      requestDelegate: {
        onAccept: function () {
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
                  if (
                    session.data.audioSourceTrack &&
                    session.data.audioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Unmuting Mixed Audio Track : ' + session.data.audioSourceTrack.label,
                    );
                    session.data.audioSourceTrack.enabled = true;
                  }
                }
                console.log('Unmuting Audio Track : ' + track.label);
                track.enabled = true;
              }
            });
          }
          if (!session.data.mute) session.data.mute = [];
          session.data.mute.push({ event: 'unmute', eventTime: utcDateNow() });
          session.data.isMute = false;
        },
        onReject: function () {
          session.data.isMute = false;
          console.warn('Failed to put the call un-mute', lineNumber);
        },
      },
    };
    session.invite(options).catch(function (error) {
      session.data.isMute = false;
      console.warn('Error attempting to take to call un-mute', error);
    });
    updateLine(lineObj);
  }

  /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
  /**
   * Cancle And Terminate Call Session
   * @param lineNumber
   * @returns
   */
  function cancelSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.sipSession == null) return;
    const session = lineObj.sipSession;
    if (!(session instanceof Inviter)) return;
    session.data.terminateBy = 'us';
    session.data.reasonCode = 0;
    session.data.reasonText = 'Call Cancelled';

    console.log('Cancelling session : ' + lineNumber);
    if (session.state == SessionState.Initial || session.state == SessionState.Establishing) {
      session.cancel();
    } else {
      console.warn('Session not in correct state for cancel.', lineObj.sipSession.state);
      console.log('Attempting teardown : ' + lineNumber);
      teardownSession(lineObj);
    }
  }

  /**
   * Terminate Call Session Based on Session State
   * @param lineNumber
   * @returns
   */
  function endSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
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
        console.log('Attempting teardown : ' + lineNumber);
        teardownSession(lineObj);
        break;
    }
  }

  /**
   * Teardown Call Session Based on Line
   * @param lineObj
   * @returns
   */
  function teardownSession(lineObj: LineType) {
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
          console.error('teardownSession', { error });
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
  /* -------------------------------- TRANSFER -------------------------------- */
  /**
   * Start Transfer Call Session
   * @param lineNumber
   */
  function startTransferSession(lineNumber: LineType['lineNumber']) {
    // if ($('#line-' + lineNum + '-btn-CancelConference').is(':visible')) { //TODO #SH
    //   CancelConference(lineNumber);
    //   return;
    // }
    // $('#line-' + lineNum + '-btn-Transfer').hide();
    // $('#line-' + lineNum + '-btn-CancelTransfer').show();
    holdSession(lineNumber);
    // $('#line-' + lineNum + '-txt-FindTransferBuddy').val('');
    // $('#line-' + lineNum + '-txt-FindTransferBuddy')
    //   .parent()
    //   .show();
    // $('#line-' + lineNum + '-session-avatar').css('width', '50px');
    // $('#line-' + lineNum + '-session-avatar').css('height', '50px');
    // RestoreCallControls(lineNumber);
    // $('#line-' + lineNum + '-btn-blind-transfer').show();
    // $('#line-' + lineNum + '-btn-attended-transfer').show();
    // $('#line-' + lineNum + '-btn-complete-transfer').hide();
    // $('#line-' + lineNum + '-btn-cancel-transfer').hide();
    // $('#line-' + lineNum + '-btn-complete-attended-transfer').hide();
    // $('#line-' + lineNum + '-btn-cancel-attended-transfer').hide();
    // $('#line-' + lineNum + '-btn-terminate-attended-transfer').hide();
    // $('#line-' + lineNum + '-transfer-status').hide();
    // $('#line-' + lineNum + '-Transfer').show();
    // updateLineScroll(lineNumber); TODO #SH
  }

  /**
   * Cancel Transfer Call Session
   * @param lineNumber
   * @returns
   */
  function cancelTransferSession(lineNumber: LineType['lineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    console.log('cancelTransferSession', { lineObj });
    if (lineObj == null || lineObj.sipSession == null) {
      console.warn('Null line or session');
      return;
    }
    const session = lineObj.sipSession;
    if (session.data.childsession) {
      console.log('Child Transfer call detected:', session.data.childsession.state);
      session.data.childsession
        .dispose()
        .then(function () {
          session.data.childsession = null;
        })
        .catch(function (error) {
          console.error('cancelTransferSession', { error });
          session.data.childsession = null;
          // Suppress message
        });
    }

    // $("#line-" + lineNum + "-session-avatar").css("width", "");
    // $("#line-" + lineNum + "-session-avatar").css("height", "");

    // $("#line-" + lineNum + "-btn-Transfer").show();
    // $("#line-" + lineNum + "-btn-CancelTransfer").hide();

    unholdSession(lineNumber);
    // $("#line-" + lineNum + "-Transfer").hide();

    // updateLineScroll(lineNumber);
    updateLine(lineObj);
  }

  /**
   * Attend Transfer Call Session
   * @param baseLine
   * @param transferLineNumber
   * @returns
   */
  function attendedTransferSession(baseLine: LineType, transferLineNumber: LineType['lineNumber']) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    const dstNo = String(transferLineNumber);
    if (dstNo === '') {
      console.warn('Cannot transfer, no number');
      return;
    }

    let lineObj = baseLine;
    console.log('attendedTransfer lineNumber', userAgent.isRegistered(), dstNo, lineObj);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.sipSession;
    if (!session) return;
    if (!session.data.transfer) session.data.transfer = [];
    session.data.transfer.push({
      type: 'Attended',
      to: transferLineNumber,
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
        configs.media.autoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        configs.media.echoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        configs.media.noiseSuppression;
    }

    // Not sure if its possible to transfer a Video call???
    if (session.data.withVideo) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video = {} as any;
      const video = spdOptions.sessionDescriptionHandlerOptions.constraints
        .video as VideoSessionConstraints;
      if (session.data.videoSourceDevice && session.data.videoSourceDevice != 'default') {
        video.deviceId = {
          exact: session.data.videoSourceDevice,
        };
      }
      // Add additional Constraints
      if (supportedConstraints.frameRate && configs.media.maxFrameRate !== '') {
        video.frameRate = String(configs.media.maxFrameRate);
      }
      if (supportedConstraints.height && configs.media.videoHeight != '') {
        video.height = String(configs.media.videoHeight);
      }
      if (supportedConstraints.aspectRatio && configs.media.videoAspectRatio != '') {
        video.aspectRatio = String(configs.media.videoAspectRatio);
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
    console.log(
      555,
      'TRANSFER INVITE: ',
      'sip:' + dstNo + '@' + configs.account.domain,
      spdOptions,
    );
    const targetURI = UserAgent.makeURI(
      'sip:' + dstNo.replace(/#/g, '%23') + '@' + configs.account.domain,
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
          session?.data?.withVideo,
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
          // newCallStatus.html(lang.call_in_progress);
          // $('#line-' + lineNum + '-btn-cancel-attended-transfer').hide();
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

  // function BlindTransfer(lineNumber) {
  //   var dstNo = $("#line-" + lineNum + "-txt-FindTransferBuddy").val();
  //   if (EnableAlphanumericDial) {
  //     dstNo = dstNo.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
  //   } else {
  //     dstNo = dstNo.replace(telNumericRegEx, "").substring(0, MaxDidLength);
  //   }
  //   if (dstNo == "") {
  //     console.warn("Cannot transfer, no number");
  //     return;
  //   }

  //   var lineObj = FindLineByNumber(lineNumber);
  //   if (lineObj == null || lineObj.sipSession == null) {
  //     console.warn("Null line or session");
  //     return;
  //   }
  //   var session = lineObj.sipSession;

  //   if (!session.data.transfer) session.data.transfer = [];
  //   session.data.transfer.push({
  //     type: "Blind",
  //     to: dstNo,
  //     transferTime: utcDateNow(),
  //     disposition: "refer",
  //     dispositionTime: utcDateNow(),
  //     accept: {
  //       complete: null,
  //       eventTime: null,
  //       disposition: "",
  //     },
  //   });
  //   var transferId = session.data.transfer.length - 1;

  //   var transferOptions = {
  //     requestDelegate: {
  //       onAccept: function (sip) {
  //         console.log("Blind transfer Accepted");

  //         session.data.terminateBy = "us";
  //         session.data.reasonCode = 202;
  //         session.data.reasonText = "Transfer";

  //         session.data.transfer[transferId].accept.complete = true;
  //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
  //         session.data.transfer[transferId].accept.eventTime = utcDateNow();

  //         // TODO: use lang pack
  //         $("#line-" + lineNum + "-msg").html("Call Blind Transferred (Accepted)");

  //         updateLineScroll(lineNumber);

  //         session.bye().catch(function (error) {
  //           console.warn("Could not BYE after blind transfer:", error);
  //         });
  //         teardownSession(lineObj);
  //       },
  //       onReject: function (sip) {
  //         console.warn("REFER rejected:", sip);

  //         session.data.transfer[transferId].accept.complete = false;
  //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
  //         session.data.transfer[transferId].accept.eventTime = utcDateNow();

  //         $("#line-" + lineNum + "-msg").html("Call Blind Failed!");

  //         updateLineScroll(lineNumber);

  //         // Session should still be up, so just allow them to try again
  //       },
  //     },
  //   };
  //   console.log("REFER: ", dstNo + "@" + sipDomain);
  //   var referTo = SIP.UserAgent.makeURI("sip:" + dstNo.replace(/#/g, "%23") + "@" + sipDomain);
  //   session.refer(referTo, transferOptions).catch(function (error) {
  //     console.warn("Failed to REFER", error);
  //   });

  //   $("#line-" + lineNum + "-msg").html(lang.call_blind_transfered);

  //   updateLineScroll(lineNumber);
  // }
  //

  // Cancel Attend Transfer Call Session

  /**
   * Cancel Transfered Call Session
   * @param baseLine
   * @param transferLineNumber
   * @returns
   */
  function cancelAttendedTransferSession(
    baseLine: LineType,
    transferLineNumber: LineType['lineNumber'],
  ) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    const dstNo = String(transferLineNumber);
    if (dstNo === '') {
      console.warn('Cannot transfer, no number');
      return;
    }

    let lineObj = baseLine;
    console.log('attendedTransfer lineNumber', userAgent.isRegistered(), dstNo, lineObj);
    if (!lineObj?.sipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.sipSession;
    if (!session) return;
    if (!session.data.transfer) return;
    session.data.transfer.forEach((transfer) => {
      if (transfer.to === transferLineNumber) transfer.onCancle?.();
    });

    // updateLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */

  return {
    receiveSession,
    answerAudioSession,
    answerVideoSession,
    makeAudioSession,
    makeVideoSession,
    rejectSession,
    dialByLine,
    endSession,
    holdSession,
    unholdSession,
    muteSession,
    unmuteSession,
    cancelSession,
    startTransferSession,
    cancelTransferSession,
    attendedTransferSession,
    cancelAttendedTransferSession,
    teardownSession,
  };
};
