import { useSipStore } from '../../store';
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

export function useWatchSession(props: {
  lineNumber: number;
  name?: undefined;
}): SipSessionDataType;

export function useWatchSession<P extends Path<SipSessionDataType>>(props: {
  lineNumber: number;
  name: P;
}): PathValue<SipSessionDataType, P>;

export function useWatchSession<const P extends readonly Path<SipSessionDataType>[]>(props: {
  lineNumber: number;
  name: P;
}): { [K in keyof P]: PathValue<SipSessionDataType, P[K] & string> };

/** ---------- Implementation ---------- */

export function useWatchSession({
  lineNumber,
  name,
}: {
  lineNumber: number;
  name?: string | readonly string[];
}) {
  return useSipStore(
    useDeep((state) => {
      const line = state.lines[lineNumber];
      if (!line?.sipSession?.data) return undefined;
      const data = line.sipSession.data as SipSessionDataType;
      if (Array.isArray(name)) {
        return name.map((path) => getByPath(data, path as any));
      }

      if (typeof name === 'string') {
        return getByPath(data as SipSessionDataType, name as any);
      }

      return line.sipSession.data;
    }),
  );
}
