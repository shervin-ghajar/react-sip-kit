import { SipConfigs } from './configs/types';
import { reconnectTransport } from './events/transport';
import { SipInitializer } from './initializer';
import { LineType, SipSessionDataType, SipSessionType } from './store/types';
import { Registerer, Subscriber, UserAgent } from 'sip.js';
export interface SipUserAgent extends UserAgent {
    isReRegister: boolean;
    isRegistered: () => boolean;
    registerer: Registerer;
    sessions: {
        [id: string]: SipSessionType;
    };
    _sessions: {
        [id: string]: SipSessionType;
    };
    registrationCompleted: boolean;
    registering: boolean;
    transport: UserAgent['transport'] & {
        reconnectionAttempts: number;
        attemptingReconnection: boolean;
    };
    BlfSubs: any[];
    lastVoicemailCount: number;
    selfSub: Subscriber | null;
    voicemailSub: Subscriber | null;
}
export type SipManagerConfig = {
    /**
     * Unique identifier for the SIP account instance.
     *
     * - Default: `account.username`
     * - Useful when the same username can exist across multiple domains.
     * - All internal maps and store entries use this key.
     */
    key?: SipConfigs['key'];
    /**
     * Core SIP account information (username, password, domain, etc.)
     */
    account: SipConfigs['account'];
} & {
    [P in Exclude<keyof SipConfigs, 'account'>]?: Partial<SipConfigs[P]>;
};
export interface SipManagerProps {
    configs: SipManagerConfig[];
}
export interface SipContextTransportType {
    reconnectTransport: typeof reconnectTransport;
}
export type CallbackFunction<T = any> = (value?: T) => void;
export type CallType = 'audio' | 'video' | 'conferenceAudio' | 'conferenceVideo' | 'transferAudio' | 'transferVideo';
/**
 * Wrapper for a SIP account + its active UserAgent instance.
 */
export interface SipManagerInstance {
    config: SipManagerConfig;
    instance: SipInitializer;
}
/**
 * Keys that can resolve an account:
 * - `configKey` → explicit instance key
 * - `lineKey` → active line identifier
 */
export type GetAccountKey = {
    configKey: SipManagerConfig['key'];
    lineKey?: never;
} | {
    lineKey: LineType['lineKey'];
    configKey?: never;
};
/**
 * Keys that can resolve session control methods:
 * - `configKey` → explicit instance key
 * - `lineKey` → active line identifier
 */
export type GetMethodsKey = {
    configKey: SipManagerConfig['key'];
    lineKey?: never;
} | {
    lineKey: LineType['lineKey'];
    configKey?: never;
};
/**
 * Keys for resolving lines/sessions (mutually exclusive).
 * - `configKey` & `remoteNumber` → explicit instance key and peer phone number(aka remoteNumber)
 * - `lineKey` → active line identifier
 */
export type LineLookup = {
    lineKey: LineType['lineKey'];
    remoteNumber?: never;
    configKey?: never;
} | {
    configKey: SipConfigs['key'];
    remoteNumber: SipSessionDataType['remoteNumber'];
    lineKey?: never;
};
