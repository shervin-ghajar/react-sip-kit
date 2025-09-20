import { SipAccountConfig } from '../../configs/types';
import { LineType, SipInvitationType } from '../../store/types';
import { CallType } from '../../types';
import { SendMessageSessionEnum, SendMessageSessionValueType } from './types';
export declare const sessionMethods: ({ username }: {
    username: SipAccountConfig["username"];
}) => {
    receiveSession: (invitation: SipInvitationType) => void;
    answerAudioSession: (lineNumber: LineType["lineNumber"]) => void;
    answerVideoSession: (lineNumber: LineType["lineNumber"], enableVideo?: boolean) => void;
    makeAudioSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    makeVideoSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    toggleLocalVideoTrack: (lineNumber: LineType["lineNumber"]) => Promise<void>;
    toggleShareScreen: (lineNumber: LineType["lineNumber"]) => Promise<void>;
    rejectSession: (lineNumber: LineType["lineNumber"]) => void;
    dialByNumber: (type: Extract<CallType, "audio" | "video">, dialNumber: string, extraHeaders?: Array<string>) => void;
    endSession: (lineNumber: LineType["lineNumber"]) => void;
    recordSession: (lineNumber: LineType["lineNumber"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    toggleMuteSession: (lineNumber: LineType["lineNumber"]) => void;
    toggleHoldSession: (lineNumber: LineType["lineNumber"], forcedValue?: boolean) => void;
    makeTransferSession: (lineNumber: LineType["lineNumber"], transferLineNumber: LineType["lineNumber"]) => void;
    cancelTransferSession: (lineNumber: LineType["lineNumber"], transferLineNumber: LineType["lineNumber"]) => void;
    cancelSession: (lineNumber: LineType["lineNumber"]) => void;
    teardownSession: typeof teardownSession;
};
/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export declare function teardownSession(lineObj: LineType): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: LineType['sipSession'], type: T, value: SendMessageSessionValueType[T]): Promise<void>;
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export declare function sendVideoActivationWithAckRetry(session: LineType['sipSession'], options?: {
    maxRetries?: number;
    delayMs?: number;
}): Promise<void>;
