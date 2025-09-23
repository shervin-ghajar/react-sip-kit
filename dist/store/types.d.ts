import { SipAccountConfig, SipConfigs } from '../configs/types';
import { CallbackFunction, CallType, SipUserAgent } from '../types';
import { Invitation, Inviter, Session, SessionDescriptionHandler, SessionDescriptionHandlerOptions } from 'sip.js';
import { IncomingInviteRequest } from 'sip.js/lib/core';
export interface SipStoreStateType {
    configs: Record<SipAccountConfig['username'], SipConfigs> | null;
    statuses: Record<SipAccountConfig['username'], SipUserAgentStatus> | null;
    userAgents?: Record<SipAccountConfig['username'], SipUserAgent>;
    lines: Record<SipAccountConfig['username'], Record<LineType['lineNumber'], LineType>>;
    usernamesByLineNumber: Record<LineType['lineNumber'], SipAccountConfig['username']>;
    lineNumberByRemoteNumber: Record<SipSessionDataType['remoteNumber'], LineType['lineNumber']>;
    devicesInfo: DevicesInfoType;
    setSipStore: (state: Partial<SipStoreStateType>) => void;
    setConfig: (username: SipAccountConfig['username'], userAgent: SipConfigs) => void;
    setUserAgent: (username: SipAccountConfig['username'], userAgent: SipUserAgent) => void;
    addLine: (line: LineType) => void;
    updateLine: (line: LineType, callback?: CallbackFunction) => void;
    removeLine: (lineNumber: LineType['lineNumber']) => void;
    remove: (username: SipAccountConfig['username']) => void;
    removeAll: () => void;
    findLineByLineNumber: (lineNumber: LineType['lineNumber']) => LineType | null;
    getSessionByNumber: (lineNumber: LineType['lineNumber']) => LineType['sipSession'] | null;
    getUsernameByLineNumber: (lineNumber: LineType['lineNumber']) => SipAccountConfig['username'] | null;
    getUsernameByRemoteNumber: (remoteNumber: SipSessionDataType['remoteNumber']) => SipAccountConfig['username'] | null;
    getLineNumberByRemoteNumber: (remoteNumber: SipSessionDataType['remoteNumber']) => LineType['lineNumber'] | null;
    getLineByRemoteNumber: (remoteNumber: SipSessionDataType['remoteNumber']) => LineType | null;
    getNewLineNumber: () => number;
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
    lineNumber: number;
    remoteNumber: string;
    username: SipAccountConfig['username'];
    sipSession: SipInvitationType | SipInviterType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
}
export interface SipSessionType extends Session {
    data: SipSessionDataType;
}
export interface SipSessionDataType {
    lineNumber: number;
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
