import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { sessionMethods } from './hooks';
import { useGetMediaDevices } from './hooks/useGetMediaDevices';
import { SipManager } from './manager';
import { getMediaPermissions } from './methods/initialization';
import { useSipStore } from './store';
import { SipProviderProps } from './types';
import { deepMerge } from './utils';
import { useEffect } from 'react';

export const SipProvider = ({ children, configs }: SipProviderProps) => {
  const setSipStore = useSipStore((s) => s.setSipStore);
  const setConfig = useSipStore((s) => s.setConfig);
  const setUserAgent = useSipStore((s) => s.setUserAgent);
  const { getDevices } = useGetMediaDevices();

  useEffect(() => {
    getPermissions();
    configs.forEach((config) => {
      const { receiveSession } = sessionMethods({ username: config.account.username });
      new SipManager({
        configs: deepMerge(defaultSipConfigs, config as SipConfigs),
        receiveSession,
        getDevices,
        setSipStore,
        setConfig,
        setUserAgent,
      });
    });
  }, [configs]);

  const getPermissions = async () => {
    await getMediaPermissions('audio');
  };

  return children;
};
