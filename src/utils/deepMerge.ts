export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T; // Start with a shallow copy of the target

  if (target && typeof target === 'object' && source && typeof source === 'object') {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = output[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          // If both values are objects (and not arrays), recursively merge them
          output[key] = deepMerge(targetValue as object, sourceValue as object) as T[Extract<
            keyof T,
            string
          >];
        } else if (sourceValue !== undefined) {
          // Otherwise, if the source value is defined, assign it
          output[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }
  return output;
}
