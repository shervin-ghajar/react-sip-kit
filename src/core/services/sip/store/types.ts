import { SipUserAgent } from '../types';
import { Invitation, Session } from 'sip.js';
import { IncomingInviteRequest } from 'sip.js/lib/core';

/* -------------------------------------------------------------------------- */
export interface SipStoreStateType {
  userAgent: SipUserAgent | null;
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
  // Setter
  setSipStore: (state: Partial<SipStoreStateType>) => void;
  addLine: (line: LineType) => void;
  addBuddy: (buddy: BuddyType) => void;
  // Getter
  findBuddyByDid: (did: string) => BuddyType | null;
  findLineByNumber:()//TODO
  getSession: (did: string) => SipSessionType | null;
  // Utils
  countSessions: (id: string) => number;
}

export interface SipInvitationType extends Omit<Invitation, 'incomingInviteRequest'> {
  data: Partial<SipSessionDataType>;
  incomingInviteRequest: IncomingInviteRequest;
}
/* -------------------------------------------------------------------------- */
export interface LineType {
  LineNumber: number;
  DisplayName: string;
  DisplayNumber: string;
  IsSelected: boolean;
  BuddyObj: BuddyType | null;
  SipSession: SipInvitationType | null;
  LocalSoundMeter: any;
  RemoteSoundMeter: any;
}

export interface SipSessionType extends Session {
  data: SipSessionDataType;
}

export interface SipSessionDataType {
  line: number;
  calldirection: string;
  terminateby: string;
  src: string;
  buddyId: string;
  callstart: string;
  callTimer: number;
  earlyReject: boolean;
  withvideo: boolean;
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
