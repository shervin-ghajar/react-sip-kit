import { RtcConfig } from '../../configs/types';
import { LineType } from '../../store/types';
export declare function useRtcManager({ configKey }: {
    configKey: RtcConfig['key'];
}): () => {
    status: import("../..").RtcEngineStatus;
    lines: LineType[];
};
