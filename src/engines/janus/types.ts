import { RtcConfig } from '../../configs/types';
import { BaseLineDataType, MediaStreamData } from '../../store/types';
import Janus, { JanusJS } from './lib/janus';
import { JanusPublisher } from './methods/session/types';

export interface JanusInstance extends Janus { }

export interface JanusLineType {
    lineKey: string;
    remoteNumber: string;
    configKey: RtcConfig['key'];
    session: JanusSessionType | null;
    username: string;
    data: JanusLineDataType;
}

export interface JanusLineDataType extends Omit<BaseLineDataType, "localMediaStreamData" | "remoteMediaStreamData"> {
    localMediaStreamData: MediaStreamData; // Single local tracks
    remoteMediaStreamData: JanusMediaStreamData; // Multiple remote tracks
}

export type JanusMediaStreamData = {
    audio: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
    video: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
    screen?: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
};

export type JanusSessionType = {
    pluginHandle: JanusJS.PluginHandle; remoteJsep?: JanusJS.JSEP
    textHandle?: any;
    subscribers: Map<JanusPublisher['id'], JanusSessionType['pluginHandle']>,
};
