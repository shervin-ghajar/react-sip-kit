import { SipConfigs } from '../configs/types';
import { AudioBlobs } from '../constructors';
import { CallbackFunction, SipUserAgent } from '../types';
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
  configs: SipConfigs;
  userAgent?: SipUserAgent;
  lines: Array<LineType>;
  audioBlobs: AudioBlobs['audioBlobs'];
  devicesInfo: DevicesInfoType;
  // Setter
  setSipStore: (state: Partial<SipStoreStateType>) => void;
  setUserAgent: (userAgent: SipStoreStateType['userAgent']) => void;
  addLine: (line: LineType) => void;
  updateLine: (line: LineType, callback?: CallbackFunction) => void;
  removeLine: (lineNum: LineType['lineNumber']) => void;
  // Getter
  findLineByNumber: (lineNum: LineType['lineNumber']) => LineType | null;
  getSessions: () => SipUserAgent['sessions'] | null;
  getNewLineNumber: () => number;
  // Utils
  countIdSessions: (id: string) => number;
}

export interface SipInvitationType
  extends Omit<Invitation, 'incomingInviteRequest' | 'sessionDescriptionHandler'> {
  data: Partial<SipSessionDataType>;
  incomingInviteRequest: IncomingInviteRequest;
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
  isOnHold: boolean;
  initiateLocalMediaStreams: () => void;
  initiateRemoteMediaStreams: () => void;
}

export interface SipSessionDescriptionHandlerOptions extends SessionDescriptionHandlerOptions {
  hold: boolean;
}
export interface SipInviterType extends Inviter {
  data: Partial<SipSessionDataType>;
  sessionDescriptionHandler: SipSessionDescriptionHandler;
  sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
  isOnHold: boolean;
  initiateLocalMediaStreams: () => void;
  initiateRemoteMediaStreams: () => void;
}

export interface SipSessionDescriptionHandler extends SessionDescriptionHandler {
  peerConnection: RTCPeerConnection;
  peerConnectionDelegate: any;
}
/* -------------------------------------------------------------------------- */
export interface LineType {
  lineNumber: number;
  displayNumber: string;
  sipSession: SipInvitationType | SipInviterType | null;
  localSoundMeter: any;
  remoteSoundMeter: any;
}

export interface SipSessionType extends Session {
  data: SipSessionDataType;
}

export interface SipSessionDataType {
  line: number;
  callDirection: 'inbound' | 'outbound';
  terminateBy: string;
  src: string;
  earlyReject: boolean;
  reasonCode: number;
  reasonText: string;
  teardownComplete: boolean;
  childsession: SipSessionType | null;
  startTime: string;
  started: boolean;
  hold: Array<{ event: 'hold' | 'unhold'; eventTime: string }>;
  isHold: boolean;
  videoChannelNames: Array<Record<'mid' | 'channel', string>>;
  localMediaStreamStatus: MediaStremStatus;
  remoteMediaStreamStatus: MediaStremStatus;
  dialledNumber: string;
  transfer: Array<SipSessionTransferType>;
  audioSourceTrack: any; //TODO
  earlyMedia: any; //TODO
  ringerObj: { [key: string]: any } | null;
  confBridgeChannels: Array<any>; //TODO
  confBridgeEvents: Array<any>; //TODO
  videoSourceDevice: string | null;
  audioSourceDevice: string | null;
  audioOutputDevice: string | null;
}

export interface SipSessionTransferType {
  type: 'Attended' | 'Blind';
  to: number;
  transferTime: string;
  disposition: string;
  dispositionTime: string;
  accept: {
    complete: boolean | null;
    eventTime: string | null;
    disposition: string;
  };
  onCancle?: Function;
}
/* -------------------------------------------------------------------------- */
interface DevicesInfoType {
  hasVideoDevice: boolean;
  hasAudioDevice: boolean;
  hasSpeakerDevice: boolean;
  audioInputDevices: any[];
  videoInputDevices: any[];
  speakerDevices: any[];
}

interface MediaStremStatus {
  soundEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
}
