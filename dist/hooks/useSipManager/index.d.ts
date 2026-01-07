import { SipConfigs } from '../../configs/types';
import { LineType } from '../../store/types';
export declare function useSipManager({ configKey }: {
    configKey: SipConfigs['key'];
}): () => {
    status: import("../../store/types").SipUserAgentStatus;
    lines: LineType[];
};
