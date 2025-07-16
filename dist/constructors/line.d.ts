import { LineType, SipInvitationType } from '../store/types';
export declare class Line<T extends Partial<object>> implements LineType {
    lineNumber: number;
    displayNumber: string;
    sipSession: SipInvitationType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
    constructor(lineNumber: number, displayNumber: string);
}
