import { SipConfigs } from '../configs/types';
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
export declare const getSipStoreUserAgent: () => SipStoreStateType["userAgent"];
/**
 *
 * Get sip store configs for none functional components
 */
export declare const getSipStoreConfigs: () => SipConfigs;
/**
 *
 * Init sip store for none functional components
 */
export declare const initSipStore: () => void;
