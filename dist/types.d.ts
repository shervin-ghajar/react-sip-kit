import { SipConfigs } from './configs/types';
import { reconnectTransport } from './events/transport';
import { SipSessionType } from './store/types';
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
type SipProviderConfigs<T extends SipConfigs> = {
    account: T['account'];
} & {
    [P in Exclude<keyof T, 'account'>]?: Partial<T[P]>;
};
export interface SipProviderProps<T extends SipConfigs = SipConfigs> {
    children: React.ReactNode;
    configs: SipProviderConfigs<T>;
}
export interface SipContextTransportType {
    reconnectTransport: typeof reconnectTransport;
}
export type CallbackFunction<T = any> = (value?: T) => void;
export type CallType = 'audio' | 'video' | 'conferenceAudio' | 'conferenceVideo' | 'transferAudio' | 'transferVideo';
export {};
