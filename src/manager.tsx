import { SipAccountConfig, SipConfigs } from './configs/types';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
  reconnectTransport,
} from './events/transport';
import { GetDevicesType } from './hooks/useGetMediaDevices';
import { SipStoreStateType } from './store/types';
import { SipUserAgent } from './types';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';

/**
 * Singleton SIP Manager
 */
export class SipManager {
  private ua?: SipUserAgent;
  private configs!: SipConfigs;
  private username!: SipAccountConfig['username'];
  private receiveSession!: any;
  private getDevices!: (username: SipAccountConfig['username']) => Promise<GetDevicesType>;
  private setSipStore!: SipStoreStateType['setSipStore'];
  private setConfig!: SipStoreStateType['setConfig'];
  private setUserAgent!: SipStoreStateType['setUserAgent'];

  constructor({
    configs,
    receiveSession,
    getDevices,
    setSipStore,
    setUserAgent,
    setConfig,
  }: {
    configs: SipConfigs;
    receiveSession: any;
    getDevices: (username: string) => Promise<any>;
    setSipStore: SipStoreStateType['setSipStore'];
    setUserAgent: SipStoreStateType['setUserAgent'];
    setConfig: SipStoreStateType['setConfig'];
  }) {
    this.configs = configs;
    this.username = configs.account.username;
    this.receiveSession = receiveSession;
    this.getDevices = getDevices;
    this.setSipStore = setSipStore;
    this.setConfig = setConfig;
    this.setUserAgent = setUserAgent;

    this.setConfig(this.username, configs);
    this.init();
  }

  public initialize({
    configs,
    receiveSession,
    getDevices,
    setSipStore,
    setUserAgent,
    setConfig,
  }: {
    configs: SipConfigs;
    receiveSession: any;
    getDevices: (username: SipAccountConfig['username']) => Promise<any>;
    setSipStore: SipStoreStateType['setSipStore'];
    setUserAgent: SipStoreStateType['setUserAgent'];
    setConfig: SipStoreStateType['setConfig'];
  }) {
    this.configs = configs;
    this.username = configs.account.username;
    this.receiveSession = receiveSession;
    this.getDevices = getDevices;
    this.setSipStore = setSipStore;
    this.setConfig = setConfig;
    this.setUserAgent = setUserAgent;
    this.setConfig(this.username, configs);
    this.init();
  }

  private init() {
    this.detectDevices();
    this.createUserAgent();
  }

  private async detectDevices() {
    const devices = await this.getDevices(this.username);
    this.setSipStore({ devicesInfo: devices });
  }

  private async createUserAgent() {
    console.log({
      domain: `sip:${this.username}@${this.configs.account.domain}`,
      server: `wss://${this.configs.account.wssServer}:${this.configs.account.webSocketPort}${this.configs.account.serverPath}`,
    });
    const ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${this.username}@${this.configs.account.domain}`),
      transportOptions: {
        server: `wss://${this.configs.account.wssServer}:${this.configs.account.webSocketPort}${this.configs.account.serverPath}`,
        traceSip: false,
        connectionTimeout: this.configs.registration.transportConnectionTimeout,
      },
      authorizationUsername: this.username,
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
    ua.transport.onConnect = () => onTransportConnected(this.username, ua);
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) onTransportConnectError(error, this.username, ua);
      else onTransportDisconnected(this.username, ua);
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
          onRegistered(this.username, ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(this.username, ua);
          break;
      }
    });

    await ua.start().catch((err) => onTransportConnectError(err, this.username));
    this.ua = ua;
    this.setUserAgent(this.username, ua);
    console.log(`SIP UserAgent created ${this.username}`, ua);
  }

  public stop() {
    this.ua?.stop();
  }
}
