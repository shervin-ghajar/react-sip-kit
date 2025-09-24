import { SipAccountConfig } from '../configs/types';
import { LineType, SipInvitationType } from '../store/types';
export declare class Line implements LineType {
    lineKey: number;
    remoteNumber: string;
    username: string;
    sipSession: SipInvitationType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
    constructor(username: SipAccountConfig['username'], lineKey: number, remoteNumber: string);
}
