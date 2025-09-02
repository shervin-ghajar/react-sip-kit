import { reconnectTransport } from '../../events/transport';
import { LineType, SipStoreStateType } from '../../store/types';
/** ---------- Provider paths ---------- */
interface ProviderState extends Pick<SipStoreStateType, 'status'> {
    lines: LineType[];
    transport: {
        reconnectTransport: typeof reconnectTransport;
    };
}
type Path<T> = keyof T & string;
type PathValue<T, P extends string> = P extends keyof T ? T[P] : never;
/** ---------- Hook overloads ---------- */
export declare function useSipProvider(props?: {
    name?: undefined;
}): ProviderState;
export declare function useSipProvider<P extends Path<ProviderState>>(props: {
    name: P;
}): PathValue<ProviderState, P>;
export declare function useSipProvider<const P extends readonly Path<ProviderState>[]>(props: {
    name: P;
}): {
    [K in keyof P]: PathValue<ProviderState, P[K] & string>;
};
export {};
