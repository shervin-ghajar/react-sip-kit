import { SipConfigs } from '../../configs/types';
export declare function register(configKey: SipConfigs['key'], userAgent?: import("../..").SipUserAgent | null): void;
export declare function unregister(configKey: SipConfigs['key'], skipUnsubscribe?: boolean, userAgent?: import("../..").SipUserAgent | null): void;
export declare function refreshRegistration(configKey: SipConfigs['key']): void;
