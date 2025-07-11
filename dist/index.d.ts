import * as react_jsx_runtime from 'react/jsx-runtime';
import { Invitation, Session, SessionDescriptionHandler, SessionDescriptionHandlerOptions, Inviter, Bye, Message, UserAgent, Registerer, Subscriber } from 'sip.js';
import { IncomingInviteRequest, IncomingRequestMessage, IncomingResponse } from 'sip.js/lib/core';
import { Dayjs } from 'dayjs';
import { AudioHTMLAttributes, VideoHTMLAttributes, HTMLAttributes } from 'react';

interface SipConfigs {
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
interface SipPermissionsConfig {
    enableSendFiles: boolean;
    enableSendImages: boolean;
    enableAudioRecording: boolean;
    enableVideoRecording: boolean;
    enableSms: boolean;
    enableFax: boolean;
    enableEmail: boolean;
}
interface SipXmppConfig {
    server: string;
    websocketPort: string;
    websocketPath: string;
    domain: string;
    profileUser: string;
    realm: string;
    realmSeparator: string;
    chatGroupService: string;
}
interface SipAdvancedConfig {
    didLength: number;
    maxDidLength: number;
    singleInstance: boolean;
    chatEngine: string;
}
interface SipRecordingConfig {
    videoResampleSize: string;
    recordingVideoSize: string;
    recordingVideoFps: number;
    recordingLayout: string;
}
interface SipStorageConfig {
    streamBuffer: number;
    maxDataStoreDays: number;
    posterJpegQuality: number;
}
interface SipRegistrationConfig {
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
interface SipPolicyConfig {
    autoAnswerPolicy: string;
    doNotDisturbPolicy: string;
    callWaitingPolicy: string;
    callRecordingPolicy: string;
    intercomPolicy: string;
}
interface SipMediaConfig {
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
interface SipFeaturesConfig {
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
interface SipAccountConfig {
    username: string;
    password: string;
    domain: string;
    wssServer: string;
    webSocketPort: string | number;
    serverPath: string;
}

declare function reconnectTransport(userAgent?: SipUserAgent): void;

interface SipInvitationType extends Omit<Invitation, 'incomingInviteRequest' | 'sessionDescriptionHandler'> {
    data: Partial<SipSessionDataType>;
    incomingInviteRequest: IncomingInviteRequest;
    sessionDescriptionHandler: SipSessionDescriptionHandler;
    sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
    isOnHold: boolean;
}
interface SipSessionDescriptionHandlerOptions extends SessionDescriptionHandlerOptions {
    hold: boolean;
}
interface SipInviterType extends Inviter {
    data: Partial<SipSessionDataType>;
    sessionDescriptionHandler: SipSessionDescriptionHandler;
    sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
    isOnHold: boolean;
}
interface SipSessionDescriptionHandler extends SessionDescriptionHandler {
    peerConnection: RTCPeerConnection;
    peerConnectionDelegate: any;
}
interface LineType<T extends object = object> {
    lineNumber: number;
    displayNumber: string;
    metaData: Partial<T>;
    sipSession: SipInvitationType | SipInviterType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
}
interface SipSessionType extends Session {
    data: SipSessionDataType;
}
interface SipSessionDataType {
    line: number;
    callDirection: 'inbound' | 'outbound';
    terminateBy: string;
    src: string;
    metaData: LineType['metaData'];
    callstart: string;
    earlyReject: boolean;
    withVideo: boolean;
    reasonCode: number;
    reasonText: string;
    teardownComplete: boolean;
    childsession: SipSessionType | null;
    startTime: Dayjs;
    started: boolean;
    hold: Array<{
        event: 'hold' | 'unhold';
        eventTime: string;
    }>;
    isHold: boolean;
    mute: Array<{
        event: 'mute' | 'unmute';
        eventTime: string;
    }>;
    isMute: boolean;
    videoChannelNames: Array<Record<'mid' | 'channel', string>>;
    dialledNumber: string;
    transfer: Array<SipSessionTransferType>;
    audioSourceTrack: any;
    earlyMedia: any;
    ringerObj: {
        [key: string]: any;
    } | null;
    confBridgeChannels: Array<any>;
    confBridgeEvents: Array<any>;
    videoSourceDevice: string | null;
    audioSourceDevice: string | null;
    audioOutputDevice: string | null;
}
interface SipSessionTransferType {
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

declare const useSessionMethods: <MetaDataType extends object = object>() => {
    receiveCall: (session: SipInvitationType) => void;
    answerAudioSession: (lineNumber: LineType["lineNumber"]) => void;
    answerVideoSession: (lineNumber: LineType["lineNumber"]) => void;
    makeAudioSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    makeVideoSession: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
    rejectCall: (lineNumber: LineType["lineNumber"]) => void;
    dialByLine: (type: "audio" | "video", dialNumber: string, metaData?: MetaDataType, extraHeaders?: Array<string>) => void;
    endSession: (lineNumber: LineType["lineNumber"]) => void;
    holdSession: (lineNumber: LineType["lineNumber"]) => void;
    unholdSession: (lineNumber: LineType["lineNumber"]) => void;
    muteSession: (lineNumber: LineType["lineNumber"]) => void;
    unmuteSession: (lineNumber: LineType["lineNumber"]) => void;
    cancelSession: (lineNumber: LineType["lineNumber"]) => void;
    startTransferSession: (lineNumber: LineType["lineNumber"]) => void;
    cancelTransferSession: (lineNumber: LineType["lineNumber"]) => void;
    attendedTransferSession: (baseLine: LineType, transferLineNumber: LineType["lineNumber"]) => void;
    cancelAttendedTransferSession: (baseLine: LineType, transferLineNumber: LineType["lineNumber"]) => void;
    teardownSession: (lineObj: LineType) => void;
};

declare const useSessionEvents: () => {
    onInviteCancel: (lineObj: LineType, response: IncomingRequestMessage, callback?: CallbackFunction<any>) => void;
    onInviteAccepted: (lineObj: LineType, includeVideo: boolean, response?: IncomingResponse) => void;
    onInviteTrying: (lineObj: LineType, response: IncomingResponse) => void;
    onInviteProgress: (lineObj: LineType, response: IncomingResponse) => void;
    onInviteRejected: (lineObj: LineType, response: IncomingResponse, callback?: CallbackFunction<any>) => void;
    onInviteRedirected: (lineObj: LineType, response: IncomingResponse) => void;
    onSessionReceivedBye: (lineObj: LineType, response: Bye, callback?: CallbackFunction<any>) => void;
    onSessionReinvited: (lineObj: LineType, response: IncomingRequestMessage) => void;
    onSessionReceivedMessage: (lineObj: LineType, response: Message) => void;
    onSessionDescriptionHandlerCreated: (lineObj: LineType, sdh: SipSessionDescriptionHandler, provisional: boolean, includeVideo?: boolean) => void;
    onTrackAddedEvent: (lineObj: LineType, includeVideo?: boolean) => void;
    onTransferSessionDescriptionHandlerCreated: (lineObj: LineType, session: SipSessionType, sdh: SipSessionDescriptionHandler, includeVideo?: boolean) => void;
};

interface SipUserAgent extends UserAgent {
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
interface SipProviderProps<T extends SipConfigs = SipConfigs> {
    children: React.ReactNode;
    configs: SipProviderConfigs<T>;
}
interface SipContextType<MetaDataType extends object = object> {
    status: 'connected' | 'disconnected';
    lines: LineType<MetaDataType>[];
    session: SipContextSessionType<MetaDataType>;
    transport: SipContextTransportType;
}
interface SipContextSessionType<MetaDataType extends object = object> {
    methods: Omit<ReturnType<typeof useSessionMethods<MetaDataType>>, 'receiveCall'>;
    events: ReturnType<typeof useSessionEvents>;
}
interface SipContextTransportType {
    reconnectTransport: typeof reconnectTransport;
}
type CallbackFunction<T> = (value?: T) => void;

declare const SipProvider: ({ children, configs }: SipProviderProps) => react_jsx_runtime.JSX.Element;
declare const useSipProvider: <MetaDataType extends object = object>() => SipContextType<MetaDataType>;

interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
    lineNumber: string | number;
    type?: 'transfer' | 'conference';
}
declare const Audio: ({ lineNumber, type, ...rest }: AudioProps) => react_jsx_runtime.JSX.Element;

interface DefaultVideoProps {
    lineNumber: string | number;
}
interface LocalVideoProps extends VideoHTMLAttributes<HTMLVideoElement>, DefaultVideoProps {
    type: 'local';
}
interface RemoteVidepProps extends HTMLAttributes<HTMLDivElement>, DefaultVideoProps {
    type: 'remote';
}
type VideoProps = LocalVideoProps | RemoteVidepProps;
declare const Video: ({ lineNumber, ...rest }: VideoProps) => react_jsx_runtime.JSX.Element;

export { Audio as AudioStream, SipProvider, Video as VideoStream, useSipProvider };
