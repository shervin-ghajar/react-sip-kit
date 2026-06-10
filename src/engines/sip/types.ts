import { RtcConfig } from '../../configs/types';
import { BaseLineDataType, InitiateMediaStreamsParams, LineType } from '../../store/types';
import {
  Invitation,
  Inviter,
  Registerer,
  Session,
  SessionDescriptionHandler,
  SessionDescriptionHandlerOptions,
  Subscriber,
  UserAgent,
} from 'sip.js';
import { IncomingInviteRequest } from 'sip.js/lib/core';

export interface SipUserAgent extends UserAgent {
  isReRegister: boolean;
  isRegistered: () => boolean;
  registerer: Registerer;
  sessions: { [id: string]: SipSessionType };
  _sessions: { [id: string]: SipSessionType };
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

export type SipSessionType = Session & SipInvitationType & SipInviterType;

export interface SipInvitationType
  extends Omit<Invitation, 'incomingInviteRequest' | 'sessionDescriptionHandler'> {
  // data: Partial<LineDataType>;
  incomingInviteRequest: IncomingInviteRequest;
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
}

export interface SipSessionDescriptionHandlerOptions extends SessionDescriptionHandlerOptions {
  hold: boolean;
}

export interface SipInviterType extends Inviter {
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
}

export interface SipSessionDescriptionHandler extends SessionDescriptionHandler {
  peerConnection: RTCPeerConnection;
  peerConnectionDelegate: any;
}

export interface SipLineType {
  lineKey: string;
  remoteNumber: string;
  configKey: RtcConfig['key'];
  session: SipInvitationType | SipInviterType | null;
  childSession: SipSessionType | null;
  username: string;
  data: SipLineDataType;
}

export interface SipLineDataType extends BaseLineDataType {
  transfer: Record<SipSessionTransferType['to'], SipSessionTransferType>;
  videoChannelNames: Array<Record<'mid' | 'channel', string>>;
  confBridgeLineKey: string;
  confBridgeChannels: Array<string>;
  confBridgeEvents: Array<any>;
}

export interface SipSessionTransferType {
  type: 'attended' | 'blind';
  to: LineType['remoteNumber'];
  transferTime: string;
  disposition: string;
  dispositionTime: string;
  accept: {
    complete: boolean | null;
    eventTime: string | null;
    disposition: string;
  };
  onCancle?: Function;
  onAccept?: Function;
}
