import { dayJs } from '../../../../../utils';
import {
  CallWaitingEnabled,
  DoNotDisturbEnabled,
  DoNotDisturbPolicy,
  EnableVideoCalling,
} from '../../configs';
import { Line } from '../../constructors';
import { useSipStore } from '../../store';
import { SipInvitationType } from '../../store/types';
import { formatShortDuration } from '../../utils';
import { CallActionType } from './types';

let newLineNumber = 0;

export const useCallActions = ({ config }: CallActionType) => {
  const { findBuddyByDid, addLine, countSessions } = useSipStore();

  // Handle incoming calls
  const ReceiveCall = (session: SipInvitationType) => {
    console.log('receiveCall', { session });
    const callerID = session.remoteIdentity.displayName || session.remoteIdentity.uri.user || '';
    let did = session.remoteIdentity.uri.user ?? '';

    console.log(`Incoming call from: ${callerID}`);

    var startTime = dayJs.utc();
    newLineNumber += 1;
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
    lineObj.SipSession.data.callTimer = window.setInterval(function () {
      const now = dayJs.utc();
      const duration = dayJs.duration(now.diff(startTime));
      const timeStr = formatShortDuration(duration.asSeconds());
    }, 1000);
    lineObj.SipSession.data.earlyReject = false;
    addLine(lineObj);
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
        // onSessionReceivedBye(lineObj, sip);
      },
      onMessage: function (sip) {
        // onSessionReceivedMessage(lineObj, sip);
      },
      onInvite: function (sip) {
        // onSessionReinvited(lineObj, sip);
      },
      onSessionDescriptionHandler: function (sdh, provisional) {
        // onSessionDescriptionHandlerCreated(
        //   lineObj,
        //   sdh,
        //   provisional,
        //   lineObj.SipSession.data.withvideo,
        // );
      },
    };
    // incomingInviteRequestDelegate
    lineObj.SipSession.incomingInviteRequest.delegate = {
      onCancel: function (sip) {
        // onInviteCancel(lineObj, sip);
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
        RejectCall(lineObj.LineNumber, true);
        return;
      }
    }
    const CurrentCalls = countSessions(session.id);

    if (CurrentCalls >= 1) {
      if (CallWaitingEnabled == false || CallWaitingEnabled == 'disabled') {
        console.log('Call Waiting Disabled, rejecting call.');
        lineObj.SipSession.data.earlyReject = true;
        RejectCall(lineObj.LineNumber, true);
        return;
      }
    }
  };

  // Handle Reject calls
  function RejectCall(lineNumber) {
    var lineObj = FindLineByNumber(lineNumber);
    if (lineObj == null) {
      console.warn('Unable to find line (' + lineNumber + ')');
      return;
    }
    var session = lineObj.SipSession;

    if (session.state == SIP.SessionState.Established) {
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
    teardownSession(lineObj);
  }

  return {
    ReceiveCall,
  };
};
