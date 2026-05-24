import { makeSerializable } from './makeSerializable';

export const serializeLines = (lines: any) => {
  try {
    const copy = structuredClone(makeSerializable(lines));
    for (const configKey in copy) {
      for (const lineKey in copy[configKey]) {
        delete copy[configKey][lineKey].session;
        delete copy[configKey][lineKey].childSession;
        delete copy[configKey][lineKey].data?.transfer;
      }
    }

    return copy;
  } catch (error) {
    console.log({ error });
  }
};
