import { defaultSipConfigs } from '../configs';
import { SipConfigs } from '../configs/types';
import { AudioBlobs } from '../constructors';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
let lineNumber = 0;
/* -------------------------------------------------------------------------- */
// Create sip store
export const useSipStore = create<SipStoreStateType>((set, get) => ({
  configs: defaultSipConfigs,
  userAgent: undefined,
  devicesInfo: {
    hasVideoDevice: false,
    hasAudioDevice: false,
    hasSpeakerDevice: false,
    audioInputDevices: [],
    videoInputDevices: [],
    speakerDevices: [],
  },
  lines: {},
  audioBlobs: AudioBlobs.getInstance().getAudios(),
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setUserAgent: (userAgent: SipStoreStateType['userAgent']) =>
    set((state) => ({ ...state, userAgent })),
  addLine: (newLine: LineType) =>
    set((state) => ({
      ...state,
      lines: {
        ...state.lines,
        [newLine.lineNumber]: newLine, // add or overwrite
      },
    })),

  updateLine: (updatedLine: LineType) =>
    set((state) => {
      if (!state.lines?.[updatedLine.lineNumber]) return state; // nothing to update
      return {
        ...state,
        lines: {
          ...state.lines,
          [updatedLine.lineNumber]: updatedLine, // replace immutably
        },
      };
    }),

  removeLine: (lineNumber: LineType['lineNumber']) =>
    set((state) => {
      if (!state.lines?.[lineNumber]) return state; // nothing to remove
      const { [lineNumber]: _, ...rest } = state.lines; // omit the line immutably
      return { ...state, lines: rest };
    }),
  findLineByNumber: (lineNumber) => {
    return get().lines?.[lineNumber] ?? null;
  },
  getNewLineNumber: () => ++lineNumber,
  getSessions: () => {
    const { userAgent } = get();
    if (userAgent == null) {
      console.warn('userAgent is null');
      return null;
    }
    if (userAgent.isRegistered() == false) {
      console.warn('userAgent is not registered');
      return null;
    }
    const sessions = userAgent.sessions ?? null;
    return sessions;
  },
  countIdSessions: (id: string) => {
    let count = 0;
    if (!get().userAgent?.sessions) return count;
    Object.values(get().userAgent?.sessions ?? {}).forEach((session) => {
      if (id !== session.id) count++;
    });
    return count;
  },
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
export const getSipStoreUserAgent = (): SipStoreStateType['userAgent'] => {
  return useSipStore.getState().userAgent;
};
/**
 *
 * Get sip store configs for none functional components
 */
export const getSipStoreConfigs = (): SipConfigs => {
  return useSipStore.getState().configs;
};
/**
 *
 * Init sip store for none functional components
 */
export const initSipStore = (): void => {
  const initStore = useSipStore.getInitialState();
  setSipStore(initStore);
};
