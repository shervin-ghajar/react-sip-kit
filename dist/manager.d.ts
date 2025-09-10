import { LineType, SipUserAgentStatus } from './store/types';
import { SipManagerConfig } from './types';
export declare class SipManager {
    private instances;
    constructor();
    private getPermissions;
    /**
     * Create and initialize a SIP session for an account
     */
    add(config: SipManagerConfig): Promise<void>;
    /**
     * Get an existing SIP methods by username
     */
    methods(username: string): {
        receiveSession: (invitation: import("./store/types").SipInvitationType) => void;
        answerAudioSession: (lineNumber: LineType["lineNumber"]) => void;
        answerVideoSession: (lineNumber: LineType["lineNumber"], enableVideo?: boolean) => void;
        makeAudioSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
        makeVideoSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
        toggleLocalVideoTrack: (lineNumber: LineType["lineNumber"]) => Promise<void>;
        toggleShareScreen: (lineNumber: LineType["lineNumber"]) => Promise<void>;
        rejectSession: (lineNumber: LineType["lineNumber"]) => void;
        dialByNumber: (type: Extract<import("./types").CallType, "audio" | "video">, dialNumber: string, extraHeaders?: Array<string>) => void;
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
        teardownSession: typeof import("./methods/session").teardownSession;
    };
    /**
     * Get an existing SIP status by username
     */
    get(username: string): {
        status: SipUserAgentStatus;
        lines: LineType[];
        watch: () => {
            status: SipUserAgentStatus | undefined;
            lines: LineType[];
        };
    };
    /**
     * Check the existance of SIP instance by username
     */
    has(username: string): boolean;
    /**
     * Stop and remove a SIP session
     */
    stop(username: string): Promise<void>;
    /**
     * Stop and clear all SIP sessions
     */
    stopAll(): Promise<void>;
    getUsernameByNumber(lineNumber: LineType['lineNumber']): string | null;
    getSessionByNumber(lineNumber: LineType['lineNumber']): import("./store/types").SipInvitationType | import("./store/types").SipInviterType | null;
}
