import { SipProviderProps } from '../../types';

export interface CallActionType extends Pick<SipProviderProps, 'config'> {}

export interface SessionDescriptionHandlerOptions {
  constraints: {
    audio:
      | {
          deviceId: string | { exact: string };
          autoGainControl?: boolean;
          echoCancellation?: boolean;
          noiseSuppression?: boolean;
        }
      | boolean;
    video:
      | {
          deviceId: string | { exact: string };
          autoGainControl?: boolean;
          echoCancellation?: boolean;
          noiseSuppression?: boolean;
          frameRate?: string | null;
          height?: string | null;
          aspectRatio?: string | null;
        }
      | boolean;
  };
}
