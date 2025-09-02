import { reconnectTransport } from '../../events/transport';
import { useSipStore } from '../../store';
import { LineType } from '../../store/types';
import { useMemo } from 'react';

export function useSipProvider() {
  // only subscribe to the number of lines
  const lineCount = useSipStore((s) => Object.keys(s.lines).length);

  // access full lines object once, but don't subscribe to its updates
  const linesObj = useSipStore.getState().lines;

  // recompute lines only when lineCount changes
  const lines: LineType[] = useMemo(() => Object.values(linesObj), [lineCount]);

  const status = useSipStore((s) => s.status);
  const transport = { reconnectTransport };

  return { status, transport, lines };
}
