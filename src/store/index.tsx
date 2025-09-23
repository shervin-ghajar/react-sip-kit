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
  usernamesByLineNumber: {},
  lineNumberByRemoteNumber: {},
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
          [newLine.lineNumber]: newLine,
        },
      },
      usernamesByLineNumber: {
        ...state.usernamesByLineNumber,
        [newLine.lineNumber]: username,
      },
      lineNumberByRemoteNumber: {
        ...state.usernamesByLineNumber,
        [newLine.remoteNumber]: newLine.lineNumber,
      },
    }));
  },
  updateLine: (updatedLine: LineType) => {
    const username = updatedLine.username;
    if (!username) return null;
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
    });
  },

  removeLine: (lineNumber: LineType['lineNumber']) => {
    const username = get().getUsernameByLineNumber(lineNumber);
    const lineObj = get().findLineByLineNumber(lineNumber);
    if (!username) return null;
    const remoteNumber = lineObj?.sipSession?.data.remoteNumber ?? '';
    set((state) => {
      if (!state.lines?.[username]?.[lineNumber]) return state; // nothing to remove
      const { [lineNumber]: _, ...rest } = state.lines[username];
      const { [lineNumber]: __, ...restUsernamesByLineNumber } = state.usernamesByLineNumber;
      const { [remoteNumber]: ___, ...restLineNumberByRemoteNumber } =
        state.lineNumberByRemoteNumber;
      return {
        ...state,
        lines: {
          ...state.lines,
          [username]: {
            ...rest,
          },
        },
        usernamesByLineNumber: {
          ...restUsernamesByLineNumber,
        },
        lineNumberByRemoteNumber: {
          ...restLineNumberByRemoteNumber,
        },
      };
    });
  },
  remove: (username: SipAccountConfig['username']) => {
    if (!username) return null;
    set((state) => {
      if (!state.lines?.[username]?.[lineNumber]) return state; // nothing to remove
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
  findLineByLineNumber: (lineNumber) => {
    const username = get().getUsernameByLineNumber(lineNumber);
    if (!username) return null;
    return get().lines?.[username]?.[lineNumber] ?? null;
  },
  getSessionByLineNumber: (lineNumber) => {
    const username = get().getUsernameByLineNumber(lineNumber);
    if (!username) return null;
    return get().lines?.[username]?.[lineNumber]?.sipSession ?? null;
  },
  getUsernameByLineNumber: (lineNumber) => {
    return get().usernamesByLineNumber[lineNumber] ?? null;
  },
  getUsernameByRemoteNumber: (remoteNumber) => {
    const lineNumber = get().getLineNumberByRemoteNumber(remoteNumber) ?? null;
    if (!lineNumber) return null;
    return get().getUsernameByLineNumber(lineNumber);
  },
  getLineNumberByRemoteNumber: (remoteNumber) => {
    const lineNumber = get().lineNumberByRemoteNumber[remoteNumber] ?? null;
    return lineNumber;
  },
  getLineByRemoteNumber: (remoteNumber) => {
    const lineNumber = get().lineNumberByRemoteNumber[remoteNumber] ?? null;
    return get().findLineByLineNumber(lineNumber);
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
