import { defaultSipConfigs } from './configs';
import { SipAccountConfig, SipConfigs } from './configs/types';
import { SipManager } from './manager';
import { getMediaPermissions } from './methods/initialization';
import { useSipStore } from './store';
import { SipProviderProps } from './types';
import { deepMerge } from './utils';
import isEqual from 'lodash.isequal';
import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------- */
export const SipProvider = ({ children, configs }: SipProviderProps) => {
  const instances = useRef<
    Record<SipAccountConfig['username'], SipProviderProps['configs'][number]>
  >({});
  const setSipStore = useSipStore((s) => s.setSipStore);
  const setConfig = useSipStore((s) => s.setConfig);
  const setUserAgent = useSipStore((s) => s.setUserAgent);

  useEffect(() => {
    getPermissions();
    configs.forEach((config) => {
      if (!isEqual(instances?.current?.[config.account.username], config)) {
        instances.current[config.account.username] = config;
        new SipManager({
          configs: deepMerge(defaultSipConfigs, config as SipConfigs),
          setSipStore,
          setConfig,
          setUserAgent,
        });
      }
    });
  }, [configs]);

  const getPermissions = async () => {
    await getMediaPermissions('audio');
  };

  return children;
};
