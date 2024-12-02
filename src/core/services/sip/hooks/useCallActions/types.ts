import { BuddyType, LineType, SipInvitationType } from '../../store/types';
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
  AudioCall: (lineObj: LineType, dialledNumber: string, extraHeaders?: Array<string>) => void;
  VideoCall: (lineObj: LineType, dialledNumber: string, extraHeaders: Array<string>) => void;
  ReceiveCall: (session: SipInvitationType) => void;
  DialByLine: (
    type: 'audio' | 'video',
    numToDial: string,
    buddy?: BuddyType,
    CallerID?: BuddyType['CallerIDName'],
    extraHeaders?: Array<string>,
  ) => void;
} & Record<
  | 'AnswerAudioCall'
  | 'AnswerVideoCall'
  | 'RejectCall'
  | 'endCall'
  | 'holdSession'
  | 'unholdSession'
  | 'muteSession'
  | 'unmuteSession'
  | 'cancelSession'
  | 'startTransferSession'
  | 'cancelTransferSession'
  | 'attendedTransferSession',
  (lineNumber: LineType['LineNumber']) => void
>;
