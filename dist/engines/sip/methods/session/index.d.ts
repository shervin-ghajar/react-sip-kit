import { RtcConfig } from '../../../../configs/types';
import { LineDataType, LineType, MediaStreamData } from '../../../../store/types';
import { CallType } from '../../../../types';
import { SipInvitationType, SipLineType } from '../../types';
import { teardownSession } from './shared';
import { DialRequestDelegate } from './types';
export declare const sessionMethods: ({ configKey }: {
    configKey: RtcConfig["key"];
}) => {
    receiveSession: (invitation: SipInvitationType) => void;
    answerAudioSession: (lineKey: SipLineType["lineKey"]) => void;
    answerVideoSession: (lineKey: SipLineType["lineKey"], enableVideo?: boolean) => void;
    makeAudioSession: (lineObj: SipLineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => DialRequestDelegate | undefined;
    makeVideoSession: (lineObj: SipLineType, dialledNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    toggleLocalVideoTrack: (lineKey: SipLineType["lineKey"]) => Promise<void>;
    toggleShareScreen: (lineKey: SipLineType["lineKey"]) => Promise<void>;
    rejectSession: (lineKey: SipLineType["lineKey"]) => void;
    dialByNumber: (type: Extract<CallType, "audio" | "video">, dialNumber: string, request?: DialRequestDelegate, extraHeaders?: Array<string>) => void;
    setMediaStreamConfigs: (lineKey: LineType["lineKey"], configs: Partial<Pick<LineDataType, "audioInputDeviceId" | "audioOutputDeviceId" | "videoInputDeviceId" | "speakerEnabled">>) => Promise<void>;
    endSession: (lineKey: SipLineType["lineKey"]) => Promise<void>;
    recordSession: (lineKey: SipLineType["lineKey"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    toggleMuteSession: (lineKey: SipLineType["lineKey"]) => void;
    toggleHoldSession: (lineKey: SipLineType["lineKey"], forcedValue?: boolean) => Promise<void>;
    makeTransferSession: (lineKey: SipLineType["lineKey"], transferNumber: SipLineType["lineKey"], request?: DialRequestDelegate) => {
        blind: () => Promise<void>;
        attend: () => Promise<void>;
        attendAccept: () => void;
        attendCancel: () => void;
    };
    sendDTMF: (lineKey: SipLineType["lineKey"], tones: string) => Promise<void>;
    conferenceBridge: ({ type, hostLineKey, otherLineKeys, }: {
        type: keyof MediaStreamData;
        hostLineKey: string;
        otherLineKeys: string[];
    }) => Promise<void>;
    cancelSession: (lineKey: SipLineType["lineKey"]) => void;
    teardownSession: typeof teardownSession;
};
