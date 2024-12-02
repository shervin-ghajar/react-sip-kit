import { UseCallActionReturnType } from './hooks/useCallActions/types';
import { SipSessionType } from './store/types';
import { UserAgent, Registerer, Subscriber } from 'sip.js';

export interface SipUserAgent extends UserAgent {
  isReRegister: boolean;
  isRegistered: () => boolean;
  registerer: Registerer;
  sessions: {
    [id: string]: SipSessionType;
  };
  _sessions: {
    [id: string]: SipSessionType;
  };
  registrationCompleted: boolean;
  registering: boolean;
  transport: UserAgent['transport'] & {
    ReconnectionAttempts: number;
    attemptingReconnection: boolean;
  };
  BlfSubs: any[];
  lastVoicemailCount: number;
  selfSub: Subscriber | null;
  voicemailSub: Subscriber | null;
}
export interface SipProviderProps {
  children: React.ReactNode;
  config: SipConfig; // Config options for SIP.js UserAgent
}

export interface SipConfig {
  // SIP User Credentials
  username: string;
  password: string;

  // SIP Domain and Transport Settings
  domain: string; // Example: "sip.example.com"

  // WebSocket Configuration
  wssServer: string; // WebSocket server address (e.g., "sip.example.com")
  webSocketPort: string; // WebSocket port (e.g., "5060")
  serverPath: string; // Path to the WebSocket server (e.g., "/ws")

  // Optional settings for transport and connection timeouts
  transportConnectionTimeout?: number; // Timeout for transport connection
  TransportReconnectionAttempts?: number; // Number of reconnection attempts

  // Registration and Session Management
  RegisterExpires?: number; // Expiration time for SIP registration in seconds (default 3600)
  RegisterExtraHeaders?: string; // Extra headers for registration (e.g., JSON string)
  RegisterExtraContactParams?: string; // Extra contact parameters for registration (e.g., JSON string)

  // Audio/Video Settings
  EnableVideoCalling?: boolean; // Whether video calls are enabled (default false)

  // Call Features
  AutoAnswerEnabled?: boolean; // Whether auto-answer is enabled (default false)
  CallWaitingEnabled?: boolean; // Whether call waiting is enabled (default true)

  // Do Not Disturb and Subscription Settings
  DoNotDisturbEnabled?: boolean; // Whether Do Not Disturb is enabled
  DoNotDisturbPolicy?: 'enabled' | 'disabled'; // DND policy (e.g., reject calls or allow during DND)
  EnableSubscribe?: boolean; // Whether presence subscription is enabled (e.g., BLF)

  // Other Settings
  AutoDeleteDefault?: boolean; // Default auto-delete behavior for buddies (default false)
}

export interface SipContextType extends Omit<UseCallActionReturnType, 'ReceiveCall'> {}

export type CallbackFunction<T> = (value?: T) => void;
