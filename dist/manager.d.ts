import { SipConfigs } from './configs/types';
/**
 * Singleton SIP Manager
 */
export declare class SipManager {
    private static instance;
    private ua?;
    private configs;
    private receiveSession;
    private getDevices;
    private setSipStore;
    private constructor();
    static getInstance(): SipManager;
    initialize({ configs, receiveSession, getDevices, setSipStore, }: {
        configs: SipConfigs;
        receiveSession: any;
        getDevices: () => Promise<any>;
        setSipStore: (state: any) => void;
    }): void;
    private init;
    private detectDevices;
    private createUserAgent;
    getStatus(): "disconnected" | "connected";
    getLines(): never[] | {
        [id: string]: import(".").SipSessionType;
    };
    reconnectTransport(): void;
    stop(): void;
}
