import { CallbackFunction } from '../../../../types';
import { SipLineType, SipSessionDescriptionHandler, SipSessionType } from '../../types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';
export declare const sessionEvents: () => {
    onInviteCancel: (lineObj: SipLineType, response: IncomingRequestMessage, callback?: CallbackFunction<any>) => void;
    onInviteAccepted: (lineObj: SipLineType, isVideoEnabled: boolean) => Promise<void>;
    onInviteTrying: (lineObj: SipLineType, response: IncomingResponse) => void;
    onInviteProgress: (lineObj: SipLineType, response: IncomingResponse) => void;
    onInviteRejected: (lineObj: SipLineType, response: IncomingResponse, callback?: CallbackFunction<any>) => void;
    onInviteRedirected: (lineObj: SipLineType, response: IncomingResponse) => void;
    onSessionReceivedBye: (lineObj: SipLineType, response: Bye, callback?: CallbackFunction<any>) => void;
    onSessionReinvited: (lineObj: SipLineType, response: IncomingRequestMessage) => void;
    onSessionReceivedMessage: (lineObj: SipLineType, response: Message) => void;
    onSessionDescriptionHandlerCreated: (lineObj: SipLineType, sdh: SipSessionDescriptionHandler, provisional: boolean, includeVideo?: boolean) => void;
    onTrackAddedEvent: (lineObj: SipLineType, videoEnabled?: boolean) => Promise<void>;
    onTransferSessionDescriptionHandlerCreated: (lineObj: SipLineType, session: SipSessionType, sdh: SipSessionDescriptionHandler, includeVideo?: boolean) => void;
};
