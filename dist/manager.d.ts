import { useWatchSessionData } from './hooks';
import { LineType, SipUserAgentStatus } from './store/types';
import { GetAccountKey, GetMethodsKey, LineLookup, SipManagerConfig } from './types';
export declare class SipManager {
    /**
     * Active SIP instances keyed by `configKey`.
     *
     * `configKey` defaults to `config.account.username` if not explicitly provided.
     * Ensures multiple accounts (e.g., same username on different domains) can coexist.
     */
    private instances;
    /**
     * Hook for reactively watching session data (delegates to Zustand store).
     */
    useWatchSessionData: typeof useWatchSessionData;
    /**
     * Update the configuration for an existing SIP instance.
     *
     * - Replaces stored config in memory and global store.
     * - Does **not** automatically reconnect or restart the UserAgent.
     *
     * Use `initilizeMediaStreams` or `reconnect()` if runtime behavior must change.
     *
     * @param configKey - Unique identifier of the SIP instance
     * @param config - Updated SIP configuration
     */
    private updateConfig;
    /**
     * Add or update a SIP account.
     *
     * - If identical config exists → ignored.
     * - If same `configKey` but config changed → updates config + re-initializes media streams.
     * - Otherwise → creates and initializes a new UserAgent instance.
     *
     * @param config - SIP account configuration (must contain account info, optional `key`)
     */
    add(config: SipManagerConfig): Promise<void>;
    /**
     * Get high-level session methods (answer, dial, hold, transfer, etc.).
     *
     * Resolves the SIP instance by `configKey`, `lineKey`, or `remoteNumber`.
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
        makeTransferSession: (lineKey: LineType["lineKey"], transferNumber: LineType["lineKey"]) => void;
        cancelTransferSession: (lineKey: LineType["lineKey"], transferNumber: LineType["lineKey"]) => void;
        cancelSession: (lineKey: LineType["lineKey"]) => void;
        teardownSession: typeof import("./methods/session").teardownSession;
    };
    /**
     * Get SIP account state.
     *
     * Resolves account by `configKey`, `lineKey`, or `remoteNumber`.
     * Returns reactive account information and watcher hook.
     */
    getAccountBy(key: GetAccountKey): {
        status: SipUserAgentStatus;
        lines: LineType[];
        watch: () => {
            status: SipUserAgentStatus;
            lines: LineType[];
        };
    };
    /** Check if an instance exists for the given configKey. */
    has(configKey: string): boolean;
    /** Force reconnect transport for an existing SIP instance. */
    reconnect(configKey: string): void;
    /**
     * Stop and remove a SIP instance.
     * Cleans up associated data from the global store.
     */
    stop(configKey: string): Promise<void>;
    /** Stop and clear all SIP instances (e.g., on logout). */
    stopAll(): Promise<void>;
    /** Lookup a line by `lineKey` or `remoteNumber`. */
    getLineBy(key: LineLookup): LineType | null;
    /** Lookup a session by `lineKey` or `remoteNumber`. */
    getSessionBy(key: LineLookup): import("./store/types").SipInvitationType | import("./store/types").SipInviterType | null;
    /** Resolve the `configKey` for a given `lineKey` or `remoteNumber`. */
    getConfigKeyBy(key: LineLookup): string | null;
}
