import { LineType, SipUserAgentStatus } from './store/types';
import { GetAccountKey, GetMethodsKey, LineLookup, SipManagerConfig } from './types';
export declare class SipManager {
    private instances;
    /**
     * Update the configuration for an existing SIP instance.
     * - Updates both local instance map and global store.
     * - Does NOT restart or reconnect automatically.
     *
     * Use `initilizeMediaStreams` or `reconnect()` if runtime behavior must change.
     *
     * @param username - SIP account username
     * @param config - Updated SIP configuration
     */
    private updateConfig;
    /**
     * Add a new SIP account, or update an existing one if the config has changed.
     *
     * - If identical config already exists → ignored.
     * - If username exists with a different config → re-initializes media streams.
     * - Otherwise → creates and initializes a new SIP instance.
     *
     * @param config - SIP account configuration
     */
    add(config: SipManagerConfig): Promise<void>;
    /**
     * Get session methods (dial, answer, hold, etc.) for a live session.
     *
     * Resolves the session by `username`, `lineKey`, or `remoteNumber`.
     *
     * @param key - Identifier for session resolution
     */
    getSessionMethodsBy(key: GetMethodsKey): {
        receiveSession: (invitation: import("./store/types").SipInvitationType) => void;
        answerAudioSession: (lineKey: LineType["lineKey"]) => void;
        answerVideoSession: (lineKey: LineType["lineKey"], enableVideo?: boolean) => void;
        makeAudioSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
        makeVideoSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
        toggleLocalVideoTrack: (lineKey: LineType["lineKey"]) => Promise<void>;
        toggleShareScreen: (lineKey: LineType["lineKey"]) => Promise<void>;
        rejectSession: (lineKey: LineType["lineKey"]) => void;
        dialByNumber: (type: Extract<import("./types").CallType, "audio" | "video">, dialNumber: string, extraHeaders?: Array<string>) => void;
        endSession: (lineKey: LineType["lineKey"]) => void;
        recordSession: (lineKey: LineType["lineKey"]) => {
            start: () => Promise<void>;
            stop: () => void;
        };
        toggleMuteSession: (lineKey: LineType["lineKey"]) => void;
        toggleHoldSession: (lineKey: LineType["lineKey"], forcedValue?: boolean) => void;
        makeTransferSession: (lineKey: LineType["lineKey"], transferLineKey: LineType["lineKey"]) => void;
        cancelTransferSession: (lineKey: LineType["lineKey"], transferLineKey: LineType["lineKey"]) => void;
        cancelSession: (lineKey: LineType["lineKey"]) => void;
        teardownSession: typeof import("./methods/session").teardownSession;
    };
    /**
     * Get SIP account state.
     *
     * Resolves the account by `username`, `lineKey`, or `remoteNumber`.
     *
     * @param key - Identifier for account resolution
     * @returns Object containing:
     *   - `status` → UA status
     *   - `lines` → all active lines
     *   - `watch` → reactive watcher hook
     */
    getAccountBy(key: GetAccountKey): {
        status: SipUserAgentStatus;
        lines: LineType[];
        watch: () => {
            status: SipUserAgentStatus;
            lines: LineType[];
        };
    };
    /**
     * Check if an instance exists for the given username.
     */
    has(username: string): boolean;
    /**
     * Reconnect transport for an existing SIP instance.
     */
    reconnect(username: string): void;
    /**
     * Stop and remove a SIP instance by username.
     * Also removes related data from the global store.
     */
    stop(username: string): Promise<void>;
    /**
     * Stop and clear all SIP instances.
     * Useful for logout or application shutdown.
     */
    stopAll(): Promise<void>;
    /**
     * Get a Line by either `lineKey` or `remoteNumber`.
     *
     * @param key - Lookup key (mutually exclusive)
     * @returns Line if found, otherwise null
     */
    getLineBy(key: LineLookup): LineType | null;
    /**
     * Get a SIP session by either `lineKey` or `remoteNumber`.
     *
     * @param key - Lookup key (mutually exclusive)
     * @returns SIP session if found, otherwise null
     */
    getSessionBy(key: LineLookup): import("./store/types").SipInvitationType | import("./store/types").SipInviterType | null;
    /**
     * Get a username by either `lineKey` or `remoteNumber`.
     *
     * @param key - Lookup key (mutually exclusive)
     * @returns Username if found, otherwise null
     */
    getUsernameBy(key: LineLookup): string | null;
}
