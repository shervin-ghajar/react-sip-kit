import { AudioBlobs } from '../constructors';
import { BuddyType, LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
// Create sip store

export const useSipStore = create<SipStoreStateType>((set, get) => ({
  config: {
    username: '',
    password: '',
    domain: '',
    wssServer: '',
    webSocketPort: '',
    serverPath: '/ws',
  },
  userAgent: undefined,
  buddies: [],
  selectedBuddy: [],
  selectedLine: [],
  hasVideoDevice: false,
  hasAudioDevice: false,
  hasSpeakerDevice: false,
  audioInputDevices: [],
  videoInputDevices: [],
  speakerDevices: [],
  lines: [],
  newLineNumber: 1,
  SipUsername: '',
  SipDomain: '',
  audioBlobs: new AudioBlobs().getAudios(),
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  setUserAgent: (userAgent: SipStoreStateType['userAgent']) =>
    set((state) => ({ ...state, userAgent })),
  addLine: (newLine: LineType) => set((state) => ({ ...state, lines: [...state.lines, newLine] })),
  updateLine: (updatedLine: LineType) => {
    const updatedLines = get().lines.map((line) => {
      if (line.LineNumber === updatedLine.LineNumber) return { ...updatedLine };
      return line;
    });
    set((state) => ({ ...state, lines: updatedLines }));
  },
  removeLine: (lineNumber: LineType['LineNumber']) => {
    console.log('removeLine');
    const lines = get().lines;
    const filteredLines = lines.filter((line) => line.LineNumber !== lineNumber);
    set((state) => ({ ...state, lines: filteredLines }));
  },
  addBuddy: (newBuddy: BuddyType) =>
    set((state) => ({ ...state, buddies: [...state.buddies, newBuddy] })),

  findBuddyByDid: (did): BuddyType | null => {
    // Used only in Inbound
    return (
      get().buddies.find(
        (buddy) =>
          buddy.ExtNo === did ||
          buddy.MobileNumber === did ||
          buddy.ContactNumber1 === did ||
          buddy.ContactNumber2 === did,
      ) ?? null
    );
  },
  findBuddyByIdentity: (identity: BuddyType['identity']) => {
    return get().buddies.find((buddy) => buddy.identity === identity) ?? null;
  },
  findLineByNumber: (lineNumber) => {
    return get().lines.find((line) => line.LineNumber === lineNumber) ?? null;
  },
  getSession: (buddyId) => {
    const { userAgent } = get();
    if (userAgent == null) {
      console.warn('userAgent is null');
      return null;
    }
    if (userAgent.isRegistered() == false) {
      console.warn('userAgent is not registered');
      return null;
    }
    const session =
      Object.values(userAgent.sessions).find((session) => session.data.buddyId === buddyId) ?? null;
    return session;
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
  countSessions: (id: string) => {
    let count = 0;
    if (!get().userAgent?.sessions) return count;
    Object.values(get().userAgent?.sessions ?? {}).forEach((session) => {
      if (id !== session.id) count++;
    });
    return count;
  },
}));
/* -------------------------------------------------------------------------- */
// Set sip store for none functional components
export const setSipStore = (state: Partial<SipStoreStateType>) => {
  useSipStore.setState((prev) => ({ ...prev, ...state }));
};
// Get sip store for none functional components
export const getSipStore = (): SipStoreStateType => {
  return useSipStore.getState();
};
// Init sip store for none functional components
export const initSipStore = (): void => {
  const initStore = useSipStore.getInitialState();
  setSipStore(initStore);
};
