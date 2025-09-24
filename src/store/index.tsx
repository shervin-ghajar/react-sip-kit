import { SipAccountConfig, SipConfigs } from '../configs/types';
import { SipUserAgent } from '../types';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
let lineKey = 0;
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
  usernamesByLineKey: {},
  lineKeyByRemoteNumber: {},
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setConfig: (username: SipAccountConfig['username'], config: SipConfigs) => {
    set((state) => ({ ...state, configs: { ...state.configs, [username]: config } }));
  },
  setUserAgent: (username: SipAccountConfig['username'], userAgent: SipUserAgent) => {
    set((state) => ({ ...state, userAgents: { ...state.userAgents, [username]: userAgent } }));
  },
  addLine: (newLine: LineType) => {
    const username = newLine.username;
    set((state) => ({
      ...state,
      lines: {
        ...state.lines,
        [username]: {
          ...state.lines?.[username],
          [newLine.lineKey]: newLine,
        },
      },
      usernamesByLineKey: {
        ...state.usernamesByLineKey,
        [newLine.lineKey]: username,
      },
      lineKeyByRemoteNumber: {
        ...state.usernamesByLineKey,
        [newLine.remoteNumber]: newLine.lineKey,
      },
    }));
  },
  updateLine: (updatedLine: LineType) => {
    const username = updatedLine.username;
    if (!username) return null;
    set((state) => {
      if (!state.lines?.[username]?.[updatedLine.lineKey]) return state; // nothing to update
      return {
        ...state,
        lines: {
          ...state.lines,
          [username]: {
            ...state.lines?.[username],
            [updatedLine.lineKey]: updatedLine, // replace immutably
          },
        },
      };
    });
  },

  removeLine: (lineKey: LineType['lineKey']) => {
    const username = get().getUsernameByLineKey(lineKey);
    const lineObj = get().findLineByLineKey(lineKey);
    if (!username) return null;
    const remoteNumber = lineObj?.sipSession?.data.remoteNumber ?? '';
    set((state) => {
      if (!state.lines?.[username]?.[lineKey]) return state; // nothing to remove
      const { [lineKey]: _, ...rest } = state.lines[username];
      const { [lineKey]: __, ...restUsernamesByLineKey } = state.usernamesByLineKey;
      const { [remoteNumber]: ___, ...restLineKeyByRemoteNumber } = state.lineKeyByRemoteNumber;
      return {
        ...state,
        lines: {
          ...state.lines,
          [username]: {
            ...rest,
          },
        },
        usernamesByLineKey: {
          ...restUsernamesByLineKey,
        },
        lineKeyByRemoteNumber: {
          ...restLineKeyByRemoteNumber,
        },
      };
    });
  },
  remove: (username: SipAccountConfig['username']) => {
    if (!username) return null;
    set((state) => {
      if (!state.lines?.[username]?.[lineKey]) return state; // nothing to remove
      const { [username]: _, ...restLines } = state.lines;
      const { [username]: __, ...restConfigs } = state.configs as NonNullable<
        SipStoreStateType['configs']
      >;
      const { [username]: ___, ...restUserAgents } = state.userAgents as NonNullable<
        SipStoreStateType['userAgents']
      >;
      const { [username]: ____, ...restStatuses } = state.statuses as NonNullable<
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
    const username = get().getUsernameByLineKey(lineKey);
    if (!username) return null;
    return get().lines?.[username]?.[lineKey] ?? null;
  },
  getSessionByLineKey: (lineKey) => {
    const username = get().getUsernameByLineKey(lineKey);
    if (!username) return null;
    return get().lines?.[username]?.[lineKey]?.sipSession ?? null;
  },
  getUsernameByLineKey: (lineKey) => {
    return get().usernamesByLineKey[lineKey] ?? null;
  },
  getUsernameByRemoteNumber: (remoteNumber) => {
    const lineKey = get().getLineKeyByRemoteNumber(remoteNumber) ?? null;
    if (!lineKey) return null;
    return get().getUsernameByLineKey(lineKey);
  },
  getLineKeyByRemoteNumber: (remoteNumber) => {
    const lineKey = get().lineKeyByRemoteNumber[remoteNumber] ?? null;
    return lineKey;
  },
  getLineByRemoteNumber: (remoteNumber) => {
    const lineKey = get().lineKeyByRemoteNumber[remoteNumber] ?? null;
    return get().findLineByLineKey(lineKey);
  },
  getNewLineKey: () => ++lineKey,
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
export const getSipStoreUserAgent = (
  username: SipAccountConfig['username'],
): SipUserAgent | null => {
  return useSipStore.getState()?.userAgents?.[username] ?? null;
};
/**
 *
 * Get sip store configs for none functional components
 */
export const getSipUsernameConfigs = (
  username: SipAccountConfig['username'],
): SipConfigs | null => {
  return (useSipStore?.getState()?.configs as Record<string, SipConfigs>)?.[username] ?? null;
};
/**
 *
 * Init sip store for none functional components
 */
export const initSipStore = (): void => {
  const initStore = useSipStore.getInitialState();
  setSipStore(initStore);
};
