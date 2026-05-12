import { RtcConfig } from './configs/types';
// import { HybridEngineInitializer } from './engines/hybrid/initializer';
// import { HybridInstance } from './engines/hybrid/types';
import { JanusEngineInitializer } from './engines/janus/initializer';
import { JanusInstance } from './engines/janus/types';
import { reconnectTransport } from './engines/sip/events/transport';
import { SipEngineInitializer } from './engines/sip/initializer';
import { SipUserAgent } from './engines/sip/types';
import { LineDataType, LineType, RtcStoreStateType } from './store/types';

export type EngineInstance = SipUserAgent | JanusInstance;
// | HybridInstance;

export type RtcManagerConfig = {
  /**
   * Unique identifier for the SIP account instance.
   *
   * - Default: `account.username`
   * - Useful when the same username can exist across multiple domains.
   * - All internal maps and store entries use this key.
   */
  key?: RtcConfig['key'];

  /**
   * Core SIP account information (username, password, domain, etc.)
   */
  account: RtcConfig['account'];
} & {
  /**
   * Optional overrides for other parts of the config.
   * Each key corresponds to a subset of RtcConfig.
   */
  [P in Exclude<keyof RtcConfig, 'account'>]?: Partial<RtcConfig[P]>;
};

export interface RtcManagerProps {
  configs: RtcManagerConfig[];
}
export interface SipContextTransportType {
  reconnectTransport: typeof reconnectTransport;
}

export type CallbackFunction<T = any> = (value?: T) => void;

export type CallType =
  | 'audio'
  | 'video'
  | 'room'
  | 'conferenceAudio'
  | 'conferenceVideo'
  | 'transferAudio'
  | 'transferVideo';

/**
 * Wrapper for a SIP account + its active UserAgent instance.
 */
export interface RtcManagerInstance {
  config: RtcManagerConfig;
  instance: SipEngineInitializer | JanusEngineInitializer;
  // | HybridEngineInitializer;
}

/**
 * Keys that can resolve an account:
 * - `configKey` → explicit instance key
 * - `lineKey` → active line identifier
 */
export type GetAccountKey =
  | { configKey: RtcManagerConfig['key']; lineKey?: never }
  | { lineKey: LineType['lineKey']; configKey?: never };

/**
 * Keys that can resolve session control methods:
 * - `configKey` → explicit instance key
 * - `lineKey` → active line identifier
 */
export type GetMethodsKey =
  | { configKey: RtcManagerConfig['key']; lineKey?: never }
  | { lineKey: LineType['lineKey']; configKey?: never };

/**
 * Keys for resolving lines/sessions (mutually exclusive).
 * - `configKey` & `remoteNumber` → explicit instance key and peer phone number(aka remoteNumber)
 * - `lineKey` → active line identifier
 */
export type LineLookup =
  | { lineKey: LineType['lineKey']; remoteNumber?: never; configKey?: never }
  | {
      configKey: RtcConfig['key'];
      remoteNumber: LineDataType['remoteNumber'];
      lineKey?: never;
    };

export type RtcBroadcastMessage =
  | { type: 'MASTER_CHECK'; tabId: string }
  | { type: 'MASTER_PRESENT'; tabId: string }
  | { type: 'MASTER_CLOSED'; tabId: string }
  | { type: 'FOLLOWER_CLOSED'; tabId: string }
  | { type: 'MASTER_HEARTBEAT'; tabId: string }
  | { type: 'SYNC'; tabIds: string[]; payload: Partial<RtcStoreStateType> }
  | { type: 'COMMAND'; method: string; args: any[] }
  | { type: 'SESSION_COMMAND'; method: string; configKey: string; args: any[] };

export type RtcEngineStatus = 'disconnected' | 'connecting' | 'connected';
