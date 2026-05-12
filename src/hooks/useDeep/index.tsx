import { makeSerializable } from '../../utils';
import isEqual from 'lodash.isequal';
import { useRef } from 'react';

export function useDeep<S, U>(selector: (state: S) => U): (state: S) => U {
  const ref = useRef<U>();
  const snapshotRef = useRef<any>(); // serializable snapshot for equality

  return (state: S) => {
    const selected = selector(state);

    // Build a serializable snapshot (functions/DOM replaced)
    const snapshot = makeSerializable(selected);

    // If first run or data changed
    if (snapshotRef.current === undefined || !isEqual(snapshotRef.current, snapshot)) {
      snapshotRef.current = snapshot;
      // ✅ break reference: create fresh deep-ish clone without functions
      ref.current = cloneForReturn(selected);
    }

    return ref.current!;
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

/** Clone used for returning to React. Keeps functions intact, avoids cycles. */
function cloneForReturn<T>(value: T, seen = new WeakMap()): T {
  if (value === null || typeof value !== 'object') return value;

  if (seen.has(value as any)) return seen.get(value as any);
  if (typeof value === 'function') return value; // keep original function

  if (Array.isArray(value)) {
    const arr: any[] = [];
    seen.set(value as any, arr);
    for (const v of value) arr.push(cloneForReturn(v, seen));
    return arr as any;
  }

  if (Object.getPrototypeOf(value) !== Object.prototype) {
    return value; // don’t clone class instances/DOM objects, just return ref
  }

  const obj: any = {};
  seen.set(value as any, obj);
  for (const k in value as any) {
    obj[k] = cloneForReturn((value as any)[k], seen);
  }
  return obj;
}
