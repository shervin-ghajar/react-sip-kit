import { getSipStore, useSipStore } from '../../store';
import { SipSessionDataType } from '../../store/types';
import { useDeep } from '../useDeep';

/* -------------------------------------------------------------------------- */

type Primitive = string | number | boolean | symbol | null | undefined;

type Path<T> = {
  [K in keyof T & string]: T[K] extends Primitive | Array<any> ? K : K | `${K}.${Path<T[K]>}`;
}[keyof T & string];

/** Resolve the value type of a dot-path string. */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends string
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

/** Runtime helper to walk down a dot-path. */
function getByPath<T extends SipSessionDataType, P extends Path<T>>(
  obj: T,
  path: P,
): PathValue<T, P> | undefined {
  return path.split('.').reduce<any>((acc, key) => acc?.[key], obj);
}

/** ---------- Hook overloads ---------- */

export function useWatchSessionData(props: {
  lineNumber: number;
  name?: undefined;
}): SipSessionDataType;

export function useWatchSessionData<P extends Path<SipSessionDataType>>(props: {
  lineNumber: number;
  name: P;
}): PathValue<SipSessionDataType, P>;

export function useWatchSessionData<const P extends readonly Path<SipSessionDataType>[]>(props: {
  lineNumber: number;
  name: P;
}): { [K in keyof P]: PathValue<SipSessionDataType, P[K] & string> };

/** ---------- Implementation ---------- */

export function useWatchSessionData({
  lineNumber,
  name,
}: {
  lineNumber: number;
  name?: string | readonly string[];
}) {
  const username = getSipStore().getUsernameByNumber(lineNumber);
  return useSipStore(
    useDeep((state) => {
      try {
        const line = username ? state.lines?.[username]?.[lineNumber] : null;

        const data = line?.sipSession?.data as SipSessionDataType;
        if (Array.isArray(name)) {
          return name.map((path) => (data ? getByPath(data, path as any) : undefined));
        }

        if (typeof name === 'string') {
          return data ? getByPath(data as SipSessionDataType, name as any) : undefined;
        }

        return line?.sipSession?.data;
      } catch (error) {
        console.error(error);
      }
    }),
  );
}
