import { BuddyType, LineType, SipInvitationType } from '../store/types';

export class Line implements LineType {
  lineNumber: number; // Unique identifier for the line
  DisplayName: string; // Display name of the caller/callee
  DisplayNumber: string; // DID or number associated with the call
  BuddyObj: BuddyType | null; // Associated buddy object (if any)
  sipSession: SipInvitationType | null; // SIP.js Session object for the call
  LocalSoundMeter: any; // Placeholder for local audio level meter (if applicable)
  RemoteSoundMeter: any; // Placeholder for remote audio level meter (if applicable)
  IsSelected: boolean;

  constructor(
    lineNumber: number,
    displayName: string,
    displayNumber: string,
    buddyObj: BuddyType | null = null,
    sipSession: SipInvitationType | null = null,
  ) {
    this.lineNumber = lineNumber;
    this.DisplayName = displayName;
    this.DisplayNumber = displayNumber;
    this.IsSelected = false;
    this.BuddyObj = buddyObj;
    this.sipSession = sipSession;
    this.LocalSoundMeter = null;
    this.RemoteSoundMeter = null;
  }
}
