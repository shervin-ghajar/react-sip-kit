import { LineType, SipSessionDescriptionHandler, SipSessionType } from '../../store/types';
import { CallbackFunction } from '../../types';
import { Bye, Message } from 'sip.js';
import { IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';
export declare const useSessionEvents: () => {
    onInviteCancel: (lineObj: LineType, response: IncomingRequestMessage, callback?: CallbackFunction<any>) => void;
    onInviteAccepted: (lineObj: LineType, includeVideo: boolean, response?: IncomingResponse) => Promise<void>;
    onInviteTrying: (lineObj: LineType, response: IncomingResponse) => void;
    onInviteProgress: (lineObj: LineType, response: IncomingResponse) => void;
    onInviteRejected: (lineObj: LineType, response: IncomingResponse, callback?: CallbackFunction<any>) => void;
    onInviteRedirected: (lineObj: LineType, response: IncomingResponse) => void;
    onSessionReceivedBye: (lineObj: LineType, response: Bye, callback?: CallbackFunction<any>) => void;
    onSessionReinvited: (lineObj: LineType, response: IncomingRequestMessage) => void;
    onSessionReceivedMessage: (lineObj: LineType, response: Message) => void;
    onSessionDescriptionHandlerCreated: (lineObj: LineType, sdh: SipSessionDescriptionHandler, provisional: boolean, includeVideo?: boolean) => void;
    onTrackAddedEvent: (lineObj: LineType, includeVideo?: boolean) => Promise<void>;
    onTransferSessionDescriptionHandlerCreated: (lineObj: LineType, session: SipSessionType, sdh: SipSessionDescriptionHandler, includeVideo?: boolean) => void;
};
