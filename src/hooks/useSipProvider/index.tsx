import { reconnectTransport } from '../../events/transport';
import { useSipStore } from '../../store';
import { LineType, SipStoreStateType } from '../../store/types';
import { useDeep } from '../useDeep';

/** ---------- Provider paths ---------- */
interface ProviderState extends Pick<SipStoreStateType, 'status'> {
  lines: LineType[];
  transport: { reconnectTransport: typeof reconnectTransport };
}

type Path<T> = keyof T & string; // for provider, paths are top-level keys only

type PathValue<T, P extends string> = P extends keyof T ? T[P] : never;

/** ---------- Hook overloads ---------- */
export function useSipProvider(props?: { name?: undefined }): ProviderState;

export function useSipProvider<P extends Path<ProviderState>>(props: {
  name: P;
}): PathValue<ProviderState, P>;

export function useSipProvider<const P extends readonly Path<ProviderState>[]>(props: {
  name: P;
}): { [K in keyof P]: PathValue<ProviderState, P[K] & string> };

/** ---------- Implementation ---------- */
export function useSipProvider({ name }: { name?: string | readonly string[] } = {}) {
  return useSipStore(
    useDeep((state) => {
      const providerState: ProviderState = {
        status: state.status,
        lines: Object.values(state.lines),
        transport: { reconnectTransport },
      };

      if (!name) return providerState;
      if (Array.isArray(name)) return name.map((key) => providerState[key as keyof ProviderState]);
      return providerState[name as keyof ProviderState];
    }),
  );
}
