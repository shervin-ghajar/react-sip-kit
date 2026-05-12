import { RtcConfig } from '../configs/types';
import { EngineInstance } from '../types';
import { LineType, RtcStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
// Create rtc store
export const useRtcStore = create<RtcStoreStateType>((set, get) => ({
  broadcastEnabled: false,
  configs: {},
  statuses: {},
  engines: {},
  lines: {},
  configKeysByLineKey: {},
  lineKeyByRemoteNumber_ConfigKey: {},
  setRtcStore: (newState: Partial<RtcStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setConfig: (configKey: RtcConfig['key'], config: RtcConfig) => {
    set((state) => ({ ...state, configs: { ...state.configs, [configKey]: config } }));
  },
  setEngine: (configKey: RtcConfig['key'], engine: EngineInstance) => {
    console.log('setEngine', { configKey, engine });
    set((state) => ({ ...state, engines: { ...state.engines, [configKey]: engine } }));
  },
  addLine: (newLine: LineType) => {
    const configKey = newLine.configKey;
    set((state) => ({
      ...state,
      lines: {
        ...state.lines,
        [configKey]: {
          ...state.lines?.[configKey],
          [newLine.lineKey]: newLine,
        },
      },
      configKeysByLineKey: {
        ...state.configKeysByLineKey,
        [newLine.lineKey]: configKey,
      },
      lineKeyByRemoteNumber_ConfigKey: {
        ...state.configKeysByLineKey,
        [get().remoteNumberConfigKeyResolver({
          remoteNumber: newLine.remoteNumber,
          configKey: newLine.configKey,
        })]: newLine.lineKey,
      },
    }));
  },
  updateLine: (updatedLine: LineType) => {
    const configKey = updatedLine.configKey;
    if (!configKey) return null;
    set((state) => {
      if (!state.lines?.[configKey]?.[updatedLine.lineKey]) return state; // nothing to update
      return {
        ...state,
        lines: {
          ...state.lines,
          [configKey]: {
            ...state.lines?.[configKey],
            [updatedLine.lineKey]: updatedLine, // replace immutably
          },
        },
      };
    });
  },

  removeLine: (lineKey: LineType['lineKey']) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    const lineObj = get().getLineByLineKey(lineKey);
    if (!configKey) return null;
    const remoteNumber = lineObj?.data.remoteNumber ?? '';
    set((state) => {
      if (!state.lines?.[configKey]?.[lineKey]) return state; // nothing to remove
      const { [lineKey]: _, ...rest } = state.lines[configKey];
      const { [lineKey]: __, ...restConfigKeysByLineKey } = state.configKeysByLineKey;
      const {
        [get().remoteNumberConfigKeyResolver({ remoteNumber, configKey })]: ___,
        ...restLineKeyByRemoteNumber_ConfigKey
      } = state.lineKeyByRemoteNumber_ConfigKey;
      return {
        ...state,
        lines: {
          ...state.lines,
          [configKey]: {
            ...rest,
          },
        },
        configKeysByLineKey: {
          ...restConfigKeysByLineKey,
        },
        lineKeyByRemoteNumber_ConfigKey: {
          ...restLineKeyByRemoteNumber_ConfigKey,
        },
      };
    });
  },
  remove: (configKey: RtcConfig['key']) => {
    if (!configKey) return null;
    set((state) => {
      if (!state.lines?.[configKey]) return state; // nothing to remove
      const { [configKey]: _, ...restLines } = state.lines;
      const { [configKey]: __, ...restConfigs } = state.configs as NonNullable<
        RtcStoreStateType['configs']
      >;
      const { [configKey]: ___, ...restEngines } = state.engines as NonNullable<
        RtcStoreStateType['engines']
      >;
      const { [configKey]: ____, ...restStatuses } = state.statuses as NonNullable<
        RtcStoreStateType['statuses']
      >;
      return {
        ...state,
        lines: {
          ...restLines,
        },
        configs: { ...restConfigs },
        engines: { ...restEngines },
        statuses: { ...restStatuses },
      };
    });
  },
  removeAll: () => {
    set((state) => {
      return {
        ...state,
        lines: {},
        configs: {},
        engines: {},
        statuses: {},
      };
    });
  },
  removeAllLines: () => {
    set((state) => {
      return {
        ...state,
        lines: {},
      };
    });
  },
  getLineByLineKey: <T extends LineType>(lineKey: string) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return (get().lines?.[configKey]?.[lineKey] as T) ?? null;
  },
  getSessionByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey]?.session ?? null;
  },
  getLineDataByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey]?.data ?? null;
  },
  getConfigKeyByLineKey: (lineKey) => {
    return get().configKeysByLineKey[lineKey] ?? null;
  },
  getConfigKeyByRemoteNumber_ConfigKey: ({ configKey, remoteNumber }) => {
    const lineKey =
      get().lineKeyByRemoteNumber_ConfigKey[
        get().remoteNumberConfigKeyResolver({ configKey, remoteNumber })
      ] ?? null;
    if (!lineKey) return null;
    return get().getConfigKeyByLineKey(lineKey);
  },
  getLineKeyByRemoteNumber_ConfigKey: ({ configKey, remoteNumber }) => {
    const lineKey =
      get().lineKeyByRemoteNumber_ConfigKey[
        get().remoteNumberConfigKeyResolver({ configKey, remoteNumber })
      ] ?? null;
    return lineKey;
  },
  getLineBy: (keys) => {
    let lineKey = '';
    if ('lineKey' in keys) {
      lineKey = keys.lineKey;
    } else {
      const { configKey, remoteNumber } = keys;
      lineKey =
        get().lineKeyByRemoteNumber_ConfigKey[
          get().remoteNumberConfigKeyResolver({ configKey, remoteNumber })
        ] ?? null;
    }
    return get().getLineByLineKey(lineKey);
  },
  remoteNumberConfigKeyResolver: ({ configKey, remoteNumber }) => {
    return `${remoteNumber}:${configKey}`;
  },
}));
/* -------------------------------------------------------------------------- */
/**
 *
 * Set rtc store for none functional components
 */
export const setRtcStore = (state: Partial<RtcStoreStateType>) => {
  useRtcStore.getState().setRtcStore(state);
};
/**
 *
 * Get rtc store for none functional components
 */
export const getRtcStore = (): RtcStoreStateType => {
  return useRtcStore.getState();
};
/**
 *
 * Get rtc store engineInstance for none functional components
 */
export const getEngineInstance = (configKey: RtcConfig['key']): EngineInstance | null => {
  return useRtcStore.getState()?.engines?.[configKey] ?? null;
};
/**
 *
 * Get rtc store configs for none functional components
 */
export const getRtcUsernameConfigs = (configKey: RtcConfig['key']): RtcConfig | null => {
  return (useRtcStore?.getState()?.configs as Record<string, RtcConfig>)?.[configKey] ?? null;
};
/**
 *
 * Init rtc store for none functional components
 */
export const initRtcStore = (): void => {
  const initStore = useRtcStore.getInitialState();
  setRtcStore(initStore);
};
