import { LineType } from '../../../../store/types';
import { CallType } from '../../../../types';
import { JanusLineType } from '../../types';
import { StartSessionOptions } from './types';
export declare const sessionMethods: ({ configKey }: {
    configKey: string;
}) => {
    startSession: (type: Extract<CallType, "audio" | "video">, roomNumber: string, opt?: StartSessionOptions) => void;
    endSession: (lineKey: LineType["lineKey"]) => void;
    toggleHoldSession: (lineKey: LineType["lineKey"], forcedValue?: boolean) => Promise<void>;
    toggleMuteSession: (lineKey: LineType["lineKey"]) => void;
    toggleLocalVideoTrack: (lineKey: JanusLineType["lineKey"]) => Promise<void>;
    toggleShareScreen: (lineKey: JanusLineType["lineKey"]) => Promise<void>;
    recordSession: (lineKey: JanusLineType["lineKey"]) => {
        start: () => Promise<void>;
        stop: () => void;
    };
    cancelSession: (lineKey: LineType["lineKey"]) => void;
    teardownSession: (lineKey: LineType["lineKey"], callback?: () => void) => void;
};
