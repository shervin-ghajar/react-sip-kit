import { SipAccountConfig, SipConfigs } from '../configs/types';
import { CallbackFunction, CallType, SipUserAgent } from '../types';
import { Invitation, Inviter, Session, SessionDescriptionHandler, SessionDescriptionHandlerOptions } from 'sip.js';
import { IncomingInviteRequest } from 'sip.js/lib/core';
export interface SipStoreStateType {
    configs: Record<SipConfigs['key'], SipConfigs> | null;
    statuses: Record<SipConfigs['key'], SipUserAgentStatus> | null;
    userAgents?: Record<SipConfigs['key'], SipUserAgent>;
    lines: Record<SipConfigs['key'], Record<LineType['lineKey'], LineType>>;
    configKeysByLineKey: Record<LineType['lineKey'], SipConfigs['key']>;
    lineKeyByRemoteNumber_ConfigKey: Record<SipSessionDataType['remoteNumber'], LineType['lineKey']>;
    devicesInfo: DevicesInfoType;
    setSipStore: (state: Partial<SipStoreStateType>) => void;
    setConfig: (key: SipConfigs['key'], userAgent: SipConfigs) => void;
    setUserAgent: (key: SipConfigs['key'], userAgent: SipUserAgent) => void;
    addLine: (line: LineType) => void;
    updateLine: (line: LineType, callback?: CallbackFunction) => void;
    removeLine: (lineKey: LineType['lineKey']) => void;
    remove: (key: SipConfigs['key']) => void;
    removeAll: () => void;
    findLineByLineKey: (lineKey: LineType['lineKey']) => LineType | null;
    getSessionByLineKey: (lineKey: LineType['lineKey']) => LineType['sipSession'] | null;
    getConfigKeyByLineKey: (lineKey: LineType['lineKey']) => SipConfigs['key'] | null;
    getConfigKeyByRemoteNumber_ConfigKey: ({ remoteNumber, configKey, }: {
        remoteNumber: SipSessionDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    }) => SipConfigs['key'] | null;
    getLineKeyByRemoteNumber_ConfigKey: ({ remoteNumber, configKey, }: {
        remoteNumber: SipSessionDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    }) => LineType['lineKey'] | null;
    getLineBy: ({ remoteNumber, configKey, }: {
        remoteNumber: SipSessionDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    }) => LineType | null;
    remoteNumberConfigKeyResolver: ({ remoteNumber, configKey, }: {
        remoteNumber: SipSessionDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    }) => `${typeof remoteNumber}:${typeof configKey}`;
    getNewLineKey: () => LineType['lineKey'];
}
export interface SipInvitationType extends Omit<Invitation, 'incomingInviteRequest' | 'sessionDescriptionHandler'> {
    data: Partial<SipSessionDataType>;
    incomingInviteRequest: IncomingInviteRequest;
    sessionDescriptionHandler: SipSessionDescriptionHandler;
    sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
    initiateLocalMediaStreams: (params: InitiateMediaStreamsParams) => void;
    initiateRemoteMediaStreams: (params: InitiateMediaStreamsParams) => void;
}
export interface InitiateMediaStreamsParams {
    videoEnabled?: boolean;
    pc?: RTCPeerConnection;
    configs?: SipConfigs;
}
export interface SipSessionDescriptionHandlerOptions extends SessionDescriptionHandlerOptions {
    hold: boolean;
}
export interface SipInviterType extends Inviter {
    data: Partial<SipSessionDataType>;
    sessionDescriptionHandler: SipSessionDescriptionHandler;
    sessionDescriptionHandlerOptionsReInvite: SipSessionDescriptionHandlerOptions;
    initiateLocalMediaStreams: (params: InitiateMediaStreamsParams) => void;
    initiateRemoteMediaStreams: (params: InitiateMediaStreamsParams) => void;
}
export interface SipSessionDescriptionHandler extends SessionDescriptionHandler {
    peerConnection: RTCPeerConnection;
    peerConnectionDelegate: any;
}
export interface LineType {
    lineKey: string;
    remoteNumber: string;
    configKey: SipConfigs['key'];
    sipSession: SipInvitationType | SipInviterType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
}
export interface SipSessionType extends Session {
    data: SipSessionDataType;
}
export interface SipSessionDataType {
    configKey: SipConfigs['key'];
    lineKey: LineType['lineKey'];
    callDirection: 'inbound' | 'outbound';
    callType: CallType;
    terminateBy: string;
    remoteNumber: string;
    username: SipAccountConfig['username'];
    earlyReject: boolean;
    reasonCode: number;
    reasonText: string;
    teardownComplete: boolean;
    childsession: SipSessionType | null;
    startTime: string;
    started: boolean;
    hold: Array<{
        event: 'hold' | 'unhold';
        eventTime: string;
    }>;
    isHold: boolean;
    videoChannelNames: Array<Record<'mid' | 'channel', string>>;
    localMediaStreamStatus: MediaStremStatus;
    remoteMediaStreamStatus: MediaStremStatus;
    videoAckReceived: boolean;
    transfer: Array<SipSessionTransferType>;
    audioSourceTrack: MediaStreamTrack | null;
    videoSourceTrack: MediaStreamTrack | null;
    earlyMedia: any;
    ringerObj: {
        [key: string]: any;
    } | null;
    confBridgeChannels: Array<any>;
    confBridgeEvents: Array<any>;
    videoSourceDevice: string | null;
    audioSourceDevice: string | null;
    audioOutputDevice: string | null;
    recordMedia: {
        recording: boolean;
        startTime: string | null;
        recorder: MediaRecorder | null;
    };
}
export interface SipSessionTransferType {
    type: 'Attended' | 'Blind';
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
}
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
export type SipUserAgentStatus = 'disconnected' | 'connecting' | 'connected';
export {};
