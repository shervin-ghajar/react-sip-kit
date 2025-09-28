import { SipConfigs } from './configs/types';
import { SipUserAgent } from './types';
export declare class SipInitializer {
    private ua?;
    private configs;
    private username;
    private configKey;
    constructor(configs: SipConfigs, key: string);
    init(): Promise<void>;
    private detectDevices;
    private createUserAgent;
    getUserAgent(): SipUserAgent | undefined;
    stop(): Promise<void>;
}
