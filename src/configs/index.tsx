import {
  SipAccountConfig,
  SipAdvancedConfig,
  SipConfigs,
  SipFeaturesConfig,
  SipMediaConfig,
  SipPermissionsConfig,
  SipPolicyConfig,
  SipRecordingConfig,
  SipRegistrationConfig,
  SipStorageConfig,
  SipXmppConfig,
} from './types';

export const defaultAccountConfig: SipAccountConfig = {
  username: '',
  password: '',
  domain: '',
  wssServer: '',
  webSocketPort: 7443,
  serverPath: '/ws',
};

export const defaultFeaturesConfig: SipFeaturesConfig = {
  enableVideo: true,
  enableRingtone: true,
  enableTextMessaging: true,
  enableTransfer: true,
  enableConference: true,
  enableTextExpressions: false,
  enableTextDictate: false,
  enableAlphanumericDial: true,
  enableAccountSettings: true,
  enableAppearanceSettings: true,
  enableNotificationSettings: true,
};

export const defaultMediaConfig: SipMediaConfig = {
  audioInputDeviceId: 'default',
  audioOutputDeviceId: 'default',
  videoInputDeviceId: 'default',
  maxFrameRate: 30,
  videoHeight: 720,
  videoAspectRatio: 1.777,
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  mirrorVideo: 'auto',
  maxVideoBandwidth: 1500,
  startVideoFullScreen: false,
};

export const defaultPolicyConfig: SipPolicyConfig = {
  autoAnswerPolicy: 'manual',
  doNotDisturbPolicy: 'off',
  callWaitingPolicy: 'on',
  callRecordingPolicy: 'manual',
  intercomPolicy: 'off',
};

export const defaultRegistrationConfig: SipRegistrationConfig = {
  transportConnectionTimeout: 5000,
  transportReconnectionAttempts: 3,
  transportReconnectionTimeout: 3000,
  registerExpires: 3600,
  registerExtraHeaders: '',
  registerExtraContactParams: '',
  registerContactParams: '',
  wssInTransport: true,
  ipInContact: false,
  bundlePolicy: 'balanced',
  iceStunServerJson: '',
  iceStunCheckTimeout: 5000,
  subscribeToYourself: false,
  voiceMailSubscribe: false,
  voicemailDid: '',
  subscribeVoicemailExpires: 3600,
  inviteExtraHeaders: '',
  noAnswerTimeout: 30,
};

export const defaultStorageConfig: SipStorageConfig = {
  streamBuffer: 1024,
  maxDataStoreDays: 30,
  posterJpegQuality: 80,
};

export const defaultRecordingConfig: SipRecordingConfig = {
  videoResampleSize: '1280x720',
  recordingVideoSize: '1280x720',
  recordingVideoFps: 30,
  recordingLayout: 'grid',
};

export const defaultAdvancedConfig: SipAdvancedConfig = {
  didLength: 4,
  maxDidLength: 8,
  singleInstance: true,
  chatEngine: 'default',
};

export const defaultXmppConfig: SipXmppConfig = {
  server: '',
  websocketPort: '',
  websocketPath: '',
  domain: '',
  profileUser: '',
  realm: '',
  realmSeparator: '',
  chatGroupService: '',
};

export const defaultPermissionsConfig: SipPermissionsConfig = {
  enableSendFiles: true,
  enableSendImages: true,
  enableAudioRecording: true,
  enableVideoRecording: true,
  enableSms: false,
  enableFax: false,
  enableEmail: false,
};

// Unified default config
export const defaultSipConfigs: SipConfigs = {
  account: defaultAccountConfig,
  features: defaultFeaturesConfig,
  media: defaultMediaConfig,
  policy: defaultPolicyConfig,
  registration: defaultRegistrationConfig,
  storage: defaultStorageConfig,
  recording: defaultRecordingConfig,
  advanced: defaultAdvancedConfig,
  xmpp: defaultXmppConfig,
  permissions: defaultPermissionsConfig,
};
