import { SipConfigs } from './configs/types';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
  reconnectTransport,
} from './events/transport';
import { GetDevicesType } from './hooks/useGetMediaDevices';
import { getMediaPermissions } from './methods/initialization';
import { SipUserAgent } from './types';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';

/**
 * Singleton SIP Manager
 */
export class SipManager {
  private static instance: SipManager;
  private ua?: SipUserAgent;
  private configs!: SipConfigs;
  private receiveSession!: any;
  private getDevices!: () => Promise<GetDevicesType>;
  private setSipStore!: (state: any) => void;

  private constructor() {}

  public static getInstance(): SipManager {
    console.log('getInstance', SipManager.instance);
    if (!SipManager.instance) {
      SipManager.instance = new SipManager();
    }
    return SipManager.instance;
  }

  public initialize({
    configs,
    receiveSession,
    getDevices,
    setSipStore,
  }: {
    configs: SipConfigs;
    receiveSession: any;
    getDevices: () => Promise<any>;
    setSipStore: (state: any) => void;
  }) {
    this.configs = configs;
    this.receiveSession = receiveSession;
    this.getDevices = getDevices;
    this.setSipStore = setSipStore;

    this.setSipStore({ configs: this.configs });
    this.init();
  }

  private async init() {
    await getMediaPermissions('audio');
    await this.detectDevices();
    await this.createUserAgent();
  }

  private async detectDevices() {
    const devices = await this.getDevices();
    this.setSipStore({ devicesInfo: devices });
  }

  private async createUserAgent() {
    const ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${this.configs.account.username}@${this.configs.account.domain}`),
      transportOptions: {
        server: `wss://${this.configs.account.wssServer}:${this.configs.account.webSocketPort}${this.configs.account.serverPath}`,
        traceSip: false,
        connectionTimeout: this.configs.registration.transportConnectionTimeout,
      },
      authorizationUsername: this.configs.account.username,
      authorizationPassword: this.configs.account.password,
      delegate: {
        onInvite: this.receiveSession,
        onMessage: () => console.log('Received message'),
      } as UserAgentDelegate,
    }) as SipUserAgent;

    // Custom properties
    ua.isRegistered = () =>
      ua && ua.registerer && ua.registerer.state === RegistererState.Registered;
    ua.sessions = ua._sessions;
    ua.registrationCompleted = false;
    ua.registering = false;
    ua.transport.reconnectionAttempts =
      this.configs.registration.transportReconnectionAttempts || 0;
    ua.transport.attemptingReconnection = false;
    ua.BlfSubs = [];
    ua.lastVoicemailCount = 0;

    // Transport events
    ua.transport.onConnect = () => onTransportConnected(ua);
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) onTransportConnectError(error, ua);
      else onTransportDisconnected(ua);
    };

    // Registerer
    ua.registerer = new Registerer(ua, {
      logConfiguration: false,
      expires: this.configs.registration.registerExpires,
      extraHeaders: [],
      extraContactHeaderParams: [],
      refreshFrequency: 75,
    });

    ua.registerer.stateChange.addListener((newState) => {
      console.log('User Agent Registration State:', newState);
      switch (newState) {
        case RegistererState.Registered:
          onRegistered(ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(ua);
          break;
      }
    });

    await ua.start().catch(onTransportConnectError);
    this.ua = ua;
    this.setSipStore({ userAgent: ua });
    console.log('SIP UserAgent created', ua);
  }

  public getStatus() {
    return this.ua?.isConnected() ? 'connected' : 'disconnected';
  }

  public getLines() {
    return this.ua?.sessions || [];
  }

  public reconnectTransport() {
    reconnectTransport();
  }

  public stop() {
    this.ua?.stop();
  }
}
