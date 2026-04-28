/** Makes data safe for comparison: replaces functions, DOM, cycles */
export declare function makeSerializable<T>(value: T, seen?: WeakMap<WeakKey, any>): any;
