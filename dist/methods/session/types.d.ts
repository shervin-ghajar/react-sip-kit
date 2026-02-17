import { IncomingResponse } from 'sip.js/lib/core';
import { sessionMethods } from '.';
import { LineType } from '../../store/types';
export declare enum SendMessageSessionEnum {
    'SOUND_TOGGLE' = "SOUND_TOGGLE",
    'VIDEO_TOGGLE' = "VIDEO_TOGGLE",
    'SCREEN_SHARE_TOGGLE' = "SCREEN_SHARE_TOGGLE",
    'VIDEO_TOGGLE_ACK' = "VIDEO_TOGGLE_ACK"
}
export type SendMessageSessionValueType = {
    [SendMessageSessionEnum.SOUND_TOGGLE]: boolean;
    [SendMessageSessionEnum.VIDEO_TOGGLE]: boolean;
    [SendMessageSessionEnum.SCREEN_SHARE_TOGGLE]: boolean;
    [SendMessageSessionEnum.VIDEO_TOGGLE_ACK]: null | undefined | '';
};
export type SendMessageRequestBody<T extends SendMessageSessionEnum = SendMessageSessionEnum.SOUND_TOGGLE> = {
    type: T;
    value: SendMessageSessionValueType[T];
};
export interface SessionDescriptionHandlerOptions {
    constraints: {
        audio: AudioSessionConstraints | boolean;
        video: VideoSessionConstraints | boolean;
    };
}
export type AudioSessionConstraints = {
    deviceId: string | {
        exact: string;
    };
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
};
export type VideoSessionConstraints = {
    deviceId: string | {
        exact: string;
    };
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    frameRate?: string | null;
    height?: string | null;
    aspectRatio?: string | null;
};
export type SPDOptionsType = Record<'sessionDescriptionHandlerOptions', SessionDescriptionHandlerOptions> & Partial<{
    earlyMedia: boolean;
    extraHeaders: string[];
}>;
export type SessionMethods = ReturnType<typeof sessionMethods>;
export type DialRequestDelegate = {
    onAccept?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
    onProgress?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
    onRedirect?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
    onReject?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
    onTrying?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
};
export type DialResponse = IncomingResponse;
