import { SipAccountConfig, SipConfigs } from '../configs/types';
import { SipUserAgent } from '../types';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
let lineNumber = 0;
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
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setConfig: (username: SipAccountConfig['username'], config: SipConfigs) => {
    set((state) => ({ ...state, configs: { ...state.configs, [username]: config } }));
  },
  setUserAgent: (username: SipAccountConfig['username'], userAgent: SipUserAgent) => {
    set((state) => ({ ...state, userAgents: { ...state.userAgents, [username]: userAgent } }));
  },
  addLine: (username: SipAccountConfig['username'], newLine: LineType) => {
    set((state) => ({
      ...state,
      lines: {
        ...state.lines,
        [username]: {
          ...state.lines?.[username],
          [newLine.lineNumber]: newLine,
        },
      },
    }));
  },
  updateLine: (username: SipAccountConfig['username'], updatedLine: LineType) =>
    set((state) => {
      if (!state.lines?.[username]?.[updatedLine.lineNumber]) return state; // nothing to update
      return {
        ...state,
        lines: {
          ...state.lines,
          [username]: {
            ...state.lines?.[username],
            [updatedLine.lineNumber]: updatedLine, // replace immutably
          },
        },
      };
    }),

  removeLine: (username: SipAccountConfig['username'], lineNumber: LineType['lineNumber']) =>
    set((state) => {
      if (!state.lines?.[username]?.[lineNumber]) return state; // nothing to remove
      const { [lineNumber]: _, ...rest } = state.lines[username]; // omit the line immutably
      return {
        ...state,
        lines: {
          ...state.lines,
          [username]: {
            ...rest,
          },
        },
      };
    }),
  findLineByNumber: (username, lineNumber) => {
    return get().lines?.[username]?.[lineNumber] ?? null;
  },
  getSessionByNumber: (username, lineNumber) => {
    return get().lines?.[username]?.[lineNumber]?.sipSession ?? null;
  },
  getUsernameByNumber: (lineNumber) => {
    let username = null;
    for (const [key, line] of Object.entries(get().lines)) {
      if (line?.[lineNumber]) username = key;
    }
    return username;
  },
  getNewLineNumber: () => ++lineNumber,
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
