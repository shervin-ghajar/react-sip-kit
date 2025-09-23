import { SipConfigs } from './configs/types';
import { reconnectTransport } from './events/transport';
import { SipInitializer } from './initializer';
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
export type SipManagerConfig = {
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

export type CallType =
  | 'audio'
  | 'video'
  | 'conferenceAudio'
  | 'conferenceVideo'
  | 'transferAudio'
  | 'transferVideo';

export interface SipManagerInstance {
  config: SipManagerConfig;
  instance: SipInitializer;
}
