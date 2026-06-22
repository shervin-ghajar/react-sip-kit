import { RtcConfig } from '../../../../configs/types';
import { CallbackFunction, CallType } from '../../../../types';
import { SipInvitationType, SipLineType } from '../../types';
import { DialRequestDelegate, SendMessageSessionEnum, SendMessageSessionValueType } from './types';
export declare const sessionMethods: ({ configKey }: {
    configKey: RtcConfig["key"];
}) => {
    receiveSession: (invitation: SipInvitationType) => void;
    answerAudioSession: (lineKey: SipLineType["lineKey"]) => void;
    answerVideoSession: (lineKey: SipLineType["lineKey"], enableVideo?: boolean) => void;
    makeAudioSession: (lineObj: SipLineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => DialRequestDelegate | undefined;
    makeVideoSession: (lineObj: SipLineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    toggleLocalVideoTrack: (lineKey: SipLineType["lineKey"]) => Promise<void>;
    toggleShareScreen: (lineKey: SipLineType["lineKey"]) => Promise<void>;
    rejectSession: (lineKey: SipLineType["lineKey"]) => void;
    dialByNumber: (type: Extract<CallType, "audio" | "video">, dialNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    endSession: (lineKey: SipLineType["lineKey"]) => void;
    recordSession: (lineKey: SipLineType["lineKey"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    toggleMuteSession: (lineKey: SipLineType["lineKey"]) => void;
    toggleHoldSession: (lineKey: SipLineType["lineKey"], forcedValue?: boolean) => Promise<void>;
    makeTransferSession: (lineKey: SipLineType["lineKey"], transferNumber: SipLineType["lineKey"]) => void;
    cancelTransferSession: (lineKey: SipLineType["lineKey"], transferNumber: SipLineType["lineKey"]) => void;
    cancelSession: (lineKey: SipLineType["lineKey"]) => void;
    teardownSession: typeof teardownSession;
};
/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export declare function teardownSession(lineObj: SipLineType, callback?: CallbackFunction): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: SipLineType['session'], type: T, value: SendMessageSessionValueType[T]): Promise<void>;
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export declare function sendVideoActivationWithAckRetry(lineKey: SipLineType['lineKey'], session: SipLineType['session'], options?: {
    maxRetries?: number;
    delayMs?: number;
}, value?: boolean): Promise<void>;
