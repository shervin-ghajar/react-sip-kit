/** Makes data safe for comparison: replaces functions, DOM, cycles */
export function makeSerializable<T>(value: T, seen = new WeakMap()): any {
  if (value === null || typeof value !== 'object') return value;
  if (typeof value === 'function') return '__fn__';

  if (seen.has(value as any)) return '__circular__';
  seen.set(value as any, true);

  if (Array.isArray(value)) {
    return value.map((v) => makeSerializable(v, seen));
  }

  // Only recurse into plain objects
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    return `__${Object.prototype.toString.call(value)}__`;
  }

  const out: any = {};
  for (const k in value as any) {
    try {
      out[k] = makeSerializable((value as any)[k], seen);
    } catch {
      out[k] = '__unclonable__';
    }
  }
  return out;
}
