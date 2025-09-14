import { SipSessionDataType } from '../../store/types';
type Primitive = string | number | boolean | symbol | null | undefined;
type Path<T> = {
    [K in keyof T & string]: T[K] extends Primitive | Array<any> ? K : K | `${K}.${Path<T[K]>}`;
}[keyof T & string];
/** Resolve the value type of a dot-path string. */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}` ? K extends keyof T ? Rest extends string ? PathValue<T[K], Rest> : never : never : P extends keyof T ? T[P] : never;
/** ---------- Hook overloads ---------- */
export declare function useWatchSessionData(props: {
    lineNumber: number;
    name?: undefined;
}): SipSessionDataType;
export declare function useWatchSessionData<P extends Path<SipSessionDataType>>(props: {
    lineNumber: number;
    name: P;
}): PathValue<SipSessionDataType, P>;
export declare function useWatchSessionData<const P extends readonly Path<SipSessionDataType>[]>(props: {
    lineNumber: number;
    name: P;
}): {
    [K in keyof P]: PathValue<SipSessionDataType, P[K] & string>;
};
export {};
