import { SipAccountConfig, SipConfigs } from './configs/types';
import { SipStoreStateType } from './store/types';
/**
 * Singleton SIP Manager
 */
export declare class SipManager {
    private ua?;
    private configs;
    private username;
    private setSipStore;
    private setConfig;
    private setUserAgent;
    constructor({ configs, setSipStore, setUserAgent, setConfig, }: {
        configs: SipConfigs;
        setSipStore: SipStoreStateType['setSipStore'];
        setUserAgent: SipStoreStateType['setUserAgent'];
        setConfig: SipStoreStateType['setConfig'];
    });
    initialize({ configs, receiveSession, setSipStore, setUserAgent, setConfig, }: {
        configs: SipConfigs;
        receiveSession: any;
        getDevices: (username: SipAccountConfig['username']) => Promise<any>;
        setSipStore: SipStoreStateType['setSipStore'];
        setUserAgent: SipStoreStateType['setUserAgent'];
        setConfig: SipStoreStateType['setConfig'];
    }): void;
    private init;
    private detectDevices;
    private createUserAgent;
    stop(): void;
}
