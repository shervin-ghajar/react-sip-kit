import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { SipManager } from './manager';
import { getMediaPermissions } from './methods/initialization';
import { useSipStore } from './store';
import { SipProviderProps } from './types';
import { deepMerge } from './utils';
import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------- */
export const SipProvider = ({ children, configs }: SipProviderProps) => {
  const instances = useRef<string[]>([]);
  const setSipStore = useSipStore((s) => s.setSipStore);
  const setConfig = useSipStore((s) => s.setConfig);
  const setUserAgent = useSipStore((s) => s.setUserAgent);

  useEffect(() => {
    getPermissions();
    configs.forEach((config) => {
      if (!instances?.current?.includes(config.account.username)) {
        instances.current.push(config.account.username);
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
