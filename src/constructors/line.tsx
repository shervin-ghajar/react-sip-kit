import { SipAccountConfig } from '../configs/types';
import { LineType, SipInvitationType } from '../store/types';

export class Line implements LineType {
  lineNumber: number; // Unique identifier for the line
  remoteNumber: string; // DID or number associated with the call
  username: string; // username or number associated with the call
  sipSession: SipInvitationType | null; // SIP.js Session object for the call
  localSoundMeter: any; // Placeholder for local audio level meter (if applicable)
  remoteSoundMeter: any; // Placeholder for remote audio level meter (if applicable)

  constructor(username: SipAccountConfig['username'], lineNumber: number, remoteNumber: string) {
    this.lineNumber = lineNumber;
    this.remoteNumber = remoteNumber;
    this.username = username;
    this.sipSession = null;
    this.localSoundMeter = null;
    this.remoteSoundMeter = null;
  }
}
