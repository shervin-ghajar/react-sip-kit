import { LineType, SipInvitationType } from '../../store/types';
import { CallType } from '../../types';
export declare const useSessionMethods: () => {
    receiveSession: (invitation: SipInvitationType) => void;
    answerAudioSession: (lineNumber: LineType["lineNumber"]) => void;
    answerVideoSession: (lineNumber: LineType["lineNumber"], enableVideo?: boolean) => void;
    makeAudioSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    makeVideoSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    toggleLocalVideoTrack: (lineNumber: LineType["lineNumber"]) => Promise<void>;
    toggleShareScreen: (lineNumber: LineType["lineNumber"]) => Promise<void>;
    rejectSession: (lineNumber: LineType["lineNumber"]) => void;
    dialByNumber: (type: Extract<CallType, "audio" | "video">, dialNumber: string, extraHeaders?: Array<string>) => void;
    makeConferenceSession: (lineObj: LineType, extraHeaders?: Array<string>) => void;
    endSession: (lineNumber: LineType["lineNumber"]) => void;
    recordSession: (lineNumber: LineType["lineNumber"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    toggleMuteSession: (lineNumber: LineType["lineNumber"]) => void;
    toggleHoldSession: (lineNumber: LineType["lineNumber"], forcedValue?: boolean) => Promise<void>;
    cancelSession: (lineNumber: LineType["lineNumber"]) => void;
    startTransferSession: (lineNumber: LineType["lineNumber"]) => void;
    cancelTransferSession: (lineNumber: LineType["lineNumber"]) => void;
    attendedTransferSession: (baseLine: LineType, transferLineNumber: LineType["lineNumber"]) => void;
    cancelAttendedTransferSession: (baseLine: LineType, transferLineNumber: LineType["lineNumber"]) => void;
    teardownSession: (lineObj: LineType) => void;
};
