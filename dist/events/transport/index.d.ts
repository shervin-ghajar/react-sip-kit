import { SipUserAgent } from '../../types';
export declare function onTransportConnected(userAgent?: SipUserAgent): void;
export declare function onTransportConnectError(error: any, userAgent?: SipUserAgent): void;
export declare function onTransportDisconnected(userAgent: SipUserAgent): void;
export declare function reconnectTransport(userAgent?: SipUserAgent): void;
