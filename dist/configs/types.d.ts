export interface SipConfigs {
    account: SipAccountConfig;
    features: SipFeaturesConfig;
    media: SipMediaConfig;
    policy: SipPolicyConfig;
    registration: SipRegistrationConfig;
    storage: SipStorageConfig;
    recording: SipRecordingConfig;
    advanced: SipAdvancedConfig;
    xmpp: SipXmppConfig;
    permissions: SipPermissionsConfig;
}
export interface SipPermissionsConfig {
    enableSendFiles: boolean;
    enableSendImages: boolean;
    enableAudioRecording: boolean;
    enableVideoRecording: boolean;
    enableSms: boolean;
    enableFax: boolean;
    enableEmail: boolean;
}
export interface SipXmppConfig {
    server: string;
    websocketPort: string;
    websocketPath: string;
    domain: string;
    profileUser: string;
    realm: string;
    realmSeparator: string;
    chatGroupService: string;
}
export interface SipAdvancedConfig {
    didLength: number;
    maxDidLength: number;
    singleInstance: boolean;
    chatEngine: string;
}
export interface SipRecordingConfig {
    videoResampleSize: 'HD' | 'FHD';
    recordingVideoSize: 'HD' | 'FHD';
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
    bundlePolicy: string;
    iceStunServerJson: string;
    iceStunCheckTimeout: number;
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
    audioInputDeviceId: string;
    audioOutputDeviceId: string;
    videoInputDeviceId: string;
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
    enableRingtone: boolean;
    enableTextMessaging: boolean;
    enableTransfer: boolean;
    enableConference: boolean;
    enableTextExpressions: boolean;
    enableTextDictate: boolean;
    enableAlphanumericDial: boolean;
    enableAccountSettings: boolean;
    enableAppearanceSettings: boolean;
    enableNotificationSettings: boolean;
}
export interface SipAccountConfig {
    username: string;
    password: string;
    domain: string;
    wssServer: string;
    webSocketPort: string | number;
    serverPath: string;
}
