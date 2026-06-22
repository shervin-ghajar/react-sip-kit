import { CallbackFunction } from '../../../../types';
import { SipLineType } from '../../types';
import { SendMessageSessionEnum, SendMessageSessionValueType } from './types';
/**
 * Teardown Call Session Based on Line
 * @param lineObj
 * @returns
 */
export declare function teardownSession(lineObj: SipLineType, callback?: CallbackFunction): void;
export declare function sendMessageSession<T extends SendMessageSessionEnum>(session: SipLineType['session'], type: T, value: SendMessageSessionValueType[T]): Promise<void>;
/**
 * Sends VIDEO_TOGGLE and retries until VIDEO_TOGGLE_ACK is received.
 */
export declare function sendVideoActivationWithAckRetry(lineKey: SipLineType['lineKey'], session: SipLineType['session'], options?: {
    maxRetries?: number;
    delayMs?: number;
}, value?: boolean): Promise<void>;
