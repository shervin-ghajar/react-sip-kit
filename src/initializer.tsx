import { SipAccountConfig, SipConfigs } from './configs/types';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
} from './events/transport';
import { sessionMethods } from './methods/session';
import { getSipStore } from './store';
import { SipUserAgent } from './types';
import { getMediaDevices } from './utils';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';

export class SipInitializer {
  private ua?: SipUserAgent;
  private configs: SipConfigs;
  private username: SipAccountConfig['username'];
  private configKey: string;

  constructor(configs: SipConfigs, key: string) {
    this.configs = configs;
    this.username = configs.account.username;
    this.configKey = key;
    // write configs to store
    getSipStore().setConfig(this.configKey, configs);
  }

  public async init() {
    await this.detectDevices();
    await this.createUserAgent();
  }

  private async detectDevices() {
    const devices = await getMediaDevices(this.configKey);
    getSipStore().setSipStore({ devicesInfo: devices });
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
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          bundlePolicy: 'balanced',
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        },
        iceGatheringTimeout: 500,
      }, // TODO better to be configurable
      authorizationUsername: this.username,
      authorizationPassword: this.configs.account.password,
      hackIpInContact: true, // TODO better to be configurable
      contactParams: {},
      delegate: {
        onInvite: sessionMethods({ configKey: this.configKey }).receiveSession as any,
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
    ua.transport.onConnect = () => onTransportConnected(this.configKey, ua);
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) onTransportConnectError(error, this.configKey, ua);
      else onTransportDisconnected(this.configKey, ua);
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
      console.log(`UserAgent ${this.username} registration:`, newState);
      switch (newState) {
        case RegistererState.Registered:
          onRegistered(this.configKey, ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(this.configKey, ua);
          break;
      }
    });

    await ua.start().catch((err) => onTransportConnectError(err, this.configKey));
    this.ua = ua;

    // save to store
    getSipStore().setUserAgent(this.configKey, ua);
    console.log(`✅ SIP UserAgent created for ${this.configKey}`, ua);
  }

  public getUserAgent() {
    return this.ua;
  }

  public async stop() {
    if (this.ua) {
      await this.ua.stop();
      console.log(`🛑 SIP UserAgent stopped for ${this.configKey}`);
    }
  }
}
