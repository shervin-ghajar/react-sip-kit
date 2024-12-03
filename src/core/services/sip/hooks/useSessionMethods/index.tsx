import { dayJs } from '../../../../../utils';
import {
  AutoAnswerEnabled,
  AutoAnswerPolicy,
  AutoGainControl,
  CallWaitingEnabled,
  DidLength,
  DoNotDisturbEnabled,
  DoNotDisturbPolicy,
  EchoCancellation,
  EnableRingtone,
  EnableVideoCalling,
  InviteExtraHeaders,
  localStorage,
  maxFrameRate,
  NoiseSuppression,
  videoAspectRatio,
  videoHeight,
} from '../../configs';
import { Buddy, Line } from '../../constructors';
import { useSipStore } from '../../store';
import {
  BuddyType,
  LineType,
  SipInvitationType,
  SipInviterType,
  SipSessionDescriptionHandler,
  SipSessionType,
} from '../../store/types';
import {
  getAudioOutputID,
  getAudioSrcID,
  getRingerOutputID,
  getVideoSrcID,
  utcDateNow,
} from '../../utils';
import { useSessionEvents } from '../useSessionEvents';
import { MediaStreamTrackType } from '../useSessionEvents/types';
import { SessionMethods, SPDOptionsType, VideoSessionConstraints } from './types';
import { useContext } from 'react';
import {
  Inviter,
  InviterInviteOptions,
  SessionReferOptions,
  SessionState,
  URI,
  UserAgent,
} from 'sip.js';
import { v4 as uuidv4 } from 'uuid';

let newLineNumber = 0;

export const useSessionMethods = () => {
  const {
    config,
    findBuddyByDid,
    findBuddyByIdentity,
    findLineByNumber,
    addLine,
    removeLine,
    updateLine,
    countSessions,
    userAgent,
    audioBlobs,
    hasAudioDevice,
    hasVideoDevice,
    audioInputDevices,
    videoInputDevices,
  } = useSipStore();

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

  /* -------------------------------------------------------------------------- */
  /*                       Init-Session Call Functionality                      */
  /* -------------------------------------------------------------------------- */
  // Handle incoming calls
  function receiveCall(session: SipInvitationType) {
    console.log('receiveCall', { session });
    const callerID = session.remoteIdentity.displayName || session.remoteIdentity.uri.user || '';
    let did = session.remoteIdentity.uri.user ?? '';

    console.log(`Incoming call from: ${callerID}`);

    const startTime = dayJs.utc();
    newLineNumber++;
    // Create or update buddy based on DID
    const buddyObj = findBuddyByDid(did); // Find or create buddy
    const lineObj = new Line(newLineNumber, callerID, did, buddyObj);
    lineObj.SipSession = session as SipInvitationType;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.calldirection = 'inbound';
    lineObj.SipSession.data.terminateby = '';
    lineObj.SipSession.data.src = did;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
    lineObj.SipSession.data.earlyReject = false;
    // Detect Video
    lineObj.SipSession.data.withvideo = false;
    if (EnableVideoCalling == true && lineObj.SipSession.request.body) {
      // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
      // even if original invite does not specify video.
      if (lineObj.SipSession.request.body.indexOf('m=video') > -1) {
        lineObj.SipSession.data.withvideo = true;
        // The invite may have video, but the buddy may be a contact
        if (buddyObj?.type == 'contact') {
          // videoInvite = false;
          // TODO: Is this limitation necessary?
        }
      }
    }

    // Extract P-Asserted-Identity if available
    const sipHeaders = session.incomingInviteRequest.message.headers;
    if (sipHeaders['P-Asserted-Identity']) {
      const rawUri = sipHeaders['P-Asserted-Identity'][0].raw;
      if (rawUri.includes('<sip:')) {
        const uriParts = rawUri.split('<sip:');
        if (uriParts[1].endsWith('>')) uriParts[1] = uriParts[1].slice(0, -1);
        if (uriParts[1].includes(`@${config.domain}`)) {
          did = uriParts[1].split('@')[0];
          console.log('Using P-Asserted-Identity:', did);
        }
      }
    }
    // Session Delegates
    lineObj.SipSession.delegate = {
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
          session.data.withvideo,
        );
      },
    };
    // incomingInviteRequestDelegate
    lineObj.SipSession.incomingInviteRequest.delegate = {
      onCancel: function (sip) {
        console.log('onInviteCancel');
        onInviteCancel(lineObj, sip, () => teardownSession(lineObj));
      },
    };

    // Possible Early Rejection options
    if (DoNotDisturbEnabled == true || DoNotDisturbPolicy == 'enabled') {
      if (DoNotDisturbEnabled == true && buddyObj?.EnableDuringDnd == true) {
        // This buddy has been allowed
        console.log('Buddy is allowed to call while you are on DND');
      } else {
        console.log('Do Not Disturb Enabled, rejecting call.');
        lineObj.SipSession.data.earlyReject = true;
        rejectCall(lineObj.LineNumber);
        return;
      }
    }
    const CurrentCalls = countSessions(session.id);
    console.log({ CurrentCalls });
    if (CurrentCalls >= 1) {
      if (CallWaitingEnabled == false || CallWaitingEnabled == 'disabled') {
        console.log('Call Waiting Disabled, rejecting call.');
        lineObj.SipSession.data.earlyReject = true;
        rejectCall(lineObj.LineNumber);
        return;
      }
    }

    // Auto Answer options
    let autoAnswerRequested = false;
    let answerTimeout = 1000;
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

    if (AutoAnswerEnabled || AutoAnswerPolicy == 'enabled' || autoAnswerRequested) {
      if (CurrentCalls == 0) {
        // There are no other calls, so you can answer
        console.log('Going to Auto Answer this call...');
        window.setTimeout(function () {
          // If the call is with video, assume the auto answer is also
          // In order for this to work nicely, the recipient maut be "ready" to accept video calls
          // In order to ensure video call compatibility (i.e. the recipient must have their web cam in, and working)
          // The NULL video should be configured
          // https://github.com/InnovateAsterisk/Browser-Phone/issues/26
          if (lineObj?.SipSession?.data.withvideo) {
            answerVideoSession(lineObj.LineNumber);
          } else {
            answerAudioSession(lineObj.LineNumber);
          }
        }, answerTimeout);

        // Select Buddy
        // SelectLine(lineObj.LineNumber); TODO #SH select and switch line
        return;
      } else {
        console.warn('Could not auto answer call, already on a call.');
      }
    }

    // Check if that buddy is not already on a call?? //TODO #SH
    // const streamVisible = $('#stream-' + buddyObj?.identity).is(':visible');
    // if (streamVisible || CurrentCalls == 0) {
    //   // If you are already on the selected buddy who is now calling you, switch to his call.
    //   // NOTE: This will put other calls on hold
    //   if (CurrentCalls == 0) SelectLine(lineObj.LineNumber);
    // }

    // Show notification / Ring / Windows Etc
    // ======================================

    // Browser Window Notification //TODO #SH
    // if ('Notification' in window) {
    //   if (Notification.permission === 'granted') {
    //     const noticeOptions = {
    //       body: lang.incoming_call_from + ' ' + callerID + ' <' + did + '>',
    //       icon: getPicture(buddyObj?.identity),
    //     };
    //     const inComingCallNotification = new Notification(lang.incoming_call, noticeOptions);
    //     inComingCallNotification.onclick = function (event) {
    //       const lineNo = lineObj.LineNumber;
    //       const videoInvite = lineObj.SipSession.data.withvideo;
    //       window.setTimeout(function () {
    //         // https://github.com/InnovateAsterisk/Browser-Phone/issues/26
    //         if (videoInvite) {
    //           answerVideoSession(lineNo);
    //         } else {
    //           answerAudioSession(lineNo);
    //         }
    //       }, 1000);

    //       // Select Buddy
    //       SelectLine(lineNo);
    //       return;
    //     };
    //   }
    // }

    // Play Ring Tone if not on the phone
    console.log({ EnableRingtone, CurrentCalls });
    if (EnableRingtone == true) {
      if (CurrentCalls >= 1) {
        // Play Alert
        console.log('Audio:', audioBlobs.CallWaiting.url);
        const ringer = new Audio(audioBlobs.CallWaiting.blob as string);
        ringer.preload = 'auto';
        ringer.loop = false;
        ringer.oncanplaythrough = function (e) {
          if (typeof ringer.sinkId !== 'undefined' && getRingerOutputID() != 'default') {
            ringer
              .setSinkId(getRingerOutputID())
              .then(function () {
                console.log('Set sinkId to:', getRingerOutputID());
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
        lineObj.SipSession.data.ringerObj = ringer;
      } else {
        // Play Ring Tone
        console.log('Audio:', audioBlobs.Ringtone.url, audioBlobs.Ringtone);
        const ringer = new Audio(audioBlobs.Ringtone.blob as string);
        ringer.preload = 'auto';
        ringer.loop = true;
        ringer.oncanplaythrough = function (e) {
          if (typeof ringer.sinkId !== 'undefined' && getRingerOutputID() != 'default') {
            ringer
              .setSinkId(getRingerOutputID())
              .then(function () {
                console.log('Set sinkId to:', getRingerOutputID());
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
        lineObj.SipSession.data.ringerObj = ringer;
      }
    }
    addLine(lineObj);
  }

  // Handle inbound calls
  function answerAudioSession(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Failed to get line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
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
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    console.log({ supportedConstraints });
    const spdOptions: SPDOptionsType = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: { deviceId: 'default' },
          video: false,
        },
      },
    };

    // Configure Audio
    const currentAudioDevice = getAudioSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
    if (currentAudioDevice != 'default') {
      let confirmedAudioDevice = false;
      for (let i = 0; i < audioInputDevices.length; ++i) {
        if (currentAudioDevice == audioInputDevices[i].deviceId) {
          confirmedAudioDevice = true;
          break;
        }
      }
      if (confirmedAudioDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
          exact: currentAudioDevice,
        };
      } else {
        console.warn(
          'The audio device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('AudioSrcId', 'default');
      }
    }
    // Add additional Constraints
    if (supportedConstraints.autoGainControl) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
        AutoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        EchoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        NoiseSuppression;
    }

    // Save Devices
    session.data.withvideo = false;
    session.data.videoSourceDevice = null;
    session.data.audioSourceDevice = getAudioSrcID();
    session.data.audioOutputDevice = getAudioOutputID();

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

  // Handle outbound calls
  function makeAudioCall(lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) {
    if (userAgent == null) return;
    if (userAgent.isRegistered() == false) return;
    if (lineObj == null) return;
    if (!hasAudioDevice) {
      alert('lang.alert_no_microphone');
      return;
    }
    console.log('makeAudioCall');
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

    const spdOptions: SPDOptionsType & {
      earlyMedia: boolean;
      extraHeaders?: string[];
    } = {
      earlyMedia: true,
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: { deviceId: 'default' },
          video: false,
        },
      },
    };
    // Configure Audio
    const currentAudioDevice = getAudioSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance

    if (currentAudioDevice != 'default') {
      let confirmedAudioDevice = false;
      for (let i = 0; i < audioInputDevices.length; ++i) {
        if (currentAudioDevice == audioInputDevices[i].deviceId) {
          confirmedAudioDevice = true;
          break;
        }
      }
      if (confirmedAudioDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
          exact: currentAudioDevice,
        };
      } else {
        console.warn(
          'The audio device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('AudioSrcId', 'default');
      }
    }
    // Add additional Constraints
    if (supportedConstraints.autoGainControl) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
        AutoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        EchoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        NoiseSuppression;
    }
    // Added to the SIP Headers
    if (extraHeaders) {
      spdOptions.extraHeaders = extraHeaders;
    } else {
      spdOptions.extraHeaders = [];
    }
    if (InviteExtraHeaders && InviteExtraHeaders != '' && InviteExtraHeaders != '{}') {
      try {
        const inviteExtraHeaders = JSON.parse(InviteExtraHeaders);
        for (const [key, value] of Object.entries(inviteExtraHeaders)) {
          if (value == '') {
            // This is a header, must be format: "Field: Value"
          } else {
            spdOptions?.extraHeaders?.push(key + ': ' + value);
          }
        }
      } catch (e) {}
    }

    // $('#line-' + lineObj.LineNumber + '-msg').html(lang.starting_audio_call);
    // $('#line-' + lineObj.LineNumber + '-timer').show();

    let startTime = dayJs.utc();

    // Invite
    console.log('INVITE (audio): ' + dialledNumber + '@' + config.domain);

    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + config.domain,
    ) as URI;
    console.log('audio', { spdOptions });
    lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.calldirection = 'outbound';
    lineObj.SipSession.data.dst = dialledNumber;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
    lineObj.SipSession.data.videoSourceDevice = null;
    lineObj.SipSession.data.audioSourceDevice = getAudioSrcID();
    lineObj.SipSession.data.audioOutputDevice = getAudioOutputID();
    lineObj.SipSession.data.terminateby = 'them';
    lineObj.SipSession.data.withvideo = false;
    lineObj.SipSession.data.earlyReject = false;
    lineObj.SipSession.isOnHold = false;
    lineObj.SipSession.delegate = {
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
          false,
        );
      },
    };
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        // OutgoingRequestDelegate
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
          onInviteAccepted(lineObj, false, sip);
        },
        onReject: function (sip) {
          onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
        },
      },
    };
    lineObj.SipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj);
    // $('#line-' + lineObj.LineNumber + '-btn-settings').removeAttr('disabled'); TODO #SH ui integration
    // $('#line-' + lineObj.LineNumber + '-btn-audioCall').prop('disabled', 'disabled');
    // $('#line-' + lineObj.LineNumber + '-btn-videoCall').prop('disabled', 'disabled');
    // $('#line-' + lineObj.LineNumber + '-btn-search').removeAttr('disabled');

    // $('#line-' + lineObj.LineNumber + '-progress').show();
    // $('#line-' + lineObj.LineNumber + '-msg').show();

    // UpdateUI();
    // UpdateBuddyList();
    // updateLineScroll(lineObj.LineNumber);

    // // Custom Web hook
    // if (typeof web_hook_on_invite !== 'undefined') web_hook_on_invite(lineObj.SipSession);
  }

  // Handle inbound video calls
  function answerVideoSession(lineNumber: LineType['LineNumber']) {
    // CloseWindow();

    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Failed to get line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
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
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    const spdOptions: SPDOptionsType = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: { deviceId: 'default' },
          video: { deviceId: 'default' },
        },
      },
    };

    // Configure Audio
    const currentAudioDevice = getAudioSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
    if (currentAudioDevice != 'default') {
      let confirmedAudioDevice = false;
      for (let i = 0; i < audioInputDevices.length; ++i) {
        if (currentAudioDevice == audioInputDevices[i].deviceId) {
          confirmedAudioDevice = true;
          break;
        }
      }
      if (confirmedAudioDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
          exact: currentAudioDevice,
        };
      } else {
        console.warn(
          'The audio device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('AudioSrcId', 'default');
      }
    }
    // Add additional Constraints
    if (supportedConstraints.autoGainControl) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
        AutoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        EchoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        NoiseSuppression;
    }

    // Configure Video
    const currentVideoDevice = getVideoSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video !== 'object') return; // type checking assurance
    if (currentVideoDevice != 'default') {
      let confirmedVideoDevice = false;
      for (let i = 0; i < videoInputDevices.length; ++i) {
        if (currentVideoDevice == videoInputDevices[i].deviceId) {
          confirmedVideoDevice = true;
          break;
        }
      }
      if (confirmedVideoDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
          exact: currentVideoDevice,
        };
      } else {
        console.warn(
          'The video device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('VideoSrcId', 'default'); // resets for later and subsequent calls
      }
    }
    // Add additional Constraints
    if (supportedConstraints.frameRate && maxFrameRate != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate = maxFrameRate;
    }
    if (supportedConstraints.height && videoHeight != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.height = videoHeight;
    }
    if (supportedConstraints.aspectRatio && videoAspectRatio != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio = videoAspectRatio;
    }

    // Save Devices
    session.data.withvideo = true;
    session.data.videoSourceDevice = getVideoSrcID();
    session.data.audioSourceDevice = getAudioSrcID();
    session.data.audioOutputDevice = getAudioOutputID();

    // if (StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber); TODO #SH StartVideoFullScreen

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

  // Handle outbound video calls
  function makeVideoCall(lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj == null) return;

    if (!hasAudioDevice) {
      alert('lang.alert_no_microphone');
      return;
    }

    if (hasVideoDevice == false) {
      console.warn('No video devices (webcam) found, switching to audio call.');
      makeAudioCall(lineObj, dialledNumber);
      return;
    }

    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    const spdOptions: SPDOptionsType = {
      earlyMedia: true,
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: { deviceId: 'default' },
          video: { deviceId: 'default' },
        },
      },
    };

    // Configure Audio
    const currentAudioDevice = getAudioSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
    if (currentAudioDevice != 'default') {
      let confirmedAudioDevice = false;
      for (let i = 0; i < audioInputDevices.length; ++i) {
        if (currentAudioDevice == audioInputDevices[i].deviceId) {
          confirmedAudioDevice = true;
          break;
        }
      }
      if (confirmedAudioDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
          exact: currentAudioDevice,
        };
      } else {
        console.warn(
          'The audio device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('AudioSrcId', 'default');
      }
    }
    // Add additional Constraints
    if (supportedConstraints.autoGainControl) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
        AutoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        EchoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        NoiseSuppression;
    }

    // Configure Video
    const currentVideoDevice = getVideoSrcID();
    if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video !== 'object') return; // type checking assurance

    if (currentVideoDevice != 'default') {
      let confirmedVideoDevice = false;
      for (let i = 0; i < videoInputDevices.length; ++i) {
        if (currentVideoDevice == videoInputDevices[i].deviceId) {
          confirmedVideoDevice = true;
          break;
        }
      }
      if (confirmedVideoDevice) {
        spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
          exact: currentVideoDevice,
        };
      } else {
        console.warn(
          'The video device you used before is no longer available, default settings applied.',
        );
        localStorage.setItem('VideoSrcId', 'default'); // resets for later and subsequent calls
      }
    }
    // Add additional Constraints
    if (supportedConstraints.frameRate && maxFrameRate != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate = maxFrameRate;
    }
    if (supportedConstraints.height && videoHeight != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.height = videoHeight;
    }
    if (supportedConstraints.aspectRatio && videoAspectRatio != '') {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio = videoAspectRatio;
    }
    // Extra Headers
    if (extraHeaders) {
      spdOptions.extraHeaders = extraHeaders;
    } else {
      spdOptions.extraHeaders = [];
    }
    if (InviteExtraHeaders && InviteExtraHeaders != '' && InviteExtraHeaders != '{}') {
      try {
        const inviteExtraHeaders = JSON.parse(InviteExtraHeaders);
        for (const [key, value] of Object.entries(inviteExtraHeaders)) {
          if (value == '') {
            // This is a header, must be format: "Field: Value"
          } else {
            spdOptions.extraHeaders.push(key + ': ' + value);
          }
        }
      } catch (e) {}
    }

    // $('#line-' + lineObj.LineNumber + '-msg').html(lang.starting_video_call);
    // $('#line-' + lineObj.LineNumber + '-timer').show();

    const startTime = dayJs.utc();

    // Invite
    console.log('INVITE (video): ' + dialledNumber + '@' + config.domain);

    const targetURI = UserAgent.makeURI(
      'sip:' + dialledNumber.replace(/#/g, '%23') + '@' + config.domain,
    ) as URI;
    console.log('video', { spdOptions });

    lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.calldirection = 'outbound';
    lineObj.SipSession.data.dst = dialledNumber;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');

    lineObj.SipSession.data.videoSourceDevice = getVideoSrcID();
    lineObj.SipSession.data.audioSourceDevice = getAudioSrcID();
    lineObj.SipSession.data.audioOutputDevice = getAudioOutputID();
    lineObj.SipSession.data.terminateby = 'them';
    lineObj.SipSession.data.withvideo = true;
    lineObj.SipSession.data.earlyReject = false;
    lineObj.SipSession.isOnHold = false;
    lineObj.SipSession.delegate = {
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
        // OutgoingRequestDelegate
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
    lineObj.SipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });
    // updateLine(lineObj);
    // TODO  #SH ui integration
    // $('#line-' + lineObj.LineNumber + '-btn-settings').removeAttr('disabled');
    // $('#line-' + lineObj.LineNumber + '-btn-audioCall').prop('disabled', 'disabled');
    // $('#line-' + lineObj.LineNumber + '-btn-videoCall').prop('disabled', 'disabled');
    // $('#line-' + lineObj.LineNumber + '-btn-search').removeAttr('disabled');

    // $('#line-' + lineObj.LineNumber + '-progress').show();
    // $('#line-' + lineObj.LineNumber + '-msg').show();

    // UpdateUI();
    // UpdateBuddyList();
    // updateLineScroll(lineObj.LineNumber);
  }

  // Handle Reject calls
  function rejectCall(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
    if (!session || session instanceof Inviter) return;
    if (session.state == SessionState.Established) {
      session.bye().catch(function (e) {
        console.warn('Problem in rejectCall(), could not bye() call', e, session);
      });
    } else {
      session
        .reject({
          statusCode: 486,
          reasonPhrase: 'Busy Here',
        })
        .catch(function (e) {
          console.warn('Problem in rejectCall(), could not reject() call', e, session);
        });
    }

    session.data.terminateby = 'us';
    session.data.reasonCode = 486;
    session.data.reasonText = 'Busy Here';
    teardownSession(lineObj);
  }

  // Handle Dial User By Line Number
  function dialByLine(
    type: 'audio' | 'video',
    numToDial: string,
    buddy?: BuddyType,
    CallerID?: string,
    extraHeaders?: Array<string>,
    remoteVideoRef?: any,
  ) {
    if (userAgent == null || userAgent.isRegistered() == false) {
      // onError //TODO #SH
      alert('dialByLine error');
      return;
    }

    const numDial = numToDial;
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
    let buddyObj = buddy ? findBuddyByIdentity(buddy.identity) : findBuddyByDid(numDial);
    if (!buddyObj) {
      let buddyType: BuddyType['type'] = numDial.length > DidLength ? 'contact' : 'extension';
      // Assumption but anyway: If the number starts with a * or # then its probably not a subscribable did,
      // and is probably a feature code.
      if (numDial.substring(0, 1) == '*' || numDial.substring(0, 1) == '#') buddyType = 'contact';
      buddyObj = new Buddy(
        buddyType,
        uuidv4(),
        numDial,
        '',
        CallerID ? CallerID : numDial,
        numDial,
        '',
        '',
        '',
        '',
        '',
      );
    }
    console.log({ buddyObj });
    // Create a Line
    newLineNumber++;
    const lineObj = new Line(newLineNumber, buddyObj.CallerIDName, numDial, buddyObj);
    // SelectLine(newLineNumber); TODO #SH
    // UpdateBuddyList();

    // Start Call Invite
    if (type === 'audio') {
      makeAudioCall(lineObj, numDial, extraHeaders);
    } else {
      makeVideoCall(lineObj, numDial, extraHeaders ?? []);
    }
    addLine(lineObj);
  }

  /* -------------------------------------------------------------------------- */
  /*                        In-Session Call Functionality                       */
  /*                           HOLD/MUTE/END/TRANSFER                           */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- HOLD/UNHOLD ------------------------------ */
  // Hold Call Session
  function holdSession(lineNum: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNum);
    if (lineObj == null || lineObj.SipSession == null) return;
    const session = lineObj.SipSession;
    if (session.isOnHold == true) {
      console.log('Call is is already on hold:', lineNum);
      return;
    }
    console.log('Putting Call on hold:', lineNum);
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
                    session.data.AudioSourceTrack &&
                    session.data.AudioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Muting Mixed Audio Track : ' + session.data.AudioSourceTrack.label,
                    );
                    session.data.AudioSourceTrack.enabled = false;
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
          console.log('Call is is on hold:', lineNum);

          // Log Hold
          if (!session.data.hold) session.data.hold = [];
          session.data.hold.push({ event: 'hold', eventTime: utcDateNow() });
          session.data.isHold = true;

          // updateLineScroll(lineNum);

          // Custom Web hook
        },
        onReject: function () {
          session.isOnHold = false;
          console.warn('Failed to put the call on hold:', lineNum);
        },
      },
    };
    session.invite(options).catch(function (error) {
      session.isOnHold = false;
      console.warn('Error attempting to put the call on hold:', error);
    });
    updateLine(lineObj);
  }

  // Un-Hold Call Session
  function unholdSession(lineNum: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNum);
    if (lineObj == null || lineObj.SipSession == null) return;
    const session = lineObj.SipSession;
    if (session.isOnHold == false) {
      console.log('Call is already off hold:', lineNum);
      return;
    }
    console.log('Taking call off hold:', lineNum);
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
                    session.data.AudioSourceTrack &&
                    session.data.AudioSourceTrack.kind == 'audio'
                  ) {
                    console.log(
                      'Unmuting Mixed Audio Track : ' + session.data.AudioSourceTrack.label,
                    );
                    session.data.AudioSourceTrack.enabled = true;
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
          console.log('Call is off hold:', lineNum);

          // $('#line-' + lineNum + '-btn-Hold').show();
          // $('#line-' + lineNum + '-btn-Unhold').hide();
          // $('#line-' + lineNum + '-msg').html(lang.call_in_progress);

          // Log Hold
          if (!session.data.hold) session.data.hold = [];
          session.data.hold.push({ event: 'unhold', eventTime: utcDateNow() });
          session.data.isHold = false;

          // updateLineScroll(lineNum);
        },
        onReject: function () {
          session.isOnHold = true;
          console.warn('Failed to put the call on hold', lineNum);
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
  // Mute Call Session
  function muteSession(lineNum: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNum);
    if (lineObj == null || lineObj.SipSession == null) return;

    // $('#line-' + lineNum + '-btn-Unmute').show();
    // $('#line-' + lineNum + '-btn-Mute').hide();

    const session = lineObj.SipSession;
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
        const track = RTCRtpSender.track as MediaStreamTrackType;

        if (track.IsMixedTrack == true) {
          if (session.data.AudioSourceTrack && session.data.AudioSourceTrack.kind == 'audio') {
            console.log('Muting Mixed Audio Track : ' + session.data.AudioSourceTrack.label);
            session.data.AudioSourceTrack.enabled = false;
          }
        }
        console.log('Muting Audio Track : ' + track.label);
        track.enabled = false;
      }
    });

    if (!session.data.mute) session.data.mute = [];
    session.data.mute.push({ event: 'mute', eventTime: utcDateNow() });
    session.data.isMute = true;

    // $('#line-' + lineNum + '-msg').html(lang.call_on_mute);

    // updateLineScroll(lineNum);
    updateLine(lineObj);
  }

  // Un-Mute Call Session
  function unmuteSession(lineNum: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNum);
    if (lineObj == null || lineObj.SipSession == null) return;

    // $('#line-' + lineNum + '-btn-Unmute').hide();
    // $('#line-' + lineNum + '-btn-Mute').show();

    const session = lineObj.SipSession;
    const pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
        const track = RTCRtpSender.track as MediaStreamTrackType;

        if (track.IsMixedTrack == true) {
          if (session.data.AudioSourceTrack && session.data.AudioSourceTrack.kind == 'audio') {
            console.log('Unmuting Mixed Audio Track : ' + session.data.AudioSourceTrack.label);
            session.data.AudioSourceTrack.enabled = true;
          }
        }
        console.log('Unmuting Audio Track : ' + track.label);
        track.enabled = true;
      }
    });

    if (!session.data.mute) session.data.mute = [];
    session.data.mute.push({ event: 'unmute', eventTime: utcDateNow() });
    session.data.isMute = false;

    // $('#line-' + lineNum + '-msg').html(lang.call_off_mute);

    // updateLineScroll(lineNum);

    // Custom Web hook
    // if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('unmute', session);
    updateLine(lineObj);
  }

  /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
  // Cancle And Terminate Call Session
  function cancelSession(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.SipSession == null) return;
    const session = lineObj.SipSession;
    if (!(session instanceof Inviter)) return;
    session.data.terminateby = 'us';
    session.data.reasonCode = 0;
    session.data.reasonText = 'Call Cancelled';

    console.log('Cancelling session : ' + lineNumber);
    if (session.state == SessionState.Initial || session.state == SessionState.Establishing) {
      session.cancel();
    } else {
      console.warn('Session not in correct state for cancel.', lineObj.SipSession.state);
      console.log('Attempting teardown : ' + lineNumber);
      teardownSession(lineObj);
    }
  }

  // Terminate Call Session Based on Session State
  function endSession(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
    if (!session) return;
    switch (session.state) {
      case SessionState.Initial:
      case SessionState.Establishing:
        if (session instanceof Inviter) {
          // An unestablished outgoing session
          session.data.terminateby = 'us';
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
              console.warn('Problem in rejectCall(), could not reject() call', e, session);
            });

          session.data.terminateby = 'us';
          session.data.reasonCode = 486;
          session.data.reasonText = 'Busy Here';
          teardownSession(lineObj);
        }
        break;
      case SessionState.Established:
        session.bye().catch(function (e) {
          console.warn('Problem in rejectCall(), could not bye() call', e, session);
        });

        session.data.terminateby = 'us';
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

  // Teardown Call Session Based on Line
  function teardownSession(lineObj: LineType) {
    if (lineObj == null || lineObj.SipSession == null) return;

    const session = lineObj.SipSession;
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
          session.data.childsession = null;
          // Suppress message
        });
    }

    // Mixed Tracks
    if (session.data.AudioSourceTrack && session.data.AudioSourceTrack.kind == 'audio') {
      session.data.AudioSourceTrack.stop();
      session.data.AudioSourceTrack = null;
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
    if (session.data.calldirection == 'inbound') {
      if (session.data.earlyReject) {
        // Call was rejected without even ringing
        //   IncreaseMissedBadge(session.data.buddyId); TODO #SH
      } else if (session.data.terminateby == 'them' && session.data.startTime == null) {
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
    removeLine(lineObj.LineNumber);
  }
  /* -------------------------------- TRANSFER -------------------------------- */
  // Start Transfer Call Session
  function startTransferSession(lineNumber: LineType['LineNumber']) {
    // if ($('#line-' + lineNum + '-btn-CancelConference').is(':visible')) { //TODO #SH
    //   CancelConference(lineNum);
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
    // RestoreCallControls(lineNum);
    // $('#line-' + lineNum + '-btn-blind-transfer').show();
    // $('#line-' + lineNum + '-btn-attended-transfer').show();
    // $('#line-' + lineNum + '-btn-complete-transfer').hide();
    // $('#line-' + lineNum + '-btn-cancel-transfer').hide();
    // $('#line-' + lineNum + '-btn-complete-attended-transfer').hide();
    // $('#line-' + lineNum + '-btn-cancel-attended-transfer').hide();
    // $('#line-' + lineNum + '-btn-terminate-attended-transfer').hide();
    // $('#line-' + lineNum + '-transfer-status').hide();
    // $('#line-' + lineNum + '-Transfer').show();
    // updateLineScroll(lineNum); TODO #SH
  }

  // Cancel Transfer Call Session
  function cancelTransferSession(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    console.log('cancelTransferSession', { lineObj });
    if (lineObj == null || lineObj.SipSession == null) {
      console.warn('Null line or session');
      return;
    }
    const session = lineObj.SipSession;
    if (session.data.childsession) {
      console.log('Child Transfer call detected:', session.data.childsession.state);
      session.data.childsession
        .dispose()
        .then(function () {
          session.data.childsession = null;
        })
        .catch(function (error) {
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

    // updateLineScroll(lineNum);
    updateLine(lineObj);
  }

  // function BlindTransfer(lineNum) {
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

  //   var lineObj = FindLineByNumber(lineNum);
  //   if (lineObj == null || lineObj.SipSession == null) {
  //     console.warn("Null line or session");
  //     return;
  //   }
  //   var session = lineObj.SipSession;

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

  //         session.data.terminateby = "us";
  //         session.data.reasonCode = 202;
  //         session.data.reasonText = "Transfer";

  //         session.data.transfer[transferId].accept.complete = true;
  //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
  //         session.data.transfer[transferId].accept.eventTime = utcDateNow();

  //         // TODO: use lang pack
  //         $("#line-" + lineNum + "-msg").html("Call Blind Transferred (Accepted)");

  //         updateLineScroll(lineNum);

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

  //         updateLineScroll(lineNum);

  //         // Session should still be up, so just allow them to try again
  //       },
  //     },
  //   };
  //   console.log("REFER: ", dstNo + "@" + SipDomain);
  //   var referTo = SIP.UserAgent.makeURI("sip:" + dstNo.replace(/#/g, "%23") + "@" + SipDomain);
  //   session.refer(referTo, transferOptions).catch(function (error) {
  //     console.warn("Failed to REFER", error);
  //   });

  //   $("#line-" + lineNum + "-msg").html(lang.call_blind_transfered);

  //   updateLineScroll(lineNum);
  // }
  //

  // Attend Transfer Call Session
  function attendedTransferSession(baseLine: LineType, transferLineNumber: LineType['LineNumber']) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    const dstNo = String(transferLineNumber);
    if (dstNo === '') {
      console.warn('Cannot transfer, no number');
      return;
    }

    let lineObj = baseLine;
    console.log('attendedTransfer lineNumber', userAgent.isRegistered(), dstNo, lineObj);
    if (!lineObj?.SipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.SipSession;
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
        AutoGainControl;
    }
    if (supportedConstraints.echoCancellation) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
        EchoCancellation;
    }
    if (supportedConstraints.noiseSuppression) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
        NoiseSuppression;
    }

    // Not sure if its possible to transfer a Video call???
    if (session.data.withvideo) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video = {} as any;
      const video = spdOptions.sessionDescriptionHandlerOptions.constraints
        .video as VideoSessionConstraints;
      if (session.data.videoSourceDevice && session.data.videoSourceDevice != 'default') {
        video.deviceId = {
          exact: session.data.videoSourceDevice,
        };
      }
      // Add additional Constraints
      if (supportedConstraints.frameRate && maxFrameRate != '') {
        video.frameRate = maxFrameRate;
      }
      if (supportedConstraints.height && videoHeight != '') {
        video.height = videoHeight;
      }
      if (supportedConstraints.aspectRatio && videoAspectRatio != '') {
        video.aspectRatio = videoAspectRatio;
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
    console.log(555, 'TRANSFER INVITE: ', 'sip:' + dstNo + '@' + config.domain, spdOptions);
    const targetURI = UserAgent.makeURI(
      'sip:' + dstNo.replace(/#/g, '%23') + '@' + config.domain,
    ) as URI;
    const newSession = new Inviter(userAgent, targetURI, spdOptions);
    newSession.data = {};
    newSession.delegate = {
      onBye: function (sip) {
        console.log('New call session ended with BYE');
        if (session.data.transfer) {
          session.data.transfer[transferId].disposition = 'bye';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
        }
      },
      onSessionDescriptionHandler: function (sdh: SipSessionDescriptionHandler, provisional) {
        onTransferSessionDescriptionHandlerCreated(
          lineObj,
          session as SipSessionType,
          sdh,
          session?.data?.withvideo,
        );
      },
    };
    session.data.childsession = newSession as SipSessionType;
    const inviterOptions: InviterInviteOptions = {
      requestDelegate: {
        onTrying: function (sip) {
          console.log('attend1');
          if (!session.data.transfer) return;
          session.data.transfer[transferId].disposition = 'trying';
          session.data.transfer[transferId].dispositionTime = utcDateNow();
        },
        onProgress: function (sip) {
          console.log('attend2');

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
          console.log('attend3');

          console.log('Redirect received:', sip);
        },
        onAccept: function (sip) {
          console.log('attend4');

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

                session.data.terminateby = 'us';
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

  // function BlindTransfer(lineNum) {
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

  //   var lineObj = FindLineByNumber(lineNum);
  //   if (lineObj == null || lineObj.SipSession == null) {
  //     console.warn("Null line or session");
  //     return;
  //   }
  //   var session = lineObj.SipSession;

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

  //         session.data.terminateby = "us";
  //         session.data.reasonCode = 202;
  //         session.data.reasonText = "Transfer";

  //         session.data.transfer[transferId].accept.complete = true;
  //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
  //         session.data.transfer[transferId].accept.eventTime = utcDateNow();

  //         // TODO: use lang pack
  //         $("#line-" + lineNum + "-msg").html("Call Blind Transferred (Accepted)");

  //         updateLineScroll(lineNum);

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

  //         updateLineScroll(lineNum);

  //         // Session should still be up, so just allow them to try again
  //       },
  //     },
  //   };
  //   console.log("REFER: ", dstNo + "@" + SipDomain);
  //   var referTo = SIP.UserAgent.makeURI("sip:" + dstNo.replace(/#/g, "%23") + "@" + SipDomain);
  //   session.refer(referTo, transferOptions).catch(function (error) {
  //     console.warn("Failed to REFER", error);
  //   });

  //   $("#line-" + lineNum + "-msg").html(lang.call_blind_transfered);

  //   updateLineScroll(lineNum);
  // }
  //

  // Cancel Attend Transfer Call Session
  function cancelAttendedTransferSession(
    baseLine: LineType,
    transferLineNumber: LineType['LineNumber'],
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
    if (!lineObj?.SipSession) {
      console.warn('Null line or session');
      return;
    }

    const session = lineObj.SipSession;
    if (!session) return;
    if (!session.data.transfer) return;
    session.data.transfer.forEach((transfer) => {
      if (transfer.to === transferLineNumber) transfer.onCancle?.();
    });

    // updateLine(lineObj);
  }
  /* -------------------------------------------------------------------------- */

  return {
    receiveCall,
    answerAudioSession,
    answerVideoSession,
    makeAudioCall,
    makeVideoCall,
    rejectCall,
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
