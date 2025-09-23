import { LineType, SipSessionDataType, SipUserAgentStatus } from './store/types';
import { SipManagerConfig } from './types';
export declare class SipManager {
    private instances;
    /**
     * Update the configuration for an existing SIP instance.
     * Replaces the stored config in both the local instance map and the global store.
     *
     * ⚠️ Note: This does NOT restart the SIP instance — it only updates configs in memory.
     * Use `initilizeMediaStreams` or `reconnect` separately if runtime behavior must change.
     *
     * @param {string} username - The SIP account username whose config is being updated.
     * @param {SipManagerConfig} config - The new SIP configuration (account, media, transport, etc.).
     * @returns {void}
     */
    private updateConfig;
    /**
     * Create and initialize a SIP session for an account.
     *
     * @param {SipManagerConfig} config - SIP account configuration (account, transport, registration, etc.)
     * @returns {Promise<void>} Resolves when initialization is complete.
     */
    add(config: SipManagerConfig): Promise<void>;
    /**
     * Get session methods (dial, answer, hold, etc.) for a given username.
     *
     * @param {string} username - The SIP account username.
     * @returns {ReturnType<typeof sessionMethods>} Object containing call/session methods.
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
        teardownSession: typeof import("./methods/session").teardownSession;
    };
    /**
     * Get SIP account state by username.
     *
     * @param {string} username - The SIP account username.
     * @returns {{
     *   status: SipUserAgentStatus;
     *   lines: LineType[];
     *   watch: ReturnType<typeof useSipManager>;
     * }} An object with account status, active lines, and a reactive watcher hook.
     */
    get(username: string): {
        status: SipUserAgentStatus;
        lines: LineType[];
        watch: () => {
            status: SipUserAgentStatus;
            lines: LineType[];
        };
    };
    /**
     * Check if a SIP instance already exists for the username.
     *
     * @param {string} username - The SIP account username.
     * @returns {boolean} True if the instance exists, false otherwise.
     */
    has(username: string): boolean;
    /**
     * Attempt to reconnect the SIP transport for a given username.
     *
     * @param {string} username - The SIP account username.
     * @returns {void}
     */
    reconnect(username: string): void;
    /**
     * Stop and remove a SIP session for a username.
     * Also cleans up from the global store.
     *
     * @param {string} username - The SIP account username.
     * @returns {Promise<void>} Resolves when the session is stopped and removed.
     */
    stop(username: string): Promise<void>;
    /**
     * Stop and clear ALL SIP sessions.
     * Useful on logout or app shutdown.
     *
     * @returns {Promise<void>} Resolves when all sessions are stopped and cleared.
     */
    stopAll(): Promise<void>;
    /**
     * Find the username associated with a specific line number.
     *
     * @param {LineType['lineNumber']} lineNumber - The line number to look up.
     * @returns {string | null} The username if found, otherwise null.
     */
    getUsernameByLineNumber(lineNumber: LineType['lineNumber']): string | null;
    /**
     * Find the username associated with a specific remoteNumber.
     *
     * @param {SipSessionDataType['remoteNumber']} remoteNumber - The remote number to look up.
     * @returns {string | null} The username if found, otherwise null.
     */
    getUsernameByRemoteNumber(remoteNumber: SipSessionDataType['remoteNumber']): string | null;
    /**
     * Find the lineNumber associated with a specific remoteNumber.
     *
     * @param {SipSessionDataType['remoteNumber']} remoteNumber - The remote number to look up.
     * @returns {string | null} The lineNumber if found, otherwise null.
     */
    getLineNumberByRemoteNumber(remoteNumber: SipSessionDataType['remoteNumber']): number | null;
    /**
     * Find the line object associated with a specific remoteNumber.
     *
     * @param {SipSessionDataType['remoteNumber']} remoteNumber - The remote number to look up.
     * @returns {LineType  | null} The line object if found, otherwise null.
     */
    getLineByRemoteNumber(remoteNumber: SipSessionDataType['remoteNumber']): LineType | null;
    /**
     * Find the SIP session associated with a specific line number.
     *
     * @param {LineType['lineNumber']} lineNumber - The line number to look up.
     * @returns { SipInvitationType | SipInviterType } The SIP session object if found, otherwise null.
     */
    getSessionByNumber(lineNumber: LineType['lineNumber']): import("./store/types").SipInvitationType | import("./store/types").SipInviterType | null;
}
