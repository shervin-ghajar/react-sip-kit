import { RtcConfig } from '../../../../configs/types';
import { SipUserAgent } from '../../types';
export declare function onTransportConnected(configKey: RtcConfig['key'], userAgent?: SipUserAgent): void;
export declare function onTransportConnectError(error: Error, configKey: RtcConfig['key'], userAgent?: SipUserAgent): void;
export declare function onTransportDisconnected(configKey: RtcConfig['key'], userAgent: SipUserAgent): void;
export declare function reconnectTransport(configKey: RtcConfig['key'], userAgent?: SipUserAgent, forceReconnect?: boolean): void;
