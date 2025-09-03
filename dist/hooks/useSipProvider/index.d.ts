import { reconnectTransport } from '../../events/transport';
import { LineType } from '../../store/types';
export declare function useSipProvider(): {
    status: "disconnected" | "connecting" | "connected";
    transport: {
        reconnectTransport: typeof reconnectTransport;
    };
    lines: LineType[];
};
