import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { useSessionMethods } from './hooks';
import { useGetMediaDevices } from './hooks/useGetMediaDevices';
import { SipManager } from './manager';
import { useSipStore } from './store';
import { SipProviderProps } from './types';
import { deepMerge } from './utils';
import { useEffect, useMemo } from 'react';

export const SipProvider = ({ children, configs }: SipProviderProps) => {
  const setSipStore = useSipStore((s) => s.setSipStore);
  const { getDevices } = useGetMediaDevices();
  const { receiveSession } = useSessionMethods();

  const mergedConfigs = useMemo(
    () => deepMerge(defaultSipConfigs, configs as SipConfigs),
    [configs],
  );

  useEffect(() => {
    const manager = SipManager.getInstance();
    manager.initialize({ configs: mergedConfigs, receiveSession, getDevices, setSipStore });

    return () => {
      manager.stop();
    };
  }, [mergedConfigs]);

  return children;
};
