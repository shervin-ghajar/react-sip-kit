import { SPDOptionsType } from '../useSessionMethods/types';
export declare const useSpdOptions: () => {
    answerAudioSpdOptions: ({ option: defaultOption }?: {
        option?: SPDOptionsType;
    }) => SPDOptionsType | undefined;
    makeAudioSpdOptions: ({ extraHeaders }: {
        extraHeaders?: string[];
    }) => Record<"sessionDescriptionHandlerOptions", import("../useSessionMethods/types").SessionDescriptionHandlerOptions> & Partial<{
        earlyMedia: boolean;
        extraHeaders: string[];
    }> & {
        earlyMedia: boolean;
        extraHeaders?: string[];
    };
    answerVideoSpdOptions: ({ option: defaultOption }?: {
        option?: SPDOptionsType;
    }) => SPDOptionsType | undefined;
    makeVideoSpdOptions: ({ extraHeaders }: {
        extraHeaders?: string[];
    }) => Record<"sessionDescriptionHandlerOptions", import("../useSessionMethods/types").SessionDescriptionHandlerOptions> & Partial<{
        earlyMedia: boolean;
        extraHeaders: string[];
    }> & {
        earlyMedia: boolean;
        extraHeaders?: string[];
    };
};
