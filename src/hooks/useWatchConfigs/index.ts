import { useSipStore } from '../../store';
import { useDeep } from '../useDeep';

export const useWatchConfigs = () => {
  const configs = useSipStore(useDeep((state) => Object.values(state.configs ?? {})));
  return configs;
};
