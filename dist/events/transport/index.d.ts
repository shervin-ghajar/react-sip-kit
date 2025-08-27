import { SipUserAgent } from '../../types';
export declare function onTransportConnected(userAgent?: SipUserAgent | undefined): void;
export declare function onTransportConnectError(error: Error, userAgent?: SipUserAgent | undefined): void;
export declare function onTransportDisconnected(userAgent: SipUserAgent): void;
export declare function reconnectTransport(userAgent?: SipUserAgent | undefined): void;
