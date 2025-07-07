import { defaultSipConfigs } from '../configs';
import { SipConfigs } from '../configs/types';
import { AudioBlobs } from '../constructors';
import { LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

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
  lines: [],
  audioBlobs: AudioBlobs.getInstance().getAudios(),
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setUserAgent: (userAgent: SipStoreStateType['userAgent']) =>
    set((state) => ({ ...state, userAgent })),
  addLine: (newLine: LineType) => set((state) => ({ ...state, lines: [...state.lines, newLine] })),
  updateLine: (updatedLine: LineType) => {
    const updatedLines = get().lines.map((line) => {
      if (line.lineNumber === updatedLine.lineNumber) return { ...updatedLine };
      return line;
    });
    set((state) => ({ ...state, lines: updatedLines }));
  },
  removeLine: (lineNumber: LineType['lineNumber']) => {
    console.log('removeLine');
    const lines = get().lines;
    const filteredLines = lines.filter((line) => line.lineNumber !== lineNumber);
    set((state) => ({ ...state, lines: filteredLines }));
  },
  findLineByNumber: (lineNumber) => {
    return get().lines.find((line) => line.lineNumber === lineNumber) ?? null;
  },
  getNewLineNumber: () => {
    return get().lines.length + 1;
  },
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
