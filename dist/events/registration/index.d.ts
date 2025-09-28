import { SipConfigs } from '../../configs/types';
import { SipUserAgent } from '../../types';
/**
 * Called when account is registered
 */
export declare function onRegistered(configKey: SipConfigs['key'], userAgent: SipUserAgent): void;
/**
 * Called if UserAgent can connect, but not register.
 * @param {string} response Incoming request message
 * @param {string} cause Cause message. Unused
 **/
export declare function onRegisterFailed(configKey: SipConfigs['key'], response: any, cause: any): void;
/**
 * Called when Unregister is requested
 */
export declare function onUnregistered(configKey: SipConfigs['key'], userAgent: SipUserAgent): void;
