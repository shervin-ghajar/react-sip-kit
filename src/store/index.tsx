import { SipAccountConfig, SipConfigs } from '../configs/types';
import { SipUserAgent } from '../types';
import { generateUUID } from '../utils';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
// Create sip store
export const useSipStore = create<SipStoreStateType>((set, get) => ({
  configs: null,
  statuses: null,
  userAgents: undefined,
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
  lineKeyByRemoteNumber: {},
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
      lineKeyByRemoteNumber: {
        ...state.configKeysByLineKey,
        [newLine.remoteNumber]: newLine.lineKey,
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
    const lineObj = get().findLineByLineKey(lineKey);
    if (!configKey) return null;
    const remoteNumber = lineObj?.sipSession?.data.remoteNumber ?? '';
    set((state) => {
      if (!state.lines?.[configKey]?.[lineKey]) return state; // nothing to remove
      const { [lineKey]: _, ...rest } = state.lines[configKey];
      const { [lineKey]: __, ...restConfigKeysByLineKey } = state.configKeysByLineKey;
      const { [remoteNumber]: ___, ...restLineKeyByRemoteNumber } = state.lineKeyByRemoteNumber;
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
        lineKeyByRemoteNumber: {
          ...restLineKeyByRemoteNumber,
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
  findLineByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey] ?? null;
  },
  getSessionByLineKey: (lineKey) => {
    const configKey = get().getConfigKeyByLineKey(lineKey);
    if (!configKey) return null;
    return get().lines?.[configKey]?.[lineKey]?.sipSession ?? null;
  },
  getConfigKeyByLineKey: (lineKey) => {
    return get().configKeysByLineKey[lineKey] ?? null;
  },
  getConfigKeyByRemoteNumber: (remoteNumber) => {
    const lineKey = get().getLineKeyByRemoteNumber(remoteNumber) ?? null;
    if (!lineKey) return null;
    return get().getConfigKeyByLineKey(lineKey);
  },
  getLineKeyByRemoteNumber: (remoteNumber) => {
    const lineKey = get().lineKeyByRemoteNumber[remoteNumber] ?? null;
    return lineKey;
  },
  getLineByRemoteNumber: (remoteNumber) => {
    const lineKey = get().lineKeyByRemoteNumber[remoteNumber] ?? null;
    return get().findLineByLineKey(lineKey);
  },
  getNewLineKey: () => generateUUID(),
}));
/* -------------------------------------------------------------------------- */
/**
 *
 * Set sip store for none functional components
 */
export const setSipStore = (state: Partial<SipStoreStateType>) => {
  useSipStore.setState((prev) => ({ ...prev, ...state }));
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
