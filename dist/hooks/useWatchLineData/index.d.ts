import { SipConfigs } from '../../configs/types';
import { LineType, SipLineDataType } from '../../store/types';
type Primitive = string | number | boolean | symbol | null | undefined;
type Path<T> = {
    [K in keyof T & string]: T[K] extends Primitive | Array<any> ? K : K | `${K}.${Path<T[K]>}`;
}[keyof T & string];
/** Resolve the value type of a dot-path string. */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}` ? K extends keyof T ? Rest extends string ? PathValue<T[K], Rest> : never : never : P extends keyof T ? T[P] : never;
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
 * const sessionData = useWatchLineData({ key: { lineKey: 1 } });
 *
 * // Watch a specific property by lineKey
 * const videoEnabled = useWatchLineData({ key: { lineKey: 1 }, name: 'localMediaStreamStatus.videoEnabled' });
 *
 * // Watch full session data by remoteNumber
 * const sessionData = useWatchLineData({ key: { remoteNumber: '1001' } });
 *
 * // Watch multiple properties by remoteNumber
 * const [videoEnabled, audioEnabled] = useWatchLineData({
 *   key: { remoteNumber: '1001' },
 *   name: ['localMediaStreamStatus.videoEnabled', 'localMediaStreamStatus.audioEnabled']
 * });
 */
export declare function useWatchLineData(props: {
    key: {
        lineKey: LineType['lineKey'];
    };
    name?: undefined;
}): SipLineDataType;
export declare function useWatchLineData(props: {
    key: {
        remoteNumber: SipLineDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    };
    name?: undefined;
}): SipLineDataType;
export declare function useWatchLineData<P extends Path<SipLineDataType>>(props: {
    key: {
        lineKey: LineType['lineKey'];
    };
    name: P;
}): PathValue<SipLineDataType, P>;
export declare function useWatchLineData<P extends Path<SipLineDataType>>(props: {
    key: {
        remoteNumber: SipLineDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    };
    name: P;
}): PathValue<SipLineDataType, P>;
export declare function useWatchLineData<const P extends readonly Path<SipLineDataType>[]>(props: {
    key: {
        lineKey: LineType['lineKey'];
    };
    name: P;
}): {
    [K in keyof P]: PathValue<SipLineDataType, P[K] & string>;
};
export declare function useWatchLineData<const P extends readonly Path<SipLineDataType>[]>(props: {
    key: {
        remoteNumber: SipLineDataType['remoteNumber'];
        configKey: SipConfigs['key'];
    };
    name: P;
}): {
    [K in keyof P]: PathValue<SipLineDataType, P[K] & string>;
};
export {};
