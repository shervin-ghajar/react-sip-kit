import { SipAccountConfig } from '../../configs/types';
import { SipUserAgent } from '../../types';
export declare function onTransportConnected(username: SipAccountConfig['username'], userAgent?: SipUserAgent | null): void;
export declare function onTransportConnectError(error: Error, username: SipAccountConfig['username'], userAgent?: SipUserAgent | null): void;
export declare function onTransportDisconnected(username: SipAccountConfig['username'], userAgent: SipUserAgent): void;
export declare function reconnectTransport(username: SipAccountConfig['username'], userAgent?: SipUserAgent | null): void;
