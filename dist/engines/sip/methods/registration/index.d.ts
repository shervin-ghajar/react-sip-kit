import { RtcConfig } from '../../../../configs/types';
import { SipUserAgent } from '../../types';
export declare function register(configKey: RtcConfig['key'], userAgent?: SipUserAgent): void;
export declare function unregister(configKey: RtcConfig['key'], skipUnsubscribe?: boolean, userAgent?: SipUserAgent): void;
export declare function refreshRegistration(configKey: RtcConfig['key']): void;
