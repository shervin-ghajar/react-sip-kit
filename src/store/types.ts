import { RtcConfig, SipAccountConfig } from '../configs/types';
import { HybridLineDataType, HybridLineType } from '../engines/hybrid/types';
import { JanusLineDataType, JanusLineType } from '../engines/janus/types';
import { SipLineDataType, SipLineType } from '../engines/sip/types';
import { CallbackFunction, CallType, EngineInstance, RtcEngineStatus, } from '../types';

/* -------------------------------------------------------------------------- */
export interface RtcStoreStateType {
  broadcastEnabled: boolean;
  configs: Record<RtcConfig['key'], RtcConfig>;
  statuses: Record<RtcConfig['key'], RtcEngineStatus>;
  engines?: Record<RtcConfig['key'], EngineInstance>;
  lines: Record<RtcConfig['key'], Record<LineType['lineKey'], LineType>>;
  configKeysByLineKey: Record<LineType['lineKey'], RtcConfig['key']>;
  lineKeyByRemoteNumber_ConfigKey: Record<LineDataType['remoteNumber'], LineType['lineKey']>;
  // Setter
  setRtcStore: (state: Partial<RtcStoreStateType>) => void;
  setConfig: (key: RtcConfig['key'], engine: RtcConfig) => void;
  setEngine: (key: RtcConfig['key'], engine: EngineInstance) => void;
  addLine: (line: LineType) => void;
  updateLine: (line: LineType, callback?: CallbackFunction) => void;
  removeLine: (lineKey: LineType['lineKey']) => void;
  remove: (key: RtcConfig['key']) => void;
  removeAll: () => void;
  removeAllLines: () => void;
  // Getter
  getLineByLineKey: <T extends LineType>(lineKey: LineType['lineKey']) => T | null;
  getSessionByLineKey: (lineKey: LineType['lineKey']) => LineType['session'] | null;
  getLineDataByLineKey: (lineKey: LineType['lineKey']) => LineType['data'] | null;
  getConfigKeyByLineKey: (lineKey: LineType['lineKey']) => RtcConfig['key'] | null;
  getConfigKeyByRemoteNumber_ConfigKey: ({
    remoteNumber,
    configKey,
  }: {
    remoteNumber: LineDataType['remoteNumber'];
    configKey: RtcConfig['key'];
  }) => RtcConfig['key'] | null;
  getLineKeyByRemoteNumber_ConfigKey: ({
    remoteNumber,
    configKey,
  }: {
    remoteNumber: LineDataType['remoteNumber'];
    configKey: RtcConfig['key'];
  }) => LineType['lineKey'] | null;
  getLineBy: (
    keys:
      | { lineKey: string }
      | {
        remoteNumber: LineDataType['remoteNumber'];
        configKey: RtcConfig['key'];
      },
  ) => LineType | null;
  remoteNumberConfigKeyResolver: ({
    remoteNumber,
    configKey,
  }: {
    remoteNumber: LineDataType['remoteNumber'];
    configKey: RtcConfig['key'];
  }) => `${typeof remoteNumber}:${typeof configKey}`;
}



export interface InitiateMediaStreamsParams {
  videoEnabled?: boolean;
  configs?: RtcConfig;
  type?: 'audio' | 'video';
  stopStream?: boolean;
}




/* -------------------------------------------------------------------------- */
export type LineType = SipLineType | JanusLineType | HybridLineType;


export type LineDataType = SipLineDataType | JanusLineDataType | HybridLineDataType
export interface BaseLineDataType {
  configKey: RtcConfig['key'];
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
  startTime: string;
  started: boolean;
  hold: Array<{ event: 'hold' | 'unhold'; eventTime: string }>;
  isHold: boolean;
  videoChannelNames: Array<Record<'mid' | 'channel', string>>;
  localMediaStreamData: MediaStreamData;
  remoteMediaStreamData: MediaStreamData;
  videoAckReceived: boolean;
  videoInputDeviceId: string | null | undefined;
  audioInputDeviceId: string | null | undefined;
  audioOutputDeviceId: string | null | undefined;
  confBridgeChannels: Array<any>; //TODO
  confBridgeEvents: Array<any>;
  recordMedia: {
    recording: boolean;
    startTime: string | null;
    recorder: MediaRecorder | null;
  };
}

/* -------------------------------------------------------------------------- */
export type MediaStreamData = Record<"audio" | "video" | "screen", {
  track: MediaStreamTrack | null | undefined;
  enabled: boolean
}>

export type RemoteMediaStreamData = {
  audio: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
  video: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
  screen?: Map<string, { track: MediaStreamTrack; enabled: boolean }>;
};
