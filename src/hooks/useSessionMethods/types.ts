import { useSessionMethods } from '.';
import { SipProviderProps } from '../../types';

export interface SessionDescriptionHandlerOptions {
  constraints: {
    audio: AudioSessionConstraints | boolean;
    video: VideoSessionConstraints | boolean;
  };
}
export type AudioSessionConstraints = {
  deviceId: string | { exact: string };
  autoGainControl?: boolean;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
};
export type VideoSessionConstraints = {
  deviceId: string | { exact: string };
  autoGainControl?: boolean;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  frameRate?: string | null;
  height?: string | null;
  aspectRatio?: string | null;
};

export type SPDOptionsType = Record<
  'sessionDescriptionHandlerOptions',
  SessionDescriptionHandlerOptions
> &
  Partial<{
    earlyMedia: boolean;
    extraHeaders: string[];
  }>;

export type SessionMethods = ReturnType<typeof useSessionMethods>;
