import { RtcConfig } from '../../configs/types';
import { SipLineDataType } from '../../engines/sip/types';
import { getRtcStore, useRtcStore } from '../../store';
import { LineType } from '../../store/types';
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
function getByPath<T extends SipLineDataType, P extends Path<T>>(
  obj: T,
  path: P,
): PathValue<T, P> | undefined {
  return path.split('.').reduce<any>((acc, key) => acc?.[key], obj);
}

type UseWatchSessionKey =
  | { lineKey: LineType['lineKey'] }
  | { remoteNumber: SipLineDataType['remoteNumber']; configKey: RtcConfig['key'] };

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
 * @returns {SipLineDataType | any | any[]}
 * Returns the full session data if `name` is undefined,
 * a single property if `name` is a string,
 * or an array of properties if `name` is an array.
 *
 * @example
 * // Watch full session data by lineKey
 * const sessionData = useWatchSipLineData({ key: { lineKey: 1 } });
 *
 * // Watch a specific property by lineKey
 * const videoEnabled = useWatchSipLineData({ key: { lineKey: 1 }, name: 'localMediaStreamStatus.videoEnabled' });
 *
 * // Watch full session data by remoteNumber
 * const sessionData = useWatchSipLineData({ key: { remoteNumber: '1001' } });
 *
 * // Watch multiple properties by remoteNumber
 * const [videoEnabled, audioEnabled] = useWatchSipLineData({
 *   key: { remoteNumber: '1001' },
 *   name: ['localMediaStreamStatus.videoEnabled', 'localMediaStreamStatus.audioEnabled']
 * });
 */
export function useWatchSipLineData(props: {
  key: { lineKey: LineType['lineKey'] };
  name?: undefined;
}): SipLineDataType;
export function useWatchSipLineData(props: {
  key: { remoteNumber: SipLineDataType['remoteNumber']; configKey: RtcConfig['key'] };
  name?: undefined;
}): SipLineDataType;

// String typed name
export function useWatchSipLineData<P extends Path<SipLineDataType>>(props: {
  key: { lineKey: LineType['lineKey'] };
  name: P;
}): PathValue<SipLineDataType, P>;
export function useWatchSipLineData<P extends Path<SipLineDataType>>(props: {
  key: { remoteNumber: SipLineDataType['remoteNumber']; configKey: RtcConfig['key'] };

  name: P;
}): PathValue<SipLineDataType, P>;

// Array typed name
export function useWatchSipLineData<const P extends readonly Path<SipLineDataType>[]>(props: {
  key: { lineKey: LineType['lineKey'] };
  name: P;
}): { [K in keyof P]: PathValue<SipLineDataType, P[K] & string> };

export function useWatchSipLineData<const P extends readonly Path<SipLineDataType>[]>(props: {
  key: { remoteNumber: SipLineDataType['remoteNumber']; configKey: RtcConfig['key'] };
  name: P;
}): { [K in keyof P]: PathValue<SipLineDataType, P[K] & string> };

/* -------------------------------------------------------------------------- */
/*  Implementation                                                            */
/* -------------------------------------------------------------------------- */

export function useWatchSipLineData({
  key,
  name,
}: {
  key: UseWatchSessionKey;
  name?: string | readonly string[];
}) {
  const store = getRtcStore();

  // Resolve the lineKey internally
  const lineKey =
    ('lineKey' in key ? key.lineKey : store.getLineKeyByRemoteNumber_ConfigKey(key)) ?? '';

  const configKey = store.getConfigKeyByLineKey(lineKey);

  return useRtcStore(
    useDeep((state) => {
      try {
        const line = configKey ? state.lines?.[configKey]?.[lineKey] : null;
        const data = line?.data as SipLineDataType;

        if (!data) return null;

        if (Array.isArray(name)) return name.map((path) => getByPath(data, path as any));
        if (typeof name === 'string') return getByPath(data, name as any);

        return data;
      } catch (error) {
        console.error('useWatchSipLineData', error);
      }
    }),
  );
}
