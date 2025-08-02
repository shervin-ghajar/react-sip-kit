import { LineType } from '../../store/types';
import { SendMessageSessionValueType, SendMessageSessionEnum } from './type';
export declare function teardownSession(lineObj: LineType): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: LineType['sipSession'], type: T, value: SendMessageSessionValueType[T]): Promise<void>;
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export declare function sendVideoActivationWithAckRetry(session: LineType['sipSession'], options?: {
    maxRetries?: number;
    delayMs?: number;
}): Promise<void>;
