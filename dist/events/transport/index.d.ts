import { SipUserAgent } from '../../types';
export declare function onTransportConnected(userAgent?: SipUserAgent): void;
export declare function onTransportConnectError(error: Error, userAgent?: SipUserAgent): void;
export declare function onTransportDisconnected(userAgent: SipUserAgent): void;
export declare function reconnectTransport(userAgent?: SipUserAgent): void;
