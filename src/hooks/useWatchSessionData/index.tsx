import { SipConfigs } from '../../configs/types';
import { getSipStore, useSipStore } from '../../store';
import { LineType, SipSessionDataType } from '../../store/types';
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

type UseWatchSessionKey =
  | { lineKey: LineType['lineKey'] }
  | { remoteNumber: SipSessionDataType['remoteNumber']; configKey: SipConfigs['key'] };

/* -------------------------------------------------------------------------- */
/*  Overloads                                                                 */
/* -------------------------------------------------------------------------- */
/**
 * React hook to watch SIP session data for a specific line.
 *
 * Provide a single `key` object containing **either** `lineKey` or `remoteNumber`.
 * You can also optionally specify `name` to access a specific property (supports dot-paths),
 * or an array of names to get multiple properties at once.
 *
 * @param {Object} params
 * @param {Object} params.key - Lookup key for the line/session.
 * @param {number} [params.key.lineKey] - Numeric line identifier. Takes priority if both keys are somehow provided.
 * @param {string} [params.key.remoteNumber] - Remote number of the SIP session. Used if `lineKey` is not provided.
 * @param {string | string[]} [params.name] - Optional dot-path string (e.g., 'localMediaStreamStatus.videoEnabled')
 *                                            or array of dot-paths to select specific data from the session.
 *
 * @returns {SipSessionDataType | any | any[]}
 * Returns the full session data if `name` is undefined,
 * a single property if `name` is a string,
 * or an array of properties if `name` is an array.
 *
 * @example
 * // Watch full session data by lineKey
 * const sessionData = useWatchSessionData({ key: { lineKey: 1 } });
 *
 * // Watch a specific property by lineKey
 * const videoEnabled = useWatchSessionData({ key: { lineKey: 1 }, name: 'localMediaStreamStatus.videoEnabled' });
 *
 * // Watch full session data by remoteNumber
 * const sessionData = useWatchSessionData({ key: { remoteNumber: '1001' } });
 *
 * // Watch multiple properties by remoteNumber
 * const [videoEnabled, audioEnabled] = useWatchSessionData({
 *   key: { remoteNumber: '1001' },
 *   name: ['localMediaStreamStatus.videoEnabled', 'localMediaStreamStatus.audioEnabled']
 * });
 */
export function useWatchSessionData(props: {
  key: { lineKey: LineType['lineKey'] };
  name?: undefined;
}): SipSessionDataType;
export function useWatchSessionData(props: {
  key: { remoteNumber: SipSessionDataType['remoteNumber']; configKey: SipConfigs['key'] };
  name?: undefined;
}): SipSessionDataType;

// String typed name
export function useWatchSessionData<P extends Path<SipSessionDataType>>(props: {
  key: { lineKey: LineType['lineKey'] };
  name: P;
}): PathValue<SipSessionDataType, P>;
export function useWatchSessionData<P extends Path<SipSessionDataType>>(props: {
  key: { remoteNumber: SipSessionDataType['remoteNumber']; configKey: SipConfigs['key'] };

  name: P;
}): PathValue<SipSessionDataType, P>;

// Array typed name
export function useWatchSessionData<const P extends readonly Path<SipSessionDataType>[]>(props: {
  key: { lineKey: LineType['lineKey'] };
  name: P;
}): { [K in keyof P]: PathValue<SipSessionDataType, P[K] & string> };

export function useWatchSessionData<const P extends readonly Path<SipSessionDataType>[]>(props: {
  key: { remoteNumber: SipSessionDataType['remoteNumber']; configKey: SipConfigs['key'] };
  name: P;
}): { [K in keyof P]: PathValue<SipSessionDataType, P[K] & string> };

/* -------------------------------------------------------------------------- */
/*  Implementation                                                            */
/* -------------------------------------------------------------------------- */

export function useWatchSessionData({
  key,
  name,
}: {
  key: UseWatchSessionKey;
  name?: string | readonly string[];
}) {
  const store = getSipStore();

  // Resolve the lineKey internally
  const lineKey = 'lineKey' in key ? key.lineKey : store.getLineKeyByRemoteNumber_ConfigKey(key);

  if (!lineKey) return undefined;

  const configKey = store.getConfigKeyByLineKey(lineKey);

  return useSipStore(
    useDeep((state) => {
      try {
        const line = configKey ? state.lines?.[configKey]?.[lineKey] : null;
        const data = line?.sipSession?.data as SipSessionDataType;

        if (!data) return undefined;

        if (Array.isArray(name)) return name.map((path) => getByPath(data, path as any));
        if (typeof name === 'string') return getByPath(data, name as any);

        return data;
      } catch (error) {
        console.error('useWatchSessionData', error);
      }
    }),
  );
}
