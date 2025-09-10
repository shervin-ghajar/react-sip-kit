import { SipAccountConfig } from '../../configs/types';
// import { reconnectTransport } from '../../events/transport';
import { useSipStore } from '../../store';
import { LineType } from '../../store/types';
import { useMemo } from 'react';

export function useSipProvider({ username }: { username: SipAccountConfig['username'] }) {
  return () => {
    // only subscribe to the number of lines
    const lineCount = useSipStore((s) =>
      username && s.lines?.[username] ? Object.keys(s.lines?.[username]).length : 0,
    );

    // access full lines object once, but don't subscribe to its updates
    const linesObj = useSipStore.getState().lines?.[username] ?? {};

    // recompute lines only when lineCount changes
    const lines: LineType[] = useMemo(() => Object.values(linesObj), [lineCount]);

    const status = useSipStore((s) => s?.statuses?.[username]);
    // const transport = { reconnectTransport };

    return {
      status,
      // transport,
      lines,
    };
  };
}
