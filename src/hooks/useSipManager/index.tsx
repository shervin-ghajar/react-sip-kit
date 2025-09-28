import { SipAccountConfig, SipConfigs } from '../../configs/types';
import { useSipStore } from '../../store';
import { LineType } from '../../store/types';
import { useMemo } from 'react';

export function useSipManager({ configKey }: { configKey: SipConfigs['key'] }) {
  return () => {
    // only subscribe to the number of lines
    const lineCount = useSipStore((s) =>
      configKey && s.lines?.[configKey] ? Object.keys(s.lines?.[configKey]).length : 0,
    );

    // access full lines object once, but don't subscribe to its updates
    const linesObj = useSipStore.getState().lines?.[configKey] ?? {};

    // recompute lines only when lineCount changes
    const lines: LineType[] = useMemo(() => Object.values(linesObj), [lineCount]);

    const status = useSipStore((s) => s?.statuses?.[configKey]) ?? 'connecting';

    return {
      status,
      lines,
    };
  };
}
