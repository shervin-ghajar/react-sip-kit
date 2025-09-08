import { SipAccountConfig } from '../../configs/types';
export declare function register(username: SipAccountConfig['username'], userAgent?: import("../..").SipUserAgent | null): void;
export declare function unregister(username: SipAccountConfig['username'], skipUnsubscribe?: boolean, userAgent?: import("../..").SipUserAgent | null): void;
export declare function refreshRegistration(username: SipAccountConfig['username']): void;
