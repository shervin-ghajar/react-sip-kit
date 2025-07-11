import { SipContextType, SipProviderProps } from './types';
export declare const SipContext: import("react").Context<SipContextType<object> | undefined>;
export declare const SipProvider: ({ children, configs }: SipProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useSipProvider: <MetaDataType extends object = object>() => SipContextType<MetaDataType>;
