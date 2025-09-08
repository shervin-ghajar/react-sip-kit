import { SipAccountConfig } from '../../configs/types';
import { LineType } from '../../store/types';
export declare function useSipProvider({ username }: {
    username: SipAccountConfig['username'];
}): {
    status: import("../../store/types").SipUserAgentStatus | undefined;
    lines: LineType[];
};
