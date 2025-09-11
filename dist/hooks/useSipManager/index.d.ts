import { SipAccountConfig } from '../../configs/types';
import { LineType } from '../../store/types';
export declare function useSipManager({ username }: {
    username: SipAccountConfig['username'];
}): () => {
    status: import("../../store/types").SipUserAgentStatus | undefined;
    lines: LineType[];
};
