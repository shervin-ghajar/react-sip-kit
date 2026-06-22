import { SipConfig } from '../../configs/types';
import { SipUserAgent } from './types';
export declare class SipEngineInitializer {
    private ua?;
    private config;
    private username;
    private configKey;
    private mode;
    constructor(config: SipConfig, key: string, mode?: 'full-sip' | 'signaling-only');
    init(): Promise<void>;
    private createUserAgent;
    getUserAgent(): SipUserAgent | undefined;
    stop(): Promise<void>;
}
