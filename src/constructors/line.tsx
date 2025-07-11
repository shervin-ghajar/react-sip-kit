import { LineType, SipInvitationType } from '../store/types';

export class Line<T extends Partial<object>> implements LineType<T> {
  lineNumber: number; // Unique identifier for the line
  displayNumber: string; // DID or number associated with the call
  metaData: Partial<T>; // Associated buddy object (if any)
  sipSession: SipInvitationType | null; // SIP.js Session object for the call
  localSoundMeter: any; // Placeholder for local audio level meter (if applicable)
  remoteSoundMeter: any; // Placeholder for remote audio level meter (if applicable)

  constructor(lineNumber: number, displayNumber: string, metaData: T) {
    this.lineNumber = lineNumber;
    this.displayNumber = displayNumber;
    this.metaData = metaData;
    this.sipSession = null;
    this.localSoundMeter = null;
    this.remoteSoundMeter = null;
  }
}
