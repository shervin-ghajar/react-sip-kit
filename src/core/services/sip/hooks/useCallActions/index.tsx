import { dayJs } from '../../../../../utils';
import {
  AutoAnswerEnabled,
  AutoAnswerPolicy,
  AutoDeleteDefault,
  AutoGainControl,
  CallWaitingEnabled,
  DidLength,
  DoNotDisturbEnabled,
  DoNotDisturbPolicy,
  EchoCancellation,
  EnableRingtone,
  EnableVideoCalling,
  IntercomPolicy,
  InviteExtraHeaders,
  localStorage,
  maxFrameRate,
  NoiseSuppression,
  videoAspectRatio,
  videoHeight,
} from '../../configs';
import { Buddy, Line } from '../../constructors';
import {
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
} from '../../events/session';
import { teardownSession } from '../../methods/session';
import { useSipStore } from '../../store';
import {
  BuddyType,
  LineType,
  SipInvitationType,
  SipInviterType,
  SipSessionDescriptionHandler,
} from '../../store/types';
import {
  formatShortDuration,
  getAudioOutputID,
  getAudioSrcID,
  getRingerOutputID,
  getVideoSrcID,
} from '../../utils';
import { CallActionType, SPDOptionsType, UseCallActionReturnType } from './types';
import { Inviter, InviterInviteOptions, SessionState, URI, UserAgent } from 'sip.js';

let newLineNumber = 0;

export const useCallActions = ({ config }: CallActionType): UseCallActionReturnType => {
  const {
    findBuddyByDid,
    findBuddyByIdentity,
    findLineByNumber,
    addLine,
    removeLine,
    countSessions,
    userAgent,
    audioBlobs,
    hasAudioDevice,
    hasVideoDevice,
    audioInputDevices,
    videoInputDevices,
  } = useSipStore();

  // Handle incoming calls
  function ReceiveCall(session: SipInvitationType) {
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
    lineObj.SipSession.isInviter = false;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.calldirection = 'inbound';
    lineObj.SipSession.data.terminateby = '';
    lineObj.SipSession.data.src = did;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
    lineObj.SipSession.data.callTimer = window.setInterval(function () {
      const now = dayJs.utc();
      const duration = dayJs.duration(now.diff(startTime));
      const timeStr = formatShortDuration(duration.asSeconds());
    }, 1000);
    console.log('callTimer', lineObj.SipSession.data);
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
        console.log('onBye1');
        onSessionReceivedBye(lineObj, sip);
      },
      onMessage: function (sip) {
        console.log('onBye2');
        onSessionReceivedMessage(lineObj, sip);
      },
      onInvite: function (sip) {
        console.log('onBye3');
        onSessionReinvited(lineObj, sip);
      },
      onSessionDescriptionHandler: function (sdh, provisional) {
        console.log('onBye4');
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
        onInviteCancel(lineObj, sip, () => {
          removeLine(lineObj.LineNumber);
        });
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
        RejectCall(lineObj.LineNumber);
        return;
      }
    }
    const CurrentCalls = countSessions(session.id);
    console.log({ CurrentCalls });
    if (CurrentCalls >= 1) {
      if (CallWaitingEnabled == false || CallWaitingEnabled == 'disabled') {
        console.log('Call Waiting Disabled, rejecting call.');
        lineObj.SipSession.data.earlyReject = true;
        RejectCall(lineObj.LineNumber);
        return;
      }
    }

    addLine(lineObj);

    // Auto Answer options
    let autoAnswerRequested = false;
    let answerTimeout = 1000;
    if (!AutoAnswerEnabled && IntercomPolicy == 'enabled') {
      // Check headers only if policy is allow

      // https://github.com/InnovateAsterisk/Browser-Phone/issues/126
      // Alert-Info: info=alert-autoanswer
      // Alert-Info: answer-after=0
      // Call-info: answer-after=0; x=y
      // Call-Info: Answer-After=0
      // Alert-Info: ;info=alert-autoanswer
      // Alert-Info: <sip:>;info=alert-autoanswer
      // Alert-Info: <sip:domain>;info=alert-autoanswer

      const ci = session.request.headers['Call-Info'];
      if (ci !== undefined && ci.length > 0) {
        for (let i = 0; i < ci.length; i++) {
          const raw_ci = ci[i].raw.toLowerCase();
          if (raw_ci.indexOf('answer-after=') > 0) {
            const temp_seconds_autoanswer = parseInt(
              raw_ci
                .substring(raw_ci.indexOf('answer-after=') + 'answer-after='.length)
                .split(';')[0],
            );
            if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
              autoAnswerRequested = true;
              if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
              break;
            }
          }
        }
      }
      const ai = session.request.headers['Alert-Info'];
      if (autoAnswerRequested === false && ai !== undefined && ai.length > 0) {
        for (let i = 0; i < ai.length; i++) {
          const raw_ai = ai[i].raw.toLowerCase();
          if (raw_ai.indexOf('auto answer') > 0 || raw_ai.indexOf('alert-autoanswer') > 0) {
            autoAnswerRequested = true;
            break;
          }
          if (raw_ai.indexOf('answer-after=') > 0) {
            const temp_seconds_autoanswer = parseInt(
              raw_ai
                .substring(raw_ai.indexOf('answer-after=') + 'answer-after='.length)
                .split(';')[0],
            );
            if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
              autoAnswerRequested = true;
              if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
              break;
            }
          }
        }
      }
    }

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
            AnswerVideoCall(lineObj.LineNumber);
          } else {
            AnswerAudioCall(lineObj.LineNumber);
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
    //           AnswerVideoCall(lineNo);
    //         } else {
    //           AnswerAudioCall(lineNo);
    //         }
    //       }, 1000);

    //       // Select Buddy
    //       SelectLine(lineNo);
    //       return;
    //     };
    //   }
    // }

    // Play Ring Tone if not on the phone
    if (EnableRingtone == true) {
      if (CurrentCalls >= 1) {
        // Play Alert
        console.log('Audio:', audioBlobs.CallWaiting.url);
        const ringer = new Audio(audioBlobs.CallWaiting.blob);
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
        console.log('Audio:', audioBlobs.Ringtone.url);
        const ringer = new Audio(audioBlobs.Ringtone.blob);
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
  }

  // Handle inbound calls
  function AnswerAudioCall(lineNumber: LineType['LineNumber']) {
    // CloseWindow();

    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Failed to get line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
    if (!session || session.isInviter) return;
    // Stop the ringtone
    if (session.data.ringerObj) {
      session.data.ringerObj.pause();
      session.data.ringerObj.removeAttribute('src');
      session.data.ringerObj.load();
      session.data.ringerObj = null;
    }
    // Check vitals
    if (hasAudioDevice == false) {
      alert('lang.alert_no_microphone');
      return;
    }

    // Start SIP handling
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
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
        teardownSession(lineObj, () => {
          removeLine(lineObj.LineNumber);
        });
      });
  }

  // Handle outbound calls
  function AudioCall(lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) {
    if (userAgent == null) return;
    if (userAgent.isRegistered() == false) return;
    if (lineObj == null) return;

    if (hasAudioDevice == false) {
      alert('lang.alert_no_microphone');
      return;
    }

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
    lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.SipSession.isInviter = true;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.calldirection = 'outbound';
    lineObj.SipSession.data.dst = dialledNumber;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
    lineObj.SipSession.data.callTimer = window.setInterval(function () {
      const now = dayJs.utc();
      const duration = dayJs.duration(now.diff(startTime));
      const timeStr = formatShortDuration(duration.asSeconds());
      // $('#line-' + lineObj.LineNumber + '-timer').html(timeStr);
      // $('#line-' + lineObj.LineNumber + '-datetime').html(timeStr);
    }, 1000);
    lineObj.SipSession.data.videoSourceDevice = null;
    lineObj.SipSession.data.audioSourceDevice = getAudioSrcID();
    lineObj.SipSession.data.audioOutputDevice = getAudioOutputID();
    lineObj.SipSession.data.terminateby = 'them';
    lineObj.SipSession.data.withvideo = false;
    lineObj.SipSession.data.earlyReject = false;
    lineObj.SipSession.isOnHold = false;
    lineObj.SipSession.delegate = {
      onBye: function (sip) {
        onSessionReceivedBye(lineObj, sip);
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
          onInviteRejected(lineObj, sip);
        },
      },
    };
    lineObj.SipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });

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
  function AnswerVideoCall(lineNumber: LineType['LineNumber']) {
    // CloseWindow();

    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Failed to get line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
    if (!session || session.isInviter) return;
    // Stop the ringtone
    if (session.data.ringerObj) {
      session.data.ringerObj.pause();
      session.data.ringerObj.removeAttribute('src');
      session.data.ringerObj.load();
      session.data.ringerObj = null;
    }
    // Check vitals
    if (hasAudioDevice == false) {
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
        teardownSession(lineObj, () => {
          removeLine(lineObj.LineNumber);
        });
      });
  }

  // Handle outbound video calls
  function VideoCall(lineObj: LineType, dialledNumber: string, extraHeaders: Array<string>) {
    if (userAgent == null) return;
    if (!userAgent.isRegistered()) return;
    if (lineObj == null) return;

    if (hasAudioDevice == false) {
      alert('lang.alert_no_microphone');
      return;
    }

    if (hasVideoDevice == false) {
      console.warn('No video devices (webcam) found, switching to audio call.');
      AudioCall(lineObj, dialledNumber);
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
    lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions) as SipInviterType;
    lineObj.SipSession.isInviter = true;
    lineObj.SipSession.data = {};
    lineObj.SipSession.data.line = lineObj.LineNumber;
    lineObj.SipSession.data.buddyId = lineObj?.BuddyObj?.identity;
    lineObj.SipSession.data.calldirection = 'outbound';
    lineObj.SipSession.data.dst = dialledNumber;
    lineObj.SipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
    lineObj.SipSession.data.callTimer = window.setInterval(function () {
      const now = dayJs.utc();
      const duration = dayJs.duration(now.diff(startTime));
      const timeStr = formatShortDuration(duration.asSeconds());
      // $('#line-' + lineObj.LineNumber + '-timer').html(timeStr);
      // $('#line-' + lineObj.LineNumber + '-datetime').html(timeStr);
    }, 1000);
    lineObj.SipSession.data.videoSourceDevice = getVideoSrcID();
    lineObj.SipSession.data.audioSourceDevice = getAudioSrcID();
    lineObj.SipSession.data.audioOutputDevice = getAudioOutputID();
    lineObj.SipSession.data.terminateby = 'them';
    lineObj.SipSession.data.withvideo = true;
    lineObj.SipSession.data.earlyReject = false;
    lineObj.SipSession.isOnHold = false;
    lineObj.SipSession.delegate = {
      onBye: function (sip) {
        onSessionReceivedBye(lineObj, sip);
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
          onInviteRejected(lineObj, sip);
        },
      },
    };
    lineObj.SipSession.invite(inviterOptions).catch(function (e) {
      console.warn('Failed to send INVITE:', e);
    });

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
  function RejectCall(lineNumber: LineType['LineNumber']) {
    console.log(555, 'RejectCall');
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
      return;
    }
    const session = lineObj.SipSession;
    if (!session || session.isInviter) return;
    if (session.state == SessionState.Established) {
      session.bye().catch(function (e) {
        console.warn('Problem in RejectCall(), could not bye() call', e, session);
      });
    } else {
      session
        .reject({
          statusCode: 486,
          reasonPhrase: 'Busy Here',
        })
        .catch(function (e) {
          console.warn('Problem in RejectCall(), could not reject() call', e, session);
        });
    }

    session.data.terminateby = 'us';
    session.data.reasonCode = 486;
    session.data.reasonText = 'Busy Here';
    teardownSession(lineObj, () => {
      removeLine(lineObj.LineNumber);
    });
  }

  function DialByLine(
    type: 'audio' | 'video',
    buddy: BuddyType,
    numToDial: string,
    CallerID: string,
    extraHeaders: Array<string>,
  ) {
    if (userAgent == null || userAgent.isRegistered() == false) {
      // onError //TODO #SH
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
    if (buddyObj == null) {
      let buddyType: BuddyType['type'] = numDial.length > DidLength ? 'contact' : 'extension';
      // Assumption but anyway: If the number starts with a * or # then its probably not a subscribable did,
      // and is probably a feature code.
      if (numDial.substring(0, 1) == '*' || numDial.substring(0, 1) == '#') buddyType = 'contact';
      buddyObj = new Buddy(
        buddyType,
        buddy.identity,
        false,
        false,
        CallerID ? CallerID : numDial,
        numDial,
        null,
        false,
        null,
        AutoDeleteDefault,
        false,
      );
    }
    console.log({ buddyObj });
    return;
    // // Create a Line
    // newLineNumber = newLineNumber + 1;
    // const lineObj = new Line(newLineNumber, buddyObj.CallerIDName, numDial, buddyObj);
    // addLine(lineObj);
    // // SelectLine(newLineNumber); TODO #SH
    // // UpdateBuddyList();

    // // Start Call Invite
    // if (type == 'audio') {
    //   AudioCall(lineObj, numDial, extraHeaders);
    // } else {
    //   VideoCall(lineObj, numDial, extraHeaders);
    // }
  }

  /* -------------------------------------------------------------------------- */
  /*                        In-Session Call Functionality                       */
  /* -------------------------------------------------------------------------- */
  function cancelSession(lineNumber: LineType['LineNumber']) {
    const lineObj = findLineByNumber(lineNumber);
    if (lineObj == null || lineObj.SipSession == null) return;
    const session = lineObj.SipSession;
    if (!session.isInviter) return;
    session.data.terminateby = 'us';
    session.data.reasonCode = 0;
    session.data.reasonText = 'Call Cancelled';

    console.log('Cancelling session : ' + lineNumber);
    if (session.state == SessionState.Initial || session.state == SessionState.Establishing) {
      session.cancel();
    } else {
      console.warn('Session not in correct state for cancel.', lineObj.SipSession.state);
      console.log('Attempting teardown : ' + lineNumber);
      teardownSession(lineObj, () => {
        removeLine(lineObj.LineNumber);
      });
    }
  }

  return {
    ReceiveCall,
    AnswerAudioCall,
    AnswerVideoCall,
    AudioCall,
    VideoCall,
    RejectCall,
    DialByLine,
  };
};
