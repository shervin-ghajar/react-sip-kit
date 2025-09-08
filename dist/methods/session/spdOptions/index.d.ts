import { SipAccountConfig } from '../../../configs/types';
import { SPDOptionsType } from '../types';
export declare const spdOptions: ({ username }: {
    username: SipAccountConfig["username"];
}) => {
    answerAudioSpdOptions: ({ option: defaultOption }?: {
        option?: SPDOptionsType;
    }) => SPDOptionsType | undefined;
    makeAudioSpdOptions: ({ extraHeaders }: {
        extraHeaders?: string[];
    }) => Record<"sessionDescriptionHandlerOptions", import("../types").SessionDescriptionHandlerOptions> & Partial<{
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
    }) => Record<"sessionDescriptionHandlerOptions", import("../types").SessionDescriptionHandlerOptions> & Partial<{
        earlyMedia: boolean;
        extraHeaders: string[];
    }> & {
        earlyMedia: boolean;
        extraHeaders?: string[];
    };
};
