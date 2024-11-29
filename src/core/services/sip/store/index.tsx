import { BuddyType, LineType, SipStoreStateType } from './types';
import { create } from 'zustand';

/* -------------------------------------------------------------------------- */
// Create sip store
export const useSipStore = create<SipStoreStateType>((set, get) => ({
  userAgent: null,
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
  setSipStore: (newState: Partial<SipStoreStateType>) =>
    set((state) => ({ ...state, ...newState })),
  addLine: (newLine: LineType) => set((state) => ({ ...state, lines: [...state.lines, newLine] })),
  addBuddy: (newBuddy: BuddyType) =>
    set((state) => ({ ...state, buddies: [...state.buddies, newBuddy] })),

  findBuddyByDid: (did): BuddyType | null => {
    // Used only in Inbound
    for (const buddy of get().buddies) {
      if (
        buddy.ExtNo === did ||
        buddy.MobileNumber === did ||
        buddy.ContactNumber1 === did ||
        buddy.ContactNumber2 === did
      ) {
        return buddy;
      }
    }
    return null;
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
    const session = Object.values(userAgent.sessions).find(
      (session) => session.data.buddyId === buddyId,
    );
    if (!session) return null;
    return session;
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
