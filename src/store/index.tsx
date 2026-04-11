import { SipConfigs } from '../configs/types';
import { SipUserAgent } from '../types';
import { generateUUID } from '../utils';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
// Create sip store
export const useSipStore = create<SipStoreStateType>((set, get) => ({
  broadcastEnabled: false,
  configs: {},
  statuses: {},
  userAgents: {},
  devicesInfo: {
    hasVideoDevice: false,
    hasAudioDevice: false,
    hasSpeakerDevice: false,
    audioInputDevices: [],
    videoInputDevices: [],
    speakerDevices: [],
  },
  lines: {},
  configKeysByLineKey: {},
  lineKeyByRemoteNumber_ConfigKey: {},
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setConfig: (configKey: SipConfigs['key'], config: SipConfigs) => {
    set((state) => ({ ...state, configs: { ...state.configs, [configKey]: config } }));
  },
  setUserAgent: (configKey: SipConfigs['key'], userAgent: SipUserAgent) => {
    set((state) => ({ ...state, userAgents: { ...state.userAgents, [configKey]: userAgent } }));
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
  remove: (configKey: SipConfigs['key']) => {
    if (!configKey) return null;
    set((state) => {
      if (!state.lines?.[configKey]) return state; // nothing to remove
      const { [configKey]: _, ...restLines } = state.lines;
      const { [configKey]: __, ...restConfigs } = state.configs as NonNullable<
        SipStoreStateType['configs']
      >;
      const { [configKey]: ___, ...restUserAgents } = state.userAgents as NonNullable<
        SipStoreStateType['userAgents']
      >;
      const { [configKey]: ____, ...restStatuses } = state.statuses as NonNullable<
        SipStoreStateType['statuses']
      >;
      return {
        ...state,
        lines: {
          ...restLines,
        },
        configs: { ...restConfigs },
        userAgents: { ...restUserAgents },
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
        userAgents: {},
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
  getLineByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey] ?? null;
  },
  getSessionByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey]?.sipSession ?? null;
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
  getNewLineKey: () => generateUUID(),
}));
/* -------------------------------------------------------------------------- */
/**
 *
 * Set sip store for none functional components
 */
export const setSipStore = (state: Partial<SipStoreStateType>) => {
  useSipStore.getState().setSipStore(state);
};
/**
 *
 * Get sip store for none functional components
 */
export const getSipStore = (): SipStoreStateType => {
  return useSipStore.getState();
};
/**
 *
 * Get sip store userAgent for none functional components
 */
export const getSipStoreUserAgent = (configKey: SipConfigs['key']): SipUserAgent | null => {
  return useSipStore.getState()?.userAgents?.[configKey] ?? null;
};
/**
 *
 * Get sip store configs for none functional components
 */
export const getSipUsernameConfigs = (configKey: SipConfigs['key']): SipConfigs | null => {
  return (useSipStore?.getState()?.configs as Record<string, SipConfigs>)?.[configKey] ?? null;
};
/**
 *
 * Init sip store for none functional components
 */
export const initSipStore = (): void => {
  const initStore = useSipStore.getInitialState();
  setSipStore(initStore);
};
