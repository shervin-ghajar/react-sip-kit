import { makeSerializable } from './makeSerializable';

export const serializeLines = (lines: any) => {
  const copy = structuredClone(makeSerializable(lines));
  for (const configKey in copy) {
    for (const lineKey in copy[configKey]) {
      delete copy[configKey][lineKey].sipSession;
    }
  }

  return copy;
};
