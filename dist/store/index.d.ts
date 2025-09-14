import { SipAccountConfig, SipConfigs } from '../configs/types';
import { SipUserAgent } from '../types';
import { SipStoreStateType } from './types';
export declare const useSipStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SipStoreStateType>>;
/**
 *
 * Set sip store for none functional components
 */
export declare const setSipStore: (state: Partial<SipStoreStateType>) => void;
/**
 *
 * Get sip store for none functional components
 */
export declare const getSipStore: () => SipStoreStateType;
/**
 *
 * Get sip store userAgent for none functional components
 */
export declare const getSipStoreUserAgent: (username: SipAccountConfig["username"]) => SipUserAgent | null;
/**
 *
 * Get sip store configs for none functional components
 */
export declare const getSipUsernameConfigs: (username: SipAccountConfig["username"]) => SipConfigs | null;
/**
 *
 * Init sip store for none functional components
 */
export declare const initSipStore: () => void;
