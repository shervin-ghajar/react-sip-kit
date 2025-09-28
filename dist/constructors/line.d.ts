import { SipAccountConfig, SipConfigs } from '../configs/types';
import { LineType, SipInvitationType } from '../store/types';
export declare class Line implements LineType {
    configKey: SipConfigs['key'];
    lineKey: LineType['lineKey'];
    remoteNumber: string;
    username: string;
    sipSession: SipInvitationType | null;
    localSoundMeter: any;
    remoteSoundMeter: any;
    constructor(configKey: SipConfigs['key'], username: SipAccountConfig['username'], lineKey: LineType['lineKey'], remoteNumber: string);
}
