import { LineType, SipInvitationType } from '../../store/types';
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

export type SPDOptionsType = Record<
  'sessionDescriptionHandlerOptions',
  SessionDescriptionHandlerOptions
> &
  Partial<{
    earlyMedia: boolean;
    extraHeaders: string[];
  }>;

export type UseCallActionReturnType = {
  AnswerAudioCall: (lineNumber: LineType['LineNumber']) => void;
  AnswerVideoCall: (lineNumber: LineType['LineNumber']) => void;
  AudioCall: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
  VideoCall: (lineObj: LineType, dialledNumber: string, extraHeaders: Array<string>) => void;
  ReceiveCall: (session: SipInvitationType) => void;
  RejectCall: (lineNumber: LineType['LineNumber']) => void;
};
