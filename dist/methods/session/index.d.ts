import { LineType } from '../../store/types';
import { SendMessageSessionValueType, SendMessageSessionEnum } from './type';
export declare function teardownSession(lineObj: LineType): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: LineType['sipSession'], type: T, value: SendMessageSessionValueType[T]): void;
