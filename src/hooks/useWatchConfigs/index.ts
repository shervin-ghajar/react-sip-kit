import { useRtcStore } from '../../store';
import { useDeep } from '../useDeep';

export const useWatchConfigs = () => {
  const configs = useRtcStore(useDeep((state) => Object.values(state.configs ?? {})));
  return configs;
};
