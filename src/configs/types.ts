import { UserAgentDelegate } from 'sip.js';

export interface BaseRtcConfig {
  key: string;
  features: SipFeaturesConfig;
  media: SipMediaConfig;
  policy: SipPolicyConfig;
  registration: SipRegistrationConfig;
  storage: SipStorageConfig;
  recording: SipRecordingConfig;
  advanced: SipAdvancedConfig;
}

export interface SipConfig extends BaseRtcConfig {
  engine: 'sip';
  account: SipAccountConfig;
}
export interface JanusConfig extends BaseRtcConfig {
  engine: 'janus';
  account: JanusAccountConfig;
}
export interface HybridConfig extends BaseRtcConfig {
  engine: 'hybrid';
  account: HybridAccountConfig;
}

export type RtcConfig = SipConfig | JanusConfig | HybridConfig;

export interface SipAdvancedConfig {
  didLength: number;
  maxDidLength: number;
  singleInstance: boolean;
}
export interface SipRecordingConfig {
  videoResampleSize: string;
  recordingVideoSize: string;
  recordingVideoFps: number;
  recordingLayout: string;
}
export interface SipStorageConfig {
  streamBuffer: number;
  maxDataStoreDays: number;
  posterJpegQuality: number;
}

export interface SipRegistrationConfig {
  transportConnectionTimeout: number;
  transportReconnectionAttempts: number;
  transportReconnectionTimeout: number;
  registerExpires: number;
  registerExtraHeaders: string;
  registerExtraContactParams: string;
  registerContactParams: string;
  wssInTransport: boolean;
  ipInContact: boolean;
  bundlePolicy: RTCBundlePolicy;
  peerConnectionConfiguration: RTCConfiguration;
  hackIpInContact?: string | boolean | undefined;
  contactParams?: { [name: string]: string } | undefined;
  delegate?: UserAgentDelegate;
  iceGatheringTimeout: number;
  subscribeToYourself: boolean;
  voiceMailSubscribe: boolean;
  voicemailDid: string;
  subscribeVoicemailExpires: number;
  inviteExtraHeaders: string;
  noAnswerTimeout: number;
}
export interface SipPolicyConfig {
  autoAnswerPolicy: string;
  doNotDisturbPolicy: string;
  callWaitingPolicy: string;
  callRecordingPolicy: string;
  intercomPolicy: string;
}
export interface SipMediaConfig {
  audioInputDeviceId: string | null;
  audioOutputDeviceId: string | null;
  videoInputDeviceId: string | null;
  ringerOutputDeviceId: string;
  maxFrameRate: number | string;
  videoHeight: number | string;
  videoAspectRatio: number | string;
  autoGainControl: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  mirrorVideo: string;
  maxVideoBandwidth: number;
  startVideoFullScreen: boolean;
}
export interface SipFeaturesConfig {
  enableVideo: boolean;
  enableTransfer: boolean;
  enableConference: boolean;
}
export interface SipAccountConfig {
  username: string;
  password: string;
  domain: string;
  wssServer: string;
  webSocketPort: string | number;
  serverPath: string;
}
export interface JanusAccountConfig {
  username: string;
  janusServer: string;
}
export type HybridAccountConfig = SipAccountConfig & JanusAccountConfig;
