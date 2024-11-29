import { AudioBlobs } from '../constructors/audioBlobs';
import { BuddyType, LineType, SipStoreStateType } from './types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* -------------------------------------------------------------------------- */
// Create sip store
export const useSipStore = create(
  persist<SipStoreStateType>(
    (set, get) => ({
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
      audioBlobs: new AudioBlobs(),
      setSipStore: (newState: Partial<SipStoreStateType>) =>
        set((state) => ({ ...state, ...newState })),
      addLine: (newLine: LineType) =>
        set((state) => ({ ...state, lines: [...state.lines, newLine] })),
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
      findLineByNumber: (lineNumber) => {
        const line = get().lines.find((line) => line.LineNumber === lineNumber) ?? null;
        return line;
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
          Object.values(userAgent.sessions).find((session) => session.data.buddyId === buddyId) ??
          null;
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
    }),
    {
      name: 'sip-store',
    },
  ),
);
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
