import { RtcConfig } from '../../configs/types';
import { useRtcStore } from '../../store';
import { LineType } from '../../store/types';
import { useMemo } from 'react';

export function useRtcManager({ configKey }: { configKey: RtcConfig['key'] }) {
  return () => {
    // only subscribe to the number of lines
    const lineCount = useRtcStore((s) =>
      configKey && s.lines?.[configKey] ? Object.keys(s.lines?.[configKey]).length : 0,
    );

    // access full lines object once, but don't subscribe to its updates
    const linesObj = useRtcStore.getState().lines?.[configKey] ?? {};

    // recompute lines only when lineCount changes
    const lines: LineType[] = useMemo(() => Object.values(linesObj), [lineCount]);

    const status = useRtcStore((s) => s?.statuses?.[configKey]) ?? 'connecting';
    return {
      status,
      lines,
    };
  };
}
