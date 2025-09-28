import { SipConfigs } from '../../configs/types';
import { SipUserAgent } from '../../types';
export declare function onTransportConnected(configKey: SipConfigs['key'], userAgent?: SipUserAgent | null): void;
export declare function onTransportConnectError(error: Error, configKey: SipConfigs['key'], userAgent?: SipUserAgent | null): void;
export declare function onTransportDisconnected(configKey: SipConfigs['key'], userAgent: SipUserAgent): void;
export declare function reconnectTransport(configKey: SipConfigs['key'], userAgent?: SipUserAgent | null): void;
