import { SipAccountConfig, SipConfigs } from '../configs/types';
import { LineType } from '../store/types';
export declare function createLine(configKey: SipConfigs['key'], username: SipAccountConfig['username'], lineKey: LineType['lineKey'], remoteNumber: string): LineType;
