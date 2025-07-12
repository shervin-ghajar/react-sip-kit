import { SipUserAgent } from '../../types';
export declare function register(userAgent?: SipUserAgent): void;
export declare function unregister(skipUnsubscribe?: boolean, userAgent?: SipUserAgent): void;
export declare function refreshRegistration(): void;
