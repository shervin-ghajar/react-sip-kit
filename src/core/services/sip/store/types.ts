import { AudioBlobs } from '../constructors';
import { SipUserAgent } from '../types';
import { Dayjs } from 'dayjs';
import {
  Invitation,
  Inviter,
  Session,
  SessionDescriptionHandler,
  SessionDescriptionHandlerOptions,
} from 'sip.js';
import { IncomingInviteRequest } from 'sip.js/lib/core';

/* -------------------------------------------------------------------------- */
export interface SipStoreStateType {
  userAgent?: SipUserAgent;
  buddies: Array<BuddyType>;
  selectedBuddy: Array<any>;
  selectedLine: Array<any>;
  hasVideoDevice: boolean;
  hasAudioDevice: boolean;
  hasSpeakerDevice: boolean;
  audioInputDevices: Array<any>;
  videoInputDevices: Array<any>;
  speakerDevices: Array<any>;
  lines: Array<LineType>;
  newLineNumber: number;
  SipUsername: string;
  SipDomain: string;
  audioBlobs: AudioBlobs['audioBlobs'];
  // Setter
  setSipStore: (state: Partial<SipStoreStateType>) => void;
  setUserAgent: (userAgent: SipStoreStateType['userAgent']) => void;
  addLine: (line: LineType) => void;
  updateLine: (line: LineType) => void;
  removeLine: (lineNum: LineType['LineNumber']) => void;
  addBuddy: (buddy: BuddyType) => void;
  // Getter
  findBuddyByDid: (did: string) => BuddyType | null;
  findBuddyByIdentity: (indentity: BuddyType['identity']) => BuddyType | null;
  findLineByNumber: (lineNum: LineType['LineNumber']) => LineType | null;
  getSession: (did: string) => SipSessionType | null;
  getSessions: () => SipUserAgent['sessions'] | null;
  // Utils
  countSessions: (id: string) => number;
}

export interface SipInvitationType
  extends Omit<Invitation, 'incomingInviteRequest' | 'sessionDescriptionHandler'> {
  data: Partial<SipSessionDataType>;
  incomingInviteRequest: IncomingInviteRequest;
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
  isOnHold: boolean;
}

export interface SipSessionDescriptionHandlerOptions extends SessionDescriptionHandlerOptions {
  hold: boolean;
}
export interface SipInviterType extends Inviter {
  data: Partial<SipSessionDataType>;
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
  isOnHold: boolean;
}

export interface SipSessionDescriptionHandler extends SessionDescriptionHandler {
  peerConnection: RTCPeerConnection;
  peerConnectionDelegate: any;
}
/* -------------------------------------------------------------------------- */
export interface LineType {
  LineNumber: number;
  DisplayName: string;
  DisplayNumber: string;
  IsSelected: boolean;
  BuddyObj: BuddyType | null;
  SipSession: SipInvitationType | SipInviterType | null;
  LocalSoundMeter: any;
  RemoteSoundMeter: any;
}

export interface SipSessionType extends Session {
  data: SipSessionDataType;
}

export interface SipSessionDataType {
  line: number;
  calldirection: 'inbound' | 'outbound';
  terminateby: string;
  src: string;
  buddyId: string;
  callstart: string;
  callTimer: number;
  earlyReject: boolean;
  withvideo: boolean;
  reasonCode: number;
  reasonText: string;
  teardownComplete: boolean;
  childsession: SipSessionType | null;
  startTime: Dayjs;
  started: boolean;
  hold: Array<{ event: 'hold' | 'unhold'; eventTime: string }>;
  isHold: boolean;
  mute: Array<{ event: 'mute' | 'unmute'; eventTime: string }>;
  isMute: boolean;
  videoChannelNames: Array<Record<'mid' | 'channel', string>>;
  dst: string;
  transfer: Array<SipSessionTransferType>;
  AudioSourceTrack: any; //TODO
  earlyMedia: any; //TODO
  ringerObj: { [key: string]: any } | null;
  ConfbridgeChannels: Array<any>; //TODO
  ConfbridgeEvents: Array<any>; //TODO
  videoSourceDevice: string | null;
  audioSourceDevice: string | null;
  audioOutputDevice: string | null;
}

export interface SipSessionTransferType {
  type: string;
  to: number;
  transferTime: string;
  disposition: string;
  dispositionTime: string;
  accept: {
    complete: boolean | null;
    eventTime: string | null;
    disposition: string;
  };
}
/* -------------------------------------------------------------------------- */
export interface BuddyType {
  type: 'extension' | 'xmpp' | 'contact' | 'group';
  identity: string;
  CallerIDName: string;
  ExtNo: string;
  MobileNumber?: string;
  ContactNumber1?: string;
  ContactNumber2?: string;
  lastActivity: string; // ISO timestamp
  Desc: string;
  Email: string;
  jid?: string;
  devState: string;
  presence: string;
  missed: number;
  IsSelected: boolean;
  imageObjectURL: string;
  presenceText: string;
  EnableDuringDnd: boolean;
  EnableSubscribe: boolean;
  SubscribeUser: string;
  AllowAutoDelete: boolean;
  Pinned: boolean;
}
