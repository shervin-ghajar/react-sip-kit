import { SipConfigs } from './configs/types';
import { SipUserAgent } from './types';
export declare class SipInitializer {
    private ua?;
    private configs;
    private username;
    constructor(configs: SipConfigs);
    init(): Promise<void>;
    private detectDevices;
    private createUserAgent;
    getUserAgent(): SipUserAgent | undefined;
    stop(): Promise<void>;
}
