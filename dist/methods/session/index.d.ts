import { SipConfigs } from '../../configs/types';
import { LineType, SipInvitationType } from '../../store/types';
import { CallbackFunction, CallType } from '../../types';
import { DialRequestDelegate, SendMessageSessionEnum, SendMessageSessionValueType } from './types';
export declare const sessionMethods: ({ configKey }: {
    configKey: SipConfigs["key"];
}) => {
    receiveSession: (invitation: SipInvitationType) => void;
    answerAudioSession: (lineKey: LineType["lineKey"]) => void;
    answerVideoSession: (lineKey: LineType["lineKey"], enableVideo?: boolean) => void;
    makeAudioSession: (lineObj: LineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => DialRequestDelegate | undefined;
    makeVideoSession: (lineObj: LineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    toggleLocalVideoTrack: (lineKey: LineType["lineKey"]) => Promise<void>;
    toggleShareScreen: (lineKey: LineType["lineKey"]) => Promise<void>;
    rejectSession: (lineKey: LineType["lineKey"]) => void;
    dialByNumber: (type: Extract<CallType, "audio" | "video">, dialNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    endSession: (lineKey: LineType["lineKey"]) => void;
    recordSession: (lineKey: LineType["lineKey"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    toggleMuteSession: (lineKey: LineType["lineKey"]) => void;
    toggleHoldSession: (lineKey: LineType["lineKey"], forcedValue?: boolean) => Promise<void>;
    makeTransferSession: (lineKey: LineType["lineKey"], transferNumber: LineType["lineKey"]) => void;
    cancelTransferSession: (lineKey: LineType["lineKey"], transferNumber: LineType["lineKey"]) => void;
    cancelSession: (lineKey: LineType["lineKey"]) => void;
    teardownSession: typeof teardownSession;
};
/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export declare function teardownSession(lineObj: LineType, callback?: CallbackFunction): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: LineType['sipSession'], type: T, value: SendMessageSessionValueType[T]): Promise<void>;
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export declare function sendVideoActivationWithAckRetry(lineKey: LineType['lineKey'], session: LineType['sipSession'], options?: {
    maxRetries?: number;
    delayMs?: number;
}, value?: boolean): Promise<void>;
